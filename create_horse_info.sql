-- Skapar tabellen 'horse_info' för att lagra utökad hästdata
-- ID-formatet är tänkt att vara 'h1', 'h2' osv.

CREATE TABLE IF NOT EXISTS horse_info (
    id TEXT PRIMARY KEY,              -- Motsvarar 'uuid' i din lista (t.ex. 'h1')
    horse_name TEXT NOT NULL,         -- Måste ha ett namn
    birth_year INTEGER,
    sex TEXT,                         -- Hingst/Valack/Sto
    trainer TEXT,
    default_driver TEXT,
    strength_tags TEXT,               -- Kommaseparerad text (t.ex. "Stark, Startsnabb")
    weakness_tags TEXT,               -- Kommaseparerad text (t.ex. "Ojämn, Galopprisk")
    notes_short TEXT,                 -- Kort expertkommentar
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slå på säkerhet (Row Level Security)
ALTER TABLE horse_info ENABLE ROW LEVEL SECURITY;

-- Tillåt alla att läsa (för att visa på hemsidan)
CREATE POLICY "Public read access" ON horse_info FOR SELECT USING (true);

-- Tillåt bara service_role (n8n/backend) att skriva/ändra
CREATE POLICY "Service role full access" ON horse_info FOR ALL USING (auth.role() = 'service_role');

-- Index för snabb sökning på namn
CREATE INDEX IF NOT EXISTS idx_horse_info_name ON horse_info (horse_name);

-- Exempel på hur man lägger in data:
-- INSERT INTO horse_info (id, horse_name, birth_year, sex, trainer, default_driver, strength_tags, weakness_tags, notes_short)
-- VALUES ('h1', 'Francesco Zet', 2018, 'Hingst', 'Daniel Redén', 'Örjan Kihlström', 'Stark, Snabb', 'Inga', 'En superstjärna.');
