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
* **Swagger API dokumentacija**
* **Vizualizacija statistike** (Chart.js grafikoni)
* **Integracija eksternih API-ja** (vremenska prognoza, slanje emailova)
..
## Tipovi korisnika

Sistem podržava tri tipa korisnika:

* **ADMIN** – administracija sistema
* **TUTOR** – kreiranje i upravljanje oglasima
* **KORISNIK** – pregled i interakcija sa oglasima

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

Kreirati `.env` fajl u root folderu sa sledećim sadržajem:

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

U projektu je definisan `docker-compose.yml` fajl za pokretanje PostgreSQL baze i Adminer alata.

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
* **CSRF token zaštita**
* **CORS konfiguracija**
* **Security headers** (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

## Git organizacija

Grane korišćene u projektu:

* **main** – stabilna verzija aplikacije (production-ready)
* **develop** – integraciona grana za razvoj
* **feature/external-api** – implementacija eksternih API-ja (Weather, Email)
* **feature/testing** – razvoj testova i CI/CD pipeline-a

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

1. **OpenWeatherMap API** - vremenska prognoza po lokaciji
2. **Nodemailer** - slanje email obaveštenja korisnicima

## Docker

U projektu je definisan `docker-compose.yml` fajl za pokretanje kompletne aplikacije.

### Pokretanje sa Docker Compose:

```bash
docker compose up -d
```

Ovo pokreće:
* PostgreSQL bazu (port 5432)
* Next.js aplikaciju (port 3000)
* Adminer za administraciju baze (port 8080)

Aplikacija će biti dostupna na `http://localhost:3000`

## Ispunjenje zahteva projekta

### ✅ Obavezni zahtevi:

1. **Docker i docker-compose** ✅
   - `Dockerfile` - multi-stage build za Next.js
   - `docker-compose.yml` - PostgreSQL, Next.js app, Adminer

2. **Swagger API dokumentacija** ✅
   - Dostupna na `/api-docs`
   - Kompletna dokumentacija svih endpointa

### ✅ Zahtevi za višu ocenu:

1. **Dva eksterna API-ja** ✅
   - OpenWeatherMap API (vremenska prognoza)
   - Nodemailer SMTP (slanje email obaveštenja)

2. **README fajl** ✅
   - Detaljne informacije o aplikaciji
   - Uputstva za pokretanje

3. **Git branch strategija** ✅
   - `main` - stabilna verzija
   - `develop` - integraciona grana
   - `feature/external-api` - eksterni API-ji
   - `feature/docker-swagger` - Docker i Swagger integracija

4. **Bezbednost (minimum 3)** ✅
   - **CSRF zaštita** - token validacija
   - **XSS zaštita** - HttpOnly cookies, sanitizacija inputa
   - **SQL Injection zaštita** - Drizzle ORM parametrizovani upiti
   - **CORS konfiguracija** - ALLOWED_ORIGIN env var
   - **Security headers** - X-Content-Type-Options, X-Frame-Options

5. **Vizualizacija podataka** ✅
   - Chart.js grafikoni
   - Statistika stranica (`/statistika`)
   - Pie chart (korisnici po ulogama)
   - Bar chart (oglasi po načinu izvođenja)

### ✅ Frontend zahtevi:

1. **React framework** ✅ - Next.js 16 + React 19
2. **3+ stranice** ✅ - Home, Login, Register, Oglasi, Statistika, Admin, API docs
3. **3+ reusable komponente** ✅
   - FilterBtn - dugme za filtriranje
   - OglasCard - kartica oglasa
   - LoadingSpinner - loading indikator
   - WeatherWidget - vremenska prognoza
   - LogoutButton - dugme za odjavu
4. **Stilizovanje** ✅ - Tailwind CSS 4
5. **JavaScript funkcionalnosti** ✅
   - Filtriranje oglasa (real-time)
   - Chart.js vizualizacije
   - Weather API integracija
6. **React hooks** ✅ - useState, useEffect, useContext
7. **Rute** ✅ - Next.js App Router

### ✅ Backend zahtevi:

1. **5+ modela** ✅
   - korisnik, tutor, oglas, predmet, recenzija, prijava (6 modela)
2. **3+ tipa migracija** ✅
   - Kreiranje tabela
   - Dodavanje spoljnih ključeva
   - Postavljanje ograničenja (CHECK, UNIQUE)
   - Definisanje ENUM tipova
3. **REST API konvencija** ✅
   - GET, POST, PUT, DELETE metode
   - Pravilno imenovanje ruta
4. **JSON format** ✅ - Svi odgovori i greške u JSON formatu
5. **3+ tipa API ruta** ✅
   - Autentifikacija (login, register, logout)
   - CRUD operacije (oglasi, tutori, predmeti)
   - Eksterne integracije (weather, email)
   - Statistika i reporting
6. **3 tipa korisnika** ✅ - ADMIN, KORISNIK, TUTOR
7. **Autentifikacija** ✅ - JWT sa login/logout/register
8. **Autorizacija** ✅ - Role-based access control (middleware)

---

## Autori

Sergej Komnenovic
Nadja Bjelica
Ana Tomkovic