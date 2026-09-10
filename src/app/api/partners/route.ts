import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PartnerApplication from '@/models/PartnerApplication';

export const dynamic = 'force-dynamic';

// Parceiros Oficiais de Destaque da Rede ABN
const CURATED_OFFICIAL_PARTNERS = [
  {
    _id: 'part-afdb',
    organizationName: 'Banco Africano de Desenvolvimento (BAD / AfDB)',
    partnerType: 'financeiro',
    categoryLabel: 'Parceiro Financeiro & Desenvolvimento',
    logo: '🏦',
    country: 'Pan-Africano / Abidjan',
    sector: 'Banca de Fomento & Financiamento PME',
    website: 'https://afdb.org',
    headline: 'Fundo de Inovação e Aceleração de Pequenas e Médias Empresas Africanas',
    jointProjectsCount: 3,
    startupsSupportedCount: 140,
    mouStatus: 'assinado',
    badge: 'Parceiro Estratégico 2024-2027'
  },
  {
    _id: 'part-undp',
    organizationName: 'PNUD África / UNDP Innovation Hub',
    partnerType: 'institucional',
    categoryLabel: 'Parceiro Institucional & Impacto',
    logo: '🌍',
    country: 'Guiné-Bissau & Moçambique',
    sector: 'Desenvolvimento Sustentável & Empreendedorismo Feminino',
    website: 'https://undp.org',
    headline: 'Iniciativas conjuntas para capacitação de jovens empreendedores e ODS 8',
    jointProjectsCount: 4,
    startupsSupportedCount: 220,
    mouStatus: 'assinado',
    badge: 'Cooperação Internacional'
  },
  {
    _id: 'part-techhub',
    organizationName: 'TechHub Luanda Innovation Centre',
    partnerType: 'tecnologico',
    categoryLabel: 'Parceiro Tecnológico & Incubação',
    logo: '💻',
    country: 'Angola',
    sector: 'Tecnologia da Informação, Cloud & Aceleração',
    website: 'https://techhubluanda.ao',
    headline: 'Polo tecnológico conjunto para intercâmbio de fundadores lusófonos',
    jointProjectsCount: 2,
    startupsSupportedCount: 65,
    mouStatus: 'assinado',
    badge: 'Hub Tecnológico Parceiro'
  },
  {
    _id: 'part-bancocomer',
    organizationName: 'Banco Comercial & Investimentos (BCI Lusofonia)',
    partnerType: 'bancario',
    categoryLabel: 'Parceiro Bancário & Crédito',
    logo: '🏛️',
    country: 'Moçambique / Portugal',
    sector: 'Serviços Financeiros & Linhas de Garantia Mútua',
    website: 'https://bci.co.mz',
    headline: 'Linha exclusiva de microcrédito e abertura simplificada de contas para startups ABN',
    jointProjectsCount: 2,
    startupsSupportedCount: 95,
    mouStatus: 'assinado',
    badge: 'Banca Corporativa'
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

    // Se estiver a pedir candidaturas para o painel de admin
    if (view === 'admin_applications') {
      const applications = await PartnerApplication.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({
        success: true,
        applications
      });
    }

    // Identificar status do utilizador atual
    let partnerProfile: any = sessionUser?.partnerProfile || null;
    let partnerStatus = partnerProfile?.status || 'candidato';
    const isApproved = partnerStatus === 'aprovado';

    // Se não tiver ainda perfil estruturado na BD, fornecer perfil inicial enriquecido para a sessão
    if (!partnerProfile || !partnerProfile.organizationName) {
      partnerProfile = {
        status: partnerStatus,
        partnerType: partnerProfile?.partnerType || 'estrategico',
        organizationName: partnerProfile?.organizationName || sessionUser?.company || 'Agência Lusófona de Inovação & Negócios',
        organizationLogo: partnerProfile?.organizationLogo || '🏢',
        headline: partnerProfile?.headline || 'Parceiro Estratégico para Aceleração e Internacionalização no Espaço Lusófono',
        sector: partnerProfile?.sector || sessionUser?.sector || 'Inovação Aberta & Desenvolvimento Económico',
        country: partnerProfile?.country || sessionUser?.country || 'Moçambique',
        city: partnerProfile?.city || sessionUser?.city || 'Maputo',
        website: partnerProfile?.website || sessionUser?.website || 'https://alin-lusofonia.org',
        institutionalBio: partnerProfile?.institutionalBio || 'Organização dedicada à ligação entre grandes empresas, entidades governamentais e ecossistemas de startups e PMEs inovadoras em África e na Diáspora.',
        focalPoint: {
          name: partnerProfile?.focalPoint?.name || sessionUser?.name || 'Diretor de Relações Institucionais',
          role: partnerProfile?.focalPoint?.role || 'Head of Strategic Partnerships',
          email: partnerProfile?.focalPoint?.email || sessionUser?.email || 'parcerias@afrobiznet.com',
          phone: partnerProfile?.focalPoint?.phone || sessionUser?.phone || '+258 84 900 1234'
        },
        partnershipAgreement: {
          mouStatus: isApproved ? 'assinado' : 'em_revisao',
          signedDate: isApproved ? new Date(Date.now() - 86400000 * 90) : null,
          mouUrl: 'https://afrobiznet.com/docs/protocolo-parceria-abn-oficial.pdf'
        },
        jointProjects: [
          {
            title: 'InovaÁfrica: Programa de Aceleração Agrotech 2026',
            description: 'Programa conjunto de capacitação técnica, mentoria e bolsa para 30 startups agrotech de Moçambique e Guiné-Bissau.',
            category: 'Aceleração & Inovação',
            status: 'em_andamento',
            budget: '45.000 €',
            goals: ['30 startups capacitadas', '10 MVPs validados no terreno', '5 rodadas de investimento'],
            startDate: '2026-02-01',
            endDate: '2026-08-30'
          },
          {
            title: 'Desafio Lusófono de Inovação Aberta B2B',
            description: 'Hackathon corporativo conectando PMEs tradicionais a soluções tecnológicas criadas por startups do ecossistema ABN.',
            category: 'Inovação Aberta',
            status: 'planeamento',
            budget: '25.000 €',
            goals: ['15 desafios corporativos mapeados', '50 candidaturas recebidas', '3 contratos-piloto firmados'],
            startDate: '2026-10-15',
            endDate: '2026-12-20'
          }
        ],
        jointEvents: [
          {
            title: 'Fórum Económico da Lusofonia & Empreendedorismo ABN',
            date: '2026-04-18',
            location: 'Híbrido (Maputo & Transmissão Global ABN)',
            type: 'Conferência & Matchmaking B2B',
            status: 'agendado',
            link: 'https://meet.google.com/abn-forum-parceiro-2026'
          },
          {
            title: 'Webinar: Estratégias de Financiamento Bilateral para PMEs',
            date: '2026-05-12',
            location: 'Sala Virtual ABN Meet',
            type: 'Webinar Executivo',
            status: 'agendado',
            link: 'https://meet.google.com/abn-webinar-fin-2026'
          }
        ],
        campaigns: [
          {
            title: 'Campanha Conjunta de Atração de Startups Mulheres Empreendedoras',
            channel: 'Rede ABN, LinkedIn, Rádio Comunitária e Newsletters',
            reach: '12.500+ Fundadores',
            status: 'ativa'
          },
          {
            title: 'Divulgação da Linha de Microcrédito e Garantias PME',
            channel: 'Portal ABN, E-mail Broadcast e Redes Sociais',
            reach: '8.000+ PMEs',
            status: 'ativa'
          }
        ],
        documents: [
          {
            title: 'Protocolo de Cooperação Estratégica ABN (MOU Assinado)',
            category: 'Acordo / Protocolo Oficial',
            fileUrl: '/docs/MOU_ABN_Parceria_Oficial.pdf',
            uploadedAt: new Date(Date.now() - 86400000 * 60)
          },
          {
            title: 'Kit de Marca Conjunta & Brand Guidelines ABN-Parceiro',
            category: 'Identidade Visual & Comunicação',
            fileUrl: '/docs/Kit_Marca_ABN_Parceiro.pdf',
            uploadedAt: new Date(Date.now() - 86400000 * 45)
          },
          {
            title: 'Relatório Trimestral de Impacto & Startups Apoiadas - Q1 2026',
            category: 'Relatório de Impacto',
            fileUrl: '/docs/Relatorio_Impacto_Q1_2026.pdf',
            uploadedAt: new Date(Date.now() - 86400000 * 15)
          }
        ],
        metrics: {
          startupsSupported: 42,
          jointInitiatives: 4,
          capitalMobilized: '70.000 €',
          communityReach: 20500
        }
      };
    }

    // Contactos oficiais de suporte institucional ABN
    const abnInstitutionalContacts = [
      {
        name: 'Dra. Isabela Vaz',
        role: 'Diretora de Parcerias Globais & Relações Institucionais ABN',
        email: 'parcerias@afrobiznet.com',
        phone: '+245 955 00 1122',
        availability: 'Segunda a Sexta (09:00 - 17:00 GMT)'
      },
      {
        name: 'Afonso Domingos',
        role: 'Presidente & Coordenador de Programas Estruturantes ABN',
        email: 'direcao@afrobiznet.com',
        phone: '+258 84 900 0000',
        availability: 'Reuniões institucionais sob agendamento'
      },
      {
        name: 'Gabinete Jurídico & Compliance ABN',
        role: 'Gestão de Protocolos, MOUs e Acordos Bilaterais',
        email: 'juridico@afrobiznet.com',
        phone: '+351 91 000 3344',
        availability: 'Acompanhamento de minutas contratuais'
      }
    ];

    return NextResponse.json({
      success: true,
      partnerStatus: partnerProfile.status || 'candidato',
      isApproved: partnerProfile.status === 'aprovado',
      partnerProfile,
      abnInstitutionalContacts,
      curatedPartners: CURATED_OFFICIAL_PARTNERS
    });

  } catch (error: any) {
    console.error('Error in GET /api/partners:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
        if (uid) {
          sessionUser = await User.findById(uid);
        }
      } catch (e) {}
    }

    const body = await request.json();
    const { action } = body;

    // 1. AÇÃO: Submeter Candidatura ("Torne-se Parceiro ABN")
    if (action === 'apply') {
      const {
        organizationName,
        organizationType,
        partnerCategory,
        focalPointName,
        focalPointEmail,
        focalPointPhone,
        focalPointRole,
        website,
        country,
        city,
        motivationMessage,
        proposalHighlights
      } = body;

      if (!organizationName || !focalPointName || !focalPointEmail || !motivationMessage) {
        return NextResponse.json({ 
          success: false, 
          message: 'Por favor preencha todos os campos obrigatórios da candidatura.' 
        }, { status: 400 });
      }

      // Criar registo de candidatura
      const application = await PartnerApplication.create({
        userId: sessionUser?._id || null,
        organizationName,
        organizationType: organizationType || 'institucional',
        partnerCategory: partnerCategory || 'estratego',
        focalPointName,
        focalPointEmail,
        focalPointPhone: focalPointPhone || '',
        focalPointRole: focalPointRole || '',
        website: website || '',
        country: country || '',
        city: city || '',
        motivationMessage,
        proposalHighlights: Array.isArray(proposalHighlights) ? proposalHighlights : [],
        status: 'candidato'
      });

      // Se utilizador estiver logado, atualizar perfil como 'candidato' e garantir role 'parceiro'
      if (sessionUser) {
        const roles = Array.isArray(sessionUser.roles) ? [...sessionUser.roles] : [sessionUser.role || 'empreendedor'];
        if (!roles.includes('parceiro')) {
          roles.push('parceiro');
        }
        sessionUser.roles = roles;
        
        sessionUser.partnerProfile = {
          ...(sessionUser.partnerProfile || {}),
          status: 'candidato',
          partnerType: partnerCategory || 'estrategico',
          organizationName,
          website: website || sessionUser.website || '',
          country: country || sessionUser.country || '',
          city: city || sessionUser.city || '',
          institutionalBio: motivationMessage,
          focalPoint: {
            name: focalPointName,
            role: focalPointRole || 'Ponto Focal Oficial',
            email: focalPointEmail,
            phone: focalPointPhone || ''
          },
          partnershipAgreement: {
            mouStatus: 'pendente'
          }
        };

        await sessionUser.save();
      }

      return NextResponse.json({
        success: true,
        message: 'Candidatura a Parceiro ABN submetida com sucesso! A Direção Institucional entrará em contacto brevemente.',
        applicationId: application._id
      });
    }

    // 2. AÇÃO: Alternar Estado (Demo / Teste entre Candidato e Aprovado)
    if (action === 'toggle_status_demo') {
      if (!sessionUser) {
        return NextResponse.json({ success: false, message: 'Autenticação necessária' }, { status: 401 });
      }

      const currentStatus = sessionUser.partnerProfile?.status || 'candidato';
      const newStatus = currentStatus === 'aprovado' ? 'candidato' : 'aprovado';

      if (!sessionUser.partnerProfile) {
        sessionUser.partnerProfile = {};
      }
      sessionUser.partnerProfile.status = newStatus;
      
      const roles = Array.isArray(sessionUser.roles) ? [...sessionUser.roles] : ['empreendedor'];
      if (!roles.includes('parceiro')) {
        roles.push('parceiro');
      }
      sessionUser.roles = roles;

      await sessionUser.save();

      return NextResponse.json({
        success: true,
        message: `Status do Parceiro alterado para "${newStatus === 'aprovado' ? 'Parceiro Oficial Aprovado' : 'Candidato a Parceiro'}" com sucesso.`,
        newStatus
      });
    }

    // 3. AÇÃO: Atualizar Perfil Institucional
    if (action === 'update_profile') {
      if (!sessionUser) {
        return NextResponse.json({ success: false, message: 'Autenticação necessária' }, { status: 401 });
      }

      const {
        organizationName,
        headline,
        sector,
        country,
        city,
        website,
        institutionalBio,
        focalPoint
      } = body;

      if (!sessionUser.partnerProfile) {
        sessionUser.partnerProfile = {};
      }

      if (organizationName) sessionUser.partnerProfile.organizationName = organizationName;
      if (headline) sessionUser.partnerProfile.headline = headline;
      if (sector) sessionUser.partnerProfile.sector = sector;
      if (country) sessionUser.partnerProfile.country = country;
      if (city) sessionUser.partnerProfile.city = city;
      if (website) sessionUser.partnerProfile.website = website;
      if (institutionalBio) sessionUser.partnerProfile.institutionalBio = institutionalBio;
      if (focalPoint) {
        sessionUser.partnerProfile.focalPoint = {
          ...sessionUser.partnerProfile.focalPoint,
          ...focalPoint
        };
      }

      await sessionUser.save();

      return NextResponse.json({
        success: true,
        message: 'Perfil institucional do parceiro atualizado com sucesso.',
        partnerProfile: sessionUser.partnerProfile
      });
    }

    // 4. AÇÃO: Propor / Adicionar Projeto Conjunto
    if (action === 'add_project') {
      if (!sessionUser) {
        return NextResponse.json({ success: false, message: 'Autenticação necessária' }, { status: 401 });
      }

      const { title, description, category, budget, goals, startDate, endDate } = body;
      if (!title) {
        return NextResponse.json({ success: false, message: 'Título do projeto é obrigatório' }, { status: 400 });
      }

      if (!sessionUser.partnerProfile) sessionUser.partnerProfile = {};
      if (!Array.isArray(sessionUser.partnerProfile.jointProjects)) sessionUser.partnerProfile.jointProjects = [];

      const newProj = {
        title,
        description: description || '',
        category: category || 'Inovação & Empreendedorismo',
        status: 'planeamento',
        budget: budget || 'A definir',
        goals: Array.isArray(goals) ? goals : (goals ? [goals] : []),
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || ''
      };

      sessionUser.partnerProfile.jointProjects.push(newProj);
      if (!sessionUser.partnerProfile.metrics) sessionUser.partnerProfile.metrics = {};
      sessionUser.partnerProfile.metrics.jointInitiatives = (sessionUser.partnerProfile.metrics.jointInitiatives || 0) + 1;

      await sessionUser.save();

      return NextResponse.json({
        success: true,
        message: 'Projeto conjunto submetido à Direção de Parcerias ABN com sucesso.',
        project: newProj
      });
    }

    // 5. AÇÃO: Propor / Adicionar Evento Conjunto
    if (action === 'add_event') {
      if (!sessionUser) {
        return NextResponse.json({ success: false, message: 'Autenticação necessária' }, { status: 401 });
      }

      const { title, date, location, type, link } = body;
      if (!title) {
        return NextResponse.json({ success: false, message: 'Título do evento é obrigatório' }, { status: 400 });
      }

      if (!sessionUser.partnerProfile) sessionUser.partnerProfile = {};
      if (!Array.isArray(sessionUser.partnerProfile.jointEvents)) sessionUser.partnerProfile.jointEvents = [];

      const newEv = {
        title,
        date: date || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        location: location || 'Online ABN Meet',
        type: type || 'Webinar / Workshop',
        status: 'agendado',
        link: link || 'https://meet.google.com/abn-partner-session'
      };

      sessionUser.partnerProfile.jointEvents.push(newEv);
      await sessionUser.save();

      return NextResponse.json({
        success: true,
        message: 'Evento conjunto agendado com sucesso.',
        event: newEv
      });
    }

    // 6. AÇÃO: Adicionar Campanha Conjunta
    if (action === 'add_campaign') {
      if (!sessionUser) {
        return NextResponse.json({ success: false, message: 'Autenticação necessária' }, { status: 401 });
      }

      const { title, channel, reach } = body;
      if (!title) {
        return NextResponse.json({ success: false, message: 'Título da campanha é obrigatório' }, { status: 400 });
      }

      if (!sessionUser.partnerProfile) sessionUser.partnerProfile = {};
      if (!Array.isArray(sessionUser.partnerProfile.campaigns)) sessionUser.partnerProfile.campaigns = [];

      const newCamp = {
        title,
        channel: channel || 'Rede ABN & Canais Parceiro',
        reach: reach || '5.000+ Empreendedores',
        status: 'ativa'
      };

      sessionUser.partnerProfile.campaigns.push(newCamp);
      await sessionUser.save();

      return NextResponse.json({
        success: true,
        message: 'Campanha de divulgação conjunta registada com sucesso.',
        campaign: newCamp
      });
    }

    // 7. AÇÃO: Carregar Documento / Acordo
    if (action === 'add_document') {
      if (!sessionUser) {
        return NextResponse.json({ success: false, message: 'Autenticação necessária' }, { status: 401 });
      }

      const { title, category, fileUrl } = body;
      if (!title) {
        return NextResponse.json({ success: false, message: 'Título do documento é obrigatório' }, { status: 400 });
      }

      if (!sessionUser.partnerProfile) sessionUser.partnerProfile = {};
      if (!Array.isArray(sessionUser.partnerProfile.documents)) sessionUser.partnerProfile.documents = [];

      const newDoc = {
        title,
        category: category || 'Documento Oficial',
        fileUrl: fileUrl || '#',
        uploadedAt: new Date()
      };

      sessionUser.partnerProfile.documents.push(newDoc);
      await sessionUser.save();

      return NextResponse.json({
        success: true,
        message: 'Documento adicionado ao repositório da parceria com sucesso.',
        document: newDoc
      });
    }

    // 8. AÇÃO: Administrador Aprova Candidato
    if (action === 'admin_approve') {
      const { applicationId, targetUserId } = body;

      if (applicationId) {
        await PartnerApplication.findByIdAndUpdate(applicationId, {
          status: 'aprovado',
          reviewedAt: new Date(),
          reviewedBy: sessionUser?.name || 'Administrador ABN'
        });
      }

      if (targetUserId) {
        const targetUser = await User.findById(targetUserId);
        if (targetUser) {
          const roles = Array.isArray(targetUser.roles) ? [...targetUser.roles] : ['empreendedor'];
          if (!roles.includes('parceiro')) roles.push('parceiro');
          targetUser.roles = roles;
          if (!targetUser.partnerProfile) targetUser.partnerProfile = {};
          targetUser.partnerProfile.status = 'aprovado';
          if (!targetUser.partnerProfile.partnershipAgreement) targetUser.partnerProfile.partnershipAgreement = {};
          targetUser.partnerProfile.partnershipAgreement.mouStatus = 'assinado';
          targetUser.partnerProfile.partnershipAgreement.signedDate = new Date();
          await targetUser.save();
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Candidato a parceiro aprovado com sucesso! Credencial institucional ativada.'
      });
    }

    return NextResponse.json({ success: false, message: 'Ação não reconhecida.' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in POST /api/partners:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
