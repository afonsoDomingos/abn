import mongoose, { Schema, model, models } from 'mongoose';

export interface QuestionnaireField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file';
  options: string[];
  required: boolean;
  placeholder?: string;
}

const QuestionnaireFieldSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, enum: ['text', 'textarea', 'select', 'checkbox', 'file'], default: 'text' },
  options: { type: [String], default: [] },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '' }
});

const QuestionnaireSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fields: [QuestionnaireFieldSchema],
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

QuestionnaireSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Questionnaire = models.Questionnaire || model('Questionnaire', QuestionnaireSchema);
export default Questionnaire;
