import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              KlikDoZnanja
            </h1>
            <p className="text-white/80 text-lg">
              Pronađi privatne časove brzo: pregledaj oglase, filtriraj po predmetu i načinu izvođenja,
              i prijavi se za termin.
            </p>

            <div className="flex gap-3">
              <Link
                href="/oglasi"
                className="rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90"
              >
                Pogledaj oglase
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10"
              >
                Registruj se
              </Link>
            </div>

            <p className="text-sm text-white/60">
              Već imaš nalog?{" "}
              <Link className="underline hover:text-white" href="/login">
                Prijavi se
              </Link>
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur border border-white/10">
              <h3 className="text-white font-bold text-xl">1) Pretraži</h3>
              <p className="text-white/70 text-sm mt-1">
                Filtriraj oglase po predmetu, lokaciji i načinu izvođenja.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur border border-white/10">
              <h3 className="text-white font-bold text-xl">2) Izaberi</h3>
              <p className="text-white/70 text-sm mt-1">
                Otvori detalje oglasa i uporedi cenu i opis.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur border border-white/10">
              <h3 className="text-white font-bold text-xl">3) Prijavi se</h3>
              <p className="text-white/70 text-sm mt-1">
                Pošalji prijavu za čas (dostupno ulogovanim korisnicima).
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
