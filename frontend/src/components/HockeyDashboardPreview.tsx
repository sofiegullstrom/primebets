import { ArrowRight, Bell, Target, X } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { supabase } from '../lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HockeyDashboardPreview({ session: _session }: { session?: Session | null }) {
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
    const [subscribeEmail, setSubscribeEmail] = useState('')
    const [subscribeConsent, setSubscribeConsent] = useState(false)
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!subscribeEmail || !subscribeConsent) return
        setSubscribeStatus('loading')

        try {
            const { error } = await supabase.from('subscribers').insert({
                email: subscribeEmail,
                consent_given: subscribeConsent,
                source: 'hockey_waitlist'
            })

            if (error) {
                if (error.code === '23505') {
                    setSubscribeStatus('success') // Already subscribed
                } else {
                    throw error
                }
            } else {
                setSubscribeStatus('success')
            }

            setTimeout(() => {
                setIsSubscribeOpen(false)
                setSubscribeStatus('idle')
                setSubscribeEmail('')
                setSubscribeConsent(false)
            }, 3000)
        } catch (err) {
            console.error('Subscription error:', err)
            setSubscribeStatus('error')
        }
    }

    return (
        <div className="w-full max-w-[120rem] mx-auto px-4 perspective-1000 mt-12 md:mt-24 opacity-90 hover:opacity-100 transition-opacity duration-700">
            {/* Header for the section */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter text-white drop-shadow-2xl">
                    Snart släpper vi <span className="text-blue-500">Hockey</span>.
                </h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                    Samma kraftfulla AI-analys. Samma premium-känsla. Ny sport.
                </p>
            </div>


            {/* Monitor Frame (Desktop) / Clean Card (Mobile) */}
            <div className="relative mx-auto bg-transparent md:bg-slate-700 rounded-3xl md:rounded-[2.5rem] shadow-none md:shadow-2xl border-0 md:border-[12px] border-slate-700 ring-0 md:ring-1 ring-white/10 input-monitor-frame aspect-auto md:aspect-[16/10] max-w-6xl">
                <div className="h-full w-full bg-[#0F1720] rounded-[1.5rem] md:rounded-[1.7rem] overflow-hidden relative group flex items-center justify-center border border-white/5 md:border-0">

                    {/* Desktop: Fake Scaled Dashboard Background */}
                    <div className="hidden md:flex absolute inset-0 w-[153.8%] h-[153.8%] origin-top-left scale-[0.65] p-8 flex-col gap-6 filter blur-[6px] opacity-60 pointer-events-none select-none">
                        {/* Fake Header */}
                        <div className="w-full flex justify-between items-center mb-4">
                            <div className="h-14 w-64 bg-[#162230] rounded-2xl border border-white/5"></div>
                            <div className="h-14 w-[500px] bg-[#162230] rounded-2xl border border-white/5 flex gap-2 p-2">
                                <div className="h-full w-1/3 bg-blue-500/20 rounded-xl"></div>
                            </div>
                        </div>

                        {/* Fake Grid */}
                        <div className="grid grid-cols-2 gap-8 h-full">
                            {/* Card 1 */}
                            <div className="rounded-3xl bg-[#162230]/40 border border-white/5 p-8 flex flex-col gap-6">
                                <div className="flex justify-between">
                                    <div className="w-32 h-8 bg-white/10 rounded-full"></div>
                                    <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                </div>
                                <div className="w-full h-40 bg-white/5 rounded-2xl mt-4"></div>
                                <div className="w-3/4 h-8 bg-white/10 rounded-lg mt-2"></div>
                                <div className="w-1/2 h-6 bg-white/5 rounded-lg"></div>
                                <div className="mt-auto w-full h-16 bg-blue-500/20 rounded-xl border border-blue-500/20"></div>
                            </div>
                            {/* Card 2 */}
                            <div className="rounded-3xl bg-[#162230]/40 border border-white/5 p-8 flex flex-col gap-6">
                                <div className="flex justify-between">
                                    <div className="w-32 h-8 bg-white/10 rounded-full"></div>
                                    <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                </div>
                                <div className="w-full h-40 bg-white/5 rounded-2xl mt-4"></div>
                                <div className="w-3/4 h-8 bg-white/10 rounded-lg mt-2"></div>
                                <div className="w-1/2 h-6 bg-white/5 rounded-lg"></div>
                                <div className="mt-auto w-full h-16 bg-blue-500/20 rounded-xl border border-blue-500/20"></div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Simple Ambient Background */}
                    <div className="md:hidden absolute inset-0 bg-gradient-to-br from-[#162230] to-[#0F1720]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    </div>

                    {/* Content Overlay - "Coming Soon" Badge */}
                    <div className="relative z-10 w-full max-w-sm md:max-w-none flex flex-col items-center justify-center text-center p-8 md:p-0">
                        <div className="bg-[#162230]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <span className="text-3xl md:text-4xl">🏒</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Hockeyanalys</h3>
                            <p className="text-slate-400 mb-6 max-w-xs text-sm md:text-base">Snart kommer Hockey till PrimeBets</p>

                            <button
                                onClick={() => setIsSubscribeOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 text-sm md:text-base"
                            >
                                <span>Föranmäl dig här</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
                {/* Frame decorations - Desktop only */}
                <div className="hidden md:block relative mx-auto w-32 h-4 bg-slate-700 rounded-b-xl shadow-lg -mt-1 z-0"></div>
                <div className="hidden md:block relative mx-auto w-40 h-2 bg-black/40 blur-xl mt-1"></div>
            </div>

            {/* Subscription Modal */}
            <Transition appear show={isSubscribeOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsSubscribeOpen(false)}>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#162230] border border-white/10 p-8 text-left align-middle shadow-2xl transition-all relative">
                                    <div className="absolute top-0 right-0 p-4">
                                        <button onClick={() => setIsSubscribeOpen(false)} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center mb-6 text-center">
                                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                                            <Bell className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <Dialog.Title as="h3" className="text-2xl font-black text-white">
                                            Var först med Hockeyn
                                        </Dialog.Title>
                                    </div>

                                    {subscribeStatus === 'success' ? (
                                        <div className="text-center py-8">
                                            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500 mb-4 animate-bounce">
                                                <Target className="w-8 h-8" />
                                            </div>
                                            <h4 className="text-white font-bold text-xl mb-2">Tack för din anmälan!</h4>
                                            <p className="text-gray-400">Vi meddelar dig så fort hockeysektionen öppnar.</p>
                                            <button
                                                onClick={() => setIsSubscribeOpen(false)}
                                                className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
                                            >
                                                Stäng
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubscribe} className="space-y-4">
                                            <p className="text-center text-gray-400 mb-6">
                                                Ange din e-postadress nedan för att få en notis när vi lanserar.
                                            </p>
                                            <div>
                                                <label htmlFor="email" className="sr-only">E-post</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={subscribeEmail}
                                                    onChange={(e) => setSubscribeEmail(e.target.value)}
                                                    placeholder="din.email@exempel.se"
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                <input
                                                    type="checkbox"
                                                    id="consent"
                                                    checked={subscribeConsent}
                                                    onChange={(e) => setSubscribeConsent(e.target.checked)}
                                                    className="mt-1 rounded bg-[#162230] border-white/20 text-blue-500 focus:ring-0 focus:ring-offset-0"
                                                    required
                                                />
                                                <label htmlFor="consent" className="text-xs text-gray-400 cursor-pointer select-none">
                                                    Jag godkänner att PrimeBets sparar min e-postadress för att skicka notiser.
                                                </label>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={subscribeStatus === 'loading' || !subscribeConsent}
                                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                {subscribeStatus === 'loading' ? (
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                ) : (
                                                    <>
                                                        <span>Bevaka lansering</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
