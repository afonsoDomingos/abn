import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar serviços.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const service = await Service.create(data);
    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar serviço.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    await Service.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Serviço removido.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao remover serviço.' }, { status: 500 });
  }
}
