
import { Session } from '@supabase/supabase-js'
import { Navbar } from './Navbar'
import { Link } from 'react-router-dom'
import { ArrowRight, Trophy, TrendingUp, Target, Timer, Coins, Flame, Layers, Zap } from 'lucide-react'
import { DesktopDashboardPreview } from './DesktopDashboardPreview'
import { SEO } from './SEO'

interface DashboardExplainerProps {
    session?: Session | null
}

export function DashboardExplainer({ session }: DashboardExplainerProps) {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <SEO
                title="Dashboard - PrimeBets"
                description="Utforska PrimeBets dashboard. Få tillgång till dagliga PrimePicks, Lördagens Drag, och detaljerad statistik."
            />

            <Navbar session={session} />

            <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">

                {/* Hero Section */}
                <div className="text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        Allt du behöver för <span className="text-emerald-400">smartare spel</span>.
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        I din dashboard samlar vi våra skarpaste analyser, AI-värderade odds och exklusiva speltips.
                        Här förklarar vi vad varje del betyder och hur du använder dem för att maximera din ROI.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/auth"
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            Skapa konto gratis
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Dashboard Preview - The "Product" */}
                <div className="mb-24 relative max-w-[80%] mx-auto">
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50 pointer-events-none"></div>
                    <div className="relative">
                        <DesktopDashboardPreview />
                    </div>
                </div>

                {/* Feature Breakdown */}
                <div className="space-y-24">

                    {/* Feature 1: Dagens PrimePick */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                                <Trophy className="w-3 h-3" />
                                Huvudnumret
                            </div>
                            <h2 className="text-3xl font-bold text-white">Dagens PrimePick</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Varje dag identifierar vi ett spel med högst bedömt värde, baserat på data, analys och erfarenhet.
                                Dagens PrimePick är vårt mest genomarbetade spel för dagen, utvalt för dig som vill ha ett tydligt beslut utan att behöva analysera allt själv.
                            </p>
                            <ul className="space-y-6">
                                <FeatureItem
                                    icon={Target}
                                    title="Värdering"
                                    desc="Visar vårt bedömda spelvärde i procent. Ett högre värde betyder att vi anser att oddset är bättre än vad det borde vara – inte att spelet är “säkert”."
                                />
                                <FeatureItem
                                    icon={Timer}
                                    title="Preliminär starttid"
                                    desc="Ger dig koll på när loppet startar. Tiden kan justeras vid sena ändringar, men uppdateras alltid så snart ny information finns."
                                />
                                <FeatureItem
                                    icon={ArrowRight}
                                    title="Direktlänk"
                                    desc="Tar dig direkt till spelbolaget där oddset är som bäst just nu. Vi jämför alltid tillgängliga odds innan vi länkar."
                                />
                            </ul>
                        </div>
                        <div className="order-1 md:order-2 flex items-center justify-center">
                            <MockPrimePickCard />
                        </div>
                    </div>

                    {/* Feature 2: Lördagens Spel */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="w-full flex items-center justify-center">
                            <MockSaturdayCard />
                        </div>
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                                <TrendingUp className="w-3 h-3" />
                                Helgens fokus
                            </div>
                            <h2 className="text-3xl font-bold text-white">Helgens Höjdare</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Inför helgens större omgångar lyfter vi fram ett spel där analysdjupet är extra stort.
                                Här fokuserar vi på sammanhang, mönster och marknad – inte bara på hästens vinstchans.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                Analysen bygger på form, förutsättningar och historik, med målet att identifiera spelvärde i lopp med hög omsättning.
                            </p>
                            <p className="text-slate-500 text-sm italic">
                                Helgens Höjdare är ett mer fördjupat analyscase – inte ett löfte om utfall
                            </p>
                        </div>
                    </div>

                    {/* Feature 3: Senaste Heta */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
                                <Flame className="w-3 h-3" />
                                Hett just nu
                            </div>
                            <h2 className="text-3xl font-bold text-white">Senaste heta</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Senaste heta lyfter fram det senaste spelet med bäst utfall sett till ROI.
                                Kortet visar hur tidigare analyser har presterat, som ett exempel på vårt arbetssätt, inte som en rekommendation.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                Kortet visar senaste heta spel med högst ROI.
                            </p>
                        </div>
                        <div className="order-1 md:order-2 flex items-center justify-center">
                            <MockSenasteHetaCard />
                        </div>
                    </div>

                    {/* Feature 4: Intressanta spel för dagen */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="flex items-center justify-center">
                            <MockIntressantaSpelCard />
                        </div>
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                                <Layers className="w-3 h-3" />
                                Bredd + urval
                            </div>
                            <h2 className="text-3xl font-bold text-white">Intressanta spel för dagen</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Här listar vi spel som uppfyller våra grundkriterier för analys och spelvärde, men som inte valts ut som Dagens PrimePick.
                            </p>
                            <p className="text-slate-400 leading-relaxed italic">
                                Kortet är till för dig som vill utforska fler möjligheter och göra egna avvägningar.
                            </p>
                            <p className="text-slate-500 text-sm">
                                Här finns fler spel som är värda att titta på – men som inte är dagens huvudbeslut.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3: Statistik & Transparens */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
                                <Coins className="w-3 h-3" />
                                Full Insyn
                            </div>
                            <h2 className="text-3xl font-bold text-white">Statistik & Uppföljning</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Vi döljer inga siffror. På dashboarden ser du alltid hur vi presterat de senaste 3 månaderna.
                            </p>
                            <ul className="space-y-3">
                                <FeatureItem icon={TrendingUp} title="ROI (Return On Investment)" desc="Det viktigaste nyckeltalet. Visar din avkastning på satsat kapital." />
                                <FeatureItem icon={Target} title="Träffsäkerhet" desc="Hur ofta våra spel sitter." />
                                <FeatureItem icon={Coins} title="Nettovinst" desc="Det faktiska resultatet i enheter (Units)." />
                            </ul>
                        </div>
                        <div className="order-1 md:order-2 flex items-center justify-center">
                            <MockStatsCard />
                        </div>
                    </div>

                </div>

                {/* Final CTA */}
                <div className="mt-32 text-center bg-gradient-to-b from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-3xl p-12 md:p-24 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mt-32"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Redo att börja vinna?
                        </h2>
                        <p className="text-slate-400 text-lg mb-10">
                            Det är helt gratis att skapa ett konto under vår betaperiod. Få tillgång till hela dashboarden direkt.
                        </p>
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg rounded-full transition-all hover:scale-105 shadow-xl shadow-emerald-500/20"
                        >
                            Skapa mitt konto nu
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    )
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <li className="flex gap-4 items-start">
            <div className="mt-1 p-2 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm">{title}</h4>
                <p className="text-sm text-slate-400 mt-0.5">{desc}</p>
            </div>
        </li>
    )
}

function MockSaturdayCard() {
    return (
        <div className="relative w-full shadow-2xl rounded-3xl overflow-hidden border border-white/10 group hover:scale-[1.01] transition-transform duration-500">
            <img
                src="/dashboard-saturday-example.png"
                alt="Exempel på Lördagens Spel"
                className="w-full h-auto object-cover"
            />
        </div>
    )
}

function MockSenasteHetaCard() {
    return (
        <div className="relative w-full max-w-sm bg-[#162230] border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-500/10 rounded-lg">
                            <Flame className="w-4 h-4 text-orange-400" />
                        </div>
                        <span className="text-sm font-bold text-orange-400 uppercase tracking-wider">Senaste heta</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Igår</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">High On Pepper</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <span>Bergsåker</span>
                    <span>•</span>
                    <span>Lopp 11</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Odds</div>
                        <div className="text-xl font-bold text-white">4.25</div>
                    </div>
                    <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <div className="text-[10px] uppercase text-emerald-400 font-bold mb-1">Resultat</div>
                        <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            Vinst
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <span className="text-xs font-medium text-slate-400 italic">
                        "Distansen ser inte ut att vara några bekymmer och platsoddset är otroligt spelvärt!"
                    </span>
                </div>
            </div>
        </div>
    )
}


function MockIntressantaSpelCard() {
    return (
        <div className="w-full max-w-sm space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-[#2FAE8F] rounded-full shadow-[0_0_10px_#2FAE8F]"></div>
                Intressanta spel för dagen
            </h3>

            {/* Mock Item */}
            <div className="relative w-full rounded-2xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 border-l-4 border-l-[#2FAE8F] shadow-lg hover:bg-[#162230]/50 transition-all group">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="min-w-[140px]">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-white">Don Fanucci Zet</h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>Solvalla</span>
                                <span>•</span>
                                <span>Lopp 4</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Odds</span>
                            <div className="text-xl font-bold text-white leading-none">1.45</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Spelform</span>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-200">
                                <Trophy className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                Vinnare
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Insats</span>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-[#C9A86A]">
                                <Coins className="w-3.5 h-3.5" />
                                3 units
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                        <div className="w-full flex-1 px-4 py-2 rounded-xl bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 text-[#2FAE8F] font-bold text-[10px] flex items-center justify-center gap-2 opacity-80">
                            Spela med bästa odds
                        </div>
                    </div>
                </div>
            </div>

            {/* Another Mock Item */}
            <div className="relative w-full rounded-2xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 border-l-4 border-l-[#2FAE8F] shadow-lg hover:bg-[#162230]/50 transition-all group">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="min-w-[140px]">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-white">Mellby Jinx</h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>Bergsåker</span>
                                <span>•</span>
                                <span>Lopp 10</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Odds</span>
                            <div className="text-xl font-bold text-white leading-none">3.20</div>
                        </div>
                    </div>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Spelform</span>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-200">
                                <Trophy className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                Plats
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Insats</span>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-[#C9A86A]">
                                <Coins className="w-3.5 h-3.5" />
                                1 unit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MockPrimePickCard() {
    return (
        <div className="relative w-full max-w-md rounded-3xl p-[1px] bg-gradient-to-b from-emerald-500/20 to-transparent shadow-2xl hover:scale-[1.01] transition-transform duration-500">
            <div className="rounded-[23px] bg-[#162230] p-6 h-full relative overflow-hidden group">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2FAE8F]/10 text-[#2FAE8F] border border-[#2FAE8F]/20 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(47,174,143,0.2)]">
                            <Trophy className="w-3 h-3" />
                            Dagens PrimePick
                        </div>
                        <div className="flex items-center gap-2 text-[#2FAE8F] text-xs font-medium animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2FAE8F] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2FAE8F]"></span>
                            </span>
                            Preliminär starttid 18:05
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">2.25</div>
                        <div className="flex items-center gap-1 justify-end mt-1">
                            <TrendingUp className="w-3 h-3 text-[#2FAE8F]" />
                            <span className="text-xs font-bold text-[#2FAE8F]">32% värde</span>
                        </div>
                    </div>
                </div>

                {/* Horse Info */}
                <div className="mb-6">
                    <h3 className="text-3xl font-black text-white tracking-tight mb-2">Frenchy Boy</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Jägersro</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span>Lopp 8</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 bg-black/20 rounded-xl p-4 border border-white/5">
                    <div className="bg-[#162230] p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Spelform</div>
                        <div className="font-bold text-white flex items-center gap-2">
                            <Trophy className="w-3 h-3 text-[#2FAE8F]" />
                            Top 5
                        </div>
                    </div>
                    <div className="bg-[#162230] p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Distans</div>
                        <div className="font-bold text-white flex items-center gap-2">
                            <Timer className="w-3 h-3 text-[#2FAE8F]" />
                            2140m Auto
                        </div>
                    </div>
                </div>

                {/* Analysis Snippet */}
                <div className="bg-[#2FAE8F]/5 border border-[#2FAE8F]/10 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2FAE8F]"></span>
                        <span className="text-xs font-bold text-[#2FAE8F] uppercase">Analys</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        "En mycket kapabel häst för klassen. Trots ett tråkigt utgångsläge så tror vi stenhårt på att kapaciteten räcker till seger idag..."
                    </p>
                </div>

                {/* Button */}
                <div className="w-full py-4 rounded-xl bg-gradient-to-r from-[#2FAE8F] to-[#258f75] text-white font-bold text-sm shadow-xl shadow-[#2FAE8F]/20 flex items-center justify-center gap-2">
                    Rygga spelet
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}

function MockStatsCard() {
    return (
        <div className="w-full max-w-md bg-[#162230] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6">
            {/* Header Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0F1720] rounded-xl p-3 border border-[#2FAE8F]/20 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">ROI</div>
                    <div className="text-lg font-bold text-[#2FAE8F]">+25.4%</div>
                </div>
                <div className="bg-[#0F1720] rounded-xl p-3 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Träffsäkerhet</div>
                    <div className="text-lg font-bold text-white">68%</div>
                </div>
                <div className="bg-[#0F1720] rounded-xl p-3 border border-[#2FAE8F]/20 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Netto</div>
                    <div className="text-lg font-bold text-[#2FAE8F]">+1250</div>
                </div>
            </div>

            {/* Simple Graph Visualization */}
            <div className="h-32 w-full bg-[#0F1720] rounded-xl border border-white/5 relative overflow-hidden flex items-end px-2 pb-0 pt-8">
                {/* Fake trend line with CSS gradient or bars */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2FAE8F]/10 to-transparent"></div>
                <svg className="w-full h-full text-[#2FAE8F] drop-shadow-[0_0_10px_rgba(47,174,143,0.3)]" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0 40 C 20 35, 40 38, 50 20 C 60 5, 80 15, 100 0 V 40 H 0 Z" fill="currentColor" fillOpacity="0.2" />
                    <path d="M0 40 C 20 35, 40 38, 50 20 C 60 5, 80 15, 100 0" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>

            {/* Recent Wins List */}
            <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase px-1">Senaste vinster</div>
                {[
                    { name: 'Thunderbolt', odds: 4.25, win: 1250 },
                    { name: 'Lightning Bolt', odds: 2.10, win: 850 },
                    { name: 'Mystic Storm', odds: 8.50, win: 3200 }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0F1720] border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#2FAE8F]/10 flex items-center justify-center">
                                <Trophy className="w-3.5 h-3.5 text-[#2FAE8F]" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white">{item.name}</div>
                                <div className="text-[10px] text-slate-500">Odds: {item.odds}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-[#2FAE8F]">+{item.win} kr</div>
                            <div className="text-[9px] font-bold text-[#2FAE8F] uppercase bg-[#2FAE8F]/10 px-1.5 py-0.5 rounded ml-auto w-fit mt-0.5">Vinst</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
