import dbConnect from './mongodb';
import User from '../models/User';
import Business from '../models/Business';
import Service from '../models/Service';

export async function seedAdmin() {
  try {
    await dbConnect();
    
    // 1. Seed Users
    const usersData = [
      { name: 'Super Admin ABN', email: 'admin@abn.com', password: '@Admin123@', role: 'admin' },
      { name: 'João Silva', email: 'joao@email.com', password: 'password123', role: 'empreendedor' },
      { name: 'Maria Santos', email: 'maria@email.com', password: 'password123', role: 'startup' },
    ];

    const usersMap: Record<string, any> = {};

    for (const u of usersData) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create(u);
        console.log(`Usuário ${u.email} criado.`);
      }
      usersMap[u.email] = user._id;
    }

    // 2. Seed Businesses (Startups)
    const businessesData = [
      { 
        name: 'TechAfrica Solutions', 
        category: 'Tecnologia', 
        description: 'Desenvolvimento de software para o mercado africano.', 
        location: 'Luanda', 
        owner: usersMap['admin@abn.com'],
        isIncubated: true
      },
      { 
        name: 'AgroEco Moçambique', 
        category: 'Agricultura', 
        description: 'Soluções sustentáveis para pequenos produtores.', 
        location: 'Maputo', 
        owner: usersMap['joao@email.com'],
        isIncubated: true
      },
      { 
        name: 'AfroStyle Fashion', 
        category: 'Moda', 
        description: 'Design de moda inspirado em tecidos tradicionais.', 
        location: 'Maputo', 
        owner: usersMap['maria@email.com'],
        isIncubated: true
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
      { name: 'Criação de Website + Portfólio', description: 'Presença digital profissional com 4 meses grátis.', price: 'Grátis', category: 'Marketing', status: 'ativo' },
      { name: 'Mentoria Estratégica', description: 'Acompanhamento personalizado para crescimento.', price: 'Sob Consulta', category: 'Incubação', status: 'ativo' },
      { name: 'Gestão de Redes Sociais', description: 'Aumente a sua visibilidade online.', price: '15.000 MT/mês', category: 'Marketing', status: 'ativo' },
    ];

    for (const s of servicesData) {
      const exists = await Service.findOne({ name: s.name });
      if (!exists) {
        await Service.create(s);
        console.log(`Serviço ${s.name} criado.`);
      }
    }

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao realizar seed:', error);
  }
}
