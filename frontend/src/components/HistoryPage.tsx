
import { Clock, TrendingUp, BookOpen, Star, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { Navbar } from './Navbar'

interface HistoryPageProps {
    session?: Session | null
}

export function HistoryPage({ session }: HistoryPageProps) {
    const timelineData = [
        {
            year: "2017",
            title: "Gnistan tänds",
            content: "Ett spontant besök på travet. 200 kr blir 5000 kr gnistan tänds.",
            icon: <Star className="w-5 h-5 text-amber-500" />
        },
        {
            year: "2018–2021",
            title: "Analysen växer",
            content: "Analysen växer. Lopp efter lopp dokumenteras, anteckningar fyller pärmar och alla Travronden-upplagor sparas i ett unikt arkiv.",
            icon: <BookOpen className="w-5 h-5 text-blue-400" />
        },
        {
            year: "2022",
            title: "Idén tar form",
            content: "Idén växer fram om att förvandla år av erfarenhet till något större – en digital hjärna byggd på travkunskap.",
            icon: <Brain className="w-5 h-5 text-purple-400" />
        },
        {
            year: "2023",
            title: "Prototyp & Test",
            content: "Prototyp, test och finjustering. Metoden förädlas med verkliga lopp och feedback.",
            icon: <Clock className="w-5 h-5 text-emerald-400" />
        },
        {
            year: "2024–2025",
            title: "En ny era",
            content: "Plattformen växer och utvecklas. Historik möter teknik – och travanalys går in i en ny era.",
            icon: <TrendingUp className="w-5 h-5 text-rose-400" />
        }
    ]

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Navbar session={session} />

            {/* Hero */}
            <section className="max-w-4xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                    Från 200kr till 5000kr
                    <span className="block text-2xl md:text-3xl mt-2 text-slate-400 font-normal">Historien bakom PrimeBets</span>
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    PrimeBets föddes ur passion, envishet och ett nästan hundraårigt arv av travkunskap.
                    Allt började 2017 med en spontan dag på travet, där fascinationen väcktes som senare skulle förvandlas
                    till att förena mänsklig expertis med artificiell intelligens.
                </p>
            </section>

            {/* Timeline */}
            <section className="max-w-3xl mx-auto px-6 pb-24">
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 opacity-20 transform -translate-x-1/2 md:translate-x-0"></div>

                    <div className="space-y-12">
                        {timelineData.map((item, index) => (
                            <div key={index} className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center z-10 transform -translate-x-1/2 md:translate-x-1/2">
                                    {item.icon}
                                </div>

                                {/* Content Spacer (for alternate layout) */}
                                <div className="hidden md:block w-1/2"></div>

                                {/* Content Card */}
                                <div className="flex-1 ml-12 md:ml-0">
                                    <div className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:border-slate-600 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -mr-8 -mt-8 group-hover:from-white/10 transition-colors"></div>

                                        <div className="text-emerald-400 font-bold mb-1 text-sm tracking-wider uppercase">{item.year}</div>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            {item.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Future/CTA */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="relative overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"></div>

                    <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
                        <Award className="w-16 h-16 mx-auto mb-6 text-amber-500" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                            Var med på vår resa framåt
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Vi fortsätter att utveckla morgondagens travanalys. Bli en del av PrimeBets idag.
                        </p>
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg hover:scale-105"
                        >
                            Skapa konto gratis
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

function Brain(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
    )
}
