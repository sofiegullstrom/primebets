# Deployment Guide - Koppla primebets.se

## Alternativ 1: Vercel (Rekommenderat - Enklast)

### Steg 1: Installera Vercel CLI
```bash
npm install -g vercel
```

### Steg 2: Logga in på Vercel
```bash
vercel login
```

### Steg 3: Deploya projektet
Kör detta från frontend-mappen:
```bash
cd /Users/sofiegullstrom/.gemini/antigravity/scratch/primebets/frontend
vercel
```

Följ instruktionerna:
- Set up and deploy? → Yes
- Which scope? → Välj ditt konto
- Link to existing project? → No
- Project name? → primebets
- In which directory is your code? → ./
- Want to override settings? → No

### Steg 4: Koppla din domän
1. Gå till https://vercel.com/dashboard
2. Välj ditt projekt "primebets"
3. Gå till Settings → Domains
4. Lägg till "primebets.se"
5. Vercel ger dig DNS-instruktioner

### Steg 5: Uppdatera DNS hos din domänleverantör
Gå till där du köpte primebets.se (t.ex. Loopia, One.com, etc.) och:
1. Lägg till en A-record som pekar på Vercels IP
2. Eller lägg till en CNAME som pekar på din Vercel-URL

**DNS kommer ta 1-24 timmar att propagera.**

---

## Alternativ 2: Netlify (Också enkelt)

### Steg 1: Installera Netlify CLI
```bash
npm install -g netlify-cli
```

### Steg 2: Logga in
```bash
netlify login
```

### Steg 3: Deploya
```bash
cd /Users/sofiegullstrom/.gemini/antigravity/scratch/primebets/frontend
netlify deploy --prod
```

### Steg 4: Koppla domän
1. Gå till https://app.netlify.com
2. Välj ditt projekt
3. Domain settings → Add custom domain → primebets.se
4. Följ DNS-instruktionerna

---

## Viktigt att veta:

✅ **Du kan fortfarande ändra kod här lokalt**
   - Kör `npm run dev` för att testa lokalt
   - När du är nöjd, kör `vercel` eller `netlify deploy` igen för att uppdatera live-sidan

✅ **Automatisk deployment (rekommenderat)**
   - Koppla ditt GitHub-repo till Vercel/Netlify
   - Varje gång du pushar kod uppdateras sidan automatiskt

✅ **Environment variables**
   - Lägg till VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY i Vercel/Netlify settings
   - Dessa finns i din .env-fil

---

## Nästa steg efter deployment:

1. Testa att allt fungerar på primebets.se
2. Kolla att Supabase-anslutningen fungerar
3. Testa inloggning och registrering
4. Verifiera att data visas korrekt

Vill du att jag hjälper dig deploya nu?
