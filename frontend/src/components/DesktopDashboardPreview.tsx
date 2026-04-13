import { Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Timer, Ruler, Trophy, Coins, TrendingUp, Target, Zap, Flame } from 'lucide-react';
import { LockedAnalysisModal } from './LockedAnalysisModal';

interface DesktopDashboardPreviewProps {
    session?: Session | null;
}

export function DesktopDashboardPreview({ session }: DesktopDashboardPreviewProps) {
    const [activeModalHorse, setActiveModalHorse] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-[120rem] mx-auto px-4 perspective-1000">

            {/* Monitor Frame */}
            <div className="relative mx-auto bg-slate-700 rounded-[2.5rem] shadow-2xl border-[12px] border-slate-700 ring-1 ring-white/10 input-monitor-frame aspect-[16/10] max-w-6xl">
                <div className="h-full w-full bg-[#0F1720] rounded-[1.7rem] overflow-hidden relative group">

                    {/* Scaled Content Wrapper - Fits content into fixed aspect ratio */}
                    <div className="absolute inset-0 w-[153.8%] h-[153.8%] origin-top-left scale-[0.65] p-8 flex flex-col gap-4">

                        {/* Row 1: Top Cards - Increased Size */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[540px]">

                            {/* 1. Dagens PrimePick Card (Frenchy Boy) */}
                            <div className="relative w-full rounded-3xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl flex flex-col h-full">

                                {/* Header: Badge & Status */}
                                <div className="mb-4 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#2FAE8F] text-sm font-medium">Idag • 18:05</span>
                                        <span className="text-[#2FAE8F] text-sm font-bold opacity-50">Avslutat</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#2FAE8F]/10 text-[#2FAE8F] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#2FAE8F]/10">
                                            Dagens PrimePick
                                        </span>
                                        <span className="text-gray-400 text-sm font-medium">
                                            · Avslutat spel
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full">
                                    {/* Left Column: Main Info */}
                                    <div className="flex-1 min-w-0">
                                        {/* Horse Name */}
                                        <div className="mb-4">
                                            <Label label="HÄST" />
                                            <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-2 mt-1">
                                                Frenchy Boy
                                            </h2>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <span className="text-white">Jägersro</span>
                                                <span className="text-gray-600">•</span>
                                                <span>Lopp 8</span>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-[#2FAE8F]">Preliminär starttid 18:05</span>
                                            </div>
                                        </div>

                                        {/* Facts Grid */}
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-4">
                                            <div>
                                                <Label label="Startmetod" />
                                                <div className="flex items-center gap-2 text-gray-200">
                                                    <Timer className="w-4 h-4 text-[#2FAE8F]" />
                                                    <span className="text-sm font-medium">Autostart</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label label="Distans" />
                                                <div className="flex items-center gap-2 text-gray-200">
                                                    <Ruler className="w-4 h-4 text-[#2FAE8F]" />
                                                    <span className="text-sm font-medium">2140</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label label="Spelform" />
                                                <div className="flex items-center gap-2 text-gray-200">
                                                    <Trophy className="w-4 h-4 text-[#2FAE8F]" />
                                                    <span className="text-sm font-medium">Top 5</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label label="Utrustning" />
                                                <div className="flex items-center gap-2 text-gray-200">
                                                    <Zap className="w-4 h-4 text-[#2FAE8F]" />
                                                    <span className="text-sm font-medium">Bike</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label label="Insats" />
                                                <div className="flex items-center gap-2">
                                                    <Coins className="w-4 h-4 text-[#C9A86A]" />
                                                    <span className="text-sm font-medium text-[#C9A86A]">3</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Analysis */}
                                        <div className="pt-3 border-t border-white/5">
                                            <Label label="ANALYS" />
                                            <p
                                                className="text-sm text-gray-300 leading-relaxed mt-1"
                                                style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
                                            >
                                                Kapabel häst för klassen med dåligt utgångsläge. Däremot är han stark och tål offensiva upplägg. Bike på nu och står sig väl nog att lösa en top 5 placering!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column: Odds & Buttons */}
                                    <div className="flex flex-col items-end justify-between min-w-[200px] gap-6 h-full">
                                        <div className="text-right">
                                            <Label label="ODDS" alignment="right" />
                                            <div className="text-5xl font-bold text-white tracking-tighter leading-none mb-3 mt-1">
                                                2.25
                                            </div>
                                            <Label label="SPELVÄRDE" alignment="right" />
                                            <div className="flex items-center justify-end gap-1 px-3 py-1.5 rounded-lg bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 backdrop-blur-md mt-1">
                                                <TrendingUp className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                                <span className="text-sm font-bold text-[#2FAE8F]">+ 32%</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full gap-3 mt-auto">
                                            <button
                                                onClick={() => navigate('/auth')}
                                                className="w-full px-4 py-3 rounded-xl bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 hover:bg-[#2FAE8F]/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="font-semibold text-white text-xs">Spela med bästa odds</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveModalHorse('Frenchy Boy')}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="text-xs font-medium text-gray-300">Läs full analys</span>
                                                <ArrowRight className="w-3 h-3 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Lördagens Spel Card (Louis Vuitton) */}
                            <div className="relative w-full rounded-3xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden">
                                {/* Background Fx */}
                                <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden">
                                    <div className="absolute right-0 top-0 h-full w-[60%] opacity-40 mix-blend-lighten">
                                        <img
                                            src="/saturday_horse.png"
                                            alt="Running Horse"
                                            className="w-full h-full object-cover object-center"
                                            style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
                                        />
                                    </div>
                                    {/* Navy Blue Glow */}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B3B5F]/30 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                                </div>

                                {/* Header */}
                                <div className="mb-4 flex flex-col gap-2 relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#4A90E2] text-sm font-medium">Lördag</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#4A90E2]/20">
                                            LÖRDAGENS SPEL
                                        </span>
                                        <span className="text-gray-400 text-sm font-medium">
                                            · Avslutat spel
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full relative z-10">
                                    <div className="flex-1 min-w-0">
                                        {/* Horse */}
                                        <div className="mb-4">
                                            <Label label="HÄST" />
                                            <div className="flex items-center gap-3 mb-2 mt-1">
                                                <h2 className="text-3xl font-bold text-white tracking-tight leading-none">
                                                    Louis Vuitton
                                                </h2>
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                                                    <TrendingUp className="w-3 h-3" />
                                                    <span className="text-[9px] font-bold tracking-wider">FORM TOPP</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <span className="text-white">Jägersro</span>
                                                <span className="text-gray-600">•</span>
                                                <span>Lopp 5</span>
                                            </div>
                                        </div>

                                        {/* Facts Grid */}
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-4">
                                            <div>
                                                <Label label="Startmetod" />
                                                <div className="flex items-center gap-2 text-gray-200">
                                                    <Timer className="w-4 h-4 text-[#4A90E2]" />
                                                    <span className="text-sm font-medium">Autostart</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label label="Distans" />
                                                <div className="flex items-center gap-2 text-gray-200">
                                                    <Ruler className="w-4 h-4 text-[#4A90E2]" />
                                                    <span className="text-sm font-medium">1640m</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label label="Spelform" />
                                                <div className="flex items-center gap-2 text-gray-200">
                                                    <Trophy className="w-4 h-4 text-[#4A90E2]" />
                                                    <span className="text-sm font-medium">Plats (1-3)</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label label="Startspår" />
                                                <div className="flex items-center gap-2 text-gray-200">
                                                    <Target className="w-4 h-4 text-[#4A90E2]" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">Spår</span>
                                                        <span className="text-sm font-medium leading-none">10</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Analysis */}
                                        <div className="pt-3 border-t border-white/5">
                                            <Label label="ANALYS" />
                                            <p
                                                className="text-sm text-gray-300 leading-relaxed line-clamp-4 mt-1"
                                                style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
                                            >
                                                Stark häst för klassen som dessutom har mycket bra kapacitet för ett lopp som detta. Banorna är långsamma och i detta sprinterlopp kommer det bli hårt kört i början, vilket bäddar för att hans avslutning kommer sänka många.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column: Odds & Buttons */}
                                    <div className="flex flex-col items-end justify-between min-w-[200px] gap-6 h-full">
                                        <div className="text-right">
                                            <Label label="ODDS" alignment="right" />
                                            <div className="text-5xl font-bold text-white tracking-tighter leading-none mb-3 mt-1">
                                                1.85
                                            </div>
                                            <Label label="SPELVÄRDE" alignment="right" />
                                            <div className="flex items-center justify-end gap-1 px-3 py-1.5 rounded-lg bg-[#4A90E2]/10 border border-[#4A90E2]/20 backdrop-blur-md mt-1">
                                                <TrendingUp className="w-3.5 h-3.5 text-[#4A90E2]" />
                                                <span className="text-sm font-bold text-[#4A90E2]">+23%</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full gap-3 mt-auto">
                                            <button
                                                onClick={() => navigate('/auth')}
                                                className="w-full px-4 py-3 rounded-xl bg-[#4A90E2] border border-[#4A90E2]/50 shadow-lg shadow-[#4A90E2]/20 hover:bg-[#357ABD] transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="font-semibold text-white text-xs">Spela med bästa odds</span>
                                                <ArrowRight className="w-3 h-3 text-white" />
                                            </button>
                                            <button
                                                onClick={() => setActiveModalHorse('Louis Vuitton')}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="text-xs font-medium text-gray-300">Läs fullständig analys</span>
                                                <ArrowRight className="w-3 h-3 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Senaste Heta Card (Examples) */}
                            {/* Note: In the real dashboard this replaces Lördagens/Prime if those aren't there, or sits alongside. 
                     For the preview, let's create a new row or just place it to show "Here is how it looks" */}

                        </div>



                        {/* Row 3: Senaste Heta & Veckans Spaning */}
                        <div className="grid grid-cols-12 gap-6 flex-1 h-[360px] mt-2">

                            {/* Senaste Heta Example - 40% Width (5/12) */}
                            <div className="col-span-12 lg:col-span-5 relative w-full rounded-3xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20">
                                            <Flame className="w-5 h-5 text-[#F5A623]" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Senaste heta</h2>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 uppercase tracking-wider">AVSLUTAT SPEL</span>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Period</div>
                                            <div className="text-lg font-bold text-white capitalize">Gårdagen</div>
                                        </div>
                                        <span className="px-3 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20 uppercase tracking-wide">VINST</span>
                                    </div>

                                    <div className="flex items-end justify-between mb-8">
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ROI</div>
                                            <div className="text-4xl font-black text-[#2FAE8F] tracking-tight">+125%</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ODDS</div>
                                            <div className="text-4xl font-black text-white tracking-tight">3.45</div>
                                        </div>
                                    </div>

                                    <div className="bg-[#1A2736]/50 rounded-xl p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-auto relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-12 bg-[#2FAE8F]/5 rounded-full blur-2xl pointer-events-none"></div>
                                        <div className="flex items-start gap-4 w-full relative z-10">
                                            <div className="w-14 h-14 rounded-full bg-[#4A90E2]/10 border border-[#4A90E2]/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4A90E2]/5 mt-1">
                                                <Trophy className="w-6 h-6 text-[#4A90E2]" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">HÄST</div>
                                                <h3 className="text-2xl font-black text-white truncate drop-shadow-lg mb-2">Staro Mack Crowe</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <span>Solvalla</span>
                                                    <span className="text-gray-600">•</span>
                                                    <span>Vinnare</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <button className="w-full py-3 rounded-lg bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 text-[#2FAE8F] border border-[#2FAE8F]/20 font-bold text-sm transition-all flex items-center justify-center gap-2">
                                        Läs fullständig analys
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Statistik (Senaste 3 Mån) - 60% Width (7/12) */}
                            <div className="col-span-12 lg:col-span-7 relative w-full rounded-3xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                            <div className="w-1 h-6 bg-[#4A90E2] rounded-full shadow-[0_0_10px_#4A90E2]"></div>
                                            Vår statistik
                                        </h2>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
                                        Senaste 3 månaderna
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-6">
                                    {/* KPIs */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-[#1A2736]/50 rounded-xl p-4 border border-white/5 flex flex-col items-center text-center">
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                <TrendingUp className="w-3 h-3 text-[#2FAE8F]" /> ROI
                                            </div>
                                            <div className="text-xl lg:text-2xl font-black text-[#2FAE8F] tracking-tight">+125%</div>
                                        </div>
                                        <div className="bg-[#1A2736]/50 rounded-xl p-4 border border-white/5 flex flex-col items-center text-center">
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                <Target className="w-3 h-3 text-[#A855F7]" /> TRÄFFSÄKERHET
                                            </div>
                                            <div className="text-xl lg:text-2xl font-black text-white tracking-tight">75%</div>
                                        </div>
                                        <div className="bg-[#1A2736]/50 rounded-xl p-4 border border-white/5 flex flex-col items-center text-center">
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                <Coins className="w-3 h-3 text-[#4A90E2]" /> NETTOVINST
                                            </div>
                                            <div className="text-xl lg:text-2xl font-black text-[#4A90E2] tracking-tight">+42.5</div>
                                        </div>
                                    </div>

                                    {/* Chart Area */}
                                    <div className="relative flex-1 bg-[#1A2736]/30 rounded-xl border border-white/5 overflow-hidden min-h-[150px]">
                                        {/* Fake Line Chart SVG */}
                                        <svg className="absolute inset-0 w-full h-full px-2 pt-4 pb-2" viewBox="0 0 100 50" preserveAspectRatio="none">
                                            {/* Gradient Definition */}
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="#2FAE8F" stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor="#2FAE8F" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>

                                            {/* Grid Lines (Subtle) */}
                                            <line x1="0" y1="10" x2="100" y2="10" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                                            <line x1="0" y1="25" x2="100" y2="25" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                                            <line x1="0" y1="40" x2="100" y2="40" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />

                                            {/* Area under curve */}
                                            <path d="M0,45 L10,42 L20,44 L30,35 L40,38 L50,30 L60,32 L70,20 L80,22 L90,10 L100,12 V50 H0 Z" fill="url(#chartGradient)" />

                                            {/* Line */}
                                            <path d="M0,45 L10,42 L20,44 L30,35 L40,38 L50,30 L60,32 L70,20 L80,22 L90,10 L100,12" fill="none" stroke="#2FAE8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => navigate(session ? '/analys' : '/auth')}
                                            className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                        >
                                            Se fullständig rapport <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>



                    </div>
                </div>

                <div className="relative mx-auto w-32 h-4 bg-slate-700 rounded-b-xl shadow-lg -mt-1 z-0"></div>
                <div className="relative mx-auto w-40 h-2 bg-black/40 blur-xl mt-1"></div>
            </div>

            {/* Locked Analysis Modal - Outside Frame/Transform to work properly */}
            {activeModalHorse && (
                <LockedAnalysisModal
                    isOpen={!!activeModalHorse}
                    onClose={() => setActiveModalHorse(null)}
                    horseName={activeModalHorse}
                />
            )}
        </div>
    )
}

function Label({ label, alignment = 'left' }: { label: string, alignment?: 'left' | 'right' }) {
    return (
        <div className={`flex items-center gap-1.5 mb-1 ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
    )
}
