import Link from "next/link";

type Props={
    id: number;
    ime: string;
    predmet: string;
    opis?: string | null;
    lokacija?: string | null;
    cena: number;
};

export default function OglasCard({id,ime,predmet,opis,lokacija,cena}:Props){

    return(
        <Link href={`/oglasi/${id}`}
        style={{
            display:"block",
            border:"1px solid #e5e7eb",
            borderRadius:12,
            overflow:"hidden",
            textDecoration: "none",
            color:"inherit",
            background:"white"
        }}>
            <div style={{padding:16,minHeight:220}}>
            
                <div style={{marginTop:14, fontSize:28, fontWeight:800}}>{ime}</div>
                <div style={{marginTop:6,opacity:0.8, fontWeight:600}}>{predmet}</div>
                <div style={{marginTop:10, opacity:0.8, lineHeight:1.5}}>{opis ?? "-"}</div>
            </div>
        <div style={{background:"#0f172a", color:"white", padding:15}}>
                <div style ={{opacity:0.95}}>{lokacija ?? "-"}</div>
                <div style ={{marginTop: 8 , fontWeight:800}}>{cena} RSD/60</div>

        </div>


        </Link>
    )



}