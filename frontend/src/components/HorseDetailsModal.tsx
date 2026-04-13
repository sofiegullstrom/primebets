import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X, History, Calendar, User, HeartPulse, TrendingUp } from 'lucide-react'

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

export const HorseDetailsModal = ({ isOpen, onClose, data }: HorseDetailsModalProps) => {
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

                                <div className="grid grid-cols-1 md:grid-cols-[2.2fr_1fr] h-full relative z-10">
                                    {/* Left Column: Stats & Analysis */}
                                    <div className="p-8 border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">

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
                                            <div className="grid grid-cols-2 gap-4 mb-8">
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
                                                    <div className="text-2xl font-black text-[#2a7259]">{data.roi || (data.wins / data.totalBets > 0.5 ? '+High%' : '+Unknown%')}</div>
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

                                    {/* Right Column: Hästfakta */}
                                    <div className="relative flex flex-col h-full bg-white/5 overflow-hidden">

                                        {/* Background Image & Effects - Positioned absolutely behind content */}
                                        <div className="absolute inset-0 z-0">
                                            <div className="absolute inset-0 bg-[#0f172a]" />
                                            {/* Gradient/Pattern */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#2FAE8F]/20 via-[#162230] to-[#000000] opacity-60"></div>
                                            {/* Image with fade */}
                                            <div className="absolute inset-x-0 top-0 h-96 bg-[url('https://images.unsplash.com/photo-1553331818-a3597dc8fdc4?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-overlay opacity-20 mask-image-linear-gradient-to-b"></div>
                                            {/* Gradient Overlay for Text Readability */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#162230]/40 to-[#162230]/90"></div>
                                        </div>

                                        {/* Content - z-10 to sit above background */}
                                        <div className="relative z-10 pt-12 px-8 pb-10 flex flex-col h-full">
                                            {/* Horse Profile & Name */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden">
                                                    {/* Placeholder Horse Icon (using an emoji or generic icon if no asset) - Using User for now as generic profile or specific SVG if possible. 
                                                        User asked for "häst symbol". I will use a simple SVG path for a chess knight style horse. */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                                        <path d="M19 4h-2V2h-2v2H9v2h2v2H9v2H7v2H5v2H3v6h18v-6h-2v-4h-2v-2h2V8h2V4zM7 16H5v-2h2v2zm2-2H7v-2h2v2zm2-2H9v-2h2v2zm6-4h2v2h-2V8zm-2-2h2v2h-2V6zm-2 0h-2V4h2v2z" />
                                                    </svg>
                                                    {/* Better Horse Head Path (simplified) */}
                                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://cdn-icons-png.flaticon.com/512/2809/2809590.png')`, filter: 'invert(1)' }}></div>
                                                </div>
                                                <div className="text-lg font-bold text-white tracking-wide" translate="no">{data.name}</div>
                                            </div>

                                            <div className="w-full h-px bg-white/10 mb-6"></div>

                                            {/* Basic Facts Vertical List */}
                                            <div className="flex flex-col gap-6 mb-6">
                                                <div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kön</div>
                                                    <div className="flex items-center gap-2 text-lg text-white font-medium">
                                                        <HeartPulse className="w-5 h-5 text-[#2FAE8F]" />
                                                        <span>Hingst</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ålder</div>
                                                    <div className="flex items-center gap-2 text-lg text-white font-medium">
                                                        <Calendar className="w-5 h-5 text-[#2FAE8F]" />
                                                        <span>5 år</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kusk</div>
                                                    <div className="flex items-center gap-2 text-lg text-white font-medium">
                                                        <User className="w-5 h-5 text-gray-300" />
                                                        <span className="truncate">Örjan Kihlström</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tränare</div>
                                                    <div className="flex items-center gap-2 text-lg text-white font-medium">
                                                        <User className="w-5 h-5 text-gray-300" />
                                                        <span className="truncate">Daniel Redén</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full h-px bg-white/10 mb-6"></div>

                                            {/* Styrkor */}
                                            <div className="mb-6">
                                                <div className="mb-3">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Styrkor</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Stark avslutning', 'Trivs på distansen', 'Startsnabb'].map((tag, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#2a7259]/10 text-[#2a7259] border border-[#2a7259]/20">
                                                            {tag.toUpperCase()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="w-full h-px bg-white/10 mb-6"></div>

                                            {/* Svagheter */}
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Svagheter</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Galopprisk', 'Ojämn'].map((tag, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#B46B1A]/10 text-[#B46B1A] border border-[#B46B1A]/20">
                                                            {tag.toUpperCase()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="w-full h-px bg-white/10 mb-6"></div>

                                            {/* Expert Notes */}
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expert notering</span>
                                                </div>
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    En mycket kapabel häst som visat stigande form på slutet. Har en vass speed att tillgå och trivs ypperligt över dagens distans. Kan vara en luring om tempot blir högt.
                                                </p>
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
