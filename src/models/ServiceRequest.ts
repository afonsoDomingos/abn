import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  service: { type: String, required: true },
  servicePrice: { type: String, default: '' },
  company: { type: String, default: '' },
  timeline: { type: String, default: 'Imediato' },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pendente', 'em análise', 'aprovado', 'rejeitado'],
    default: 'pendente',
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', ServiceRequestSchema);
