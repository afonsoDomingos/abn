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

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
