# PrimeBets – Komplett Teknisk Dokumentation
*Senast genererad: 2026-04-13*

---

## 1. Vad är PrimeBets?

PrimeBets (primebets.se) är en svensk webbtjänst för AI-drivna speltips och travanalyser. Sidan riktar sig till travspelsentusiaster och erbjuder dagliga "PrimePicks", statistik, kalender, nyhetsbrev och ett magasin. Allt är på svenska.

---

## 2. Teknisk Stack – Överblick

| Lager | Teknik | Version/Notering |
|---|---|---|
| Frontend ramverk | React | 18.2.0 |
| Språk | TypeScript | 5.2.2 |
| Build-verktyg | Vite | 5.0.0 |
| Styling | Tailwind CSS | 3.3.5 |
| Routing | React Router DOM | 6.20.0 |
| Ikoner | Lucide React | 0.294.0 |
| SEO | React Helmet Async | 2.0.5 |
| UI-komponenter | Headless UI | 2.2.9 |
| Datumhantering | date-fns | 4.1.0 |
| Animationer | canvas-confetti | 1.9.4 |
| Databas & Auth | Supabase | @supabase/supabase-js 2.39.0 |
| E-post | Resend | 6.6.0 |
| Hosting | Vercel | (gratis-tier) |
| Domän | primebets.se (GoDaddy) | — |
| Analytics | Google Analytics | ID: G-TM11FEEPM7 |

---

## 3. Mappstruktur

