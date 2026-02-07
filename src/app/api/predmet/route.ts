import { predmetController } from "@/app/controllers/predmetController";

export async function GET() {
  return predmetController.getAll();
}