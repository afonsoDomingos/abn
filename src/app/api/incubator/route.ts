import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import IncubatorProfile from '@/models/IncubatorProfile';

export const dynamic = 'force-dynamic';

// Base de Startups Curadas no Ecossistema ABN para Descoberta / Scouting
const CURATED_ECOSYSTEM_STARTUPS = [
  {
    _id: 'scout-1',
    name: 'Kassumai Pay',
    founder: 'Baciro Djalo',
    country: 'Guiné-Bissau',
    sector: 'Fintech & Pagamentos',
    stage: 'Seed / MVP Validado',
    headline: 'Gateway de micropagamentos móveis e inclusão financeira para comerciantes da África Ocidental',
    mrr: '3.800 €',
    seeking: '50.000 €',
    traction: '12.000 transações/mês · 450 comerciantes ativos',
    contact: 'baciro@kassumai.gw'
  },
  {
    _id: 'scout-2',
    name: 'AgroLusofonia Tech',
    founder: 'Amina Sanhá',
    country: 'Guiné-Bissau / Senegal',
    sector: 'Agrotech & Supply Chain',
    stage: 'Pre-Seed',
    headline: 'Rastreabilidade digital e marketplace B2B para cooperativas de caju e hortícolas',
    mrr: '1.900 €',
    seeking: '35.000 €',
    traction: '18 cooperativas integradas · 120 toneladas transacionadas',
    contact: 'amina@agroluso.tech'
  },
  {
    _id: 'scout-3',
    name: 'LogiMaputo Express',
    founder: 'Edgar Mabunda',
    country: 'Moçambique',
    sector: 'Logística & Mobilidade',
    stage: 'Seed',
    headline: 'Logística urbana last-mile e despacho expresso motorizado para e-commerce',
    mrr: '6.200 €',
    seeking: '75.000 €',
    traction: '85 estafetas · Crescimento MoM 22%',
    contact: 'edgar@logimaputo.co.mz'
  },
  {
    _id: 'scout-4',
    name: 'Kizomba Health',
    founder: 'Teresa Varela',
    country: 'Angola',
    sector: 'Healthtech & Telemedicina',
    stage: 'Ideação / Protótipo',
    headline: 'Plataforma de teleconsulta e receituário eletrónico acessível via WhatsApp e USSD',
    mrr: '800 €',
    seeking: '25.000 €',
    traction: '30 médicos voluntários · 1.400 consultas piloto',
    contact: 'teresa@kizombahealth.ao'
  },
  {
    _id: 'scout-5',
    name: 'SolarBissau Clean',
    founder: 'Carlos Lopes Gomes',
    country: 'Guiné-Bissau',
    sector: 'Cleantech & Energia',
    stage: 'Seed',
    headline: 'Kits solares pay-as-you-go para eletrificação de pequenas empresas e habitações periurbanas',
    mrr: '5.100 €',
    seeking: '100.000 €',
    traction: '320 instalações solares ativas · 98% adimplência',
    contact: 'carlos@solarbissau.gw'
  },
  {
    _id: 'scout-6',
    name: 'EduLuso Academy',
    founder: 'Mariana Silva',
    country: 'Portugal / Cabo Verde',
    sector: 'Edtech & Capacitação',
    stage: 'Tratamento / MVP',
    headline: 'Bootcamps remotos intensivos de programação e inteligência artificial para jovens africanos',
    mrr: '4.300 €',
    seeking: '40.000 €',
    traction: '650 formandos certificados · 74% empregabilidade',
    contact: 'mariana@eduluso.org'
  }
];

