import { NextRequest } from "next/server";
import { prijavaController } from "@/app/controllers/prijavaController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["ADMIN"]);
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (!id) return NextResponse.json({ error: "ID prijave nije validan" }, { status: 400 });

    const result = await prijavaController.delete(id);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Greška pri brisanju" }, { status: 500 });
  }
}
