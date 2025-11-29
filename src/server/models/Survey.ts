import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
  points: number;
}

export interface ISurvey extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  answers: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  points: { type: Number, default: 10 },
});

const SurveySchema = new Schema<ISurvey>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    questions: [QuestionSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Survey = mongoose.models.Survey || mongoose.model<ISurvey>('Survey', SurveySchema);

