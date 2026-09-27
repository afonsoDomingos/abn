import mongoose, { Schema, model, models } from 'mongoose';

const TeamSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  bio: { type: String, default: '' },
  expertise: { type: [String], default: [] },
  responsibilities: { type: [String], default: [] },
  image: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  email: { type: String, default: '' },
  website: { type: String, default: '' },
  phone: { type: String, default: '' },
  order: { type: Number, default: 0 },
  type: { type: String, default: 'Especialista' },
  country: { type: String, default: 'Moçambique' },
  views: { type: Number, default: 0 },
  mentorshipPrice: { type: Number, default: 0 }, // Preço por sessão de mentoria (0 = gratuito)
  mentorshipCurrency: { type: String, default: 'MT' }, // Moeda do preço
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  createdAt: { type: Date, default: Date.now }
});

const Team = models.Team || model('Team', TeamSchema);
export default Team;
