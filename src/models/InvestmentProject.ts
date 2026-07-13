import mongoose from 'mongoose';

const InvestmentProjectSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, unique: true },
  fundingGoal: { type: String, required: true },
  equityOffered: { type: Number, required: true }, // e.g. 15 for 15%
  pitchDeckUrl: { type: String, default: '' },
  financialsUrl: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Aberto', 'Fechado'], 
    default: 'Aberto' 
  },
  inquiries: [{
    investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.InvestmentProject || mongoose.model('InvestmentProject', InvestmentProjectSchema);
