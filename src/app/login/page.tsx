"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";

type LoginResponse = {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  uloga: "KORISNIK" | "TUTOR" | "ADMIN";
};

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

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setToast(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lozinka }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Došlo je do greške");
        setLoading(false);
        return;
      }

      const data: LoginResponse = await res.json();
      // KLJUČNO: odmah update-ujemo AuthContext
      setUser(data);
      console.log("Logged in user:", data);

      // Toast za uspešan login
      setToast("Uspešno ste se prijavili!");

      // Redirect na početnu stranicu posle 1 sekunde
      setTimeout(() => router.push("/"), 1000);
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

        <h1 className="text-3xl font-bold mb-6 text-gray-900 mt-8">Prijava</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">{error}</div>
        )}

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            required
            className="border-2 border-gray-400 p-3 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Prijavljivanje..." : "Prijavi se"}
          </button>
        </form>

        {/* Link za prelazak na registraciju */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Nemate nalog?{" "}
            <Link
              href="/register"
              className="text-green-600 hover:text-green-700 font-semibold hover:underline transition"
            >
              Registrujte se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
