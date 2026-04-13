
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface AuthFormProps {
    mode: 'login' | 'signup'
    title: string
    subtitle: string
    buttonText: string
    loadingText: string
    defaultEmail?: string
    onSuccess?: () => void
}

export function AuthForm({ mode, title, subtitle, buttonText, loadingText, defaultEmail = '', onSuccess }: AuthFormProps) {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState(defaultEmail)
    const [password, setPassword] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<'default' | 'forgot_password'>('default')
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

    // Signup specific state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [ageCheck, setAgeCheck] = useState(false)
    const [referralSource, setReferralSource] = useState('')

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {}
        let isValid = true

        if (!email) {
            errors.email = 'E-post saknas'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Ogiltig e-postadress'
            isValid = false
        }

        if (view === 'default') {
            if (!password) {
                errors.password = 'Lösenord saknas'
                isValid = false
            } else if (mode === 'signup' && password.length < 6) {
                errors.password = 'Lösenordet måste vara minst 6 tecken'
                isValid = false
            }
        }

        setFieldErrors(errors)
        return isValid
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setFieldErrors({})

        if (!email) {
            setFieldErrors({ email: 'Ange din e-postadress' })
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            })
            if (error) throw error
            setSuccess(true)
        } catch (error: any) {
            setError(error.message || 'Kunde inte återställa lösenordet')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError(null)
        setFieldErrors({})

        if (!validateForm()) return

        setLoading(true)

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error

                // Login successful
                if (onSuccess) onSuccess()
            } else {
                // Validate Signup Fields
                if (!ageCheck) {
                    throw new Error('Du måste intyga att du är över 18 år för att registrera dig.')
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: `${firstName} ${lastName}`.trim(),
                            first_name: firstName,
                            last_name: lastName,
                            referral_source: referralSource,
                            age_verified: true
                        }
                    }
                })
                if (error) throw error

                setSuccess(true)

                // Notify admin about new signup
                fetch('/api/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                }).catch(err => console.error('Failed to send notification email', err))

                if (onSuccess) onSuccess()
            }
        } catch (error: any) {
            // Handle specific Supabase errors for better UX
            if (error.message.includes('Invalid login credentials')) {
                setFieldErrors({
                    password: 'Fel e-postadress eller lösenord'
                })
            } else {
                setError(error.message || 'Ett fel uppstod')
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                    {view === 'forgot_password' ? 'Återställningslänk skickad!' : 'Konto skapat! 🚀'}
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                    Vi har skickat ett mail till <strong>{email}</strong>.
                    <br />
                    {view === 'forgot_password'
                        ? 'Klicka på länken i mailet för att välja ett nytt lösenord.'
                        : 'Klicka på länken i mailet för att aktivera ditt konto och logga in.'}
                </p>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-sm text-slate-400">
                    <p>Hittar du inte mailet? Kolla i skräpposten.</p>
                </div>
                <button
                    onClick={() => {
                        setSuccess(false)
                        setView('default')
                    }}
                    className="mt-6 text-emerald-500 hover:text-emerald-400 text-sm font-medium"
                >
                    Tillbaka till inloggning
                </button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                    {view === 'forgot_password' ? 'Återställ lösenord' : title}
                </h1>
                <p className="text-slate-400 text-sm">
                    {view === 'forgot_password'
                        ? 'Ange din e-postadress så skickar vi en återställningslänk'
                        : subtitle}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3 animate-fade-in">
                    <svg className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-rose-400 text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={view === 'forgot_password' ? handleForgotPassword : handleSubmit} className="space-y-4" noValidate autoComplete="off">
                {mode === 'signup' && view === 'default' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Förnamn</label>
                            <input
                                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                type="text"
                                placeholder="Anna"
                                value={firstName}
                                required
                                autoComplete="off"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Efternamn</label>
                            <input
                                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                type="text"
                                placeholder="Andersson"
                                value={lastName}
                                required
                                autoComplete="off"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">E-post</label>
                    <input
                        className={`w-full px-4 py-3 rounded-lg bg-slate-950 border text-white placeholder-slate-500 focus:outline-none transition-colors ${fieldErrors.email
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-800 focus:border-emerald-500'
                            }`}
                        type="email"
                        placeholder="namn@exempel.se"
                        value={email}
                        required
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {fieldErrors.email && (
                        <p className="text-rose-500 text-xs mt-1 ml-1">{fieldErrors.email}</p>
                    )}
                </div>

                {view === 'default' && (
                    <div>
                        <div className="flex justify-between items-center mb-1 ml-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase">Lösenord</label>
                            {mode === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => setView('forgot_password')}
                                    className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                                >
                                    Glömt lösenord?
                                </button>
                            )}
                        </div>
                        <input
                            className={`w-full px-4 py-3 rounded-lg bg-slate-950 border text-white placeholder-slate-500 focus:outline-none transition-colors ${fieldErrors.password
                                ? 'border-rose-500 focus:border-rose-500'
                                : 'border-slate-800 focus:border-emerald-500'
                                }`}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            required
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {fieldErrors.password && (
                            <p className="text-rose-500 text-xs mt-1 ml-1">{fieldErrors.password}</p>
                        )}
                    </div>
                )}

                {mode === 'signup' && view === 'default' && (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Hur har du hittat oss?</label>
                            <select
                                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                                value={referralSource}
                                required
                                onChange={(e) => setReferralSource(e.target.value)}
                            >
                                <option value="" disabled>Välj ett alternativ</option>
                                <option value="social_media">Sociala Medier (Instagram, Twitter, etc)</option>
                                <option value="google">Google / Sökmotor</option>
                                <option value="ai">AI / ChatGPT</option>
                                <option value="friend">Rekommenderad av en vän</option>
                                <option value="other">Annat</option>
                            </select>
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="ageCheck"
                                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                                checked={ageCheck}
                                onChange={(e) => setAgeCheck(e.target.checked)}
                            />
                            <label htmlFor="ageCheck" className="text-sm text-slate-400 leading-tight">
                                Jag intygar att jag är över 18 år gammal och att jag spelar ansvarsfullt.
                            </label>
                        </div>
                    </>
                )}

                <div className="pt-2">
                    <button
                        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading
                            ? (view === 'forgot_password' ? 'Skickar...' : loadingText)
                            : (view === 'forgot_password' ? 'Återställ lösenord' : buttonText)
                        }
                    </button>
                    {view === 'forgot_password' && (
                        <button
                            type="button"
                            onClick={() => setView('default')}
                            className="w-full mt-3 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Avbryt
                        </button>
                    )}
                </div>
            </form>
            <p className="mt-6 text-center text-xs text-slate-500">
                Genom att fortsätta godkänner du våra villkor och integritetspolicy.
            </p>
        </div>
    )
}
