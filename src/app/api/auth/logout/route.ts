import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sessão terminada.' });

  // Limpar o cookie de sessão
  response.cookies.set('abn_session', '', {
    httpOnly: false,
    maxAge: 0,
    path: '/',
  });

  return response;
}
