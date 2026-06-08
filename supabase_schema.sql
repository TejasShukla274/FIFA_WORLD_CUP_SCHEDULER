-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    time_ist VARCHAR(10) NOT NULL,
    team1 VARCHAR(100) NOT NULL,
    team2 VARCHAR(100) NOT NULL,
    venue VARCHAR(200) NOT NULL,
    group_name VARCHAR(50) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    team1_score INTEGER DEFAULT NULL,
    team2_score INTEGER DEFAULT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable row-level security (RLS)
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for all
CREATE POLICY "Allow public read access" ON public.matches
    FOR SELECT USING (true);

-- Create policy to allow authenticated updates (or public updates if testing)
CREATE POLICY "Allow public updates for testing" ON public.matches
    FOR UPDATE USING (true) WITH CHECK (true);

-- Example Insert Statements for Seeding (Group A)
-- INSERT INTO public.matches (id, date, time_ist, team1, team2, venue, group_name, stage) VALUES
-- ('m_1', '2026-06-11', '18:30', 'mex', 'rsa', 'Estadio Azteca', 'Group A', 'Group Stage'),
-- ('m_2', '2026-06-11', '21:30', 'kor', 'cze', 'MetLife Stadium', 'Group A', 'Group Stage');
