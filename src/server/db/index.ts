import connectDB from "@/lib/mongodb";

export { default as User } from "./models/User";
export { default as Player } from "./models/Player";
export { default as Admin } from "./models/Admin";

export async function initDB() {
  await connectDB();
}
