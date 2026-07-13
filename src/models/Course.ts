import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  lessons: { type: Number, required: true },
  price: { type: String, required: true }, // e.g. "5.000 MT" or "100 USD"
  isPaid: { type: Boolean, default: false },
  desc: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  videoVisible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
