
import { authController } from "@/app/controllers/authController";
import { NextRequest } from "next/server";

export const runtime = "nodejs"; // Optional: koristi Edge runtime da bi NextRequest imao cookies

export async function GET(req: NextRequest) {
    // Uzmi token iz cookie-ja
  const token = req.cookies.get("auth_token")?.value; // sada postoji
    // Pozovi authController.me
  return authController.me(token);
}
