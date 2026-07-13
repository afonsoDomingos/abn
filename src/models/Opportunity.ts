import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: String, required: true },
  deadline: { type: Date, required: true },
  category: { 
    type: String, 
    enum: ['Fundo', 'Concurso', 'Bolsa', 'Aceleração'], 
    required: true 
  },
  description: { type: String, required: true },
  applyLink: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Opportunity || mongoose.model('Opportunity', OpportunitySchema);
