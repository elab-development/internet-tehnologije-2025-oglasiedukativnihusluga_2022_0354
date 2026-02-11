
import { authController } from "@/app/controllers/authController";

export async function POST(req: Request) {
  const body = await req.json();
  return authController.login(body);
}