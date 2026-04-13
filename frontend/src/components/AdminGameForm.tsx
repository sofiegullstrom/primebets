import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Save, Sparkles, CheckCircle, Trophy, MapPin, Hash, Eye, User, TrendingUp } from 'lucide-react';
import { PremiumAnalysisModal } from './PremiumAnalysisModal';
import { HorseManager } from './HorseManager';

export function AdminGameForm() {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [gameType, setGameType] = useState('primepick'); // primepick, saturday, scout, calendar
    const [showPreview, setShowPreview] = useState(false);
    const [selectedHorse, setSelectedHorse] = useState<any>(null); // Store full horse object

    // Common Form State
    const [formData, setFormData] = useState({
        race_date: new Date().toISOString().split('T')[0],
        track_name: '',
        race_number: '',
        horse_name: '',
        odds: '',
        bet_type: 'Vinnare',
        distance: '2140',
        start_method: 'Auto',
        start_lane: '',
        stake: '3 units',
        adam_notes: '',
        final_output_message: '',
        equipment: '',
        driver: '',
        value: '',
        status: 'pending', // 'pending' = Publicerad, 'draft' = Utkast

        // Specific for Warning/Calendar
        calendar_type: 'warning',
        title: '',
        description: '',
        detailed_description: '',
        replace_primepick: false,
        location: '',
        value_percentage: '',

        // Hockey Specific
        sport: 'Hockey',
        league: '',
        match_name: '',
        bet_selection: '',
        expected_odds: '',
        statistics_text: ''
    });

    const [selectedSport, setSelectedSport] = useState<'Trav' | 'Hockey'>('Trav');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const polishText = () => {
        if (!formData.adam_notes) return;

        // Simple formatting rule: standard logic to make it look like AI output
        // In a real scenario, this could call an Edge Function with OpenAI
        const raw = formData.adam_notes;

        const polished = `Dagens PrimePick: ${formData.horse_name || 'Hästen'}
• Form: ${raw.includes('form') ? 'Hästen visar stigande formkurva.' : 'Toppform enligt senaste starterna.'} ${raw}
• Kommentar: Det här är en riktigt stark vinnarkandidat.
• Startspår/distans: Perfekt utgångsläge över ${formData.distance}m testar vi.
• Oddsanalys: Spelvärde finns till nuvarande odds.

Detta är ett starkt spel som vi går in på.`;

        setFormData(prev => ({ ...prev, final_output_message: polished }));
    };

    const handleSave = async (e: React.FormEvent, status: 'pending' | 'draft' = 'pending') => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            let table = '';
            let payload: any = {};

            // Prepare Payload based on Type
            if (gameType === 'primepick') {
                table = 'daily_picks';
                payload = {
                    race_date: formData.race_date,
                    track_name: formData.track_name,
                    race_number: parseInt(formData.race_number) || 1,
                    horse_name: formData.horse_name,
                    horse_id: selectedHorse?.id, // Link to horse_info
                    odds: parseFloat(formData.odds) || 0,
                    bet_type: formData.bet_type,
                    distance: formData.distance,
                    start_method: formData.start_method,
                    start_lane: parseInt(formData.start_lane) || 1,
                    stake: formData.stake,
                    adam_notes: formData.adam_notes,
                    final_output_message: formData.final_output_message || formData.adam_notes, // Fallback
                    equipment: formData.equipment,
                    driver: formData.driver,
                    value: formData.value,
                    prime_pick_rank: 1, // Always rank 1 for PrimePick form
                    status: status
                };
            } else if (gameType === 'saturday') {
                table = 'saturday_picks';
                payload = {
                    race_date: formData.race_date, // Should be a saturday usually
                    track_name: formData.track_name,
                    race_number: parseInt(formData.race_number) || 1,
                    horse_name: formData.horse_name,
                    horse_id: selectedHorse?.id, // Link to horse_info
                    odds: parseFloat(formData.odds) || 0,
                    bet_type: formData.bet_type,
                    distance: formData.distance,
                    start_method: formData.start_method,
                    start_lane: parseInt(formData.start_lane) || 1,
                    stake: formData.stake,
                    equipment: formData.equipment,
                    driver: formData.driver,
                    value: formData.value,
                    adam_notes: formData.adam_notes,
                    final_output_message: formData.final_output_message || formData.adam_notes,
                    status: status
                };
            } else if (gameType === 'scout') {
                table = 'weekly_scout';
                payload = {
                    race_date: formData.race_date,
                    track_name: formData.track_name,
                    horse_name: formData.horse_name,
                    horse_id: selectedHorse?.id, // Link to horse_info
                    description: formData.adam_notes, // Scout uses description standard
                    category: 'Håll ögonen på'
                };
            }
            else if (gameType === 'calendar') {
                table = 'calendar_events';
                payload = {
                    race_date: formData.race_date,
                    title: formData.title || 'Viktigt Meddelande',
                    description: formData.description,
                    detailed_description: formData.detailed_description,
                    replace_primepick: formData.replace_primepick,
                    motivation: formData.adam_notes || formData.detailed_description,
                    type: formData.calendar_type, // 'warning', 'Långtidsspel', etc.
                    sport: selectedSport, // 'Trav' or 'Hockey'

                    // Extra fields for Longterm
                    location: formData.location,
                    value_percentage: formData.value_percentage || null,
                    bet_type: formData.bet_type, // Can be used if column exists
                    horse_name: formData.horse_name,
                    driver: formData.driver,
                    odds: formData.odds ? parseFloat(formData.odds) : null,
                    stake: formData.stake
                };
            }
            // Hockey logic
            else if (selectedSport === 'Hockey') {
                table = 'hockey_games';
                payload = {
                    game_date: formData.race_date,
                    sport: 'Hockey',
                    league: formData.league,
                    match_name: formData.match_name,
                    bet_selection: formData.bet_selection,
                    odds: parseFloat(formData.odds) || 0,
                    expected_odds: parseFloat(formData.expected_odds) || null,
                    value_percentage: parseFloat(formData.value_percentage) || null,
                    motivation: formData.adam_notes,
                    statistics_text: formData.statistics_text,
                    category: gameType === 'daily_hockey' ? 'daily' : 'upcoming',
                    status: status
                };
            }

            // Insert to Supabase
            const { error } = await supabase.from(table).insert(payload);

            if (error) throw error;

            setSuccessMsg(`✅ ${status === 'draft' ? 'UTKAST SPARAT' : 'PUBLICERAT'}! (${gameType.toUpperCase()})`);

            // Clear critical fields but keep date/track for speed
            if (status === 'pending') {
                setFormData(prev => ({
                    ...prev,
                    horse_name: '',
                    odds: '',
                    adam_notes: '',
                    final_output_message: '',
                    start_lane: '',
                    title: '',
                    description: '',
                    detailed_description: '',
                    driver: '',
                    value: '',
                    location: '',
                    value_percentage: '',
                    // Hockey clear
                    league: '',
                    match_name: '',
                    bet_selection: '',
                    expected_odds: '',
                    statistics_text: ''
                }));
            }

        } catch (err: any) {
            console.error('Save failed:', err);
            setErrorMsg(`Kunde inte spara: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-[#162230] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-[#2FAE8F]" />
                        Lägg in nytt spel
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Välj typ av spel och fyll i informationen.</p>
                </div>

                {/* Game Type Selector */}
                <div className="flex flex-col gap-4">
                    {/* Sport Selector */}
                    <div className="flex bg-[#0F1720] rounded-xl p-1 border border-white/5 w-fit">
                        <button
                            onClick={() => { setSelectedSport('Trav'); setGameType('primepick'); }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${selectedSport === 'Trav'
                                ? 'bg-[#2FAE8F] text-white shadow-lg'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            Trav 🐴
                        </button>
                        <button
                            onClick={() => { setSelectedSport('Hockey'); setGameType('daily_hockey'); }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${selectedSport === 'Hockey'
                                ? 'bg-[#2FAE8F] text-white shadow-lg'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            Hockey 🏒
                        </button>
                    </div>

                    {/* Mode Selector */}
                    <div className="flex bg-[#0F1720] rounded-xl p-1 border border-white/5 overflow-x-auto">
                        {selectedSport === 'Trav' ? (
                            [
                                { id: 'primepick', label: 'PrimePick' },
                                { id: 'saturday', label: 'Lördag' },
                                { id: 'scout', label: 'Scout/Kommande' },
                                { id: 'calendar', label: 'Kalender / Event' }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setGameType(type.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${gameType === type.id
                                        ? 'bg-[#2FAE8F] text-white shadow-lg'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))
                        ) : (
                            [
                                { id: 'daily_hockey', label: 'Dagens Spel' },
                                { id: 'upcoming_hockey', label: 'Kommande Spel' },
                                { id: 'calendar', label: 'Kalender' }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setGameType(type.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${gameType === type.id
                                        ? 'bg-[#2FAE8F] text-white shadow-lg'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <form onSubmit={(e) => handleSave(e, 'pending')} className="space-y-6">

                {/* 1. Common Basics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Datum</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="date"
                                name="race_date"
                                value={formData.race_date}
                                onChange={handleInputChange}
                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                            />
                        </div>
                    </div>

                    {/* Hockey Specific Fields - Top Row */}
                    {selectedSport === 'Hockey' && gameType !== 'calendar' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Liga</label>
                                <input
                                    type="text"
                                    name="league"
                                    placeholder="T.ex. SHL, NHL"
                                    value={formData.league}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Match</label>
                                <input
                                    type="text"
                                    name="match_name"
                                    placeholder="Hemmalag - Bortalag"
                                    value={formData.match_name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                />
                            </div>
                        </>
                    )}

                    {selectedSport === 'Trav' && gameType !== 'calendar' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bana</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        name="track_name"
                                        placeholder="T.ex. Solvalla"
                                        value={formData.track_name}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loppnummer</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="number"
                                        name="race_number"
                                        placeholder="1-12"
                                        value={formData.race_number}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kusk</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        name="driver"
                                        placeholder="T.ex. Örjan Kihlström"
                                        value={formData.driver}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>



                {/* Hockey Betting Details */}
                {
                    selectedSport === 'Hockey' && gameType !== 'calendar' && (
                        <div className="space-y-6 border-t border-white/5 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spel / Val</label>
                                    <input
                                        type="text"
                                        name="bet_selection"
                                        placeholder="T.ex. Över 5.5 mål eller Hemmaseger"
                                        value={formData.bet_selection}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Odds</label>
                                        <input
                                            type="number"
                                            name="odds"
                                            step="0.01"
                                            placeholder="1.85"
                                            value={formData.odds}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Förväntat Odds</label>
                                        <input
                                            type="number"
                                            name="expected_odds"
                                            step="0.01"
                                            placeholder="1.60"
                                            value={formData.expected_odds}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spelvärde %</label>
                                        <input
                                            type="number"
                                            name="value_percentage"
                                            placeholder="105"
                                            value={formData.value_percentage}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Statistik / Info</label>
                                <textarea
                                    name="statistics_text"
                                    rows={3}
                                    placeholder="Relevanta stats..."
                                    value={formData.statistics_text}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#2FAE8F]"
                                />
                            </div>
                        </div>
                    )
                }

                {/* 2. Horse Details (Only for betting types) */}
                {
                    selectedSport === 'Trav' && gameType !== 'calendar' && (
                        <div className="space-y-6 border-t border-white/5 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hästens Namn</label>
                                    <HorseManager
                                        selectedHorseName={formData.horse_name}
                                        onSelectHorse={(horse) => {
                                            setSelectedHorse(horse);
                                            setFormData(prev => ({
                                                ...prev,
                                                horse_name: horse.horse_name,
                                                driver: horse.default_driver || prev.driver
                                            }));
                                        }}
                                    />
                                </div>

                                {gameType !== 'scout' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Odds</label>
                                            <input
                                                type="number"
                                                name="odds"
                                                step="0.01"
                                                placeholder="1.00"
                                                value={formData.odds}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Insats</label>
                                            <input
                                                type="text"
                                                name="stake"
                                                placeholder="T.ex. 3 units"
                                                value={formData.stake}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spelvärde</label>
                                            <input
                                                type="text"
                                                name="value"
                                                placeholder="T.ex. Högt / 4 av 5"
                                                value={formData.value}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {gameType !== 'scout' && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spelform</label>
                                        <select
                                            name="bet_type"
                                            value={formData.bet_type}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                        >
                                            <option value="Vinnare">Vinnare</option>
                                            <option value="Plats">Plats</option>
                                            <option value="H2H">H2H</option>
                                            <option value="Övrigt">Övrigt</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Distans</label>
                                        <input type="text" name="distance" value={formData.distance} onChange={handleInputChange} className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Startmetod</label>
                                        <input type="text" name="start_method" value={formData.start_method} onChange={handleInputChange} className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Startspår</label>
                                        <input type="number" name="start_lane" value={formData.start_lane} onChange={handleInputChange} className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white text-sm" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Utrustning (Info)</label>
                                <input type="text" name="equipment" placeholder="T.ex. Barfota runt om, Jänkarvagn" value={formData.equipment} onChange={handleInputChange} className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#2FAE8F]" />
                            </div>
                        </div>
                    )
                }

                {/* 3. Calendar Event / Warning / Longterm */}
                {
                    gameType === 'calendar' && (
                        <div className="space-y-6 border-t border-white/5 pt-6">
                            {/* Event Type Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Typ av Händelse</label>
                                <select
                                    name="calendar_type"
                                    value={formData.calendar_type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, calendar_type: e.target.value }))}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                >
                                    <option value="warning">Varning / Info (Röd/Orange)</option>
                                    <option value="Långtidsspel">Långtidsspel (Grön/Teal)</option>
                                    <option value="Stort spel">Stort Lopp / Event (Gul)</option>
                                    <option value="Säsongstopp">Säsongstopp (Lila)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rubrik / Eventnamn</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder={formData.calendar_type === 'Långtidsspel' ? 'T.ex. Elitkampen 2026' : 'Rubrik...'}
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white font-bold text-lg focus:outline-none focus:border-[#2FAE8F]"
                                />
                            </div>

                            {/* Specifics for All Calendar Types */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Plats</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="T.ex. Solvalla"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-emerald-500/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Bedömt Värde (%)</label>
                                        <div className="relative">
                                            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                            <input
                                                type="number"
                                                name="value_percentage"
                                                placeholder="18"
                                                value={formData.value_percentage}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-emerald-500/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Betting Info (Optional for all) */}
                                <div className="border-t border-white/5 pt-4">
                                    <p className="text-gray-400 text-sm mb-4 font-bold flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-[#2FAE8F]" />
                                        Speldetaljer (Valfritt)
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Häst</label>
                                            <HorseManager
                                                selectedHorseName={formData.horse_name}
                                                onSelectHorse={(horse) => {
                                                    setSelectedHorse(horse);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        horse_name: horse.horse_name,
                                                        driver: horse.default_driver || prev.driver
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kusk</label>
                                            <input
                                                type="text"
                                                name="driver"
                                                placeholder="Kusk"
                                                value={formData.driver}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Odds</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="odds"
                                                placeholder="Odds"
                                                value={formData.odds}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Insats / Unit</label>
                                            <input
                                                type="text"
                                                name="stake"
                                                placeholder="T.ex. 3 units"
                                                value={formData.stake}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Typ av spel</label>
                                            <input
                                                type="text"
                                                name="bet_type"
                                                placeholder="Vinnare / Topp-3"
                                                value={formData.bet_type}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kort beskrivning (Syns på kortet)</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Syns på kortet..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {formData.calendar_type === 'Långtidsspel' ? 'Motivering' : 'Detaljerad Info'}
                                </label>
                                <textarea
                                    name="detailed_description"
                                    rows={4}
                                    placeholder="All info här..."
                                    value={formData.detailed_description}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2FAE8F]"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="replace_primepick"
                                    name="replace_primepick"
                                    checked={formData.replace_primepick}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-gray-600 text-[#2FAE8F] focus:ring-[#2FAE8F]"
                                />
                                <label htmlFor="replace_primepick" className="text-sm font-bold text-amber-400">
                                    Ersätt Dagens PrimePick-kort med denna?
                                </label>
                            </div>
                        </div>
                    )
                }

                {/* 4. Analysis / Text Content */}
                <div className="space-y-6 border-t border-white/5 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                <span>Motivering (Adam's Notes)</span>
                                <span className="text-[10px] text-gray-600">Inklistrad text</span>
                            </label>
                            <textarea
                                name="adam_notes"
                                rows={10}
                                placeholder="Klistra in din text här..."
                                value={formData.adam_notes}
                                onChange={handleInputChange}
                                className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-gray-300 text-sm focus:outline-none focus:border-[#2FAE8F]"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={polishText}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Snygga till texten
                                </button>
                            </div>
                        </div>

                        {gameType !== 'calendar' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Publicerad Text (På Sidan)
                                </label>
                                <textarea
                                    name="final_output_message"
                                    rows={10}
                                    placeholder="Detta visas på hemsidan..."
                                    value={formData.final_output_message}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-3 px-4 text-white text-sm font-medium focus:outline-none focus:border-[#2FAE8F] ring-1 ring-white/5"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    {successMsg ? (
                        <div className="flex items-center gap-2 text-emerald-400 animate-in fade-in">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-bold">{successMsg}</span>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            {gameType === 'primepick' && 'Sparar till daily_picks (rank 1)'}
                            {gameType === 'saturday' && 'Sparar till saturday_picks'}
                            {gameType === 'calendar' && 'Sparar till calendar_events'}
                            {selectedSport === 'Hockey' && 'Sparar till hockey_games'}
                        </div>
                    )}

                    {errorMsg && (
                        <div className="text-sm text-red-400 font-bold">
                            {errorMsg}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Förhandsgranska
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSave(e, 'draft')}
                            disabled={loading}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                            <Save className="w-3.5 h-3.5" />
                            SPARA UTKAST
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-1.5 rounded-lg bg-[#2FAE8F] hover:bg-[#258f75] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#2FAE8F]/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {loading ? 'Sparar...' : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    PUBLICERA
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </form >

            <PremiumAnalysisModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                data={{
                    horseName: formData.horse_name,
                    tags: [], // Could imply value here if needed
                    odds: formData.odds,
                    units: formData.stake,
                    value: formData.value || 'N/A',
                    type: formData.bet_type,
                    motivationBold: formData.final_output_message?.split('\n')[0] || '',
                    motivationBody: formData.final_output_message || formData.adam_notes,
                    stats: [],
                    interview: '',
                    isFinished: false,
                    horseDetails: {
                        birth_year: selectedHorse?.birth_year || '',
                        sex: selectedHorse?.sex || '',
                        default_driver: formData.driver || selectedHorse?.default_driver,
                        trainer: selectedHorse?.trainer || ''
                    }
                }}
            />
        </div >
    );
}
