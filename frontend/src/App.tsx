
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import { LandingPage } from './components/LandingPage'
import { SettingsPage } from './components/SettingsPage'
import { ContactPage } from './components/ContactPage'
import { MethodPage } from './components/MethodPage'
import { AnalysisPage } from './components/AnalysisPage'
import { HistoryPage } from './components/HistoryPage'
import { UpdatePassword } from './components/UpdatePassword'
import { TermsPage } from './components/TermsPage'
import { PrivacyPage } from './components/PrivacyPage'
import { Footer } from './components/Footer'
import { BettingSchoolPage } from './components/BettingSchoolPage'
import { PressPage } from './components/PressPage'
import { V2DesignPlayground } from './components/V2DesignPlayground'
import { DashboardExplainer } from './components/DashboardExplainer'
import { AdminPage } from './components/AdminPage'
import { ChatWidget } from './components/ChatWidget'
import EmailPreview from './components/EmailPreview'
import { ContentHub } from './components/ContentHub'
import { ArticlePage } from './components/ArticlePage'
import { HockeyDashboard } from './components/HockeyDashboard'

import ScrollToTop from './components/ScrollToTop'

function App() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-500">Laddar...</div>
    }

    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
                    <div className="flex-grow">
                        <Routes>
                            {/* V2 Design Playground (Dev Only) */}
                            <Route path="/v2-preview" element={<V2DesignPlayground />} />
                            <Route path="/email-preview" element={<EmailPreview />} />

                            {/* Public Route: Landing Page */}
                            <Route path="/" element={<LandingPage session={session} />} />

                            {/* Auth Route */}
                            <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/dashboard" />} />

                            {/* Password Reset Route */}
                            <Route path="/auth/update-password" element={<UpdatePassword />} />

                            {/* Protected Route: Dashboard (Redirects to Explainer if not logged in) */}
                            <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <DashboardExplainer session={session} />} />
                            <Route path="/hockey" element={<HockeyDashboard session={session} />} />

                            {/* Protected Route: Settings */}
                            <Route path="/settings" element={session ? <SettingsPage session={session} /> : <Navigate to="/auth" />} />

                            {/* Protected Route: Admin */}
                            <Route path="/admin" element={session ? <AdminPage session={session} /> : <Navigate to="/auth" />} />

                            {/* Public Routes */}
                            <Route path="/school" element={<BettingSchoolPage session={session} />} />
                            <Route path="/contact" element={<ContactPage session={session} />} />
                            <Route path="/method" element={<MethodPage session={session} />} />
                            <Route path="/analysis" element={<AnalysisPage session={session} />} />
                            <Route path="/history" element={<HistoryPage session={session} />} />
                            <Route path="/press" element={<PressPage session={session} />} />
                            <Route path="/terms" element={<TermsPage session={session} />} />
                            <Route path="/privacy" element={<PrivacyPage session={session} />} />

                            {/* Magasin Routes */}
                            <Route path="/magasin" element={<ContentHub session={session} />} />
                            <Route path="/magasin/:slug" element={<ArticlePage session={session} />} />

                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                    <Footer />
                    <ChatWidget />
                </div>
            </Router>
        </HelmetProvider>
    )
}

export default App
