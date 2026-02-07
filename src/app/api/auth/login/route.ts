/*import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";

type Body = {
  email: string;
  lozinka: string;
};

export async function POST(req: Request) {
  const { email, lozinka } = (await req.json()) as Body;

  if (!email || !lozinka) {
    return NextResponse.json({ error: "Email i lozinka su obavezni." }, { status: 400 });
  }

  const [user] = await db.select().from(korisnik).where(eq(korisnik.email, email));

  if (!user) return NextResponse.json({ error: "Pogrešan email ili lozinka." }, { status: 401 });
  if (user.blokiran) return NextResponse.json({ error: "Nalog je blokiran." }, { status: 403 });

  const ok = await bcrypt.compare(lozinka, user.lozinka);
  if (!ok) return NextResponse.json({ error: "Pogrešan email ili lozinka." }, { status: 401 });

  // 1. Sign JWT
  const token = signAuthToken({ id: user.id, uloga: user.uloga });

  // 2. Response + cookie
  const res = NextResponse.json({
    id: user.id,
    ime: user.ime,
    prezime: user.prezime,
    email: user.email,
    uloga: user.uloga,
  });

  res.cookies.set(AUTH_COOKIE, token, cookieOpts());
  return res;
}
*/
import { authController } from "@/app/controllers/authController";

export async function POST(req: Request) {
  const body = await req.json();
  return authController.login(body);
}