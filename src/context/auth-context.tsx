"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Tip korisnika
export type User = {
  id: number;
  ime?: string;
  prezime?: string;
  email?: string;
  uloga: "ADMIN" | "KORISNIK" | "TUTOR";
} | null;

// Tip Auth konteksta
type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};

// Kreiranje konteksta sa default vrednostima
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
});

// AuthProvider wrapper
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  // Fetch trenutnog korisnika sa servera prilikom mount-a
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data?.id ? data : null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // Logout funkcija
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null); // resetuje stanje korisnika u React-u
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook za korišćenje Auth konteksta
export const useAuth = () => useContext(AuthContext);