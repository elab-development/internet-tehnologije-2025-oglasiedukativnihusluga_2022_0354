import { NextRequest } from "next/server";
import { prijavaController } from "@/app/controllers/prijavaController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get("auth")?.value;
  const user = requireAuth(token, ["ADMIN"]);
  if ("error" in user) return user;

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "ID prijave nije validan" }, { status: 400 });

  return prijavaController.delete(id);
}
