// controllers/recenzijaController.ts
import { db } from "@/db";
import { recenzija, tutor, korisnik } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type CreateRecenzijaBody = {
  tutorId: number;
  ocena: number;
  komentar?: string;
};

export const recenzijaController = {
  // GET sve recenzije za određenog tutora
  async getAll(tutorId?: number) {
    const rows = await db.select({
      id: recenzija.id,
      tutorId: recenzija.tutorId,
      autorId: recenzija.autorId,
      autorIme: korisnik.ime,
      autorPrezime: korisnik.prezime,
      ocena: recenzija.ocena,
      komentar: recenzija.komentar,
      datum: recenzija.datum,
    })
    .from(recenzija)
    .leftJoin(korisnik, eq(korisnik.id, recenzija.autorId))
    .where(tutorId ? eq(recenzija.tutorId, tutorId) : undefined);

    return rows;
  },

  // POST nova recenzija (samo registrovani korisnik)
  async create(body: CreateRecenzijaBody, userId: number) {
    const { tutorId, ocena, komentar } = body;

    if (!tutorId || !ocena) {
      throw new Error("Nedostaju obavezna polja");
    }

    // Dodavanje recenzije
    const insertResult = await db.insert(recenzija).values({
      tutorId,
      autorId: userId,
      ocena,
      komentar,
    }).returning({ id: recenzija.id });

    return { ok: true, id: insertResult[0].id };
  },

  // DELETE recenzija (samo admin)
  async delete(recenzijaId: number) {
    await db.delete(recenzija).where(eq(recenzija.id, recenzijaId));
    return { ok: true };
  },
};
