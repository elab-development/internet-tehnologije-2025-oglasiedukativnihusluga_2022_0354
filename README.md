# KlikDoZnanja – Oglasi edukativnih usluga

KlikDoZnanja je web aplikacija namenjena povezivanju korisnika sa pružaocima edukativnih usluga. Sistem omogućava pregled, kreiranje i upravljanje oglasima za privatne časove i druge obrazovne aktivnosti.

Aplikacija podržava više tipova korisnika sa različitim nivoima pristupa i implementira bezbednu autentifikaciju putem JWT mehanizma.

## Funkcionalnosti

Sistem omogućava sledeće funkcionalnosti:

* Registracija i prijava korisnika
* JWT autentifikacija
* Role-based autorizacija (ADMIN, KORISNIK, TUTOR)
* Kreiranje, izmena i brisanje oglasa
* Pregled i filtriranje oglasa
* Zaštita ruta za autentifikovane korisnike
* Administracija baze podataka putem Adminer alata
* *Swagger API dokumentacija*
* *Vizualizacija statistike* (Chart.js grafikoni)
* *Integracija eksternih API-ja* (vremenska prognoza, slanje emailova)
* *Automatizovani testovi* (Jest)
* *CI/CD pipeline* (GitHub Actions)

## Tipovi korisnika

Sistem podržava tri tipa korisnika:

* *ADMIN* – administracija sistema
* *TUTOR* – kreiranje i upravljanje oglasima
* *KORISNIK* – pregled i interakcija sa oglasima

## Tehnologije

### Frontend

* Next.js (React framework)
* TypeScript
* Tailwind CSS
* Chart.js (vizualizacija podataka)
* React hooks (useState, useEffect)

### Backend

* Next.js API routes
* Node.js
* Drizzle ORM

### Baza podataka

* PostgreSQL

### Bezbednost

* JSON Web Token (JWT)
* HttpOnly cookies
* SameSite zaštita
* Role-based autorizacija

### DevOps

* Docker
* Docker Compose

## Struktura projekta

src/
├── app/
├── components/
├── api/
├── lib/
└── context/

docker-compose.yml
drizzle.config.ts
package.json

## Instalacija i pokretanje projekta

### 1. Kloniranje repozitorijuma

git clone <URL_REPOZITORIJUMA>
cd naziv_projekta

### 2. Instalacija zavisnosti

npm install

### 3. Konfiguracija environment promenljivih

Kreirati .env fajl u root folderu sa sledećim sadržajem:

DATABASE_URL=postgresql://app:app123@localhost:5432/oglasiedu
JWT_SECRET=neki_dugacak_tajni_string
CSRF_SECRET=csrf_tajni_kljuc
WEATHER_API_KEY=your_openweathermap_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

### 4. Pokretanje aplikacije

npm run dev

Aplikacija će biti dostupna na:

http://localhost:3000

## Docker

U projektu je definisan docker-compose.yml fajl za pokretanje PostgreSQL baze i Adminer alata.

Pokretanje servisa:

docker compose up -d

Zaustavljanje servisa:

docker compose down

Reset baze:

docker compose down -v

## Adminer

Adminer je dostupan na:

http://localhost:8080

Podaci za prijavu:

System: PostgreSQL
Server: db
Username: app
Password: app123
Database: oglasiedu

## Migracije baze (Drizzle)

Za generisanje i primenu migracija koriste se komande:

npx drizzle-kit generate
npx drizzle-kit push

## Bezbednost

Sistem koristi sledeće bezbednosne mehanizme:

* JWT autentifikacija (HS256, 7 dana važenja)
* HttpOnly kolačići (zaštita od XSS napada)
* SameSite cookie politika (CSRF zaštita)
* Role-based autorizacija
* ORM zaštita od SQL Injection napada
* *CSRF token zaštita*
* *CORS konfiguracija*
* *Security headers* (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

## Git organizacija

Grane korišćene u projektu:

* main – stabilna verzija aplikacije
* feature/database – razvoj baze podataka i ORM integracije

## Swagger API dokumentacija

API dokumentacija je dostupna na:

http://localhost:3000/api-docs

Swagger omogućava interaktivno testiranje svih API endpointa.

## Vizualizacija podataka

Stranica sa statistikom je dostupna na:

http://localhost:3000/statistika

Prikaz uključuje:
* Ukupan broj oglasa, tutora i recenzija
* Distribuciju korisnika po ulogama (Pie chart)
* Distribuciju oglasa po načinu izvođenja (Bar chart)
* Prosečnu ocenu tutora

## Eksterni API-ji

Aplikacija koristi sledeće eksterne API-je:

1. *OpenWeatherMap API* - vremenska prognoza po lokaciji
2. *Nodemailer* - slanje email obaveštenja korisnicima

## Testiranje

Pokretanje testova:

npm test

Pokretanje testova u watch režimu:

npm run test:watch

## CI/CD Pipeline

GitHub Actions pipeline automatski:
* Pokreće testove na svaki push/pull request
* Gradi Docker image
* Proverava build uspešnost

Pipeline konfiguracija je u .github/workflows/ci.yml

## Cloud Deployment

Aplikacija je spremna za deployment na cloud platforme:

* *Vercel* - konfiguracija u vercel.json
* *Docker* - kompletna dockerizacija aplikacije

Pokretanje sa Docker Compose:

docker compose up -d

Ovo pokreće:
* PostgreSQL bazu
* Next.js aplikaciju
* Adminer za administraciju baze

## Autori

Sergej Komnenovic
Nadja Bjelica
Ana Tomkovic