import connectDB from '@/lib/mongodb';

export { default as User } from './models/User';
export { default as Player } from './models/Player';

export async function initDB() {
  await connectDB();
}

