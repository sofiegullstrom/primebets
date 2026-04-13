import { useState, useEffect } from 'react'
import { Pick } from '../types'
import { X, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PrimePickHeroProps {
    pick: Pick | undefined
    variant?: 'default' | 'preview'
}

export function PrimePickHero({ pick, variant = 'default' }: PrimePickHeroProps) {
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [showOddsModal, setShowOddsModal] = useState(false)
    const [showAnalysisModal, setShowAnalysisModal] = useState(false)

    useEffect(() => {
        const checkTime = () => {
            const now = new Date()
            const target = new Date()
            target.setHours(19, 30, 0, 0)

            if (pick) {
                return
            }

            const diff = target.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeLeft("Inväntar spel...")
            } else {
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
            }
        }

        const timer = setInterval(checkTime, 1000)
        checkTime()

        return () => clearInterval(timer)
    }, [pick])

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const formatted = date.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })
        return formatted.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    const getBettingUrl = () => {
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

    const handleBettingClick = () => {
        const url = getBettingUrl()
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer')
        } else {
            setShowOddsModal(true)
        }
    }

    if (!pick && variant === 'default') {
        return (
            <div className="relative w-full p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">⏰</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Dagens PrimePick släpps kl 19:30</h2>
                    <p className="text-slate-400 text-lg mb-6">Återstående tid:</p>
                    <div className="text-4xl font-bold text-emerald-400">{timeLeft}</div>
                </div>
            </div>
        )
    }

    if (!pick) return null

    return (
        <>
            <div className="relative w-full p-3 md:p-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div className="w-full md:w-auto">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <span className="px-2.5 md:px-3 py-0.5 md:py-1 bg-emerald-500 text-slate-900 text-xs font-bold rounded-full uppercase tracking-wider">
                                Dagens PrimePick
                            </span>
                            <span className="text-slate-400 text-xs md:text-sm flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${pick.status === 'pending' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                                {pick.status === 'pending' ? 'Öppet Spel' : 'Avslutat'}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Häst</span>
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg break-words">
                                {pick.horse_name}
                            </h1>
                        </div>
                        <p className="text-base md:text-lg text-slate-300 flex flex-wrap items-center gap-2 mb-3">
                            <span>{pick.track_name}</span>
                            <span className="text-slate-600">•</span>
                            <span>Lopp {pick.race_number}</span>
                            {variant !== 'preview' && (
                                <>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-emerald-400/80 font-medium">{formatDate(pick.race_date)}</span>
                                </>
                            )}
                        </p>

                        {/* Race Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                            {pick.start_method && (
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Startmetod</div>
                                    <div className="text-slate-200 text-sm font-medium flex items-center gap-1.5">
                                        <span>🏁</span>
                                        <span>{pick.start_method}</span>
                                    </div>
                                </div>
                            )}
                            {pick.start_lane && (
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Spår</div>
                                    <div className="text-slate-200 text-sm font-medium flex items-center gap-1.5">
                                        <span>Spår {pick.start_lane}</span>
                                    </div>
                                </div>
                            )}
                            {pick.distance && (
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Distans</div>
                                    <div className="text-slate-200 text-sm font-medium flex items-center gap-1.5">
                                        <span>📏</span>
                                        <span>{pick.distance}</span>
                                    </div>
                                </div>
                            )}
                            {pick.bet_type && (
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                        Spelform
                                        <Link to="/school" className="text-slate-600 hover:text-emerald-400 p-0.5 rounded-full hover:bg-slate-700 transition-colors" title="Vad betyder detta? Läs i Spelskolan">
                                            <HelpCircle className="w-3 h-3" />
                                        </Link>
                                    </div>
                                    <div className="text-emerald-400 text-sm font-bold flex items-center gap-1.5">
                                        <span>🎯</span>
                                        <span>{pick.bet_type}</span>
                                    </div>
                                </div>
                            )}
                            {pick.stake && (
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Insats</div>
                                    <div className="text-yellow-400 text-sm font-bold flex items-center gap-1.5">
                                        <span>💰</span>
                                        <span>{pick.stake}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                        <div className="text-left md:text-right mb-3 md:mb-4 flex flex-col md:items-end gap-2">
                            <div>
                                <span className="block text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Odds</span>
                                <span className="text-4xl md:text-5xl font-bold text-white">{pick.odds}</span>
                            </div>

                            {pick.value_percent && (
                                <div className="md:text-right">
                                    <span className="block text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Spelvärde</span>
                                    <div className="inline-block px-3 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                                        <span className="text-emerald-400 font-bold text-xl md:text-2xl">
                                            {pick.value_percent < 1 ? Math.round(pick.value_percent * 100) : Math.round(pick.value_percent)}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {variant === 'preview' ? (
                    <div className="mt-8 text-center">
                        <div className="inline-block px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm">
                                Logga in för att se full analys och spela
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 p-6 rounded-xl bg-slate-900/50 border border-slate-700/50">
                            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Analys</h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {pick.final_output_message || pick.adam_notes}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 justify-end">
                            <button
                                onClick={handleBettingClick}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-center rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                <span>Spela med bäst odds</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </button>

                            <button
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors"
                                onClick={() => setShowAnalysisModal(true)}
                            >
                                Läs Full Analys
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Full Analysis Modal */}
            {showAnalysisModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowAnalysisModal(false)}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Full Analys - {pick.horse_name}</h2>
                            <button
                                onClick={() => setShowAnalysisModal(false)}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Horse Info */}
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{pick.horse_name}</h3>
                                        <p className="text-slate-400">{pick.track_name} • Lopp {pick.race_number}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-slate-400">Odds</div>
                                        <div className="text-3xl font-bold text-emerald-400">{pick.odds}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Motivering */}
                            {(pick.final_output_message || pick.adam_notes) && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Motivering</h3>
                                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {pick.final_output_message || pick.adam_notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Statistik */}
                            {pick.statistics && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Statistik</h3>
                                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                                        <p className="text-slate-300 leading-relaxed">
                                            {pick.statistics}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Intervju / Information */}
                            {pick.interview_info && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Intervju / Information</h3>
                                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                                        <p className="text-slate-300 leading-relaxed">
                                            {pick.interview_info}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Spela-knapp */}
                            <button
                                onClick={handleBettingClick}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <span>Spela med bäst odds</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
