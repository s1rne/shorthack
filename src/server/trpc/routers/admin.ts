import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Admin } from '@/server/db';
import { Survey } from '@/server/models/Survey';
import { SurveyResult } from '@/server/models/SurveyResult';
import { Player } from '@/server/db';
import connectDB from '@/lib/mongodb';

export const adminRouter = router({
  // Вход админа
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();

      // Создаём админа по умолчанию, если его нет
      const adminExists = await Admin.findOne({ username: 'admin' });
      if (!adminExists) {
        await Admin.create({ username: 'admin', password: 'admin' });
      }

      const admin = await Admin.findOne({ username: input.username });
      if (!admin) {
        throw new Error('Неверный логин или пароль');
      }

      if (admin.password !== input.password) {
        throw new Error('Неверный логин или пароль');
      }

      return {
        id: admin._id.toString(),
        username: admin.username,
      };
    }),

  // Получить статистику
  getStats: publicProcedure.query(async () => {
    await connectDB();

    const totalSurveys = await Survey.countDocuments();
    const activeSurveys = await Survey.countDocuments({ isActive: true });
    const totalResults = await SurveyResult.countDocuments();
    const passedResults = await SurveyResult.countDocuments({ passed: true });
    const totalPlayers = await Player.countDocuments();

    // Статистика по каждому опросу
    const surveys = await Survey.find({}).sort({ createdAt: -1 });
    const surveyStats = await Promise.all(
      surveys.map(async (survey) => {
        const results = await SurveyResult.find({ surveyId: survey._id.toString() });
        const passed = results.filter((r) => r.passed).length;
        const avgScore = results.length > 0
          ? results.reduce((sum, r) => sum + r.score, 0) / results.length
          : 0;

        return {
          id: survey._id.toString(),
          title: survey.title,
          questionsCount: survey.questions.length,
          isActive: survey.isActive,
          totalAttempts: results.length,
          passedCount: passed,
          passRate: results.length > 0 ? Math.round((passed / results.length) * 100) : 0,
          avgScore: Math.round(avgScore * 10) / 10,
          createdAt: survey.createdAt,
        };
      })
    );

    return {
      totalSurveys,
      activeSurveys,
      totalResults,
      passedResults,
      passRate: totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0,
      totalPlayers,
      surveyStats,
    };
  }),

  // Получить все опросы с детальной информацией
  getSurveys: publicProcedure.query(async () => {
    await connectDB();
    const surveys = await Survey.find({}).sort({ createdAt: -1 });
    return surveys;
  }),

  // Создать опрос
  createSurvey: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        questions: z.array(
          z.object({
            question: z.string().min(1),
            answers: z.array(z.string().min(1)),
            correctAnswer: z.number().min(0),
            points: z.number().min(1).default(10),
          })
        ).min(1),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();

      const survey = await Survey.create({
        title: input.title,
        description: input.description || '',
        questions: input.questions,
        isActive: true,
      });

      return survey;
    }),

  // Удалить опрос
  deleteSurvey: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await connectDB();
      await Survey.findByIdAndDelete(input.id);
      await SurveyResult.deleteMany({ surveyId: input.id });
      return { success: true };
    }),

  // Переключить статус опроса (активный/неактивный)
  toggleSurvey: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await connectDB();
      const survey = await Survey.findById(input.id);
      if (!survey) {
        throw new Error('Опрос не найден');
      }
      survey.isActive = !survey.isActive;
      await survey.save();
      return { isActive: survey.isActive };
    }),

  // Получить результаты опроса
  getSurveyResults: publicProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ input }) => {
      await connectDB();
      const results = await SurveyResult.find({ surveyId: input.surveyId })
        .sort({ createdAt: -1 })
        .limit(100);
      return results;
    }),

  // Получить список студентов
  getPlayers: publicProcedure.query(async () => {
    await connectDB();
    const players = await Player.find({}).sort({ createdAt: -1 });
    
    // Получаем статистику по каждому студенту
    const playersWithStats = await Promise.all(
      players.map(async (player) => {
        const surveyResults = await SurveyResult.find({ visitorId: player.telegram });
        const totalPoints = surveyResults.reduce((sum, r) => sum + r.score, 0);
        const completedSurveys = surveyResults.length;
        
        return {
          id: player._id.toString(),
          telegram: player.telegram,
          university: player.university,
          course: player.course,
          selectedDirections: player.selectedDirections,
          totalPoints,
          completedSurveys,
          createdAt: player.createdAt?.toISOString() || new Date().toISOString(),
        };
      })
    );
    
    return playersWithStats;
  }),
});

