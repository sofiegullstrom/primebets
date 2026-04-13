
import { Timer, Ruler, Trophy, Target, Coins, TrendingUp, ArrowRight } from 'lucide-react';
import { InfoLabel } from './InfoLabel';

interface WeeklyScoutCardProps {
    weeklyScout: any;
    openBookmaker: (bookmaker: string | undefined) => void;
    openAnalysisModal: (pick: any) => void;
}

export const WeeklyScoutCard = ({ weeklyScout, openBookmaker, openAnalysisModal }: WeeklyScoutCardProps) => {
    if (!weeklyScout) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 pb-20">
            <div className="lg:col-span-2 relative w-full rounded-3xl p-8 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl group flex flex-col h-full min-h-[400px] overflow-hidden">

                {/* Background Image - Blended & Cinematic */}
                <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-[70%] opacity-40 mix-blend-lighten">
                        <img
                            src="/veckans_spaning_stadium.png"
                            alt="Stadium Night Race"
                            className="w-full h-full object-cover object-center mask-image-gradient"
                            style={{ maskImage: 'linear-gradient(to right, transparent, black 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 100%)' }}
                        />
                    </div>
                    {/* Navy Blue Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B3B5F]/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                </div>

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col h-full">

                    {/* 1. Header: Badge & Status */}
                    <div className="mb-8 flex items-center gap-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#4A90E2]/20 shadow-[0_0_15px_rgba(74,144,226,0.2)]">
                            VECKANS SPANING
                        </span>
                        <span className="text-gray-400 text-sm font-medium">
                            · Inför {new Date(weeklyScout.race_date).toLocaleDateString('sv-SE', { weekday: 'long' })}
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 flex-grow">

                        {/* 2. Left Column: Main Info */}
                        <div className="flex-1 min-w-0">

                            {/* Horse Name & Label */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-4xl font-black text-white tracking-tight leading-none drop-shadow-xl whitespace-nowrap">
                                        {weeklyScout.horse_name}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2 text-sm drop-shadow-md font-medium">
                                    <span className="text-white">{weeklyScout.track_name}</span>
                                    <span className="text-gray-600 px-1">•</span>
                                    <span className="text-white capitalize">{new Date(weeklyScout.race_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })}</span>
                                </div>
                            </div>

                            {/* Facts Section - Grid Layout */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-8 max-w-full mb-8 border-t border-white/5 pt-6">

                                {/* Start Method */}
                                {weeklyScout.start_method && (
                                    <div>
                                        <InfoLabel label="Startmetod" tooltip="Anger startmetoden för loppet." alignment="left" />
                                        <div className="flex items-center gap-2 text-gray-200 mt-1">
                                            <Timer className="w-4 h-4 text-[#4A90E2]" />
                                            <span className="text-sm font-bold">{weeklyScout.start_method}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Distance */}
                                {weeklyScout.distance && (
                                    <div>
                                        <InfoLabel label="Distans" tooltip="Loppets totala distans." />
                                        <div className="flex items-center gap-2 text-gray-200 mt-1">
                                            <Ruler className="w-4 h-4 text-[#4A90E2]" />
                                            <span className="text-sm font-bold">{weeklyScout.distance}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Game Type */}
                                {weeklyScout.bet_type && (
                                    <div>
                                        <InfoLabel label="Spelform" tooltip="Typ av spel." alignment="right" />
                                        <div className="flex items-center gap-2 text-gray-200 mt-1">
                                            <Trophy className="w-4 h-4 text-[#4A90E2]" />
                                            <span className="text-sm font-bold">{weeklyScout.bet_type}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Spår */}
                                {weeklyScout.start_lane && (
                                    <div>
                                        <InfoLabel label="Startspår" tooltip="Hästens startposition." alignment="left" />
                                        <div className="flex items-center gap-2 text-gray-200 mt-1">
                                            <Target className="w-4 h-4 text-[#4A90E2]" />
                                            <span className="text-sm font-bold">Spår {weeklyScout.start_lane}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Insats */}
                                {weeklyScout.stake && (
                                    <div>
                                        <InfoLabel label="Insats" tooltip="Rekommenderad insats." />
                                        <div className="flex items-center gap-2 mt-1">
                                            <Coins className="w-4 h-4 text-[#C9A86A]" />
                                            <span className="text-sm font-bold text-[#C9A86A]">{weeklyScout.stake}</span>
                                        </div>
                                    </div>
                                )}
                                {/* Equipment */}
                                {weeklyScout.equipment && (
                                    <div>
                                        <InfoLabel label="Utrustning" tooltip="Hästens utrustning." />
                                        <div className="flex items-center gap-2 mt-1" title={weeklyScout.equipment}>
                                            <span className="w-4 h-4 text-orange-400">⚡</span>
                                            <span className="text-sm font-bold text-orange-400 truncate max-w-[120px]">{weeklyScout.equipment}</span>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Analysis Text Section */}
                            <div className="max-w-xl pt-6 border-t border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Analys</p>
                                <div className="relative">
                                    <p className="text-base text-gray-300 leading-relaxed font-light">
                                        {weeklyScout.final_output_message || weeklyScout.adam_notes}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Right Column: Buttons & Key Stats */}
                        <div className="flex flex-col items-end justify-between min-w-[200px] w-full md:w-auto gap-8 h-full relative z-20">

                            <div className="flex flex-col items-end gap-6">
                                {/* Odds Big */}
                                {weeklyScout.odds && (
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                            ODDS <span className="text-gray-600">ⓘ</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-5xl font-black text-white tracking-tighter leading-none">{weeklyScout.odds}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Value Badge */}
                                {weeklyScout.value_percent && (
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                            SPELVÄRDE <span className="text-gray-600">ⓘ</span>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A90E2]/10 border border-[#4A90E2]/20 backdrop-blur-md shadow-lg">
                                            <TrendingUp className="w-3.5 h-3.5 text-[#4A90E2]" />
                                            <span className="text-lg font-black text-[#4A90E2] tracking-tight">+{weeklyScout.value_percent && (weeklyScout.value_percent < 1 ? Math.round(weeklyScout.value_percent * 100) : Math.round(weeklyScout.value_percent))}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col w-full gap-3 mt-auto">
                                <button
                                    onClick={() => openBookmaker(weeklyScout.bookmaker)}
                                    className="w-full px-6 py-3 rounded-xl bg-[#4A90E2] hover:bg-[#357ABD] text-white shadow-lg border border-[#4A90E2]/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] group"
                                >
                                    <span className="font-bold text-sm">Spela med bästa odds</span>
                                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                                </button>

                                <button
                                    onClick={() => openAnalysisModal(weeklyScout)}
                                    className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all group backdrop-blur-sm"
                                >
                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">Läs hela spaningen</span>
                                    <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
