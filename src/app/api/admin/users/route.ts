import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

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

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, name, email, role } = await request.json();
    
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select('-password');

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário.' }, { status: 500 });
  }
}
