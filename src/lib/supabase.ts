import { createClient } from '@supabase/supabase-js';
import { GameId } from '../types/esports';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mddfsdaoyeemzwoctfej.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZGZzZGFveWVlbXp3b2N0ZmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzOTA4NTQsImV4cCI6MjExMDk2Njg1NH0.9-IGLbq0pI6xFmlFHBpmpDlXAqYcPSxCuiEAk_dO35I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'caliber_clutch_auth_token',
    flowType: 'pkce'
  }
});

export interface CaliberAuthUser {
  id: string;
  email: string;
  gamerTag: string;
  avatar?: string;
  primaryGame: GameId;
  coins: number;
  xp: number;
  faceitNickname?: string;
  faceitElo?: number;
  faceitLevel?: number;
  steamId64?: string;
  isFaceitVerified?: boolean;
}

export type VortexAuthUser = CaliberAuthUser;

export async function registerWithSupabase(params: {
  email: string;
  password: string;
  gamerTag: string;
  primaryGame: GameId;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        gamerTag: params.gamerTag,
        primaryGame: params.primaryGame,
        coins: 0,
        xp: 0,
        country: 'Kosovo',
        membershipTier: 'free'
      }
    }
  });
  if (error) throw error;
  return data;
}

export async function loginWithSupabase(email: string, pass: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass
  });
  if (error) throw error;
  return data;
}

export async function signOutFromSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getActiveSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
