# Instruktioner för att aktivera kontaktformulär e-post

## Steg 1: Skapa Resend-konto
1. Gå till https://resend.com och skapa ett gratis konto
2. Verifiera din e-postadress
3. Gå till "API Keys" och skapa en ny API-nyckel
4. Kopiera API-nyckeln (börjar med `re_`)

## Steg 2: Lägg till API-nyckel i Supabase
1. Gå till din Supabase dashboard: https://supabase.com/dashboard
2. Välj ditt projekt "primebets"
3. Gå till "Project Settings" → "Edge Functions"
4. Under "Secrets", klicka "Add secret"
5. Namn: `RESEND_API_KEY`
6. Värde: Din Resend API-nyckel (från steg 1)
7. Klicka "Save"

## Steg 3: Deploya Edge Function
Kör följande kommando i terminalen:

```bash
cd /Users/sofiegullstrom/.gemini/antigravity/scratch/primebets
npx supabase functions deploy send-contact-email
```

## Steg 4: Testa kontaktformuläret
1. Gå till din webbplats
2. Navigera till "Kontakt"-sidan
3. Fyll i formuläret och skicka
4. Du bör få ett e-postmeddelande till primebets.se@gmail.com

## Felsökning
Om du inte får e-post:
1. Kolla Supabase Edge Function logs:
   - Gå till Supabase Dashboard → Edge Functions → send-contact-email → Logs
2. Verifiera att RESEND_API_KEY är korrekt satt
3. Kontrollera att din Resend-domän är verifierad (eller använd deras test-domän)

## Alternativ: Använd Gmail direkt (enklare men mindre säkert)
Om du vill använda Gmail direkt istället för Resend, kan jag hjälpa dig sätta upp det också.
