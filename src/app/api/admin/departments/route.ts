import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Department from '@/models/Department';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const departments = await Department.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, departments });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar departamentos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, description, color } = await request.json();
    
    const department = await Department.create({
      name,
      description: description || '',
      color: color || '#ff6b00'
    });

    return NextResponse.json({ success: true, department });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar departamento.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, name, description, color } = await request.json();
    
    const department = await Department.findByIdAndUpdate(
      id,
      { name, description, color },
      { new: true }
    );

    return NextResponse.json({ success: true, department });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar departamento.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    await Department.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Departamento removido.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao remover departamento.' }, { status: 500 });
  }
}
