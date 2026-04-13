import { useMemo } from 'react'
import { Pick } from './types'

export interface Stats {
    period: string
    count: number
    wins: number
    roi: number
    avgOdds: number
    hottestHorse: Pick
    hottestHorseRoi: number
}

export function useBettingStats(picks: Pick[]) {
    const stats = useMemo(() => {
        // Helper to calculate stats for a set of picks
        const calculateStats = (filteredPicks: Pick[], periodName: string) => {
            if (filteredPicks.length === 0) return null

            const count = filteredPicks.length
            const wins = filteredPicks.filter(p => p.status === 'won' || (p.net_result && p.net_result > 0)).length
            const totalNet = filteredPicks.reduce((sum, p) => sum + (p.net_result || 0), 0)

            // ROI = (Total Return / Total Staked) * 100
            // Total Staked = count (1 unit per bet)
            // Total Return = totalNet + count
            const roi = count > 0 ? ((totalNet + count) / count) * 100 : 0

            const avgOdds = filteredPicks.reduce((sum, p) => sum + (p.odds || 0), 0) / count

            // Find Hottest Horse (Best individual result)
            const hottest = filteredPicks.reduce((prev, current) =>
                (prev.net_result || 0) > (current.net_result || 0) ? prev : current
            )

            return {
                period: periodName,
                count,
                wins,
                roi,
                avgOdds,
                hottestHorse: hottest,
                hottestHorseRoi: ((hottest.net_result || 0) / 1) * 100
            }
        }

        // 1. Yesterday
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        const yesterdayPicks = picks.filter(p => p.race_date === yesterdayStr)
        const yesterdayStats = calculateStats(yesterdayPicks, 'Gårdagens')

        // 2. Week (Last 7 days)
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - 7)
        const weekPicks = picks.filter(p => new Date(p.race_date) >= weekStart)
        const weekStats = calculateStats(weekPicks, 'Veckans')

        // 3. Month (Last 30 days)
        const monthStart = new Date()
        monthStart.setDate(monthStart.getDate() - 30)
        const monthPicks = picks.filter(p => new Date(p.race_date) >= monthStart)
        const monthStats = calculateStats(monthPicks, 'Månadens')

        // Select the best period based on ROI, defaulting to Week if close
        // Filter out negative results as requested
        const allStats = [yesterdayStats, weekStats, monthStats].filter(s => s && s.roi > 0)

        if (allStats.length === 0) {
            return null
        }

        // Sort by ROI descending
        return allStats.sort((a, b) => (b!.roi - a!.roi))[0]
    }, [picks])

    return stats
}
