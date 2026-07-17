import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, name, email, password, profileImage } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
    }

    if (session.id !== id && session.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas o próprio usuário ou administradores podem alterar este perfil.' }, { status: 403 });
    }

    const updateData: any = { 
      name, 
      email: email.toLowerCase(),
      profileImage: profileImage || undefined
    };
    
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    const userData = { 
      id: String(user._id), 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      profileImage: user.profileImage 
    };

    const response = NextResponse.json({ 
      success: true, 
      user: userData 
    });

    response.cookies.set('abn_session', encodeURIComponent(JSON.stringify(userData)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar perfil.' }, { status: 500 });
  }
}
