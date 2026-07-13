import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Opportunity from '@/models/Opportunity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let opportunities = await Opportunity.find({}).sort({ deadline: 1 });
    
    // Seed default opportunities if empty
    if (opportunities.length === 0) {
      opportunities = [
        {
          _id: 'opp1',
          title: 'Fundo ABN de Apoio ao Microcrédito Verde',
          amount: 'Até 15.000 USD',
          deadline: new Date('2026-10-30'),
          category: 'Fundo',
          description: 'Financiamento a fundo perdido para startups africanas focadas em economia circular, energias renováveis de pequena escala e agricultura regenerativa.',
          applyLink: 'https://afrobiznetwork.com/funding-green'
        },
        {
          _id: 'opp2',
          title: 'Bolsa Tony Elumelu Foundation 2026',
          amount: '5.000 USD + Mentoria',
          deadline: new Date('2026-08-15'),
          category: 'Bolsa',
          description: 'O principal programa de empreendedorismo em África, oferecendo capital inicial não reembolsável, formação empresarial avançada e acesso a rede de mentores.',
          applyLink: 'https://www.tonyelumelufoundation.org/'
        },
        {
          _id: 'opp3',
          title: 'Desafio Inovação Bissau Tech Hub',
          amount: '10.000 USD para o Vencedor',
          deadline: new Date('2026-09-01'),
          category: 'Concurso',
          description: 'Concurso de pitching anual destinado a premiar as melhores soluções tecnológicas de comércio eletrónico, fintech e logística móvel na Guiné-Bissau.',
          applyLink: 'https://bissautech.org/'
        }
      ];
    }

    return NextResponse.json({ success: true, opportunities });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar oportunidades.' }, { status: 500 });
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

    const { title, amount, deadline, category, description, applyLink } = await request.json();

    if (!title || !amount || !deadline || !category || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 });
    }

    const opportunity = await Opportunity.create({
      title,
      amount,
      deadline: new Date(deadline),
      category,
      description,
      applyLink
    });

    return NextResponse.json({ success: true, opportunity }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
