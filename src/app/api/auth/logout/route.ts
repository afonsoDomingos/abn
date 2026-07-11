import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sessão terminada.' });

  // Limpar o cookie de sessão de forma explícita
  response.cookies.delete('abn_session');

  return response;
}
