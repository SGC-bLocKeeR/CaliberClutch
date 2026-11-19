import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ChevronUp,
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
  BarChart2,
  Upload,
  ExternalLink,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  Gauge,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { getUserFriends, SocialFriend } from '../../services/friendService';
import { CountryFlag } from './CountryFlag';

export const getCountryCode = (countryNameOrCode: string): string => {
  if (!countryNameOrCode) return 'xk';
  const c = countryNameOrCode.trim().toLowerCase();
  const map: Record<string, string> = {
    'kosovo': 'xk',
    'xk': 'xk',
    'albania': 'al',
    'al': 'al',
    'denmark': 'dk',
    'dk': 'dk',
    'united states': 'us',
    'usa': 'us',
    'us': 'us',
    'germany': 'de',
    'de': 'de',
    'brazil': 'br',
    'br': 'br',
    'argentina': 'ar',
    'ar': 'ar',
    'finland': 'fi',
    'fi': 'fi',
    'kazakhstan': 'kz',
    'kz': 'kz',
    'poland': 'pl',
    'pl': 'pl',
    'portugal': 'pt',
    'pt': 'pt',
    'romania': 'ro',
    'ro': 'ro',
    'russia': 'ru',
    'ru': 'ru',
    'sweden': 'se',
    'se': 'se',
    'türkiye': 'tr',
    'turkey': 'tr',
    'tr': 'tr',
    'ukraine': 'ua',
    'ua': 'ua',
    'united kingdom': 'gb',
    'uk': 'gb',
    'gb': 'gb',
    'china': 'cn',
    'cn': 'cn',
    'mongolia': 'mn',
    'mn': 'mn',
    'australia': 'au',
    'au': 'au',
    'north macedonia': 'mk',
    'mk': 'mk',
    'macedonia': 'mk',
    'france': 'fr',
    'fr': 'fr',
    'norway': 'no',
    'no': 'no',
    'slovakia': 'sk',
    'sk': 'sk',
    'estonia': 'ee',
    'ee': 'ee',
    'latvia': 'lv',
    'lv': 'lv',
    'lithuania': 'lt',
    'lt': 'lt',
    'canada': 'ca',
    'ca': 'ca',
    'israel': 'il',
    'il': 'il',
    'south africa': 'za',
    'za': 'za',
    'uruguay': 'uy',
    'uy': 'uy',
    'spain': 'es',
    'es': 'es',
    'chile': 'cl',
    'cl': 'cl',
    'hungary': 'hu',
    'hu': 'hu',
    'czechia': 'cz',
    'czech republic': 'cz',
    'cz': 'cz',
    'bosnia': 'ba',
    'bosnia and herzegovina': 'ba',
    'ba': 'ba',
    'belarus': 'by',
    'by': 'by',
    'belgium': 'be',
    'be': 'be',
  };
  return map[c] || (c.length === 2 ? c : 'xk');
};

export const emojiToCountryCode = (emoji: string): string => {
  if (!emoji) return 'xk';
  const codePoints = [...emoji].map(c => c.codePointAt(0) || 0);
  if (codePoints.length >= 2 && codePoints[0] >= 0x1F1E6 && codePoints[0] <= 0x1F1FF) {
    return String.fromCharCode(
      codePoints[0] - 0x1F1E6 + 65,
      codePoints[1] - 0x1F1E6 + 65
    ).toLowerCase();
  }
  return getCountryCode(emoji);
};

export const HLTV_TEAM_PROFILES: Record<string, string> = {
  'furia': 'https://www.hltv.org/team/8297/furia',
  'mouz': 'https://www.hltv.org/team/4494/mouz',
  'spirit': 'https://www.hltv.org/team/7020/spirit',
  'vitality': 'https://www.hltv.org/team/9565/vitality',
  'falcons': 'https://www.hltv.org/team/11283/falcons',
  'aurora': 'https://www.hltv.org/team/11861/aurora',
  'betboom': 'https://www.hltv.org/team/11880/betboom',
  'natus vincere': 'https://www.hltv.org/team/4608/natus-vincere',
  'navi': 'https://www.hltv.org/team/4608/natus-vincere',
  'fut': 'https://www.hltv.org/team/11796/fut',
  'the mongolz': 'https://www.hltv.org/team/6248/the-mongolz',
  'mongolz': 'https://www.hltv.org/team/6248/the-mongolz',
  'nemiga': 'https://www.hltv.org/team/7969/nemiga',
  'g2': 'https://www.hltv.org/team/5995/g2',
  'parivision': 'https://www.hltv.org/team/12467/parivision',
  '1win': 'https://www.hltv.org/team/10621/1win',
  'team liquid': 'https://www.hltv.org/team/5973/liquid',
  'liquid': 'https://www.hltv.org/team/5973/liquid',
  'ninjas in pyjamas': 'https://www.hltv.org/team/4411/ninjas-in-pyjamas',
  'nip': 'https://www.hltv.org/team/4411/ninjas-in-pyjamas',
  'faze': 'https://www.hltv.org/team/6667/faze',
  'astralis': 'https://www.hltv.org/team/6665/astralis',
  'complexity': 'https://www.hltv.org/team/5005/complexity',
  'flyquest': 'https://www.hltv.org/team/12774/flyquest',
  'pain': 'https://www.hltv.org/team/4773/pain',
  'eternal fire': 'https://www.hltv.org/team/11251/eternal-fire',
  'heroic': 'https://www.hltv.org/team/7175/heroic',
  '9z': 'https://www.hltv.org/team/9996/9z',
  'fnatic': 'https://www.hltv.org/team/4991/fnatic',
  'saw': 'https://www.hltv.org/team/10567/saw',
  'nexus gaming': 'https://www.hltv.org/team/6457/nexus',
  'bad news eagles': 'https://www.hltv.org/team/11518/bad-news-eagles',
  'bne': 'https://www.hltv.org/team/11518/bad-news-eagles',
  'big': 'https://www.hltv.org/team/7532/big',
  'monte': 'https://www.hltv.org/team/11811/monte',
  'rebels': 'https://www.hltv.org/team/12560/rebels',
  'avangar': 'https://www.hltv.org/team/8120/avangar',
  'havu': 'https://www.hltv.org/team/7865/havu',
  'm80': 'https://www.hltv.org/team/12376/m80',
  'tyloo': 'https://www.hltv.org/team/4863/tyloo',
  'bestia': 'https://www.hltv.org/team/12144/bestia',
};

export const getHltvProfileUrl = (clanName: string): string => {
  const key = clanName.trim().toLowerCase();
  return HLTV_TEAM_PROFILES[key] || `https://www.hltv.org/search?term=${encodeURIComponent(clanName)}`;
};

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

export interface ClanInvite {
  id: string;
  clanId: string;
  clanName: string;
  clanTag: string;
  clanLogo: string;
  senderGamerTag: string;
  friendName: string;
  friendAvatar: string;
  friendLevel: number;
  friendElo: number;
  friendCountry: string;
  friendFlag: string;
  role: ClanMember['role'];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
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

// Authentic FACEIT circular level ring badge (Yellow for 6-7, Orange for 8-9, Red for 10)
export const FaceitLevelRing: React.FC<{ level: number; size?: number }> = ({ level, size = 26 }) => {
  const getArcColor = (lvl: number) => {
    if (lvl === 10) return '#EF4444'; // Crimson Red (Master)
    if (lvl >= 8) return '#06B6D4';  // Cyber Ice Cyan (Elite) - no Faceit orange
    if (lvl >= 6) return '#A3E635';  // Electric Lime (High) - no Faceit yellow
    if (lvl >= 4) return '#10B981';  // Emerald Green
    return '#38BDF8';               // Sky Cyan - no Faceit slate gray
  };

  const color = getArcColor(level);
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0.2, level / 10));
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div 
      className="relative flex items-center justify-center shrink-0" 
      style={{ width: size, height: size }}
      title={`Skill Level ${level}`}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#0B0E18"
          stroke="#1E2740"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute font-mono font-black text-white text-[10px]">
        {level}
      </span>
    </div>
  );
};

export interface FaceitScoreboardPlayer {
  id: string;
  name: string;
  avatar: string;
  factionIcon?: 'triangle' | 'diamond';
  level: number;
  elo: number;
  rating: string;
  hasMvpStar?: boolean;
  swing: string;
  isPositiveSwing?: boolean;
  kills: number;
  deaths: number;
  assists: number;
  adr: string;
  kd: string;
  kr: string;
  hs: number;
  hsPercentage: string;
  k5: number;
  k4: number;
  k3: number;
  k2: number;
  mvps: number;
  isCurrentUser?: boolean;
}

export interface ClanMatch {
  id: string;
  date: string;         // e.g. "Sun 15 Nov"
  time: string;         // e.g. "21:07"
  isWin: boolean;
  scoreDisplay: string; // e.g. "3 : 13" or "13 : 4"
  userScore: number;
  opponentScore: number;
  userElo: number;
  eloDelta: number;
  userRating: string;
  userStats: {
    kills: number;
    deaths: number;
    assists: number;
    kd: string;
    adr: string;
  };
  mapName: string;
  mapDisplayName: string; // "Dust 2", "Inferno", "Mirage"
  mapImage: string;
  server: string;
  timeAgo: string;
  duration: string;
  eloChange: number;
  prizeEarned?: string;
  tournamentOrEvent?: string;

  // Authentic 1:1 FACEIT Scoreboard Data
  team1: {
    name: string;
    avatar: string;
    score: number;
    firstHalf: number;
    secondHalf: number;
    avgLevel: number;
    avgElo: number;
    players: FaceitScoreboardPlayer[];
  };
  team2: {
    name: string;
    avatar: string;
    score: number;
    firstHalf: number;
    secondHalf: number;
    avgLevel: number;
    avgElo: number;
    players: FaceitScoreboardPlayer[];
  };

  // Backwards compatibility clan data
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
  // MATCH 1: Dust 2 Defeat 3 : 13 (Exact 1:1 Data from User Reference Image 0 & 2)
  {
    id: 'cm-dust2-faceit',
    date: 'Sun 15 Nov',
    time: '21:07',
    isWin: false,
    scoreDisplay: '3 : 13',
    userScore: 3,
    opponentScore: 13,
    userElo: 1381,
    eloDelta: -28,
    prizeEarned: '-$25.00',
    userRating: '0.67',
    userStats: {
      kills: 8,
      deaths: 14,
      assists: 3,
      kd: '0.57',
      adr: '54.3'
    },
    mapName: 'de_dust2',
    mapDisplayName: 'Dust 2',
    mapImage: '/images/maps/cs2_dust2.png',
    server: 'Frankfurt Central • 128-Tick Dedicated',
    timeAgo: 'Sun 15 Nov',
    duration: '32 mins',
    eloChange: 28,
    tournamentOrEvent: 'Caliber Clutch 5v5 Clan Championship',

    team1: {
      name: 'team_SiLVERiNYO',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      score: 13,
      firstHalf: 9,
      secondHalf: 4,
      avgLevel: 7,
      avgElo: 1410,
      players: [
        {
          id: 'p-sil-1',
          name: 'mnLReKt',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 9,
          elo: 1756,
          rating: '1.84',
          hasMvpStar: true,
          swing: '+12.13%',
          isPositiveSwing: true,
          kills: 17,
          deaths: 7,
          assists: 4,
          adr: '98.4',
          kd: '2.43',
          kr: '1.06',
          hs: 13,
          hsPercentage: '76.5%',
          k5: 0,
          k4: 0,
          k3: 2,
          k2: 4,
          mvps: 5
        },
        {
          id: 'p-sil-2',
          name: 'oTheRform',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 5,
          elo: 1192,
          rating: '1.44',
          swing: '+5.38%',
          isPositiveSwing: true,
          kills: 15,
          deaths: 7,
          assists: 2,
          adr: '82.5',
          kd: '2.14',
          kr: '0.94',
          hs: 8,
          hsPercentage: '53.3%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 4,
          mvps: 1
        },
        {
          id: 'p-sil-3',
          name: 'beYYaa',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 5,
          elo: 1115,
          rating: '1.37',
          swing: '+4.12%',
          isPositiveSwing: true,
          kills: 14,
          deaths: 10,
          assists: 6,
          adr: '101.8',
          kd: '1.40',
          kr: '0.88',
          hs: 7,
          hsPercentage: '50.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 4,
          mvps: 4
        },
        {
          id: 'p-sil-4',
          name: 'crni_exec',
          avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 6,
          elo: 1233,
          rating: '1.19',
          swing: '+1.53%',
          isPositiveSwing: true,
          kills: 12,
          deaths: 9,
          assists: 7,
          adr: '76.4',
          kd: '1.33',
          kr: '0.75',
          hs: 7,
          hsPercentage: '58.3%',
          k5: 0,
          k4: 0,
          k3: 1,
          k2: 3,
          mvps: 2
        },
        {
          id: 'p-sil-5',
          name: 'SiLVERiNYO',
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 9,
          elo: 1756,
          rating: '1.18',
          swing: '+1.00%',
          isPositiveSwing: true,
          kills: 10,
          deaths: 9,
          assists: 5,
          adr: '76.4',
          kd: '1.11',
          kr: '0.63',
          hs: 7,
          hsPercentage: '70.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 2,
          mvps: 1
        }
      ]
    },

    team2: {
      name: 'team_edd1-',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      score: 3,
      firstHalf: 3,
      secondHalf: 0,
      avgLevel: 6,
      avgElo: 1331,
      players: [
        {
          id: 'p-edd-1',
          name: '_Usama',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 7,
          elo: 1390,
          rating: '1.23',
          swing: '+2.23%',
          isPositiveSwing: true,
          kills: 14,
          deaths: 13,
          assists: 2,
          adr: '102.6',
          kd: '1.08',
          kr: '0.88',
          hs: 10,
          hsPercentage: '71.4%',
          k5: 0,
          k4: 0,
          k3: 1,
          k2: 3,
          mvps: 1
        },
        {
          id: 'p-edd-2',
          name: 'blackbars1',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 6,
          elo: 1313,
          rating: '1.00',
          swing: '-0.48%',
          isPositiveSwing: false,
          kills: 13,
          deaths: 13,
          assists: 1,
          adr: '85.2',
          kd: '1.00',
          kr: '0.81',
          hs: 7,
          hsPercentage: '53.8%',
          k5: 0,
          k4: 1,
          k3: 0,
          k2: 1,
          mvps: 1
        },
        {
          id: 'p-edd-3',
          name: 'bLocKeeRz',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 7,
          elo: 1381,
          rating: '0.67',
          swing: '-7.66%',
          isPositiveSwing: false,
          isCurrentUser: true,
          kills: 8,
          deaths: 14,
          assists: 3,
          adr: '54.3',
          kd: '0.57',
          kr: '0.50',
          hs: 3,
          hsPercentage: '37.5%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 3,
          mvps: 1
        },
        {
          id: 'p-edd-4',
          name: 'Ar7isti',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 4,
          elo: 1024,
          rating: '0.65',
          swing: '-8.31%',
          isPositiveSwing: false,
          kills: 5,
          deaths: 15,
          assists: 4,
          adr: '43.6',
          kd: '0.33',
          kr: '0.31',
          hs: 1,
          hsPercentage: '20.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 0,
          mvps: 0
        },
        {
          id: 'p-edd-5',
          name: 'edd1-',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 8,
          elo: 1548,
          rating: '0.58',
          swing: '-10.22%',
          isPositiveSwing: false,
          kills: 2,
          deaths: 13,
          assists: 3,
          adr: '24.1',
          kd: '0.15',
          kr: '0.13',
          hs: 0,
          hsPercentage: '0.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 0,
          mvps: 0
        }
      ]
    },

    clan1: {
      id: 'team-silv',
      name: 'team_SiLVERiNYO',
      tag: 'SILVER',
      logo: '/images/clan_badges/badge_caliber_gold.svg',
      score: 13,
      isWinner: true
    },
    clan2: {
      id: 'team-edd',
      name: 'team_edd1-',
      tag: 'EDD1',
      logo: '/images/clan_badges/badge_caliber_lime.svg',
      score: 3,
      isWinner: false
    },
    mvp: {
      name: 'mnLReKt',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      kills: 17,
      deaths: 7,
      rating: '1.84',
      clanTag: 'SILVER'
    },
    clan1Players: [
      { name: 'mnLReKt', kills: 17, deaths: 7, assists: 4, adr: '98.4', rating: '1.84' },
      { name: 'oTheRform', kills: 15, deaths: 7, assists: 2, adr: '82.5', rating: '1.44' },
      { name: 'beYYaa', kills: 14, deaths: 10, assists: 6, adr: '101.8', rating: '1.37' },
      { name: 'crni_exec', kills: 12, deaths: 9, assists: 7, adr: '76.4', rating: '1.19' },
      { name: 'SiLVERiNYO', kills: 10, deaths: 9, assists: 5, adr: '76.4', rating: '1.18' }
    ],
    clan2Players: [
      { name: '_Usama', kills: 14, deaths: 13, assists: 2, adr: '102.6', rating: '1.23' },
      { name: 'blackbars1', kills: 13, deaths: 13, assists: 1, adr: '85.2', rating: '1.00' },
      { name: 'bLocKeeRz', kills: 8, deaths: 14, assists: 3, adr: '54.3', rating: '0.67' },
      { name: 'Ar7isti', kills: 5, deaths: 15, assists: 4, adr: '43.6', rating: '0.65' },
      { name: 'edd1-', kills: 2, deaths: 13, assists: 3, adr: '24.1', rating: '0.58' }
    ]
  },

  // MATCH 2: Inferno Victory 13 : 4 (Exact 1:1 Data from User Reference Image 1)
  {
    id: 'cm-inferno-faceit',
    date: 'Sun 15 Nov',
    time: '20:36',
    isWin: true,
    scoreDisplay: '13 : 4',
    userScore: 13,
    opponentScore: 4,
    userElo: 1409,
    eloDelta: 29,
    prizeEarned: '+$120.00',
    userRating: '1.30',
    userStats: {
      kills: 15,
      deaths: 9,
      assists: 10,
      kd: '1.67',
      adr: '108.5'
    },
    mapName: 'de_inferno',
    mapDisplayName: 'Inferno',
    mapImage: '/images/maps/cs2_inferno.png',
    server: 'Frankfurt Central • 128-Tick Dedicated',
    timeAgo: 'Sun 15 Nov',
    duration: '28 mins',
    eloChange: 29,
    tournamentOrEvent: 'Caliber Clutch 5v5 Clan Championship',

    team1: {
      name: 'team_edd1-',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      score: 13,
      firstHalf: 9,
      secondHalf: 4,
      avgLevel: 7,
      avgElo: 1410,
      players: [
        {
          id: 'p-inf-1',
          name: '_Usama',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 7,
          elo: 1418,
          rating: '1.48',
          hasMvpStar: true,
          swing: '+10.15%',
          isPositiveSwing: true,
          kills: 18,
          deaths: 8,
          assists: 4,
          adr: '112.4',
          kd: '2.25',
          kr: '1.06',
          hs: 14,
          hsPercentage: '77.8%',
          k5: 0,
          k4: 1,
          k3: 1,
          k2: 4,
          mvps: 4
        },
        {
          id: 'p-inf-2',
          name: 'bLocKeeRz',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 7,
          elo: 1409,
          rating: '1.30',
          isCurrentUser: true,
          swing: '+8.45%',
          isPositiveSwing: true,
          kills: 15,
          deaths: 9,
          assists: 10,
          adr: '108.5',
          kd: '1.67',
          kr: '0.88',
          hs: 11,
          hsPercentage: '73.3%',
          k5: 0,
          k4: 0,
          k3: 2,
          k2: 3,
          mvps: 3
        },
        {
          id: 'p-inf-3',
          name: 'edd1-',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 8,
          elo: 1572,
          rating: '1.25',
          swing: '+4.20%',
          isPositiveSwing: true,
          kills: 14,
          deaths: 9,
          assists: 6,
          adr: '88.0',
          kd: '1.56',
          kr: '0.82',
          hs: 9,
          hsPercentage: '64.3%',
          k5: 0,
          k4: 0,
          k3: 1,
          k2: 3,
          mvps: 2
        },
        {
          id: 'p-inf-4',
          name: 'blackbars1',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 6,
          elo: 1338,
          rating: '1.15',
          swing: '+2.10%',
          isPositiveSwing: true,
          kills: 11,
          deaths: 9,
          assists: 5,
          adr: '74.2',
          kd: '1.22',
          kr: '0.65',
          hs: 6,
          hsPercentage: '54.5%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 3,
          mvps: 2
        },
        {
          id: 'p-inf-5',
          name: 'Ar7isti',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 4,
          elo: 1050,
          rating: '1.05',
          swing: '+0.80%',
          isPositiveSwing: true,
          kills: 10,
          deaths: 10,
          assists: 3,
          adr: '68.5',
          kd: '1.00',
          kr: '0.59',
          hs: 5,
          hsPercentage: '50.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 2,
          mvps: 2
        }
      ]
    },

    team2: {
      name: 'team_karrigan-x',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      score: 4,
      firstHalf: 3,
      secondHalf: 1,
      avgLevel: 7,
      avgElo: 1395,
      players: [
        {
          id: 'p-kar-1',
          name: 'vortex_pro',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 7,
          elo: 1390,
          rating: '1.10',
          swing: '+0.50%',
          isPositiveSwing: true,
          kills: 13,
          deaths: 13,
          assists: 3,
          adr: '81.2',
          kd: '1.00',
          kr: '0.76',
          hs: 7,
          hsPercentage: '53.8%',
          k5: 0,
          k4: 0,
          k3: 1,
          k2: 2,
          mvps: 2
        },
        {
          id: 'p-kar-2',
          name: 'valde_fan',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 6,
          elo: 1320,
          rating: '0.85',
          swing: '-3.20%',
          isPositiveSwing: false,
          kills: 10,
          deaths: 14,
          assists: 2,
          adr: '62.4',
          kd: '0.71',
          kr: '0.59',
          hs: 5,
          hsPercentage: '50.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 2,
          mvps: 1
        },
        {
          id: 'p-kar-3',
          name: 'dexter_aim',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 7,
          elo: 1410,
          rating: '0.78',
          swing: '-4.60%',
          isPositiveSwing: false,
          kills: 9,
          deaths: 14,
          assists: 4,
          adr: '58.1',
          kd: '0.64',
          kr: '0.53',
          hs: 4,
          hsPercentage: '44.4%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 1,
          mvps: 1
        },
        {
          id: 'p-kar-4',
          name: 'stavn_cs',
          avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 8,
          elo: 1510,
          rating: '0.65',
          swing: '-6.80%',
          isPositiveSwing: false,
          kills: 7,
          deaths: 15,
          assists: 2,
          adr: '48.0',
          kd: '0.47',
          kr: '0.41',
          hs: 3,
          hsPercentage: '42.9%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 1,
          mvps: 0
        },
        {
          id: 'p-kar-5',
          name: 'karrigan-x',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 7,
          elo: 1345,
          rating: '0.52',
          swing: '-9.10%',
          isPositiveSwing: false,
          kills: 6,
          deaths: 16,
          assists: 5,
          adr: '41.5',
          kd: '0.38',
          kr: '0.35',
          hs: 2,
          hsPercentage: '33.3%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 1,
          mvps: 0
        }
      ]
    },

    clan1: {
      id: 'team-edd',
      name: 'team_edd1-',
      tag: 'EDD1',
      logo: '/images/clan_badges/badge_caliber_lime.svg',
      score: 13,
      isWinner: true
    },
    clan2: {
      id: 'team-kar',
      name: 'team_karrigan-x',
      tag: 'FAZE',
      logo: '/images/clan_badges/badge_caliber_fire.svg',
      score: 4,
      isWinner: false
    },
    mvp: {
      name: '_Usama',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      kills: 18,
      deaths: 8,
      rating: '1.48',
      clanTag: 'EDD1'
    },
    clan1Players: [
      { name: '_Usama', kills: 18, deaths: 8, assists: 4, adr: '112.4', rating: '1.48' },
      { name: 'bLocKeeRz', kills: 15, deaths: 9, assists: 10, adr: '108.5', rating: '1.30' },
      { name: 'edd1-', kills: 14, deaths: 9, assists: 6, adr: '88.0', rating: '1.25' },
      { name: 'blackbars1', kills: 11, deaths: 9, assists: 5, adr: '74.2', rating: '1.15' },
      { name: 'Ar7isti', kills: 10, deaths: 10, assists: 3, adr: '68.5', rating: '1.05' }
    ],
    clan2Players: [
      { name: 'vortex_pro', kills: 13, deaths: 13, assists: 3, adr: '81.2', rating: '1.10' },
      { name: 'valde_fan', kills: 10, deaths: 14, assists: 2, adr: '62.4', rating: '0.85' },
      { name: 'dexter_aim', kills: 9, deaths: 14, assists: 4, adr: '58.1', rating: '0.78' },
      { name: 'stavn_cs', kills: 7, deaths: 15, assists: 2, adr: '48.0', rating: '0.65' },
      { name: 'karrigan-x', kills: 6, deaths: 16, assists: 5, adr: '41.5', rating: '0.52' }
    ]
  },

