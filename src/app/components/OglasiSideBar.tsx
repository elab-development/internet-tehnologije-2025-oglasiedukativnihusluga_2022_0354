"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FilterBtn from "./FilterBtn";
import { useEffect, useState } from "react";

type Subject = {
  idPredmet: number;
  nazivPredmeta: string;
};

type Props = {
  subjects: Subject[];
};

export default function OglasiSidebar({ subjects }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const predmet = sp.get("predmet"); 
  const nacin = sp.get("nacin"); 
  const lokacijaParam = sp.get("lokacija") ?? "";
  const [lokacija, setLokacija] = useState(lokacijaParam);

useEffect(() => {
  setLokacija(lokacijaParam);
}, [lokacijaParam]);

 function setParam(key: string, value: string | null, replace = false) {
  const next = new URLSearchParams(sp.toString());
  if (!value) next.delete(key);
  else next.set(key, value);
  next.delete("page");

  const url = `/oglasi?${next.toString()}`;
  if (replace) router.replace(url);
  else router.push(url);
}

useEffect(() => {
  const t = setTimeout(() => {
    setParam("lokacija", lokacija || null, true); // true => replace
  }, 600);

  return () => clearTimeout(t);
}, [lokacija]); 


  return (
    <aside className="w-full md:w-72 shrink-0 mr-6 -ml-4">
      <div  style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(15, 23, 42, 0.10)",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        backdropFilter: "blur(6px)",
      }}
      className="md:sticky md:top-24">
        {/* Lokacija search */}
        <input
          type="text"
          placeholder="Mesto (npr. Beograd)"
          className="w-full rounded border-2 border-gray-400 px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
          value={lokacija}
          onChange={(e) => setLokacija(e.target.value)}
        />

        {/* Predmeti */}
        <div className="flex flex-wrap gap-2 md:flex-col">
          <FilterBtn active={!predmet} handleClick={() => setParam("predmet", null)}>
            Svi predmeti
          </FilterBtn>

          {subjects.map((s) => (
            <FilterBtn
              key={s.idPredmet}
              active={predmet === s.nazivPredmeta}
              handleClick={() => setParam("predmet", s.nazivPredmeta)}
            >
              {s.nazivPredmeta}
            </FilterBtn>
          ))}
        </div>

        {/* Način izvođenja */}
        <div className="flex flex-wrap gap-2 md:flex-col">
          <div className="text-sm font-semibold text-gray-800 mb-1">Način</div>
          <FilterBtn active={!nacin} handleClick={() => setParam("nacin", null)}>
            Sve
          </FilterBtn>
          <FilterBtn active={nacin === "ONLINE"} handleClick={() => setParam("nacin", "ONLINE")}>
            Online
          </FilterBtn>
          <FilterBtn active={nacin === "UZIVO"} handleClick={() => setParam("nacin", "UZIVO")}>
            Uživo
          </FilterBtn>
          <FilterBtn active={nacin === "OBA"} handleClick={() => setParam("nacin", "OBA")}>
            Oba
          </FilterBtn>
        </div>
      </div>
    </aside>
  );
}
