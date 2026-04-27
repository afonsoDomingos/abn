import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';

// Public endpoint for marketplace
export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({ status: 'ativo' }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar serviços.' }, { status: 500 });
  }
}
