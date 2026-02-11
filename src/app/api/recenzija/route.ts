import { recenzijaController } from "@/app/controllers/recenzijaController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";

// GET sve recenzije ili po tutorId
export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  requireAuth(token); // ne moraš navoditi role ako su svi logovani dozvoljeni
  const tutorId = req.nextUrl.searchParams.get("tutorId");
  return recenzijaController.getAll(tutorId ? Number(tutorId) : undefined);
}

// POST nova recenzija (samo registrovani korisnik)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["KORISNIK"]); // samo registrovani korisnik može kreirati
    if ("error" in user) return user;

    const body = await req.json();
    return recenzijaController.create(body, user.id);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Neautorizovan pristup" }), { status: 401 });
  }
}
