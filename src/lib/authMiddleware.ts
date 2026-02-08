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
 * @returns JwtUserClaims uvek ako je validno
 * @throws Error ako nije autentifikovan ili nema dozvolu
 */
export function requireAuth(
  token?: string,
  allowedRoles: JwtUserClaims["uloga"][] = []
): JwtUserClaims {
  if (!token) {
    throw new Error("Nije autentifikovan");
  }

  try {
    const user = verifyAuthToken(token);

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.uloga)) {
      throw new Error("Nema dozvolu za pristup ovoj ruti");
    }

    // Sve OK → vraća user objekat
    return user;
  } catch (err) {
    throw new Error("Nevalidan token");
  }
}
