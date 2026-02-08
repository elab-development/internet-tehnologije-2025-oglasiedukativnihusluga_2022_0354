// controllers/predmetController.ts
import { db } from "@/db";
import { predmet } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const predmetController = {
  // Dobavljanje svih predmeta
  async getAll() {
    try {
      const rows = await db.select().from(predmet);
      return NextResponse.json(rows);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri dobavljanju predmeta" }, { status: 500 });
    }
  },

  // Kreiranje novog predmeta (samo ADMIN)
  async create(name: string) {
    try {
      if (!name) return NextResponse.json({ error: "Naziv predmeta je obavezan" }, { status: 400 });

      const [row] = await db.insert(predmet).values({ nazivPredmeta: name }).returning();
      return NextResponse.json(row, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri kreiranju predmeta" }, { status: 500 });
    }
  },

  // Brisanje predmeta (samo ADMIN)
  async delete(id: number) {
    try {
      await db.delete(predmet).where(eq(predmet.idPredmet, id));
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri brisanju predmeta" }, { status: 500 });
    }
  },
};
