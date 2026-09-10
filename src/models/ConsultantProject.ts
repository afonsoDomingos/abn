import mongoose from 'mongoose';

const ConsultantProjectSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceTitle: { type: String, required: true },
  category: { type: String, required: true },
  consultant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consultantName: { type: String, default: '' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, default: '' },
  clientCompany: { type: String, default: '' },
  projectScope: { type: String, required: true },
  budget: { type: String, default: '' },
  budgetAmount: { type: Number, default: 0 },
  timeline: { type: String, default: 'Imediato' },
  status: {
    type: String,
    enum: ['pendente', 'em_negociacao', 'em_andamento', 'concluido', 'cancelado'],
    default: 'pendente'
  },
  meetingDate: { type: String, default: '' },
  meetingTime: { type: String, default: '' },
  meetingLink: { type: String, default: '' },
  notes: { type: String, default: '' },
  review: {
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.ConsultantProject || mongoose.model('ConsultantProject', ConsultantProjectSchema);
