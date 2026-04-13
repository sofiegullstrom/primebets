import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { User, Mail, Bell } from 'lucide-react'
import { Navbar } from './Navbar'

export function SettingsPage({ session }: { session: Session }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMessage, setPasswordMessage] = useState('')

    useEffect(() => {
        if (session?.user?.user_metadata) {
            setFirstName(session.user.user_metadata.first_name || '')
            setLastName(session.user.user_metadata.last_name || '')
        }
    }, [session])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { error } = await supabase.auth.updateUser({
            data: { first_name: firstName, last_name: lastName }
        })

        if (error) {
            setMessage('Kunde inte uppdatera profilen.')
        } else {
            setMessage('Profil uppdaterad!')
        }
        setLoading(false)
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!currentPassword) {
            setPasswordMessage('Du måste ange ditt nuvarande lösenord.')
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage('Lösenorden matchar inte.')
            return
        }
        if (newPassword.length < 6) {
            setPasswordMessage('Lösenordet måste vara minst 6 tecken.')
            return
        }

        setPasswordLoading(true)
        setPasswordMessage('')

        // 1. Verify current password by signing in (re-auth)
        // We use the email from the current session
        const email = session?.user?.email
        if (!email) {
            setPasswordMessage('Kunde inte identifiera användaren.')
            setPasswordLoading(false)
            return
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: currentPassword
        })

        if (signInError) {
            setPasswordMessage('Felaktigt nuvarande lösenord.')
            setPasswordLoading(false)
            return
        }

        // 2. If verified, update to new password
        const { error } = await supabase.auth.updateUser({ password: newPassword })

        if (error) {
            setPasswordMessage('Fel vid byte av lösenord: ' + error.message)
        } else {
            setPasswordMessage('Lösenordet har uppdaterats!')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
        setPasswordLoading(false)
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            {/* Navbar */}
            <Navbar session={session} />

            <main className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Inställningar</h1>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-500" />
                            Profiluppgifter
                        </h2>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Förnamn</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Efternamn</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">E-post</label>
                                <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700/50">
                                    <Mail className="w-4 h-4" />
                                    {session?.user?.email}
                                    <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">Verifierad</span>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-lg text-sm ${message.includes('inte') ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Sparar...' : 'Spara ändringar'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Security Section */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-bold mb-6 text-white border-b border-slate-700 pb-4">
                            Ändra lösenord
                        </h3>

                        <form onSubmit={handleUpdatePassword} className="space-y-4" autoComplete="off">
                            {/* Fake hidden fields to satisfy browser's desire to autofill the first password field it finds */}
                            <div style={{ display: 'none' }}>
                                <input type="text" name="fake_username_to_prevent_autofill" autoComplete="username" tabIndex={-1} />
                                <input type="password" name="fake_password_to_prevent_autofill" autoComplete="current-password" tabIndex={-1} />
                            </div>

                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Nuvarande lösenord</label>
                                <input
                                    type="text"
                                    name={`pwd_verify_${Math.random().toString(36).slice(2)}`}
                                    id="current_password_verify_field"
                                    value={currentPassword}
                                    onFocus={(e) => e.target.type = "password"}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                                    placeholder="••••••••"
                                    autoComplete="off"
                                    data-lpignore="true"
                                    data-form-type="other"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Nytt lösenord</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Bekräfta lösenord</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>

                            {passwordMessage && (
                                <div className={`text-xs p-2 rounded ${passwordMessage.includes('inte') || passwordMessage.includes('Fel') || passwordMessage.includes('kort') ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {passwordMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={passwordLoading || !newPassword || !currentPassword}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {passwordLoading ? 'Uppdaterar...' : 'Byt lösenord'}
                            </button>
                        </form>
                    </div>

                    {/* Notifications Placeholder */}
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 opacity-75 h-fit">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-300">
                            <Bell className="w-5 h-5" /> Notiser
                        </h3>
                        <p className="text-sm text-slate-500">Kommer snart: Välj vilka notiser du vill ha via e-post och SMS.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
