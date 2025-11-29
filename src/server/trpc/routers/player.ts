import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Player } from '@/server/db';
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
});

