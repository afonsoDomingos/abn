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

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, name, description, price, category, status, image } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do serviço é obrigatório.' }, { status: 400 });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { name, description, price, category, status, image: image || '' },
      { new: true }
    );

    if (!service) {
      return NextResponse.json({ error: 'Serviço não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar serviço.' }, { status: 500 });
  }
}
