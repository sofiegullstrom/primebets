export function DashboardPreview() {
    return (
        <div className="relative w-full max-w-sm mx-auto">
            {/* Example Label */}
            <div className="text-center mb-4">
                <span className="bg-slate-800/80 border border-slate-700 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-xl">
                    Exempel Dashboard
                </span>
            </div>

            {/* Phone Frame */}
            <div className="relative bg-slate-950 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
                {/* Screen */}
                <div className="bg-slate-900 rounded-[2rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-slate-900 px-6 py-3 flex justify-between items-center text-xs text-slate-400">
                        <span>9:41</span>
                        <div className="flex gap-1">
                            <div className="w-4 h-3 border border-slate-400 rounded-sm"></div>
                            <div className="w-4 h-3 border border-slate-400 rounded-sm"></div>
                            <div className="w-6 h-3 bg-slate-400 rounded-sm"></div>
                        </div>
                    </div>

                    {/* Dashboard Content - Scaled Down */}
                    <div className="p-4 space-y-3 text-[0.65rem]">

                        {/* PrimePick Card */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 rounded-xl p-3">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="bg-emerald-500 text-slate-900 px-2 py-0.5 rounded-full text-[0.5rem] font-bold inline-block mb-1">
                                        DAGENS PRIMEPICK
                                    </div>
                                    <h3 className="text-white font-bold text-sm">Victory Tilly</h3>
                                    <p className="text-slate-400 text-[0.55rem]">Solvalla • Lopp 4</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[0.5rem] text-slate-400">ODDS</div>
                                    <div className="text-emerald-400 font-bold text-lg">2.45</div>
                                </div>
                            </div>

                            {/* Race Info Grid */}
                            <div className="grid grid-cols-2 gap-1 mb-2 bg-slate-800/30 p-1.5 rounded-lg border border-slate-700/30">
                                <div>
                                    <div className="text-[0.45rem] text-slate-500 font-bold uppercase tracking-wider">Start</div>
                                    <div className="text-slate-300 text-[0.55rem] font-medium">🏁 Auto</div>
                                </div>
                                <div>
                                    <div className="text-[0.45rem] text-slate-500 font-bold uppercase tracking-wider">Spår</div>
                                    <div className="text-slate-300 text-[0.55rem] font-medium">📍 Spår 4</div>
                                </div>
                                <div>
                                    <div className="text-[0.45rem] text-slate-500 font-bold uppercase tracking-wider">Distans</div>
                                    <div className="text-slate-300 text-[0.55rem] font-medium">📏 2140m</div>
                                </div>
                                <div>
                                    <div className="text-[0.45rem] text-slate-500 font-bold uppercase tracking-wider">Spelform</div>
                                    <div className="text-emerald-400 text-[0.55rem] font-bold">🎯 Vinnare</div>
                                </div>
                            </div>


                            <div className="bg-slate-900/50 rounded p-2 mt-2">
                                <div className="text-slate-400 text-[0.5rem] mb-1">AI ANALYS</div>
                                <div className="text-slate-300 text-[0.55rem] leading-tight">
                                    Stark form senaste veckorna. Kommer ut barfota runt om idag...
                                </div>
                            </div>
                            <button className="w-full bg-emerald-500 text-slate-900 py-2 rounded-lg font-bold text-[0.6rem] mt-2">
                                SPELA MED BÄST ODDS
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {/* ROI Card */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2">
                                <div className="text-emerald-400 font-bold text-[0.5rem] mb-1">Heta</div>
                                <div className="text-white font-bold text-sm">+145.5%</div>
                                <div className="text-slate-500 text-[0.45rem]">Veckan</div>
                            </div>

                            {/* Saturday Card */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 relative">
                                <div className="text-blue-400 font-bold text-[0.5rem] mb-1">LÖRDAG</div>
                                <div className="text-white font-bold text-[0.55rem]">V75 Tips</div>
                                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <div className="text-xs text-slate-400">🔒</div>
                                </div>
                            </div>

                            {/* Weekly Card */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 relative">
                                <div className="text-emerald-400 font-bold text-[0.5rem] mb-1">VECKAN</div>
                                <div className="text-white font-bold text-[0.55rem]">Spaning</div>
                                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <div className="text-xs text-slate-400">🔒</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blur Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900/90 rounded-[2.5rem] flex items-end justify-center pb-12">
                <div className="text-center px-6">
                    <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 mb-4">
                        <h3 className="text-white font-bold text-lg mb-2">Lås upp full tillgång</h3>
                        <p className="text-slate-300 text-sm mb-4">
                            Se alla analyser, statistik och dagliga tips
                        </p>
                        <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors">
                            Kom igång gratis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
