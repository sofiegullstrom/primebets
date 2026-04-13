import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const payload = await req.json()
        const record = payload.record

        if (!record || !record.id) {
            throw new Error('Invalid payload: "record" with "id" is required')
        }

        console.log(`Analyzing pick for ${record.horse_name} at ${record.track_name}...`)

        // Determine best form metric
        const form7d = record.form_score_7d || 0
        const form30d = record.form_score_30d || 0
        const yesterday = record.yesterday_result || 0

        let bestFormText = ""
        if (yesterday > 500) { // Arbitrary threshold for "strong yesterday"
            bestFormText = `Gårdagens resultat: ${yesterday} kr`
        } else if (form7d > form30d) {
            bestFormText = `7-dagars form: ${form7d} poäng`
        } else {
            bestFormText = `30-dagars form: ${form30d} poäng`
        }

        // Construct Swedish Prompt
        const prompt = `
      Du är Cody, PrimeBets betting-expert. Analysera detta spel:
      
      Häst: ${record.horse_name}
      Bana: ${record.track_name}
      Lopp: ${record.race_number}
      Distans: ${record.distance}
      Startspår: ${record.start_lane}
      Odds: ${record.odds}
      Förväntat Odds: ${record.expected_odds}
      Spelvärde: ${record.value_percent}%
      Adam's Kommentar: "${record.adam_notes}"
      Intervju Info: "${record.interview_info}"
      Statistik: "${record.statistics}"
      Form-data: ${bestFormText}

      Uppdrag:
      1. Beräkna en "AI Score" (0-100) baserat på värde, form och info.
      2. Skriv en kort, kärnfull analys på SVENSKA för dashboarden.
      
      Formatet MÅSTE vara exakt så här:
      "Dagens PrimePick: ${record.horse_name}
      • Form: [Din text om formen]
      • Kommentar: [Kort analys som väger samman allt]
      • Startspår/distans: [Kort kommentar om läget]
      • Oddsanalys: Spelvärde ${record.value_percent}%, aktuellt odds ${record.odds}, förväntat ${record.expected_odds}
      Detta är dagens starkaste spel enligt PrimeBets AI."

      Regler:
      - Ingen "Hej" eller inledning. Rakt på sak.
      - Betting-ton: "spelvärde", "formstarkt", "rätt läge".
      - Max 150 ord.
      
      Returnera JSON:
      {
        "ai_score": number,
        "final_output_message": string
      }
    `

        // Mock AI Call (Replace with actual OpenAI/Gemini call later)
        // For now, we simulate the output to verify the pipeline.
        const mockResponse = {
            ai_score: Math.min(99, (record.value_percent || 50) + 20), // Simple mock logic
            final_output_message: `Dagens PrimePick: ${record.horse_name}
• Form: ${bestFormText}. Hästen visar stigande formkurva.
• Kommentar: ${record.adam_notes}. ${record.interview_info ? "Tränaren är optimistisk." : "Statistiken talar för seger."}
• Startspår/distans: Perfekt utgångsläge över ${record.distance}.
• Oddsanalys: Spelvärde ${record.value_percent}%, aktuellt odds ${record.odds}, förväntat ${record.expected_odds}
Detta är dagens starkaste spel enligt PrimeBets AI.`
        }

        // Update Record
        const { error } = await supabase
            .from('daily_picks')
            .update({
                ai_score: mockResponse.ai_score,
                final_output_message: mockResponse.final_output_message,
                ai_analysis: mockResponse // Keep the full object just in case
            })
            .eq('id', record.id)

        if (error) {
            throw error
        }

        return new Response(
            JSON.stringify({ message: 'Analysis complete', id: record.id }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        console.error('Analysis Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
