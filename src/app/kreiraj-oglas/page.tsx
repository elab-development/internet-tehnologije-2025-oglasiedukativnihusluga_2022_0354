'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine } from '@remixicon/react';

type Predmet = {
  idPredmet: number;
  nazivPredmeta: string;
};

export default function KreirajOglasPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [predmeti, setPredmeti] = useState<Predmet[]>([]);
  const [naslov, setNaslov] = useState('');
  const [predmetId, setPredmetId] = useState('');
  const [opis, setOpis] = useState('');
  const [lokacija, setLokacija] = useState('');
  const [nacinIzvodjenja, setNacinIzvodjenja] = useState<'ONLINE' | 'UZIVO' | 'OBA'>('ONLINE');
  const [cena, setCena] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Provera da li je korisnik tutor
    if (user && user.uloga !== 'TUTOR') {
      router.push('/oglasi');
      return;
    }

    // Učitavanje predmeta
    fetch('/api/predmeti')
      .then((res) => res.json())
      .then((data) => {
        console.log('Predmeti response:', data);
        setPredmeti(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error loading predmeti:', err);
        setPredmeti([]);
      });
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/oglasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naslov,
          predmetId: Number(predmetId),
          opis,
          lokacija,
          nacinIzvodjenja,
          cena,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Greška pri kreiranju oglasa');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/oglasi');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Greška pri povezivanju sa serverom');
      setLoading(false);
    }
  };

  if (!user || user.uloga !== 'TUTOR') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-800">Samo tutori mogu kreirati oglase</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-2xl relative">
        {/* Strelica za nazad */}
        <Link
          href="/oglasi"
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 group"
        >
          <RiArrowLeftLine size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Oglasi</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">Kreiraj novi oglas</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300">
            Oglas uspešno kreiran! Preusmeravanje...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Naslov oglasa*
            </label>
            <input
              type="text"
              value={naslov}
              onChange={(e) => setNaslov(e.target.value)}
              required
              className="w-full border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="npr. Časovi matematike za srednju školu"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Predmet*
            </label>
            <select
              value={predmetId}
              onChange={(e) => setPredmetId(e.target.value)}
              required
              className="w-full border-2 border-gray-400 p-3 rounded bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Izaberite predmet</option>
              {Array.isArray(predmeti) && predmeti.map((p) => (
                <option key={p.idPredmet} value={p.idPredmet} className="text-gray-900">
                  {p.nazivPredmeta}
                </option>
              ))}
            </select>
            {predmeti.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                Nema predmeta u bazi. Admin mora da doda predmete prvo.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Opis
            </label>
            <textarea
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              rows={4}
              className="w-full border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Opišite vaš oglas..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Lokacija
            </label>
            <input
              type="text"
              value={lokacija}
              onChange={(e) => setLokacija(e.target.value)}
              className="w-full border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="npr. Beograd"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Način izvođenja*
            </label>
            <select
              value={nacinIzvodjenja}
              onChange={(e) => setNacinIzvodjenja(e.target.value as 'ONLINE' | 'UZIVO' | 'OBA')}
              required
              className="w-full border-2 border-gray-400 p-3 rounded bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ONLINE" className="text-gray-900">Online</option>
              <option value="UZIVO" className="text-gray-900">Uživo</option>
              <option value="OBA" className="text-gray-900">Oba</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Cena (RSD/60min)*
            </label>
            <input
              type="number"
              value={cena}
              onChange={(e) => setCena(e.target.value)}
              required
              min="0"
              className="w-full border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="npr. 1500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Kreiranje...' : success ? 'Kreirano!' : 'Kreiraj oglas'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/oglasi')}
              className="flex-1 bg-gray-500 text-white p-3 rounded font-semibold hover:bg-gray-600 transition"
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
