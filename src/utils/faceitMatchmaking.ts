import { FaceitMatchPlayer, FaceitStatsRow } from '../components/vortex/VortexMatchRoom';

export interface BalancedMatchTeam {
  name: string;
  tag?: string;
  avgElo: number;
  avgLevel: number;
  players: FaceitMatchPlayer[];
  statsRows: FaceitStatsRow[];
  stackType: string;
}

export interface BalancedMatch {
  matchId: string;
  id?: string;
  team1: BalancedMatchTeam;
  team2: BalancedMatchTeam;
  winProbabilityTeam1: number;
  winProbabilityTeam2: number;
  eloGainWin: number;
  eloLossDefeat: number;
  eloDiff: number;
  map: string;
  server: string;
  serverIp: string;
  isFiveStack: boolean;
  partySize: number;
}

export const getFaceitLevelFromElo = (elo: number): number => {
  if (elo >= 2001) return 10;
  if (elo >= 1751) return 9;
  if (elo >= 1531) return 8;
  if (elo >= 1351) return 7;
  if (elo >= 1201) return 6;
  if (elo >= 1051) return 5;
  if (elo >= 901) return 4;
  if (elo >= 751) return 3;
  if (elo >= 501) return 2;
  return 1;
};

// Standard FACEIT ELO Win Probability Formula
export const calculateEloWinProbability = (team1Elo: number, team2Elo: number) => {
  const diff = team2Elo - team1Elo;
  const p1 = 1 / (1 + Math.pow(10, diff / 400));
  const p2 = 1 - p1;

  const winProb1 = Math.round(p1 * 100);
  const winProb2 = 100 - winProb1;

  // Real FACEIT stakes: base 25, slight adjustment for minor difference (24-26)
  const eloGain1 = Math.max(20, Math.min(30, Math.round(50 * (1 - p1))));
  const eloLoss1 = eloGain1;

  return {
    winProb1,
    winProb2,
    eloGain1,
    eloLoss1,
    eloGain2: 50 - eloGain1,
    eloLoss2: 50 - eloGain1,
  };
};

interface CandidatePlayer {
  name: string;
  code: string;
  countryName: string;
  avatar: string;
}

