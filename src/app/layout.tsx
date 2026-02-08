"use client";

import "./globals.css";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/auth-context";
import LogoutButton from "./components/LogoutButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <body className="min-h-screen antialiased">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/images/pozadina4.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 400px at 20% 15%, rgba(255,45,85,0.18), transparent 60%)",
            }}
          />
        </div>

        <AuthProvider>
          {/* HEADER */}
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09152b]/40 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-lg font-extrabold tracking-tight text-rose-300 hover:bg-rose-500/15"
              >
                KlikDoZnanja
              </Link>

              <Link
                href="/login"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
              >
                Prijava
              </Link>
            </div>
          </header>

          {/* MAIN */}
          <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>

          {/* FOOTER */}
          <footer className="border-t border-white/10 bg-[#09152b]/60">
            <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-white/60">
              KlikDoZnanja © 2026 • Sva prava zadržana
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
