import { db } from "@/db";
import { prijava } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

type CreatePrijavaBody = {
  oglasId: number;
  razlog: string;
};

export const prijavaController = {
  // Dobavljanje svih prijava (samo ADMIN)
  async getAll() {
    const rows = await db.select().from(prijava);
    return rows;
  },

  // Kreiranje prijave (registrovani korisnici)
  async create(body: CreatePrijavaBody, userId: number) {
    const { oglasId, razlog } = body;
    if (!oglasId || !razlog) {
      throw new Error("Nedostaju podaci");
    }

    const [row] = await db.insert(prijava).values({
      oglasId,
      razlog,
      korisnikId: userId,
    }).returning();

    return row;
  },

  // Brisanje prijave (samo ADMIN)
  async delete(id: number) {
    await db.delete(prijava).where(eq(prijava.id, id));
    return { ok: true };
  },
};
