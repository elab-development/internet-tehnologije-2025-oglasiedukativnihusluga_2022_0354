import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";

type Body = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as Body;

  // 1. Validate input
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email i lozinka su obavezni." },
      { status: 400 }
    );
  }

  // 2. Find user
  const [user] = await db
    .select()
    .from(korisnik)
    .where(eq(korisnik.email, email));

  if (!user) {
    return NextResponse.json(
      { error: "Pogrešan email ili lozinka." },
      { status: 401 }
    );
  }

  // 3. Block check
  if (user.blokiran) {
    return NextResponse.json(
      { error: "Nalog je blokiran." },
      { status: 403 }
    );
  }

  // 4. Password compare
  const ok = await bcrypt.compare(password, user.lozinka);
  if (!ok) {
    return NextResponse.json(
      { error: "Pogrešan email ili lozinka." },
      { status: 401 }
    );
  }

  // 5. Sign token
  const token = signAuthToken({
    id: user.id,
    uloga: user.uloga,
  });

  // 6. Response
  const res = NextResponse.json({
    id: user.id,
    ime: user.ime,
    prezime: user.prezime,
    email: user.email,
    uloga: user.uloga,
  });

  // 7. Cookie
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}