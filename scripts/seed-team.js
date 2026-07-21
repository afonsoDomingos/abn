// Script para inserir membros da equipa ABN na base de dados
// Executar com: node scripts/seed-team.js

const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://127.0.0.1:27017/abn';

const teamMembers = [
  // 1. Direcção de Programas, Incubação e Sustentabilidade
  {
    name: 'Leonel Sapite',
    role: 'Director de Programas',
    department: 'Direcção de Programas, Incubação e Sustentabilidade',
    bio: 'Leonel Sapite é especialista em desenvolvimento comunitário, empreendedorismo, direitos humanos e fortalecimento institucional.\n\nPossui vasta experiência na gestão de programas e projectos de desenvolvimento, tendo contribuído para a capacitação de mais de 10.000 empreendedores em Moçambique.\n\nÉ Director Executivo da Organização Orientadora dos Direitos Humanos (ODH), fundador da Green Light Service, Lda. e foi reconhecido pela Fundação Dom Cabral como Professor Internacional do Programa PRAFRENTE.\n\nNa ABN será responsável pela liderança estratégica dos programas, incubação de empresas, aceleração de negócios, sustentabilidade institucional e coordenação das equipas técnicas.',
    expertise: ['Desenvolvimento Comunitário', 'Empreendedorismo', 'Direitos Humanos', 'Fortalecimento Institucional', 'Gestão de Programas'],
    responsibilities: ['Liderança estratégica dos programas', 'Incubação de empresas', 'Aceleração de negócios', 'Sustentabilidade institucional', 'Coordenação das equipas técnicas'],
    image: '',
    linkedin: '',
    email: '',
    order: 1,
    status: 'ativo',
    createdAt: new Date(),
  },
  {
    name: 'Josina Aurora Nhantumbo',
    role: 'Directora Adjunta de Programas',
    department: 'Direcção de Programas, Incubação e Sustentabilidade',
    bio: 'Josina Aurora Nhantumbo é Antropóloga e especialista em Igualdade de Género, Inclusão Social e Empoderamento Económico de Mulheres e Jovens.\n\nPossui mais de 20 anos de experiência em organismos governamentais, Nações Unidas, organizações internacionais e consultoria.\n\nActualmente exerce funções como Especialista em Igualdade de Género na SOCODEVI, liderando iniciativas de empoderamento económico e desenvolvimento inclusivo.\n\nNa ABN apoiará o desenvolvimento e implementação dos programas, assegurando a integração das abordagens de género, inclusão social e desenvolvimento comunitário.',
    expertise: ['Igualdade de Género', 'Inclusão Social', 'Empoderamento Económico', 'Antropologia', 'Desenvolvimento Comunitário'],
    responsibilities: ['Desenvolvimento e implementação dos programas', 'Integração das abordagens de género', 'Inclusão social e desenvolvimento comunitário'],
    image: '',
    linkedin: '',
    email: '',
    order: 2,
    status: 'ativo',
    createdAt: new Date(),
  },
  {
    name: 'Contardo Muarramuassa',
    role: 'Director Adjunto de Programas',
    department: 'Direcção de Programas, Incubação e Sustentabilidade',
    bio: 'Especialista em Desenvolvimento Comunitário, Desenvolvimento Humano, Planeamento Territorial, Governança Local e Salvaguardas Sociais e Ambientais.\n\nÉ fundador da BCC Moçambique, SU, Lda., Mestre em Planeamento Territorial e possui experiência na implementação de programas ligados ao desenvolvimento local, segurança alimentar, meios de subsistência, WASH e fortalecimento da resiliência comunitária.\n\nNa ABN apoiará o desenho e implementação dos programas, assegurando a integração das componentes de desenvolvimento comunitário, sustentabilidade e governação.',
    expertise: ['Desenvolvimento Comunitário', 'Planeamento Territorial', 'Governança Local', 'Salvaguardas Sociais e Ambientais', 'WASH'],
    responsibilities: ['Desenho e implementação dos programas', 'Integração das componentes de desenvolvimento comunitário', 'Sustentabilidade e governação'],
    image: '',
    linkedin: '',
    email: '',
    order: 3,
    status: 'ativo',
    createdAt: new Date(),
  },

  // 2. Direcção Comercial
  {
    name: 'Cargo por preencher',
    role: 'Director(a) Comercial',
    department: 'Direcção Comercial',
    bio: 'Responsável pela estratégia comercial, desenvolvimento de negócios, relacionamento com clientes e parceiros, expansão de mercado e crescimento sustentável das soluções da ABN.',
    expertise: ['Estratégia Comercial', 'Desenvolvimento de Negócios'],
    responsibilities: ['Estratégia comercial', 'Desenvolvimento de negócios', 'Relacionamento com clientes e parceiros', 'Expansão de mercado'],
    image: '',
    linkedin: '',
    email: '',
    order: 4,
    status: 'inativo',
    createdAt: new Date(),
  },

  // 3. Direcção de Marketing e Comunicação
  {
    name: 'Cargo por preencher',
    role: 'Director(a) de Marketing e Comunicação',
    department: 'Direcção de Marketing e Comunicação',
    bio: 'Responsável pela comunicação institucional, posicionamento da marca ABN, marketing estratégico, relações públicas, comunicação digital e promoção das iniciativas da organização.',
    expertise: ['Marketing Estratégico', 'Comunicação Institucional', 'Relações Públicas'],
    responsibilities: ['Comunicação institucional', 'Posicionamento da marca ABN', 'Marketing estratégico', 'Relações públicas'],
    image: '',
    linkedin: '',
    email: '',
    order: 5,
    status: 'inativo',
    createdAt: new Date(),
  },

  // 4. Direcção Jurídica
  {
    name: 'Cargo por preencher',
    role: 'Director(a) Jurídico(a)',
    department: 'Direcção Jurídica',
    bio: 'Responsável pelo acompanhamento jurídico, contratos, conformidade legal, regulamentação institucional e gestão de riscos jurídicos.',
    expertise: ['Direito Empresarial', 'Compliance', 'Gestão de Contratos'],
    responsibilities: ['Acompanhamento jurídico', 'Gestão de contratos', 'Conformidade legal', 'Regulamentação institucional'],
    image: '',
    linkedin: '',
    email: '',
    order: 6,
    status: 'inativo',
    createdAt: new Date(),
  },

  // 5. Direcção de Tecnologia e Inovação
  {
    name: 'Afonso Domingos',
    role: 'Director de Tecnologia e Inovação',
    department: 'Direcção de Tecnologia e Inovação',
    bio: 'Afonso Domingos é especialista em Inteligência Artificial, Branding e Startups, com formação em Multimédia pela Above e experiência na intersecção entre tecnologia, inovação e transformação digital.\n\nActualmente lidera a RPA Moçambique, uma plataforma digital orientada para soluções tecnológicas e recuperação de documentos.\n\nPossui experiência como Especialista em Inteligência Artificial, Coordenador de TI e Consultor de Tecnologia, contribuindo para a transformação digital, optimização de processos internos, gestão de infraestruturas tecnológicas, segurança da informação e implementação de soluções digitais.',
    expertise: ['Inteligência Artificial', 'Transformação Digital', 'Branding e Estratégia Digital', 'Desenvolvimento de Startups', 'Web Development', 'Web Design', 'Design de Marca', 'Edição de Vídeo', 'Experiência do Cliente'],
    responsibilities: ['Liderar a estratégia tecnológica e de inovação', 'Coordenar os processos de transformação digital', 'Desenvolver soluções tecnológicas para empreendedores e startups', 'Promover a utilização estratégica da Inteligência Artificial', 'Apoiar a criação e evolução das plataformas digitais da ABN', 'Fortalecer o ecossistema de inovação tecnológica'],
    image: '',
    linkedin: '',
    email: '',
    order: 7,
    status: 'ativo',
    createdAt: new Date(),
  },

  // 6. Direcção de Administração, Finanças e Recursos Humanos
  {
    name: 'Lizi Cristina Mulambo',
    role: 'Directora de Administração, Finanças e Recursos Humanos',
    department: 'Direcção de Administração, Finanças e Recursos Humanos',
    bio: 'Lizi Cristina Mulambo é uma profissional sénior moçambicana com mais de 20 anos de experiência em gestão administrativa, financeira, recursos humanos e desenvolvimento organizacional.\n\nÉ licenciada em Administração e Gestão de Empresas e certificada como Coach Integral Sistémica.\n\nPossui experiência em organizações como CAFOD – Catholic Agency for Overseas Development (Reino Unido), Health Alliance International (Estados Unidos), MozHOPE e ISOLMOC, Lda., bem como experiência no sector bancário e financeiro.\n\nÉ fundadora da Associação Sol Nascente.',
    expertise: ['Gestão Administrativa e Financeira', 'Gestão de Recursos Humanos', 'Liderança Corporativa', 'Compliance', 'Procurement', 'Gestão Patrimonial', 'Gestão de Subvenções', 'Planeamento Estratégico', 'Desenvolvimento Organizacional'],
    responsibilities: ['Gestão administrativa e financeira', 'Gestão de recursos humanos', 'Implementação de políticas internas', 'Compliance institucional', 'Fortalecimento organizacional', 'Apoio à sustentabilidade administrativa'],
    image: '',
    linkedin: '',
    email: '',
    order: 8,
    status: 'ativo',
    createdAt: new Date(),
  },
  {
    name: 'Yolanda',
    role: 'Assistente Administrativa',
    department: 'Direcção de Administração, Finanças e Recursos Humanos',
    bio: 'Yolanda integra a Direcção de Administração, Finanças e Recursos Humanos como Assistente Administrativa.\n\nSerá responsável pelo apoio administrativo à Presidência e às Direcções Corporativas, gestão documental, organização de agendas, acompanhamento dos processos administrativos, apoio logístico às reuniões e eventos, bem como suporte às operações diárias da organização.',
    expertise: ['Apoio Administrativo', 'Gestão Documental', 'Organização de Agendas', 'Apoio Logístico'],
    responsibilities: ['Apoio administrativo à Presidência e Direcções', 'Gestão documental', 'Organização de agendas', 'Acompanhamento de processos administrativos', 'Apoio logístico a reuniões e eventos'],
    image: '',
    linkedin: '',
    email: '',
    order: 9,
    status: 'ativo',
    createdAt: new Date(),
  },

  // 7. Direcção de Investimentos e Parcerias
  {
    name: 'Nadya Cristina Domingos Cosmo',
    role: 'Directora de Investimentos e Parcerias',
    department: 'Direcção de Investimentos e Parcerias',
    bio: 'Nadya Cristina Domingos Cosmo é uma profissional moçambicana com 29 anos de experiência, dos quais mais de 20 anos dedicados à gestão de recursos humanos, desenvolvimento organizacional, consultoria administrativa e fortalecimento institucional.\n\nPossui vasta experiência na criação de departamentos, negociação, desenvolvimento de parcerias estratégicas, liderança de equipas e fortalecimento das relações institucionais.\n\nÉ igualmente uma promotora activa de iniciativas culturais e comunitárias.',
    expertise: ['Mobilização de Investimentos', 'Desenvolvimento de Parcerias', 'Gestão de Recursos Humanos', 'Negociação', 'Fortalecimento Institucional'],
    responsibilities: ['Mobilização de investimentos', 'Desenvolvimento de parcerias nacionais e internacionais', 'Captação de recursos', 'Construção de alianças estratégicas', 'Fortalecimento das relações institucionais'],
    image: '',
    linkedin: '',
    email: '',
    order: 10,
    status: 'ativo',
    createdAt: new Date(),
  },

  // 8. Direcção de Monitoria, Avaliação e Aprendizagem (MEAL)
  {
    name: 'Gabriel Armindo',
    role: 'Director de Monitoria, Avaliação e Aprendizagem (MEAL)',
    department: 'Direcção de Monitoria, Avaliação e Aprendizagem (MEAL)',
    bio: 'Gabriel Armindo é especialista em Monitoria, Avaliação, Aprendizagem e Prestação de Contas (MEAL), Psicólogo Social e Comunitário, consultor e pesquisador.\n\nPossui experiência na implementação de sistemas de monitoria e avaliação, desenvolvimento de indicadores, dashboards, avaliação de impacto e análise de dados para programas de desenvolvimento.\n\nDomina ferramentas como Excel, Power BI, SPSS, KoboToolbox, ODK, SurveyCTO e R.',
    expertise: ['MEAL', 'Monitoria e Avaliação', 'Power BI', 'SPSS', 'KoboToolbox', 'Psicologia Social e Comunitária', 'Análise de Dados', 'Avaliação de Impacto'],
    responsibilities: ['Implementação do sistema institucional de MEAL', 'Definição de indicadores de desempenho', 'Monitoria de resultados', 'Avaliação de impacto dos programas', 'Promoção da aprendizagem organizacional e melhoria contínua'],
    image: '',
    linkedin: '',
    email: '',
    order: 11,
    status: 'ativo',
    createdAt: new Date(),
  },
];

