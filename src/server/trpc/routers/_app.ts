import { router } from '../trpc';
import { userRouter } from './user';
import { surveyRouter } from './survey';

export const appRouter = router({
  user: userRouter,
  survey: surveyRouter,
});

export type AppRouter = typeof appRouter;

