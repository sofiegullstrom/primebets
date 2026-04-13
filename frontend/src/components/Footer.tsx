
import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'

export function Footer() {
    return (
        <footer className="w-full bg-slate-900 border-t border-slate-800 pt-12 pb-8 text-slate-400 font-sans">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                {/* Brand Column */}
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        Prime<span className="text-emerald-400">Bets</span>
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-500">
                        Datadriven travinvestering för den moderna spelaren. Vi kombinerar expertis med AI.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a
                            href="https://www.instagram.com/primebets.se/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-800 p-2 rounded-full hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                            aria-label="Följ oss på Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Navigation Column */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Utforska</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/method" className="hover:text-emerald-400 transition-colors">Vår Metod</Link>
                        </li>
                        <li>
                            <Link to="/school" className="hover:text-emerald-400 transition-colors">Spelskola</Link>
                        </li>

                        <li>
                            <Link to="/analysis" className="hover:text-emerald-400 transition-colors">Analys & Statistik</Link>
                        </li>
                        <li>
                            <Link to="/press" className="hover:text-emerald-400 transition-colors">Press & Media</Link>
                        </li>
                    </ul>
                </div>

                {/* Support Column */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Kontakta Oss</Link>
                        </li>
                        <li>
                            {/* Placeholder links for legal docs */}
                            <Link to="/terms" className="hover:text-emerald-400 transition-colors">Användarvillkor</Link>
                        </li>
                        <li>
                            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Integritetspolicy</Link>
                        </li>
                    </ul>
                </div>

                {/* Responsible Gambling Column */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Spela Ansvarsfullt</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Spel ska vara underhållande. Spela aldrig för pengar du inte har råd att förlora.
                    </p>
                    <a href="https://stodlinjen.se" target="_blank" rel="noopener noreferrer" className="inline-block border border-slate-700 rounded px-3 py-1 text-xs hover:border-emerald-500 hover:text-emerald-400 transition-colors">
                        Stödlinjen.se
                    </a>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 border border-slate-700 rounded text-[10px] font-bold text-slate-500">18+</span>
                    <span>|</span>
                    <span>Copyright &copy; {new Date().getFullYear()} PrimeBets Invest AB</span>
                </div>
                <div>
                    Alla rättigheter förbehållna.
                </div>
            </div>
        </footer>
    )
}
