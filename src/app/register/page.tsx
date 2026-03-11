"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";

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
  const [uloga, setUloga] = useState<"KORISNIK" | "TUTOR" | "ADMIN">("KORISNIK");

  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setToast(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ime, prezime, email, lozinka,  uloga, }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Došlo je do greške");
        setLoading(false);
        return;
      }
      
      // Uspešna registracija
      const data: RegisterResponse = await res.json();
      console.log("Registered user:", data);

      // Prikaz toast-a
      setToast("Uspešno ste se registrovali! Bićete preusmereni na početnu...");

      // Automatski redirect na početnu stranicu posle 2 sekunde
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      console.error(err);
      setError("Došlo je do greške pri povezivanju sa serverom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-2xl relative">
        {/* Strelica za nazad */}
        <Link
          href="/"
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 group"
        >
          <RiArrowLeftLine size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Nazad</span>
        </Link>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 mt-8">Registracija</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">{error}</div>
        )}

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ime"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            required
            className="border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <input
            type="text"
            placeholder="Prezime"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
            required
            className="border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            required
            className="border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <select
            value={uloga}
            onChange={(e) => setUloga(e.target.value as "KORISNIK" | "TUTOR" | "ADMIN")}
            className="border-2 border-gray-400 p-3 rounded bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
            <option value="KORISNIK" className="text-gray-900">Korisnik (tražim časove)</option>
            <option value="TUTOR" className="text-gray-900">Tutor (držim časove)</option>
            <option value="ADMIN" className="text-gray-900">Administrator</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white p-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? "Registracija..." : "Registruj se"}
          </button>
        </form>

        {/* Link za prelazak na login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Već imate nalog?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
            >
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
