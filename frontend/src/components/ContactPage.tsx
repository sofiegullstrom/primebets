import { useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { Send, ChevronDown, CheckCircle, ShieldAlert } from 'lucide-react'
import { Navbar } from './Navbar'
import { supabase } from '../lib/supabase'

interface ContactPageProps {
    session?: Session | null
}

interface ContactPageProps {
    session?: Session | null
    hideNavbar?: boolean
}

export function ContactPage({ session, hideNavbar = false }: ContactPageProps) {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const message = formData.get('message') as string

        try {
            const { error: functionError } = await supabase.functions.invoke('send-contact-email', {
                body: { name, email, message }
            })

            if (functionError) throw functionError

            setSubmitted(true)
            e.currentTarget.reset()
        } catch (err: any) {
            console.error('Error sending email:', err)
            setError('Något gick fel. Försök igen eller kontakta oss direkt på primebets.se@gmail.com')
        } finally {
            setLoading(false)
        }
    }

    const faqs = [
        {
            question: "Hur räknar ni ut statistik och ROI?",
            answer: "Vi redovisar alla spel helt transparent med \"flatbet\"-insats (samma insats på varje spel) för att ge en rättvis bild. ROI (Return On Investment) beräknas genom att dela total nettovinst med total omsättning. Alla resultat verifieras och låses efter spelstopp."
        },
        {
            question: "Vad gör er metod unik?",
            answer: "Vi kombinerar Adams mångåriga expertis och djupa nätverk inom travvärlden med modern AI-analys. AI:n processar stora datamängder för att hitta mönster och överodds som det mänskliga ögat kan missa, medan Adam står för fingertoppskänslan och slutgiltig sållning."
        },
        {
            question: "Hur många spel får jag tillgång till?",
            answer: "Vi publicerar dagliga speltips under \"Dagens PrimePick\" och \"Intressanta Spel\". Utöver det får du \"Veckans Spaning\" varje vecka och exklusiva drag inför Lördagens spel. Kvantiteten varierar beroende på spelvärdet – vi spelar bara när oddsen är på vår sida."
        },
        {
            question: "Är tjänsten gratis?",
            answer: "Ja, just nu är PrimeBets helt kostnadsfritt. Vårt mål är att bygga en vinnande community och bevisa värdet av vår metod innan vi eventuellt introducerar premiumfunktioner i framtiden."
        },
        {
            question: "Vilka spelbolag rekommenderar ni?",
            answer: "Vi jämför alltid odds från de största och mest seriösa aktörerna på den svenska marknaden (t.ex. ATG, Svenska Spel, Bet365, Unibet). Vi rekommenderar att ha konton på flera sidor för att alltid kunna spela till marknadens högsta odds."
        },
        {
            question: "Behöver du hjälp med ditt spelande?",
            answer: "Spel ska vara underhållning. Om du eller någon du känner spelar för mycket, tveka inte att söka hjälp. Vi hänvisar till Stödlinjen.se (020-81 91 00) och Spelpaus.se för att ta kontroll över spelandet. Åldersgräns 18 år."
        }
    ]

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            {!hideNavbar && <Navbar session={session} />}

            <main className="max-w-4xl mx-auto px-6 py-16">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Kom i kontakt med oss
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Har du frågor om vår tjänst, förslag på förbättringar eller vill diskutera samarbete?
                        Vi finns här för att hjälpa dig.
                    </p>
                </div>

                <div className="grid md:grid-cols-12 gap-8 mb-24">
                    {/* Contact Info Sidebar */}
                    <div className="md:col-span-4 space-y-6">


                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-500">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Ansvarsfullt Spelande</h3>
                            <p className="text-slate-400 text-sm mb-4">
                                Spel ska vara kul. Spela aldrig för mer än du har råd att förlora.
                            </p>
                            <a href="https://stodlinjen.se" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-medium hover:text-blue-300 flex items-center gap-1">
                                Gå till Stödlinjen.se <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-8">
                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 md:p-8">
                            {submitted ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Tack för ditt meddelande!</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto mb-8">
                                        Vi har tagit emot ditt mail och återkommer till dig på den angivna e-postadressen så snart vi kan.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Skicka ett nytt meddelande
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Ditt Namn</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                disabled={loading}
                                                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">E-postadress</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                disabled={loading}
                                                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Ämne</label>
                                        <select
                                            name="subject" // Added name attribute
                                            disabled={loading} // Added disabled attribute
                                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50" // Added disabled style
                                        >
                                            <option>Allmän fråga</option>
                                            <option>Support / Teknisk hjälp</option>
                                            <option>Feedback & Förslag</option>
                                            <option>Samarbetsförfrågan</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Meddelande</label>
                                        <textarea
                                            name="message"
                                            required
                                            disabled={loading}
                                            rows={6}
                                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none placeholder:text-slate-600 disabled:opacity-50"
                                            placeholder="Berätta vad du har på hjärtat..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"></div>
                                                Skickar...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Skicka Meddelande
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white">Vanliga Frågor & Svar</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-bold text-lg text-slate-200">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <div
                                    className={`px-6 text-slate-400 leading-relaxed overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    )
}
