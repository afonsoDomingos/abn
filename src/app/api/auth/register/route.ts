import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password, role } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 400 });
    }

    // Create user (Note: password should be hashed in production)
    const user = await User.create({
      name,
      email,
      password, // Plain text for now, should use bcrypt
      role,
    });

    return NextResponse.json({ success: true, user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Erro ao registar usuário', details: error.message }, { status: 500 });
  }
}
