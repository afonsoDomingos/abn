import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: String, required: true }, // e.g. "5000 USD", "N/A"
  deadline: { type: Date, required: true },
  category: { 
    type: String, 
    enum: ['Edital', 'Concurso', 'Financiamento', 'Bolsa', 'Programa', 'Vaga', 'Parceiro', 'Outro'], 
    required: true 
  },
  description: { type: String, required: true },
  applyLink: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  location: { type: String, default: '' }, // e.g. "Moçambique", "Online"
  provider: { type: String, default: '' }, // e.g. "ABN", "Tony Elumelu Foundation"
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Opportunity || mongoose.model('Opportunity', OpportunitySchema);
