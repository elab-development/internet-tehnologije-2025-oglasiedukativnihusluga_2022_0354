"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function LogoutButton() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // ako nije ulogovan — dugme se ne prikazuje
  if (!user) return null;

  const handleLogout = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Logout failed");

      // očisti user iz context-a
      setUser(null);

      // redirect na login
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Došlo je do greške prilikom odjave");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Odjavljivanje..." : "Logout"}
    </button>
  );
}
