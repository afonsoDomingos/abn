import dbConnect from './mongodb';
import User from '../models/User';
import Business from '../models/Business';
import Service from '../models/Service';
import Config from '../models/Config';
import Hub from '../models/Hub';
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
    const gbHub = await Hub.findOne({ slug: 'quinebissau' });
    if (!gbHub) {
      await Hub.create({
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
            type: 'past'
          }
        ]
      });
      console.log('Hub Guiné-Bissau seeded.');
    }

    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao realizar seed:', error);
    throw error;
  }
}
