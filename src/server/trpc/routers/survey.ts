import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Survey } from '@/server/models/Survey';
import { SurveyResult } from '@/server/models/SurveyResult';
import connectDB from '@/lib/mongodb';

export const surveyRouter = router({
  // Получить все активные опросы
  getAll: publicProcedure.query(async () => {
    await connectDB();
    const surveys = await Survey.find({ isActive: true })
      .select('title description questions createdAt')
      .sort({ createdAt: -1 });
    return surveys;
  }),

  // Получить опрос по ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      await connectDB();
      const survey = await Survey.findById(input.id);
      if (!survey) {
        throw new Error('Опрос не найден');
      }
      return survey;
    }),

  // Отправить результат опроса
  submit: publicProcedure
    .input(
      z.object({
        surveyId: z.string(),
        visitorId: z.string(),
        answers: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();

      const survey = await Survey.findById(input.surveyId);
      if (!survey) {
        throw new Error('Опрос не найден');
      }

      // Подсчёт баллов
      let score = 0;
      let totalPoints = 0;

      survey.questions.forEach((q: { points: number; correctAnswer: number }, idx: number) => {
        totalPoints += q.points;
        if (input.answers[idx] === q.correctAnswer) {
          score += q.points;
        }
      });

      // Определяем пройден ли опрос (>= 60%)
      const passed = score >= totalPoints * 0.6;

      // Сохранение результата (промокоды теперь выдаются через магазин мерча)
      const result = await SurveyResult.create({
        surveyId: input.surveyId,
        visitorId: input.visitorId,
        score,
        totalPoints,
        answers: input.answers,
        passed,
      });

      return {
        score,
        totalPoints,
        passed,
        resultId: result._id.toString(),
      };
    }),

  // Создать опрос (для админки)
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        questions: z.array(
          z.object({
            question: z.string(),
            answers: z.array(z.string()),
            correctAnswer: z.number(),
            points: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();
      const survey = await Survey.create({
        title: input.title,
        description: input.description || '',
        questions: input.questions.map((q) => ({
          ...q,
          points: q.points || 10,
        })),
        isActive: true,
      });
      return survey;
    }),

  // Удалить опрос
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await connectDB();
      await Survey.findByIdAndDelete(input.id);
      return { success: true };
    }),

  // Получить результаты опроса (для админки)
  getResults: publicProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ input }) => {
      await connectDB();
      const results = await SurveyResult.find({ surveyId: input.surveyId }).sort({
        createdAt: -1,
      });
      return results;
    }),
});

