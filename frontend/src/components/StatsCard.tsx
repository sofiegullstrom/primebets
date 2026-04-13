import { useState } from 'react'
import { Stats } from '../useBettingStats'
import { AnalysisModal } from './AnalysisModal'

interface StatsCardProps {
    stats: Stats | null
}

export function StatsCard({ stats }: StatsCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!stats) return null

    return (
        <>
            <div className="p-4 md:p-6 rounded-xl bg-slate-900 border border-slate-800 relative group h-full flex flex-col justify-between">
                {/* Header with Tooltip */}
                <div className="flex justify-between items-start mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-emerald-400">
                        Senaste Heta
                    </h3>

                    <div className="relative group/tooltip">
                        <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-slate-500 text-xs cursor-help hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                            ?
                        </div>
                        <div className="absolute right-0 top-6 w-48 p-3 bg-slate-800 text-slate-300 text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-700">
                            Visar statistiken för den period (Gårdagen, Veckan, eller Månaden) som har bäst ROI just nu.
                        </div>
                    </div>
                </div>

                {/* Grid Stats - Simplified */}
                <div className="grid grid-cols-2 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 mb-4 md:mb-6 border-b border-slate-800 pb-4 md:pb-6">
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Period</div>
                        <div className="text-base md:text-lg font-bold text-white">{stats.period.replace('s', '')}</div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">ROI</div>
                        <div className="text-xl md:text-2xl font-bold text-emerald-400">
                            +{stats.roi.toFixed(1)}%
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Antal Spel</div>
                        <div className="text-xl md:text-2xl font-bold text-white">{stats.count}</div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Snittodds</div>
                        <div className="text-xl md:text-2xl font-bold text-white">{stats.avgOdds.toFixed(2)}</div>
                    </div>
                </div>

                {/* Big Highlight */}
                <div className="text-center py-4 md:py-6 bg-emerald-500/10 rounded-lg border border-emerald-500/20 mb-4 md:mb-6">
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Hetaste Häst ({stats.period})</div>
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-1">
                            <div className="text-lg md:text-xl font-bold text-emerald-400 leading-tight truncate pr-2 text-left">
                                {stats.hottestHorse.horse_name}
                            </div>
                            <div className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap shrink-0">
                                Avslutat
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-left">
                            <div className="text-xs md:text-sm text-slate-400 truncate pr-2">
                                {stats.hottestHorse.track_name} • {stats.hottestHorse.bet_type || 'Vinnare'}
                            </div>
                            <div className="text-sm font-bold text-white whitespace-nowrap">
                                Odds: <span className="text-emerald-400">{stats.hottestHorse.odds}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-sm font-bold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Full Analys</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>

            <AnalysisModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                pick={stats.hottestHorse}
            />
        </>
    )
}
