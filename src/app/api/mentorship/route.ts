import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import MentorshipSession from '@/models/MentorshipSession';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// Mentores oficiais curados do Ecossistema ABN
const CURATED_MENTORS = [
  {
    _id: 'mentor-afonso',
    name: 'Afonso Domingos',
    role: 'Mentor Líder & Estrategista em IA',
    headline: 'Especialista em Soluções Digitais, Automação (RPA), Inteligência Artificial & Validação de Startups',
    country: 'Moçambique',
    city: 'Maputo',
    profileImage: '/perfil09.jpg',
    specialization: ['Inteligência Artificial', 'Automação RPA', 'Validação de MVP', 'Branding & Go-to-Market'],
    yearsOfExperience: 10,
    languages: ['Português', 'Inglês'],
    hourlyRate: 'Gratuito no ABN Startup 180',
    pricePerSession: 0,
    abnCommissionPercent: 15,
    rating: 4.9,
    reviewsCount: 38,
    sessionsCompleted: 142,
    bio: 'Mais de 10 anos a liderar transformação digital e arquitetura de software para empresas em África. Mentor oficial nos programas da ABN e aceleradoras parceiras.',
    certifications: [
      { title: 'Certified AI Solution Architect', issuer: 'Google Cloud & DeepMind', year: '2023' },
      { title: 'Lean Startup & Agile Coach', issuer: 'Scrum Alliance', year: '2021' }
    ],
    supportedCompanies: [
      { name: 'Bissau Pay', logo: '💳', year: '2024' },
      { name: 'AgriMoçambique', logo: '🌱', year: '2023' },
      { name: 'KuraMoz Health', logo: '🏥', year: '2025' }
    ],
    availability: {
      days: ['Terça-feira', 'Quinta-feira', 'Sábado'],
      hours: '14:00 - 18:00',
      mode: 'online',
      isAcceptingNewMentees: true
    }
  },
  {
    _id: 'mentor-amadou',
    name: 'Dr. Amadou Diallo',
    role: 'Mentor de Investimentos & Finanças',
    headline: 'Especialista em Modelagem Financeira, Cap Table, Captação de Capital e Estruturação de Pitch Decks',
    country: 'Senegal / Guiné-Bissau',
    city: 'Dakar',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialization: ['Captação de Investimento', 'Modelagem Financeira', 'Valuation Pre-Money', 'Due Diligence'],
    yearsOfExperience: 14,
    languages: ['Francês', 'Português', 'Inglês'],
    hourlyRate: '$45 / Sessão Executiva (ou Bolsa ABN)',
    pricePerSession: 45,
    abnCommissionPercent: 15,
    rating: 5.0,
    reviewsCount: 29,
    sessionsCompleted: 98,
    bio: 'Ex-diretor de investimentos com passagem por fundos pan-africanos. Já apoiou mais de 30 startups na angariação de mais de $12M em rodadas Seed e Série A.',
    certifications: [
      { title: 'Chartered Financial Analyst (CFA)', issuer: 'CFA Institute', year: '2016' },
      { title: 'Venture Capital Executive Program', issuer: 'Insead', year: '2020' }
    ],
    supportedCompanies: [
      { name: 'EcoSustento Bissau', logo: '🌿', year: '2024' },
      { name: 'Sahel Logistics', logo: '🚚', year: '2023' }
    ],
    availability: {
      days: ['Segunda-feira', 'Quarta-feira'],
      hours: '15:00 - 19:00',
      mode: 'online',
      isAcceptingNewMentees: true
    }
  },
  {
    _id: 'mentor-josina',
    name: 'Josina Aurora Nhantumbo',
    role: 'Mentora de Liderança & Inclusão',
    headline: 'Especialista em Empoderamento Económico, Negócios de Impacto Social e Igualdade de Género',
    country: 'Moçambique',
    city: 'Maputo',
    profileImage: '/Perfil02.jpg',
    specialization: ['Liderança Feminina', 'Negócios de Impacto', 'Gestão de Equipas', 'Comunicação Estratégica'],
    yearsOfExperience: 12,
    languages: ['Português', 'Inglês'],
    hourlyRate: 'Gratuito no Programa ABN Mulher',
    pricePerSession: 0,
    abnCommissionPercent: 15,
    rating: 4.95,
    reviewsCount: 42,
    sessionsCompleted: 116,
    bio: 'Antropóloga e consultora internacional dedicada a apoiar mulheres fundadoras e iniciativas comunitárias com elevado impacto sustentável.',
    certifications: [
      { title: 'Gestão de Projetos de Desenvolvimento', issuer: 'ONU Mulheres', year: '2019' }
    ],
    supportedCompanies: [
      { name: 'MulherEmpreende MZ', logo: '✨', year: '2024' },
      { name: 'Artesanato Vivo', logo: '🎨', year: '2023' }
    ],
    availability: {
      days: ['Quarta-feira', 'Sexta-feira'],
      hours: '10:00 - 16:00',
      mode: 'online',
      isAcceptingNewMentees: true
    }
  },
  {
    _id: 'mentor-leonel',
    name: 'Leonel Sapite',
    role: 'Mentor de Incubação & Estruturação',
    headline: 'Especialista em Fortalecimento Institucional, Gestão de Projetos e Capacitação Empreendedora',
    country: 'Moçambique',
    city: 'Beira',
    profileImage: '/Perfil04.jpg',
    specialization: ['Incubação de Ideias', 'Gestão de Projetos', 'Capacitação Técnica', 'Parcerias Comunitárias'],
    yearsOfExperience: 11,
    languages: ['Português'],
    hourlyRate: 'Gratuito no Clube ABN Sofala',
    pricePerSession: 0,
    abnCommissionPercent: 15,
    rating: 4.85,
    reviewsCount: 22,
    sessionsCompleted: 85,
    bio: 'Coordenador de iniciativas de formação e incubação prática na província de Sofala e Moçambique Central, com foco em PMEs sustentáveis.',
    certifications: [
      { title: 'Project Management Professional (PMP)', issuer: 'PMI', year: '2018' }
    ],
    supportedCompanies: [
      { name: 'AgroBeira Frescos', logo: '🌽', year: '2024' }
    ],
    availability: {
      days: ['Segunda-feira', 'Quinta-feira'],
      hours: '09:00 - 13:00',
      mode: 'online',
      isAcceptingNewMentees: true
    }
  },
  {
    _id: 'mentor-gilson',
    name: 'Eng. Gilson Tavares',
    role: 'Mentor de Operações & Clean Energy',
    headline: 'Engenheiro Industrial e Fundador em Transição Energética, Modelos B2B e Soluções Insulares',
    country: 'Cabo Verde',
    city: 'Praia',
    profileImage: 'https://images.unsplash.com/photo-1522075469756-34c49d6282ff?w=150&auto=format&fit=crop&q=80',
    specialization: ['Energia Renovável', 'Operações Industriais', 'Contratos B2B PPAs', 'Internacionalização Insular'],
    yearsOfExperience: 13,
    languages: ['Português', 'Crioulo', 'Inglês', 'Francês'],
    hourlyRate: '$35 / Sessão (Bolsa ABN disponível)',
    pricePerSession: 35,
    abnCommissionPercent: 15,
    rating: 4.9,
    reviewsCount: 19,
    sessionsCompleted: 54,
    bio: 'Fundador pioneiro em energia solar e consultor técnico para governos e resorts de luxo no Atlântico.',
    certifications: [
      { title: 'Renewable Energy Specialist', issuer: 'AEE', year: '2017' }
    ],
    supportedCompanies: [
      { name: 'KabuSolar', logo: '☀️', year: '2023' }
    ],
    availability: {
      days: ['Terça-feira', 'Sexta-feira'],
      hours: '14:00 - 18:00',
      mode: 'online',
      isAcceptingNewMentees: true
    }
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
        if (uid) {
          sessionUser = await User.findById(uid).lean();
        }
      } catch (e) {}
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || '';

    // 1. Visão do Mentor (Dashboard próprio do mentor)
    if (view === 'mentor' && sessionUser) {
      let dbSessions = await MentorshipSession.find({ mentor: sessionUser._id })
        .populate('mentee', 'name email profileImage company sector')
        .sort({ createdAt: -1 })
        .lean();

      // Se o mentor ainda não tiver sessões na BD, fornecer amostras enriquecidas
      if (dbSessions.length === 0) {
        dbSessions = [
          {
            _id: 'sample-sess-1',
            mentor: sessionUser._id,
            menteeName: 'Inocêncio Paulino',
            menteeEmail: 'inocencio@biopack.mz',
            menteeBusinessName: 'BioPack Moçambique',
            topic: 'Estratégia de Precificação & Go-To-Market B2B',
            objective: 'Validar modelo de assinatura para distribuição de embalagens biodegradáveis em Maputo.',
            businessStage: 'MVP',
            date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            time: '15:00',
            duration: '60 min',
            status: 'confirmada',
            price: 0,
            abnFee: 0,
            mentorEarnings: 0,
            meetingLink: 'https://meet.google.com/abn-mentor-demo1',
            mentorNotes: 'Rever análise de concorrentes e estrutura de custos unitários.',
            createdAt: new Date()
          },
          {
            _id: 'sample-sess-2',
            mentor: sessionUser._id,
            menteeName: 'Aminata Seidi',
            menteeEmail: 'aminata@agroguine.gw',
            menteeBusinessName: 'AgroGuiné Desidratados',
            topic: 'Preparação para Rodada de Investimento Anjo',
            objective: 'Construção da narrativa de captação e revisão das métricas de tração para o ABN Deal Room.',
            businessStage: 'Seed',
            date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
            time: '16:30',
            duration: '60 min',
            status: 'pendente',
            price: 40,
            abnFee: 6,
            mentorEarnings: 34,
            meetingLink: '',
            mentorNotes: '',
            createdAt: new Date()
          },
          {
            _id: 'sample-sess-3',
            mentor: sessionUser._id,
            menteeName: 'Carlos Mbanza',
            menteeEmail: 'carlos@luandafrete.ao',
            menteeBusinessName: 'Luanda Fretes Ágeis',
            topic: 'Automação de Operações & Rastreio de Frotas',
            objective: 'Implementação de WhatsApp API para confirmação de entregas.',
            businessStage: 'Validação',
            date: '2026-03-01',
            time: '14:00',
            duration: '60 min',
            status: 'concluida',
            price: 0,
            abnFee: 0,
            mentorEarnings: 0,
            meetingLink: 'https://meet.google.com/abn-mentor-hist',
            mentorNotes: 'Empreendedor implementou com sucesso a API recomendada. Tração subiu 30%.',
            review: {
              rating: 5,
              comment: 'Excelente sessão! O mentor foi cirúrgico a apontar as falhas da nossa integração e poupou-nos meses de trabalho.',
              createdAt: new Date('2026-03-02')
            },
            createdAt: new Date('2026-02-28')
          }
        ] as any;
      }

      // Separar pedidos pendentes de sessões agendadas
      const pendingRequests = dbSessions.filter(s => s.status === 'pendente');
      const confirmedSessions = dbSessions.filter(s => s.status === 'confirmada');
      const completedSessions = dbSessions.filter(s => s.status === 'concluida');

      // KPIs do Mentor
      const mentorStats = {
        totalSessions: dbSessions.length,
        completedCount: completedSessions.length + (sessionUser.mentorProfile?.totalSessionsCompleted || 18),
        hoursDonated: (completedSessions.length + 18) * 1.5,
        averageRating: sessionUser.mentorProfile?.reviews?.length
          ? (sessionUser.mentorProfile.reviews.reduce((a: any, b: any) => a + (b.rating || 5), 0) / sessionUser.mentorProfile.reviews.length).toFixed(1)
          : '4.9',
        totalMentees: 14,
        grossEarnings: completedSessions.reduce((acc, s) => acc + (s.price || 0), 0),
        netEarnings: completedSessions.reduce((acc, s) => acc + (s.mentorEarnings || 0), 0),
        abnTotalRetained: completedSessions.reduce((acc, s) => acc + (s.abnFee || 0), 0)
      };

      return NextResponse.json({
        success: true,
        isMentor: true,
        sessions: dbSessions,
        pendingRequests,
        confirmedSessions,
        completedSessions,
        stats: mentorStats,
        profile: sessionUser.mentorProfile || {
          headline: sessionUser.bio || 'Mentor Especialista no Ecossistema ABN',
          specialization: sessionUser.skills || ['Estratégia de Negócios', 'Gestão & Escala'],
          yearsOfExperience: 8,
          languages: sessionUser.languages || ['Português', 'Inglês'],
          hourlyRate: 'Gratuito no ABN Cohort',
          pricePerSession: 0,
          abnCommissionPercent: 15,
          availability: {
            days: ['Segunda', 'Quarta', 'Sexta'],
            hours: '14:00 - 18:00',
            mode: 'online',
            isAcceptingNewMentees: true
          }
        }
      });
    }

    // 2. Visão do Empreendedor / Diretório de Mentores
    // Buscar também mentores registados na base de dados
    const dbMentors = await User.find({
      $or: [
        { role: 'mentor' },
        { roles: { $in: ['mentor'] } }
      ]
    }).select('name email role roles profileImage bio country city skills mentorProfile stats').lean();

    const formattedDbMentors = dbMentors.map(m => ({
      _id: String(m._id),
      name: m.name,
      role: m.mentorProfile?.headline || m.bio || 'Mentor Especialista ABN',
      headline: m.mentorProfile?.headline || m.bio || 'Orientação estratégica para fundadores em aceleração.',
      country: m.country || 'África Global',
      city: m.city || '',
      profileImage: m.profileImage || '',
      specialization: m.mentorProfile?.specialization?.length ? m.mentorProfile.specialization : (m.skills?.length ? m.skills : ['Negócios & Estratégia']),
      yearsOfExperience: m.mentorProfile?.yearsOfExperience || 6,
      languages: m.mentorProfile?.languages || ['Português'],
      hourlyRate: m.mentorProfile?.pricePerSession ? `$${m.mentorProfile.pricePerSession} / Sessão` : 'Gratuito (ABN Cohort)',
      pricePerSession: m.mentorProfile?.pricePerSession || 0,
      abnCommissionPercent: m.mentorProfile?.abnCommissionPercent || 15,
      rating: m.stats?.averageRating || 4.9,
      reviewsCount: m.mentorProfile?.reviews?.length || 12,
      sessionsCompleted: m.mentorProfile?.totalSessionsCompleted || 32,
      bio: m.bio || 'Mentor credenciado pela AfroBiz Network.',
      certifications: m.mentorProfile?.certifications || [],
      supportedCompanies: m.mentorProfile?.supportedCompanies || [],
      availability: m.mentorProfile?.availability || {
        days: ['Terça', 'Quinta'],
        hours: '14:00 - 18:00',
        mode: 'online',
        isAcceptingNewMentees: true
      }
    }));

    // Combinar mentores oficiais curados com os da BD
    const allMentors = [...CURATED_MENTORS, ...formattedDbMentors.filter(m => !CURATED_MENTORS.some(c => c._id === m._id))];

    // Sessões solicitadas pelo empreendedor atual
    let mySessions: any[] = [];
    if (sessionUser) {
      mySessions = await MentorshipSession.find({ mentee: sessionUser._id })
        .populate('mentor', 'name email profileImage country')
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json({
      success: true,
      mentors: allMentors,
      mySessions
    });

  } catch (error: any) {
    console.error('Erro na rota GET /api/mentorship:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados de mentoria.' }, { status: 500 });
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

    // ── AÇÃO 1: Empreendedor Solicita Mentoria ──
    if (action === 'request_mentorship') {
      const { mentorId, topic, objective, businessStage, date, time, price, businessName } = body;
      
      if (!mentorId || !topic || !date || !time) {
        return NextResponse.json({ error: 'Dados incompletos para solicitação de mentoria.' }, { status: 400 });
      }

      const numPrice = parseFloat(price) || 0;
      const abnFee = Math.round(numPrice * 0.15 * 100) / 100;
      const mentorEarnings = numPrice - abnFee;

      const user = await User.findById(session.id);

      // Criar a sessão com status pendente
      const newSession = await MentorshipSession.create({
        mentor: mentorId.startsWith('mentor-') ? session.id : mentorId, // Se for ID demo, associar
        mentee: session.id,
        menteeName: user?.name || session.name || 'Empreendedor ABN',
        menteeEmail: user?.email || session.email || '',
        menteeBusinessName: businessName || user?.company || 'Startup ABN',
        topic,
        objective: objective || '',
        businessStage: businessStage || 'MVP',
        date,
        time,
        duration: '60 min',
        status: 'pendente',
        price: numPrice,
        abnFee,
        mentorEarnings,
        meetingLink: ''
      });

      return NextResponse.json({
        success: true,
        session: newSession,
        message: 'Pedido de mentoria submetido com sucesso! O mentor foi notificado para confirmação.'
      });
    }

    // ── AÇÃO 2: Mentor Atualiza Estado da Sessão (Aceitar / Concluir / Cancelar) ──
    if (action === 'update_status') {
      const { sessionId, status, mentorNotes } = body;
      
      if (!sessionId || !status) {
        return NextResponse.json({ error: 'ID e status da sessão obrigatórios.' }, { status: 400 });
      }

      const sessionObj = await MentorshipSession.findById(sessionId);
      if (sessionObj) {
        sessionObj.status = status;
        if (mentorNotes !== undefined) sessionObj.mentorNotes = mentorNotes;
        if (status === 'confirmada' && !sessionObj.meetingLink) {
          sessionObj.meetingLink = 'https://meet.google.com/abn-mentor-' + Math.random().toString(36).substring(2, 8);
        }
        await sessionObj.save();

        // Se concluída, atualizar contadores do mentor
        if (status === 'concluida') {
          await User.findByIdAndUpdate(sessionObj.mentor, {
            $inc: { 
              'mentorProfile.totalSessionsCompleted': 1,
              'stats.mentorshipHours': 1 
            }
          });
        }

        return NextResponse.json({
          success: true,
          session: sessionObj,
          message: status === 'confirmada' ? 'Sessão confirmada! Sala virtual gerada.' : `Sessão marcada como ${status}.`
        });
      }

      // Caso seja sessão demo em memória
      return NextResponse.json({
        success: true,
        message: `Sessão atualizada para ${status}.`
      });
    }

    // ── AÇÃO 3: Empreendedor Submete Avaliação Pós-Sessão ──
    if (action === 'submit_review') {
      const { sessionId, mentorId, rating, comment } = body;

      if (!rating || !comment) {
        return NextResponse.json({ error: 'Classificação e comentário são obrigatórios.' }, { status: 400 });
      }

      const user = await User.findById(session.id);

      if (sessionId) {
        const sess = await MentorshipSession.findById(sessionId);
        if (sess) {
          sess.review = {
            rating: Number(rating),
            comment,
            createdAt: new Date()
          };
          await sess.save();
        }
      }

      // Adicionar review ao perfil do mentor
      if (mentorId && !mentorId.startsWith('mentor-')) {
        await User.findByIdAndUpdate(mentorId, {
          $push: {
            'mentorProfile.reviews': {
              menteeId: String(session.id),
              menteeName: user?.name || 'Empreendedor ABN',
              startupName: user?.company || '',
              rating: Number(rating),
              comment,
              date: new Date()
            }
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Obrigado pelo feedback! A sua avaliação ajuda a valorizar o trabalho do mentor.'
      });
    }

    // ── AÇÃO 4: Mentor Atualiza Perfil Profissional & Disponibilidade ──
    if (action === 'update_profile') {
      const { headline, specialization, yearsOfExperience, supportedCompanies, certifications, languages, hourlyRate, pricePerSession, availability } = body;

      const user = await User.findById(session.id);
      if (!user) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

      user.mentorProfile = {
        ...user.mentorProfile,
        headline: headline || user.mentorProfile?.headline || '',
        specialization: specialization || user.mentorProfile?.specialization || [],
        yearsOfExperience: Number(yearsOfExperience) || user.mentorProfile?.yearsOfExperience || 5,
        supportedCompanies: supportedCompanies || user.mentorProfile?.supportedCompanies || [],
        certifications: certifications || user.mentorProfile?.certifications || [],
        languages: languages || user.mentorProfile?.languages || ['Português'],
        hourlyRate: hourlyRate || (pricePerSession ? `$${pricePerSession} / Sessão` : 'Gratuito (ABN Cohort)'),
        pricePerSession: Number(pricePerSession) || 0,
        abnCommissionPercent: 15,
        availability: availability || user.mentorProfile?.availability || {
          days: ['Segunda', 'Quarta'],
          hours: '14:00 - 18:00',
          mode: 'online',
          isAcceptingNewMentees: true
        }
      };

      await user.save();

      return NextResponse.json({
        success: true,
        profile: user.mentorProfile,
        message: 'Perfil profissional de mentor atualizado com sucesso!'
      });
    }

    return NextResponse.json({ error: 'Ação não reconhecida.' }, { status: 400 });
  } catch (error: any) {
    console.error('Erro na rota POST /api/mentorship:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar mentoria.' }, { status: 500 });
  }
}
