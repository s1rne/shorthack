import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { ScenarioCompletion } from '@/server/models/ScenarioCompletion';
import connectDB from '@/lib/mongodb';

export const scenarioRouter = router({
  // Записать прохождение сценария
  trackCompletion: publicProcedure
    .input(z.object({ visitorId: z.string() }))
    .mutation(async ({ input }) => {
      await connectDB();
      
      // Проверяем, есть ли уже запись
      const existing = await ScenarioCompletion.findOne({ visitorId: input.visitorId });
      if (existing) {
        return { id: existing._id.toString(), alreadyTracked: true };
      }
      
      const completion = await ScenarioCompletion.create({
        visitorId: input.visitorId,
        registered: false,
      });
      
      return { id: completion._id.toString(), alreadyTracked: false };
    }),

  // Отметить регистрацию после прохождения
  markRegistered: publicProcedure
    .input(z.object({ visitorId: z.string(), telegram: z.string() }))
    .mutation(async ({ input }) => {
      await connectDB();
      
      await ScenarioCompletion.findOneAndUpdate(
        { visitorId: input.visitorId },
        { registered: true, telegram: input.telegram },
        { upsert: true }
      );
      
      return { success: true };
    }),

  // Получить статистику (для админки)
  getStats: publicProcedure.query(async () => {
    await connectDB();
    
    const totalCompletions = await ScenarioCompletion.countDocuments();
    const registeredCount = await ScenarioCompletion.countDocuments({ registered: true });
    const notRegisteredCount = totalCompletions - registeredCount;
    
    const conversionRate = totalCompletions > 0 
      ? Math.round((registeredCount / totalCompletions) * 100) 
      : 0;
    
    return {
      totalCompletions,
      registeredCount,
      notRegisteredCount,
      conversionRate,
    };
  }),
});

