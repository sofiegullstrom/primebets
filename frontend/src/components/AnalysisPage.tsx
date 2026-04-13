import { Session } from '@supabase/supabase-js'
import { Navbar } from './Navbar'
import { AnalysisContent } from './AnalysisContent'

interface AnalysisPageProps {
    session?: Session | null
}

export function AnalysisPage({ session }: AnalysisPageProps) {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Navbar session={session} />

            <main className="max-w-7xl mx-auto px-4 py-12">
                <AnalysisContent session={session} />
            </main>
        </div>
    )
}
