"use client";

import { useEffect, useState, Suspense } from "react";
import OglasiSidebar from "../components/OglasiSideBar";
import OglasCard from "../components/OglasCard";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import WeatherWidget from "../components/WeatherWidget";

type OglasRow = {
  id: number;
  ime: string;
  prezime: string;
  predmet: string;
  opis: string | null;
  lokacija: string | null;
  cena: number;
  nacin: "ONLINE" | "UZIVO" | "OBA";
  tutorId:number;
};

type Subject = { idPredmet: number; nazivPredmeta: string };

function OglasiContent() {
  const sp = useSearchParams();
  const { user } = useAuth();

  const [oglasi, setOglasi] = useState<OglasRow[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const predmet = sp.get("predmet") ?? "";
  const nacin = sp.get("nacin") ?? "";
  const lokacija = sp.get("lokacija") ?? "";

  const fetchOglasi = async () => {
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (predmet) query.set("predmet", predmet);
    if (nacin) query.set("nacin", nacin);
    if (lokacija) query.set("lokacija", lokacija);

    try {
      const [oglRes, subjRes] = await Promise.all([
        fetch(`/api/oglasi?${query.toString()}`),
        fetch("/api/predmeti"),
      ]);

      if (!oglRes.ok || !subjRes.ok) {
        throw new Error("Greška pri učitavanju podataka");
      }

      const [ogl, subj] = await Promise.all([oglRes.json(), subjRes.json()]);

      console.log("Učitani oglasi:", ogl);
      console.log("Učitani predmeti:", subj);

      setOglasi(Array.isArray(ogl) ? ogl : []);
      setSubjects(Array.isArray(subj) ? subj : []);
    } catch (e) {
      console.error("Greška pri učitavanju oglasa/predmeta", e);
      setError("Greška pri povezivanju sa bazom. Da li ste pokrenuli migracije i seed?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOglasi();
  }, [predmet, nacin, lokacija]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-800">Učitavanje oglasa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <div className="text-sm text-gray-700 space-y-2">
            <p>Probajte sledeće:</p>
            <ol className="list-decimal list-inside">
              <li>Pokrenite migracije: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:migrate</code></li>
              <li>Popunite bazu: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:seed</code></li>
              <li>Proverite browser console za detalje</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900" style={{ color: "#111827" }}>Oglasi</h1>
        {user?.uloga === 'TUTOR' && (
          <Link
            href="/kreiraj-oglas"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Kreiraj oglas
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <OglasiSidebar subjects={subjects} />

        <main className="flex-1">
          {lokacija && (
            <div className="mb-6">
              <WeatherWidget city={lokacija} />
            </div>
          )}
          {oglasi.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-xl text-gray-800 mb-4">Nema oglasa koji odgovaraju filterima</p>
              <p className="text-gray-600">Pokušajte sa drugim kriterijumima pretrage</p>
             
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: '1fr' }}>
              {oglasi.map((o) => (
                <OglasCard
                  key={o.id}
                  id={o.id}
                  ime={`${o.ime} ${o.prezime}`}
                  predmet={o.predmet}
                  opis={o.opis}
                  lokacija={o.lokacija}
                  cena={o.cena}
                  tutorId={o.tutorId}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function OglasiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-800">Učitavanje...</p>
      </div>
    }>
      <OglasiContent />
    </Suspense>
  );
}


/*  <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-gray-800 font-semibold mb-2">💡 Napomena:</p>
                <p className="text-sm text-gray-700">
                  Ako uopšte nema oglasa, pokrenite: <br/>
                  <code className="bg-white px-2 py-1 rounded mt-2 inline-block">npm run db:seed</code>
                </p>
              </div> */