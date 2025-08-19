# Development Notes - Next.js TOCCATA Project

## O korisniku
- **Ime**: Uroš (68 godina, delimični daltonista)
- **Lokacija**: Srbija (radi na poslu i kod kuće)
- **Iskustvo**: 40 godina u industriji (od 1985)
- **Pozadina**: 
  - C programiranje i real-time sistemi
  - Osnivač i tehnički direktor ICCE (1988-1998) - SCADA i PLC sistemi
  - Osnivač EUROICC (1998) - direktor do danas
  - EUROICC Automation - TOCCATA GRMS sistem
- **Cilj**: Učenje Next.js za praćenje modularizacije TOCCATA servera (Java monolit → web tehnologije)
- **Nivo**: Početnik u Next.js-u, uči kroz Next.js kurs
- **Komunikacija**: Koristimo ti (neformalno), srpski jezik
- **Pristup**: Čita teoriju pa implementira, korak po korak
- **Očekivanja**: 
  - Da razumem šta radim, ne samo da kopiram kod
  - Detaljni komentari na srpskom jeziku
  - Objašnjenja zašto se nešto radi
  - Praktičan pristup sa realnim primerima
  - Povezivanje sa SCADA/PLC iskustvom
  - Fokus na koncepte i arhitekturu

## Naši dogovori
- **Komunikacija**: Koristimo ti (neformalno)
- **Jezik**: Srpski za komentare i komunikaciju
- **Dokumentacija**: Detaljni komentari u kodu na srpskom jeziku
- **Git**: Česti commit-ovi sa jasnim porukama na srpskom
- **Pristup**: Korak po korak, jedan fajl u isto vreme
- **Pristupačnost**: Koristimo ikonice i oznake (M, U) umesto boja
- **Fokus**: Koncepti i arhitektura, ne samo kod

### Novi dogovor za budući rad (nakon tutorial-a)
- **Mali koraci**: Jedan fajl, jedna funkcionalnost po poruci
- **Podsetnik**: Ako korisnik zada složeniji zadatak, podsetiti da ga podeli
- **Kratki odgovori**: Fokus na implementaciju, manje objašnjenja
- **Jedan po jedan**: Ne više fajlova odjednom
- **Prednosti**: Manje kašnjenja, lakše praćenje, bolje testiranje, lakše debugovanje

### 🤝 **Dogovor o kodiranju (19.08.2025)**
- **Pre kodiranja**: 
  1. Analiza problema/zahteva
  2. Predlog pristupa/strategije  
  3. Čekanje saglasnosti
  4. Tek onda implementacija
- **Kada kodirati**: 
  - Samo na eksplicitnu molbu
  - Nakon dogovora oko pristupa
  - Kada je jasno šta treba uraditi
- **Kada diskutovati**: 
  - Analiza problema
  - Predlozi rešenja
  - Teorijske koncepcije
  - Arhitektonske odluke

## Trenutno stanje projekta
- **Next.js App Router** sa TypeScript
- **Tailwind CSS** za stilizovanje
- **PostgreSQL** baza podataka (Vercel Postgres)
- **GitHub repository** postavljen


## Korisne komande
```bash
# Pokretanje development servera
cd \projekti\web\toccata
pnpm run dev


# otvaranje glavnog ekrana
# http://localhost:3000/




## Git workflow
```bash
git status
git add .
git commit -m "Opis promena na srpskom"
git push origin main
```


## Pristupačnost
- Korisnik je delimični daltonista
- Koristimo ikonice i oznake (M, U) umesto boja
- Jasni opisi i objašnjenja

## Povezivanje sa iskustvom
- **SCADA/PLC sistemi** - kako se web komponente organizuju vs monolitne aplikacije
- **Real-time sistemi** - kako se Next.js odnosi na performanse
- **TOCCATA modularizacija** - Java monolit → web tehnologije
- **Arhitektura** - kako se komponente organizuju vs tradicionalni pristup
- **Search i pagination** - kako se URL params koriste umesto client state

