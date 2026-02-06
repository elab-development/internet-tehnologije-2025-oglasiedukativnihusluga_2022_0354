import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnik } from "@/db/schema";
import bcrypt from "bcryptjs";

type Body = {
  ime: string;
  prezime: string;
  email: string;
  lozinka: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  // 1. Validacija
  if (!body?.email || !body?.lozinka || !body?.ime || !body?.prezime) {
    return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
  }

  // 2. Provera duplikata
  const existing = await db.query.korisnik.findFirst({
    where: { email: body.email },
    columns: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "Email je već zauzet." }, { status: 409 });
  }

  // 3. Hash lozinke
  const hashed = await bcrypt.hash(body.lozinka, 10);

  // 4. Ubacivanje korisnika
  const insertResult = await db.insert(korisnik).values({
    ime: body.ime,
    prezime: body.prezime,
    email: body.email,
    lozinka: hashed,
    uloga: "KORISNIK",
    blokiran: false,
  }).returning({ id: korisnik.id });

  const korisnikId = insertResult[0].id;

  // 5. Response (bez automatskog login-a)
  return NextResponse.json(
    { id: korisnikId, email: body.email, ime: body.ime, prezime: body.prezime, role: "KORISNIK" },
    { status: 201 }
  );
}
