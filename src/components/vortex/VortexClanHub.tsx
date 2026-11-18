import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Trophy,
  Swords,
  UserPlus,
  Edit3,
  Crown,
  CheckCircle2,
  Globe,
  Search,
  Plus,
  Sparkles,
  Trash2,
  ChevronRight,
  Info,
  Flame,
  Target,
  Crosshair,
  Award,
  Calendar,
  Clock,
  ArrowUpRight,
  Radio,
  MapPin,
  RotateCcw,
  Download,
  Copy,
  Check,
  Layers,
  Zap,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

export interface ClanMember {
  id: string;
  name: string;
  role: 'IGL / Captain' | 'AWPer' | 'Entry Fragger' | 'Support' | 'Lurker' | 'Substitute';
  level: number;
  elo: number;
  avatar: string;
  country: string;
  flag: string;
  isCaptain?: boolean;
  isUser?: boolean;
}

export interface ClanData {
  id: string;
  name: string;
  tag: string;
  logo: string;
  banner: string;
  description: string;
  country: string;
  flag: string;
  captainId: string;
  captainName: string;
  members: ClanMember[];
  stats: {
    matches: number;
    wins: number;
    losses: number;
    winrate: string;
    avgElo: number;
    tournamentsWon: number;
    streak: number;
  };
  verified?: boolean;
}

export interface ClanMatch {
  id: string;
  clan1: {
    id: string;
    name: string;
    tag: string;
    logo: string;
    score: number;
    isWinner: boolean;
  };
  clan2: {
    id: string;
    name: string;
    tag: string;
    logo: string;
    score: number;
    isWinner: boolean;
  };
  mapName: string;
  mapImage: string;
  server: string;
  date: string;
  timeAgo: string;
  duration: string;
  eloChange: number;
  tournamentOrEvent?: string;
  mvp: {
    name: string;
    avatar: string;
    kills: number;
    deaths: number;
    rating: string;
    clanTag: string;
  };
  clan1Players?: Array<{ name: string; kills: number; deaths: number; assists: number; adr: string; rating: string }>;
  clan2Players?: Array<{ name: string; kills: number; deaths: number; assists: number; adr: string; rating: string }>;
}

export const DEFAULT_CLAN_MATCHES: ClanMatch[] = [
  {
    id: 'cm-1',
    clan1: {
      id: 'cc-squad',
      name: 'CC Competitive Squad',
      tag: 'CC',
      logo: '/images/clan_badges/badge_caliber_lime.svg',
      score: 13,
      isWinner: true
    },
    clan2: {
      id: 'bne-academy',
      name: 'Bad News Eagles Academy',
      tag: 'BNE',
      logo: '/images/clan_badges/badge_caliber_gold.svg',
      score: 11,
      isWinner: false
    },
    mapName: 'de_mirage',
    mapImage: '/images/maps/cs2_mirage.png',
    server: 'Frankfurt Central • 128-Tick MatchZy',
    date: 'Today, 14:15',
    timeAgo: '2h ago',
    duration: '34 mins',
    eloChange: 25,
    tournamentOrEvent: 'Clan War 5v5 Challenge',
    mvp: {
      name: 'M14',
      avatar: 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
      kills: 24,
      deaths: 14,
      rating: '1.42',
      clanTag: 'CC'
    },
    clan1Players: [
      { name: 'M14', kills: 24, deaths: 14, assists: 6, adr: '108.4', rating: '1.42' },
      { name: 'juanflatroo', kills: 21, deaths: 15, assists: 4, adr: '94.2', rating: '1.28' },
      { name: 's1mple', kills: 19, deaths: 16, assists: 5, adr: '88.5', rating: '1.18' },
      { name: 'M18', kills: 16, deaths: 17, assists: 8, adr: '76.1', rating: '1.02' },
      { name: 'ZywOo', kills: 15, deaths: 16, assists: 7, adr: '74.8', rating: '0.98' }
    ],
    clan2Players: [
      { name: 'rigoN-jr', kills: 22, deaths: 18, assists: 4, adr: '96.5', rating: '1.24' },
      { name: 'sener1-star', kills: 18, deaths: 19, assists: 5, adr: '84.2', rating: '1.06' },
      { name: 'gxx-aim', kills: 16, deaths: 19, assists: 3, adr: '79.1', rating: '0.98' },
      { name: 'juan-pro', kills: 14, deaths: 20, assists: 6, adr: '68.4', rating: '0.88' },
      { name: 'devilwalk', kills: 11, deaths: 21, assists: 4, adr: '59.0', rating: '0.74' }
    ]
  },
  {
    id: 'cm-2',
    clan1: {
      id: 'cc-squad',
      name: 'CC Competitive Squad',
      tag: 'CC',
      logo: '/images/clan_badges/badge_caliber_lime.svg',
      score: 13,
      isWinner: true
    },
    clan2: {
      id: 'faze-balkan',
      name: 'FaZe Clan Balkan Talent',
      tag: 'FaZe',
      logo: '/images/clan_badges/badge_caliber_fire.svg',
      score: 9,
      isWinner: false
    },
    mapName: 'de_inferno',
    mapImage: '/images/maps/cs2_inferno.png',
    server: 'Frankfurt Central • 128-Tick MatchZy',
    date: 'Yesterday, 19:40',
    timeAgo: '1d ago',
    duration: '29 mins',
    eloChange: 25,
    tournamentOrEvent: 'European Clan Division I',
    mvp: {
      name: 'juanflatroo',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      kills: 22,
      deaths: 11,
      rating: '1.46',
      clanTag: 'CC'
    },
    clan1Players: [
      { name: 'juanflatroo', kills: 22, deaths: 11, assists: 5, adr: '104.2', rating: '1.46' },
      { name: 'M14', kills: 20, deaths: 12, assists: 7, adr: '98.5', rating: '1.34' },
      { name: 's1mple', kills: 18, deaths: 14, assists: 4, adr: '89.2', rating: '1.19' },
      { name: 'M18', kills: 15, deaths: 13, assists: 6, adr: '78.4', rating: '1.05' },
      { name: 'ZywOo', kills: 14, deaths: 14, assists: 5, adr: '72.1', rating: '0.96' }
    ],
    clan2Players: [
      { name: 'BrokyAWP', kills: 18, deaths: 17, assists: 3, adr: '86.4', rating: '1.12' },
      { name: 'ViperStrike', kills: 16, deaths: 18, assists: 4, adr: '79.2', rating: '1.00' },
      { name: 'Rainmaker', kills: 14, deaths: 19, assists: 5, adr: '71.5', rating: '0.90' },
      { name: 'FrozenEcho', kills: 12, deaths: 19, assists: 3, adr: '64.0', rating: '0.82' },
      { name: 'RopzSneak', kills: 9, deaths: 19, assists: 2, adr: '52.3', rating: '0.68' }
    ]
  },
  {
    id: 'cm-3',
    clan1: {
      id: 'cc-squad',
      name: 'CC Competitive Squad',
      tag: 'CC',
      logo: '/images/clan_badges/badge_caliber_lime.svg',
      score: 10,
      isWinner: false
    },
    clan2: {
      id: 'prishtina-clutch',
      name: 'Prishtina Clutch Stars',
      tag: 'PRN',
      logo: '/images/clan_badges/badge_caliber_shield.svg',
      score: 13,
      isWinner: true
    },
    mapName: 'de_dust2',
    mapImage: '/images/maps/cs2_dust2.png',
    server: 'Vienna Sub-Tick • 128-Tick',
    date: '16 Nov, 21:10',
    timeAgo: '2d ago',
    duration: '38 mins',
    eloChange: -25,
    tournamentOrEvent: 'Clan War 5v5 Challenge',
    mvp: {
      name: 'DrenicaSniper',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      kills: 25,
      deaths: 13,
      rating: '1.52',
      clanTag: 'PRN'
    },
    clan1Players: [
      { name: 'M14', kills: 21, deaths: 16, assists: 4, adr: '94.2', rating: '1.22' },
      { name: 'juanflatroo', kills: 17, deaths: 17, assists: 5, adr: '82.1', rating: '1.05' },
      { name: 's1mple', kills: 15, deaths: 18, assists: 3, adr: '75.4', rating: '0.94' },
      { name: 'M18', kills: 13, deaths: 19, assists: 6, adr: '69.2', rating: '0.86' },
      { name: 'ZywOo', kills: 11, deaths: 20, assists: 4, adr: '58.0', rating: '0.72' }
    ],
    clan2Players: [
      { name: 'DrenicaSniper', kills: 25, deaths: 13, assists: 4, adr: '112.5', rating: '1.52' },
      { name: 'Besart_CS2', kills: 19, deaths: 15, assists: 7, adr: '89.4', rating: '1.20' },
      { name: 'Ardit_Entry', kills: 17, deaths: 16, assists: 3, adr: '81.0', rating: '1.08' },
      { name: 'Lumi_Flash', kills: 15, deaths: 17, assists: 8, adr: '74.2', rating: '0.98' },
      { name: 'Valon_Anchor', kills: 14, deaths: 16, assists: 5, adr: '70.8', rating: '0.95' }
    ]
  },
  {
    id: 'cm-4',
    clan1: {
      id: 'bne-academy',
      name: 'Bad News Eagles Academy',
      tag: 'BNE',
      logo: '/images/clan_badges/badge_caliber_gold.svg',
      score: 13,
      isWinner: true
    },
    clan2: {
      id: 'faze-balkan',
      name: 'FaZe Clan Balkan Talent',
      tag: 'FaZe',
      logo: '/images/clan_badges/badge_caliber_fire.svg',
      score: 8,
      isWinner: false
    },
    mapName: 'de_anubis',
    mapImage: '/images/maps/cs2_anubis.png',
    server: 'Frankfurt Central • 128-Tick',
    date: '15 Nov, 18:00',
    timeAgo: '3d ago',
    duration: '27 mins',
    eloChange: 25,
    tournamentOrEvent: 'CaliberClutch Elite Qualifier',
    mvp: {
      name: 'rigoN-jr',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      kills: 23,
      deaths: 10,
      rating: '1.55',
      clanTag: 'BNE'
    }
  },
  {
    id: 'cm-5',
    clan1: {
      id: 'bne-academy',
      name: 'Bad News Eagles Academy',
      tag: 'BNE',
      logo: '/images/clan_badges/badge_caliber_gold.svg',
      score: 13,
      isWinner: true
    },
    clan2: {
      id: 'prishtina-clutch',
      name: 'Prishtina Clutch Stars',
      tag: 'PRN',
      logo: '/images/clan_badges/badge_caliber_shield.svg',
      score: 11,
      isWinner: false
    },
    mapName: 'de_ancient',
    mapImage: '/images/maps/cs2_ancient.png',
    server: 'Frankfurt Central • 128-Tick',
    date: '14 Nov, 20:30',
    timeAgo: '4d ago',
    duration: '36 mins',
    eloChange: 25,
    tournamentOrEvent: 'Kosovo Esports Clan Derby',
    mvp: {
      name: 'gxx-aim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      kills: 24,
      deaths: 13,
      rating: '1.41',
      clanTag: 'BNE'
    }
  }
];

