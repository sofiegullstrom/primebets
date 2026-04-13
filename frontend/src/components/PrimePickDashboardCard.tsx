
import { AlertTriangle, Coins, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import { InfoLabel } from './InfoLabel';
import { CompactAnalysis, CountdownTimer } from './V2DesignPlaygroundHelpers';
import { getGameStatus } from '../lib/gameStatus';

interface PrimePickDashboardCardProps {
    prioritizedCalendarEvent: any;
    primePick: any;
    hasCelebrated: boolean;
    primePickCardRef: React.RefObject<HTMLElement>;
    openBookmaker: (bookmaker: string | undefined) => void;
    openAnalysisModal: (pick: any) => void;
    setIsSubscribeOpen: (isOpen: boolean) => void;
}

export const PrimePickDashboardCard = ({
    prioritizedCalendarEvent,
    primePick,
    hasCelebrated,
    primePickCardRef,
    openBookmaker,
    openAnalysisModal,
    setIsSubscribeOpen
}: PrimePickDashboardCardProps) => {

    if (prioritizedCalendarEvent) {
        return (
            <article className="relative w-full rounded-3xl p-8 backdrop-blur-xl bg-gradient-to-br from-amber-500/10 via-[#162230]/60 to-[#162230]/40 border border-amber-500/20 shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)] flex flex-col h-full min-h-[450px] overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-opacity duration-700 opacity-70 group-hover:opacity-100"></div>

                {/* Header */}
                <div className="relative z-10 mb-8 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-400 text-sm font-bold tracking-wide uppercase">Viktigt meddelande</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-amber-500/20 shadow-sm">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Information
                        </span>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center gap-8 h-full flex-grow text-center max-w-xl mx-auto px-4">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-500">
                        <AlertTriangle className="w-12 h-12 text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]" />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1] drop-shadow-lg">
                            {prioritizedCalendarEvent.title}
                        </h2>

                        <div className="space-y-4">
                            {prioritizedCalendarEvent.description && (
                                <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed">
                                    {prioritizedCalendarEvent.description}
                                </p>
                            )}

                            {prioritizedCalendarEvent.detailed_description && (
                                <div className="mt-4 p-5 rounded-xl bg-white/5 border border-white/10 text-left relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50"></div>
                                    <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                                        {prioritizedCalendarEvent.detailed_description}
                                    </p>
                                </div>
                            )}

                            {prioritizedCalendarEvent.motivation && (
                                <div className="relative mt-6 p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm">
                                    <div className="absolute top-0 left-0 -mt-3 -ml-2 text-4xl text-amber-500/20 font-serif">"</div>
                                    <p className="text-gray-300 text-base italic leading-relaxed relative z-10">
                                        {prioritizedCalendarEvent.motivation}
                                    </p>
                                    <div className="absolute bottom-0 right-0 -mb-3 -mr-2 text-4xl text-amber-500/20 font-serif transform rotate-180">"</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    if (primePick) {
        return (
            <article
                ref={primePickCardRef}
                data-version="v3-compact"
                className={`relative w-full rounded-3xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl flex flex-col min-h-[420px] overflow-hidden transition-all duration-500 ${hasCelebrated ? 'animate-pulse-once ring-2 ring-[#2FAE8F]/50 shadow-[0_0_50px_rgba(47,174,143,0.3)]' : ''}`}
            >
                {/* Odds & Value - Top Right Corner - MATCHING SATURDAY CARD */}
                <div className="absolute top-0 right-0 flex flex-col items-end gap-2 p-6 z-20">
                    {(!primePick.net_result && primePick.odds && primePick.odds !== '-') && (
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Odds</div>
                            <div className="text-3xl font-black text-white leading-none tracking-tight">{primePick.odds}</div>
                        </div>
                    )}
                    {!primePick.net_result && primePick.value_percent && primePick.value_percent > 0 && (
                        <div className="flex items-center gap-1.5 bg-[#2FAE8F]/10 px-2 py-1 rounded-lg border border-[#2FAE8F]/20 backdrop-blur-md">
                            <TrendingUp className="w-3 h-3 text-[#2FAE8F]" />
                            <span className="text-xs font-bold text-[#2FAE8F]">+{primePick.value_percent < 1 ? Math.round(primePick.value_percent * 100) : Math.round(primePick.value_percent)}%</span>
                        </div>
                    )}
                </div>

                {/* Header */}
                <div className="mb-6 flex flex-col gap-2 relative z-10 w-full pr-24"> {/* Added padding right to avoid overlap with odds */}
                    <div className="flex items-center gap-2 mb-1">
                        {(primePick.net_result !== null && primePick.net_result !== undefined) ? (
                            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Avslutat spel</span>
                        ) : (
                            <span className="text-[#2FAE8F] text-sm font-medium">Idag</span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#2FAE8F]/10 text-[#2FAE8F] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#2FAE8F]/10">Dagens PrimePick</span>
                        {(() => {
                            const hasResult = primePick.net_result !== null && primePick.net_result !== undefined;
                            if (hasResult) {
                                const status = primePick.status?.toLowerCase();
                                const isWin = Number(primePick.net_result) > 0 || (status && ['won', 'vinst', 'win'].includes(status));
                                const isVoid = status && ['void', 'struken', 'refunded'].includes(status);

                                if (isVoid) {
                                    return (
                                        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border bg-gray-500/10 text-gray-400 border-gray-500/20">
                                            STRUKEN
                                        </span>
                                    );
                                }

                                return (
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border ${isWin ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {isWin ? 'VINST' : 'FÖRLUST'}
                                    </span>
                                );
                            }
                            const status = getGameStatus(primePick.race_date);
                            return (
                                <span className={`text-sm font-medium ${status.color}`}>· {status.label}</span>
                            )
                        })()}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-4 flex-grow">
                    {/* Left Info */}
                    <div className="flex-1 min-w-0 w-full">
                        <div className="mb-8">
                            <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Häst</p>
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-3xl md:text-3xl font-bold text-white tracking-tight leading-none whitespace-nowrap">{primePick.horse_name}</h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white">
                                <span>{primePick.track_name}</span>
                                <span className="text-gray-600 hidden sm:inline">•</span>
                                <span>Lopp {primePick.race_number}</span>
                                {primePick.start_time && (
                                    <>
                                        <span className="text-gray-600 hidden sm:inline">•</span>
                                        <span className="text-emerald-400 font-medium whitespace-nowrap md:hidden">Start {primePick.start_time}</span>
                                        <span className="text-emerald-400 font-medium whitespace-nowrap hidden md:inline">Preliminär starttid {primePick.start_time}</span>
                                    </>
                                )}
                                {primePick.driver && (
                                    <>
                                        <span className="text-gray-600 hidden sm:inline">•</span>
                                        <span>{primePick.driver}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats Grid - MATCHING SATURDAY CARD STYLE */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 max-w-full mb-6 pt-4 border-t border-white/5">
                            {(() => {
                                const isVoid = primePick.status && ['void', 'struken', 'refunded'].includes(primePick.status.toLowerCase());
                                const voidClass = isVoid ? "line-through opacity-50" : "";

                                return (
                                    <>
                                        {primePick.start_method && <div className={`flex flex-col items-center md:items-start ${voidClass}`}><InfoLabel label="Startmetod" tooltip="Startmetod" /><span className="text-sm font-medium text-gray-200">{primePick.start_method}</span></div>}
                                        {primePick.distance && <div className={`flex flex-col items-center md:items-start ${voidClass}`}><InfoLabel label="Distans" tooltip="Distans" /><span className="text-sm font-medium text-gray-200">{primePick.distance}</span></div>}
                                        {primePick.bet_type && <div className={`flex flex-col items-center md:items-start ${voidClass}`}><InfoLabel label="Spelform" tooltip="Spelform" /><span className="text-sm font-medium text-gray-200">{primePick.bet_type}</span></div>}
                                        {primePick.equipment && <div className="flex flex-col items-center md:items-start"><InfoLabel label="Utrustning" tooltip="Utrustning" /><span className="text-sm font-medium text-gray-200">{primePick.equipment}</span></div>}
                                        {/* Units */}
                                        {primePick.stake && primePick.stake !== '-' && (
                                            <div className={`flex flex-col items-center md:items-start ${voidClass}`}>
                                                <InfoLabel label="Insats" tooltip="Insats" />
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <Coins className="w-4 h-4 text-[#C9A86A]" />
                                                    <span className="text-sm font-medium text-[#C9A86A]">{primePick.stake}</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        {/* Analysis */}
                        <CompactAnalysis
                            title="Analys"
                            content={
                                <div className="relative">
                                    <p className="text-sm text-gray-300 leading-relaxed font-light line-clamp-2 md:line-clamp-none" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}>
                                        {primePick.final_output_message || primePick.adam_notes || "Analys kommer..."}
                                    </p>
                                </div>
                            }
                        />
                    </div>

                    {/* Right Logic (Result OR Buttons only) */}
                    <div className="flex flex-col w-full md:w-auto items-center md:items-end justify-between gap-4 md:h-full min-w-0 md:min-w-[200px] relative z-20">
                        {(() => {
                            const hasResult = primePick.net_result !== null && primePick.net_result !== undefined;
                            if (hasResult) {
                                const net = Number(primePick.net_result);
                                const status = primePick.status?.toLowerCase();
                                const isWin = net > 0 || (status && ['won', 'vinst', 'win'].includes(status));
                                const isVoid = status && ['void', 'struken', 'refunded'].includes(status);

                                return (
                                    <div className="w-full md:w-auto flex flex-col items-center md:items-end text-center md:text-right order-2 md:order-1">
                                        <div className="flex items-center justify-center md:justify-end gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                            {isVoid ? 'ÅTERBETALNING' : 'NETTORESULTAT'}
                                        </div>
                                        <div className={`text-4xl font-black tracking-tighter leading-tight ${isVoid ? 'text-gray-400' : isWin ? 'text-green-400' : 'text-red-400'}`}>
                                            {net > 0 ? '+' : ''}{net.toFixed(2)}
                                        </div>
                                        <div className="mt-2 text-sm font-medium text-gray-400">
                                            {isVoid ? 'Struken / Återbetalning' : isWin ? 'Vinst' : 'Förlust'}
                                        </div>
                                    </div>
                                );
                            } else {
                                // Empty spacer to push buttons down since Odds are now top-right
                                return <div className="hidden md:block"></div>;
                            }
                        })()}


                        <div className="flex flex-col w-full gap-3 mt-8 md:mt-auto order-1 md:order-2">

                            {primePick.net_result !== null && primePick.net_result !== undefined ? (
                                <button
                                    disabled
                                    className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                                >
                                    <span className="font-semibold text-gray-400">Avslutat spel</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => openBookmaker(primePick.bookmaker)}
                                    className="w-full px-6 py-3 rounded-xl bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 border border-[#2FAE8F]/20 flex items-center justify-center gap-2 transition-all group backdrop-blur-sm"
                                >
                                    <span className="font-semibold text-white">Spela med bästa odds</span>
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    openAnalysisModal({
                                        ...primePick,
                                        isVoid: primePick.status && ['void', 'struken', 'refunded'].includes(primePick.status.toLowerCase())
                                    })
                                }
                                className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all group backdrop-blur-sm"
                            >
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Läs full analys</span>
                                <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // Default: Countdown Timer
    return (
        <article className="relative w-full rounded-3xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl flex flex-col justify-between h-full min-h-[420px] overflow-hidden group">

            {/* Background Effects matching standard cards */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2FAE8F]/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Header: Badge & Status */}
            <div className="flex flex-col gap-2 relative z-10 w-full mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#2FAE8F] text-sm font-medium capitalize">
                        {new Date().toLocaleDateString('sv-SE', { weekday: 'long' })}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#2FAE8F]/10 text-[#2FAE8F] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#2FAE8F]/10">
                        DAGENS PRIMEPICK
                    </span>
                    <span className="text-gray-400 text-sm font-medium">
                        · {getGameStatus(new Date().toISOString()).label}
                    </span>
                </div>
            </div>

            {/* Body: Timer & Message centered */}
            <div className="flex flex-col items-center justify-center flex-grow py-8 relative z-10 w-full text-center">
                <div className="text-5xl mb-6 animate-bounce">⏰</div>

                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-xl text-center mb-4 leading-tight">
                    Analys pågår
                </h2>

                <div className="flex flex-col items-center gap-2 mb-6">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PUBLICERAS OM</span>
                    <div className="font-black text-white scale-125">
                        <CountdownTimer targetDate={new Date(new Date().setHours(19, 30, 0, 0))} />
                    </div>
                </div>

                <p className="max-w-sm text-gray-400 text-sm md:text-base text-center leading-relaxed">
                    Våra experter går just nu igenom dagens startlistor för att hitta marknadens bästa spelvärde.
                </p>
            </div>

            {/* Footer: Button */}
            <div className="w-full relative z-10 mt-auto pt-6">
                <button
                    onClick={() => setIsSubscribeOpen(true)}
                    className="w-full px-6 py-3 bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 text-[#2FAE8F] font-bold rounded-xl transition-all group border border-[#2FAE8F]/20 hover:border-[#2FAE8F]/40 flex items-center justify-center gap-2"
                >
                    <Bell className="w-5 h-5 group-hover:animate-swing" />
                    <span>Meddela mig när spelet släpps</span>
                </button>
            </div>
        </article>
    );
};
