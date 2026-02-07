/*import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true }, { status: 200 });

    // Brišemo cookie
    res.cookies.set(AUTH_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // cookie odmah isteče
    });

    return res;
  } catch (err) {
    console.error("Logout failed:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}*/
import { authController } from "@/app/controllers/authController";

export async function POST() {
  return authController.logout();
}