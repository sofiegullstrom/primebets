
import { useState, useEffect } from 'react'
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { AuthForm } from './AuthForm'

export function Auth() {
    const [email, setEmail] = useState('')
    const [searchParams] = useSearchParams()
    // Default to signup unless mode=login is specified
    const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup'
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

    const location = useLocation()

    useEffect(() => {
        // Pre-fill email if passed from Landing Page
        if (location.state && location.state.email) {
            setEmail(location.state.email)
        }
    }, [location])

    // Update mode if URL changes (though state update usually sufficient)
    useEffect(() => {
        const urlMode = searchParams.get('mode')
        if (urlMode === 'login') setMode('login')
        else if (urlMode === 'signup') setMode('signup')
    }, [searchParams])


    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950 p-4 font-sans">
            <div className="w-full max-w-md">
                {mode === 'signup' ? (
                    <>
                        <AuthForm
                            key="signup"
                            mode="signup"
                            title="Skapa konto"
                            subtitle="Kom igång med PrimeBets idag"
                            buttonText="Skapa konto"
                            loadingText="Skapar konto..."
                            defaultEmail={email}
                        />
                        <div className="text-center mt-6">
                            <span className="text-slate-400 text-sm">Har du redan ett konto? </span>
                            <button
                                onClick={() => setMode('login')}
                                className="text-emerald-400 text-sm font-bold hover:underline"
                            >
                                Logga in
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <AuthForm
                            key="login"
                            mode="login"
                            title="Välkommen tillbaka"
                            subtitle="Logga in för att se dina analyser"
                            buttonText="Logga in"
                            loadingText="Loggar in..."
                            defaultEmail={email}
                        />
                        <div className="text-center mt-6">
                            <span className="text-slate-400 text-sm">Har du inget konto? </span>
                            <button
                                onClick={() => setMode('signup')}
                                className="text-emerald-400 text-sm font-bold hover:underline"
                            >
                                Skapa konto
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-8 text-center border-t border-slate-800 pt-6">
                    <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">
                        ← Tillbaka till startsidan
                    </Link>
                </div>
            </div>
        </div>
    )
}
