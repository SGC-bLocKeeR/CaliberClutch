/**
 * CALIBER CLUTCH - SUPABASE TOURNAMENT CLOUD PERSISTENCE & REALTIME SERVICE
 * Syncs community clan tournaments, live bracket registrations, and sporting authority approvals
 */

import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface CloudTournament {
  id: string;
  title: string;
  type: string;
  game: string;
  cashPrize: string;
  totalPool: number;
  totalCollected: number;
  teams: string;
  maxTeams: number;
  registeredTeamsCount: number;
  date: string;
  status: string;
  badge?: string;
  isLive: boolean;
  isOpen: boolean;
  isCustom: boolean;
  organizer: string;
  creator: string;
  creatorClan: string;
  creatorGamerTag: string;
  entryFee: number;
  entryFeePerPlayer: number;
  isPaidEntry: boolean;
  platformCommission: number;
  organizerCommission: number;
  platformProfit: number;
  organizerReward: number;
  spectatorIp?: string;
  spectatorPassword?: string;
  casterDelay?: number;
  streamRightsGranted?: boolean;
  structure: string;
  playoffsFormat: string;
  finalsFormat: string;
  region: string;
  payout1st?: string;
  payout2nd?: string;
  payout3rd?: string;
  registeredTeams?: any[];
  bracket?: any[];
}

const STORAGE_KEY = 'caliber_custom_tournaments';
const getStoredTournaments = (): string | null => localStorage.getItem(STORAGE_KEY) || localStorage.getItem('vortex_custom_tournaments');

export function mapRowToTournament(row: any): CloudTournament {
  return {
    id: row.id,
    title: row.title,
    type: row.type || 'COMMUNITY CLAN CUP',
    game: row.game || 'CS2 5v5 Tactical',
    cashPrize: row.cash_prize,
    totalPool: Number(row.total_pool || 0),
    totalCollected: Number(row.total_collected || 0),
    teams: row.teams || `0 / ${row.max_teams || 16}`,
    maxTeams: Number(row.max_teams || 16),
    registeredTeamsCount: Number(row.registered_teams_count || 0),
    date: row.date,
    status: row.status || 'REGISTRATION OPEN',
    badge: row.badge,
    isLive: Boolean(row.is_live),
    isOpen: Boolean(row.is_open),
    isCustom: Boolean(row.is_custom),
    organizer: row.organizer,
    creator: row.creator,
    creatorClan: row.creator_clan || 'COMM',
    creatorGamerTag: row.creator_gamertag,
    entryFee: Number(row.entry_fee || 0),
    entryFeePerPlayer: Number(row.entry_fee_per_player || 0),
    isPaidEntry: Boolean(row.is_paid_entry),
    platformCommission: Number(row.platform_commission || 0.05),
    organizerCommission: Number(row.organizer_commission || 0.05),
    platformProfit: Number(row.platform_profit || 0),
    organizerReward: Number(row.organizer_reward || 0),
    spectatorIp: row.spectator_ip || 'tv.caliberclutch.gg:27020',
    spectatorPassword: row.spectator_password || 'cc_cast',
    casterDelay: Number(row.caster_delay || 120),
    streamRightsGranted: Boolean(row.stream_rights_granted),
    structure: row.structure || 'Single Elimination',
    playoffsFormat: row.playoffs_format || 'BO1 Semi-Finals',
    finalsFormat: row.finals_format || 'BO3 Grand Final',
    region: row.region || 'European Online Bracket',
    payout1st: row.payout_1st,
    payout2nd: row.payout_2nd,
    payout3rd: row.payout_3rd,
    registeredTeams: row.registered_teams || [],
    bracket: row.bracket || [],
  };
}

export function mapTournamentToRow(t: CloudTournament): any {
  return {
    id: t.id,
    title: t.title,
    type: t.type,
    game: t.game,
    cash_prize: t.cashPrize,
    total_pool: t.totalPool,
    total_collected: t.totalCollected,
    teams: t.teams,
    max_teams: t.maxTeams,
    registered_teams_count: t.registeredTeamsCount,
    date: t.date,
    status: t.status,
    badge: t.badge,
    is_live: t.isLive,
    is_open: t.isOpen,
    is_custom: t.isCustom,
    organizer: t.organizer,
    creator: t.creator,
    creator_clan: t.creatorClan,
    creator_gamertag: t.creatorGamerTag,
    entry_fee: t.entryFee,
    entry_fee_per_player: t.entryFeePerPlayer,
    is_paid_entry: t.isPaidEntry,
    platform_commission: t.platformCommission,
    organizer_commission: t.organizerCommission,
    platform_profit: t.platformProfit,
    organizer_reward: t.organizerReward,
    spectator_ip: t.spectatorIp,
    spectator_password: t.spectatorPassword,
    caster_delay: t.casterDelay,
    stream_rights_granted: t.streamRightsGranted,
    structure: t.structure,
    playoffs_format: t.playoffsFormat,
    finals_format: t.finalsFormat,
    region: t.region,
    payout_1st: t.payout1st,
    payout_2nd: t.payout2nd,
    payout_3rd: t.payout3rd,
    registered_teams: t.registeredTeams || [],
    bracket: t.bracket || [],
    updated_at: new Date().toISOString(),
  };
}

