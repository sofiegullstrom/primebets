
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface TopHorse {
    horse_name: string
    total_profit: number
    wins: number
    total_races: number
    last_race_date: string
}

interface BigWin {
    horse_name: string
    odds: number
    date: string
    track: string
}

export function TopListsView() {
    const [topHorses, setTopHorses] = useState<TopHorse[]>([])
    const [bigWins, setBigWins] = useState<BigWin[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // Fetch all settled picks
            const { data, error } = await supabase
                .from('daily_picks')
                .select('*')
                .not('net_result', 'is', null)

            if (error) throw error

            if (data) {
                // 1. Calculate Hottest Horses (Last 30 Days)
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

                const recentPicks = data.filter(p => new Date(p.race_date) >= thirtyDaysAgo)
                const horseMap = new Map<string, TopHorse>()

                recentPicks.forEach(pick => {
                    const current = horseMap.get(pick.horse_name) || {
                        horse_name: pick.horse_name,
                        total_profit: 0,
                        wins: 0,
                        total_races: 0,
                        last_race_date: pick.race_date
                    }

                    current.total_profit += pick.net_result || 0
                    current.total_races += 1
                    if ((pick.net_result || 0) > 0) current.wins += 1
                    if (new Date(pick.race_date) > new Date(current.last_race_date)) {
                        current.last_race_date = pick.race_date
                    }

                    horseMap.set(pick.horse_name, current)
                })

                const sortedHorses = Array.from(horseMap.values())
                    .sort((a, b) => b.total_profit - a.total_profit)
                    .slice(0, 5) // Top 5

                setTopHorses(sortedHorses)

                // 2. Calculate Biggest Wins (All time)
                const sortedWins = data
                    .filter(p => (p.net_result || 0) > 0)
                    .sort((a, b) => b.odds - a.odds)
                    .slice(0, 5) // Top 5 high odds
                    .map(p => ({
                        horse_name: p.horse_name,
                        odds: p.odds,
                        date: p.race_date,
                        track: p.track_name
                    }))

                setBigWins(sortedWins)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Laddar statistik...</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-full overflow-hidden">
            {/* Top Horses Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 w-full overflow-hidden">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <span className="text-xl">🔥</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm md:text-base">Heta Hästar</h3>
                        <p className="text-xs text-slate-500">Mest vinstgivande (30 dagar)</p>
                    </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {topHorses.map((horse, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 md:p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-colors gap-2">
                            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${idx === 0 ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                                    {idx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-bold text-white truncate">{horse.horse_name}</div>
                                    <div className="text-[10px] text-slate-400 whitespace-nowrap">{horse.wins}V / {horse.total_races}S</div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="text-sm font-bold text-emerald-400 whitespace-nowrap">
                                    +{horse.total_profit.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {topHorses.length === 0 && (
                        <div className="text-center text-slate-500 text-sm py-4">Ingen data än</div>
                    )}
                </div>
            </div>

            {/* Big Wins Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 w-full overflow-hidden">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <span className="text-xl">💎</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm md:text-base">Skrällkollen</h3>
                        <p className="text-xs text-slate-500">Högsta odds-vinsterna</p>
                    </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {bigWins.map((win, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 md:p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-purple-500/30 transition-colors gap-2">
                            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-slate-700 text-slate-400 flex-shrink-0`}>
                                    {idx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-bold text-white truncate">{win.horse_name}</div>
                                    <div className="text-[10px] text-slate-400 truncate">{win.track} • {win.date}</div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="text-sm font-bold text-purple-400 whitespace-nowrap">
                                    {win.odds.toFixed(2)} ggr
                                </div>
                            </div>
                        </div>
                    ))}
                    {bigWins.length === 0 && (
                        <div className="text-center text-slate-500 text-sm py-4">Ingen data än</div>
                    )}
                </div>
            </div>
        </div>
    )
}
