import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';
import InscricaoClube from '@/models/InscricaoClube';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await dbConnect();

    // Verify program exists
    const program = await Program.findById(id);
    if (!program) {
      return NextResponse.json({ success: false, error: 'Programa não encontrado' }, { status: 404 });
    }

    // Map form data to InscricaoClube model
    const inscricaoData = {
      nomeCompleto: body.nome,
      email: body.email,
      telefone: body.telefone,
      nomeNegocio: body.nomeNegocio,
      sector: body.setor ? [body.setor] : [],
      nivelAdesao: body.nivelAdesao || 'Geral',
      formaPagamento: body.metodoPagamento,
      comprovativoUrl: body.comprovativo,
      comoConheceu: body.origem,
      origem: 'programas',
      respostasPersonalizadas: body.respostasPersonalizadas || {},
      // Add program info to personalized responses
      programId: id,
      programTitle: program.title,
      status: 'pendente'
    };

    // Save inscription using InscricaoClube model
    const inscricao = await InscricaoClube.create(inscricaoData);

    console.log('Inscrição recebida:', inscricao);

    return NextResponse.json({ success: true, inscricao, message: 'Inscrição submetida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao processar inscrição:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
