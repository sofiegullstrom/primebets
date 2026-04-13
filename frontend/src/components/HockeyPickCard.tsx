
import { TrendingUp, ArrowRight, Calendar, Trophy, Target, Coins, Activity } from 'lucide-react';
import { InfoLabel } from './InfoLabel';
import { CompactAnalysis } from './V2DesignPlaygroundHelpers';

interface HockeyPickCardProps {
    pick: any;
    openBookmaker: (bookmaker: string | undefined) => void;
    openAnalysisModal: (pick: any) => void;
}

export const HockeyPickCard = ({ pick, openBookmaker, openAnalysisModal }: HockeyPickCardProps) => {
    if (!pick) return null;

    const isDaily = pick.category === 'daily';

    return (
        <article className="relative w-full rounded-3xl p-6 md:p-8 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl group flex flex-col h-full min-h-[450px] overflow-hidden">

            {/* Background Image - Blended */}
            <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-[60%] opacity-20 mix-blend-screen">
                    {/* Placeholder for Hockey Background or efficient gradient */}
                    <div className="w-full h-full bg-gradient-to-l from-cyan-500/30 to-transparent" />
                </div>
                {/* Ice Blue Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Odds & Value - Top Right Corner */}
                <div className="absolute top-0 right-0 flex flex-col items-end gap-2">
                    {pick.odds && (
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Odds</div>
                            <div className="text-3xl font-black text-white leading-none tracking-tight">{pick.odds}</div>
                        </div>
                    )}
                    {pick.value_percentage && (
                        <div className="flex items-center gap-1.5 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20 backdrop-blur-md">
                            <TrendingUp className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs font-bold text-cyan-400">+{pick.value_percentage < 1 ? Math.round(pick.value_percentage * 100) : Math.round(pick.value_percentage)}%</span>
                        </div>
                    )}
                </div>

                {/* 1. Header: Badge & Status */}
                <div className="mb-8 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-cyan-400 text-sm font-medium capitalize">
                            {new Date(pick.game_date).toLocaleDateString('sv-SE', { weekday: 'long' })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            {isDaily ? 'DAGENS HOCKEY' : 'KOMMANDE HOCKEY'}
                        </span>
                        <span className="text-gray-400 text-sm font-medium">
                            · {pick.league}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8 flex-grow">

                    {/* 2. Left Column: Main Info */}
                    <div className="flex-1 min-w-0">

                        {/* Match Name */}
                        <div className="mb-8">
                            <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Match</p>
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-lg break-words">
                                    {pick.match_name}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 text-sm drop-shadow-md text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{pick.game_date}</span>
                            </div>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8 max-w-full mb-8 pt-6 border-t border-white/5">
                            {/* Row 1 */}
                            <div>
                                <InfoLabel label="LIGA" tooltip="Liga" alignment="left" />
                                <div className="flex items-center gap-2 text-gray-200 mt-1">
                                    <Trophy className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm font-bold">{pick.league}</span>
                                </div>
                            </div>
                            <div>
                                <InfoLabel label="SPELVAL" tooltip="Vårt spel" />
                                <div className="flex items-center gap-2 text-gray-200 mt-1">
                                    <Target className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm font-bold">{pick.bet_selection}</span>
                                </div>
                            </div>

                            {/* Row 2 */}
                            {pick.expected_odds && (
                                <div>
                                    <InfoLabel label="FÖRVÄNTAT ODDS" tooltip="Vår värdering" alignment="left" />
                                    <div className="flex items-center gap-2 text-gray-200 mt-1">
                                        <Activity className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm font-bold">{pick.expected_odds}</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <InfoLabel label="INSATS" tooltip="Rekommenderad insats" />
                                <div className="flex items-center gap-2 mt-1">
                                    <Coins className="w-4 h-4 text-[#C9A86A]" />
                                    <span className="text-sm font-bold text-[#C9A86A]">Flat</span>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Text */}
                        <CompactAnalysis
                            title="ANALYS"
                            content={
                                <div className="relative">
                                    <p className="text-sm text-gray-300 leading-relaxed font-light line-clamp-2 md:line-clamp-none" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
                                        {pick.motivation || "Analys saknas."}
                                    </p>
                                </div>
                            }
                        />
                    </div>

                    {/* Right Column: CTAs */}
                    <div className="flex flex-col items-end justify-between min-w-[200px] w-full md:w-auto gap-8 h-full relative z-20">
                        {/* Empty Top Spacer */}
                        <div></div>

                        <div className="flex flex-col w-full gap-3 mt-auto">
                            <button
                                onClick={() => openBookmaker(undefined)}
                                className="w-full px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] group"
                            >
                                <span className="font-bold text-sm">Rygga spelet</span>
                                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={() => openAnalysisModal(pick)}
                                className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all group backdrop-blur-sm"
                            >
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Läs fullständig analys</span>
                                <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
