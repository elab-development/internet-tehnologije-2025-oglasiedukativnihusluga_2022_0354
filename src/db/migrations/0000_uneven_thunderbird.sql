CREATE TYPE "public"."nacinIzvodjenja" AS ENUM('UZIVO', 'ONLINE', 'OBA');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('OPEN', 'RESOLVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."uloga" AS ENUM('ADMIN', 'KORISNIK', 'TUTOR');--> statement-breakpoint
CREATE TABLE "korisnik" (
	"id" serial PRIMARY KEY NOT NULL,
	"ime" varchar(120) NOT NULL,
	"prezime" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"lozinka" varchar(255) NOT NULL,
	"uloga" "uloga" DEFAULT 'KORISNIK' NOT NULL,
	"datumRegistracije" timestamp DEFAULT now(),
	"blokiran" boolean DEFAULT false,
	CONSTRAINT "korisnik_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "oglas" (
	"idOglas" serial PRIMARY KEY NOT NULL,
	"predmetId" integer NOT NULL,
	"tutorId" integer NOT NULL,
	"naslov" varchar(160) NOT NULL,
	"opis" text,
	"lokacija" varchar(120),
	"nacinIzvodjenja" "nacinIzvodjenja" DEFAULT 'ONLINE' NOT NULL,
	"cena" numeric(10, 2) NOT NULL,
	"datumKreiranja" timestamp DEFAULT now(),
	"odobren" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "predmet" (
	"id" serial PRIMARY KEY NOT NULL,
	"nazivPredmeta" varchar(80) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prijava" (
	"id" serial PRIMARY KEY NOT NULL,
	"razlog" text NOT NULL,
	"datum" timestamp DEFAULT now(),
	"korisnikId" integer,
	"tutorId" integer
);
--> statement-breakpoint
CREATE TABLE "recenzija" (
	"id" serial PRIMARY KEY NOT NULL,
	"tutorId" integer NOT NULL,
	"autorId" integer NOT NULL,
	"ocena" integer NOT NULL,
	"komentar" text,
	"datum" timestamp DEFAULT now(),
	CONSTRAINT "recenzija_tutorId_autorId_unique" UNIQUE("tutorId","autorId")
);
--> statement-breakpoint
CREATE TABLE "tutor" (
	"idT" integer PRIMARY KEY NOT NULL,
	"biografija" text,
	"godineIskustva" integer DEFAULT 0 NOT NULL,
	"lokacija" varchar(120),
	"telefon" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "oglas" ADD CONSTRAINT "oglas_predmetId_predmet_id_fk" FOREIGN KEY ("predmetId") REFERENCES "public"."predmet"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oglas" ADD CONSTRAINT "oglas_tutorId_tutor_idT_fk" FOREIGN KEY ("tutorId") REFERENCES "public"."tutor"("idT") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prijava" ADD CONSTRAINT "prijava_korisnikId_korisnik_id_fk" FOREIGN KEY ("korisnikId") REFERENCES "public"."korisnik"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prijava" ADD CONSTRAINT "prijava_tutorId_tutor_idT_fk" FOREIGN KEY ("tutorId") REFERENCES "public"."tutor"("idT") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recenzija" ADD CONSTRAINT "recenzija_tutorId_tutor_idT_fk" FOREIGN KEY ("tutorId") REFERENCES "public"."tutor"("idT") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recenzija" ADD CONSTRAINT "recenzija_autorId_korisnik_id_fk" FOREIGN KEY ("autorId") REFERENCES "public"."korisnik"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor" ADD CONSTRAINT "tutor_idT_korisnik_id_fk" FOREIGN KEY ("idT") REFERENCES "public"."korisnik"("id") ON DELETE cascade ON UPDATE no action;