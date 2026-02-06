"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // Redirect to login page
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
