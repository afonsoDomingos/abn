import mongoose from 'mongoose';

const UniversityProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Identidade Institucional
  universityName: { type: String, default: '' },
  universityLogo: { type: String, default: '' },
  universityType: {
    type: String,
    enum: ['publica', 'privada', 'politecnico', 'instituto', 'academia', 'centro_investigacao'],
    default: 'publica'
  },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  website: { type: String, default: '' },
  institutionalBio: { type: String, default: '' },
  headline: { type: String, default: '' },
  foundedYear: { type: String, default: '' },
  accreditations: [{ type: String }], // ex: AAC, ANEQ

  // Áreas de Investigação & Ciência
  researchAreas: [{ type: String }],  // ex: IA, Agro, Biotech, Energia, Direito

  // Programas e Cursos
  programs: [{
    title: { type: String, required: true },
    level: { type: String, enum: ['licenciatura', 'mestrado', 'doutoramento', 'pos_graduacao', 'formacao_executiva'], default: 'licenciatura' },
    area: { type: String, default: '' },
    duration: { type: String, default: '' },
    mode: { type: String, enum: ['presencial', 'online', 'hibrido'], default: 'presencial' },
    enrollmentOpen: { type: Boolean, default: true },
    applicationLink: { type: String, default: '' },
    description: { type: String, default: '' }
  }],

  // Investigação & Publicações
  researchProjects: [{
    title: { type: String, required: true },
    area: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['em_andamento', 'concluido', 'publicado'], default: 'em_andamento' },
    leadResearcher: { type: String, default: '' },
    fundingSource: { type: String, default: '' },
    publicationUrl: { type: String, default: '' },
    year: { type: String, default: '' }
  }],

  // Oportunidades de Estágio
  internships: [{
    title: { type: String, required: true },
    department: { type: String, default: '' },
    area: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
    requirements: [{ type: String }],
    applicationDeadline: { type: String, default: '' },
    status: { type: String, enum: ['aberto', 'fechado', 'em_selecao'], default: 'aberto' },
    slots: { type: Number, default: 5 }
  }],

  // Desafios de Inovação
  innovationChallenges: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    prize: { type: String, default: '' },
    theme: { type: String, default: '' },
    deadline: { type: String, default: '' },
    status: { type: String, enum: ['aberto', 'em_julgamento', 'concluido'], default: 'aberto' },
    applicantsCount: { type: Number, default: 0 }
  }],

  // Startups e Empresas Parceiras
  connectedStartups: [{
    name: { type: String },
    sector: { type: String },
    year: { type: String },
    type: { type: String, enum: ['spin_off', 'parceira', 'incubada', 'alumni'], default: 'parceira' }
  }],

  // Eventos
  events: [{
    title: { type: String, required: true },
    date: { type: String, default: '' },
    type: { type: String, default: 'Conferência / Seminário' },
    location: { type: String, default: 'Campus Universitário' },
    description: { type: String, default: '' },
    registrationLink: { type: String, default: '' },
    status: { type: String, enum: ['aberto', 'encerrado', 'realizado'], default: 'aberto' }
  }],

  // Métricas Académicas
  metrics: {
    totalStudents: { type: Number, default: 0 },
    totalResearchers: { type: Number, default: 0 },
    totalPublications: { type: Number, default: 0 },
    totalSpinOffs: { type: Number, default: 0 },
    totalInternshipsOffered: { type: Number, default: 0 },
    rankingPosition: { type: String, default: '' }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.UniversityProfile || mongoose.model('UniversityProfile', UniversityProfileSchema);
