
import { Navbar } from './Navbar'
import { Session } from '@supabase/supabase-js'

interface PrivacyPageProps {
    session?: Session | null
}

export function PrivacyPage({ session }: PrivacyPageProps) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans">
            <Navbar session={session} />

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
                <h1 className="text-4xl font-bold text-white mb-8">Integritetspolicy</h1>

                <div className="space-y-8 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">

                    <section>
                        <p className="leading-relaxed mb-4 text-slate-400">
                            Din integritet är viktig för oss på PrimeBets. Denna policy förklarar hur vi samlar in, använder och skyddar dina personuppgifter.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">1. Vilka uppgifter samlar vi in?</h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li><strong>Inloggningsuppgifter:</strong> E-postadress för att skapa och hantera ditt konto.</li>
                            <li><strong>Användningsdata:</strong> Information om hur du använder webbplatsen (t.ex. vilka sidor du besöker) för att förbättra vår tjänst.</li>
                            <li><strong>Teknisk data:</strong> IP-adress, webbläsartyp och enhetstyp.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">2. Hur använder vi dina uppgifter?</h2>
                        <p className="leading-relaxed mb-4">
                            Vi använder dina uppgifter för att:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li>Tillhandahålla och administrera ditt konto.</li>
                            <li>Skicka viktiga meddelanden om tjänsten (t.ex. lösenordsåterställning).</li>
                            <li>Analysera och förbättra användarupplevelsen.</li>
                            <li>Förhindra missbruk och bedrägerier.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">3. Cookies</h2>
                        <p className="leading-relaxed mb-4">
                            Vi använder cookies för att hålla dig inloggad och spara dina inställningar. En cookie är en liten textfil som sparas på din enhet.
                            Genom att använda vår tjänst godkänner du användandet av nödvändiga cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">4. Delning av data</h2>
                        <p className="leading-relaxed mb-4">
                            Vi säljer <strong>aldrig</strong> dina personuppgifter till tredje part. Vi kan dela data med betrodda underleverantörer (t.ex. för serverhosting eller e-postutskick) som endast får behandla data enligt våra instruktioner och gällande lag.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">5. Dina rättigheter (GDPR)</h2>
                        <p className="leading-relaxed mb-4">
                            Enligt dataskyddsförordningen (GDPR) har du rätt att:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li>Begära utdrag av den information vi har om dig.</li>
                            <li>Begära rättelse av felaktiga uppgifter.</li>
                            <li>Begära radering av dina uppgifter ("rätten att bli bortglömd").</li>
                        </ul>
                        <p className="mt-4">
                            För att utöva dina rättigheter, kontakta oss på <a href="mailto:primebets.se@gmail.com" className="text-emerald-400 hover:underline">primebets.se@gmail.com</a>.
                        </p>
                    </section>

                    <div className="pt-8 text-sm text-slate-500 border-t border-slate-700">
                        Senast uppdaterad: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </main>
        </div>
    )
}
