import { NextRequest } from "next/server";
import { recenzijaController } from "@/app/controllers/recenzijaController";

// GET /api/recenzija?tutorId=1
export async function GET(req: NextRequest) {
  const tutorIdParam = req.nextUrl.searchParams.get("tutorId");
  const tutorId = tutorIdParam ? Number(tutorIdParam) : null;

  return recenzijaController.getByTutorId(tutorId as number);
}

// POST /api/recenzija
// Body: { tutorId, autorId, ocena, komentar? }
export async function POST(req: NextRequest) {
  const body = await req.json();
  return recenzijaController.create(body);
}