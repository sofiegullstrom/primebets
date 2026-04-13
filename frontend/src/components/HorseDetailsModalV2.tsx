import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X, History, TrendingUp } from 'lucide-react'

interface HorseData {
    name: string;
    roi?: string;
    avgOdds?: string;
    totalBets: number;
    wins: number;
    bestOdds: string;
    lastPlayed: string;
    analysis: string;
}

interface HorseDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: HorseData | null;
}

export const HorseDetailsModalV2 = ({ isOpen, onClose, data }: HorseDetailsModalProps) => {
    if (!data) return null;

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
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px]" />
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
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-3xl bg-[#162230]/20 backdrop-blur-2xl border border-white/20 text-left align-middle shadow-2xl shadow-black/50 transition-all relative ring-1 ring-white/10">

                                {/* Global background gradient for the whole card */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#162230]/40 via-[#1b2a3a]/20 to-[#0d141c]/60 z-0 pointer-events-none opacity-50"></div>

                                {/* Background Effects */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2FAE8F]/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-overlay"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-overlay"></div>

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-50 text-gray-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full border border-white/10 backdrop-blur-md"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="grid grid-cols-1 h-full relative z-10">
                                    {/* Left Column: Stats & Analysis */}
                                    <div className="p-8 relative overflow-hidden">

                                        {/* Background Image */}
                                        <div className="absolute inset-0 z-0 pointer-events-none">
                                            <div className="absolute inset-0 bg-[#162230]"></div>
                                            <div className="absolute inset-0 bg-[url('/horse_wreath.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale-[30%]"></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#162230] via-[#162230]/40 to-transparent"></div>
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* Header: Horse Name & "Senaste heta" */}
                                            <div className="mb-8">
                                                <Dialog.Title as="h3" className="text-4xl font-black text-white mb-2 tracking-tight" translate="no">
                                                    {data.name}
                                                </Dialog.Title>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 w-12 bg-[#2FAE8F] rounded-full shadow-[0_0_10px_-2px_rgba(47,174,143,0.5)]"></div>
                                                    <span className="text-[#2FAE8F] text-sm font-medium tracking-wide">Senaste heta</span>
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" translate="no">
                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Antal Spel</div>
                                                    <div className="text-2xl font-black text-white">{data.totalBets}</div>
                                                </div>
                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Vinster</div>
                                                    <div className="text-2xl font-black text-[#2a7259]">{data.wins}</div>
                                                </div>
                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ROI</div>
                                                    <div className="text-2xl font-black text-[#2a7259]">{data.roi || '-'}</div>
                                                </div>
                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Snittodds</div>
                                                    <div className="text-2xl font-black text-white">{data.avgOdds || '-'}</div>
                                                </div>
                                            </div>

                                            {/* Best Odds Highlight */}
                                            <div className="bg-gradient-to-r from-[#162230] to-[#1F2E3F] rounded-2xl p-1 border border-white/10 shadow-lg mb-8 relative">
                                                <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#F5A623] rounded-r-full shadow-[0_0_10px_rgba(245,166,35,0.4)]"></div>
                                                <div className="py-4 px-6 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bästa odds</span>
                                                    <span className="text-3xl font-black text-[#F5A623] drop-shadow-sm tracking-tight">{data.bestOdds}</span>
                                                </div>
                                            </div>

                                            {/* Analysis Text */}
                                            <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-md mt-auto">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <TrendingUp className="w-4 h-4 text-[#2FAE8F]" />
                                                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Analys</h4>
                                                </div>
                                                <p className="text-gray-200 text-sm leading-relaxed border-l-2 border-[#2FAE8F]/50 pl-4 font-medium">
                                                    {data.analysis}
                                                </p>
                                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-400">
                                                    <History className="w-3.5 h-3.5" />
                                                    <span>Senast spelad: <span className="text-gray-300">{data.lastPlayed}</span></span>
                                                </div>
                                            </div>
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
