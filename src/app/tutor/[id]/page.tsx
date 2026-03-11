"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type TutorData = {
  idT: number;
  biografija?: string | null;
  godineIskustva: number;
  lokacija?: string | null;
  telefon?: string | null;
  ime: string;
  prezime: string;
  email: string;
};

export default function TutorPage() {
  const params = useParams();
  const [tutor, setTutor] = useState<TutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setError("Neispravan ID");
      setLoading(false);
      return;
    }

    const fetchTutor = async () => {
      try {
        const res = await fetch(`/api/tutori/${Number(id)}`);
        if (!res.ok) {
          // Ako API vrati 404 ili 500
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error || "Tutor nije pronađen");
        }

        const data: TutorData = await res.json();
        setTutor(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Greška pri učitavanju tutora");
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [params?.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-xl text-gray-800">Učitavanje...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-xl text-red-600">{error}</p>
    </div>
  );

  if (!tutor) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-xl text-gray-800">Tutor nije pronađen</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {tutor.ime} {tutor.prezime}
        </h1>
        <div className="space-y-3 text-gray-800">
          <p><span className="font-semibold text-gray-900">Email:</span> {tutor.email}</p>
          <p><span className="font-semibold text-gray-900">Godine iskustva:</span> {tutor.godineIskustva}</p>
          <p><span className="font-semibold text-gray-900">Telefon:</span> {tutor.telefon ?? "-"}</p>
          <p><span className="font-semibold text-gray-900">Lokacija:</span> {tutor.lokacija ?? "-"}</p>
          {tutor.biografija && (
            <div className="mt-4">
              <p className="font-semibold text-gray-900">Biografija:</p>
              <p className="text-gray-700 mt-2">{tutor.biografija}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
