import { db } from "@/db";
import { predmet } from "@/db/schema";
import { NextResponse } from "next/server";

// Definišemo tip Subject
type Subject = { nazivPredmeta: string };

export const predmetController = {
  async getAll() {
    try {
      const subjects: Subject[] = await db
        .select({ nazivPredmeta: predmet.nazivPredmeta })
        .from(predmet);

      return NextResponse.json(subjects);
    } catch (error) {
      console.error("Greska pri ucitavanju predmeta:", error);
      return NextResponse.json(
        { error: "Greska pri ucitavanju predmeta" },
        { status: 500 }
      );
    }
  },
};
