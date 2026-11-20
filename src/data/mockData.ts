import { 
  GameInfo, 
  Tournament, 
  ScrimLobby, 
  GamerPassport, 
  Quest, 
  ShopItem, 
  NotificationItem, 
  CoinPackage,
  MatchAnalysis,
  EloHistoryPoint,
  ConnectedService 
} from '../types/esports';

export const SUPPORTED_GAMES: GameInfo[] = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    tagline: 'Precision tactical 5v5 shooter',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    icon: '🎯',
    playerCount: '1.4M Active',
    color: '#EAB308',
    roles: ['AWPer', 'Entry Fragger', 'In-Game Leader (IGL)', 'Support / Anchor', 'Lurker']
  },
  {
    id: 'valorant',
    name: 'VALORANT',
    tagline: '5v5 character-based tactical shooter',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    icon: '⚔️',
    playerCount: '2.1M Active',
    color: '#EF4444',
    roles: ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flex']
  },
  {
    id: 'lol',
    name: 'League of Legends',
    tagline: 'Legendary 5v5 MOBA strategy',
    banner: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1200&auto=format&fit=crop',
    icon: '🔮',
    playerCount: '3.8M Active',
    color: '#FF5500',
    roles: ['Top Laner', 'Jungler', 'Mid Laner', 'ADC / Bot Carry', 'Support']
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    tagline: 'High-octane hero battle royale',
    banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
    icon: '🛡️',
    playerCount: '850K Active',
    color: '#A855F7',
    roles: ['Fragger / Entry', 'Scout / Recon', 'Anchor / Defensive', 'IGL']
  },
  {
    id: 'rocket_league',
    name: 'Rocket League',
    tagline: 'Vehicular soccer adrenaline',
    banner: 'https://images.unsplash.com/photo-1612287232204-716b12f6f345?q=80&w=1200&auto=format&fit=crop',
    icon: '🚀',
    playerCount: '620K Active',
    color: '#3B82F6',
    roles: ['Striker', 'First Man', 'Second Man', 'Third Man / Goalkeeper']
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    tagline: 'Complex competitive strategy & macro',
    banner: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop',
    icon: '👑',
    playerCount: '780K Active',
    color: '#F97316',
    roles: ['Hard Carry (Pos 1)', 'Mid (Pos 2)', 'Offlaner (Pos 3)', 'Soft Support (Pos 4)', 'Hard Support (Pos 5)']
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  // CS2 TOURNAMENTS
  {
    id: 'tourney-1',
    title: 'BLAST Rivals 2026 Season 2',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    prizePool: 1000000,
    prizeCoins: 200000,
    entryFee: 0,
    status: 'upcoming',
    maxTeams: 8,
    registeredTeamsCount: 8,
    format: 'GSL Group Stage + Single Elimination BO3 (BO5 Grand Finals)',
    region: 'Hong Kong (AsiaWorld-Arena)',
    startDate: 'Nov 11th - Nov 15th 2026 (Starts in 3 Days)',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    organizer: {
      name: 'BLAST Premier & HLTV Verified',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=blast_rivals_hk'
    },
    rules: [
      'Official Valve MR12 CS2 Competitive Ruleset',
      'BLAST Premier S-Tier Regulations & FACEIT Client Anti-Cheat',
      'Dual GSL Groups: Top 3 advance to Arena Playoffs',
      'Grand Finals: Best-of-5 with full map veto sequence'
    ],
    matches: [
      // Group A Opening Matches
      {
        id: 'br-m1',
        round: 'Group A - Opening',
        roundNumber: 1,
        teamA: { id: 't-leg', name: 'Legacy', tag: 'Legacy', logo: '/images/teams/legacy.svg', seed: 12 },
        teamB: { id: 't-fur', name: 'FURIA', tag: 'FURIA', logo: '/images/teams/furia.svg', seed: 1 },
        time: '03:00 Wednesday BO3',
        status: 'upcoming',
        streamUrl: 'https://www.hltv.org/events/8320/blast-rivals-2026-season-2'
      },
      {
        id: 'br-m2',
        round: 'Group A - Opening',
        roundNumber: 1,
        teamA: { id: 't-vit', name: 'Vitality', tag: 'Vitality', logo: '/images/teams/vitality.svg', seed: 2 },
        teamB: { id: 't-fal', name: 'Falcons', tag: 'Falcons', logo: '/images/teams/falcons.svg', seed: 6 },
        time: '05:30 Wednesday BO3',
        status: 'upcoming',
        streamUrl: 'https://www.hltv.org/events/8320/blast-rivals-2026-season-2'
      },
      // Group B Opening Matches
      {
        id: 'br-m3',
        round: 'Group B - Opening',
        roundNumber: 1,
        teamA: { id: 't-spirit', name: 'Spirit', tag: 'Spirit', logo: '/images/teams/spirit.svg', seed: 3 },
        teamB: { id: 't-fut', name: 'FUT', tag: 'FUT', logo: '/images/teams/fut.svg', seed: 8 },
        time: '08:00 Wednesday BO3',
        status: 'upcoming',
        streamUrl: 'https://www.hltv.org/events/8320/blast-rivals-2026-season-2'
      },
      {
        id: 'br-m4',
        round: 'Group B - Opening',
        roundNumber: 1,
        teamA: { id: 't-mouz', name: 'MOUZ', tag: 'MOUZ', logo: '/images/teams/mouz.svg', seed: 4 },
        teamB: { id: 't-g2', name: 'G2', tag: 'G2', logo: '/images/teams/g2.svg', seed: 11 },
        time: '10:30 Wednesday BO3',
        status: 'upcoming',
        streamUrl: 'https://www.hltv.org/events/8320/blast-rivals-2026-season-2'
      }
    ]
  },
  {
    id: 'tourney-beijing-archive',
    title: 'Intel Extreme Masters Beijing 2026',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    prizePool: 1250000,
    prizeCoins: 250000,
    entryFee: 0,
    status: 'completed',
    maxTeams: 16,
    registeredTeamsCount: 16,
    format: '5v5 Single Elimination BO3 (BO5 Grand Finals)',
    region: 'Beijing, China (Wukesong Arena)',
    startDate: 'Nov 2 - Nov 8, 2026 (Completed)',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    organizer: {
      name: 'ESL Pro Tour & HLTV Verified',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=iem_beijing'
    },
    rules: [
      'Official Valve MR12 CS2 Competitive Ruleset',
      'ESL Pro Tour S-Tier Regulations',
      'Champion: The MongolZ ($360,000 + EPT Trophy)'
    ],
    matches: [
      {
        id: 'gf-beijing',
        round: 'Grand Finals',
        roundNumber: 3,
        teamA: { id: 't-mglz', name: 'The MongolZ', tag: 'MGLZ', logo: '/images/teams/mongolz.svg', score: 3, seed: 1, winner: true },
        teamB: { id: 't-mouz', name: 'MOUZ', tag: 'MOUZ', logo: '/images/teams/mouz.svg', score: 2, seed: 2, winner: false },
        time: 'Ended (3-2) • The MongolZ Champions',
        status: 'finished'
      }
    ]
  },
  {
    id: 'tourney-pro-special',
    title: 'VORTEX Pro Elite Weekly Cup (PRO Only)',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    prizePool: 10000,
    prizeCoins: 25000,
    entryFee: 0,
    status: 'registration',
    maxTeams: 8,
    registeredTeamsCount: 5,
    format: '5v5 Double Elimination BO3',
    region: 'Europe Pro Realm',
    startDate: 'Friday, 20:00 CET',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    isProOnly: true,
    organizer: {
      name: 'VORTEX Pro Tier Circuit',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vortex_pro'
    },
    rules: [
      'VORTEX PRO or ELITE Membership Required for Squad Leader',
      'Instant $10,000 cash prize distributed same-day with 0% fee',
      'Exclusive CS2 Sub-Tick private European servers'
    ],
    matches: [],
    isRegistered: false
  },
  {
    id: 'tourney-cs2-faceit-cup',
    title: 'Faceit Level 10 Global Masters Championship',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    prizePool: 15000,
    prizeCoins: 35000,
    entryFee: 0,
    status: 'registration',
    maxTeams: 32,
    registeredTeamsCount: 24,
    format: '5v5 Single Elimination BO1 + Finals BO3',
    region: 'Global / EU West (Frankfurt/London)',
    startDate: 'Sunday, 17:00 CET',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    organizer: {
      name: 'Faceit Global Masters Hub',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=global_hub'
    },
    rules: [
      'Minimum Faceit Elo: 2,000+ required',
      'Official Valve Active Duty Maps: Mirage, Nuke, Inferno, Dust 2'
    ],
    matches: [],
    isRegistered: false
  },

  // VALORANT TOURNAMENTS
  {
    id: 'tourney-2',
    title: 'Radiant Masters Valorant Invitational',
    gameId: 'valorant',
    gameName: 'VALORANT',
    prizePool: 25000,
    prizeCoins: 65000,
    entryFee: 0,
    status: 'live',
    maxTeams: 16,
    registeredTeamsCount: 16,
    format: '5v5 Double Elimination BO3',
    region: 'Europe (London / Paris)',
    startDate: 'Tomorrow, 18:00 CET',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    organizer: {
      name: 'Riot Games Partnered Circuit',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=riot_circuit'
    },
    rules: [
      'Standard Competitive Valorant standard maps',
      'Agents: All released agents available except those disabled by Riot',
      'Riot Vanguard active required for all 5 players'
    ],
    matches: [
      {
        id: 'v1',
        round: 'Semifinals',
        roundNumber: 1,
        teamA: { id: 'vt1', name: 'Fnatic Challengers', tag: 'FNC.C', logo: '🦊', score: 2, seed: 1, winner: true },
        teamB: { id: 'vt2', name: 'Karmine Corp Blue', tag: 'KCB', logo: '💙', score: 1, seed: 4, winner: false },
        time: 'Ended',
        status: 'finished'
      },
      {
        id: 'v2',
        round: 'Semifinals',
        roundNumber: 1,
        teamA: { id: 'vt3', name: 'Sentinels Nova', tag: 'SEN.N', logo: '⚡', score: 2, seed: 2, winner: true },
        teamB: { id: 'vt4', name: 'Paper Rex Prodigy', tag: 'PRX.P', logo: '🦖', score: 0, seed: 3, winner: false },
        time: 'Ended',
        status: 'finished'
      },
      {
        id: 'v3',
        round: 'Grand Finals',
        roundNumber: 2,
        teamA: { id: 'vt1', name: 'Fnatic Challengers', tag: 'FNC.C', logo: '🦊', score: 0, seed: 1 },
        teamB: { id: 'vt3', name: 'Sentinels Nova', tag: 'SEN.N', logo: '⚡', score: 0, seed: 2 },
        time: 'Starts in 45m',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'tourney-val-open',
    title: 'VCL Europe Contenders Open Qualifier',
    gameId: 'valorant',
    gameName: 'VALORANT',
    prizePool: 12000,
    prizeCoins: 35000,
    entryFee: 0,
    status: 'registration',
    maxTeams: 32,
    registeredTeamsCount: 26,
    format: '5v5 Tournament Mode BO3',
    region: 'EU West (Frankfurt/Paris)',
    startDate: 'Saturday, Nov 15 - 18:00 CET',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    organizer: {
      name: 'VALORANT Champions Tour EU',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vct_eu'
    },
    rules: [
      'Rank requirement: Immortal 1 or higher',
      'Map Pool: Haven, Ascent, Sunset, Lotus, Bind, Split, Abyss'
    ],
    matches: [],
    isRegistered: false
  },

  // LEAGUE OF LEGENDS TOURNAMENTS
  {
    id: 'tourney-3',
    title: 'Summoner Rift Clash: Europe Open',
    gameId: 'lol',
    gameName: 'League of Legends',
    prizePool: 15000,
    prizeCoins: 40000,
    entryFee: 0,
    status: 'registration',
    maxTeams: 32,
    registeredTeamsCount: 22,
    format: '5v5 Tournament Draft BO3',
    region: 'EU West (Amsterdam)',
    startDate: 'Saturday, Nov 15 - 16:00 CET',
    banner: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1200&auto=format&fit=crop',
    organizer: {
      name: 'VORTEX Gaming Community',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vortex_lol'
    },
    rules: [
      'Tournament Draft Mode on Summoners Rift',
      'Players must be Emerald II or higher on EUW/EUNE',
      'Check-in starts 45 minutes prior to bracket release'
    ],
    matches: [],
    isRegistered: false
  },

  // APEX LEGENDS TOURNAMENTS
  {
    id: 'tourney-4',
    title: 'Apex Legends Global Trios Series',
    gameId: 'apex',
    gameName: 'Apex Legends',
    prizePool: 10000,
    prizeCoins: 30000,
    entryFee: 0,
    status: 'registration',
    maxTeams: 20,
    registeredTeamsCount: 14,
    format: 'Custom Lobby 6 Matches - ALGS Point Matrix',
    region: 'Global / Multi-region',
    startDate: 'Sunday, Nov 16 - 20:00 CET',
    banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
    organizer: {
      name: 'Apex Arena Syndicate',
      verified: false,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=apex_syndicate'
    },
    rules: [
      'ALGS Official Point scoring (Kill points + Placement points)',
      'World’s Edge & Storm Point map rotation'
    ],
    matches: [],
    isRegistered: false
  }
];

export const INITIAL_SCRIMS: ScrimLobby[] = [
  // CS2 SCRIMS
  {
    id: 'scrim-101',
    gameId: 'cs2',
    title: 'Tier 1 Pro Scrim (2800+ Elo / ESEA Main+)',
    hostTeam: {
      id: 'team-alpha',
      name: 'Apeks Rebel Roster',
      tag: 'APEKS',
      logo: '🦍',
      rating: 2840,
      winStreak: 6
    },
    tier: 'Tier 1 (Semi-Pro)',
    format: 'BO3',
    region: 'EU Central (Frankfurt Sub-Tick)',
    maps: ['Mirage', 'Ancient', 'Nuke', 'Inferno', 'Dust II'],
    serverLocation: 'VORTEX Dedicated Frankfurt #04',
    antiCheatRequired: true,
    scheduledTime: 'Now - Looking for challenger',
    status: 'waiting',
    createdAt: '12 min ago'
  },
  {
    id: 'scrim-104',
    gameId: 'cs2',
    title: 'Faceit Level 10 5v5 Scrim (Friendly / No Toxic)',
    hostTeam: {
      id: 'team-delta',
      name: 'Ghost Division EU',
      tag: 'GHOST',
      logo: '👻',
      rating: 2120,
      winStreak: 1
    },
    tier: 'Tier 2 (High Elo)',
    format: 'BO1',
    region: 'EU East (Warsaw)',
    maps: ['Inferno', 'Overpass', 'Anubis'],
    serverLocation: 'VORTEX Dedicated Warsaw #12',
    antiCheatRequired: true,
    scheduledTime: 'Instant / Ready Now',
    status: 'waiting',
    createdAt: '5 min ago'
  },
  {
    id: 'scrim-cs2-mouz',
    gameId: 'cs2',
    title: 'MOUZ NXT Talent Practice Series',
    hostTeam: {
      id: 'team-mouz',
      name: 'MOUZ NXT Academy',
      tag: 'MOUZ',
      logo: '🐭',
      rating: 2750,
      winStreak: 5
    },
    tier: 'Tier 1 (Semi-Pro)',
    format: 'BO3',
    region: 'EU Central (Frankfurt Sub-Tick)',
    maps: ['Nuke', 'Mirage', 'Ancient'],
    serverLocation: 'VORTEX Dedicated Frankfurt #09',
    antiCheatRequired: true,
    scheduledTime: 'Starts in 10 mins',
    status: 'waiting',
    createdAt: '8 min ago'
  },

  // VALORANT SCRIMS
  {
    id: 'scrim-102',
    gameId: 'valorant',
    title: 'Radiant / Immortal 3 Pracc (VCL Qualifiers Prep)',
    hostTeam: {
      id: 'team-bravo',
      name: 'Team Solary Prime',
      tag: 'SLY',
      logo: '☀️',
      rating: 2680,
      winStreak: 4
    },
    tier: 'Tier 1 (Semi-Pro)',
    format: 'BO3',
    region: 'EU West (Paris Sub-Tick)',
    maps: ['Haven', 'Ascent', 'Sunset', 'Abyss', 'Lotus'],
    serverLocation: 'Riot Custom Lobby (Paris)',
    antiCheatRequired: true,
    scheduledTime: 'Starts in 15 mins',
    status: 'waiting',
    createdAt: '25 min ago'
  },
  {
    id: 'scrim-val-kc',
    gameId: 'valorant',
    title: 'Karmine Corp Blue High-Elo Pracc',
    hostTeam: {
      id: 'team-kcb',
      name: 'Karmine Corp Next',
      tag: 'KCB',
      logo: '💙',
      rating: 2590,
      winStreak: 3
    },
    tier: 'Tier 1 (Semi-Pro)',
    format: 'BO3',
    region: 'EU West (Paris)',
    maps: ['Ascent', 'Bind', 'Lotus'],
    serverLocation: 'Riot Custom Paris Server',
    antiCheatRequired: true,
    scheduledTime: 'Now - Ready',
    status: 'waiting',
    createdAt: '18 min ago'
  },

  // LOL SCRIMS
  {
    id: 'scrim-103',
    gameId: 'lol',
    title: 'Master+ Scrimmage BO3 - Competitive Draft',
    hostTeam: {
      id: 'team-charlie',
      name: 'BIG Academy Elite',
      tag: 'BIG.E',
      logo: '🐻',
      rating: 2350,
      winStreak: 2
    },
    tier: 'Tier 2 (High Elo)',
    format: 'BO3',
    region: 'EU West',
    maps: ["Summoner's Rift"],
    serverLocation: 'EUW Custom Tournament Realm',
    antiCheatRequired: true,
    scheduledTime: 'In 30 mins',
    status: 'waiting',
    createdAt: '40 min ago'
  },

  // ROCKET LEAGUE SCRIMS
  {
    id: 'scrim-105',
    gameId: 'rocket_league',
    title: 'Grand Champion 3v3 Scrim Session',
    hostTeam: {
      id: 'team-echo',
      name: 'Velocity Esports RL',
      tag: 'VEL',
      logo: '⚡',
      rating: 1890,
      winStreak: 3
    },
    tier: 'Tier 3 (Open / Amateur)',
    format: 'BO5',
    region: 'Europe',
    maps: ['DFH Stadium', 'Champions Field', 'Mannfield'],
    serverLocation: 'EU RL Dedicated Private',
    antiCheatRequired: false,
    scheduledTime: 'In 1 hour',
    status: 'waiting',
    createdAt: '1 hour ago'
  }
];

export const INITIAL_ELO_HISTORY: EloHistoryPoint[] = [
  { id: 'eh1', date: 'Sat 7 Nov, 23:29', elo: 1394, change: 11, gameId: 'cs2', map: 'de_mirage', result: 'win', opponent: 'Faceit Matchmaking' },
  { id: 'eh2', date: 'Sat 7 Nov, 22:48', elo: 1383, change: 13, gameId: 'cs2', map: 'de_anubis', result: 'win', opponent: 'Faceit Matchmaking' },
  { id: 'eh3', date: 'Sat 7 Nov, 21:59', elo: 1370, change: 11, gameId: 'cs2', map: 'de_dust2', result: 'win', opponent: 'Faceit Matchmaking' },
  { id: 'eh4', date: 'Sat 7 Nov, 21:09', elo: 1359, change: -24, gameId: 'cs2', map: 'de_inferno', result: 'loss', opponent: 'Faceit Matchmaking' },
  { id: 'eh5', date: 'Sat 7 Nov, 20:16', elo: 1383, change: -22, gameId: 'cs2', map: 'de_ancient', result: 'loss', opponent: 'Faceit Matchmaking' },
];

export const INITIAL_CONNECTED_SERVICES: ConnectedService[] = [
  {
    provider: 'faceit',
    name: 'FACEIT Pro Network',
    accountName: 'M14',
    connected: true,
    verifiedElo: 1394,
    rankBadge: 'LEVEL 7 (VERIFIED)',
    lastSynced: 'Live Faceit API (Active)',
    icon: '⚡'
  },
  {
    provider: 'riot',
    name: 'Riot Games Vanguard API',
    accountName: 'M14#EUW',
    connected: true,
    verifiedElo: 1394,
    rankBadge: 'DIAMOND III (EU)',
    lastSynced: '1 hour ago (OAuth2)',
    icon: '⚔️'
  },
  {
    provider: 'steam',
    name: 'Valve Steam Web API',
    accountName: '76561198012241163',
    connected: true,
    verifiedElo: 1394,
    rankBadge: 'VAC CLEAN 5Y+',
    lastSynced: 'Today (Automated)',
    icon: '🎮'
  }
];

export const CURRENT_USER_PASSPORT: GamerPassport = {
  id: 'passport-user-01',
  gamerTag: 'M14 | caliberclutch.vercel.app',
  realName: 'M14',
  avatar: 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
  country: 'Kosovo',
  countryFlag: '🇽🇰',
  bio: 'Competitive CS2 Rifler & Faceit Level 7 Player from Ferizaj, Kosovo. In-game: M14. Member since Dec 2019 with 840+ CS2 matches.',
  level: 28,
  membershipTier: 'pro',
  caliberRating: 1394,
  lftStatus: 'actively_looking',
  primaryGame: 'cs2',
  primaryRole: 'Rifler / Entry Fragger',
  secondaryRole: 'Secondary AWPer',
  stats: [
    {
      gameId: 'cs2',
      rankName: 'Faceit Level 7 (1,394 ELO)',
      rankTierIcon: '⚡',
      mmr: 1394,
      winRate: 58.9,
      kdRatio: 0.93,
      matchesPlayed: 843,
      favoriteRole: 'Entry / Rifler',
      verifiedAccount: true
    },
    {
      gameId: 'valorant',
      rankName: 'Ascendant 2 (EU)',
      rankTierIcon: '⚡',
      mmr: 1394,
      winRate: 61.2,
      kdRatio: 1.28,
      matchesPlayed: 215,
      favoriteRole: 'Duelist / Jett',
      verifiedAccount: true
    },
    {
      gameId: 'lol',
      rankName: 'Emerald II',
      rankTierIcon: '💎',
      mmr: 1394,
      winRate: 54.2,
      kdRatio: 2.9,
      matchesPlayed: 140,
      favoriteRole: 'Mid Laner',
      verifiedAccount: true
    }
  ],
  eloHistory: INITIAL_ELO_HISTORY,
  connectedServices: INITIAL_CONNECTED_SERVICES,
  badges: [
    {
      id: 'b1',
      name: 'Faceit Level 7 Verified',
      icon: '⚡',
      color: '#FF5500',
      description: 'Verified 1,394 Faceit CS2 ELO & Anti-Cheat Enforced.'
    },
    {
      id: 'b2',
      name: 'Anti-Cheat Clean 5Y+',
      icon: '🔒',
      color: '#10B981',
      description: 'Zero infractions across Valve VAC and Faceit AC since 2019.'
    },
    {
      id: 'b3',
      name: 'Global CS2 Challenger',
      icon: '🌐',
      color: '#A3E635',
      description: 'Official representative in Global & European CS2 Qualifier brackets.'
    },
    {
      id: 'b4',
      name: 'Clutch Specialist (1v3+)',
      icon: '🔥',
      color: '#EC4899',
      description: 'Over 65 clutch rounds won in competitive matchmaking.'
    }
  ],
  hardwareSpecs: {
    mouse: 'Logitech G PRO X Superlight 2 (400 DPI, 1.6 Sens)',
    keyboard: 'Wooting 60HE Hall Effect (Rapid Trigger 0.15mm)',
    headset: 'HyperX Cloud II Pro + Audio Interface',
    monitorHz: '240Hz Esports Display'
  },
  socials: {
    discord: 'M14',
    steam: 'steamcommunity.com/profiles/76561198012241163',
    riotId: 'M14#EUW',
    twitch: 'twitch.tv/caliberclutch',
    twitter: '@M14_cs'
  }
};

export const SCOUTING_PLAYERS: GamerPassport[] = [
  CURRENT_USER_PASSPORT,
  {
    id: 'passport-scout-03',
    gamerTag: 'SHADOW_KID',
    realName: 'Marko Petrovic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    country: 'Serbia',
    countryFlag: '🇷🇸',
    bio: 'Aggressive Entry Fragger in CS2. High first-bullet accuracy and unshakeable confidence in tight sites.',
    level: 31,
    membershipTier: 'pro',
    caliberRating: 2620,
    lftStatus: 'open_to_offers',
    primaryGame: 'cs2',
    primaryRole: 'Entry Fragger (AK-47 / Galil)',
    secondaryRole: 'Lurker',
    stats: [
      {
        gameId: 'cs2',
        rankName: 'Faceit Level 10 (2,910 ELO)',
        rankTierIcon: '👑',
        mmr: 2620,
        winRate: 66.5,
        kdRatio: 1.48,
        matchesPlayed: 890,
        favoriteRole: 'Entry Fragger',
        verifiedAccount: true
      }
    ],
    eloHistory: [],
    connectedServices: [],
    badges: [
      { id: 'b1', name: 'Faceit 10 Pro', icon: '🛡️', color: '#FF5500', description: 'Verified 2,900+ ELO' },
      { id: 'b3', name: 'Headshot Machine (68%)', icon: '🎯', color: '#EF4444', description: 'Average HS% over 65%' }
    ],
    hardwareSpecs: {
      mouse: 'Finalmouse UltralightX',
      keyboard: 'Wooting 60HE',
      headset: 'Logitech G PRO X 2',
      monitorHz: 'ASUS ROG Swift 360Hz'
    },
    socials: {
      discord: 'ShadowKid#2424',
      steam: 'steamcommunity.com/id/shadow_kid_cs',
      twitter: '@shadowkid_cs'
    }
  },
  {
    id: 'passport-scout-02',
    gamerTag: 'Nyxora',
    realName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    country: 'Sweden',
    countryFlag: '🇸🇪',
    bio: 'Dedicated Controller / Smoke anchor player in Valorant. Strategic macro caller with international LAN experience.',
    level: 28,
    membershipTier: 'pro',
    caliberRating: 2410,
    lftStatus: 'actively_looking',
    primaryGame: 'valorant',
    primaryRole: 'Controller (Omen / Viper / Astra)',
    secondaryRole: 'Support / Initiator',
    stats: [
      {
        gameId: 'valorant',
        rankName: 'Immortal 3 (380 RR)',
        rankTierIcon: '⚡',
        mmr: 2410,
        winRate: 62.8,
        kdRatio: 1.18,
        matchesPlayed: 320,
        favoriteRole: 'Controller',
        verifiedAccount: true
      }
    ],
    eloHistory: [],
    connectedServices: [],
    badges: [
      { id: 'b1', name: 'VORTEX Verified', icon: '🛡️', color: '#FF5500', description: 'Verified player' },
      { id: 'b2', name: 'LAN Veteran', icon: '🎖️', color: '#8B5CF6', description: 'Competed in DreamHack Open' }
    ],
    hardwareSpecs: {
      mouse: 'Razer DeathAdder V3 Pro',
      keyboard: 'SteelSeries Apex Pro TKL',
      headset: 'HyperX Cloud II Wireless',
      monitorHz: 'BenQ ZOWIE 240Hz'
    },
    socials: {
      discord: 'Nyxora#0001',
      riotId: 'Nyxora#SE',
      twitter: '@nyxora_val'
    }
  },
  {
    id: 'passport-scout-04',
    gamerTag: 'ChronoPulse',
    realName: 'Arthur Moreau',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    country: 'France',
    countryFlag: '🇫🇷',
    bio: 'High challenger Mid Laner & Shotcaller in League of Legends. Specializing in assassin roam and late-game macro.',
    level: 26,
    membershipTier: 'free',
    caliberRating: 2320,
    lftStatus: 'actively_looking',
    primaryGame: 'lol',
    primaryRole: 'Mid Laner (Orianna, Azir, Yone)',
    stats: [
      {
        gameId: 'lol',
        rankName: 'Challenger (612 LP)',
        rankTierIcon: '🔮',
        mmr: 2320,
        winRate: 63.4,
        kdRatio: 4.2,
        matchesPlayed: 450,
        favoriteRole: 'Mid Laner',
        verifiedAccount: true
      }
    ],
    eloHistory: [],
    connectedServices: [],
    badges: [
      { id: 'b1', name: 'VORTEX Verified', icon: '🛡️', color: '#FF5500', description: 'Verified' },
      { id: 'b4', name: 'SoloQ Prodigy', icon: '✨', color: '#F59E0B', description: 'Top 50 EUW SoloQ' }
    ],
    hardwareSpecs: {
      mouse: 'Logitech G502 X',
      keyboard: 'Corsair K70 RGB PRO',
      headset: 'Beyerdynamic DT 990 Pro',
      monitorHz: 'Alienware 280Hz IPS'
    },
    socials: {
      discord: 'Chrono#9988',
      twitch: 'twitch.tv/chronopulse_lol'
    }
  }
];

export const INITIAL_QUESTS: Quest[] = [
  // CS2 QUESTS
  {
    id: 'q1',
    title: 'CS2: Headhunter Precision',
    description: 'Land 35 Headshots in Competitive CS2 matches.',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    type: 'daily',
    progress: 35,
    maxProgress: 35,
    unit: 'headshots',
    rewardXp: 350,
    rewardCoins: 120,
    isCompleted: true,
    isClaimed: false,
    expiresIn: '5h 12m'
  },
  {
    id: 'q5',
    title: 'CS2: Scrim Master Challenge',
    description: 'Host or accept 3 Scrim matches with your registered CS2 roster.',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    type: 'weekly',
    progress: 2,
    maxProgress: 3,
    unit: 'scrims',
    rewardXp: 1500,
    rewardCoins: 650,
    isCompleted: false,
    isClaimed: false,
    expiresIn: '5 days'
  },
  {
    id: 'q-cs2-clutch',
    title: 'CS2: Clutch Master 1vX',
    description: 'Win 2 clutch situations with 1 vs multiple opponents.',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    type: 'daily',
    progress: 1,
    maxProgress: 2,
    unit: 'clutches',
    rewardXp: 450,
    rewardCoins: 180,
    isCompleted: false,
    isClaimed: false,
    expiresIn: '7h 30m'
  },

  // VALORANT QUESTS
  {
    id: 'q2',
    title: 'VALORANT: Tactical Domination',
    description: 'Win 2 Competitive or Scrim matches in VALORANT.',
    gameId: 'valorant',
    gameName: 'VALORANT',
    type: 'daily',
    progress: 1,
    maxProgress: 2,
    unit: 'wins',
    rewardXp: 400,
    rewardCoins: 150,
    isCompleted: false,
    isClaimed: false,
    expiresIn: '5h 12m'
  },
  {
    id: 'q-val-spike',
    title: 'VALORANT: Spike Demolition',
    description: 'Plant or defuse 6 Spikes across competitive matches.',
    gameId: 'valorant',
    gameName: 'VALORANT',
    type: 'daily',
    progress: 4,
    maxProgress: 6,
    unit: 'spikes',
    rewardXp: 300,
    rewardCoins: 120,
    isCompleted: false,
    isClaimed: false,
    expiresIn: '8h'
  },

  // LOL QUESTS
  {
    id: 'q4',
    title: 'LoL: Dragon Slayer & Baron',
    description: 'Secure 6 Epic Monsters in League of Legends.',
    gameId: 'lol',
    gameName: 'League of Legends',
    type: 'daily',
    progress: 4,
    maxProgress: 6,
    unit: 'monsters',
    rewardXp: 300,
    rewardCoins: 100,
    isCompleted: false,
    isClaimed: false,
    expiresIn: '14h 45m'
  }
];

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  // CS2 EXCLUSIVE ITEMS
  {
    id: 'shop-1',
    title: 'AWP | Asiimov (Field-Tested)',
    category: 'game_skin',
    priceCoins: 3500,
    gameId: 'cs2',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    rarity: 'legendary',
    inStock: true,
    description: 'Iconic CS2 sci-fi sniper skin instantly tradeable to your Steam account via automated bot trade.',
    tag: 'CS2 Skin'
  },
  {
    id: 'shop-5',
    title: '$25 Steam Digital Wallet Code',
    category: 'currency',
    priceCoins: 1500,
    gameId: 'cs2',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
    rarity: 'rare',
    inStock: true,
    description: 'Global Steam code sent to your registered VORTEX email immediately for CS2 cases & keys.',
    tag: 'Steam Code'
  },
  {
    id: 'shop-4',
    title: 'Logitech G PRO X Superlight 2',
    category: 'hardware',
    priceCoins: 8500,
    gameId: 'cs2',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop',
    rarity: 'legendary',
    inStock: true,
    description: 'Ultralight 60g wireless esports gaming mouse shipped directly to your door anywhere in the world.',
    tag: 'Physical Gear'
  },
  {
    id: 'shop-6',
    title: 'Kurosun Ninja Artisan Mousepad',
    category: 'hardware',
    priceCoins: 4200,
    gameId: 'cs2',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop',
    rarity: 'epic',
    inStock: true,
    description: 'Japanese poron base premium control pad for pixel-perfect micro-adjustments in CS2.',
    tag: 'Limited Edition'
  },

  {
    id: 'shop-ak-bloodsport',
    title: 'AK-47 | Bloodsport (Factory New)',
    category: 'game_skin',
    priceCoins: 4200,
    gameId: 'cs2',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    rarity: 'legendary',
    inStock: true,
    description: 'Covert hydrographic AK-47 skin with sci-fi sponsors. Trade offer delivered instantly via Steam Bot.',
    tag: 'CS2 Covert'
  },
  {
    id: 'shop-karambit-doppler',
    title: 'Karambit | Doppler Phase 2 (Pink Galaxy)',
    category: 'game_skin',
    priceCoins: 18500,
    gameId: 'cs2',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=600&auto=format&fit=crop',
    rarity: 'legendary',
    inStock: true,
    description: 'Iconic curved blade knife with vibrant pink galaxy hues. Automated instant bot trade.',
    tag: 'CS2 Knife'
  },
  {
    id: 'shop-deagle-printstream',
    title: 'Desert Eagle | Printstream (Factory New)',
    category: 'game_skin',
    priceCoins: 2800,
    gameId: 'cs2',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    rarity: 'epic',
    inStock: true,
    description: 'Monochrome pistol with custom pearlescent finish. Ready for instant Steam trade withdrawal.',
    tag: 'CS2 Pistol'
  },
  {
    id: 'shop-cs2-coach',
    title: 'CS2 1-on-1 Pro Coaching Session (60m)',
    category: 'coaching',
    priceCoins: 1800,
    gameId: 'cs2',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=600&auto=format&fit=crop',
    rarity: 'epic',
    inStock: true,
    description: 'Comprehensive VOD review, Leetify analytics, and crosshair placement fine-tuning with a certified Faceit coach.',
    tag: 'Live VOD Review'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'CS2 Major Grand Finals Live!',
    message: 'VORTEX CS2 Major Championship: NAVI Youth vs Team Liquid Gen is in Map 3!',
    time: '2m ago',
    type: 'tournament',
    read: false
  },
  {
    id: 'n2',
    title: 'Daily Quest Completed',
    message: 'You achieved "CS2: Headhunter Precision"! Claim your 120 VORTEX Coins now.',
    time: '15m ago',
    type: 'bounty',
    read: false
  },
  {
    id: 'n3',
    title: 'New CS2 Scrim Challenge',
    message: 'Apeks Rebel Roster requested a 5v5 Faceit Level 10 practice session.',
    time: '1h ago',
    type: 'scrim',
    read: true
  }
];

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'pack-1',
    coins: 500,
    bonusCoins: 0,
    priceUsd: 4.99,
    badge: 'STARTER'
  },
  {
    id: 'pack-2',
    coins: 1200,
    bonusCoins: 200,
    priceUsd: 9.99,
    popular: true,
    badge: 'MOST POPULAR'
  },
  {
    id: 'pack-3',
    coins: 2800,
    bonusCoins: 600,
    priceUsd: 19.99,
    badge: '+40% VALUE'
  },
  {
    id: 'pack-4',
    coins: 6500,
    bonusCoins: 1800,
    priceUsd: 39.99,
    badge: 'CLAN VAULT'
  }
];

