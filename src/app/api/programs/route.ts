import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let programs = await Program.find({}).sort({ order: 1, createdAt: 1 });

    // Seed default programs if database is empty
    if (programs.length === 0) {
      programs = await Program.create([
        {
          title: 'ABN STARTUP 180',
          description: 'O ABN Startup 180 é o programa de incubação, desenvolvimento e aceleração de Negócios da Afrobiz Network (ABN).\n\nO programa foi concebido para apoiar empreendedores desde a fase da ideia até ao crescimento sustentável do negócio, através de formação, mentoria, networking, acompanhamento técnico e acesso a oportunidades.\n\nO ABN Startup 180 integra diferentes iniciativas que trabalham de forma articulada para fortalecer o ecossistema empreendedor.',
          publicoAlvo: '- Empreendedores com ideias de negócio;\n- Startups em fase inicial;\n- Pequenas e médias empresas;\n- Estudantes empreendedores;\n- Jovens e mulheres empreendedoras;\n- Negócios informais em processo de formalização.',
          beneficios: '',
          requisitos: '',
          investimento: '',
          processoSelecao: '',
          criteriosSelecao: '',
          phase: 'Incubação & Aceleração',
          duration: 'Contínuo',
          status: 'ativo',
          order: 0
        },
        {
          title: 'MENTALIDADE EMPREENDEDORA',
          description: 'A Mentalidade Empreendedora é uma iniciativa do ABN Startup 180 dedicada ao desenvolvimento das competências pessoais e profissionais necessárias para criar, gerir e expandir um negócio.\n\nO programa aborda temas como liderança, inovação, gestão, vendas, marketing, finanças, negociação, inteligência emocional, comunicação e desenvolvimento pessoal.',
          publicoAlvo: '',
          beneficios: '- Formação prática;\n- Certificado de participação;\n- Networking;\n- Mentoria;\n- Acesso às atividades da ABN.',
          requisitos: '- Ter idade igual ou superior a 16 anos;\n- Interesse em empreendedorismo;\n- Compromisso com a aprendizagem.',
          investimento: 'Inscrição: Gratuita\nFormação: Conforme cada edição (algumas edições poderão ser patrocinadas ou totalmente gratuitas).',
          processoSelecao: '',
          criteriosSelecao: '',
          phase: 'Desenvolvimento',
          duration: 'Por Edição',
          status: 'ativo',
          order: 1
        },
        {
          title: 'A VOZ DO EMPREENDEDOR',
          description: 'A Voz do Empreendedor é a plataforma oficial da ABN para dar visibilidade aos empreendedores, às suas histórias, produtos, serviços e impacto na sociedade.\n\nA iniciativa promove entrevistas, reportagens, podcasts, vídeos, artigos e conteúdos digitais.',
          publicoAlvo: '',
          beneficios: '- Divulgação do negócio;\n- Fortalecimento da marca;\n- Networking;\n- Maior visibilidade.',
          requisitos: '- Possuir um negócio ou projeto empreendedor;\n- Disponibilidade para entrevista ou gravação;\n- Autorizar a divulgação dos conteúdos.',
          investimento: 'Participação básica: Gratuita\nProduções especiais: Sob orçamento.',
          processoSelecao: '',
          criteriosSelecao: '',
          phase: 'Visibilidade & Media',
          duration: 'Sob Demanda',
          status: 'ativo',
          order: 2
        },
        {
          title: 'ROTA DE EMPREENDEDORES',
          description: 'A Rota de Empreendedores é uma iniciativa de aproximação da ABN aos empreendedores.\n\nAtravés de visitas técnicas, a equipa conhece negócios, identifica desafios, oportunidades e talentos para integrar o ABN Startup 180.',
          publicoAlvo: '',
          beneficios: '- Diagnóstico empresarial;\n- Identificação de oportunidades;\n- Encaminhamento para incubação;\n- Networking.',
          requisitos: '- Possuir um negócio ou iniciativa empreendedora;\n- Aceitar receber a equipa da ABN.',
          investimento: 'Visitas institucionais: Gratuito\nDiagnósticos especializados: Conforme tabela de serviços da ABN.',
          processoSelecao: '',
          criteriosSelecao: '',
          phase: 'Diagnóstico',
          duration: 'Visitas Agendadas',
          status: 'ativo',
          order: 3
        },
        {
          title: 'CLUBE DOS EMPREENDEDORES',
          description: 'O Clube dos Empreendedores é a comunidade oficial de networking da ABN.\n\nReúne empreendedores para partilha de experiências, parcerias, oportunidades de negócio, eventos exclusivos e desenvolvimento contínuo.',
          publicoAlvo: '',
          beneficios: '- Networking;\n- Eventos exclusivos;\n- Divulgação de oportunidades;\n- Acesso prioritário às iniciativas da ABN;\n- Comunidade empresarial.',
          requisitos: '- Ser empreendedor ou fundador de um negócio;\n- Respeitar o regulamento do Clube;\n- Participar nas actividades.',
          investimento: 'Plano Individual:\n- Inscrição: 500 MT\n- Mensalidade: 300 MT\n\nPlano Empresarial:\n- Sob consulta.',
          processoSelecao: '',
          criteriosSelecao: '',
          phase: 'Networking',
          duration: 'Membro Contínuo',
          status: 'ativo',
          order: 4
        },
        {
          title: 'INCUBAÇÃO ABN STARTUP 180',
          description: 'Os empreendedores selecionados terão acesso a um ecossistema completo de desenvolvimento empresarial estruturado pela Afrobiz Network.',
          publicoAlvo: '',
          beneficios: '- Diagnóstico do negócio;\n- Plano de desenvolvimento;\n- Mentoria especializada;\n- Formação contínua;\n- Networking;\n- Preparação para investimento;\n- Desenvolvimento do modelo de negócio;\n- Ligação a parceiros nacionais e internacionais;\n- Certificação.',
          requisitos: '',
          investimento: 'Gratuito para startups selecionadas.',
          processoSelecao: 'A seleção pode ocorrer através de:\n- Formulário oficial;\n- Rota de Empreendedores;\n- A Voz do Empreendedor;\n- Clube dos Empreendedores;\n- Eventos promovidos pela ABN;\n- Parceiros institucionais.',
          criteriosSelecao: '- Potencial de impacto;\n- Grau de inovação;\n- Compromisso do empreendedor;\n- Viabilidade do negócio;\n- Interesse em participar nas atividades do programa.',
          phase: 'Incubação',
          duration: '6 a 12 Meses',
          status: 'ativo',
          order: 5
        }
      ]);
    }

    return NextResponse.json({ success: true, programs });
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
    const program = await Program.create(body);

    return NextResponse.json({ success: true, program });
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
      return NextResponse.json({ error: 'ID do programa é obrigatório.' }, { status: 400 });
    }

    const program = await Program.findByIdAndUpdate(id, updateData, { new: true });

    if (!program) {
      return NextResponse.json({ error: 'Programa não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, program });
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
      return NextResponse.json({ error: 'ID do programa é obrigatório.' }, { status: 400 });
    }

    await Program.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Programa removido.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
