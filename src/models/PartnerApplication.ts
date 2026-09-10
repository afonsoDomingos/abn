import mongoose from 'mongoose';

const PartnerApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  organizationName: { type: String, required: true },
  organizationType: { 
    type: String, 
    enum: ['institucional', 'individual', 'empresa', 'ong', 'governo', 'academico'], 
    default: 'institucional' 
  },
  partnerCategory: { 
    type: String, 
    enum: ['estratego', 'financeiro', 'tecnico', 'tecnologico', 'comercial', 'bancario', 'academico', 'internacional'], 
    default: 'estratego' 
  },
  focalPointName: { type: String, required: true },
  focalPointEmail: { type: String, required: true },
  focalPointPhone: { type: String, default: '' },
  focalPointRole: { type: String, default: '' },
  website: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  motivationMessage: { type: String, required: true },
  proposalHighlights: [{ type: String }],
  status: { 
    type: String, 
    enum: ['candidato', 'em_analise', 'aprovado', 'rejeitado'], 
    default: 'candidato' 
  },
  adminNotes: { type: String, default: '' },
  reviewedBy: { type: String, default: '' },
  reviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.PartnerApplication || mongoose.model('PartnerApplication', PartnerApplicationSchema);
