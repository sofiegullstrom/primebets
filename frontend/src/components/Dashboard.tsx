import { useState, useEffect, useRef, Fragment } from 'react';
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Pick } from '../types';
import { ArrowRight, Trophy, TrendingUp, Flame, Calendar, Target, Bell, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { HotHorsesView } from './HotHorsesView';
import { AnalysisView } from './AnalysisView';
import { CalendarView } from './CalendarView';
import { openBookmaker } from '../lib/bookmakerUtils';
import { PremiumAnalysisModal } from './PremiumAnalysisModal';
import { InterestingPicksList } from './InterestingPicksList';
import { Navbar } from './Navbar';
import { PrimePickDashboardCard } from './PrimePickDashboardCard';
import { SaturdayPickCard } from './SaturdayPickCard';
import { LatestWinCard } from './LatestWinCard';
import { WeeklyScoutCard } from './WeeklyScoutCard';
import { HockeyPickCard } from './HockeyPickCard';

import { LongTermBetCard } from './LongTermBetCard';

type TabType = 'Dashboard' | 'Heta hästar' | 'Analys' | 'Kalender';

export function Dashboard({ session }: { session: Session | null }) {
    const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
    const [showModal, setShowModal] = useState(false);
    const [modalIsClosed, setModalIsClosed] = useState(false);
    const [hasCelebrated, setHasCelebrated] = useState(false);
    const primePickCardRef = useRef<HTMLElement>(null);

    // Subscription Modal
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeConsent, setSubscribeConsent] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subscribeEmail || !subscribeConsent) return;
        setSubscribeStatus('loading');

        try {
            const { error } = await supabase.from('subscribers').insert({
                email: subscribeEmail,
                consent_given: subscribeConsent
            });

            if (error) {
                if (error.code === '23505') {
                    setSubscribeStatus('success');
                } else {
                    throw error;
                }
            } else {
                setSubscribeStatus('success');
            }

            setTimeout(() => {
                setIsSubscribeOpen(false);
                setSubscribeStatus('idle');
                setSubscribeEmail('');
                setSubscribeConsent(false);
            }, 3000);
        } catch (err) {
            console.error('Subscription error:', err);
            setSubscribeStatus('error');
        }
    };

    // Data States
    const [picks, setPicks] = useState<Pick[]>([]);
    const [saturdayPicks, setSaturdayPicks] = useState<any[]>([]);
    const [weeklyScout, setWeeklyScout] = useState<any>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [prioritizedCalendarEvent, setPrioritizedCalendarEvent] = useState<any>(null);
    const [longTermBets, setLongTermBets] = useState<any[]>([]); // New State
    const [horseInfos, setHorseInfos] = useState<any[]>([]);
    const [hockeyPicks, setHockeyPicks] = useState<any[]>([]); // Hockey State

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (picks.length > 0) {
            const todayStr = new Date().toISOString().split('T')[0];
            const todaysPicks = picks.filter(p => p.race_date === todayStr);

            todaysPicks.sort((a, b) => {
                if ((a.prime_pick_rank || 99) !== (b.prime_pick_rank || 99)) {
                    return (a.prime_pick_rank || 99) - (b.prime_pick_rank || 99);
                }
                const stakeA = parseInt((a.stake || '0').toString().replace(/\D/g, '')) || 0;
                const stakeB = parseInt((b.stake || '0').toString().replace(/\D/g, '')) || 0;
                return stakeB - stakeA;
            });

            const primePick = todaysPicks.length > 0 ? todaysPicks[0] : null;

            if (primePick && !hasCelebrated) {
                const isWin = (primePick.net_result && Number(primePick.net_result) > 0) ||
                    (primePick.status && ['won', 'vinst', 'win'].includes(primePick.status.toLowerCase()));

                if (isWin) {
                    setTimeout(() => {
                        let x = 0.5;
                        let y = 0.5;

                        if (primePickCardRef.current) {
                            const rect = primePickCardRef.current.getBoundingClientRect();
                            x = (rect.left + rect.width / 2) / window.innerWidth;
                            y = (rect.top + rect.height / 2) / window.innerHeight;
                        }

                        const shoot = () => {
                            confetti({
                                particleCount: 150,
                                spread: 100,
                                origin: { x, y },
                                colors: ['#2FAE8F', '#ffffff', '#F59E0B'],
                                zIndex: 2000,
                                ticks: 200,
                                gravity: 0.8,
                                scalar: 1.2,
                                drift: 0,
                                startVelocity: 45,
                                decay: 0.9,
                                shapes: ['circle', 'square']
                            });
                        };

                        shoot();
                        setHasCelebrated(true);
                    }, 500);
                }
            }
        }
    }, [picks]);

    async function fetchAllData() {
        const todayStr = new Date().toISOString().split('T')[0];

        // 1. Fetch Daily Picks
        const { data: dailyData } = await supabase
            .from('daily_picks')
            .select('*')
            .order('prime_pick_rank', { ascending: true })
            .order('race_date', { ascending: false });

        if (dailyData) {
            setPicks(dailyData as Pick[]);

            const horseIds = dailyData.map((d: any) => d.horse_id).filter((id: any) => id);
            if (horseIds.length > 0) {
                const { data: hInfo } = await supabase
                    .from('horse_info')
                    .select('*')
                    .in('id', horseIds);

                if (hInfo) setHorseInfos(hInfo);
            }
        }

        // 2. Fetch Saturday Picks
        const { data: satData } = await supabase
            .from('saturday_picks')
            .select('*')
            .order('race_date', { ascending: false })
            .limit(1);

        if (satData && satData.length > 0) {
            setSaturdayPicks(satData);
        }

        // 3. Fetch Weekly Scout
        const { data: weeklyData } = await supabase
            .from('weekly_scout')
            .select('*')
            .gte('race_date', todayStr)
            .order('race_date', { ascending: true })
            .limit(1)
            .single();

        if (weeklyData) {
            setWeeklyScout(weeklyData);
        }

        // 4. Fetch Calendar Overrides
        const { data: calendarData } = await supabase
            .from('calendar_events')
            .select('*')
            .eq('race_date', todayStr)
            .eq('replace_primepick', true)
            .limit(1)
            .single();

        if (calendarData) {
            setPrioritizedCalendarEvent(calendarData);
        }

        // 5. Fetch Long Term Bets (Upcoming 7 days or specifically marked)
        const aWeekFromNow = new Date();
        aWeekFromNow.setDate(aWeekFromNow.getDate() + 30); // Check 30 days ahead
        const aWeekFromNowStr = aWeekFromNow.toISOString().split('T')[0];

        const { data: longTermData } = await supabase
            .from('calendar_events')
            .select('*')
            .in('type', ['Långtidsspel', 'Stort spel', 'Säsongstopp'])
            .gte('race_date', todayStr)
            .lte('race_date', aWeekFromNowStr) // Only show if approaching within 10 days
            .order('race_date', { ascending: true })
            .limit(1);

        if (longTermData && longTermData.length > 0) {
            setLongTermBets(longTermData);
        }

        // 6. Fetch Hockey Picks
        const { data: hockeyData } = await supabase
            .from('hockey_games')
            .select('*')
            .gte('game_date', todayStr)
            .order('game_date', { ascending: true });

        if (hockeyData) {
            setHockeyPicks(hockeyData);
        }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysPicks = picks.filter(p => p.race_date === todayStr);

    todaysPicks.sort((a, b) => {
        if ((a.prime_pick_rank || 99) !== (b.prime_pick_rank || 99)) {
            return (a.prime_pick_rank || 99) - (b.prime_pick_rank || 99);
        }
        const stakeA = parseInt((a.stake || '0').toString().replace(/\D/g, '')) || 0;
        const stakeB = parseInt((b.stake || '0').toString().replace(/\D/g, '')) || 0;
        return stakeB - stakeA;
    });

    const primePick = todaysPicks.length > 0 ? todaysPicks[0] : null;

    const interestingPicks = todaysPicks.length > 1 ? todaysPicks.slice(1) : [];
    const saturdayPick = saturdayPicks.length > 0 ? saturdayPicks[0] : null;

    const latestWin = (() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const candidates = picks
            .filter(p => {
                const pDate = new Date(p.race_date);
                const isNotToday = !p.race_date.includes(todayStr);
                const isWin = (p.net_result || 0) > 0 || (p.result_payout || 0) > 0 || p.status === 'won';
                const isRecent = pDate >= thirtyDaysAgo;
                return isNotToday && isWin && isRecent;
            })
            .map(p => {
                let stake = 1;
                if (p.stake) {
                    const match = p.stake.match(/(\d+)/);
                    if (match) stake = parseInt(match[0], 10);
                }
                const net = p.net_result || 0;
                const roiVal = stake > 0 ? (net / stake) * 100 : 0;
                return { ...p, roiVal };
            });

        candidates.sort((a, b) => new Date(b.race_date).getTime() - new Date(a.race_date).getTime());

        const bestPick = candidates[0];

        if (!bestPick) return null;

        const parts = bestPick.race_date.split('-');
        const pickDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(todayDate.getTime() - pickDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let periodLabel = "Månad";
        if (diffDays === 1) {
            periodLabel = "Gårdag";
        } else if (diffDays <= 7) {
            periodLabel = "Vecka";
        }

        const roi = bestPick.roiVal > 0 ? `+${Math.round(bestPick.roiVal)}%` : `${Math.round(bestPick.roiVal)}%`;

        return { ...bestPick, roi, periodLabel };
    })();

    const openAnalysisModal = (pick: Pick | any, closed: boolean = false) => {
        const dynamicTags = ['TRAV'];
        if (pick.bet_type) dynamicTags.push(pick.bet_type.toUpperCase());
        if (pick.start_method) dynamicTags.push(pick.start_method.toUpperCase());

        const mappedData = {
            horseName: pick.horse_name,
            tags: dynamicTags,
            odds: pick.odds?.toString() || '-',
            units: pick.stake || '-',
            value: pick.value_percent ? `${pick.value_percent < 1 ? Math.round(pick.value_percent * 100) : Math.round(pick.value_percent)}%` : '-',
            type: pick.bet_type || 'Vinnare',
            motivationBold: "Analys",
            motivationBody: pick.final_output_message || pick.adam_notes || "Ingen analys tillgänglig.",
            stats: [
                { label: "Kusk", value: horseInfos.find(h => h.id === pick.horse_id)?.default_driver || '-' },
                { label: "Spelform", value: pick.bet_type || '-' },
                { label: "Distans", value: pick.distance || '-' }
            ],
            interview: pick.interview_info || "",
            bookmaker: pick.bookmaker,
            horseDetails: horseInfos.find(h => h.id === pick.horse_id),
            driver: pick.driver || horseInfos.find(h => h.id === pick.horse_id)?.default_driver || '-',
            isFinished: pick.status 
                ? ['won', 'vinst', 'win', 'lost', 'förlust', 'loss', 'void', 'struken', 'refunded'].includes(pick.status.toLowerCase())
                : (pick.net_result !== null && pick.net_result !== undefined && Number(pick.net_result) !== 0)
        };

        // Hockey specific override
        if (pick.sport === 'Hockey') {
            mappedData.type = pick.bet_selection;
            mappedData.motivationBold = pick.match_name;
            mappedData.motivationBody = pick.motivation;
            mappedData.stats = [
                { label: "Liga", value: pick.league },
                { label: "Match", value: pick.match_name },
                { label: "Datum", value: pick.game_date }
            ];
            mappedData.tags = ['HOCKEY', pick.league.toUpperCase()];
        }

        setModalData(mappedData);
        setShowModal(true);
        setModalIsClosed(closed);
    };

    const tabs = [
        { id: 'Dashboard', icon: Trophy },
        { id: 'Heta hästar', icon: Flame },
        { id: 'Analys', icon: TrendingUp },
        { id: 'Kalender', icon: Calendar },
    ];

    return (
        <div className="min-h-screen relative bg-[#0F1720] font-sans text-white">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="/stadium-bg.png"
                    alt="Atmospheric Stadium Background"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-[#0F1720]/20"></div>
            </div>

            <div className="relative z-10">
                <Helmet>
                    <title>Dashboard | PrimeBets - AI-drivna Travtips</title>
                    <meta name="description" content="Se dagens bästa speltips för V75 och trav." />
                </Helmet>

                <Navbar session={session} />

                <main className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="sr-only">PrimeBets Dashboard</h1>

                    <div className="w-full mb-12 relative z-20">
                        <div className="flex flex-col sm:flex-row items-center justify-between p-1 sm:p-2 rounded-2xl bg-[#162230]/60 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="grid grid-cols-2 md:flex md:items-center md:justify-center w-full gap-3 sm:gap-4">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabType)}
                                            className={`
                                                relative group flex items-center justify-center gap-2 px-3 py-3 sm:px-6 sm:py-4 rounded-xl transition-all duration-300
                                                ${isActive ? 'bg-white/5 sm:bg-transparent text-[#2FAE8F] sm:min-w-[140px]' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}
                                            `}
                                        >
                                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(47,174,143,0.5)]' : 'group-hover:scale-110'}`} />
                                            <span className={`font-bold text-xs sm:text-sm tracking-wide ${isActive ? '' : 'font-medium'}`}>{tab.id}</span>
                                            {isActive && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-[#2FAE8F] rounded-full shadow-[0_0_8px_#2FAE8F]"></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {activeTab === 'Dashboard' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Determine Layout Logic */}
                            {(() => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const hasSaturdayPick = saturdayPick && new Date(saturdayPick.race_date) >= today;
                                const hasInterestingPicks = interestingPicks.length > 0;
                                const hasLongTerm = longTermBets.length > 0;
                                const upcomingHockey = hockeyPicks.find(h => h.category === 'upcoming' || (h.category === 'daily' && h.game_date > todayStr));

                                // 1. Determine Top Right Card Candidate
                                let topRightType = 'none';
                                if (hasSaturdayPick) topRightType = 'saturday';
                                else if (latestWin && !hasInterestingPicks) topRightType = 'latestWin'; // Prefer Latest Win if no Interesting Picks interfering
                                else if (latestWin) topRightType = 'latestWin'; // Default to Latest Win as secondary hero if nothing else? User said 'under interesting' if interesting exists. 
                                // Let's refine strict user rule: "om vi har intressanta spel så ska senaste heta ligga under dom"
                                // If LatestWin is Top Right, it is visually 'above' interesting picks (which are section 3).
                                // So strictly, if hasInterestingPicks, LatestWin CANNOT be Top Right?
                                // Let's try: If hasSaturday -> Sat. Else If !hasInteresting -> LatestWin. Else If hasLongTerm -> LongTerm.
                                // If no LongTerm/Hockey -> PlaceHolder.
                                // This seems correct per instructions.

                                if (hasSaturdayPick) topRightType = 'saturday';
                                else if (latestWin && !hasInterestingPicks) topRightType = 'latestWin';
                                else if (hasLongTerm) topRightType = 'longTerm';
                                else if (upcomingHockey) topRightType = 'hockey';
                                else if (!hasSaturdayPick && latestWin) topRightType = 'latestWin'; // Fallback to LatestWin if nothing else fits (better than placeholder)

                                // 2. Determine Latest Win Placement
                                let latestWinPlacement = 'none';
                                if (latestWin && topRightType !== 'latestWin') {
                                    if (hasInterestingPicks) latestWinPlacement = 'bottom';
                                    else latestWinPlacement = 'left';
                                }

                                return (
                                    <>
                                        {/* ROW 1: PRIME PICK & TOP RIGHT HERO (Equal Height) */}
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-6 mt-8 items-stretch">
                                            {/* LEFT: Prime Pick of the Day */}
                                            <div className="h-full">
                                                <PrimePickDashboardCard
                                                    prioritizedCalendarEvent={prioritizedCalendarEvent}
                                                    primePick={primePick}
                                                    hasCelebrated={hasCelebrated}
                                                    primePickCardRef={primePickCardRef}
                                                    openBookmaker={openBookmaker}
                                                    openAnalysisModal={openAnalysisModal}
                                                    setIsSubscribeOpen={setIsSubscribeOpen}
                                                />
                                            </div>

                                            {/* RIGHT: Hero Card */}
                                            <div className="h-full flex flex-col">
                                                {topRightType === 'saturday' && saturdayPick && (
                                                    <SaturdayPickCard
                                                        saturdayPick={saturdayPick}
                                                        openBookmaker={openBookmaker}
                                                        openAnalysisModal={openAnalysisModal}
                                                    />
                                                )}
                                                {topRightType === 'latestWin' && latestWin && (
                                                    <LatestWinCard
                                                        latestWin={latestWin}
                                                        openAnalysisModal={openAnalysisModal}
                                                    />
                                                )}
                                                {topRightType === 'longTerm' && longTermBets[0] && (
                                                    <LongTermBetCard
                                                        event={longTermBets[0]}
                                                        onReadMore={(event) => {
                                                            setModalData({
                                                                horseName: event.horse_name || event.title,
                                                                tags: [event.type === 'Stort spel' ? 'Event' : event.type || 'Långtidsspel'],
                                                                odds: event.odds?.toString() || '-',
                                                                units: event.stake || '-',
                                                                value: event.value_percentage ? `+${event.value_percentage}%` : (event.value || '-'),
                                                                type: event.bet_type || 'Event',
                                                                motivationBold: event.title,
                                                                motivationBody: [event.motivation, event.detailed_description].filter(Boolean).join('\n\n') || event.description,
                                                                stats: [
                                                                    { label: 'Plats', value: event.location || 'Sverige' },
                                                                    { label: 'Datum', value: new Date(event.race_date).toLocaleDateString('sv-SE') }
                                                                ],
                                                                interview: '',
                                                                isFinished: false,
                                                                horseDetails: event.driver ? {
                                                                    default_driver: event.driver
                                                                } : undefined
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                    />
                                                )}
                                                {topRightType === 'hockey' && upcomingHockey && (
                                                    <HockeyPickCard
                                                        key={upcomingHockey.id}
                                                        pick={upcomingHockey}
                                                        openBookmaker={openBookmaker}
                                                        openAnalysisModal={openAnalysisModal}
                                                    />
                                                )}
                                                {topRightType === 'none' && (
                                                    <div className="hidden xl:block opacity-30 rounded-3xl border border-white/5 bg-[#162230]/20 h-full min-h-[420px] flex items-center justify-center text-gray-600 font-medium italic">
                                                        Fler speltips kommer snart...
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dagens Hockey - Render in separate section below top grid if exists */}
                                        {hockeyPicks.filter(h => h.category === 'daily' && h.game_date === todayStr).length > 0 && (
                                            <div className="mb-6">
                                                {hockeyPicks.filter(h => h.category === 'daily' && h.game_date === todayStr).map(hockeyPick => (
                                                    <HockeyPickCard
                                                        key={hockeyPick.id}
                                                        pick={hockeyPick}
                                                        openBookmaker={openBookmaker}
                                                        openAnalysisModal={openAnalysisModal}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* ROW 2: SECONDARY CONTENT (Latest Win Left Fallback + Right Stack) */}
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-12 items-start">
                                            {/* LEFT COL ROW 2 */}
                                            <div className="flex flex-col gap-6">
                                                {/* If Latest Win placed here */}
                                                {latestWinPlacement === 'left' && latestWin && (
                                                    <LatestWinCard
                                                        latestWin={latestWin}
                                                        openAnalysisModal={openAnalysisModal}
                                                    />
                                                )}
                                                {/* Otherwise Empty Spacer to keep grid structure */}
                                                {!topRightType && latestWinPlacement !== 'left' && <div className="hidden xl:block"></div>}
                                            </div>

                                            {/* RIGHT COL ROW 2 (The Stack) */}
                                            <div className="flex flex-col gap-6 w-full">
                                                {/* Long Term (if not Top Right) */}
                                                {longTermBets.length > 0 && topRightType !== 'longTerm' && (
                                                    <LongTermBetCard
                                                        event={longTermBets[0]}
                                                        onReadMore={(event) => {
                                                            setModalData({
                                                                horseName: event.horse_name || event.title,
                                                                tags: [event.type === 'Stort spel' ? 'Event' : event.type || 'Långtidsspel'],
                                                                odds: event.odds?.toString() || '-',
                                                                units: event.stake || '-',
                                                                value: event.value_percentage ? `+${event.value_percentage}%` : (event.value || '-'),
                                                                type: event.bet_type || 'Event',
                                                                motivationBold: event.title,
                                                                motivationBody: [event.motivation, event.detailed_description].filter(Boolean).join('\n\n') || event.description,
                                                                stats: [
                                                                    { label: 'Plats', value: event.location || 'Sverige' },
                                                                    { label: 'Datum', value: new Date(event.race_date).toLocaleDateString('sv-SE') }
                                                                ],
                                                                interview: '',
                                                                isFinished: false,
                                                                horseDetails: event.driver ? {
                                                                    default_driver: event.driver
                                                                } : undefined
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                    />
                                                )}

                                                {/* Hockey Upcoming (all except the one potentially used as Top Right) */}
                                                {hockeyPicks.filter(h => h.category === 'upcoming' || (h.category === 'daily' && h.game_date > todayStr)).map(h => {
                                                    if (topRightType === 'hockey' && upcomingHockey && h.id === upcomingHockey.id) return null; // Skip if used
                                                    return (
                                                        <HockeyPickCard
                                                            key={h.id}
                                                            pick={h}
                                                            openBookmaker={openBookmaker}
                                                            openAnalysisModal={openAnalysisModal}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* SECTION 3: INTERESTING PICKS */}
                                        <div className="mt-12 mb-12">
                                            <InterestingPicksList
                                                picks={interestingPicks}
                                                openBookmaker={openBookmaker}
                                                openAnalysisModal={openAnalysisModal}
                                            />
                                        </div>

                                        {/* SECTION 4: LATEST WIN (Bottom Placement) */}
                                        {latestWinPlacement === 'bottom' && latestWin && (
                                            <div className="mb-12 max-w-xl mx-auto xl:mx-0">
                                                <LatestWinCard
                                                    latestWin={latestWin}
                                                    openAnalysisModal={openAnalysisModal}
                                                />
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            {/* Veckans Spaning Section */}
                            <WeeklyScoutCard
                                weeklyScout={weeklyScout}
                                openBookmaker={openBookmaker}
                                openAnalysisModal={openAnalysisModal}
                            />
                        </div>
                    )}

                    {activeTab === 'Heta hästar' && <HotHorsesView />}
                    {activeTab === 'Analys' && <AnalysisView />}
                    {activeTab === 'Kalender' && <CalendarView />}

                </main >

                <PremiumAnalysisModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    data={modalData || {}}
                    isClosed={modalIsClosed}
                />

                <Transition appear show={isSubscribeOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setIsSubscribeOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#162230] border border-white/10 p-8 text-left align-middle shadow-2xl transition-all relative">
                                        <div className="absolute top-0 right-0 p-4">
                                            <button onClick={() => setIsSubscribeOpen(false)} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-center mb-6 text-center">
                                            <div className="w-16 h-16 bg-[#2FAE8F]/10 rounded-full flex items-center justify-center mb-4">
                                                <Bell className="w-8 h-8 text-[#2FAE8F]" />
                                            </div>
                                            <Dialog.Title as="h3" className="text-2xl font-black text-white">
                                                Missa aldrig ett PrimePick
                                            </Dialog.Title>
                                        </div>

                                        {subscribeStatus === 'success' ? (
                                            <div className="text-center py-8">
                                                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500 mb-4 animate-bounce">
                                                    <Target className="w-8 h-8" />
                                                </div>
                                                <h4 className="text-white font-bold text-xl mb-2">Tack för din anmälan!</h4>
                                                <p className="text-gray-400">Vi meddelar dig så fort nästa spel släpps.</p>
                                                <button
                                                    onClick={() => setIsSubscribeOpen(false)}
                                                    className="mt-8 w-full py-3 rounded-lg bg-[#2FAE8F] text-white font-bold hover:bg-[#2FAE8F]/90 transition-colors"
                                                >
                                                    Stäng
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubscribe} className="space-y-4">
                                                <p className="text-center text-gray-400 mb-6">
                                                    Ange din e-postadress nedan för att få en notis direkt i din inbox när vi släpper dagens spel.
                                                </p>
                                                <div>
                                                    <label htmlFor="email" className="sr-only">E-post</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={subscribeEmail}
                                                        onChange={(e) => setSubscribeEmail(e.target.value)}
                                                        placeholder="din.email@exempel.se"
                                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2FAE8F]/50 transition-all font-medium"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                    <input
                                                        type="checkbox"
                                                        id="consent"
                                                        checked={subscribeConsent}
                                                        onChange={(e) => setSubscribeConsent(e.target.checked)}
                                                        className="mt-1 rounded bg-[#162230] border-white/20 text-[#2FAE8F] focus:ring-0 focus:ring-offset-0"
                                                        required
                                                    />
                                                    <label htmlFor="consent" className="text-xs text-gray-400 cursor-pointer select-none">
                                                        Jag godkänner att PrimeBets sparar min e-postadress för att skicka notiser om nya speltips. Du kan avregistrera dig när som helst.
                                                    </label>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={subscribeStatus === 'loading' || !subscribeConsent}
                                                    className="w-full py-3 rounded-xl bg-[#2FAE8F] hover:bg-[#2FAE8F]/90 text-white font-bold shadow-lg shadow-[#2FAE8F]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                                                >
                                                    {subscribeStatus === 'loading' ? (
                                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    ) : (
                                                        <>
                                                            <span>Prenumerera kostnadsfritt</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
}
