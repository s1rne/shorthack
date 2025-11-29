import mongoose, { Schema, Document } from 'mongoose';

export interface ISurveyResult extends Document {
  surveyId: mongoose.Types.ObjectId;
  visitorId: string; // уникальный ID посетителя (можно генерировать на клиенте)
  score: number;
  totalPoints: number;
  answers: number[]; // индексы выбранных ответов
  passed: boolean;
  promoCode: string;
  createdAt: Date;
}

const SurveyResultSchema = new Schema<ISurveyResult>(
  {
    surveyId: { type: Schema.Types.ObjectId, ref: 'Survey', required: true },
    visitorId: { type: String, required: true },
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    answers: [{ type: Number }],
    passed: { type: Boolean, default: false },
    promoCode: { type: String, default: '' },
  },
  { timestamps: true }
);

// Индекс для быстрого поиска результатов
SurveyResultSchema.index({ surveyId: 1, visitorId: 1 });

export const SurveyResult =
  mongoose.models.SurveyResult || mongoose.model<ISurveyResult>('SurveyResult', SurveyResultSchema);

