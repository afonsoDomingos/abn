import mongoose from 'mongoose';

const ConnectionSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Avoid duplicate follows
ConnectionSchema.index({ follower: 1, following: 1 }, { unique: true });

export default mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);
