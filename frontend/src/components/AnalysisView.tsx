import { Calendar, CheckCircle2, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { AllBetsModal } from './AllBetsModal';
import { supabase } from '../lib/supabase';

export const AnalysisView = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('Alla');
    const [isAllBetsModalOpen, setIsAllBetsModalOpen] = useState(false);

    // Real Data State
    const [graphData, setGraphData] = useState<any[]>([]);
    const [allBets, setAllBets] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalysisData();
    }, []);

    const fetchAnalysisData = async () => {
        const [dailyRes, satRes] = await Promise.all([
            supabase.from('daily_picks').select('*').order('race_date', { ascending: false }),
            supabase.from('saturday_picks').select('*').order('race_date', { ascending: false })
        ]);

        const dailyPicks = dailyRes.data || [];
        const saturdayPicks = satRes.data || [];

        const picks = [...dailyPicks, ...saturdayPicks].sort((a, b) => new Date(b.race_date).getTime() - new Date(a.race_date).getTime());

        if (!picks) return;

        // Filter valid finished games client-side for robustness
        const finishedPicks = picks.filter(p => {
            const hasNet = p.net_result !== null && p.net_result !== undefined;
            const status = p.status ? p.status.toLowerCase() : '';
            return hasNet || status === 'won' || status === 'lost' || status === 'win' || status === 'loss' || status === 'vinst' || status === 'förlust';
        });

        // 1. Process Totals
        let totalStakes = 0;
        let totalReturns = 0;
        let winCount = 0;

        // Formatted bets for list/modal
        const formatted = finishedPicks.map(pick => {
            const net = pick.net_result || 0;
            // Parse stake units
            let stake = 1;
            if (pick.stake) {
                const match = pick.stake.toString().match(/(\d+)/);
                if (match) stake = parseInt(match[0], 10);
            }

            const isWin = net > 0 || pick.status === 'won' || pick.status === 'vinst';

            if (isWin) winCount++;
            totalStakes += stake;
            totalReturns += (stake + net);

            return {
                date: pick.race_date,
                horse: pick.horse_name,
                type: pick.bet_type || 'Vinnare',
                odds: pick.odds ? pick.odds.toString() : '-',
                result: isWin ? 'Win' : 'Loss',
                profit: net > 0 ? `+${Number(net).toFixed(2)}` : `${Number(net).toFixed(2)}`,
                rawDate: new Date(pick.race_date),
                rawNet: net,
                rawStake: stake
            };
        });

        // Removed setStats - simplified logic to derive stats from allBets
        setAllBets(formatted);

        // 2. Process Graph Data (Monthly ROI)
        // Group by Month YYYY-MM
        const months: { [key: string]: { stakes: number, returns: number } } = {};

        // Populate last 12 months keys first to ensure continuity
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toISOString().slice(0, 7); // YYYY-MM
            months[key] = { stakes: 0, returns: 0 };
        }

        formatted.forEach(bet => {
            const key = bet.rawDate.toISOString().slice(0, 7);
            if (months[key]) {
                months[key].stakes += bet.rawStake;
                months[key].returns += (bet.rawStake + bet.rawNet);
            }
        });

        const graph = Object.entries(months).map(([key, data]) => {
            const start = new Date(key + '-01');
            const monthName = start.toLocaleString('sv-SE', { month: 'short' });
            // Calculate ROI for that month. If no bets, carry over 100 (breakeven) or 0? 
            // Usually graphs show 100 as baseline.
            const monthRoi = data.stakes > 0 ? (data.returns / data.stakes) * 100 : 100;
            return {
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                roi: monthRoi,
                rawDate: start
            };
        }).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

        setGraphData(graph);
    };

    // 1. Filtered Bets Calculation
    const filteredBets = useMemo(() => {
        if (allBets.length === 0) return [];

        let cutoffDate = new Date('1970-01-01');
        const now = new Date();

        if (selectedPeriod === '3 mån') {
            cutoffDate.setMonth(now.getMonth() - 3);
        } else if (selectedPeriod === '6 mån') {
            cutoffDate.setMonth(now.getMonth() - 6);
        } else if (selectedPeriod === '12 mån') {
            cutoffDate.setMonth(now.getMonth() - 12);
        }

        return allBets.filter(bet => bet.rawDate >= cutoffDate);
    }, [allBets, selectedPeriod]);

    // 2. Stats Calculation based on filteredBets
    const filteredStats = useMemo(() => {
        if (filteredBets.length === 0) {
            return { roi: 0, hitRate: 0, netProfit: 0, totalBets: 0, wins: 0 };
        }

        let totalStakes = 0;
        let totalReturns = 0;
        let wins = 0;

        filteredBets.forEach(bet => {
            totalStakes += bet.rawStake;
            totalReturns += (bet.rawStake + bet.rawNet);
            if (bet.rawNet > 0 || bet.result === 'Win') wins++;
        });

        const roi = totalStakes > 0 ? (totalReturns / totalStakes) * 100 : 0;
        const netProfit = totalReturns - totalStakes;
        const hitRate = (wins / filteredBets.length) * 100;

        return {
            roi,
            hitRate,
            netProfit,
            totalBets: filteredBets.length,
            wins
        };
    }, [filteredBets]);

    const getFilteredGraphData = () => {
        if (graphData.length === 0) return [];
        switch (selectedPeriod) {
            case '3 mån': return graphData.slice(-3);
            case '6 mån': return graphData.slice(-6);
            case '12 mån': return graphData.slice(-12);
            case 'Alla': return graphData;
            default: return graphData;
        }
    };

    const chartData = getFilteredGraphData();

    // Helper to map data to SVG coordinates
    const generateChartPaths = (data: any[]) => {
        if (data.length === 0) return { areaPath: '', linePath: '', points: [] };

        const width = 1000;
        const height = 200;

        // Re-calc points with proper Min/Max
        const allRois = data.map(d => d.roi);
        const safeMn = Math.min(...allRois, 80);
        const safeMx = Math.max(...allRois, 120);
        const rng = safeMx - safeMn;

        const paddingY = 30; // Prevents points from touching top/bottom
        const availableHeight = height - (paddingY * 2);

        const finalPoints = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const normalized = (d.roi - safeMn) / (rng || 1); // Avoid div zero
            const y = (height - paddingY) - (normalized * availableHeight);
            return { x, y, roi: d.roi };
        });

        const pathOps = finalPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
        const areaPath = `${pathOps} L ${width},${height} L 0,${height} Z`;

        return { areaPath, linePath: pathOps, points: finalPoints };
    };

    // 3. Determine Visible Periods
    const visiblePeriods = useMemo(() => {
        if (allBets.length === 0) return ['Alla'];

        const now = new Date();
        const getCount = (months: number) => {
            const cutoff = new Date();
            cutoff.setMonth(now.getMonth() - months);
            return allBets.filter(b => b.rawDate >= cutoff).length;
        };

        const c3 = getCount(3);
        const c6 = getCount(6);
        const c12 = getCount(12);
        const cAll = allBets.length;

        const periods = ['3 mån'];

        if (c6 > c3) periods.push('6 mån');
        if (c12 > c6) periods.push('12 mån');

        // Always show Alla if it has more than the last added period
        // Or just always show it? User logic implies "when we cross over".
        // Let's always show 'Alla' to be safe, or only if distinct?
        // If 12m is hidden (because c12 == c6) and c6 is hidden (c6 == c3), then Alla (cAll) might differ.
        if (cAll > c3) periods.push('Alla'); // Minimal check to avoid duplicate if Alla == 3m

        // If we only have 3m data, periods is ['3 mån'].
        // But user might want to see "Alla" as a concept.
        // Let's stick to: Always show Alla.
        if (!periods.includes('Alla')) periods.push('Alla');

        // Deduplicate just in case
        return [...new Set(periods)];
    }, [allBets]);

    // Ensure selected period is visible
    useEffect(() => {
        if (visiblePeriods.length > 0 && !visiblePeriods.includes(selectedPeriod)) {
            setSelectedPeriod(visiblePeriods.includes('Alla') ? 'Alla' : visiblePeriods[0]);
        }
    }, [visiblePeriods, selectedPeriod]);

    const { areaPath, linePath, points } = useMemo(() => generateChartPaths(chartData), [chartData]);
    const recentBets = filteredBets.slice(0, 5);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12" translate="no">

            {/* 1. Header Section */}
            <div className="text-center space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                    Våra Resultat
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Vi tror på total transparens. Här redovisar vi varje spel, varje vinst och varje förlust.
                    Siffror som bygger förtroende.
                </p>
            </div>

            {/* 2. KPI Cards - Big & Bold */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ROI Card */}
                <div className="relative overflow-hidden rounded-3xl p-8 bg-[#162230]/40 backdrop-blur-xl border border-white/5 shadow-2xl group hover:border-[#2FAE8F]/30 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2FAE8F]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#2FAE8F]/20 transition-all"></div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">ROI ({selectedPeriod})</span>

                        </div>
                        <div>
                            <div>
                                <div className="text-3xl font-black text-white tracking-tighter mb-2">
                                    {filteredStats.roi.toFixed(1)}%
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className={`flex items-center font-bold px-2 py-0.5 rounded ${filteredStats.roi >= 100 ? 'text-[#2FAE8F] bg-[#2FAE8F]/10' : 'text-red-400 bg-red-400/10'}`}>
                                        {filteredStats.roi >= 100 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                        {filteredStats.roi.toFixed(1)}%
                                    </span>
                                    <span className="text-gray-500">Total ROI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hit Rate Card */}
                <div className="relative overflow-hidden rounded-3xl p-8 bg-[#162230]/40 backdrop-blur-xl border border-white/5 shadow-2xl group hover:border-[#4A90E2]/30 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A90E2]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#4A90E2]/20 transition-all"></div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Träffsäkerhet</span>

                        </div>
                        <div>
                            <div>
                                <div className="text-3xl font-black text-white tracking-tighter mb-2">
                                    {Math.round(filteredStats.hitRate)}%
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-400">Vinster på {filteredStats.totalBets} lagda spel</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Net Profit Card */}
                <div className="relative overflow-hidden rounded-3xl p-8 bg-[#162230]/40 backdrop-blur-xl border border-white/5 shadow-2xl group hover:border-[#C9A86A]/30 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A86A]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#C9A86A]/20 transition-all"></div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Netto Vinst</span>

                        </div>
                        <div>
                            <div>
                                <div className={`text-3xl font-black tracking-tighter mb-2 ${filteredStats.netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
                                    {filteredStats.netProfit > 0 ? '+' : ''}{filteredStats.netProfit.toFixed(1)}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className={`flex items-center font-bold px-2 py-0.5 rounded ${filteredStats.netProfit >= 0 ? 'text-[#2FAE8F] bg-[#2FAE8F]/10' : 'text-red-400 bg-red-400/10'}`}>
                                        {filteredStats.netProfit >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                        Nettoresultat
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Performance Graph Section */}
            <div className="rounded-3xl p-8 bg-[#162230]/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Utveckling över tid (ROI)</h3>

                    </div>
                    {/* Timeframe Selector */}
                    <div className="flex bg-black/20 p-1 rounded-lg">
                        {visiblePeriods.map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedPeriod === period ? 'bg-[#2a7259] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SVG Chart */}
                <div className="h-64 w-full relative">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-600 pointer-events-none">
                        <div className="w-full border-b border-white/5 h-0 relative"><span className="absolute -top-3 left-0">140%</span></div>
                        <div className="w-full border-b border-white/5 h-0 relative"><span className="absolute -top-3 left-0">130%</span></div>
                        <div className="w-full border-b border-white/5 h-0 relative"><span className="absolute -top-3 left-0">120%</span></div>
                        <div className="w-full border-b border-white/5 h-0 relative"><span className="absolute -top-3 left-0">110%</span></div>
                        <div className="w-full border-b border-white/5 h-0 relative"><span className="absolute -top-3 left-0">100%</span></div>
                    </div>

                    {/* Chart Line */}
                    <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 1000 200" preserveAspectRatio="none">
                        {/* Gradient Defs */}
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#2a7259" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#2a7259" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2a7259" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#2FAE8F" stopOpacity="0" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Area */}
                        <path
                            d={areaPath}
                            fill="url(#fillGradient)"
                            className="transition-all duration-300 ease-in-out"
                        />

                        {/* Line */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow)"
                            className="transition-all duration-300 ease-in-out"
                        />

                        {/* Points */}
                        {points.map((p, i) => (
                            <g key={i} className="group/point">
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="4"
                                    fill="#162230"
                                    stroke="#2a7259"
                                    strokeWidth="2"
                                    className="transition-all duration-300 ease-in-out"
                                />
                                {/* Tooltip on hover */}
                                <g className="opacity-0 group-hover/point:opacity-100 transition-opacity">
                                    <rect x={p.x - 20} y={p.y - 30} width="40" height="20" rx="4" fill="#2a7259" />
                                    <text x={p.x} y={p.y - 16} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                                        {Number(p.roi).toFixed(1)}%
                                    </text>
                                </g>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* 4. Recent Actions / Bets Log */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        Senaste Spel
                    </h3>
                    <button
                        onClick={() => setIsAllBetsModalOpen(true)}
                        className="text-sm font-medium text-[#2FAE8F] hover:text-white transition-colors"
                    >
                        Visa alla spel →
                    </button>
                </div>

                <div className="rounded-3xl overflow-hidden border border-white/5 bg-[#162230]/40 backdrop-blur-xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="p-4 pl-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Datum</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Häst</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Spelform</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Odds</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Resultat</th>
                                    <th className="p-4 pr-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Netto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentBets.map((bet, index) => (
                                    <tr key={index} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4 pl-6 text-sm font-medium text-gray-400">{bet.date}</td>
                                        <td className="p-4 text-sm font-bold text-white">{bet.horse}</td>
                                        <td className="p-4 text-sm text-gray-300">
                                            <span className="px-2 py-1 rounded bg-[#162230] border border-white/10 text-xs">
                                                {bet.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-white text-right text-[#F5A623]">{bet.odds}</td>
                                        <td className="p-4 text-center">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${bet.result === 'Win'
                                                ? 'bg-[#2FAE8F]/10 border-[#2FAE8F]/20 text-[#2FAE8F]'
                                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                                                }`}>
                                                {bet.result === 'Win' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{bet.result}</span>
                                            </div>
                                        </td>
                                        <td className={`p-4 pr-6 text-sm font-bold text-right ${bet.result === 'Win' ? 'text-[#2FAE8F]' : 'text-red-500'
                                            }`}>
                                            {bet.profit}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AllBetsModal
                isOpen={isAllBetsModalOpen}
                onClose={() => setIsAllBetsModalOpen(false)}
                bets={allBets}
            />
        </div>
    );
};
