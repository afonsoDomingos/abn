import mongoose, { Schema, model, models } from 'mongoose';

const FeaturedPlanSchema = new Schema({
  name: { type: String, required: true }, // ex: "Destaque Página Inicial - Semanal"
  description: { type: String },
  
  // Configuração
  duration: { type: Number, required: true }, // em dias
  price: { type: Number, required: true }, // preço em MT
  position: { 
    type: String, 
    enum: ['homepage', 'category_top', 'recommended', 'featured_section', 'other'],
    required: true 
  },
  applicableCategories: [{ type: String }], // categorias onde aparece (vazio = todas)
  
  // Estado
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FeaturedPlan = models.FeaturedPlan || model('FeaturedPlan', FeaturedPlanSchema);
export default FeaturedPlan;
