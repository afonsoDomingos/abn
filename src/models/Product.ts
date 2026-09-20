import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  stock: { type: Number, default: 0 },
  digital: { type: Boolean, default: false },
  downloadUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = models.Product || model('Product', ProductSchema);
export default Product;