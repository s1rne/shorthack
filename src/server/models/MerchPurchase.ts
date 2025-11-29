import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMerchPurchase extends Document {
  _id: mongoose.Types.ObjectId;
  playerTelegram: string;
  merchId: mongoose.Types.ObjectId;
  merchTitle: string;
  pointsSpent: number;
  promoCode: string;
  createdAt: Date;
}

const MerchPurchaseSchema = new Schema<IMerchPurchase>(
  {
    playerTelegram: { type: String, required: true, index: true },
    merchId: { type: Schema.Types.ObjectId, ref: 'Merch', required: true },
    merchTitle: { type: String, required: true },
    pointsSpent: { type: Number, required: true },
    promoCode: { type: String, required: true },
  },
  { timestamps: true }
);

export const MerchPurchase: Model<IMerchPurchase> =
  mongoose.models.MerchPurchase || mongoose.model<IMerchPurchase>('MerchPurchase', MerchPurchaseSchema);