interface VortexClanHubProps {
  currentGamerTag: string;
  currentClanTag: string;
  currentAvatarUrl: string;
  currentUserLevel: number;
  currentUserElo: number;
  currentCountry: { code: string; name: string; flag: string };
  onUpdateClanTag: (newTag: string) => void;
  onNavigateTab: (tab: string) => void;
  setToast: (msg: string) => void;
}

export interface PresetBadge {
  id: string;
  name: string;
  url: string;
}

const PRESET_CLAN_LOGOS: PresetBadge[] = [
  {
    id: 'caliber-neon',
    name: 'Caliber Clutch Official Neon Crest',
    url: '/images/clan_badges/badge_caliber_lime.svg'
  },
  {
    id: 'caliber-fire',
    name: 'Caliber Clutch Fire Strike',
    url: '/images/clan_badges/badge_caliber_fire.svg'
  },
  {
    id: 'caliber-skull',
    name: 'Caliber Tactical Skull & Crossed Blades',
    url: '/images/clan_badges/badge_caliber_skull.svg'
  },
  {
    id: 'caliber-sniper',
    name: 'Caliber AWP 128-Tick Scope',
    url: '/images/clan_badges/badge_caliber_sniper.svg'
  },
  {
    id: 'caliber-shield',
    name: 'Caliber Championship Star Shield',
    url: '/images/clan_badges/badge_caliber_shield.svg'
  },
  {
    id: 'karambit-lore',
    name: 'Caliber Clutch Karambit Lore',
    url: '/images/karambit_lore.png'
  }
];

