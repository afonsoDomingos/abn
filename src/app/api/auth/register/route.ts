import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password, role, phone, country, city, company, sector, linkedin, bio } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A palavra-passe deve ter pelo menos 6 caracteres.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Este email já está registado.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'empreendedor',
      phone: phone || '',
      country: country || '',
      city: city || '',
      company: company || '',
      sector: sector || '',
      linkedin: linkedin || '',
      bio: bio || '',
    });

    const userData = { id: String(user._id), name: user.name, email: user.email, role: user.role };

    const response = NextResponse.json({ success: true, user: userData }, { status: 201 });

    // Auto-login após registo
    response.cookies.set('abn_session', encodeURIComponent(JSON.stringify(userData)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erro no servidor.', details: error.message }, { status: 500 });
  }
}
