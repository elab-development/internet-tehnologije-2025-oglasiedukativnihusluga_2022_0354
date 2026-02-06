import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnik } from "@/db/schema"; // koristi tačno kako si definisao tabelu
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { signAuthToken, AUTH_COOKIE, cookieOpts } from "@/lib/auth";

type Body = {
  ime: string;
  prezime: string;
  email: string;
  lozinka: string;
  role: "TUTOR" | "KORISNIK"; // registracija uvek daje KORISNIK, tutor posebno
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  // 1. Validacija
  if (!body?.email || !body?.lozinka || !body?.ime || !body?.prezime || !body?.role) {
    return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
  }

  // 2. Provera duplikata
  const existing = await db.query.korisnik.findFirst({
    where: eq(korisnik.email, body.email),
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
    uloga: "KORISNIK", // standardna uloga za registraciju
    blokiran: false,
  }).returning({ id: korisnik.id }); // Drizzle vrati id

  const korisnikId = insertResult[0].id;

  // 5. Sign JWT
  const token = signAuthToken({ id: korisnikId, uloga: "KORISNIK" });

  // 6. Response + cookie
  const res = NextResponse.json(
    { id: korisnikId, role: "KORISNIK", email: body.email, ime: body.ime, prezime: body.prezime },
    { status: 201 }
  );
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}