// Curated European FACEIT player pool (Balkans, Nordics, Central Europe)
const EUROPEAN_CANDIDATES: CandidatePlayer[] = [
  { name: 'Kovac_CS', code: 'XK', countryName: 'Kosovo', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80' },
  { name: 'balkan_fury', code: 'AL', countryName: 'Albania', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  { name: 'shroud_al', code: 'XK', countryName: 'Kosovo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { name: 'nordic_aim', code: 'SE', countryName: 'Sweden', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { name: 'phantom_clutch', code: 'DE', countryName: 'Germany', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
  { name: 'z1mmy_fr', code: 'FR', countryName: 'France', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { name: 'nascar_pl', code: 'PL', countryName: 'Poland', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' },
  { name: 'd1on_ua', code: 'UA', countryName: 'Ukraine', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
  { name: 'stonk3n', code: 'SE', countryName: 'Sweden', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
  { name: 'blitz_fi', code: 'FI', countryName: 'Finland', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80' },
  { name: 'hyper_nl', code: 'NL', countryName: 'Netherlands', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
  { name: 'matrix_dk', code: 'DK', countryName: 'Denmark', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80' },
  { name: 'prishtina_kr', code: 'XK', countryName: 'Kosovo', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80' },
  { name: 'tirana_hawk', code: 'AL', countryName: 'Albania', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80' },
];

export interface PartyInputMember {
  id: string;
  name: string;
  tag?: string;
  avatar: string;
  level?: number;
  elo?: number;
  code?: string;
  countryName?: string;
  isLeader?: boolean;
  matches?: number;
}

export interface MatchmakingParams {
  partyMembers: PartyInputMember[];
  userGamerTag: string;
  userAvatar?: string;
  userElo: number;
  userLevel: number;
  userClanTag?: string;
  userCountry?: { code: string; name: string };
  mapName?: string;
}

/**
 * FACEIT-AUTHENTIC BALANCED 5V5 MATCHMAKER
 * Guarantees:
 * 1. Strict ELO balance (Team 1 Avg vs Team 2 Avg within ±4 ELO).
 * 2. 50% vs 50% Win Probability (Fair match, no 100% winner team).
 * 3. Never matches Level 1-3 stacks with Level 10 stacks (Skill bracket strict matching).
 * 4. Puts all active party members (Solo up to 5-Stack) onto Team 1.
 * 5. Matches 5-stacks with opponent 5-stacks or equivalent team rosters.
 */
export const generateBalancedMatch = (params: MatchmakingParams): BalancedMatch => {
  const {
    partyMembers,
    userGamerTag,
    userAvatar = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
    userElo,
    userLevel,
    userClanTag = 'M14',
    userCountry = { code: 'XK', name: 'Kosovo' },
    mapName = 'Anubis'
  } = params;

  // 1. Gather all party members; ensure current user is included
  const activeParty: PartyInputMember[] = partyMembers.length > 0
    ? [...partyMembers]
    : [{
        id: 'user-current',
        name: userGamerTag,
        tag: userClanTag,
        avatar: userAvatar,
        elo: userElo,
        level: userLevel,
        code: userCountry.code,
        countryName: userCountry.name,
        isLeader: true,
        matches: 34
      }];

  const partySize = Math.min(5, activeParty.length);
  const isFiveStack = partySize === 5;

  // 2. Calculate party average ELO & Level baseline
  const partyEloSum = activeParty.reduce((sum, p) => sum + (p.elo || userElo), 0);
  const partyAvgElo = Math.round(partyEloSum / partySize);

  // 3. Complete Team 1 (if party < 5, fill with balanced teammates around partyAvgElo)
  const team1Players: FaceitMatchPlayer[] = [];
  const team1EloTarget = partyAvgElo;

  // Add party members first
  activeParty.slice(0, 5).forEach((pm, idx) => {
    const pElo = pm.elo || userElo;
    const pLevel = pm.level || getFaceitLevelFromElo(pElo);
    const isUser = pm.name === userGamerTag;

    team1Players.push({
      id: `t1-p${idx + 1}`,
      name: pm.name,
      avatar: pm.avatar || userAvatar,
      level: pLevel,
      elo: pElo,
      code: pm.code || userCountry.code,
      countryName: pm.countryName || userCountry.name,
      isCaptain: idx === 0 || pm.isLeader,
      hasPriority: isUser || idx === 0,
      verified: true,
      matches: pm.matches || (isUser ? 38 : Math.floor(Math.random() * 200) + 120),
      winRate: `${Math.floor(Math.random() * 6) + 48}%`,
      recentResults: ['W', 'W', 'L', 'W', Math.random() > 0.4 ? 'W' : 'L'],
      rating: (1.05 + Math.random() * 0.15).toFixed(2),
      swing: '+0.42%',
      isPositiveSwing: true,
      kda: '16/14/5',
      kd: (0.95 + Math.random() * 0.2).toFixed(2),
      kr: (0.68 + Math.random() * 0.14).toFixed(2),
      adr: (76 + Math.random() * 12).toFixed(1),
      badgeIndex: 1,
      partyShape: partySize > 1 ? 'circle' : undefined,
    });
  });

  // Fill remaining slots in Team 1
  const neededTeammates = 5 - team1Players.length;
  for (let i = 0; i < neededTeammates; i++) {
    const cand = EUROPEAN_CANDIDATES[i % EUROPEAN_CANDIDATES.length];
    // Slightly jitter ELO around target (±15) to keep it realistic and tight
    const jitter = ((i % 2 === 0 ? 1 : -1) * (10 + (i * 5)));
    const tmElo = Math.max(100, team1EloTarget + jitter);
    const tmLevel = getFaceitLevelFromElo(tmElo);

    team1Players.push({
      id: `t1-filler-${i + 1}`,
      name: cand.name,
      avatar: cand.avatar,
      level: tmLevel,
      elo: tmElo,
      code: cand.code,
      countryName: cand.countryName,
      isCaptain: false,
      hasPriority: false,
      verified: true,
      matches: Math.floor(Math.random() * 400) + 150,
      winRate: `${Math.floor(Math.random() * 5) + 49}%`,
      recentResults: ['W', 'L', 'W', 'W', 'L'],
      rating: (1.02 + Math.random() * 0.14).toFixed(2),
      swing: '-0.15%',
      isPositiveSwing: false,
      kda: '15/15/4',
      kd: (0.92 + Math.random() * 0.2).toFixed(2),
      kr: (0.66 + Math.random() * 0.12).toFixed(2),
      adr: (74 + Math.random() * 10).toFixed(1),
      badgeIndex: 1,
      partyShape: undefined, // Solo filler
    });
  }

  // Calculate exact Team 1 Average ELO
  const team1AvgElo = Math.round(team1Players.reduce((s, p) => s + p.elo, 0) / 5);
  const team1AvgLevel = getFaceitLevelFromElo(team1AvgElo);

  // 4. Generate Team 2 Opponents so that Team 2 Average ELO ≈ Team 1 Average ELO
  // Delta target is ±1 to ±4 ELO, creating an exact ~50% / 50% Win Rate!
  const team2Players: FaceitMatchPlayer[] = [];
  const opponentCandidates = EUROPEAN_CANDIDATES.slice(neededTeammates);
  const oppJitters = [ -8, +14, -12, +10, -5 ]; // Sum is -1, meaning almost identical average!

  for (let i = 0; i < 5; i++) {
    const cand = opponentCandidates[i % opponentCandidates.length] || EUROPEAN_CANDIDATES[i];
    const oppElo = Math.max(100, team1AvgElo + oppJitters[i]);
    const oppLevel = getFaceitLevelFromElo(oppElo);

    team2Players.push({
      id: `t2-p${i + 1}`,
      name: cand.name,
      avatar: cand.avatar,
      level: oppLevel,
      elo: oppElo,
      code: cand.code,
      countryName: cand.countryName,
      isCaptain: i === 0,
      hasPriority: i === 0,
      verified: true,
      matches: Math.floor(Math.random() * 350) + 180,
      winRate: `${Math.floor(Math.random() * 5) + 49}%`,
      recentResults: ['L', 'W', 'W', 'L', 'W'],
      rating: (1.06 + Math.random() * 0.14).toFixed(2),
      swing: '+0.18%',
      isPositiveSwing: true,
      kda: '16/15/5',
      kd: (0.98 + Math.random() * 0.18).toFixed(2),
      kr: (0.71 + Math.random() * 0.12).toFixed(2),
      adr: (78 + Math.random() * 10).toFixed(1),
      badgeIndex: 1,
      partyShape: isFiveStack ? 'square' : (i < 2 ? 'diamond' : undefined),
    });
  }

  const team2AvgElo = Math.round(team2Players.reduce((s, p) => s + p.elo, 0) / 5);
  const team2AvgLevel = getFaceitLevelFromElo(team2AvgElo);

  // 5. Calculate 50% vs 50% Win Probability
  const { winProb1, winProb2, eloGain1, eloLoss1 } = calculateEloWinProbability(team1AvgElo, team2AvgElo);
  const eloDiff = Math.abs(team1AvgElo - team2AvgElo);

  // 6. Generate detailed Stats Rows for all 10 players
  const generateStatsRow = (player: FaceitMatchPlayer, team: 'team1' | 'team2', isMvp: boolean): FaceitStatsRow => {
    const k = Math.floor(Math.random() * 8) + 14; // 14 - 21
    const d = Math.floor(Math.random() * 6) + 12; // 12 - 17
    const a = Math.floor(Math.random() * 5) + 2;  // 2 - 6
    const kdVal = (k / Math.max(1, d)).toFixed(2);
    const adrVal = (k * 4.4 + Math.random() * 10).toFixed(1);

    return {
      id: `stat-${player.id}`,
      name: player.name,
      avatar: player.avatar,
      code: player.code,
      countryName: player.countryName,
      rankLevel: player.level,
      rankElo: player.elo,
      rating: player.rating,
      ratingScore: parseFloat(player.rating),
      isMvp,
      team,
      partyShape: player.partyShape,
      hasPriority: player.hasPriority,
      swing: player.swing,
      isPositiveSwing: !!player.isPositiveSwing,
      k,
      d,
      a,
      adr: adrVal,
      kd: kdVal,
      kr: (k / 20).toFixed(2),
      hs: Math.floor(k * 0.48),
      hsRate: `${Math.floor(Math.random() * 12) + 44}%`,
      k5: 0,
      k4: Math.random() > 0.7 ? 1 : 0,
      k3: Math.floor(Math.random() * 3),
      k2: Math.floor(Math.random() * 4) + 1,
      mvps: isMvp ? 4 : Math.floor(Math.random() * 3),
      rws: (parseFloat(kdVal) * 9.5).toFixed(2),
      crosshairCode: 'CSGO-3k8qX-aB27v-85Yw3-2k9F8-3kK8A',
      kast: `${Math.floor(Math.random() * 12) + 68}%`,
      acc: '21.4%',
      sAcc: '41.8%',
      shots: 260,
      hits: 58,
      mk: 4,
      mkRate: '22%',
      rp: 18,
      rs: 8,
      entryAttempts: 3,
      entryKills: 2,
      entryDeaths: 1,
      entryDiff: 1,
      entryAttemptsRate: '15%',
      entrySuccessRate: '66.7%',
      tradeKills: 3,
      deathsTraded: 4,
      tradedEntryKills: 1,
      tradedEntryDeaths: 1,
      clutchWins: 2,
      clutchRoundsLost: 1,
      clutchSuccess: '66.7%',
      c1v5: 0,
      c1v4: 0,
      c1v3: Math.random() > 0.8 ? 1 : 0,
      c1v2: 1,
      c1v1: 2
    };
  };

  const team1StatsRows = team1Players.map((p, idx) => generateStatsRow(p, 'team1', idx === 0));
  const team2StatsRows = team2Players.map((p, idx) => generateStatsRow(p, 'team2', idx === 0));

  // Stack Type descriptions
  let stack1Desc = 'Solo Queue';
  if (isFiveStack) stack1Desc = `5-Stack Clan Team [${userClanTag || 'CC'}]`;
  else if (partySize === 4) stack1Desc = '4-Stack + 1 Solo';
  else if (partySize === 3) stack1Desc = '3-Stack + 2 Solos';
  else if (partySize === 2) stack1Desc = 'Duo Stack + 3 Solos';

  const stack2Desc = isFiveStack ? '5-Stack Clan Opponents' : (partySize > 1 ? `${partySize}-Stack Matching Opponents` : 'Solo / Duo Queue');

  const team1Name = userClanTag ? `team_${userClanTag}` : `team_${userGamerTag.split(' ')[0]}`;
  const team2Name = `team_${team2Players[0].name.split('_')[0]}`;

  return {
    matchId: 'CC-89421',
    id: 'CC-89421',
    team1: {
      name: team1Name,
      tag: userClanTag,
      avgElo: team1AvgElo,
      avgLevel: team1AvgLevel,
      players: team1Players,
      statsRows: team1StatsRows,
      stackType: stack1Desc
    },
    team2: {
      name: team2Name,
      avgElo: team2AvgElo,
      avgLevel: team2AvgLevel,
      players: team2Players,
      statsRows: team2StatsRows,
      stackType: stack2Desc
    },
    winProbabilityTeam1: winProb1,
    winProbabilityTeam2: winProb2,
    eloGainWin: eloGain1,
    eloLossDefeat: eloLoss1,
    eloDiff,
    map: mapName,
    server: 'Frankfurt Central (24ms) • CS2 Sub-Tick MatchZy',
    serverIp: 'srv1.caliberclutch.gg:27015',
    isFiveStack,
    partySize
  };
};