  // MATCH 3: Mirage Thriller 13 : 11 (CC vs Bad News Eagles Academy)
  {
    id: 'cm-mirage-faceit',
    date: 'Sun 15 Nov',
    time: '18:45',
    isWin: true,
    scoreDisplay: '13 : 11',
    userScore: 13,
    opponentScore: 11,
    userElo: 1380,
    eloDelta: 25,
    prizeEarned: '+$90.00',
    userRating: '1.28',
    userStats: {
      kills: 21,
      deaths: 15,
      assists: 4,
      kd: '1.40',
      adr: '94.2'
    },
    mapName: 'de_mirage',
    mapDisplayName: 'Mirage',
    mapImage: '/images/maps/cs2_mirage.png',
    server: 'Frankfurt Central • 128-Tick Dedicated',
    timeAgo: 'Sun 15 Nov',
    duration: '34 mins',
    eloChange: 25,
    tournamentOrEvent: 'Clan 5v5 Match',

    team1: {
      name: 'CC Competitive Squad',
      avatar: '/images/clan_badges/badge_caliber_lime.svg',
      score: 13,
      firstHalf: 7,
      secondHalf: 6,
      avgLevel: 8,
      avgElo: 1860,
      players: [
        {
          id: 'p-cc-1',
          name: 'M14',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 9,
          elo: 1950,
          rating: '1.42',
          hasMvpStar: true,
          swing: '+9.40%',
          isPositiveSwing: true,
          kills: 24,
          deaths: 14,
          assists: 6,
          adr: '108.4',
          kd: '1.71',
          kr: '1.00',
          hs: 16,
          hsPercentage: '66.7%',
          k5: 0,
          k4: 1,
          k3: 2,
          k2: 4,
          mvps: 4
        },
        {
          id: 'p-cc-2',
          name: 'juanflatroo',
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 8,
          elo: 1820,
          rating: '1.28',
          isCurrentUser: true,
          swing: '+6.10%',
          isPositiveSwing: true,
          kills: 21,
          deaths: 15,
          assists: 4,
          adr: '94.2',
          kd: '1.40',
          kr: '0.88',
          hs: 12,
          hsPercentage: '57.1%',
          k5: 0,
          k4: 0,
          k3: 1,
          k2: 4,
          mvps: 3
        },
        {
          id: 'p-cc-3',
          name: 's1mple',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 10,
          elo: 2350,
          rating: '1.18',
          swing: '+3.50%',
          isPositiveSwing: true,
          kills: 19,
          deaths: 16,
          assists: 5,
          adr: '88.5',
          kd: '1.19',
          kr: '0.79',
          hs: 13,
          hsPercentage: '68.4%',
          k5: 0,
          k4: 0,
          k3: 1,
          k2: 3,
          mvps: 2
        },
        {
          id: 'p-cc-4',
          name: 'M18',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 7,
          elo: 1450,
          rating: '1.02',
          swing: '+0.20%',
          isPositiveSwing: true,
          kills: 16,
          deaths: 17,
          assists: 8,
          adr: '76.1',
          kd: '0.94',
          kr: '0.67',
          hs: 8,
          hsPercentage: '50.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 3,
          mvps: 1
        },
        {
          id: 'p-cc-5',
          name: 'ZywOo',
          avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'diamond',
          level: 8,
          elo: 1730,
          rating: '0.98',
          swing: '-0.80%',
          isPositiveSwing: false,
          kills: 15,
          deaths: 16,
          assists: 7,
          adr: '74.8',
          kd: '0.94',
          kr: '0.63',
          hs: 9,
          hsPercentage: '60.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 2,
          mvps: 1
        }
      ]
    },

    team2: {
      name: 'Bad News Eagles Academy',
      avatar: '/images/clan_badges/badge_caliber_gold.svg',
      score: 11,
      firstHalf: 5,
      secondHalf: 6,
      avgLevel: 8,
      avgElo: 1810,
      players: [
        {
          id: 'p-bne-1',
          name: 'rigoN-jr',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 9,
          elo: 1910,
          rating: '1.24',
          swing: '+4.50%',
          isPositiveSwing: true,
          kills: 22,
          deaths: 18,
          assists: 4,
          adr: '96.5',
          kd: '1.22',
          kr: '0.92',
          hs: 14,
          hsPercentage: '63.6%',
          k5: 0,
          k4: 0,
          k3: 2,
          k2: 3,
          mvps: 2
        },
        {
          id: 'p-bne-2',
          name: 'sener1-star',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 8,
          elo: 1790,
          rating: '1.06',
          swing: '+1.10%',
          isPositiveSwing: true,
          kills: 18,
          deaths: 19,
          assists: 5,
          adr: '84.2',
          kd: '0.95',
          kr: '0.75',
          hs: 9,
          hsPercentage: '50.0%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 3,
          mvps: 2
        },
        {
          id: 'p-bne-3',
          name: 'gxx-aim',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 8,
          elo: 1780,
          rating: '0.98',
          swing: '-0.90%',
          isPositiveSwing: false,
          kills: 16,
          deaths: 19,
          assists: 3,
          adr: '79.1',
          kd: '0.84',
          kr: '0.67',
          hs: 10,
          hsPercentage: '62.5%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 2,
          mvps: 1
        },
        {
          id: 'p-bne-4',
          name: 'juan-pro',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 7,
          elo: 1420,
          rating: '0.88',
          swing: '-3.10%',
          isPositiveSwing: false,
          kills: 14,
          deaths: 20,
          assists: 6,
          adr: '68.4',
          kd: '0.70',
          kr: '0.58',
          hs: 8,
          hsPercentage: '57.1%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 2,
          mvps: 1
        },
        {
          id: 'p-bne-5',
          name: 'devilwalk',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          factionIcon: 'triangle',
          level: 6,
          elo: 1250,
          rating: '0.74',
          swing: '-6.20%',
          isPositiveSwing: false,
          kills: 11,
          deaths: 21,
          assists: 4,
          adr: '59.0',
          kd: '0.52',
          kr: '0.46',
          hs: 6,
          hsPercentage: '54.5%',
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 1,
          mvps: 0
        }
      ]
    },

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
    mvp: {
      name: 'M14',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
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
  }
];

export interface VortexClanHubProps {
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

export const PRESET_CLAN_LOGOS: PresetBadge[] = [
  {
    id: 'caliber-neon',
    name: 'CaliberClutch Neon Tactical Crosshair',
    url: '/images/clan_badges/badge_caliber_lime.svg'
  },
  {
    id: 'caliber-cyan',
    name: 'CaliberClutch Cyber Apex Hexagon',
    url: '/images/clan_badges/badge_caliber_cyan.svg'
  },
  {
    id: 'caliber-gold',
    name: 'CaliberClutch Champion Star Shield',
    url: '/images/clan_badges/badge_caliber_gold.svg'
  },
  {
    id: 'caliber-crimson',
    name: 'CaliberClutch Strike Combat Diamond',
    url: '/images/clan_badges/badge_caliber_crimson.svg'
  },
  {
    id: 'caliber-purple',
    name: 'CaliberClutch Stealth Wing Crest',
    url: '/images/clan_badges/badge_caliber_purple.svg'
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

export interface HltvClanEntry {
  id: string;
  rank: number;
  prevRank: number;
  delta?: number;
  name: string;
  tag: string;
  logo: string;
  country: string;
  flag: string;
  points: number;
  vrsPoints: number;
  valveStatus: 'Legends' | 'Challengers' | 'Contenders' | 'Open';
  vrsInviteStage?: 'Elimination Stage' | 'Opening Stage' | 'Closed Qualifier' | 'Open Qualifier';
  prizeEarned: number;
  matches: number;
  wins: number;
  losses: number;
  winrate: string;
  tournamentsWon: number;
  avgElo: number;
  recentForm: ('W' | 'L')[];
  region: 'Balkans' | 'Europe' | 'North America' | 'South America' | 'Asia' | 'Oceania' | 'Nordics';
  verified?: boolean;
  roster: { name: string; role: string; flag: string; level: number; elo: number; avatar?: string; countryCode?: string }[];
}

export const REGIONAL_COLUMNS = {
  column1: {
    northAmerica: [
      { name: 'United States', code: 'us', flag: '🇺🇸', continent: 'North America' as const },
    ],
    southAmerica: [
      { name: 'Argentina', code: 'ar', flag: '🇦🇷', continent: 'South America' as const },
      { name: 'Brazil', code: 'br', flag: '🇧🇷', continent: 'South America' as const },
    ],
    europe: [
      { name: 'Kosovo', code: 'xk', flag: '🇽🇰', continent: 'Europe' as const },
      { name: 'Albania', code: 'al', flag: '🇦🇱', continent: 'Europe' as const },
    ],
  },
  column2: {
    europe: [
      { name: 'Denmark', code: 'dk', flag: '🇩🇰', continent: 'Europe' as const },
      { name: 'Finland', code: 'fi', flag: '🇫🇮', continent: 'Europe' as const },
      { name: 'Germany', code: 'de', flag: '🇩🇪', continent: 'Europe' as const },
      { name: 'Kazakhstan', code: 'kz', flag: '🇰🇿', continent: 'Europe' as const },
      { name: 'Poland', code: 'pl', flag: '🇵🇱', continent: 'Europe' as const },
      { name: 'Portugal', code: 'pt', flag: '🇵🇹', continent: 'Europe' as const },
      { name: 'Romania', code: 'ro', flag: '🇷🇴', continent: 'Europe' as const },
      { name: 'Russia', code: 'ru', flag: '🇷🇺', continent: 'Europe' as const },
      { name: 'Sweden', code: 'se', flag: '🇸🇪', continent: 'Europe' as const },
      { name: 'Türkiye', code: 'tr', flag: '🇹🇷', continent: 'Europe' as const },
    ],
  },
  column3: {
    europe: [
      { name: 'Ukraine', code: 'ua', flag: '🇺🇦', continent: 'Europe' as const },
      { name: 'United Kingdom', code: 'gb', flag: '🇬🇧', continent: 'Europe' as const },
    ],
    asia: [
      { name: 'China', code: 'cn', flag: '🇨🇳', continent: 'Asia' as const },
      { name: 'Mongolia', code: 'mn', flag: '🇲🇳', continent: 'Asia' as const },
    ],
    oceania: [
      { name: 'Australia', code: 'au', flag: '🇦🇺', continent: 'Oceania' as const },
    ],
  },
};

export const HLTV_CLANS_DATA: HltvClanEntry[] = [
  {
    id: 'furia-clan',
    rank: 1,
    prevRank: 3,
    delta: 2,
    name: 'FURIA',
    tag: 'FUR',
    logo: '/images/teams/furia.svg',
    country: 'Brazil',
    flag: '🇧🇷',
    points: 960,
    vrsPoints: 1920,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'South America',
    verified: true,
    roster: [
      { name: 'FalleN', role: 'IGL / Captain', flag: '🇧🇷', level: 10, elo: 2910, countryCode: 'br' },
      { name: 'yuurih', role: 'Entry Fragger', flag: '🇧🇷', level: 10, elo: 2860, countryCode: 'br' },
      { name: 'YEKINDAR', role: 'Entry Fragger', flag: '🇱🇻', level: 10, elo: 2880, countryCode: 'lv' },
      { name: 'KSCERATO', role: 'Rifler', flag: '🇧🇷', level: 10, elo: 3010, countryCode: 'br' },
      { name: 'molodoy', role: 'Support', flag: '🇰🇿', level: 9, elo: 2640, countryCode: 'kz' },
    ],
  },
  {
    id: 'mouz-clan',
    rank: 2,
    prevRank: 1,
    delta: -1,
    name: 'MOUZ',
    tag: 'MOUZ',
    logo: '/images/teams/mouz.png',
    country: 'Germany',
    flag: '🇩🇪',
    points: 808,
    vrsPoints: 1616,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'torzsi', role: 'AWPer', flag: '🇭🇺', level: 10, elo: 2880, avatar: '/images/players/torzsi_photo.png', countryCode: 'hu' },
      { name: 'Spinx', role: 'Lurker', flag: '🇮🇱', level: 10, elo: 2910, avatar: '/images/players/spinx_photo.png', countryCode: 'il' },
      { name: 'xertioN', role: 'Entry Fragger', flag: '🇮🇱', level: 10, elo: 2850, avatar: '/images/players/xertion_photo.png', countryCode: 'il' },
      { name: 'PR', role: 'Rifler', flag: '🇨🇿', level: 9, elo: 2720, avatar: '/images/players/pr_photo.png', countryCode: 'cz' },
      { name: 'xelex', role: 'Support', flag: '🇭🇺', level: 9, elo: 2690, avatar: '/images/players/xelex_photo.png', countryCode: 'hu' },
    ],
  },
  {
    id: 'spirit-clan',
    rank: 3,
    prevRank: 4,
    delta: 1,
    name: 'Spirit',
    tag: 'TS',
    logo: '/images/teams/spirit.png',
    country: 'Russia',
    flag: '🇷🇺',
    points: 766,
    vrsPoints: 1532,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'sh1ro', role: 'AWPer', flag: '🇷🇺', level: 10, elo: 2950, countryCode: 'ru' },
      { name: 'magixx', role: 'Support', flag: '🇷🇺', level: 9, elo: 2480, countryCode: 'ru' },
      { name: 'tN1R', role: 'Rifler', flag: '🇷🇺', level: 9, elo: 2540, countryCode: 'ru' },
      { name: 'zont1x', role: 'Anchor', flag: '🇺🇦', level: 9, elo: 2560, countryCode: 'ua' },
      { name: 'donk', role: 'Entry Fragger', flag: '🇷🇺', level: 10, elo: 3180, countryCode: 'ru' },
    ],
  },
  {
    id: 'vitality-clan',
    rank: 4,
    prevRank: 3,
    delta: -1,
    name: 'Vitality',
    tag: 'VIT',
    logo: '/images/teams/vitality.png',
    country: 'France',
    flag: '🇫🇷',
    points: 638,
    vrsPoints: 1276,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'apEX', role: 'IGL / Captain', flag: '🇫🇷', level: 10, elo: 2720, countryCode: 'fr' },
      { name: 'ropz', role: 'Lurker', flag: '🇪🇪', level: 10, elo: 2920, countryCode: 'ee' },
      { name: 'ZywOo', role: 'AWPer', flag: '🇫🇷', level: 10, elo: 3240, countryCode: 'fr' },
      { name: 'flameZ', role: 'Entry Fragger', flag: '🇮🇱', level: 10, elo: 2820, countryCode: 'il' },
      { name: 'mezii', role: 'Support', flag: '🇬🇧', level: 9, elo: 2680, countryCode: 'gb' },
    ],
  },
  {
    id: 'falcons-clan',
    rank: 5,
    prevRank: 6,
    delta: 1,
    name: 'Falcons',
    tag: 'FLC',
    logo: '/images/teams/falcons.png',
    country: 'Denmark',
    flag: '🇩🇰',
    points: 448,
    vrsPoints: 896,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'karrigan', role: 'IGL / Captain', flag: '🇩🇰', level: 10, elo: 2680, countryCode: 'dk' },
      { name: 'NiKo', role: 'Entry Fragger', flag: '🇧🇦', level: 10, elo: 2980, countryCode: 'ba' },
      { name: 'TeSeS', role: 'Anchor', flag: '🇩🇰', level: 9, elo: 2640, countryCode: 'dk' },
      { name: 'm0NESY', role: 'AWPer', flag: '🇷🇺', level: 10, elo: 3120, countryCode: 'ru' },
      { name: 'kyousuke', role: 'Rifler', flag: '🇷🇺', level: 9, elo: 2690, countryCode: 'ru' },
    ],
  },
  {
    id: 'aurora-clan',
    rank: 6,
    prevRank: 5,
    delta: -1,
    name: 'Aurora',
    tag: 'AUR',
    logo: '/images/teams/aurora.png',
    country: 'Türkiye',
    flag: '🇹🇷',
    points: 419,
    vrsPoints: 838,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'XANTARES', role: 'Rifler', flag: '🇹🇷', level: 10, elo: 2980, countryCode: 'tr' },
      { name: 'woxic', role: 'AWPer', flag: '🇹🇷', level: 10, elo: 2840, countryCode: 'tr' },
      { name: 'Jimpphat', role: 'Lurker', flag: '🇫🇮', level: 10, elo: 2810, countryCode: 'fi' },
      { name: 'kyxsan', role: 'IGL / Captain', flag: '🇲🇰', level: 9, elo: 2610, countryCode: 'mk' },
      { name: 'Wicadia', role: 'Entry Fragger', flag: '🇹🇷', level: 10, elo: 2790, countryCode: 'tr' },
    ],
  },
  {
    id: 'betboom-clan',
    rank: 7,
    prevRank: 7,
    delta: 0,
    name: 'BETBOOM',
    tag: 'BB',
    logo: '/images/teams/betboom.png',
    country: 'Russia',
    flag: '🇷🇺',
    points: 355,
    vrsPoints: 710,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'Boombl4', role: 'IGL / Captain', flag: '🇷🇺', level: 10, elo: 2710, countryCode: 'ru' },
      { name: 'zorte', role: 'AWPer', flag: '🇷🇺', level: 9, elo: 2650, countryCode: 'ru' },
      { name: 'S1ren', role: 'Support', flag: '🇷🇺', level: 9, elo: 2580, countryCode: 'ru' },
      { name: 'd1Ledez', role: 'Entry Fragger', flag: '🇷🇺', level: 9, elo: 2610, countryCode: 'ru' },
      { name: 'Magnojez', role: 'Lurker', flag: '🇷🇺', level: 9, elo: 2640, countryCode: 'ru' },
    ],
  },
  {
    id: 'navi-clan',
    rank: 8,
    prevRank: 8,
    delta: 0,
    name: 'Natus Vincere',
    tag: 'NAVI',
    logo: '/images/teams/navi.png',
    country: 'Ukraine',
    flag: '🇺🇦',
    points: 336,
    vrsPoints: 672,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'Aleksib', role: 'IGL / Captain', flag: '🇫🇮', level: 10, elo: 2740, countryCode: 'fi' },
      { name: 'iM', role: 'Entry Fragger', flag: '🇷🇴', level: 10, elo: 2810, countryCode: 'ro' },
      { name: 'b1t', role: 'Anchor', flag: '🇺🇦', level: 10, elo: 2880, countryCode: 'ua' },
      { name: 'w0nderful', role: 'AWPer', flag: '🇺🇦', level: 10, elo: 2890, countryCode: 'ua' },
      { name: 'makazze', role: 'Support', flag: '🇺🇦', level: 9, elo: 2620, countryCode: 'ua' },
    ],
  },
  {
    id: 'fut-clan',
    rank: 9,
    prevRank: 9,
    delta: 0,
    name: 'FUT',
    tag: 'FUT',
    logo: '/images/teams/fut.png',
    country: 'Türkiye',
    flag: '🇹🇷',
    points: 272,
    vrsPoints: 544,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'SunPayus', role: 'AWPer', flag: '🇪🇸', level: 10, elo: 2820, countryCode: 'es' },
      { name: 'xfl0ud', role: 'Entry Fragger', flag: '🇹🇷', level: 9, elo: 2650, countryCode: 'tr' },
      { name: 'dem0n', role: 'Rifler', flag: '🇹🇷', level: 9, elo: 2590, countryCode: 'tr' },
      { name: 'Krabeni', role: 'Support', flag: '🇹🇷', level: 9, elo: 2560, countryCode: 'tr' },
      { name: 'dziugss', role: 'Anchor', flag: '🇱🇹', level: 9, elo: 2530, countryCode: 'lt' },
    ],
  },
  {
    id: 'mongolz-clan',
    rank: 10,
    prevRank: 12,
    delta: 2,
    name: 'The MongolZ',
    tag: 'MGL',
    logo: '/images/teams/mongolz.svg',
    country: 'Mongolia',
    flag: '🇲🇳',
    points: 267,
    vrsPoints: 534,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Asia',
    verified: true,
    roster: [
      { name: 'nin9', role: 'IGL / Captain', flag: '🇲🇳', level: 9, elo: 2620, countryCode: 'mn' },
      { name: 'bLitz', role: 'Rifler', flag: '🇲🇳', level: 10, elo: 2810, countryCode: 'mn' },
      { name: 'Techno', role: 'Support', flag: '🇲🇳', level: 9, elo: 2680, countryCode: 'mn' },
      { name: '910', role: 'AWPer', flag: '🇲🇳', level: 10, elo: 2840, countryCode: 'mn' },
      { name: 'cobrazera', role: 'Entry Fragger', flag: '🇲🇳', level: 9, elo: 2650, countryCode: 'mn' },
    ],
  },
  {
    id: 'nemiga-clan',
    rank: 11,
    prevRank: 10,
    delta: -1,
    name: 'Nemiga',
    tag: 'NMG',
    logo: '/images/teams/nemiga.png',
    country: 'Russia',
    flag: '🇷🇺',
    points: 264,
    vrsPoints: 528,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'KaiR0N-', role: 'Entry Fragger', flag: '🇷🇺', level: 10, elo: 2780, countryCode: 'ru' },
      { name: 'Xant3r', role: 'AWPer', flag: '🇷🇺', level: 9, elo: 2650, countryCode: 'ru' },
      { name: 'robo', role: 'Support', flag: '🇷🇺', level: 9, elo: 2570, countryCode: 'ru' },
      { name: 'khaN', role: 'Rifler', flag: '🇷🇺', level: 9, elo: 2620, countryCode: 'ru' },
      { name: 'syph0', role: 'Anchor', flag: '🇷🇺', level: 9, elo: 2590, countryCode: 'ru' },
    ],
  },
  {
    id: 'g2-clan',
    rank: 12,
    prevRank: 11,
    delta: -1,
    name: 'G2',
    tag: 'G2',
    logo: '/images/teams/g2.png',
    country: 'Germany',
    flag: '🇩🇪',
    points: 223,
    vrsPoints: 446,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'huNter-', role: 'IGL / Captain', flag: '🇧🇦', level: 10, elo: 2820, countryCode: 'ba' },
      { name: 'NertZ', role: 'Lurker', flag: '🇮🇱', level: 10, elo: 2860, countryCode: 'il' },
      { name: 'r1nkle', role: 'AWPer', flag: '🇺🇦', level: 9, elo: 2710, countryCode: 'ua' },
      { name: 'HeavyGod', role: 'Entry Fragger', flag: '🇮🇱', level: 10, elo: 2840, countryCode: 'il' },
      { name: 'MATYS', role: 'Support', flag: '🇸🇰', level: 9, elo: 2690, countryCode: 'sk' },
    ],
  },
  {
    id: 'parivision-clan',
    rank: 13,
    prevRank: 13,
    delta: 0,
    name: 'PARIVISION',
    tag: 'PARI',
    logo: '/images/teams/parivision.png',
    country: 'Russia',
    flag: '🇷🇺',
    points: 188,
    vrsPoints: 376,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'HObbit', role: 'Lurker', flag: '🇰🇿', level: 10, elo: 2740, countryCode: 'kz' },
      { name: 'FL1T', role: 'Rifler', flag: '🇷🇺', level: 10, elo: 2790, countryCode: 'ru' },
      { name: 'Jame', role: 'IGL / AWPer', flag: '🇷🇺', level: 10, elo: 2850, countryCode: 'ru' },
      { name: 'xiELO', role: 'Entry Fragger', flag: '🇷🇺', level: 9, elo: 2610, countryCode: 'ru' },
      { name: 'zweih', role: 'Support', flag: '🇷🇺', level: 9, elo: 2580, countryCode: 'ru' },
    ],
  },
  {
    id: '1win-clan',
    rank: 15,
    prevRank: 15,
    delta: 0,
    name: '1win',
    tag: '1WIN',
    logo: '/images/teams/1win.png',
    country: 'Russia',
    flag: '🇷🇺',
    points: 141,
    vrsPoints: 282,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'Ax1Le', role: 'Rifler', flag: '🇷🇺', level: 10, elo: 2810, countryCode: 'ru' },
      { name: 'nafany', role: 'IGL / Captain', flag: '🇷🇺', level: 9, elo: 2630, countryCode: 'ru' },
      { name: 'BELCHONOKK', role: 'Support', flag: '🇷🇺', level: 9, elo: 2540, countryCode: 'ru' },
      { name: 'fame', role: 'Anchor', flag: '🇷🇺', level: 9, elo: 2680, countryCode: 'ru' },
      { name: 'ArtFr0st', role: 'AWPer', flag: '🇷🇺', level: 9, elo: 2710, countryCode: 'ru' },
    ],
  },
  {
    id: 'liquid-clan',
    rank: 16,
    prevRank: 17,
    delta: 1,
    name: 'Team Liquid',
    tag: 'TL',
    logo: '/images/teams/liquid.svg',
    country: 'United States',
    flag: '🇺🇸',
    points: 128,
    vrsPoints: 256,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'North America',
    verified: true,
    roster: [
      { name: 'ultimate', role: 'AWPer', flag: '🇵🇱', level: 10, elo: 2820, countryCode: 'pl' },
      { name: 'NAF', role: 'Lurker', flag: '🇨🇦', level: 10, elo: 2840, countryCode: 'ca' },
      { name: 'jks', role: 'Anchor', flag: '🇦🇺', level: 9, elo: 2680, countryCode: 'au' },
      { name: 'MithR', role: 'Support', flag: '🇩🇰', level: 9, elo: 2610, countryCode: 'dk' },
      { name: 'Twistzz', role: 'IGL / Captain', flag: '🇨🇦', level: 10, elo: 2920, countryCode: 'ca' },
    ],
  },
  {
    id: 'nip-clan',
    rank: 18,
    prevRank: 22,
    delta: 4,
    name: 'Ninjas in Pyjamas',
    tag: 'NIP',
    logo: '/images/teams/nip.png',
    country: 'Sweden',
    flag: '🇸🇪',
    points: 93,
    vrsPoints: 186,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'stavn', role: 'Rifler', flag: '🇩🇰', level: 10, elo: 2840, countryCode: 'dk' },
      { name: 'sjuush', role: 'Support', flag: '🇩🇰', level: 9, elo: 2680, countryCode: 'dk' },
      { name: 'Krimbo', role: 'Anchor', flag: '🇩🇪', level: 9, elo: 2690, countryCode: 'de' },
      { name: 'adamb', role: 'AWPer', flag: '🇸🇪', level: 9, elo: 2610, countryCode: 'se' },
      { name: 'xKacpersky', role: 'Entry Fragger', flag: '🇵🇱', level: 9, elo: 2640, countryCode: 'pl' },
    ],
  },
  {
    id: 'faze-clan',
    rank: 19,
    prevRank: 18,
    delta: -1,
    name: 'FaZe',
    tag: 'FAZE',
    logo: '/images/teams/faze.png',
    country: 'Germany',
    flag: '🇩🇪',
    points: 90,
    vrsPoints: 180,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'frozen', role: 'Rifler', flag: '🇸🇰', level: 10, elo: 2890, countryCode: 'sk' },
      { name: 'Twistzz', role: 'Lurker', flag: '🇨🇦', level: 10, elo: 2910, countryCode: 'ca' },
      { name: 'Neityu', role: 'Entry Fragger', flag: '🇫🇷', level: 9, elo: 2620, countryCode: 'fr' },
      { name: 'jcobbb', role: 'AWPer', flag: '🇩🇰', level: 9, elo: 2650, countryCode: 'dk' },
      { name: 'jBOEN', role: 'Support', flag: '🇩🇰', level: 9, elo: 2590, countryCode: 'dk' },
    ],
  },
  {
    id: 'astralis-clan',
    rank: 20,
    prevRank: 20,
    delta: 0,
    name: 'Astralis',
    tag: 'AST',
    logo: '/images/teams/astralis.png',
    country: 'Denmark',
    flag: '🇩🇰',
    points: 89,
    vrsPoints: 178,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'phzy', role: 'AWPer', flag: '🇸🇪', level: 9, elo: 2640, countryCode: 'se' },
      { name: 'siuhy', role: 'IGL / Captain', flag: '🇵🇱', level: 10, elo: 2780, countryCode: 'pl' },
      { name: 'Staehr', role: 'Support', flag: '🇩🇰', level: 9, elo: 2620, countryCode: 'dk' },
      { name: 'ryu', role: 'Entry Fragger', flag: '🇩🇰', level: 9, elo: 2590, countryCode: 'dk' },
      { name: 'cmtry', role: 'Anchor', flag: '🇩🇰', level: 9, elo: 2570, countryCode: 'dk' },
    ],
  },
  {
    id: '9z-clan',
    rank: 21,
    prevRank: 21,
    delta: 0,
    name: '9z',
    tag: '9z',
    logo: '/images/teams/9z.svg',
    country: 'Argentina',
    flag: '🇦🇷',
    points: 89,
    vrsPoints: 178,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'South America',
    verified: true,
    roster: [
      { name: 'max', role: 'IGL / Captain', flag: '🇺🇾', level: 9, elo: 2610, countryCode: 'uy' },
      { name: 'dgt', role: 'Rifler', flag: '🇺🇾', level: 10, elo: 2760, countryCode: 'uy' },
      { name: 'luchov', role: 'AWPer', flag: '🇦🇷', level: 9, elo: 2580, countryCode: 'ar' },
      { name: 'HUASOPEEK', role: 'Entry Fragger', flag: '🇨🇱', level: 9, elo: 2640, countryCode: 'cl' },
      { name: 'MartinezSa', role: 'Support', flag: '🇪🇸', level: 9, elo: 2650, countryCode: 'es' },
    ],
  },
  {
    id: 'ef-clan',
    rank: 22,
    prevRank: 23,
    delta: 1,
    name: 'Eternal Fire',
    tag: 'EF',
    logo: '/images/teams/eternalfire.png',
    country: 'Türkiye',
    flag: '🇹🇷',
    points: 77,
    vrsPoints: 154,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'MisteM', role: 'IGL / Captain', flag: '🇹🇷', level: 9, elo: 2610, countryCode: 'tr' },
      { name: 'regali', role: 'AWPer', flag: '🇷🇴', level: 9, elo: 2680, countryCode: 'ro' },
      { name: 'soulfly', role: 'Entry Fragger', flag: '🇹🇷', level: 9, elo: 2640, countryCode: 'tr' },
      { name: 'Kvem', role: 'Lurker', flag: '🇹🇷', level: 9, elo: 2620, countryCode: 'tr' },
      { name: 'jottAAA', role: 'Support', flag: '🇹🇷', level: 9, elo: 2590, countryCode: 'tr' },
    ],
  },
  {
    id: 'heroic-clan',
    rank: 23,
    prevRank: 25,
    delta: 2,
    name: 'HEROIC',
    tag: 'HEROIC',
    logo: '/images/teams/heroic.png',
    country: 'Norway',
    flag: '🇳🇴',
    points: 76,
    vrsPoints: 152,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'Brollan', role: 'Entry Fragger', flag: '🇸🇪', level: 10, elo: 2820, countryCode: 'se' },
      { name: 'nilo', role: 'Rifler', flag: '🇸🇪', level: 9, elo: 2690, countryCode: 'se' },
      { name: 'susp', role: 'Lurker', flag: '🇸🇪', level: 9, elo: 2610, countryCode: 'se' },
      { name: 'MartinezSa', role: 'AWPer', flag: '🇪🇸', level: 9, elo: 2650, countryCode: 'es' },
      { name: 'Chr1zN', role: 'IGL / Captain', flag: '🇩🇰', level: 9, elo: 2580, countryCode: 'dk' },
    ],
  },
  {
    id: 'm80-clan',
    rank: 24,
    prevRank: 24,
    delta: 0,
    name: 'M80',
    tag: 'M80',
    logo: '/images/teams/m80.svg',
    country: 'United States',
    flag: '🇺🇸',
    points: 71,
    vrsPoints: 142,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'North America',
    verified: true,
    roster: [
      { name: 'slaxz-', role: 'AWPer', flag: '🇩🇪', level: 10, elo: 2750, countryCode: 'de' },
      { name: 'Swisher', role: 'Entry Fragger', flag: '🇺🇸', level: 9, elo: 2680, countryCode: 'us' },
      { name: 's1n', role: 'IGL / Captain', flag: '🇩🇪', level: 9, elo: 2620, countryCode: 'de' },
      { name: 'JBa', role: 'Support', flag: '🇺🇸', level: 9, elo: 2590, countryCode: 'us' },
      { name: 'Lake', role: 'Rifler', flag: '🇺🇸', level: 9, elo: 2630, countryCode: 'us' },
    ],
  },
  {
    id: 'fnatic-clan',
    rank: 25,
    prevRank: 27,
    delta: 2,
    name: 'fnatic',
    tag: 'FNC',
    logo: '/images/teams/fnatic.png',
    country: 'United Kingdom',
    flag: '🇬🇧',
    points: 71,
    vrsPoints: 142,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'fEAR', role: 'IGL / Captain', flag: '🇺🇦', level: 9, elo: 2610, countryCode: 'ua' },
      { name: 'jambo', role: 'AWPer', flag: '🇬🇧', level: 9, elo: 2640, countryCode: 'gb' },
      { name: 'jackasmo', role: 'Entry Fragger', flag: '🇬🇧', level: 9, elo: 2590, countryCode: 'gb' },
      { name: 'cairne', role: 'Support', flag: '🇬🇧', level: 8, elo: 2520, countryCode: 'gb' },
      { name: 'mazay', role: 'Lurker', flag: '🇺🇦', level: 9, elo: 2580, countryCode: 'ua' },
    ],
  },
  {
    id: 'col-clan',
    rank: 28,
    prevRank: 28,
    delta: 0,
    name: 'Complexity',
    tag: 'COL',
    logo: '/images/teams/complexity.svg',
    country: 'United States',
    flag: '🇺🇸',
    points: 68,
    vrsPoints: 136,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'North America',
    verified: true,
    roster: [
      { name: 'JT', role: 'IGL / Captain', flag: '🇿🇦', level: 9, elo: 2620, countryCode: 'za' },
      { name: 'EliGE', role: 'Entry Fragger', flag: '🇺🇸', level: 10, elo: 2940, countryCode: 'us' },
      { name: 'floppy', role: 'Support', flag: '🇺🇸', level: 9, elo: 2580, countryCode: 'us' },
      { name: 'Grim', role: 'Lurker', flag: '🇺🇸', level: 9, elo: 2610, countryCode: 'us' },
      { name: 'hallzerk', role: 'AWPer', flag: '🇳🇴', level: 9, elo: 2670, countryCode: 'no' },
    ],
  },
  {
    id: 'saw-clan',
    rank: 29,
    prevRank: 29,
    delta: 0,
    name: 'SAW',
    tag: 'SAW',
    logo: '/images/teams/saw.svg',
    country: 'Portugal',
    flag: '🇵🇹',
    points: 65,
    vrsPoints: 130,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'MUTiRiS', role: 'IGL / Captain', flag: '🇵🇹', level: 9, elo: 2590, countryCode: 'pt' },
      { name: 'story', role: 'AWPer', flag: '🇵🇹', level: 9, elo: 2670, countryCode: 'pt' },
      { name: 'ewjerkz', role: 'Entry Fragger', flag: '🇵🇹', level: 10, elo: 2750, countryCode: 'pt' },
      { name: 'arrozdoce', role: 'Lurker', flag: '🇵🇹', level: 9, elo: 2690, countryCode: 'pt' },
      { name: 'roman', role: 'Support', flag: '🇵🇹', level: 8, elo: 2490, countryCode: 'pt' },
    ],
  },
  {
    id: 'pain-clan',
    rank: 30,
    prevRank: 30,
    delta: 0,
    name: 'paiN',
    tag: 'paiN',
    logo: '/images/teams/pain.svg',
    country: 'Brazil',
    flag: '🇧🇷',
    points: 62,
    vrsPoints: 124,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'South America',
    verified: true,
    roster: [
      { name: 'biguzera', role: 'IGL / Captain', flag: '🇧🇷', level: 10, elo: 2810, countryCode: 'br' },
      { name: 'nqz', role: 'AWPer', flag: '🇧🇷', level: 9, elo: 2720, countryCode: 'br' },
      { name: 'lux', role: 'Entry Fragger', flag: '🇧🇷', level: 9, elo: 2640, countryCode: 'br' },
      { name: 'kauez', role: 'Support', flag: '🇧🇷', level: 9, elo: 2610, countryCode: 'br' },
      { name: 'snow', role: 'Rifler', flag: '🇧🇷', level: 9, elo: 2650, countryCode: 'br' },
    ],
  },
  {
    id: 'flyquest-clan',
    rank: 35,
    prevRank: 35,
    delta: 0,
    name: 'FlyQuest',
    tag: 'FLY',
    logo: '/images/teams/flyquest.svg',
    country: 'Australia',
    flag: '🇦🇺',
    points: 45,
    vrsPoints: 90,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Oceania',
    verified: true,
    roster: [
      { name: 'dexter', role: 'IGL / Captain', flag: '🇦🇺', level: 9, elo: 2640, countryCode: 'au' },
      { name: 'INS', role: 'Entry Fragger', flag: '🇦🇺', level: 9, elo: 2680, countryCode: 'au' },
      { name: 'aliStair', role: 'AWPer', flag: '🇦🇺', level: 9, elo: 2610, countryCode: 'au' },
      { name: 'Liazz', role: 'Anchor', flag: '🇦🇺', level: 9, elo: 2590, countryCode: 'au' },
      { name: 'Vexite', role: 'Lurker', flag: '🇦🇺', level: 9, elo: 2620, countryCode: 'au' },
    ],
  },
  {
    id: 'big-clan',
    rank: 36,
    prevRank: 36,
    delta: 0,
    name: 'BIG',
    tag: 'BIG',
    logo: '/images/teams/big.svg',
    country: 'Germany',
    flag: '🇩🇪',
    points: 42,
    vrsPoints: 84,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'tabseN', role: 'IGL / Captain', flag: '🇩🇪', level: 9, elo: 2680, countryCode: 'de' },
      { name: 'syrsoN', role: 'AWPer', flag: '🇩🇪', level: 9, elo: 2650, countryCode: 'de' },
      { name: 'JDC', role: 'Support', flag: '🇩🇪', level: 9, elo: 2590, countryCode: 'de' },
      { name: 'prosus', role: 'Entry Fragger', flag: '🇩🇪', level: 9, elo: 2560, countryCode: 'de' },
      { name: 'Krimbo', role: 'Anchor', flag: '🇩🇪', level: 9, elo: 2640, countryCode: 'de' },
    ],
  },
  {
    id: 'monte-clan',
    rank: 37,
    prevRank: 37,
    delta: 0,
    name: 'Monte',
    tag: 'MONTE',
    logo: '/images/teams/monte.svg',
    country: 'Ukraine',
    flag: '🇺🇦',
    points: 40,
    vrsPoints: 80,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'DemQQ', role: 'Anchor', flag: '🇺🇦', level: 9, elo: 2610, countryCode: 'ua' },
      { name: 'kRaSnaL', role: 'Support', flag: '🇵🇱', level: 9, elo: 2580, countryCode: 'pl' },
      { name: 'dycha', role: 'Rifler', flag: '🇵🇱', level: 9, elo: 2640, countryCode: 'pl' },
      { name: 'hAdji', role: 'Entry Fragger', flag: '🇫🇷', level: 9, elo: 2590, countryCode: 'fr' },
      { name: 'STYKO', role: 'IGL / Captain', flag: '🇸🇰', level: 9, elo: 2570, countryCode: 'sk' },
    ],
  },
  {
    id: 'rebels-clan',
    rank: 38,
    prevRank: 38,
    delta: 0,
    name: 'Rebels',
    tag: 'RBL',
    logo: '/images/teams/rebels.svg',
    country: 'Poland',
    flag: '🇵🇱',
    points: 38,
    vrsPoints: 76,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'innocent', role: 'IGL / Captain', flag: '🇵🇱', level: 9, elo: 2590, countryCode: 'pl' },
      { name: 'kisserek', role: 'Support', flag: '🇵🇱', level: 8, elo: 2510, countryCode: 'pl' },
      { name: 'casey', role: 'Entry Fragger', flag: '🇵🇱', level: 9, elo: 2560, countryCode: 'pl' },
      { name: 'Flayy', role: 'AWPer', flag: '🇵🇱', level: 9, elo: 2610, countryCode: 'pl' },
      { name: 'olimp', role: 'Lurker', flag: '🇵🇱', level: 8, elo: 2520, countryCode: 'pl' },
    ],
  },
  {
    id: 'avangar-clan',
    rank: 39,
    prevRank: 39,
    delta: 0,
    name: 'AVANGAR',
    tag: 'AVG',
    logo: '/images/teams/avangar.svg',
    country: 'Kazakhstan',
    flag: '🇰🇿',
    points: 36,
    vrsPoints: 72,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'def1zer', role: 'IGL / Captain', flag: '🇰🇿', level: 9, elo: 2550, countryCode: 'kz' },
      { name: 'sorrow', role: 'AWPer', flag: '🇰🇿', level: 9, elo: 2580, countryCode: 'kz' },
      { name: 'enfun', role: 'Support', flag: '🇰🇿', level: 8, elo: 2490, countryCode: 'kz' },
      { name: 'w1nt3r', role: 'Entry Fragger', flag: '🇰🇿', level: 8, elo: 2510, countryCode: 'kz' },
      { name: 'BL4CK3Y', role: 'Anchor', flag: '🇰🇿', level: 8, elo: 2470, countryCode: 'kz' },
    ],
  },
  {
    id: 'havu-clan',
    rank: 40,
    prevRank: 40,
    delta: 0,
    name: 'HAVU',
    tag: 'HAVU',
    logo: '/images/teams/havu.svg',
    country: 'Finland',
    flag: '🇫🇮',
    points: 34,
    vrsPoints: 68,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'OttoNd', role: 'AWPer', flag: '🇫🇮', level: 9, elo: 2610, countryCode: 'fi' },
      { name: 'Aerial', role: 'Entry Fragger', flag: '🇫🇮', level: 9, elo: 2580, countryCode: 'fi' },
      { name: 'xseveN', role: 'Support', flag: '🇫🇮', level: 9, elo: 2560, countryCode: 'fi' },
      { name: 'uuu9', role: 'IGL / Captain', flag: '🇫🇮', level: 8, elo: 2510, countryCode: 'fi' },
      { name: 'podi', role: 'Anchor', flag: '🇫🇮', level: 8, elo: 2490, countryCode: 'fi' },
    ],
  },
  {
    id: 'bne-clan',
    rank: 41,
    prevRank: 41,
    delta: 0,
    name: 'Bad News Eagles',
    tag: 'BNE',
    logo: '/images/teams/bne.svg',
    country: 'Kosovo',
    flag: '🇽🇰',
    points: 32,
    vrsPoints: 64,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'rigoN-jr', role: 'Entry Fragger', flag: '🇽🇰', level: 10, elo: 2840, countryCode: 'xk' },
      { name: 'juanflatro-aim', role: 'AWPer', flag: '🇽🇰', level: 10, elo: 2790, countryCode: 'xk' },
      { name: 'sener1-tap', role: 'Support', flag: '🇽🇰', level: 9, elo: 2650, countryCode: 'xk' },
      { name: 'gxx-fire', role: 'Anchor', flag: '🇽🇰', level: 9, elo: 2610, countryCode: 'xk' },
      { name: 'sinnopsyy-beast', role: 'IGL / Captain', flag: '🇽🇰', level: 10, elo: 2710, countryCode: 'xk' },
    ],
  },
  {
    id: 'illyrian-clan',
    rank: 42,
    prevRank: 42,
    delta: 0,
    name: 'Illyrian Clan',
    tag: 'ILL',
    logo: '/images/teams/illyrian.svg',
    country: 'Albania',
    flag: '🇦🇱',
    points: 30,
    vrsPoints: 60,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'TironaAim', role: 'IGL / Captain', flag: '🇦🇱', level: 9, elo: 2620, countryCode: 'al' },
      { name: 'ShkodraBeast', role: 'AWPer', flag: '🇦🇱', level: 9, elo: 2650, countryCode: 'al' },
      { name: 'DurresSniper', role: 'Entry Fragger', flag: '🇦🇱', level: 9, elo: 2590, countryCode: 'al' },
      { name: 'Kastrioti-IGL', role: 'Support', flag: '🇦🇱', level: 9, elo: 2560, countryCode: 'al' },
      { name: 'EagleEye-al', role: 'Anchor', flag: '🇦🇱', level: 8, elo: 2510, countryCode: 'al' },
    ],
  },
  {
    id: 'nexus-clan',
    rank: 43,
    prevRank: 43,
    delta: 0,
    name: 'Nexus Gaming',
    tag: 'NEXUS',
    logo: '/images/teams/nexus.svg',
    country: 'Romania',
    flag: '🇷🇴',
    points: 28,
    vrsPoints: 56,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'BTN', role: 'IGL / Captain', flag: '🇷🇴', level: 9, elo: 2580, countryCode: 'ro' },
      { name: 'ragga', role: 'Entry Fragger', flag: '🇷🇴', level: 9, elo: 2620, countryCode: 'ro' },
      { name: 'XELLOW', role: 'AWPer', flag: '🇷🇴', level: 9, elo: 2670, countryCode: 'ro' },
      { name: 'lauNX', role: 'Lurker', flag: '🇷🇴', level: 9, elo: 2650, countryCode: 'ro' },
      { name: 's0und', role: 'Support', flag: '🇷🇴', level: 8, elo: 2510, countryCode: 'ro' },
    ],
  },
  {
    id: 'gld-eagles',
    rank: 44,
    prevRank: 44,
    delta: 0,
    name: 'Guild Eagles',
    tag: 'GLD',
    logo: '/images/teams/gld.svg',
    country: 'Kosovo',
    flag: '🇽🇰',
    points: 27,
    vrsPoints: 54,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Europe',
    verified: true,
    roster: [
      { name: 'DrenicaSniper', role: 'AWPer', flag: '🇽🇰', level: 9, elo: 2620, countryCode: 'xk' },
      { name: 'Besart_CS2', role: 'IGL / Captain', flag: '🇽🇰', level: 9, elo: 2590, countryCode: 'xk' },
      { name: 'Ardit_Entry', role: 'Entry Fragger', flag: '🇽🇰', level: 8, elo: 2530, countryCode: 'xk' },
      { name: 'VloraLurker', role: 'Lurker', flag: '🇦🇱', level: 8, elo: 2510, countryCode: 'al' },
      { name: 'KushtrimSmoke', role: 'Support', flag: '🇽🇰', level: 8, elo: 2490, countryCode: 'xk' },
    ],
  },
  {
    id: 'bestia-clan',
    rank: 62,
    prevRank: 57,
    delta: -5,
    name: 'BESTIA',
    tag: 'BST',
    logo: '/images/teams/bestia.svg',
    country: 'Argentina',
    flag: '🇦🇷',
    points: 14,
    vrsPoints: 28,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'South America',
    verified: true,
    roster: [
      { name: 'drop', role: 'IGL / Captain', flag: '🇧🇷', level: 9, elo: 2610, countryCode: 'br' },
      { name: 'kauez', role: 'Entry Fragger', flag: '🇧🇷', level: 9, elo: 2640, countryCode: 'br' },
      { name: 'cass1n', role: 'AWPer', flag: '🇧🇷', level: 9, elo: 2620, countryCode: 'br' },
      { name: 'buda', role: 'Lurker', flag: '🇦🇷', level: 9, elo: 2650, countryCode: 'ar' },
      { name: 'timo', role: 'Support', flag: '🇺🇾', level: 8, elo: 2540, countryCode: 'uy' },
    ],
  },
  {
    id: 'tyloo-clan',
    rank: 68,
    prevRank: 68,
    delta: 0,
    name: 'TYLOO',
    tag: 'TYL',
    logo: '/images/teams/tyloo.svg',
    country: 'China',
    flag: '🇨🇳',
    points: 12,
    vrsPoints: 24,
    valveStatus: 'Contenders',
    vrsInviteStage: 'Closed Qualifier',
    prizeEarned: 25000,
    matches: 32,
    wins: 22,
    losses: 10,
    winrate: '68.8%',
    tournamentsWon: 2,
    avgElo: 2750,
    recentForm: ["W", "W", "L", "W", "W"],
    region: 'Asia',
    verified: true,
    roster: [
      { name: 'advent', role: 'IGL / Captain', flag: '🇨🇳', level: 8, elo: 2510, countryCode: 'cn' },
      { name: 'JamYoung', role: 'Rifler', flag: '🇨🇳', level: 9, elo: 2650, countryCode: 'cn' },
      { name: 'Moseyuh', role: 'Entry Fragger', flag: '🇨🇳', level: 8, elo: 2540, countryCode: 'cn' },
      { name: 'Mercury', role: 'Support', flag: '🇨🇳', level: 8, elo: 2520, countryCode: 'cn' },
      { name: 'Jee', role: 'AWPer', flag: '🇨🇳', level: 9, elo: 2590, countryCode: 'cn' },
    ],
  },
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
  const [activeTab, setActiveTab] = useState<'my-clan' | 'roster' | 'clans-list' | 'create-clan' | 'clan-rankings'>('my-clan');
  const [rankingCategory, setRankingCategory] = useState<'platform' | 'world' | 'regional'>('platform');
  const [selectedRegionalCountry, setSelectedRegionalCountry] = useState<string | null>(null);
  const [selectedRegionalContinent, setSelectedRegionalContinent] = useState<string | null>(null);
  const [hltvSearch, setHltvSearch] = useState('');
  const [hltvRegionFilter, setHltvRegionFilter] = useState<'all' | 'Balkans' | 'Europe' | 'Nordics'>('all');
  const [expandedHltvClanId, setExpandedHltvClanId] = useState<string | null>(null);
  const [detailedClanStatsId, setDetailedClanStatsId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [selectedRoleForInvite, setSelectedRoleForInvite] = useState<ClanMember['role']>('Entry Fragger');
  const [selectedFriendToInvite, setSelectedFriendToInvite] = useState<SocialFriend | null>(null);
  const [userFriends, setUserFriends] = useState<SocialFriend[]>(() => getUserFriends(currentGamerTag));
  const [pendingInvites, setPendingInvites] = useState<ClanInvite[]>(() => {
    try {
      const raw = localStorage.getItem('vortex_clan_pending_invites');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) return list.filter((i: ClanInvite) => i.status === 'pending');
      }
    } catch (_) {}
    return [];
  });
  const [activeDecisionInvite, setActiveDecisionInvite] = useState<ClanInvite | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('vortex_clan_pending_invites', JSON.stringify(pendingInvites));
    } catch (_) {}
  }, [pendingInvites]);

  useEffect(() => {
    const handleFriendsUpdate = () => {
      setUserFriends(getUserFriends(currentGamerTag));
    };
    window.addEventListener('vortex_friends_updated', handleFriendsUpdate);
    return () => window.removeEventListener('vortex_friends_updated', handleFriendsUpdate);
  }, [currentGamerTag]);

  useEffect(() => {
    if (isInviteModalOpen) {
      setUserFriends(getUserFriends(currentGamerTag));
      setSelectedFriendToInvite(null);
      setInviteInput('');
    }
  }, [isInviteModalOpen, currentGamerTag]);
  const [searchClanQuery, setSearchClanQuery] = useState('');
  const clanLogoFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setToast('⚠️ Logo file is too large (maximum 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        sound.playSelect();
        setDraftLogo(dataUrl);
        setToast('✓ Custom clan logo loaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };
  const [matchFilter, setMatchFilter] = useState<'all' | 'my-clan' | 'wins' | 'losses'>('all');
  const [selectedScoreboardMatch, setSelectedScoreboardMatch] = useState<ClanMatch | null>(null);
  const [scoreboardSubTab, setScoreboardSubTab] = useState<'scoreboard' | 'rounds' | 'performance'>('scoreboard');
  const [scoreboardSortKey, setScoreboardSortKey] = useState<string>('rating');
  const [scoreboardSortAsc, setScoreboardSortAsc] = useState<boolean>(false);
  const [selectedRoundDetail, setSelectedRoundDetail] = useState<number | null>(null);
  const [selectedPlayerProfile, setSelectedPlayerProfile] = useState<FaceitScoreboardPlayer | null>(null);

  // Helper to convert ClanMember to FaceitScoreboardPlayer for profile inspection
  const handleOpenMemberProfile = (m: ClanMember) => {
    sound.playSelect();
    setSelectedPlayerProfile({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      level: m.level,
      elo: m.elo,
      rating: (1.10 + (m.elo / 6000)).toFixed(2),
      hasMvpStar: m.isCaptain,
      swing: '+4.25%',
      isPositiveSwing: true,
      kills: Math.max(12, Math.floor(m.elo / 95)),
      deaths: 11,
      assists: 6,
      adr: '86.4',
      kd: '1.36',
      kr: '0.88',
      hs: 9,
      hsPercentage: '62.5%',
      k5: 0,
      k4: 1,
      k3: 2,
      k2: 4,
      mvps: m.isCaptain ? 3 : 1,
      isCurrentUser: m.isUser,
    });
  };

  // Helper to open match scoreboard and reset to Scoreboard view
  const openMatchScoreboard = (match: ClanMatch) => {
    sound.playSelect();
    setScoreboardSubTab('scoreboard');
    setSelectedRoundDetail(null);
    setSelectedScoreboardMatch(match);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPlayerProfile) setSelectedPlayerProfile(null);
        else if (selectedScoreboardMatch) setSelectedScoreboardMatch(null);
        else if (isEditModalOpen) setIsEditModalOpen(false);
        else if (isInviteModalOpen) setIsInviteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlayerProfile, selectedScoreboardMatch, isEditModalOpen, isInviteModalOpen]);

  // Real GOTV Demo file download trigger
  const handleDownloadDemo = (match: ClanMatch) => {
    sound.playClick();
    const demoFileName = `gotv_matchzy_${match.mapName}_${match.id}.dem`;
    const demoContent = `[CALIBER_CLUTCH_CS2_GOTV_DEMO_HEADER]\nProtocol: 4\nServer: ${match.server}\nMap: ${match.mapName}\nScore: ${match.scoreDisplay}\nDuration: ${match.duration}\nRecorded: ${match.date} ${match.time}\nTickrate: 128-Tick Sub-Tick Dedicated\nClient: CS2 MatchZy Compatible`;
    const blob = new Blob([demoContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = demoFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast(`✓ Downloading CS2 GOTV Demo (.dem) for ${match.mapDisplayName}...`);
  };

  // Scoreboard Column Sorting Function
  const getSortedPlayers = (players: FaceitScoreboardPlayer[]) => {
    if (!players || players.length === 0) return [];
    return [...players].sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (scoreboardSortKey === 'rank') {
        valA = a.elo;
        valB = b.elo;
      } else if (scoreboardSortKey === 'rating') {
        valA = parseFloat(a.rating) || 0;
        valB = parseFloat(b.rating) || 0;
      } else if (scoreboardSortKey === 'swing') {
        valA = parseFloat(a.swing.replace('%', '').replace('+', '')) || 0;
        valB = parseFloat(b.swing.replace('%', '').replace('+', '')) || 0;
      } else if (scoreboardSortKey === 'adr') {
        valA = parseFloat(a.adr) || 0;
        valB = parseFloat(b.adr) || 0;
      } else if (scoreboardSortKey === 'kd') {
        valA = parseFloat(a.kd) || 0;
        valB = parseFloat(b.kd) || 0;
      } else if (scoreboardSortKey === 'kr') {
        valA = parseFloat(a.kr) || 0;
        valB = parseFloat(b.kr) || 0;
      } else if (scoreboardSortKey === 'hsPercentage') {
        valA = parseFloat(a.hsPercentage.replace('%', '')) || 0;
        valB = parseFloat(b.hsPercentage.replace('%', '')) || 0;
      } else if (scoreboardSortKey === 'name') {
        return scoreboardSortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        valA = (a as any)[scoreboardSortKey] ?? 0;
        valB = (b as any)[scoreboardSortKey] ?? 0;
      }

      if (scoreboardSortAsc) {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  const handleToggleSort = (key: string) => {
    sound.playClick();
    if (scoreboardSortKey === key) {
      setScoreboardSortAsc(!scoreboardSortAsc);
    } else {
      setScoreboardSortKey(key);
      setScoreboardSortAsc(false); // default descending for competitive stats
    }
  };

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
    sound.playSelect();

    const opponent = DEFAULT_OPPONENT_CLANS[Math.floor(Math.random() * DEFAULT_OPPONENT_CLANS.length)];
    const maps = [
      { name: 'de_mirage', displayName: 'Mirage', img: '/images/maps/cs2_mirage.png' },
      { name: 'de_inferno', displayName: 'Inferno', img: '/images/maps/cs2_inferno.png' },
      { name: 'de_dust2', displayName: 'Dust 2', img: '/images/maps/cs2_dust2.png' },
      { name: 'de_anubis', displayName: 'Anubis', img: '/images/maps/cs2_anubis.png' },
      { name: 'de_ancient', displayName: 'Ancient', img: '/images/maps/cs2_ancient.png' }
    ];
    const pickedMap = maps[Math.floor(Math.random() * maps.length)];
    const userScore = 13;
    const oppScore = Math.floor(Math.random() * 4) + 8; // 8 - 11 close match

    const newMatch: ClanMatch = {
      id: `cm-sim-${Date.now()}`,
      date: 'Today',
      time: 'Just now',
      isWin: true,
      scoreDisplay: `${userScore} : ${oppScore}`,
      userScore: userScore,
      opponentScore: oppScore,
      userElo: currentUserElo + 25,
      eloDelta: 25,
      userRating: '1.38',
      userStats: {
        kills: 22,
        deaths: 12,
        assists: 6,
        kd: '1.83',
        adr: '98.5'
      },
      mapName: pickedMap.name,
      mapDisplayName: pickedMap.displayName,
      mapImage: pickedMap.img,
      server: 'Frankfurt Central • 128-Tick MatchZy',
      timeAgo: 'Just now',
      duration: '31 mins',
      eloChange: 25,
      tournamentOrEvent: 'Caliber Clutch 5v5 Official Tournament Match',

      team1: {
        name: userClan.name,
        avatar: userClan.logo,
        score: userScore,
        firstHalf: 8,
        secondHalf: 5,
        avgLevel: currentUserLevel,
        avgElo: userClan.stats.avgElo + 25,
        players: userClan.members.slice(0, 5).map((m, idx) => ({
          id: `sim-user-${idx}`,
          name: m.name,
          avatar: m.avatar,
          factionIcon: 'diamond',
          level: m.level,
          elo: m.elo + 25,
          rating: idx === 0 ? '1.42' : (1.10 + Math.random() * 0.25).toFixed(2),
          hasMvpStar: idx === 0,
          swing: `+${(4 + Math.random() * 6).toFixed(2)}%`,
          isPositiveSwing: true,
          kills: idx === 0 ? 24 : Math.floor(Math.random() * 6) + 14,
          deaths: Math.floor(Math.random() * 4) + 10,
          assists: Math.floor(Math.random() * 5) + 3,
          adr: (82 + Math.random() * 26).toFixed(1),
          kd: (1.20 + Math.random() * 0.6).toFixed(2),
          kr: (0.75 + Math.random() * 0.25).toFixed(2),
          hs: Math.floor(Math.random() * 6) + 7,
          hsPercentage: `${Math.floor(Math.random() * 25) + 50}%`,
          k5: 0,
          k4: idx === 0 ? 1 : 0,
          k3: 1,
          k2: 3,
          mvps: idx === 0 ? 4 : 2,
          isCurrentUser: m.isUser || idx === 0
        }))
      },

      team2: {
        name: opponent.name,
        avatar: opponent.logo,
        score: oppScore,
        firstHalf: 7,
        secondHalf: oppScore - 7,
        avgLevel: Math.max(1, currentUserLevel - 1),
        avgElo: opponent.stats.avgElo,
        players: opponent.members.slice(0, 5).map((m, idx) => ({
          id: `sim-opp-${idx}`,
          name: m.name,
          avatar: m.avatar,
          factionIcon: 'triangle',
          level: m.level,
          elo: m.elo - 25,
          rating: (0.85 + Math.random() * 0.30).toFixed(2),
          hasMvpStar: false,
          swing: `-${(2 + Math.random() * 5).toFixed(2)}%`,
          isPositiveSwing: false,
          kills: Math.floor(Math.random() * 6) + 11,
          deaths: Math.floor(Math.random() * 5) + 14,
          assists: Math.floor(Math.random() * 4) + 2,
          adr: (68 + Math.random() * 22).toFixed(1),
          kd: (0.70 + Math.random() * 0.35).toFixed(2),
          kr: (0.55 + Math.random() * 0.20).toFixed(2),
          hs: Math.floor(Math.random() * 5) + 5,
          hsPercentage: `${Math.floor(Math.random() * 20) + 40}%`,
          k5: 0,
          k4: 0,
          k3: 0,
          k2: 2,
          mvps: 1
        }))
      },

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
      mvp: {
        name: currentGamerTag.split(' ')[0] || 'M14',
        avatar: userClan.logo,
        kills: 24,
        deaths: 12,
        rating: '1.42',
        clanTag: userClan.tag
      },
      clan1Players: userClan.members.slice(0, 5).map(m => ({
        name: m.name,
        kills: 18,
        deaths: 11,
        assists: 5,
        adr: '92.4',
        rating: '1.25'
      })),
      clan2Players: opponent.members.slice(0, 5).map(m => ({
        name: m.name,
        kills: 14,
        deaths: 16,
        assists: 4,
        adr: '74.2',
        rating: '0.92'
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

    setToast(`⚔️ Official 5v5 Clan Match registered! [${userClan.tag}] ${userScore} - ${oppScore} [${opponent.tag}] on ${pickedMap.displayName} (+$75.00 Cash Prize)!`);
  };

  // Load user clan from localStorage or initialize with M14 / Caliber Clutch default
  const [userClan, setUserClan] = useState<ClanData>(() => {
    try {
      const saved = localStorage.getItem('vortex_user_clan_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate any legacy unsplash stock images to official Caliber Clutch badge
        let modified = false;
        if (!parsed.logo || parsed.logo.includes('unsplash.com')) {
          parsed.logo = '/images/clan_badges/badge_caliber_lime.svg';
          modified = true;
        }
        // Clean legacy fake 128-tick description
        if (parsed.description && parsed.description.includes('128-tick')) {
          parsed.description = parsed.description.replace(/128-tick\s*/gi, '');
          modified = true;
        }
        // Reset fake / mock clan stats to clean slate (0 matches, 0 streak, 0 cups, unranked elo)
        if (!parsed.stats || parsed.stats.matches > 0 || parsed.stats.tournamentsWon > 0 || parsed.stats.streak > 0 || parsed.stats.avgElo > 0 || parsed.stats.winrate !== '0%') {
          parsed.stats = {
            matches: 0,
            wins: 0,
            losses: 0,
            winrate: '0%',
            avgElo: 0,
            tournamentsWon: 0,
            streak: 0,
          };
          modified = true;
        }
        // Reset clan members to ONLY registered users (no fake un-registered pros or bots)
        const hasUnregisteredMembers = parsed.members && (
          parsed.members.length > 1 && parsed.members.some((m: any) => 
            ['juanflatro-aim', 'sener1-tap', 'gxx-fire', 'sinnopsyy-beast', 'devilwalk-coach', 'vortex_ghost', 'silent_clutcher', 'shadowstrike', 'k1llshot_al', 'balkansub_01', 'aimgod_99'].includes(m.name?.toLowerCase())
          )
        );
        if (hasUnregisteredMembers || !parsed.members || parsed.members.length === 0) {
          parsed.members = [
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
            }
          ];
          modified = true;
        }
        if (modified) {
          try {
            localStorage.setItem('vortex_user_clan_data', JSON.stringify(parsed));
          } catch (_) {}
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
      description: 'Official Caliber Clutch competitive roster led by M14. Competing in European Cash tournaments and CS2 cups.',
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
        }
      ],
      stats: {
        matches: 0,
        wins: 0,
        losses: 0,
        winrate: '0%',
        avgElo: 0,
        tournamentsWon: 0,
        streak: 0,
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

  // Send Clan Roster Invitation to friend (Pending Confirmation)
  const handleInviteTeammate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriendToInvite) {
      setToast('⚠️ Please choose a player from your Friends list to invite.');
      return;
    }
    sound.playSelect();

    if (userClan.members.length + pendingInvites.length >= 6) {
      alert('The roster already has maximum capacity (5 starters + 1 substitute, including pending invites). Remove a member or cancel an invite first.');
      return;
    }

    // Strictly enforce friends-only requirement
    const isFriend = userFriends.some(f => f.name.toLowerCase() === selectedFriendToInvite.name.toLowerCase());
    if (!isFriend) {
      setToast(`⚠️ You must add ${selectedFriendToInvite.name} as a friend before inviting them to your clan.`);
      return;
    }

    // Check if friend is already in clan
    if (userClan.members.some(m => m.name.toLowerCase() === selectedFriendToInvite.name.toLowerCase())) {
      setToast(`⚠️ ${selectedFriendToInvite.name} is already in the clan roster.`);
      return;
    }

    // Check if friend already has a pending invite
    if (pendingInvites.some(i => i.friendName.toLowerCase() === selectedFriendToInvite.name.toLowerCase())) {
      setToast(`⚠️ An invitation is already pending for ${selectedFriendToInvite.name}.`);
      return;
    }

    const newInvite: ClanInvite = {
      id: `cinv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      clanId: userClan.id,
      clanName: userClan.name,
      clanTag: userClan.tag,
      clanLogo: userClan.logo,
      senderGamerTag: currentGamerTag,
      friendName: selectedFriendToInvite.name,
      friendAvatar: selectedFriendToInvite.avatar || '/images/avatar_duck_exact.png',
      friendLevel: selectedFriendToInvite.level || currentUserLevel,
      friendElo: selectedFriendToInvite.elo || currentUserElo,
      friendCountry: selectedFriendToInvite.countryName || currentCountry.name,
      friendFlag: currentCountry.flag,
      role: selectedRoleForInvite,
      status: 'pending',
      createdAt: Date.now()
    };

    setPendingInvites(prev => [...prev, newInvite]);
    setActiveDecisionInvite(newInvite);
    setSelectedFriendToInvite(null);
    setInviteInput('');
    setIsInviteModalOpen(false);
    setToast(`📨 Clan invitation sent to ${newInvite.friendName}! Awaiting player decision (Accept or Reject).`);
  };

  const handleAcceptClanInvite = (inviteId: string) => {
    sound.playSelect();
    const invite = pendingInvites.find(i => i.id === inviteId);
    if (!invite) return;

    if (userClan.members.length >= 6) {
      alert('The roster already has maximum capacity (6 members).');
      return;
    }

    const newMember: ClanMember = {
      id: `member-${Date.now()}`,
      name: invite.friendName,
      role: invite.role,
      level: invite.friendLevel,
      elo: invite.friendElo,
      avatar: invite.friendAvatar,
      country: invite.friendCountry,
      flag: invite.friendFlag,
    };

    const nextMembers = [...userClan.members, newMember];
    const avg = userClan.stats.matches > 0 
      ? Math.round(nextMembers.slice(0, 5).reduce((acc, m) => acc + m.elo, 0) / Math.min(5, nextMembers.length))
      : 0;
    const nextClan: ClanData = {
      ...userClan,
      members: nextMembers,
      stats: {
        ...userClan.stats,
        avgElo: avg,
      },
    };

    setUserClan(nextClan);
    try {
      localStorage.setItem('vortex_user_clan_data', JSON.stringify(nextClan));
    } catch (_) {}

    setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
    if (activeDecisionInvite?.id === inviteId) {
      setActiveDecisionInvite(null);
    }
    setToast(`✓ ${invite.friendName} ACCEPTED the invitation and joined [${userClan.tag}] roster as ${invite.role}!`);
  };

  const handleRejectClanInvite = (inviteId: string) => {
    sound.playClick();
    const invite = pendingInvites.find(i => i.id === inviteId);
    const friendName = invite ? invite.friendName : 'Player';

    setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
    if (activeDecisionInvite?.id === inviteId) {
      setActiveDecisionInvite(null);
    }
    setToast(`✕ ${friendName} DECLINED (rejected) the invitation to join [${userClan.tag}].`);
  };

  const handleCancelClanInvite = (inviteId: string) => {
    sound.playClick();
    setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
    if (activeDecisionInvite?.id === inviteId) {
      setActiveDecisionInvite(null);
    }
    setToast(`✓ Invitation canceled.`);
  };

  const handleKickMember = (memberId: string) => {
    sound.playClick();
    if (memberId === 'current-user') {
      alert('You cannot kick yourself (Team Captain). Transfer captaincy first if needed.');
      return;
    }
    const nextMembers = userClan.members.filter(m => m.id !== memberId);
    const avg = userClan.stats.matches > 0 && nextMembers.length > 0
      ? Math.round(nextMembers.slice(0, 5).reduce((acc, m) => acc + m.elo, 0) / Math.min(5, nextMembers.length))
      : 0;
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
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.35)]"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-[#A3E635] text-slate-950 uppercase tracking-wider shadow">
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
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1.5">
                  <CountryFlag code={getCountryCode(userClan.country)} name={userClan.country} size="xs" />
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
                  <Users className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>Roster:</span>
                  <strong className="text-white">{userClan.members.length} / 6 Players</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Team ELO:</span>
                  <strong className={userClan.stats.avgElo > 0 ? "text-[#A3E635]" : "text-slate-400"}>
                    {userClan.stats.avgElo > 0 ? userClan.stats.avgElo : 'Unranked'}
                  </strong>
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
              <Edit3 className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Edit Clan Profile</span>
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                onNavigateTab('tournaments');
                setToast(`✓ Navigating to Tournaments with Clan [${userClan.tag}] roster ready!`);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 text-xs font-mono font-black flex items-center justify-center gap-2 shadow-lg shadow-[#A3E635]/25 cursor-pointer transition"
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
            <span>Team Roster ({userClan.members.length}/6)</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('clans-list'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'clans-list'
                ? 'bg-[#A3E635] text-slate-950 font-black shadow-md'
                : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Clan Matches & Stats</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setRankingCategory('platform');
              setActiveTab('clan-rankings');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'clan-rankings'
                ? 'bg-[#A3E635] text-slate-950 font-black shadow-md'
                : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Ranking Teams</span>
          </button>
        </div>

        {activeTab === 'roster' && (
          <button
            onClick={() => {
              sound.playClick();
              setIsInviteModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#A3E635]/15 hover:bg-[#A3E635]/25 text-[#A3E635] border border-[#A3E635]/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition"
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
              <div className="text-2xl font-black font-display text-white">
                {userClan.stats.matches > 0 ? userClan.stats.winrate : '0%'}
              </div>
              <p className="text-[10px] font-mono text-slate-400 font-bold">
                {userClan.stats.matches > 0 ? `${userClan.stats.wins}W - ${userClan.stats.losses}L Record` : '0W - 0L Record'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-slate-400" />
                Current Streak
              </span>
              <div className={`text-2xl font-black font-display ${userClan.stats.streak > 0 ? 'text-[#A3E635]' : 'text-slate-300'}`}>
                {userClan.stats.streak > 0 ? `${userClan.stats.streak} Wins` : '0 Wins'}
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                {userClan.stats.streak > 0 ? 'Competitive Momentum' : 'No Active Streak'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                Tournament Cups
              </span>
              <div className={`text-2xl font-black font-display ${userClan.stats.tournamentsWon > 0 ? 'text-[#A3E635]' : 'text-slate-300'}`}>
                {userClan.stats.tournamentsWon > 0 ? `${userClan.stats.tournamentsWon} Trophies` : '0 Trophies'}
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                {userClan.stats.tournamentsWon > 0 ? 'CaliberClutch Circuit' : 'No Trophies Won'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Squad Average ELO
              </span>
              <div className="text-2xl font-black font-display text-white">
                {userClan.stats.avgElo > 0 ? userClan.stats.avgElo : 'Unranked'}
              </div>
              <p className="text-[10px] font-mono text-slate-400 font-bold">
                {userClan.stats.avgElo > 0 ? `Level ${Math.min(10, Math.floor(userClan.stats.avgElo / 250) + 1)} Bracket` : 'Unranked Placement'}
              </p>
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
                  onClick={() => handleOpenMemberProfile(member)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer hover:scale-[1.02] relative overflow-hidden flex flex-col justify-between gap-3 ${
                    member.isCaptain
                      ? 'bg-gradient-to-b from-[#1C1708] to-[#11131A] border-amber-500/40 shadow-lg hover:border-amber-400'
                      : 'bg-[#141620] border-[#252A3C] hover:border-[#A3E635]/60'
                  }`}
                  title="Click to view player stats"
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

              {/* Pending Lineup Invites (Awaiting Decision) */}
              {pendingInvites.slice(0, Math.max(0, 5 - userClan.members.length)).map((invite, pIdx) => (
                <div
                  key={invite.id}
                  onClick={() => {
                    sound.playSelect();
                    setActiveDecisionInvite(invite);
                  }}
                  className="p-3.5 rounded-2xl border-2 border-dashed border-amber-500/50 hover:border-amber-400 bg-gradient-to-b from-[#1C1708] to-[#12141F] transition cursor-pointer flex flex-col justify-between gap-3 min-h-[135px] group relative"
                  title="Pending Invitation: Click to Accept or Reject"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-slate-400">
                      Slot #{userClan.members.length + pIdx + 1}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase animate-pulse">
                      PENDING
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={invite.friendAvatar}
                      alt={invite.friendName}
                      className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-black font-sans text-white truncate flex items-center gap-1">
                        <span>{invite.friendName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 block truncate">
                        {invite.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                    <span className="text-slate-400">Level {invite.friendLevel}</span>
                    <span className="text-amber-400 font-bold">Awaiting Decision →</span>
                  </div>
                </div>
              ))}

              {/* Open recruitment slots */}
              {Array.from({ length: Math.max(0, 5 - (userClan.members.length + pendingInvites.length)) }).map((_, i) => (
                <div
                  key={`open-lineup-${i}`}
                  onClick={() => { sound.playClick(); setIsInviteModalOpen(true); }}
                  className="p-3.5 rounded-2xl border border-dashed border-[#252A3C] hover:border-[#A3E635]/60 bg-[#0B0E17]/60 hover:bg-[#121624] transition cursor-pointer flex flex-col justify-between gap-3 min-h-[135px] group"
                  title="Click to invite a player to this slot"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-slate-500">
                      Slot #{userClan.members.length + pendingInvites.length + i + 1}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      OPEN SLOT
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl border border-dashed border-slate-700 bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#A3E635] group-hover:border-[#A3E635]/50 transition shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 group-hover:text-white transition">
                        + Open Slot
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Invite Player
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-[#A3E635] transition">
                      Invite Player →
                    </span>
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
              Capacity: <strong className="text-white">{userClan.members.length} / 6</strong>{pendingInvites.length > 0 && <span className="text-amber-400 font-bold ml-1.5">({pendingInvites.length} Pending Invites)</span>}
            </span>
          </div>

          <div className="space-y-2.5">
            {userClan.members.map((member, idx) => (
              <div
                key={member.id}
                onClick={() => handleOpenMemberProfile(member)}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-[#A3E635]/60 hover:scale-[1.005] select-none ${
                  member.isCaptain
                    ? 'bg-[#181510] border-amber-500/30'
                    : 'bg-[#12141D] border-[#222838]'
                }`}
                title={`Click to view ${member.name}'s profile card`}
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
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChangeRole(member.id, e.target.value as ClanMember['role']);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#1A1E2B] border border-[#2D354A] text-xs font-mono text-slate-200 focus:outline-none focus:border-[#A3E635] cursor-pointer"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKickMember(member.id);
                      }}
                      title="Remove from roster"
                      className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400 flex items-center justify-center cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Pending Invitations Slots (Awaiting Player Decision: Accept or Reject) */}
            {pendingInvites.map((invite, pIdx) => (
              <div
                key={invite.id}
                onClick={() => {
                  sound.playSelect();
                  setActiveDecisionInvite(invite);
                }}
                className="p-4 rounded-2xl border-2 border-dashed border-amber-500/50 hover:border-amber-400 bg-gradient-to-r from-[#18140D] via-[#12141F] to-[#0E1019] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none group"
                title="Click to view full invitation details or select decision"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 text-center text-xs font-mono font-bold text-amber-500">
                    #{userClan.members.length + pIdx + 1}
                  </span>
                  <img
                    src={invite.friendAvatar}
                    alt={invite.friendName}
                    className="w-11 h-11 rounded-xl object-cover border border-amber-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-sans text-white">{invite.friendName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" /> Awaiting Decision
                      </span>
                      <span className="text-xs">{invite.friendFlag}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>FACEIT Level {invite.friendLevel}</span>
                      <span>•</span>
                      <span className="text-[#A3E635] font-bold">{invite.friendElo} ELO</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">Role: {invite.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptClanInvite(invite.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-mono font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    title="Accept Invitation into Clan"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Accept</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRejectClanInvite(invite.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 font-mono font-black text-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="Reject / Decline Invitation"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Reject</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelClanInvite(invite.id);
                    }}
                    title="Cancel Invitation"
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Open Recruitment Slots up to 6 capacity */}
            {Array.from({ length: Math.max(0, 6 - (userClan.members.length + pendingInvites.length)) }).map((_, i) => (
              <div
                key={`roster-open-${i}`}
                onClick={() => { sound.playClick(); setIsInviteModalOpen(true); }}
                className="p-4 rounded-2xl border border-dashed border-[#23293D] hover:border-[#A3E635]/60 bg-[#0A0D15]/60 hover:bg-[#101422] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                title="Click to invite a player to this slot"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-600">
                    #{userClan.members.length + pendingInvites.length + i + 1}
                  </span>
                  <div className="w-11 h-11 rounded-xl border border-dashed border-slate-700 bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#A3E635] group-hover:border-[#A3E635]/50 transition shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-400 group-hover:text-white transition flex items-center gap-2">
                      <span>+ Open Roster Slot</span>
                      {userClan.members.length + i === 5 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-white/5 text-slate-500">
                          BENCH / SUB
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      Slot is open. Click to invite a registered teammate.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 group-hover:bg-[#A3E635]/15 text-slate-400 group-hover:text-[#A3E635] border border-white/10 group-hover:border-[#A3E635]/30 text-xs font-mono font-bold transition cursor-pointer self-start sm:self-auto"
                >
                  + Invite Player
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLAN MATCHES & OFFICIAL CS2 SCOREBOARDS (SINGLE DEDICATED WINDOW) */}
      {activeTab === 'clans-list' && (
        <div className="animate-in fade-in duration-200">
          {/* ======================================================== */}
          {/* SINGLE DEDICATED 5v5 MATCH CENTER & SCOREBOARDS WINDOW   */}
          {/* ======================================================== */}
          <div className="w-full rounded-3xl border-2 border-[#1E2842] bg-[#080C16] shadow-[0_12px_45px_rgba(0,0,0,0.75)] overflow-hidden">
            {/* Window Header & Controls */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0C101D] via-[#0A0D18] to-[#080B14] border-b border-[#1E2842] flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#A3E635] text-slate-950 tracking-wider">
                    CALIBER 5v5 OFFICIAL
                  </span>
                  <h3 className="text-lg font-black font-display text-white">Clan Matches & Stats (CS2 Scoreboards)</h3>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Official 5v5 tournament cash match history, performance ratings, and official 17-column CS2 scoreboards
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleSimulateNewClanMatch}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition"
                  title="Queue and schedule official 5v5 clan match against verified European squads"
                >
                  <Swords className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Find 5v5 Clan Match</span>
                </button>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                  {(['all', 'wins', 'losses'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => { sound.playClick(); setMatchFilter(f); }}
                      className={`px-3 py-1 rounded-lg transition capitalize cursor-pointer ${
                        matchFilter === f
                          ? 'bg-white/15 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All Matches' : f === 'wins' ? 'Wins (W)' : 'Losses (L)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Match Table (Directly integrated in the exact same window) */}
            <div className="overflow-x-auto">
              <div className="min-w-[980px]">
                {/* Unified Header Row */}
                <div className="grid grid-cols-[100px_130px_110px_90px_130px_80px_80px_130px_1fr] items-center px-4 py-3 bg-[#0D1220] border-b border-[#1E2842] text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 select-none">
                  <div className="flex items-center gap-1.5 pl-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Date</span>
                  </div>
                  <div className="flex items-center gap-1.5 pl-2">
                    <Trophy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Score</span>
                  </div>
                  <div className="text-center">Prize</div>
                  <div className="text-center">Rating</div>
                  <div className="text-center">K / D / A</div>
                  <div className="text-center">K/D</div>
                  <div className="text-center">ADR</div>
                  <div className="flex items-center gap-1.5 pl-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Map</span>
                  </div>
                  <div className="text-right pr-4 text-slate-500 font-normal text-[10px]">
                    GOTV & Scoreboard
                  </div>
                </div>

                {/* Unified Table Rows */}
                <div className="divide-y divide-[#172036]">
                  {clanMatches
                    .filter(m => {
                      if (matchFilter === 'wins') return m.isWin;
                      if (matchFilter === 'losses') return !m.isWin;
                      return true;
                    })
                    .map(match => (
                      <div
                        key={match.id}
                        onClick={() => openMatchScoreboard(match)}
                        className={`grid grid-cols-[100px_130px_110px_90px_130px_80px_80px_130px_1fr] items-center px-4 py-3.5 transition-colors duration-150 cursor-pointer select-none group relative ${
                          match.isWin
                            ? 'bg-[#0B1E15]/50 hover:bg-[#0E281C]/90 text-slate-200'
                            : 'bg-[#1E0D12]/50 hover:bg-[#281118]/90 text-slate-200'
                        }`}
                        title="Click to open match scoreboard & player stats"
                      >
                        {/* Left indicator accent stripe */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            match.isWin ? 'bg-[#A3E635]' : 'bg-rose-500'
                          }`}
                        />

                        {/* 1. Date & Time */}
                        <div className="flex flex-col pl-2">
                          <span className="text-xs sm:text-sm font-bold text-white tracking-tight">{match.date}</span>
                          <span className="text-[10px] font-mono text-slate-400">{match.time}</span>
                        </div>

                        {/* 2. Score Badge */}
                        <div className="flex items-center gap-2 pl-2">
                          <span
                            className={`px-2 py-0.5 rounded-lg flex items-center justify-center font-black text-[11px] uppercase font-mono shadow-sm ${
                              match.isWin
                                ? 'bg-[#A3E635] text-slate-950 font-black'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {match.isWin ? 'WIN' : 'LOSS'}
                          </span>
                          <span className="font-mono font-black text-sm tracking-wide">
                            <span className={match.isWin ? 'text-[#22C55E]' : 'text-rose-400'}>
                              {match.scoreDisplay.split(':')[0].trim()}
                            </span>
                            <span className="text-slate-500 mx-1">:</span>
                            <span className="text-slate-300">
                              {match.scoreDisplay.split(':')[1].trim()}
                            </span>
                          </span>
                        </div>

                        {/* 3. Cash Prize */}
                        <div className="flex justify-center" title="Tournament Prize Pool Earnings">
                          <div
                            className={`px-2.5 py-0.5 rounded-lg font-mono text-xs font-black flex items-center gap-1 shadow-sm border ${
                              match.isWin
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            <span className="text-xs">{match.isWin ? '💰' : '💸'}</span>
                            <span>{match.prizeEarned || (match.isWin ? '+$75.00' : '-$25.00')}</span>
                          </div>
                        </div>

                        {/* 4. Rating */}
                        <div className="flex justify-center" title="HLTV Performance Rating">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              parseFloat(match.userRating) >= 1.00
                                ? 'bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/35'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/35'
                            }`}
                          >
                            {match.userRating}
                          </span>
                        </div>

                        {/* 5. K / D / A (Guaranteed single line, never wraps!) */}
                        <div className="text-center font-mono text-xs sm:text-sm font-bold text-white whitespace-nowrap" title="Kills / Deaths / Assists">
                          {match.userStats.kills} <span className="text-slate-500">/</span> {match.userStats.deaths} <span className="text-slate-500">/</span> {match.userStats.assists}
                        </div>

                        {/* 6. K/D */}
                        <div className="text-center font-mono text-xs sm:text-sm font-bold text-slate-200" title="Kill / Death Ratio">
                          {match.userStats.kd}
                        </div>

                        {/* 7. ADR */}
                        <div className="text-center font-mono text-xs sm:text-sm font-bold text-slate-200" title="Average Damage per Round">
                          {match.userStats.adr}
                        </div>

                        {/* 8. Map */}
                        <div className="flex items-center gap-2 pl-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-black/60 border border-white/10 shrink-0">
                            <img src={match.mapImage} alt={match.mapDisplayName} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-white truncate">
                            {match.mapDisplayName}
                          </span>
                        </div>

                        {/* 9. Action Buttons */}
                        <div className="flex items-center justify-end gap-1.5 pr-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadDemo(match);
                            }}
                            title="Download GOTV Demo (.dem)"
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sound.playSelect();
                              openMatchScoreboard(match);
                            }}
                            title="Open Full CS2 Scoreboard"
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#A3E635]/20 hover:text-[#A3E635] text-slate-400 flex items-center justify-center transition cursor-pointer border border-transparent hover:border-[#A3E635]/30"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RANKING TEAMS (CALIBERCLUTCH TEAMS DEFAULT + WORLD / REGIONAL / VALVE) */}
      {activeTab === 'clan-rankings' && (() => {
        const isUserRanked = userClan.stats.matches > 0;
        const userPlatformPoints = isUserRanked
          ? userClan.stats.wins * 50 + userClan.stats.tournamentsWon * 200 + Math.floor(userClan.stats.avgElo / 10)
          : 0;

        // 1. CaliberClutch Platform Registered Teams
        const platformClans: (HltvClanEntry & { isUserClan?: boolean })[] = [
          {
            id: userClan.id,
            rank: 1,
            prevRank: 1,
            delta: 0,
            name: userClan.name,
            tag: userClan.tag,
            logo: userClan.logo,
            country: userClan.country,
            flag: userClan.flag,
            points: Math.max(1000, userPlatformPoints),
            vrsPoints: Math.max(2000, userPlatformPoints * 2),
            valveStatus: 'Legends' as const,
            vrsInviteStage: 'Elimination Stage' as const,
            prizeEarned: Math.max(25000, userClan.stats.tournamentsWon * 500),
            matches: Math.max(28, userClan.stats.matches),
            wins: Math.max(23, userClan.stats.wins),
            losses: Math.max(5, userClan.stats.losses),
            winrate: userClan.stats.winrate || '82.1%',
            tournamentsWon: Math.max(3, userClan.stats.tournamentsWon),
            avgElo: Math.max(2650, userClan.stats.avgElo),
            recentForm: ['W', 'W', 'W', 'W', 'L'] as ('W'|'L')[],
            region: 'Balkans' as const,
            verified: userClan.verified,
            isUserClan: true,
            roster: userClan.members.slice(0, 5).map(m => ({
              name: m.name,
              role: m.role,
              flag: m.flag,
              level: m.level,
              elo: m.elo,
              avatar: m.avatar,
              countryCode: emojiToCountryCode(m.flag),
            })),
          },
          {
            id: 'balkan-tigers-plat',
            rank: 2,
            prevRank: 3,
            delta: 1,
            name: 'Balkan Tigers',
            tag: 'BTG',
            logo: '/images/clan_badges/badge_caliber_crimson.svg',
            country: 'Kosovo',
            flag: '🇽🇰',
            points: 875,
            vrsPoints: 1750,
            valveStatus: 'Challengers' as const,
            vrsInviteStage: 'Opening Stage' as const,
            prizeEarned: 18500,
            matches: 32,
            wins: 25,
            losses: 7,
            winrate: '78.1%',
            tournamentsWon: 2,
            avgElo: 2580,
            recentForm: ['W', 'W', 'L', 'W', 'W'],
            region: 'Balkans' as const,
            verified: true,
            roster: [
              { name: 'Kastrioti', role: 'IGL / Captain', flag: '🇽🇰', countryCode: 'xk', level: 10, elo: 2720 },
              { name: 'ShqipeAim', role: 'Entry Fragger', flag: '🇦🇱', countryCode: 'al', level: 10, elo: 2780 },
              { name: 'DriniSniper', role: 'AWPer', flag: '🇽🇰', countryCode: 'xk', level: 9, elo: 2640 },
              { name: 'LabiLurker', role: 'Lurker', flag: '🇽🇰', countryCode: 'xk', level: 9, elo: 2590 },
              { name: 'ValonSupport', role: 'Support', flag: '🇽🇰', countryCode: 'xk', level: 9, elo: 2510 },
            ],
          },
          {
            id: 'dardania-esports-plat',
            rank: 3,
            prevRank: 2,
            delta: -1,
            name: 'Dardania Esports',
            tag: 'DDA',
            logo: '/images/clan_badges/badge_caliber_gold.svg',
            country: 'Albania',
            flag: '🇦🇱',
            points: 790,
            vrsPoints: 1580,
            valveStatus: 'Challengers' as const,
            vrsInviteStage: 'Opening Stage' as const,
            prizeEarned: 14200,
            matches: 29,
            wins: 21,
            losses: 8,
            winrate: '72.4%',
            tournamentsWon: 2,
            avgElo: 2520,
            recentForm: ['W', 'L', 'W', 'W', 'L'],
            region: 'Balkans' as const,
            verified: true,
            roster: [
              { name: 'Gjergji', role: 'IGL / Captain', flag: '🇦🇱', countryCode: 'al', level: 10, elo: 2690 },
              { name: 'IlirEagle', role: 'AWPer', flag: '🇦🇱', countryCode: 'al', level: 9, elo: 2630 },
              { name: 'RozafaAim', role: 'Entry Fragger', flag: '🇦🇱', countryCode: 'al', level: 9, elo: 2580 },
              { name: 'Dukagjin', role: 'Support', flag: '🇽🇰', countryCode: 'xk', level: 9, elo: 2540 },
              { name: 'BesaLurker', role: 'Lurker', flag: '🇦🇱', countryCode: 'al', level: 9, elo: 2510 },
            ],
          },
          {
            id: 'prishtina-snipers-plat',
            rank: 4,
            prevRank: 4,
            delta: 0,
            name: 'Prishtina Snipers',
            tag: 'PRN',
            logo: '/images/clan_badges/badge_caliber_sniper.svg',
            country: 'Kosovo',
            flag: '🇽🇰',
            points: 710,
            vrsPoints: 1420,
            valveStatus: 'Contenders' as const,
            vrsInviteStage: 'Closed Qualifier' as const,
            prizeEarned: 11000,
            matches: 26,
            wins: 18,
            losses: 8,
            winrate: '69.2%',
            tournamentsWon: 1,
            avgElo: 2470,
            recentForm: ['L', 'W', 'W', 'L', 'W'],
            region: 'Balkans' as const,
            verified: true,
            roster: [
              { name: 'SharriAWP', role: 'AWPer', flag: '🇽🇰', countryCode: 'xk', level: 10, elo: 2710 },
              { name: 'DrenicaAim', role: 'Entry Fragger', flag: '🇽🇰', countryCode: 'xk', level: 9, elo: 2560 },
              { name: 'Ulpiana', role: 'Support', flag: '🇽🇰', countryCode: 'xk', level: 8, elo: 2420 },
              { name: 'GërmiaIGL', role: 'IGL / Captain', flag: '🇽🇰', countryCode: 'xk', level: 9, elo: 2490 },
              { name: 'Arbëria', role: 'Anchor', flag: '🇽🇰', countryCode: 'xk', level: 8, elo: 2450 },
            ],
          }
        ];

        // 2. Esports & Circuit Pro Teams (Pure HLTV Teams)
        const circuitClans: (HltvClanEntry & { isUserClan?: boolean })[] = HLTV_CLANS_DATA.map(c => ({ ...c }));

        // Active list depending on selected ranking category
        let displayedClans: (HltvClanEntry & { isUserClan?: boolean })[] = [];

        if (rankingCategory === 'platform') {
          // 1. CaliberClutch Platform Ladder
          displayedClans = platformClans;
        } else if (rankingCategory === 'world') {
          // 2. HLTV Official World Ranking (#1 FURIA, #2 MOUZ, #3 Spirit, #4 Vitality, #5 Falcons...)
          displayedClans = [...circuitClans]
            .sort((a, b) => (a.rank || 999) - (b.rank || 999))
            .map((c) => ({
              ...c,
              rank: c.rank,
              delta: c.delta,
            }));
        } else if (rankingCategory === 'regional') {
          // 3. HLTV Regional Ranking (Default to Europe: #1 NaVi, #2 G2, #3 Vitality, #4 Spirit, #5 FaZe, #6 MOUZ...)
          const activeContinent = selectedRegionalContinent || (!selectedRegionalCountry ? 'Europe' : null);
          let regList = [...circuitClans];

          if (selectedRegionalCountry) {
            const countryLower = selectedRegionalCountry.toLowerCase();
            regList = regList.filter(c => {
              const cLower = c.country.toLowerCase();
              if (cLower === countryLower) return true;
              if ((countryLower === 'türkiye' || countryLower === 'turkey') && (cLower === 'türkiye' || cLower === 'turkey')) return true;
              if ((countryLower === 'united states' || countryLower === 'usa' || countryLower === 'us') && (cLower === 'united states' || cLower === 'usa' || cLower === 'us')) return true;
              if ((countryLower === 'united kingdom' || countryLower === 'uk') && (cLower === 'united kingdom' || cLower === 'uk')) return true;
              return false;
            });
          } else if (activeContinent) {
            if (activeContinent === 'Europe') {
              regList = regList.filter(c => 
                c.region === 'Europe' || 
                c.region === 'Balkans' || 
                c.region === 'Nordics' ||
                ['kosovo', 'albania', 'denmark', 'finland', 'germany', 'kazakhstan', 'poland', 'portugal', 'romania', 'russia', 'sweden', 'türkiye', 'turkey', 'ukraine', 'united kingdom', 'north macedonia', 'france', 'norway', 'belarus', 'czechia', 'hungary', 'slovakia', 'spain'].includes(c.country.toLowerCase())
              );
            } else if (activeContinent === 'North America') {
              regList = regList.filter(c => c.region === 'North America' || ['united states', 'canada', 'usa'].includes(c.country.toLowerCase()));
            } else if (activeContinent === 'South America') {
              regList = regList.filter(c => c.region === 'South America' || ['brazil', 'argentina', 'uruguay', 'chile'].includes(c.country.toLowerCase()));
            } else if (activeContinent === 'Asia') {
              regList = regList.filter(c => c.region === 'Asia' || ['china', 'mongolia'].includes(c.country.toLowerCase()));
            } else if (activeContinent === 'Oceania') {
              regList = regList.filter(c => c.region === 'Oceania' || ['australia', 'new zealand'].includes(c.country.toLowerCase()));
            }
          }

          displayedClans = regList
            .sort((a, b) => b.points - a.points)
            .map((c, idx) => ({
              ...c,
              rank: idx + 1,
              delta: c.delta,
            }));
        }

        // Region / Search filters
        const filteredClans = displayedClans.filter(c => {
          if (hltvSearch.trim()) {
            const q = hltvSearch.toLowerCase();
            const matchName = c.name.toLowerCase().includes(q);
            const matchTag = c.tag.toLowerCase().includes(q);
            const matchPlayer = c.roster.some(r => r.name.toLowerCase().includes(q));
            const matchCountry = c.country.toLowerCase().includes(q);
            return matchName || matchTag || matchPlayer || matchCountry;
          }
          return true;
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* HLTV-STYLE CATEGORY NAVIGATION & REGIONAL MEGA-MENU */}
            <div className="bg-[#1b222c] border border-[#2b3545] rounded-3xl overflow-hidden shadow-2xl">
              {/* Tab Bar matching HLTV exact header */}
              <div className="flex items-stretch flex-wrap border-b border-[#2b3545] bg-[#141b24]">
                {/* 1. CaliberClutch Teams Platform Tab (Default upon entry) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setRankingCategory('platform');
                    setSelectedRegionalCountry(null);
                    setSelectedRegionalContinent(null);
                  }}
                  className={`px-5 py-3.5 text-xs font-mono font-bold flex items-center gap-2 border-r border-[#2b3545] transition cursor-pointer ${
                    rankingCategory === 'platform'
                      ? 'bg-[#A3E635] text-slate-950 font-black shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>CaliberClutch Teams</span>
                </button>

                {/* 2. World ranking Tab */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setRankingCategory('world');
                    setSelectedRegionalCountry(null);
                    setSelectedRegionalContinent(null);
                  }}
                  className={`px-5 py-3.5 text-xs font-mono font-bold flex items-center gap-2 border-r border-[#2b3545] transition cursor-pointer ${
                    rankingCategory === 'world'
                      ? 'bg-[#252f3d] text-white border-b-2 border-b-[#38bdf8] font-black'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5 text-slate-300" />
                  <span>World ranking</span>
                </button>

                {/* 3. Regional rankings Tab */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setRankingCategory('regional');
                    setSelectedRegionalContinent('Europe');
                    setSelectedRegionalCountry(null);
                  }}
                  className={`px-5 py-3.5 text-xs font-mono font-bold flex items-center gap-2 border-r border-[#2b3545] transition cursor-pointer ${
                    rankingCategory === 'regional'
                      ? 'bg-[#252f3d] text-white border-b-2 border-b-[#38bdf8] font-black'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5 text-slate-300" />
                  <span>Regional rankings</span>
                </button>



                {/* Right side of tab bar: Official HLTV Direct Link */}
                {rankingCategory !== 'platform' && (
                  <div className="ml-auto flex items-center px-4 py-2 border-l border-[#2b3545]">
                    <a
                      href={
                        rankingCategory === 'world'
                          ? 'https://www.hltv.org/ranking/teams'
                          : selectedRegionalCountry
                          ? `https://www.hltv.org/ranking/teams/country/${encodeURIComponent(selectedRegionalCountry)}`
                          : 'https://www.hltv.org/ranking/teams/country/Europe'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202b3d] hover:bg-[#2b3a54] text-[#38bdf8] hover:text-white border border-[#38bdf8]/30 hover:border-[#38bdf8]/60 text-xs font-mono font-bold transition shadow-sm group"
                      title="Open official HLTV ranking page"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8] group-hover:text-white" />
                      <span className="hidden sm:inline">
                        {rankingCategory === 'world' ? 'HLTV World Ranking' : (selectedRegionalCountry ? `HLTV ${selectedRegionalCountry}` : 'HLTV Regional (Europe)')}
                      </span>
                      <span className="sm:hidden">HLTV.org</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                    </a>
                  </div>
                )}
              </div>

              {/* REGIONAL ACCORDION / MULTI-COLUMN MENU (Exact match to screenshot & fully clickable continent headers) */}
              {rankingCategory === 'regional' && (
                <div className="p-6 bg-[#202734] border-t border-[#2b3545] text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* COLUMN 1 */}
                    <div className="space-y-6">
                      {/* North America Header */}
                      <div>
                        <button
                          onClick={() => {
                            sound.playClick();
                            if (selectedRegionalContinent === 'North America') {
                              setSelectedRegionalContinent(null);
                            } else {
                              setSelectedRegionalContinent('North America');
                              setSelectedRegionalCountry(null);
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left text-sm font-bold mb-2.5 tracking-wide px-2.5 py-1.5 rounded-lg transition cursor-pointer group ${
                            selectedRegionalContinent === 'North America'
                              ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-black border border-[#38bdf8]/40 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                          title="Click to view all North American teams"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>North America</span>
                            <span className="text-[10px] font-mono font-normal opacity-60 group-hover:opacity-100">
                              (All NA)
                            </span>
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedRegionalContinent === 'North America' ? 'text-[#38bdf8] rotate-90' : 'text-slate-500 group-hover:text-white'}`} />
                        </button>
                        <div className="space-y-1">
                          {REGIONAL_COLUMNS.column1.northAmerica.map(c => {
                            const isSelected = selectedRegionalCountry === c.name;
                            return (
                              <button
                                key={c.name}
                                onClick={() => {
                                  sound.playClick();
                                  setSelectedRegionalCountry(isSelected ? null : c.name);
                                  setSelectedRegionalContinent(null);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-bold border border-[#38bdf8]/40 shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <CountryFlag code={c.code} name={c.name} size="sm" />
                                <span className="text-xs font-medium">{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* South America Header */}
                      <div>
                        <button
                          onClick={() => {
                            sound.playClick();
                            if (selectedRegionalContinent === 'South America') {
                              setSelectedRegionalContinent(null);
                            } else {
                              setSelectedRegionalContinent('South America');
                              setSelectedRegionalCountry(null);
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left text-sm font-bold mb-2.5 tracking-wide px-2.5 py-1.5 rounded-lg transition cursor-pointer group ${
                            selectedRegionalContinent === 'South America'
                              ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-black border border-[#38bdf8]/40 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                          title="Click to view all South American teams"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>South America</span>
                            <span className="text-[10px] font-mono font-normal opacity-60 group-hover:opacity-100">
                              (All SA)
                            </span>
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedRegionalContinent === 'South America' ? 'text-[#38bdf8] rotate-90' : 'text-slate-500 group-hover:text-white'}`} />
                        </button>
                        <div className="space-y-1">
                          {REGIONAL_COLUMNS.column1.southAmerica.map(c => {
                            const isSelected = selectedRegionalCountry === c.name;
                            return (
                              <button
                                key={c.name}
                                onClick={() => {
                                  sound.playClick();
                                  setSelectedRegionalCountry(isSelected ? null : c.name);
                                  setSelectedRegionalContinent(null);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-bold border border-[#38bdf8]/40 shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <CountryFlag code={c.code} name={c.name} size="sm" />
                                <span className="text-xs font-medium">{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Europe Header */}
                      <div>
                        <button
                          onClick={() => {
                            sound.playClick();
                            if (selectedRegionalContinent === 'Europe') {
                              setSelectedRegionalContinent(null);
                            } else {
                              setSelectedRegionalContinent('Europe');
                              setSelectedRegionalCountry(null);
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left text-sm font-bold mb-2.5 tracking-wide px-2.5 py-1.5 rounded-lg transition cursor-pointer group ${
                            selectedRegionalContinent === 'Europe'
                              ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-black border border-[#38bdf8]/40 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                          title="Click to view all European teams"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>Europe</span>
                            <span className="text-[10px] font-mono font-normal opacity-60 group-hover:opacity-100">
                              (All EU)
                            </span>
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedRegionalContinent === 'Europe' ? 'text-[#38bdf8] rotate-90' : 'text-slate-500 group-hover:text-white'}`} />
                        </button>
                        <div className="space-y-1">
                          {REGIONAL_COLUMNS.column1.europe.map(c => {
                            const isSelected = selectedRegionalCountry === c.name;
                            return (
                              <button
                                key={c.name}
                                onClick={() => {
                                  sound.playClick();
                                  setSelectedRegionalCountry(isSelected ? null : c.name);
                                  setSelectedRegionalContinent(null);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-bold border border-[#38bdf8]/40 shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <CountryFlag code={c.code} name={c.name} size="sm" />
                                <span className="text-xs font-medium">{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 2 (Europe continued) */}
                    <div>
                      <div className="space-y-1 pt-0 md:pt-11">
                        {REGIONAL_COLUMNS.column2.europe.map(c => {
                          const isSelected = selectedRegionalCountry === c.name;
                          return (
                            <button
                              key={c.name}
                              onClick={() => {
                                sound.playClick();
                                setSelectedRegionalCountry(isSelected ? null : c.name);
                                setSelectedRegionalContinent(null);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                isSelected
                                  ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-bold border border-[#38bdf8]/40 shadow-sm'
                                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <CountryFlag code={c.code} name={c.name} size="sm" />
                              <span className="text-xs font-medium">{c.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* COLUMN 3 (Europe end + Asia + Oceania) */}
                    <div className="space-y-6">
                      {/* Europe Part 3 */}
                      <div className="space-y-1 pt-0 md:pt-11">
                        {REGIONAL_COLUMNS.column3.europe.map(c => {
                          const isSelected = selectedRegionalCountry === c.name;
                          return (
                            <button
                              key={c.name}
                              onClick={() => {
                                sound.playClick();
                                setSelectedRegionalCountry(isSelected ? null : c.name);
                                setSelectedRegionalContinent(null);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                isSelected
                                  ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-bold border border-[#38bdf8]/40 shadow-sm'
                                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <CountryFlag code={c.code} name={c.name} size="sm" />
                              <span className="text-xs font-medium">{c.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Asia Header */}
                      <div>
                        <button
                          onClick={() => {
                            sound.playClick();
                            if (selectedRegionalContinent === 'Asia') {
                              setSelectedRegionalContinent(null);
                            } else {
                              setSelectedRegionalContinent('Asia');
                              setSelectedRegionalCountry(null);
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left text-sm font-bold mb-2.5 tracking-wide px-2.5 py-1.5 rounded-lg transition cursor-pointer group ${
                            selectedRegionalContinent === 'Asia'
                              ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-black border border-[#38bdf8]/40 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                          title="Click to view all Asian teams"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>Asia</span>
                            <span className="text-[10px] font-mono font-normal opacity-60 group-hover:opacity-100">
                              (All Asia)
                            </span>
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedRegionalContinent === 'Asia' ? 'text-[#38bdf8] rotate-90' : 'text-slate-500 group-hover:text-white'}`} />
                        </button>
                        <div className="space-y-1">
                          {REGIONAL_COLUMNS.column3.asia.map(c => {
                            const isSelected = selectedRegionalCountry === c.name;
                            return (
                              <button
                                key={c.name}
                                onClick={() => {
                                  sound.playClick();
                                  setSelectedRegionalCountry(isSelected ? null : c.name);
                                  setSelectedRegionalContinent(null);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-bold border border-[#38bdf8]/40 shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <CountryFlag code={c.code} name={c.name} size="sm" />
                                <span className="text-xs font-medium">{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Oceania Header */}
                      <div>
                        <button
                          onClick={() => {
                            sound.playClick();
                            if (selectedRegionalContinent === 'Oceania') {
                              setSelectedRegionalContinent(null);
                            } else {
                              setSelectedRegionalContinent('Oceania');
                              setSelectedRegionalCountry(null);
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left text-sm font-bold mb-2.5 tracking-wide px-2.5 py-1.5 rounded-lg transition cursor-pointer group ${
                            selectedRegionalContinent === 'Oceania'
                              ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-black border border-[#38bdf8]/40 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                          title="Click to view all Oceania teams"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>Oceania</span>
                            <span className="text-[10px] font-mono font-normal opacity-60 group-hover:opacity-100">
                              (All OCE)
                            </span>
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedRegionalContinent === 'Oceania' ? 'text-[#38bdf8] rotate-90' : 'text-slate-500 group-hover:text-white'}`} />
                        </button>
                        <div className="space-y-1">
                          {REGIONAL_COLUMNS.column3.oceania.map(c => {
                            const isSelected = selectedRegionalCountry === c.name;
                            return (
                              <button
                                key={c.name}
                                onClick={() => {
                                  sound.playClick();
                                  setSelectedRegionalCountry(isSelected ? null : c.name);
                                  setSelectedRegionalContinent(null);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-bold border border-[#38bdf8]/40 shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <CountryFlag code={c.code} name={c.name} size="sm" />
                                <span className="text-xs font-medium">{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Regional bottom filter action bar */}
                  <div className="mt-6 pt-4 border-t border-[#2b3545] flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400">Active Regional Filter:</span>
                      {selectedRegionalCountry ? (
                        <span className="px-3 py-1 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-bold flex items-center gap-2">
                          <CountryFlag code={getCountryCode(selectedRegionalCountry)} name={selectedRegionalCountry} size="xs" />
                          <span>{selectedRegionalCountry} (National)</span>
                          <button
                            onClick={() => {
                              sound.playClick();
                              setSelectedRegionalCountry(null);
                            }}
                            className="hover:text-white cursor-pointer ml-1 text-slate-400 hover:text-white"
                            title="Clear country filter"
                          >
                            ✕
                          </button>
                        </span>
                      ) : selectedRegionalContinent ? (
                        <span className="px-3 py-1 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-bold flex items-center gap-2">
                          <span>{selectedRegionalContinent === 'Europe' ? '🇪🇺' : selectedRegionalContinent === 'North America' ? '🇺🇸' : selectedRegionalContinent === 'South America' ? '🇧🇷' : selectedRegionalContinent === 'Asia' ? '🌏' : '🇦🇺'}</span>
                          <span>{selectedRegionalContinent} (Continental)</span>
                          <button
                            onClick={() => {
                              sound.playClick();
                              setSelectedRegionalContinent(null);
                            }}
                            className="hover:text-white cursor-pointer ml-1 text-slate-400 hover:text-white"
                            title="Clear continent filter"
                          >
                            ✕
                          </button>
                        </span>
                      ) : (
                        <span className="text-white font-bold px-2.5 py-1 rounded bg-white/5 border border-white/10">
                          All Regional Standings (Global)
                        </span>
                      )}
                    </div>

                    {(selectedRegionalCountry || selectedRegionalContinent) && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setSelectedRegionalCountry(null);
                          setSelectedRegionalContinent(null);
                        }}
                        className="text-xs font-mono text-[#38bdf8] hover:underline cursor-pointer"
                      >
                        Reset to All Regional Teams →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Context Sub-Header for Active Ranking Category */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0F1424] via-[#090D18] to-[#0F1424] border border-[#20293D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#A3E635] text-slate-950">
                    {rankingCategory === 'platform' && 'CALIBERCLUTCH PLATFORM LADDER'}
                    {rankingCategory === 'world' && 'GLOBAL CS2 PRO CIRCUIT'}
                    {rankingCategory === 'regional' && (
                      selectedRegionalCountry
                        ? `REGIONAL CIRCUIT • ${selectedRegionalCountry.toUpperCase()}`
                        : selectedRegionalContinent
                        ? `REGIONAL CIRCUIT • ${selectedRegionalContinent.toUpperCase()}`
                        : 'REGIONAL CIRCUIT • EUROPE'
                    )}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300">
                    {rankingCategory === 'platform' && 'Season 1 Verified'}
                    {rankingCategory === 'world' && 'HLTV Official World Rankings'}
                    {rankingCategory === 'regional' && (
                      selectedRegionalCountry
                        ? `${selectedRegionalCountry} National Standings`
                        : `${selectedRegionalContinent || 'Europe'} Regional Standings`
                    )}
                  </span>

                  {/* HLTV Source Badge link */}
                  {rankingCategory !== 'platform' && (
                    <a
                      href={
                        rankingCategory === 'world'
                          ? 'https://www.hltv.org/ranking/teams'
                          : selectedRegionalCountry
                          ? `https://www.hltv.org/ranking/teams/country/${encodeURIComponent(selectedRegionalCountry)}`
                          : 'https://www.hltv.org/ranking/teams/country/Europe'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#38bdf8]/15 hover:bg-[#38bdf8]/30 text-[#38bdf8] border border-[#38bdf8]/30 transition"
                      title="Open HLTV official standings"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Official HLTV Source ↗</span>
                    </a>
                  )}
                </div>
                <h4 className="text-xl font-black font-display text-white">
                  {rankingCategory === 'platform' && 'Registered Platform Teams'}
                  {rankingCategory === 'world' && 'CS2 World Team Rankings'}
                  {rankingCategory === 'regional' && (
                    selectedRegionalCountry
                      ? `Regional Rankings: ${selectedRegionalCountry}`
                      : `${selectedRegionalContinent || 'Europe'} Regional Rankings`
                  )}
                </h4>
                <p className="text-xs font-mono text-slate-400">
                  {rankingCategory === 'platform' && 'Teams registered on CaliberClutch competing in official 5v5 tournaments and community clan matches.'}
                  {rankingCategory === 'world' && 'Global team power rankings updated weekly based on official 5v5 tournament performance and match consistency.'}
                  {rankingCategory === 'regional' && (
                    selectedRegionalCountry
                      ? `Official regional standings for active competitive teams located in ${selectedRegionalCountry}.`
                      : `Official regional power rankings for all active competitive teams across ${selectedRegionalContinent || 'Europe'}.`
                  )}
                </p>
              </div>

              {/* Search input */}
              <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={hltvSearch}
                    onChange={(e) => setHltvSearch(e.target.value)}
                    placeholder="Search team, tag, country, player..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#141A28] border border-[#232D44] text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#A3E635]"
                  />
                </div>
              </div>
            </div>

            {/* RANKINGS CARDS LIST (Matching HLTV Screenshot 1 & 2) */}
            <div className="space-y-2.5">
              {filteredClans.map((clan) => {
                const isExpanded = expandedHltvClanId === clan.id;
                const delta = clan.delta !== undefined ? clan.delta : (clan.prevRank - clan.rank);

                return (
                  <div
                    key={clan.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'bg-[#1b2331] border-[#38bdf8]/40 shadow-xl'
                        : clan.isUserClan
                        ? 'bg-gradient-to-r from-[#0F1829] via-[#0B101C] to-[#0F1829] border-[#A3E635]/60 shadow-[0_0_20px_rgba(163,230,53,0.15)]'
                        : 'bg-[#141b25] border-[#222c3c] hover:border-[#334259] hover:bg-[#18212e]'
                    }`}
                  >
                    {/* Main Row matching HLTV Screenshot 1 */}
                    <div
                      onClick={() => {
                        sound.playClick();
                        setExpandedHltvClanId(isExpanded ? null : clan.id);
                      }}
                      className="p-3 sm:p-3.5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none group"
                    >
                      {/* Left: Rank, Logo, Name & Subtitle Roster */}
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        {/* Rank Badge Box */}
                        <div className="w-10 h-10 rounded-xl bg-[#0e141d] border border-white/5 flex items-center justify-center font-display font-black text-sm sm:text-base text-slate-300 group-hover:text-white shrink-0">
                          #{clan.rank}
                        </div>

                        {/* Team Logo */}
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0">
                          <img
                            src={clan.logo}
                            alt={clan.name}
                            className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/clan_badges/badge_caliber_gold.svg';
                            }}
                          />
                        </div>

                        {/* Team Name, Points & Subtitle Line */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-display font-black text-white text-sm sm:text-base tracking-wide group-hover:text-[#38bdf8] transition truncate">
                              {clan.name}
                            </span>
                            <span className="text-xs sm:text-sm font-mono text-slate-400">
                              ({rankingCategory === 'platform'
                                ? `${clan.points.toLocaleString()} Caliber points`
                                : `${clan.points.toLocaleString()} HLTV points`})
                            </span>
                            {clan.isUserClan && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-[#A3E635] text-slate-950 uppercase">
                                YOUR TEAM
                              </span>
                            )}
                          </div>

                          {/* Subtitle: 5 player names joined with middot · */}
                          <div className="text-xs font-mono text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                            <span>
                              {clan.roster.slice(0, 5).map(m => m.name).join(' · ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Delta indicator */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="min-w-[32px] text-right font-mono font-bold text-sm sm:text-base">
                          {delta > 0 ? (
                            <span className="text-[#A3E635] flex items-center justify-end font-black">
                              +{delta}
                            </span>
                          ) : delta < 0 ? (
                            <span className="text-rose-500 flex items-center justify-end font-black">
                              {delta}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-bold">
                              -
                            </span>
                          )}
                        </div>

                        <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180 text-white bg-white/10' : 'text-slate-400 group-hover:text-white'}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail (Matching Screenshot 2) */}
                    {isExpanded && (
                      <div className="px-3 pb-3 sm:px-4 sm:pb-4 border-t border-[#253245] bg-[#121924] space-y-3 animate-in fade-in duration-150">
                        {/* 5 Player Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3">
                          {clan.roster.slice(0, 5).map((player, pIdx) => {
                            const countryCode = player.countryCode || emojiToCountryCode(player.flag);
                            return (
                              <div
                                key={pIdx}
                                className="rounded-xl border border-[#2b384c] bg-[#1a2332] overflow-hidden flex flex-col group/player hover:border-[#38bdf8]/60 transition shadow-sm"
                              >
                                {/* Photo Area with Pro Jersey Portrait */}
                                <div className="relative aspect-[1/1.05] sm:h-32 bg-gradient-to-b from-[#1e293b] via-[#151d2a] to-[#0f1520] flex items-center justify-center overflow-hidden">
                                  {player.avatar ? (
                                    <img
                                      src={player.avatar}
                                      alt={player.name}
                                      className="w-full h-full object-cover object-top drop-shadow group-hover/player:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="relative w-full h-full flex flex-col items-center justify-end">
                                      <img
                                        src={clan.logo}
                                        alt=""
                                        className="absolute w-14 h-14 opacity-10 object-contain top-2"
                                      />
                                      <div className="relative flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-600/70 border border-white/10 mb-1" />
                                        <div className="w-20 h-12 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700 border-t border-x border-white/10 flex items-center justify-center">
                                          <span className="text-[10px] font-mono font-bold text-white/50">#0{pIdx + 1}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Player Flag + Nickname Footer (Matching Screenshot 2) */}
                                <div className="py-2 px-1.5 bg-[#141b26] border-t border-white/5 flex items-center justify-center gap-1.5 min-w-0">
                                  <CountryFlag code={countryCode} name={player.flag} size="xs" />
                                  <span className="text-xs font-bold text-white font-mono truncate tracking-wide">
                                    {player.name}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Action Links Bar: ONLY show for pro circuit / HLTV teams, NOT for CaliberClutch Teams */}
                        {rankingCategory !== 'platform' && !clan.isUserClan && (
                          <div className="grid grid-cols-2 border-t border-[#232f42] pt-2 text-center divide-x divide-[#232f42]">
                            <a
                              href={getHltvProfileUrl(clan.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playClick();
                              }}
                              className="py-2 px-3 text-xs font-mono font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer group/link"
                            >
                              <span>HLTV Team profile</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/link:text-white" />
                            </a>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playClick();
                                setDetailedClanStatsId(detailedClanStatsId === clan.id ? null : clan.id);
                              }}
                              className={`py-2 px-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                detailedClanStatsId === clan.id
                                  ? 'text-[#38bdf8] font-bold'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <span>Ranking details</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${detailedClanStatsId === clan.id ? 'rotate-180 text-[#38bdf8]' : 'text-slate-500'}`} />
                            </button>
                          </div>
                        )}

                        {/* Optional In-depth Stats Panel (Triggered by Ranking details) */}
                        {rankingCategory !== 'platform' && !clan.isUserClan && detailedClanStatsId === clan.id && (
                          <div className="p-4 rounded-xl bg-[#0b1018] border border-[#202b3d] animate-in fade-in duration-150 space-y-3 text-xs font-mono">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                              <div className="p-2.5 rounded-lg bg-white/5">
                                <span className="text-[10px] text-slate-400 uppercase block">Average ELO</span>
                                <span className="text-sm font-black text-white">{clan.avgElo} ELO</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-white/5">
                                <span className="text-[10px] text-slate-400 uppercase block">Match Winrate</span>
                                <span className="text-sm font-black text-emerald-400">{clan.winrate} ({clan.wins}W - {clan.losses}L)</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-white/5">
                                <span className="text-[10px] text-slate-400 uppercase block">Championship Cups</span>
                                <span className="text-sm font-black text-amber-400">{clan.tournamentsWon} Cups</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-white/5">
                                <span className="text-[10px] text-slate-400 uppercase block">Major Status</span>
                                <span className="text-sm font-black text-[#38bdf8]">{clan.valveStatus}</span>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                              <span>Official Ranking Source:</span>
                              <a
                                href="https://www.hltv.org/ranking/teams"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#38bdf8] hover:underline flex items-center gap-1 font-bold"
                              >
                                <span>HLTV.org Standings</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Empty state for Regional country or continent with 0 teams */}
              {rankingCategory === 'regional' && (selectedRegionalCountry || selectedRegionalContinent) && filteredClans.length === 0 && (
                <div className="p-8 rounded-3xl bg-[#121624] border border-dashed border-[#232B3E] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center mx-auto text-xl">
                    📍
                  </div>
                  <h5 className="font-display font-black text-white text-base">No Teams Found for {selectedRegionalCountry || selectedRegionalContinent}</h5>
                  <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
                    There are currently no ranked teams registered under {selectedRegionalCountry || selectedRegionalContinent}. Be the first squad to register from {selectedRegionalCountry || selectedRegionalContinent} on CaliberClutch!
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSelectedRegionalCountry(null);
                        setSelectedRegionalContinent(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      View All Regional Teams
                    </button>
                  </div>
                </div>
              )}

              {/* Special info banner for CaliberClutch Teams if only 1 team is registered */}
              {rankingCategory === 'platform' && filteredClans.length === 1 && (
                <div className="p-5 rounded-2xl bg-[#0B0E16] border border-dashed border-[#232B3E] text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center mx-auto">
                    <Users className="w-5 h-5" />
                  </div>
                  <h5 className="font-display font-black text-white text-sm">No Rival Clans Registered Yet</h5>
                  <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
                    Your team is currently holding Rank #1 on CaliberClutch! Share your clan tag, invite other squads, and play official 5v5 matches to establish the community ladder.
                  </p>
                  <div className="pt-1 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('roster');
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold transition cursor-pointer"
                    >
                      Manage Roster
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('clans-list');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Find 5v5 Clan Match
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* FULL 1:1 FACEIT SCOREBOARD MODAL (EXACT REPLICA OF REFERENCE IMAGE 2 & FULLY INTERACTIVE) */}
      {selectedScoreboardMatch && (
        <div 
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedScoreboardMatch(null)}
        >
          <div 
            className="w-full max-w-6xl max-h-[93vh] overflow-y-auto bg-gradient-to-b from-[#0B0F1A] via-[#080C16] to-[#05070E] border-2 border-[#1E2942] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] space-y-5 text-left relative p-5 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={selectedScoreboardMatch.mapImage} alt={selectedScoreboardMatch.mapDisplayName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {selectedScoreboardMatch.mapDisplayName}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedScoreboardMatch.date} {selectedScoreboardMatch.time}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-[#22C55E] flex items-center gap-1">
                      <Radio className="w-3 h-3 text-[#22C55E]" />
                      128-Tick Dedicated Server
                    </span>
                  </div>
                  <h3 className="text-lg font-black font-display text-white mt-0.5">
                    {selectedScoreboardMatch.team1?.name || selectedScoreboardMatch.clan1?.name} vs {selectedScoreboardMatch.team2?.name || selectedScoreboardMatch.clan2?.name} • Match Center
                  </h3>
                </div>
              </div>

              {/* Sub-Tabs: Scoreboard / Rounds / Performance (Vortex / Caliber Clutch Signature Style) */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#070912] p-1.5 rounded-2xl border border-[#182136] shadow-inner gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setScoreboardSubTab('scoreboard'); }}
                    className={`px-4 py-2 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      scoreboardSubTab === 'scoreboard'
                        ? 'bg-gradient-to-r from-[#84CC16] to-[#A3E635] text-slate-950 shadow-lg shadow-[#A3E635]/30 scale-102'
                        : 'bg-[#0E1322] hover:bg-[#141B30] text-slate-300 hover:text-white border border-[#1E2842] hover:border-[#A3E635]/40'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Scoreboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setScoreboardSubTab('rounds'); }}
                    className={`px-4 py-2 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      scoreboardSubTab === 'rounds'
                        ? 'bg-gradient-to-r from-[#84CC16] to-[#A3E635] text-slate-950 shadow-lg shadow-[#A3E635]/30 scale-102'
                        : 'bg-[#0E1322] hover:bg-[#141B30] text-slate-300 hover:text-white border border-[#1E2842] hover:border-[#A3E635]/40'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Rounds</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setScoreboardSubTab('performance'); }}
                    className={`px-4 py-2 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      scoreboardSubTab === 'performance'
                        ? 'bg-gradient-to-r from-[#84CC16] to-[#A3E635] text-slate-950 shadow-lg shadow-[#A3E635]/30 scale-102'
                        : 'bg-[#0E1322] hover:bg-[#141B30] text-slate-300 hover:text-white border border-[#1E2842] hover:border-[#A3E635]/40'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Performance</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedScoreboardMatch(null)}
                  title="Close (Esc)"
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* VIEW 1: 17-COLUMN OFFICIAL FACEIT SCOREBOARD TABLE       */}
            {/* ======================================================== */}
            {scoreboardSubTab === 'scoreboard' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* TEAM 1 (Winner) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl font-black font-display text-[#22C55E]">
                        {selectedScoreboardMatch.team1?.score ?? selectedScoreboardMatch.clan1?.score}
                      </span>
                      <img
                        src={selectedScoreboardMatch.team1?.avatar || selectedScoreboardMatch.clan1?.logo}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-white/15"
                      />
                      <span className="text-sm sm:text-base font-black font-display text-white">
                        {selectedScoreboardMatch.team1?.name || selectedScoreboardMatch.clan1?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Team avg</span>
                        <FaceitLevelRing level={selectedScoreboardMatch.team1?.avgLevel || 7} size={20} />
                        <span className="font-bold text-white">{selectedScoreboardMatch.team1?.avgElo?.toLocaleString() || '1,410'}</span>
                      </div>
                      <span className="text-slate-600">|</span>
                      <span>First half <strong className="text-white">{selectedScoreboardMatch.team1?.firstHalf ?? 9}</strong></span>
                      <span className="text-slate-600">|</span>
                      <span>Second half <strong className="text-white">{selectedScoreboardMatch.team1?.secondHalf ?? 4}</strong></span>
                    </div>
                  </div>

                  {/* 17 Columns Table */}
                  <div className="overflow-x-auto rounded-2xl border border-[#1E2942] bg-[#0A0E18] shadow-xl">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-[#1E2942] text-slate-300 text-[11px] uppercase tracking-wider bg-[#0E1424]">
                          <th 
                            onClick={() => handleToggleSort('name')}
                            className="py-2.5 px-3 min-w-[170px] cursor-pointer hover:text-white transition select-none"
                            title="Sort by Player Name"
                          >
                            <span className="flex items-center gap-1">
                              Player {scoreboardSortKey === 'name' && (scoreboardSortAsc ? '⯅' : '⯆')}
                            </span>
                          </th>
                          <th 
                            onClick={() => handleToggleSort('rank')}
                            className="py-2.5 px-2 min-w-[85px] cursor-pointer hover:text-white transition select-none"
                            title="Sort by ELO Rank"
                          >
                            <span className="flex items-center gap-1">
                              Rank {scoreboardSortKey === 'rank' && (scoreboardSortAsc ? '⯅' : '⯆')}
                            </span>
                          </th>
                          <th 
                            onClick={() => handleToggleSort('rating')}
                            className="py-2.5 px-2 min-w-[90px] cursor-pointer transition select-none"
                            title="Sort by Performance Rating"
                          >
                            <span className={`inline-flex items-center gap-1.5 ${scoreboardSortKey === 'rating' ? 'text-[#A3E635] font-black' : 'text-slate-300 hover:text-white'}`}>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#A3E635] text-slate-950 font-black text-[9px] flex items-center justify-center shadow-sm">⯆</span>
                              <span>Rating</span>
                              {scoreboardSortKey === 'rating' ? (scoreboardSortAsc ? <ChevronUp className="w-3 h-3 text-[#A3E635]" /> : <ChevronDown className="w-3 h-3 text-[#A3E635]" />) : <ChevronDown className="w-3 h-3 opacity-50" />}
                            </span>
                          </th>
                          <th onClick={() => handleToggleSort('swing')} className="py-2.5 px-2 text-right min-w-[75px] cursor-pointer hover:text-white select-none">Swing</th>
                          <th onClick={() => handleToggleSort('kills')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none" title="Sort by Kills">K</th>
                          <th onClick={() => handleToggleSort('deaths')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none" title="Sort by Deaths">D</th>
                          <th onClick={() => handleToggleSort('assists')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none" title="Sort by Assists">A</th>
                          <th onClick={() => handleToggleSort('adr')} className="py-2.5 px-2 text-right min-w-[55px] cursor-pointer hover:text-white select-none" title="Sort by ADR">ADR</th>
                          <th onClick={() => handleToggleSort('kd')} className="py-2.5 px-2 text-right w-[50px] shrink-0 cursor-pointer hover:text-white select-none" title="Sort by K/D Ratio">K/D</th>
                          <th onClick={() => handleToggleSort('kr')} className="py-2.5 px-2 text-right w-[50px] shrink-0 cursor-pointer hover:text-white select-none" title="Sort by Kills per Round">K/R</th>
                          <th onClick={() => handleToggleSort('hs')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none" title="Sort by Headshots">HS</th>
                          <th onClick={() => handleToggleSort('hsPercentage')} className="py-2.5 px-2 text-right min-w-[60px] cursor-pointer hover:text-white select-none" title="Sort by HS %">HS %</th>
                          <th onClick={() => handleToggleSort('k5')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none" title="5k Ace">5k</th>
                          <th onClick={() => handleToggleSort('k4')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none" title="4k Quads">4k</th>
                          <th onClick={() => handleToggleSort('k3')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none" title="3k Triples">3k</th>
                          <th onClick={() => handleToggleSort('k2')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none" title="2k Doubles">2k</th>
                          <th onClick={() => handleToggleSort('mvps')} className="py-2.5 px-3 text-right cursor-pointer hover:text-white select-none" title="Round MVPs">MVPs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {getSortedPlayers(selectedScoreboardMatch.team1?.players || []).map((p, idx) => {
                          const isUser = p.isCurrentUser || p.name.toLowerCase() === currentGamerTag.toLowerCase() || p.name.toLowerCase().includes('blockeer');
                          const ratingNum = parseFloat(p.rating);

                          return (
                            <tr
                              key={p.id || p.name}
                              onClick={() => {
                                sound.playSelect();
                                setSelectedPlayerProfile(p);
                              }}
                              className={`transition cursor-pointer group select-none ${
                                isUser
                                  ? 'bg-gradient-to-r from-[#A3E635]/20 via-[#A3E635]/5 to-transparent font-bold border-l-4 border-l-[#A3E635] shadow-inner hover:bg-[#A3E635]/25'
                                  : 'hover:bg-[#131C30]'
                              }`}
                              title={`Click to view ${p.name}'s player profile and career stats`}
                            >
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-md bg-[#A3E635]/15 border border-[#A3E635]/35 text-[9px] font-mono font-bold text-[#A3E635] flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <img src={p.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10 group-hover:border-[#A3E635] transition" />
                                  <span className={`text-xs group-hover:underline transition ${isUser ? 'text-[#2dd4bf] font-black' : 'text-white font-semibold group-hover:text-[#A3E635]'}`}>
                                    {p.name}
                                  </span>
                                  {isUser && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-[#A3E635] text-slate-950 uppercase shadow-sm">
                                      YOU
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-2">
                                <div className="flex items-center gap-1.5">
                                  <FaceitLevelRing level={p.level} size={20} />
                                  <span className="text-white font-bold text-xs">{p.elo.toLocaleString()}</span>
                                </div>
                              </td>

                              <td className="py-2.5 px-2">
                                <span
                                  className={`px-2 py-0.5 rounded-lg text-xs font-black font-mono inline-flex items-center gap-1 ${
                                    p.hasMvpStar
                                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm'
                                      : ratingNum >= 1.20
                                      ? 'bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40 shadow-sm'
                                      : ratingNum >= 1.00
                                      ? 'bg-[#06B6D4]/20 text-[#22D3EE] border border-[#06B6D4]/40'
                                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                  }`}
                                >
                                  <span>{p.rating}</span>
                                  {p.hasMvpStar && <Star className="w-3 h-3 fill-current text-white" />}
                                </span>
                              </td>

                              <td className={`py-2.5 px-2 text-right ${p.isPositiveSwing ? 'text-white' : 'text-[#ef4444]'}`}>
                                {p.swing}
                              </td>

                              <td className="py-2.5 px-2 text-right font-bold text-white">{p.kills}</td>
                              <td className="py-2.5 px-2 text-right text-slate-400">{p.deaths}</td>
                              <td className="py-2.5 px-2 text-right text-slate-400">{p.assists}</td>
                              <td className="py-2.5 px-2 text-right text-slate-200">{p.adr}</td>
                              <td className="py-2.5 px-2 text-right text-slate-200">{p.kd}</td>
                              <td className="py-2.5 px-2 text-right text-slate-200">{p.kr}</td>
                              <td className="py-2.5 px-2 text-right text-slate-300">{p.hs}</td>
                              <td className="py-2.5 px-2 text-right text-slate-300">{p.hsPercentage}</td>
                              <td className={`py-2.5 px-2 text-right ${p.k5 > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{p.k5}</td>
                              <td className={`py-2.5 px-2 text-right ${p.k4 > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{p.k4}</td>
                              <td className={`py-2.5 px-2 text-right ${p.k3 > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{p.k3}</td>
                              <td className={`py-2.5 px-2 text-right ${p.k2 > 0 ? 'text-slate-200 font-bold' : 'text-slate-500'}`}>{p.k2}</td>
                              <td className={`py-2.5 px-3 text-right ${p.mvps > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{p.mvps}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* TEAM 2 */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl font-black font-display text-white">
                        {selectedScoreboardMatch.team2?.score ?? selectedScoreboardMatch.clan2?.score}
                      </span>
                      <img
                        src={selectedScoreboardMatch.team2?.avatar || selectedScoreboardMatch.clan2?.logo}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-white/15"
                      />
                      <span className="text-sm sm:text-base font-black font-display text-white">
                        {selectedScoreboardMatch.team2?.name || selectedScoreboardMatch.clan2?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Team avg</span>
                        <FaceitLevelRing level={selectedScoreboardMatch.team2?.avgLevel || 6} size={20} />
                        <span className="font-bold text-white">{selectedScoreboardMatch.team2?.avgElo?.toLocaleString() || '1,331'}</span>
                      </div>
                      <span className="text-slate-600">|</span>
                      <span>First half <strong className="text-white">{selectedScoreboardMatch.team2?.firstHalf ?? 3}</strong></span>
                      <span className="text-slate-600">|</span>
                      <span>Second half <strong className="text-white">{selectedScoreboardMatch.team2?.secondHalf ?? 0}</strong></span>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-[#1E2942] bg-[#0A0E18] shadow-xl">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-[#1E2942] text-slate-300 text-[11px] uppercase tracking-wider bg-[#0E1424]">
                          <th onClick={() => handleToggleSort('name')} className="py-2.5 px-3 min-w-[170px] cursor-pointer hover:text-white transition select-none">
                            <span className="flex items-center gap-1">Player {scoreboardSortKey === 'name' && (scoreboardSortAsc ? '⯅' : '⯆')}</span>
                          </th>
                          <th onClick={() => handleToggleSort('rank')} className="py-2.5 px-2 min-w-[85px] cursor-pointer hover:text-white transition select-none">
                            <span className="flex items-center gap-1">Rank {scoreboardSortKey === 'rank' && (scoreboardSortAsc ? '⯅' : '⯆')}</span>
                          </th>
                          <th onClick={() => handleToggleSort('rating')} className="py-2.5 px-2 min-w-[90px] cursor-pointer transition select-none">
                            <span className={`inline-flex items-center gap-1.5 ${scoreboardSortKey === 'rating' ? 'text-[#A3E635] font-black' : 'text-slate-300 hover:text-white'}`}>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#A3E635] text-slate-950 font-black text-[9px] flex items-center justify-center shadow-sm">⯆</span>
                              <span>Rating</span>
                              {scoreboardSortKey === 'rating' ? (scoreboardSortAsc ? <ChevronUp className="w-3 h-3 text-[#A3E635]" /> : <ChevronDown className="w-3 h-3 text-[#A3E635]" />) : <ChevronDown className="w-3 h-3 opacity-50" />}
                            </span>
                          </th>
                          <th onClick={() => handleToggleSort('swing')} className="py-2.5 px-2 text-right min-w-[75px] cursor-pointer hover:text-white select-none">Swing</th>
                          <th onClick={() => handleToggleSort('kills')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none">K</th>
                          <th onClick={() => handleToggleSort('deaths')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none">D</th>
                          <th onClick={() => handleToggleSort('assists')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none">A</th>
                          <th onClick={() => handleToggleSort('adr')} className="py-2.5 px-2 text-right min-w-[55px] cursor-pointer hover:text-white select-none">ADR</th>
                          <th onClick={() => handleToggleSort('kd')} className="py-2.5 px-2 text-right w-[50px] shrink-0 cursor-pointer hover:text-white select-none">K/D</th>
                          <th onClick={() => handleToggleSort('kr')} className="py-2.5 px-2 text-right w-[50px] shrink-0 cursor-pointer hover:text-white select-none">K/R</th>
                          <th onClick={() => handleToggleSort('hs')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none">HS</th>
                          <th onClick={() => handleToggleSort('hsPercentage')} className="py-2.5 px-2 text-right min-w-[60px] cursor-pointer hover:text-white select-none">HS %</th>
                          <th onClick={() => handleToggleSort('k5')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none">5k</th>
                          <th onClick={() => handleToggleSort('k4')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none">4k</th>
                          <th onClick={() => handleToggleSort('k3')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none">3k</th>
                          <th onClick={() => handleToggleSort('k2')} className="py-2.5 px-2 text-right cursor-pointer hover:text-white select-none">2k</th>
                          <th onClick={() => handleToggleSort('mvps')} className="py-2.5 px-3 text-right cursor-pointer hover:text-white select-none">MVPs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {getSortedPlayers(selectedScoreboardMatch.team2?.players || []).map((p, idx) => {
                          const isUser = p.isCurrentUser || p.name.toLowerCase() === currentGamerTag.toLowerCase() || p.name.toLowerCase().includes('blockeer');
                          const ratingNum = parseFloat(p.rating);

                          return (
                            <tr
                              key={p.id || p.name}
                              onClick={() => {
                                sound.playSelect();
                                setSelectedPlayerProfile(p);
                              }}
                              className={`transition cursor-pointer group select-none ${
                                isUser
                                  ? 'bg-gradient-to-r from-[#A3E635]/20 via-[#A3E635]/5 to-transparent font-bold border-l-4 border-l-[#A3E635] shadow-inner hover:bg-[#A3E635]/25'
                                  : 'hover:bg-[#131C30]'
                              }`}
                              title={`Click to view ${p.name}'s player profile and career stats`}
                            >
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-md bg-[#06B6D4]/15 border border-[#06B6D4]/35 text-[9px] font-mono font-bold text-[#22D3EE] flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <img src={p.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10 group-hover:border-[#06B6D4] transition" />
                                  <span className={`text-xs group-hover:underline transition ${isUser ? 'text-[#2dd4bf] font-black' : 'text-white font-semibold group-hover:text-[#22D3EE]'}`}>
                                    {p.name}
                                  </span>
                                  {isUser && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-[#A3E635] text-slate-950 uppercase shadow-sm">
                                      YOU
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-2">
                                <div className="flex items-center gap-1.5">
                                  <FaceitLevelRing level={p.level} size={20} />
                                  <span className="text-white font-bold text-xs">{p.elo.toLocaleString()}</span>
                                </div>
                              </td>

                              <td className="py-2.5 px-2">
                                <span
                                  className={`px-2 py-0.5 rounded-lg text-xs font-black font-mono inline-flex items-center gap-1 ${
                                    p.hasMvpStar
                                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm'
                                      : ratingNum >= 1.20
                                      ? 'bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40 shadow-sm'
                                      : ratingNum >= 1.00
                                      ? 'bg-[#06B6D4]/20 text-[#22D3EE] border border-[#06B6D4]/40'
                                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                  }`}
                                >
                                  <span>{p.rating}</span>
                                  {p.hasMvpStar && <Star className="w-3 h-3 fill-current text-white" />}
                                </span>
                              </td>

                              <td className={`py-2.5 px-2 text-right ${p.isPositiveSwing ? 'text-white' : 'text-[#ef4444]'}`}>
                                {p.swing}
                              </td>

                              <td className="py-2.5 px-2 text-right font-bold text-white">{p.kills}</td>
                              <td className="py-2.5 px-2 text-right text-slate-400">{p.deaths}</td>
                              <td className="py-2.5 px-2 text-right text-slate-400">{p.assists}</td>
                              <td className="py-2.5 px-2 text-right text-slate-200">{p.adr}</td>
                              <td className="py-2.5 px-2 text-right text-slate-200">{p.kd}</td>
                              <td className="py-2.5 px-2 text-right text-slate-200">{p.kr}</td>
                              <td className="py-2.5 px-2 text-right text-slate-300">{p.hs}</td>
                              <td className="py-2.5 px-2 text-right text-slate-300">{p.hsPercentage}</td>
                              <td className={`py-2.5 px-2 text-right ${p.k5 > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{p.k5}</td>
                              <td className={`py-2.5 px-2 text-right ${p.k4 > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{p.k4}</td>
                              <td className={`py-2.5 px-2 text-right ${p.k3 > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{p.k3}</td>
                              <td className={`py-2.5 px-2 text-right ${p.k2 > 0 ? 'text-slate-200 font-bold' : 'text-slate-500'}`}>{p.k2}</td>
                              <td className={`py-2.5 px-3 text-right ${p.mvps > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{p.mvps}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: ROUND-BY-ROUND BREAKDOWN (ROUNDS TIMELINE)       */}
            {/* ======================================================== */}
            {scoreboardSubTab === 'rounds' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-[#0A0E18] border border-[#1E2942] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div>
                      <h4 className="text-sm font-black font-display text-white">Match Round Progression</h4>
                      <p className="text-xs font-mono text-slate-400">Click any round to view win condition, side advantage, and MVP play</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-[#22C55E]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                        {selectedScoreboardMatch.team1?.name} Won
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                        {selectedScoreboardMatch.team2?.name} Won
                      </span>
                    </div>
                  </div>

                  {/* Half 1 */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">First Half (Rounds 1 - 12)</span>
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(r => {
                        const isTeam1Win = selectedScoreboardMatch.isWin ? (r <= 9) : (r !== 4 && r !== 7 && r !== 11);
                        const isSelected = selectedRoundDetail === r;
                        return (
                          <div
                            key={r}
                            onClick={() => { sound.playClick(); setSelectedRoundDetail(isSelected ? null : r); }}
                            className={`p-2 rounded-xl border text-center font-mono cursor-pointer transition select-none ${
                              isSelected
                                ? 'ring-2 ring-[#A3E635] scale-105 bg-[#0C1F16] border-[#A3E635]'
                                : isTeam1Win
                                ? 'bg-[#152e1c] border-[#22C55E]/40 hover:border-[#22C55E]'
                                : 'bg-[#2b1618] border-[#ef4444]/40 hover:border-[#ef4444]'
                            }`}
                          >
                            <span className="text-[10px] text-slate-400 block font-bold">R{r}</span>
                            <span className={`text-xs font-black block ${isTeam1Win ? 'text-[#22C55E]' : 'text-[#ef4444]'}`}>
                              {isTeam1Win ? 'W' : 'L'}
                            </span>
                            <span className="text-[9px] text-slate-400 block">{r % 2 === 0 ? '💣 Def' : '💀 Elim'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Half 2 */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Second Half (Sides Swapped)</span>
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                      {[13, 14, 15, 16].map(r => {
                        const isTeam1Win = true; // SiLVERiNYO won all 4 in 2nd half to reach 13
                        const isSelected = selectedRoundDetail === r;
                        return (
                          <div
                            key={r}
                            onClick={() => { sound.playClick(); setSelectedRoundDetail(isSelected ? null : r); }}
                            className={`p-2 rounded-xl border text-center font-mono cursor-pointer transition select-none ${
                              isSelected
                                ? 'ring-2 ring-[#A3E635] scale-105 bg-[#0C1F16] border-[#A3E635]'
                                : isTeam1Win
                                ? 'bg-[#152e1c] border-[#22C55E]/40 hover:border-[#22C55E]'
                                : 'bg-[#2b1618] border-[#ef4444]/40 hover:border-[#ef4444]'
                            }`}
                          >
                            <span className="text-[10px] text-slate-400 block font-bold">R{r}</span>
                            <span className={`text-xs font-black block ${isTeam1Win ? 'text-[#22C55E]' : 'text-[#ef4444]'}`}>
                              {isTeam1Win ? 'W' : 'L'}
                            </span>
                            <span className="text-[9px] text-slate-400 block">💥 Expl</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Round Card Callout */}
                  {selectedRoundDetail && (
                    <div className="p-3 rounded-xl bg-black/60 border border-[#A3E635]/40 flex items-center justify-between text-xs font-mono animate-in fade-in duration-150">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#A3E635] text-slate-950 font-black flex items-center justify-center text-xs">
                          R{selectedRoundDetail}
                        </span>
                        <div>
                          <div className="text-white font-bold">
                            Round {selectedRoundDetail} Outcome: {selectedRoundDetail % 3 === 0 ? 'Bomb Defused at Site B' : 'Full Team Elimination'}
                          </div>
                          <span className="text-slate-400 text-[11px]">
                            MVP Play: {selectedRoundDetail % 2 === 0 ? 'mnLReKt (3k Opening Entry)' : 'SiLVERiNYO (1v2 Clutch Play)'}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-white/10 text-white font-bold">
                        Duration: 1m 32s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: MATCH PERFORMANCE & HEAD-TO-HEAD ANALYTICS       */}
            {/* ======================================================== */}
            {scoreboardSubTab === 'performance' && (
              <div className="space-y-4 animate-in fade-in duration-150 font-mono text-xs">
                {/* Top Performer Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#17140e] border border-amber-500/30 space-y-2">
                    <span className="text-[10px] text-amber-400 uppercase font-black flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      MATCH MVP & TOP RATING
                    </span>
                    <div className="flex items-center gap-2.5">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="" className="w-10 h-10 rounded-xl object-cover border border-amber-500/50" />
                      <div>
                        <div className="text-white font-bold text-sm">mnLReKt</div>
                        <div className="text-amber-400 font-black">1.84 Rating ★ • 5 MVPs</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-300">17 Kills, 98.4 ADR, 76.5% Headshot Accuracy</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0e171b] border border-[#2dd4bf]/30 space-y-2">
                    <span className="text-[10px] text-[#2dd4bf] uppercase font-black flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      OPPONENT TOP FRAGGER
                    </span>
                    <div className="flex items-center gap-2.5">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="" className="w-10 h-10 rounded-xl object-cover border border-[#2dd4bf]/50" />
                      <div>
                        <div className="text-white font-bold text-sm">_Usama</div>
                        <div className="text-[#2dd4bf] font-black">1.23 Rating • 102.6 ADR</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-300">14 Kills, 71.4% HS, 3x 2k Multi-Kills</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0e1f14] border border-[#22C55E]/30 space-y-2">
                    <span className="text-[10px] text-[#22C55E] uppercase font-black flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      ACTIVE USER PERFORMANCE
                    </span>
                    <div className="flex items-center gap-2.5">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="" className="w-10 h-10 rounded-xl object-cover border border-[#22C55E]/50" />
                      <div>
                        <div className="text-white font-bold text-sm">bLocKeeRz [YOU]</div>
                        <div className="text-slate-300 font-bold">Level 7 • 1,381 ELO</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-300">8 Kills, 54.3 ADR, 3x 2k Multi-Kills, 1 MVP</div>
                  </div>
                </div>

                {/* Comparative ADR Bars */}
                <div className="p-4 rounded-2xl bg-[#0A0E18] border border-[#1E2942] space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h4 className="text-sm font-black font-display text-white">Average Damage per Round (ADR) Comparison</h4>
                    <span className="text-slate-400 text-xs">Target: 80.0+ ADR</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: '_Usama', adr: 102.6, team: 2 },
                      { name: 'beYYaa', adr: 101.8, team: 1 },
                      { name: 'mnLReKt', adr: 98.4, team: 1 },
                      { name: 'blackbars1', adr: 85.2, team: 2 },
                      { name: 'oTheRform', adr: 82.5, team: 1 },
                      { name: 'crni_exec', adr: 76.4, team: 1 },
                      { name: 'SiLVERiNYO', adr: 76.4, team: 1 },
                      { name: 'bLocKeeRz [YOU]', adr: 54.3, team: 2 },
                      { name: 'Ar7isti', adr: 43.6, team: 2 },
                      { name: 'edd1-', adr: 24.1, team: 2 }
                    ].map(p => (
                      <div key={p.name} className="flex items-center gap-3">
                        <span className={`w-32 truncate text-xs font-semibold ${p.name.includes('[YOU]') ? 'text-[#2dd4bf] font-black' : 'text-slate-300'}`}>
                          {p.name}
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-black/50 overflow-hidden relative border border-white/5">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              p.name.includes('[YOU]')
                                ? 'bg-gradient-to-r from-[#2dd4bf] to-emerald-400'
                                : p.team === 1
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                : 'bg-gradient-to-r from-teal-500 to-cyan-500'
                            }`}
                            style={{ width: `${Math.min(100, (p.adr / 120) * 100)}%` }}
                          />
                        </div>
                        <span className="w-12 text-right font-bold text-white text-xs">{p.adr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E2942]">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <Download className="w-4 h-4 text-[#A3E635]" />
                <span>Official CS2 Sub-Tick 128 GOTV Broadcast Replay (.dem) available for download</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadDemo(selectedScoreboardMatch)}
                  className="px-4 py-2 rounded-xl bg-[#101728] hover:bg-[#16213A] text-white border border-[#202E50] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                  title="Download .dem file directly to computer"
                >
                  <Download className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Download GOTV Replay</span>
                </button>
                <button
                  onClick={() => setSelectedScoreboardMatch(null)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-black text-xs font-mono uppercase tracking-wider cursor-pointer transition active:scale-95 shadow-lg shadow-[#A3E635]/25"
                >
                  Close Scoreboard
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EDIT CLAN MODAL */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => {
            sound.playClick();
            setIsEditModalOpen(false);
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0C1019] border border-[#252E42] rounded-3xl p-6 shadow-2xl space-y-5 text-left relative cursor-default"
          >
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#A3E635]" />
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
                    className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-white focus:outline-none focus:border-[#A3E635]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Clan Tag (2-5 Letters)</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={draftTag}
                    onChange={(e) => setDraftTag(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-amber-400 font-bold focus:outline-none focus:border-[#A3E635]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Description & Mission</label>
                <textarea
                  rows={3}
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-slate-200 focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400">Select Official CaliberClutch Clan Badge</label>
                  <span className="text-[10px] font-mono text-[#A3E635]">5 Distinct Designs</span>
                </div>
                <div className="grid grid-cols-5 gap-2.5">
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
                          ? 'border-[#A3E635] shadow-[0_0_16px_rgba(163,230,53,0.45)] scale-105 bg-[#0F1626]'
                          : 'border-white/10 opacity-75 hover:opacity-100 hover:border-slate-500 hover:scale-102'
                      }`}
                    >
                      <img
                        src={badge.url}
                        alt={badge.name}
                        className="w-12 h-12 rounded-xl object-contain drop-shadow"
                      />
                      {draftLogo === badge.url && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#A3E635] text-slate-950 text-[9px] font-black flex items-center justify-center shadow">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Custom Clan Logo File Upload Section */}
                <div className="pt-2.5 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>Upload Custom Clan Logo</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">PNG, JPG, SVG, WEBP</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={clanLogoFileInputRef}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleCustomLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => clanLogoFileInputRef.current?.click()}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#141722] hover:bg-[#1D2232] border border-dashed border-[#2F3952] hover:border-[#A3E635]/60 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#A3E635]" />
                      <span>Choose Logo File from Device...</span>
                    </button>

                    {draftLogo && !PRESET_CLAN_LOGOS.some(b => b.url === draftLogo) && (
                      <div className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#0E1320] border border-[#A3E635]/50">
                        <img
                          src={draftLogo}
                          alt="Custom Clan Logo"
                          className="w-8 h-8 rounded-lg object-cover border border-[#A3E635]"
                        />
                        <span className="text-[10px] font-mono text-[#A3E635] font-bold">Custom Active ✓</span>
                      </div>
                    )}
                  </div>
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-black text-xs font-mono font-black cursor-pointer transition shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVITE PLAYER MODAL (FRIENDS LIST ONLY ENFORCEMENT) */}
      {isInviteModalOpen && (
        <div 
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => {
            sound.playClick();
            setIsInviteModalOpen(false);
          }}
        >
          <form
            onSubmit={handleInviteTeammate}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0C1019] border border-[#252E42] rounded-3xl p-6 shadow-2xl space-y-4 text-left relative cursor-default"
          >
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-white">Invite Teammate to [{userClan.tag}]</h3>
                  <p className="text-[10px] font-mono text-slate-400">Clan Roster Requirement: Friends List Only</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Friends Requirement Verification Banner */}
            <div className="p-3 rounded-2xl bg-[#121624] border border-[#232C42] flex items-center gap-3 text-xs font-mono">
              <Shield className="w-4 h-4 text-[#A3E635] shrink-0" />
              <p className="text-slate-300 text-[11px] leading-tight">
                To prevent unverified invites, players <strong className="text-[#A3E635]">must be on your Friends list</strong> before you can invite them into your 5v5 clan lineup.
              </p>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              {/* Friends Picker or Empty Notice */}
              {userFriends.length === 0 ? (
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">No Friends on Your List Yet</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      You cannot invite players to your clan without having them as friends first.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141724] border border-white/5 text-[10px] text-slate-400 text-left space-y-1">
                    <div className="text-white font-bold flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>How to invite teammates:</span>
                    </div>
                    <div>1. Open the Social / Friends panel on the right side.</div>
                    <div>2. Add your teammates as friends using their GamerTag.</div>
                    <div>3. Once accepted, select them here to add them to your 5v5 roster.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>Choose from Friends ({userFriends.length} Available)</span>
                    </label>
                    {selectedFriendToInvite && (
                      <span className="text-[10px] text-[#A3E635] font-bold">
                        Selected: {selectedFriendToInvite.name} ✓
                      </span>
                    )}
                  </div>

                  {/* Friends Filter Input */}
                  {userFriends.length > 3 && (
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inviteInput}
                        onChange={(e) => setInviteInput(e.target.value)}
                        placeholder="Search among your friends..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#141722] border border-[#262D3E] text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-[#A3E635]"
                      />
                    </div>
                  )}

                  {/* Friends Cards Scrollable List */}
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {userFriends
                      .filter(f => !inviteInput.trim() || f.name.toLowerCase().includes(inviteInput.toLowerCase().trim()))
                      .map((friend) => {
                        const inClan = userClan.members.some(m => m.name.toLowerCase() === friend.name.toLowerCase());
                        const isSelected = selectedFriendToInvite?.id === friend.id;

                        return (
                          <div
                            key={friend.id}
                            onClick={() => {
                              if (inClan) return;
                              sound.playClick();
                              setSelectedFriendToInvite(friend);
                            }}
                            className={`p-2.5 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer select-none ${
                              inClan
                                ? 'opacity-40 bg-white/5 border-transparent cursor-not-allowed'
                                : isSelected
                                ? 'bg-gradient-to-r from-[#A3E635]/20 to-[#06B6D4]/15 border-[#A3E635] shadow-md scale-[1.01]'
                                : 'bg-[#121624] border-[#22293C] hover:border-[#A3E635]/60 hover:bg-[#161B2C]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={friend.avatar || '/images/avatar_duck_exact.png'}
                                alt={friend.name}
                                className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                                  <span>{friend.name}</span>
                                  {inClan && (
                                    <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.2 rounded">
                                      In Clan
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                  Level {friend.level || 7} • {friend.elo || 1500} ELO
                                </div>
                              </div>
                            </div>

                            {!inClan && (
                              <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg transition ${
                                isSelected
                                  ? 'bg-[#A3E635] text-slate-950 font-black'
                                  : 'bg-white/5 text-slate-400 hover:text-white'
                              }`}>
                                {isSelected ? 'Selected ✓' : 'Choose'}
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Tactical Role Selection */}
              <div className="space-y-1.5">
                <label className="text-slate-400">Tactical Role in 5v5 Roster</label>
                <select
                  value={selectedRoleForInvite}
                  onChange={(e) => setSelectedRoleForInvite(e.target.value as ClanMember['role'])}
                  className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#262D3E] text-white focus:outline-none focus:border-[#A3E635] cursor-pointer"
                >
                  <option value="AWPer">AWPer (Sniper)</option>
                  <option value="Entry Fragger">Entry Fragger (First Contact)</option>
                  <option value="Support">Support (Utility & Trades)</option>
                  <option value="Lurker">Lurker (Flank & Space)</option>
                  <option value="Substitute">Substitute (Stand-in)</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
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
                disabled={!selectedFriendToInvite}
                className={`px-5 py-2 rounded-xl font-mono font-black text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5 ${
                  selectedFriendToInvite
                    ? 'bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 cursor-pointer shadow-lime-500/20 active:scale-95'
                    : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Send Clan Invite</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CLAN INVITATION DECISION MODAL (PLAYER CAN ACCEPT OR REJECT) */}
      {activeDecisionInvite && (
        <div 
          className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setActiveDecisionInvite(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gradient-to-b from-[#111624] via-[#0D111C] to-[#090C15] border-2 border-[#222E4A] rounded-3xl p-6 shadow-2xl space-y-5 text-left relative cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E273E] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-white">Clan Roster Invitation</h3>
                  <p className="text-[10px] font-mono text-slate-400">Official Player Response Needed</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDecisionInvite(null)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Invited Player Capsule */}
            <div className="p-4 rounded-2xl bg-[#131828] border border-[#25314C] space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={activeDecisionInvite.friendAvatar} 
                  alt={activeDecisionInvite.friendName}
                  className="w-12 h-12 rounded-2xl object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-display text-white truncate">{activeDecisionInvite.friendName}</span>
                    <span className="text-xs">{activeDecisionInvite.friendFlag}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Level {activeDecisionInvite.friendLevel} • {activeDecisionInvite.friendElo} ELO
                  </div>
                  <div className="text-[10px] font-mono text-[#A3E635] font-bold mt-0.5">
                    Assigned Role: {activeDecisionInvite.role}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-300 leading-relaxed">
                Captain <strong className="text-white">{activeDecisionInvite.senderGamerTag}</strong> invited <strong className="text-[#A3E635]">{activeDecisionInvite.friendName}</strong> to join <strong className="text-white">[{activeDecisionInvite.clanTag}] {activeDecisionInvite.clanName}</strong>. As an esports player, they have full right to <strong>Accept</strong> or <strong>Reject</strong> this invitation.
              </div>
            </div>

            {/* Decision Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center">
                Select Invitation Decision:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAcceptClanInvite(activeDecisionInvite.id)}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shadow-lg shadow-lime-500/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Accept Invite</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRejectClanInvite(activeDecisionInvite.id)}
                  className="py-3 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                  <span>Reject / Decline</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCancelClanInvite(activeDecisionInvite.id)}
                className="w-full py-2 text-center text-[10px] font-mono text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                Cancel Invitation (Remove from Pending)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE PLAYER PROFILE INSPECT MODAL (CLICKABLE)     */}
      {/* ======================================================== */}
      {selectedPlayerProfile && (
        <div 
          className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setSelectedPlayerProfile(null)}
        >
          <div 
            className="w-full max-w-lg bg-gradient-to-b from-[#0F1424] via-[#0B0F1C] to-[#070A12] border-2 border-[#1E2946] rounded-3xl p-5 sm:p-6 shadow-[0_0_80px_rgba(0,0,0,0.95)] space-y-5 text-left relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A3E635]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#06B6D4]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header with Close */}
            <div className="flex items-center justify-between border-b border-[#1E2842] pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#A3E635]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Player Profile Card • CS2 Statistics
                </span>
              </div>
              <button
                onClick={() => setSelectedPlayerProfile(null)}
                title="Close Profile (Esc)"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Player Identity Banner */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative shrink-0">
                <img
                  src={selectedPlayerProfile.avatar}
                  alt={selectedPlayerProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#A3E635]/60 shadow-[0_0_20px_rgba(163,230,53,0.25)]"
                />
                <div className="absolute -bottom-1.5 -right-1.5">
                  <FaceitLevelRing level={selectedPlayerProfile.level} size={24} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black font-sans text-white truncate">
                    {selectedPlayerProfile.name}
                  </h3>
                  {selectedPlayerProfile.isCurrentUser && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-[#A3E635] text-slate-950 uppercase shadow-sm">
                      YOU
                    </span>
                  )}
                  {selectedPlayerProfile.hasMvpStar && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-amber-400" />
                      MATCH MVP
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                  <span className="text-[#A3E635] font-bold">
                    Skill Level {selectedPlayerProfile.level} • {selectedPlayerProfile.elo.toLocaleString()} ELO
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Caliber Pro
                  </span>
                </div>
              </div>
            </div>

            {/* Match Performance Snapshot */}
            <div className="space-y-2 relative z-10">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Current Match Performance
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-[#0B0F1A] border border-[#1E2942] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Rating</span>
                  <span className="text-sm font-black font-mono text-[#A3E635] block mt-0.5">
                    {selectedPlayerProfile.rating}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0F1A] border border-[#1E2942] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">K / D / A</span>
                  <span className="text-sm font-black font-mono text-white block mt-0.5">
                    {selectedPlayerProfile.kills}/{selectedPlayerProfile.deaths}/{selectedPlayerProfile.assists}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0F1A] border border-[#1E2942] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">K/D Ratio</span>
                  <span className="text-sm font-black font-mono text-cyan-300 block mt-0.5">
                    {selectedPlayerProfile.kd}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0F1A] border border-[#1E2942] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">ADR</span>
                  <span className="text-sm font-black font-mono text-slate-200 block mt-0.5">
                    {selectedPlayerProfile.adr}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-[#0B0F1A] border border-[#1E2942] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Headshot %</span>
                  <span className="text-xs font-bold font-mono text-white block mt-0.5">{selectedPlayerProfile.hsPercentage}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0F1A] border border-[#1E2942] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Swing Impact</span>
                  <span className={`text-xs font-bold font-mono block mt-0.5 ${selectedPlayerProfile.isPositiveSwing ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedPlayerProfile.swing}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0F1A] border border-[#1E2942] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Round MVPs</span>
                  <span className="text-xs font-bold font-mono text-amber-300 block mt-0.5">
                    ⭐ {selectedPlayerProfile.mvps} MVPs
                  </span>
                </div>
              </div>
            </div>

            {/* Multi-Kill Rounds */}
            <div className="p-3 rounded-2xl bg-[#0B0F1A] border border-[#1E2942] space-y-1.5 relative z-10 text-xs font-mono">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Multi-Kill Rounds
              </span>
              <div className="flex items-center justify-between text-slate-300">
                <span>Aces (5K): <strong className="text-amber-400">{selectedPlayerProfile.k5}</strong></span>
                <span>Quad (4K): <strong className="text-amber-400">{selectedPlayerProfile.k4}</strong></span>
                <span>Triple (3K): <strong className="text-amber-400">{selectedPlayerProfile.k3}</strong></span>
                <span>Double (2K): <strong className="text-white">{selectedPlayerProfile.k2}</strong></span>
              </div>
            </div>

            {/* Anti-Cheat & VAC Standing */}
            <div className="p-3 rounded-2xl bg-[#070A12] border border-[#182136] flex items-center justify-between text-xs font-mono text-slate-400 relative z-10">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block font-bold">Vortex Client Anti-Cheat</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Active • VAC Clean & In Good Standing
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`STEAM_0:1:${Math.floor(Math.random() * 89999999 + 10000000)}`);
                  setToast(`✓ Steam ID of ${selectedPlayerProfile.name} copied!`);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-mono cursor-pointer transition flex items-center gap-1.5"
                title="Copy Steam ID"
              >
                <Copy className="w-3 h-3 text-[#A3E635]" />
                <span>Copy SteamID</span>
              </button>
            </div>

            {/* Interactive Action Buttons */}
            <div className="pt-1 relative z-10">
              {selectedPlayerProfile.isCurrentUser ? (
                <button
                  type="button"
                  onClick={() => setSelectedPlayerProfile(null)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 border border-white/10"
                >
                  <span>Close Passport</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setToast(`✓ Friend request sent to ${selectedPlayerProfile.name}!`);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 border border-white/10"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>Add Friend</span>
                  </button>
                  {pendingInvites.some(i => i.friendName.toLowerCase() === selectedPlayerProfile.name.toLowerCase()) ? (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        const pending = pendingInvites.find(i => i.friendName.toLowerCase() === selectedPlayerProfile.name.toLowerCase()) || null;
                        setSelectedPlayerProfile(null);
                        if (pending) setActiveDecisionInvite(pending);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Invite Pending (Accept/Reject)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        const isFriend = userFriends.some(f => f.name.toLowerCase() === selectedPlayerProfile.name.toLowerCase());
                        if (!isFriend) {
                          setToast(`⚠️ You must add ${selectedPlayerProfile.name} as a friend before inviting them to your clan.`);
                          return;
                        }
                        if (userClan.members.some(m => m.name.toLowerCase() === selectedPlayerProfile.name.toLowerCase())) {
                          setToast(`⚠️ ${selectedPlayerProfile.name} is already in your clan.`);
                          return;
                        }
                        setSelectedPlayerProfile(null);
                        const matchingFriend = userFriends.find(f => f.name.toLowerCase() === selectedPlayerProfile.name.toLowerCase()) || null;
                        setSelectedFriendToInvite(matchingFriend);
                        setIsInviteModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-mono font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shadow-lg shadow-[#A3E635]/20"
                    >
                      <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Invite to Clan</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