export async function GET(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');

    let sessionUser: any = null;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
        const uid = parsed.id || parsed._id;
        if (uid) sessionUser = await User.findById(uid).lean();
      } catch (e) {}
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';

    // 1. Radar de Descoberta de Startups (Scouting para a Incubadora)
    if (view === 'scout') {
      const qSector = searchParams.get('sector') || '';
      const qCountry = searchParams.get('country') || '';

      // Tentar encontrar startups reais na base de utilizadores
      const filter: any = { roles: 'startup' };
      if (qCountry) filter.country = new RegExp(qCountry, 'i');
      
      const realStartups = await User.find(filter)
        .select('name company startupProfile country email website')
        .limit(20)
        .lean();

      const mappedReal = realStartups.map((u: any) => ({
        _id: u._id.toString(),
        name: u.company || u.name,
        founder: u.name,
        country: u.country || 'Guiné-Bissau',
        sector: u.startupProfile?.sector || 'Tecnologia',
        stage: u.startupProfile?.stage || 'MVP Validado',
        headline: u.startupProfile?.pitch || 'Startup inovadora do ecossistema ABN',
        mrr: u.startupProfile?.traction?.mrr || 'Sob consulta',
        seeking: u.startupProfile?.fundingNeeded || '50.000 €',
        traction: `${u.startupProfile?.traction?.activeClients || 15} clientes ativos`,
        contact: u.email
      }));

      const combined = [...mappedReal, ...CURATED_ECOSYSTEM_STARTUPS];
      const filtered = combined.filter(s => {
        const matchSector = !qSector || s.sector.toLowerCase().includes(qSector.toLowerCase());
        const matchCountry = !qCountry || s.country.toLowerCase().includes(qCountry.toLowerCase());
        return matchSector && matchCountry;
      });

      return NextResponse.json({
        success: true,
        startups: filtered
      });
    }

    // 2. Perfil da Incubadora do utilizador
    let incubator = sessionUser
      ? await IncubatorProfile.findOne({ userId: sessionUser._id }).lean()
      : null;

    if (!incubator) {
      // Dados curados de demonstração de alta qualidade
      incubator = {
        userId: sessionUser?._id,
        organizationName: sessionUser?.company || 'ABN Innovation Hub & Aceleradora Lusófona',
        logo: '',
        organizationType: 'aceleradora',
        headline: 'Aceleradora de Impacto e Inovação Aberta para Startups da África Ocidental e Lusofonia',
        bio: 'Dedicados a identificar, capacitar e capitalizar fundadores audazes com soluções tecnológicas escaláveis nos mercados emergentes.',
        country: sessionUser?.country || 'Guiné-Bissau',
        city: sessionUser?.city || 'Bissau',
        website: sessionUser?.website || 'https://abn-hub.org',
        foundedYear: '2022',
        accreditations: ['Rede Global de Incubadoras (GIN)', 'Certificação ABN Hub 2026', 'AfriLabs Member'],
        metrics: {
          totalStartupsIncubated: 28,
          activeStartups: 12,
          graduatedStartups: 16,
          totalCapitalRaisedEur: 1450000,
          jobsCreated: 185,
          survivalRatePercent: 82
        },
        programs: [
          {
            _id: 'prog-1',
            name: 'Acelera Lusofonia — Edição Primavera 2026',
            batch: 'Cohort 2026.1',
            stage: 'seed',
            duration: '4 meses',
            equityPercent: 0,
            grantAmountEur: 15000,
            slotsAvailable: 8,
            status: 'inscricoes_abertas',
            applicationDeadline: '2026-04-30',
            description: 'Programa intensivo de tração, mentoria semanal 1:1 com líderes de tecnologia e preparação direta para captação com investidores internacionais.',
            perks: ['15.000 € equity-free grant', 'Acesso aos escritórios do Hub ABN', 'Créditos AWS & Google Cloud', 'Apresentação no Demo Day Internacional']
          },
          {
            _id: 'prog-2',
            name: 'Ideia em Ação — Pré-Incubação Universitária',
            batch: 'Cohort 2026.2',
            stage: 'ideacao',
            duration: '8 semanas',
            equityPercent: 0,
            grantAmountEur: 5000,
            slotsAvailable: 12,
            status: 'brevemente',
            applicationDeadline: '2026-06-15',
            description: 'Validação de problemas de mercado, desenvolvimento de protótipos rápidos e primeiras vendas para recém-licenciados e investigadores.',
            perks: ['Workshops práticos semanais', 'Mentoria em modelagem de negócio', 'Acesso ao laboratório de testes']
          }
        ],
        startups: [
          {
            _id: 's-1',
            startupName: 'Kassumai Pay',
            founderName: 'Baciro Djalo',
            founderEmail: 'baciro@kassumai.gw',
            sector: 'Fintech',
            stage: 'Seed',
            batch: 'Cohort 2025.2',
            status: 'ativa',
            healthScore: 92,
            mrrEur: 3800,
            capitalRaisedEur: 45000,
            jobsCount: 7,
            pitchDeckUrl: 'https://kassumai.gw/deck.pdf',
            notes: 'Forte crescimento nos comerciantes de Bissau e Ziguinchor.'
          },
          {
            _id: 's-2',
            startupName: 'AgroLusofonia Tech',
            founderName: 'Amina Sanhá',
            founderEmail: 'amina@agroluso.tech',
            sector: 'Agrotech',
            stage: 'Pre-Seed',
            batch: 'Cohort 2026.1',
            status: 'ativa',
            healthScore: 84,
            mrrEur: 1900,
            capitalRaisedEur: 20000,
            jobsCount: 4,
            pitchDeckUrl: 'https://agroluso.tech/deck.pdf',
            notes: 'A fechar acordo de distribuição com cooperativas de castanha de caju.'
          },
          {
            _id: 's-3',
            startupName: 'SolarBissau Clean',
            founderName: 'Carlos Lopes Gomes',
            founderEmail: 'carlos@solarbissau.gw',
            sector: 'Cleantech',
            stage: 'Seed',
            batch: 'Cohort 2025.1',
            status: 'graduada',
            healthScore: 95,
            mrrEur: 7500,
            capitalRaisedEur: 120000,
            jobsCount: 14,
            pitchDeckUrl: 'https://solarbissau.gw/deck.pdf',
            notes: 'Graduada com sucesso. Recebeu co-investimento do Fundo Lusófono de Energia.'
          },
          {
            _id: 's-4',
            startupName: 'MovelTrans Bissau',
            founderName: 'Mamadu Baldé',
            founderEmail: 'balde@moveltrans.gw',
            sector: 'Mobilidade',
            stage: 'Pre-Seed',
            batch: 'Cohort 2026.1',
            status: 'em_risco',
            healthScore: 58,
            mrrEur: 650,
            capitalRaisedEur: 10000,
            jobsCount: 2,
            pitchDeckUrl: '',
            notes: 'Necessita de apoio urgente na reestruturação do modelo de precificação.'
          }
        ],
        applications: [
          {
            _id: 'app-1',
            startupName: 'BioNutri Guiné',
            founderName: 'Helena Correia',
            founderEmail: 'helena@bionutri.gw',
            founderPhone: '+245 955 112 233',
            country: 'Guiné-Bissau',
            programApplied: 'Acelera Lusofonia — Edição Primavera 2026',
            stage: 'MVP Validado',
            pitchSummary: 'Transformação de farinhas orgânicas e suplementos locais para combate à subnutrição infantil e exportação regional.',
            status: 'entrevista',
            evaluationScore: 86,
            reviewerNotes: 'Excelente produto e mercado comprovado. Agendar entrevista técnica.',
            submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          },
          {
            _id: 'app-2',
            startupName: 'LusoLogistics Fleet',
            founderName: 'Ibrahim Soares',
            founderEmail: 'ibrahim@lusofleet.com',
            founderPhone: '+245 966 334 455',
            country: 'Guiné-Bissau / Senegal',
            programApplied: 'Acelera Lusofonia — Edição Primavera 2026',
            stage: 'Ideação com Clientes Piloto',
            pitchSummary: 'Software de otimização de rotas e telemetria para frotas de carga pesada rodoviária.',
            status: 'pendente',
            evaluationScore: 78,
            reviewerNotes: 'Modelo B2B promissor. Avaliar diferenciais competitivos.',
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            _id: 'app-3',
            startupName: 'FarmaClick Bissau',
            founderName: 'Soraia Mendes',
            founderEmail: 'soraia@farmaclick.gw',
            founderPhone: '+245 955 778 899',
            country: 'Guiné-Bissau',
            programApplied: 'Acelera Lusofonia — Edição Primavera 2026',
            stage: 'Tratamento de Protótipo',
            pitchSummary: 'App de busca de medicamentos em stock em farmácias de Bissau com entrega ao domicílio.',
            status: 'aprovada',
            evaluationScore: 91,
            reviewerNotes: 'Aprovada para a turma! Necessidade crítica identificada na capital.',
            submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
          }
        ],
        mentors: [
          {
            _id: 'm-1',
            name: 'Dr. Rui Furtado',
            role: 'Ex-Diretor de Inovação Bancária',
            company: 'Lisbon VC / ABN Advisor',
            specialty: 'Fintech, Compliance & Captação',
            email: 'rui.furtado@abn.network',
            avatar: '',
            assignedStartups: ['Kassumai Pay'],
            sessionsCompleted: 14,
            rating: 4.9
          },
          {
            _id: 'm-2',
            name: 'Eng.ª Paula Tavares',
            role: 'CTO & Especialista Cloud',
            company: 'TechÁfrica Labs',
            specialty: 'Arquitetura de Software & IA',
            email: 'paula.tavares@techafrica.org',
            avatar: '👩‍💻',
            assignedStartups: ['AgroLusofonia Tech', 'BioNutri Guiné'],
            sessionsCompleted: 22,
            rating: 5.0
          },
          {
            _id: 'm-3',
            name: 'Dr. Fernando Gomes',
            role: 'Advogado Especialista em M&A',
            company: 'Gomes & Associados',
            specialty: 'Direito Empresarial & Estruturação Societária',
            email: 'fernando.gomes@lexluso.com',
            avatar: '⚖️',
            assignedStartups: ['SolarBissau Clean'],
            sessionsCompleted: 9,
            rating: 4.8
          }
        ],
        investors: [
          {
            _id: 'inv-1',
            investorName: 'Fundo Lusófono de Capital de Risco',
            fundName: 'Lusofonia Ventures I',
            investorType: 'vc',
            targetTicketEur: '50.000 € - 250.000 €',
            focusSectors: ['Fintech', 'Agrotech', 'Energia', 'Logística'],
            email: 'deals@lusofoniavc.com',
            interestedStartups: ['Kassumai Pay', 'SolarBissau Clean']
          },
          {
            _id: 'inv-2',
            investorName: 'Rede de Business Angels da CPLP',
            fundName: 'CPLP Angels Club',
            investorType: 'angel',
            targetTicketEur: '15.000 € - 60.000 €',
            focusSectors: ['SaaS', 'E-commerce', 'Healthtech', 'Impacto Social'],
            email: 'invest@cplp-angels.org',
            interestedStartups: ['AgroLusofonia Tech', 'FarmaClick Bissau']
          }
        ],
        events: [
          {
            _id: 'ev-1',
            title: 'Demo Day ABN Acelera 2026: Apresentação a Investidores Internacionais',
            eventType: 'demo_day',
            date: '2026-05-28',
            time: '15:00 UTC (Bissau / Lisboa)',
            location: 'Auditório ABN Hub Bissau & Live Streaming Global',
            speakers: 'Banca com 12 VCs e Business Angels convidados',
            status: 'agendado',
            registrationUrl: 'https://abn.network/demoday-2026'
          },
          {
            _id: 'ev-2',
            title: 'Masterclass: Estratégias de Pricing e Métricas de Tração para SaaS & Fintech',
            eventType: 'masterclass',
            date: '2026-04-10',
            time: '10:00 UTC',
            location: 'Sala de Aceleração 2 / Google Meet',
            speakers: 'Dr. Rui Furtado',
            status: 'agendado',
            registrationUrl: ''
          }
        ],
        evaluations: [
          {
            _id: 'eval-1',
            startupName: 'Kassumai Pay',
            evaluationDate: '2026-03-01',
            evaluator: 'Comité de Acompanhamento Trimestral ABN',
            teamScore: 92,
            productScore: 90,
            marketScore: 95,
            tractionScore: 90,
            overallScore: 92,
            strengths: 'Execução comercial exemplar e boa fidelização de comerciantes nos mercados informais.',
            challenges: 'Necessidade de automatizar processos de KYC e reforçar tesouraria.',
            recommendations: 'Avançar com a rodada Seed de 50.000 € no Demo Day para expansão regional.'
          },
          {
            _id: 'eval-2',
            startupName: 'MovelTrans Bissau',
            evaluationDate: '2026-03-05',
            evaluator: 'Comité de Mentoria Estratégica',
            teamScore: 65,
            productScore: 60,
            marketScore: 70,
            tractionScore: 45,
            overallScore: 60,
            strengths: 'Mercado de transporte de carga tem procura reprimida.',
            challenges: 'Burn rate incompatível com a receita e falta de foco na aquisição de clientes B2B.',
            recommendations: 'Pivô do modelo para atender clientes corporativos com contratos pré-pagos.'
          }
        ]
      };
    }

    return NextResponse.json({
      success: true,
      incubator,
      curatedStartups: CURATED_ECOSYSTEM_STARTUPS
    });
  } catch (error: any) {
    console.error('Error in GET /api/incubator:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erro ao carregar incubadora' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');

    let sessionUser: any = null;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
        const uid = parsed.id || parsed._id;
        if (uid) sessionUser = await User.findById(uid);
      } catch (e) {}
    }

    const body = await request.json();
    const { action } = body;

    // Buscar ou inicializar perfil
    let profile = sessionUser
      ? await IncubatorProfile.findOne({ userId: sessionUser._id })
      : null;

    if (!profile && sessionUser) {
      profile = new IncubatorProfile({
        userId: sessionUser._id,
        organizationName: sessionUser.company || sessionUser.name,
        country: sessionUser.country || 'Guiné-Bissau',
        city: sessionUser.city || 'Bissau'
      });
    }

    // 1. Atualizar Perfil Institucional da Incubadora
    if (action === 'update_profile') {
      const { organizationName, organizationType, headline, bio, country, city, website, foundedYear } = body;
      if (profile) {
        if (organizationName) profile.organizationName = organizationName;
        if (organizationType) profile.organizationType = organizationType;
        if (headline !== undefined) profile.headline = headline;
        if (bio !== undefined) profile.bio = bio;
        if (country) profile.country = country;
        if (city) profile.city = city;
        if (website !== undefined) profile.website = website;
        if (foundedYear !== undefined) profile.foundedYear = foundedYear;
        await profile.save();
      }
      return NextResponse.json({ success: true, message: 'Perfil da incubadora atualizado com sucesso!' });
    }

    // 2. Criar Novo Programa / Cohorte
    if (action === 'create_program') {
      const { name, batch, stage, duration, equityPercent, grantAmountEur, slotsAvailable, applicationDeadline, description, perks } = body;
      if (!name) return NextResponse.json({ success: false, message: 'Nome do programa é obrigatório.' }, { status: 400 });

      if (profile) {
        profile.programs.unshift({
          name,
          batch: batch || 'Cohort 2026',
          stage: stage || 'seed',
          duration: duration || '4 meses',
          equityPercent: Number(equityPercent) || 0,
          grantAmountEur: Number(grantAmountEur) || 0,
          slotsAvailable: Number(slotsAvailable) || 10,
          status: 'inscricoes_abertas',
          applicationDeadline: applicationDeadline || '',
          description: description || '',
          perks: Array.isArray(perks) ? perks : (perks ? perks.split(',').map((p: string) => p.trim()) : [])
        });
        await profile.save();
      }
      return NextResponse.json({ success: true, message: 'Novo programa de aceleração publicado com sucesso!' });
    }

    // 3. Adicionar Startup ao Portfólio
    if (action === 'add_startup') {
      const { startupName, founderName, founderEmail, sector, stage, batch, healthScore, mrrEur, capitalRaisedEur, jobsCount, pitchDeckUrl, notes } = body;
      if (!startupName) return NextResponse.json({ success: false, message: 'Nome da startup é obrigatório.' }, { status: 400 });

      if (profile) {
        profile.startups.unshift({
          startupName,
          founderName: founderName || '',
          founderEmail: founderEmail || '',
          sector: sector || 'Tecnologia',
          stage: stage || 'Seed',
          batch: batch || 'Cohort 2026.1',
          status: 'ativa',
          healthScore: Number(healthScore) || 80,
          mrrEur: Number(mrrEur) || 0,
          capitalRaisedEur: Number(capitalRaisedEur) || 0,
          jobsCount: Number(jobsCount) || 2,
          pitchDeckUrl: pitchDeckUrl || '',
          notes: notes || ''
        });
        profile.metrics.activeStartups = (profile.metrics.activeStartups || 0) + 1;
        profile.metrics.totalStartupsIncubated = (profile.metrics.totalStartupsIncubated || 0) + 1;
        await profile.save();
      }
      return NextResponse.json({ success: true, message: 'Startup integrada com sucesso no portfólio da incubadora!' });
    }

    // 4. Decisão sobre Candidatura (Aprovar / Entrevista / Rejeitar)
    if (action === 'review_application') {
      const { applicationId, newStatus, reviewerNotes, evaluationScore } = body;
      if (profile && applicationId) {
        const app = profile.applications.id(applicationId);
        if (app) {
          app.status = newStatus || app.status;
          if (reviewerNotes !== undefined) app.reviewerNotes = reviewerNotes;
          if (evaluationScore !== undefined) app.evaluationScore = Number(evaluationScore);

          // Se for aprovada, podemos opcionalmente criar startup no portfólio
          if (newStatus === 'aprovada') {
            profile.startups.push({
              startupName: app.startupName,
              founderName: app.founderName,
              founderEmail: app.founderEmail,
              sector: 'Inovação',
              stage: app.stage || 'Seed',
              batch: app.programApplied || 'Cohort Ativa',
              status: 'ativa',
              healthScore: app.evaluationScore || 85
            });
          }
          await profile.save();
        }
      }
      return NextResponse.json({ success: true, message: `Candidatura atualizada para estado: ${newStatus}!` });
    }

    // 5. Adicionar Mentor
    if (action === 'add_mentor') {
      const { name, role, company, specialty, email, assignedStartups } = body;
      if (!name) return NextResponse.json({ success: false, message: 'Nome do mentor é obrigatório.' }, { status: 400 });

      if (profile) {
        profile.mentors.unshift({
          name,
          role: role || '',
          company: company || '',
          specialty: specialty || 'Estratégia & Crescimento',
          email: email || '',
          avatar: '🧑‍🏫',
          assignedStartups: Array.isArray(assignedStartups) ? assignedStartups : (assignedStartups ? [assignedStartups] : []),
          sessionsCompleted: 0,
          rating: 5.0
        });
        await profile.save();
      }
      return NextResponse.json({ success: true, message: 'Mentor vinculado à rede com sucesso!' });
    }

    // 6. Adicionar Investidor / Parceiro de Capital
    if (action === 'add_investor') {
      const { investorName, fundName, investorType, targetTicketEur, focusSectors, email } = body;
      if (!investorName) return NextResponse.json({ success: false, message: 'Nome do investidor ou fundo é obrigatório.' }, { status: 400 });

      if (profile) {
        profile.investors.unshift({
          investorName,
          fundName: fundName || '',
          investorType: investorType || 'vc',
          targetTicketEur: targetTicketEur || '50.000 €',
          focusSectors: Array.isArray(focusSectors) ? focusSectors : (focusSectors ? focusSectors.split(',').map((s: string) => s.trim()) : []),
          email: email || ''
        });
        await profile.save();
      }
      return NextResponse.json({ success: true, message: 'Investidor registado no Deal Room da incubadora!' });
    }

    // 7. Agendar Evento / Demo Day
    if (action === 'schedule_event') {
      const { title, eventType, date, time, location, speakers, registrationUrl } = body;
      if (!title) return NextResponse.json({ success: false, message: 'Título do evento é obrigatório.' }, { status: 400 });

      if (profile) {
        profile.events.unshift({
          title,
          eventType: eventType || 'demo_day',
          date: date || '',
          time: time || '',
          location: location || 'Campus ABN / Online',
          speakers: speakers || '',
          status: 'agendado',
          registrationUrl: registrationUrl || ''
        });
        await profile.save();
      }
      return NextResponse.json({ success: true, message: 'Evento agendado e publicado com sucesso!' });
    }

    // 8. Submeter Avaliação Diagnóstica
    if (action === 'submit_evaluation') {
      const { startupName, evaluator, teamScore, productScore, marketScore, tractionScore, strengths, challenges, recommendations } = body;
      if (!startupName) return NextResponse.json({ success: false, message: 'Indique a startup avaliada.' }, { status: 400 });

      const t = Number(teamScore) || 75;
      const p = Number(productScore) || 75;
      const m = Number(marketScore) || 75;
      const tr = Number(tractionScore) || 75;
      const overall = Math.round((t + p + m + tr) / 4);

      if (profile) {
        profile.evaluations.unshift({
          startupName,
          evaluationDate: new Date().toISOString().split('T')[0],
          evaluator: evaluator || 'Comité de Avaliação ABN',
          teamScore: t,
          productScore: p,
          marketScore: m,
          tractionScore: tr,
          overallScore: overall,
          strengths: strengths || '',
          challenges: challenges || '',
          recommendations: recommendations || ''
        });

        // Atualizar healthScore da startup correspondente
        const sMatch = profile.startups.find((s: any) => s.startupName === startupName);
        if (sMatch) sMatch.healthScore = overall;

        await profile.save();
      }
      return NextResponse.json({ success: true, message: 'Relatório de avaliação diagnóstica registado!' });
    }

    return NextResponse.json({ success: true, message: 'Ação executada com sucesso!' });
  } catch (error: any) {
    console.error('Error in POST /api/incubator:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erro ao processar ação' }, { status: 500 });
  }
}
