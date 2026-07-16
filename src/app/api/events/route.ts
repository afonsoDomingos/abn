import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let events = await Event.find({}).sort({ date: 1, createdAt: 1 });

    // Seed default events if database is empty
    if (events.length === 0) {
      events = await Event.create([
        {
          title: 'Summit ABN 2026 - Conectando África',
          description: 'O maior evento anual de inovação e aceleração de negócios da Afrobiz Network, reunindo investidores globais, startups de impacto e decisores políticos em uma jornada repleta de painéis inspiradores, sessões de pitch e oportunidades de networking incomparáveis.',
          date: '2026-11-20',
          location: 'Maputo, Moçambique',
          type: 'upcoming',
          category: 'Summit ABN',
          imageUrl: '/articles/gala.png',
          link: 'https://sympla.com.br'
        },
        {
          title: 'Conferência de Finanças para Startups',
          description: 'Painéis e workshops com especialistas financeiros, investidores e representantes de bancos de fomento focados em captação de investimento inicial, estruturação de propostas e compliance regulatório africano.',
          date: '2026-09-05',
          location: 'Online (Zoom)',
          type: 'upcoming',
          category: 'Conferência',
          imageUrl: '/articles/ambassador-day.png',
          link: 'https://zoom.us'
        },
        {
          title: 'Missão Empresarial ABN - África do Sul',
          description: 'Uma delegação de empreendedores moçambicanos visitará os principais polos de tecnologia e inovação em Joanesburgo e Cidade do Cabo, com foco em benchmarking e facilitação de parcerias com corporações regionais.',
          date: '2026-10-12',
          location: 'Joanesburgo, África do Sul',
          type: 'upcoming',
          category: 'Missão Empresarial',
          imageUrl: '/articles/nilza.png',
          link: ''
        },
        {
          title: 'Feira de Negócios & Exposição ABN 2025',
          description: 'Exposição anual que conectou dezenas de startups incubadas, pequenas empresas locais e corporações parceiras em rodadas dinâmicas de matchmaking empresarial e negócios diretos.',
          date: '2025-11-15',
          location: 'Maputo, Moçambique',
          type: 'past',
          category: 'Feira',
          imageUrl: '/articles/gala.png',
          link: ''
        }
      ]);
    }

    return NextResponse.json({ success: true, events });
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

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const body = await request.json();
    const event = await Event.create(body);

    return NextResponse.json({ success: true, event });
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
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do evento é obrigatório.' }, { status: 400 });
    }

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event });
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
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do evento é obrigatório.' }, { status: 400 });
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Evento removido.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
