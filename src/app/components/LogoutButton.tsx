"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function LogoutButton() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout(); // toast i user state se postavljaju u AuthContext
      setTimeout(() => router.push("/"), 1500); // Preusmeri na početnu stranicu
    } finally {
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
