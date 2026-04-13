
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, MapPin, ArrowUpRight, Layers } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// --- Types ---
interface CalendarEvent {
    id: string;
    date: Date; // The date of the event
    title: string;
    type: 'Stort spel' | 'Långtidsspel' | 'Varning info' | 'Extra bevakning' | 'Inställt lopp' | 'Säsongstopp';
    description: string;
    location?: string;
    motivation?: string[];
    impact?: string;
    status?: 'Kommande' | 'Live' | 'Avslutad';
    releaseDate?: string;
}



const EVENT_COLORS = {
    'Stort spel': 'bg-[#D4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]', // Yellow
    'Långtidsspel': 'bg-[#2FAE8F] text-white shadow-[0_0_15px_rgba(47,174,143,0.4)]', // Green
    'Varning info': 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]', // Orange
    'Extra bevakning': 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]', // Blue
    'Inställt lopp': 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]', // Red
    'Säsongstopp': 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' // Purple
};

const EVENT_DOT_COLORS = {
    'Stort spel': 'bg-[#D4af37]',
    'Långtidsspel': 'bg-[#2FAE8F]',
    'Varning info': 'bg-orange-500',
    'Extra bevakning': 'bg-blue-500',
    'Inställt lopp': 'bg-red-500',
    'Säsongstopp': 'bg-purple-500'
};

const TAG_STYLES = {
    'Stort spel': 'bg-[#D4af37]/10 text-[#D4af37] border border-[#D4af37]/20',
    'Långtidsspel': 'bg-[#2FAE8F]/10 text-[#2FAE8F] border border-[#2FAE8F]/20',
    'Varning info': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    'Extra bevakning': 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    'Inställt lopp': 'bg-red-500/10 text-red-500 border border-red-500/20',
    'Säsongstopp': 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
};

const FILTER_CONFIG = [
    { label: 'Stort spel', color: 'bg-[#D4af37]', type: 'Stort spel' },
    { label: 'Långtidsspel', color: 'bg-[#2FAE8F]', type: 'Långtidsspel' },
    { label: 'Säsongstopp', color: 'bg-purple-500', type: 'Säsongstopp' },
    { label: 'Varning', color: 'bg-orange-500', type: 'Varning info' },
    { label: 'Bevakning', color: 'bg-blue-500', type: 'Extra bevakning' }
] as const;


import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

