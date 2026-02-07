import { prijavaController } from "@/app/controllers/prijavaController";
import { NextRequest } from "next/server";

export async function GET() {
  return prijavaController.getAll();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return prijavaController.create(body);
}