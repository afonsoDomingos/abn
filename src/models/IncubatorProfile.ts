import mongoose from 'mongoose';

const IncubatorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Identidade Institucional
  organizationName: { type: String, default: '' },
  logo: { type: String, default: '🏛️' },
  organizationType: {
    type: String,
    enum: ['incubadora', 'aceleradora', 'hub_inovacao', 'fabrica_startups', 'coworking_tech'],
    default: 'aceleradora'
  },
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  website: { type: String, default: '' },
  foundedYear: { type: String, default: '' },
  accreditations: [{ type: String }],

  // Métricas Consolidadas de Resultados Globais
  metrics: {
    totalStartupsIncubated: { type: Number, default: 28 },
    activeStartups: { type: Number, default: 12 },
    graduatedStartups: { type: Number, default: 16 },
    totalCapitalRaisedEur: { type: Number, default: 1450000 },
    jobsCreated: { type: Number, default: 185 },
    survivalRatePercent: { type: Number, default: 82 }
  },

  // Programas e Cohortes de Aceleração
  programs: [{
    name: { type: String, required: true },
    batch: { type: String, default: 'Batch 2026.1' },
    stage: { type: String, enum: ['ideacao', 'pre_seed', 'seed', 'tracao', 'escala'], default: 'seed' },
    duration: { type: String, default: '4 meses' },
    equityPercent: { type: Number, default: 0 },
    grantAmountEur: { type: Number, default: 15000 },
    slotsAvailable: { type: Number, default: 8 },
    status: { type: String, enum: ['inscricoes_abertas', 'em_andamento', 'concluido', 'brevemente'], default: 'inscricoes_abertas' },
    applicationDeadline: { type: String, default: '' },
    description: { type: String, default: '' },
    perks: [{ type: String }]
  }],

  // Startups no Portfólio (Incubadas e Graduadas)
  startups: [{
    startupName: { type: String, required: true },
    founderName: { type: String, default: '' },
    founderEmail: { type: String, default: '' },
    sector: { type: String, default: 'Fintech' },
    stage: { type: String, default: 'Seed' },
    batch: { type: String, default: 'Batch 2026.1' },
    status: { type: String, enum: ['ativa', 'graduada', 'em_risco', 'interrompida'], default: 'ativa' },
    healthScore: { type: Number, default: 85 }, // 0 a 100
    mrrEur: { type: Number, default: 4500 },
    capitalRaisedEur: { type: Number, default: 50000 },
    jobsCount: { type: Number, default: 6 },
    pitchDeckUrl: { type: String, default: '' },
    notes: { type: String, default: '' }
  }],

  // Funil de Candidaturas Recebidas
  applications: [{
    startupName: { type: String, required: true },
    founderName: { type: String, default: '' },
    founderEmail: { type: String, default: '' },
    founderPhone: { type: String, default: '' },
    country: { type: String, default: 'Guiné-Bissau' },
    programApplied: { type: String, default: '' },
    stage: { type: String, default: 'MVP Validado' },
    pitchSummary: { type: String, default: '' },
    status: { type: String, enum: ['pendente', 'em_analise', 'entrevista', 'aprovada', 'rejeitada'], default: 'pendente' },
    evaluationScore: { type: Number, default: 0 },
    reviewerNotes: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
  }],

  // Bolsa de Mentores da Incubadora
  mentors: [{
    name: { type: String, required: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    specialty: { type: String, default: 'Estratégia & Finanças' },
    email: { type: String, default: '' },
    avatar: { type: String, default: '' },
    assignedStartups: [{ type: String }],
    sessionsCompleted: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 }
  }],

  // Investidores & Parceiros de Capital (Deal Room / Demo Day)
  investors: [{
    investorName: { type: String, required: true },
    fundName: { type: String, default: '' },
    investorType: { type: String, enum: ['angel', 'vc', 'family_office', 'corporate_vc', 'impacto'], default: 'vc' },
    targetTicketEur: { type: String, default: '25.000 € - 150.000 €' },
    focusSectors: [{ type: String }],
    email: { type: String, default: '' },
    interestedStartups: [{ type: String }]
  }],

  // Eventos, Demo Days & Workshops
  events: [{
    title: { type: String, required: true },
    eventType: { type: String, enum: ['demo_day', 'pitch_session', 'workshop', 'masterclass', 'office_hours'], default: 'demo_day' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    location: { type: String, default: 'Hub Principal / Online' },
    speakers: { type: String, default: '' },
    status: { type: String, enum: ['agendado', 'em_curso', 'concluido'], default: 'agendado' },
    registrationUrl: { type: String, default: '' }
  }],

  // Avaliações Diagnósticas de Desempenho
  evaluations: [{
    startupName: { type: String, required: true },
    evaluationDate: { type: String, default: '' },
    evaluator: { type: String, default: 'Comité de Acompanhamento ABN' },
    teamScore: { type: Number, default: 80 },
    productScore: { type: Number, default: 85 },
    marketScore: { type: Number, default: 75 },
    tractionScore: { type: Number, default: 70 },
    overallScore: { type: Number, default: 78 },
    strengths: { type: String, default: '' },
    challenges: { type: String, default: '' },
    recommendations: { type: String, default: '' }
  }]
}, { timestamps: true });

export default mongoose.models.IncubatorProfile || mongoose.model('IncubatorProfile', IncubatorProfileSchema);
