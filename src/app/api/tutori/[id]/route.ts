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

    const { id: idParam } = await params;
    const id = Number(idParam);

    if (!id) {
      return NextResponse.json({ error: "Neispravan ID." }, { status: 400 });
    }

    return tutorController.getOne(id);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
  }
}


export async function DELETE(req: NextRequest,{ params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["ADMIN"]); // samo ADMIN može brisati tutore
    if ("error" in user) return user;

    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: "ID nije validan" }, { status: 400 });

    return tutorController.delete(id);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Neautorizovan pristup" }, { status: 401 });
  }
}
