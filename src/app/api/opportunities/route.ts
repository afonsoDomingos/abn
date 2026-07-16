import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Opportunity from '@/models/Opportunity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let opportunities = await Opportunity.find({}).sort({ deadline: 1 });
    
    // Seed default opportunities if empty
    if (opportunities.length === 0) {
      opportunities = await Opportunity.create([
        {
          title: 'Fundo ABN de Apoio ao Microcrédito Verde',
          amount: 'Até 15.000 USD',
          deadline: new Date('2026-10-30'),
          category: 'Financiamento',
          description: 'Financiamento a fundo perdido para startups africanas focadas em economia circular, energias renováveis de pequena escala e agricultura regenerativa.',
          applyLink: 'https://afrobiznetwork.com/funding-green',
          location: 'Angola & Moçambique',
          provider: 'Afrobiz Network'
        },
        {
          title: 'Bolsa Tony Elumelu Foundation 2026',
          amount: '5.000 USD + Mentoria',
          deadline: new Date('2026-08-15'),
          category: 'Bolsa',
          description: 'O principal programa de empreendedorismo em África, oferecendo capital inicial não reembolsável, formação empresarial avançada e acesso a rede de mentores.',
          applyLink: 'https://www.tonyelumelufoundation.org/',
          location: 'Pan-Africano',
          provider: 'Tony Elumelu Foundation'
        },
        {
          title: 'Desafio Inovação Bissau Tech Hub',
          amount: '10.000 USD para o Vencedor',
          deadline: new Date('2026-09-01'),
          category: 'Concurso',
          description: 'Concurso de pitching anual destinado a premiar as melhores soluções tecnológicas de comércio eletrónico, fintech e logística móvel na Guiné-Bissau.',
          applyLink: 'https://bissautech.org/',
          location: 'Guiné-Bissau',
          provider: 'Bissau Tech Hub'
        },
        {
          title: 'Edital ABN Startup 180 - Aceleração',
          amount: 'Mentoria & Conexão VIP',
          deadline: new Date('2026-09-15'),
          category: 'Edital',
          description: 'Edital oficial para seleção de startups focadas no ecossistema local para ingresso no programa intensivo de aceleração da ABN Startup 180.',
          applyLink: 'https://afrobiznetwork.com/startup180',
          location: 'Moçambique',
          provider: 'ABN Ecosystem'
        }
      ]);
    }

    return NextResponse.json({ success: true, opportunities });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar oportunidades: ' + error.message }, { status: 500 });
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

    if (session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    const { title, amount, deadline, category, description, applyLink, location, provider } = await request.json();

    if (!title || !amount || !deadline || !category || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 });
    }

    const opportunity = await Opportunity.create({
      title,
      amount,
      deadline: new Date(deadline),
      category,
      description,
      applyLink,
      location: location || '',
      provider: provider || ''
    });

    return NextResponse.json({ success: true, opportunity }, { status: 201 });
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

    if (session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    const { id, title, amount, deadline, category, description, applyLink, location, provider } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório.' }, { status: 400 });
    }

    const updatePayload: any = {
      title,
      amount,
      category,
      description,
      applyLink,
      location,
      provider
    };

    if (deadline) {
      updatePayload.deadline = new Date(deadline);
    }

    const opportunity = await Opportunity.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, opportunity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    if (session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório.' }, { status: 400 });
    }

    await Opportunity.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Oportunidade removida.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
