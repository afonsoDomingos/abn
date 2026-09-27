import mongoose, { Schema, model, models } from 'mongoose';

const FeaturedListingSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  
  // Configuração do destaque
  planName: { type: String, required: true }, // ex: "Destaque Página Inicial", "Topo Categoria"
  duration: { type: Number, required: true }, // em dias
  price: { type: Number, required: true }, // preço pago
  position: { 
    type: String, 
    enum: ['homepage', 'category_top', 'recommended', 'featured_section', 'other'],
    required: true 
  },
  applicableCategories: [{ type: String }], // categorias onde aparece (se category_top)
  
  // Datas
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Estado
  status: { 
    type: String, 
    enum: ['pending', 'active', 'expired', 'cancelled'], 
    default: 'pending' 
  },
  
  // Pagamento
  paymentMethod: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentTransactionId: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

FeaturedListingSchema.index({ productId: 1, status: 1 });
FeaturedListingSchema.index({ sellerId: 1, status: 1 });
FeaturedListingSchema.index({ startDate: 1, endDate: 1, status: 1 });

const FeaturedListing = models.FeaturedListing || model('FeaturedListing', FeaturedListingSchema);
export default FeaturedListing;
