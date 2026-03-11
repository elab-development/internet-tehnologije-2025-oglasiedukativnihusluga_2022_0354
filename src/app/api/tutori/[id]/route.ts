import { NextRequest } from "next/server";
import { tutorController } from "@/app/controllers/tutorController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // uzimamo token iz cookie-ja
    const token = req.cookies.get("auth")?.value;

    // zahtevamo da bude prijavljen, bilo koja uloga je OK
    const user = requireAuth(token); // bez allowedRoles znači svi logovani
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const { id: idParam } = await params;
    const id = Number(idParam);

    if (!id) {
      return NextResponse.json({ error: "Neispravan ID." }, { status: 400 });
    }

    const result = await tutorController.getOne(id);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Greška pri učitavanju tutora" }, { status: 404 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["ADMIN"]); // samo ADMIN može brisati tutore
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (!id) return NextResponse.json({ error: "ID nije validan" }, { status: 400 });

    const result = await tutorController.delete(id);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Greška pri brisanju" }, { status: 500 });
  }
}
