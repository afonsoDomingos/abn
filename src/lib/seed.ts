import dbConnect from './mongodb';
import User from '../models/User';
import Business from '../models/Business';
import Service from '../models/Service';
import Config from '../models/Config';
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
          description: 'A ABN – AfroBiz Network é a sua ponte para o sucesso digital. Conectamos empreendedores a mentores, investidores e recursos estratégicos para transformar ideias em impacto global.'
        }
      },
      {
        key: 'stats_content',
        value: [
          { label: 'Startups Incubadas', value: '150+' },
          { label: 'Capital Captado', value: '$2.5M' },
          { label: 'Mentores Especialistas', value: '45' },
          { label: 'Países em África', value: '12' }
        ]
      }
    ];

    for (const c of defaultConfigs) {
      const exists = await Config.findOne({ key: c.key });
      if (!exists) {
        await Config.create(c);
        console.log(`Configuração ${c.key} criada.`);
      }
    }

    // 1. Seed Users with hashed passwords
    const usersData = [
      { name: 'Super Admin ABN', email: 'admin@abn.com', password: '@Admin123@', role: 'admin' },
      { name: 'João Silva', email: 'joao@email.com', password: 'password123', role: 'empreendedor' },
      { name: 'Maria Santos', email: 'maria@email.com', password: 'password123', role: 'startup' },
    ];

    const usersMap: Record<string, any> = {};

    for (const u of usersData) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        user = await User.create({ ...u, password: hashedPassword });
        console.log(`Usuário ${u.email} criado.`);
      }
      usersMap[u.email] = user._id;
    }

    // 2. Seed Businesses (Startups)
    const businessesData = [
      {
        name: 'TechAfrica Solutions',
        category: 'Tecnologia',
        description: 'Especialistas em transformar processos analógicos em experiências digitais de alta performance para o mercado africano.',
        location: 'Luanda, Angola',
        owner: usersMap['admin@abn.com'],
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

    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao realizar seed:', error);
    throw error;
  }
}
