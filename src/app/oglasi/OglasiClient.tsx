"use client";

import { useEffect, useState } from "react";
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
  cena: number;
  nacin: "ONLINE" | "UZIVO" | "OBA";
  tutorId:number;
};

type Subject = { nazivPredmeta: string };

export default function OglasiClient() {
  const sp = useSearchParams();

  const [oglasi, setOglasi] = useState<OglasRow[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const predmet = sp.get("predmet") ?? "";
  const nacin = sp.get("nacin") ?? "";
  const lokacija = sp.get("lokacija") ?? "";

  const fetchOglasi = async () => {
    setLoading(true);

    const query = new URLSearchParams();
    if (predmet) query.set("predmet", predmet);
    if (nacin) query.set("nacin", nacin);
    if (lokacija) query.set("lokacija", lokacija);

    try {
      const [oglRes, subjRes] = await Promise.all([
        fetch(`/api/oglasi?${query.toString()}`),
        fetch("/api/predmeti"),
      ]);

      const [ogl, subj] = await Promise.all([oglRes.json(), subjRes.json()]);

      setOglasi(ogl);
      setSubjects(subj);
    } catch (e) {
      console.error("Greska pri ucitavanju oglasa/predmeta", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOglasi();
  }, [predmet, nacin, lokacija]);

  if (loading) return <div style={{ padding: 24 }}>Učitavanje...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <OglasiSidebar subjects={subjects} />

        <main className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </main>
      </div>
    </div>
  );
}
