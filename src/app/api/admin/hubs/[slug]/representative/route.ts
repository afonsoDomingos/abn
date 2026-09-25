import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Hub from '@/models/Hub';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

async function getAdminSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('abn_session');
  if (!sessionCookie) return null;
  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie.value));
    if (session?.role === 'admin' || session?.role === 'collaborator') {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

// GET: Obtain current representative and list of candidate users
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    await dbConnect();
    const { slug } = await context.params;
    const cleanSlug = slug.toLowerCase().trim();

    const hub = await Hub.findOne({ slug: cleanSlug });
    if (!hub) {
      return NextResponse.json({ success: false, error: 'Delegação não encontrada.' }, { status: 404 });
    }

    let currentRepresentative: any = null;
    if (hub.representativeUser) {
      const repUser = await User.findById(hub.representativeUser).select('-password');
      if (repUser) {
        currentRepresentative = {
          id: String(repUser._id),
          name: repUser.name,
          email: repUser.email,
          phone: repUser.phone || hub.representative?.phone || '',
          profileImage: repUser.profileImage || hub.representative?.image || '/default-avatar.png',
          role: repUser.role,
          title: repUser.representativeProfile?.title || hub.representative?.role || 'Representante Oficial',
          permissions: repUser.representativeProfile?.permissions || {
            canEditInfo: true,
            canManageEvents: true,
            canManageTeam: true,
            canManagePartners: true,
            canViewMembers: true
          },
          assignedAt: repUser.representativeProfile?.assignedAt
        };
      }
    }

    // Candidate users list for assignment dropdown
    const candidates = await User.find({})
      .select('name email role profileImage country company')
      .sort({ name: 1 })
      .limit(300);

    return NextResponse.json({
      success: true,
      hub: {
        name: hub.name,
        slug: hub.slug,
        address: hub.address,
        image: hub.image,
        representative: hub.representative
      },
      currentRepresentative,
      candidates: candidates.map(c => ({
        id: String(c._id),
        name: c.name,
        email: c.email,
        role: c.role,
        country: c.country,
        profileImage: c.profileImage
      }))
    });
  } catch (err: any) {
    console.error('Error fetching hub representative:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Assign existing user or create a new user as representative
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    await dbConnect();
    const { slug } = await context.params;
    const cleanSlug = slug.toLowerCase().trim();

    const hub = await Hub.findOne({ slug: cleanSlug });
    if (!hub) {
      return NextResponse.json({ success: false, error: 'Delegação não encontrada.' }, { status: 404 });
    }

    const body = await request.json();
    const {
      userId,
      newUser,
      title = 'Representante Oficial',
      permissions = {
        canEditInfo: true,
        canManageEvents: true,
        canManageTeam: true,
        canManagePartners: true,
        canViewMembers: true
      },
      phone,
      image
    } = body;

    let targetUser: any = null;

    if (newUser && newUser.email) {
      // Create a brand new user
      const existing = await User.findOne({ email: newUser.email.toLowerCase().trim() });
      if (existing) {
        return NextResponse.json({ success: false, error: 'Já existe um utilizador com este email.' }, { status: 400 });
      }

      if (!newUser.password || newUser.password.length < 6) {
        return NextResponse.json({ success: false, error: 'A palavra-passe deve ter pelo menos 6 caracteres.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      targetUser = await User.create({
        name: newUser.name,
        email: newUser.email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone || newUser.phone || '',
        role: 'representative',
        roles: ['representative', 'empreendedor'],
        profileImage: image || newUser.image || '/default-avatar.png',
        representativeProfile: {
          hubSlug: cleanSlug,
          title: title || `Representante da Delegação - ${hub.name}`,
          permissions: {
            canEditInfo: permissions.canEditInfo ?? true,
            canManageEvents: permissions.canManageEvents ?? true,
            canManageTeam: permissions.canManageTeam ?? true,
            canManagePartners: permissions.canManagePartners ?? true,
            canViewMembers: permissions.canViewMembers ?? true
          },
          assignedAt: new Date(),
          assignedBy: admin.id
        }
      });
    } else if (userId) {
      // Assign existing user
      targetUser = await User.findById(userId);
      if (!targetUser) {
        return NextResponse.json({ success: false, error: 'Utilizador selecionado não encontrado.' }, { status: 404 });
      }

      // Add 'representative' to roles if not present
      const currentRoles = Array.isArray(targetUser.roles) ? targetUser.roles : [targetUser.role || 'empreendedor'];
      if (!currentRoles.includes('representative')) {
        currentRoles.push('representative');
      }

      targetUser.role = 'representative';
      targetUser.roles = currentRoles;
      if (phone) targetUser.phone = phone;
      if (image) targetUser.profileImage = image;

      targetUser.representativeProfile = {
        hubSlug: cleanSlug,
        title: title || `Representante da Delegação - ${hub.name}`,
        permissions: {
          canEditInfo: permissions.canEditInfo ?? true,
          canManageEvents: permissions.canManageEvents ?? true,
          canManageTeam: permissions.canManageTeam ?? true,
          canManagePartners: permissions.canManagePartners ?? true,
          canViewMembers: permissions.canViewMembers ?? true
        },
        assignedAt: new Date(),
        assignedBy: admin.id
      };

      await targetUser.save();
    } else {
      return NextResponse.json({ success: false, error: 'Selecione um utilizador ou preencha os dados do novo representante.' }, { status: 400 });
    }

    // Link in Hub and synchronize representative subdocument
    hub.representativeUser = targetUser._id;
    hub.representative = {
      name: targetUser.name,
      role: title || `Representante - ${hub.name}`,
      email: targetUser.email,
      phone: phone || targetUser.phone || hub.phone || '',
      image: image || targetUser.profileImage || '/default-avatar.png'
    };
    await hub.save();

    return NextResponse.json({
      success: true,
      message: `Representante atribuído com sucesso à Delegação de ${hub.name}!`,
      representative: {
        id: String(targetUser._id),
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        profileImage: targetUser.profileImage,
        title: targetUser.representativeProfile.title,
        permissions: targetUser.representativeProfile.permissions
      }
    });
  } catch (err: any) {
    console.error('Error assigning representative:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove representative assignment from this hub
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    await dbConnect();
    const { slug } = await context.params;
    const cleanSlug = slug.toLowerCase().trim();

    const hub = await Hub.findOne({ slug: cleanSlug });
    if (!hub) {
      return NextResponse.json({ success: false, error: 'Delegação não encontrada.' }, { status: 404 });
    }

    if (hub.representativeUser) {
      const user = await User.findById(hub.representativeUser);
      if (user) {
        // Revert user role back to 'empreendedor' if it was 'representative'
        if (user.role === 'representative') {
          user.role = 'empreendedor';
        }
        if (Array.isArray(user.roles)) {
          user.roles = user.roles.filter((r: string) => r !== 'representative');
          if (user.roles.length === 0) user.roles = ['empreendedor'];
        }
        if (user.representativeProfile) {
          user.representativeProfile.hubSlug = '';
        }
        await user.save();
      }
    }

    // Clear representative references in Hub
    hub.representativeUser = undefined;
    hub.representative = {
      name: '',
      role: '',
      email: '',
      phone: '',
      image: '/default-avatar.png'
    };
    await hub.save();

    return NextResponse.json({
      success: true,
      message: `Representante removido da Delegação de ${hub.name}.`
    });
  } catch (err: any) {
    console.error('Error removing representative:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
