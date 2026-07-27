import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, name, email, password, profileImage, phone, country, city, company, sector, linkedin, bio, birthDate, gender, nationality, passportBioPage, passportPhoto, educationLevel, howHeardAboutUs } = body;
    
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

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (phone !== undefined) updateData.phone = phone;
    if (country !== undefined) updateData.country = country;
    if (city !== undefined) updateData.city = city;
    if (company !== undefined) updateData.company = company;
    if (sector !== undefined) updateData.sector = sector;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (bio !== undefined) updateData.bio = bio;
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    if (gender !== undefined) updateData.gender = gender;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (passportBioPage !== undefined) updateData.passportBioPage = passportBioPage;
    if (passportPhoto !== undefined) updateData.passportPhoto = passportPhoto;
    if (educationLevel !== undefined) updateData.educationLevel = educationLevel;
    if (howHeardAboutUs !== undefined) updateData.howHeardAboutUs = howHeardAboutUs;
    
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
      user: user.toObject()
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

export async function GET(request: Request) {
  try {
    await dbConnect();
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

    const user = await User.findById(session.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao carregar perfil.' }, { status: 500 });
  }
}
