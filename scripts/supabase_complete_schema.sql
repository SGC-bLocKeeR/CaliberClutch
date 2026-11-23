-- ========================================================
-- CALIBER CLUTCH - COMPLETE SUPABASE CLOUD DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mddfsdaoyeemzwoctfej/sql
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

-- 2. TOURNAMENTS TABLE (Community & Organizer Cups)
CREATE TABLE IF NOT EXISTS public.tournaments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'COMMUNITY CLAN CUP',
  game TEXT DEFAULT 'CS2 5v5 Tactical',
  cash_prize TEXT NOT NULL,
  total_pool NUMERIC NOT NULL DEFAULT 0,
  total_collected NUMERIC NOT NULL DEFAULT 0,
  teams TEXT DEFAULT '0 / 16',
  max_teams INTEGER NOT NULL DEFAULT 16,
  registered_teams_count INTEGER DEFAULT 0,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'REGISTRATION OPEN',
  badge TEXT,
  is_live BOOLEAN DEFAULT false,
  is_open BOOLEAN DEFAULT true,
  is_custom BOOLEAN DEFAULT true,
  organizer TEXT NOT NULL,
  creator TEXT NOT NULL,
  creator_clan TEXT,
  creator_gamertag TEXT NOT NULL,
  entry_fee NUMERIC NOT NULL DEFAULT 0,
  entry_fee_per_player NUMERIC NOT NULL DEFAULT 0,
  is_paid_entry BOOLEAN DEFAULT true,
  platform_commission NUMERIC DEFAULT 0.05,
  organizer_commission NUMERIC DEFAULT 0.05,
  platform_profit NUMERIC DEFAULT 0,
  organizer_reward NUMERIC DEFAULT 0,
  spectator_ip TEXT DEFAULT 'tv.caliberclutch.gg:27020',
  spectator_password TEXT DEFAULT 'cc_cast',
  caster_delay INTEGER DEFAULT 120,
  stream_rights_granted BOOLEAN DEFAULT true,
  structure TEXT DEFAULT 'Single Elimination',
  playoffs_format TEXT DEFAULT 'BO1 Semi-Finals',
  finals_format TEXT DEFAULT 'BO3 Grand Final',
  region TEXT DEFAULT 'European Online Bracket',
  payout_1st TEXT,
  payout_2nd TEXT,
  payout_3rd TEXT,
  registered_teams JSONB DEFAULT '[]'::jsonb,
  bracket JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CALIBER PROFILES TABLE (Player Ranks, ELO, Wallet, Stats)
CREATE TABLE IF NOT EXISTS public.caliber_profiles (
  id TEXT PRIMARY KEY,
  gamer_tag TEXT NOT NULL,
  avatar_url TEXT,
  steam_id TEXT,
  steam_id64 TEXT,
  faceit_nickname TEXT,
  faceit_elo INTEGER DEFAULT 800,
  faceit_level INTEGER DEFAULT 3,
  matches_played INTEGER DEFAULT 0,
  wallet_balance NUMERIC DEFAULT 0.00,
  coins INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  membership_tier TEXT DEFAULT 'free',
  country TEXT DEFAULT 'Kosovo',
  flag TEXT DEFAULT 'xk',
  is_admin BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caliber_profiles ENABLE ROW LEVEL SECURITY;

-- 5. PERMISSIVE POLICIES FOR ESPORTS PLATFORM
-- Clans
DROP POLICY IF EXISTS "Allow public read clans" ON public.clans;
CREATE POLICY "Allow public read clans" ON public.clans FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert clans" ON public.clans;
CREATE POLICY "Allow public insert clans" ON public.clans FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update clans" ON public.clans;
CREATE POLICY "Allow public update clans" ON public.clans FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete clans" ON public.clans;
CREATE POLICY "Allow public delete clans" ON public.clans FOR DELETE USING (true);

-- Tournaments
DROP POLICY IF EXISTS "Allow public read tournaments" ON public.tournaments;
CREATE POLICY "Allow public read tournaments" ON public.tournaments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert tournaments" ON public.tournaments;
CREATE POLICY "Allow public insert tournaments" ON public.tournaments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update tournaments" ON public.tournaments;
CREATE POLICY "Allow public update tournaments" ON public.tournaments FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete tournaments" ON public.tournaments;
CREATE POLICY "Allow public delete tournaments" ON public.tournaments FOR DELETE USING (true);

-- Profiles
DROP POLICY IF EXISTS "Allow public read profiles" ON public.caliber_profiles;
CREATE POLICY "Allow public read profiles" ON public.caliber_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.caliber_profiles;
CREATE POLICY "Allow public insert profiles" ON public.caliber_profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update profiles" ON public.caliber_profiles;
CREATE POLICY "Allow public update profiles" ON public.caliber_profiles FOR UPDATE USING (true);

-- 6. ENABLE SUPABASE REALTIME REPLICATION FOR LIVE ESPORTS UPDATES
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'tournaments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tournaments;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'clans'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.clans;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'caliber_profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.caliber_profiles;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Gracefully ignore if publication alter is restricted
END $$;

-- 7. DEFAULT SEED DATA
-- Default Clan: CC Competitive Squad
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
