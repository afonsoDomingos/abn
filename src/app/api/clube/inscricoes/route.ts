import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import InscricaoClube from '@/models/InscricaoClube';

export const dynamic = 'force-dynamic';

// GET — listar inscrições (admin)
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = status && status !== 'todos' ? { status } : {};
    const inscricoes = await InscricaoClube.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ inscricoes });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao carregar inscrições' }, { status: 500 });
  }
}

// POST — criar inscrição (público)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nomeCompleto || !body.email || !body.nivelAdesao) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta' }, { status: 400 });
    }
    await dbConnect();
    const inscricao = await InscricaoClube.create({
      ...body,
      status: 'pendente',
    });
    return NextResponse.json({ success: true, inscricao }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao guardar inscrição' }, { status: 500 });
  }
}
