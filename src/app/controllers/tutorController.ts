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
    try {
      const { idT, biografija, godineIskustva = 0, lokacija, telefon } = body;

      if (!idT) return NextResponse.json({ error: "Nije prosleđen korisnik" }, { status: 400 });

      const [row] = await db.insert(tutor).values({
        idT,
        biografija,
        godineIskustva,
        lokacija,
        telefon,
      }).returning();

      return NextResponse.json(row, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri kreiranju tutor profila" }, { status: 500 });
    }
  },

  // Dobavljanje svih tutora
  async getAll() {
    try {
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

      return NextResponse.json(rows);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri dobavljanju tutora" }, { status: 500 });
    }
  },

  // Brisanje tutor profila
  async delete(id: number) {
    try {
      await db.delete(tutor).where(eq(tutor.idT, id));
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri brisanju tutora" }, { status: 500 });
    }
  },
};
