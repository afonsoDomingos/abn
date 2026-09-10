import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import InvestmentProject from '@/models/InvestmentProject';
import Business from '@/models/Business';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// Oportunidades padrão curadas do Ecossistema ABN (caso a base de dados ainda esteja vazia ou em fase inicial)
const CURATED_ECOSYSTEM_DEALS = [
  {
    _id: 'deal-bissaupay',
    name: 'Bissau Pay & Tech',
    type: 'startup',
    category: 'Tecnologia & Fintech',
    sector: 'Fintech',
    location: 'Bissau, Guiné-Bissau',
    country: 'Guiné-Bissau',
    stage: 'Seed',
    businessModel: 'B2B & B2C Transacional',
    description: 'Gateway integrado de pagamentos móveis e interoperabilidade bancária para PMEs e comerciantes informais na África Ocidental.',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
    website: 'https://bissaupay.gw',
    owner: { name: 'Fatoumata Djaló', email: 'fatou@bissaupay.gw', phone: '+245 955 000 111' },
    fundingGoal: '$150,000',
    fundingGoalNumber: 150000,
    equityOffered: 12,
    valuation: '$1,250,000 Post-Money',
    minTicket: '$10,000',
    instrument: 'SAFE / Equity',
    growthPotential: 'Muito Alto',
    score: 89,
    traction: {
      mrr: '$12,400',
      arr: '$148,800',
      cac: '$24',
      ltv: '$420',
      runwayMonths: 14,
      burnRate: '$8,500 / mês',
      activeClients: 1420,
      churnRate: '1.2%',
      momGrowth: '+22%'
    },
    pitch: 'Transformar pagamentos diários na Guiné-Bissau e espaço UEMOA através de uma API unificada que conecta operadores de telecomunicações, bancos e comerciantes.',
    pitchDeckUrl: 'https://afrobiznetwork.com/decks/bissaupay_deck.pdf',
    dataRoom: [
      { title: 'Pitch Deck Oficial 2026', category: 'pitch_deck', size: '4.2 MB' },
      { title: 'Auditoria Financeira & DRE 2025', category: 'financeiro', size: '1.8 MB' },
      { title: 'Licença Operacional BCEAO / Finanças', category: 'legal', size: '850 KB' },
      { title: 'Modelo de Cap Table & Valuation', category: 'financeiro', size: '1.1 MB' }
    ],
    team: [
      { name: 'Fatoumata Djaló', role: 'CEO & Co-Fundadora', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
      { name: 'Amadou Camará', role: 'CTO (Ex-Orange)', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
      { name: 'Helena Silva', role: 'Head of Growth', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80' }
    ],
    market: {
      tam: '$1.8B (Mercado de Pagamentos Digitais UEMOA)',
      sam: '$320M (Guiné-Bissau, Guiné Conacri e Gâmbia)',
      som: '$45M (Penetração nos próximos 3 anos)',
      competitors: 'Operadoras Telco (Orange/MTN) focadas apenas em P2P; bancos tradicionais sem API aberta.',
      differentiators: 'Liquidação no mesmo dia, taxas 35% mais baixas e hardware de POS acessível para pequenas lojas.'
    },
    status: 'Aberto'
  },
  {
    _id: 'deal-ecosustento',
    name: 'EcoSustento Bissau',
    type: 'empresa',
    category: 'Agricultura & Ecologia',
    sector: 'AgriTech & Clima',
    location: 'Cacheu & Bissau, Guiné-Bissau',
    country: 'Guiné-Bissau',
    stage: 'Tração & Escala',
    businessModel: 'B2B Fornecimento & Exportação',
    description: 'Biorrefinaria de valorização de resíduos de caju para produção de fertilizantes orgânicos e biocombustíveis sustentáveis.',
    logo: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=150&auto=format&fit=crop&q=80',
    website: 'https://ecosustento.gw',
    owner: { name: 'Mamadu Baldé', email: 'mamadu@ecosustento.gw', phone: '+245 966 222 333' },
    fundingGoal: '$250,000',
    fundingGoalNumber: 250000,
    equityOffered: 15,
    valuation: '$1,650,000 Pre-Money',
    minTicket: '$25,000',
    instrument: 'Equity / Dívida Conversível',
    growthPotential: 'Alto',
    score: 91,
    traction: {
      mrr: '$18,500',
      arr: '$222,000',
      cac: '$180',
      ltv: '$3,800',
      runwayMonths: 18,
      burnRate: '$11,000 / mês',
      activeClients: 48,
      churnRate: '0.4%',
      momGrowth: '+15%'
    },
    pitch: 'Aproveitar mais de 200.000 toneladas de resíduos de caju desperdiçados anualmente para produzir insumos ecológicos de alta rentabilidade com contratos já fechados na Europa e África.',
    pitchDeckUrl: 'https://afrobiznetwork.com/decks/ecosustento_deck.pdf',
    dataRoom: [
      { title: 'Dossiê Técnico de Engenharia & Patente', category: 'legal', size: '5.6 MB' },
      { title: 'Contratos Comerciais de Offtake Pré-Assinados', category: 'legal', size: '2.4 MB' },
      { title: 'Demonstrações Financeiras & Projeção 5 Anos', category: 'financeiro', size: '3.1 MB' }
    ],
    team: [
      { name: 'Mamadu Baldé', role: 'Fundador & Diretor Geral', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
      { name: 'Dr. Arnaldo Mendes', role: 'Chefe Científico de Bioquímica', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80' }
    ],
    market: {
      tam: '$3.2B (Fertilizantes Orgânicos na África Subsariana)',
      sam: '$450M (Mercado Regional CPLP e CEDEAO)',
      som: '$60M (Capacidade industrial projetada da fábrica)',
      competitors: 'Fertilizantes químicos importados de alto custo sujeitos a volatilidade cambial.',
      differentiators: 'Custo de matéria-prima quase nulo, pegada de carbono negativa e incentivos fiscais governamentais.'
    },
    status: 'Aberto'
  },
  {
    _id: 'deal-mozhealth',
    name: 'KuraMoz Digital Health',
    type: 'startup',
    category: 'Saúde & Biotecnologia',
    sector: 'HealthTech',
    location: 'Maputo, Moçambique',
    country: 'Moçambique',
    stage: 'Seed',
    businessModel: 'B2B SaaS & Marketplace',
    description: 'Plataforma de telemedicina, gestão de prontuários clínicos e entrega de medicamentos essenciais em zonas periurbanas de Moçambique.',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80',
    website: 'https://kuramoz.co.mz',
    owner: { name: 'Dra. Luísa Mondlane', email: 'luisa@kuramoz.co.mz', phone: '+258 84 123 4567' },
    fundingGoal: '$120,000',
    fundingGoalNumber: 120000,
    equityOffered: 10,
    valuation: '$1,200,000 Pre-Money',
    minTicket: '$15,000',
    instrument: 'SAFE',
    growthPotential: 'Muito Alto',
    score: 87,
    traction: {
      mrr: '$9,100',
      arr: '$109,200',
      cac: '$16',
      ltv: '$310',
      runwayMonths: 12,
      burnRate: '$7,200 / mês',
      activeClients: 3200,
      churnRate: '2.1%',
      momGrowth: '+28%'
    },
    pitch: 'Democratizar o acesso a consultas especializadas e fármacos com cobertura nacional via SMS, USSD e App móvel em Moçambique.',
    pitchDeckUrl: 'https://afrobiznetwork.com/decks/kuramoz_pitch.pdf',
    dataRoom: [
      { title: 'Executive Summary KuraMoz', category: 'pitch_deck', size: '2.9 MB' },
      { title: 'Aprovação Regulatória MISAU', category: 'legal', size: '1.2 MB' }
    ],
    team: [
      { name: 'Dra. Luísa Mondlane', role: 'CEO & Fundadora', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1594824813593-3d07e6616a24?w=120&auto=format&fit=crop&q=80' },
      { name: 'Tcherno Nhaga', role: 'Head de Engenharia de Software', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' }
    ],
    market: {
      tam: '$950M (Mercado de Saúde Digital Austral)',
      sam: '$120M (Moçambique e países vizinhos)',
      som: '$22M (População conectada com smartphones)',
      competitors: 'Clínicas físicas privadas caras e longas filas em hospitais centrais.',
      differentiators: 'Protocolos adaptados a ligações 2G/3G e parcerias com farmácias locais para entrega imediata.'
    },
    status: 'Aberto'
  },
  {
    _id: 'deal-angolog',
    name: 'CargaFácil Angola',
    type: 'startup',
    category: 'Logística & Transportes',
    sector: 'Logística',
    location: 'Luanda, Angola',
    country: 'Angola',
    stage: 'Pre-Seed',
    businessModel: 'Marketplace B2B',
    description: 'Marketplace de fretes e otimização de rotas que conecta camionistas autônomos a grandes distribuidores agrícolas e de retalho em Angola.',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
    website: 'https://cargafacil.ao',
    owner: { name: 'Nelson Bernardo', email: 'nelson@cargafacil.ao', phone: '+244 923 888 999' },
    fundingGoal: '$80,000',
    fundingGoalNumber: 80000,
    equityOffered: 15,
    valuation: '$530,000 Pre-Money',
    minTicket: '$5,000',
    instrument: 'SAFE / Equity',
    growthPotential: 'Alto',
    score: 84,
    traction: {
      mrr: '$6,800',
      arr: '$81,600',
      cac: '$45',
      ltv: '$680',
      runwayMonths: 9,
      burnRate: '$5,500 / mês',
      activeClients: 210,
      churnRate: '1.8%',
      momGrowth: '+19%'
    },
    pitch: 'Eliminar o retorno com camiões vazios nas rotas Luanda-Huambo-Benguela, reduzindo custos de transporte em 30%.',
    pitchDeckUrl: 'https://afrobiznetwork.com/decks/cargafacil_deck.pdf',
    dataRoom: [
      { title: 'Deck de Apresentação CargaFácil', category: 'pitch_deck', size: '3.4 MB' },
      { title: 'Mapeamento de Rotas & Parcerias de Frota', category: 'outro', size: '1.5 MB' }
    ],
    team: [
      { name: 'Nelson Bernardo', role: 'CEO (Ex-Gestor Logístico Pumangol)', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' }
    ],
    market: {
      tam: '$1.4B (Logística Rodoviária de Cargas em Angola)',
      sam: '$300M (Corredores Comerciais Principais)',
      som: '$35M (Cargas intermediadas pela plataforma)',
      competitors: 'Agenciadores informais de carga sem rastreamento nem seguros.',
      differentiators: 'Rastreio GPS em tempo real, pagamento protegido por escrow e seguro de carga incluso.'
    },
    status: 'Aberto'
  },
  {
    _id: 'deal-solarcape',
    name: 'KabuSolar Solutions',
    type: 'empresa',
    category: 'Energia & Sustentabilidade',
    sector: 'Clean Energy & Clima',
    location: 'Praia, Cabo Verde',
    country: 'Cabo Verde',
    stage: 'Série A',
    businessModel: 'B2B / B2G & Assinatura Solar',
    description: 'Sistemas solares fotovoltaicos descentralizados sob modelo de subscrição mensal para hotelaria, dessalinização e indústrias insulares.',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80',
    website: 'https://kabusolar.cv',
    owner: { name: 'Eng. Gilson Tavares', email: 'gilson@kabusolar.cv', phone: '+238 991 4455' },
    fundingGoal: '$500,000',
    fundingGoalNumber: 500000,
    equityOffered: 14,
    valuation: '$3,500,000 Pre-Money',
    minTicket: '$50,000',
    instrument: 'Equity & Green Bonds',
    growthPotential: 'Muito Alto',
    score: 94,
    traction: {
      mrr: '$34,000',
      arr: '$408,000',
      cac: '$850',
      ltv: '$28,000',
      runwayMonths: 20,
      burnRate: '$16,000 / mês',
      activeClients: 36,
      churnRate: '0.0%',
      momGrowth: '+14%'
    },
    pitch: 'Substituir a eletricidade cara a diesel em ilhas atlânticas por energia solar distribuída com economia imediata de 40% nas faturas dos resorts e fábricas.',
    pitchDeckUrl: 'https://afrobiznetwork.com/decks/kabusolar_series_a.pdf',
    dataRoom: [
      { title: 'Plano de Negócios Série A KabuSolar', category: 'pitch_deck', size: '6.2 MB' },
      { title: 'Auditoria de Ativos & Licenciamento Energético', category: 'legal', size: '4.8 MB' },
      { title: 'Contratos PPAs de 10 Anos Assinados', category: 'legal', size: '3.9 MB' }
    ],
    team: [
      { name: 'Eng. Gilson Tavares', role: 'Diretor Geral & Fundador', linkedin: 'https://linkedin.com', avatar: 'https://images.unsplash.com/photo-1522075469756-34c49d6282ff?w=120&auto=format&fit=crop&q=80' }
    ],
    market: {
      tam: '$800M (Transição Energética em Pequenos Estados Insulares - SIDS)',
      sam: '$150M (Cabo Verde e São Tomé)',
      som: '$40M (Pipeline prioritário de clientes industriais)',
      competitors: 'Rede elétrica pública de tarifa alta e geradores fósseis poluentes.',
      differentiators: 'Contratos PPA de longo prazo, monitorização IoT de painéis e baterias de lítio de última geração.'
    },
    status: 'Aberto'
  }
];

export async function GET(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    let userId = '';
    let userRecord: any = null;
    if (sessionCookie) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie.value));
        userId = session.id || session._id || '';
        if (userId) {
          userRecord = await User.findById(userId).select('investorWatchlist investorMeetings investorPreferences');
        }
      } catch (e) {}
    }

    // 1. Procurar projetos de investimento registados na BD
    let dbProjects = await InvestmentProject.find({})
      .populate({
        path: 'business',
        populate: { path: 'owner', select: 'name email phone' }
      })
      .lean();

    // 2. Procurar também negócios com estatuto de captação ativa ou incubadas
    let dbBusinesses = await Business.find({
      $or: [
        { 'fundraising.roundStatus': 'Aberta' },
        { isIncubated: true },
        { category: { $in: ['Startup', 'Tecnologia', 'Inovação', 'PME'] } }
      ]
    })
    .populate('owner', 'name email phone')
    .limit(20)
    .lean();

    // Consolidar negócios da BD para o formato DealOpportunity
    const dynamicDeals: any[] = [];

    for (const b of dbBusinesses) {
      // Ignorar se já estiver no dbProjects
      const isAlreadyProject = dbProjects.some(p => p.business && String((p.business as any)._id) === String(b._id));
      if (isAlreadyProject) continue;

      const fGoal = b.fundraising?.seekingAmount || '$75,000';
      const cleanNum = parseInt(fGoal.replace(/[^0-9]/g, ''), 10) || 75000;

      dynamicDeals.push({
        _id: String(b._id),
        name: b.name,
        type: b.category?.toLowerCase().includes('pme') || b.category?.toLowerCase().includes('empresa') ? 'empresa' : 'startup',
        category: b.category || 'Inovação',
        sector: b.startupProfile?.sector || b.empresaProfile?.sector || 'Tecnologia',
        location: b.location || 'África Lusófona',
        country: b.empresaProfile?.markets?.[0] || 'Moçambique',
        stage: b.startupProfile?.stage || b.incubationPhase || 'MVP',
        businessModel: b.startupProfile?.businessModel || 'B2B',
        description: b.description || 'Negócio incubado no ABN Hub à procura de investimento para expansão de mercado.',
        logo: b.logo || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
        website: b.website || '',
        owner: {
          name: (b.owner as any)?.name || 'Fundador ABN',
          email: (b.owner as any)?.email || '',
          phone: (b.owner as any)?.phone || ''
        },
        fundingGoal: fGoal,
        fundingGoalNumber: cleanNum,
        equityOffered: 15,
        valuation: b.fundraising?.valuation || '$800,000 Pre-Money',
        minTicket: '$5,000',
        instrument: 'SAFE / Equity',
        growthPotential: (b.startupScore?.growthPotential || 85) > 85 ? 'Muito Alto' : 'Alto',
        score: b.startupScore?.total || 85,
        traction: {
          mrr: b.traction?.mrr || '$3,500',
          arr: b.traction?.arr || '$42,000',
          cac: b.traction?.cac || '$25',
          ltv: b.traction?.ltv || '$350',
          runwayMonths: b.traction?.runwayMonths || 12,
          burnRate: b.traction?.burnRate || '$3,000 / mês',
          activeClients: b.traction?.activeClients || 45,
          churnRate: b.traction?.churnRate || '2%',
          momGrowth: b.traction?.momGrowth || '+15%'
        },
        pitch: b.fundraising?.elevatorPitch || b.description || 'Negócio inovador com tração comprovada no ecossistema ABN.',
        pitchDeckUrl: b.fundraising?.pitchDeckUrl || '',
        dataRoom: b.fundraising?.dataRoom || [],
        team: b.team || [],
        market: {
          tam: b.startupProfile?.tam || 'Mercado Regional em Aceleração',
          sam: b.startupProfile?.sam || 'Segmento Local Acessível',
          som: b.startupProfile?.som || 'Penetração Objetivo nos Próximos 24 Meses',
          competitors: b.startupProfile?.competitors || 'Concorrência informal e agentes tradicionais',
          differentiators: b.startupProfile?.differentiators || 'Tecnologia própria, know-how local e mentoria ABN Hub'
        },
        status: b.fundraising?.roundStatus || 'Aberto'
      });
    }

    // Unir os curados da plataforma com quaisquer projetos existentes
    const allDeals = [...CURATED_ECOSYSTEM_DEALS, ...dynamicDeals];

    // Formatar watchlist do utilizador
    const watchlist = userRecord?.investorWatchlist || [];
    const meetings = userRecord?.investorMeetings || [];
    const preferences = userRecord?.investorPreferences || {
      investorType: 'Angel',
      ticketMin: '$5,000',
      ticketMax: '$100,000',
      preferredSectors: ['Fintech', 'AgriTech', 'HealthTech', 'Logística'],
      targetCountries: ['Moçambique', 'Guiné-Bissau', 'Angola', 'Cabo Verde']
    };

    // Estatísticas agregadas do mercado
    const stats = {
      totalDeals: allDeals.length,
      activeStartups: allDeals.filter(d => d.type === 'startup').length,
      activeEmpresas: allDeals.filter(d => d.type === 'empresa').length,
      totalVolumeSeeking: allDeals.reduce((sum, d) => sum + (d.fundingGoalNumber || 0), 0),
      avgTicket: '$25,000',
      sectorsCount: Array.from(new Set(allDeals.map(d => d.sector))).length,
      countriesCount: Array.from(new Set(allDeals.map(d => d.country))).length,
      watchlistCount: watchlist.length,
      meetingsCount: meetings.filter((m: any) => m.status === 'agendada').length
    };

    return NextResponse.json({
      success: true,
      deals: allDeals,
      watchlist,
      meetings,
      preferences,
      stats
    });
  } catch (error: any) {
    console.error('Erro na rota GET /api/investments:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados do portal do investidor.' }, { status: 500 });
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

    let session: any;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // ── AÇÃO 1: Adicionar ou Remover da Watchlist (Toggle) ──
    if (action === 'toggle_watchlist') {
      const { businessId, notes } = body;
      if (!businessId) {
        return NextResponse.json({ error: 'ID do negócio não fornecido.' }, { status: 400 });
      }

      const user = await User.findById(session.id);
      if (!user) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

      const existingIndex = user.investorWatchlist.findIndex((w: any) => w.businessId === businessId);
      let isSaved = false;

      if (existingIndex > -1) {
        user.investorWatchlist.splice(existingIndex, 1);
        isSaved = false;
      } else {
        user.investorWatchlist.push({
          businessId,
          notes: notes || '',
          rating: 5,
          addedAt: new Date()
        });
        isSaved = true;
      }

      await user.save();
      return NextResponse.json({
        success: true,
        isSaved,
        watchlist: user.investorWatchlist,
        message: isSaved ? 'Adicionado à sua Watchlist de Investidor!' : 'Removido da sua Watchlist.'
      });
    }

    // ── AÇÃO 2: Atualizar Notas Privadas da Watchlist ──
    if (action === 'update_notes') {
      const { businessId, notes, rating } = body;
      const user = await User.findById(session.id);
      if (!user) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

      const item = user.investorWatchlist.find((w: any) => w.businessId === businessId);
      if (item) {
        if (notes !== undefined) item.notes = notes;
        if (rating !== undefined) item.rating = rating;
      } else {
        user.investorWatchlist.push({ businessId, notes: notes || '', rating: rating || 5, addedAt: new Date() });
      }

      await user.save();
      return NextResponse.json({ success: true, watchlist: user.investorWatchlist, message: 'Notas salvas com sucesso.' });
    }

    // ── AÇÃO 3: Agendar Reunião de Due Diligence / Pitch Call ──
    if (action === 'schedule_meeting') {
      const { businessId, businessName, founderName, date, time, topic, notes } = body;
      if (!businessId || !businessName || !date || !time) {
        return NextResponse.json({ error: 'Dados incompletos para agendamento de reunião.' }, { status: 400 });
      }

      const user = await User.findById(session.id);
      if (!user) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

      const newMeeting = {
        businessId,
        businessName,
        founderName: founderName || 'Fundador',
        date,
        time,
        topic: topic || 'Due Diligence & Apresentação de Investimento',
        status: 'agendada',
        meetingLink: 'https://meet.google.com/abn-pitch-' + Math.random().toString(36).substring(2, 7),
        notes: notes || '',
        createdAt: new Date()
      };

      user.investorMeetings.push(newMeeting);
      await user.save();

      return NextResponse.json({
        success: true,
        meeting: newMeeting,
        meetings: user.investorMeetings,
        message: 'Reunião agendada com sucesso! O fundador e a equipa ABN foram notificados.'
      });
    }

    // ── AÇÃO 4: Submeter Proposta ou Manifestação de Interesse (Inquiry / Term Sheet) ──
    if (action === 'submit_inquiry' || body.inquiryMessage) {
      const { businessId, message, proposedTicket, instrument } = body;
      
      // Notificar na base caso exista InvestmentProject
      const project = await InvestmentProject.findOne({ business: businessId });
      if (project) {
        project.inquiries.push({
          investor: session.id,
          message: `[${instrument || 'Interesse de Investimento'}] Proposta de Ticket: ${proposedTicket || 'A definir'} - ${message}`,
          createdAt: new Date()
        });
        await project.save();
      }

      return NextResponse.json({
        success: true,
        message: 'Manifestação de interesse enviada com sucesso! O fundador receberá a sua comunicação confidencial.'
      });
    }

    // ── AÇÃO 5: Salvar Preferências de Tese de Investimento ──
    if (action === 'save_preferences') {
      const { investorType, ticketMin, ticketMax, preferredSectors, targetCountries } = body;
      const user = await User.findById(session.id);
      if (!user) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

      user.investorPreferences = {
        investorType: investorType || user.investorPreferences?.investorType || 'Angel',
        ticketMin: ticketMin || user.investorPreferences?.ticketMin || '$5,000',
        ticketMax: ticketMax || user.investorPreferences?.ticketMax || '$100,000',
        preferredSectors: preferredSectors || user.investorPreferences?.preferredSectors || [],
        targetCountries: targetCountries || user.investorPreferences?.targetCountries || []
      };

      await user.save();
      return NextResponse.json({ success: true, preferences: user.investorPreferences, message: 'Preferências salvas com sucesso.' });
    }

    return NextResponse.json({ error: 'Ação não reconhecida.' }, { status: 400 });
  } catch (error: any) {
    console.error('Erro na rota POST /api/investments:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar solicitação.' }, { status: 500 });
  }
}

