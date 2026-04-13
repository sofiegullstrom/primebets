import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { Menu, X } from 'lucide-react'
import { UserDropdown } from './UserDropdown'

interface NavbarProps {
    session?: Session | null
}

export function Navbar({ session }: NavbarProps) {
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { to: '/dashboard', label: 'Trav' },
        { to: '/hockey', label: 'Hockey' },
        { to: '/method', label: 'Vår metod' },
        { to: '/school', label: 'Spelskola' },

        { to: '/analysis', label: 'Analys & Statistik' },
        { to: '/magasin', label: 'Magasin' },
        { to: '/contact', label: 'Kontakt' }
    ]

    return (
        <nav className="max-w-7xl mx-auto w-full p-4 md:p-6 border-b border-slate-800/50 relative z-50">
            <div className="flex justify-between items-center relative">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity z-20">
                    <img src="/logo.png" alt="PrimeBets Logo" className="h-7 md:h-8 w-auto" />
                    <span className="font-bold text-lg md:text-xl tracking-tight">PrimeBets</span>
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
                    {navLinks.filter(link => !(session && link.to === '/dashboard')).map(link => (
                        <Link
                            to={link.to}
                            translate="no"
                            className={`notranslate hover:text-white transition-colors flex items-center gap-2 ${location.pathname === link.to ? 'text-white' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side: Auth & Menu */}
                <div className="flex items-center gap-3 md:gap-4 z-20">
                    {/* Auth Buttons */}
                    {!session && (
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link
                                to="/auth?mode=login"
                                className="text-slate-300 hover:text-white transition-colors font-bold text-xs md:text-sm whitespace-nowrap"
                            >
                                Logga in
                            </Link>
                            <Link
                                to="/auth"
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-3 py-2 md:px-5 md:py-2.5 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
                            >
                                Skapa konto
                            </Link>
                        </div>
                    )}

                    {/* Hamburger Menu & Mobile User Dropdown */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-300 hover:text-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <div className="">
                            {/* Profile Circle always visible if logged in */}
                            {session && (
                                <UserDropdown session={session} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Menu (Fixed Sidebar) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Sidebar Panel */}
                    <div className="relative w-[300px] h-full bg-[#0F1720] border-l border-white/10 shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xl font-bold text-white tracking-wide">Meny</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    translate="no"
                                    className={`
                                        notranslate flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium group
                                        ${location.pathname === link.to
                                            ? 'bg-[#2FAE8F]/10 text-[#2FAE8F] border border-[#2FAE8F]/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-3">
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
// deploy check v1
