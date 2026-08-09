import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';

const FALLBACK_PROGRAMS = [
  {
    _id: 'f-startups180',
    title: 'ABN STARTUP 180',
    description: 'O ABN Startup 180 é o programa de incubação, desenvolvimento e aceleração de Negócios da Afrobiz Network (ABN).\n\nO programa foi concebido para apoiar empreendedores desde a fase da ideia até ao crescimento sustentável do negócio, através de formação, mentoria, networking, acompanhamento técnico e acesso a oportunidades.\n\nO ABN Startup 180 integra diferentes iniciativas que trabalham de forma articulada para fortalecer o ecossistema empreendedor.',
    publicoAlvo: '- Empreendedores com ideias de negócio;\n- Startups em fase inicial;\n- Pequenas e médias empresas;\n- Estudantes empreendedores;\n- Jovens e mulheres empreendedoras;\n- Negócios informais em processo de formalização.',
    beneficios: '• Diagnóstico empresarial completo;\n• Mentoria estratégica mensal com peritos;\n• Acesso a rede global de investidores;\n• Preparação de pitch e plano de negócios.',
    requisitos: '• Ter uma ideia de negócio ou projeto ativo;\n• Dedicação e disponibilidade para sessões de incubação.',
    investimento: 'Gratuito para projetos selecionados no processo de curadoria.',
    processoSelecao: 'Inscrição online -> Triagem -> Entrevista de Diagnóstico -> Admissão.',
    criteriosSelecao: 'Potencial de impacto, grau de inovação, viabilidade e compromisso.',
    phase: 'Incubação & Aceleração',
    duration: 'Contínuo',
    status: 'ativo',
    order: 0
  },
  {
    _id: 'f-mentalidade',
    title: 'MENTALIDADE EMPREENDEDORA',
    description: 'A Mentalidade Empreendedora é uma iniciativa do ABN Startup 180 dedicada ao desenvolvimento das competências pessoais e profissionais necessárias para criar, gerir e expandir um negócio.\n\nO programa aborda temas como liderança, inovação, gestão, vendas, marketing, finanças, negociação, inteligência emocional, comunicação e desenvolvimento pessoal.',
    publicoAlvo: '- Empreendedores em início de carreira;\n- Gestores e líderes de equipa;\n- Estudantes e jovens profissionais.',
    beneficios: '- Formação prática com certificados;\n- Networking com líderes de mercado;\n- Acesso exclusivo a conteúdos e templates da ABN.',
    requisitos: '- Ter idade igual ou superior a 16 anos;\n- Interesse em empreendedorismo;\n- Compromisso com a aprendizagem contínua.',
    investimento: `• Startups Incubadas do ABN Startup 180+: Gratuito ou incluído na mensalidade de incubação.\n\n1. Participantes Individuais:\n- Formação Intensiva (7 dias): 8.000 MT – 18.000 MT / participante\n- Formação Completa (15 dias): 15.000 MT – 35.000 MT / participante\n- Sessão de Coaching Individual (60–90 min): 2.000 MT – 5.000 MT\n- Pacote de Coaching (6 sessões / trimestre): 10.000 MT – 25.000 MT\n- Certificação em Soft Skills / Liderança: 8.000 MT – 20.000 MT\n\n2. Empresas & Corporativo (Formação B2B - até 20 pessoas):\n- Formação Intensiva de 7 dias (In-Company): 250.000 MT – 600.000 MT (pacote)\n- Formação Completa de 15 dias (In-Company): 450.000 MT – 1.000.000 MT (pacote)\n- Contratos Trimestrais ou Anuais de Acompanhamento: Valor negociado por contrato\n\n3. Licenciamento da Metodologia:\n- Licenciamento da Metodologia (por território/ano): 3.000 USD – 10.000 USD / ano`,
    processoSelecao: 'Inscrição direta conforme abertura de turmas.',
    criteriosSelecao: 'Ordem de inscrição e perfil empreendedor.',
    phase: 'Desenvolvimento',
    duration: 'Por Edição',
    status: 'ativo',
    order: 1
  },
  {
    _id: 'f-voz',
    title: 'A VOZ DO EMPREENDEDOR',
    description: 'A Voz do Empreendedor é a plataforma oficial da ABN para dar visibilidade aos empreendedores, às suas histórias, produtos, serviços e impacto na sociedade.\n\nA iniciativa promove entrevistas, reportagens, podcasts, vídeos, artigos e conteúdos digitais.',
    publicoAlvo: '- Empreendedores e fundadores de startups;\n- PMEs com soluções inovadoras;\n- Líderes comunitários e sociais.',
    beneficios: '- Divulgação da marca e produtos na plataforma ABN;\n- Fortalecimento da autoridade no mercado;\n- Maior visibilidade junto de investidores e parceiros.',
    requisitos: '- Possuir um negócio ou projeto ativo;\n- Disponibilidade para entrevista ou gravação.',
    investimento: 'Participação básica: Gratuita (Produções dedicadas sob orçamento).',
    processoSelecao: 'Submissão de candidatura e seleção editorial.',
    criteriosSelecao: 'Impacto da história e relevância do negócio.',
    phase: 'Visibilidade & Mídia',
    duration: 'Sob Demanda',
    status: 'ativo',
    order: 2
  },
  {
    _id: 'f-rota',
    title: 'ROTA DE EMPREENDEDORES',
    description: 'A Rota de Empreendedores é uma iniciativa de aproximação da ABN aos empreendedores no terreno.\n\nAtravés de visitas técnicas institucionais, a equipa conhece os negócios localmente, identifica desafios, oportunidades e talentos para integrar o programa ABN Startup 180.',
    publicoAlvo: '- Negócios locais e PMEs nas províncias e distritos;\n- Cooperativas e associações de jovens empreendedores.',
    beneficios: '- Diagnóstico presencial no local do negócio;\n- Encaminhamento direto para programas de aceleração;\n- Conexão com a rede corporativa da ABN.',
    requisitos: '- Possuir espaço de operação ou atividade ativa;\n- Aceitar a visita da equipa técnica da ABN.',
    investimento: 'Visita institucional: Gratuita.',
    processoSelecao: 'Agendamento por itinerário e solicitação prévia.',
    criteriosSelecao: 'Localização geográfica e potencial de expansão.',
    phase: 'Diagnóstico',
    duration: 'Visitas Agendadas',
    status: 'ativo',
    order: 3
  },
  {
    _id: 'f-clube',
    title: 'CLUBE DOS EMPREENDEDORES ABN',
    description: 'O Clube dos Empreendedores é a comunidade oficial e rede estratégica de colaboração, networking e capacitação da AfroBiz Network (ABN).\n\nReúne empreendedores, inovadores, líderes e fundadores para a partilha de experiências, criação de parcerias, acesso a oportunidades de mercado e aceleração contínua de negócios em África e na Diáspora.',
    missao: 'Fomentar o ecossistema empresarial conectando empreendedores, capacitando líderes e gerando oportunidades reais de negócios, parcerias e investimento sustentável em África.',
    visao: 'Ser o maior e mais dinâmico clube de empreendedores de África, reconhecido como a principal plataforma de aceleração, cooperação empresarial e impacto socioeconómico.',
    valores: '• Colaboração & Parceria Estratégica\n• Inovação & Excelência Empresarial\n• Integridade & Ética\n• Inclusão & Empoderamento Económico\n• Impacto Social e Sustentabilidade',
    objectivos: '• Facilitar o networking de alto impacto e parcerias comerciais entre membros;\n• Promover formações executivas, workshops e mentorias especializadas;\n• Conectar startups e PMEs a investidores e novos mercados globais;\n• Dar visibilidade aos negócios dos membros na rede internacional da ABN;\n• Estimular a cultura empreendedora e o desenvolvimento económico sustentável.',
    publicoAlvo: '• Empreendedores, fundadores e co-fundadores de Startups e PMEs;\n• Jovens e mulheres empreendedoras com negócios inovadores;\n• Profissionais liberais, consultores e executivos corporativos;\n• Estudantes universitários com projetos de negócio;\n• Investidores anjo e mentores de negócios.',
    areasActuacao: '• Incubação & Aceleração de Startups;\n• Capacitação & Educação Executiva;\n• Networking & Matchmaking Comercial B2B;\n• Promoção & Visibilidade de Marcas;\n• Acesso a Financiamento & Smart Money.',
    actividades: '• Encontros mensais de networking e Pitching Sessions;\n• Masterclasses e workshops de aceleração com mentores internacionais;\n• Visitas técnicas e a Rota dos Empreendedores;\n• Rodadas de negócios (B2B Matchmaking);\n• Participação em Fóruns e Feiras Internacionais da ABN.',
    beneficiosMembros: '• Acesso a rede exclusiva de contactos e investidores;\n• Descontos e prioridade em programas, formações e eventos da ABN;\n• Presença e divulgação da empresa no Marketplace e Diretório ABN;\n• Oferta de Website + Portfólio Digital profissional com suporte;\n• Mentoria estratégica mensal e certificado de membro oficial.',
    compromissoMembros: '• Participar ativamente nos encontros, formações e eventos do Clube;\n• Cumprir o código de ética e valores fundamentais da ABN;\n• Promover a colaboração mútua e ajuda recíproca entre os membros;\n• Manter o perfil e dados do negócio atualizados na plataforma.',
    lema: '"Conectando mentes, impulsionando negócios e transformando África e o Mundo."',
    isClub: true,
    province: 'Nacional & Internacional',
    beneficios: '• Acesso a rede exclusiva de contactos e investidores;\n• Descontos e prioridade em programas, formações e eventos da ABN;\n• Presença e divulgação da empresa no Marketplace e Diretório ABN;\n• Oferta de Website + Portfólio Digital profissional com suporte;\n• Mentoria estratégica mensal e certificado de membro oficial.',
    requisitos: '• Ser fundador, sócio ou gestor de um projeto ou empresa;\n• Compromisso com o desenvolvimento empresarial e ético;\n• Preencher o formulário de adesão oficial.',
    investimento: 'Plano Membro Individual:\n• Inscrição: 500 MT\n• Quota mensal: 300 MT\n\nPlano Membro Corporativo:\n• Sob consulta com a Direcção da ABN.',
    processoSelecao: '1. Submissão do formulário de candidatura;\n2. Análise do perfil do negócio pela equipa ABN;\n3. Boas-vindas e integração no ecossistema de membros.',
    criteriosSelecao: '• Potencial de crescimento e impacto do negócio;\n• Alinhamento com os valores de colaboração da ABN;\n• Vontade ativa de networking e aprendizagem.',
    phase: 'Networking & Aceleração',
    duration: 'Membro Contínuo',
    status: 'ativo',
    order: 4
  }
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check fallbacks first if id starts with 'f-'
    if (id && id.startsWith('f-')) {
      const fallback = FALLBACK_PROGRAMS.find(p => p._id === id);
      if (fallback) {
        return NextResponse.json({ success: true, program: fallback });
      }
    }

    await dbConnect();
    
    // Try finding by MongoDB ID
    let program = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      program = await Program.findById(id);
    }

    if (!program) {
      // Search by title match if ID is a text slug
      program = await Program.findOne({
        $or: [
          { title: { $regex: new RegExp(id.replace(/-/g, ' '), 'i') } },
          { _id: id }
        ]
      });
    }

    if (!program) {
      // Fallback search across static fallback array
      const fallback = FALLBACK_PROGRAMS.find(
        p => p._id === id || p.title.toLowerCase().includes(id.toLowerCase())
      );
      if (fallback) {
        return NextResponse.json({ success: true, program: fallback });
      }
      return NextResponse.json({ success: false, error: 'Programa não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, program });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
