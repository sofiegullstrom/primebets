import { useState } from 'react'
import { Pick } from '../types'
import { AnalysisModal } from './AnalysisModal'
import { ChevronRight, BarChart2, ExternalLink, X } from 'lucide-react'

interface InterestingBetsListProps {
    picks: Pick[]
}

export function InterestingBetsList({ picks }: InterestingBetsListProps) {
    const [selectedPick, setSelectedPick] = useState<Pick | null>(null)
    const [showOddsModal, setShowOddsModal] = useState(false)

    if (picks.length === 0) return null

    const getBettingUrl = (pick: Pick) => {
        if (!pick?.bookmaker) return null

        const provider = pick.bookmaker.toUpperCase().trim()

        const providerUrls: Record<string, string> = {
            'SVS': 'https://www.svenskaspel.se/',
            'SVENSKA SPEL': 'https://www.svenskaspel.se/',
            'LEOVEGAS': 'https://www.leovegas.com/sv-se/',
            'BETMGM': 'https://www.betmgm.se/',
            'BET365': 'https://www.bet365.com/',
            'UNIBET': 'https://www.unibet.se/',
            'ATG': 'https://www.atg.se/'
        }

        return providerUrls[provider] || null
    }

    const handleBettingClick = (pick: Pick) => {
        const url = getBettingUrl(pick)
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer')
        } else {
            setShowOddsModal(true)
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const formatted = date.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })
        return formatted.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    return (
        <>
            <div className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Intressanta spel för dagen
                    </h2>
                </div>

                <div className="divide-y divide-slate-700">
                    {picks.map((pick) => (
                        <div
                            key={pick.id}
                            className="p-4 hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 last:rounded-b-xl"
                        >
                            <div className="flex-1">
                                <div className="mb-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Häst</span>
                                    <div className="flex items-baseline gap-3">
                                        <h3 className="font-bold text-white text-lg">{pick.horse_name}</h3>
                                        {pick.odds && pick.odds > 0 && (
                                            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                                                <span className="text-[9px] text-slate-500 font-bold uppercase">Odds</span>
                                                <span className="text-emerald-400 font-bold">{pick.odds}</span>
                                            </div>
                                        )}
                                        {pick.value_percent && (
                                            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                                                <span className="text-[9px] text-slate-500 font-bold uppercase">Spelvärde</span>
                                                <span className="text-emerald-400 font-bold">
                                                    {pick.value_percent < 1 ? Math.round(pick.value_percent * 100) : Math.round(pick.value_percent)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm mb-2">
                                    {pick.track_name} • Lopp {pick.race_number} • <span className="text-slate-500">{formatDate(pick.race_date)}</span>
                                </p>

                                {/* Race Info Mini-Grid */}
                                <div className="flex flex-wrap gap-x-8 gap-y-2 mt-3">
                                    {pick.start_method && (
                                        <InfoItem
                                            label="Startmetod"
                                            value={`🏁 ${pick.start_method}`}
                                            tooltip="Auto (bilstart) eller Volt (start från volt)."
                                        />
                                    )}
                                    {pick.start_lane && (
                                        <InfoItem
                                            label="Spår"
                                            value={`Spår ${pick.start_lane}`}
                                            tooltip="Hästens startposition. Spår 1-8 framför bilen."
                                        />
                                    )}
                                    {pick.distance && (
                                        <InfoItem
                                            label="Distans"
                                            value={`📏 ${pick.distance}`}
                                            tooltip="Loppets längd. 1640m (Kort), 2140m (Medel), 2640m (Lång)."
                                        />
                                    )}
                                    {pick.bet_type && (
                                        <InfoItem
                                            label="Spel"
                                            value={`🎯 ${pick.bet_type}`}
                                            valueClassName="text-emerald-400 font-bold"
                                            tooltip={
                                                pick.bet_type.includes('Vinnare') ? "Du spelar på att hästen vinner loppet." :
                                                    pick.bet_type.includes('Plats') ? "Hästen måste komma 1:a, 2:a eller 3:a." :
                                                        pick.bet_type.includes('H2H') ? "Duell mellan två hästar. Din häst måste komma före den andra." :
                                                            "Rekommenderad spelform."
                                            }
                                        />
                                    )}
                                    {pick.stake && (
                                        <InfoItem
                                            label="Insats"
                                            value={`💰 ${pick.stake}`}
                                            valueClassName="text-yellow-400 font-bold"
                                            tooltip="Hur mycket vi rekommenderar att spela. 1-5 Units, där 5 är maxinsats."
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBettingClick(pick)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg transition-all text-sm font-bold whitespace-nowrap"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Spela
                                </button>

                                <button
                                    onClick={() => setSelectedPick(pick)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm font-medium group whitespace-nowrap"
                                >
                                    <BarChart2 className="w-4 h-4 text-blue-400" />
                                    <span className="hidden sm:inline">Full Analys</span>
                                    <span className="sm:hidden">Analys</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedPick && (
                    <AnalysisModal
                        isOpen={!!selectedPick}
                        closeModal={() => setSelectedPick(null)}
                        pick={selectedPick}
                    />
                )}
            </div>

            {/* Odds Not Available Modal */}
            {showOddsModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowOddsModal(false)}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Odds ej tillgängliga</h2>
                            <button
                                onClick={() => setShowOddsModal(false)}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-300 leading-relaxed">
                                Spelbolagen har inte släppt sina odds ännu. Kom tillbaka senare för att se var du kan spela med bäst odds!
                            </p>

                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <p className="text-emerald-400 text-sm">
                                    💡 <strong>Tips:</strong> Odds brukar släppas några timmar innan loppstart.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowOddsModal(false)}
                            className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-colors"
                        >
                            Okej, förstått!
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

function InfoItem({ label, value, tooltip, valueClassName = "text-slate-300" }: { label: string, value: string, tooltip: string, valueClassName?: string }) {
    return (
        <div className="relative group cursor-help">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5 border-b border-dashed border-slate-600 inline-block">
                {label}
            </div>
            <div className={`text-xs flex items-center gap-1 ${valueClassName}`}>
                {value}
            </div>

            {/* Tooltip - Desktop Only */}
            <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
        </div>
    )
}
