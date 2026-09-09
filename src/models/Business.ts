import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  website: { type: String },
  location: { type: String },
  services: [{ type: String }],
  portfolio: [{ 
    title: String,
    imageUrl: String,
    description: String
  }],
  stats: {
    projects: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    clients: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    projectViews: { type: Number, default: 0 },
    pitchDownloads: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    interestedCount: { type: Number, default: 0 }
  },
  monthlyGrowth: [{
    month: String,
    views: Number,
    percentage: String,
    height: String
  }],
  isIncubated: { type: Boolean, default: false },
  incubationPhase: { type: String, enum: ['Ideação', 'Validação', 'Mínimo Produto Viável (MVP)', 'Tração & Escala', 'Crescimento', 'Escala'], default: 'Ideação' },
  
  // ── GESTÃO DO NEGÓCIO (PRODUTOS, CLIENTES, FORNECEDORES, EQUIPA, METAS, DOCUMENTOS) ──
  productsAndServices: [{
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: String, default: '' },
    type: { type: String, enum: ['produto', 'servico'], default: 'produto' },
    active: { type: Boolean, default: true }
  }],
  clients: [{
    name: { type: String, required: true },
    company: { type: String, default: '' },
    contact: { type: String, default: '' },
    status: { type: String, enum: ['lead', 'em_negociacao', 'ativo', 'concluido'], default: 'ativo' },
    value: { type: String, default: '' }
  }],
  suppliers: [{
    name: { type: String, required: true },
    category: { type: String, default: '' },
    contact: { type: String, default: '' },
    terms: { type: String, default: '' }
  }],
  team: [{
    name: { type: String, required: true },
    role: { type: String, default: '' },
    email: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    avatar: { type: String, default: '' }
  }],
  goals: [{
    title: { type: String, required: true },
    targetDate: { type: String, default: '' },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['pendente', 'em_progresso', 'concluida'], default: 'em_progresso' },
    category: { type: String, default: 'Geral' }
  }],
  documents: [{
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    category: { type: String, enum: ['pitch_deck', 'financeiro', 'legal', 'licenca', 'outro'], default: 'outro' },
    updatedAt: { type: Date, default: Date.now }
  }],

  // ── 4. PERFIL DA STARTUP AVANÇADO ──
  startupProfile: {
    stage: { type: String, default: 'MVP' }, // Ideação, MVP, Pre-Seed, Seed, Série A, Tração & Escala
    sector: { type: String, default: 'Tecnologia' },
    businessModel: { type: String, default: 'B2B SaaS' }, // B2B, B2C, Marketplace, SaaS, etc.
    solution: { type: String, default: '' },
    valueProposition: { type: String, default: '' },
    tam: { type: String, default: '' },
    sam: { type: String, default: '' },
    som: { type: String, default: '' },
    competitors: { type: String, default: '' },
    differentiators: { type: String, default: '' }
  },

  // Métricas de Tração & KPIs
  traction: {
    mrr: { type: String, default: '$0' },
    arr: { type: String, default: '$0' },
    cac: { type: String, default: '$0' },
    ltv: { type: String, default: '$0' },
    runwayMonths: { type: Number, default: 12 },
    burnRate: { type: String, default: '$0 / mês' },
    activeClients: { type: Number, default: 0 },
    churnRate: { type: String, default: '0%' },
    momGrowth: { type: String, default: '0%' }
  },

  // Captação de Investimento (Fundraising)
  fundraising: {
    seekingAmount: { type: String, default: '$100,000' },
    valuation: { type: String, default: '$1,000,000 Pre-Money' },
    stage: { type: String, default: 'Seed' },
    roundStatus: { type: String, enum: ['Aberta', 'Em Negociação', 'Fechada'], default: 'Aberta' },
    elevatorPitch: { type: String, default: '' },
    pitchDeckUrl: { type: String, default: '' },
    dataRoom: [{
      title: String,
      fileUrl: String,
      category: String,
      updatedAt: { type: Date, default: Date.now }
    }],
    requestedIntros: [{
      investorId: String,
      investorName: String,
      status: { type: String, enum: ['pendente', 'aprovada', 'concluida'], default: 'pendente' },
      requestedAt: { type: Date, default: Date.now }
    }]
  },

  // Programa de Aceleração
  acceleration: {
    programName: { type: String, default: 'ABN Cohort Aceleração Global' },
    progress: { type: Number, default: 45 },
    milestones: [{
      title: String,
      completed: { type: Boolean, default: false },
      dueDate: String
    }],
    mentors: [{
      name: String,
      role: String,
      company: String,
      avatar: String
    }],
    sessions: [{
      title: String,
      mentorName: String,
      date: String,
      status: { type: String, default: 'Agendada' }
    }],
    workshops: [{
      title: String,
      instructor: String,
      date: String,
      recordingUrl: String
    }],
    evaluations: [{
      mentorName: String,
      score: Number,
      feedback: String,
      date: { type: Date, default: Date.now }
    }]
  },

  // Startup Score ABN (Avaliação da Plataforma)
  startupScore: {
    total: { type: Number, default: 84 },
    team: { type: Number, default: 85 },
    product: { type: Number, default: 80 },
    market: { type: Number, default: 88 },
    traction: { type: Number, default: 75 },
    businessModel: { type: Number, default: 85 },
    governance: { type: Number, default: 90 },
    growthPotential: { type: Number, default: 85 },
    lastAssessment: { type: Date, default: Date.now }
  },

  // ── 5. PERFIL EMPRESA / PME ──
  empresaProfile: {
    nuit: { type: String, default: '' },          // Número Único de Identificação Tributária
    dimension: { type: String, default: 'PME' },  // Micro, PME, Grande Empresa
    sector: { type: String, default: 'Comércio' },
    subSector: { type: String, default: '' },
    foundedYear: { type: String, default: '' },
    employeesCount: { type: String, default: '' },
    annualRevenue: { type: String, default: '' },
    markets: [{ type: String }],                  // países / mercados onde opera
    certifications: [{ type: String }],
    vision: { type: String, default: '' },
    exportReady: { type: Boolean, default: false },
  },

  // Business Connect — pedidos publicados pela empresa à rede ABN
  businessConnect: [{
    type: { type: String, enum: ['distribuidor', 'fornecedor', 'investidor', 'parceiro_tecnologico', 'comprador_internacional', 'outro'], required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    targetCountry: { type: String, default: '' },
    targetSector: { type: String, default: '' },
    budget: { type: String, default: '' },
    status: { type: String, enum: ['ativo', 'em_negociacao', 'concluido', 'cancelado'], default: 'ativo' },
    responses: { type: Number, default: 0 },
    matches: [{ userId: String, userName: String, note: String, respondedAt: { type: Date, default: Date.now } }],
    publishedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  }],

  // Desenvolvimento Empresarial — histórico de serviços contratados via ABN
  desenvolvimento: [{
    category: { type: String, enum: ['consultoria', 'formacao', 'mentoria', 'aceleracao', 'internacionalizacao', 'marketing', 'recursos_humanos', 'estrategia', 'outro'], required: true },
    title: { type: String, required: true },
    provider: { type: String, default: '' },
    status: { type: String, enum: ['pendente', 'em_curso', 'concluido'], default: 'pendente' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    notes: { type: String, default: '' }
  }],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
