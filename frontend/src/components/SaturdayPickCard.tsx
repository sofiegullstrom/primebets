
import { TrendingUp, ArrowRight, Timer, Ruler, Trophy, Target, Coins } from 'lucide-react';
import { InfoLabel } from './InfoLabel';
import { CompactAnalysis } from './V2DesignPlaygroundHelpers';

interface SaturdayPickCardProps {
    saturdayPick: any;
    openBookmaker: (bookmaker: string | undefined) => void;
    openAnalysisModal: (pick: any) => void;
}

export const SaturdayPickCard = ({ saturdayPick, openBookmaker, openAnalysisModal }: SaturdayPickCardProps) => {
    if (!saturdayPick) return null;

    return (
        <article className="relative w-full rounded-3xl p-6 md:p-8 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl group flex flex-col h-full min-h-[450px] overflow-hidden">

            {/* Background Image - Blended */}
            <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-[60%] opacity-40 mix-blend-lighten">
                    <img
                        src="/saturday_horse.png"
                        alt="Running Horse"
                        className="w-full h-full object-cover object-center mask-image-gradient"
                        style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
                    />
                </div>
                {/* Navy Blue Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B3B5F]/30 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Odds & Value - Top Right Corner */}
                <div className="absolute top-0 right-0 flex flex-col items-end gap-2">
                    {saturdayPick.odds && (
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Odds</div>
                            <div className="text-3xl font-black text-white leading-none tracking-tight">{saturdayPick.odds}</div>
                        </div>
                    )}
                    {saturdayPick.value_percent && (
                        <div className="flex items-center gap-1.5 bg-[#4A90E2]/10 px-2 py-1 rounded-lg border border-[#4A90E2]/20 backdrop-blur-md">
                            <TrendingUp className="w-3 h-3 text-[#4A90E2]" />
                            <span className="text-xs font-bold text-[#4A90E2]">+{saturdayPick.value_percent < 1 ? Math.round(saturdayPick.value_percent * 100) : Math.round(saturdayPick.value_percent)}%</span>
                        </div>
                    )}
                </div>

                {/* 1. Header: Badge & Status */}
                <div className="mb-8 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#4A90E2] text-sm font-medium capitalize">
                            {new Date(saturdayPick.race_date).toLocaleDateString('sv-SE', { weekday: 'long' })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#4A90E2]/20 shadow-[0_0_15px_rgba(74,144,226,0.2)]">
                            LÖRDAGENS SPEL
                        </span>
                        <span className="text-gray-400 text-sm font-medium">
                            · Öppet spel
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8 flex-grow">

                    {/* 2. Left Column: Main Info */}
                    <div className="flex-1 min-w-0">

                        {/* Horse Name & Label */}
                        <div className="mb-8">
                            <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Häst</p>
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-3xl font-bold text-white tracking-tight leading-none drop-shadow-lg whitespace-nowrap">
                                    {saturdayPick.horse_name}
                                </h2>
                                {/* Badge: Formtopp - Static for now or based on data if available */}
                                <div className="relative group/badge flex items-center justify-center cursor-help">
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-lg backdrop-blur-md transition-all hover:bg-orange-500/20 hover:border-orange-500/30">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="text-[9px] font-bold tracking-wider">FORMTOPP</span>
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#0F1720] border border-white/10 rounded-lg text-xs text-gray-300 font-medium whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                                        Hästen har visat extra god form på slutet
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0F1720] border-b border-r border-white/10 rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm drop-shadow-md">
                                <span className="text-white">{saturdayPick.track_name}</span>
                                <span className="text-gray-500">•</span>
                                <span>Lopp {saturdayPick.race_number}</span>
                            </div>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-12 max-w-full mb-8 pt-6 border-t border-white/5">
                            {/* Row 1 */}
                            <div>
                                <InfoLabel label="STARTMETOD" tooltip="Startmetod" alignment="left" />
                                <div className="flex items-center gap-2 text-gray-200 mt-1">
                                    <Timer className="w-4 h-4 text-[#4A90E2]" />
                                    <span className="text-sm font-bold">{saturdayPick.start_method || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <InfoLabel label="DISTANS" tooltip="Distans" />
                                <div className="flex items-center gap-2 text-gray-200 mt-1">
                                    <Ruler className="w-4 h-4 text-[#4A90E2]" />
                                    <span className="text-sm font-bold">{saturdayPick.distance || '2140 m'}</span>
                                </div>
                            </div>

                            <div>
                                <InfoLabel label="SPELFORM" tooltip="Spelform" alignment="left" />
                                <div className="flex items-center gap-2 text-gray-200 mt-1">
                                    <Trophy className="w-4 h-4 text-[#4A90E2]" />
                                    <span className="text-sm font-bold">{saturdayPick.bet_type || 'Vinnare'}</span>
                                </div>
                            </div>

                            {/* Row 2 */}

                            <div>
                                <InfoLabel label="STARTSPÅR" tooltip="Startspår" alignment="left" />
                                <div className="flex items-center gap-2 text-gray-200 mt-1">
                                    <Target className="w-4 h-4 text-[#4A90E2]" />
                                    <span className="text-sm font-bold">Spår {saturdayPick.start_lane || '5'}</span>
                                </div>
                            </div>
                            {saturdayPick.stake && (
                                <div>
                                    <InfoLabel label="INSATSER" tooltip="Insats" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <Coins className="w-4 h-4 text-[#C9A86A]" />
                                        <span className="text-sm font-bold text-[#C9A86A]">{saturdayPick.stake}</span>
                                    </div>
                                </div>
                            )}

                            {saturdayPick.equipment && (
                                <div>
                                    <InfoLabel label="UTRUSTNING" tooltip="Utrustning" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <span className="text-[#F5A623] text-lg leading-none">⚡</span>
                                        </div>
                                        <div className="text-sm font-bold text-white leading-tight">
                                            {saturdayPick.equipment}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Analysis Text */}
                        <CompactAnalysis
                            title="ANALYS"
                            content={
                                <div className="relative">
                                    <p className="text-sm text-gray-300 leading-relaxed font-light line-clamp-2 md:line-clamp-none" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
                                        {saturdayPick.final_output_message || saturdayPick.adam_notes || "Analys saknas."}
                                    </p>
                                </div>
                            }
                        />
                    </div>

                    {/* Right Column: Key Stats & CTAs */}
                    <div className="flex flex-col items-end justify-between min-w-[200px] w-full md:w-auto gap-8 h-full relative z-20">

                        <div className="flex flex-col items-end gap-6">
                            {/* Odds moved to top right */}
                        </div>


                        <div className="flex flex-col w-full gap-3 mt-auto">
                            <button
                                onClick={() => openBookmaker(saturdayPick.bookmaker)}
                                className="w-full px-6 py-3 rounded-xl bg-[#4A90E2] hover:bg-[#357ABD] text-white shadow-[#4A90E2]/20 shadow-lg border border-[#4A90E2]/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] group"
                            >
                                <span className="font-bold text-sm">Spela med bästa odds</span>
                                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={() => openAnalysisModal(saturdayPick)}
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
