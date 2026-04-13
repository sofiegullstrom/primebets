import { Session } from '@supabase/supabase-js'
import { Navbar } from './Navbar'
import {
    ShieldCheck,
    LineChart,
    XCircle,
    Search,
    Cpu,
    Scale,
    TrendingUp,
    Clock,
    Target,
    AlertOctagon,
    Lightbulb
} from 'lucide-react'

interface MethodPageProps {
    session?: Session | null
    hideNavbar?: boolean
}

export function MethodPage({ session, hideNavbar = false }: MethodPageProps) {
    return (
        <div className="min-h-screen bg-[#0F1720] text-gray-300 font-sans selection:bg-[#2FAE8F]/20">
            {!hideNavbar && <Navbar session={session} />}

            {/* Background Texture */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#1b2c51]/20 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#2FAE8F]/5 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-24">

                {/* 1. Hero Section */}
                <section className="text-center max-w-3xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Vår metod
                    </h1>
                    <p className="text-xl md:text-2xl text-[#2FAE8F] font-medium tracking-wide">
                        Mänsklig expertis förstärkt med AI-intelligens
                    </p>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Vi lämnar inget åt slumpen. Genom att kombinera decennier av travkunnande med avancerad dataanalys identifierar vi spelvärde där marknaden har fel.
                    </p>
                </section>

                {/* 2. Process Section - "Så jobbar vi" */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-[#2FAE8F] rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Så jobbar vi</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {/* Step 1 */}
                        <div className="group p-8 rounded-3xl bg-[#162230]/40 border border-white/5 hover:border-[#2FAE8F]/30 hover:bg-[#162230]/60 transition-all duration-300 backdrop-blur-xl">
                            <div className="w-12 h-12 rounded-xl bg-[#2FAE8F]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Search className="w-6 h-6 text-[#2FAE8F]" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Mänsklig analys</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Våra experter granskar startlistor, formbesked, kuskförändringar och loppdynamik. Vi ser kontexten som data missar – "saker som kräver travozga".
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="group p-8 rounded-3xl bg-[#162230]/40 border border-white/5 hover:border-[#2FAE8F]/30 hover:bg-[#162230]/60 transition-all duration-300 backdrop-blur-xl">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Cpu className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">AI-intelligens</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Vår AI analyserar historik, tempo, avvikelser och marknadsrörelser. Den hittar mönster som är omöjliga för det mänskliga ögat att upptäcka.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="group p-8 rounded-3xl bg-[#162230]/40 border border-white/5 hover:border-[#2FAE8F]/30 hover:bg-[#162230]/60 transition-all duration-300 backdrop-blur-xl">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Scale className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Sammanvägning</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Alla spel måste klara både mänsklig och AI-granskning. Om inte båda ger grönt ljus publicerar vi inget. Inget sker automatiskt utan validering.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="group p-8 rounded-3xl bg-[#162230]/40 border border-white/5 hover:border-[#2FAE8F]/30 hover:bg-[#162230]/60 transition-all duration-300 backdrop-blur-xl">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LineChart className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Publicering & uppföljning</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Våra spel följs upp, utvärderas och justeras kontinuerligt. Metoden utvecklas ständigt – vi gissar aldrig, vi kalkylerar.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. "Why it works" */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Varför detta fungerar
                        </h2>
                        <div className="w-20 h-1 bg-[#2FAE8F] rounded-full"></div>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Spelvärde uppstår när <span className="text-white font-semibold">sannolikhet</span> och <span className="text-white font-semibold">odds</span> inte stämmer överens.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Vår metod är byggd för att hitta just dessa situationer. Vi spelar inte för att ha action på varje lopp – vi spelar när vi har en mätbar fördel mot marknaden.
                        </p>
                    </div>

                    <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-[#0F1720] border border-white/5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                            <Lightbulb className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white mb-1">Människor ser kontext</h4>
                                <p className="text-sm text-gray-400">AI kan missa en dålig värmning eller positionsstrul – vi fångar det.</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#0F1720] border border-white/5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                            <Cpu className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white mb-1">AI ser mönster</h4>
                                <p className="text-sm text-gray-400">Människor missar statistiska avvikelser över tid – AI fångar det.</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#0F1720] border border-white/5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                            <Clock className="w-6 h-6 text-purple-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white mb-1">Marknaden är snabb</h4>
                                <p className="text-sm text-gray-400">Vi agerar innan oddsjusteringar sker.</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#0F1720] border border-white/5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                            <Target className="w-6 h-6 text-[#2FAE8F] shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white mb-1">Selektivitet vinner</h4>
                                <p className="text-sm text-gray-400">Vi spelar färre spel, men med högre kvalitet.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Comparison Section - "Vad vi inte gör" vs "Vad som skiljer" */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                    {/* Left: What we DON'T do */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Vad vi inte gör</h2>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-[#162230]/20 border border-white/5 flex items-center gap-4 text-gray-500">
                                <AlertOctagon className="w-5 h-5 shrink-0" />
                                <span className="font-medium">Vi jagar inte action på alla lopp</span>
                            </div>
                            <div className="p-5 rounded-2xl bg-[#162230]/20 border border-white/5 flex items-center gap-4 text-gray-500">
                                <Cpu className="w-5 h-5 shrink-0" />
                                <span className="font-medium">Vi publicerar inget helt automatiskt</span>
                            </div>
                            <div className="p-5 rounded-2xl bg-[#162230]/20 border border-white/5 flex items-center gap-4 text-gray-500">
                                <XCircle className="w-5 h-5 shrink-0" />
                                <span className="font-medium">Vi följer inte oddsblindt utan egen analys</span>
                            </div>
                            <div className="p-5 rounded-2xl bg-[#162230]/20 border border-white/5 flex items-center gap-4 text-gray-500">
                                <TrendingUp className="w-5 h-5 shrink-0" />
                                <span className="font-medium">Vi lovar aldrig "säkra" vinster</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: What sets us apart */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Vad som skiljer PrimeBets</h2>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 flex items-center gap-4">
                                <ShieldCheck className="w-5 h-5 text-[#2FAE8F] shrink-0" />
                                <span className="font-medium text-white">Mänskligt filter innan varje publicering</span>
                            </div>
                            <div className="p-5 rounded-2xl bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 flex items-center gap-4">
                                <LineChart className="w-5 h-5 text-[#2FAE8F] shrink-0" />
                                <span className="font-medium text-white">Fokus på långsiktigt värde (ROI), inte träffprocent</span>
                            </div>
                            <div className="p-5 rounded-2xl bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 flex items-center gap-4">
                                <Clock className="w-5 h-5 text-[#2FAE8F] shrink-0" />
                                <span className="font-medium text-white">Samma disciplinerade metod varje dag</span>
                            </div>
                            <div className="p-5 rounded-2xl bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 flex items-center gap-4">
                                <Search className="w-5 h-5 text-[#2FAE8F] shrink-0" />
                                <span className="font-medium text-white">Full transparens i alla resultat</span>
                            </div>
                        </div>
                    </div>

                </section>

                {/* 5. Footer Quote / Subtle Closing */}
                <div className="text-center pt-12 pb-6 border-t border-white/5">
                    <p className="text-gray-500 italic text-sm">
                        "PrimeBets är ett seriöst verktyg byggt för långsiktiga vinnare, inte för snabb underhållning."
                    </p>
                </div>

            </main>
        </div>
    )
}
