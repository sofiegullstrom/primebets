
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { Pick } from '../types'
import { TrendingUp, Activity, Target, Award, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBettingStats } from '../useBettingStats'
import { StatsCard } from './StatsCard'
import { Link } from 'react-router-dom'

interface AnalysisContentProps {
    session?: Session | null
}

const ITEMS_PER_PAGE = 15
const MAX_ITEMS = 100

export function AnalysisContent({ session }: AnalysisContentProps) {
    const [picks, setPicks] = useState<Pick[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    // Calculate stats for the StatsCard based on ALL picks (up to MAX_ITEMS)
    const stats = useBettingStats(picks)

    useEffect(() => {
        fetchAllHistory()
    }, [])

    async function fetchAllHistory() {
        try {
            // Helper to fetch or return empty array on error (e.g. missing column/table)
            const safeFetch = async (table: string, query: any) => {
                try {
                    const { data, error } = await query
                    if (error) throw error
                    return (data as any[]) || []
                } catch (err) {
                    console.warn(`Failed to fetch from ${table} (migration might be missing):`, err)
                    return []
                }
            }

            const dailyRes = await safeFetch('daily_picks', supabase.from('daily_picks').select('*').not('net_result', 'is', null))
            const weeklyRes = await safeFetch('weekly_scout', supabase.from('weekly_scout').select('*').not('net_result', 'is', null))
            const saturdayRes = await safeFetch('saturday_picks', supabase.from('saturday_picks').select('*').not('net_result', 'is', null))

            // These might fail if migration hasn't run yet, so we treat them safely
            const hockeyRes = await safeFetch('hockey_games', supabase.from('hockey_games').select('*').not('net_result', 'is', null))
            const calendarRes = await safeFetch('calendar_events', supabase.from('calendar_events').select('*').not('net_result', 'is', null).in('type', ['Långtidsspel', 'Stort spel', 'Säsongstopp']))

            const allPicks: Pick[] = [
                ...dailyRes.map((p: any) => ({ ...p, sourceTable: 'daily_picks' })),
                ...weeklyRes.map((p: any) => ({ ...p, sourceTable: 'weekly_scout' })),
                ...saturdayRes.map((p: any) => ({ ...p, sourceTable: 'saturday_picks' })),

                // Map Hockey Games to Pick format
                ...hockeyRes.map((h: any) => ({
                    id: h.id,
                    race_date: h.game_date,
                    horse_name: `${h.match_name} (${h.bet_selection})`,
                    track_name: `${h.league} (Hockey)`,
                    race_number: 1, // Dummy
                    odds: h.odds,
                    net_result: h.net_result,
                    status: h.status || 'finished',
                    sourceTable: 'hockey_games',
                    is_prime_pick: false,
                    adam_notes: h.motivation || '',
                    final_output_message: h.motivation || ''
                })),

                // Map Calendar Events (Longterm Bets) to Pick format
                ...calendarRes.map((c: any) => ({
                    id: c.id,
                    race_date: c.race_date,
                    horse_name: c.horse_name || c.title,
                    track_name: c.location || 'Okänd bana',
                    race_number: 1, // Dummy
                    odds: c.odds || 0,
                    net_result: c.net_result,
                    status: c.status || 'finished',
                    sourceTable: 'calendar_events',
                    is_prime_pick: false,
                    adam_notes: c.motivation || '',
                    final_output_message: c.detailed_description || ''
                }))
            ] as unknown as Pick[]

            // Sort by date descending
            allPicks.sort((a, b) => new Date(b.race_date).getTime() - new Date(a.race_date).getTime())

            setPicks(allPicks)
        } catch (error) {
            console.error('Error fetching history:', error)
        } finally {
            setLoading(false)
        }
    }

    // LIST DATA: Limit to MAX_ITEMS for display
    const visiblePicks = picks.slice(0, MAX_ITEMS)

    // PAGINATION LOGIC (for the Modal)
    const totalPages = Math.ceil(visiblePicks.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedPicks = visiblePicks.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    // Calculate KPIs (Currently based on ALL picks fetched, which is good for accuracy)
    const totalPicks = picks.length
    const wonPicks = picks.filter(p => (p.net_result || 0) > 0)
    const winRate = totalPicks > 0 ? (wonPicks.length / totalPicks) * 100 : 0
    const avgWinningOdds = wonPicks.length > 0
        ? wonPicks.reduce((acc, p) => acc + (p.odds || 0), 0) / wonPicks.length
        : 0

    // ROI calculation (unit-based)
    const totalNetResult = picks.reduce((acc, p) => acc + (p.net_result || 0), 0)
    const roi = totalPicks > 0 ? ((totalNetResult + totalPicks) / totalPicks) * 100 : 0

    // Helper to get readable type name
    const getHumanType = (pick: any) => {
        if (pick.sourceTable === 'weekly_scout') return 'Veckans Spaning'
        if (pick.sourceTable === 'saturday_picks') return 'Lördagens Drag'
        if (pick.sourceTable === 'hockey_games') return 'Hockey'
        if (pick.sourceTable === 'calendar_events') return 'Långtidsspel'
        if (pick.is_prime_pick) return 'PrimePick'
        return 'Dagens Drag'
    }

    // Show only latest 5 for preview, prioritizing WINS
    // Strategy: Look at the last 30 relevant picks (Prime, Weekly, Saturday).
    // Try to find 5 wins. If found, show them sorted by date.
    // If < 5 wins, fill with other recent picks.

    // 1. Filter to only relevant types (Prime, Weekly, Saturday) - though currently 'picks' has all
    const relevantPicks = picks.filter(p =>
        p.is_prime_pick ||
        (p as any).sourceTable === 'weekly_scout' ||
        (p as any).sourceTable === 'saturday_picks'
    )

    // 2. We search ALL relevant picks for wins, not just the last 30, to ensure we show green if possible!
    // But we still prefer recent wins.
    const wins = relevantPicks.filter(p => (p.net_result || 0) > 0)

    // 4. Construct the preview list
    let recentPreviewPicks: Pick[] = []

    if (wins.length >= 5) {
        // Show the top 5 latest wins from ANY time
        recentPreviewPicks = wins.slice(0, 5)
    } else {
        // If < 5 wins total in history, fill with non-wins from the start (most recent)
        const nonWins = relevantPicks.filter(p => (p.net_result || 0) <= 0)
        recentPreviewPicks = [...wins, ...nonWins].slice(0, 5)

        // Sort by date so it looks like a timeline, but with wins cherry-picked to exist.
        recentPreviewPicks.sort((a, b) => new Date(b.race_date).getTime() - new Date(a.race_date).getTime())
    }

    const PickRow = ({ pick }: { pick: Pick }) => (
        <tr className="hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-4 text-slate-400 whitespace-nowrap font-mono text-xs">
                {pick.race_date}
            </td>
            <td className="px-6 py-4">
                <div className="font-bold text-white max-w-[150px] truncate">{pick.horse_name}</div>
                <div className="text-xs text-slate-500 truncate">{pick.track_name}</div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${pick.is_prime_pick ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    (pick as any).sourceTable === 'weekly_scout' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        (pick as any).sourceTable === 'saturday_picks' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            (pick as any).sourceTable === 'hockey_games' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                (pick as any).sourceTable === 'calendar_events' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                                    'bg-slate-700/50 text-slate-400 border-slate-600'
                    }`}>
                    {getHumanType(pick)}
                </span>
            </td>
            <td className="px-6 py-4 text-right font-medium text-slate-300">
                {pick.odds?.toFixed(2)}
            </td>
            <td className="px-6 py-4 text-right font-bold">
                {(pick.net_result || 0) > 0 ? (
                    <div className="text-emerald-400 flex flex-col items-end">
                        <span>VINST</span>
                        <span className="text-xs opacity-75">+{pick.net_result}</span>
                    </div>
                ) : (
                    <span className="text-rose-400 opacity-70">FÖRLUST</span>
                )}
            </td>
        </tr>
    )

    const MobilePickCard = ({ pick }: { pick: Pick }) => (
        <div className="p-4 bg-slate-800/30 border-b border-slate-700/50 last:border-0">
            <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 pr-4">
                    <div className="font-bold text-white text-base truncate">{pick.horse_name}</div>
                    <div className="text-xs text-slate-500 truncate">{pick.track_name} • {pick.race_date}</div>
                </div>
                <div className="text-right flex-shrink-0">
                    {(pick.net_result || 0) > 0 ? (
                        <div className="text-emerald-400 font-bold block">
                            +{pick.net_result}
                        </div>
                    ) : (
                        <div className="text-rose-400 font-bold block">
                            {pick.net_result}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-3">
                <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold border ${pick.is_prime_pick ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    (pick as any).sourceTable === 'weekly_scout' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        (pick as any).sourceTable === 'saturday_picks' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            (pick as any).sourceTable === 'hockey_games' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                (pick as any).sourceTable === 'calendar_events' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                                    'bg-slate-700/50 text-slate-400 border-slate-600'
                    }`}>
                    {getHumanType(pick)}
                </span>
                <span className="text-xs font-mono text-slate-400">
                    Odds: <span className="text-white font-bold">{pick.odds?.toFixed(2)}</span>
                </span>
            </div>
        </div>
    )

    return (
        <>
            <div className="space-y-8 pb-24 max-w-full overflow-hidden">
                {/* Hero Section */}
                <div className="text-center px-4">
                    <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
                        Siffror som talar för <span className="text-emerald-400">sig själva</span>.
                    </h1>
                    <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto">
                        Vi tror på full transparens. Här redovisar vi resultatet av vår metod över tid.
                    </p>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 px-2 md:px-0">
                    <div className="bg-slate-800/50 border border-slate-700 p-4 md:p-6 rounded-xl md:rounded-2xl">
                        <div className="flex items-center gap-2 md:gap-3 mb-2 text-emerald-400">
                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-bold text-[10px] md:text-sm uppercase tracking-wider">ROI</span>
                        </div>
                        <div className="text-2xl md:text-4xl font-bold text-white">
                            {roi.toFixed(1)}%
                        </div>
                        <p className="text-slate-500 text-[10px] md:text-xs mt-1 md:mt-2">Platt insats</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 p-4 md:p-6 rounded-xl md:rounded-2xl">
                        <div className="flex items-center gap-2 md:gap-3 mb-2 text-blue-400">
                            <Activity className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-bold text-[10px] md:text-sm uppercase tracking-wider">Snittodds</span>
                        </div>
                        <div className="text-2xl md:text-4xl font-bold text-white">
                            {avgWinningOdds.toFixed(2)}
                        </div>
                        <p className="text-slate-500 text-xs mt-1 md:mt-2">På vinnande spel</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 p-4 md:p-6 rounded-xl md:rounded-2xl">
                        <div className="flex items-center gap-2 md:gap-3 mb-2 text-purple-400">
                            <Target className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-bold text-[10px] md:text-sm uppercase tracking-wider">Träffsäkerhet</span>
                        </div>
                        <div className="text-2xl md:text-4xl font-bold text-white">
                            {winRate.toFixed(1)}%
                        </div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 p-4 md:p-6 rounded-xl md:rounded-2xl">
                        <div className="flex items-center gap-2 md:gap-3 mb-2 text-amber-400">
                            <Award className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-bold text-[10px] md:text-sm uppercase tracking-wider">Spel totalt</span>
                        </div>
                        <div className="text-2xl md:text-4xl font-bold text-white">
                            {totalPicks}
                        </div>
                        <p className="text-slate-500 text-[10px] md:text-xs mt-1 md:mt-2">Analyserade lopp</p>
                    </div>
                </div>

                {/* Content Grid: Recent Wins & History Table */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats Card */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4 px-2 md:px-0">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                            <h2 className="text-xl font-bold">Hetast Just Nu</h2>
                        </div>
                        <div className="h-full">
                            <StatsCard stats={stats} />
                        </div>
                    </div>

                    {/* Right Column: Latest 5 Results */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6 px-2 md:px-0">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                <h2 className="text-xl font-bold">Senaste spel</h2>
                            </div>
                        </div>

                        <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden mx-2 md:mx-0">
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Datum</th>
                                            <th className="px-6 py-4 font-medium">Häst / Bana</th>
                                            <th className="px-6 py-4 font-medium">Kategori</th>
                                            <th className="px-6 py-4 font-medium text-right">Odds</th>
                                            <th className="px-6 py-4 font-medium text-right">Resultat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                    Laddar historik...
                                                </td>
                                            </tr>
                                        ) : recentPreviewPicks.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                    Inga analyserade lopp klara än.
                                                </td>
                                            </tr>
                                        ) : (
                                            recentPreviewPicks.map((pick) => <PickRow key={pick.id} pick={pick} />)
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View (Preview - 5 latest) */}
                            <div className="md:hidden">
                                {loading ? (
                                    <div className="p-8 text-center text-slate-500">Laddar historik...</div>
                                ) : recentPreviewPicks.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">Inga analyserade lopp klara än.</div>
                                ) : (
                                    recentPreviewPicks.map((pick) => <MobilePickCard key={pick.id} pick={pick} />)
                                )}
                            </div>

                            {picks.length > 5 && (
                                <div className="p-4 border-t border-slate-700 text-center">
                                    {session ? (
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors"
                                        >
                                            Visa alla {picks.length > MAX_ITEMS ? MAX_ITEMS : picks.length} spel →
                                        </button>
                                    ) : (
                                        <Link
                                            to="/auth"
                                            className="inline-block text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors"
                                        >
                                            Visa alla resultat →
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Full History Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-slate-900 border border-slate-700 md:rounded-2xl w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl flex flex-col" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-700 shrink-0">
                            <div>
                                <h2 className="text-lg md:text-2xl font-bold text-white">Spelhistorik</h2>
                                <p className="text-xs text-slate-400">Visar senaste {visiblePicks.length} spelen</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Desktop Table */}
                            <div className="hidden md:block">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Datum</th>
                                            <th className="px-6 py-4 font-medium">Häst / Bana</th>
                                            <th className="px-6 py-4 font-medium">Kategori</th>
                                            <th className="px-6 py-4 font-medium text-right">Odds</th>
                                            <th className="px-6 py-4 font-medium text-right">Resultat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {paginatedPicks.map((pick) => <PickRow key={pick.id} pick={pick} />)}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile List View */}
                            <div className="md:hidden">
                                {paginatedPicks.map((pick) => <MobilePickCard key={pick.id} pick={pick} />)}
                            </div>
                        </div>

                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-slate-700 bg-slate-800/20 shrink-0 flex items-center justify-between">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-white hover:bg-slate-800"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Föregående
                                </button>

                                <span className="text-xs font-mono text-slate-500">
                                    Sida {currentPage} av {totalPages}
                                </span>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-white hover:bg-slate-800"
                                >
                                    Nästa
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
