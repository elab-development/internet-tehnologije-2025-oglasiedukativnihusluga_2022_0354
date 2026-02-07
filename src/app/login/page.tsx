"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      router.push("/oglasi"); // redirect


      // Toast za uspešan login
      setToast("Uspešno ste se prijavili!");

      // Redirect posle 1 sekunde
      setTimeout(() => router.push("/oglasi"), 1000);
    } catch (err) {
      console.error(err);
      setError("Došlo je do greške pri povezivanju sa serverom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Prijava</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Prijavljivanje..." : "Prijavi se"}
        </button>
      </form>
    </div>
  );
}
