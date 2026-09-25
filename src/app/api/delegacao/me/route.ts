import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Hub from '@/models/Hub';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

async function getSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('abn_session');
  if (!sessionCookie) return null;
  try {
    return JSON.parse(decodeURIComponent(sessionCookie.value));
  } catch {
    return null;
  }
}

// GET: Load delegation for the authenticated representative
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autenticado.' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.id).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilizador não encontrado.' }, { status: 404 });
    }

    const isAdmin = user.role === 'admin' || session.role === 'admin';
    const isRep = user.role === 'representative' || (Array.isArray(user.roles) && user.roles.includes('representative'));

    if (!isAdmin && !isRep) {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas representantes de delegação.' }, { status: 403 });
    }

    // Determine hub slug: either from representative profile or query param for admin preview
    const { searchParams } = new URL(request.url);
    const querySlug = searchParams.get('slug');
    const hubSlug = (isAdmin && querySlug) ? querySlug : user.representativeProfile?.hubSlug;

    if (!hubSlug) {
      return NextResponse.json({
        success: false,
        error: 'Não se encontra associado a nenhuma delegação ativa no momento. Contacte o Administrador.'
      }, { status: 404 });
    }

    const hub = await Hub.findOne({ slug: hubSlug.toLowerCase().trim() });
    if (!hub) {
      return NextResponse.json({ success: false, error: 'Delegação não encontrada.' }, { status: 404 });
    }

    const permissions = isAdmin ? {
      canEditInfo: true,
      canManageEvents: true,
      canManageTeam: true,
      canManagePartners: true,
      canViewMembers: true
    } : (user.representativeProfile?.permissions || {
      canEditInfo: true,
      canManageEvents: true,
      canManageTeam: true,
      canManagePartners: true,
      canViewMembers: true
    });

    // Find local registered users for this country
    // Normalize search query to match both accented and non-accented country names
    const rawCountry = hub.name.split('-')[0].split('(')[0].trim();
    const countryPattern = rawCountry
      .replace(/[aáàãâäAÁÀÃÂÄ]/g, '[aáàãâä]')
      .replace(/[eéèêëEÉÈÊË]/g, '[eéèêë]')
      .replace(/[iíìîïIÍÌÎÏ]/g, '[iíìîï]')
      .replace(/[oóòõôöOÓÒÕÔÖ]/g, '[oóòõôö]')
      .replace(/[uúùûüUÚÙÛÜ]/g, '[uúùûü]')
      .replace(/[cçCÇ]/g, '[cç]');

    const localUsers = await User.find({
      $or: [
        { country: { $regex: new RegExp(countryPattern, 'i') } },
        { nationality: { $regex: new RegExp(countryPattern, 'i') } }
      ]
    }).select('name email role profileImage company sector city country phone createdAt').sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      hub,
      permissions,
      representative: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        title: user.representativeProfile?.title || `Representante - ${hub.name}`
      },
      stats: {
        totalEvents: (hub.events || []).length,
        totalTeam: (hub.team || []).length,
        totalPartners: (hub.partners || []).length,
        totalLocalMembers: localUsers.length
      },
      localMembers: permissions.canViewMembers ? localUsers : []
    });
  } catch (err: any) {
    console.error('Error loading representative delegation:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Update delegation details according to representative's permissions
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autenticado.' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilizador não encontrado.' }, { status: 404 });
    }

    const isAdmin = user.role === 'admin' || session.role === 'admin';
    const isRep = user.role === 'representative' || (Array.isArray(user.roles) && user.roles.includes('representative'));

    if (!isAdmin && !isRep) {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const querySlug = searchParams.get('slug');
    const targetSlug = (isAdmin && querySlug) ? querySlug : user.representativeProfile?.hubSlug;

    if (!targetSlug) {
      return NextResponse.json({ success: false, error: 'Delegação não identificada.' }, { status: 400 });
    }

    const hub = await Hub.findOne({ slug: targetSlug.toLowerCase().trim() });
    if (!hub) {
      return NextResponse.json({ success: false, error: 'Delegação não encontrada.' }, { status: 404 });
    }

    const permissions = isAdmin ? {
      canEditInfo: true,
      canManageEvents: true,
      canManageTeam: true,
      canManagePartners: true,
      canViewMembers: true
    } : (user.representativeProfile?.permissions || {});

    // Granular updates based on specific permissions
    // 1. Basic Info
    if (permissions.canEditInfo) {
      if (body.description !== undefined) hub.description = body.description;
      if (body.address !== undefined) hub.address = body.address;
      if (body.email !== undefined) hub.email = body.email;
      if (body.phone !== undefined) hub.phone = body.phone;
      if (body.facebookUrl !== undefined) hub.facebookUrl = body.facebookUrl;
      if (body.instagramUrl !== undefined) hub.instagramUrl = body.instagramUrl;
      if (body.linkedinUrl !== undefined) hub.linkedinUrl = body.linkedinUrl;
      if (body.youtubeUrl !== undefined) hub.youtubeUrl = body.youtubeUrl;
      if (body.steps !== undefined) hub.steps = body.steps;
      if (body.faqs !== undefined) hub.faqs = body.faqs;
    } else if (
      body.description !== undefined || body.address !== undefined || 
      body.email !== undefined || body.phone !== undefined
    ) {
      return NextResponse.json({
        success: false,
        error: 'Não tem permissão para editar as informações base da delegação.'
      }, { status: 403 });
    }

    // 2. Events & Activities
    if (body.events !== undefined) {
      if (!permissions.canManageEvents) {
        return NextResponse.json({
          success: false,
          error: 'Não tem permissão para gerir eventos e atividades da delegação.'
        }, { status: 403 });
      }
      hub.events = body.events;
    }

    // 3. Team
    if (body.team !== undefined) {
      if (!permissions.canManageTeam) {
        return NextResponse.json({
          success: false,
          error: 'Não tem permissão para gerir a equipa local da delegação.'
        }, { status: 403 });
      }
      hub.team = body.team;
    }

    // 4. Partners
    if (body.partners !== undefined) {
      if (!permissions.canManagePartners) {
        return NextResponse.json({
          success: false,
          error: 'Não tem permissão para gerir os parceiros locais da delegação.'
        }, { status: 403 });
      }
      hub.partners = body.partners;
    }

    await hub.save();

    return NextResponse.json({
      success: true,
      message: 'Delegação atualizada com sucesso!',
      hub
    });
  } catch (err: any) {
    console.error('Error updating representative delegation:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
