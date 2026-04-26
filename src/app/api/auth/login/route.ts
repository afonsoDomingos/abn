import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Basic password check (Note: should use bcrypt.compare in production)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // In a real app, you'd set a cookie or return a JWT here
    return NextResponse.json({ 
      success: true, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro no servidor', details: error.message }, { status: 500 });
  }
}
