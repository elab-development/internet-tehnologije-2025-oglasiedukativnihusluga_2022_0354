import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ id: null, uloga: null });
    }

    const user = verifyAuthToken(token);

    return NextResponse.json({
      id: user.id,
      uloga: user.uloga,
    });
  } catch {
    return NextResponse.json({ id: null, uloga: null });
  }
}
