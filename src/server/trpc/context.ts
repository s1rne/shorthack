import { initDB } from '@/server/db';

export async function createContext() {
  await initDB();
  return {};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

