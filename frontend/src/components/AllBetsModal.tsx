
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Calendar } from 'lucide-react';



interface Bet {
    date: string;
    horse: string;
    type: string;
    odds: string;
    result: 'Win' | 'Loss' | 'Pending' | 'Void';
    profit: string;
}

interface AllBetsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bets: Bet[];
}

export const AllBetsModal = ({ isOpen, onClose, bets }: AllBetsModalProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sort bets by date descending if not already sorted
    const sortedBets = [...bets].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const totalPages = Math.ceil(sortedBets.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedBets.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-[#162230]/90 backdrop-blur-xl border border-white/10 p-6 text-left align-middle shadow-2xl transition-all" translate="no">
                                <div className="flex items-center justify-between mb-8">
                                    <Dialog.Title as="h3" className="text-2xl font-black text-white flex items-center gap-3">
                                        <Calendar className="w-6 h-6 text-[#2FAE8F]" />
                                        Alla Spel
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/20">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/5">
                                                <th className="p-4 pl-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Datum</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Häst</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Spelform</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Odds</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Resultat</th>
                                                <th className="p-4 pr-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Netto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {currentItems.map((bet, index) => (
                                                <tr key={index} className="group hover:bg-white/5 transition-colors">
                                                    <td className="p-4 pl-6 text-sm font-medium text-gray-400">{bet.date}</td>
                                                    <td className="p-4 text-sm font-bold text-white">{bet.horse}</td>
                                                    <td className="p-4 text-sm text-gray-300">
                                                        <span className="px-2 py-1 rounded bg-[#162230] border border-white/10 text-xs shadow-inner">
                                                            {bet.type}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm font-bold text-white text-right text-[#F5A623]">{bet.odds}</td>
                                                    <td className="p-4 text-center">
                                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${bet.result === 'Win'
                                                            ? 'bg-[#2a7259]/10 border-[#2a7259]/20 text-[#2a7259]'
                                                            : 'bg-red-500/10 border-red-500/20 text-red-500'
                                                            }`}>
                                                            {bet.result === 'Win' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">{bet.result}</span>
                                                        </div>
                                                    </td>
                                                    <td className={`p-4 pr-6 text-sm font-bold text-right ${bet.result === 'Win' ? 'text-[#2a7259]' : 'text-red-500'
                                                        }`}>
                                                        {bet.profit}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-6 px-2">

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                                    ? 'bg-[#2a7259] text-white shadow-lg'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
