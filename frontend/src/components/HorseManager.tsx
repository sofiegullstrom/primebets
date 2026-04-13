import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Combobox } from '@headlessui/react';
import { Check, ChevronsUpDown, Plus, X, Save } from 'lucide-react';
import { HorseInfo } from '../types';

interface HorseManagerProps {
    selectedHorseName: string;
    onSelectHorse: (horse: HorseInfo) => void;
}

export function HorseManager({ selectedHorseName, onSelectHorse }: HorseManagerProps) {
    const [horses, setHorses] = useState<HorseInfo[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHorse, setNewHorse] = useState<Partial<HorseInfo>>({
        id: '',
        horse_name: '',
        birth_year: new Date().getFullYear() - 5,
        sex: 'Valack',
        trainer: '',
        default_driver: '',
        strength_tags: '',
        weakness_tags: '',
        notes_short: ''
    });

    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchHorses();
    }, []);

    const fetchHorses = async () => {
        try {
            console.log('Fetching horses...');
            const { data, error, count } = await supabase
                .from('horse_info')
                .select('*', { count: 'exact' })
                .order('horse_name');

            if (error) {
                console.error('Error fetching horses:', error);
                setErrorMsg(error.message);
                return;
            }

            console.log(`Fetched ${data?.length} horses. Total in DB: ${count}`);
            if (data) setHorses(data);
        } catch (err: any) {
            console.error('Unexpected error fetching horses:', err);
            setErrorMsg(err.message || 'Unknown error');
        }
    };

    const generateNextId = async () => {
        // Fetch ALL IDs to ensure we get the true max, ignoring pagination limits of the main list
        const { data } = await supabase
            .from('horse_info')
            .select('id')
            .range(0, 9999); // Fix range syntax if needed

        if (!data || data.length === 0) return 'H1001';

        let maxId = 1000;
        data.forEach((row: any) => {
            const match = row.id?.match(/[hH](\d+)/);
            if (match) {
                const num = parseInt(match[1]);
                if (num > maxId) maxId = num;
            }
        });
        return `H${maxId + 1}`;
    };

    const openAddModal = async () => {
        setLoading(true);
        const nextId = await generateNextId();
        setLoading(false);

        setNewHorse({
            id: nextId,
            horse_name: query || '', // Pre-fill with search query if any
            birth_year: new Date().getFullYear() - 5,
            sex: 'Valack',
            trainer: '',
            default_driver: '',
            strength_tags: '',
            weakness_tags: '',
            notes_short: ''
        });
        setIsModalOpen(true);
    };

    const saveNewHorse = async () => {
        if (!newHorse.horse_name || !newHorse.id) return;
        setLoading(true);

        try {
            const payload = {
                id: newHorse.id,
                horse_name: newHorse.horse_name,
                birth_year: newHorse.birth_year,
                sex: newHorse.sex,
                trainer: newHorse.trainer,
                default_driver: newHorse.default_driver,
                strength_tags: newHorse.strength_tags,
                weakness_tags: newHorse.weakness_tags,
                notes_short: newHorse.notes_short
            };

            const { error } = await supabase.from('horse_info').insert(payload);
            if (error) throw error;

            alert('Häst sparad!');
            await fetchHorses(); // Refresh list

            // Select the new horse
            const added = { ...payload } as HorseInfo;
            onSelectHorse(added);

            setIsModalOpen(false);
        } catch (err: any) {
            alert('Fel vid sparning: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredHorses =
        query === ''
            ? horses
            : horses.filter((horse) =>
                horse.horse_name.toLowerCase().includes(query.toLowerCase())
            );

    return (
        <div className="w-full">
            <div className="flex items-end gap-2">
                <div className="relative w-full">
                    <Combobox value={selectedHorseName} onChange={(name: string | null) => {
                        if (!name) return;
                        const horse = horses.find(h => h.horse_name === name);
                        if (horse) onSelectHorse(horse);
                    }}>
                        <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-[#0F1720] text-left border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                    className="w-full border-none py-3 pl-3 pr-10 text-white leading-5 bg-transparent focus:ring-0 font-bold"
                                    displayValue={(name: string) => name}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Sök eller välj häst..."
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronsUpDown
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Combobox.Button>
                            </div>
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#162230] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
                                {filteredHorses.length === 0 ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-400">
                                        {errorMsg ? (
                                            <span className="text-red-400 font-bold block">Fel: {errorMsg}</span>
                                        ) : (
                                            query !== '' ? 'Ingen häst hittades.' : 'Inga hästar i databasen.'
                                        )}
                                    </div>
                                ) : (
                                    filteredHorses.map((horse) => (
                                        <Combobox.Option
                                            key={horse.id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#2FAE8F] text-white' : 'text-gray-300'
                                                }`
                                            }
                                            value={horse.horse_name}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                            }`}
                                                    >
                                                        {horse.horse_name}
                                                    </span>
                                                    {selected ? (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                                }`}
                                                        >
                                                            <Check className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </div>
                    </Combobox>
                </div>
                <button
                    type="button"
                    onClick={openAddModal}
                    className="mb-1 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors border border-blue-500/20"
                    title="Lägg till ny häst"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* ADD HORSE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#162230] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F1720]">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#2FAE8F]" />
                                Lägg till ny Häst
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">ID (Auto)</label>
                                    <input
                                        type="text"
                                        value={newHorse.id}
                                        onChange={e => setNewHorse(p => ({ ...p, id: e.target.value }))}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2FAE8F]"
                                        placeholder="H..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Hästens Namn</label>
                                    <input
                                        type="text"
                                        value={newHorse.horse_name}
                                        onChange={e => setNewHorse(p => ({ ...p, horse_name: e.target.value }))}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#2FAE8F] outline-none"
                                        placeholder="Namn..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Födelseår</label>
                                    <input
                                        type="number"
                                        value={newHorse.birth_year}
                                        onChange={e => setNewHorse(p => ({ ...p, birth_year: parseInt(e.target.value) }))}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#2FAE8F] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Kön</label>
                                    <select
                                        value={newHorse.sex}
                                        onChange={e => setNewHorse(p => ({ ...p, sex: e.target.value }))}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#2FAE8F] outline-none"
                                    >
                                        <option value="Valack">Valack</option>
                                        <option value="Hingst">Hingst</option>
                                        <option value="Sto">Sto</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tränare</label>
                                    <input
                                        type="text"
                                        value={newHorse.trainer}
                                        onChange={e => setNewHorse(p => ({ ...p, trainer: e.target.value }))}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#2FAE8F] outline-none"
                                        placeholder="T.ex. Daniel Redén"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Kusk (Standard)</label>
                                    <input
                                        type="text"
                                        value={newHorse.default_driver}
                                        onChange={e => setNewHorse(p => ({ ...p, default_driver: e.target.value }))}
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#2FAE8F] outline-none"
                                        placeholder="T.ex. Örjan Kihlström"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Styrkor (Taggar)</label>
                                <input
                                    type="text"
                                    value={newHorse.strength_tags}
                                    onChange={e => setNewHorse(p => ({ ...p, strength_tags: e.target.value }))}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#2FAE8F] outline-none"
                                    placeholder="Stark, Startsnbabb..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Svagheter (Taggar)</label>
                                <input
                                    type="text"
                                    value={newHorse.weakness_tags}
                                    onChange={e => setNewHorse(p => ({ ...p, weakness_tags: e.target.value }))}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#2FAE8F] outline-none"
                                    placeholder="Galopprisk, Ojämn..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Kort Kommentar</label>
                                <textarea
                                    rows={3}
                                    value={newHorse.notes_short}
                                    onChange={e => setNewHorse(p => ({ ...p, notes_short: e.target.value }))}
                                    className="w-full bg-[#0F1720] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#2FAE8F] outline-none"
                                    placeholder="En kort sammanfattning..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-[#0F1720] flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white font-bold"
                            >
                                Avbryt
                            </button>
                            <button
                                onClick={saveNewHorse}
                                disabled={loading}
                                className="px-6 py-2 rounded-lg bg-[#2FAE8F] hover:bg-[#258f75] text-white font-bold shadow-lg flex items-center gap-2"
                            >
                                {loading ? 'Sparar...' : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Spara Häst
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
