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

    // Koristi Ethereal ili env varijable
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // STARTTLS, ne TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });

    // Ako je Ethereal, dobij preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);

    return NextResponse.json({
      message: 'Email uspešno poslat',
      previewUrl, // ovo dodaje opcionalni link da vidiš mejl
    });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Greška pri slanju emaila' },
      { status: 500 }
    );
  }
}