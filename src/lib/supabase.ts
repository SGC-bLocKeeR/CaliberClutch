import { createClient } from '@supabase/supabase-js';
import { GameId } from '../types/esports';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://awxmcphoobeavlgxlasj.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3eG1jcGhvb2JlYXZsZ3hsYXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMjU4NjYsImV4cCI6MjEwNzkwMTg2Nn0.PHAo-SdAOt1TWq-ULp8L80UKEJ4v1FVCqyI7gq9iTHY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'vortex_gaming_auth_token',
    flowType: 'pkce'
  }
});

export interface VortexAuthUser {
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