export const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [filter, setFilter] = useState<CalendarEvent['type'] | 'Alla'>('Alla');
    const [upcomingPage, setUpcomingPage] = useState(1);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('calendar_events')
                .select('*');

            if (error) {
                console.error('Error fetching calendar events:', error);
                // setErrorMsg(error.message || JSON.stringify(error));
                return;
            }

            if (data && data.length > 0) {
                console.log('Fetched calendar events:', data);

                const mappedEvents: CalendarEvent[] = data.map((e: any) => {
                    const dbTypeLower = (e.type || '').toLowerCase().trim();
                    const dbStatusLower = (e.status || '').toLowerCase().trim();
                    let type: CalendarEvent['type'] = 'Stort spel';

                    if (dbTypeLower.includes('grön') || dbTypeLower.includes('långtidsspel')) type = 'Långtidsspel';
                    else if (dbTypeLower.includes('gul') || dbTypeLower.includes('stort')) type = 'Stort spel';
                    else if (dbTypeLower.includes('röd') || dbTypeLower.includes('inställt')) type = 'Inställt lopp';
                    else if (dbTypeLower.includes('orange') || dbTypeLower.includes('varning') || dbTypeLower.includes('warning')) type = 'Varning info';
                    else if (dbTypeLower.includes('blå') || dbTypeLower.includes('bevakning')) type = 'Extra bevakning';
                    else if (dbTypeLower.includes('lila') || dbTypeLower.includes('säsong')) type = 'Säsongstopp';


                    return {
                        id: e.id,
                        date: new Date(`${e.race_date}T12:00:00`),
                        title: e.title,
                        type: type,
                        description: e.detailed_description || e.description || '',
                        location: e.location || 'Sverige',
                        motivation: e.motivation ? [e.motivation] : [],
                        impact: e.comment || e.description,
                        status: capitalize(dbStatusLower) as any || 'Kommande',
                        releaseDate: e.release_date
                    };
                });
                console.log('Mapped events:', mappedEvents);
                setEvents(mappedEvents);
            } else {
                console.log('No data fetched from calendar_events');
            }
        };

        fetchEvents();
    }, []);

    // Helper
    const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    // --- Calendar Logic ---
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Mon, 6=Sun)
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Previous month padding
    const prevMonthDays = getDaysInMonth(year, month - 1);
    const prevMonthPadding = Array.from({ length: firstDay }, (_, i) => prevMonthDays - firstDay + i + 1);

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const getEventsForDate = (day: number) => {
        return events.filter(e =>
            e.date.getDate() === day &&
            e.date.getMonth() === month &&
            e.date.getFullYear() === year &&
            (filter === 'Alla' || e.type === filter)
        );
    };

    // Valid date calculation to hide past events
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredUpcomingEvents = events
        .filter(e => {
            const isFutureOrToday = e.date >= today;
            // Also respect the view's month/year (so we don't show July events when looking at Jan, unless that's desired? 
            // The original logic was `e.date >= new Date(year, month, 1)`.
            // Let's keep the view context but ALSO enforce "not in the past".
            const isInViewOrLater = e.date >= new Date(year, month, 1);
            return isFutureOrToday && isInViewOrLater;
        })
        .filter(e => e.status !== 'Avslutad') // Filter out finished events
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .filter(e => filter === 'Alla' || e.type === filter);

    const totalPages = Math.ceil(filteredUpcomingEvents.length / ITEMS_PER_PAGE);
    const upcomingEventsPage = filteredUpcomingEvents.slice((upcomingPage - 1) * ITEMS_PER_PAGE, upcomingPage * ITEMS_PER_PAGE);

    const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8" translate="no">

            {/* Header & Controls */}
            <div className="flex flex-col items-start gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl mb-2">
                        Kalender
                    </h1>
                </div>

                <div className="flex items-center gap-2 bg-[#162230]/60 p-1 rounded-lg border border-white/5 backdrop-blur-sm shadow-inner">
                    <button className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors" onClick={handlePrevMonth}>
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-white capitalize px-4 min-w-[120px] text-center select-none">
                        {monthNames[month]} {year}
                    </span>
                    <button className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors" onClick={handleNextMonth}>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Calendar Grid (2/3 width) */}
                <div className="lg:col-span-2 bg-[#162230]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group h-fit">
                    {/* Glassmorphism gradient bg overlay */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2FAE8F]/5 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none"></div>

                    {/* Filter Tabs - Removed from here, moved to Sidebar as requested */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {/* Optionally keep simple filters or remove if redundant */}
                    </div>

                    {/* Month Header in Card */}
                    <div className="mb-6 px-2">
                        <h2 className="text-2xl font-bold text-white capitalize tracking-wide">
                            {monthNames[month]} {year}
                        </h2>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-4">
                        {['MÅN', 'TIS', 'ONS', 'TOR', 'FRE', 'LÖR', 'SÖN'].map(day => (
                            <div key={day} className="text-center text-xs font-bold text-gray-500 tracking-widest py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 border-t border-l border-white/5">
                        {/* Prev Month Padding */}
                        {prevMonthPadding.map(day => (
                            <div key={`prev-${day}`} className="h-24 sm:h-32 border-r border-b border-white/5 p-2 bg-black/20 text-gray-600 font-medium text-sm">
                                {day}
                            </div>
                        ))}

                        {/* Current Days */}
                        {currentMonthDays.map(day => {
                            const events = getEventsForDate(day);
                            const hasEvents = events.length > 0;
                            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                            return (
                                <div
                                    key={day}
                                    onClick={() => hasEvents && setSelectedEvent(events[0])}
                                    className={`
                                        h-24 sm:h-32 border-r border-b border-white/5 p-3 relative flex flex-col justify-between transition-all group/day
                                        ${hasEvents ? 'cursor-pointer hover:bg-white/5' : ''}
                                        ${isToday ? 'bg-[#2FAE8F]/5' : ''}
                                    `}
                                >
                                    <span className={`text-sm font-bold ${isToday ? 'text-[#2FAE8F]' : 'text-gray-300 group-hover/day:text-white'}`}>
                                        {day}
                                    </span>

                                    {/* Event Dots */}
                                    <div className="flex gap-1.5 flex-wrap">
                                        {events.map((event, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] ${EVENT_DOT_COLORS[event.type] || 'bg-gray-400'}`}
                                                title={event.title}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Next Month Padding - REMOVED */}
                    </div>
                </div>

                {/* Side Panel (Upcoming) */}
                <div className="space-y-4">
                    {/* Filter Grid - 2 Rows Layout */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {FILTER_CONFIG.map((config) => {
                            const isActive = filter === config.type;
                            return (
                                <button
                                    key={config.type}
                                    onClick={() => {
                                        setFilter(isActive ? 'Alla' : config.type);
                                        setUpcomingPage(1);
                                    }}
                                    className={`
                                        min-h-[70px] rounded-xl transition-all duration-300 flex flex-col items-center justify-center p-2 relative overflow-hidden group
                                        ${isActive ? 'ring-2 ring-white/30 bg-white/5' : 'hover:bg-white/5 opacity-80 hover:opacity-100'}
                                    `}
                                >
                                    {/* Glassmorphism Background - more subtle */}
                                    <div className={`absolute inset-0 opacity-15 ${config.color} backdrop-blur-md`}></div>

                                    {/* Dot */}
                                    <div className={`w-2 h-2 rounded-full ${config.color} shadow-[0_0_8px_currentColor] z-10 mb-2`}></div>

                                    {/* Label */}
                                    <span className="relative z-10 text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider text-center leading-none whitespace-nowrap">
                                        {config.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 mb-4 justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-[#2FAE8F]" />
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Kommande Höjdpunkter</span>
                        </div>
                        {filter !== 'Alla' && (
                            <span
                                className="text-xs text-gray-500 cursor-pointer hover:text-white"
                                onClick={() => {
                                    setFilter('Alla');
                                    setUpcomingPage(1);
                                }}
                            >
                                Visa alla
                            </span>
                        )}
                    </div>

                    {upcomingEventsPage.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-[#162230]/40 border border-white/5 text-center text-gray-500 text-sm">
                            Inga händelser matchar filtret.
                        </div>
                    ) : (
                        <div className="space-y-3 min-h-[360px]"> {/* Fixed min-height to prevent jumping */}
                            {upcomingEventsPage.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    className="group cursor-pointer p-4 rounded-xl bg-[#162230]/60 hover:bg-[#162230] border border-white/5 hover:border-white/10 transition-all shadow-lg hover:shadow-[#2FAE8F]/5 relative overflow-hidden"
                                >
                                    {/* Background glow on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#2FAE8F]/0 via-[#2FAE8F]/5 to-[#2FAE8F]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 capitalize mb-0.5">
                                                {event.date.getDate()} {monthNames[event.date.getMonth()]}
                                            </span>
                                            <h3 className="text-sm font-bold text-white leading-tight group-hover:text-[#2FAE8F] transition-colors">{event.title}</h3>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${EVENT_DOT_COLORS[event.type]} shadow-lg mt-1`}></div>
                                    </div>

                                    <div className="flex items-center justify-between relative z-10">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${TAG_STYLES[event.type] || 'bg-white/5 text-gray-400 border border-white/10'}`}>
                                            {event.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <button
                                onClick={() => setUpcomingPage(p => Math.max(1, p - 1))}
                                disabled={upcomingPage === 1}
                                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-medium text-gray-500">
                                Sida {upcomingPage} av {totalPages}
                            </span>
                            <button
                                onClick={() => setUpcomingPage(p => Math.min(totalPages, p + 1))}
                                disabled={upcomingPage === totalPages}
                                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}


                </div>
            </div>

            {/* Event Detail Modal */}
            <Transition appear show={!!selectedEvent} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedEvent(null)}>
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
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-[#162230]/95 backdrop-blur-2xl border border-white/10 text-left align-middle shadow-2xl transition-all relative">
                                    {selectedEvent && (
                                        <>
                                            {/* Close Button */}
                                            <button
                                                onClick={() => setSelectedEvent(null)}
                                                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>

                                            <div className="p-8 md:p-10 space-y-8">
                                                {/* Header Section */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">
                                                            {selectedEvent.date.getDate()} {monthNames[selectedEvent.date.getMonth()]} {selectedEvent.date.getFullYear()}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${EVENT_COLORS[selectedEvent.type] || 'bg-gray-600 text-white'}`}>
                                                            {selectedEvent.type}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 drop-shadow-xl">
                                                        {selectedEvent.title}
                                                    </h2>
                                                    <p className="text-lg text-gray-300 leading-relaxed font-light border-l-2 border-[#2FAE8F]/50 pl-4">
                                                        {selectedEvent.description}
                                                    </p>
                                                </div>

                                                {/* Motivation List */}
                                                {selectedEvent.motivation && (
                                                    <div className="space-y-4">
                                                        <h3 className="text-[#2FAE8F] font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                                            Motivering
                                                            <div className="h-px w-full bg-[#2FAE8F]/20"></div>
                                                        </h3>
                                                        <ul className="space-y-2">
                                                            {selectedEvent.motivation.map((m, i) => (
                                                                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2FAE8F] mt-2 shrink-0"></div>
                                                                    {m}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Impact / What does this mean? */}
                                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                    <h3 className="text-white font-bold text-lg mb-2">Vad betyder detta för dig?</h3>
                                                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                                        {selectedEvent.impact || "Håll utkik efter kommande analyser och speltips kopplade till detta event."}
                                                    </p>

                                                    {/* Meta Data */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                                        {selectedEvent.location && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                                <MapPin className="w-4 h-4 text-[#2FAE8F]" />
                                                                <span>Plats: <strong className="text-white">{selectedEvent.location}</strong></span>
                                                            </div>
                                                        )}
                                                        {selectedEvent.status && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                                <Clock className="w-4 h-4 text-[#2FAE8F]" />
                                                                <span>Status: <strong className="text-white">{selectedEvent.status}</strong></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button
                                                    onClick={() => setSelectedEvent(null)}
                                                    className="w-full py-4 rounded-xl bg-[#2FAE8F] hover:bg-[#258f75] text-white font-bold text-sm uppercase tracking-widest shadow-lg hover:shadow-[#2FAE8F]/30 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {selectedEvent.releaseDate ? `Analys släpps ${selectedEvent.releaseDate}` : 'Stäng'}
                                                    {selectedEvent.releaseDate && <ArrowUpRight className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};
