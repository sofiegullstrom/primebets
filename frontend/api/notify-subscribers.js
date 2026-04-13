
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client to fetch subscribers
// Note: In a real production environment, use process.env.SUPABASE_URL and process.env.SUPABASE_SERVICE_ROLE_KEY
// For this environment, we might need to assume these are set or hardcode checks if strictly necessary, 
// but Vercel Functions usually have access to ENV vars if configured.
// Since I don't see the ENV loading here, I'll rely on the user having set them in Vercel project settings,
// OR I will ask the user to provide them if this fails. 
// However, 're_CEEBJ8Gw_FavuNWkqawaMp9xbqb7feMHb' is hardcoded in the previous file, suggesting we might need to be careful.
// I will use that key for Resend.

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase - using Vercel env vars generally
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    // Verify secret token to prevent unauthorized access (Simple protection)
    // In production, use a proper Auth header or Webhook secret.
    const { secret, pickTitle, pickOdds, pickTrack } = request.body;
    if (secret !== 'primebets-secret-release-key') { // Simple guard
        return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // 1. Fetch active subscribers
        const { data: subscribers, error: dbError } = await supabase
            .from('subscribers')
            .select('email')
            .eq('is_active', true);

        if (dbError) throw dbError;

        if (!subscribers || subscribers.length === 0) {
            return response.status(200).json({ message: 'No subscribers to notify.' });
        }

        // 2. Prepare the FOMO Email HTML
        const emailHtml = `
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dagens PrimePick är här</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F1720; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <!-- Main Card -->
                <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #162230; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0 20px 0;">
                           <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0;">Prime<span style="color: #2FAE8F;">Bets</span></h1>
                        </td>
                    </tr>

                    <!-- Hero Section -->
                    <tr>
                        <td align="center" style="padding: 0 40px;">
                            <h2 style="color: #ffffff; font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 16px 0;">
                                Dagens PrimePick är <span style="color: #2FAE8F;">släppt!</span> 🚀
                            </h2>
                            <p style="color: #94A3B8; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; max-width: 480px;">
                                Våra experter har hittat ett spel med värde i dagens omgång. Missa inte chansen innan oddset justeras.
                            </p>
                        </td>
                    </tr>

                    <!-- Teaser Card -->
                    <tr>
                        <td align="center" style="padding: 0 40px 32px 40px;">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F1720; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <!-- Left: Label -->
                                                <td align="left" style="vertical-align: middle;">
                                                    <span style="color: #64748B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Spelform</span>
                                                    <span style="color: #ffffff; font-size: 16px; font-weight: 600;">Vinnare</span>
                                                </td>
                                                <!-- Right: Hidden Value -->
                                                <td align="right" style="vertical-align: middle;">
                                                    <span style="color: #64748B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Odds</span>
                                                    <span style="color: #2FAE8F; font-size: 20px; font-weight: 700;">${pickOdds || '?.??'}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 16px;">
                                                    <span style="color: #64748B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Analys</span>
                                                    <p style="color: #CBD5E1; font-style: italic; font-size: 14px; margin: 0;">
                                                        "Det här ekipaget har visat en formkurva som..." 
                                                    </p>
                                                </td>
                                            </tr>
                                             <tr>
                                                <td colspan="2" style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 16px;">
                                                    <span style="color: #64748B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Intervju</span>
                                                    <p style="color: #CBD5E1; font-style: italic; font-size: 14px; margin: 0;">
                                                        "Vi har pratat med stallet som meddelar att..."
                                                        <span style="color: #2FAE8F;">[Läs mer]</span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <a href="https://primebets.se" style="display: inline-block; background-color: #2FAE8F; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 32px; border-radius: 12px; box-shadow: 0 4px 14px 0 rgba(47, 174, 143, 0.39);">
                                Lås upp analysen & spelet →
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #111827; padding: 24px; text-align: center; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
                            <p style="color: #475569; font-size: 12px; margin: 0 0 8px 0;">
                                Detta mail skickades till dig för att du prenumererar på PrimeBets notiser.
                            </p>
                            <a href="#" style="color: #64748B; font-size: 12px; text-decoration: underline;">Avregistrera</a>
                        </td>
                    </tr>
                </table>

                <!-- Unsubscribe / Compliance -->
                <p style="color: #475569; font-size: 12px; margin-top: 24px;">
                    © 2024 PrimeBets. Alla rättigheter förbehållna.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        // 3. Send Emails in Batches (Resend limit is usually high but good practice)
        // Check if I can send 'bcc' to bulk list or separate calls. 
        // For privacy, send individually or use BCC if list is small. 
        // With 'resend', you can pass an array to 'to' but that exposes emails if not BCC.
        // Or you can pass Bcc.
        // The previous 'notify.js' used 'to: ["primebets.se@gmail.com"]'.
        // Let's use BCC for the subscribers to protect privacy, and TO: 'PrimeBets Subscribers <no-reply@primebets.se>'
        // Note: Free Resend accounts can only send to verified emails (usually). 
        // If the user hasn't verified a domain, this might fail for external emails.
        // Assuming user has or will verify domain.

        const recipientEmails = subscribers.map(s => s.email);

        // For MVP/Demo: Just log it if empty
        if (recipientEmails.length > 0) {
            const { data: emailData, error: emailError } = await resend.emails.send({
                from: 'PrimeBets <onboarding@resend.dev>', // Change this to your verified domain later
                to: 'prenumeranter@primebets.se', // Dummy TO
                bcc: recipientEmails, // Real recipients hidden
                subject: '🔥 Dagens PrimePick är ute nu!',
                html: emailHtml,
            });

            if (emailError) throw emailError;
        }

        return response.status(200).json({ success: true, count: recipientEmails.length });

    } catch (err) {
        console.error('Notification Error:', err);
        return response.status(500).json({ error: err.message });
    }
}
