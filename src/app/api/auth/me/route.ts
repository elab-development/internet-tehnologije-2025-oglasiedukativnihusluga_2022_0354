
import { authController } from "@/app/controllers/authController";
import { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export const runtime = "nodejs"; // Optional: koristi Edge runtime da bi NextRequest imao cookies

export async function GET(req: NextRequest) {
  // Uzmi token iz cookie-ja - ISPRAVLJENO: koristi AUTH_COOKIE umesto hardcoded "auth_token"
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  // Pozovi authController.me
  return authController.me(token);
}
