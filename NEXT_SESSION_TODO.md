# 📋 PrimeBets - TODO för Nästa Session

## 🔴 PRIORITET 1 - KRITISKT

### 1. **Dagens PrimePick Uppdateringar**
- ✅ Ändrat rubrik till "Dagens PrimePick släpps senast 19:30".
- ✅ Lagt till knapp "Meddela mig när spelet släpps".
- ✅ Skapat prenumerations-modal och databastabell.
- ✅ Skapat API för emailutskick via Resend.
- ✅ Adderat Admin-verktyg för att skicka mail.
- 🔴 **Att göra:** Testa prenumerationsflödet "live" när kortet syns (innan 19:30).
- 🔴 **Att göra:** Användaren måste verifiera domän i Resend för att skicka till externa adresser.

---

## 🟡 PRIORITET 2 - VIKTIGT

### 2. **Säkerhet & Admin**
- ✅ Admin-bypass inlagd för `sofie.g63@outlook.com`.
- 🔴 **Att göra:** Fixa "infinite recursion" i Supabase-policys ordentligt (tog en genväg via kod nu).

### 3. **Prenumerationsflöde**
- Implementera automatiskt utskick via Webhook/Database Trigger istället för manuell knapp? (Diskutera med användaren).
- Lägg till avprenumerera-länk i mailet.

---

## 📝 ANTECKNINGAR FRÅN SESSION 2026-01-08

### Utfört arbete:
1. **Frontend:** Uppdaterat `WaitingCard` i `Dashboard.tsx` med ny copy och prenumerationsknapp.
2. **Backend:** Skapat `api/notify-subscribers.js` med snygg HTML-mall.
3. **Database:** Skapat `subscribers`-tabell.
4. **Admin:** Lagt till verktyg för utskick i `AdminPage.tsx`.
5. **Verktyg:** Skapat testsida `/email-preview` för att se mailet.

### Status:
- "Dagens PrimePick" var redan släppt vid testtillfället, så knappen syntes inte live.
- Mailet är redo att skickas men kräver domänverifiering alt. testning mot verifierad email.

---

## 🆕 NYA ÖNSKEMÅL (2026-01-04)

### 10. **Komplett Spelhandbok med Video**
- Göra spelhandboken komplett.
- Inkludera videoinstruktioner.

### 11. **Dashboard Tour / Guide**
- Skapa en interaktiv "tour" (t.ex. med `driver.js` eller liknande).
- Låt användaren klicka sig runt och få förklaringar av dashboardens funktioner.

### 12. **Blogg-sida & Nytt koncept för Veckans Spaning**
- Skapa en dedikerad sida för blogginlägg.
- Ändra "Veckans Spaning" så att den länkar till dessa blogginlägg istället för att vara en egen statisk sektion.

### Gamla TODOs (Kvarstår?)
- **Fixa 404-problemet** (ska vara löst via Vercel config, men värt att bevaka).
- **SEO på alla sidor** (pågående).
