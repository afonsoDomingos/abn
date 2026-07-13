import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Connection from '@/models/Connection';
import Business from '@/models/Business';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida' }, { status: 401 });
    }

    // List all users except current logged-in user
    const users = await User.find({ _id: { $ne: session.id } })
      .select('name email role profileImage description')
      .sort({ createdAt: -1 });

    // Fetch follows by current user
    const follows = await Connection.find({ follower: session.id });
    const followingIds = follows.map(f => String(f.following));

    // Fetch startup info associated with these users
    const startups = await Business.find({});
    
    // Map data
    const profiles = users.map((u: any) => {
      const startup = startups.find(s => String(s.owner) === String(u._id));
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        profileImage: u.profileImage || '/default-avatar.png',
        description: u.description || '',
        isFollowing: followingIds.includes(String(u._id)),
        startupName: startup ? startup.name : null,
        startupCategory: startup ? startup.category : null
      };
    });

    return NextResponse.json({ success: true, profiles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida' }, { status: 401 });
    }

    const { followingId } = await request.json();

    if (!followingId) {
      return NextResponse.json({ error: 'ID do usuário a seguir é obrigatório.' }, { status: 400 });
    }

    if (String(session.id) === String(followingId)) {
      return NextResponse.json({ error: 'Não pode seguir o seu próprio perfil.' }, { status: 400 });
    }

    // Toggle follow/unfollow
    const existing = await Connection.findOne({ follower: session.id, following: followingId });
    
    if (existing) {
      await Connection.findByIdAndDelete(existing._id);
      return NextResponse.json({ success: true, isFollowing: false, message: 'Deixou de seguir o perfil.' });
    } else {
      await Connection.create({ follower: session.id, following: followingId });
      return NextResponse.json({ success: true, isFollowing: true, message: 'Começou a seguir o perfil!' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
