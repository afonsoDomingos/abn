import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: [
      'empreendedor', 'startup', 'empresa', 'investidor', 'mentor', 
      'consultor', 'parceiro', 'universidade', 'incubadora', 'organizacao', 
      'admin', 'collaborator'
    ], 
    default: 'empreendedor' 
  },
  roles: {
    type: [String],
    default: ['empreendedor']
  },
  department: { type: String, default: '' },
  profileImage: { type: String },
  // Perfil profissional & pessoal
  phone: { type: String, default: '' },
  birthDate: { type: String, default: '' },
  gender: { type: String, default: '' },
  nationality: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  company: { type: String, default: '' },       // Nome da empresa/startup
  sector: { type: String, default: '' },         // Sector principal de actividade
  sectors: [{ type: String }],                   // Lista de sectores
  website: { type: String, default: '' },        // Website oficial / portfólio
  linkedin: { type: String, default: '' },       // URL do LinkedIn
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  bio: { type: String, default: '' },            // Breve descrição / Biografia
  interests: [{ type: String }],                 // Áreas de interesse
  languages: [{ type: String }],                 // Idiomas
  experience: { type: String, default: '' },     // Nível de Experiência / Descrição
  skills: [{ type: String }],                    // Competências

  // Estado de verificação da conta / perfil
  verificationStatus: {
    type: String,
    enum: ['pendente', 'em_analise', 'verificado'],
    default: 'verificado'
  },
  
  // Documentos & Formação
  passportBioPage: { type: String, default: '' }, // URL da página de dados do passaporte
  passportPhoto: { type: String, default: '' },   // URL da foto do passaporte
  educationLevel: { type: String, default: '' },  // Nível Máximo de Escolaridade
  howHeardAboutUs: { type: String, default: '' }, // Como ficou a saber sobre a ABN
  // Recuperação de password
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  
  // Analytics para Mentores/Investidores
  stats: {
    mentorshipHours: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    startupsFollowing: { type: Number, default: 0 },
    nextSession: { type: Date }
  },

  // ── 7. PERFIL & OPERAÇÕES DO INVESTIDOR ──
  investorWatchlist: [{
    businessId: { type: String, required: true },
    notes: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    addedAt: { type: Date, default: Date.now }
  }],
  investorMeetings: [{
    businessId: { type: String, required: true },
    businessName: { type: String, required: true },
    founderName: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    topic: { type: String, default: 'Due Diligence & Apresentação' },
    status: { type: String, enum: ['agendada', 'concluida', 'cancelada'], default: 'agendada' },
    meetingLink: { type: String, default: '' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],
  investorPreferences: {
    investorType: { type: String, default: 'Angel' }, // Angel, VC, Family Office, Corporate VC
    ticketMin: { type: String, default: '$5,000' },
    ticketMax: { type: String, default: '$100,000' },
    preferredSectors: [{ type: String }],
    targetCountries: [{ type: String }],
    availableCapital: { type: String, default: '' }
  },

  // ── 8. PERFIL & OPERAÇÕES DO MENTOR ──
  mentorProfile: {
    headline: { type: String, default: '' },
    specialization: [{ type: String }],
    yearsOfExperience: { type: Number, default: 5 },
    supportedCompanies: [{
      name: { type: String },
      logo: { type: String },
      year: { type: String }
    }],
    certifications: [{
      title: { type: String },
      issuer: { type: String },
      year: { type: String }
    }],
    languages: [{ type: String }],
    hourlyRate: { type: String, default: 'Gratuito (ABN Cohort)' },
    pricePerSession: { type: Number, default: 0 }, // 0 = Pro-Bono/Gratuito
    abnCommissionPercent: { type: Number, default: 15 },
    availability: {
      days: [{ type: String }],
      hours: { type: String, default: '14:00 - 18:00' },
      mode: { type: String, enum: ['online', 'presencial', 'hibrido'], default: 'online' },
      isAcceptingNewMentees: { type: Boolean, default: true }
    },
    reviews: [{
      menteeId: { type: String },
      menteeName: { type: String },
      startupName: { type: String },
      rating: { type: Number, default: 5 },
      comment: { type: String },
      date: { type: Date, default: Date.now }
    }],
    totalSessionsCompleted: { type: Number, default: 0 },
    totalMenteesCount: { type: Number, default: 0 }
  },

  // ── 9. PERFIL CONSULTOR / ESPECIALISTA ──
  consultantProfile: {
    headline: { type: String, default: '' },
    specialties: [{ type: String }], // 'Consultoria', 'Contabilidade', 'Marketing', 'Direito empresarial', etc.
    yearsOfExperience: { type: Number, default: 5 },
    bio: { type: String, default: '' },
    portfolio: [{
      title: { type: String, required: true },
      client: { type: String, default: '' },
      description: { type: String, default: '' },
      link: { type: String, default: '' },
      resultMetric: { type: String, default: '' }, // ex: "+45% de Receita Fiscal", "Valuation de $2M alcançado"
      date: { type: Date, default: Date.now }
    }],
    certifications: [{
      title: { type: String },
      issuer: { type: String },
      year: { type: String }
    }],
    hourlyRate: { type: String, default: 'Sob Consulta' },
    availability: {
      days: [{ type: String }],
      hours: { type: String, default: '09:00 - 18:00' },
      mode: { type: String, enum: ['online', 'presencial', 'hibrido'], default: 'hibrido' },
      isAcceptingProjects: { type: Boolean, default: true }
    },
    totalProjectsCompleted: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 }
  },

  // ── 10. PERFIL DO PARCEIRO (INSTITUCIONAL & CANDIDATO) ──
  partnerProfile: {
    status: { 
      type: String, 
      enum: ['candidato', 'em_analise', 'aprovado', 'rejeitado'], 
      default: 'candidato' 
    },
    partnerType: { 
      type: String, 
      enum: ['institucional', 'financeiro', 'estrategico', 'tecnologico', 'comercial', 'academico', 'internacional', 'bancario'], 
      default: 'estrategico' 
    },
    organizationName: { type: String, default: '' },
    organizationLogo: { type: String, default: '' },
    headline: { type: String, default: '' },
    sector: { type: String, default: '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    website: { type: String, default: '' },
    institutionalBio: { type: String, default: '' },
    focalPoint: {
      name: { type: String, default: '' },
      role: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    partnershipAgreement: {
      mouStatus: { type: String, enum: ['pendente', 'em_revisao', 'assinado'], default: 'pendente' },
      signedDate: { type: Date },
      mouUrl: { type: String, default: '' }
    },
    jointProjects: [{
      title: { type: String, required: true },
      description: { type: String, default: '' },
      category: { type: String, default: 'Inovação & Empreendedorismo' },
      status: { type: String, enum: ['planeamento', 'em_andamento', 'concluido'], default: 'planeamento' },
      budget: { type: String, default: '' },
      goals: [{ type: String }],
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' }
    }],
    jointEvents: [{
      title: { type: String, required: true },
      date: { type: String, default: '' },
      location: { type: String, default: 'Online / Hub ABN' },
      type: { type: String, default: 'Webinar / Fórum' },
      status: { type: String, enum: ['agendado', 'realizado', 'em_divulgacao'], default: 'agendado' },
      link: { type: String, default: '' }
    }],
    campaigns: [{
      title: { type: String, required: true },
      channel: { type: String, default: 'Rede ABN & Media Parceiro' },
      reach: { type: String, default: '5.000+ Empreendedores' },
      status: { type: String, enum: ['ativa', 'programada', 'concluida'], default: 'ativa' }
    }],
    documents: [{
      title: { type: String, required: true },
      category: { type: String, default: 'Acordo / MOU' },
      fileUrl: { type: String, default: '' },
      uploadedAt: { type: Date, default: Date.now }
    }],
    metrics: {
      startupsSupported: { type: Number, default: 0 },
      jointInitiatives: { type: Number, default: 0 },
      capitalMobilized: { type: String, default: '0 €' },
      communityReach: { type: Number, default: 0 }
    }
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
