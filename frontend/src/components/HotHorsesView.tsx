
import { useState, useEffect } from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import { HorseDetailsModalV2 } from './HorseDetailsModalV2';
import { supabase } from '../lib/supabase';

export const HotHorsesView = () => {
    const [selectedHorse, setSelectedHorse] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [stableHorses, setStableHorses] = useState<any[]>([]);
    const [longshotHorses, setLongshotHorses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAndCalculateHotHorses();
    }, []);

    async function fetchAndCalculateHotHorses() {
        setLoading(true);
        // Fetch last 60 days of picks to calculate form
        const today = new Date();
        const sixtyDaysAgo = new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

        const { data: picks, error } = await supabase
            .from('daily_picks')
            .select('*')
            .gte('race_date', sixtyDaysAgo)
            .order('race_date', { ascending: false });

        if (error || !picks) {
            console.error('Error fetching picks for Hot Horses:', error);
            setLoading(false);
            return;
        }

        // Aggregate by Horse
        const horseStats: { [key: string]: any } = {};

        picks.forEach(pick => {
            if (!pick.horse_name) return;
            const name = pick.horse_name;

            if (!horseStats[name]) {
                horseStats[name] = {
                    name: name,
                    totalBets: 0,
                    wins: 0,
                    totalStake: 0,
                    totalReturn: 0,
                    oddsSum: 0,
                    oddsCount: 0,
                    maxOdds: 0,
                    lastPlayed: `${pick.track_name || '-'} · ${pick.race_date.substring(5)}`,
                    analysis: pick.final_output_message || pick.adam_notes || "Ingen analys.",
                    history: []
                };
            }

            // Parse Stake (e.g. "3 units" -> 3)
            let stake = 1;
            if (pick.stake) {
                const match = pick.stake.match(/(\d+)/);
                if (match) stake = parseInt(match[0], 10);
            }

            // Parse Net Result / Payout
            // Assuming net_result is profit/loss. 
            // result_payout is total return?
            // Let's rely on result_payout if available, else infer from net_result?
            // A simple logic: if net_result > 0 -> Win.


            const net = pick.net_result || 0;

            horseStats[name].totalBets++;
            horseStats[name].totalStake += stake;
            horseStats[name].totalReturn += (stake + net); // Approximate if net_result is pure profit

            if (net > 0) {
                horseStats[name].wins++;
            }

            if (pick.odds) {
                const odds = parseFloat(pick.odds);
                if (!isNaN(odds)) {
                    horseStats[name].oddsSum += odds;
                    horseStats[name].oddsCount++;
                    if (odds > horseStats[name].maxOdds) horseStats[name].maxOdds = odds;
                }
            }
        });

        // Calculate ROI and Format
        const allHorses = Object.values(horseStats).map(h => {
            const roiVal = h.totalStake > 0 ? ((h.totalReturn - h.totalStake) / h.totalStake) * 100 : 0;
            const avgOdds = h.oddsCount > 0 ? (h.oddsSum / h.oddsCount).toFixed(2) : "-";

            return {
                ...h,
                roi: roiVal > 0 ? `+${Math.round(roiVal)}%` : `${Math.round(roiVal)}%`,
                roiNumber: roiVal,
                avgOdds: avgOdds,
                trend: roiVal > 50 ? 'up' : 'stable',
                bestOdds: h.maxOdds > 0 ? h.maxOdds.toFixed(2) : "-"
            };
        });

        // Filter and Sort for "Stabila Vinnare" (High ROI, > 1 bet)
        const stable = allHorses
            .filter(h => h.totalBets >= 1 && h.roiNumber > 0)
            .sort((a, b) => b.roiNumber - a.roiNumber)
            .slice(0, 5);

        // Filter and Sort for "Skrällkollen" (High Odds Wins?)
        // Let's prioritize High Max Odds AND Net Win
        const longshots = allHorses
            .filter(h => h.maxOdds > 10 && h.wins > 0)
            .sort((a, b) => b.maxOdds - a.maxOdds)
            .slice(0, 5);

        // If no specifically high odds winners, just take high ROI with fewer bets?
        // Fallback: Just next best ROI
        if (longshots.length === 0) {
            const others = allHorses
                .filter(h => !stable.includes(h) && h.roiNumber > 0)
                .sort((a, b) => b.roiNumber - a.roiNumber)
                .slice(0, 5);
            setLongshotHorses(others);
        } else {
            setLongshotHorses(longshots);
        }

        setStableHorses(stable);
        setLoading(false);
    }

    const handleHorseClick = (horse: any) => {
        setSelectedHorse(horse);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="p-10 text-center text-gray-500 animate-pulse">Laddar heta hästar...</div>;
    }

    return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-500 pb-20">
            {/* Modal */}
            <HorseDetailsModalV2
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedHorse}
            />

            {/* 1. Hero Section */}
            <div className="relative w-full rounded-3xl p-6 md:p-10 overflow-hidden bg-[#162230]/40 border border-white/5 shadow-2xl">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2FAE8F]/10 to-blue-900/10 opacity-30"></div>
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#2FAE8F]/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                    <div className="mb-6 p-3 rounded-full bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 shadow-[0_0_15px_rgba(47,174,143,0.2)]">
                        <Flame className="w-8 h-8 text-[#2FAE8F]" />
                    </div>

                    <h2 className="text-2xl md:text-3xl md:text-4xl font-black text-white tracking-tight mb-4 drop-shadow-xl">
                        Heta Hästar
                    </h2>

                    <p className="text-lg text-gray-300 leading-relaxed font-light mb-8 max-w-2xl">
                        Hästar som just nu levererar bäst enligt PrimeBets modell, baserat på faktisk ROI och resultat de senaste 60 dagarna.
                    </p>
                </div>
            </div>

            {/* 2. Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Stable ROI */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2 px-2">
                        <div className="p-2 rounded-lg bg-[#2FAE8F]/10 border border-[#2FAE8F]/20">
                            <TrendingUp className="w-5 h-5 text-[#2FAE8F]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Stabila Vinnare</h3>
                            <p className="text-xs text-gray-400">Högst ROI senaste perioden</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {stableHorses.length === 0 ? (
                            <div className="p-6 rounded-xl bg-[#162230]/40 text-center text-gray-500 text-sm">Ingen data tillgänglig just nu.</div>
                        ) : stableHorses.map((horse, i) => (
                            <div
                                key={i}
                                onClick={() => handleHorseClick(horse)}
                                className="group cursor-pointer p-4 md:p-5 rounded-xl bg-[#162230]/40 border border-white/5 hover:border-[#2FAE8F]/30 hover:bg-[#162230]/60 transition-all duration-300 flex items-center justify-between shadow-lg"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg font-bold text-white group-hover:text-[#2FAE8F] transition-colors">{horse.name}</span>
                                        {horse.trend === 'up' && <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">▲</span>}
                                    </div>
                                    <div className="text-xs text-gray-500">{horse.lastPlayed}</div>
                                </div>
                                <div className="text-right">
                                    <div className="mb-0.5 flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">ROI</span>
                                        <span className="text-xl font-black text-[#2FAE8F]">{horse.roi}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Longshots */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2 px-2">
                        <div className="p-2 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20">
                            <Flame className="w-5 h-5 text-[#F5A623]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Skrällkollen</h3>
                            <p className="text-xs text-gray-400">Högoddsare med vinst</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {longshotHorses.length === 0 ? (
                            <div className="p-6 rounded-xl bg-[#162230]/40 text-center text-gray-500 text-sm">Inga skrällar registrerade än.</div>
                        ) : longshotHorses.map((horse, i) => (
                            <div
                                key={i}
                                onClick={() => handleHorseClick(horse)}
                                className="group cursor-pointer p-5 rounded-xl bg-[#162230]/40 border border-white/5 hover:border-[#F5A623]/30 hover:bg-[#162230]/60 transition-all duration-300 flex items-center justify-between shadow-lg"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg font-bold text-white group-hover:text-[#F5A623] transition-colors">{horse.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{horse.lastPlayed}</div>
                                </div>
                                <div className="text-right">
                                    <div className="mb-0.5 flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Snittodds</span>
                                        <span className="text-xl font-black text-[#F5A623]">{horse.avgOdds}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
