// auth-context.tsx
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
  toast: string | null;
  setToast: (msg: string | null) => void;
};

// Kreiranje konteksta sa default vrednostima
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  toast: null,
  setToast: () => {},
});

// AuthProvider wrapper
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch trenutnog korisnika sa servera prilikom mount-a
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          // Osiguravamo da uvek postoji polje uloga
          if (data.user && data.user.uloga) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Greška pri fetchovanju korisnika:", err);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // Logout funkcija
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setToast("Uspešno ste se izlogovali!");
      setTimeout(() => setToast(null), 1500); // toast nestaje posle 1.5s
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, toast, setToast }}>
      {children}
      {/* toast se renderuje nezavisno od user */}
      {toast && (
        <div className="fixed top-4 right-4 bg-yellow-600 text-white p-3 rounded shadow-lg animate-fade-in animate-fade-out">
          {toast}
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Hook za korišćenje Auth konteksta
export const useAuth = () => useContext(AuthContext);
