import { NextRequest } from "next/server";
import { prijavaController } from "@/app/controllers/prijavaController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["ADMIN"]);
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const result = await prijavaController.getAll();
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju prijava" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["KORISNIK", "TUTOR"]); // registrovani korisnici i tutor mogu prijaviti oglas
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const body = await req.json();
    const result = await prijavaController.create(body, user.id);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Greška pri kreiranju prijave" }, { status: 500 });
  }
}
