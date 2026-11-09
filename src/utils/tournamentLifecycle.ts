export interface HltvEvent {
  id: string;
  name: string;
  subtitle?: string;
  daysText?: string;
  ribbon?: {
    text: string;
    color?: string;
  };
  logoType: 'iem' | 'blast' | 'pgl' | 'nexus';
  status: 'live' | 'upcoming' | 'over';
  tournamentId?: string;
}
import { Tournament } from '../types/esports';

export interface ScheduledCircuitEvent {
  id: string;
  name: string;
  startDate: string; // ISO Date YYYY-MM-DD
  endDate: string;   // ISO Date YYYY-MM-DD
  logoType: 'iem' | 'blast' | 'pgl' | 'nexus';
  tournamentId: string;
  prizePool: number;
  format: string;
  location: string;
  liveMatchDescription?: string;
}

/**
 * Official Pro Circuit & Nexus Tournament Calendar.
 * Events automatically transition through their lifecycle:
 * 1. UPCOMING: Countdown in days/hours
 * 2. LIVE: Shows LIVE badge and active match room
 * 3. COMPLETED/OVER: Automatically removed from the active events list and archived.
 */
export const SCHEDULED_TOURNAMENTS: ScheduledCircuitEvent[] = [
  {
    id: 'iem-beijing',
    name: 'IEM Beijing',
    startDate: '2026-11-02T10:00:00Z',
    endDate: '2026-11-08T22:00:00Z', // Ended yesterday - automatically completed!
    logoType: 'iem',
    tournamentId: 'tourney-beijing-archive',
    prizePool: 1250000,
    format: '5v5 Single Elimination BO3 (BO5 Grand Finals)',
    location: 'Beijing, China (Wukesong Arena)',
    liveMatchDescription: 'Grand Finals Concluded • Winner: The MongolZ'
  },
  {
    id: 'blast-rivals',
    name: 'BLAST Rivals 2026',
    startDate: '2026-11-11T12:00:00Z',
    endDate: '2026-11-15T23:00:00Z',
    logoType: 'blast',
    tournamentId: 'tourney-1',
    prizePool: 1000000,
    format: 'GSL Groups + Playoffs BO3 (BO5 Grand Finals)',
    location: 'Hong Kong (AsiaWorld-Arena)',
    liveMatchDescription: 'Group A Opening: Team Spirit vs FURIA (BO3 Series)'
  },
  {
    id: 'nexus-balkan',
    name: 'Nexus Balkan Circuit Season 4',
    startDate: '2026-11-14T16:00:00Z',
    endDate: '2026-11-18T22:00:00Z',
    logoType: 'nexus',
    tournamentId: 'tourney-pro-special',
    prizePool: 25000,
    format: '5v5 Double Elimination Bracket',
    location: 'Frankfurt Dedicated 128-Tick',
    liveMatchDescription: 'Semifinals Decider Match (128-Tick)'
  },
  {
    id: 'pgl-major-1',
    name: 'PGL Major Stage 1',
    startDate: '2026-11-24T10:00:00Z',
    endDate: '2026-11-28T22:00:00Z',
    logoType: 'pgl',
    tournamentId: 'tourney-cs2-faceit-cup',
    prizePool: 1250000,
    format: 'Swiss System 16 Squads',
    location: 'Bucharest, Romania',
    liveMatchDescription: 'Round 1 Opening Matches'
  },
  {
    id: 'pgl-major-2',
    name: 'PGL Major Stage 2',
    startDate: '2026-11-28T10:00:00Z',
    endDate: '2026-12-02T22:00:00Z',
    logoType: 'pgl',
    tournamentId: 'tourney-cs2-faceit-cup',
    prizePool: 1250000,
    format: 'Elimination Stage Swiss',
    location: 'Bucharest, Romania',
    liveMatchDescription: 'Elimination Stage Day 1'
  },
  {
    id: 'pgl-major-playoffs',
    name: 'PGL Major',
    startDate: '2026-12-02T10:00:00Z',
    endDate: '2026-12-06T23:00:00Z',
    logoType: 'pgl',
    tournamentId: 'tourney-cs2-faceit-cup',
    prizePool: 1250000,
    format: 'Championship Arena Playoffs',
    location: 'Bucharest Arena',
    liveMatchDescription: 'Major Championship Finals'
  }
];

/**
 * Dynamically computes event state:
 * - Removes finished tournaments automatically from the active list.
 * - Promotes active/started tournaments to 'live'.
 * - Computes real countdown for upcoming tournaments.
 */
export function getActiveHltvEvents(referenceDate: Date = new Date()): HltvEvent[] {
  const now = referenceDate.getTime();

  // Filter out any event whose endDate has passed!
  // Sapo përfundon një tournament, hiqet automatikisht nga lista aktive!
  const activeAndUpcoming = SCHEDULED_TOURNAMENTS.filter(item => {
    const end = new Date(item.endDate).getTime();
    return now <= end;
  });

  // Map to HltvEvent format with dynamic countdown and status
  return activeAndUpcoming.map(item => {
    const start = new Date(item.startDate).getTime();
    const end = new Date(item.endDate).getTime();

    // Check if tournament is currently playing live
    if (now >= start && now <= end) {
      return {
        id: item.id,
        name: item.name,
        subtitle: item.liveMatchDescription || 'Match Live',
        ribbon: {
          text: 'LIVE',
          color: 'bg-[#C9252D]'
        },
        logoType: item.logoType,
        status: 'live',
        tournamentId: item.tournamentId
      };
    }

    // Otherwise it is upcoming: calculate days left
    const diffMs = start - now;
    const daysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const hoursLeft = Math.ceil(diffMs / (1000 * 60 * 60));

    let daysText = `${daysLeft} days`;
    if (daysLeft === 1) {
      daysText = hoursLeft <= 12 ? `Starts in ${hoursLeft}h` : 'Tomorrow';
    }

    return {
      id: item.id,
      name: item.name,
      daysText,
      logoType: item.logoType,
      status: 'upcoming',
      tournamentId: item.tournamentId
    };
  });
}

/**
 * Returns the currently active or imminent premier tournament.
 */
export function getCurrentFeaturedEvent(referenceDate: Date = new Date()): ScheduledCircuitEvent {
  const activeEvents = getActiveHltvEvents(referenceDate);
  if (activeEvents.length === 0) {
    return SCHEDULED_TOURNAMENTS[1]; // Fallback to BLAST Rivals
  }

  const firstLive = activeEvents.find(e => e.status === 'live');
  const targetId = firstLive ? firstLive.id : activeEvents[0].id;

  const found = SCHEDULED_TOURNAMENTS.find(t => t.id === targetId);
  return found || SCHEDULED_TOURNAMENTS[1];
}

/**
 * Returns archived/completed tournaments for historic records.
 */
export function getCompletedTournaments(referenceDate: Date = new Date()): ScheduledCircuitEvent[] {
  const now = referenceDate.getTime();
  return SCHEDULED_TOURNAMENTS.filter(item => {
    const end = new Date(item.endDate).getTime();
    return now > end;
  });
}
