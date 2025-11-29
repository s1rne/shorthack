import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

