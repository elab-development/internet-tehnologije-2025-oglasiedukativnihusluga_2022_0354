"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl transition duration-300 hover:scale-[1.03]">
      <div className="text-base font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-white/70">{desc}</div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl transition duration-300 hover:scale-[1.03]">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/65">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth(); // uzima info iz auth konteksta

  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center">
      {/* Left: Hero */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Privatni časovi — brzo i pregledno
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          Nađi profesora bez cimanja.
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-white/75">
          Pregledaj oglase, filtriraj po predmetu i načinu izvođenja (online ili
          uživo), pa se prijavi za termin — sve na jednom mestu.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/oglasi"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10"
          >
            Pogledaj oglase
          </Link>

          {/* prikazuje se samo ako user NIJE loginovan */}
          {!user && (
            <Link
              href="/register"
              className="rounded-xl bg-rose-500/90 px-5 py-3 font-semibold text-white hover:bg-rose-500"
            >
              Napravi nalog
            </Link>
          )}
        </div>

        {/* prikazuje se samo ako user NIJE loginovan */}
        {!user && (
          <p className="text-sm text-white/60">
            Već imaš nalog?{" "}
            <Link className="underline hover:text-white" href="/login">
              Prijavi se
            </Link>
          </p>
        )}
      </section>

      {/* Desno: Clean info blocks */}
      <section className="space-y-4">
        <div className="grid gap-3">
          <Stat value="< 1 min" label="prosečno vreme do prijave" />
        </div>

        <div className="grid gap-3">
          <Card
            title="JASNO I TRANSPARENTNO"
            desc="Cena, opis i način izvođenja su vidljivi odmah — bez dopisivanja u prazno."
          />
          <Card
            title="ONLINE ILI UŽIVO"
            desc="Biraj kako ti odgovara: video poziv ili čas na lokaciji."
          />
          <Card
            title="BRZO DO TERMINA"
            desc="Kada nađeš oglas koji ti odgovara — prijava je jednostavna i brza."
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl transition duration-300 hover:scale-[1.03]">
          <div className="text-base font-semibold text-white">ŠTA KAŽU KORISNICI?</div>

          <p className="mt-2 text-sm leading-relaxed text-white/75">
            “Sve mi je bilo jasno odmah!! Našla sam odličnog profesora engleskog i rešila
            problem za isti dan.”
          </p>
          <div className="mt-3 text-xs text-white/55">— Marija</div>
        </div>
      </section>
    </div>
  );
}
//komentar na odbrani