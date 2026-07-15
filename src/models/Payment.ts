import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true },
  price: { type: String, required: true },
  proofUrl: { type: String, required: true }, // URL to uploaded file
  status: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'rejeitado'], 
    default: 'pendente' 
  },
  completed: { type: Boolean, default: false },
  certificateRequested: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
