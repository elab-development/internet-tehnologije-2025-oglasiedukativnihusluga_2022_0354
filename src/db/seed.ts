import bcrypt from "bcrypt";
import {db} from "./index"
import {korisnik, tutor, predmet, oglas} from "./schema"


async function seed(){
    console.log("Seed start");

const predmeti= await db.insert(predmet).values([
    {nazivPredmeta:"Matematika"},
    {nazivPredmeta:"Fizika"},
    {nazivPredmeta:"Engleski jezik"}
]).returning();



await db.insert(korisnik).values([
{
    ime:"Ana",
    prezime:"Anic",
    email:"ana@test.com",
    lozinka:await bcrypt.hash("korisnik1",10),
    uloga:"KORISNIK"
},
{
    ime:"Marko",
    prezime:"Markovic",
    email:"marko@test.com",
    lozinka:await bcrypt.hash("korisnik2",10),
    uloga:"KORISNIK"
}
]);

const tutori=await db.insert(korisnik).values([
    {ime:"Petar",
    prezime:"Petrovic",
    email:"petar@test.com",
    lozinka:await bcrypt.hash("tutor1",10),
    uloga:"TUTOR"},

    {ime:"Jelena",
    prezime:"Jelenic",
    email:"jelena@test.com",
    lozinka:await bcrypt.hash("tutor2",10),
    uloga:"TUTOR"}
]).returning();

await db.insert(tutor).values([
    {idT:tutori[0].id,
    biografija:"Iskusan tutor iz matematike",
    godineIskustva:5,
    lokacija:"Beograd",
    telefon:"0611234567",
    },
    {idT:tutori[1].id,
    biografija:"Strucnjak za engleski jezik",
    godineIskustva:3,
    lokacija:"Novi Sad",
    telefon:"0627654321"
    }
]);

await db.insert(oglas).values([
{
    tutorId: tutori[0].id,
    predmetId: predmeti[2].idPredmet,
    naslov: "Engleski jezik - privatni časovi",
    opis: "Gramatika, konverzacija, priprema za kontrolne i prijemni.",
    lokacija: "Beograd",
    nacinIzvodjenja: "ONLINE",
    cena: "1500.00",
    odobren: true,
},
{
     tutorId: tutori[1].id,
      predmetId: predmeti[1].idPredmet,
      naslov: "Fizika za početnike",
      opis: "Krećemo od osnova, puno vežbe i razgovora.",
      lokacija: "Beograd",
      nacinIzvodjenja: "OBA",
      cena: "1200.00",
      odobren: true,
}
]);


console.log("Seed end");

}
seed().catch((e) => {
  console.error("Seed failed ❌", e);
  process.exit(1);
});