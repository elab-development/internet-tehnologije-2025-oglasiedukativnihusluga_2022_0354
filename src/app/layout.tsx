"use client";

import "./globals.css";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/auth-context";
import LogoutButton from "./components/LogoutButton";

function Navigation() {
  const { user } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // razdvoji levu i desnu stranu
        width: "100%",
      }}
    >
      {/* Levo: KlikDoZnanja + Pocetna */}
<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
  <Link href="/" style={{ textDecoration: "none" }}>
    <div
      style={{
        fontWeight: 900,
        fontSize: 23,
        color: "crimson",
        letterSpacing: 0.5,
        background: "rgba(255, 45, 85, 0.12)",
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255, 45, 85, 0.25)",
        cursor: "pointer",
      }}
    >
      KlikDoZnanja
    </div>
  </Link>
</div>


   {/*      <Link
          href="/"
          style={{
            fontWeight: 400,
            fontSize: 17,
            color: "#fff",
            textDecoration: "none",
            opacity: 0.9,
            letterSpacing: "0.4px",
          }}
        >
          
        </Link>
      </div>
 */}
      {/* Desno: Logout dugme (samo ako je loginovan) */}
      <div>{user && <LogoutButton />}</div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundImage: "url('/images/pozadina4.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <AuthProvider>
          {/* HEADER */}
          <header style={{ padding: "10px 24px", backgroundColor: "#09152b" }}>
            <Navigation />
          </header>

          {/* MAIN */}
          <main style={{ flex: 1 }}>
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 36px" }}>
              {children}
            </div>
          </main>

          {/* FOOTER */}
          <footer style={{ color: "#ffffff", width: "100%", background: "#09152b" }}>
            <div
              style={{
                maxWidth: 1400,
                margin: "0 auto",
                padding: "20px 36px",
                textAlign: "center",
                fontSize: 14,
                opacity: 0.7,
              }}
            >
              KlikDoZnanja © 2026 • Sva prava zadržana
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}