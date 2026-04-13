import { Helmet } from 'react-helmet-async'
import { Navbar } from './Navbar'
import { Session } from '@supabase/supabase-js'
import { ArrowRight, Trophy, Flame, TrendingUp, Calendar, X, Brain, Clock } from 'lucide-react'
import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { supabase } from '../lib/supabase'
import { HockeyPickCard } from './HockeyPickCard'
import { openBookmaker } from '../lib/bookmakerUtils'
import { PremiumAnalysisModal } from './PremiumAnalysisModal'
import { HockeyAiContest } from './HockeyAiContest'

export function HockeyDashboard({ session }: { session: Session | null }) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [hockeyPicks, setHockeyPicks] = useState<any[]>([])
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])

    // Stats State
    const [aiStats, setAiStats] = useState({ roi: 0, wins: 0 })
    const [adamStats, setAdamStats] = useState({ roi: 0, wins: 0 })
    const [recentResults, setRecentResults] = useState<any[]>([])

    // Tabs State
    const [activeTab, setActiveTab] = useState<'adam' | 'ai'>('adam')

    // Subscription State
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
    const [subscribeEmail, setSubscribeEmail] = useState('')
    const [subscribeConsent, setSubscribeConsent] = useState(false)
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    // Modal State
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState<any>(null)

    useEffect(() => {
        checkAccess()
    }, [session])

    const checkAccess = async () => {
        if (!session?.user) {
            setLoading(false)
            return
        }

        const adminEmails = ['sofie.g63@outlook.com', 'primebets.se@gmail.com', 'adam.sundqvistt@gmail.com'];
        if (session.user.email && adminEmails.includes(session.user.email)) {
            setIsAdmin(true)
            fetchHockeyData()
        } else {
            // Check DB role as fallback
            const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
            if (data?.role === 'admin') {
                setIsAdmin(true)
                fetchHockeyData()
            }
        }
        setLoading(false)
    }

    const fetchHockeyData = async () => {
        const today = new Date().toISOString().split('T')[0]

        // Fetch Hockey Games
        const { data: games } = await supabase
            .from('hockey_games')
            .select('*')
            .gte('game_date', today)
            .order('game_date', { ascending: true })

        if (games) setHockeyPicks(games)

        // Fetch History for Stats & Recent Results (Last 50 for stats, 5 for list)
        const { data: history } = await supabase
            .from('hockey_games')
            .select('*')
            .not('net_result', 'is', null)
            .order('game_date', { ascending: false })
            .limit(50)

        if (history && history.length > 0) {
            // Calculate Global Stats (or Adam's if we filter)
            const humanPicks = history.filter(h => h.source !== 'ai')
            const aiPicks = history.filter(h => h.source === 'ai')

            const calculateRoi = (picks: any[]) => {
                const net = picks.reduce((acc, curr) => acc + (curr.net_result || 0), 0)
                const stake = picks.length
                return stake > 0 ? (net / stake) * 100 : 0
            }

            const humanRoi = calculateRoi(humanPicks)
            const aiRoi = calculateRoi(aiPicks)

            const humanWins = humanPicks.filter(h => h.net_result > 0).length
            const aiWins = aiPicks.filter(h => h.net_result > 0).length

            setAdamStats({ roi: humanRoi, wins: humanWins })
            setAiStats({ roi: aiRoi, wins: aiWins })

            // For now, main stats reflect Adam (or combined? Let's stick to Adam)
            setRecentResults(history.slice(0, 5))
        }

        // Fetch Hockey-related Calendar Events
        const { data: events } = await supabase
            .from('calendar_events')
            .select('*')
            .ilike('motivation', '%hockey%')
            .gte('race_date', today)
            .limit(3)

        if (events) setUpcomingEvents(events)
    }

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!subscribeEmail || !subscribeConsent) return
        setSubscribeStatus('loading')

        try {
            const { error } = await supabase.from('subscribers').insert({
                email: subscribeEmail,
                consent_given: subscribeConsent,
                source: 'hockey_waitlist'
            })

            if (error && error.code !== '23505') throw error
            setSubscribeStatus('success')

            setTimeout(() => {
                setIsSubscribeOpen(false)
                setSubscribeStatus('idle')
                setSubscribeEmail('')
                setSubscribeConsent(false)
            }, 3000)
        } catch (err) {
            console.error('Subscription error:', err)
            setSubscribeStatus('error')
        }
    }

    const openAnalysisModal = (pick: any) => {
        setModalData({
            type: pick.bet_selection,
            motivationBold: pick.match_name,
            motivationBody: pick.motivation,
            stats: [
                { label: "Liga", value: pick.league },
                { label: "Match", value: pick.match_name },
                { label: "Datum", value: pick.game_date }
            ],
            tags: ['HOCKEY', pick.league.toUpperCase()],
            odds: pick.odds,
            value: pick.value_percentage ? `${pick.value_percentage}%` : '-'
        })
        setShowModal(true)
    }

    // COMING SOON VIEW (For Non-Admins)
    if (!isAdmin && !loading) {
        return (
            <div className="min-h-screen relative bg-[#0F1720] font-sans text-white">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <img src="/stadium-bg.png" alt="Background" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-[#0F1720]/40"></div>
                </div>

                <div className="relative z-10">
                    <Helmet><title>Hockey | PrimeBets</title></Helmet>
                    <Navbar session={session} />

                    <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh] text-center">
                        <div className="bg-[#162230]/80 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl max-w-2xl w-full relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

                            <div className="w-24 h-24 mx-auto bg-cyan-500/10 rounded-full flex items-center justify-center mb-8 ring-1 ring-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                                <span className="text-5xl">🏒</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                PrimeBets <span className="text-cyan-400">Hockey</span>
                            </h1>

                            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                                Vi lanserar snart vår datadrivna hockeyanalys.
                                <br />
                                Var först med att få tillgång till våra skarpa speltips.
                            </p>

                            <button
                                onClick={() => setIsSubscribeOpen(true)}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 mx-auto"
                            >
                                <span>Skriv upp mig på väntelistan</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </main>

                    {/* Subscription Modal (Reused) */}
                    <Transition appear show={isSubscribeOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-50" onClose={() => setIsSubscribeOpen(false)}>
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#162230] border border-white/10 p-8 text-left align-middle shadow-2xl transition-all relative">
                                            <div className="absolute top-0 right-0 p-4">
                                                <button onClick={() => setIsSubscribeOpen(false)} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                                            </div>
                                            <div className="flex flex-col items-center mb-6 text-center">
                                                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4"><span className="text-3xl">🔔</span></div>
                                                <Dialog.Title as="h3" className="text-2xl font-black text-white">Bevaka Lansering</Dialog.Title>
                                            </div>
                                            {subscribeStatus === 'success' ? (
                                                <div className="text-center py-8">
                                                    <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500 mb-4 animate-bounce"><span className="text-3xl">✅</span></div>
                                                    <h4 className="text-white font-bold text-xl mb-2">Tack!</h4>
                                                    <p className="text-gray-400">Vi hör av oss när hockeyn drar igång.</p>
                                                    <button onClick={() => setIsSubscribeOpen(false)} className="mt-8 w-full py-3 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors">Stäng</button>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubscribe} className="space-y-4">
                                                    <p className="text-center text-gray-400 mb-6">Ange din e-post för att få en notis.</p>
                                                    <div>
                                                        <input type="email" value={subscribeEmail} onChange={(e) => setSubscribeEmail(e.target.value)} placeholder="din.email@exempel.se" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium" required />
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                        <input type="checkbox" id="consent" checked={subscribeConsent} onChange={(e) => setSubscribeConsent(e.target.checked)} className="mt-1 rounded bg-[#162230] border-white/20 text-cyan-500 focus:ring-0 focus:ring-offset-0" required />
                                                        <label htmlFor="consent" className="text-xs text-gray-400 cursor-pointer select-none">Jag godkänner utskick från PrimeBets.</label>
                                                    </div>
                                                    <button type="submit" disabled={subscribeStatus === 'loading' || !subscribeConsent} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                                                        {subscribeStatus === 'loading' ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <><span>Bevaka</span><ArrowRight className="w-4 h-4" /></>}
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
        )
    }

    // REAL DASHBOARD (For Admins)
    return (
        <div className="min-h-screen relative bg-[#0B1219] font-sans text-white">
            {/* Ice Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0F1720] via-[#0B1219] to-[#080C11]"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="relative z-10">
                <Helmet><title>Hockey Dashboard | PrimeBets Admin</title></Helmet>
                <Navbar session={session} />

                <main className="max-w-7xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                                <Trophy className="w-3 h-3" />
                                PrimeBets Hockey
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                Hockey<span className="text-cyan-400">Analys</span>
                            </h1>
                            <p className="text-slate-400 mt-2 text-lg">
                                Adam vs AI: Kampen om ROI.
                            </p>

                            {/* Tabs */}
                            <div className="flex items-center gap-2 mt-6 p-1 bg-[#162230] rounded-xl inline-flex border border-white/5">
                                <button
                                    onClick={() => setActiveTab('adam')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'adam' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Adams Val
                                </button>
                                <button
                                    onClick={() => setActiveTab('ai')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Brain className="w-4 h-4" />
                                    AI-Robot
                                </button>
                            </div>
                        </div>

                        {/* Contest Scoreboard Widget */}
                        <div className="flex items-center gap-8 bg-[#162230]/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="text-center group">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Adam ROI</div>
                                <div className={`text-3xl font-black ${adamStats.roi >= 0 ? 'text-cyan-400' : 'text-red-400'} group-hover:scale-110 transition-transform`}>
                                    {adamStats.roi.toFixed(1)}%
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{adamStats.wins} vinster</div>
                            </div>

                            <div className="text-2xl font-black text-slate-700">VS</div>

                            <div className="text-center group">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">AI-Bot ROI</div>
                                <div className={`text-3xl font-black ${aiStats.roi >= 0 ? 'text-purple-400' : 'text-red-400'} group-hover:scale-110 transition-transform`}>
                                    {aiStats.roi.toFixed(1)}%
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{aiStats.wins} vinster</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                        {/* MAIN CONTENT (Left 2 cols) */}
                        <div className="xl:col-span-2 space-y-8">
                            {activeTab === 'ai' ? (
                                <HockeyAiContest onPublish={fetchHockeyData} />
                            ) : (
                                <>
                                    {/* Hero Card / Dagens Drag */}
                                    {hockeyPicks.length > 0 ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-sm">
                                                <Flame className="w-4 h-4" /> Dagens Hetaste
                                            </div>
                                            <HockeyPickCard
                                                pick={hockeyPicks[0]}
                                                openBookmaker={openBookmaker}
                                                openAnalysisModal={openAnalysisModal}
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-[#162230]/50 border border-white/5 rounded-3xl p-12 text-center">
                                            <p className="text-gray-500 italic">Inga aktiva hockeyspel just nu.</p>
                                        </div>
                                    )}

                                    {/* Upcoming Games Grid */}
                                    {hockeyPicks.length > 1 && (
                                        <div className="space-y-6 pt-8">
                                            <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-wider text-sm">
                                                <Calendar className="w-4 h-4" /> Kommande Matcher
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {hockeyPicks.slice(1).map(pick => (
                                                    <HockeyPickCard
                                                        key={pick.id}
                                                        pick={pick}
                                                        openBookmaker={openBookmaker}
                                                        openAnalysisModal={openAnalysisModal}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* SIDEBAR (Right 1 col) */}
                        <div className="xl:col-span-1 space-y-8">
                            {/* Upcoming Events */}
                            <div className="bg-[#162230]/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    Kommande Event
                                </h3>
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map((event: any) => (
                                        <div key={event.id} className="mb-4 last:mb-0 p-4 rounded-xl bg-[#0F1720] border border-white/5 group">
                                            <span className="text-xs text-gray-500">{new Date(event.race_date).toLocaleDateString()}</span>
                                            <h4 className="text-white font-bold group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{event.motivation || event.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Inga kommande event.</p>
                                )}
                            </div>

                            {/* History / Recent Results */}
                            <div className="bg-[#162230]/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                                    Senaste Resultat
                                </h3>
                                <div className="space-y-3">
                                    {recentResults.length > 0 ? (
                                        recentResults.map((res: any) => (
                                            <div key={res.id} className={`flex items-center justify-between p-3 rounded-lg border ${res.net_result > 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-[#0F1720] border-white/5'}`}>
                                                <div>
                                                    <div className={`text-xs font-bold uppercase ${res.net_result > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                                                        {res.net_result > 0 ? 'Vinst' : res.status === 'void' ? 'Struken' : 'Förlust'}
                                                    </div>
                                                    <div className={`${res.net_result > 0 ? 'text-white' : 'text-gray-400'} text-sm font-medium`}>
                                                        {res.match_name}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">{new Date(res.game_date).toLocaleDateString()}</div>
                                                    <div className={`${res.net_result > 0 ? 'text-green-400' : 'text-gray-500'} font-bold`}>
                                                        {res.net_result > 0 ? '+' : ''}{res.net_result}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Inga avslutade matcher än.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div> {/* End Content Grid */}
                </main>

                <PremiumAnalysisModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    data={modalData || {}}
                />
            </div>
        </div>
    )
}
