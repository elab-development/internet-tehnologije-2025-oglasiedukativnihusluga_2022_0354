import { db } from "@/db";
import { korisnik, oglas, recenzija, tutor } from "@/db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

/**
 * @swagger
 * /api/statistika:
 *   get:
 *     summary: Preuzimanje statistike aplikacije
 *     tags: [Statistika]
 *     responses:
 *       200:
 *         description: Statistički podaci
 */
export async function GET() {
  try {
    // Ukupan broj korisnika po ulozi
    const korisniciPoUlozi = await db
      .select({
        uloga: korisnik.uloga,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(korisnik)
      .groupBy(korisnik.uloga);

    // Broj oglasa po načinu izvođenja
    const oglasiPoNacinu = await db
      .select({
        nacinIzvodjenja: oglas.nacinIzvodjenja,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(oglas)
      .groupBy(oglas.nacinIzvodjenja);

    // Ukupan broj oglasa, tutora i recenzija
    const ukupnoOglasa = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(oglas);

    const ukupnoTutora = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(tutor);

    const ukupnoRecenzija = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(recenzija);

    // Prosečna ocena svih recenzija
    const prosecnaOcena = await db
      .select({ avg: sql<number>`cast(avg(ocena) as float)` })
      .from(recenzija);

    return NextResponse.json({
      korisniciPoUlozi,
      oglasiPoNacinu,
      ukupnoOglasa: ukupnoOglasa[0]?.count || 0,
      ukupnoTutora: ukupnoTutora[0]?.count || 0,
      ukupnoRecenzija: ukupnoRecenzija[0]?.count || 0,
      prosecnaOcena: prosecnaOcena[0]?.avg || 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Greška pri preuzimanju statistike" },
      { status: 500 }
    );
  }
}
