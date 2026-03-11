
import { authController } from "@/app/controllers/authController";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     tags: [Autentifikacija]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - lozinka
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               lozinka:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Uspešna prijava
 *       401:
 *         description: Pogrešni kredencijali
 */
export async function POST(req: Request) {
  const body = await req.json();
  return authController.login(body);
}