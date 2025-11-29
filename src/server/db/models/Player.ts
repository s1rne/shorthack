import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  _id: mongoose.Types.ObjectId;
  telegram: string;
  password: string;
  university: string;
  course: number;
  selectedDirections: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    telegram: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    course: {
      type: Number,
      required: true,
    },
    selectedDirections: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);