```
Primebets/                          ← Rot (workspace-mappen)
│
├── frontend/                       ← Hela React-applikationen
│   ├── src/
│   │   ├── App.tsx                 ← Root-komponent, routing, auth-state
│   │   ├── main.tsx                ← React entry point (ReactDOM.render)
│   │   ├── index.css               ← Globala CSS-stilar
│   │   ├── types.ts                ← Alla TypeScript-interface (Pick, CalendarEvent, Profile, Article, HorseInfo)
│   │   ├── vite-env.d.ts           ← Vite-typedefinitioner
│   │   ├── useBettingStats.ts      ← Custom hook för statistikberäkningar
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase.ts         ← Supabase-klient (URL + anon key hårdkodat!)
│   │   │   ├── bookmakerUtils.ts   ← Mappning spelbolag → URL (ATG, Unibet, Bet365 m.fl.)
│   │   │   └── gameStatus.ts       ← Spelstatus-logik
│   │   │
│   │   └── components/             ← Alla React-komponenter (~65 st)
│   │       ├── App-nivå
│   │       │   ├── Navbar.tsx
│   │       │   ├── Footer.tsx
│   │       │   ├── ScrollToTop.tsx
│   │       │   ├── SEO.tsx
│   │       │   └── ChatWidget.tsx
│   │       │
│   │       ├── Sidor (Pages)
│   │       │   ├── LandingPage.tsx       ← Startsida (publik)
│   │       │   ├── Dashboard.tsx         ← Huvuddashboard (inloggad)
│   │       │   ├── HockeyDashboard.tsx   ← Hockeydashboard
│   │       │   ├── AnalysisPage.tsx      ← Analyshistorik
│   │       │   ├── HistoryPage.tsx       ← Historik
│   │       │   ├── SettingsPage.tsx      ← Användarinställningar
│   │       │   ├── AdminPage.tsx         ← Adminpanel
│   │       │   ├── ContactPage.tsx       ← Kontaktformulär
│   │       │   ├── MethodPage.tsx        ← Vår metod
│   │       │   ├── BettingSchoolPage.tsx ← Spelskola
│   │       │   ├── PressPage.tsx         ← Press
│   │       │   ├── TermsPage.tsx         ← Användarvillkor
│   │       │   ├── PrivacyPage.tsx       ← Integritetspolicy
│   │       │   ├── ContentHub.tsx        ← Magasin (artikelöversikt)
│   │       │   └── ArticlePage.tsx       ← Enskild artikel
│   │       │
│   │       ├── Auth
│   │       │   ├── Auth.tsx              ← Inloggningsvy
│   │       │   ├── AuthForm.tsx
│   │       │   ├── LoginModal.tsx
│   │       │   ├── UpdatePassword.tsx
│   │       │   └── UserDropdown.tsx
│   │       │
│   │       ├── Dashboard-kort / vyer
│   │       │   ├── PrimePickDashboardCard.tsx  ← Dagens primepick-kort
│   │       │   ├── SaturdayPickCard.tsx
│   │       │   ├── WeeklyScoutCard.tsx
│   │       │   ├── HockeyPickCard.tsx
│   │       │   ├── LongTermBetCard.tsx
│   │       │   ├── LatestWinCard.tsx
│   │       │   ├── StatsCard.tsx
│   │       │   ├── HotHorsesView.tsx
│   │       │   ├── AnalysisView.tsx
│   │       │   ├── CalendarView.tsx
│   │       │   └── TopListsView.tsx
│   │       │
│   │       ├── Modaler
│   │       │   ├── AnalysisModal.tsx
│   │       │   ├── PremiumAnalysisModal.tsx
│   │       │   ├── LockedAnalysisModal.tsx
│   │       │   ├── AllBetsModal.tsx
│   │       │   ├── ResultsModal.tsx
│   │       │   ├── PickDetailsModal.tsx
│   │       │   └── HorseDetailsModal.tsx / V2
│   │       │
│   │       ├── Admin-verktyg
│   │       │   ├── AdminArticles.tsx
│   │       │   ├── AdminGameForm.tsx
│   │       │   └── AdminGameList.tsx
│   │       │
│   │       └── Övrigt
│   │           ├── EmailPreview.tsx        ← Förhandsgranskning av notis-mail
│   │           ├── DashboardExplainer.tsx  ← Visas för ej inloggade på /dashboard
│   │           ├── DashboardPreview.tsx
│   │           ├── V2DesignPlayground.tsx  ← Dev-only preview (/v2-preview)
│   │           └── HorseManager.tsx
│   │
│   ├── api/
│   │   ├── notify-subscribers.js   ← Vercel Serverless Function: skickar e-post till prenumeranter via Resend
│   │   └── notify.js               ← Äldre notifikationsfunktion
│   │
│   ├── dist/                       ← Byggd produktionsversion (genereras av `npm run build`)
│   ├── node_modules/               ← NPM-beroenden
│   ├── index.html                  ← HTML-entry, meta-tags, GA-script
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .env                        ← Supabase URL + anon key (finns i repo, se säkerhetsnotering)
│   └── .vercel/project.json        ← Vercel projekt-ID och org-ID
│
├── *.sql                           ← Lösa SQL-migrationsfiler (körda manuellt i Supabase SQL Editor)
├── *.js / *.ts                     ← Lösa debug/check-scripts
│
├── .agent/workflows/
│   └── future_roadmap.md           ← Framtida planerade features
│
├── PROJECT_SUMMARY.md              ← Övergripande projektsammanfattning
├── NEXT_SESSION_TODO.md            ← Uppgiftslista för nästa session
├── DEPLOYMENT_GUIDE.md             ← Guide för deployment till Vercel/Netlify
├── SECURITY_DOCUMENTATION.md      ← Säkerhetsarkitektur och kända svagheter
├── SEO_OPTIMIZATION.md             ← SEO-strategi och implementering
├── CONTACT_FORM_SETUP.md           ← Setup-guide för Resend + Edge Function
├── REDESIGN_BRIEF.md               ← Designbeskrivning
└── TODAYS_WORK.md                  ← Sessionanteckningar
```

---

## 4. Routing (alla URL:er)

Definieras i `App.tsx` med React Router DOM v6.

