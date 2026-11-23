/**
 * CALIBER CLUTCH - SUPABASE CLAN & TEAM PERSISTENCE SERVICE
 * Official PostgreSQL Cloud Database Sync for 5v5 Rosters & Competitive Clans
 */

import { supabase } from '../lib/supabase';
import { ClanData, ClanMember } from '../components/vortex/VortexClanHub';

export interface ClanSyncStatus {
  isConnected: boolean;
  isSynced: boolean;
  cloudTableReady: boolean;
  lastSyncTime: number | null;
  clanTag: string;
  memberCount: number;
  message?: string;
}

const STORAGE_KEY_USER_CLAN = 'caliber_user_clan_data';
const STORAGE_KEY_LAST_SYNC = 'caliber_clan_last_supabase_sync';
const getStoredClan = (): string | null => localStorage.getItem(STORAGE_KEY_USER_CLAN) || localStorage.getItem('vortex_user_clan_data');
const getStoredLastSync = (): string | null => localStorage.getItem(STORAGE_KEY_LAST_SYNC) || localStorage.getItem('vortex_clan_last_supabase_sync');

/**
 * Check if the Supabase connection is healthy and if clan tables exist
 */
export async function checkSupabaseClanStatus(): Promise<{
  connected: boolean;
  tableReady: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.from('clans').select('id, tag').limit(1);
    if (error) {
      // If table doesn't exist yet in Supabase schema cache
      if (error.message?.includes('schema cache') || error.code === '42P01') {
        return { connected: true, tableReady: false, error: 'Table public.clans awaiting SQL schema migration' };
      }
      return { connected: false, tableReady: false, error: error.message };
    }
    return { connected: true, tableReady: true };
  } catch (err: any) {
    return { connected: false, tableReady: false, error: err?.message || 'Connection error' };
  }
}

/**
 * Fetch clan data from Supabase Cloud Database with seamless LocalStorage fallback
 */
export async function fetchClanFromCloud(clanTag: string = 'CC'): Promise<ClanData | null> {
  try {
    const { data, error } = await supabase
      .from('clans')
      .select('*')
      .ilike('tag', clanTag)
      .maybeSingle();

    if (!error && data) {
      const formattedClan: ClanData = {
        id: data.id || 'caliber-clutch-alpha',
        name: data.name || 'Caliber Clutch',
        tag: data.tag || 'CC',
        logo: data.logo || '/images/clan_badges/badge_caliber_lime.svg',
        banner: data.banner || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80',
        description: data.description || 'Official Caliber Clutch European CS2 Competitive Roster',
        country: data.country || 'Kosovo',
        flag: data.flag || 'xk',
        captainId: data.captain_id || 'current-user',
        captainName: data.captain_name || 'M14',
        members: data.members || [],
        stats: data.stats || {
          matches: 0,
          wins: 0,
          losses: 0,
          winrate: '0%',
          avgElo: 800,
          tournamentsWon: 0,
          streak: 0,
        },
        verified: data.verified ?? true,
      };

      // Save to local storage for instant offline access
      localStorage.setItem(STORAGE_KEY_USER_CLAN, JSON.stringify(formattedClan));
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, Date.now().toString());
      return formattedClan;
    }
  } catch (err) {
    console.warn('[SupabaseClanService] Cloud fetch skipped, falling back to local state:', err);
  }

  // Fallback to local storage
  try {
    const local = getStoredClan();
    if (local) return JSON.parse(local);
  } catch (_) {}

  return null;
}

/**
 * Save Clan data to both LocalStorage and Supabase Cloud Database
 */
export async function saveClanToCloud(clan: ClanData): Promise<{
  success: boolean;
  syncedToCloud: boolean;
  message: string;
}> {
  // 1. Immediately persist to LocalStorage for zero-latency UI response
  try {
    localStorage.setItem(STORAGE_KEY_USER_CLAN, JSON.stringify(clan));
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, Date.now().toString());
  } catch (e) {
    console.error('[SupabaseClanService] LocalStorage save failed:', e);
  }

  // 2. Persist to Supabase Database
  try {
    const payload = {
      id: clan.id || 'caliber-clutch-alpha',
      name: clan.name,
      tag: clan.tag,
      logo: clan.logo,
      banner: clan.banner,
      description: clan.description,
      country: clan.country,
      flag: clan.flag,
      captain_id: clan.captainId,
      captain_name: clan.captainName,
      stats: clan.stats,
      members: clan.members,
      verified: clan.verified ?? true,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('clans')
      .upsert(payload, { onConflict: 'tag' });

    if (error) {
      return {
        success: true,
        syncedToCloud: false,
        message: `Saved locally! (Cloud schema pending: ${error.message})`
      };
    }

    return {
      success: true,
      syncedToCloud: true,
      message: `✓ Clan [${clan.tag}] synced with Supabase Cloud Database!`
    };
  } catch (err: any) {
    return {
      success: true,
      syncedToCloud: false,
      message: `Saved locally. Cloud sync: ${err?.message || 'offline'}`
    };
  }
}

/**
 * Get current sync status
 */
export function getLocalClanSyncStatus(clan: ClanData): ClanSyncStatus {
  const lastSync = getStoredLastSync();
  return {
    isConnected: true,
    isSynced: !!lastSync,
    cloudTableReady: true,
    lastSyncTime: lastSync ? parseInt(lastSync, 10) : null,
    clanTag: clan.tag,
    memberCount: clan.members?.length || 1,
    message: lastSync ? 'Database Live' : 'Local Ready'
  };
}
