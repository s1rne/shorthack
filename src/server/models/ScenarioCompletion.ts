import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScenarioCompletion extends Document {
  _id: mongoose.Types.ObjectId;
  visitorId: string; // уникальный ID посетителя
  registered: boolean; // зарегистрировался ли после прохождения
  telegram?: string; // telegram если зарегистрировался
  createdAt: Date;
}

const ScenarioCompletionSchema = new Schema<IScenarioCompletion>(
  {
    visitorId: { type: String, required: true, unique: true },
    registered: { type: Boolean, default: false },
    telegram: { type: String },
  },
  { timestamps: true }
);

export const ScenarioCompletion: Model<IScenarioCompletion> =
  mongoose.models.ScenarioCompletion || mongoose.model<IScenarioCompletion>('ScenarioCompletion', ScenarioCompletionSchema);

