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
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Program = models.Program || model('Program', ProgramSchema);
export default Program;
