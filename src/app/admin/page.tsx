'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

type Prijava = {
  id: number;
  razlog: string;
  datum: string;
  korisnikId: number;
  oglasId: number;
};

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [prijave, setPrijave] = useState<Prijava[]>([]);
  const [loading, setLoading] = useState(true);
  const [noviPredmet, setNoviPredmet] = useState('');
  const [addingPredmet, setAddingPredmet] = useState(false);

  useEffect(() => {
    if (!user || user.uloga !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetch('/api/prijava')
      .then((res) => res.json())
      .then((data) => {
        setPrijave(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user, router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Da li želite da obrišete ovu prijavu?')) return;

    try {
      const res = await fetch(`/api/prijava/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPrijave(prijave.filter((p) => p.id !== id));
        alert('Prijava obrisana');
      } else {
        alert('Greška pri brisanju');
      }
    } catch (err) {
      console.error(err);
      alert('Greška pri brisanju');
    }
  };

  const handleAddPredmet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noviPredmet.trim()) return;

    setAddingPredmet(true);
    try {
      const res = await fetch('/api/predmeti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nazivPredmeta: noviPredmet }),
      });

      if (res.ok) {
        alert('Predmet uspešno dodat!');
        setNoviPredmet('');
      } else {
        const data = await res.json();
        alert(data.error || 'Greška pri dodavanju predmeta');
      }
    } catch (err) {
      console.error(err);
      alert('Greška pri dodavanju predmeta');
    } finally {
      setAddingPredmet(false);
    }
  };

  if (!user || user.uloga !== 'ADMIN') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-800">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {/* Forma za dodavanje predmeta */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dodaj novi predmet</h2>
          <form onSubmit={handleAddPredmet} className="flex gap-4">
            <input
              type="text"
              value={noviPredmet}
              onChange={(e) => setNoviPredmet(e.target.value)}
              placeholder="Naziv predmeta (npr. Hemija)"
              required
              className="flex-1 border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={addingPredmet}
              className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {addingPredmet ? 'Dodavanje...' : 'Dodaj predmet'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prijave oglasa</h2>

          {prijave.length === 0 ? (
            <p className="text-gray-600">Nema prijava</p>
          ) : (
            <div className="space-y-4">
              {prijave.map((prijava) => (
                <div
                  key={prijava.id}
                  className="border-2 border-gray-300 p-4 rounded-lg flex justify-between items-start"
                >
                  <div>
                    <p className="text-gray-900 font-semibold">
                      Prijava #{prijava.id}
                    </p>
                    <p className="text-gray-700 mt-2">
                      <span className="font-medium">Razlog:</span> {prijava.razlog}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Oglas ID: {prijava.oglasId} | Korisnik ID: {prijava.korisnikId}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(prijava.datum).toLocaleString('sr-RS')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(prijava.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold transition"
                  >
                    Obriši
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/api-docs"
            className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition text-center block"
          >
            <h3 className="text-xl font-bold">API Dokumentacija</h3>
            <p className="text-sm mt-2 opacity-90">Swagger UI</p>
          </a>
          <a
            href="/statistika"
            className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition text-center block"
          >
            <h3 className="text-xl font-bold">Statistika</h3>
            <p className="text-sm mt-2 opacity-90">Grafički prikaz podataka</p>
          </a>
          <a
            href="/oglasi"
            className="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700 transition text-center block"
          >
            <h3 className="text-xl font-bold">Svi oglasi</h3>
            <p className="text-sm mt-2 opacity-90">Pregled i brisanje</p>
          </a>
        </div>
      </div>
    </div>
  );
}