/**
 * Check if the Supabase tournaments table exists
 */
export async function checkSupabaseTournamentStatus(): Promise<{
  connected: boolean;
  tableReady: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.from('tournaments').select('id').limit(1);
    if (error) {
      if (error.message?.includes('schema cache') || error.code === '42P01') {
        return { connected: true, tableReady: false, error: 'Table public.tournaments awaiting migration' };
      }
      return { connected: false, tableReady: false, error: error.message };
    }
    return { connected: true, tableReady: true };
  } catch (err: any) {
    return { connected: false, tableReady: false, error: err?.message || 'Connection error' };
  }
}

/**
 * Fetch all tournaments from Supabase Cloud with fallback to LocalStorage
 */
export async function fetchTournamentsFromCloud(): Promise<CloudTournament[]> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const parsed = data.map(mapRowToTournament);
      // Synchronize with local storage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch (_) {}
      return parsed;
    }
  } catch (err) {
    console.warn('[TournamentCloud] Cloud fetch failed, using local storage:', err);
  }

  // Fallback to local storage
  try {
    const saved = getStoredTournaments();
    if (saved) return JSON.parse(saved);
  } catch (_) {}

  return [];
}

/**
 * Save a tournament to Supabase Cloud and LocalStorage
 */
export async function saveTournamentToCloud(tournament: CloudTournament): Promise<{
  success: boolean;
  syncedToCloud: boolean;
  message: string;
}> {
  // 1. Instantly persist to LocalStorage
  try {
    const local = getStoredTournaments();
    const list: CloudTournament[] = local ? JSON.parse(local) : [];
    const idx = list.findIndex(item => item.id === tournament.id);
    if (idx >= 0) {
      list[idx] = tournament;
    } else {
      list.unshift(tournament);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('[TournamentCloud] Local save error:', e);
  }

  // 2. Persist to Supabase Database
  try {
    const payload = mapTournamentToRow(tournament);
    const { error } = await supabase
      .from('tournaments')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      return {
        success: true,
        syncedToCloud: false,
        message: `Saved locally! (Cloud sync pending: ${error.message})`
      };
    }

    return {
      success: true,
      syncedToCloud: true,
      message: `✓ Tournament "${tournament.title}" synced to Caliber Clutch cloud.`
    };
  } catch (err: any) {
    return {
      success: true,
      syncedToCloud: false,
      message: `Saved locally (offline mode).`
    };
  }
}

/**
 * Delete a tournament from Supabase Cloud and LocalStorage
 */
export async function deleteTournamentFromCloud(tournamentId: string): Promise<{
  success: boolean;
  deletedFromCloud: boolean;
}> {
  // 1. Remove from LocalStorage
  try {
    const local = getStoredTournaments();
    if (local) {
      const list: CloudTournament[] = JSON.parse(local);
      const filtered = list.filter(item => item.id !== tournamentId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (_) {}

  // 2. Remove from Supabase
  try {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', tournamentId);

    return {
      success: !error,
      deletedFromCloud: !error,
    };
  } catch (err) {
    return {
      success: true,
      deletedFromCloud: false,
    };
  }
}

/**
 * Realtime subscription to live tournament changes
 */
export function subscribeToTournamentChanges(
  onUpdate: (updatedTournament: CloudTournament) => void,
  onInsert?: (newTournament: CloudTournament) => void,
  onDelete?: (deletedId: string) => void
): () => void {
  const channel: RealtimeChannel = supabase
    .channel('tournaments_live_feed')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'tournaments' },
      payload => {
        if (payload.new) {
          const t = mapRowToTournament(payload.new);
          if (onInsert) onInsert(t);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'tournaments' },
      payload => {
        if (payload.new) {
          const t = mapRowToTournament(payload.new);
          onUpdate(t);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'tournaments' },
      payload => {
        if (payload.old?.id && onDelete) {
          onDelete(payload.old.id);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
