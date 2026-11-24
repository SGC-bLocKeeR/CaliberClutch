/**
 * CALIBER CLUTCH - SUPABASE PLAYER PROFILE & ELO SERVICE
 * Syncs user stats, ELO, Faceit verification, wallet balance, and rank tier
 */

import { supabase } from '../lib/supabase';

export interface CaliberProfile {
  id: string; // gamerTag or steamId64
  gamerTag: string;
  avatarUrl?: string;
  steamId?: string;
  steamId64?: string;
  faceitNickname?: string;
  faceitElo: number;
  faceitLevel: number;
  matchesPlayed: number;
  walletBalance: number;
  coins: number;
  xp: number;
  membershipTier: string;
  country: string;
  flag: string;
  isAdmin: boolean;
}

export function mapRowToProfile(row: any): CaliberProfile {
  return {
    id: row.id,
    gamerTag: row.gamer_tag,
    avatarUrl: row.avatar_url,
    steamId: row.steam_id,
    steamId64: row.steam_id64,
    faceitNickname: row.faceit_nickname,
    faceitElo: Number(row.faceit_elo ?? 0),
    faceitLevel: Number(row.faceit_level ?? 1),
    matchesPlayed: Number(row.matches_played ?? 0),
    walletBalance: Number(row.wallet_balance ?? 0),
    coins: Number(row.coins ?? 0),
    xp: Number(row.xp ?? 0),
    membershipTier: row.membership_tier || 'free',
    country: row.country || 'Kosovo',
    flag: row.flag || 'xk',
    isAdmin: Boolean(row.is_admin),
  };
}

export function mapProfileToRow(p: CaliberProfile): any {
  return {
    id: p.id,
    gamer_tag: p.gamerTag,
    avatar_url: p.avatarUrl,
    steam_id: p.steamId,
    steam_id64: p.steamId64,
    faceit_nickname: p.faceitNickname,
    faceit_elo: p.faceitElo,
    faceit_level: p.faceitLevel,
    matches_played: p.matchesPlayed,
    wallet_balance: p.walletBalance,
    coins: p.coins,
    xp: p.xp,
    membership_tier: p.membershipTier,
    country: p.country,
    flag: p.flag,
    is_admin: p.isAdmin,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Check if the Supabase caliber_profiles table exists
 */
export async function checkSupabaseProfileStatus(): Promise<{
  connected: boolean;
  tableReady: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.from('caliber_profiles').select('id').limit(1);
    if (error) {
      if (error.message?.includes('schema cache') || error.code === '42P01') {
        return { connected: true, tableReady: false, error: 'Table public.caliber_profiles awaiting migration' };
      }
      return { connected: false, tableReady: false, error: error.message };
    }
    return { connected: true, tableReady: true };
  } catch (err: any) {
    return { connected: false, tableReady: false, error: err?.message || 'Connection error' };
  }
}

/**
 * Fetch profile from Supabase Cloud by gamerTag or steamId64
 */
export async function fetchProfileFromCloud(identifier: string): Promise<CaliberProfile | null> {
  if (!identifier) return null;
  try {
    const { data, error } = await supabase
      .from('caliber_profiles')
      .select('*')
      .or(`id.eq.${identifier},gamer_tag.ilike.${identifier},steam_id64.eq.${identifier}`)
      .maybeSingle();

    if (!error && data) {
      return mapRowToProfile(data);
    }
  } catch (err) {
    console.warn('[ProfileCloud] Fetch error:', err);
  }
  return null;
}

/**
 * Save / Upsert player profile to Supabase Cloud
 */
export async function saveProfileToCloud(profile: CaliberProfile): Promise<{
  success: boolean;
  syncedToCloud: boolean;
}> {
  try {
    const payload = mapProfileToRow(profile);
    const { error } = await supabase
      .from('caliber_profiles')
      .upsert(payload, { onConflict: 'id' });

    if (!error) {
      return { success: true, syncedToCloud: true };
    }
    return { success: true, syncedToCloud: false };
  } catch (_) {
    return { success: true, syncedToCloud: false };
  }
}
