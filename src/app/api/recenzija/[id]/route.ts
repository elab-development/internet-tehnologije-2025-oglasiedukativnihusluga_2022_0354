import { recenzijaController } from "@/app/controllers/recenzijaController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get("auth")?.value;
  const user = requireAuth(token, ["ADMIN"]);
  if ("error" in user) return user;

  const id = Number(params.id);
  if (!id) return new Response(JSON.stringify({ error: "ID nije validan" }), { status: 400 });

  return recenzijaController.delete(id);
}