const DEFAULT_OPPONENT_CLANS: ClanData[] = [
  {
    id: 'bne-clan',
    name: 'Bad News Eagles Academy',
    tag: 'BNE',
    logo: '/images/clan_badges/badge_caliber_skull.svg',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    description: 'Official developmental roster of Kosovo CS2 legends. Daily 128-tick pracc & tournaments.',
    country: 'Kosovo',
    flag: '🇽🇰',
    captainId: 'rigoN-id',
    captainName: 'rigoN-jr',
    members: [
      { id: '1', name: 'rigoN-jr', role: 'IGL / Captain', level: 10, elo: 2840, avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰', isCaptain: true },
      { id: '2', name: 'juanflatro-aim', role: 'AWPer', level: 10, elo: 2790, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰' },
      { id: '3', name: 'sener1-tap', role: 'Entry Fragger', level: 10, elo: 2650, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰' },
      { id: '4', name: 'gxx-fire', role: 'Support', level: 9, elo: 2420, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80', country: 'Albania', flag: '🇦🇱' },
      { id: '5', name: 'sinnopsyy-beast', role: 'Lurker', level: 10, elo: 2710, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰' },
      { id: '6', name: 'devilwalk-coach', role: 'Substitute', level: 8, elo: 2150, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', country: 'Sweden', flag: '🇸🇪' },
    ],
    stats: {
      matches: 48,
      wins: 39,
      losses: 9,
      winrate: '81.2%',
      avgElo: 2682,
      tournamentsWon: 5,
      streak: 6
    },
    verified: true
  },
  {
    id: 'faze-balkan',
    name: 'FaZe Clan Balkan Talent',
    tag: 'FaZe',
    logo: '/images/clan_badges/badge_caliber_fire.svg',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    description: 'Premier competitive CS2 squad for European cup circuits and cash tournaments.',
    country: 'Germany',
    flag: '🇩🇪',
    captainId: 'karrigan-fan',
    captainName: 'ViperStrike',
    members: [
      { id: '11', name: 'ViperStrike', role: 'IGL / Captain', level: 9, elo: 2310, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', country: 'Germany', flag: '🇩🇪', isCaptain: true },
      { id: '12', name: 'BrokyAWP', role: 'AWPer', level: 10, elo: 2540, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80', country: 'Latvia', flag: '🇱🇻' },
      { id: '13', name: 'Rainmaker', role: 'Entry Fragger', level: 8, elo: 2080, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', country: 'Norway', flag: '🇳🇴' },
      { id: '14', name: 'FrozenEcho', role: 'Support', level: 9, elo: 2280, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80', country: 'Slovakia', flag: '🇸🇰' },
      { id: '15', name: 'RopzSneak', role: 'Lurker', level: 10, elo: 2620, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', country: 'Estonia', flag: '🇪🇪' },
      { id: '16', name: 'NeoTactics', role: 'Substitute', level: 7, elo: 1890, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', country: 'Poland', flag: '🇵🇱' },
    ],
    stats: {
      matches: 34,
      wins: 24,
      losses: 10,
      winrate: '70.5%',
      avgElo: 2366,
      tournamentsWon: 3,
      streak: 3
    },
    verified: true
  },
  {
    id: 'prishtina-clutch',
    name: 'Prishtina Clutch Stars',
    tag: 'PRN',
    logo: '/images/clan_badges/badge_caliber_shield.svg',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    description: 'Local champions competing in weekly CaliberClutch prize cups. 100% Cash focus.',
    country: 'Kosovo',
    flag: '🇽🇰',
    captainId: 'besart-c',
    captainName: 'Besart_CS2',
    members: [
      { id: '21', name: 'Besart_CS2', role: 'IGL / Captain', level: 8, elo: 1980, avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰', isCaptain: true },
      { id: '22', name: 'DrenicaSniper', role: 'AWPer', level: 9, elo: 2210, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰' },
      { id: '23', name: 'Ardit_Entry', role: 'Entry Fragger', level: 7, elo: 1840, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰' },
      { id: '24', name: 'Lumi_Flash', role: 'Support', level: 8, elo: 1950, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰' },
      { id: '25', name: 'Valon_Anchor', role: 'Lurker', level: 8, elo: 1910, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80', country: 'Albania', flag: '🇦🇱' },
      { id: '26', name: 'Krenar_Standin', role: 'Substitute', level: 6, elo: 1620, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', country: 'Kosovo', flag: '🇽🇰' },
    ],
    stats: {
      matches: 22,
      wins: 15,
      losses: 7,
      winrate: '68.2%',
      avgElo: 1978,
      tournamentsWon: 1,
      streak: 2
    },
    verified: false
  }
];

export const VortexClanHub: React.FC<VortexClanHubProps> = ({
  currentGamerTag,
  currentClanTag,
  currentAvatarUrl,
  currentUserLevel,
  currentUserElo,
  currentCountry,
  onUpdateClanTag,
  onNavigateTab,
  setToast,
}) => {
  const [activeTab, setActiveTab] = useState<'my-clan' | 'roster' | 'clans-list' | 'create-clan'>('my-clan');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [selectedRoleForInvite, setSelectedRoleForInvite] = useState<ClanMember['role']>('Entry Fragger');
  const [searchClanQuery, setSearchClanQuery] = useState('');
  const [clanViewOption, setClanViewOption] = useState<'match-center' | 'wars-hub' | 'rivals'>('match-center');
  const [matchFilter, setMatchFilter] = useState<'all' | 'my-clan' | 'wins' | 'losses'>('all');
  const [selectedScoreboardMatch, setSelectedScoreboardMatch] = useState<ClanMatch | null>(null);

  // Load clan matches from localStorage or initialize with DEFAULT_CLAN_MATCHES
  const [clanMatches, setClanMatches] = useState<ClanMatch[]>(() => {
    try {
      const saved = localStorage.getItem('vortex_clan_matches_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_CLAN_MATCHES;
  });

  // 1-Click Simulation of a New Clan War Match
  const handleSimulateNewClanMatch = () => {
    sound.playTournamentVictory();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

    const opponent = DEFAULT_OPPONENT_CLANS[Math.floor(Math.random() * DEFAULT_OPPONENT_CLANS.length)];
    const maps = [
      { name: 'de_mirage', img: '/images/maps/cs2_mirage.png' },
      { name: 'de_inferno', img: '/images/maps/cs2_inferno.png' },
      { name: 'de_dust2', img: '/images/maps/cs2_dust2.png' },
      { name: 'de_anubis', img: '/images/maps/cs2_anubis.png' },
      { name: 'de_ancient', img: '/images/maps/cs2_ancient.png' }
    ];
    const pickedMap = maps[Math.floor(Math.random() * maps.length)];
    const userScore = 13;
    const oppScore = Math.floor(Math.random() * 4) + 8; // 8 - 11 close match

    const newMatch: ClanMatch = {
      id: `cm-sim-${Date.now()}`,
      clan1: {
        id: 'cc-squad',
        name: userClan.name,
        tag: userClan.tag,
        logo: userClan.logo,
        score: userScore,
        isWinner: true
      },
      clan2: {
        id: opponent.id,
        name: opponent.name,
        tag: opponent.tag,
        logo: opponent.logo,
        score: oppScore,
        isWinner: false
      },
      mapName: pickedMap.name,
      mapImage: pickedMap.img,
      server: 'Frankfurt Central • 128-Tick MatchZy',
      date: 'Just now',
      timeAgo: 'Just now',
      duration: '31 mins',
      eloChange: 25,
      tournamentOrEvent: 'Clan War 5v5 Live Test',
      mvp: {
        name: currentGamerTag.split(' ')[0] || 'M14',
        avatar: userClan.logo,
        kills: 25,
        deaths: 12,
        rating: '1.45',
        clanTag: userClan.tag
      },
      clan1Players: userClan.members.slice(0, 5).map(m => ({
        name: m.name,
        kills: Math.floor(Math.random() * 7) + 16,
        deaths: Math.floor(Math.random() * 5) + 11,
        assists: Math.floor(Math.random() * 5) + 3,
        adr: (85 + Math.random() * 25).toFixed(1),
        rating: (1.10 + Math.random() * 0.35).toFixed(2)
      })),
      clan2Players: opponent.members.slice(0, 5).map(m => ({
        name: m.name,
        kills: Math.floor(Math.random() * 6) + 12,
        deaths: Math.floor(Math.random() * 5) + 14,
        assists: Math.floor(Math.random() * 4) + 2,
        adr: (70 + Math.random() * 20).toFixed(1),
        rating: (0.90 + Math.random() * 0.25).toFixed(2)
      }))
    };

    const updatedMatches = [newMatch, ...clanMatches];
    setClanMatches(updatedMatches);
    try {
      localStorage.setItem('vortex_clan_matches_list', JSON.stringify(updatedMatches));
    } catch (_) {}

    // Update user clan stats
    const nextClan = {
      ...userClan,
      stats: {
        ...userClan.stats,
        matches: userClan.stats.matches + 1,
        wins: userClan.stats.wins + 1,
        streak: userClan.stats.streak + 1,
        avgElo: userClan.stats.avgElo + 25,
        winrate: `${Math.round(((userClan.stats.wins + 1) / (userClan.stats.matches + 1)) * 1000) / 10}%`
      }
    };
    setUserClan(nextClan);
    try {
      localStorage.setItem('vortex_user_clan_data', JSON.stringify(nextClan));
    } catch (_) {}

    setToast(`🎉 Clan War Won! [${userClan.tag}] ${userScore} - ${oppScore} [${opponent.tag}] on ${pickedMap.name.toUpperCase().replace('DE_', '')} (+25 Clan ELO)!`);
  };

  // Load user clan from localStorage or initialize with M14 / Caliber Clutch default
  const [userClan, setUserClan] = useState<ClanData>(() => {
    try {
      const saved = localStorage.getItem('vortex_user_clan_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate any legacy unsplash stock images to official Caliber Clutch badge
        if (!parsed.logo || parsed.logo.includes('unsplash.com')) {
          parsed.logo = '/images/clan_badges/badge_caliber_lime.svg';
          localStorage.setItem('vortex_user_clan_data', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (_) {}

    const initialTag = currentClanTag || 'M14';
    return {
      id: 'user-clan-main',
      name: `${initialTag} Competitive Squad`,
      tag: initialTag,
      logo: '/images/clan_badges/badge_caliber_lime.svg',
      banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      description: 'Official Caliber Clutch competitive roster led by M14. Competing in European 128-tick Cash tournaments and CS2 cups.',
      country: currentCountry.name,
      flag: currentCountry.flag,
      captainId: 'current-user',
      captainName: currentGamerTag,
      members: [
        {
          id: 'current-user',
          name: currentGamerTag,
          role: 'IGL / Captain',
          level: currentUserLevel,
          elo: currentUserElo,
          avatar: currentAvatarUrl,
          country: currentCountry.name,
          flag: currentCountry.flag,
          isCaptain: true,
          isUser: true,
        },
        {
          id: 'teammate-2',
          name: 'Vortex_Ghost',
          role: 'AWPer',
          level: Math.max(3, currentUserLevel + 2),
          elo: currentUserElo + 420,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          country: 'Kosovo',
          flag: '🇽🇰',
        },
        {
          id: 'teammate-3',
          name: 'K1llshot_AL',
          role: 'Entry Fragger',
          level: Math.max(3, currentUserLevel + 1),
          elo: currentUserElo + 210,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
          country: 'Albania',
          flag: '🇦🇱',
        },
        {
          id: 'teammate-4',
          name: 'ShadowStrike',
          role: 'Support',
          level: currentUserLevel,
          elo: currentUserElo + 90,
          avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
          country: 'Germany',
          flag: '🇩🇪',
        },
        {
          id: 'teammate-5',
          name: 'Silent_Clutcher',
          role: 'Lurker',
          level: Math.max(3, currentUserLevel + 3),
          elo: currentUserElo + 580,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          country: 'Kosovo',
          flag: '🇽🇰',
        },
        {
          id: 'teammate-6',
          name: 'BalkanSub_01',
          role: 'Substitute',
          level: Math.max(1, currentUserLevel),
          elo: currentUserElo,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
          country: 'Albania',
          flag: '🇦🇱',
        },
      ],
      stats: {
        matches: 14,
        wins: 11,
        losses: 3,
        winrate: '78.6%',
        avgElo: Math.round((currentUserElo * 5 + 1300) / 5),
        tournamentsWon: 2,
        streak: 4,
      },
      verified: true,
    };
  });

  // Edit form state
  const [draftName, setDraftName] = useState(userClan.name);
  const [draftTag, setDraftTag] = useState(userClan.tag);
  const [draftDesc, setDraftDesc] = useState(userClan.description);
  const [draftLogo, setDraftLogo] = useState(userClan.logo);

  // Save changes to user clan
  const saveClanChanges = () => {
    sound.playTournamentVictory();
    const cleanTag = draftTag.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 5).toUpperCase() || 'CC';
    const updated: ClanData = {
      ...userClan,
      name: draftName.trim() || `${cleanTag} Squad`,
      tag: cleanTag,
      description: draftDesc.trim() || userClan.description,
      logo: draftLogo,
    };
    setUserClan(updated);
    localStorage.setItem('vortex_user_clan_data', JSON.stringify(updated));
    onUpdateClanTag(cleanTag);
    setIsEditModalOpen(false);
    setToast(`✓ Clan details updated! Clan Tag set to [${cleanTag}].`);
  };

  // Add teammate to roster
  const handleInviteTeammate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    sound.playClick();

    if (userClan.members.length >= 6) {
      alert('The roster already has maximum capacity (5 starters + 1 substitute). Remove a member first.');
      return;
    }

    const newMember: ClanMember = {
      id: `member-${Date.now()}`,
      name: inviteInput.trim(),
      role: selectedRoleForInvite,
      level: Math.max(3, currentUserLevel + 1),
      elo: currentUserElo + 150,
      avatar: PRESET_CLAN_LOGOS[Math.floor(Math.random() * PRESET_CLAN_LOGOS.length)].url,
      country: currentCountry.name,
      flag: currentCountry.flag,
    };

    const nextMembers = [...userClan.members, newMember];
    const avg = Math.round(nextMembers.slice(0, 5).reduce((acc, m) => acc + m.elo, 0) / Math.min(5, nextMembers.length));
    const nextClan: ClanData = {
      ...userClan,
      members: nextMembers,
      stats: {
        ...userClan.stats,
        avgElo: avg,
      },
    };

    setUserClan(nextClan);
    localStorage.setItem('vortex_user_clan_data', JSON.stringify(nextClan));
    setInviteInput('');
    setIsInviteModalOpen(false);
    sound.playTournamentVictory();
    setToast(`✓ ${newMember.name} joined [${userClan.tag}] as ${newMember.role}!`);
  };

  // Kick member
  const handleKickMember = (memberId: string) => {
    sound.playClick();
    if (memberId === 'current-user') {
      alert('You cannot kick yourself (Team Captain). Transfer captaincy first if needed.');
      return;
    }
    const nextMembers = userClan.members.filter(m => m.id !== memberId);
    const avg = Math.round(nextMembers.slice(0, 5).reduce((acc, m) => acc + m.elo, 0) / Math.min(5, nextMembers.length || 1));
    const nextClan: ClanData = {
      ...userClan,
      members: nextMembers,
      stats: {
        ...userClan.stats,
        avgElo: avg,
      },
    };
    setUserClan(nextClan);
    localStorage.setItem('vortex_user_clan_data', JSON.stringify(nextClan));
    setToast(`✓ Player removed from [${userClan.tag}] roster.`);
  };

  // Change role
  const handleChangeRole = (memberId: string, newRole: ClanMember['role']) => {
    sound.playSelect();
    const nextMembers = userClan.members.map(m => (m.id === memberId ? { ...m, role: newRole } : m));
    const nextClan = { ...userClan, members: nextMembers };
    setUserClan(nextClan);
    localStorage.setItem('vortex_user_clan_data', JSON.stringify(nextClan));
  };

  const filteredOpponents = DEFAULT_OPPONENT_CLANS.filter(c => {
    if (!searchClanQuery.trim()) return true;
    const q = searchClanQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-[#202536] bg-[#0E1017] p-6 md:p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-transparent z-10" />
        <img
          src={userClan.banner}
          alt="Clan Banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 blur-xs"
        />

        <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={userClan.logo}
                alt={userClan.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-[#FF5500] shadow-[0_0_20px_rgba(255,85,0,0.35)]"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-[#FF5500] text-black uppercase tracking-wider shadow">
                [{userClan.tag}]
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black font-display text-white tracking-wide">
                  {userClan.name}
                </h1>
                {userClan.verified && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 flex items-center gap-1 uppercase">
                    <CheckCircle2 className="w-3 h-3" /> Verified Squad
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1">
                  <span>{userClan.flag}</span>
                  <span>{userClan.country}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans max-w-xl line-clamp-2">
                {userClan.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Captain:</span>
                  <strong className="text-white">{userClan.captainName}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>Roster:</span>
                  <strong className="text-white">{userClan.members.length} / 6 Players</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>Team ELO:</span>
                  <strong className="text-[#A3E635]">{userClan.stats.avgElo}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setIsEditModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Edit Clan Profile</span>
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                onNavigateTab('tournaments');
                setToast(`✓ Navigating to Tournaments with Clan [${userClan.tag}] roster ready!`);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-amber-500 hover:brightness-110 text-black text-xs font-mono font-black flex items-center justify-center gap-2 shadow-lg shadow-[#FF5500]/25 cursor-pointer transition"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Register for Tournament</span>
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2333] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { sound.playClick(); setActiveTab('my-clan'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'my-clan'
                ? 'bg-[#A3E635] text-slate-950 font-black shadow-md'
                : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Clan Dashboard</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('roster'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-[#A3E635] text-slate-950 font-black shadow-md'
                : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>5v5 Lineup & Roster ({userClan.members.length}/6)</span>
          </button>

                    <button
            onClick={() => { sound.playClick(); setActiveTab('clans-list'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'clans-list'
                ? 'bg-[#A3E635] text-slate-950 font-black shadow-md'
                : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Clan Matches & Wars</span>
          </button>
        </div>

        {activeTab === 'roster' && (
          <button
            onClick={() => {
              sound.playClick();
              setIsInviteModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#FF5500]/15 hover:bg-[#FF5500]/25 text-[#FF5500] border border-[#FF5500]/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Player</span>
          </button>
        )}
      </div>

      {/* TAB 1: CLAN DASHBOARD (OVERVIEW & PERFORMANCE) */}
      {activeTab === 'my-clan' && (
        <div className="space-y-6">
          {/* STATS METRIC TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Team Win Rate
              </span>
              <div className="text-2xl font-black font-display text-white">{userClan.stats.winrate}</div>
              <p className="text-[10px] font-mono text-emerald-400 font-bold">{userClan.stats.wins}W - {userClan.stats.losses}L Record</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FF5500]" />
                Current Streak
              </span>
              <div className="text-2xl font-black font-display text-[#FF5500]">{userClan.stats.streak} Wins</div>
              <p className="text-[10px] font-mono text-slate-400">Competitive Momentum</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#A3E635]" />
                Tournament Cups
              </span>
              <div className="text-2xl font-black font-display text-[#A3E635]">{userClan.stats.tournamentsWon} Trophies</div>
              <p className="text-[10px] font-mono text-slate-400">CaliberClutch Circuit</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Squad Average ELO
              </span>
              <div className="text-2xl font-black font-display text-white">{userClan.stats.avgElo}</div>
              <p className="text-[10px] font-mono text-blue-400 font-bold">Level {Math.min(10, Math.floor(userClan.stats.avgElo / 250) + 1)} Bracket</p>
            </div>
          </div>

          {/* ACTIVE 5v5 LINEUP PREVIEW */}
          <div className="p-6 rounded-3xl bg-[#0E1017] border border-[#202536] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-display text-white">Starting 5v5 Roster</h3>
                <p className="text-xs font-mono text-slate-400">Primary starting lineup configured for official matches</p>
              </div>
              <button
                onClick={() => { sound.playClick(); setActiveTab('roster'); }}
                className="text-xs font-mono text-[#A3E635] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Roles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {userClan.members.slice(0, 5).map((member, idx) => (
                <div
                  key={member.id}
                  className={`p-3.5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between gap-3 ${
                    member.isCaptain
                      ? 'bg-gradient-to-b from-[#1C1708] to-[#11131A] border-amber-500/40 shadow-lg'
                      : 'bg-[#141620] border-[#252A3C] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-slate-400">
                      Slot #{idx + 1}
                    </span>
                    {member.isCaptain && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                        IGL / CAPT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-black font-sans text-white truncate flex items-center gap-1">
                        <span>{member.name}</span>
                        {member.isUser && <span className="text-[9px] text-[#A3E635] font-mono">[YOU]</span>}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block truncate">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                    <span className="text-slate-400">Level {member.level}</span>
                    <span className="text-[#A3E635] font-bold">{member.elo} ELO</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED ROSTER & MANAGEMENT */}
      {activeTab === 'roster' && (
        <div className="p-6 rounded-3xl bg-[#0E1017] border border-[#202536] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2333] pb-4">
            <div>
              <h3 className="text-lg font-black font-display text-white">Full Team Roster & Tactical Roles</h3>
              <p className="text-xs font-mono text-slate-400">
                Official Caliber Clutch 5v5 line-up with tactical roles & bench stand-in
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Capacity: <strong className="text-white">{userClan.members.length} / 6</strong>
            </span>
          </div>

          <div className="space-y-2.5">
            {userClan.members.map((member, idx) => (
              <div
                key={member.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  member.isCaptain
                    ? 'bg-[#181510] border-amber-500/30'
                    : 'bg-[#12141D] border-[#222838] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-500">
                    #{idx + 1}
                  </span>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-sans text-white">{member.name}</span>
                      {member.isUser && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/30">
                          YOU
                        </span>
                      )}
                      {member.isCaptain && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" /> CAPTAIN
                        </span>
                      )}
                      <span className="text-xs">{member.flag}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>FACEIT Level {member.level}</span>
                      <span>•</span>
                      <span className="text-[#A3E635] font-bold">{member.elo} ELO</span>
                      <span>•</span>
                      <span>{member.country}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {/* ROLE SELECTOR DROPDOWN */}
                  <select
                    value={member.role}
                    onChange={(e) => handleChangeRole(member.id, e.target.value as ClanMember['role'])}
                    className="px-3 py-1.5 rounded-xl bg-[#1A1E2B] border border-[#2D354A] text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FF5500] cursor-pointer"
                  >
                    <option value="IGL / Captain">IGL / Captain</option>
                    <option value="AWPer">AWPer</option>
                    <option value="Entry Fragger">Entry Fragger</option>
                    <option value="Support">Support</option>
                    <option value="Lurker">Lurker</option>
                    <option value="Substitute">Substitute (Stand-in)</option>
                  </select>

                  {!member.isUser && (
                    <button
                      onClick={() => handleKickMember(member.id)}
                      title="Remove from roster"
                      className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400 flex items-center justify-center cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLAN DIRECTORY & SCRIMS CHALLENGE */}
      {activeTab === 'clans-list' && (
        <div className="space-y-5">
          {/* TOP BANNER: LIVE TEST SWITCHER (TO PREVIEW ALL 3 OPTIONS) */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#10141F] via-[#151926] to-[#0E111A] border-2 border-[#FF5500]/40 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#FF5500] text-black">
                  Live Test Mode
                </span>
                <span className="text-xs font-mono text-[#A3E635] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                  Kliko midis 3 Opsioneve për të zgjedhur dizajnin tënd të preferuar:
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Zgjidh mënyrën se si dëshiron të paraqiten ndeshjet Clan vs Clan, hartat dhe rezultatet zyrtare.
              </p>
            </div>

            {/* THE 3 LIVE OPTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => { sound.playSelect(); setClanViewOption('match-center'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                  clanViewOption === 'match-center'
                    ? 'bg-[#FF5500] text-black font-black ring-2 ring-[#FF5500]/60 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Opsioni 1: HLTV Match Center</span>
              </button>

              <button
                onClick={() => { sound.playSelect(); setClanViewOption('wars-hub'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                  clanViewOption === 'wars-hub'
                    ? 'bg-[#FF5500] text-black font-black ring-2 ring-[#FF5500]/60 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Opsioni 2: Leaderboard + Ndeshjet</span>
              </button>

              <button
                onClick={() => { sound.playSelect(); setClanViewOption('rivals'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                  clanViewOption === 'rivals'
                    ? 'bg-[#FF5500] text-black font-black ring-2 ring-[#FF5500]/60 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Opsioni 3: Head-to-Head Rivals</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* OPSIONI 1: HLTV MATCH CENTER (CLAN VS CLAN & MAPS)       */}
          {/* ======================================================== */}
          {clanViewOption === 'match-center' && (
            <div className="p-6 rounded-3xl bg-[#0E1017] border border-[#202536] space-y-5 animate-in fade-in duration-200">
              {/* Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2333] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
                      HLTV & FACEIT STANDARD
                    </span>
                    <h3 className="text-lg font-black font-display text-white">Clan vs Clan Official Match Center</h3>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Ndeshjet zyrtare 5v5 midis klaneve, hartat e luajtura, rezultati i raundeve dhe Clan ELO
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleSimulateNewClanMatch}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-amber-500 hover:brightness-110 text-black font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Simulo Ndeshje Re (1-Click Test)</span>
                  </button>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                    {(['all', 'my-clan', 'wins', 'losses'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => { sound.playClick(); setMatchFilter(f); }}
                        className={`px-3 py-1 rounded-lg transition capitalize cursor-pointer ${
                          matchFilter === f
                            ? 'bg-white/15 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f === 'my-clan' ? `[${userClan.tag}] Ndeshjet e Mia` : f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clan vs Clan Matches List */}
              <div className="space-y-3.5">
                {clanMatches
                  .filter(m => {
                    const isMyClanInMatch = m.clan1.tag === userClan.tag || m.clan2.tag === userClan.tag;
                    if (matchFilter === 'my-clan') return isMyClanInMatch;
                    if (matchFilter === 'wins') {
                      if (isMyClanInMatch) {
                        return (m.clan1.tag === userClan.tag && m.clan1.isWinner) || (m.clan2.tag === userClan.tag && m.clan2.isWinner);
                      }
                      return m.clan1.isWinner;
                    }
                    if (matchFilter === 'losses') {
                      if (isMyClanInMatch) {
                        return (m.clan1.tag === userClan.tag && !m.clan1.isWinner) || (m.clan2.tag === userClan.tag && !m.clan2.isWinner);
                      }
                      return !m.clan1.isWinner;
                    }
                    return true;
                  })
                  .map(match => {
                    const isUserClanMatch = match.clan1.tag === userClan.tag || match.clan2.tag === userClan.tag;
                    const userWon = isUserClanMatch && (
                      (match.clan1.tag === userClan.tag && match.clan1.isWinner) ||
                      (match.clan2.tag === userClan.tag && match.clan2.isWinner)
                    );

                    return (
                      <div
                        key={match.id}
                        className="rounded-2xl border border-[#22283A] bg-[#121520] hover:border-[#FF5500]/50 transition overflow-hidden shadow-xl group relative"
                      >
                        {/* Map Background with subtle overlay */}
                        <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-25 transition pointer-events-none">
                          <img
                            src={match.mapImage}
                            alt={match.mapName}
                            className="w-full h-full object-cover filter blur-[1px]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#121520] via-[#121520]/80 to-[#121520]" />
                        </div>

                        <div className="relative z-10 p-4 sm:p-5 space-y-3.5">
                          {/* Top Meta Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 border-b border-white/5 pb-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2.5 py-0.5 rounded-lg bg-black/60 border border-white/10 font-black text-[#A3E635] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-[#FF5500]" />
                                {match.mapName.toUpperCase().replace('DE_', '')}
                              </span>
                              <span className="text-slate-300 font-bold">{match.server}</span>
                              <span className="hidden sm:inline text-slate-600">•</span>
                              <span className="hidden sm:inline text-slate-400">{match.tournamentOrEvent}</span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px]">
                              <span>{match.date}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400 font-bold">{match.timeAgo}</span>
                            </div>
                          </div>

                          {/* Clan vs Clan Battle Arena */}
                          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 py-1">
                            {/* Left Clan (Clan 1) */}
                            <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-3.5 text-left md:text-right">
                              <div>
                                <div className="flex items-center md:justify-end gap-1.5">
                                  <h4 className={`text-base font-black font-display ${match.clan1.isWinner ? 'text-white' : 'text-slate-400'}`}>
                                    {match.clan1.name}
                                  </h4>
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30">
                                    [{match.clan1.tag}]
                                  </span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                  {match.clan1.isWinner ? (
                                    <span className="text-emerald-400 font-bold">WINNER (+{match.eloChange} ELO)</span>
                                  ) : (
                                    <span className="text-slate-500">DEFEAT (-{match.eloChange} ELO)</span>
                                  )}
                                </div>
                              </div>

                              <img
                                src={match.clan1.logo}
                                alt={match.clan1.name}
                                className={`w-12 h-12 rounded-xl object-cover p-1 shrink-0 ${
                                  match.clan1.isWinner ? 'border-2 border-emerald-400 bg-emerald-500/10' : 'border border-white/10 bg-black/40'
                                }`}
                              />
                            </div>

                            {/* Center Score & VS */}
                            <div className="md:col-span-2 text-center py-1">
                              <div className="inline-flex items-center justify-center gap-3 px-5 py-2 rounded-2xl bg-black/75 border border-white/10 shadow-inner">
                                <span className={`text-2xl font-display font-black ${match.clan1.isWinner ? 'text-emerald-400' : 'text-slate-400'}`}>
                                  {match.clan1.score}
                                </span>
                                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">vs</span>
                                <span className={`text-2xl font-display font-black ${match.clan2.isWinner ? 'text-emerald-400' : 'text-slate-400'}`}>
                                  {match.clan2.score}
                                </span>
                              </div>
                            </div>

                            {/* Right Clan (Clan 2) */}
                            <div className="md:col-span-5 flex items-center justify-start gap-3.5 text-left">
                              <img
                                src={match.clan2.logo}
                                alt={match.clan2.name}
                                className={`w-12 h-12 rounded-xl object-cover p-1 shrink-0 ${
                                  match.clan2.isWinner ? 'border-2 border-emerald-400 bg-emerald-500/10' : 'border border-white/10 bg-black/40'
                                }`}
                              />

                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30">
                                    [{match.clan2.tag}]
                                  </span>
                                  <h4 className={`text-base font-black font-display ${match.clan2.isWinner ? 'text-white' : 'text-slate-400'}`}>
                                    {match.clan2.name}
                                  </h4>
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                  {match.clan2.isWinner ? (
                                    <span className="text-emerald-400 font-bold">WINNER (+{match.eloChange} ELO)</span>
                                  ) : (
                                    <span className="text-slate-500">DEFEAT (-{match.eloChange} ELO)</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Action Footer */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/5 text-xs font-mono">
                            {/* MVP info */}
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold text-[10px] border border-amber-500/30">
                                MATCH MVP
                              </span>
                              <span className="text-white font-bold">{match.mvp.name} [{match.mvp.clanTag}]</span>
                              <span className="text-slate-400">({match.mvp.kills}K - {match.mvp.deaths}D • {match.mvp.rating} Rating)</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { sound.playClick(); setSelectedScoreboardMatch(match); }}
                                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <BarChart2 className="w-3.5 h-3.5 text-[#A3E635]" />
                                <span>Shiko Scoreboard (5v5)</span>
                              </button>

                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setToast(`✓ Downloading CS2 GOTV Demo for match ${match.id} (${match.mapName})...`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Demo (.dem)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* OPSIONI 2: CLAN WARS HUB (LEADERBOARD + NDESHJET)        */}
          {/* ======================================================== */}
          {clanViewOption === 'wars-hub' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Leaderboard Table of Clans */}
              <div className="p-6 rounded-3xl bg-[#0E1017] border border-[#202536] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E2333] pb-3">
                  <div>
                    <h3 className="text-lg font-black font-display text-white">🏆 European CS2 5v5 Clans Leaderboard</h3>
                    <p className="text-xs font-mono text-slate-400">Renditja zyrtare sipas Clan ELO, trofeve dhe ndeshjeve të fituara</p>
                  </div>
                  <span className="text-xs font-mono text-[#A3E635] font-bold">Season 2026 • Division I</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                        <th className="py-2.5 px-3">Rank</th>
                        <th className="py-2.5 px-3">Clan</th>
                        <th className="py-2.5 px-3">Region</th>
                        <th className="py-2.5 px-3 text-right">Team ELO</th>
                        <th className="py-2.5 px-3 text-right">Matches</th>
                        <th className="py-2.5 px-3 text-right">Winrate</th>
                        <th className="py-2.5 px-3 text-center">Cups</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { rank: 1, name: 'Bad News Eagles Academy', tag: 'BNE', logo: '/images/clan_badges/badge_caliber_gold.svg', flag: '🇽🇰', elo: 2682, matches: 48, winrate: '81.2%', cups: 5, isUser: false },
                        { rank: 2, name: 'FaZe Clan Balkan Talent', tag: 'FaZe', logo: '/images/clan_badges/badge_caliber_fire.svg', flag: '🇩🇪', elo: 2366, matches: 34, winrate: '70.5%', cups: 3, isUser: false },
                        { rank: 3, name: userClan.name, tag: userClan.tag, logo: userClan.logo, flag: '🇽🇰', elo: userClan.stats.avgElo, matches: userClan.stats.matches, winrate: userClan.stats.winrate, cups: userClan.stats.tournamentsWon, isUser: true },
                        { rank: 4, name: 'Prishtina Clutch Stars', tag: 'PRN', logo: '/images/clan_badges/badge_caliber_shield.svg', flag: '🇽🇰', elo: 1978, matches: 22, winrate: '68.2%', cups: 1, isUser: false }
                      ]
                        .sort((a, b) => b.elo - a.elo)
                        .map((c, idx) => (
                          <tr
                            key={c.tag}
                            className={`transition ${c.isUser ? 'bg-[#A3E635]/10 font-bold border-l-4 border-l-[#A3E635]' : 'hover:bg-white/[0.02]'}`}
                          >
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black ${
                                idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'text-slate-400'
                              }`}>
                                #{idx + 1}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white font-bold">{c.name}</span>
                                    <span className="text-[10px] text-[#FF5500]">[{c.tag}]</span>
                                    {c.isUser && <span className="px-1.5 py-0.2 rounded bg-[#A3E635] text-black text-[9px] font-black uppercase">YOU</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-300">{c.flag} Europe</td>
                            <td className="py-3 px-3 text-right font-black text-[#A3E635]">{c.elo.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right text-slate-300">{c.matches}</td>
                            <td className="py-3 px-3 text-right text-white font-bold">{c.winrate}</td>
                            <td className="py-3 px-3 text-center text-amber-400 font-bold">{c.cups} 🏆</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Feed of Clan vs Clan Matches */}
              <div className="p-6 rounded-3xl bg-[#0E1017] border border-[#202536] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E2333] pb-3">
                  <h3 className="text-base font-black font-display text-white">Recent Match Results on CS2 Maps</h3>
                  <button
                    onClick={handleSimulateNewClanMatch}
                    className="text-xs font-mono font-bold text-[#FF5500] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>+ Simulo Ndeshje</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {clanMatches.slice(0, 4).map(m => (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-[#121520] border border-[#22283A] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img src={m.mapImage} alt={m.mapName} className="w-12 h-10 rounded-lg object-cover border border-white/10" />
                        <div>
                          <div className="text-xs font-bold font-display text-white">
                            [{m.clan1.tag}] {m.clan1.score} - {m.clan2.score} [{m.clan2.tag}]
                          </div>
                          <div className="text-[10px] font-mono text-[#A3E635]">
                            {m.mapName.toUpperCase().replace('DE_', '')} • {m.date}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedScoreboardMatch(m)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-xs cursor-pointer"
                      >
                        Scoreboard
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* OPSIONI 3: HEAD-TO-HEAD RIVALS (BALLË PËR BALLË)        */}
          {/* ======================================================== */}
          {clanViewOption === 'rivals' && (
            <div className="p-6 rounded-3xl bg-[#0E1017] border border-[#202536] space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-[#1E2333] pb-3">
                <h3 className="text-lg font-black font-display text-white">Head-to-Head Clan Rivals & Match History</h3>
                <p className="text-xs font-mono text-slate-400">
                  Bilanci i drejtpërdrejtë i klanit tënd [{userClan.tag}] kundër çdo klani rival sipas hartave
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEFAULT_OPPONENT_CLANS.map(opponent => {
                  const matchesAgainstThisClan = clanMatches.filter(
                    m => (m.clan1.tag === opponent.tag && m.clan2.tag === userClan.tag) ||
                         (m.clan2.tag === opponent.tag && m.clan1.tag === userClan.tag)
                  );
                  const userWinsVsThis = matchesAgainstThisClan.filter(m => 
                    (m.clan1.tag === userClan.tag && m.clan1.isWinner) ||
                    (m.clan2.tag === userClan.tag && m.clan2.isWinner)
                  ).length;
                  const totalPlayed = matchesAgainstThisClan.length;
                  const winRatePct = totalPlayed > 0 ? Math.round((userWinsVsThis / totalPlayed) * 100) : 0;

                  return (
                    <div
                      key={opponent.id}
                      className="p-5 rounded-2xl bg-[#121520] border border-[#22283A] hover:border-[#FF5500]/50 transition space-y-4 shadow-lg"
                    >
                      {/* Opponent Identity */}
                      <div className="flex items-center gap-3">
                        <img src={opponent.logo} alt={opponent.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black font-display text-white">{opponent.name}</h4>
                            <span className="text-[10px] font-mono font-bold text-[#FF5500]">[{opponent.tag}]</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{opponent.flag} {opponent.country} • ELO: {opponent.stats.avgElo}</span>
                        </div>
                      </div>

                      {/* Head to Head Scorebox */}
                      <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1 text-center font-mono">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Your Head-to-Head Record</div>
                        <div className="text-xl font-display font-black text-white">
                          <span className="text-emerald-400">{userWinsVsThis} FITORE</span>
                          <span className="text-slate-600 mx-2">-</span>
                          <span className="text-red-400">{totalPlayed - userWinsVsThis} HUMBJE</span>
                        </div>
                        <div className="text-[11px] text-[#A3E635] font-bold">
                          {totalPlayed > 0 ? `${winRatePct}% Winrate kundër tyre` : 'Asnjë ndeshje e luajtur ende'}
                        </div>
                      </div>

                      {/* Matches against them */}
                      <div className="space-y-1.5 text-xs font-mono">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Ndeshjet e fundit në harta:</span>
                        {matchesAgainstThisClan.length > 0 ? (
                          matchesAgainstThisClan.map(m => {
                            const isWin = (m.clan1.tag === userClan.tag && m.clan1.isWinner) || (m.clan2.tag === userClan.tag && m.clan2.isWinner);
                            return (
                              <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                                <span className="font-bold text-white">{m.mapName.toUpperCase().replace('DE_', '')}</span>
                                <span className={isWin ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                                  {isWin ? 'FITORE (13-' + (m.clan1.tag === userClan.tag ? m.clan2.score : m.clan1.score) + ')' : 'HUMBJE (' + (m.clan1.tag === userClan.tag ? m.clan1.score : m.clan2.score) + '-13)'}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-[11px] text-slate-500 italic py-1">Nuk ka përballje të drejtpërdrejta të regjistruara.</div>
                        )}
                      </div>

                      <button
                        onClick={handleSimulateNewClanMatch}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-amber-500 hover:brightness-110 text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow transition active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Simulo Ndeshje vs [{opponent.tag}]</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL 5V5 MATCH SCOREBOARD MODAL */}
      {selectedScoreboardMatch && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0C1019] border border-[#252E42] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1E2638] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 uppercase">
                    5v5 Clan War Scoreboard
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Harta: <strong className="text-white">{selectedScoreboardMatch.mapName.toUpperCase().replace('DE_', '')}</strong> • {selectedScoreboardMatch.duration}
                  </span>
                </div>
                <h3 className="text-xl font-black font-display text-white mt-1">
                  [{selectedScoreboardMatch.clan1.tag}] {selectedScoreboardMatch.clan1.score} - {selectedScoreboardMatch.clan2.score} [{selectedScoreboardMatch.clan2.tag}]
                </h3>
              </div>
              <button
                onClick={() => setSelectedScoreboardMatch(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Clan 1 Players Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-white border-b border-white/5 pb-1">
                <div className="flex items-center gap-2">
                  <img src={selectedScoreboardMatch.clan1.logo} alt="" className="w-4 h-4 rounded" />
                  <span className="text-emerald-400">[{selectedScoreboardMatch.clan1.tag}] {selectedScoreboardMatch.clan1.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">Score: {selectedScoreboardMatch.clan1.score}</span>
              </div>
              <div className="divide-y divide-white/5 font-mono text-xs">
                {(selectedScoreboardMatch.clan1Players || []).map((p, i) => (
                  <div key={p.name} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[10px] w-3">{i+1}.</span>
                      <span className="font-bold text-white">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span>{p.kills}K - {p.deaths}D</span>
                      <span className="text-slate-400">{p.adr} ADR</span>
                      <span className="text-[#A3E635] font-bold">{p.rating} RATING</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clan 2 Players Table */}
            <div className="space-y-2 pt-2 border-t border-[#1E2638]">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-white border-b border-white/5 pb-1">
                <div className="flex items-center gap-2">
                  <img src={selectedScoreboardMatch.clan2.logo} alt="" className="w-4 h-4 rounded" />
                  <span className="text-slate-300">[{selectedScoreboardMatch.clan2.tag}] {selectedScoreboardMatch.clan2.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">Score: {selectedScoreboardMatch.clan2.score}</span>
              </div>
              <div className="divide-y divide-white/5 font-mono text-xs">
                {(selectedScoreboardMatch.clan2Players || []).map((p, i) => (
                  <div key={p.name} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[10px] w-3">{i+1}.</span>
                      <span className="font-bold text-white">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span>{p.kills}K - {p.deaths}D</span>
                      <span className="text-slate-400">{p.adr} ADR</span>
                      <span className="text-[#A3E635] font-bold">{p.rating} RATING</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1E2638]">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recorded on Frankfurt Central CS2 Sub-Tick 128 Dedicated Server</span>
              </div>
              <button
                onClick={() => setSelectedScoreboardMatch(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold cursor-pointer transition"
              >
                Mbyll Scoreboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CLAN MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0C1019] border border-[#252E42] rounded-3xl p-6 shadow-2xl space-y-5 text-left relative">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#FF5500]" />
                <h3 className="text-base font-black font-display text-white">Edit Clan Identity & Tag</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-400">Clan Name</label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Clan Tag (2-5 Letters)</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={draftTag}
                    onChange={(e) => setDraftTag(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-amber-400 font-bold focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Description & Mission</label>
                <textarea
                  rows={3}
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-slate-200 focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400">Select Preset Clan Badge (Caliber Clutch Official)</label>
                  <span className="text-[10px] font-mono text-[#A3E635]">6 Official Badges</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_CLAN_LOGOS.map((badge) => (
                    <div
                      key={badge.id}
                      onClick={() => {
                        sound.playClick();
                        setDraftLogo(badge.url);
                      }}
                      title={badge.name}
                      className={`relative rounded-2xl p-2 bg-[#12141D] cursor-pointer border-2 transition group flex flex-col items-center justify-center ${
                        draftLogo === badge.url
                          ? 'border-[#FF5500] shadow-[0_0_16px_rgba(255,85,0,0.45)] scale-105 bg-[#181B26]'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-slate-500 hover:scale-102'
                      }`}
                    >
                      <img
                        src={badge.url}
                        alt={badge.name}
                        className="w-12 h-12 rounded-xl object-contain drop-shadow"
                      />
                      {draftLogo === badge.url && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF5500] text-black text-[9px] font-black flex items-center justify-center shadow">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2638]">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveClanChanges}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-amber-500 hover:brightness-110 text-black text-xs font-mono font-black cursor-pointer transition shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVITE PLAYER MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleInviteTeammate}
            className="w-full max-w-md bg-[#0C1019] border border-[#252E42] rounded-3xl p-6 shadow-2xl space-y-4 text-left relative"
          >
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#FF5500]" />
                <h3 className="text-base font-black font-display text-white">Invite Player to [{userClan.tag}]</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400">Player GamerTag or Steam ID</label>
                <input
                  type="text"
                  required
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  placeholder="e.g. SimpleAim, STEAM_0:1:..."
                  className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-white focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Tactical Role Assignment</label>
                <select
                  value={selectedRoleForInvite}
                  onChange={(e) => setSelectedRoleForInvite(e.target.value as ClanMember['role'])}
                  className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-white focus:outline-none focus:border-[#FF5500] cursor-pointer"
                >
                  <option value="AWPer">AWPer</option>
                  <option value="Entry Fragger">Entry Fragger</option>
                  <option value="Support">Support</option>
                  <option value="Lurker">Lurker</option>
                  <option value="Substitute">Substitute (Stand-in)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2638]">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-amber-500 hover:brightness-110 text-black text-xs font-mono font-black cursor-pointer transition shadow"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
