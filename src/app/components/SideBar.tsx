"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FilterBtn from "./FilterBtn";

type Subject = {
  nazivPredmeta: string;
};

type Props = {
  subjects: Subject[];
};

export default function OglasiSidebar({ subjects }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const predmet = sp.get("predmet"); // slug ili null
  const nacin = sp.get("nacin"); // ONLINE | UZIVO | OBA | null
  const lokacija = sp.get("lokacija") ?? "";

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(sp.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    next.delete("page"); // ako kasnije dodaš paginaciju, resetuje se na 1
    router.push(`/oglasi?${next.toString()}`);
  }

  return (
    <aside className="w-full md:w-72 shrink-0 mr-6 -ml-4">
      <div className="flex flex-col gap-4 md:sticky md:top-24">
        {/* Lokacija search */}
        <input
          type="text"
          placeholder="Mesto (npr. Beograd)"
          className="w-full rounded border border-gray-200 px-3 py-2"
          value={lokacija}
          onChange={(e) => setParam("lokacija", e.target.value.trim() || null)}
        />

        {/* Predmeti */}
        <div className="flex flex-wrap gap-2 md:flex-col">
          <FilterBtn active={!predmet} handleClick={() => setParam("predmet", null)}>
            Svi predmeti
          </FilterBtn>

          {subjects.map((s) => (
            <FilterBtn
              key={s.nazivPredmeta}
              active={predmet === s.nazivPredmeta}
              handleClick={() => setParam("predmet", s.nazivPredmeta)}
            >
              {s.nazivPredmeta}
            </FilterBtn>
          ))}
        </div>

        {/* Način izvođenja */}
        <div className="flex flex-wrap gap-2 md:flex-col">
          <div className="text-sm font-semibold text-gray-600">Način</div>
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
