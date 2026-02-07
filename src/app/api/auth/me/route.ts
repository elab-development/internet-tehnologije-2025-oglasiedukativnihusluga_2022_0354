/*import { NextRequest, NextResponse } from "next/server";
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
}*/
import { authController } from "@/app/controllers/authController";
import { NextRequest } from "next/server";

export const runtime = "edge"; // Optional: koristi Edge runtime da bi NextRequest imao cookies

export async function GET(req: NextRequest) {
    // Uzmi token iz cookie-ja
  const token = req.cookies.get("auth_token")?.value; // sada postoji
    // Pozovi authController.me
  return authController.me(token);
}
