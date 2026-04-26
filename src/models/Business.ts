import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  website: { type: String },
  location: { type: String },
  services: [{ type: String }],
  portfolio: [{ 
    title: String,
    imageUrl: String,
    description: String
  }],
  stats: {
    projects: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    clients: { type: Number, default: 0 }
  },
  isIncubated: { type: Boolean, default: false },
  incubationPhase: { type: String, enum: ['Ideação', 'Validação', 'Crescimento', 'Escala'] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
