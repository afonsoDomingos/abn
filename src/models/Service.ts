import mongoose, { Schema, model, models } from 'mongoose';

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  priceAmount: { type: Number, default: 0 },
  pricingType: { 
    type: String, 
    enum: ['fixo', 'por_hora', 'sob_orcamento'], 
    default: 'fixo' 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Consultoria', 
      'Contabilidade', 
      'Marketing', 
      'Direito empresarial', 
      'Tecnologia', 
      'Recursos humanos', 
      'Gestão', 
      'Exportação', 
      'Financiamento', 
      'Estratégia',
      'Design',
      'Outro'
    ]
  },
  deliveryTime: { type: String, default: '5 a 7 dias úteis' },
  deliverables: [{ type: String }],
  consultant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  consultantName: { type: String, default: '' },
  consultantAvatar: { type: String, default: '' },
  consultantTitle: { type: String, default: '' },
  image: { type: String, default: '' },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  salesCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  createdAt: { type: Date, default: Date.now }
});

const Service = models.Service || model('Service', ServiceSchema);
export default Service;
