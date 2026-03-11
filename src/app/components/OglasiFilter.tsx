"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {useState} from "react";

export default function OglasiFilter({
    initial,
}:{
   initial:{
    predmet?:string;
    lokacija?:string;
    minCena?:string,
    maxCena?:string;
    nacin?:string;
   };
}){
    const router=useRouter();
    const sp=useSearchParams();
    
    const [predmet,setPredmet]=useState(initial.predmet ?? "");
    const [lokacija,setLokacija]=useState(initial.lokacija ?? "");
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
    setOrDelete("lokacija", lokacija);
    setOrDelete("minCena", minCena);
    setOrDelete("maxCena", maxCena);
    setOrDelete("nacin", nacin);

    router.push(`/oglasi?${params.toString()}`);
  }

  function reset() {
    router.push("/oglasi");
  }

  return (
    <div className="border-2 border-gray-300 rounded-xl p-4 bg-white shadow-sm">
      <div className="grid gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-800">Predmet</span>
          <input
            value={predmet}
            onChange={(e) => setPredmet(e.target.value)}
            className="border-2 border-gray-400 p-2 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-800">Mesto</span>
          <input
            value={lokacija}
            onChange={(e) => setLokacija(e.target.value)}
            className="border-2 border-gray-400 p-2 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-800">Način</span>
          <select
            value={nacin}
            onChange={(e) => setNacin(e.target.value)}
            className="border-2 border-gray-400 p-2 rounded bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="text-gray-900">Svi</option>
            <option value="ONLINE" className="text-gray-900">Online</option>
            <option value="UZIVO" className="text-gray-900">Uživo</option>
            <option value="OBA" className="text-gray-900">Oba</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-800">Min cena</span>
          <input
            value={minCena}
            onChange={(e) => setMinCena(e.target.value)}
            className="border-2 border-gray-400 p-2 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-800">Max cena</span>
          <input
            value={maxCena}
            onChange={(e) => setMaxCena(e.target.value)}
            className="border-2 border-gray-400 p-2 rounded bg-white text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <div className="flex gap-2 mt-2">
          <button
            onClick={apply}
            className="flex-1 bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Filtriraj
          </button>
          <button
            onClick={reset}
            type="button"
            className="flex-1 bg-gray-500 text-white p-2 rounded font-semibold hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

