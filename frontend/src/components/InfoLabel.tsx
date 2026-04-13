import { Info } from 'lucide-react';

export const InfoLabel = ({ label, tooltip, alignment = 'center' }: { label: string, tooltip: string, alignment?: 'left' | 'center' | 'right' }) => {
    let positionClass = "left-1/2 -translate-x-1/2"; // Default center
    let arrowClass = "left-1/2 -translate-x-1/2"; // Default center arrow

    if (alignment === 'right') {
        positionClass = "right-[-10px]";
        arrowClass = "right-[14px]";
    } else if (alignment === 'left') {
        positionClass = "left-[-10px]";
        arrowClass = "left-[14px]";
    }

    return (
        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1 w-fit mx-auto md:mx-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <div className="relative group/info cursor-help">
                <Info className="w-3 h-3 text-gray-600 group-hover/info:text-[#4A90E2] transition-colors" />
                <div className={`absolute z-[100] bottom-full mb-2 w-56 p-3 rounded-xl bg-[#162230]/95 backdrop-blur-xl border border-white/10 shadow-2xl opacity-0 group-hover/info:opacity-100 transition-all duration-200 pointer-events-none translate-y-2 group-hover/info:translate-y-0 ${positionClass}`}>
                    <p className="text-xs text-gray-200 font-medium leading-relaxed text-center normal-case">
                        {tooltip}
                    </p>
                    <div className={`absolute -bottom-1.5 w-3 h-3 bg-[#162230]/95 border-r border-b border-white/10 rotate-45 ${arrowClass}`}></div>
                </div>
            </div>
        </div>
    );
};
