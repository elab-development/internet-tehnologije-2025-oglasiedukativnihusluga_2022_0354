"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {useState} from "react";

export default function OglasiFilter({
    initial,
}:{
   initial:{
    predmet?:string;
    mesto?:string;
    minCena?:string,
    maxCena?:string;
    nacin?:string;
   };
}){
    const router=useRouter();
    const sp=useSearchParams();
    
    const [predmet,setPredmet]=useState(initial.predmet ?? "");
    const [mesto,setMesto]=useState(initial.mesto ?? "");
    const [minCena, setMinCena] = useState(initial.minCena ?? "");
    const [maxCena, setMaxCena] = useState(initial.maxCena ?? "");
    const [nacin, setNacin] = useState(initial.nacin ?? "");

    function apply() {
    const params = new URLSearchParams(sp.toString());

    const setOrDelete = (k: string, v: string) => {
      if (v) params.set(k, v);
      else params.delete(k);
    };

    setOrDelete("predmet", predmet);
    setOrDelete("mesto", mesto);
    setOrDelete("minCena", minCena);
    setOrDelete("maxCena", maxCena);
    setOrDelete("nacin", nacin);

    router.push(`/oglasi?${params.toString()}`);
  }

  function reset() {
    router.push("/oglasi");
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <label>
          Predmet (slug)
          <input value={predmet} onChange={(e) => setPredmet(e.target.value)} />
        </label>

        <label>
          Mesto
          <input value={mesto} onChange={(e) => setMesto(e.target.value)} />
        </label>

        <label>
          Način
          <select value={nacin} onChange={(e) => setNacin(e.target.value)}>
            <option value="">Svi</option>
            <option value="ONLINE">Online</option>
            <option value="UZIVO">Uživo</option>
            <option value="OBA">Oba</option>
          </select>
        </label>

        <label>
          Min cena
          <input value={minCena} onChange={(e) => setMinCena(e.target.value)} />
        </label>

        <label>
          Max cena
          <input value={maxCena} onChange={(e) => setMaxCena(e.target.value)} />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={apply}>Filtriraj</button>
          <button onClick={reset} type="button">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

