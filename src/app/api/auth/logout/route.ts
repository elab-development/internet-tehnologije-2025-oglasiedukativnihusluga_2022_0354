
import { authController } from "@/app/controllers/authController";

export async function POST() {
  return authController.logout();
}