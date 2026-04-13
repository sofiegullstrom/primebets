import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { User, Settings, LogOut, Mail, Shield } from 'lucide-react'

interface UserDropdownProps {
    session: Session
}

export function UserDropdown({ session }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        checkAdminStatus()
    }, [session])

    const checkAdminStatus = async () => {
        if (!session?.user) return

        // 1. Check hardcoded emails first (fastest)
        const email = session.user.email
        if (email === 'sofie.g63@outlook.com' || email === 'primebets.se@gmail.com' || email === 'adam.sundqvistt@gmail.com') {
            setIsAdmin(true)
            return
        }

        // 2. Check database role
        try {
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

            if (data?.role === 'admin') {
                setIsAdmin(true)
            }
        } catch (error) {
            console.error('Error checking admin status:', error)
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    // Get initials or default avatar
    const getInitials = () => {
        if (session.user.user_metadata?.first_name) {
            return session.user.user_metadata.first_name[0].toUpperCase()
        }
        return <User className="w-5 h-5" />
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
            >
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold border-2 border-slate-800">
                    {getInitials()}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-700/50 mb-2">
                        <p className="text-sm font-medium text-white truncate">
                            {session.user.user_metadata?.first_name
                                ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name || ''}`
                                : 'Användare'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                    </div>

                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-slate-700/50 hover:text-white font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <User className="w-4 h-4" />
                        Dashboard
                    </Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#2FAE8F] hover:bg-slate-700/50 hover:text-[#2FAE8F] font-bold transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Shield className="w-4 h-4" />
                            Admin
                        </Link>
                    )}

                    <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Settings className="w-4 h-4" />
                        Inställningar
                    </Link>

                    <Link
                        to="/contact"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Mail className="w-4 h-4" />
                        Kontakta oss
                    </Link>

                    <div className="border-t border-slate-700/50 my-2"></div>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Logga ut
                    </button>
                </div>
            )}
        </div>
    )
}
