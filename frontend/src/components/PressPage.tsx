
import { Navbar } from './Navbar'

import { ExternalLink, Newspaper, Award, TrendingUp } from 'lucide-react'
import { SEO } from './SEO'

const articles = [
    {
        title: "Drog in 6.8 miljoner: 'Jag är i chock'",
        source: "Aftonbladet",
        url: "https://www.aftonbladet.se/sportbladet/trav365/a/b5oWrd/adam-21-drog-in-68-milj-jag-ar-i-chock",
        date: "2018",
        highlight: "6.8 Miljoner Kr"
    },
    {
        title: "Gick golfrunda – drog in 2.4 miljoner",
        source: "Expressen",
        url: "https://www.expressen.se/sport/trav/adam-gick-golfrunda-drog-in-24-miljoner/",
        date: "2020",
        highlight: "2.4 Miljoner Kr"
    },
    {
        title: "Satte flera system – spelade in 2.4 miljoner",
        source: "Aftonbladet",
        url: "https://www.aftonbladet.se/sportbladet/trav365/a/o3nGoR/storvinster-v75-spelexperten-satte-flera-system-och-spelade-in-24-miljoner",
        date: "2020",
        highlight: "V75 Succé"
    },
    {
        title: "Spelade in 1.2 miljoner på V75 – blev rejält partaj",
        source: "Aftonbladet",
        url: "https://www.aftonbladet.se/sportbladet/trav365/a/QMbk9x/adam-spelade-in-12-miljoner-pa-v75-blev-rejalt-partaj",
        date: "2019",
        highlight: "1.2 Miljoner Kr"
    },
    {
        title: "Drog in miljonbelopp – igen",
        source: "Expressen",
        url: "https://www.expressen.se/sport/trav/adam-25-drog-in-miljonbelopp-igen/",
        date: "2022",
        highlight: "Miljonvinst"
    },
    {
        title: "Spelade in mest i landet på V75",
        source: "Expressen",
        url: "https://www.expressen.se/sport/trav/adam-21-spelade-in-mest-i-landet-pa-v75/",
        date: "2018",
        highlight: "Sverigebäst"
    },
    {
        title: "Min superskräll på V75 är helt felspelad",
        source: "Aftonbladet",
        url: "https://www.aftonbladet.se/sportbladet/trav365/a/eK9MQO/min-superskrall-pa-v75-ar-helt-felspelad",
        date: "Expertanalys",
        highlight: "Analys"
    },
    {
        title: "V75 på Bergsåker: 'Det är en guldgruva'",
        source: "Aftonbladet",
        url: "https://www.aftonbladet.se/sportbladet/trav365/a/8mknWx/v75-pa-bergsaker--det-ar-en-guldgruva",
        date: "Expertanalys",
        highlight: "Analys"
    },

    {
        title: "Drog in miljonbelopp igen",
        source: "Travsport.nu",
        url: "https://travsport.nu/2022/10/05/adam-25-drog-in-miljonbelopp-igen/",
        date: "2022",
        highlight: "Miljonvinst"
    }
]

import { Session } from '@supabase/supabase-js'

interface PressPageProps {
    session?: Session | null
}

export function PressPage({ session }: PressPageProps) {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
            <SEO
                title="Press & Media | PrimeBets"
                description="Läs om PrimeBets grundare Adam och hans historiska storvinster på V75. Omskriven i Aftonbladet och Expressen för sina miljonvinster."
            />

            <Navbar session={session} />

            <main className="flex-grow pt-32 pb-20 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-block p-3 rounded-2xl bg-slate-800/50 border border-slate-700 mb-6">
                            <Award className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            Omskriven i <span className="text-emerald-400">Media</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Vår expertis är inte bara ord, den är bevisad. Här är ett urval av artiklar från Aftonbladet och Expressen som uppmärksammat våra framgångar och miljonvinster genom åren.
                        </p>
                    </div>

                    {/* Stats Summary - LLM Optimization for Authority */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-white mb-1">10+</div>
                            <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">År av Vinster</div>
                        </div>
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-emerald-400 mb-1">15 Mkr+</div>
                            <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">Inspelat (Est.)</div>
                        </div>
                        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-white mb-1">100%</div>
                            <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">Verifierat</div>
                        </div>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid gap-4">
                        {articles.map((article, index) => (
                            <a
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/30 rounded-xl p-5 md:p-6 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${article.source === 'Aftonbladet' ? 'bg-yellow-500/10 text-yellow-500' :
                                            article.source === 'Expressen' ? 'bg-red-500/10 text-red-500' :
                                                'bg-slate-700 text-slate-300'
                                            }`}>
                                            {article.source}
                                        </span>
                                        <span className="text-slate-500 text-xs flex items-center gap-1">
                                            <Newspaper className="w-3 h-3" />
                                            {article.date}
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-200 group-hover:text-emerald-400 transition-colors leading-tight">
                                        {article.title}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto">
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 min-w-[100px] justify-center">
                                        <TrendingUp className="w-3 h-3" />
                                        {article.highlight}
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors flex-shrink-0" />
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 text-sm">
                            * Ovanstående är ett urval av publika artiklar. Vi garanterar inga framtida vinster baserat på historiska resultat.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    )
}
