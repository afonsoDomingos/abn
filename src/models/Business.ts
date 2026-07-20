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
    clients: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    projectViews: { type: Number, default: 0 },
    pitchDownloads: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    interestedCount: { type: Number, default: 0 }
  },
  monthlyGrowth: [{
    month: String,
    views: Number,
    percentage: String,
    height: String
  }],
  isIncubated: { type: Boolean, default: false },
  incubationPhase: { type: String, enum: ['Ideação', 'Validação', 'Mínimo Produto Viável (MVP)', 'Tração & Escala', 'Crescimento', 'Escala'], default: 'Ideação' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
