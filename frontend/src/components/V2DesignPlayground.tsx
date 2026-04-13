import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Menu, ArrowRight, Timer, Ruler, Trophy, Coins, TrendingUp, Target, Flame, Info, X, BadgeCheck, Award, LayoutDashboard, Calendar, Zap } from 'lucide-react';
import { HotHorsesView } from './HotHorsesView';
import { AnalysisView } from './AnalysisView';
import { CalendarView } from './CalendarView';
import { CountdownTimer, CopyButton, CompactAnalysis } from './V2DesignPlaygroundHelpers';

/* -------------------------------------------------------------------------- */
/*                           Premium Modal Component                          */
/* -------------------------------------------------------------------------- */

const PremiumAnalysisModal = ({ isOpen, onClose, data, isClosed = false }: { isOpen: boolean; onClose: () => void; data: any; isClosed?: boolean }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content - Glassmorphism */}
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 
                bg-gradient-to-b from-[#1A2736]/95 to-[#0F1720]/98 
                backdrop-blur-2xl 
                border border-white/10 
                shadow-[0_0_60px_rgba(0,0,0,0.7)] 
                ring-1 ring-white/5">

                {/* Header with Depth Gradient */}
                <div className="p-8 pb-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent relative z-10">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-3 tracking-tight drop-shadow-lg flex items-center gap-3">
                                <span className="opacity-50 font-light text-xl">Full Analys</span>
                                <span className="w-1 h-8 bg-[#2FAE8F] rounded-full"></span>
                                {data.horseName}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map((tag: string, i: number) => (
                                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-b from-[#C9A86A]/10 to-transparent border border-[#C9A86A]/30 shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                                        <Award className="w-3 h-3 text-[#C9A86A]" />
                                        <span className="text-[10px] font-bold text-[#E5CCA0] uppercase tracking-wider">{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all absolute top-6 right-6 border border-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-0">

                    {/* Quick Facts Section (Data-driven look) */}
                    <div className="grid grid-cols-4 gap-4 p-5 rounded-xl bg-[#0F1720]/50 border border-white/5 shadow-inner">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Odds</span>
                            <span className="text-3xl font-bold text-[#2FAE8F] tracking-tighter drop-shadow-md">{data.odds}</span>
                        </div>
                        <div className="flex flex-col justify-center border-l border-white/5 pl-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Insats</span>
                            <span className="text-sm font-medium text-gray-200">{data.units}</span>
                        </div>
                        <div className="flex flex-col justify-center border-l border-white/5 pl-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Spelvärde</span>
                            <span className="text-sm font-medium text-gray-200">{data.value}</span>
                        </div>
                        <div className="flex flex-col justify-center border-l border-white/5 pl-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Spelform</span>
                            <span className="text-sm font-medium text-gray-200">{data.type}</span>
                        </div>
                    </div>

                    {/* Motivering */}
                    <section>
                        <h3 className="text-xs font-bold text-[#4A90E2] uppercase tracking-widest mb-3 flex items-center gap-2">
                            Motivering
                            <span className="h-px flex-1 bg-gradient-to-r from-[#4A90E2]/30 to-transparent"></span>
                        </h3>
                        <div className="text-sm text-gray-300 leading-relaxed">
                            <p>
                                <strong className="text-white block mb-3 font-bold text-base tracking-tight">{data.motivationBold}</strong>
                                {data.motivationBody}
                            </p>
                        </div>
                    </section>

                    {/* Statistik */}
                    <section>
                        <h3 className="text-xs font-bold text-[#2FAE8F] uppercase tracking-widest mb-3 flex items-center gap-2">
                            Statistik
                            <span className="h-px flex-1 bg-gradient-to-r from-[#2FAE8F]/30 to-transparent"></span>
                        </h3>
                        <div className="grid gap-2">
                            {data.stats.map((stat: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2FAE8F] shrink-0 shadow-[0_0_8px_#2FAE8F]"></div>
                                    <div className="text-gray-300">
                                        <span className="text-gray-500 font-bold mr-2 uppercase text-[10px] tracking-wide">{stat.label}:</span>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Intervju */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Intervju / Information</h3>
                        <div className="p-5 rounded-xl bg-gradient-to-r from-[#2FAE8F]/5 to-transparent border-l-2 border-[#2FAE8F]">
                            <p className="text-sm text-gray-400 italic">
                                "{data.interview}"
                            </p>
                        </div>
                    </section>

                </div>

                {/* Sticky Bottom Actions - Hide if closed */}
                {!isClosed && (
                    <div className="p-6 border-t border-white/5 bg-[#0F1720]/95 backdrop-blur-xl z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-widest">
                                <BadgeCheck className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                <span className="font-bold">Rekommenderat spel från PrimeBets</span>
                            </div>
                            <button className="w-full py-4 rounded-xl bg-[#2FAE8F] hover:bg-[#258f75] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(47,174,143,0.3)] hover:shadow-[0_0_40px_rgba(47,174,143,0.5)] flex items-center justify-center gap-2 active:scale-[0.99] border-t border-white/10">
                                Spela med bästa odds
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const InfoLabel = ({ label, tooltip, alignment = 'center' }: { label: string, tooltip: string, alignment?: 'left' | 'center' | 'right' }) => {
    let positionClass = "left-1/2 -translate-x-1/2"; // Default center
    let arrowClass = "left-1/2 -translate-x-1/2"; // Default center arrow

    if (alignment === 'right') {
        positionClass = "right-0 translate-x-1/2"; // Align right edge of tooltip with right edge of icon (plus offset to center over icon more naturally if needed, but actually we want it to shift leftwards)
        // actually right alignment means the tooltip grows to the left. The `right-0` places the right edge at the parent's right edge. 
        // We want the tooltip's right side to be roughly aligned with the icon.
        positionClass = "right-[-10px]";
        arrowClass = "right-[14px]";
    } else if (alignment === 'left') {
        positionClass = "left-[-10px]";
        arrowClass = "left-[14px]";
    }

    return (
        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1 w-fit mx-auto md:mx-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <div className="relative group/info cursor-help">
                <Info className="w-3 h-3 text-gray-600 group-hover/info:text-[#4A90E2] transition-colors" />
                <div className={`absolute z-[100] bottom-full mb-2 w-56 p-3 rounded-xl bg-[#162230]/95 backdrop-blur-xl border border-white/10 shadow-2xl opacity-0 group-hover/info:opacity-100 transition-all duration-200 pointer-events-none translate-y-2 group-hover/info:translate-y-0 ${positionClass}`}>
                    <p className="text-xs text-gray-200 font-medium leading-relaxed text-center normal-case">
                        {tooltip}
                    </p>
                    <div className={`absolute -bottom-1.5 w-3 h-3 bg-[#162230]/95 border-r border-b border-white/10 rotate-45 ${arrowClass}`}></div>
                </div>
            </div>
        </div>
    );
};


export const V2DesignPlayground = () => {
    const [activeNav, setActiveNav] = useState('Analys & Statistik');
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showModal, setShowModal] = useState(false);
    const [modalIsClosed, setModalIsClosed] = useState(false);

    // --- Mock Data for "Adam's Input" ---
    const primePickEquipment = "Barfota runt om";
    const saturdayPickEquipment = "Barfota fram, Jänkarvagn";
    const interestingPickEquipment = ""; // Empty string to test hiding functionality

    // --- Mock Time Targets (Relative to "Current Time" Jan 2026) ---
    // Assuming current time is around 10:12.
    // PrimePick: 4 hours away (14:15) -> > 15 mins (Green)
    const primePickTime = new Date('2026-01-02T14:15:00+01:00');
    // SaturdayPick: 8 mins away (10:20) -> < 15 mins (Red Pulse)
    const saturdayPickTime = new Date('2026-01-02T10:20:00+01:00');

    const mockModalData = {
        horseName: "Holdup",
        chips: [],
        tags: ["Formstark", "Första bike", "Högt spelvärde"],
        odds: "4.50",
        units: "3 / 5",
        value: "+120%",
        type: "Vinnare",
        motivationBold: "Även här ett formstarkt ekipage i form av en treåring efter Nuncio.",
        motivationBody: "Första bike vankas idag vilket alltid är en mycket intressant förändring på hästar och han visade bra fart för sammanhanget senast efter en bra avslutning mot tuffa konkurrenter på Solvalla. Formen ska vara vassare nu och vi älskar verkligen att biken åker på, framförallt när vi får ett mycket högt odds!",
        stats: [
            { label: "Kusk", value: "Rikard N Skoglund (12% segrar)" },
            { label: "Utrustning", value: "Första bike!" },
            { label: "Form", value: "Vass avslutning senast" }
        ],
        interview: "Tränaren meddelar att hästen känns jättefin i jobben och att bike-bytet är en växel till. 'Vi tror på bra chans' säger stallet."
    };

    const navItems = [
        'Analys & Statistik',
        'Vår metod',
        'Trav spelbok',
        'Kontakt'
    ];

    const tabs = [
        { id: 'Dashboard', icon: LayoutDashboard },
        { id: 'Heta hästar', icon: Flame },
        { id: 'Analys', icon: TrendingUp },
        { id: 'Kalender', icon: Calendar },
    ];

    return (
        <div className="min-h-screen relative bg-[#0F1720] font-sans text-white">
            {/* Fixed Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="/stadium-bg.png"
                    alt="Atmospheric Stadium Background"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-[#0F1720]/20"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10">



                {/* SEO & LLMO Metadata */}
                <Helmet>
                    <title>Dashboard | PrimeBets - AI-drivna Travtips</title>
                    <meta name="description" content="Se dagens bästa speltips för V75 och trav. AI-driven analys för Joker Ima på Solvalla och Love Express W.F. på Halmstad. Öka dina vinstchanser med PrimeBets." />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "WebPage",
                                    "name": "PrimeBets Dashboard",
                                    "description": "Översikt av dagens AI-genererade speltips för hästsport.",
                                    "publisher": {
                                        "@type": "Organization",
                                        "name": "PrimeBets",
                                        "logo": "https://primebets.se/logo-final.png"
                                    }
                                },
                                {
                                    "@type": "SportsEvent",
                                    "name": "Lopp 6, Solvalla - Joker Ima",
                                    "startDate": "2026-01-02T14:15:00+01:00",
                                    "location": {
                                        "@type": "Place",
                                        "name": "Solvalla Travbana",
                                        "address": {
                                            "@type": "PostalAddress",
                                            "addressLocality": "Stockholm",
                                            "addressCountry": "SE"
                                        }
                                    },
                                    "competitor": [
                                        {
                                            "@type": "Person",
                                            "name": "Joker Ima"
                                        }
                                    ],
                                    "description": "PrimeBets AI-analys rekommenderar spel på Joker Ima (Plats 1-3) till odds 3.85. Spelvärde +17%."
                                },
                                {
                                    "@type": "SportsEvent",
                                    "name": "Lopp 4, Halmstad - Love Express W.F.",
                                    "startDate": "2026-01-02T10:20:00+01:00",
                                    "location": {
                                        "@type": "Place",
                                        "name": "Halmstad Travbana",
                                        "address": {
                                            "@type": "PostalAddress",
                                            "addressLocality": "Halmstad",
                                            "addressCountry": "SE"
                                        }
                                    },
                                    "competitor": [
                                        {
                                            "@type": "Person",
                                            "name": "Love Express W.F."
                                        }
                                    ],
                                    "description": "Lördagens toppspel: Love Express W.F. (H2H) till odds 1.80. Formstark häst med högt spelvärde."
                                }
                            ]
                        })}
                    </script>
                </Helmet>

                {/* HEADER */}
                <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0F1720]/40 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        {/* 1. Left Zone: Logo */}
                        <div
                            className="relative w-48 h-full cursor-pointer group flex items-center"
                            onClick={() => setActiveNav('Översikt')}
                        >
                            <img
                                src="/logo-final.png"
                                alt="PrimeBets Logo"
                                className="absolute left-0 top-[60%] -translate-y-1/2 h-32 w-auto max-w-none object-contain transition-opacity group-hover:opacity-90"
                            />
                        </div>

                        {/* 2. Center Zone: Navigation */}
                        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setActiveNav(item)}
                                    className="relative py-2 text-sm font-medium transition-colors text-gray-300 hover:text-white"
                                >
                                    {item}
                                    {activeNav === item && (
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1b2c51] shadow-[0_0_8px_#1b2c51] rounded-full"></span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* 3. Right Zone: Utility */}
                        <div className="flex items-center gap-6">
                            <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                                <Menu className="w-6 h-6 text-gray-300" />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1b2c51] to-[#0F1720] border border-white/10 flex items-center justify-center shadow-lg relative group cursor-pointer hover:border-white/20 transition-colors">
                                <span className="text-sm font-semibold text-white">S</span>
                                <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Placeholder Content to enable scrolling */}
                <main className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="sr-only">PrimeBets Dashboard - Dagens Travtips</h1>

                    {/* Control Center Tabs - Full Width Hero Style */}
                    <div className="w-full mb-12 relative z-20">
                        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#162230]/60 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden">
                            {/* Animated Background Highlight */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="flex items-center justify-center w-full gap-2 sm:gap-4 md:gap-8">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                relative group flex items-center justify-center gap-2 px-6 py-4 rounded-xl transition-all duration-300
                                                ${isActive
                                                    ? 'flex-grow sm:flex-grow-0 min-w-[140px] text-[#2FAE8F]'
                                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(47,174,143,0.5)]' : 'group-hover:scale-110'}`} />
                                            <span className={`font-bold text-sm tracking-wide ${isActive ? '' : 'font-medium'}`} translate="no">{tab.id}</span>

                                            {/* Bottom Active Indicator Line */}
                                            {isActive && (
                                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-[#2FAE8F] rounded-full shadow-[0_0_8px_#2FAE8F]"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content Area Based on Tab */}
                    {activeTab === 'Dashboard' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Grid Container for Top Cards */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12 mt-8">

                                {/* 1. Dagens PrimePick Card */}
                                <article className="relative w-full rounded-3xl p-8 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl flex flex-col h-full" aria-label="Speltips: Joker Ima">

                                    {/* 1. Header: Badge & Status */}
                                    <div className="mb-8 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[#2FAE8F] text-sm font-medium">Idag • 14:15</span>
                                            <CountdownTimer targetDate={primePickTime} />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="inline-block px-2 py-0.5 rounded-full bg-[#2FAE8F]/10 text-[#2FAE8F] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#2FAE8F]/10">
                                                Dagens PrimePick
                                            </span>

                                            <span className="text-gray-400 text-sm font-medium">
                                                · Öppet spel
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                                        {/* 2. Left Column: Main Info */}
                                        <div className="flex-1 min-w-0">

                                            {/* Horse Name & Label */}
                                            <div className="mb-8">
                                                <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Häst</p>
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <h2 className="text-3xl font-bold text-white tracking-tight leading-none">
                                                        Joker Ima
                                                    </h2>
                                                    {/* Pill Badge - "Skräll / Högt Odds" */}
                                                    <div className="relative group flex flex-col items-center justify-center z-50">
                                                        {/* Ribbon Tail (behind) */}
                                                        <div
                                                            className="absolute -bottom-2 w-5 h-6 bg-[#2A4A6D] -z-10 shadow-sm"
                                                            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)' }}
                                                        ></div>

                                                        {/* Main Badge Body */}
                                                        <div className="relative px-2 py-1 rounded-full bg-gradient-to-b from-[#4F7FB0] to-[#2A4A6D] border border-[#6B9AC9]/50 shadow-lg flex items-center gap-1 cursor-help">
                                                            <Target className="w-3 h-3 text-white" />
                                                            <span className="text-[9px] font-bold text-white tracking-wider">ODDS</span>
                                                        </div>

                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-xl bg-[#162230]/90 backdrop-blur-md border border-[#4F7FB0]/50 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl translate-y-2 group-hover:translate-y-0">
                                                            <p className="text-xs text-gray-200 leading-relaxed font-light">
                                                                Hästen har tidigare presterat starkt trots höga odds. Klassas som hög utdelningspotential enligt PrimeBets analys.
                                                            </p>
                                                            {/* Tooltip Arrow */}
                                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#162230]/90 border-r border-b border-[#4F7FB0]/50 rotate-45"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-white whitespace-nowrap">
                                                    <span>Solvalla</span>
                                                    <span className="text-gray-600">•</span>
                                                    <span className="text-gray-600">•</span>
                                                    <span>Lopp 6</span>
                                                </div>
                                            </div>

                                            {/* Facts Section - Grid Layout with Labels */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-y-6 gap-x-8 max-w-full mb-8">

                                                {/* Start Method */}
                                                <div>
                                                    <InfoLabel label="Startmetod" tooltip="Anger startmetoden för loppet, vanligen autostart (bil) eller voltstart." />
                                                    <div className="flex items-center gap-2 text-gray-200">
                                                        <Timer className="w-4 h-4 text-[#2FAE8F]" />
                                                        <span className="text-sm font-medium">Autostart</span>
                                                    </div>
                                                </div>

                                                {/* Distance */}
                                                <div>
                                                    <InfoLabel label="Distans" tooltip="Loppets totala distans. Påverkar hur hästarna disponerar sina krafter." />
                                                    <div className="flex items-center gap-2 text-gray-200">
                                                        <Ruler className="w-4 h-4 text-[#2FAE8F]" />
                                                        <span className="text-sm font-medium">2140m</span>
                                                    </div>
                                                </div>

                                                {/* Game Type */}
                                                <div>
                                                    <InfoLabel label="Spelform" tooltip="Typ av spel, t.ex. vinnare (1:a) eller plats (1-3:a)." />
                                                    <div className="flex items-center gap-2 text-gray-200">
                                                        <Trophy className="w-4 h-4 text-[#2FAE8F]" />
                                                        <span className="text-sm font-medium">Plats 1-3</span>
                                                    </div>
                                                </div>

                                                {/* Spår */}
                                                <div>
                                                    <InfoLabel label="Startspår" tooltip="Hästens startposition. Spår 1-5 är ofta fördelaktiga, medan 8-12 kan vara svåra lägen." />
                                                    <div className="flex items-center gap-2 text-gray-200">
                                                        <Target className="w-4 h-4 text-[#2FAE8F]" />
                                                        <span className="text-sm font-medium">Spår 2</span>
                                                    </div>
                                                </div>

                                                {/* Stake - "Insats" */}
                                                <div>
                                                    <InfoLabel label="Insats" tooltip="PrimeBets rekommenderar att du spelar detta spel. 3 = hög övertygelse, 1 = mer försiktigt spel." />
                                                    <div className="flex items-center gap-2">
                                                        <Coins className="w-4 h-4 text-[#C9A86A]" />
                                                        <span className="text-sm font-medium text-[#C9A86A]">3 units</span>
                                                    </div>
                                                </div>

                                                {/* Equipment (Conditional) */}
                                                {primePickEquipment && (
                                                    <div>
                                                        <InfoLabel label="Utrustning" tooltip="Information om hästens balans och vagn." />
                                                        <div className="flex items-center gap-2 text-gray-200">
                                                            <Zap className="w-4 h-4 text-yellow-500" />
                                                            <span className="text-sm font-medium">{primePickEquipment}</span>
                                                        </div>
                                                    </div>
                                                )}



                                            </div>

                                            {/* Analysis Text Section - Compact on Mobile */}
                                            <CompactAnalysis
                                                title="Analys"
                                                content={
                                                    <div className="relative">
                                                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 md:line-clamp-none" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
                                                            Startmetod möter lämpligt motstånd och har ett perfekt utgångsläge. Visat att han trivs på lång distans och levererat med topp-5 i 8/11 senast lopp. Häst i form, laddas av huvudkusken start och den utmärkta spurten kommer fälla många till slut.
                                                        </p>
                                                    </div>
                                                }
                                            />
                                        </div>

                                        {/* 3. Right Column: Odds, Value & CTAs */}
                                        <div className="flex flex-col items-end justify-between min-w-[200px] gap-8 h-full">
                                            {/* Top: Odds & Value */}
                                            <div className="text-right flex flex-col items-end">
                                                <InfoLabel label="Odds" tooltip="Det aktuella oddset som erbjuds av spelbolaget." alignment="right" />
                                                <div className="flex items-center gap-3">
                                                    <div className="text-4xl font-bold text-white tracking-tighter leading-tight">
                                                        3.85
                                                    </div>
                                                    <CopyButton textToCopy="Joker Ima - Vinnare - Odds 3.85" />
                                                </div>

                                                <div className="flex flex-col items-end mt-3">
                                                    <InfoLabel label="Spelvärde" tooltip="Visar skillnaden mellan oddset och PrimeBets egen sannolikhetsbedömning." alignment="right" />
                                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 backdrop-blur-md">
                                                        <TrendingUp className="w-3.5 h-3.5 text-[#2FAE8F]" />
                                                        <span className="text-sm font-bold text-[#2FAE8F]">+17%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom: CTAs (Stacked) */}
                                            <div className="flex flex-col w-full gap-3 mt-auto">
                                                <button className="w-full px-6 py-3 rounded-xl bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 border border-[#2FAE8F]/20 flex items-center justify-center gap-2 transition-all group backdrop-blur-sm">
                                                    <span className="font-semibold text-white">Spela med bästa odds</span>
                                                    <ArrowRight className="w-4 h-4 text-[#2FAE8F] group-hover:translate-x-0.5 transition-transform" />
                                                </button>

                                                <button
                                                    onClick={() => setShowModal(true)}
                                                    className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all group backdrop-blur-sm"
                                                >
                                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">Läs full analys</span>
                                                    <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>


                                </article>

                                {/* 2. Lördagens Spel Card */}
                                <article className="relative w-full rounded-3xl p-8 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl group flex flex-col h-full" aria-label="Speltips: Love Express W.F.">

                                    {/* Background Image - Blended */}
                                    < div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden" >
                                        <div className="absolute right-0 top-0 h-full w-[60%] opacity-40 mix-blend-lighten">
                                            <img
                                                src="/saturday_horse.png"
                                                alt="Running Horse"
                                                className="w-full h-full object-cover object-center mask-image-gradient"
                                                style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
                                            />
                                        </div>
                                        {/* Navy Blue Glow */}
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B3B5F]/30 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                                    </div >

                                    {/* Content Layer */}
                                    < div className="relative z-10 flex flex-col h-full" >

                                        {/* 1. Header: Badge & Status */}
                                        <div className="mb-8 flex flex-col gap-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[#4A90E2] text-sm font-medium">Idag • 10:20</span>
                                                <CountdownTimer targetDate={saturdayPickTime} />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="inline-block px-2 py-0.5 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#4A90E2]/20 shadow-[0_0_15px_rgba(74,144,226,0.2)]">
                                                    LÖRDAGENS SPEL
                                                </span>
                                                <span className="text-gray-400 text-sm font-medium">
                                                    · Öppet spel
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 flex-grow">

                                            {/* 2. Left Column: Main Info */}
                                            <div className="flex-1 min-w-0">

                                                {/* Horse Name & Label */}
                                                <div className="mb-8">
                                                    <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Häst</p>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h2 className="text-3xl font-bold text-white tracking-tight leading-none drop-shadow-lg whitespace-nowrap">
                                                            Love Express W.F.
                                                        </h2>

                                                        {/* Badge: Formtopp */}
                                                        <div className="relative group/badge flex items-center justify-center cursor-help">
                                                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-lg backdrop-blur-md transition-all hover:bg-orange-500/20 hover:border-orange-500/30">
                                                                <TrendingUp className="w-3 h-3" />
                                                                <span className="text-[9px] font-bold tracking-wider">FORMTOPP</span>
                                                            </div>

                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-xl bg-[#162230]/95 backdrop-blur-md border border-orange-500/30 text-center opacity-0 group-hover/badge:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl translate-y-2 group-hover/badge:translate-y-0 z-50">
                                                                <p className="text-xs text-gray-200 leading-relaxed font-light">
                                                                    <span className="font-bold text-orange-400 block mb-1">Formtopp</span>
                                                                    Hästen har visat stark och jämn prestation över tid enligt PrimeBets analys.
                                                                </p>
                                                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#162230]/95 border-r border-b border-orange-500/30 rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm drop-shadow-md">
                                                        <span className="text-white">Halmstad</span>
                                                        <span className="text-gray-500">•</span>
                                                        <span>Lopp 4</span>
                                                    </div>
                                                </div>

                                                {/* Facts Section - Grid Layout */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-y-6 gap-x-8 max-w-full mb-8">

                                                    {/* Start Method */}
                                                    <div>
                                                        <InfoLabel label="Startmetod" tooltip="Anger startmetoden för loppet, vanligen autostart (bil) eller voltstart." alignment="left" />
                                                        <div className="flex items-center gap-2 text-gray-200">
                                                            <Timer className="w-4 h-4 text-[#4A90E2]" />
                                                            <span className="text-sm font-medium">Autostart</span>
                                                        </div>
                                                    </div>

                                                    {/* Distance */}
                                                    <div>
                                                        <InfoLabel label="Distans" tooltip="Loppets totala distans. Påverkar hur hästarna disponerar sina krafter." />
                                                        <div className="flex items-center gap-2 text-gray-200">
                                                            <Ruler className="w-4 h-4 text-[#4A90E2]" />
                                                            <span className="text-sm font-medium">2140m</span>
                                                        </div>
                                                    </div>

                                                    {/* Game Type */}
                                                    <div>
                                                        <InfoLabel label="Spelform" tooltip="Typ av spel, t.ex. vinnare (1:a) eller plats (1-3:a)." alignment="right" />
                                                        <div className="flex items-center gap-2 text-gray-200">
                                                            <Trophy className="w-4 h-4 text-[#4A90E2]" />
                                                            <span className="text-sm font-medium">H2H</span>
                                                        </div>
                                                    </div>

                                                    {/* Spår */}
                                                    <div>
                                                        <InfoLabel label="Startspår" tooltip="Hästens startposition. Spår 1-5 är ofta fördelaktiga, medan 8-12 kan vara svåra lägen." alignment="left" />
                                                        <div className="flex items-center gap-2 text-gray-200">
                                                            <Target className="w-4 h-4 text-[#4A90E2]" />
                                                            <span className="text-sm font-medium">Spår 5</span>
                                                        </div>
                                                    </div>

                                                    {/* Insats - "Insats" */}
                                                    <div>
                                                        <InfoLabel label="Insats" tooltip="PrimeBets rekommenderar att du spelar detta spel. 3 = hög övertygelse, 1 = mer försiktigt spel." />
                                                        <div className="flex items-center gap-2">
                                                            <Coins className="w-4 h-4 text-[#C9A86A]" />
                                                            <span className="text-sm font-medium text-[#C9A86A]">2 units</span>
                                                        </div>
                                                    </div>

                                                    {/* Equipment (Conditional) */}
                                                    {saturdayPickEquipment && (
                                                        <div>
                                                            <InfoLabel label="Utrustning" tooltip="Information om hästens balans och vagn." />
                                                            <div className="flex items-center gap-2 text-gray-200">
                                                                <Zap className="w-4 h-4 text-yellow-500" />
                                                                <span className="text-sm font-medium">{saturdayPickEquipment}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>

                                                {/* Analysis Text Section - Compact on Mobile */}
                                                <CompactAnalysis
                                                    title="Analys"
                                                    content={
                                                        <div className="relative">
                                                            <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 md:line-clamp-none" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
                                                                Startmetod möter lämpligt motstånd och har ett perfekt utgångsläge. Visat att han trivs på lång distans och levererat med topp-5 i 8/11 senast lopp. Häst i form, laddas av huvudkusken start och den utmärkta spurten kommer fälla många till slut.
                                                            </p>
                                                        </div>
                                                    }
                                                />
                                            </div>

                                            {/* 3. Right Column: Odds, Value & CTAs */}
                                            <div className="flex flex-col items-end justify-between min-w-[200px] w-full md:w-auto gap-8 h-full relative z-20">
                                                {/* Top: Odds & Value */}
                                                <div className="text-right flex flex-col items-end">
                                                    <InfoLabel label="Odds" tooltip="Det aktuella oddset som erbjuds av spelbolaget." alignment="right" />
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-4xl font-bold text-white tracking-tighter leading-tight drop-shadow-xl">
                                                            1.80
                                                        </div>
                                                        <CopyButton textToCopy="Love Express W.F. - H2H - Odds 1.80" />
                                                    </div>

                                                    <div className="flex flex-col items-end mt-3">
                                                        <InfoLabel label="Spelvärde" tooltip="Visar skillnaden mellan oddset och PrimeBets egen sannolikhetsbedömning." alignment="right" />
                                                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4A90E2]/10 border border-[#4A90E2]/20 backdrop-blur-md shadow-lg">
                                                            <TrendingUp className="w-3.5 h-3.5 text-[#4A90E2]" />
                                                            <span className="text-sm font-bold text-[#4A90E2]">+13%</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom: CTAs (Stacked) */}
                                                <div className="flex flex-col w-full gap-3 mt-auto">
                                                    <button className="w-full px-6 py-3 rounded-xl bg-[#4A90E2] hover:bg-[#357ABD] text-white shadow-[#4A90E2]/20 shadow-lg border border-[#4A90E2]/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] group">
                                                        <span className="font-bold text-sm">Spela med bästa odds</span>
                                                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                                                    </button>

                                                    <button
                                                        onClick={() => setShowModal(true)}
                                                        className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all group backdrop-blur-sm"
                                                    >
                                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">Läs full analys</span>
                                                        <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>




                            {/* "Intressanta spel för dagen" Section */}
                            <section className="max-w-7xl mx-auto px-6 pb-20">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-1 h-6 bg-[#2FAE8F] rounded-full shadow-[0_0_10px_#2FAE8F]"></div>
                                    Intressanta spel för dagen
                                </h3>

                                {/* Card Container */}
                                <div className="space-y-4">

                                    {/* Compact Card 1 */}
                                    <div className="relative w-full rounded-2xl p-6 backdrop-blur-xl bg-[#162230]/40 border border-white/5 border-l-4 border-l-[#2FAE8F] shadow-lg hover:bg-[#162230]/50 transition-all group">
                                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                                            {/* 1. Info & Stats Group */}
                                            <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto">

                                                {/* Horse Info */}
                                                <div className="min-w-[180px] text-center md:text-left relative">
                                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                                        <h3 className="text-2xl font-bold text-white">Global Winner</h3>

                                                        {/* "HET" Badge with Tooltip */}
                                                        <div className="relative group/badge z-50">
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#2FAE8F] text-white cursor-help shadow-[0_0_10px_rgba(47,174,143,0.4)]">
                                                                <Flame className="w-2.5 h-2.5 fill-current" />
                                                                <span className="text-[9px] font-bold tracking-wider">HET</span>
                                                            </div>

                                                            {/* Tooltip Card */}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-xl bg-[#162230]/95 backdrop-blur-md border border-[#2FAE8F]/30 text-center opacity-0 group-hover/badge:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl translate-y-2 group-hover/badge:translate-y-0 z-[100]">
                                                                <p className="text-xs text-gray-200 leading-relaxed font-light">
                                                                    Den här hästen är med i PrimeBets bäst presterande spel den senaste perioden, baserat på faktisk avkastning (ROI).
                                                                </p>
                                                                {/* Tooltip Arrow */}
                                                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#162230]/95 border-r border-b border-[#2FAE8F]/30 rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-400">
                                                        <span>Jägersro</span>
                                                        <span>•</span>
                                                        <span>Lopp 4</span>
                                                        <span className="text-[#2FAE8F] px-1.5 py-0.5 rounded-md bg-[#2FAE8F]/10 border border-[#2FAE8F]/10 font-mono">19:30</span>
                                                    </div>
                                                </div>

                                                {/* Divider (Hidden on mobile) */}
                                                <div className="hidden md:block w-px h-12 bg-white/5"></div>

                                                {/* Stats Row */}
                                                <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4">

                                                    {/* Startmetod */}
                                                    <div className="text-center md:text-left">
                                                        <InfoLabel label="Startmetod" tooltip="Anger startmetoden för loppet, vanligen autostart (bil) eller voltstart." />
                                                        <div className="flex items-center gap-1.5 text-gray-200">
                                                            <Timer className="w-3.5 h-3.5 text-gray-500" />
                                                            <span className="text-sm font-medium">Volt</span>
                                                        </div>
                                                    </div>

                                                    {/* Distans */}
                                                    <div className="text-center md:text-left">
                                                        <InfoLabel label="Distans" tooltip="Loppets totala distans. Påverkar hur hästarna disponerar sina krafter." />
                                                        <div className="flex items-center gap-1.5 text-gray-200">
                                                            <Ruler className="w-3.5 h-3.5 text-gray-500" />
                                                            <span className="text-sm font-medium">1640m</span>
                                                        </div>
                                                    </div>

                                                    {/* Spelform */}
                                                    <div className="text-center md:text-left">
                                                        <InfoLabel label="Spelform" tooltip="Typ av spel, t.ex. vinnare (1:a) eller plats (1-3:a)." />
                                                        <div className="flex items-center gap-1.5 text-gray-200">
                                                            <Trophy className="w-3.5 h-3.5 text-gray-500" />
                                                            <span className="text-sm font-medium">Vinnare</span>
                                                        </div>
                                                    </div>

                                                    {/* Spår */}
                                                    <div className="text-center md:text-left">
                                                        <InfoLabel label="Startspår" tooltip="Hästens startposition. Spår 1-5 är ofta fördelaktiga, medan 8-12 kan vara svåra lägen." />
                                                        <div className="flex items-center gap-1.5 text-gray-200">
                                                            <span className="text-sm font-medium">Spår 5</span>
                                                        </div>
                                                    </div>

                                                    {/* Insats (Units) */}
                                                    <div className="text-center md:text-left">
                                                        <InfoLabel label="Insats" tooltip="PrimeBets rekommenderar att du spelar detta spel. 3 = hög övertygelse, 1 = mer försiktigt spel." />
                                                        <div className="flex items-center gap-1.5">
                                                            <Coins className="w-3.5 h-3.5 text-[#C9A86A]" />
                                                            <span className="text-sm font-medium text-[#C9A86A]">1 unit</span>
                                                        </div>
                                                    </div>

                                                    {/* Equipment (Conditional) */}
                                                    {interestingPickEquipment && (
                                                        <div className="text-center md:text-left">
                                                            <InfoLabel label="Utrustning" tooltip="Information om hästens balans och vagn." />
                                                            <div className="flex items-center gap-1.5 justify-center md:justify-start">
                                                                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                                                                <span className="text-sm font-medium text-white">{interestingPickEquipment}</span>
                                                            </div>
                                                        </div>
                                                    )}



                                                </div>
                                            </div>

                                            {/* 2. Action Zone (Right) */}
                                            <div className="flex flex-col items-center lg:items-end justify-center gap-4 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">

                                                {/* Odds & Value Row */}
                                                {/* Odds & Value Row */}
                                                <div className="flex items-start gap-6">
                                                    <div className="text-center lg:text-right flex flex-col items-center lg:items-end">
                                                        <InfoLabel label="Odds" tooltip="Det aktuella oddset som erbjuds av spelbolaget." />
                                                        <span className="text-4xl font-bold text-white leading-none">4.20</span>
                                                    </div>

                                                    <div className="text-center lg:text-right flex flex-col items-center lg:items-end">
                                                        <InfoLabel label="Spelvärde" tooltip="Visar skillnaden mellan oddset och PrimeBets egen sannolikhetsbedömning." />
                                                        <div className="flex items-center justify-center lg:justify-end h-9">
                                                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#2FAE8F]/10 border border-[#2FAE8F]/20">
                                                                <TrendingUp className="w-3 h-3 text-[#2FAE8F]" />
                                                                <span className="text-xs font-bold text-[#2FAE8F]">+12%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stacked Buttons */}
                                                <div className="flex flex-col gap-3 w-full sm:w-auto">
                                                    <button className="w-full sm:w-56 px-4 py-3 rounded-xl bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 border border-[#2FAE8F]/20 hover:border-[#2FAE8F]/40 text-sm font-bold text-white flex items-center justify-between group transition-all">
                                                        <span>Spela med bästa odds</span>
                                                        <ArrowRight className="w-4 h-4 text-[#2FAE8F] group-hover:translate-x-1 transition-transform" />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setModalIsClosed(false);
                                                            setShowModal(true);
                                                        }}
                                                        className="w-full sm:w-56 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-all group"
                                                    >
                                                        Läs full analys
                                                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" />
                                                    </button>
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </section >

                            {/* New Section: Veckans Spaning & Senaste Heta */}
                            < section className="max-w-7xl mx-auto px-6 pb-20" >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                    {/* 1. Veckans Spaning (Wider - 2/3) - Now using Saturday Card Structure */}
                                    <div className="lg:col-span-2 relative w-full rounded-3xl p-8 backdrop-blur-xl bg-[#162230]/40 border border-white/5 shadow-2xl group flex flex-col h-full min-h-[400px] overflow-hidden">

                                        {/* Background Image - Blended & Cinematic */}
                                        <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden">
                                            <div className="absolute right-0 top-0 h-full w-[70%] opacity-40 mix-blend-lighten">
                                                <img
                                                    src="/veckans_spaning_stadium.png"
                                                    alt="Stadium Night Race"
                                                    className="w-full h-full object-cover object-center mask-image-gradient"
                                                    style={{ maskImage: 'linear-gradient(to right, transparent, black 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 100%)' }}
                                                />
                                            </div>
                                            {/* Navy Blue Glow */}
                                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B3B5F]/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                                        </div>

                                        {/* Content Layer */}
                                        <div className="relative z-10 flex flex-col h-full">

                                            {/* 1. Header: Badge & Status */}
                                            <div className="mb-8 flex items-center gap-3">
                                                <span className="inline-block px-3 py-1 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#4A90E2]/20 shadow-[0_0_15px_rgba(74,144,226,0.2)]">
                                                    VECKANS SPANING
                                                </span>
                                                <span className="text-gray-400 text-sm font-medium">
                                                    · Inför Elitloppet
                                                </span>
                                            </div>

                                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 flex-grow">

                                                {/* 2. Left Column: Main Info */}
                                                <div className="flex-1 min-w-0">

                                                    {/* Horse Name & Label */}
                                                    <div className="mb-8">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h2 className="text-4xl font-black text-white tracking-tight leading-none drop-shadow-xl whitespace-nowrap">
                                                                Elitloppshelgen
                                                            </h2>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm drop-shadow-md font-medium">
                                                            <span className="text-white">Solvalla</span>
                                                            <span className="text-gray-600 px-1">•</span>
                                                            <span className="text-white">26-28 Maj</span>
                                                            <span className="text-gray-600 px-1">•</span>
                                                            <span className="text-[#4A90E2]">Lördag <span className="text-gray-600 mx-0.5">&</span> Söndag</span>
                                                        </div>
                                                    </div>

                                                    {/* Facts Section - Grid Layout */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-8 max-w-full mb-8 border-t border-white/5 pt-6">

                                                        {/* Start Method */}
                                                        <div>
                                                            <InfoLabel label="Startmetod" tooltip="Anger startmetoden för loppet." alignment="left" />
                                                            <div className="flex items-center gap-2 text-gray-200 mt-1">
                                                                <Timer className="w-4 h-4 text-[#4A90E2]" />
                                                                <span className="text-sm font-bold">Autostart</span>
                                                            </div>
                                                        </div>

                                                        {/* Distance */}
                                                        <div>
                                                            <InfoLabel label="Distans" tooltip="Loppets totala distans." />
                                                            <div className="flex items-center gap-2 text-gray-200 mt-1">
                                                                <Ruler className="w-4 h-4 text-[#4A90E2]" />
                                                                <span className="text-sm font-bold">1609m</span>
                                                            </div>
                                                        </div>

                                                        {/* Game Type */}
                                                        <div>
                                                            <InfoLabel label="Spelform" tooltip="Typ av spel." alignment="right" />
                                                            <div className="flex items-center gap-2 text-gray-200 mt-1">
                                                                <Trophy className="w-4 h-4 text-[#4A90E2]" />
                                                                <span className="text-sm font-bold">Vinnare</span>
                                                            </div>
                                                        </div>

                                                        {/* Spår */}
                                                        <div>
                                                            <InfoLabel label="Startspår" tooltip="Hästens startposition." alignment="left" />
                                                            <div className="flex items-center gap-2 text-gray-200 mt-1">
                                                                <Target className="w-4 h-4 text-[#4A90E2]" />
                                                                <span className="text-sm font-bold">Spår 1-8</span>
                                                            </div>
                                                        </div>

                                                        {/* Insats */}
                                                        <div>
                                                            <InfoLabel label="Insats" tooltip="Rekommenderad insats." />
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Coins className="w-4 h-4 text-[#C9A86A]" />
                                                                <span className="text-sm font-bold text-[#C9A86A]">3 units</span>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* Analysis Text Section */}
                                                    <div className="max-w-xl pt-6 border-t border-white/5">
                                                        <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Analys</p>
                                                        <div className="relative">
                                                            <p className="text-base text-gray-300 leading-relaxed font-light">
                                                                Vi spanar in de hetaste förhandssnacken och analyserar vilka hästar som ser ut att toppa formen precis i rätt tid inför årets största travfest. Missa inte genomgången av försöken!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 3. Right Column: Buttons (Simplified for Feature) */}
                                                <div className="flex flex-col items-end justify-between min-w-[200px] w-full md:w-auto gap-8 h-full relative z-20">
                                                    <div className="h-10"></div> {/* Spacer for visual balance if no Odds */}

                                                    {/* Bottom: CTAs (Stacked) */}
                                                    <div className="flex flex-col w-full gap-3 mt-auto">
                                                        <button className="w-full px-6 py-3 rounded-xl bg-[#4A90E2] hover:bg-[#357ABD] text-white shadow-[#4A90E2]/20 shadow-lg border border-[#4A90E2]/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] group">
                                                            <span className="font-bold text-sm">Läs hela spaningen</span>
                                                            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Senaste Heta (Narrower - 1/3) */}
                                    <div className="lg:col-span-1 relative w-full rounded-3xl p-1 bg-[#162230]/40 border border-white/5 shadow-2xl backdrop-blur-sm flex flex-col">
                                        {/* Inner content wrapper */}
                                        <div className="flex-1 rounded-[20px] bg-[#0F1720]/50 p-6 flex flex-col h-full border border-white/5">

                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20">
                                                            <Flame className="w-4 h-4 text-[#F5A623]" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-white tracking-tight">Senaste heta</h3>
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400 text-[10px] font-bold uppercase border border-white/10">
                                                        Avslutat spel
                                                    </span>
                                                </div>
                                                <div className="group/tooltip relative">
                                                    <Info className="w-4 h-4 text-gray-500 cursor-help hover:text-white transition-colors" />
                                                    <div className="absolute top-full right-0 mt-2 w-48 p-3 rounded-xl bg-[#162230] border border-white/10 shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-all pointer-events-none z-50">
                                                        <p className="text-xs text-gray-300 leading-snug">
                                                            Visar de spel från PrimeBets med bäst ROI.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content: Best ROI */}
                                            <div className="flex-1 flex flex-col gap-6">

                                                {/* Period & Result */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Period</span>
                                                        <span className="text-sm font-bold text-white tracking-wide">Gårdagen</span>
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold uppercase border border-green-500/20">Vinst</span>
                                                </div>

                                                {/* Main Stats: ROI & Odds */}
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">ROI</span>
                                                        <div className="text-2xl font-black text-[#2FAE8F] tracking-tighter shadow-[#2FAE8F]/20 drop-shadow-lg">
                                                            +125%
                                                        </div>
                                                    </div>
                                                    <div className="text-right pb-1">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Odds</span>
                                                        <span className="text-2xl font-bold text-white">4.50</span>
                                                    </div>
                                                </div>

                                                {/* Info Block */}
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#4A90E2]/10 flex items-center justify-center border border-[#4A90E2]/20 shrink-0">
                                                            <Trophy className="w-4 h-4 text-[#4A90E2]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Häst</p>
                                                            <p className="text-sm font-bold text-white leading-none">Don Fanucci Zet</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Plats</p>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                <p className="text-xs font-medium text-gray-300">Solvalla</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Spelform</p>
                                                            <div className="flex items-center gap-1.5">
                                                                <Target className="w-3 h-3 text-[#2FAE8F]" />
                                                                <p className="text-xs font-medium text-gray-300">Vinnare</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Action */}
                                            <div className="mt-6 pt-4 border-t border-white/5">
                                                <button
                                                    onClick={() => {
                                                        setModalIsClosed(true);
                                                        setShowModal(true);
                                                    }}
                                                    className="w-full py-3 rounded-xl bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 text-[#2FAE8F] font-bold text-xs tracking-wide transition-all border border-[#2FAE8F]/20 hover:border-[#2FAE8F]/40 flex items-center justify-center gap-2 group"
                                                >
                                                    Läs full analys
                                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </section >
                        </div>
                    )
                    }

                    {/* Heta Hästar View */}
                    {activeTab === 'Heta hästar' && <HotHorsesView />}

                    {/* Analys View */}
                    {activeTab === 'Analys' && <AnalysisView />}
                    {activeTab === 'Kalender' && <CalendarView />}
                </main >
            </div >




            {/* Premium Modal Injection */}
            < PremiumAnalysisModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                data={mockModalData}
                isClosed={modalIsClosed}
            />
        </div >
    );
};
