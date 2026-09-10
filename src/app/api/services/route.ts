import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import ConsultantProject from '@/models/ConsultantProject';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// Serviços curados de referência no Mercado de Especialistas da ABN (cobrindo as 10 áreas estratégicas)
const CURATED_SPECIALIST_SERVICES = [
  {
    _id: 'srv-contab-1',
    name: 'Auditoria Contábil, DRE & Compliance Fiscal para Startups e PMEs',
    category: 'Contabilidade',
    description: 'Diagnóstico fiscal aprofundado, regularização tributária, estruturação do plano de contas e elaboração de DRE auditada para investidores.',
    price: '$250 / Projeto',
    priceAmount: 250,
    pricingType: 'fixo',
    deliveryTime: '7 a 10 dias úteis',
    deliverables: [
      'Relatório de Diagnóstico Fiscal Completo',
      'Balancete & DRE dos últimos 12 meses',
      'Plano de Otimização e Enquadramento Tributário',
      'Sessão de alinhamento com Contador Certificado'
    ],
    consultantName: 'Dr. Salvador Manhica',
    consultantTitle: 'Perito Contabilista & Auditor OCAM',
    consultantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 4.95,
    salesCount: 34,
    status: 'ativo'
  },
  {
    _id: 'srv-direito-1',
    name: 'Elaboração de Estatutos, Acordo de Sócios (MOU) & Contratos Comerciais',
    category: 'Direito empresarial',
    description: 'Blindagem jurídica para startups e empresas: pacto social, vesting de fundadores, termos de confidencialidade (NDA) e contratos com clientes B2B.',
    price: '$350 / Pacote Legal',
    priceAmount: 350,
    pricingType: 'fixo',
    deliveryTime: '5 a 7 dias úteis',
    deliverables: [
      'Acordo de Sócios e Cláusulas de Saída (Tag Along / Drag Along)',
      'Contrato Padrão de Prestação de Serviços B2B',
      'Termos de Confidencialidade e Propriedade Intelectual (NDA)',
      'Consulta jurídica de 60 min com Advogado Sénior'
    ],
    consultantName: 'Dra. Amina Mussá',
    consultantTitle: 'Advogada Especialista em Direito Corporativo & M&A',
    consultantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    rating: 5.0,
    salesCount: 42,
    status: 'ativo'
  },
  {
    _id: 'srv-mkt-1',
    name: 'Estratégia de Aquisição de Clientes, Tráfego Pago & Funil de Vendas B2B',
    category: 'Marketing',
    description: 'Construção de esteira de captação digital: campanhas em Meta e LinkedIn Ads, automação de leads e copywriting focado em conversão de alto ticket.',
    price: '$220 / Mês',
    priceAmount: 220,
    pricingType: 'fixo',
    deliveryTime: '15 dias de implementação',
    deliverables: [
      'Mapeamento de ICP (Perfil de Cliente Ideal)',
      'Configuração de Campanhas de Tráfego no Meta & LinkedIn',
      'Modelos de E-mail de Prospeção Outbound & Inbound',
      'Dashboard de Métricas de CAC e Retorno em Tempo Real'
    ],
    consultantName: 'Helena Silva',
    consultantTitle: 'Growth Hacker & Especialista em Tráfego Pago B2B',
    consultantAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    rating: 4.88,
    salesCount: 56,
    status: 'ativo'
  },
  {
    _id: 'srv-tech-1',
    name: 'Desenvolvimento de MVP Ágil, Landing Page de Alta Conversão & Automação',
    category: 'Tecnologia',
    description: 'Transformação de conceitos em software funcional: desenvolvimento Full-Stack, integração com gateways de pagamentos locais (M-Pesa/BissauPay) e APIs.',
    price: '$850 / MVP Completo',
    priceAmount: 850,
    pricingType: 'fixo',
    deliveryTime: '3 a 4 semanas',
    deliverables: [
      'Aplicação Web Responsiva & Painel de Administração',
      'Integração de Pagamentos Locais & Autenticação Segura',
      'Infraestrutura Cloud Otimizada (Vercel / AWS)',
      'Código-fonte e documentação técnica completa'
    ],
    consultantName: 'Afonso Domingos',
    consultantTitle: 'Arquiteto de Software & Especialista em IA',
    consultantAvatar: '/perfil09.jpg',
    rating: 5.0,
    salesCount: 28,
    status: 'ativo'
  },
  {
    _id: 'srv-rh-1',
    name: 'Recrutamento Executivo de Liderança & Estruturação de Plano de Cargos',
    category: 'Recursos humanos',
    description: 'Processo de triagem e caça de talentos para posições estratégicas (CTO, COO, Diretores), com dinâmicas de cultura e plano de incentivos.',
    price: '$180 / Posição',
    priceAmount: 180,
    pricingType: 'fixo',
    deliveryTime: '10 a 15 dias',
    deliverables: [
      'Descrição Técnica e Mapeamento de Perfil Comportamental',
      'Shortlist de 3 a 5 Candidatos Pré-Qualificados',
      'Relatório de Avaliação por Competências',
      'Minuta de Contrato de Trabalho e Período Probatório'
    ],
    consultantName: 'Inês Guambe',
    consultantTitle: 'Consultora de RH Estratégico & People Operations',
    consultantAvatar: 'https://images.unsplash.com/photo-1594824813593-3d07e6616a24?w=120&auto=format&fit=crop&q=80',
    rating: 4.9,
    salesCount: 19,
    status: 'ativo'
  },
  {
    _id: 'srv-gestao-1',
    name: 'Diagnóstico de Eficiência Operacional & Reestruturação de Processos (BPM)',
    category: 'Gestão',
    description: 'Mapeamento de gargalos, eliminação de desperdícios e criação de procedimentos operacionais padrão (POPs) para escalar operações com lucratividade.',
    price: '$400 / Diagnóstico',
    priceAmount: 400,
    pricingType: 'fixo',
    deliveryTime: '2 semanas',
    deliverables: [
      'Mapeamento Visual de Fluxos de Trabalho Atuais vs Futuros',
      'Manual de Procedimentos Operacionais Padrão (POPs)',
      'Matriz de Responsabilidades (RACI) para a equipa',
      'Plano de Redução de Custos Operacionais'
    ],
    consultantName: 'Nelson Bernardo',
    consultantTitle: 'Especialista em Logística & Otimização Operacional',
    consultantAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    rating: 4.85,
    salesCount: 15,
    status: 'ativo'
  },
  {
    _id: 'srv-export-1',
    name: 'Assessoria de Acesso a Mercados Internacionais & Certificação de Exportação',
    category: 'Exportação',
    description: 'Suporte completo para empresas que querem exportar produtos africanos para a Europa, Ásia ou espaço CPLP/CEDEAO com conformidade alfandegária.',
    price: '$500 / Projeto',
    priceAmount: 500,
    pricingType: 'fixo',
    deliveryTime: '3 semanas',
    deliverables: [
      'Estudo de Viabilidade Tarifária & Barreiras Não-Tarifárias',
      'Adequação de Rotulagem e Embalagens às Normas Internacionais',
      'Identificação de Compradores e Importadores Qualificados',
      'Estruturação de Dossiê Alfandegário e Logístico'
    ],
    consultantName: 'Mamadu Baldé',
    consultantTitle: 'Consultor de Comércio Internacional & Agronegócio',
    consultantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    rating: 4.95,
    salesCount: 22,
    status: 'ativo'
  },
  {
    _id: 'srv-finan-1',
    name: 'Estruturação de Dossiê de Captação & Preparação para Due Diligence de Fundos',
    category: 'Financiamento',
    description: 'Preparação executiva de startups e empresas para rodadas de investimento com Business Angels e Fundos de Venture Capital da ABN.',
    price: '$600 / Dossiê',
    priceAmount: 600,
    pricingType: 'fixo',
    deliveryTime: '2 a 3 semanas',
    deliverables: [
      'Modelo Financeiro com Projeções a 3 Anos & Valuation',
      'Auditoria prévia de Data Room para investidores',
      'Revisão do Pitch Deck com critérios de Fundos de VC',
      'Simulação de Pitch & Perguntas Difíceis com Banca Avaliadora'
    ],
    consultantName: 'Dr. Amadou Diallo',
    consultantTitle: 'Mentor de Investimentos & Finanças Corporativas',
    consultantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5.0,
    salesCount: 31,
    status: 'ativo'
  },
  {
    _id: 'srv-estrategia-1',
    name: 'Planeamento Estratégico OKR & Expansão de Mercado Pan-Africano',
    category: 'Estratégia',
    description: 'Definição de objetivos estratégicos ágeis (OKRs), matriz de posicionamento de mercado e roadmap de crescimento acelerado para 12 a 24 meses.',
    price: '$450 / Workshop + Plano',
    priceAmount: 450,
    pricingType: 'fixo',
    deliveryTime: '10 dias úteis',
    deliverables: [
      'Facilitação de Workshop de Planeamento Estratégico',
      'Definição de OKRs Trimestrais alinhados à liderança',
      'Matriz de Análise Competitiva e Estratégia de Diferenciação',
      'Plano de Acompanhamento Mensal de Metas'
    ],
    consultantName: 'Leonel Sapite',
    consultantTitle: 'Consultor de Estratégia & Fortalecimento Institucional',
    consultantAvatar: '/Perfil04.jpg',
    rating: 4.85,
    salesCount: 20,
    status: 'ativo'
  },
  {
    _id: 'srv-consult-1',
    name: 'Consultoria Estratégica Executiva 1-on-1 para Fundadores e CEOs',
    category: 'Consultoria',
    description: 'Sessão individual focada no desbloqueio de dilemas críticos do negócio: monetização, parcerias B2B, internacionalização e governança.',
    price: '$80 / Sessão (90 min)',
    priceAmount: 80,
    pricingType: 'por_hora',
    deliveryTime: 'Agendamento imediato',
    deliverables: [
      'Sessão executiva intensiva de 90 minutos via Google Meet',
      'Resumo escrito de Recomendações e Próximos Passos',
      'Acesso a templates e ferramentas de gestão exclusivas da ABN'
    ],
    consultantName: 'Eng. Gilson Tavares',
    consultantTitle: 'Consultor Empresarial & Empreendedor Sénior',
    consultantAvatar: 'https://images.unsplash.com/photo-1522075469756-34c49d6282ff?w=120&auto=format&fit=crop&q=80',
    rating: 4.92,
    salesCount: 45,
    status: 'ativo'
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
    const category = searchParams.get('category') || '';

    // ── MODO 1: Painel Privado do Consultor ──
    if (view === 'consultant' && sessionUser) {
      // Buscar serviços criados por este consultor na BD
      const myDbServices = await Service.find({ consultant: sessionUser._id }).sort({ createdAt: -1 }).lean();
      
      // Buscar projetos/pedidos recebidos por este consultor
      let myProjects = await ConsultantProject.find({ consultant: sessionUser._id })
        .populate('client', 'name email company')
        .sort({ createdAt: -1 })
        .lean();

      // Se ainda não tiver projetos, fornecer amostras enriquecidas
      if (myProjects.length === 0) {
        myProjects = [
          {
            _id: 'sample-proj-1',
            serviceTitle: 'Auditoria Contábil & Conformidade Fiscal',
            category: 'Contabilidade',
            consultant: sessionUser._id,
            consultantName: sessionUser.name,
            clientName: 'Mamadu Baldé',
            clientEmail: 'mamadu@ecosustento.gw',
            clientCompany: 'EcoSustento Bissau',
            clientPhone: '+245 966 222 333',
            projectScope: 'Necessitamos de auditar as demonstrações financeiras do último ano para submeter ao Deal Room da ABN.',
            budget: '$250',
            budgetAmount: 250,
            timeline: '10 dias',
            status: 'em_andamento',
            meetingDate: '2026-03-15',
            meetingTime: '10:00',
            meetingLink: 'https://meet.google.com/abn-consult-1',
            notes: 'Documentos do exercício anterior já rececionados. Em análise técnica.',
            createdAt: new Date()
          },
          {
            _id: 'sample-proj-2',
            serviceTitle: 'Elaboração de Estatutos & Acordo de Sócios',
            category: 'Direito empresarial',
            consultant: sessionUser._id,
            consultantName: sessionUser.name,
            clientName: 'Fatoumata Djaló',
            clientEmail: 'fatou@bissaupay.gw',
            clientCompany: 'Bissau Pay & Tech',
            clientPhone: '+245 955 000 111',
            projectScope: 'Redigir minuta de vesting para 2 novos desenvolvedores séniores.',
            budget: '$350',
            budgetAmount: 350,
            timeline: 'Imediato',
            status: 'pendente',
            meetingDate: '',
            meetingTime: '',
            meetingLink: '',
            notes: '',
            createdAt: new Date()
          },
          {
            _id: 'sample-proj-3',
            serviceTitle: 'Estratégia de Funil de Vendas B2B',
            category: 'Marketing',
            consultant: sessionUser._id,
            consultantName: sessionUser.name,
            clientName: 'Dra. Luísa Mondlane',
            clientEmail: 'luisa@kuramoz.co.mz',
            clientCompany: 'KuraMoz Digital Health',
            clientPhone: '+258 84 123 4567',
            projectScope: 'Estruturação de campanhas de captação de clínicas parceiras.',
            budget: '$220',
            budgetAmount: 220,
            timeline: 'Concluído',
            status: 'concluido',
            meetingDate: '2026-02-20',
            meetingTime: '15:00',
            meetingLink: 'https://meet.google.com/abn-consult-done',
            review: {
              rating: 5,
              comment: 'Serviço irrepreensível! A consultoria permitiu fechar 8 novas clínicas na primeira quinzena.',
              date: new Date('2026-02-25')
            },
            createdAt: new Date('2026-02-15')
          }
        ] as any;
      }

      // Estatísticas do Consultor
      const completedProjs = myProjects.filter(p => p.status === 'concluido');
      const inProgressProjs = myProjects.filter(p => p.status === 'em_andamento');
      const pendingProjs = myProjects.filter(p => p.status === 'pendente');

      const stats = {
        activeServicesCount: myDbServices.length || 3,
        totalProjects: myProjects.length,
        inProgressCount: inProgressProjs.length,
        pendingCount: pendingProjs.length,
        completedCount: completedProjs.length + (sessionUser.consultantProfile?.totalProjectsCompleted || 12),
        totalRevenue: completedProjs.reduce((acc, p) => acc + (p.budgetAmount || 0), 0) + (sessionUser.consultantProfile?.totalRevenue || 2800),
        averageRating: sessionUser.consultantProfile?.averageRating || 4.95,
        portfolioCount: sessionUser.consultantProfile?.portfolio?.length || 2
      };

      return NextResponse.json({
        success: true,
        isConsultant: true,
        services: myDbServices.length > 0 ? myDbServices : CURATED_SPECIALIST_SERVICES.slice(0, 3),
        projects: myProjects,
        stats,
        profile: sessionUser.consultantProfile || {
          headline: sessionUser.bio || 'Consultor & Especialista no Ecossistema ABN',
          specialties: sessionUser.skills || ['Consultoria', 'Estratégia', 'Gestão'],
          yearsOfExperience: 7,
          hourlyRate: '$50 / Hora',
          bio: sessionUser.bio || 'Profissional especializado em acelerar o crescimento de empresas na rede ABN.',
          availability: {
            days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
            hours: '09:00 - 18:00',
            mode: 'hibrido',
            isAcceptingProjects: true
          },
          portfolio: [
            {
              title: 'Reestruturação Fiscal & Governança',
              client: 'AgroBeira PME',
              description: 'Implementação de plano de contas e redução de 28% em penalidades fiscais.',
              resultMetric: 'Economia de $18,000 / ano'
            },
            {
              title: 'Estratégia de Expansão B2B',
              client: 'TechSolar Guiné',
              description: 'Estruturação do funil de vendas e contratos de distribuição.',
              resultMetric: '+40% Novos Clientes'
            }
          ]
        }
      });
    }

    // ── MODO 2: Catálogo Público do Mercado de Especialistas ──
    let dbServicesQuery: any = { status: 'ativo' };
    if (category && category !== 'Todos') {
      dbServicesQuery.category = category;
    }

    const dbServices = await Service.find(dbServicesQuery).sort({ createdAt: -1 }).lean();
    
    // Unir serviços curados com serviços cadastrados na base de dados
    let marketServices = [...CURATED_SPECIALIST_SERVICES, ...dbServices];
    
    if (category && category !== 'Todos') {
      marketServices = marketServices.filter(s => s.category?.toLowerCase() === category.toLowerCase());
    }

    // Buscar pedidos realizados pelo cliente atual
    let myClientOrders: any[] = [];
    if (sessionUser) {
      myClientOrders = await ConsultantProject.find({ client: sessionUser._id }).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({
      success: true,
      services: marketServices,
      myOrders: myClientOrders
    });

  } catch (error: any) {
    console.error('Erro na rota GET /api/services:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados de serviços e consultores.' }, { status: 500 });
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

    // ── AÇÃO 1: Consultor Cria / Edita um Serviço ──
    if (action === 'create_service') {
      const { name, description, price, priceAmount, pricingType, category, deliveryTime, deliverables } = body;

      if (!name || !description || !category || !price) {
        return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 });
      }

      const user = await User.findById(session.id);

      const newService = await Service.create({
        name,
        description,
        price,
        priceAmount: Number(priceAmount) || 0,
        pricingType: pricingType || 'fixo',
        category,
        deliveryTime: deliveryTime || '5 a 7 dias úteis',
        deliverables: Array.isArray(deliverables) ? deliverables : (deliverables ? deliverables.split('\n').filter(Boolean) : []),
        consultant: session.id,
        consultantName: user?.name || session.name || 'Especialista ABN',
        consultantTitle: user?.consultantProfile?.headline || user?.bio || 'Consultor Especialista',
        consultantAvatar: user?.profileImage || '',
        status: 'ativo'
      });

      return NextResponse.json({
        success: true,
        service: newService,
        message: 'Serviço publicado com sucesso no Mercado de Especialistas da ABN!'
      });
    }

    // ── AÇÃO 2: Ativar / Pausar Serviço ──
    if (action === 'toggle_service') {
      const { serviceId, status } = body;
      const updated = await Service.findByIdAndUpdate(serviceId, { status }, { new: true });
      return NextResponse.json({ success: true, service: updated, message: `Serviço ${status === 'ativo' ? 'ativado' : 'pausado'} com sucesso.` });
    }

    // ── AÇÃO 3: Cliente Contrata / Solicita Orçamento de Serviço ──
    if (action === 'order_service') {
      const { serviceId, serviceTitle, category, consultantId, consultantName, projectScope, budget, timeline, phone, company } = body;

      if (!serviceTitle || !projectScope) {
        return NextResponse.json({ error: 'Descreva o escopo do projeto para o especialista.' }, { status: 400 });
      }

      const clientUser = await User.findById(session.id);

      const newOrder = await ConsultantProject.create({
        service: serviceId?.startsWith('srv-') ? null : serviceId,
        serviceTitle,
        category: category || 'Consultoria',
        consultant: consultantId?.startsWith('mentor-') || consultantId?.startsWith('srv-') ? session.id : consultantId,
        consultantName: consultantName || 'Especialista ABN',
        client: session.id,
        clientName: clientUser?.name || session.name || 'Cliente ABN',
        clientEmail: clientUser?.email || session.email || '',
        clientPhone: phone || clientUser?.phone || '',
        clientCompany: company || clientUser?.company || '',
        projectScope,
        budget: budget || 'Sob Consulta',
        budgetAmount: parseFloat(String(budget).replace(/[^0-9.]/g, '')) || 0,
        timeline: timeline || 'Imediato',
        status: 'pendente'
      });

      return NextResponse.json({
        success: true,
        order: newOrder,
        message: 'Pedido enviado com sucesso! O especialista foi notificado e responderá com a proposta detalhada.'
      });
    }

    // ── AÇÃO 4: Atualizar Status do Projeto (Consultor aceita, inicia ou conclui) ──
    if (action === 'update_order_status') {
      const { projectId, status, meetingDate, meetingTime, notes } = body;

      const project = await ConsultantProject.findById(projectId);
      if (project) {
        project.status = status;
        if (notes !== undefined) project.notes = notes;
        if (meetingDate) project.meetingDate = meetingDate;
        if (meetingTime) project.meetingTime = meetingTime;
        if (status === 'em_andamento' && !project.meetingLink) {
          project.meetingLink = 'https://meet.google.com/abn-consult-' + Math.random().toString(36).substring(2, 8);
        }
        await project.save();

        if (status === 'concluido') {
          await User.findByIdAndUpdate(project.consultant, {
            $inc: { 
              'consultantProfile.totalProjectsCompleted': 1,
              'consultantProfile.totalRevenue': project.budgetAmount || 250
            }
          });
        }

        return NextResponse.json({
          success: true,
          project,
          message: `Projeto atualizado para o estado: ${status}.`
        });
      }

      return NextResponse.json({ success: true, message: `Estado atualizado para ${status}.` });
    }

    // ── AÇÃO 5: Adicionar Case ao Portfólio do Consultor ──
    if (action === 'add_portfolio') {
      const { title, client, description, link, resultMetric } = body;

      if (!title || !description) {
        return NextResponse.json({ error: 'Título e descrição do case são obrigatórios.' }, { status: 400 });
      }

      const user = await User.findById(session.id);
      if (!user) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

      const newCase = {
        title,
        client: client || '',
        description,
        link: link || '',
        resultMetric: resultMetric || '',
        date: new Date()
      };

      if (!user.consultantProfile) {
        user.consultantProfile = {} as any;
      }
      if (!user.consultantProfile.portfolio) {
        user.consultantProfile.portfolio = [];
      }

      user.consultantProfile.portfolio.push(newCase);
      await user.save();

      return NextResponse.json({
        success: true,
        portfolio: user.consultantProfile.portfolio,
        message: 'Novo caso de sucesso adicionado ao seu Portfólio!'
      });
    }

    // ── AÇÃO 6: Atualizar Perfil & Disponibilidade do Consultor ──
    if (action === 'update_profile') {
      const { headline, specialties, yearsOfExperience, hourlyRate, bio, availability } = body;

      const user = await User.findById(session.id);
      if (!user) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

      user.consultantProfile = {
        ...user.consultantProfile,
        headline: headline || user.consultantProfile?.headline || '',
        specialties: specialties || user.consultantProfile?.specialties || [],
        yearsOfExperience: Number(yearsOfExperience) || user.consultantProfile?.yearsOfExperience || 5,
        hourlyRate: hourlyRate || user.consultantProfile?.hourlyRate || '$50 / Hora',
        bio: bio || user.consultantProfile?.bio || '',
        availability: availability || user.consultantProfile?.availability || {
          days: ['Segunda', 'Quarta', 'Sexta'],
          hours: '09:00 - 18:00',
          mode: 'hibrido',
          isAcceptingProjects: true
        }
      };

      await user.save();

      return NextResponse.json({
        success: true,
        profile: user.consultantProfile,
        message: 'Perfil de consultor atualizado com sucesso!'
      });
    }

    // ── AÇÃO 7: Cliente Avalia Projeto de Consultoria ──
    if (action === 'submit_review') {
      const { projectId, rating, comment } = body;

      if (!rating || !comment) {
        return NextResponse.json({ error: 'Classificação e comentário são obrigatórios.' }, { status: 400 });
      }

      if (projectId) {
        const proj = await ConsultantProject.findById(projectId);
        if (proj) {
          proj.review = {
            rating: Number(rating),
            comment,
            date: new Date()
          };
          await proj.save();

          // Atualizar nota do consultor
          await User.findByIdAndUpdate(proj.consultant, {
            $inc: { 'consultantProfile.reviewsCount': 1 }
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Avaliação enviada com sucesso! A sua recomendação valoriza o consultor.'
      });
    }

    return NextResponse.json({ error: 'Ação não reconhecida.' }, { status: 400 });
  } catch (error: any) {
    console.error('Erro na rota POST /api/services:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar serviço.' }, { status: 500 });
  }
}
