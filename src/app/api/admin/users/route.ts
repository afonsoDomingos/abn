import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar usuários.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Usuário removido.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao remover usuário.' }, { status: 500 });
  }
}
