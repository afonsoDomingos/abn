import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IEventInscription extends Document {
  eventId: string;
  eventTitle: string;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  sector?: string;
  motivoParticipacao?: string;
  necessidadesEspeciais?: string;
  bilheteSelecionado?: string;
  respostasPersonalizadas?: Record<string, any>;
  declaracaoAceita?: boolean;
  metodoPagamento?: string;
  comprovativo?: string;
  status: string; // 'pendente' | 'confirmado' | 'cancelado' | 'compareceu' | 'nao_compareceu'
  notasAdmin?: string;
  origem?: string; // 'home' | 'eventos'
  createdAt: Date;
}

const EventInscriptionSchema = new Schema<IEventInscription>({
  eventId: { type: String, required: true },
  eventTitle: { type: String, required: true },
  nomeCompleto: { type: String, required: true },
  email: { type: String, required: true },
  telefone: String,
  empresa: String,
  cargo: String,
  sector: String,
  motivoParticipacao: String,
  necessidadesEspeciais: String,
  bilheteSelecionado: String,
  respostasPersonalizadas: { type: Schema.Types.Mixed, default: {} },
  declaracaoAceita: Boolean,
  metodoPagamento: String,
  comprovativo: String,
  status: { type: String, default: 'pendente' },
  notasAdmin: String,
  origem: String,
}, { timestamps: true });

export default models.EventInscription || model<IEventInscription>('EventInscription', EventInscriptionSchema);
