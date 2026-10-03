import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';

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

    // Here you would save the inscription to a database
    // For now, we'll just return success
    // TODO: Create a ProgramInscription model and save the data

    console.log('Inscrição recebida:', {
      programId: id,
      programTitle: program.title,
      ...body
    });

    return NextResponse.json({ success: true, message: 'Inscrição submetida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao processar inscrição:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
