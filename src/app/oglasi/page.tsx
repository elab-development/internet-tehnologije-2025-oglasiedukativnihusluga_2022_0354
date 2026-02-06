import { oglas, predmet, tutor, korisnik } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import OglasCard from "../components/OglasCard";
import OglasiSidebar from "../components/SideBar";
import LogoutButton from "../components/LogoutButton";


export default async function OglasiPage(){
        const subjects = await db
          .select({nazivPredmeta: predmet.nazivPredmeta })
          .from(predmet)
          .orderBy(predmet.nazivPredmeta);
     const data = await db
    .select({
      idOglas: oglas.idOglas,
      naslov: oglas.naslov,
      opis: oglas.opis,
      lokacija: oglas.lokacija,
      nacinIzvodjenja: oglas.nacinIzvodjenja,
      cena: oglas.cena,
      predmetNaziv: predmet.nazivPredmeta,
      tutorIme: korisnik.ime,
      tutorPrezime: korisnik.prezime,
    })
    .from(oglas)
    .innerJoin(predmet, eq(oglas.predmetId, predmet.idPredmet))
    .innerJoin(tutor, eq(oglas.tutorId, tutor.idT))
    .innerJoin(korisnik, eq(tutor.idT, korisnik.id));

  return (
    <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto 0 0" }}>
     <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
     <div className="mt-4 flex flex-col gap-6 md:flex-row">
        <OglasiSidebar subjects={subjects} />

        <div className="flex-1 min-w-0">
          <div className="oglasiGrid">
            {data.map((o) => (
              <OglasCard
                key={o.idOglas}
                id={(o.idOglas)}
                ime={`${o.tutorIme} ${o.tutorPrezime?.[0] ?? ""}.`}
                predmet={o.predmetNaziv}
                opis={o.opis}
                lokacija={o.lokacija}
                cena={Number(o.cena)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}