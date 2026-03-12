import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Preuzimanje vremenske prognoze za lokaciju
 *     tags: [Eksterni API]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Podaci o vremenskoj prognozi
 *       400:
 *         description: Grad nije naveden
 *       500:
 *         description: Greška pri preuzimanju podataka
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json(
      { error: 'Grad nije naveden' },
      { status: 400 }
    );
  }

  try {
    // Koristi OpenWeatherMap API (besplatna verzija)
    const API_KEY = process.env.WEATHER_API_KEY || 'demo';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=sr`
    );

    return NextResponse.json({
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Greška pri preuzimanju vremenske prognoze' },
      { status: 500 }
    );
  }
}
