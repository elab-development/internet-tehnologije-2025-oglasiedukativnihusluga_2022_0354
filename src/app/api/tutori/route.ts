import { NextRequest } from "next/server";
import { tutorController } from "@/app/controllers/tutorController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await tutorController.getAll();
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju tutora" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["ADMIN", "KORISNIK"]); // ADMIN može dodati bilo kog, korisnik može sebe
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const body = await req.json();
    // ako nije ADMIN, osiguravamo da user dodaje samo svoj profil
    if (user.uloga !== "ADMIN") body.idT = user.id;

    const result = await tutorController.create(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Greška pri kreiranju tutora" }, { status: 500 });
  }
}
