import { db } from "@/db";
import { tutor, korisnik } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

type TutorCreateBody = {
  idT: number; // id korisnika koji postaje tutor
  biografija?: string;
  godineIskustva?: number;
  lokacija?: string;
  telefon?: string;
};

export const tutorController = {
  // Kreiranje tutor profila
  async create(body: TutorCreateBody) {
    const { idT, biografija, godineIskustva = 0, lokacija, telefon } = body;
    if (!idT) throw new Error("Nije prosleđen korisnik");

    const [row] = await db.insert(tutor).values({
      idT,
      biografija,
      godineIskustva,
      lokacija,
      telefon,
    }).returning();

    return row;
  },

  // Dobavljanje svih tutora
  async getAll() {
    const rows = await db.select({
      id: tutor.idT,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      biografija: tutor.biografija,
      godineIskustva: tutor.godineIskustva,
      lokacija: tutor.lokacija,
      telefon: tutor.telefon,
    }).from(tutor)
      .leftJoin(korisnik, eq(korisnik.id, tutor.idT));

    return rows;
  },

  //Get za pojedinacnog tutora
  async getOne(tutorId: number) {
    const row = await db
      .select({
        idT: tutor.idT,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        biografija: tutor.biografija,
        godineIskustva: tutor.godineIskustva,
        lokacija: tutor.lokacija,
        telefon: tutor.telefon,
        email: korisnik.email,
      })
      .from(tutor)
      .innerJoin(korisnik, eq(korisnik.id, tutor.idT))
      .where(eq(tutor.idT, tutorId));

    if (!row || row.length === 0) {
      throw new Error("Tutor nije pronađen");
    }

    return row[0];
  },

  // Brisanje tutor profila
  async delete(id: number) {
    await db.delete(tutor).where(eq(tutor.idT, id));
    return { ok: true };
  },
};
