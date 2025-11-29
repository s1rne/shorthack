import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { User } from '@/server/db';

export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    const users = await User.find({}).sort({ createdAt: -1 });
    return users;
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.create(input);
      return user;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await User.findByIdAndDelete(input.id);
      return { success: true };
    }),
});

