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

  if (loading) return <div style={{ padding: 24 }}>Učitavanje...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;
  if (!tutor) return <div style={{ padding: 24 }}>Tutor nije pronađen</div>;
 /*  <h1>{tutor.ime} {tutor.prezime}</h1>
      <p><b>Email:</b> {tutor.email}</p>
*/
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
     
      <p><b>Godine iskustva:</b> {tutor.godineIskustva}</p>
      <p><b>Telefon:</b> {tutor.telefon ?? "-"}</p>
      <p><b>Lokacija:</b> {tutor.lokacija ?? "-"}</p>
      {tutor.biografija && <p><b>Biografija:</b> {tutor.biografija}</p>}
    </div>
  );
}
