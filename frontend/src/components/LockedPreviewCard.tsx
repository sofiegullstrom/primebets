
import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LockedPreviewCardProps {
    title: string
    color: 'indigo' | 'emerald' | 'amber'
}

export function LockedPreviewCard({ title, color }: LockedPreviewCardProps) {
    const borderColor = color === 'indigo' ? 'border-indigo-500/30' : color === 'emerald' ? 'border-emerald-500/30' : 'border-amber-500/30'
    const headerColor = color === 'indigo' ? 'text-indigo-400' : color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'
    const barColor = color === 'indigo' ? 'bg-indigo-500/20' : color === 'emerald' ? 'bg-emerald-500/20' : 'bg-amber-500/20'

    return (
        <Link to="/auth" className={`block h-full relative bg-slate-900/60 rounded-xl border ${borderColor} p-6 overflow-hidden group hover:border-opacity-100 transition-colors`}>
            {/* Fake Content Header */}
            <div className="flex justify-between items-start mb-6">
                <h3 className={`${headerColor} text-sm font-bold uppercase tracking-wider`}>
                    {title}
                </h3>
                <span className={`px-2 py-1 ${barColor} text-xs rounded font-bold opacity-50`}>
                    3 spel
                </span>
            </div>

            {/* Fake Blurry Content */}
            <div className="space-y-4 filter blur-[3px] opacity-30 select-none pointer-events-none">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <div>
                        <div className="h-4 w-24 bg-slate-400/20 rounded mb-1"></div>
                        <div className="h-3 w-16 bg-slate-400/10 rounded"></div>
                    </div>
                    <div className="h-5 w-8 bg-slate-400/20 rounded"></div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <div>
                        <div className="h-4 w-32 bg-slate-400/20 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-slate-400/10 rounded"></div>
                    </div>
                    <div className="h-5 w-8 bg-slate-400/20 rounded"></div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <div>
                        <div className="h-4 w-20 bg-slate-400/20 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-slate-400/10 rounded"></div>
                    </div>
                    <div className="h-5 w-8 bg-slate-400/20 rounded"></div>
                </div>
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="bg-slate-900/90 p-3 rounded-full border border-slate-700 mb-2 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Lock className={`w-5 h-5 ${headerColor}`} />
                </div>
                <span className="text-white font-medium text-sm drop-shadow-md">
                    Lås upp analysen
                </span>
            </div>
        </Link>
    )
}
