import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Verificar se o utilizador está autenticado
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ accepted: false, userFound: false }, { status: 200 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ accepted: false, userFound: false }, { status: 200 });
    }

    return NextResponse.json({
      accepted: user.lojaTermsAccepted?.accepted || false,
      acceptedAt: user.lojaTermsAccepted?.acceptedAt || null,
      acceptedVersion: user.lojaTermsAccepted?.acceptedVersion || null,
      userFound: true
    });
  } catch (error) {
    console.error('Erro ao verificar aceitação de termos:', error);
    return NextResponse.json({ accepted: false, userFound: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Utilizador não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { accepted, version = '1.0' } = body;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    }

    // Actualizar estado de aceitação
    user.lojaTermsAccepted = {
      accepted: accepted,
      acceptedAt: accepted ? new Date() : null,
      acceptedVersion: accepted ? version : null
    };

    await user.save();

    return NextResponse.json({
      success: true,
      accepted: user.lojaTermsAccepted.accepted,
      acceptedAt: user.lojaTermsAccepted.acceptedAt,
      acceptedVersion: user.lojaTermsAccepted.acceptedVersion
    });
  } catch (error) {
    console.error('Erro ao actualizar aceitação de termos:', error);
    return NextResponse.json({ error: 'Erro ao actualizar aceitação de termos' }, { status: 500 });
  }
}
