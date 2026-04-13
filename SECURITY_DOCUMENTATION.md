# PrimeBets Säkerhetsdokumentation
*Senast uppdaterad: 2026-01-08*

Denna dokumentation beskriver säkerhetsarkitekturen för PrimeBets. Systemet bygger på principen "Defense in Depth", där säkerhet appliceras i flera lager (Databas, Backend, Frontend).

## 1. Databassäkerhet (Row Level Security - RLS)
Vi använder Supabase RLS för att garantera att dataregler efterlevs oavsett var anropet kommer ifrån (Frontend, API, etc.).
*OBS: Den 2026-01-08 uppdaterades policys för `profiles`-tabellen för att undvika "infinite recursion" vid login.*

### Tabellregler (Policies)

#### Användardata (`public.profiles`)
*   **Grundregel:** Ingen får se någon annans data.
*   **User:** Kan endast läsa och uppdatera sin **egen** profil (`auth.uid() = id`).
*   **Admin:** Policy för admin-läsning kan behöva ses över för att undvika rekursion. Just nu används en 'whitelist'-bypass i frontend tills DB-policyn är helt stabil.

## 4. Frontend-skydd (Webb)
*   **Protected Routes:** `/admin` och `/dashboard` omdirigerar användare som inte är inloggade.
*   **Role Check:** Admin-sidan gör en extra kontroll av `profile.role`.
*   **⚠️ Whitelist Bypass:** För att lösa ett kritiskt åtkomstproblem (RLS recursion) har en hårdkodad kontroll lagts till i `AdminPage.tsx`. E-postadresserna `sofie.g63@outlook.com` och `primebets.se@gmail.com` ges automatiskt admin-behörighet i frontend-lagret, oavsett databas-svar. Detta bör ersättas med korrekt DB-policy på sikt.

## 6. Email-säkerhet (Nytt 2026-01-08)
*   **API:** `/api/notify-subscribers` kräver en enkel "secret key" i body (`primebets-secret-release-key`) för att köras. I produktion bör detta förstärkas med en Webhook Signature eller verifierad sessions-check.
*   **Integritet:** Utskick sker via BCC för att skydda mottagarnas adresser.
