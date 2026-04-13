
import { Navbar } from './Navbar'
import { Session } from '@supabase/supabase-js'

interface TermsPageProps {
    session?: Session | null
}

export function TermsPage({ session }: TermsPageProps) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans">
            <Navbar session={session} />

            <div className="absolute top-0 w-full z-50">
                {/* Navbar placeholder om du vill ha den, annars bara en tillbaka-länk. 
                    Men footern sköter naven via App.tsx egentligen, men vi behöver en container.
                    Låt oss göra en enkel header. 
                */}
            </div>

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
                <h1 className="text-4xl font-bold text-white mb-8">Användarvillkor</h1>

                <div className="space-y-8 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">1. Allmänt</h2>
                        <p className="leading-relaxed mb-4">
                            Välkommen till PrimeBets. Genom att använda vår tjänst godkänner du dessa användarvillkor.
                            Tjänsten tillhandahålls av PrimeBets Invest AB.
                        </p>
                        <p className="leading-relaxed">
                            För att använda tjänsten måste du vara minst <strong>18 år gammal</strong> via lag.
                            PrimeBets förbehåller sig rätten att när som helst stänga av konton som misstänks bryta mot denna åldersgräns eller andra villkor.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">2. Tjänstens Innehåll</h2>
                        <p className="leading-relaxed mb-4">
                            PrimeBets är en informationstjänst som tillhandahåller analyser och speltips baserade på statistik och AI.
                            Vi erbjuder <strong>ingen</strong> spelverksamhet (betting) direkt på vår plattform. Alla eventuella spel läggs hos externa spelbolag på användarens eget ansvar.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">3. Ansvarsfriskrivning</h2>
                        <p className="leading-relaxed mb-4">
                            Allt spel sker på egen risk. PrimeBets garanterar inga vinster och ansvarar inte för eventuella ekonomiska förluster som uppstår i samband med att du följer våra tips.
                            Historisk avkastning är ingen garanti för framtida resultat. Spela aldrig för mer pengar än du har råd att förlora.
                        </p>
                        <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                            <strong>Upplever du problem med ditt spelande?</strong> Kontakta <a href="https://stodlinjen.se" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Stödlinjen.se</a> eller ring 020-81 91 00.
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">4. Immateriella Rättigheter</h2>
                        <p className="leading-relaxed">
                            Allt material på webbplatsen (text, analyser, grafik, logotyper) skyddas av upphovsrättslagen.
                            Det är inte tillåtet att kopiera, sprida eller sälja vidare våra analyser utan skriftligt tillstånd.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">5. Personuppgifter (GDPR)</h2>
                        <p className="leading-relaxed">
                            Vi värnar om din integritet. Vi samlar endast in nödvändiga uppgifter (såsom e-postadress för inloggning) för att kunna leverera tjänsten.
                            Vi säljer aldrig dina uppgifter till tredje part. Se vår integritetspolicy för mer detaljer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">6. Ändringar av Villkor</h2>
                        <p className="leading-relaxed">
                            PrimeBets förbehåller sig rätten att uppdatera dessa villkor. Vid väsentliga ändringar kommer användare att informeras via e-post eller tydlig information på webbplatsen.
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
