/* import OglasiSidebar from "../components/OglasiSideBar";
import OglasCard from "../components/OglasCard";
import OglasiSidebar from "../components/SideBar";
import LogoutButton from "../components/LogoutButton";
<<<<<<< HEAD

=======
>>>>>>> ec9e174ba489a9d1ce785998e4480d80ea1937af


type SearchParams = {
  predmet?: string;
  lokacija?: string;
  nacin?: string;
  minCena?: string;
  maxCena?: string;
};

type OglasRow = {
  id: number;
  ime: string;
  prezime: string;
  predmet: string;
  opis: string | null;
  lokacija: string | null;
  cena: string; // numeric često dođe kao string
  nacin: "ONLINE" | "UZIVO" | "OBA";
};

type Subject = { nazivPredmeta: string };

function qs(sp: SearchParams) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v) p.set(k, v);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function OglasiPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const base = "http://localhost:3000"; // za dev; kasnije može env

  const [subjectsRes, oglasiRes] = await Promise.all([
    fetch(`${base}/api/predmeti`, { cache: "no-store" }),
    fetch(`${base}/api/oglasi${qs(searchParams)}`, { cache: "no-store" }),
  ]);

  const subjects = (await subjectsRes.json()) as Subject[];
  const oglasi = (await oglasiRes.json()) as OglasRow[];

  return (
    <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto 0 0" }}>
     <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
     <div className="mt-4 flex flex-col gap-6 md:flex-row">
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <OglasiSidebar subjects={subjects} />

        <main className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {oglasi.map((o) => (
              <OglasCard
                key={o.id}
                id={o.id}
                ime={`${o.ime}${o.prezime ? " " + o.prezime : ""}`}
                predmet={o.predmet}
                opis={o.opis}
                lokacija={o.lokacija}
                cena={Number(o.cena)} // da OglasCard dobije number
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

 */
/* 
import OglasiSidebar from "../components/OglasiSideBar";
import OglasCard from "../components/OglasCard";

type SearchParams = {
  predmet?: string;
  lokacija?: string;
  nacin?: string;
  minCena?: string;
  maxCena?: string;
};

type OglasRow = {
  id: number;
  ime: string;
  prezime: string;
  predmet: string;
  opis: string | null;
  lokacija: string | null;
  cena: string;
  nacin: "ONLINE" | "UZIVO" | "OBA";
};

type Subject = {
  nazivPredmeta: string;
};

function qs(sp: SearchParams) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v) p.set(k, v);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function OglasiPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // 👇 OVO JE KLJUČNO (Next 16+)
  const sp = await searchParams;

  const base = "http://localhost:3000";

  const [subjectsRes, oglasiRes] = await Promise.all([
    fetch(`${base}/api/predmeti`, { cache: "no-store" }),
    fetch(`${base}/api/oglasi${qs(sp)}`, { cache: "no-store" }),
  ]);

  const subjects = (await subjectsRes.json()) as Subject[];
  const oglasi = (await oglasiRes.json()) as OglasRow[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <OglasiSidebar subjects={subjects} />

        <main className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {oglasi.map((o) => (
              <OglasCard
                key={o.id}
                id={o.id}
                ime={`${o.ime}${o.prezime ? " " + o.prezime : ""}`}
                predmet={o.predmet}
                opis={o.opis}
                lokacija={o.lokacija}
                cena={Number(o.cena)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
 */

import OglasiClient from "./OglasiClient";

export default function OglasiPage() {
  return <OglasiClient />;
}
