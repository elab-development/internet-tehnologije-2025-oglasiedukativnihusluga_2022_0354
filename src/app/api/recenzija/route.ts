import { recenzijaController } from "@/app/controllers/recenzijaController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/recenzija:
 *   get:
 *     summary: Preuzimanje recenzija (opciono po tutoru)
 *     tags: [Recenzije]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: tutorId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista recenzija
 *   post:
 *     summary: Kreiranje nove recenzije (samo korisnik)
 *     tags: [Recenzije]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorId:
 *                 type: integer
 *               ocena:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               komentar:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recenzija kreirana
 *       401:
 *         description: Neautorizovan pristup
 */

// GET sve recenzije ili po tutorId
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token); // ne moraš navoditi role ako su svi logovani dozvoljeni
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const tutorId = req.nextUrl.searchParams.get("tutorId");
    const result = await recenzijaController.getAll(tutorId ? Number(tutorId) : undefined);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju recenzija" }, { status: 500 });
  }
}

// POST nova recenzija (samo registrovani korisnik)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["KORISNIK"]); // samo registrovani korisnik može kreirati
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const body = await req.json();
    const result = await recenzijaController.create(body, user.id);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Greška pri kreiranju recenzije" }, { status: 500 });
  }
}
