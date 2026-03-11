import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

/**
 * @swagger
 * /api/csrf:
 *   get:
 *     summary: Generisanje CSRF tokena
 *     tags: [Bezbednost]
 *     responses:
 *       200:
 *         description: CSRF token
 */
export async function GET() {
  const token = generateCsrfToken();
  return NextResponse.json({ csrfToken: token });
}
