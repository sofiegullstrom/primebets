
import { ArrowRight } from 'lucide-react';

interface LongTermBetCardProps {
    event: any;
    onReadMore: (event: any) => void;
}

export const LongTermBetCard = ({ event, onReadMore }: LongTermBetCardProps) => {
    if (!event) return null;

    // Determine location string
    const location = event.location || 'Sverige';

    // Determine Theme & Badges based on Type
    let themeColor = 'emerald-500';
    let themeText = 'text-emerald-400';
    let badgeMain = 'LÅNGTIDSSPEL';
    let borderColor = 'border-emerald-500/20';
    let glowColor = 'bg-emerald-900/40';

    if (event.type === 'Stort spel') {
        themeColor = 'amber-500';
        themeText = 'text-amber-400';
        badgeMain = 'EVENT';
        borderColor = 'border-amber-500/20';
        glowColor = 'bg-amber-900/40';
    } else if (event.type === 'Säsongstopp') {
        themeColor = 'purple-500';
        themeText = 'text-purple-400';
        badgeMain = 'SÄSONGSTOPP';
        borderColor = 'border-purple-500/20';
        glowColor = 'bg-purple-900/40';
    }

    return (
        <article className={`relative w-full rounded-3xl p-6 md:p-8 backdrop-blur-xl bg-[#0F1720]/80 border ${borderColor} shadow-2xl overflow-hidden group transition-all duration-500`}>

            {/* Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute right-0 top-0 h-full w-[70%] opacity-20 mix-blend-overlay">
                    <img
                        src="/saturday_horse.png"
                        alt="Background"
                        className="w-full h-full object-cover object-center mask-image-gradient"
                        style={{ maskImage: 'linear-gradient(to right, transparent, black 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 80%)' }}
                    />
                </div>
                <div className={`absolute top-[-50%] right-[-10%] w-[500px] h-[500px] ${glowColor} rounded-full blur-[120px] pointer-events-none`}></div>
            </div>

            <div className="relative z-10 flex flex-col h-full">

                {/* Header: Badges */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#162230]/80 border border-white/5 backdrop-blur-md">
                        <div className={`w-2 h-2 rounded-full bg-${themeColor} animate-pulse`}></div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">{badgeMain}</span>
                    </div>
                </div>

                {/* Content: Title & Info */}
                <div className="mb-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
                        {event.title}
                    </h2>
                    <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                        {location && <span className="uppercase tracking-wider text-xs">{location}</span>}
                        {location && <span className="w-1 h-1 rounded-full bg-gray-600"></span>}
                        <span>Datum: {new Date(event.race_date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </p>
                </div>

                {/* Motivation Text (Short preview or specific description) */}
                <div className="mb-8 max-w-3xl">
                    <p className="text-gray-300 leading-relaxed font-light text-sm md:text-base line-clamp-3 md:line-clamp-2">
                        {event.description || event.motivation || "Ingen motivering tillgänglig."}
                    </p>
                </div>

                {/* Bottom Row: Action */}
                <div className="mt-auto pt-4 flex justify-end">
                    <button
                        onClick={() => onReadMore(event)}
                        className={`px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-${themeColor}/50 text-white font-bold text-sm transition-all group/btn flex items-center gap-3 backdrop-blur-sm shadow-lg`}
                    >
                        <span>Läs mer</span>
                        <ArrowRight className={`w-4 h-4 text-gray-400 group-hover/btn:translate-x-1 group-hover/btn:${themeText} transition-all`} />
                    </button>
                </div>
            </div>
        </article>
    );
};
