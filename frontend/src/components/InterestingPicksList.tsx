import { ArrowRight, Trophy, Timer, Target, Ruler, Coins } from 'lucide-react';
import { Pick } from '../types';

interface InterestingPicksListProps {
    picks: Pick[];
    openBookmaker: (url: string | undefined) => void;
    openAnalysisModal: (pick: Pick) => void;
}

export function InterestingPicksList({ picks, openBookmaker, openAnalysisModal }: InterestingPicksListProps) {
    if (!picks || picks.length === 0) return null;

    return (
        <div className="flex flex-col gap-6 w-full">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1 h-6 bg-[#2FAE8F] rounded-full shadow-[0_0_10px_#2FAE8F]"></div>
                Intressanta spel för dagen
            </h3>
            <div className="space-y-4">
                {picks.map((pick, i) => {
                    const hasResult = pick.net_result !== null && pick.net_result !== undefined;
                    const net = hasResult ? Number(pick.net_result) : 0;
                    const isWin = hasResult && (net > 0 || (pick.status && ['won', 'vinst', 'win'].includes(pick.status.toLowerCase())));

                    return (
                        <div key={i} className={`relative w-full rounded-2xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 border-l-4 ${isWin ? 'border-l-green-400' : hasResult ? 'border-l-red-400' : 'border-l-[#2FAE8F]'} shadow-lg hover:bg-[#162230]/50 transition-all group`}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                    <div className="min-w-[180px]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-2xl font-bold text-white">{pick.horse_name}</h3>
                                            {hasResult && isWin && (
                                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase border border-green-500/20">VINST</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>{pick.track_name}</span>
                                            <span>•</span>
                                            <span>Lopp {pick.race_number}</span>
                                        </div>
                                    </div>

                                    {/* Odds/Netto logic moved here for better compact layout */}
                                    {hasResult ? (
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">Netto</span>
                                            <div className={`text-2xl font-bold leading-none ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                                {net > 0 ? '+' : ''}{net}
                                            </div>
                                        </div>
                                    ) : (
                                        pick.odds && (
                                            <div className="text-right">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Odds</span>
                                                <div className="text-2xl font-bold text-white leading-none">{pick.odds}</div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Stats Grid - Adjusted to be responsive */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {pick.bet_type && (
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Spelform</span>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-200">
                                                <Trophy className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                                {pick.bet_type}
                                            </div>
                                        </div>
                                    )}

                                    {pick.start_method && (
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Startmetod</span>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-200">
                                                <Timer className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                                {pick.start_method}
                                            </div>
                                        </div>
                                    )}

                                    {pick.start_lane && (
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Spår</span>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-200">
                                                <Target className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                                {pick.start_lane}
                                            </div>
                                        </div>
                                    )}

                                    {pick.distance && (
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Distans</span>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-200">
                                                <Ruler className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                                {pick.distance}
                                            </div>
                                        </div>
                                    )}

                                    {pick.stake && (
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Insats</span>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-[#C9A86A]">
                                                <Coins className="w-3.5 h-3.5" />
                                                {pick.stake}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                                    {hasResult ? (
                                        <button
                                            disabled
                                            className="w-full flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-500 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                                        >
                                            Avslutat spel
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openBookmaker(pick.bookmaker)}
                                            className="w-full flex-1 px-4 py-3 rounded-xl bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 border border-[#2FAE8F]/20 text-[#2FAE8F] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                                        >
                                            Spela med bästa odds
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openAnalysisModal(pick)}
                                        className="w-full flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-all group"
                                    >
                                        Läs full analys
                                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
