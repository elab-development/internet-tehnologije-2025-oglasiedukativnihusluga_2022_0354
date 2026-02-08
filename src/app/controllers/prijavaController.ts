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
    try {
      const rows = await db.select().from(prijava);
      return NextResponse.json(rows);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri dobavljanju prijava" }, { status: 500 });
    }
  },

  // Kreiranje prijave (registrovani korisnici)
  async create(body: CreatePrijavaBody, userId: number) {
    try {
      const { oglasId, razlog } = body;
      if (!oglasId || !razlog) {
        return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
      }

      const [row] = await db.insert(prijava).values({
        oglasId,
        razlog,
        korisnikId: userId,
      }).returning();

      return NextResponse.json(row, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri kreiranju prijave" }, { status: 500 });
    }
  },

  // Brisanje prijave (samo ADMIN)
  async delete(id: number) {
    try {
      await db.delete(prijava).where(eq(prijava.id, id));
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Greška pri brisanju prijave" }, { status: 500 });
    }
  },
};
