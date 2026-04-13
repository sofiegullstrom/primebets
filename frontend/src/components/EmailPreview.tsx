
export const EmailPreview = () => {
    // This is the HTML template we are sending
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
                                                    <span style="color: #2FAE8F; font-size: 20px; font-weight: 700;">3.85</span>
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

    return (
        <div className="w-full h-screen bg-[#0F1720] flex flex-col">
            <div className="bg-[#162230] p-4 text-center border-b border-white/5">
                <h1 className="text-white font-bold text-sm uppercase tracking-widest">Förhandsgranskning av E-post</h1>
            </div>
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                <div
                    className="w-full max-w-[700px] h-full bg-white/5 rounded-xl overflow-hidden shadow-2xl"
                    dangerouslySetInnerHTML={{ __html: emailHtml }}
                />
            </div>
        </div>
    );
}

export default EmailPreview;
