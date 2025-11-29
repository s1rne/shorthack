import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Merch } from '@/server/models/Merch';
import { MerchPurchase } from '@/server/models/MerchPurchase';
import { SurveyResult } from '@/server/models/SurveyResult';
import connectDB from '@/lib/mongodb';

export const merchRouter = router({
  // Получить весь активный мерч
  getAll: publicProcedure.query(async () => {
    await connectDB();
    const merch = await Merch.find({ isActive: true }).sort({ pointsCost: 1 });
    return merch.map((m) => ({
      id: m._id.toString(),
      title: m.title,
      description: m.description,
      pointsCost: m.pointsCost,
      imageUrl: m.imageUrl,
      stock: m.stock,
    }));
  }),

  // Получить весь мерч (для админки)
  getAllAdmin: publicProcedure.query(async () => {
    await connectDB();
    const merch = await Merch.find().sort({ createdAt: -1 });
    return merch.map((m) => ({
      id: m._id.toString(),
      title: m.title,
      description: m.description,
      pointsCost: m.pointsCost,
      promoCodePrefix: m.promoCodePrefix,
      imageUrl: m.imageUrl,
      isActive: m.isActive,
      stock: m.stock,
      createdAt: m.createdAt.toISOString(),
    }));
  }),

  // Создать мерч (админка)
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        pointsCost: z.number().min(1),
        promoCodePrefix: z.string().min(1).default('MERCH'),
        imageUrl: z.string().optional(),
        stock: z.number().default(-1),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();
      const merch = await Merch.create({
        title: input.title,
        description: input.description || '',
        pointsCost: input.pointsCost,
        promoCodePrefix: input.promoCodePrefix,
        imageUrl: input.imageUrl,
        stock: input.stock,
      });
      return { id: merch._id.toString() };
    }),

  // Обновить мерч (админка)
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        pointsCost: z.number().min(1).optional(),
        promoCodePrefix: z.string().min(1).optional(),
        imageUrl: z.string().optional(),
        isActive: z.boolean().optional(),
        stock: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();
      const { id, ...updateData } = input;
      await Merch.findByIdAndUpdate(id, updateData);
      return { success: true };
    }),

  // Удалить мерч (админка)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await connectDB();
      await Merch.findByIdAndDelete(input.id);
      return { success: true };
    }),

  // Купить мерч (студент)
  purchase: publicProcedure
    .input(
      z.object({
        telegram: z.string().min(1),
        merchId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();

      // Получаем мерч
      const merch = await Merch.findById(input.merchId);
      if (!merch) {
        throw new Error('Товар не найден');
      }
      if (!merch.isActive) {
        throw new Error('Товар недоступен');
      }
      if (merch.stock === 0) {
        throw new Error('Товар закончился');
      }

      // Считаем баллы студента
      const surveyResults = await SurveyResult.find({ visitorId: input.telegram });
      const earnedPoints = surveyResults.reduce((sum, r) => sum + r.score, 0);

      // Считаем потраченные баллы
      const purchases = await MerchPurchase.find({ playerTelegram: input.telegram });
      const spentPoints = purchases.reduce((sum, p) => sum + p.pointsSpent, 0);

      const availablePoints = earnedPoints - spentPoints;

      if (availablePoints < merch.pointsCost) {
        throw new Error(`Недостаточно баллов. Доступно: ${availablePoints}, требуется: ${merch.pointsCost}`);
      }

      // Генерируем промокод
      const promoCode = `${merch.promoCodePrefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Создаём покупку
      const purchase = await MerchPurchase.create({
        playerTelegram: input.telegram,
        merchId: merch._id,
        merchTitle: merch.title,
        pointsSpent: merch.pointsCost,
        promoCode,
      });

      // Уменьшаем stock если не безлимитный
      if (merch.stock > 0) {
        merch.stock -= 1;
        await merch.save();
      }

      return {
        purchaseId: purchase._id.toString(),
        promoCode,
        merchTitle: merch.title,
        pointsSpent: merch.pointsCost,
      };
    }),

  // Получить покупки студента
  getMyPurchases: publicProcedure
    .input(z.object({ telegram: z.string() }))
    .query(async ({ input }) => {
      await connectDB();
      const purchases = await MerchPurchase.find({ playerTelegram: input.telegram }).sort({ createdAt: -1 });
      return purchases.map((p) => ({
        id: p._id.toString(),
        merchId: p.merchId.toString(),
        merchTitle: p.merchTitle,
        pointsSpent: p.pointsSpent,
        promoCode: p.promoCode,
        createdAt: p.createdAt.toISOString(),
      }));
    }),

  // Получить все покупки (админка)
  getAllPurchases: publicProcedure.query(async () => {
    await connectDB();
    const purchases = await MerchPurchase.find().sort({ createdAt: -1 });
    return purchases.map((p) => ({
      id: p._id.toString(),
      playerTelegram: p.playerTelegram,
      merchId: p.merchId.toString(),
      merchTitle: p.merchTitle,
      pointsSpent: p.pointsSpent,
      promoCode: p.promoCode,
      createdAt: p.createdAt.toISOString(),
    }));
  }),
});

