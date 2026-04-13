import { Timer, Ruler, Trophy, Coins, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function MobileDashboardPreview() {
    return (
        <div className="relative w-full max-w-md mx-auto">


            {/* Dashboard Screenshot/Preview - Mobile Card */}
            <div className="relative bg-[#0F1720] rounded-[22px] overflow-hidden border border-slate-700/50 shadow-2xl pointer-events-none select-none">

                {/* Frenchy Boy Card - Compact */}
                <div className="p-4 space-y-4 filter blur-[0.5px]">
                    <div className="bg-[#162230]/40 border border-white/5 rounded-2xl p-4 shadow-2xl relative overflow-hidden">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-1.5">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-[#2FAE8F]/10 text-[#2FAE8F] text-[9px] font-bold uppercase tracking-wider border border-[#2FAE8F]/10 w-fit">
                                    Dagens PrimePick
                                </span>
                                <span className="text-[#2FAE8F] text-[10px] font-medium animate-pulse">Preliminär starttid 18:05</span>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-bold text-2xl tracking-tighter">2.25</div>
                                <div className="flex items-center gap-1 justify-end">
                                    <TrendingUp className="w-3 h-3 text-[#2FAE8F]" />
                                    <span className="text-[10px] font-bold text-[#2FAE8F]">~ 32%</span>
                                </div>
                            </div>
                        </div>

                        {/* Horse */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-white tracking-tight leading-none mb-1">Frenchy Boy</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>Jägersro</span>
                                <span>•</span>
                                <span>Lopp 8</span>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4 bg-white/5 rounded-xl p-3 border border-white/5">
                            <div>
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-0.5">Start</span>
                                <div className="flex items-center gap-1.5 text-gray-200">
                                    <Timer className="w-3 h-3 text-[#2FAE8F]" />
                                    <span className="text-xs font-medium">Auto</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-0.5">Distans</span>
                                <div className="flex items-center gap-1.5 text-gray-200">
                                    <Ruler className="w-3 h-3 text-[#2FAE8F]" />
                                    <span className="text-xs font-medium">2140</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-0.5">Spelform</span>
                                <div className="flex items-center gap-1.5 text-gray-200">
                                    <Trophy className="w-3 h-3 text-[#2FAE8F]" />
                                    <span className="text-xs font-medium">Top 5</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-0.5">Insats</span>
                                <div className="flex items-center gap-1.5">
                                    <Coins className="w-3 h-3 text-[#C9A86A]" />
                                    <span className="text-xs font-medium text-[#C9A86A]">3</span>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Text */}
                        <div className="mb-4">
                            <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Analys</span>
                            <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                                Kapabel häst för klassen med dåligt utgångsläge. Däremot är han stark och tål offensiva upplägg. Bike på nu...
                            </p>
                        </div>

                        {/* Button */}
                        <button className="w-full bg-[#2FAE8F] hover:bg-[#258f75] text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#2FAE8F]/20 transition-colors">
                            Spela med bästa odds
                        </button>

                    </div>
                </div>

                {/* Blur Overlay with CTA */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F1720] via-[#0F1720]/90 to-transparent flex items-end justify-center pb-6 px-4 pointer-events-auto">
                    <Link
                        to="/auth"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 text-center"
                    >
                        Starta gratis konto
                    </Link>
                </div>
            </div>
        </div>
    )
}
