import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Edit2, Play, AlertTriangle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Game {
    id: string;
    race_date: string;
    horse_name?: string; // Trav & Calendar
    match_name?: string; // Hockey
    title?: string;      // Calendar
    track_name?: string; // Trav
    league?: string;     // Hockey
    odds: number;
    stake?: string;
    status: string; // 'pending', 'won', 'lost', 'void', 'draft'
    net_result: number | null;
    driver?: string;
    bet_selection?: string; // Hockey
    table: 'daily_picks' | 'saturday_picks' | 'hockey_games' | 'calendar_events';
    adam_notes?: string;
    sport?: 'Trav' | 'Hockey' | 'Blandat';
    location?: string;
}

export function AdminGameList({ onEdit }: { onEdit: (game: any, table: 'daily_picks' | 'saturday_picks' | 'hockey_games' | 'calendar_events') => void }) {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'drafts' | 'history'>('active');

    // Editing State for Result
    const [editingResultId, setEditingResultId] = useState<string | null>(null);
    const [resultForm, setResultForm] = useState({ status: '', net_result: '' });

    useEffect(() => {
        fetchGames();
    }, [activeTab]);

    const fetchGames = async () => {
        setLoading(true);
        try {
            // Helper to safe fetch
            const safeFetch = async (table: string, query: any) => {
                const { data, error } = await query;
                if (error) {
                    console.warn(`Fetch error for ${table}:`, error);
                    return [];
                }
                return data || [];
            }

            const daily = await safeFetch('daily_picks', supabase.from('daily_picks').select('*').order('race_date', { ascending: false }));
            const saturday = await safeFetch('saturday_picks', supabase.from('saturday_picks').select('*').order('race_date', { ascending: false }));
            const hockey = await safeFetch('hockey_games', supabase.from('hockey_games').select('*').order('game_date', { ascending: false }));
            // Fetch calendar events (Långtidsspel etc)
            const calendar = await safeFetch('calendar_events',
                supabase.from('calendar_events')
                    .select('*')
                    .in('type', ['Långtidsspel', 'Stort spel', 'Säsongstopp'])
                    .order('race_date', { ascending: false })
            );

            // Normalize and Combine
            const combined: Game[] = [
                ...(daily).map((d: any) => ({ ...d, table: 'daily_picks' as const, sport: 'Trav' })),
                ...(saturday).map((s: any) => ({ ...s, table: 'saturday_picks' as const, sport: 'Trav' })),
                ...(hockey).map((h: any) => ({
                    ...h,
                    race_date: h.game_date, // Map game_date to race_date for sorting
                    table: 'hockey_games' as const,
                    sport: 'Hockey'
                })),
                ...(calendar).map((c: any) => ({
                    ...c,
                    table: 'calendar_events' as const,
                    sport: 'Blandat', // Or determine from content
                    horse_name: c.horse_name || c.title // Fallback if regular fields miss
                }))
            ].sort((a, b) => new Date(b.race_date).getTime() - new Date(a.race_date).getTime());

            setGames(combined);
        } catch (error) {
            console.error("Error fetching games:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteGame = async (id: string, table: string) => {
        if (!window.confirm('Är du säker på att du vill ta bort detta spel?')) return;

        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
            alert('Kunde inte ta bort: ' + error.message);
        } else {
            setGames(prev => prev.filter(g => g.id !== id));
        }
    };

    const updateStatus = async (id: string, table: string, status: string, net_result?: number) => {
        const payload: any = { status };
        if (net_result !== undefined) payload.net_result = net_result;

        const { error } = await supabase.from(table).update(payload).eq('id', id);
        if (error) {
            alert('Fel vid uppdatering: ' + error.message);
        } else {
            setEditingResultId(null);
            fetchGames(); // Refresh to ensure sync
        }
    };

    const publishDraft = async (game: Game) => {
        if (!confirm('Vill du publicera detta utkast? Det kommer nu synas för alla.')) return;
        await updateStatus(game.id, game.table, 'pending');
    };

    const openResultEditor = (game: Game) => {
        setEditingResultId(game.id);
        setResultForm({
            status: game.status || 'won',
            net_result: game.net_result?.toString() || ''
        });
    };

    const setQuickResult = (game: Game, type: 'won' | 'lost' | 'void') => {
        let net = 0;
        if (type === 'won') {
            // Assume 1 unit flat stake if not specified, usually results are in units.
            // Result = Odds - 1 (profit)
            net = (game.odds || 1) - 1;
        } else if (type === 'lost') {
            net = -1;
        } else {
            net = 0;
        }

        setResultForm({
            status: type,
            net_result: net.toFixed(2)
        });
    };

    const saveResult = async (id: string, table: string) => {
        if (!resultForm.status) {
            alert('Välj status (Vinst/Förlust/Struken)');
            return;
        }
        await updateStatus(id, table, resultForm.status, parseFloat(resultForm.net_result));
    };

    // Filter Logic
    const displayedGames = games.filter(g => {
        if (activeTab === 'drafts') return g.status === 'draft';
        if (activeTab === 'active') return g.status === 'pending' || !g.status; // Default pending
        if (activeTab === 'history') return ['won', 'lost', 'void', 'struken', 'vinst', 'förlust'].includes(g.status?.toLowerCase());
        return false;
    });

    return (
        <div className="bg-[#162230] border border-white/5 rounded-2xl p-6 shadow-xl w-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Spelhantering
            </h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/5 pb-1">
                <button onClick={() => setActiveTab('active')} className={`px-4 py-2 text-sm font-bold uppercase rounded-t-lg ${activeTab === 'active' ? 'bg-[#2FAE8F]/10 text-[#2FAE8F] border-b-2 border-[#2FAE8F]' : 'text-gray-500 hover:text-white'}`}>Aktiva</button>
                <button onClick={() => setActiveTab('drafts')} className={`px-4 py-2 text-sm font-bold uppercase rounded-t-lg ${activeTab === 'drafts' ? 'bg-amber-500/10 text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-white'}`}>Utkast</button>
                <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-bold uppercase rounded-t-lg ${activeTab === 'history' ? 'bg-blue-500/10 text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}>Historik</button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Laddar spel...</div>
            ) : (
                <div className="space-y-4">
                    {displayedGames.length === 0 && <div className="text-gray-500 text-sm py-4">Inga spel hittades i denna kategori.</div>}

                    {displayedGames.map(game => (
                        <div key={game.id} className="bg-[#0F1720] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group hover:border-[#2FAE8F]/30 transition-all">

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${game.table === 'saturday_picks' ? 'bg-purple-500/20 text-purple-400' :
                                        game.table === 'hockey_games' ? 'bg-sky-500/20 text-sky-400' :
                                            game.table === 'calendar_events' ? 'bg-teal-500/20 text-teal-400' :
                                                'bg-[#2FAE8F]/20 text-[#2FAE8F]'}`}>
                                        {game.table === 'saturday_picks' ? 'Lördag' :
                                            game.table === 'hockey_games' ? 'Hockey' :
                                                game.table === 'calendar_events' ? 'Långtidsspel' :
                                                    'PrimePick'}
                                    </span>
                                    <span className="text-gray-500 text-xs">{game.race_date}</span>
                                    {game.status === 'draft' && <span className="text-amber-500 text-xs font-bold uppercase border border-amber-500/30 px-1 rounded">Utkast</span>}
                                </div>
                                <h4 className="text-white font-bold text-lg">
                                    {game.sport === 'Hockey' ? `${game.match_name}` : game.horse_name || game.title}
                                </h4>
                                <div className="text-sm text-gray-400 flex flex-wrap gap-3">
                                    {game.sport === 'Hockey' ? (
                                        <>
                                            <span className="font-bold text-gray-300">{game.league}</span>
                                            <span>Val: <span className="text-white">{game.bet_selection}</span></span>
                                        </>
                                    ) : (
                                        <span>{game.track_name || game.location}</span>
                                    )}
                                    <span>Odds: <span className="text-white">{game.odds}</span></span>
                                    {game.driver && <span>Kusk: {game.driver}</span>}
                                </div>

                                {/* Status Badge for History */}
                                {(activeTab === 'history' || activeTab === 'active') && game.status && game.status !== 'pending' && (
                                    <div className="mt-2">
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${['won', 'vinst'].includes(game.status.toLowerCase()) ? 'bg-green-500/20 text-green-400' :
                                            ['lost', 'förlust'].includes(game.status.toLowerCase()) ? 'bg-red-500/20 text-red-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {game.status} ({game.net_result ?? '-'})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">

                                {/* Draft Actions */}
                                {activeTab === 'drafts' && (
                                    <>
                                        <button onClick={() => publishDraft(game)} title="Publicera" className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors">
                                            <Play className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onEdit(game, game.table)} title="Redigera" className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors">
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Active Actions (Correct Results) */}
                                {activeTab === 'active' && (
                                    <>
                                        {editingResultId === game.id ? (
                                            <div className="flex flex-col gap-3 bg-black/40 p-4 rounded-xl border border-white/10 animate-in fade-in shadow-2xl absolute md:relative z-10 right-0 md:right-auto w-64 md:w-auto">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-1">Välj Resultat</div>

                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => setQuickResult(game, 'won')}
                                                        className={`flex-1 p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${resultForm.status === 'won' ? 'bg-emerald-500 max-w border-emerald-400 text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'}`}
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase">Vinst</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setQuickResult(game, 'lost')}
                                                        className={`flex-1 p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${resultForm.status === 'lost' ? 'bg-red-500 border-red-400 text-white' : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'}`}
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase">Förlust</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setQuickResult(game, 'void')}
                                                        className={`flex-1 p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${resultForm.status === 'void' ? 'bg-gray-500 border-gray-400 text-white' : 'bg-gray-500/10 border-gray-500/20 text-gray-400 hover:bg-gray-500/20'}`}
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase">Struken</span>
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2 bg-[#162230] p-1.5 rounded-lg border border-white/10">
                                                    <span className="text-xs text-gray-500 pl-2">Netto:</span>
                                                    <input
                                                        type="number"
                                                        value={resultForm.net_result}
                                                        onChange={e => setResultForm(p => ({ ...p, net_result: e.target.value }))}
                                                        className="bg-transparent text-white text-sm font-bold w-full focus:outline-none text-right pr-1"
                                                    />
                                                </div>

                                                <div className="flex gap-2 pt-1 border-t border-white/10">
                                                    <button onClick={() => saveResult(game.id, game.table)} className="flex-1 bg-white text-black font-bold text-xs py-2 rounded-lg hover:bg-gray-200">
                                                        Spara
                                                    </button>
                                                    <button onClick={() => setEditingResultId(null)} className="flex-1 bg-transparent text-gray-400 font-bold text-xs py-2 rounded-lg hover:text-white border border-transparent hover:border-white/10">
                                                        Avbryt
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => openResultEditor(game)} title="Rätta" className="px-3 py-2 rounded-lg bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 text-[#2FAE8F] text-xs font-bold transition-colors">
                                                RÄTTA
                                            </button>
                                        )}
                                    </>
                                )}

                                {/* Delete (All tabs) */}
                                <button onClick={() => deleteGame(game.id, game.table)} title="Ta bort" className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