| URL | Komponent | Åtkomst |
|---|---|---|
| `/` | `LandingPage` | Publik |
| `/auth` | `Auth` | Publik (omdirigerar till `/dashboard` om inloggad) |
| `/auth/update-password` | `UpdatePassword` | Publik |
| `/dashboard` | `Dashboard` (inloggad) / `DashboardExplainer` (ej inloggad) | Halvskyddad |
| `/hockey` | `HockeyDashboard` | Halvskyddad |
| `/settings` | `SettingsPage` | Skyddad (kräver inloggning) |
| `/admin` | `AdminPage` | Skyddad (kräver inloggning + admin-roll) |
| `/school` | `BettingSchoolPage` | Publik |
| `/contact` | `ContactPage` | Publik |
| `/method` | `MethodPage` | Publik |
| `/analysis` | `AnalysisPage` | Publik |
| `/history` | `HistoryPage` | Publik |
| `/press` | `PressPage` | Publik |
| `/terms` | `TermsPage` | Publik |
| `/privacy` | `PrivacyPage` | Publik |
| `/magasin` | `ContentHub` | Publik |
| `/magasin/:slug` | `ArticlePage` | Publik |
| `/v2-preview` | `V2DesignPlayground` | Dev-only |
| `/email-preview` | `EmailPreview` | Dev-only |

---

## 5. Databas (Supabase)

**Projekt-URL:** `https://aaczctiwtdyxcxxxhkcm.supabase.co`

### Tabeller

| Tabell | Beskrivning | Viktiga kolumner |
|---|---|---|
| `daily_picks` | Dagens speltips (travspel) | `id`, `horse_name`, `track_name`, `race_number`, `odds`, `race_date`, `status`, `bet_type`, `driver`, `bookmaker`, `ai_analysis` (JSONB), `final_output_message`, `ai_score`, `is_prime_pick`, `result_payout`, `net_result` |
| `weekly_scout` | Veckans spaning | — |
| `saturday_picks` | Lördagens spel | — |
| `calendar_events` | Spelkalender (V75, V86, Big Slam etc.) | `id`, `race_date`, `title`, `type`, `status`, `priority`, `is_visible`, `odds`, `horse_name`, `driver`, `location`, `net_result`, `result_status` |
| `profiles` | Användarprofiler | `id`, `full_name`, `role` (`user`/`admin`/`moderator`), `subscription_tier` |
| `subscribers` | E-postprenumeranter för notiser | `email`, `is_active`, `consent_given` |
| `articles` | Magasinsartiklar | `id`, `title`, `slug`, `content`, `excerpt`, `type` (`blog`/`news`/`report`/`guide`), `status` (`draft`/`published`), `published_at`, `meta_title`, `meta_description`, `cover_image`, `author_id` |
| `horse_info` | Häst-databas | `id`, `horse_name`, `birth_year`, `sex`, `trainer`, `default_driver`, `strength_tags`, `weakness_tags`, `notes_short` |
| `long_term_bets` | Långsiktiga spel | — |
| `hockey_picks` | Hockeytips | — |

### Row Level Security (RLS)
- Aktiverat på alla tabeller
- Användare kan bara se/ändra sin egen profil
- **OBS:** Det finns ett känt problem med "infinite recursion" i `profiles`-policyn. En tillfällig whitelist-bypass finns i frontend-koden (se Säkerhet nedan).

### Edge Functions (Supabase)
- `send-contact-email` – Tar emot kontaktformulärdata och skickar e-post via Resend API
- `notify-subscribers` – Skickar notis-e-post till alla aktiva prenumeranter (triggas från AdminPage)
- `admin-action` – Adminåtgärder på användare

---

## 6. Autentisering

Hanteras helt av **Supabase Auth**.

- Session-state i `App.tsx` via `supabase.auth.getSession()` och `onAuthStateChange`
- Sessionen skickas som prop till alla sidor som behöver den
- Inloggning: e-post + lösenord
- Registrering med e-postverifiering
- Lösenordsåterställning via `/auth/update-password`
- Admin-roll kollas via `profiles.role`-kolumnen i databasen

