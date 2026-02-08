import { db } from "@/db";
import { oglas, tutor, predmet,korisnik } from "@/db/schema";
import { eq, and ,ilike,lte,gte} from "drizzle-orm";

// Tipovi za filtriranje

type OglasFilter = {
  predmet?: string | null;
  nacin?: "ONLINE" | "UZIVO" | "OBA" | null;
  lokacija?: string | null;
  minCena?: number | null;
  maxCena?: number | null;
};

export const oglasController = {
  async getAll(filters: OglasFilter = {}) {
    const conditions = [];

    if (filters.predmet) {
      conditions.push(ilike(predmet.nazivPredmeta, `%${filters.predmet}%`));
    }

    const validNacini = ["UZIVO", "ONLINE", "OBA"] as const;
    if (filters.nacin && validNacini.includes(filters.nacin as any)) {
    conditions.push(eq(oglas.nacinIzvodjenja, filters.nacin as typeof validNacini[number]));
  }

    if (filters.lokacija) {
      conditions.push(ilike(oglas.lokacija, `%${filters.lokacija}%`));
    }

    if (filters.minCena !== undefined && filters.minCena !== null) {
      conditions.push(gte(oglas.cena, filters.minCena.toString()));
    }

    if (filters.maxCena !== undefined && filters.maxCena !== null) {
      conditions.push(lte(oglas.cena, filters.maxCena.toString()));
    }

    const rows = await db
      .select({
        id: oglas.idOglas,
        tutorId:oglas.tutorId,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        predmet: predmet.nazivPredmeta,
        opis: oglas.opis,
        lokacija: oglas.lokacija,
        cena: oglas.cena,
        nacin: oglas.nacinIzvodjenja,
      })
      .from(oglas)
      .leftJoin(tutor, eq(oglas.tutorId, tutor.idT))
      .leftJoin(korisnik, eq(tutor.idT, korisnik.id))
      .leftJoin(predmet, eq(oglas.predmetId, predmet.idPredmet))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return rows;
  },

  // CREATE
  async create(data: any, tutorId: number) {
    const { predmetId, naslov, opis, lokacija, nacinIzvodjenja, cena } = data;

    if (!predmetId || !naslov || !cena) {
      throw new Error("Nedostaju obavezna polja");
    }

    const [newOglas] = await db
      .insert(oglas)
      .values({
        tutorId,
        predmetId,
        naslov,
        opis: opis || null,
        lokacija: lokacija || null,
        nacinIzvodjenja: nacinIzvodjenja || "ONLINE",
        cena,
      })
      .returning({
        id: oglas.idOglas,
        naslov: oglas.naslov,
        opis: oglas.opis,
        lokacija: oglas.lokacija,
        cena: oglas.cena,
        nacin: oglas.nacinIzvodjenja,
        tutorId: oglas.tutorId,
      });

    return newOglas;
  },

  // UPDATE
  async update(idOglas: number, data: any, tutorId: number) {
    // proveravamo da li oglas pripada tutor-u
    const [existing] = await db
      .select()
      .from(oglas)
      .where(eq(oglas.idOglas, idOglas));

    if (!existing) throw new Error("Oglas ne postoji");
    if (existing.tutorId !== tutorId) throw new Error("Nije dozvoljeno menjati tuđi oglas");

    const updated = await db
      .update(oglas)
      .set(data)
      .where(eq(oglas.idOglas, idOglas))
      .returning({
        id: oglas.idOglas,
        naslov: oglas.naslov,
        opis: oglas.opis,
        lokacija: oglas.lokacija,
        cena: oglas.cena,
        nacin: oglas.nacinIzvodjenja,
        tutorId: oglas.tutorId,
      });

    return updated[0];
  },

  // DELETE
  async delete(idOglas: number, tutorId: number) {
    const [existing] = await db
      .select()
      .from(oglas)
      .where(eq(oglas.idOglas, idOglas));

    if (!existing) throw new Error("Oglas ne postoji");
    if (existing.tutorId !== tutorId) throw new Error("Nije dozvoljeno brisati tuđi oglas");

    await db.delete(oglas).where(eq(oglas.idOglas, idOglas));
    return { message: "Oglas obrisan" };
  },
};
