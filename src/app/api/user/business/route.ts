import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida' }, { status: 401 });
    }

    let business = await Business.findOne({ owner: session.id });
    
    if (!business) {
      // Create a default business for the user
      business = await Business.create({
        owner: session.id,
        name: 'O Meu Projeto',
        category: 'Tecnologia',
        description: 'Breve descrição do meu modelo de negócio e impacto.',
        website: '',
        location: 'Bissau, Guiné-Bissau',
        isIncubated: true,
        incubationPhase: 'Validação'
      });
    }

    return NextResponse.json({ success: true, business });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar projeto do usuário.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida' }, { status: 401 });
    }

    const { name, category, description, website, location, incubationPhase } = await request.json();

    if (!name || !category) {
      return NextResponse.json({ error: 'Nome e categoria são obrigatórios.' }, { status: 400 });
    }

    const business = await Business.findOneAndUpdate(
      { owner: session.id },
      { name, category, description, website, location, incubationPhase },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, business });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar projeto do usuário.' }, { status: 500 });
  }
}
