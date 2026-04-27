import { NextResponse } from 'next/server';
import { seedAdmin } from '@/lib/seed';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  // Proteção: Só executa se a chave for correta
  if (key !== process.env.SEED_TOKEN && key !== 'abn_secret_2024') {
    return NextResponse.json({ error: 'Não autorizado. Chave de acesso inválida.' }, { status: 401 });
  }

  try {
    await seedAdmin();
    return NextResponse.json({ success: true, message: 'Processo de seed concluído com segurança.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