---

## 7. E-post

Två separata system:

**1. Kontaktformulär** (`ContactPage.tsx`)
- Anropar Supabase Edge Function `send-contact-email`
- Skickar via **Resend API**
- Mottagare: `primebets.se@gmail.com`
- Kräver: `RESEND_API_KEY` som Supabase-secret

**2. Prenumerantnotiser** (`api/notify-subscribers.js`)
- Vercel Serverless Function
- Läser aktiva prenumeranter från `subscribers`-tabellen
- Skickar HTML-e-post via **Resend** (BCC för integritet)
- Triggas manuellt från AdminPage med en hemlig nyckel
- **OBS:** Resend API-nyckel är hårdkodad i filen (säkerhetsproblem, se nedan)

---

## 8. Deployment & Hosting

**Platform:** Vercel (gratis-tier)
- Vercel Project ID: `prj_5i81uPdHLNOpANTjCRnWOhmofuni`
- Org ID: `team_gZnaaiB3xUFLK2xjqkEYjFza`
- Project Name: `frontend`

**Domän:** `primebets.se` + `www.primebets.se`
- Registrerad hos GoDaddy
- DNS pekar på Vercel

**Build-kommando:** `tsc && vite build`
- Output: `frontend/dist/`

**Dev-server:** `npm run dev` (kör Vite dev-server lokalt)

---

## 9. Design & Färgsystem

Definierat i `tailwind.config.js` under `theme.extend.colors.pb`:

| Token | Hex | Användning |
|---|---|---|
| `pb-dark` | `#0F1720` | Primär bakgrund (hela layouten) |
| `pb-card` | `#162230` | Kortytor / card backgrounds |
| `pb-overlay` | `#0C131C` | Overlay / dim-effekter |
| `pb-text-main` | `#E6ECF2` | Primär text |
| `pb-text-sec` | `#9AA7B5` | Sekundär text |
| `pb-text-muted` | `#7C8A98` | Dämpad metadata |
| `pb-accent-main` | `#2FAE8F` | Primär accentfärg (grön) |
| `pb-accent-dark` | `#248E75` | Mörk accent |
| `pb-accent-glow` | `#43C4A2` | Glow-variant |
| `pb-accent-gold` | `#C9A86A` | Guldaccent |

**Font:** SF Pro (Apple-system font), med fallback till system fonts → snabb laddning utan extern fontladdning.

**Designstil:** Mörkt tema, glassmorphism-effekter, gradient-bakgrunder, smooth hover-animationer.

---

## 10. TypeScript-typer (types.ts)

Fyra centrala interface:

- **`Pick`** – Ett speltips (häst, bana, odds, datum, status, AI-analys, resultat etc.)
- **`CalendarEvent`** – Kalender-händelse (V75, V86, Big Slam etc.)
- **`Profile`** – Användarprofil (id, roll, prenumerationsnivå)
- **`Article`** – Magasinsartikel (slug, innehåll, typ, publiceringstatus)
- **`HorseInfo`** – Häst-info (namn, tränare, kusk, styrkor/svagheter)

---

## 11. Säkerhet – Kända Problem & Risker

> ⚠️ Dessa behöver åtgärdas på sikt

1. **Supabase anon key hårdkodad i `src/lib/supabase.ts`** – Anon key är per design publik men bör ändå hanteras via env-variabler för konsekvens och säkerhet. `.env`-filen innehåller korrekt setup men används ej.

2. **Resend API-nyckel hårdkodad i `api/notify-subscribers.js`** – En riktig hemlig nyckel som **inte** bör vara i källkoden. Bör flyttas till Vercel Environment Variables.

3. **Admin whitelist i frontend (`AdminPage.tsx`)** – E-postadresserna `sofie.g63@outlook.com` och `primebets.se@gmail.com` är hårdkodade som admin-bypass p.g.a. ett RLS recursion-problem i databasen. Bör lösas med korrekt DB-policy.

