import { router } from '../trpc';
import { userRouter } from './user';
import { surveyRouter } from './survey';
import { playerRouter } from './player';
import { adminRouter } from './admin';
import { merchRouter } from './merch';
import { eventRouter } from './event';
import { scenarioRouter } from './scenario';

export const appRouter = router({
  user: userRouter,
  survey: surveyRouter,
  player: playerRouter,
  admin: adminRouter,
  merch: merchRouter,
  event: eventRouter,
  scenario: scenarioRouter,
});

export type AppRouter = typeof appRouter;

