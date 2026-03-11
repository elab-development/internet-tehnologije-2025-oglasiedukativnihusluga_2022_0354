// controllers/predmetController.ts
import { db } from "@/db";
import { predmet } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const predmetController = {
  // Dobavljanje svih predmeta
  async getAll() {
    const rows = await db.select().from(predmet);
    return rows;
  },

  // Kreiranje novog predmeta (samo ADMIN)
  async create(name: string) {
    if (!name) throw new Error("Naziv predmeta je obavezan");
    const [row] = await db.insert(predmet).values({ nazivPredmeta: name }).returning();
    return row;
  },

  // Brisanje predmeta (samo ADMIN)
  async delete(id: number) {
    await db.delete(predmet).where(eq(predmet.idPredmet, id));
    return { ok: true };
  },
};
