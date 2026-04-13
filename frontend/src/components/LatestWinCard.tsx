
import { Flame, Trophy, ArrowRight } from 'lucide-react';

interface LatestWinCardProps {
    latestWin: any;
    openAnalysisModal: (pick: any, closed: boolean) => void;
}

export const LatestWinCard = ({ latestWin, openAnalysisModal }: LatestWinCardProps) => {
    if (!latestWin) return null;

    return (
        <article className="relative w-full rounded-3xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl flex flex-col min-h-[450px]">
            {/* Header */}
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

            {/* Body */}
            <div className="flex flex-col flex-grow relative z-10">

                {/* Period/Result Row */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Period</div>
                        <div className="text-lg font-bold text-white capitalize">{latestWin.periodLabel}</div>
                    </div>
                    <span className="px-3 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20 uppercase tracking-wide">VINST</span>
                </div>

                {/* ROI/Odds Row */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ROI</div>
                        <div className="text-4xl font-black text-[#2FAE8F] tracking-tight">{latestWin.roi}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ODDS</div>
                        <div className="text-4xl font-black text-white tracking-tight">{latestWin.odds}</div>
                    </div>
                </div>

                {/* Inner Card (Horse) */}
                <div className="bg-[#1A2736]/50 rounded-xl p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 bg-[#2FAE8F]/5 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex items-start gap-4 w-full relative z-10">
                        <div className="w-14 h-14 rounded-full bg-[#4A90E2]/10 border border-[#4A90E2]/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4A90E2]/5 mt-1">
                            <Trophy className="w-6 h-6 text-[#4A90E2]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">HÄST</div>
                            <h3 className="text-2xl font-black text-white truncate drop-shadow-lg mb-4">{latestWin.horse_name}</h3>

                            {/* Nested Grid for Details */}
                            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 border-t border-white/5 pt-4">
                                <div>
                                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">PLATS</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        <span className="text-sm font-bold text-gray-200">{latestWin.track_name}</span>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-white/5 hidden sm:block"></div>
                                <div>
                                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">SPELFORM</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#2FAE8F] ring-1 ring-[#2FAE8F]/30"></div>
                                        <span className="text-sm font-bold text-gray-200">{latestWin.bet_type || 'Vinnare'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Button */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <button
                    onClick={() => openAnalysisModal(latestWin, true)}
                    className="w-full py-3 rounded-lg bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 text-[#2FAE8F] border border-[#2FAE8F]/20 font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                >
                    Läs fullständig analys
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </article>
    );
};
