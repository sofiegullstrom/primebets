import { X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LockedAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    // We can accept some data if we want the title to be correct, but mostly it's dummy blurred data
    horseName: string;
}

export const LockedAnalysisModal = ({ isOpen, onClose, horseName }: LockedAnalysisModalProps) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUnlock = () => {
        // Redirect to auth/signup
        navigate('/auth');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content - Glassmorphism */}
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 
                bg-gradient-to-b from-[#1A2736]/95 to-[#0F1720]/98 
                backdrop-blur-2xl 
                border border-white/10 
                shadow-[0_0_60px_rgba(0,0,0,0.7)] 
                ring-1 ring-white/5">

                {/* Header with Depth Gradient */}
                <div className="p-8 pb-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent relative z-10">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-3 tracking-tight drop-shadow-lg flex items-center gap-3">
                                <span className="opacity-50 font-light text-xl">Full Analys</span>
                                <span className="w-1 h-8 bg-[#2FAE8F] rounded-full"></span>
                                {horseName}
                            </h2>
                            <div className="flex gap-2 opacity-50 blur-[2px] select-none">
                                <span className="px-3 py-1 rounded bg-white/10 text-xs">REKOMMENDATION</span>
                                <span className="px-3 py-1 rounded bg-white/10 text-xs">V75</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all absolute top-6 right-6 border border-white/5 z-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Blurred Content Container */}
                <div className="flex-1 overflow-hidden p-8 space-y-8 relative z-0">

                    {/* The Blur Effect */}
                    <div className="absolute inset-0 z-10 bg-[#0F1720]/10 backdrop-blur-[6px] flex flex-col items-center justify-center">
                        <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-2xl mb-4">
                            <Lock className="w-8 h-8 text-[#2FAE8F]" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Lås upp analysen</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs text-center">
                            Skapa ett gratis konto för att få tillgång till fullständiga analyser, statistik och experttips.
                        </p>
                        <button
                            onClick={handleUnlock}
                            className="px-8 py-3 rounded-xl bg-[#2FAE8F] hover:bg-[#258f75] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(47,174,143,0.3)] hover:shadow-[0_0_40px_rgba(47,174,143,0.5)] flex items-center justify-center gap-2 border-t border-white/10"
                        >
                            Lås upp full analys
                        </button>
                    </div>

                    {/* Dummy Content underneath (Everything here is blurred by the overlay) */}
                    <div className="opacity-50 select-none pointer-events-none filter blur-sm" aria-hidden="true">
                        {/* Quick Facts Section */}
                        <div className="grid grid-cols-4 gap-4 p-5 rounded-xl bg-[#0F1720]/50 border border-white/5 shadow-inner">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Odds</span>
                                <span className="text-3xl font-bold text-[#2FAE8F] tracking-tighter">2.25</span>
                            </div>
                            <div className="flex flex-col justify-center border-l border-white/5 pl-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Insats</span>
                                <span className="text-sm font-medium text-gray-200">3 units</span>
                            </div>
                            <div className="flex flex-col justify-center border-l border-white/5 pl-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Spelvärde</span>
                                <span className="text-sm font-medium text-gray-200">+32%</span>
                            </div>
                            <div className="flex flex-col justify-center border-l border-white/5 pl-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Spelform</span>
                                <span className="text-sm font-medium text-gray-200">Vinnare</span>
                            </div>
                        </div>

                        {/* Motivering */}
                        <section>
                            <h3 className="text-xs font-bold text-[#4A90E2] uppercase tracking-widest mb-3 flex items-center gap-2">
                                Motivering
                                <span className="h-px flex-1 bg-gradient-to-r from-[#4A90E2]/30 to-transparent"></span>
                            </h3>
                            <div className="text-sm text-gray-300 leading-relaxed space-y-4">
                                <p>
                                    <strong className="text-white block mb-3 font-bold text-base tracking-tight">Stark prestationsförmåga trots läget.</strong>
                                    Hästen har visat prov på enorm styrka i de senaste starterna och trots att spåret är långt ifrån optimalt så bedömer vi chansen som mycket god. Med rätt ryggar under slutvarvet kommer spurten bita extremt bra.
                                </p>
                                <p>
                                    Kusken känner hästen väl och taktiken lär bli offensiv om tempot bedarrar. Vi ser ett tydligt överodds jämfört med vår interna ranking.
                                </p>
                                <p className="blur-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>
                        </section>

                        {/* Statistik */}
                        <section>
                            <h3 className="text-xs font-bold text-[#2FAE8F] uppercase tracking-widest mb-3 flex items-center gap-2">
                                Statistik
                                <span className="h-px flex-1 bg-gradient-to-r from-[#2FAE8F]/30 to-transparent"></span>
                            </h3>
                            <div className="grid gap-2">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#2FAE8F] shrink-0"></div>
                                        <div className="text-gray-300 w-full">
                                            <span className="text-gray-500 font-bold mr-2 uppercase text-[10px] tracking-wide">STAT:</span>
                                            xxxxxxxxxxxxxxxx
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                </div>

                {/* Sticky Bottom Actions - Hide (or maybe show 'Lås upp' button again if we want) */}
                {/* We already have the big unlock button int he middle, no need for sticky footer here */}

            </div>
        </div>
    );
};
