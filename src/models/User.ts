import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['empreendedor', 'startup', 'investidor', 'mentor', 'admin'], 
    default: 'empreendedor' 
  },
  profileImage: { type: String },
  // Perfil profissional & pessoal
  phone: { type: String, default: '' },
  birthDate: { type: String, default: '' },
  gender: { type: String, default: '' },
  nationality: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  company: { type: String, default: '' },       // Nome da empresa/startup
  sector: { type: String, default: '' },         // Sector de actividade
  linkedin: { type: String, default: '' },       // URL do LinkedIn
  bio: { type: String, default: '' },            // Breve descrição
  
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
