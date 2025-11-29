import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Event } from '@/server/models/Event';
import connectDB from '@/lib/mongodb';

export const eventRouter = router({
  // Получить все активные мероприятия
  getAll: publicProcedure.query(async () => {
    await connectDB();
    const events = await Event.find({ isActive: true }).sort({ startTime: 1 });
    return events.map((e) => ({
      id: e._id.toString(),
      title: e.title,
      description: e.description,
      startTime: e.startTime.toISOString(),
      endTime: e.endTime.toISOString(),
    }));
  }),

  // Получить все мероприятия (для админки)
  getAllAdmin: publicProcedure.query(async () => {
    await connectDB();
    const events = await Event.find().sort({ startTime: -1 });
    return events.map((e) => ({
      id: e._id.toString(),
      title: e.title,
      description: e.description,
      startTime: e.startTime.toISOString(),
      endTime: e.endTime.toISOString(),
      isActive: e.isActive,
      createdAt: e.createdAt.toISOString(),
    }));
  }),

  // Создать мероприятие (админка)
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();
      const event = await Event.create({
        title: input.title,
        description: input.description || '',
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
      });
      return { id: event._id.toString() };
    }),

  // Обновить мероприятие (админка)
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await connectDB();
      const { id, ...updateData } = input;
      const updates: Record<string, unknown> = {};
      if (updateData.title) updates.title = updateData.title;
      if (updateData.description !== undefined) updates.description = updateData.description;
      if (updateData.startTime) updates.startTime = new Date(updateData.startTime);
      if (updateData.endTime) updates.endTime = new Date(updateData.endTime);
      if (updateData.isActive !== undefined) updates.isActive = updateData.isActive;
      await Event.findByIdAndUpdate(id, updates);
      return { success: true };
    }),

  // Удалить мероприятие (админка)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await connectDB();
      await Event.findByIdAndDelete(input.id);
      return { success: true };
    }),
});

