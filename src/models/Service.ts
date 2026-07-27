import mongoose, { Schema, model, models } from 'mongoose';

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  createdAt: { type: Date, default: Date.now }
});

const Service = models.Service || model('Service', ServiceSchema);
export default Service;
