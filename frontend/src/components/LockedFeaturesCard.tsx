
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

export function LockedFeaturesCard() {
    return (
        <Link
            to="/auth"
            className="block h-full min-h-[300px] bg-slate-900/50 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center p-8 transition-all hover:bg-slate-900/80 hover:border-slate-700 group cursor-pointer"
        >
            <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>

            <h3 className="text-lg font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                Fler analyser och statistik...
            </h3>
        </Link>
    )
}
