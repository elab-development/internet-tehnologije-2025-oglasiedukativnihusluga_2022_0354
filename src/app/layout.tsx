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
      {/* Levo: KlikDoZnanja + Linkovi */}
<div style={{ display: "flex", alignItems: "center", gap: 24 }}>
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

  {user && (
    <div style={{ display: "flex", gap: 16 }}>
      <Link
        href="/oglasi"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: 16,
          fontWeight: 500,
          opacity: 0.9,
          transition: "opacity 0.2s",
        }}
      >
        Oglasi
      </Link>
      <Link
        href="/statistika"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: 16,
          fontWeight: 500,
          opacity: 0.9,
          transition: "opacity 0.2s",
        }}
      >
        Statistika
      </Link>
      {user.uloga === "TUTOR" && (
        <Link
          href="/kreiraj-oglas"
          style={{
            color: "#facc15",
            textDecoration: "none",
            fontSize: 16,
            fontWeight: 600,
            opacity: 0.95,
          }}
        >
          + Kreiraj oglas
        </Link>
      )}
      {user.uloga === "ADMIN" && (
        <>
          <Link
            href="/admin"
            style={{
              color: "#10b981",
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 600,
              opacity: 0.95,
            }}
          >
            Admin Panel
          </Link>
          <Link
            href="/api-docs"
            style={{
              color: "#10b981",
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 500,
              opacity: 0.85,
            }}
          >
            API Docs
          </Link>
        </>
      )}
    </div>
  )}
</div>

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