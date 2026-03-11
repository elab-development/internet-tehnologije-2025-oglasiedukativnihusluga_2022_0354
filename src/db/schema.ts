import {
  pgTable, boolean,serial, varchar, timestamp, integer, numeric, text, pgEnum, unique, check, primaryKey
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const ulogaEnum=pgEnum("uloga",["ADMIN","KORISNIK","TUTOR"]);
export const reportStatusEnum=pgEnum("report_status",["OPEN","RESOLVED","REJECTED"]);
export const nacinIzvodjenjaEnum=pgEnum("nacinIzvodjenja",["UZIVO","ONLINE","OBA"])

export const korisnik=pgTable("korisnik",{
    id: serial("id").primaryKey(),
    ime:varchar("ime",{length:120}).notNull(),
    prezime:varchar("prezime",{length:120}).notNull(),
    email: varchar("email",{length: 255}).notNull().unique(),
    lozinka: varchar("lozinka", { length: 255 }).notNull(),
    uloga:ulogaEnum("uloga").notNull().default("KORISNIK"),
    datumRegistracije:timestamp("datumRegistracije").defaultNow(),
    blokiran:boolean("blokiran").default(false)  // blokiran 1, nije 0
})


export const tutor=pgTable("tutor",{
    idT: integer("idT").primaryKey().references(()=>korisnik.id,{onDelete:"cascade"}).notNull(),
    biografija: text("biografija"),
    godineIskustva: integer("godineIskustva").notNull().default(0),
    lokacija:varchar("lokacija",{length:120}),
    telefon: varchar("telefon", {length: 50}),
},
 (table) => ({
    telefonUnique: unique("telefon_unique").on(table.telefon),
  })

)


export const predmet=pgTable("predmet",{
    idPredmet: serial("id").primaryKey(),
    nazivPredmeta: varchar("nazivPredmeta",{length:80}).notNull(),
})

export const oglas=pgTable("oglas",{
    idOglas: serial("idOglas").primaryKey(),
    predmetId:integer("predmetId").notNull().references(()=>predmet.idPredmet,{onDelete: "restrict"}),
    tutorId:integer("tutorId").notNull().references(()=>tutor.idT,{onDelete: "cascade"}),
    naslov: varchar("naslov",{length: 160}).notNull(),
    opis: text("opis"),
    lokacija:varchar("lokacija",{length: 120}),
    nacinIzvodjenja:nacinIzvodjenjaEnum("nacinIzvodjenja").notNull().default("ONLINE"),
    cena:numeric("cena",{precision:10, scale: 2}).notNull(),
    datumKreiranja:timestamp("datumKreiranja").defaultNow(),
    odobren:boolean("odobren").notNull().default(false) //0 nije 1 jeste
},
 (table) => [
    check("age_check1", sql`${table.cena} > 0`),
  ]
)

export const recenzija=pgTable("recenzija",{
    id:serial("id").primaryKey(),
    tutorId:integer("tutorId").notNull().references(()=>tutor.idT,{onDelete:"cascade"}),
    autorId:integer("autorId").notNull().references(()=>korisnik.id,{onDelete:"cascade"}),
    ocena:integer("ocena").notNull(),
    komentar:text("komentar"),
    datum:timestamp("datum").defaultNow(),
},(table)=>[
      unique().on(table.tutorId, table.autorId),
    check("ocena_check", sql`${table.ocena} BETWEEN 1 AND 5`),
   ],
);

export const prijava=pgTable("prijava",{
    id:serial("id").primaryKey(),
    razlog:text("razlog").notNull(),
    datum:timestamp("datum").defaultNow(),
    korisnikId:integer("korisnikId").notNull().references(()=>korisnik.id,{onDelete:"cascade"}),
    oglasId: integer("oglasId").notNull().references(() => oglas.idOglas, { onDelete: "cascade" })
});
