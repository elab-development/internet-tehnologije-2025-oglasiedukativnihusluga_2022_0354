import { NextRequest } from "next/server";
import { prijavaController } from "@/app/controllers/prijavaController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const user = requireAuth(token, ["ADMIN"]);
  if ("error" in user) return user;

  return prijavaController.getAll();
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["KORISNIK", "TUTOR"]); // registrovani korisnici i tutor mogu prijaviti oglas
    if ("error" in user) return user;

    const body = await req.json();
    return prijavaController.create(body, user.id);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Neautorizovan pristup" }, { status: 401 });
  }
}
