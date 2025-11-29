import { router } from '../trpc';
import { userRouter } from './user';
import { surveyRouter } from './survey';
import { playerRouter } from './player';

export const appRouter = router({
  user: userRouter,
  survey: surveyRouter,
  player: playerRouter,
});

export type AppRouter = typeof appRouter;

