import { useState } from 'react'
import { Target, TrendingUp, ArrowRight, Shield, Brain, Activity, Coins, BarChart3, AlertTriangle, GraduationCap, MousePointerClick, RefreshCw, ChevronDown, ChevronUp, BookOpen, Sigma, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { Helmet } from 'react-helmet-async'
import { Navbar } from './Navbar'

interface BettingSchoolPageProps {
    session?: Session | null
    hideNavbar?: boolean
}

type Level = 'beginner' | 'experienced' | 'advanced';

const levels: { id: Level; title: string; desc: string; icon: any }[] = [
    {
        id: 'beginner',
        title: 'Nybörjare',
        desc: 'Jag vill förstå grunderna och spela tryggt',
        icon: Shield
    },
    {
        id: 'experienced',
        title: 'Erfaren',
        desc: 'Jag vill bli mer konsekvent och långsiktig',
        icon: Target
    },
    {
        id: 'advanced',
        title: 'Avancerad',
        desc: 'Jag förstår ROI och vill optimera min edge',
        icon: Brain
    }
];

export function BettingSchoolPage({ session, hideNavbar = false }: BettingSchoolPageProps) {
    const [selectedLevel, setSelectedLevel] = useState<Level>('beginner');
    const [showDeepDive, setShowDeepDive] = useState(false);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "PrimeBets Spelskola",
        "description": "En komplett guide för att lära sig spela professionellt på trav. Från grunder till avancerad spelmatematik och bankroll management.",
        "provider": {
            "@type": "Organization",
            "name": "PrimeBets",
            "sameAs": "https://primebets.se"
        },
        "educationalLevel": ["Beginner", "Intermediate", "Advanced"],
        "teaches": [
            "Spelmatematik",
            "Bankroll Management",
            "Value Betting",
            "Closing Line Value (CLV)",
            "Spelpsykologi"
        ]
    };

    return (
        <div className="min-h-screen bg-[#0F1720] font-sans text-gray-100">
            <Helmet>
                <title>Spelskolan – Lär dig vinna på trav | PrimeBets</title>
                <meta name="description" content="Utveckla ditt spelande med PrimeBets Spelskola. Lär dig allt från units och bankroll management till avancerad spelmatematik och ROI-strategier." />
                <meta name="keywords" content="spelskola, trav, betting, units, bankroll management, roi, spelstrategi, v75, atg, value betting" />
                <meta property="og:title" content="Spelskolan – Lär dig vinna på trav | PrimeBets" />
                <meta property="og:description" content="Från nybörjare till proffs. Vi lär dig metoderna som krävs för att bli en vinnande spelare över tid." />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            {!hideNavbar && <Navbar session={session} />}

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">

                {/* 1. HERO SECTION & 2. SELECTOR (unchanged) */}
                {/* I will assume the surrounding code up to the grid is correct and only target the grid area for replacement if possible, 
                   but since I need to change imports and state, I might as well target the top and then the grid.
                   Actually, let's do this in one go around the grid area, and a separate one for imports/state if needed.
                   Wait, 'replace_file_content' is one block. I can try to replace a large chunk or multiple chunks.
                   Let's stick to replacing the Imports + Component Start, AND the Grid Section. 
                   Ah, 'MultiReplace' is better.
                */}

                {/* ... */}


                {/* 1. HERO SECTION */}
                <div className="text-center space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 text-[#2FAE8F] text-xs font-bold uppercase tracking-widest">
                        <GraduationCap className="w-4 h-4" />
                        PrimeBets Academy
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Spelskolan <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2FAE8F] to-[#43C4A2]">
                            Så spelar du med PrimeBets
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                        Oavsett om du är ny eller erfaren – lär dig spela rätt, med disciplin och långsiktighet för att slå spelbolagen över tid.
                    </p>
                </div>

                {/* 2. LEVEL SELECTOR */}
                <div className="relative z-10">
                    <div className="text-center mb-6">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Välj din nivå för anpassat innehåll</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {levels.map((level) => {
                            const Icon = level.icon;
                            const isSelected = selectedLevel === level.id;

                            return (
                                <button
                                    key={level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`
                                        relative group flex flex-col items-center text-center p-6 md:p-8 rounded-2xl transition-all duration-300 border
                                        ${isSelected
                                            ? 'bg-[#162230] border-[#2FAE8F] shadow-[0_0_30px_-5px_rgba(47,174,143,0.3)] scale-[1.02]'
                                            : 'bg-[#162230]/40 border-white/5 hover:border-white/10 hover:bg-[#162230]/60'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300
                                        ${isSelected ? 'bg-[#2FAE8F] text-[#0F1720]' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}
                                    `}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                        {level.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed max-w-[250px]">
                                        {level.desc}
                                    </p>

                                    {isSelected && (
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#2FAE8F] text-[#0F1720] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Vald Nivå
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2.5 BEGINNER GUIDE: HOW TO BET */}
                {selectedLevel === 'beginner' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="relative p-1 rounded-3xl bg-gradient-to-r from-white/5 to-white/0 mb-12">
                            <div className="bg-[#0F1720] rounded-[22px] p-8 md:p-10 border border-white/5 relative overflow-hidden">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2FAE8F]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

                                <div className="relative z-10">
                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-8 text-center">
                                        Så lägger du ett spel med PrimeBets <span className="text-[#2FAE8F]">– steg för steg</span>
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                                        {/* Connector Lines (Desktop only) */}
                                        <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#2FAE8F]/0 via-[#2FAE8F]/30 to-[#2FAE8F]/0"></div>

                                        {/* Step 1 */}
                                        <div className="relative flex flex-col items-center text-center">
                                            <div className="w-14 h-14 rounded-full bg-[#162230] border border-[#2FAE8F]/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(47,174,143,0.15)] z-10">
                                                <MousePointerClick className="w-6 h-6 text-[#2FAE8F]" />
                                            </div>
                                            <div className="mb-2 text-[#2FAE8F] font-bold text-sm uppercase tracking-wider">Steg 1</div>
                                            <h3 className="text-xl font-bold text-white mb-3">Välj spel</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                                                Följ ett av våra rekommenderade spel.
                                                Vi har redan gjort jobbet åt dig. analys, spelform, häst, odds och insatsnivå är färdigvalt. Du behöver bara klicka vidare till spelbolaget.
                                            </p>
                                        </div>

                                        {/* Step 2 */}
                                        <div className="relative flex flex-col items-center text-center">
                                            <div className="w-14 h-14 rounded-full bg-[#162230] border border-[#2FAE8F]/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(47,174,143,0.15)] z-10">
                                                <Coins className="w-6 h-6 text-[#C9A86A]" />
                                            </div>
                                            <div className="mb-2 text-[#C9A86A] font-bold text-sm uppercase tracking-wider">Steg 2</div>
                                            <h3 className="text-xl font-bold text-white mb-3">Satsa rätt belopp</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                                                När du har valt spel och ska lägga spelet, välj insats i units.
                                                Units anpassar insatsen efter din spelkassa och gör att du följer strategin korrekt.
                                                <br /><span className="text-gray-500 italic">(Läs längre ner hur du räknar ut just din unit.)</span>
                                            </p>
                                        </div>

                                        {/* Step 3 */}
                                        <div className="relative flex flex-col items-center text-center">
                                            <div className="w-14 h-14 rounded-full bg-[#162230] border border-[#2FAE8F]/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(47,174,143,0.15)] z-10">
                                                <RefreshCw className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div className="mb-2 text-blue-400 font-bold text-sm uppercase tracking-wider">Steg 3</div>
                                            <h3 className="text-xl font-bold text-white mb-3">Upprepa över tid</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                                                Ett enskilt spel säger väldigt lite.
                                                Strategin fungerar över många spel och ska utvärderas långsiktigt, inte från dag till dag eller efter en enskild vinst eller förlust.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. DYNAMIC CONTENT GRID */}
                <div className={`grid grid-cols-1 md:grid-cols-2 ${selectedLevel !== 'experienced' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700`}>

                    {selectedLevel === 'beginner' ? (
                        <>
                            {/* NEW BEGINNER CARD 1: Spelformer */}
                            <SchoolCard
                                icon={<Target className="w-5 h-5 text-[#2FAE8F]" />}
                                title="Spelformer (vad spelar du på?)"
                                level={selectedLevel}
                                content={{
                                    beginner: (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-bold text-white mb-1">Spelformer – vad betyder det?</h4>
                                                <p>Spelform beskriver hur spelet kan vinna. Du behöver inte välja spelform själv – vi anger alltid vilken som gäller.</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-2">Vanliga spelformer hos PrimeBets:</h4>
                                                <ul className="space-y-2">
                                                    <li className="flex gap-2"><span className="text-[#2FAE8F] font-bold">•</span> <span><strong className="text-white">Vinnare</strong> – hästen måste vinna loppet</span></li>
                                                    <li className="flex gap-2"><span className="text-[#2FAE8F] font-bold">•</span> <span><strong className="text-white">Plats</strong> – hästen ska komma topp 2 eller 3</span></li>
                                                    <li className="flex gap-2"><span className="text-[#2FAE8F] font-bold">•</span> <span><strong className="text-white">Head-to-Head</strong> – din häst ska slå en specifik annan häst</span></li>
                                                </ul>
                                            </div>
                                            <p className="text-[#2FAE8F] font-medium pt-2 border-t border-white/5">När du följer våra spel är spelformen redan vald åt dig.</p>
                                        </div>
                                    ),
                                    experienced: "", advanced: ""
                                }}
                            />

                            {/* NEW BEGINNER CARD 2: Så läser du ett spel */}
                            <SchoolCard
                                icon={<Brain className="w-5 h-5 text-blue-400" />}
                                title="Så läser du ett spel"
                                level={selectedLevel}
                                content={{
                                    beginner: (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-bold text-white mb-2">Så tolkar du våra spel</h4>
                                                <p className="mb-3">Ett spel från oss kan till exempel se ut så här:</p>
                                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-mono text-center mb-4 text-orange-300">
                                                    V75-4 – Häst 5 – Vinnare – @2.10 – 2 units
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-2">Det betyder:</h4>
                                                <ul className="space-y-1 text-sm">
                                                    <li className="flex gap-2"><span className="text-blue-400">•</span> vilket lopp spelet gäller</li>
                                                    <li className="flex gap-2"><span className="text-blue-400">•</span> vilken häst</li>
                                                    <li className="flex gap-2"><span className="text-blue-400">•</span> hur spelet ska vinnas</li>
                                                    <li className="flex gap-2"><span className="text-blue-400">•</span> vilket odds som gäller</li>
                                                    <li className="flex gap-2"><span className="text-blue-400">•</span> hur stor insats du ska använda</li>
                                                </ul>
                                            </div>
                                            <p className="text-blue-200 font-medium pt-2 border-t border-white/5">Allt är färdigt – du behöver bara följa instruktionen.</p>
                                        </div>
                                    ),
                                    experienced: "", advanced: ""
                                }}
                            />

                            {/* NEW BEGINNER CARD 3: Spelkassa & Units (Reused content logic manually) */}
                            <SchoolCard
                                icon={<Coins className="w-5 h-5 text-[#C9A86A]" />}
                                title="Spelkassa & Units"
                                level={selectedLevel}
                                content={{
                                    beginner: (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-bold text-white mb-1">Vad är en spelkassa?</h4>
                                                <p>Börja med att bestämma en spelkassa, pengar du är okej med att spela för över tid.</p>
                                            </div>

                                            <div>
                                                <p className="mb-2">Hos PrimeBets motsvarar <strong className="text-[#C9A86A]">1 unit alltid 2 %</strong> av din spelkassa.</p>

                                                <div className="bg-[#C9A86A]/10 border border-[#C9A86A]/20 rounded-lg p-3 my-3">
                                                    <p className="text-sm font-bold text-[#C9A86A] mb-1">Exempel:</p>
                                                    <p className="text-sm text-gray-200">Har du 5 000 kr i spelkassa → 1 unit = 100 kr.</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p>När vi rekommenderar 1–3 units betyder det hur stor del av din spelkassa du ska satsa.</p>
                                                <p className="mt-2 text-gray-400 text-sm">När du lägger spelet hos spelbolaget skriver du beloppet i kronor, inte units.</p>
                                            </div>
                                        </div>
                                    ),
                                    experienced: "", advanced: ""
                                }}
                            />

                            {/* NEW BEGINNER CARD 4: Nybörjarmisstag */}
                            <SchoolCard
                                icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                                title="Vanliga nybörjarmisstag"
                                level={selectedLevel}
                                content={{
                                    beginner: (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-bold text-white mb-1">Undvik dessa misstag</h4>
                                                <p>De flesta förlorar inte på analys – utan på beteende.</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-red-400 mb-2">Undvik att:</h4>
                                                <ul className="space-y-2">
                                                    <li className="flex gap-2"><span className="text-red-500 font-bold">✕</span> jaga förluster</li>
                                                    <li className="flex gap-2"><span className="text-red-500 font-bold">✕</span> höja insatsen efter vinst eller förlust</li>
                                                    <li className="flex gap-2"><span className="text-red-500 font-bold">✕</span> spela egna spel “för att det känns rätt”</li>
                                                    <li className="flex gap-2"><span className="text-red-500 font-bold">✕</span> utvärdera resultat efter enstaka spel</li>
                                                </ul>
                                            </div>
                                            <p className="text-white font-bold pt-2 border-t border-white/5">Följ planen, håll insatserna och utvärdera över tid.</p>
                                        </div>
                                    ),
                                    experienced: "", advanced: ""
                                }}
                            />
                        </>
                    ) : selectedLevel === 'advanced' ? (
                        /* NEW ADVANCED LAYOUT */
                        <>
                            {/* ADVANCED CARD 1: Value & CLV */}
                            <SchoolCard
                                icon={<Activity className="w-5 h-5 text-[#2FAE8F]" />}
                                title="Value & CLV"
                                level={selectedLevel}
                                badge="Viktigast"
                                content={{
                                    beginner: "", experienced: "",
                                    advanced: (
                                        <div className="space-y-4">
                                            <p>Det enda som betyder något på lång sikt är Closing Line Value (CLV). Om du spelar till 2.25 och oddset stänger i 2.00 har du gjort en bra affär, oavsett om spelet vinner eller förlorar.</p>
                                            <p className="pt-2 border-t border-white/5 text-[#2FAE8F]">Att slå stängningsoddset konsekvent är det starkaste beviset på skicklighet. Det betyder att du värderar sannolikheten bättre än marknaden.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* ADVANCED CARD 2: Bankroll Management */}
                            <SchoolCard
                                icon={<Coins className="w-5 h-5 text-[#C9A86A]" />}
                                title="Spelkassa & Insatsstrategi"
                                level={selectedLevel}
                                badge="Pro Insight"
                                content={{
                                    beginner: "", experienced: "",
                                    advanced: (
                                        <div className="space-y-4">
                                            <p>Kelly Criterion är den optimala formeln för insatsstorlek, men i praktiken är den för volatil för de flesta.</p>
                                            <p className="pt-2 border-t border-white/5 text-[#C9A86A]">Vi rekommenderar en förenklad strategi: 1-5 Units. Det skyddar mot "ruin" (att gå gul) samtidigt som du får exponentiell tillväxt när kassan ökar.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* ADVANCED CARD 3: Volym & Varians */}
                            <SchoolCard
                                icon={<Sigma className="w-5 h-5 text-orange-400" />}
                                title="Volym vs Varians"
                                level={selectedLevel}
                                content={{
                                    beginner: "", experienced: "",
                                    advanced: (
                                        <div className="space-y-4">
                                            <p>Varians är oundvikligt. Även med 10 % ROI är det statistiskt sannolikt att ha perioder på 500+ spel utan vinst.</p>
                                            <p className="pt-2 border-t border-white/5 text-orange-300">Det enda botemedlet är volym. Ju fler spel du lägger med positivt väntevärde, desto mindre blir turens inverkan. Fokusera på processen (att hitta värde), inte resultatet.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* ADVANCED CARD 4: Disciplin & Bias */}
                            <SchoolCard
                                icon={<Brain className="w-5 h-5 text-red-400" />}
                                title="Disciplin & Bias"
                                level={selectedLevel}
                                content={{
                                    beginner: "", experienced: "",
                                    advanced: (
                                        <div className="space-y-4">
                                            <p>Även proffs påverkas av kognitiva bias. "Recency Bias" får oss att överskatta den senaste tidens resultat.</p>
                                            <p className="pt-2 border-t border-white/5 text-red-300">En förlorande vecka betyder inte att strategin är fel. En vinnande vecka betyder inte att du är bäst. Bibehåll lugnet och lita på matematiken bakom dina beslut.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* DEEP DIVE TOGGLE BUTTON (Spans full width) */}
                            <div className="col-span-full flex flex-col items-center pt-8 pb-4">
                                <button
                                    onClick={() => setShowDeepDive(!showDeepDive)}
                                    className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-[#162230] border border-white/10 hover:border-[#2FAE8F]/50 hover:bg-[#162230]/80 transition-all duration-300"
                                >
                                    <BookOpen className={`w-5 h-5 text-[#2FAE8F] transition-transform duration-300 ${showDeepDive ? 'rotate-180' : ''}`} />
                                    <span className="font-bold text-gray-200 group-hover:text-white">
                                        {showDeepDive ? 'Dölj fördjupning' : 'Fördjupa dig i matematiken'}
                                    </span>
                                    {showDeepDive ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                </button>
                            </div>

                            {/* DEEP DIVE COLLAPSIBLE SECTION */}
                            {showDeepDive && (
                                <>
                                    <div className="col-span-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

                                    {/* EXTRA CARD 1: Odds calculation */}
                                    <SchoolCard
                                        icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                                        title="Förstå Odds (Matematisk)"
                                        level={selectedLevel}
                                        content={{
                                            beginner: "", experienced: "",
                                            advanced: "Odds = 1 / Sannolikhet. Värde = (Sannolikhet × Odds) - 1. Om ditt värde > 0 har du hittat ett spel. Det svåra är inte formeln, utan att sätta en korrekt sannolikhet bättre än spelbolagens modeller."
                                        }}
                                    />

                                    {/* EXTRA CARD 2: ROI Logic */}
                                    <SchoolCard
                                        icon={<TrendingUp className="w-5 h-5 text-green-400" />}
                                        title="ROI & Turnover"
                                        level={selectedLevel}
                                        content={{
                                            beginner: "", experienced: "",
                                            advanced: "ROI (Return on Investment) är din marginal. Turnover (Omsättning) är din motor. 5% ROI på 1 miljon i omsättning är 50 000 kr. 20% ROI på 10 000 kr är bara 2000 kr. Volym slår oftast hög ROI."
                                        }}
                                    />

                                    {/* EXTRA CARD 3: Kelly logic */}
                                    <SchoolCard
                                        icon={<Scale className="w-5 h-5 text-purple-400" />}
                                        title="Kelly Criterion i praktiken"
                                        level={selectedLevel}
                                        content={{
                                            beginner: "", experienced: "",
                                            advanced: "Kelly maximerar tillväxten teoretiskt, men kan leda till enorma svängningar. Många proffs använder 'Fractional Kelly' (t.ex. 30% Kelly) för att behålla tillväxten men minska variansen drastiskt."
                                        }}
                                    />

                                    {/* EXTRA CARD 4: Significance */}
                                    <SchoolCard
                                        icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />}
                                        title="Signifikans & p-värden"
                                        level={selectedLevel}
                                        content={{
                                            beginner: "", experienced: "",
                                            advanced: "Har du verkligen 'edge' eller bara tur? Utan tusentals spel är det svårt att veta säkert (p-värde). Var ödmjuk inför slumpen och utgå från att du kan ha fel tills datan bevisar motsatsen."
                                        }}
                                    />
                                </>
                            )}
                        </>

                    ) : (
                        /* EXPERIENCED CARDS (Original Content reused for Experienced) */
                        <>
                            {/* Module 1: Value Betting */}
                            <SchoolCard
                                icon={<Activity className="w-5 h-5 text-[#2FAE8F]" />}
                                title="Vad är Value Betting?"
                                level='experienced' // Force 'experienced' here since selectedLevel could be 'experienced' (or technically advanced but handled above)
                                content={{
                                    beginner: "", advanced: "",
                                    experienced: (
                                        <div className="space-y-4">
                                            <p>PrimeBets fokuserar på situationer där vår bedömning av sannolikheten är högre än vad oddset speglar.</p>
                                            <p>Om vi exempelvis bedömer att en häst har 50 % chans att vinna (motsvarande odds 2.00), men marknaden erbjuder 2.25, finns ett värde i spelet.</p>
                                            <p className="pt-2 border-t border-white/5 text-gray-400">Vi spelar inte på magkänsla eller “vem vi tror vinner”, utan på skillnaden mellan vår analys och marknadens prissättning.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* Module 2: Units & Bankroll */}
                            <SchoolCard
                                icon={<Coins className="w-5 h-5 text-[#C9A86A]" />}
                                title="Spelkassa & Units"
                                level='experienced'
                                content={{
                                    beginner: "", advanced: "",
                                    experienced: (
                                        <div className="space-y-4">
                                            <p>För att hantera normala perioder av varians krävs konsekvent bankroll management.</p>
                                            <p>Units används för att anpassa insatsstorleken efter spelkassan och hålla risknivån jämn över tid.</p>
                                            <p className="pt-2 border-t border-white/5 text-[#C9A86A]">Hos PrimeBets är insatsnivåerna satta för att fungera långsiktigt, förutsatt att rekommenderade units följs konsekvent.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* Module 3: Odds & Sannolikhet */}
                            <SchoolCard
                                icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                                title="Förstå Odds"
                                level='experienced'
                                content={{
                                    beginner: "", advanced: "",
                                    experienced: (
                                        <div className="space-y-4">
                                            <p>Odds är ett sätt att uttrycka sannolikhet. Ett odds på 4.00 motsvarar exempelvis cirka 25 % sannolikhet (1 / 4.00).</p>
                                            <p className="pt-2 border-t border-white/5 text-blue-300">Det viktiga är inte formeln i sig, utan att jämföra din egen sannolikhetsbedömning med marknadens, det är där värde kan uppstå.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* Module 4: Disciplin (Critical) */}
                            <SchoolCard
                                icon={<Shield className="w-5 h-5 text-red-400" />}
                                title="Disciplin & Psykologi"
                                level='experienced'
                                content={{
                                    beginner: "", advanced: "",
                                    experienced: (
                                        <div className="space-y-4">
                                            <p>Tilt är en av de vanligaste orsakerna till dåliga beslut. Efter kortsiktiga motgångar är det lätt att avvika från planen eller ifrågasätta processen.</p>
                                            <p className="pt-2 border-t border-white/5 text-red-300">Även erfarna spelare har förlorande perioder. Disciplin handlar om att fortsätta följa strategin även när utfallet tillfälligt går emot.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* Module 5: ROI & Långsiktighet */}
                            <SchoolCard
                                icon={<TrendingUp className="w-5 h-5 text-[#2FAE8F]" />}
                                title="Långsiktighet (ROI)"
                                level='experienced'
                                content={{
                                    beginner: "", advanced: "",
                                    experienced: (
                                        <div className="space-y-4">
                                            <p>Inom trav är en ROI på 5 till 10 % över tid mycket stark. Det innebär att varje satsad 100kr i snitt genererar 105 till 110 kr tillbaka.</p>
                                            <p className="pt-2 border-t border-white/5 text-[#2FAE8F]">Resultat ska bedömas över större urval av spel, inte efter enskilda veckor eller perioder.</p>
                                        </div>
                                    )
                                }}
                            />

                            {/* Module 6: Volym & Varians */}
                            <SchoolCard
                                icon={<AlertTriangle className="w-5 h-5 text-orange-400" />}
                                title="Volym & Varians"
                                level='experienced'
                                content={{
                                    beginner: "", advanced: "",
                                    experienced: (
                                        <div className="space-y-4">
                                            <p>Även med en vinnande strategi uppstår perioder av förlust, detta kallas varians. Kortsiktiga utfall påverkas av slump, medan långsiktiga resultat speglar strategi och disciplin.</p>
                                            <p className="pt-2 border-t border-white/5 text-orange-300">Det viktigaste sättet att jämna ut varians är att följa strategin över tillräckligt många spel med konsekvent insatsstorlek.</p>
                                        </div>
                                    )
                                }}
                            />
                        </>
                    )}

                </div>

                {/* 4. CTA SECTION */}
                <div className="text-center pt-12 pb-8 border-t border-white/5">
                    <h2 className="text-2xl font-bold text-white mb-6">Redo att omsätta teorin i praktik?</h2>
                    {!session ? (
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-3 bg-[#2FAE8F] hover:bg-[#258E74] text-[#0F1720] px-8 py-4 rounded-xl font-black text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(47,174,143,0.3)] hover:shadow-[0_0_30px_rgba(47,174,143,0.5)]"
                        >
                            Starta ditt konto gratis
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    ) : (
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-3 bg-[#2FAE8F] hover:bg-[#258E74] text-[#0F1720] px-8 py-4 rounded-xl font-black text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(47,174,143,0.3)]"
                        >
                            Till Dashboarden
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    )}
                    <p className="text-sm text-gray-500 mt-4">
                        Spela ansvarsfullt. <a href="https://stodlinjen.se" target="_blank" rel="noreferrer" className="underline hover:text-gray-300">Stödlinjen.se</a>
                    </p>
                </div>

            </main>
        </div>
    )
}



// Helper Component for Content Cards
interface SchoolCardProps {
    icon: React.ReactNode;
    title: string;
    level: Level;
    badge?: string;
    content: Record<Level, React.ReactNode>;
}

function SchoolCard({ icon, title, level, badge, content }: SchoolCardProps) {
    return (
        <article className="bg-[#162230] border border-white/5 rounded-2xl p-5 md:p-6 hover:border-white/10 transition-colors flex flex-col h-full shadow-lg">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0F1720] border border-white/5 flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">
                    {title}
                </h3>
            </div>

            <div className="relative flex-grow">
                <div className="text-gray-300 leading-relaxed font-light text-sm md:text-base animate-in fade-in duration-500" key={level}>
                    {content[level]}
                </div>

                {badge && level === 'advanced' && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                            {badge}
                        </span>
                    </div>
                )}
            </div>
        </article>
    );
}
