/**
 * One-time script to import historical data from "Backup" sheet to daily_picks table
 * 
 * This script:
 * 1. Reads data from the "Backup" tab in your Google Sheet
 * 2. Maps the columns to match daily_picks table structure
 * 3. Imports the data to Supabase
 * 
 * Run with: node import-backup.js
 */

// You'll need to install these if not already:
// npm install @supabase/supabase-js googleapis

const { createClient } = require('@supabase/supabase-js')
const { google } = require('googleapis')

// Supabase config
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// Google Sheets config
const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID' // Replace with your sheet ID
const BACKUP_RANGE = 'Backup!A:Z' // Adjust range as needed

async function importBackupData() {
    try {
        console.log('🚀 Starting import from Backup sheet...')

        // 1. Authenticate with Google Sheets
        const auth = new google.auth.GoogleAuth({
            keyFile: './path-to-your-service-account-key.json', // You'll need to provide this
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        })

        const sheets = google.sheets({ version: 'v4', auth })

        // 2. Fetch data from Backup sheet
        console.log('📊 Fetching data from Backup sheet...')
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: BACKUP_RANGE,
        })

        const rows = response.data.values
        if (!rows || rows.length === 0) {
            console.log('❌ No data found in Backup sheet')
            return
        }

        // 3. Parse header row to map columns
        const headers = rows[0]
        console.log('📋 Headers found:', headers)

        // 4. Map rows to daily_picks format
        const picks = []
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i]

            // Helper to get value by column name
            const getValue = (colName) => {
                const index = headers.findIndex(h => h.toLowerCase().includes(colName.toLowerCase()))
                return index >= 0 ? row[index] : null
            }

            // Helper to parse number
            const getNum = (val) => {
                const n = parseFloat(val)
                return isNaN(n) ? null : n
            }

            // Map to daily_picks structure
            const pick = {
                id: getValue('uuid') || `backup-${i}`, // Use UUID or generate one
                race_date: getValue('datum'),
                track_name: getValue('bana'),
                race_number: getNum(getValue('lopp')),
                horse_name: getValue('hast') || getValue('sektion'),
                odds: getNum(getValue('odds')),
                bet_type: getValue('spelform'),
                adam_notes: getValue('motivering'),

                // Additional fields
                distance: getValue('distans'),
                start_method: getValue('startform'),
                start_lane: getNum(getValue('startspar')),
                bookmaker: getValue('spelbolag'),
                interview_info: getValue('intervju information'),
                statistics: getValue('statistik'),
                expected_odds: getNum(getValue('forvantat odds')),
                value_percent: getNum(getValue('spelvarde %')),

                // IMPORTANT: Results data
                result_payout: getNum(getValue('resultat')),
                net_result: getNum(getValue('netto')),
                yesterday_result: getNum(getValue('gardagens resultat')),

                // AI fields
                ai_score: getNum(getValue('AI_score')),
                prime_pick_rank: getNum(getValue('PrimePick_rank')),
                form_score_7d: getNum(getValue('7day_form_score')),
                form_score_30d: getNum(getValue('30day_form_score')),
                final_output_message: getValue('final_output_message'),
                is_prime_pick: getValue('DP')?.toLowerCase() === 'ja',

                // Derive status from results
                status: (getNum(getValue('netto')) !== null || getNum(getValue('resultat')) !== null)
                    ? ((getNum(getValue('netto')) || 0) > 0 ? 'won' : 'lost')
                    : 'pending',
            }

            picks.push(pick)
        }

        console.log(`✅ Parsed ${picks.length} picks from Backup sheet`)

        // 5. Sort picks into categories
        const dailyPicks = []
        const weeklyScoutPicks = []
        const saturdayPicks = []

        /*
            ID Prefix Rules:
            VS... -> Weekly Scout (weekly_scout)
            LS... -> Saturday (saturday_picks)
            Normal -> Daily (daily_picks)
        */

        for (const pick of picks) {
            const id = String(pick.id).toUpperCase()
            if (id.startsWith('VS')) {
                weeklyScoutPicks.push(pick)
            } else if (id.startsWith('LS')) {
                saturdayPicks.push(pick)
            } else {
                dailyPicks.push(pick)
            }
        }

        console.log(`📦 Sorted data:`)
        console.log(`   - Daily Picks: ${dailyPicks.length}`)
        console.log(`   - Weekly Scout: ${weeklyScoutPicks.length}`)
        console.log(`   - Saturday Picks: ${saturdayPicks.length}`)

        // Helper to insert batch
        const insertBatch = async (table, data, label) => {
            if (data.length === 0) return 0

            const BATCH_SIZE = 100
            let insertedCount = 0

            for (let i = 0; i < data.length; i += BATCH_SIZE) {
                const batch = data.slice(i, i + BATCH_SIZE)
                const { error } = await supabase
                    .from(table)
                    .upsert(batch, { onConflict: 'id' })

                if (error) {
                    console.error(`❌ Error importing ${label} batch:`, error)
                } else {
                    insertedCount += batch.length
                    console.log(`✅ Imported ${label} batch (${insertedCount}/${data.length})`)
                }
            }
            return insertedCount
        }

        // Insert into respective tables
        await insertBatch('daily_picks', dailyPicks, 'Daily')
        await insertBatch('weekly_scout', weeklyScoutPicks, 'Weekly')
        await insertBatch('saturday_picks', saturdayPicks, 'Saturday')


        console.log(`🎉 Import complete! (See detailed batch logs above)`)

        // 6. Verify import
        const { data: verifyData } = await supabase
            .from('daily_picks')
            .select('count', { count: 'exact', head: true })

        if (!verifyError) {
            console.log('📊 Verification:')
            console.log('  - Total finished picks in DB:', verifyData?.length || 0)
        }

    } catch (error) {
        console.error('❌ Import failed:', error)
    }
}

// Run the import
importBackupData()