4. **RLS "infinite recursion" i `profiles`** – En känd Supabase-policy-bugg som orsakar rekursion vid login. Tillfälligt löst med frontend-bypass.

5. **Notify-subscribers skyddas med enkel textsträng** – `'primebets-secret-release-key'` i request body. Bör ersättas med proper auth-header.

---

## 12. SQL-migrationsfiler (lösa filer i rooten)

Det finns ~30+ lösa `.sql`-filer i projektrooten. Dessa har körts manuellt i Supabase SQL Editor och är inte en del av ett migrationsystem. De är historiska och visar evolutionen av databasen:

- `add_*.sql` – Lägger till kolumner i befintliga tabeller
- `fix_*.sql` – Fixar RLS-policys och behörigheter
- `create_*.sql` – Skapar nya tabeller/vyer
- `check_*.sql` – Debug-queries
- `final_health_check.sql` – Lägger till saknade kolumner på ett idempotent sätt (säker att köra igen)

---

## 13. Externa Tjänster & Integrationer

| Tjänst | Syfte | Notering |
|---|---|---|
| **Supabase** | Databas, Auth, Edge Functions | Gratis-tier (primärt) |
| **Vercel** | Hosting, Serverless Functions | Gratis-tier |
| **Resend** | E-postutskick | API-nyckel behöver domänverifiering för externa adresser |
| **Google Analytics** | Webbanalytik | Tracking ID: G-TM11FEEPM7 |
| **Google Search Console** | SEO-övervakning | Sitemap inskickad |
| **n8n** (externt) | Automation – synkar data från Google Sheets till Supabase | Ej en del av detta repo |
| **GoDaddy** | Domänregistrering | primebets.se |
| **ATG, Unibet, Bet365 m.fl.** | Spelbolagslänkar | Hanteras i `bookmakerUtils.ts` |

---

## 14. Vanliga Kommandon

```bash
# Kör lokalt (dev-server)
cd frontend
npm run dev

# Bygg för produktion
npm run build

# Deploya till Vercel (från frontend-mappen)
vercel

# Deploya specifik Supabase Edge Function
npx supabase functions deploy send-contact-email
npx supabase functions deploy notify-subscribers
```

---

## 15. Vad Claude behöver veta inför varje session

- **Admin-emailen** är `sofie.g63@outlook.com` (ägaren)
- **Kontakt-email** är `primebets.se@gmail.com`
- All källkod finns i `frontend/src/`
- Databasen hanteras via Supabase-dashboarden (inte via CLI-migreringar)
- Deployments sker via Vercel – antingen manuellt med `vercel`-CLI eller automatiskt via GitHub (om kopplat)
- **Tailwind custom-klasser** börjar med `pb-` (t.ex. `bg-pb-dark`, `text-pb-accent-main`)
- Supabase anon key är hårdkodad i `supabase.ts` (detta är ett medvetet val för snabb debug-deployment, men bör fixas)
- Det finns en dev-only route på `/v2-preview` för designexperiment
- Magasinet (bloggen) finns under `/magasin` med slug-baserade artiklar
- Hockeydashboard är under aktiv utveckling (`/hockey`)

---

## 16. Öppna Uppgifter (från NEXT_SESSION_TODO.md)

- 🔴 Testa prenumerationsflödet live (notify-subscribers)
- 🔴 Verifiera domän i Resend för externa e-postutskick
- 🔴 Fixa RLS recursion i `profiles`-tabellen ordentligt
- 🟡 Ersätt enkel secret-key i notify-API med proper auth
- 🟡 Lägg till avprenumerera-länk i notis-mailet
- 🟢 Komplettera spelhandboken (BettingSchoolPage)
- 🟢 Dashboard-tour/guide (driver.js eller liknande)
- 🟢 SEO på alla sidor (inte bara landningssidan)

---

*Dokumentation genererad av Claude i Cowork mode, 2026-04-13*
