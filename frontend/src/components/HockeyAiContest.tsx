import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Scale, Brain, Check, Loader2 } from 'lucide-react';

interface HockeyAiContestProps {
    onPublish: () => void;
}

export function HockeyAiContest({ onPublish }: HockeyAiContestProps) {
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState<any[]>([]);
    const [analyzingGameId, setAnalyzingGameId] = useState<string | null>(null);
    const [analyzedPicks, setAnalyzedPicks] = useState<Record<string, any>>({});

    const fetchTodaysGames = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('analyze-hockey', {
                body: { action: 'fetch_games' }
            })

            if (error) throw error
            if (data?.games) {
                setMatches(data.games)
            }
        } catch (err) {
            console.error('Error fetching games:', err)
            alert('Kunde inte hämta matcher just nu. Försök igen senare.')
        } finally {
            setLoading(false);
        }
    };

    const analyzeGame = async (gameId: string, match: any) => {
        setAnalyzingGameId(gameId);
        try {
            const { data, error } = await supabase.functions.invoke('analyze-hockey', {
                body: {
                    action: 'analyze_game',
                    payload: { game: match }
                }
            })

            if (error) throw error

            if (data?.analysis) {
                setAnalyzedPicks(prev => ({
                    ...prev,
                    [gameId]: {
                        game_date: match.commence_time.split('T')[0],
                        league: 'SHL',
                        match_name: `${match.home_team} - ${match.away_team}`,
                        selection: data.analysis.selection,
                        odds: data.analysis.odds,
                        expected_odds: data.analysis.expected_odds,
                        value_percentage: Math.round(((data.analysis.odds / data.analysis.expected_odds) - 1) * 100),
                        motivation: data.analysis.motivation,
                        stats_info: data.analysis.stats_info,
                        ai_confidence: data.analysis.ai_confidence
                    }
                }));
            }
        } catch (err) {
            console.error('Error analyzing game:', err)
            alert('Kunde inte analysera matchen.')
        } finally {
            setAnalyzingGameId(null);
        }
    };

    const publishPick = async (gameId: string) => {
        const pick = analyzedPicks[gameId];
        if (!pick) return;

        try {
            const { error } = await supabase.from('hockey_games').insert({
                ...pick,
                source: 'ai',
                external_id: gameId
            });

            if (error) throw error;
            onPublish(); // Refresh parent
            // Remove from list or mark as published? For now just alert
            alert('AI-spel publicerat!');
        } catch (err) {
            console.error('Error publishing AI pick:', err);
            alert('Kunde inte publicera spelet.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Intro */}
            <div className="bg-[#162230]/50 border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain className="w-32 h-32 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-cyan-400" />
                    AI-Utmanaren
                </h2>
                <p className="text-slate-400 max-w-2xl">
                    Låt PrimeBets AI scanna marknaden. Här hämtar vi odds direkt från spelbolagen,
                    letar spelvärde och genererar analyser automatiskt.
                    <span className="text-cyan-400 font-bold ml-2">Människa vs Maskin.</span>
                </p>

                {!loading && matches.length === 0 && (
                    <button
                        onClick={fetchTodaysGames}
                        className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                    >
                        <Scale className="w-5 h-5" />
                        Hämta Dagens Matcher (API)
                    </button>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Scan of the market in progress...</p>
                </div>
            )}

            {/* Match List */}
            {matches.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {matches.map(match => {
                        const analysis = analyzedPicks[match.id];
                        const isAnalyzing = analyzingGameId === match.id;

                        return (
                            <div key={match.id} className="bg-[#0F1720] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">SHL • Idag</div>
                                        <h3 className="text-xl font-bold text-white">{match.home_team} - {match.away_team}</h3>
                                        <div className="text-sm text-slate-400 mt-1">Bästa odds: <span className="text-green-400 font-bold">2.45</span> (Unibet)</div>
                                    </div>

                                    {!analysis ? (
                                        <button
                                            onClick={() => analyzeGame(match.id, match)}
                                            disabled={isAnalyzing}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-cyan-400 font-bold rounded-lg border border-cyan-500/20 transition-all flex items-center gap-2"
                                        >
                                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                                            {isAnalyzing ? 'Analyserar...' : 'Analysera Marknad'}
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                                                AI Confidence: {analysis.ai_confidence}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* AI Analysis Result */}
                                {analysis && (
                                    <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-2">
                                        <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4 mb-4">
                                            <p className="text-slate-300 text-sm leading-relaxed italic">
                                                "{analysis.motivation}"
                                            </p>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setAnalyzedPicks(prev => {
                                                    const copy = { ...prev };
                                                    delete copy[match.id];
                                                    return copy;
                                                })}
                                                className="px-4 py-2 text-slate-400 hover:text-white font-medium text-sm transition-colors"
                                            >
                                                Kasta
                                            </button>
                                            <button
                                                onClick={() => publishPick(match.id)}
                                                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform flex items-center gap-2"
                                            >
                                                <Check className="w-4 h-4" />
                                                Publicera AI-Spel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
