import mongoose, { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
  category: { 
    type: String, 
    enum: ['Conferência', 'Feira', 'Missão Empresarial', 'Summit ABN', 'Outro'], 
    default: 'Summit ABN' 
  },
  imageUrl: { type: String, default: '' },
  link: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Event = models.Event || model('Event', EventSchema);
export default Event;
