import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/auth-context";

const navLinkStyle = {
  fontWeight: 400,
  fontSize: 17,
  color: "#fff",
  textDecoration: "none",
  opacity: 0.9,
   letterSpacing: "0.4px",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body>
          <AuthProvider>
            <header style={{ borderBottom: "1px solid #eee", padding: "24px 36px", backgroundColor:"#2e0404"}}>
              <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontWeight: 900, 
                              fontSize:23,
                              color:"crimson", 
                              letterSpacing:0.5,
                              background: "rgba(255, 45, 85, 0.12)",
                              padding: "6px 10px",
                              borderRadius: 999,
                              border: "1px solid rgba(255, 45, 85, 0.25)"
                              }}>KlikDoZnanja</div>
                <Link href="/" style={navLinkStyle}>Pocetna</Link>
                <Link href="/oglasi" style={navLinkStyle}>Oglasi</Link>
                <Link href="/nalozi/login" style={navLinkStyle}>Nalog</Link>
              </nav>
            </header>

            <main style={{ padding: "24px" }}>
              {children}
            </main>
          </AuthProvider>
      </body>
    </html>
  );
}
