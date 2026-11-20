-- ========================================================
-- CALIBER CLUTCH & VORTEX GAMING - SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/awxmcphoobeavlgxlasj/sql
-- ========================================================

-- 1. CLANS TABLE (5v5 Competitive Rosters)
CREATE TABLE IF NOT EXISTS public.clans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT NOT NULL UNIQUE,
  logo TEXT,
  banner TEXT,
  description TEXT,
  country TEXT DEFAULT 'Kosovo',
  flag TEXT DEFAULT 'xk',
  captain_id TEXT NOT NULL,
  captain_name TEXT NOT NULL,
  stats JSONB DEFAULT '{"matches": 0, "wins": 0, "losses": 0, "winrate": "0%", "avgElo": 800, "tournamentsWon": 0, "streak": 0}'::jsonb,
  members JSONB DEFAULT '[]'::jsonb,
  verified BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;

-- 3. PERMISSIVE POLICIES FOR ESPORTS PLATFORM
DROP POLICY IF EXISTS "Allow public read clans" ON public.clans;
CREATE POLICY "Allow public read clans" ON public.clans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert clans" ON public.clans;
CREATE POLICY "Allow public insert clans" ON public.clans FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update clans" ON public.clans;
CREATE POLICY "Allow public update clans" ON public.clans FOR UPDATE USING (true);

-- 4. INSERT DEFAULT CALIBER CLUTCH SQUAD
INSERT INTO public.clans (id, name, tag, logo, banner, description, country, flag, captain_id, captain_name, stats, members, verified)
VALUES (
  'caliber-clutch-alpha',
  'CC Competitive Squad',
  'CC',
  '/images/clan_badges/badge_caliber_lime.svg',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  'Official Caliber Clutch competitive roster led by M14. Competing in European Cash tournaments and CS2 cups.',
  'Kosovo',
  'xk',
  'current-user',
  'M14 | caliberclutch',
  '{"matches": 0, "wins": 0, "losses": 0, "winrate": "0%", "avgElo": 800, "tournamentsWon": 0, "streak": 0}'::jsonb,
  '[{"id": "current-user", "name": "M14 | caliberclutch", "role": "IGL / Captain", "level": 3, "elo": 800, "avatar": "https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg", "country": "Kosovo", "flag": "xk", "isCaptain": true, "isUser": true}]'::jsonb,
  true
)
ON CONFLICT (tag) DO UPDATE SET
  name = EXCLUDED.name,
  logo = EXCLUDED.logo,
  updated_at = timezone('utc'::text, now());
