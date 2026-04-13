
import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export const CountdownTimer = ({ targetDate, className, compact = false }: { targetDate: Date, className?: string, compact?: boolean }) => {
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number, isCritical: boolean } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();
            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({
                    hours,
                    minutes,
                    seconds,
                    isCritical: difference < 15 * 60 * 1000 // Less than 15 mins
                });
            } else {
                setTimeLeft(null);
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [targetDate]);

    // Format for easier reading: 04h 12m 30s
    if (!timeLeft) return <span className={`text-[#2FAE8F] font-bold tracking-wider uppercase animate-pulse ${className || 'text-xs'}`}>Startar nu</span>;

    if (compact) {
        return (
            <time dateTime={targetDate.toISOString()} className={`tabular-nums font-bold ${timeLeft.isCritical ? 'text-red-500 animate-pulse' : 'text-[#2FAE8F]'} ${className || 'text-sm'}`}>
                Startar om {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </time>
        );
    }

    return (
        <time dateTime={targetDate.toISOString()} className={`flex items-center gap-4 tabular-nums font-bold ${timeLeft.isCritical ? 'text-red-500 animate-pulse' : 'text-[#2FAE8F]'} ${className || 'text-xs md:text-sm'}`}>
            <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl tracking-widest">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-gray-500 tracking-wider font-medium mt-1">Timmar</span>
            </div>
            <span className="text-2xl md:text-4xl text-gray-600 mb-4">:</span>
            <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl tracking-widest">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-gray-500 tracking-wider font-medium mt-1">Minuter</span>
            </div>
            <span className="text-2xl md:text-4xl text-gray-600 mb-4">:</span>
            <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl tracking-widest">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-gray-500 tracking-wider font-medium mt-1">Sekunder</span>
            </div>
        </time>
    );
};

export const CopyButton = ({ textToCopy, className }: { textToCopy: string, className?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`group relative p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5 ${className || ''}`}
            title="Kopiera spel"
        >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />}
            {copied && <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] bg-black px-2 py-1 rounded text-white whitespace-nowrap z-50">Kopierat!</span>}
        </button>
    );
};

export const CompactAnalysis = ({ title, content }: { title: string, content: React.ReactNode }) => {
    return (
        <div className="max-w-md pt-4 border-t border-white/5 w-full">
            <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">{title}</p>
            {content}
        </div>
    );
};
