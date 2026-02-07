ALTER TABLE "prijava" DROP CONSTRAINT "prijava_tutorId_tutor_idT_fk";
--> statement-breakpoint
ALTER TABLE "prijava" ALTER COLUMN "korisnikId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prijava" ADD COLUMN "oglasId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "prijava" ADD CONSTRAINT "prijava_oglasId_oglas_idOglas_fk" FOREIGN KEY ("oglasId") REFERENCES "public"."oglas"("idOglas") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prijava" DROP COLUMN "tutorId";