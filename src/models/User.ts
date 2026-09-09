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

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
