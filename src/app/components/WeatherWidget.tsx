'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

export default function WeatherWidget({ city }: { city: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setWeather(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  if (loading) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-800">Učitavanje vremenske prognoze...</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">
        Vreme u lokaciji: {weather.city}
      </h3>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
        <div>
          <span className="text-gray-700">Temperatura:</span>
          <span className="ml-2 font-medium text-gray-900">{weather.temperature}°C</span>
        </div>
        <div>
          <span className="text-gray-700">Vlažnost:</span>
          <span className="ml-2 font-medium text-gray-900">{weather.humidity}%</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-700">Opis:</span>
          <span className="ml-2 font-medium capitalize text-gray-900">{weather.description}</span>
        </div>
      </div>
    </div>
  );
}
