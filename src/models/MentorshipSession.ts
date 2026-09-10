import mongoose from 'mongoose';

const MentorshipSessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menteeName: { type: String, required: true },
  menteeEmail: { type: String, required: true },
  menteeBusinessName: { type: String, default: '' },
  topic: { type: String, required: true },
  objective: { type: String, default: '' },
  businessStage: { type: String, default: 'MVP' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, default: '60 min' },
  status: { 
    type: String, 
    enum: ['pendente', 'confirmada', 'concluida', 'cancelada'], 
    default: 'pendente' 
  },
  price: { type: Number, default: 0 }, // 0 = Gratuito
  abnFee: { type: Number, default: 0 },
  mentorEarnings: { type: Number, default: 0 },
  meetingLink: { type: String, default: '' },
  mentorNotes: { type: String, default: '' },
  review: {
    rating: { type: Number },
    comment: { type: String },
    createdAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MentorshipSession || mongoose.model('MentorshipSession', MentorshipSessionSchema);
