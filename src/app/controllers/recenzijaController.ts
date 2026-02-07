import { db } from "@/db";
import { recenzija } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const recenzijaController = {
  // Dohvata sve recenzije za određenog tutora
  async getByTutorId(tutorId: number) {
    try {
      if (!tutorId) {
        return NextResponse.json(
          { error: "Tutor ID je obavezan" },
          { status: 400 }
        );
      }

      const reviews = await db
        .select()
        .from(recenzija)
        .where(eq(recenzija.tutorId, tutorId));

      return NextResponse.json(reviews, { status: 200 });
    } catch (err) {
      console.error("Greska pri ucitavanju recenzija:", err);
      return NextResponse.json(
        { error: "Greska pri ucitavanju recenzija" },
        { status: 500 }
      );
    }
  },

  // Kreira novu recenziju
  async create(data: {
    tutorId: number;
    autorId: number;
    ocena: number;
    komentar?: string;
  }) {
    try {
      const { tutorId, autorId, ocena, komentar } = data;

      // osnovna validacija
      if (!tutorId || !autorId || !ocena) {
        return NextResponse.json(
          { error: "Tutor ID, Autor ID i ocena su obavezni" },
          { status: 400 }
        );
      }

      const insert = await db
        .insert(recenzija)
        .values({
          tutorId,
          autorId,
          ocena,
          komentar: komentar || null,
        })
        .returning({
          id: recenzija.id,
          tutorId: recenzija.tutorId,
          autorId: recenzija.autorId,
          ocena: recenzija.ocena,
          komentar: recenzija.komentar,
        });

      return NextResponse.json(insert[0], { status: 201 });
    } catch (err) {
      console.error("Greska pri dodavanju recenzije:", err);
      return NextResponse.json(
        { error: "Greska pri dodavanju recenzije" },
        { status: 500 }
      );
    }
  },
};