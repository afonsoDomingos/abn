import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IHubEvent {
  title: string;
  date: string;
  description: string;
  type: 'past' | 'future';
  link?: string;
  image?: string;
}

export interface IHubRepresentative {
  name: string;
  role: string;
  email: string;
  phone: string;
  image?: string;
}

export interface IHubTeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface IHub extends Document {
  slug: string;
  name: string;
  image: string;
  description: string;
  steps: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  address: string;
  email: string;
  phone: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  events: IHubEvent[];
  representative: IHubRepresentative;
  team: IHubTeamMember[];
}

const HubEventSchema = new Schema<IHubEvent>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['past', 'future'], default: 'future' },
  link: { type: String },
  image: { type: String }
});

const HubSchema = new Schema<IHub>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  steps: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ],
  address: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  facebookUrl: { type: String },
  instagramUrl: { type: String },
  linkedinUrl: { type: String },
  youtubeUrl: { type: String },
  events: [HubEventSchema],
  representative: {
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    image: { type: String, default: '/default-avatar.png' }
  },
  team: [
    {
      name: { type: String, default: '' },
      role: { type: String, default: '' },
      image: { type: String, default: '/default-avatar.png' }
    }
  ]
}, { timestamps: true });

export default models.Hub || model<IHub>('Hub', HubSchema);
