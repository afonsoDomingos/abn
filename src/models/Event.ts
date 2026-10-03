import mongoose, { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  endDate: { type: String, default: '' }, // Data de fim para eventos com múltiplos dias
  location: { type: String, required: true },
  type: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
  category: {
    type: String,
    enum: ['Conferência', 'Feira', 'Missão Empresarial', 'Summit ABN', 'Workshop', 'Outro'],
    default: 'Summit ABN'
  },
  imageUrl: { type: String, default: '' },
  link: { type: String, default: '' },

  // Programa do evento
  program: [{
    time: { type: String },
    title: { type: String },
    speaker: { type: String },
    description: { type: String }
  }],

  // Oradores/palestrantes
  speakers: [{
    name: { type: String, required: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    photo: { type: String, default: '' },
    bio: { type: String, default: '' }
  }],

  // Países participantes
  countries: [{ type: String }], // Moçambique, Angola, Guiné-Bissau, São Tomé e Príncipe, Cabo Verde

  // Bilhetes
  tickets: [{
    type: { type: String, enum: ['empreendedor', 'empresa'], required: true },
    name: { type: String, required: true }, // ex: "Bilhete Standard", "VIP Empresarial"
    price: { type: Number, required: true },
    currency: { type: String, default: 'MT' },
    description: { type: String, default: '' },
    benefits: [{ type: String }],
    available: { type: Number, default: 0 }, // 0 = ilimitado
    includes: [{ type: String }] // ex: "Acesso a todas as sessões", "Coffee break", "Material"
  }],

  // Pacotes de patrocínio
  sponsorshipPackages: [{
    name: { type: String, required: true }, // ex: "Bronze", "Prata", "Ouro"
    price: { type: Number, required: true },
    currency: { type: String, default: 'MT' },
    description: { type: String, default: '' },
    benefits: [{ type: String }],
    visibility: [{ type: String }], // ex: "Logo no site", "Banner", "Mesa redonda"
    includes: [{ type: String }]
  }],

  // Patrocinadores (logótipos)
  sponsors: [{
    name: { type: String, required: true },
    logo: { type: String, default: '' },
    level: { type: String, enum: ['gold', 'silver', 'bronze', 'partner'], default: 'partner' },
    website: { type: String, default: '' }
  }],

  // Configuração de inquérito de inscrição
  enabledSteps: {
    identificacao: { type: Boolean, default: true },
    profissional: { type: Boolean, default: true },
    bilhete: { type: Boolean, default: false },
    interesses: { type: Boolean, default: false },
    necessidades: { type: Boolean, default: false },
    declaracao: { type: Boolean, default: false },
    checkout: { type: Boolean, default: false }
  },

  customFields: [{
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'textarea', 'select', 'checkbox', 'file'], required: true },
    options: [{ type: String }],
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: '' }
  }],

  declaracao: { type: String, default: '' },

  whatsappGroupUrl: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now }
});

const Event = models.Event || model('Event', EventSchema);
export default Event;
