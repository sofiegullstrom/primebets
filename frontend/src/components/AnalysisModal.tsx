import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Pick } from '../types'
import { X } from 'lucide-react'

interface AnalysisModalProps {
    isOpen: boolean
    closeModal: () => void
    pick: Pick
}

export function AnalysisModal({ isOpen, closeModal, pick }: AnalysisModalProps) {
    const hasOdds = pick.odds && pick.odds > 0

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all border border-slate-700">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <Dialog.Title as="h3" className="text-2xl font-bold text-white">
                                            {pick.horse_name}
                                        </Dialog.Title>
                                        <p className="text-slate-400">
                                            {pick.track_name} • Lopp {pick.race_number} • {pick.start_method}
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Odds Section */}
                                    <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                        <div>
                                            <span className="text-slate-400 text-sm block">Aktuellt Odds</span>
                                            <span className="text-2xl font-bold text-emerald-400">
                                                {hasOdds ? pick.odds : '-'}
                                            </span>
                                        </div>
                                        {!pick.net_result && (
                                            <button
                                                disabled={!hasOdds}
                                                onClick={() => {
                                                    if (!pick.bookmaker) return
                                                    const provider = pick.bookmaker.toUpperCase().trim()
                                                    const providerUrls: Record<string, string> = {
                                                        'SVS': 'https://www.svenskaspel.se/',
                                                        'SVENSKA SPEL': 'https://www.svenskaspel.se/',
                                                        'LEOVEGAS': 'https://www.leovegas.com/sv-se/',
                                                        'BETMGM': 'https://www.betmgm.se/',
                                                        'BET365': 'https://www.bet365.com/',
                                                        'UNIBET': 'https://www.unibet.se/',
                                                        'ATG': 'https://www.atg.se/'
                                                    }
                                                    const url = providerUrls[provider]
                                                    if (url) window.open(url, '_blank', 'noopener,noreferrer')
                                                }}
                                                className={`px-6 py-2 rounded-lg font-bold transition-all ${hasOdds
                                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {hasOdds ? 'Spela med bästa odds' : 'Odds ej släppta'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Analysis Content */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-2">Analys</h4>
                                            <div className="bg-slate-900/30 p-4 rounded-lg text-slate-300 leading-relaxed">
                                                {pick.final_output_message || pick.adam_notes || "Ingen analys tillgänglig."}
                                            </div>
                                        </div>

                                        {pick.statistics && (
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-2">Statistik</h4>
                                                <p className="text-slate-300">{pick.statistics}</p>
                                            </div>
                                        )}

                                        {pick.interview_info && (
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-2">Intervju</h4>
                                                <p className="text-slate-300 italic">"{pick.interview_info}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