async function seedTeam() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
    
    const db = client.db('abn');
    const collection = db.collection('teams');
    
    // Verificar membros existentes
    const existing = await collection.countDocuments();
    if (existing > 0) {
      console.log('Ja existem ' + existing + ' membros na base de dados.');
      const arg = process.argv[2];
      if (arg !== '--force') {
        console.log('Use --force para substituir: node scripts/seed-team.js --force');
        await client.close();
        return;
      }
      await collection.deleteMany({});
      console.log('Membros anteriores removidos.');
    }
    
    const result = await collection.insertMany(teamMembers);
    console.log('\n' + result.insertedCount + ' membros inseridos com sucesso!\n');
    
    teamMembers.forEach(function(m, i) {
      var status = m.status === 'ativo' ? '[ATIVO]' : '[INATIVO]';
      console.log('  ' + status + ' ' + (i + 1) + '. ' + m.name + ' - ' + m.role);
    });
    
    var ativos = teamMembers.filter(function(m) { return m.status === 'ativo'; }).length;
    var inativos = teamMembers.filter(function(m) { return m.status === 'inativo'; }).length;
    
    console.log('\nResumo:');
    console.log('  Total: ' + teamMembers.length + ' entradas');
    console.log('  Activos (pessoas reais): ' + ativos);
    console.log('  Cargos por preencher: ' + inativos);
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await client.close();
    console.log('\nConexao fechada.');
  }
}

seedTeam();
