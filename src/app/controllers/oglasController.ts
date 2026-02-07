import { db } from "@/db";
import { oglas, tutor, predmet, korisnik } from "@/db/schema";
import { eq, ilike, gte, lte, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export const oglasController = {
  async getAll(query: URLSearchParams) {
    try {
      const predmetQ = query.get("predmet");
      const lokacijaQ = query.get("lokacija");
      const nacinQ = query.get("nacin");
      const minCenaQ = query.get("minCena");
      const maxCenaQ = query.get("maxCena");

      // Filteri, prikazujemo samo odobrene oglase
      const where = and(
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
      console.error(e);
      return NextResponse.json(
        { error: "Greska pri ucitavanju oglasa" },
        { status: 500 }
      );
    }
  },
};