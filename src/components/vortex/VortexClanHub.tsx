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
  ChevronDown,
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
  ExternalLink,
  Star
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

// Authentic FACEIT circular level ring badge (Yellow for 6-7, Orange for 8-9, Red for 10)
export const FaceitLevelRing: React.FC<{ level: number; size?: number }> = ({ level, size = 26 }) => {
  const getArcColor = (lvl: number) => {
    if (lvl === 10) return '#EF4444'; // Red
    if (lvl >= 8) return '#F97316';  // Orange
    if (lvl >= 6) return '#EAB308';  // Yellow
    if (lvl >= 4) return '#22C55E';  // Green
    return '#94A3B8';               // Slate
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
      title={`Level ${level}`}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#111219"
          stroke="#262835"
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
    tournamentOrEvent: 'FACEIT 5v5 Competitive Match',

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
    tournamentOrEvent: 'FACEIT 5v5 Competitive Match',

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
    tournamentOrEvent: 'Clan War 5v5 Challenge',

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
      tournamentOrEvent: 'FACEIT 5v5 Competitive Live Test',

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
                <span>Opsioni 1: FACEIT Matches & Scoreboard (1:1)</span>
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
          {/* OPSIONI 1: FACEIT MATCH HISTORY & SCOREBOARDS (1:1 AUTENTIKE) */}
          {/* ======================================================== */}
          {clanViewOption === 'match-center' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header & Controls */}
              <div className="p-5 rounded-3xl bg-[#0E1017] border border-[#202536] flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#FF5500] text-black tracking-wider">
                      FACEIT 5v5 OFFICIAL
                    </span>
                    <h3 className="text-lg font-black font-display text-white">Clan Match History & CS2 Scoreboards</h3>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Lista autentike e ndeshjeve 5v5, ELO progression, performance ratings dhe Scoreboard-i zyrtar FACEIT 17-kolonash
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
                        {f === 'all' ? 'Të Gjitha' : f === 'wins' ? 'Fitore (W)' : 'Humbje (L)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exact FACEIT Match History Feed (Reference Images 0 & 1) */}
              <div className="space-y-2">
                {clanMatches
                  .filter(m => {
                    if (matchFilter === 'wins') return m.isWin;
                    if (matchFilter === 'losses') return !m.isWin;
                    return true;
                  })
                  .map(match => (
                    <div
                      key={match.id}
                      onClick={() => { sound.playSelect(); setSelectedScoreboardMatch(match); }}
                      className="w-full bg-[#111215] hover:bg-[#16171d] border border-white/5 hover:border-white/20 rounded-xl transition-all duration-150 flex items-center justify-between px-3 sm:px-5 py-3 cursor-pointer group relative overflow-hidden shadow-md"
                    >
                      {/* Left Colored Indicator Stripe (Green = Win, Red = Loss) */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 ${
                          match.isWin ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                        }`}
                      />

                      {/* Left Info Group (Sleek FACEIT Horizontal Layout) */}
                      <div className="flex items-center gap-4 sm:gap-7 pl-2 sm:pl-3 overflow-x-auto no-scrollbar">
                        {/* Date & Time */}
                        <div className="flex flex-col shrink-0 min-w-[75px]">
                          <span className="text-xs sm:text-sm font-bold text-white tracking-tight">{match.date}</span>
                          <span className="text-[10px] sm:text-xs font-mono text-slate-400">{match.time}</span>
                        </div>

                        {/* Match Result Badge: [W] 13 : 4 or [L] 3 : 13 */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-black text-[11px] text-white shadow-sm ${
                              match.isWin ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                            }`}
                          >
                            {match.isWin ? 'W' : 'L'}
                          </span>
                          <span className="font-mono font-black text-sm sm:text-base tracking-wide">
                            <span className={match.isWin ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                              {match.scoreDisplay.split(':')[0].trim()}
                            </span>
                            <span className="text-slate-500 mx-1.5">:</span>
                            <span className="text-slate-300">
                              {match.scoreDisplay.split(':')[1].trim()}
                            </span>
                          </span>
                        </div>

                        {/* Crosshair / Party Stack Icon */}
                        <div className="shrink-0 text-slate-500 group-hover:text-slate-300 transition" title="5v5 Party Stack">
                          <Crosshair className="w-4 h-4 opacity-70" />
                        </div>

                        {/* FACEIT Level Ring & ELO + Delta */}
                        <div className="flex items-center gap-2.5 shrink-0 min-w-[115px]">
                          <FaceitLevelRing level={match.team1?.players?.find(p => p.isCurrentUser)?.level || match.team2?.players?.find(p => p.isCurrentUser)?.level || 7} size={26} />
                          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm">
                            <span className="font-bold text-white">
                              {match.userElo?.toLocaleString()}
                            </span>
                            <span
                              className={`font-bold flex items-center text-xs ${
                                match.eloDelta >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                              }`}
                            >
                              {match.eloDelta >= 0 ? `↑ ${match.eloDelta}` : `↓ ${Math.abs(match.eloDelta)}`}
                            </span>
                          </div>
                        </div>

                        {/* Performance Rating Badge with Underline Bar */}
                        <div className="shrink-0 flex flex-col items-center">
                          <div
                            className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                              parseFloat(match.userRating) >= 1.00
                                ? 'bg-[#15341c] text-[#22C55E] border border-[#22C55E]/30'
                                : 'bg-[#3b1517] text-[#EF4444] border border-[#EF4444]/30'
                            }`}
                          >
                            {match.userRating}
                          </div>
                          <div
                            className={`w-full h-[2.5px] mt-0.5 rounded-full ${
                              parseFloat(match.userRating) >= 1.00 ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                            }`}
                          />
                        </div>

                        {/* User K / D / A */}
                        <div className="shrink-0 font-mono text-xs sm:text-sm text-slate-200 min-w-[70px] text-center" title="Kills / Deaths / Assists">
                          {match.userStats.kills} / {match.userStats.deaths} / {match.userStats.assists}
                        </div>

                        {/* User K/D */}
                        <div className="shrink-0 font-mono text-xs sm:text-sm text-slate-300 min-w-[45px] text-center" title="Kill / Death Ratio">
                          {match.userStats.kd}
                        </div>

                        {/* User ADR */}
                        <div className="shrink-0 font-mono text-xs sm:text-sm text-slate-300 min-w-[50px] text-center" title="Average Damage per Round">
                          {match.userStats.adr}
                        </div>

                        {/* Map Badge */}
                        <div className="flex items-center gap-2 shrink-0 min-w-[95px]">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-black/60 border border-white/10 shrink-0">
                            <img src={match.mapImage} alt={match.mapDisplayName} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-white">
                            {match.mapDisplayName}
                          </span>
                        </div>
                      </div>

                      {/* Right Action Icons: Download Demo [↓] and Scoreboard [↗] */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playClick();
                            setToast(`✓ Shkarkimi i GOTV Demo (.dem) për ${match.mapDisplayName} filloi...`);
                          }}
                          title="Download GOTV Demo (.dem)"
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playSelect();
                            setSelectedScoreboardMatch(match);
                          }}
                          title="Hap Scoreboard (TAB)"
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Direct Scoreboard TAB Live Preview under the feed */}
              <div className="p-4 rounded-2xl bg-[#0B0D13] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      Scoreboard Preview (CS2 TAB Mode)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Kliko mbi çdo ndeshje më sipër për të parë Scoreboard-in përkatës
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono">
                  <span className="text-slate-300">
                    Aktualisht shfaqet: <strong className="text-white">[{clanMatches[0]?.mapDisplayName}] {clanMatches[0]?.scoreDisplay} ({clanMatches[0]?.team1?.name} vs {clanMatches[0]?.team2?.name})</strong>
                  </span>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setSelectedScoreboardMatch(clanMatches[0]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#FF5500]/90 text-black font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Hap Scoreboard të Plotë (17 Kolona)</span>
                  </button>
                </div>
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

      {/* FULL 1:1 FACEIT SCOREBOARD MODAL (EXACT REPLICA OF REFERENCE IMAGE 2) */}
      {selectedScoreboardMatch && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl max-h-[94vh] overflow-y-auto bg-[#0d0e12] border border-[#20222a] rounded-2xl shadow-2xl space-y-4 text-left relative p-4 sm:p-6">
            
            {/* Modal Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={selectedScoreboardMatch.mapImage} alt={selectedScoreboardMatch.mapDisplayName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
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
                    {selectedScoreboardMatch.team1?.name || selectedScoreboardMatch.clan1?.name} vs {selectedScoreboardMatch.team2?.name || selectedScoreboardMatch.clan2?.name} • Scoreboard
                  </h3>
                </div>
              </div>

              {/* Sub-Tabs: Scoreboard / Rounds / Performance */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button className="px-3 py-1 rounded-lg bg-[#FF5500] text-black font-black">
                    Scoreboard
                  </button>
                  <button
                    onClick={() => sound.playClick()}
                    className="px-3 py-1 rounded-lg text-slate-400 hover:text-white transition"
                  >
                    Rounds
                  </button>
                  <button
                    onClick={() => sound.playClick()}
                    className="px-3 py-1 rounded-lg text-slate-400 hover:text-white transition"
                  >
                    Performance
                  </button>
                </div>

                <button
                  onClick={() => setSelectedScoreboardMatch(null)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* TEAM 1 (Winner - Score 13)                              */}
            {/* ======================================================== */}
            <div className="space-y-1.5">
              {/* Team 1 Header Bar */}
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

              {/* Team 1 Table (17 Columns) */}
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#121316]">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 text-[11px] uppercase tracking-wider bg-black/40">
                      <th className="py-2.5 px-3 min-w-[170px]">Player</th>
                      <th className="py-2.5 px-2 min-w-[85px]">Rank</th>
                      <th className="py-2.5 px-2 min-w-[90px]">
                        <span className="inline-flex items-center gap-1 text-[#F97316]">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#F97316] text-black font-black text-[9px] flex items-center justify-center">⯆</span>
                          <span>Rating</span>
                          <ChevronDown className="w-3 h-3" />
                        </span>
                      </th>
                      <th className="py-2.5 px-2 text-right min-w-[75px]">Swing</th>
                      <th className="py-2.5 px-2 text-right">K</th>
                      <th className="py-2.5 px-2 text-right">D</th>
                      <th className="py-2.5 px-2 text-right">A</th>
                      <th className="py-2.5 px-2 text-right min-w-[55px]">ADR</th>
                      <th className="py-2.5 px-2 text-right min-w-[50px]">K/D</th>
                      <th className="py-2.5 px-2 text-right min-w-[50px]">K/R</th>
                      <th className="py-2.5 px-2 text-right">HS</th>
                      <th className="py-2.5 px-2 text-right min-w-[60px]">HS %</th>
                      <th className="py-2.5 px-2 text-right">5k</th>
                      <th className="py-2.5 px-2 text-right">4k</th>
                      <th className="py-2.5 px-2 text-right">3k</th>
                      <th className="py-2.5 px-2 text-right">2k</th>
                      <th className="py-2.5 px-3 text-right">MVPs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {(selectedScoreboardMatch.team1?.players || []).map(p => {
                      const isUser = p.isCurrentUser || p.name.toLowerCase() === currentGamerTag.toLowerCase() || p.name.toLowerCase().includes('blockeer');
                      const ratingNum = parseFloat(p.rating);

                      return (
                        <tr
                          key={p.id || p.name}
                          className={`transition ${
                            isUser
                              ? 'bg-[#0e272a] font-bold border-l-4 border-l-[#2dd4bf]'
                              : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          {/* Player */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-purple-400 text-xs">▲</span>
                              <img src={p.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10" />
                              <span className={`text-xs ${isUser ? 'text-[#2dd4bf] font-black' : 'text-white font-semibold'}`}>
                                {p.name}
                              </span>
                              {isUser && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/40 uppercase">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Rank */}
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5">
                              <FaceitLevelRing level={p.level} size={20} />
                              <span className="text-white font-bold text-xs">{p.elo.toLocaleString()}</span>
                            </div>
                          </td>

                          {/* Rating */}
                          <td className="py-2.5 px-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold inline-flex items-center gap-1 ${
                                p.hasMvpStar
                                  ? 'bg-[#c2850c] text-white font-black shadow'
                                  : ratingNum >= 1.20
                                  ? 'bg-[#22C55E] text-black font-black'
                                  : ratingNum >= 1.00
                                  ? 'bg-[#272b38] text-slate-200'
                                  : 'bg-[#ef4444] text-white font-black'
                              }`}
                            >
                              <span>{p.rating}</span>
                              {p.hasMvpStar && <Star className="w-3 h-3 fill-current text-white" />}
                            </span>
                          </td>

                          {/* Swing */}
                          <td className={`py-2.5 px-2 text-right ${p.isPositiveSwing ? 'text-white' : 'text-[#ef4444]'}`}>
                            {p.swing}
                          </td>

                          {/* K, D, A */}
                          <td className="py-2.5 px-2 text-right font-bold text-white">{p.kills}</td>
                          <td className="py-2.5 px-2 text-right text-slate-400">{p.deaths}</td>
                          <td className="py-2.5 px-2 text-right text-slate-400">{p.assists}</td>

                          {/* ADR, K/D, K/R */}
                          <td className="py-2.5 px-2 text-right text-slate-200">{p.adr}</td>
                          <td className="py-2.5 px-2 text-right text-slate-200">{p.kd}</td>
                          <td className="py-2.5 px-2 text-right text-slate-200">{p.kr}</td>

                          {/* HS, HS % */}
                          <td className="py-2.5 px-2 text-right text-slate-300">{p.hs}</td>
                          <td className="py-2.5 px-2 text-right text-slate-300">{p.hsPercentage}</td>

                          {/* 5k, 4k, 3k, 2k, MVPs */}
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

            {/* ======================================================== */}
            {/* TEAM 2 (Score 3 or Opponent)                            */}
            {/* ======================================================== */}
            <div className="space-y-1.5 pt-2">
              {/* Team 2 Header Bar */}
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

              {/* Team 2 Table (17 Columns) */}
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#121316]">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 text-[11px] uppercase tracking-wider bg-black/40">
                      <th className="py-2.5 px-3 min-w-[170px]">Player</th>
                      <th className="py-2.5 px-2 min-w-[85px]">Rank</th>
                      <th className="py-2.5 px-2 min-w-[90px]">
                        <span className="inline-flex items-center gap-1 text-[#F97316]">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#F97316] text-black font-black text-[9px] flex items-center justify-center">⯆</span>
                          <span>Rating</span>
                          <ChevronDown className="w-3 h-3" />
                        </span>
                      </th>
                      <th className="py-2.5 px-2 text-right min-w-[75px]">Swing</th>
                      <th className="py-2.5 px-2 text-right">K</th>
                      <th className="py-2.5 px-2 text-right">D</th>
                      <th className="py-2.5 px-2 text-right">A</th>
                      <th className="py-2.5 px-2 text-right min-w-[55px]">ADR</th>
                      <th className="py-2.5 px-2 text-right min-w-[50px]">K/D</th>
                      <th className="py-2.5 px-2 text-right min-w-[50px]">K/R</th>
                      <th className="py-2.5 px-2 text-right">HS</th>
                      <th className="py-2.5 px-2 text-right min-w-[60px]">HS %</th>
                      <th className="py-2.5 px-2 text-right">5k</th>
                      <th className="py-2.5 px-2 text-right">4k</th>
                      <th className="py-2.5 px-2 text-right">3k</th>
                      <th className="py-2.5 px-2 text-right">2k</th>
                      <th className="py-2.5 px-3 text-right">MVPs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {(selectedScoreboardMatch.team2?.players || []).map(p => {
                      const isUser = p.isCurrentUser || p.name.toLowerCase() === currentGamerTag.toLowerCase() || p.name.toLowerCase().includes('blockeer');
                      const ratingNum = parseFloat(p.rating);

                      return (
                        <tr
                          key={p.id || p.name}
                          className={`transition ${
                            isUser
                              ? 'bg-[#0e272a] font-bold border-l-4 border-l-[#2dd4bf]'
                              : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          {/* Player */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[#2dd4bf] text-xs">◆</span>
                              <img src={p.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10" />
                              <span className={`text-xs ${isUser ? 'text-[#2dd4bf] font-black' : 'text-white font-semibold'}`}>
                                {p.name}
                              </span>
                              {isUser && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/40 uppercase">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Rank */}
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5">
                              <FaceitLevelRing level={p.level} size={20} />
                              <span className="text-white font-bold text-xs">{p.elo.toLocaleString()}</span>
                            </div>
                          </td>

                          {/* Rating */}
                          <td className="py-2.5 px-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold inline-flex items-center gap-1 ${
                                p.hasMvpStar
                                  ? 'bg-[#c2850c] text-white font-black shadow'
                                  : ratingNum >= 1.20
                                  ? 'bg-[#22C55E] text-black font-black'
                                  : ratingNum >= 1.00
                                  ? 'bg-[#272b38] text-slate-200'
                                  : 'bg-[#ef4444] text-white font-black'
                              }`}
                            >
                              <span>{p.rating}</span>
                              {p.hasMvpStar && <Star className="w-3 h-3 fill-current text-white" />}
                            </span>
                          </td>

                          {/* Swing */}
                          <td className={`py-2.5 px-2 text-right ${p.isPositiveSwing ? 'text-white' : 'text-[#ef4444]'}`}>
                            {p.swing}
                          </td>

                          {/* K, D, A */}
                          <td className="py-2.5 px-2 text-right font-bold text-white">{p.kills}</td>
                          <td className="py-2.5 px-2 text-right text-slate-400">{p.deaths}</td>
                          <td className="py-2.5 px-2 text-right text-slate-400">{p.assists}</td>

                          {/* ADR, K/D, K/R */}
                          <td className="py-2.5 px-2 text-right text-slate-200">{p.adr}</td>
                          <td className="py-2.5 px-2 text-right text-slate-200">{p.kd}</td>
                          <td className="py-2.5 px-2 text-right text-slate-200">{p.kr}</td>

                          {/* HS, HS % */}
                          <td className="py-2.5 px-2 text-right text-slate-300">{p.hs}</td>
                          <td className="py-2.5 px-2 text-right text-slate-300">{p.hsPercentage}</td>

                          {/* 5k, 4k, 3k, 2k, MVPs */}
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

            {/* Modal Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Official CS2 Sub-Tick 128 GOTV Demo (.dem) available for download</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setToast(`✓ Shkarkimi i GOTV Demo për ndeshjen ${selectedScoreboardMatch.mapDisplayName} filloi...`);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download GOTV Demo</span>
                </button>
                <button
                  onClick={() => setSelectedScoreboardMatch(null)}
                  className="px-5 py-2 rounded-xl bg-[#FF5500] hover:bg-[#FF5500]/90 text-black text-xs font-mono font-black cursor-pointer transition"
                >
                  Mbyll Scoreboard
                </button>
              </div>
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
