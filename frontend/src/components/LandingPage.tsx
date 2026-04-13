
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'

import { SEO } from './SEO'
import { LoginModal } from './LoginModal'
import { Navbar } from './Navbar'
import { MobileDashboardPreview } from './MobileDashboardPreview'
import { DesktopDashboardPreview } from './DesktopDashboardPreview'
import { HockeyDashboardPreview } from './HockeyDashboardPreview'
import { PressTicker } from './PressTicker'



interface LandingPageProps {
    session?: Session | null
}

export function LandingPage({ session }: LandingPageProps) {
    const [email, setEmail] = useState('')
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Navigate to auth page with email state
        navigate('/auth', { state: { email } })
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
            <SEO />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

            {/* Navbar */}
            <Navbar session={session} />

            {/* Hero Content */}
            <main className="flex-grow flex flex-col items-center pt-24 md:pt-32 px-4 pb-20">
                <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
                    {/* 1. Large Quote / H1 */}
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 tracking-tighter text-white drop-shadow-2xl px-2">
                        Mer än tips – det är <span className="text-emerald-400">travintelligens</span>.
                    </h1>

                    {/* 2. Short Body Text */}
                    <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 font-light leading-relaxed px-4">
                        Automatiserade analyser, AI-värderade odds och dagliga PrimePicks.<br className="hidden md:block" />
                        Allt samlat i en premium-dashboard för seriösa spelare.
                    </p>

                    {/* 3. Minimal Email Signup */}
                    <div className="max-w-md mx-auto mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        <form onSubmit={handleSubmit} className="relative flex items-center">
                            <input
                                type="email"
                                placeholder="Ange din e-post"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-full pl-6 pr-32 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all backdrop-blur-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 bottom-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 rounded-full transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
                            >
                                Kom igång
                            </button>
                        </form>
                        <p className="text-slate-500 text-xs mt-4 font-medium tracking-wide">
                            GRATIS UNDER BETAPERIODEN • INGET KREDITKORT KRÄVS
                        </p>
                    </div>
                </div>

                {/* 4. Dashboard Preview - Full Width */}
                <div className="w-full px-2 md:px-0">
                    {/* Mobile Version */}
                    <div className="md:hidden max-w-lg mx-auto">
                        <MobileDashboardPreview />
                    </div>

                    {/* Desktop Version */}
                    <div className="hidden md:block w-full perspective-1000">
                        <DesktopDashboardPreview session={session} />
                    </div>
                    {/* Hockey Preview - Visible on all devices */}
                    <HockeyDashboardPreview session={session} />
                </div>

                {/* 5. Press Ticker - Full Width */}
                <div className="w-[calc(100%+2rem)] -mx-4 mt-20">
                    <PressTicker />
                </div>
            </main>

        </div>
    )
}
