export type GameId = 'cs2' | 'valorant' | 'lol' | 'apex' | 'rocket_league' | 'dota2';

export interface GameInfo {
  id: GameId;
  name: string;
  tagline: string;
  banner: string;
  icon: string;
  playerCount: string;
  color: string;
  roles: string[];
}

export type TournamentStatus = 'registration' | 'live' | 'upcoming' | 'completed';

export interface TournamentMatch {
  id: string;
  round: string;
  roundNumber: number;
  teamA: {
    id: string;
    name: string;
    tag: string;
    logo: string;
    score?: number;
    seed: number;
    winner?: boolean;
  };
  teamB: {
    id: string;
    name: string;
    tag: string;
    logo: string;
    score?: number;
    seed: number;
    winner?: boolean;
  };
  time: string;
  status: 'live' | 'upcoming' | 'finished';
  streamUrl?: string;
}

export interface Tournament {
  id: string;
  title: string;
  gameId: GameId;
  gameName: string;
  prizePool: number;
  prizeCoins: number;
  entryFee: number;
  status: TournamentStatus;
  maxTeams: number;
  registeredTeamsCount: number;
  format: string;
  region: string;
  startDate: string;
  banner: string;
  isProOnly?: boolean;
  organizer: {
    name: string;
    verified: boolean;
    avatar: string;
  };
  rules: string[];
  matches: TournamentMatch[];
  isRegistered?: boolean;
}

export type ScrimTier = 'Tier 1 (Semi-Pro)' | 'Tier 2 (High Elo)' | 'Tier 3 (Open / Amateur)';
export type ScrimFormat = 'BO1' | 'BO3' | 'BO5';

export interface ScrimLobby {
  id: string;
  gameId: GameId;
  title: string;
  hostTeam: {
    id: string;
    name: string;
    tag: string;
    logo: string;
    rating: number;
    winStreak: number;
  };
  challengerTeam?: {
    id: string;
    name: string;
    tag: string;
    logo: string;
    rating: number;
  };
  tier: ScrimTier;
  format: ScrimFormat;
  region: string;
  maps: string[];
  serverLocation: string;
  antiCheatRequired: boolean;
  scheduledTime: string;
  status: 'waiting' | 'ready' | 'live' | 'completed';
  createdAt: string;
}

export type LFTStatus = 'actively_looking' | 'open_to_offers' | 'signed_team';
export type MembershipTier = 'free' | 'pro' | 'elite';

export interface EloHistoryPoint {
  id: string;
  date: string;
  elo: number;
  change: number; // e.g. +26 or -18
  gameId: GameId;
  map: string;
  result: 'win' | 'loss';
  opponent: string;
}

export interface ConnectedService {
  provider: 'faceit' | 'riot' | 'steam';
  name: string;
  accountName: string;
  connected: boolean;
  verifiedElo: number;
  rankBadge: string;
  lastSynced: string;
  icon: string;
}

export interface GameStat {
  gameId: GameId;
  rankName: string;
  rankTierIcon: string;
  rankTierNumber?: number;
  mmr: number;
  winRate: number;
  kdRatio: number;
  matchesPlayed: number;
  favoriteRole: string;
  verifiedAccount: boolean;
}

export interface GamerPassport {
  id: string;
  gamerTag: string;
  realName: string;
  avatar: string;
  country: string;
  countryFlag: string;
  bio: string;
  level: number;
  membershipTier: MembershipTier;
  caliberRating?: number;
  nexusRating?: number;
  lftStatus: LFTStatus;
  primaryGame: GameId;
  primaryRole: string;
  secondaryRole?: string;
  stats: GameStat[];
  eloHistory: EloHistoryPoint[];
  connectedServices: ConnectedService[];
  badges: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
  }[];
  hardwareSpecs: {
    mouse: string;
    keyboard: string;
    headset: string;
    monitorHz: string;
    crosshairCode?: string;
  };
  socials: {
    discord?: string;
    steam?: string;
    steamTradeUrl?: string;
    twitch?: string;
    riotId?: string;
    twitter?: string;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  gameId: GameId;
  gameName: string;
  type: 'daily' | 'weekly' | 'bounty';
  progress: number;
  maxProgress: number;
  unit: string;
  rewardXp: number;
  rewardCoins: number;
  isCompleted: boolean;
  isClaimed: boolean;
  expiresIn: string;
}

export interface ShopItem {
  id: string;
  title: string;
  category: 'game_skin' | 'currency' | 'hardware' | 'coaching';
  priceCoins: number;
  gameId?: GameId;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  inStock: boolean;
  description: string;
  tag: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'match' | 'tournament' | 'bounty' | 'scrim' | 'pro' | 'shop' | 'passport';
  read: boolean;
}

export interface CoinPackage {
  id: string;
  coins: number;
  bonusCoins: number;
  priceUsd: number;
  badge?: string;
  popular?: boolean;
}

export interface MatchAnalysis {
  matchId: string;
  game: string;
  map: string;
  result: 'VICTORY' | 'DEFEAT';
  score: string;
  duration: string;
  date: string;
  overallRating: number;
  aimScore: number;
  crosshairPlacementPct: number;
  firstBulletAccuracyPct: number;
  headshotPct: number;
  clutchEfficiencyPct: number;
  utilityDamage: number;
  insights: {
    type: 'positive' | 'warning' | 'tip';
    title: string;
    desc: string;
  }[];
}
