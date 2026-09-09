import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import User from '@/models/User';

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
      business = await Business.create({
        owner: session.id,
        name: 'Minha Startup',
        category: 'Tecnologia & Inovação',
        description: 'Startup escalável em aceleração no ecossistema ABN.',
        incubationPhase: 'MVP'
      });
    }

    // Buscar investidores disponíveis para solicitação de introduções
    const investors = await User.find({
      $or: [{ role: 'investidor' }, { roles: 'investidor' }]
    })
      .select('name company sector bio country profileImage')
      .limit(10);

    return NextResponse.json({
      success: true,
      business,
      investors
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    const body = await request.json();
    const { startupProfile, traction, fundraising, acceleration, startupScore } = body;

    const updateData: any = {};
    if (startupProfile) updateData.startupProfile = startupProfile;
    if (traction) updateData.traction = traction;
    if (fundraising) updateData.fundraising = fundraising;
    if (acceleration) updateData.acceleration = acceleration;
    if (startupScore) updateData.startupScore = startupScore;

    const business = await Business.findOneAndUpdate(
      { owner: session.id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, business });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { action, investorId, investorName } = body;

    if (action === 'request_intro') {
      if (!investorId) {
        return NextResponse.json({ error: 'ID do investidor é obrigatório.' }, { status: 400 });
      }

      const business = await Business.findOne({ owner: session.id });
      if (!business) {
        return NextResponse.json({ error: 'Perfil de startup não encontrado.' }, { status: 404 });
      }

      const currentIntros = business.fundraising?.requestedIntros || [];
      const alreadyRequested = currentIntros.some((i: any) => String(i.investorId) === String(investorId));

      if (alreadyRequested) {
        return NextResponse.json({ error: 'Já solicitou introdução a este investidor.' }, { status: 400 });
      }

      const updated = await Business.findOneAndUpdate(
        { owner: session.id },
        {
          $push: {
            'fundraising.requestedIntros': {
              investorId,
              investorName: investorName || 'Investidor ABN',
              status: 'pendente',
              requestedAt: new Date()
            }
          }
        },
        { new: true }
      );

      return NextResponse.json({ success: true, business: updated, message: 'Introdução solicitada com sucesso! A equipa da ABN fará a ponte institucional.' });
    }

    return NextResponse.json({ error: 'Ação não reconhecida.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
