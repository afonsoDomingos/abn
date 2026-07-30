import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import InscricaoClube from '@/models/InscricaoClube';

export const dynamic = 'force-dynamic';

// PATCH — atualizar status ou notas de uma inscrição
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();
    await dbConnect();
    const updated = await InscricaoClube.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    if (!updated) return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
    return NextResponse.json({ success: true, inscricao: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

// DELETE — remover uma inscrição
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await context.params;
    await dbConnect();
    await InscricaoClube.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 });
  }
}
