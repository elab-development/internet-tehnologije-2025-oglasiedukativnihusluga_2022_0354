
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: number; uloga: "ADMIN" | "KORISNIK" | "TUTOR" } | null;

const AuthContext = createContext<{ user: User; setUser: (u: User) => void }>({ user: null, setUser: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data?.id ? data : null));
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
