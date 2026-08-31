import mongoose, { Schema, model, models } from 'mongoose';

const ProgramSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publicoAlvo: { type: String, default: '' },
  beneficios: { type: String, default: '' },
  requisitos: { type: String, default: '' },
  investimento: { type: String, default: '' },
  price: { type: String, default: '' },
  paymentInstructions: { type: String, default: '' },
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
  province: { type: String, default: '' },
  // Custom declaration text for this program
  declaracao: { type: String, default: '' },
  // Step visibility / custom workflow
  enabledSteps: {
    identificacao: { type: Boolean, default: true },
    negocio: { type: Boolean, default: true },
    adesao: { type: Boolean, default: true },
    interesses: { type: Boolean, default: true },
    origem: { type: Boolean, default: true },
    declaracao: { type: Boolean, default: true },
    checkout: { type: Boolean, default: true },
  },
  // Custom questionnaire fields specific to this program
  customFields: [
    {
      id: { type: String },
      label: { type: String, required: true },
      type: { type: String, enum: ['text', 'textarea', 'select', 'checkbox', 'file'], default: 'text' },
      options: { type: [String], default: [] },
      required: { type: Boolean, default: false },
      placeholder: { type: String, default: '' }
    }
  ],
  // Custom adhesion levels for this program (optional)
  adhesionLevels: [
    {
      id: { type: String, required: true },
      label: { type: String, required: true },
      subLabel: { type: String, default: '' },
      inscriptionFee: { type: Number, default: 0 },
      annualQuota: { type: Number, default: 0 },
      showPeriodicity: { type: Boolean, default: true },
      required: { type: Boolean, default: false }
    }
  ]
});

const Program = models.Program || model('Program', ProgramSchema);
export default Program;