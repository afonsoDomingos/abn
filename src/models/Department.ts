import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  color: { type: String, default: '#ff6b00' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
