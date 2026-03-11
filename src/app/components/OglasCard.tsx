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

// Helper funkcija za kapitalizaciju imena
function capitalizeWords(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

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
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

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

  // Funkcija za brisanje oglasa
  const handleDelete = async () => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj oglas?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/oglasi/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', res.status);
      const data = await res.json();
      console.log('Delete response data:', data);

      if (res.ok || res.status === 200) {
        // Sakrij karticu odmah
        setDeleted(true);

        // Prikaži uspešnu poruku
        setTimeout(() => {
          alert('Oglas uspešno obrisan!');
          // Refresh stranice da učita nove podatke
          router.refresh();
        }, 300);
      } else {
        alert(data.error || 'Greška pri brisanju oglasa');
        setDeleting(false);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Greška pri brisanju oglasa');
      setDeleting(false);
    }
  };

  // Ako je obrisan, ne prikazuj karticu
  if (deleted) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "white",
        height: "100%"
      }}
    >
      {/* Klikabilni deo kartice */}
      <div
        style={{
          padding: 16,
          flex: 1,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          cursor: user?.uloga === "KORISNIK" ? "pointer" : "default"
        }}
        onClick={handleCardClick}
      >
        <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>{capitalizeWords(ime)}</div>
        <div style={{ fontWeight: 600, color: "#374151", marginBottom: 8 }}>{predmet}</div>
        <div style={{ lineHeight: 1.5, color: "#4B5563", flex: 1 }}>{opis ?? "-"}</div>
      </div>

      <div style={{ background: "#0f172a", color: "white", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ opacity: 0.95, fontSize: 14 }}>{lokacija ?? "-"}</div>
        <div style={{ fontWeight: 800, fontSize: 20 }}>{cena} RSD/60min</div>

        {/* Dugme za recenziju (samo korisnik) */}
        {user?.uloga === "KORISNIK" && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
            style={{
              padding: "10px 14px",
              background: "#facc15",
              color: "#000",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              marginTop: 4,
            }}
          >
            Ostavi recenziju
          </button>
        )}

        {/* Dugmad za brisanje (tutor vlasnik ili admin) */}
        {user && (user.uloga === "ADMIN" || (user.uloga === "TUTOR" && user.id === tutorId)) && (
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={deleting}
            style={{
              padding: "10px 14px",
              background: "#ef4444",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              opacity: deleting ? 0.5 : 1,
              width: "100%",
              marginTop: 4,
            }}
          >
            {deleting ? 'Brisanje...' : 'Obriši'}
          </button>
        )}
      </div>

      {/* Modal za recenziju */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#111827" }}>Ostavi recenziju</h2>

        <label style={{ color: "#374151", fontWeight: 600 }}>
          Ocena:
          <select
            value={ocena}
            onChange={(e) => setOcena(Number(e.target.value))}
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12, border: "2px solid #9CA3AF", borderRadius: 6, color: "#111827" }}
          >
            {[5,4,3,2,1].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label style={{ color: "#374151", fontWeight: 600 }}>
          Komentar (opcionalno):
          <textarea
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12, border: "2px solid #9CA3AF", borderRadius: 6, color: "#111827" }}
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
