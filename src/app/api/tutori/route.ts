import { NextRequest } from "next/server";
import { tutorController } from "@/app/controllers/tutorController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET() {
  return tutorController.getAll();
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["ADMIN", "KORISNIK"]); // ADMIN može dodati bilo kog, korisnik može sebe
    if ("error" in user) return user;

    const body = await req.json();
    // ako nije ADMIN, osiguravamo da user dodaje samo svoj profil
    if (user.uloga !== "ADMIN") body.idT = user.id;

    return tutorController.create(body);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Neautorizovan pristup" }, { status: 401 });
  }
}
