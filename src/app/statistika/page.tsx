'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatsData {
  korisniciPoUlozi: Array<{ uloga: string; count: number }>;
  oglasiPoNacinu: Array<{ nacinIzvodjenja: string; count: number }>;
  ukupnoOglasa: number;
  ukupnoTutora: number;
  ukupnoRecenzija: number;
  prosecnaOcena: number;
}

export default function Statistika() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/statistika')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-800">Učitavanje statistike...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-600">Greška pri učitavanju statistike</p>
      </div>
    );
  }

  const korisniciData = {
    labels: stats.korisniciPoUlozi.map((item) => item.uloga),
    datasets: [
      {
        label: 'Broj korisnika',
        data: stats.korisniciPoUlozi.map((item) => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      },
    ],
  };

  const oglasiData = {
    labels: stats.oglasiPoNacinu.map((item) => item.nacinIzvodjenja),
    datasets: [
      {
        label: 'Broj oglasa',
        data: stats.oglasiPoNacinu.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Statistika aplikacije
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-700 text-sm font-medium">Ukupno oglasa</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.ukupnoOglasa}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-700 text-sm font-medium">Ukupno tutora</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.ukupnoTutora}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-700 text-sm font-medium">
              Ukupno recenzija
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.ukupnoRecenzija}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-700 text-sm font-medium">
              Prosečna ocena
            </h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {stats.prosecnaOcena.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Korisnici po ulozi</h2>
            <Pie data={korisniciData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Oglasi po načinu izvođenja
            </h2>
            <Bar data={oglasiData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
}
