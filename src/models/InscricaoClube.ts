import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IInscricaoClube extends Document {
  nomeCompleto: string;
  docIdentificacao?: string;
  nuit?: string;
  email: string;
  telefone?: string;
  endereco?: string;
  nomeNegocio?: string;
  alvara?: string;
  sector?: string[];
  sectorOutro?: string;
  nivelAdesao: string;
  formaPagamento?: string;
  areasInteresse?: string[];
  comoConheceu?: string;
  comoConheceuOutro?: string;
  localData?: string;
  assinatura?: string;
  origem?: string; // 'home' | 'programas'
  status: string; // 'pendente' | 'aprovado' | 'rejeitado' | 'contactado'
  notasAdmin?: string;
  createdAt: Date;
}

const InscricaoClubeSchema = new Schema<IInscricaoClube>({
  nomeCompleto: { type: String, required: true },
  docIdentificacao: String,
  nuit: String,
  email: { type: String, required: true },
  telefone: String,
  endereco: String,
  nomeNegocio: String,
  alvara: String,
  sector: [String],
  sectorOutro: String,
  nivelAdesao: { type: String, required: true },
  formaPagamento: String,
  areasInteresse: [String],
  comoConheceu: String,
  comoConheceuOutro: String,
  localData: String,
  assinatura: String,
  origem: String,
  status: { type: String, default: 'pendente' },
  notasAdmin: String,
}, { timestamps: true });

export default models.InscricaoClube || model<IInscricaoClube>('InscricaoClube', InscricaoClubeSchema);
