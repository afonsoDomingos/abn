import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ServiceRequest from '@/models/ServiceRequest';

export const dynamic = 'force-dynamic';

// GET — List all service requests
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filter = status && status !== 'all' ? { status } : {};
    const requests = await ServiceRequest.find(filter).sort({ createdAt: -1 });

    const counts = {
      total: await ServiceRequest.countDocuments({}),
      pendente: await ServiceRequest.countDocuments({ status: 'pendente' }),
      emAnalise: await ServiceRequest.countDocuments({ status: 'em análise' }),
      aprovado: await ServiceRequest.countDocuments({ status: 'aprovado' }),
      rejeitado: await ServiceRequest.countDocuments({ status: 'rejeitado' }),
    };

    return NextResponse.json({ success: true, requests, counts });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar solicitações.' }, { status: 500 });
  }
}

// PATCH — Update status and notes
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { id, status, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }

    const update: any = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;

    const req = await ServiceRequest.findByIdAndUpdate(id, update, { new: true });
    if (!req) {
      return NextResponse.json({ error: 'Solicitação não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: req });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar solicitação.' }, { status: 500 });
  }
}

// DELETE — Remove a service request
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }

    await ServiceRequest.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao apagar solicitação.' }, { status: 500 });
  }
}
