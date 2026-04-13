
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { action, payload } = await req.json()

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // ---------------------------------------------------------
        // ACTION: FETCH GAMES (from The Odds API or Mock)
        // ---------------------------------------------------------
        if (action === 'fetch_games') {
            const oddsApiKey = Deno.env.get('THE_ODDS_API_KEY')
            let games = []

            console.log(`Fetching games. Key present: ${!!oddsApiKey}`)

            if (oddsApiKey) {
                // Real API fetch
                // SHL = icehockey_sweden_hockeyallsvenskan or icehockey_sweden_shl
                // Using 'upcoming' for now or a specific sport key.
                const sportKey = 'icehockey_sweden_shl'
                const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${oddsApiKey}&regions=eu&markets=h2h&oddsFormat=decimal`

                console.log(`Fetching from: ${url}`)
                const response = await fetch(url)

                if (!response.ok) {
                    const errText = await response.text()
                    console.error('Odds API Error:', errText)
                    throw new Error(`Failed to fetch from Odds API: ${response.status} ${errText}`)
                }
                games = await response.json()
            } else {
                console.log('Using Mock Data (No API Key found)')
                // Mock Data
                games = [
                    {
                        id: 'mock_game_1',
                        sport_key: 'icehockey_sweden_shl',
                        commence_time: new Date(new Date().getTime() + 3600000).toISOString(), // 1 hour from now
                        home_team: 'Leksand IF',
                        away_team: 'Färjestad BK',
                        bookmakers: [
                            {
                                key: 'unibet',
                                title: 'Unibet',
                                markets: [
                                    {
                                        key: 'h2h',
                                        outcomes: [
                                            { name: 'Leksand IF', price: 2.45 },
                                            { name: 'Färjestad BK', price: 2.10 }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'mock_game_2',
                        sport_key: 'icehockey_sweden_shl',
                        commence_time: new Date(new Date().getTime() + 7200000).toISOString(),
                        home_team: 'Skellefteå AIK',
                        away_team: 'Frölunda HC',
                        bookmakers: [
                            {
                                key: 'bet365',
                                title: 'Bet365',
                                markets: [
                                    {
                                        key: 'h2h',
                                        outcomes: [
                                            { name: 'Skellefteå AIK', price: 1.95 },
                                            { name: 'Frölunda HC', price: 2.85 }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

            return new Response(
                JSON.stringify({ games }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // ---------------------------------------------------------
        // ACTION: ANALYZE GAME (OpenAI)
        // ---------------------------------------------------------
        if (action === 'analyze_game') {
            const { game } = payload
            const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

            let analysis = {}

            if (openaiApiKey && game) {
                console.log('Analyzing with OpenAI...')

                const prompt = `
                    Du är en expert på ishockey och betting (SHL). Analysera följande match:
                    
                    Match: ${game.home_team} vs ${game.away_team}
                    Tid: ${game.commence_time}
                    Odds (Hemma): ${game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === game.home_team)?.price || 'N/A'}
                    Odds (Borta): ${game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === game.away_team)?.price || 'N/A'}
                    
                    Uppgift:
                    1. Välj en vinnare eller ett spel (Moneyline, Över/Under etc).
                    2. Motivera kortfattat varför (max 2 meningar).
                    3. Ange en "AI Confidence" (0-100%).
                    4. Ange ett "Förväntat Odds" (vad du tycker oddset borde vara).
                    5. Ange en intressant statistik-punkt.

                    Returnera strikt JSON på formatet:
                    {
                        "selection": "Lagnamn eller spel",
                        "odds": 2.45,
                        "expected_odds": 2.20,
                        "motivation": "Kort motivering...",
                        "ai_confidence": 85,
                        "stats_info": "En intressant statistik..."
                    }
                `

                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiApiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                            { role: 'system', content: 'You are a professional hockey betting analyst. You always return valid JSON.' },
                            { role: 'user', content: prompt }
                        ],
                        response_format: { type: "json_object" }
                    })
                })

                if (!response.ok) {
                    const err = await response.text()
                    console.error('OpenAI Error:', err)
                    throw new Error('OpenAI API request failed')
                }

                const data = await response.json()
                const content = data.choices[0].message.content
                analysis = JSON.parse(content)

            } else {
                console.log('Using Mock Analysis (No OpenAI Key or Game data)')
                // Mock Analysis
                analysis = {
                    selection: game?.home_team || 'Hemmalag',
                    odds: 2.45,
                    expected_odds: 2.20,
                    motivation: "AI-Mock: Hemmalaget har stark form hemma och möter ett skadedrabbat bortalag. Värde i raka ettan.",
                    ai_confidence: 78,
                    stats_info: "Hemmalaget vinner 65% av matcherna som favorit hemma."
                }
            }

            return new Response(
                JSON.stringify({ analysis }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({ error: 'Invalid action provided' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )

    } catch (error) {
        console.error('Error in analyze-hockey:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
