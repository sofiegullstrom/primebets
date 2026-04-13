
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Trophy, AlertCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Pick } from '../types'

interface ResultsModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    tableName: 'saturday_picks' | 'weekly_scout'
}

export function ResultsModal({ isOpen, onClose, title, tableName }: ResultsModalProps) {
    const [picks, setPicks] = useState<Pick[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            fetchResults()
        }
    }, [isOpen, tableName])

    async function fetchResults() {
        setLoading(true)
        const todayStr = new Date().toISOString().split('T')[0]

        // Fetch last 5 items that are BEFORE today (history)
        // We order by race_date descending to get the Latest first
        const { data } = await supabase
            .from(tableName)
            .select('*')
            .lt('race_date', todayStr)
            .order('race_date', { ascending: false })
            .limit(5)

        if (data) setPicks(data as Pick[])
        setLoading(false)
    }

    // Helper to render status badge
    const renderStatus = (pick: Pick) => {
        const s = (pick.status || '').toLowerCase()

        // If status is set explicitly
        if (s === 'won' || s === 'vinst') {
            return (
                <div className="flex items-center space-x-1 text-emerald-400">
                    <Trophy size={16} />
                    <span className="text-sm font-bold">Vinst</span>
                </div>
            )
        }
        if (s === 'lost' || s === 'förlust') {
            return (
                <div className="flex items-center space-x-1 text-red-400">
                    <AlertCircle size={16} />
                    <span className="text-sm font-bold">Förlust</span>
                </div>
            )
        }

        // Fallback or explicit pending
        return (
            <div className="flex items-center space-x-1 text-slate-500">
                <Clock size={16} />
                <span className="text-sm font-bold">Väntar Resultat</span>
            </div>
        )
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white uppercase tracking-wider">
                                        {title} - Senaste 5
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="text-center py-8 text-slate-500">Laddar resultat...</div>
                                ) : picks.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">Inga tidigare resultat hittades.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {picks.map((pick) => (
                                            <div key={pick.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-bold text-white text-lg">{pick.horse_name}</div>
                                                        <div className="text-xs text-slate-400">{pick.race_date} • {pick.track_name}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block font-bold text-amber-500">{pick.odds}</span>
                                                        {pick.net_result ? (
                                                            <span className={`text-xs ${pick.net_result > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                {pick.net_result > 0 ? '+' : ''}{pick.net_result}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                                                    <span className="text-xs text-slate-500 uppercase tracking-wide">Resultat</span>
                                                    {renderStatus(pick)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 text-center">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        Stäng
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
