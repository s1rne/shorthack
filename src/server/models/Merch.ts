import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMerch extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  pointsCost: number;
  promoCodePrefix: string;
  imageUrl?: string;
  isActive: boolean;
  stock: number; // -1 = безлимитный
  createdAt: Date;
  updatedAt: Date;
}

const MerchSchema = new Schema<IMerch>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    pointsCost: { type: Number, required: true, min: 1 },
    promoCodePrefix: { type: String, required: true, default: 'MERCH' },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
    stock: { type: Number, default: -1 }, // -1 = безлимитный
  },
  { timestamps: true }
);

export const Merch: Model<IMerch> =
  mongoose.models.Merch || mongoose.model<IMerch>('Merch', MerchSchema);

