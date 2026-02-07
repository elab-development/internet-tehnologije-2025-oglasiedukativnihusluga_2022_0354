import { NextResponse } from "next/server";
import { db } from "../../../db";
import { predmet } from "../../../db/schema";

export async function GET() {
  try {
    const subjects = await db
      .select({ nazivPredmeta: predmet.nazivPredmeta })
      .from(predmet);

    return NextResponse.json(subjects);
  } catch {
    return NextResponse.json({ error: "Greska pri ucitavanju predmeta" }, { status: 500 });
  }
}
