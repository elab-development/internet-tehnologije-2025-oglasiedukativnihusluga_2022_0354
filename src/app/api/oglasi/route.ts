import { oglasController } from "@/app/controllers/oglasController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/oglasi:
 *   get:
 *     summary: Preuzimanje svih oglasa sa filtriranjem
 *     tags: [Oglasi]
 *     parameters:
 *       - in: query
 *         name: predmet
 *         schema:
 *           type: string
 *       - in: query
 *         name: nacin
 *         schema:
 *           type: string
 *           enum: [ONLINE, UZIVO, OBA]
 *       - in: query
 *         name: lokacija
 *         schema:
 *           type: string
 *       - in: query
 *         name: minCena
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxCena
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista oglasa
 *       500:
 *         description: Greška servera
 *   post:
 *     summary: Kreiranje novog oglasa (samo za tutore)
 *     tags: [Oglasi]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               predmetId:
 *                 type: integer
 *               naslov:
 *                 type: string
 *               opis:
 *                 type: string
 *               lokacija:
 *                 type: string
 *               nacinIzvodjenja:
 *                 type: string
 *                 enum: [ONLINE, UZIVO, OBA]
 *               cena:
 *                 type: number
 *     responses:
 *       201:
 *         description: Oglas kreiran
 *       401:
 *         description: Neautorizovan pristup
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const predmet = searchParams.get("predmet") || null;
  const nacin = searchParams.get("nacin") as "ONLINE" | "UZIVO" | "OBA" | null;
  const lokacija = searchParams.get("lokacija") || null;
  const minCena = searchParams.get("minCena") ? Number(searchParams.get("minCena")) : null;
  const maxCena = searchParams.get("maxCena") ? Number(searchParams.get("maxCena")) : null;

  const filters = { predmet, nacin, lokacija, minCena, maxCena };

  try {
    const oglasi = await oglasController.getAll(filters);
    return NextResponse.json(oglasi);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju oglasa" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["TUTOR"]); // samo tutor može kreirati
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const body = await req.json();
    const result = await oglasController.create(body, user.id);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
  }
}