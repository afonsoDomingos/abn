import mongoose, { Schema, model, models } from 'mongoose';

const ProgramSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publicoAlvo: { type: String, default: '' },
  beneficios: { type: String, default: '' },
  requisitos: { type: String, default: '' },
  investimento: { type: String, default: '' },
  processoSelecao: { type: String, default: '' },
  criteriosSelecao: { type: String, default: '' },
  phase: { type: String, default: '' },
  duration: { type: String, default: '' },
  image: { type: String, default: '' },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  // Club specific fields
  missao: { type: String, default: '' },
  visao: { type: String, default: '' },
  valores: { type: String, default: '' },
  objectivos: { type: String, default: '' },
  areasActuacao: { type: String, default: '' },
  actividades: { type: String, default: '' },
  beneficiosMembros: { type: String, default: '' },
  compromissoMembros: { type: String, default: '' },
  lema: { type: String, default: '' },
  isClub: { type: Boolean, default: false },
  province: { type: String, default: '' }
});

const Program = models.Program || model('Program', ProgramSchema);
export default Program;
