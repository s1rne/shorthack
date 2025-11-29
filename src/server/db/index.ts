import connectDB from '@/lib/mongodb';

export { default as User } from './models/User';

export async function initDB() {
  await connectDB();
}

