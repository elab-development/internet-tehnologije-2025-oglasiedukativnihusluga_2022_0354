/*import { NextResponse } from "next/server";
import { and, eq, ilike, gte, lte } from "drizzle-orm";
import { db } from "../../../db";
import { oglas, predmet, tutor, korisnik } from "../../../db/schema";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const predmetQ = searchParams.get("predmet");   // npr "Matematika"
    const lokacijaQ = searchParams.get("lokacija"); // npr "Beograd"
    const nacinQ = searchParams.get("nacin");       // ONLINE | UZIVO | OBA
    const minCenaQ = searchParams.get("minCena");
    const maxCenaQ = searchParams.get("maxCena");

    const where = and(
      // po želji: prikazuj samo odobrene
      eq(oglas.odobren, true),

      predmetQ ? eq(predmet.nazivPredmeta, predmetQ) : undefined,
      nacinQ ? eq(oglas.nacinIzvodjenja, nacinQ as any) : undefined,
      lokacijaQ ? ilike(oglas.lokacija, `%${lokacijaQ}%`) : undefined,

      minCenaQ ? gte(oglas.cena, minCenaQ) : undefined,
      maxCenaQ ? lte(oglas.cena, maxCenaQ) : undefined
    );

    const rows = await db
      .select({
        id: oglas.idOglas,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        predmet: predmet.nazivPredmeta,
        opis: oglas.opis,
        lokacija: oglas.lokacija,
        cena: oglas.cena,
        nacin: oglas.nacinIzvodjenja,
      })
      .from(oglas)
      .innerJoin(predmet, eq(oglas.predmetId, predmet.idPredmet))
      .innerJoin(tutor, eq(oglas.tutorId, tutor.idT))
      .innerJoin(korisnik, eq(tutor.idT, korisnik.id))
      .where(where);

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: "Greska pri ucitavanju oglasa" }, { status: 500 });
  }
}*/
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