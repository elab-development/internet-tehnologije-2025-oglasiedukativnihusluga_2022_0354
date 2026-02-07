"use client";

import { useEffect, useMemo, useState } from "react";
import OglasiSidebar from "../components/OglasiSideBar";
import OglasCard from "../components/OglasCard";
import { useSearchParams } from "next/navigation";

type OglasRow = {
  id: number;
  ime: string;
  prezime: string;
  predmet: string;
  opis: string | null;
  lokacija: string | null;
  cena: string;
  nacin: "ONLINE" | "UZIVO" | "OBA";
};

type Subject = { nazivPredmeta: string };

export default function OglasiClient() {
  const sp = useSearchParams();

  const [oglasi, setOglasi] = useState<OglasRow[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/oglasi"), fetch("/api/predmeti")])
      .then(async ([o, p]) => {
        const [ogl, subj] = await Promise.all([o.json(), p.json()]);
        setOglasi(ogl);
        setSubjects(subj);
      })
      .finally(() => setLoading(false));
  }, []);

  const predmet = sp.get("predmet");
  const nacin = sp.get("nacin");
  const lokacija = sp.get("lokacija");

  const filtered = useMemo(() => {
    return oglasi.filter((o) => {
      if (predmet && o.predmet !== predmet) return false;
      if (nacin && o.nacin !== nacin) return false;
      if (lokacija && !(o.lokacija ?? "").toLowerCase().includes(lokacija.toLowerCase()))
        return false;
      return true;
    });
  }, [oglasi, predmet, nacin, lokacija]);

  if (loading) return <div style={{ padding: 24 }}>Učitavanje...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <OglasiSidebar subjects={subjects} />

        <main className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => (
              <OglasCard
                key={o.id}
                id={o.id}
                ime={`${o.ime} ${o.prezime}`}
                predmet={o.predmet}
                opis={o.opis}
                lokacija={o.lokacija}
                cena={Number(o.cena)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
