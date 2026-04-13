import { ArrowRight, X, Award, BadgeCheck } from 'lucide-react';
import { openBookmaker } from '../lib/bookmakerUtils';

interface ModalData {
    horseName: string;
    tags: string[];
    odds: string;
    units: string;
    value: string;
    type: string;
    motivationBold: string;
    motivationBody: string;
    stats: { label: string; value: string }[];
    interview: string;
    bookmaker?: string; // Added bookmaker field
    horseDetails?: any; // New field for Horse Profile
    isFinished?: boolean; // New field to check if game is finished
    isVoid?: boolean;
    driver?: string;
}

interface PremiumAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ModalData;
    isClosed?: boolean;
}

export const PremiumAnalysisModal = ({ isOpen, onClose, data, isClosed = false }: PremiumAnalysisModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Container for Side-by-Side Layout */}
            <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start justify-center max-w-[95vw] lg:max-w-6xl w-full">

                {/* Close Button Desktop - Always visible */}
                <button
                    onClick={onClose}
                    className="hidden lg:flex p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all absolute -top-12 -right-0 border border-white/10 z-50 shadow-lg backdrop-blur-md"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* MAIN MODAL CONTENT */}
                <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 
                    bg-[#131c26]/80 
                    backdrop-blur-3xl 
                    border border-white/20 
                    shadow-[0_0_60px_rgba(0,0,0,0.5)] 
                    ring-1 ring-white/10
                    flex-1">

                    {/* Header with Depth Gradient */}
                    <div className="p-5 md:p-8 pb-6 border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent relative z-10">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-3 tracking-tight drop-shadow-lg flex items-center gap-3">
                                    <span className="opacity-50 font-light text-xl">Full Analys</span>
                                    <span className="w-1 h-8 bg-[#2FAE8F] rounded-full"></span>
                                    {data.horseName}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.tags && data.tags.length > 0 ? data.tags.map((tag: string, i: number) => (
                                        <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
                                            <Award className="w-3 h-3 text-[#C9A86A]" />
                                            <span className="text-[10px] font-bold text-[#E5CCA0] uppercase tracking-wider">{tag}</span>
                                        </div>
                                    )) : (
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
                                            <Award className="w-3 h-3 text-[#C9A86A]" />
                                            <span className="text-[10px] font-bold text-[#E5CCA0] uppercase tracking-wider">Rekommendation</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all absolute top-6 right-6 border border-white/10 lg:hidden"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar relative z-0">
                        <div className="space-y-8">
                            {/* Quick Facts Section */}
                            <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-black/20 border border-white/10 shadow-inner">
                                {data.odds && data.odds !== '-' && (
                                    <div className="flex flex-col p-2 min-w-[100px] flex-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Odds</span>
                                        <span className={`text-2xl md:text-3xl font-bold text-[#2FAE8F] tracking-tighter drop-shadow-md ${data.isVoid ? 'line-through opacity-50' : ''}`}>{data.odds}</span>
                                    </div>
                                )}
                                {data.units && data.units !== '-' && (
                                    <div className="flex flex-col justify-center p-2 min-w-[100px] flex-1 relative md:border-l border-white/10 md:pl-4">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Insats</span>
                                        <span className={`text-sm font-medium text-gray-200 ${data.isVoid ? 'line-through opacity-50' : ''}`}>{data.units}</span>
                                    </div>
                                )}
                                {data.value && data.value !== '-' && (
                                    <div className="flex flex-col justify-center p-2 min-w-[100px] flex-1 relative md:border-l border-white/10 md:pl-4">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Spelvärde</span>
                                        <span className={`text-sm font-medium text-gray-200 ${data.isVoid ? 'line-through opacity-50' : ''}`}>{data.value}</span>
                                    </div>
                                )}
                                {data.type && data.type !== '-' && (
                                    <div className="flex flex-col justify-center p-2 min-w-[100px] flex-1 relative md:border-l border-white/10 md:pl-4">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Spelform</span>
                                        <span className={`text-sm font-medium text-gray-200 ${data.isVoid ? 'line-through opacity-50' : ''}`}>{data.type}</span>
                                    </div>
                                )}
                            </div>

                            {/* Motivering */}
                            <section>
                                <h3 className="text-xs font-bold text-[#4A90E2] uppercase tracking-widest mb-3 flex items-center gap-2">
                                    Motivering
                                    <span className="h-px flex-1 bg-gradient-to-r from-[#4A90E2]/30 to-transparent"></span>
                                </h3>
                                <div className="text-sm text-gray-200 leading-relaxed font-light">
                                    <p>
                                        <strong className="text-white block mb-3 font-bold text-base tracking-tight">{data.motivationBold}</strong>
                                        {data.motivationBody}
                                    </p>
                                </div>
                            </section>

                            {/* Statistik */}
                            {data.stats && (
                                <section>
                                    <h3 className="text-xs font-bold text-[#2FAE8F] uppercase tracking-widest mb-3 flex items-center gap-2">
                                        Statistik
                                        <span className="h-px flex-1 bg-gradient-to-r from-[#2FAE8F]/30 to-transparent"></span>
                                    </h3>
                                    <div className="grid gap-2">
                                        {data.stats.map((stat: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2FAE8F] shrink-0 shadow-[0_0_8px_#2FAE8F]"></div>
                                                <div className="text-gray-300">
                                                    <span className="text-gray-500 font-bold mr-2 uppercase text-[10px] tracking-wide">{stat.label}:</span>
                                                    {stat.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Intervju */}
                            {data.interview && (
                                <section>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Intervju / Information</h3>
                                    <div className="p-5 rounded-xl bg-gradient-to-r from-[#2FAE8F]/5 to-transparent border-l-2 border-[#2FAE8F]">
                                        <p className="text-sm text-gray-300 italic">
                                            "{data.interview}"
                                        </p>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Sticky Bottom Actions */}
                    {!isClosed && !data.isFinished && (
                        <div className="p-6 border-t border-white/10 bg-[#131c26]/90 backdrop-blur-xl z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest">
                                    <BadgeCheck className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                    <span className="font-bold">Rekommenderat spel från PrimeBets</span>
                                </div>
                                <button
                                    onClick={() => openBookmaker(data.bookmaker)}
                                    className="w-full py-4 rounded-xl bg-[#2FAE8F] hover:bg-[#258f75] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(47,174,143,0.3)] hover:shadow-[0_0_40px_rgba(47,174,143,0.5)] flex items-center justify-center gap-2 active:scale-[0.99] border-t border-white/20"
                                >
                                    Spela med bästa odds
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                    {data.isFinished && (
                        <div className="p-6 border-t border-white/10 bg-[#131c26]/90 backdrop-blur-xl z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 tracking-wider">
                                <span className="font-bold">Spelet är avslutat</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* HORSE PROFILE SIDE CARD */}
                {data.horseDetails && (
                    <div className="relative w-full lg:w-[360px] shrink-0 animate-in slide-in-from-right-8 duration-500 lg:sticky lg:top-4 mt-4 lg:mt-0">
                        {/* Desktop Close Button Removed from Here */}

                        <div className="relative w-full rounded-2xl overflow-hidden bg-[#131c26]/80 backdrop-blur-3xl border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.5)] p-6 flex flex-col gap-6 ring-1 ring-white/10 group">

                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay transition-opacity duration-700 pointer-events-none group-hover:opacity-30"
                                style={{ backgroundImage: 'url(/horse-profile-bg.jpg)' }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131c26]/50 to-[#131c26] pointer-events-none"></div>

                            {/* Header / Name */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay transition-opacity duration-700 pointer-events-none group-hover:opacity-30"
                                style={{ backgroundImage: 'url(/horse-profile-bg.jpg)' }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131c26]/50 to-[#131c26] pointer-events-none"></div>

                            {/* Header / Name */}
                            <div className="relative z-10 border-b border-white/10 pb-6">
                                <h3 className="text-xl font-bold text-white mb-1">Hästprofil</h3>
                                <div className="flex items-start gap-4 mt-4">
                                    {/* Placeholder Horse Image/Icon */}
                                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#2FAE8F]/20 to-[#1A2736] border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                                        <BadgeCheck className="w-8 h-8 text-[#2FAE8F]" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white leading-tight">{data.horseName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            {data.horseDetails.birth_year && (
                                                <span className="text-amber-500 text-sm font-medium flex items-center gap-1">
                                                    {Number(data.horseDetails.birth_year) < 100
                                                        ? new Date().getFullYear() - Number(data.horseDetails.birth_year)
                                                        : data.horseDetails.birth_year}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info List */}
                            <div className="relative z-10 space-y-3 py-2">
                                {data.horseDetails.birth_year && (
                                    <div className="flex items-center gap-3 text-gray-200">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider w-14">Född</span>
                                        <span className="font-medium">
                                            {Number(data.horseDetails.birth_year) < 100
                                                ? new Date().getFullYear() - Number(data.horseDetails.birth_year)
                                                : data.horseDetails.birth_year}
                                        </span>
                                    </div>
                                )}
                                {data.horseDetails.sex && (
                                    <div className="flex items-center gap-3 text-gray-200">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider w-14">Kön</span>
                                        <span className="font-medium">{data.horseDetails.sex}</span>
                                    </div>
                                )}
                                {data.horseDetails.default_driver && (
                                    <div className="flex items-center gap-3 text-gray-200">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider w-14">Kusk</span>
                                        <span className="font-medium">{data.horseDetails.default_driver}</span>
                                    </div>
                                )}
                                {data.horseDetails.trainer && (
                                    <div className="flex items-center gap-3 text-gray-200">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider w-14">Tränare</span>
                                        <span className="font-medium">{data.horseDetails.trainer}</span>
                                    </div>
                                )}
                            </div>

                            <div className="relative z-10 w-full h-px bg-white/10"></div>

                            {/* Styrkor */}
                            <div className="relative z-10">
                                <h5 className="text-sm font-bold text-white mb-3 shadow-black drop-shadow-sm">Styrkor</h5>
                                <div className="flex flex-col gap-2">
                                    {data.horseDetails.strength_tags?.split(',').map((tag: string, i: number) => (
                                        <div key={i} className="px-3 py-2 rounded-lg bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 text-[#2FAE8F] text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                                            <span className="text-lg leading-none">+</span>
                                            {tag.trim()}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Svagheter */}
                            <div className="relative z-10">
                                <h5 className="text-sm font-bold text-white mb-3 shadow-black drop-shadow-sm">Svagheter</h5>
                                <div className="flex flex-col gap-2">
                                    {data.horseDetails.weakness_tags?.split(',').map((tag: string, i: number) => (
                                        <div key={i} className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                                            <span className="text-lg leading-none">-</span>
                                            {tag.trim()}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Note / Analysis */}
                            {data.horseDetails.notes_short && (
                                <div className="relative z-10 pt-4 mt-auto">
                                    <p className="text-sm text-gray-400 italic leading-relaxed">
                                        {data.horseDetails.notes_short}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
