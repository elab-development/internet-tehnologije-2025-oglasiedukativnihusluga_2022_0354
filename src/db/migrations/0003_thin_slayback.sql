ALTER TABLE "recenzija" DROP CONSTRAINT "recenzija_tutorId_autorId_unique";--> statement-breakpoint
ALTER TABLE "recenzija" ADD CONSTRAINT "recenzija_tutorId_unique" UNIQUE NULLS NOT DISTINCT("tutorId");--> statement-breakpoint
ALTER TABLE "recenzija" ADD CONSTRAINT "recenzija_autorId_unique" UNIQUE NULLS NOT DISTINCT("autorId");--> statement-breakpoint
ALTER TABLE "oglas" ADD CONSTRAINT "age_check1" CHECK ("oglas"."cena" > 0);--> statement-breakpoint
ALTER TABLE "recenzija" ADD CONSTRAINT "ocena_check" CHECK ("recenzija"."ocena" BETWEEN 1 AND 5);