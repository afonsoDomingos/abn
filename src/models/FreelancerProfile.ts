import mongoose from 'mongoose';

const FreelancerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Design', 'Tecnologia', 'Jurídico', 'Contabilidade', 'Marketing', 'Tradutor', 'Consultor'], 
    required: true 
  },
  skills: [{ type: String }],
  pricePerHour: { type: String, default: 'Sob Orçamento' },
  portfolio: [{
    title: { type: String },
    description: { type: String },
    link: { type: String }
  }],
  rating: { type: Number, default: 5.0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.FreelancerProfile || mongoose.model('FreelancerProfile', FreelancerProfileSchema);
