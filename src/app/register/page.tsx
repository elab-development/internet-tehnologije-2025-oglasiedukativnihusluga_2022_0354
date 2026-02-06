"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type RegisterResponse = {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  role: "KORISNIK" | "TUTOR";
};

// Jednostavan toast komponent
function Toast({
  message,
  duration = 2000,
  onClose,
}: {
  message: string;
  duration?: number;
  onClose?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white p-3 rounded shadow-lg animate-fade-in animate-fade-out">
      {message}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setToast(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ime, prezime, email, lozinka }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Došlo je do greške");
        setLoading(false);
        return;
      }

      const data: RegisterResponse = await res.json();
      console.log("Registered user:", data);

      // Prikaz toast-a
      setToast("Uspešno ste se registrovali! Bićete preusmereni na login...");

      // Automatski redirect posle 2 sekunde
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError("Došlo je do greške pri povezivanju sa serverom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Registracija</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Ime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Prezime"
          value={prezime}
          onChange={(e) => setPrezime(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Registracija..." : "Registruj se"}
        </button>
      </form>
    </div>
  );
}