export const MOCK_MATCH_ANALYSIS: MatchAnalysis = {
  matchId: 'NX-ANALYSIS-8924',
  game: 'Counter-Strike 2',
  map: 'de_mirage',
  result: 'VICTORY',
  score: '13 - 9',
  duration: '38m 42s',
  date: 'Today, 20:15 CET',
  overallRating: 9.4,
  aimScore: 92,
  crosshairPlacementPct: 88,
  firstBulletAccuracyPct: 76,
  headshotPct: 67,
  clutchEfficiencyPct: 82,
  utilityDamage: 485,
  insights: [
    {
      type: 'positive',
      title: 'Flawless Pre-Aim on A Site Palace',
      desc: 'Your crosshair was pre-positioned at head-level on 94% of peeks, lowering your time-to-damage to 164ms (pro benchmark: <180ms).'
    },
    {
      type: 'positive',
      title: 'Clutch King Decision-Making',
      desc: 'Won 2 out of 2 1v2 post-plant situations by playing high-percentage isolation angles.'
    },
    {
      type: 'warning',
      title: 'Flashbang Waste on Mid Con',
      desc: '3 flashes exploded behind teammate line of sight without blinding opposing AWPer. Delay throw by 1.2s.'
    },
    {
      type: 'tip',
      title: 'Pro AI Recommendation',
      desc: 'Increase your pistol round armor buy rate on T side; your opening duel win-rate jumps from 45% to 71% with kevlar.'
    }
  ]
};
