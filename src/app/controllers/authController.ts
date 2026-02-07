// controllers/authController.ts
import { db } from "@/db";
import { korisnik } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { signAuthToken, AUTH_COOKIE, cookieOpts, verifyAuthToken } from "@/lib/auth";
import { NextResponse } from "next/server";

type LoginBody = { email: string; lozinka: string };
type RegisterBody = { ime: string; prezime: string; email: string; lozinka: string };

export const authController = {
  // LOGIN
  async login({ email, lozinka }: LoginBody) {
    if (!email || !lozinka) {
      return NextResponse.json({ error: "Email i lozinka su obavezni." }, { status: 400 });
    }

    const [user] = await db.select().from(korisnik).where(eq(korisnik.email, email));
    if (!user) return NextResponse.json({ error: "Pogrešan email ili lozinka." }, { status: 401 });
    if (user.blokiran) return NextResponse.json({ error: "Nalog je blokiran." }, { status: 403 });

    const ok = await bcrypt.compare(lozinka, user.lozinka);
    if (!ok) return NextResponse.json({ error: "Pogrešan email ili lozinka." }, { status: 401 });

    const token = signAuthToken({ id: user.id, uloga: user.uloga });
    const res = NextResponse.json({
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      email: user.email,
      uloga: user.uloga,
    });

    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;
  },

  // REGISTER
  async register({ ime, prezime, email, lozinka }: RegisterBody) {
    if (!ime || !prezime || !email || !lozinka) {
      return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }

    const existing = await db.query.korisnik.findFirst({
      where: eq(korisnik.email, email),
      columns: { id: true },
    });

    if (existing) return NextResponse.json({ error: "Email je već zauzet." }, { status: 409 });

    const hashed = await bcrypt.hash(lozinka, 10);

    const insertResult = await db.insert(korisnik).values({
      ime,
      prezime,
      email,
      lozinka: hashed,
      uloga: "KORISNIK",
      blokiran: false,
    }).returning({ id: korisnik.id });

    const korisnikId = insertResult[0].id;
    return NextResponse.json(
      { id: korisnikId, email, ime, prezime, role: "KORISNIK" },
      { status: 201 }
    );
  },

  // LOGOUT
  async logout() {
    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set(AUTH_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return res;
  },

  // ME - trenutni user
  async me(token?: string) {
    try {
      if (!token) return NextResponse.json({ id: null, uloga: null });
      const user = verifyAuthToken(token);
      return NextResponse.json({ id: user.id, uloga: user.uloga });
    } catch {
      return NextResponse.json({ id: null, uloga: null });
    }
  },
};
