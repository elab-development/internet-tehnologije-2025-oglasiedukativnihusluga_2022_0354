import { authController } from "@/app/controllers/authController";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registracija novog korisnika
 *     tags: [Autentifikacija]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ime
 *               - prezime
 *               - email
 *               - lozinka
 *               - uloga
 *             properties:
 *               ime:
 *                 type: string
 *               prezime:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               lozinka:
 *                 type: string
 *                 format: password
 *               uloga:
 *                 type: string
 *                 enum: [KORISNIK, TUTOR, ADMIN]
 *     responses:
 *       201:
 *         description: Korisnik uspešno registrovan
 *       400:
 *         description: Pogrešni podaci
 */
export async function POST(req: Request) {
  const body = await req.json();
  return authController.register(body);
}