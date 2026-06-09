-- Run this in your Supabase SQL Editor

-- 1. Create the user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mastery JSONB DEFAULT '{}'::jsonb NOT NULL,
  stats JSONB DEFAULT '{}'::jsonb NOT NULL,
  badges JSONB DEFAULT '[]'::jsonb NOT NULL,
  completed_lessons JSONB DEFAULT '[]'::jsonb NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT user_progress_pkey PRIMARY KEY (user_id)
);

-- 2. Enable RLS (Row Level Security)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for users to read and update ONLY their own data
CREATE POLICY "Users can view their own progress" 
ON public.user_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 4. Automatically insert a row when a new user signs up (Optional but good practice)
-- Create a trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Create repertoire_songs table
CREATE TABLE IF NOT EXISTS public.repertoire_songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  composer TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  xml_data TEXT NOT NULL,
  xp_cost INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Anyone can read songs
ALTER TABLE public.repertoire_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view songs" 
ON public.repertoire_songs FOR SELECT 
USING (true);

-- Insert Demo Songs
INSERT INTO public.repertoire_songs (id, title, composer, difficulty, xml_data, xp_cost)
VALUES 
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Oda a la Alegría', 'L. V. Beethoven', 'beginner', '<?xml version="1.0" encoding="UTF-8"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note><note><pitch><step>G</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note></measure></part></score-partwise>', 0),
  ('c92b2d6a-5425-4c01-8b2b-014db5a5c689', 'Minuet in G', 'J. S. Bach', 'intermediate', '<?xml version="1.0" encoding="UTF-8"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>1</divisions><key><fifths>1</fifths></key><time><beats>3</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>D</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note><note><pitch><step>G</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note><note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note></measure></part></score-partwise>', 150);

-- 6. Create Leaderboard View
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  auth.users.id AS user_id,
  auth.users.email AS email,
  (user_progress.stats->>'totalXP')::INTEGER AS total_xp
FROM public.user_progress
JOIN auth.users ON auth.users.id = user_progress.user_id
ORDER BY total_xp DESC NULLS LAST
LIMIT 10;


