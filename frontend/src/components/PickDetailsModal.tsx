
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, MapPin, AlignLeft, MessageSquare, TrendingUp, Flag, Ruler, Target } from 'lucide-react'
import { Pick } from '../types'

interface PickDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    pick: Pick | null
}

export function PickDetailsModal({ isOpen, onClose, pick }: PickDetailsModalProps) {
    if (!pick) return null

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
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 text-left align-middle shadow-2xl transition-all">

                                {/* Header Section */}
                                <div className="flex justify-between items-start mb-10 border-b border-slate-800 pb-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-[11px] font-medium tracking-widest text-slate-500 uppercase">
                                            <span className="text-indigo-400">Analys</span>
                                            <span>·</span>
                                            <span>{pick.track_name}</span>
                                            <span>·</span>
                                            <span>{pick.race_date}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-bold text-white mb-2">{pick.horse_name}</h2>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <span>Lopp {pick.race_number}</span>
                                                <span>·</span>
                                                {pick.driver && (
                                                    <>
                                                        <span>{pick.driver}</span>
                                                        <span>·</span>
                                                    </>
                                                )}
                                                <span className="text-emerald-400 font-medium">{pick.bet_type || 'Vinnare'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
                                    >
                                        <X size={24} strokeWidth={1.5} />
                                    </button>
                                </div>

                                {/* Content Grid */}
                                <div className="grid md:grid-cols-12 gap-10">

                                    {/* Main Content (Analys) - 8 cols */}
                                    <div className="md:col-span-8 space-y-10">

                                        {/* Analys & Motivering */}
                                        {pick.adam_notes && (
                                            <div className="prose prose-invert max-w-none">
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <AlignLeft size={16} className="text-indigo-400" />
                                                    Analys & Motivering
                                                </h3>
                                                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base font-light">
                                                    {pick.final_output_message || pick.adam_notes}
                                                </div>
                                            </div>
                                        )}

                                        {/* Intervju */}
                                        {pick.interview_info && (
                                            <div className="pt-8 border-t border-slate-800">
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <MessageSquare size={16} className="text-amber-400" />
                                                    Från stallet
                                                </h3>
                                                <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-800 italic text-slate-300">
                                                    "{pick.interview_info}"
                                                </div>
                                            </div>
                                        )}

                                        {/* Statistik */}
                                        {pick.statistics && (
                                            <div className="pt-8 border-t border-slate-800">
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <TrendingUp size={16} className="text-emerald-400" />
                                                    Statistik
                                                </h3>
                                                <p className="text-slate-300 leading-relaxed text-sm">
                                                    {pick.statistics}
                                                </p>
                                            </div>
                                        )}

                                    </div>

                                    {/* Sidebar (Data) - 4 cols */}
                                    <div className="md:col-span-4 space-y-6">

                                        {/* Odds Card */}
                                        <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-800">
                                            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-medium">Aktuellt Odds</div>
                                            <div className="flex items-baseline gap-2 mb-4">
                                                <span className="text-4xl font-semibold text-white">{pick.odds}</span>
                                            </div>
                                            {pick.bookmaker && (
                                                <div className="text-xs text-slate-400 font-medium">
                                                    Hos {pick.bookmaker}
                                                </div>
                                            )}

                                            <button className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-colors text-sm">
                                                Spela nu
                                            </button>
                                        </div>

                                        {/* Facts List */}
                                        <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-800 space-y-5">
                                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Lopp-fakta</h4>

                                            {pick.start_method && (
                                                <div>
                                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                        <Flag size={14} />
                                                        <span className="text-[10px] uppercase tracking-wider">Startmetod</span>
                                                    </div>
                                                    <div className="text-slate-300 font-medium">{pick.start_method}</div>
                                                </div>
                                            )}

                                            {pick.distance && (
                                                <div>
                                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                        <Ruler size={14} />
                                                        <span className="text-[10px] uppercase tracking-wider">Distans</span>
                                                    </div>
                                                    <div className="text-slate-300 font-medium">{pick.distance}</div>
                                                </div>
                                            )}

                                            {pick.start_lane && (
                                                <div>
                                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                        <MapPin size={14} />
                                                        <span className="text-[10px] uppercase tracking-wider">Spår</span>
                                                    </div>
                                                    <div className="text-slate-300 font-medium">{pick.start_lane}</div>
                                                </div>
                                            )}

                                            {pick.bet_type && (
                                                <div className="pt-4 border-t border-slate-700/50">
                                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                        <Target size={14} />
                                                        <span className="text-[10px] uppercase tracking-wider">Spelform</span>
                                                    </div>
                                                    <div className="text-emerald-400 font-medium">{pick.bet_type}</div>
                                                </div>
                                            )}
                                        </div>
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
