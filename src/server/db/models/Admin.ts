import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

