"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

type Props = {
  id: number;
  ime: string;
  predmet: string;
  opis?: string | null;
  lokacija?: string | null;
  cena: number;
  tutorId: number;
};

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white text-black p-6 rounded-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="float-right text-red-500" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}

export default function OglasCard({ id, ime, predmet, opis, lokacija, cena, tutorId }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [ocena, setOcena] = useState(5);
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Funkcija za recenziju
  const submitRecenzija = async () => {
    if (!tutorId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/recenzija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, ocena, komentar }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccess(true);
        setTimeout(() => setShowModal(false), 1500);
      } else {
        console.error("Greška pri slanju recenzije", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Funkcija za klik na karticu (osim dugmeta)
  const handleCardClick = () => {
    if (user?.uloga === "KORISNIK") {
      router.push(`/tutor/${tutorId}`);
    }
  };

  return (
    <div
      style={{ display: "block", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "white" }}
    >
      {/* Klikabilni deo kartice */}
      <div
        style={{ padding: 16, minHeight: 220, cursor: user?.uloga === "KORISNIK" ? "pointer" : "default" }}
        onClick={handleCardClick} // Ovo preusmerava korisnika
      >
        <div style={{ marginTop: 14, fontSize: 28, fontWeight: 800 }}>{ime}</div>
        <div style={{ marginTop: 6, opacity: 0.8, fontWeight: 600 }}>{predmet}</div>
        <div style={{ marginTop: 10, opacity: 0.8, lineHeight: 1.5 }}>{opis ?? "-"}</div>
      </div>

      <div style={{ background: "#0f172a", color: "white", padding: 15 }}>
        <div style={{ opacity: 0.95 }}>{lokacija ?? "-"}</div>
        <div style={{ marginTop: 8, fontWeight: 800 }}>{cena} RSD/60</div>

        {/* Dugme za recenziju ostaje isto */}
        {user?.uloga === "KORISNIK" && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
            style={{
              marginTop: 10,
              padding: "8px 12px",
              background: "#facc15",
              color: "#000",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Ostavi recenziju
          </button>
        )}
      </div>

      {/* Modal za recenziju */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Ostavi recenziju</h2>

        <label>
          Ocena:
          <select
            value={ocena}
            onChange={(e) => setOcena(Number(e.target.value))}
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
          >
            {[5,4,3,2,1].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label>
          Komentar (opcionalno):
          <textarea
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
            rows={3}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={() => setShowModal(false)}
            style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}
          >
            Otkaži
          </button>
          <button
            onClick={submitRecenzija}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "#0f172a",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
            disabled={loading || success}
          >
            {loading ? "Šaljem..." : success ? "Uspešno!" : "Pošalji"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
