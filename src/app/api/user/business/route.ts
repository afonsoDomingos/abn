import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import User from '@/models/User';
import { sendProductSubmittedEmail } from '@/lib/email';

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

    const body = await request.json();
    const { 
      name, category, description, logo, website, location, incubationPhase,
      services, portfolio, productsAndServices, clients, suppliers, team, goals, documents
    } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Nome e categoria são obrigatórios.' }, { status: 400 });
    }

    const updateData: any = {
      name,
      category,
      description: description || '',
      website: website || '',
      location: location || '',
      incubationPhase: incubationPhase || 'Ideação'
    };

    if (logo !== undefined) updateData.logo = logo;
    if (services !== undefined) updateData.services = services;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (productsAndServices !== undefined) updateData.productsAndServices = productsAndServices;
    if (clients !== undefined) updateData.clients = clients;
    if (suppliers !== undefined) updateData.suppliers = suppliers;
    if (team !== undefined) updateData.team = team;
    if (goals !== undefined) updateData.goals = goals;
    if (documents !== undefined) updateData.documents = documents;

    const business = await Business.findOneAndUpdate(
      { owner: session.id },
      updateData,
      { new: true, upsert: true }
    );

    // Se houve submissão de produto com showInStore para análise, enviar e-mail de confirmação ao empreendedor
    if (productsAndServices && Array.isArray(productsAndServices)) {
      const newlyPending = productsAndServices.filter((p: any) => p.showInStore && p.storeApproval === 'pendente');
      if (newlyPending.length > 0) {
        try {
          const user = await User.findById(session.id);
          if (user && user.email) {
            const lastItem = newlyPending[newlyPending.length - 1];
            sendProductSubmittedEmail(
              user.email,
              user.name || name,
              lastItem.name,
              lastItem.price || 'Sob Consulta'
            ).catch(() => {});
          }
        } catch (e) {
          console.error('[Resend Error on Submission]', e);
        }
      }
    }

    return NextResponse.json({ success: true, business });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar projeto do usuário.' }, { status: 500 });
  }
}
