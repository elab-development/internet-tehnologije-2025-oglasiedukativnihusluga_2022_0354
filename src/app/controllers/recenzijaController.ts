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
    try {
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
    .where(tutorId ? eq(recenzija.tutorId, tutorId) : undefined); // tutorId ? filter : undefined

    return NextResponse.json(rows);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška prilikom učitavanja recenzija" }, { status: 500 });
    }
  },

  // POST nova recenzija (samo registrovani korisnik)
  async create(body: CreateRecenzijaBody, userId: number) {
    try {
      const { tutorId, ocena, komentar } = body;

      if (!tutorId || !ocena) {
        return NextResponse.json({ error: "Nedostaju obavezna polja" }, { status: 400 });
      }

      // Dodavanje recenzije
      const insertResult = await db.insert(recenzija).values({
        tutorId,
        autorId: userId,
        ocena,
        komentar,
      }).returning({ id: recenzija.id });

      return NextResponse.json({ ok: true, id: insertResult[0].id }, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška prilikom kreiranja recenzije" }, { status: 500 });
    }
  },

  // DELETE recenzija (samo admin)
  async delete(recenzijaId: number) {
    try {
      await db.delete(recenzija).where(eq(recenzija.id, recenzijaId));
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška prilikom brisanja recenzije" }, { status: 500 });
    }
  },
};
