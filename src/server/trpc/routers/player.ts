import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Player } from '@/server/db';
import { SurveyResult } from '@/server/models/SurveyResult';
import { Survey } from '@/server/models/Survey';
import connectDB from '@/lib/mongodb';

export const playerRouter = router({
  register: publicProcedure
    .input(
      z.object({
        telegram: z.string().min(1).refine((val) => val.startsWith('@'), {
          message: 'Telegram должен начинаться с @',
        }),
        password: z.string().min(4, 'Пароль должен быть минимум 4 символа'),
        university: z.string().min(1, 'Укажите ВУЗ'),
        course: z.number().min(1).max(6),
        selectedDirections: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();
      
      // Проверяем, существует ли уже пользователь с таким telegram
      const existing = await Player.findOne({ telegram: input.telegram });
      if (existing) {
        throw new Error('Пользователь с таким Telegram уже зарегистрирован');
      }

      const player = await Player.create({
        telegram: input.telegram,
        password: input.password,
        university: input.university,
        course: input.course,
        selectedDirections: input.selectedDirections,
      });

      return {
        id: player._id.toString(),
        telegram: player.telegram,
      };
    }),

  // Проверка существования пользователя
  checkExists: publicProcedure
    .input(z.object({ telegram: z.string() }))
    .query(async ({ input }) => {
      await connectDB();
      const player = await Player.findOne({ telegram: input.telegram });
      return { exists: !!player };
    }),

  // Вход в аккаунт
  login: publicProcedure
    .input(
      z.object({
        telegram: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();

      const player = await Player.findOne({ telegram: input.telegram });
      if (!player) {
        throw new Error('Пользователь не найден');
      }

      if (player.password !== input.password) {
        throw new Error('Неверный пароль');
      }

      return {
        id: player._id.toString(),
        telegram: player.telegram,
        university: player.university,
        course: player.course,
        selectedDirections: player.selectedDirections,
      };
    }),

  // Получить профиль по telegram (полные данные из БД)
  getProfile: publicProcedure
    .input(z.object({ telegram: z.string() }))
    .query(async ({ input }) => {
      await connectDB();
      const player = await Player.findOne({ telegram: input.telegram });
      if (!player) {
        return null;
      }

      // Получаем результаты опросов для этого пользователя (по telegram)
      const surveyResults = await SurveyResult.find({ visitorId: input.telegram })
        .sort({ createdAt: -1 });

      // Получаем информацию об опросах
      const completedSurveys = await Promise.all(
        surveyResults.map(async (result) => {
          const survey = await Survey.findById(result.surveyId);
          return {
            surveyId: result.surveyId,
            surveyTitle: survey?.title || 'Неизвестный опрос',
            score: result.score,
            totalPoints: result.totalPoints,
            passed: result.passed,
            promoCode: result.promoCode || '',
            completedAt: result.createdAt.toISOString(),
          };
        })
      );

      // Подсчитываем общие баллы
      const totalPoints = surveyResults.reduce((sum, r) => sum + r.score, 0);

      return {
        id: player._id.toString(),
        visitorId: player._id.toString(),
        telegram: player.telegram,
        university: player.university,
        course: player.course,
        selectedDirections: player.selectedDirections,
        totalPoints,
        completedSurveys,
      };
    }),

  // Обновить профиль
  updateProfile: publicProcedure
    .input(
      z.object({
        telegram: z.string().min(1),
        university: z.string().min(1, 'Укажите ВУЗ'),
        course: z.number().min(1).max(6),
        selectedDirections: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();

      const player = await Player.findOne({ telegram: input.telegram });
      if (!player) {
        throw new Error('Пользователь не найден');
      }

      player.university = input.university;
      player.course = input.course;
      player.selectedDirections = input.selectedDirections;
      await player.save();

      return {
        id: player._id.toString(),
        telegram: player.telegram,
        university: player.university,
        course: player.course,
        selectedDirections: player.selectedDirections,
      };
    }),
});

