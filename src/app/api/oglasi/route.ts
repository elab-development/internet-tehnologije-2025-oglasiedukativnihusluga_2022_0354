import { oglasController } from "@/app/controllers/oglasController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const predmet = searchParams.get("predmet") || null;
  const nacin = searchParams.get("nacin") as "ONLINE" | "UZIVO" | "OBA" | null;
  const lokacija = searchParams.get("lokacija") || null;
  const minCena = searchParams.get("minCena") ? Number(searchParams.get("minCena")) : null;
  const maxCena = searchParams.get("maxCena") ? Number(searchParams.get("maxCena")) : null;

  const filters = { predmet, nacin, lokacija, minCena, maxCena };

  try {
    const oglasi = await oglasController.getAll(filters);
    return NextResponse.json(oglasi);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju oglasa" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["TUTOR"]); // samo tutor može kreirati
    if ("error" in user) return user;

    const body = await req.json();
    return oglasController.create(body, user.id);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
  }
}