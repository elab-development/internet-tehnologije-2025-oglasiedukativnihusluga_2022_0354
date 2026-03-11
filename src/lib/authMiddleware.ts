import { NextRequest } from "next/server";
import { verifyAuthToken, JwtUserClaims } from "./auth";

// Dobijanje korisnika iz cookie-ja
export function getUserFromToken(req: NextRequest): JwtUserClaims {
  const token = req.cookies.get("auth")?.value;
  if (!token) throw new Error("Nije autentifikovan");
  return verifyAuthToken(token);
}

/**
 * Middleware funkcija za proveru autentifikacije i autorizacije.
 * @param token JWT token iz cookie-ja
 * @param allowedRoles Niz dozvoljenih uloga (npr. ["TUTOR", "ADMIN"])
 * @returns JwtUserClaims ili objekat sa error poljem
 */
export function requireAuth(
  token?: string,
  allowedRoles: JwtUserClaims["uloga"][] = []
): JwtUserClaims | { error: string } {
  if (!token) {
    return { error: "Nije autentifikovan" };
  }

  try {
    const user = verifyAuthToken(token);

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.uloga)) {
      return { error: "Nema dozvolu za pristup ovoj ruti" };
    }

    // Sve OK → vraća user objekat
    return user;
  } catch (err) {
    return { error: "Nevalidan token" };
  }
}
