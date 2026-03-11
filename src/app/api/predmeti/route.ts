import { NextRequest } from "next/server";
import { predmetController } from "@/app/controllers/predmetController";
import { requireAuth } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/predmeti:
 *   get:
 *     summary: Preuzimanje svih predmeta
 *     tags: [Predmeti]
 *     responses:
 *       200:
 *         description: Lista predmeta
 *   post:
 *     summary: Kreiranje novog predmeta (samo admin)
 *     tags: [Predmeti]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nazivPredmeta:
 *                 type: string
 *     responses:
 *       201:
 *         description: Predmet kreiran
 *       401:
 *         description: Neautorizovan pristup
 */

export async function GET() {
  try {
    const result = await predmetController.getAll();
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju predmeta" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    const user = requireAuth(token, ["ADMIN"]); // samo ADMIN može dodavati predmet
    if ("error" in user) return NextResponse.json(user, { status: 401 });

    const { nazivPredmeta } = await req.json();
    const result = await predmetController.create(nazivPredmeta);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Greška pri kreiranju predmeta" }, { status: 500 });
  }
}
