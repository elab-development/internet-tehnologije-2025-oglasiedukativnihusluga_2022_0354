ALTER TABLE "recenzija" DROP CONSTRAINT "recenzija_tutorId_unique";--> statement-breakpoint
ALTER TABLE "recenzija" DROP CONSTRAINT "recenzija_autorId_unique";--> statement-breakpoint
ALTER TABLE "recenzija" ADD CONSTRAINT "recenzija_tutorId_autorId_unique" UNIQUE("tutorId","autorId");