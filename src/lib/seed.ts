import dbConnect from './mongodb';
import User from '../models/User';
import Business from '../models/Business';
import Service from '../models/Service';
import Config from '../models/Config';
import Hub from '../models/Hub';
import Program from '../models/Program';
import Team from '../models/Team';
import bcrypt from 'bcryptjs';

export async function seedAdmin() {
  try {
    await dbConnect();
    
    // 0. Seed Platform Configurations
    const defaultConfigs = [
      {
        key: 'hero_content',
        value: {
          title: 'Impulsionando Startups e PMEs em África',
          description: 'A ABN – AfroBiz Network é o principal ecossistema de negócios e empreendedorismo para o mercado africano e afrodescendente. Conectamos startups, PMEs, mentores, investidores e parceiros estratégicos para impulsionar o crescimento de impacto global.',
          banners: ['/Perfil01.jpg', '/Perfil04.jpg', '/Perfil05.jpg', '/Perfil02.jpg']
        }
      },
      {
        key: 'stats_content',
        value: [
          { label: 'Alumni', value: '968' },
          { label: 'Parceiros Privados', value: '14+' },
          { label: 'Mulheres Empreendedoras', value: '13%' },
          { label: 'Empregos Apoiados', value: '5K+' }
        ]
      },
      {
        key: 'platform_logo',
        value: '/abn-logo.png'
      },
      {
        key: 'partners_content',
        value: [
          { name: 'African Union', logo: '🌍' },
          { name: 'AfDB', logo: '🏦' },
          { name: 'UNDP', logo: '🇺🇳' },
          { name: 'TechHub Luanda', logo: '💻' },
          { name: 'Startup Moçambique', logo: '🚀' },
          { name: 'Global Invest', logo: '📈' }
        ]
      },
      {
        key: 'features_content',
        value: [
          {
            num: '01',
            title: 'INCUBAÇÃO E ACELERAÇÃO GLOBAL',
            bullets: [
              'Desenvolvimento de Startups e MPMEs',
              'Programas de incubação e aceleração',
              'Estruturação de modelos de negócio',
              'Mentoria estratégica e Smart Money'
            ]
          },
          {
            num: '02',
            title: 'CAPACITAÇÃO E EDUCAÇÃO EXECUTIVA',
            bullets: [
              'Formação empreendedora certificada',
              'Desenvolvimento de liderança',
              'Consultoria estratégica',
              'Capacitação técnica e empresarial'
            ]
          },
          {
            num: '03',
            title: 'INVESTIMENTO E PARTICIPAÇÃO',
            bullets: [
              'Venture Builder',
              'Gestão de portfólio',
              'Participação em negócios inovadores',
              'Curadoria de projetos de alto potencial'
            ]
          },
          {
            num: '04',
            title: 'NETWORKING E FACILITAÇÃO DE MERCADOS',
            bullets: [
              'Conexão intercontinental',
              'Corredores internacionais de negócios',
              'Plataforma digital de integração',
              'Parcerias e alianças estratégicas globais'
            ]
          },
          {
            num: '05',
            title: 'SUSTENTABILIDADE E POLÍTICAS PÚBLICAS',
            bullets: [
              'Soluções verdes e tecnológicas',
              'Economia circular',
              'Inclusão econômica',
              'Advocacy e influência institucional'
            ]
          }
        ]
      },
      {
        key: 'how_it_works_content',
        value: [
          {
            number: '01',
            title: 'Registo & Perfil',
            description: 'Crie a sua conta e defina o perfil do seu negócio em minutos.'
          },
          {
            number: '02',
            title: 'Diagnóstico',
            description: 'Avaliamos as necessidades da sua startup e sugerimos o melhor caminho.'
          },
          {
            number: '03',
            title: 'Crescimento',
            description: 'Aceda a mentorias, marketplace de serviços e rede de investidores.'
          },
          {
            number: '04',
            title: 'Escala Global',
            description: 'Expanda o seu negócio para novos mercados com suporte contínuo.'
          }
        ]
      },
      {
        key: 'testimonials_content',
        value: [
          {
            name: 'João Silva',
            role: 'CEO, TechAfrica',
            text: 'A ABN mudou completamente a forma como abordamos o mercado global. O suporte em marketing foi fundamental.',
            img: '/Perfil04.jpg'
          },
          {
            name: 'Maria Santos',
            role: 'Fundadora, AgroEco',
            text: 'O programa de incubação ABN Spark ajudou-me a validar a minha ideia e a conseguir o primeiro investimento.',
            img: '/Perfil02.jpg'
          },
          {
            name: 'Carlos Oliveira',
            role: 'Investidor Anjo',
            text: 'Encontrei startups de alta qualidade através da plataforma. A curadoria da ABN é excelente.',
            img: '/Perfil05.jpg'
          }
        ]
      },
      {
        key: 'faq_content',
        value: [
          {
            question: 'O que é a ABN – AfroBiz Network?',
            answer: 'A ABN é um ecossistema de negócios e empreendedorismo focado na incubação de startups e no desenvolvimento de PMEs em África, oferecendo ferramentas, mentoria e conexões estratégicas.'
          },
          {
            question: 'Como funciona o programa de incubação?',
            answer: 'O nosso programa divide-se em fases: Ideação, Validação, Crescimento e Escala. Cada fase tem marcos específicos e suporte personalizado de mentores especialistas.'
          },
          {
            question: 'Qualquer pessoa pode se juntar à rede?',
            answer: 'Sim, aceitamos empreendedores, startups, investidores e mentores que queiram contribuir para o ecossistema de negócios em África.'
          },
          {
            question: 'Como posso obter o website e portfólio grátis?',
            answer: 'Ao registar-se como PME no nosso ecossistema, terá acesso automático à nossa oferta de lançamento que inclui 4 meses de presença digital profissional gratuita.'
          }
        ]
      },
      {
        key: 'supported_companies',
        value: [
          {
            name: 'TechAfrica Solutions',
            location: 'Luanda, Angola',
            desc: 'Especialistas em transformar processos analógicos em experiências digitais de alta performance.',
            icon: '💻',
            phase: 'Crescimento'
          },
          {
            name: 'AgroEco Moçambique',
            location: 'Maputo, Moçambique',
            desc: 'Soluções sustentáveis e inovadoras para pequenos e médios produtores agrícolas.',
            icon: '🌱',
            phase: 'Validação'
          },
          {
            name: 'AfroStyle Fashion',
            location: 'Maputo, Moçambique',
            desc: 'Design de moda contemporânea inspirado em tecidos e padrões tradicionais africanos.',
            icon: '👕',
            phase: 'Ideação'
          }
        ]
      },
      {
        key: 'mission_images',
        value: ['/mission_team.png']
      },
      {
        key: 'team_content',
        value: [
          {
            name: 'Culpa Francisco Xavier',
            role: 'Fundador e Vice-Director',
            country: 'Mocambique',
            linkedin: '',
            image: '/Perfil01.jpg',
            bio: 'Culpa Francisco Xavier é um jovem líder, consultor e especialista em Educação, Tecnologia, Ciência e Inovação, ex-Comissário da União da Juventude Africana. NO MOMENTO VICE DIRECTOR DA Comissão da Juventude da uniao Áfricana para África Austral. É fundador da CCA – Consulting and Coaching Agency, da ODEI – Organização para o Desenvolvimento e Educação Infantil e da Afrobiz Network (ABN), plataforma de conexão e fortalecimento de negócios africanos, atualmente presente em 13 países.\n\nCom mais de 18 anos de experiência em projetos ligados à primeira infância, juventude, liderança e transformação social, já foi reconhecido como Jovem da Mudança pela Save the Children e Estudante referencia pela Universidade Eduardo Mondlane além de ter a formação de Formador pela UNICEF.'
          },
          {
            name: 'Afonso Domingos',
            role: 'Co-Fundador e CTO / Developer',
            country: 'Mocambique',
            linkedin: '',
            image: '/Perfil05.jpg',
            bio: 'Afonso Domingos é um profissional moçambicano de TI e autodidata em inovação com mais de 6 anos de experiência. Formado em Multimédia, lidera a RPA Moçambique e é especialista em IA e soluções digitais escaláveis.\n\nAo longo de sua jornada, Afonso tem se destacado na criação de ecossistemas tecnológicos que resolvem problemas reais. Como fundador do Inscreva-se, ele trouxe uma visão de simplificação e eficiência para o mercado africano de eventos, integrando inteligência artificial e processos automatizados para maximizar resultados.\n\nSuas especialidades incluem desenvolvimento de software, automação de processos (RPA), estratégia de produto e liderança de equipes técnicas. Ele acredita que a tecnologia deve ser um facilitador do progresso humano e trabalha incansavelmente para democratizar o acesso a soluções de ponta.'
          }
        ]
      }
    ];

    for (const c of defaultConfigs) {
      await Config.findOneAndUpdate(
        { key: c.key },
        { value: c.value },
        { upsert: true, new: true }
      );
      console.log(`Configuração ${c.key} processada.`);
    }

    // 1. Seed Users with hashed passwords
    const usersData = [
      { name: 'Super Admin ABN', email: 'info@afrobiznetwork.com', password: '@Admin123@', role: 'admin' },
      { name: 'João Silva', email: 'joao@email.com', password: 'password123', role: 'empreendedor' },
      { name: 'Maria Santos', email: 'maria@email.com', password: 'password123', role: 'startup' },
    ];

    const usersMap: Record<string, any> = {};

    for (const u of usersData) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      let user = await User.findOneAndUpdate(
        { email: u.email.toLowerCase() },
        { name: u.name, password: hashedPassword, role: u.role },
        { upsert: true, new: true }
      );
      console.log(`Usuário ${u.email} processado.`);
      usersMap[u.email] = user._id;
    }

    // 2. Seed Businesses (Startups)
    const businessesData = [
      {
        name: 'TechAfrica Solutions',
        category: 'Tecnologia',
        description: 'Especialistas em transformar processos analógicos em experiências digitais de alta performance para o mercado africano.',
        location: 'Luanda, Angola',
        owner: usersMap['info@afrobiznetwork.com'],
        isIncubated: true,
        incubationPhase: 'Crescimento',
        stats: { projects: 12, rating: 4.8, clients: 34 },
      },
      {
        name: 'AgroEco Moçambique',
        category: 'Agricultura',
        description: 'Soluções sustentáveis e inovadoras para pequenos e médios produtores agrícolas, conectando-os ao mercado digital.',
        location: 'Maputo, Moçambique',
        owner: usersMap['joao@email.com'],
        isIncubated: true,
        incubationPhase: 'Validação',
        stats: { projects: 5, rating: 4.5, clients: 18 },
      },
      {
        name: 'AfroStyle Fashion',
        category: 'Moda',
        description: 'Design de moda contemporânea inspirado em tecidos e padrões tradicionais africanos, levando a cultura ao mundo.',
        location: 'Maputo, Moçambique',
        owner: usersMap['maria@email.com'],
        isIncubated: true,
        incubationPhase: 'Ideação',
        stats: { projects: 3, rating: 4.2, clients: 9 },
      },
    ];

    for (const b of businessesData) {
      const exists = await Business.findOne({ name: b.name });
      if (!exists) {
        await Business.create(b);
        console.log(`Negócio ${b.name} criado.`);
      }
    }

    // 3. Seed Services
    const servicesData = [
      {
        name: 'Criação de Website + Portfólio',
        description: 'Presença digital profissional e moderna com 4 meses de hospedagem e manutenção grátis. Inclui domínio e SEO básico.',
        price: 'Grátis (4 meses)',
        category: 'Marketing Digital',
        status: 'ativo',
      },
      {
        name: 'Mentoria Estratégica',
        description: 'Acompanhamento personalizado com mentores especialistas para accelerar o crescimento do seu negócio.',
        price: 'Sob Consulta',
        category: 'Incubação',
        status: 'ativo',
      },
      {
        name: 'Gestão de Redes Sociais',
        description: 'Gestão profissional das suas redes sociais com conteúdo estratégico, análise de métricas e relatórios mensais.',
        price: '15.000 MT/mês',
        category: 'Marketing Digital',
        status: 'ativo',
      },
    ];

    for (const s of servicesData) {
      const exists = await Service.findOne({ name: s.name });
      if (!exists) {
        await Service.create(s);
        console.log(`Serviço ${s.name} criado.`);
      }
    }

    // 4. Seed Hub (Guiné-Bissau)
    const gbHubData = {
      name: 'Guiné-Bissau',
      slug: 'quinebissau',
      image: '/guine_bissau_banner.png',
      description: 'A delegação da ABN em Guiné-Bissau fomenta o ecossistema de empreendedorismo local através de incubação acelerada de ideias, conexão com investidores internacionais e facilitação de redes de mercados sustentáveis.',
      steps: [
        { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio ou ideia de impacto.' },
        { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor à nossa comissão de mentores.' },
        { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica personalizada e recursos para expansão.' }
      ],
      faqs: [
        { question: 'Quem se pode candidatar?', answer: 'Jovens guineenses residentes em Bissau, estudantes ou profissionais com projetos inovadores de base tecnológica ou sustentável.' },
        { question: 'Existe algum custo associado?', answer: 'Não, todos os programas oferecidos pela ABN Guiné-Bissau são totalmente gratuitos.' }
      ],
      address: 'Bissau, Guiné-Bissau - Avenida Combatentes da Liberdade da Pátria',
      email: 'guinebissau@afrobiznetwork.com',
      phone: '+245 955 000 000',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      linkedinUrl: 'https://linkedin.com',
      events: [
        {
          title: 'Fórum de Adaptação de Lideranças Juvenis',
          date: '14 de Outubro de 2026',
          description: 'Encontro de jovens empreendedores e líderes focado no desenvolvimento de competências verdes e negócios de impacto ecológico.',
          type: 'future',
          link: 'https://wa.me/258845773974'
        },
        {
          title: 'Workshop Mentoria Spark Guiné',
          date: '12 de Fevereiro de 2026',
          description: 'Sessão intensiva de ideação e validação de modelos de negócio para startups locais na fase inicial.',
          type: 'past',
          image: '/guine_bissau_banner.png'
        }
      ],
      representative: {
        name: 'Mamadu Baldé',
        role: 'Diretor de Delegação - ABN Guiné-Bissau',
        email: 'mamadu.balde@afrobiznetwork.com',
        phone: '+245 955 123 456',
        image: '/default-avatar.png'
      },
      team: [
        { name: 'Fatoumata Djaló', role: 'Gestora de Programas e Incubação', image: '/default-avatar.png' },
        { name: 'Umaro Sissoco', role: 'Coordenador de Parcerias e Impacto', image: '/default-avatar.png' }
      ],
      partners: [
        { name: 'Startup Bissau', logo: '🚀' },
        { name: 'Banco da Guiné', logo: '🏦' },
        { name: 'Mentores GB', logo: '🤝' }
      ]
    };

    const gbHub = await Hub.findOne({ slug: 'quinebissau' });
    if (!gbHub) {
      await Hub.create(gbHubData);
      console.log('Hub Guiné-Bissau seeded.');
    } else {
      await Hub.findOneAndUpdate({ slug: 'quinebissau' }, gbHubData, { new: true });
      console.log('Hub Guiné-Bissau updated in seed.');
    }

    // 5. Seed Entrepreneur Clubs
    const clubsData = [
      {
        title: 'Clube de Empreendedores de Sofala',
        description: 'O Clube de Empreendedores da província de Sofala é uma iniciativa da ABN dedicada a fomentar o ecossistema empreendedor local, conectando empreendedores, mentores e investidores para impulsionar o desenvolvimento económico da região.',
        isClub: true,
        province: 'Sofala',
        phase: 'Networking',
        missao: 'Promover o desenvolvimento do ecossistema empreendedor na província de Sofala através da capacitação, networking e acesso a oportunidades de negócios.',
        visao: 'Ser a referência provincial em apoio ao empreendedorismo, transformando Sofala num hub de inovação e desenvolvimento económico sustentável.',
        valores: 'Inovação, Integridade, Colaboração, Sustentabilidade, Excelência, Inclusão',
        objectivos: '- Capacitar 500 empreendedores até 2027\n- Facilitar o acesso a financiamento para startups locais\n- Criar uma rede de 100 mentores activos\n- Promover a internacionalização de negócios de Sofala\n- Fomentar a economia circular e sustentável',
        areasActuacao: '- Tecnologia e Inovação\n- Agricultura e Agroprocessamento\n- Turismo e Hospitalidade\n- Serviços Financeiros\n- Energias Renováveis\n- Indústria Transformadora',
        actividades: '- Workshops mensais de capacitação\n- Pitch sessions com investidores\n- Mentoria individual e em grupo\n- Networking events trimestrais\n- Visitas técnicas a empresas de sucesso\n- Hackathons e desafios de inovação\n- Feiras de empreendedorismo',
        beneficiosMembros: '- Acesso a mentoria especializada\n- Participação em eventos exclusivos\n- Networking com outros empreendedores\n- Acesso a oportunidades de financiamento\n- Formação contínua e workshops\n- Visibilidade na plataforma ABN\n- Descontos em serviços parceiros',
        compromissoMembros: '- Participar activamente nas actividades do clube\n- Compartilhar conhecimento e experiências\n- Contribuir para o crescimento do ecossistema\n- Respeitar os valores e código de conduta\n- Pagar a quota de associação (quando aplicável)\n- Promover a iniciativa do clube',
        lema: 'Unidos pelo Empreendedorismo',
        status: 'ativo',
        order: 1
      },
      {
        title: 'Clube de Empreendedores de Gaza',
        description: 'O Clube de Empreendedores da província de Gaza é uma plataforma da ABN focada em desenvolver o potencial empreendedor da região, com especial ênfase na agricultura, turismo e inovação tecnológica.',
        isClub: true,
        province: 'Gaza',
        phase: 'Networking',
        missao: 'Impulsionar o empreendedorismo na província de Gaza através da formação, conexão estratégica e apoio ao desenvolvimento de negócios sustentáveis.',
        visao: 'Tornar Gaza num centro de excelência empreendedora, reconhecido nacionalmente pela inovação e impacto económico.',
        valores: 'Solidariedade, Inovação, Perseverança, Sustentabilidade, Respeito, Cooperação',
        objectivos: '- Formar 300 empreendedores em 3 anos\n- Apoiar a criação de 50 novas startups\n- Estabelecer parcerias com 20 instituições\n- Promover o empreendedorismo feminino\n- Desenvolver o sector agropecuário',
        areasActuacao: '- Agricultura e Pecuária\n- Turismo e Ecoturismo\n- Tecnologia Agrícola (AgTech)\n- Comércio e Serviços\n- Artesanato e Cultura\n- Energia Solar',
        actividades: '- Formação em gestão de negócios\n- Dias de campo e demonstrações técnicas\n- Concursos de ideias de negócios\n- Encontros com investidores\n- Visitas a cooperativas de sucesso\n- Sessões de mentoria presencial e online\n- Feiras agrícolas e de artesanato',
        beneficiosMembros: '- Formação técnica e empresarial\n- Acesso a redes de contacto\n- Oportunidades de financiamento\n- Acompanhamento personalizado\n- Participação em eventos nacionais\n- Divulgação de produtos/serviços\n- Certificação de qualidade',
        compromissoMembros: '- Assiduidade nas formações e eventos\n- Aplicação dos conhecimentos adquiridos\n- Colaboração com outros membros\n- Defesa dos valores do clube\n- Contribuição para actividades comunitárias\n- Sustentabilidade do negócio',
        lema: 'Crescendo Juntos, Transformando Gaza',
        status: 'ativo',
        order: 2
      }
    ];

    for (const club of clubsData) {
      const exists = await Program.findOne({ title: club.title, isClub: true });
      if (!exists) {
        await Program.create(club);
        console.log(`Clube ${club.title} criado.`);
      } else {
        await Program.findOneAndUpdate({ title: club.title, isClub: true }, club, { new: true });
        console.log(`Clube ${club.title} atualizado.`);
      }
    }

    // 6. Seed Team/Leadership
    const teamData = [
      // 1. Direcção de Programas, Incubação e Sustentabilidade
      {
        name: 'Leonel Sapite',
        role: 'Director de Programas',
        department: 'Direcção de Programas, Incubação e Sustentabilidade',
        bio: 'Leonel Sapite é especialista em desenvolvimento comunitário, empreendedorismo, direitos humanos e fortalecimento institucional. Possui vasta experiência na gestão de programas e projectos de desenvolvimento, tendo contribuído para a capacitação de mais de 10.000 empreendedores em Moçambique. É Director Executivo da Organização Orientadora dos Direitos Humanos (ODH), fundador da Green Light Service, Lda. e foi reconhecido pela Fundação Dom Cabral como Professor Internacional do Programa PRAFRENTE.',
        expertise: ['Desenvolvimento Comunitário', 'Empreendedorismo', 'Direitos Humanos', 'Fortalecimento Institucional', 'Gestão de Programas'],
        responsibilities: [
          'Liderança estratégica dos programas',
          'Incubação de empresas',
          'Aceleração de negócios',
          'Sustentabilidade institucional',
          'Coordenação das equipas técnicas'
        ],
        order: 1,
        status: 'ativo'
      },
      {
        name: 'Josina Aurora Nhantumbo',
        role: 'Directora Adjunta de Programas',
        department: 'Direcção de Programas, Incubação e Sustentabilidade',
        bio: 'Josina Aurora Nhantumbo é Antropóloga e especialista em Igualdade de Género, Inclusão Social e Empoderamento Económico de Mulheres e Jovens. Possui mais de 20 anos de experiência em organismos governamentais, Nações Unidas, organizações internacionais e consultoria. Actualmente exerce funções como Especialista em Igualdade de Género na SOCODEVI, liderando iniciativas de empoderamento económico e desenvolvimento inclusivo.',
        expertise: ['Antropologia', 'Igualdade de Género', 'Inclusão Social', 'Empoderamento Económico', 'Desenvolvimento Comunitário'],
        responsibilities: [
          'Desenvolvimento e implementação dos programas',
          'Integração das abordagens de género',
          'Inclusão social',
          'Desenvolvimento comunitário'
        ],
        order: 2,
        status: 'ativo'
      },
      {
        name: 'Contardo Muarramuassa',
        role: 'Director Adjunto de Programas',
        department: 'Direcção de Programas, Incubação e Sustentabilidade',
        bio: 'Especialista em Desenvolvimento Comunitário, Desenvolvimento Humano, Planeamento Territorial, Governança Local e Salvaguardas Sociais e Ambientais. É fundador da BCC Moçambique, SU, Lda., Mestre em Planeamento Territorial e possui experiência na implementação de programas ligados ao desenvolvimento local, segurança alimentar, meios de subsistência, WASH e fortalecimento da resiliência comunitária.',
        expertise: ['Desenvolvimento Comunitário', 'Desenvolvimento Humano', 'Planeamento Territorial', 'Governança Local', 'Salvaguardas Sociais e Ambientais'],
        responsibilities: [
          'Desenho e implementação dos programas',
          'Integração de componentes de desenvolvimento comunitário',
          'Sustentabilidade',
          'Governação'
        ],
        order: 3,
        status: 'ativo'
      },
      // 2. Direcção Comercial
      {
        name: 'Cargo por preencher',
        role: 'Director Comercial',
        department: 'Direcção Comercial',
        bio: 'Responsável pela estratégia comercial, desenvolvimento de negócios, relacionamento com clientes e parceiros, expansão de mercado e crescimento sustentável das soluções da ABN.',
        expertise: ['Estratégia Comercial', 'Desenvolvimento de Negócios', 'Gestão de Clientes', 'Expansão de Mercado'],
        responsibilities: [
          'Estratégia comercial',
          'Desenvolvimento de negócios',
          'Relacionamento com clientes e parceiros',
          'Expansão de mercado',
          'Crescimento sustentável'
        ],
        order: 4,
        status: 'ativo'
      },
      // 3. Direcção de Marketing e Comunicação
      {
        name: 'Cargo por preencher',
        role: 'Director de Marketing e Comunicação',
        department: 'Direcção de Marketing e Comunicação',
        bio: 'Responsável pela comunicação institucional, posicionamento da marca ABN, marketing estratégico, relações públicas, comunicação digital e promoção das iniciativas da organização.',
        expertise: ['Comunicação Institucional', 'Marketing Estratégico', 'Relações Públicas', 'Comunicação Digital', 'Branding'],
        responsibilities: [
          'Comunicação institucional',
          'Posicionamento da marca ABN',
          'Marketing estratégico',
          'Relações públicas',
          'Comunicação digital',
          'Promoção das iniciativas'
        ],
        order: 5,
        status: 'ativo'
      },
      // 4. Direcção Jurídica
      {
        name: 'Cargo por preencher',
        role: 'Director Jurídico',
        department: 'Direcção Jurídica',
        bio: 'Responsável pelo acompanhamento jurídico, contratos, conformidade legal, regulamentação institucional e gestão de riscos jurídicos.',
        expertise: ['Direito Corporativo', 'Contratos', 'Conformidade Legal', 'Regulamentação', 'Gestão de Riscos Jurídicos'],
        responsibilities: [
          'Acompanhamento jurídico',
          'Gestão de contratos',
          'Conformidade legal',
          'Regulamentação institucional',
          'Gestão de riscos jurídicos'
        ],
        order: 6,
        status: 'ativo'
      },
      // 5. Direcção de Tecnologia e Inovação
      {
        name: 'Afonso Domingos',
        role: 'Director de Tecnologia e Inovação',
        department: 'Direcção de Tecnologia e Inovação',
        bio: 'Afonso Domingos é especialista em Inteligência Artificial, Branding e Startups, com formação em Multimédia pela Above e experiência na intersecção entre tecnologia, inovação e transformação digital. Actualmente lidera a RPA Moçambique, uma plataforma digital orientada para soluções tecnológicas e recuperação de documentos, promovendo a simplificação de processos através da inovação. Possui experiência como Especialista em Inteligência Artificial, Coordenador de TI e Consultor de Tecnologia.',
        expertise: [
          'Inteligência Artificial',
          'Transformação Digital',
          'Branding e Estratégia Digital',
          'Desenvolvimento de Startups',
          'Web Development',
          'Web Design',
          'Design de Marca',
          'Edição de Vídeo',
          'Experiência do Cliente',
          'Desenvolvimento de soluções tecnológicas'
        ],
        responsibilities: [
          'Liderar a estratégia tecnológica e de inovação',
          'Coordenar os processos de transformação digital',
          'Desenvolver soluções tecnológicas para apoiar empreendedores',
          'Promover a utilização estratégica da Inteligência Artificial',
          'Apoiar a criação e evolução das plataformas digitais',
          'Fortalecer o ecossistema de inovação tecnológica'
        ],
        order: 7,
        status: 'ativo'
      },
      // 6. Direcção de Administração, Finanças e Recursos Humanos
      {
        name: 'Lizi Cristina Mulambo',
        role: 'Directora de Administração, Finanças e Recursos Humanos',
        department: 'Direcção de Administração, Finanças e Recursos Humanos',
        bio: 'Lizi Cristina Mulambo é uma profissional sénior moçambicana com mais de 20 anos de experiência em gestão administrativa, financeira, recursos humanos e desenvolvimento organizacional, tendo exercido funções de liderança em organizações nacionais, internacionais, empresas privadas e instituições do sector financeiro. É licenciada em Administração e Gestão de Empresas e certificada como Coach Integral Sistémica. Possui experiência profissional em organizações como CAFOD, Health Alliance International, MozHOPE e ISOLMOC, Lda., bem como experiência no sector bancário e financeiro.',
        expertise: [
          'Gestão Administrativa e Financeira',
          'Gestão de Recursos Humanos',
          'Liderança Corporativa',
          'Compliance',
          'Procurement',
          'Gestão Patrimonial',
          'Gestão de Subvenções',
          'Desenvolvimento de Políticas',
          'Planeamento Estratégico',
          'Desenvolvimento Organizacional'
        ],
        responsibilities: [
          'Gestão administrativa e financeira',
          'Gestão de recursos humanos',
          'Implementação de políticas internas',
          'Compliance institucional',
          'Fortalecimento organizacional',
          'Apoio à sustentabilidade administrativa'
        ],
        order: 8,
        status: 'ativo'
      },
      {
        name: 'Yolanda',
        role: 'Assistente Administrativa',
        department: 'Direcção de Administração, Finanças e Recursos Humanos',
        bio: 'Yolanda integra a Direcção de Administração, Finanças e Recursos Humanos como Assistente Administrativa. Será responsável pelo apoio administrativo à Presidência e às Direcções Corporativas, gestão documental, organização de agendas, acompanhamento dos processos administrativos, apoio logístico às reuniões e eventos, bem como suporte às operações diárias da organização.',
        expertise: ['Apoio Administrativo', 'Gestão Documental', 'Organização de Agendas', 'Apoio Logístico'],
        responsibilities: [
          'Apoio administrativo à Presidência e Direcções',
          'Gestão documental',
          'Organização de agendas',
          'Acompanhamento dos processos administrativos',
          'Apoio logístico às reuniões e eventos',
          'Suporte às operações diárias'
        ],
        order: 9,
        status: 'ativo'
      },
      // 7. Direcção de Investimentos e Parcerias
      {
        name: 'Nádya Cristina Domingos Cosmo',
        role: 'Directora de Investimentos e Parcerias',
        department: 'Direcção de Investimentos e Parcerias',
        bio: 'Nádya Cristina Domingos Cosmo é uma profissional moçambicana com 29 anos de experiência, dos quais mais de 20 anos dedicados à gestão de recursos humanos, desenvolvimento organizacional, consultoria administrativa e fortalecimento institucional. Possui vasta experiência na criação de departamentos, negociação, desenvolvimento de parcerias estratégicas, liderança de equipas e fortalecimento das relações institucionais. É igualmente uma promotora activa de iniciativas culturais e comunitárias.',
        expertise: ['Gestão de Recursos Humanos', 'Desenvolvimento Organizacional', 'Consultoria Administrativa', 'Fortalecimento Institucional', 'Negociação', 'Parcerias Estratégicas'],
        responsibilities: [
          'Mobilização de investimentos',
          'Desenvolvimento de parcerias nacionais e internacionais',
          'Captação de recursos',
          'Construção de alianças estratégicas',
          'Fortalecimento das relações institucionais'
        ],
        order: 10,
        status: 'ativo'
      },
      // 8. Direcção de Monitoria, Avaliação e Aprendizagem (MEAL)
      {
        name: 'Gabriel Armindo',
        role: 'Director de Monitoria, Avaliação e Aprendizagem (MEAL)',
        department: 'Direcção de Monitoria, Avaliação e Aprendizagem (MEAL)',
        bio: 'Gabriel Armindo é especialista em Monitoria, Avaliação, Aprendizagem e Prestação de Contas (MEAL), Psicólogo Social e Comunitário, consultor e pesquisador. Possui experiência na implementação de sistemas de monitoria e avaliação, desenvolvimento de indicadores, dashboards, avaliação de impacto e análise de dados para programas de desenvolvimento.',
        expertise: ['Monitoria e Avaliação', 'Aprendizagem Organizacional', 'Prestação de Contas', 'Psicologia Social e Comunitária', 'Análise de Dados'],
        responsibilities: [
          'Implementação do sistema institucional de MEAL',
          'Definição de indicadores de desempenho',
          'Monitoria de resultados',
          'Avaliação de impacto dos programas',
          'Promoção da aprendizagem organizacional e melhoria contínua'
        ],
        order: 11,
        status: 'ativo'
      }
    ];

    for (const member of teamData) {
      const exists = await Team.findOne({ name: member.name, role: member.role });
      if (!exists) {
        await Team.create(member);
        console.log(`Membro ${member.name} criado.`);
      } else {
        await Team.findOneAndUpdate({ name: member.name, role: member.role }, member, { new: true });
        console.log(`Membro ${member.name} atualizado.`);
      }
    }

    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao realizar seed:', error);
    throw error;
  }
}
