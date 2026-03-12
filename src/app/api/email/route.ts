import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * @swagger
 * /api/email:
 *   post:
 *     summary: Slanje email obaveštenja
 *     tags: [Eksterni API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - text
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email uspešno poslat
 *       500:
 *         description: Greška pri slanju emaila
 */
export async function POST(req: NextRequest) {
  try {
    const { to, subject, text } = await req.json();

    // Konfiguracija transporter-a
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Slanje emaila
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });

    return NextResponse.json({
      message: 'Email uspešno poslat',
    });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Greška pri slanju emaila' },
      { status: 500 }
    );
  }
}
