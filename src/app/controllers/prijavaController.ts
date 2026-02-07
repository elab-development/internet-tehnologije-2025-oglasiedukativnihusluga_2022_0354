import { db } from "@/db";
import { prijava } from "@/db/schema";
import { NextResponse } from "next/server";

export const prijavaController = {
  async getAll() {
    try {
      const reports = await db.select().from(prijava);
      return NextResponse.json(reports);
    } catch {
      return NextResponse.json({ error: "Greska pri ucitavanju prijava" }, { status: 500 });
    }
  },

  async create(data: { korisnikId: number; oglasId: number; razlog: string }) {
    try {
      const insert = await db.insert(prijava).values({
        korisnikId: data.korisnikId,
        oglasId: data.oglasId,
        razlog: data.razlog,
      }).returning({ id: prijava.id });
      return NextResponse.json(insert[0], { status: 201 });
    } catch {
      return NextResponse.json({ error: "Greska pri kreiranju prijave" }, { status: 500 });
    }
  },
};