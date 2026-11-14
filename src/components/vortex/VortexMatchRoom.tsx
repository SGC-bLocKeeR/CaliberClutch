import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Shield,
  Activity,
  Crosshair,
  Clock, 
  Trophy, 
  Radio, 
  RotateCcw,
  MoreVertical,
  Headphones,
  Send,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Share2,
  Info,
  Download,
  Lock,
  Eye,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Flame,
  Award,
  Smile
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { CountryFlag } from './CountryFlag';

export interface FaceitMatchPlayer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  elo: number;
  code: string;
  countryName: string;
  isCaptain?: boolean;
  hasPriority?: boolean;
  verified?: boolean;
  matches: number;
  winRate: string;
  recentResults?: ('W' | 'L')[];
  rating: string;
  swing: string;
  isPositiveSwing?: boolean;
  kda: string;
  kd: string;
  kr: string;
  adr: string;
  badgeIndex?: number;
}

export interface FaceitStatsRow {
  id: string;
  name: string;
  avatar: string;
  code: string;
  countryName: string;
  rankLevel: number;
  rankElo: number;
  rating: string;
  ratingScore: number;
  isMvp?: boolean;
  team?: 'team1' | 'team2';
  partyShape?: 'circle' | 'diamond' | 'triangle' | 'square';
  hasPriority?: boolean;
  swing: string;
  isPositiveSwing: boolean;
  k: number;
  d: number;
  a: number;
  adr: string;
  kd: string;
  kr: string;
  hs: number;
  hsRate: string;
  k5: number;
  k4: number;
  k3: number;
  k2: number;
  mvps: number;

  // Advanced Stats
  rws: string;
  crosshairCode: string;
  kast: string;
  acc: string;
  sAcc: string;
  shots: number;
  hits: number;
  mk: number;
  mkRate: string;
  rp: number;
  rs: number;

  // Entry Stats
  entryAttempts: number;
  entryKills: number;
  entryDeaths: number;
  entryDiff: number;
  entryAttemptsRate: string;
  entrySuccessRate: string;

  // Trade Stats
  tradeKills: number;
  deathsTraded: number;
  tradedEntryKills: number;
  tradedEntryDeaths: number;

  // Clutch Stats
  clutchWins: number;
  clutchRoundsLost: number;
  clutchSuccess: string;
  c1v5: number;
  c1v4: number;
  c1v3: number;
  c1v2: number;
  c1v1: number;
}

interface VortexMatchRoomProps {
  matchId?: string;
  currentGamerTag: string;
  currentAvatarUrl?: string;
  partyMembers?: Array<{
    id: string;
    name: string;
    avatar?: string;
    level?: number;
    elo?: number;
    code?: string;
    countryName?: string;
    verification?: 'vip' | 'verified' | 'none';
  }>;
  onClose: () => void;
}

export interface MatchChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  team: 'team1' | 'team2' | 'system' | 'admin';
  isSystem?: boolean;
  isAdmin?: boolean;
  text: string;
  timestamp: string;
  code?: string;
}

const QUICK_TACTICAL_PHRASES = [
  "GL HF! 👊",
  "Ban Vertigo please ❌",
  "I play AWP on Mirage 🎯",
  "Connect fast to server 🚀",
  "Nice map pick! 🔥",
  "Good comms team 🎙️"
];

// Authentic FACEIT circular level ring badge (Yellow for 6-7, Orange for 8-9, Red for 10)
const FaceitLevelRing: React.FC<{ level: number; size?: number }> = ({ level, size = 26 }) => {
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

// Authentic FACEIT Anti-Cheat Shield Badge (Exact 1:1 FACEIT from Reference)
const FaceitAntiCheatShield: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({ 
  size = 18, 
  className = '',
  style
}) => {
  return (
    <div 
      className={`group/shield inline-flex items-center justify-center shrink-0 cursor-pointer select-none ${className}`}
      style={style}
      title="Anti-cheat Required"
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 18 18" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
      >
        {/* Layer 1: Solid Dark Cutout Background (cuts cleanly into the avatar photo) */}
        <path 
          d="M9 0.5L16.5 2.5V9C16.5 13 13 16 9 17.2C5 16 1.5 13 1.5 9V2.5L9 0.5Z" 
          fill="#14151D" 
          stroke="#14151D" 
          strokeWidth="3.2" 
          strokeLinejoin="round" 
          strokeLinecap="round"
        />
        {/* Layer 2: Outer Neon-Lime Shield Outline */}
        <path 
          d="M9 1L16 3V9C16 12.6 12.8 15.3 9 16.5C5.2 15.3 2 12.6 2 9V3L9 1Z" 
          fill="#0E0F14" 
          stroke="#B4FF00" 
          strokeWidth="1.6" 
          strokeLinejoin="round"
        />
        {/* Layer 3: Inner Solid Neon-Lime Mini-Shield */}
        <path 
          d="M9 5.2L12.2 6.3V9.2C12.2 11.2 10.7 12.6 9 13.4C7.3 12.6 5.8 11.2 5.8 9.2V6.3L9 5.2Z" 
          fill="#B4FF00" 
        />
      </svg>

      {/* 1:1 FACEIT Tooltip on Hover */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover/shield:flex items-center px-2 py-0.5 rounded bg-[#16171E] border border-white/60 text-[11px] font-sans text-white whitespace-nowrap shadow-2xl z-50 pointer-events-none">
        Anti-cheat Required
      </div>
    </div>
  );
};

// Authentic FACEIT Team Captain White Crown (Exact 1:1 FACEIT from Reference)
const FaceitCaptainCrown: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div 
    className={`absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center ${className}`}
    title="Team Captain"
  >
    <svg 
      width="20" 
      height="13" 
      viewBox="0 0 20 13" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
    >
      <path 
        d="M2 9.5L1.5 2L6.5 5.5L10 0.5L13.5 5.5L18.5 2L18 9.5H2Z" 
        fill="white" 
      />
      <rect x="2" y="10.5" width="16" height="2" rx="0.5" fill="white" />
    </svg>
  </div>
);

// Authentic FACEIT Target / Priority Orange Star Badge (Exact 1:1 FACEIT from Reference)
const FaceitPriorityStar: React.FC<{ size?: number; className?: string }> = ({ size = 15, className = '' }) => (
  <div 
    className={`group/priority relative inline-flex items-center justify-center shrink-0 cursor-pointer ${className}`}
    title="Target / Priority"
  >
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_2px_rgba(0,0,0,1)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
    >
      <circle cx="8" cy="8" r="7" fill="#140E0A" stroke="#FF5500" strokeWidth="1.6" />
      <path 
        d="M8 2.5C8 5.2 6.5 6.8 4 8C6.5 9.2 8 10.8 8 13.5C8 10.8 9.5 9.2 12 8C9.5 6.8 8 5.2 8 2.5Z" 
        fill="#FF5500" 
      />
    </svg>

    {/* 1:1 FACEIT Tooltip on Hover */}
    <div className="absolute left-full ml-1.5 top-1/2 -translate-y-1/2 hidden group-hover/priority:flex items-center px-2 py-1 rounded bg-[#18191E] border border-[#383A42] text-[11px] font-mono text-slate-200 whitespace-nowrap shadow-xl z-50 pointer-events-none">
      Target / Priority
    </div>
  </div>
);

export const VortexMatchRoom: React.FC<VortexMatchRoomProps> = ({
  matchId = 'VTX-89421',
  currentGamerTag = 'bLocKeeRz',
  currentAvatarUrl,
  partyMembers = [],
  onClose
}) => {
  // Navigation Tabs: OVERVIEW vs STATS
  const [activeTab, setActiveTab] = useState<'overview' | 'stats'>('overview');

  // Stats Sub-Tabs: SUMMARY / DUELS / UTILITY / MATCH INSIGHTS
  const [statsSubTab, setStatsSubTab] = useState<'summary' | 'duels' | 'utility' | 'insights'>('summary');
  const [tableFilter, setTableFilter] = useState<'general' | 'advanced' | 'entry' | 'trade' | 'clutch'>('general');
  const [sortFilter, setSortFilter] = useState<'team' | 'players'>('team');
  const [sideFilter, setSideFilter] = useState<'all' | 't' | 'ct'>('all');

  // Veto & Match state
  const [isVetoTooltipOpen, setIsVetoTooltipOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCrosshairId, setCopiedCrosshairId] = useState<string | null>(null);
  const [selectedFlyoutPlayer, setSelectedFlyoutPlayer] = useState<FaceitMatchPlayer | null>(null);
  const [flyoutPosition, setFlyoutPosition] = useState<{ top: number; left: number } | null>(null);

  const handleCopyCrosshair = (id: string, code: string) => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCrosshairId(id);
    setTimeout(() => {
      setCopiedCrosshairId(null);
    }, 2000);
  };

  // Active Highlight Video
  const [activeHighlightVideo, setActiveHighlightVideo] = useState({
    title: 'Anubis Wallbang AWP 3K',
    player: 'Nascar777',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    views: 0,
    isPlaying: false
  });

  // 3-Dots Menu & Live Support Modal
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedSupportIssue, setSelectedSupportIssue] = useState<string>('server_issue');
  const [supportCallSubmitted, setSupportCallSubmitted] = useState<boolean>(false);

  // Right Sidebar Match Chat Toggle (1:1 FACEIT)
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(true);
  const [roomInput, setRoomInput] = useState('');
  const [teamInput, setTeamInput] = useState('');
  const [isTeamChatCollapsed, setIsTeamChatCollapsed] = useState(false);

  // Room chat messages (Room chat - all 10 players)
  const [roomMessages, setRoomMessages] = useState<MatchChatMessage[]>([
    {
      id: 'rm-1',
      sender: 'Rosen33',
      avatar: '/images/avatar_duck_exact.png',
      team: 'team1',
      code: 'SE',
      text: 'good luck have fun everyone!',
      timestamp: '01:55 am'
    }
  ]);

  // Team chat messages (Exact 1:1 FACEIT Team Chat from user reference)
  const [teamMessages, setTeamMessages] = useState<MatchChatMessage[]>([
    {
      id: 'tm-1',
      sender: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      team: 'team2',
      code: 'XK',
      text: 'go dust',
      timestamp: '01:58 am'
    },
    {
      id: 'tm-2',
      sender: 'zimny',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      team: 'team2',
      code: 'FR',
      text: 'you wanna anubis',
      timestamp: '01:58 am'
    },
    {
      id: 'tm-3',
      sender: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      team: 'team2',
      code: 'XK',
      text: 'whateveer',
      timestamp: '01:58 am'
    },
    {
      id: 'tm-4',
      sender: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      team: 'team2',
      code: 'XK',
      text: 'np',
      timestamp: '01:58 am'
    },
    {
      id: 'tm-5',
      sender: currentGamerTag || 'bLocKeeRz',
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      team: 'team2',
      code: 'GY',
      text: 'no',
      timestamp: '01:58 am'
    }
  ]);

  const teamEndRef = useRef<HTMLDivElement>(null);
  const roomEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatDrawerOpen) {
      teamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [teamMessages, isChatDrawerOpen]);

  // Exact 1:1 FACEIT Team 1 Players (Overview Cards)
  const team1Players: FaceitMatchPlayer[] = [
    {
      id: 'p1',
      name: 'Rosen33',
      avatar: '/images/avatar_duck_exact.png',
      level: 9,
      elo: 1967,
      code: 'SE',
      countryName: 'Sweden',
      verified: true,
      isCaptain: true,
      hasPriority: true,
      matches: 429,
      winRate: '54%',
      recentResults: ['W', 'W', 'W', 'L', 'W'],
      rating: '1.16',
      swing: '+0.96%',
      isPositiveSwing: true,
      kda: '17/16/5',
      kd: '1.07',
      kr: '0.81',
      adr: '88.1',
      badgeIndex: 1
    },
    {
      id: 'p2',
      name: 'stonken',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      level: 8,
      elo: 1589,
      code: 'SE',
      countryName: 'Sweden',
      verified: true,
      matches: 160,
      winRate: '48%',
      recentResults: ['W', 'W', 'L', 'L', 'W'],
      rating: '1.00',
      swing: '-1.82%',
      isPositiveSwing: false,
      kda: '14/17/5',
      kd: '0.80',
      kr: '0.64',
      adr: '73.9',
      badgeIndex: 2
    },
    {
      id: 'p3',
      name: 'wast3dtalen1',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1780,
      code: 'RU',
      countryName: 'Russia',
      verified: true,
      hasPriority: true,
      matches: 2085,
      winRate: '49%',
      recentResults: ['L', 'L', 'L', 'L', 'L'],
      rating: '1.08',
      swing: '-0.41%',
      isPositiveSwing: false,
      kda: '18/17/5',
      kd: '1.05',
      kr: '0.78',
      adr: '83.4',
      badgeIndex: 1
    },
    {
      id: 'p4',
      name: 'mxrty666',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1943,
      code: 'SE',
      countryName: 'Sweden',
      verified: true,
      matches: 1127,
      winRate: '51%',
      recentResults: ['W', 'L', 'W', 'W', 'L'],
      rating: '1.20',
      swing: '+1.58%',
      isPositiveSwing: true,
      kda: '18/15/5',
      kd: '1.16',
      kr: '0.84',
      adr: '87.7',
      badgeIndex: 1
    },
    {
      id: 'p5',
      name: 'zeryx666',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
      level: 8,
      elo: 1573,
      code: 'RU',
      countryName: 'Russia',
      verified: true,
      matches: 989,
      winRate: '52%',
      recentResults: ['W', 'W', 'W', 'L', 'W'],
      rating: '1.08',
      swing: '-0.34%',
      isPositiveSwing: false,
      kda: '14/15/4',
      kd: '0.93',
      kr: '0.67',
      adr: '69.9',
      badgeIndex: 1
    }
  ];

  // Exact 1:1 FACEIT Team 2 Players (Overview Cards - Matches Reference Image)
  const team2Players: FaceitMatchPlayer[] = [
    {
      id: 'op1',
      name: 'Zalevvo',
      avatar: '/images/avatar_ghost_exact.png',
      level: 6,
      elo: 1253,
      code: 'UA',
      countryName: 'Ukraine',
      verified: true,
      isCaptain: true,
      matches: 512,
      winRate: '50%',
      recentResults: ['L', 'W', 'L', 'L', 'W'],
      rating: '1.10',
      swing: '-0.17%',
      isPositiveSwing: false,
      kda: '16/17/6',
      kd: '0.93',
      kr: '0.69',
      adr: '81.6',
      badgeIndex: 1
    },
    {
      id: 'op2',
      name: 'zimny',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1840,
      code: 'FR',
      countryName: 'France',
      verified: true,
      matches: 1121,
      winRate: '53%',
      recentResults: ['L', 'W', 'L', 'L', 'W'],
      rating: '1.19',
      swing: '+1.27%',
      isPositiveSwing: true,
      kda: '18/17/5',
      kd: '1.04',
      kr: '0.79',
      adr: '87.2',
      badgeIndex: 1
    },
    {
      id: 'op3',
      name: 'Nascar777',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      level: 10,
      elo: 2046,
      code: 'PL',
      countryName: 'Poland',
      verified: true,
      matches: 2890,
      winRate: '55%',
      recentResults: ['W', 'W', 'W', 'W', 'L'],
      rating: '1.22',
      swing: '+2.22%',
      isPositiveSwing: true,
      kda: '18/15/5',
      kd: '1.26',
      kr: '0.84',
      adr: '89.8',
      badgeIndex: 1
    },
    {
      id: 'op4',
      name: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      level: 10,
      elo: 2175,
      code: 'XK',
      countryName: 'Kosovo',
      verified: true,
      matches: 3421,
      winRate: '58%',
      recentResults: ['W', 'L', 'W', 'L', 'L'],
      rating: '1.18',
      swing: '+1.44%',
      isPositiveSwing: true,
      kda: '19/16/6',
      kd: '1.16',
      kr: '0.82',
      adr: '90.3',
      badgeIndex: 69
    },
    {
      id: 'op5',
      name: currentGamerTag || 'bLocKeeRz',
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      level: 7,
      elo: 1433,
      code: 'GY',
      countryName: 'Guyana',
      verified: true,
      hasPriority: true,
      matches: 1644,
      winRate: '43%',
      recentResults: ['L', 'L', 'W', 'L', 'L'],
      rating: '0.94',
      swing: '-2.90%',
      isPositiveSwing: false,
      kda: '13/17/6',
      kd: '0.77',
      kr: '0.58',
      adr: '70.8',
      badgeIndex: 1
    }
  ];

  // Map Veto Exact List (as shown in user screenshot)
  const vetoHistoryList = [
    { step: 1, text: 'team_Rosen33 banned Cache', isDecided: false },
    { step: 2, text: 'team_Zalevvo banned Inferno', isDecided: false },
    { step: 3, text: 'team_Rosen33 banned Nuke', isDecided: false },
    { step: 4, text: 'team_Zalevvo banned Ancient', isDecided: false },
    { step: 5, text: 'team_Rosen33 banned Mirage', isDecided: false },
    { step: 6, text: 'team_Zalevvo banned Dust2', isDecided: false },
    { step: 7, text: 'Anubis picked by default', isDecided: true }
  ];

  // Detailed Stats Table: Team 1 (Rosen33) - All 5 Sub-Tabs
  const team1StatsRows: FaceitStatsRow[] = [
    {
      id: 's1',
      name: 'Rosen33',
      avatar: '/images/avatar_duck_exact.png',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 9,
      rankElo: 1993,
      rating: '1.68',
      ratingScore: 1.68,
      isMvp: true,
      team: 'team1',
      partyShape: 'circle',
      swing: '+9.32%',
      isPositiveSwing: true,
      k: 20,
      d: 11,
      a: 3,
      adr: '109.6',
      kd: '1.82',
      kr: '1.00',
      hs: 11,
      hsRate: '55.0%',
      k5: 0,
      k4: 0,
      k3: 2,
      k2: 3,
      mvps: 4,
      // Advanced
      rws: '17.82',
      crosshairCode: 'CSGO-3k8qX-aB27v-85Yw3-2k9F8-3kK8A',
      kast: '75.0%',
      acc: '20.1%',
      sAcc: '40.2%',
      shots: 299,
      hits: 60,
      mk: 5,
      mkRate: '25%',
      rp: 20,
      rs: 9,
      // Entry
      entryAttempts: 1,
      entryKills: 1,
      entryDeaths: 0,
      entryDiff: 1,
      entryAttemptsRate: '5%',
      entrySuccessRate: '100%',
      // Trade
      tradeKills: 8,
      deathsTraded: 2,
      tradedEntryKills: 1,
      tradedEntryDeaths: 0,
      // Clutch
      clutchWins: 3,
      clutchRoundsLost: 1,
      clutchSuccess: '75%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 1,
      c1v1: 2
    },
    {
      id: 's2',
      name: 'zeryx666',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
      code: 'RU',
      countryName: 'Russia',
      rankLevel: 8,
      rankElo: 1599,
      rating: '1.32',
      ratingScore: 1.32,
      team: 'team1',
      partyShape: 'diamond',
      hasPriority: true,
      swing: '+3.32%',
      isPositiveSwing: true,
      k: 12,
      d: 14,
      a: 6,
      adr: '73.0',
      kd: '0.86',
      kr: '0.60',
      hs: 7,
      hsRate: '58.3%',
      k5: 0,
      k4: 0,
      k3: 2,
      k2: 1,
      mvps: 4,
      // Advanced
      rws: '14.74',
      crosshairCode: 'CSGO-hQ238-wL2Fq-8oY8u-7zZp2-4vN2B',
      kast: '60.0%',
      acc: '26.5%',
      sAcc: '44.7%',
      shots: 219,
      hits: 58,
      mk: 3,
      mkRate: '15%',
      rp: 20,
      rs: 6,
      // Entry
      entryAttempts: 5,
      entryKills: 1,
      entryDeaths: 4,
      entryDiff: -3,
      entryAttemptsRate: '25%',
      entrySuccessRate: '20%',
      // Trade
      tradeKills: 2,
      deathsTraded: 2,
      tradedEntryKills: 1,
      tradedEntryDeaths: 1,
      // Clutch
      clutchWins: 0,
      clutchRoundsLost: 2,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's3',
      name: 'mxrty666',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 9,
      rankElo: 1968,
      rating: '1.21',
      ratingScore: 1.21,
      team: 'team1',
      partyShape: 'diamond',
      hasPriority: true,
      swing: '+1.45%',
      isPositiveSwing: true,
      k: 19,
      d: 15,
      a: 5,
      adr: '91.4',
      kd: '1.27',
      kr: '0.95',
      hs: 11,
      hsRate: '57.9%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 5,
      mvps: 2,
      // Advanced
      rws: '13.36',
      crosshairCode: 'CSGO-6vW4K-5u8zZ-x7Tq2-78uY2-2vX8C',
      kast: '85.0%',
      acc: '20.2%',
      sAcc: '42.0%',
      shots: 272,
      hits: 55,
      mk: 6,
      mkRate: '30%',
      rp: 20,
      rs: 5,
      // Entry
      entryAttempts: 5,
      entryKills: 2,
      entryDeaths: 3,
      entryDiff: -1,
      entryAttemptsRate: '25%',
      entrySuccessRate: '40%',
      // Trade
      tradeKills: 1,
      deathsTraded: 7,
      tradedEntryKills: 0,
      tradedEntryDeaths: 3,
      // Clutch
      clutchWins: 1,
      clutchRoundsLost: 1,
      clutchSuccess: '50%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 1
    },
    {
      id: 's4',
      name: 'stonken',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 8,
      rankElo: 1613,
      rating: '1.17',
      ratingScore: 1.17,
      team: 'team1',
      partyShape: 'circle',
      hasPriority: true,
      swing: '+1.41%',
      isPositiveSwing: true,
      k: 13,
      d: 15,
      a: 4,
      adr: '67.5',
      kd: '0.87',
      kr: '0.65',
      hs: 6,
      hsRate: '46.2%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 2,
      mvps: 1,
      // Advanced
      rws: '10.90',
      crosshairCode: 'CSGO-8yX2K-9uZ2W-3kL8q-4vT7u-8xZ9D',
      kast: '75.0%',
      acc: '16.4%',
      sAcc: '25.9%',
      shots: 268,
      hits: 44,
      mk: 2,
      mkRate: '10%',
      rp: 20,
      rs: 5,
      // Entry
      entryAttempts: 3,
      entryKills: 1,
      entryDeaths: 2,
      entryDiff: -1,
      entryAttemptsRate: '15%',
      entrySuccessRate: '33%',
      // Trade
      tradeKills: 2,
      deathsTraded: 5,
      tradedEntryKills: 1,
      tradedEntryDeaths: 0,
      // Clutch
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's5',
      name: 'wast3dtalen1',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      code: 'RU',
      countryName: 'Russia',
      rankLevel: 9,
      rankElo: 1833,
      rating: '1.02',
      ratingScore: 1.02,
      team: 'team1',
      partyShape: 'circle',
      swing: '-1.41%',
      isPositiveSwing: false,
      k: 12,
      d: 14,
      a: 2,
      adr: '54.1',
      kd: '0.86',
      kr: '0.60',
      hs: 4,
      hsRate: '33.3%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 0,
      mvps: 2,
      // Advanced
      rws: '8.17',
      crosshairCode: 'CSGO-4uY8Z-7xT2W-2kL9q-5vX8u-3wZ7E',
      kast: '65.0%',
      acc: '19.9%',
      sAcc: '37.3%',
      shots: 171,
      hits: 34,
      mk: 1,
      mkRate: '5%',
      rp: 20,
      rs: 6,
      // Entry
      entryAttempts: 6,
      entryKills: 4,
      entryDeaths: 2,
      entryDiff: 2,
      entryAttemptsRate: '30%',
      entrySuccessRate: '67%',
      // Trade
      tradeKills: 5,
      deathsTraded: 2,
      tradedEntryKills: 1,
      tradedEntryDeaths: 0,
      // Clutch
      clutchWins: 0,
      clutchRoundsLost: 2,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    }
  ];

  // Detailed Stats Table: Team 2 (Zalevvo) - All 5 Sub-Tabs
  const team2StatsRows: FaceitStatsRow[] = [
    {
      id: 's6',
      name: 'zimny',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      code: 'FR',
      countryName: 'France',
      rankLevel: 9,
      rankElo: 1817,
      rating: '1.13',
      ratingScore: 1.13,
      team: 'team2',
      partyShape: 'triangle',
      swing: '+0.97%',
      isPositiveSwing: true,
      k: 16,
      d: 14,
      a: 0,
      adr: '80.6',
      kd: '1.14',
      kr: '0.80',
      hs: 7,
      hsRate: '43.8%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 2,
      mvps: 2,
      // Advanced
      rws: '7.64',
      crosshairCode: 'CSGO-2zX8K-6uY9W-4kL7q-3vT8u-7wZ2F',
      kast: '80.0%',
      acc: '19.3%',
      sAcc: '42.9%',
      shots: 197,
      hits: 38,
      mk: 2,
      mkRate: '10%',
      rp: 20,
      rs: 6,
      // Entry
      entryAttempts: 4,
      entryKills: 3,
      entryDeaths: 1,
      entryDiff: 2,
      entryAttemptsRate: '20%',
      entrySuccessRate: '75%',
      // Trade
      tradeKills: 2,
      deathsTraded: 1,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      // Clutch
      clutchWins: 1,
      clutchRoundsLost: 2,
      clutchSuccess: '33%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 1
    },
    {
      id: 's7',
      name: 'Zalevvo',
      avatar: '/images/avatar_ghost_exact.png',
      code: 'UA',
      countryName: 'Ukraine',
      rankLevel: 6,
      rankElo: 1234,
      rating: '1.12',
      ratingScore: 1.12,
      team: 'team2',
      partyShape: 'triangle',
      swing: '+0.06%',
      isPositiveSwing: true,
      k: 19,
      d: 15,
      a: 7,
      adr: '116.4',
      kd: '1.27',
      kr: '0.95',
      hs: 12,
      hsRate: '63.2%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 6,
      mvps: 2,
      // Advanced
      rws: '7.75',
      crosshairCode: 'CSGO-7yX9K-8uZ3W-5kL2q-6vT9u-9wZ4G',
      kast: '85.0%',
      acc: '20.3%',
      sAcc: '41.1%',
      shots: 370,
      hits: 75,
      mk: 7,
      mkRate: '35%',
      rp: 20,
      rs: 5,
      // Entry
      entryAttempts: 5,
      entryKills: 2,
      entryDeaths: 3,
      entryDiff: -1,
      entryAttemptsRate: '25%',
      entrySuccessRate: '40%',
      // Trade
      tradeKills: 4,
      deathsTraded: 1,
      tradedEntryKills: 0,
      tradedEntryDeaths: 1,
      // Clutch
      clutchWins: 0,
      clutchRoundsLost: 5,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's8',
      name: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      code: 'XK',
      countryName: 'Kosovo',
      rankLevel: 10,
      rankElo: 2156,
      rating: '0.86',
      ratingScore: 0.86,
      team: 'team2',
      partyShape: 'square',
      swing: '-4.15%',
      isPositiveSwing: false,
      k: 16,
      d: 17,
      a: 3,
      adr: '76.0',
      kd: '0.94',
      kr: '0.80',
      hs: 7,
      hsRate: '43.8%',
      k5: 0,
      k4: 1,
      k3: 0,
      k2: 2,
      mvps: 1,
      // Advanced
      rws: '8.61',
      crosshairCode: 'CSGO-9zX4K-2uY8W-7kL3q-4vT2u-8wZ6H',
      kast: '60.0%',
      acc: '14.9%',
      sAcc: '29.0%',
      shots: 262,
      hits: 39,
      mk: 3,
      mkRate: '15%',
      rp: 20,
      rs: 4,
      // Entry
      entryAttempts: 7,
      entryKills: 5,
      entryDeaths: 2,
      entryDiff: 3,
      entryAttemptsRate: '35%',
      entrySuccessRate: '71%',
      // Trade
      tradeKills: 6,
      deathsTraded: 1,
      tradedEntryKills: 3,
      tradedEntryDeaths: 0,
      // Clutch
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's9',
      name: currentGamerTag || 'bLocKeeRz',
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      code: 'XK',
      countryName: 'Kosovo',
      rankLevel: 7,
      rankElo: 1407,
      rating: '0.76',
      ratingScore: 0.76,
      team: 'team2',
      partyShape: 'square',
      swing: '-2.80%',
      isPositiveSwing: false,
      k: 7,
      d: 13,
      a: 8,
      adr: '53.9',
      kd: '0.54',
      kr: '0.35',
      hs: 4,
      hsRate: '57.1%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 2,
      mvps: 1,
      // Advanced
      rws: '7.53',
      crosshairCode: 'CSGO-5kL9q-3vT8u-7wZ2F-6uY9W-2zX8K',
      kast: '65.0%',
      acc: '13.8%',
      sAcc: '28.2%',
      shots: 239,
      hits: 33,
      mk: 2,
      mkRate: '10%',
      rp: 18,
      rs: 5,
      // Entry
      entryAttempts: 1,
      entryKills: 0,
      entryDeaths: 1,
      entryDiff: -1,
      entryAttemptsRate: '5%',
      entrySuccessRate: '0%',
      // Trade
      tradeKills: 0,
      deathsTraded: 5,
      tradedEntryKills: 0,
      tradedEntryDeaths: 1,
      // Clutch
      clutchWins: 0,
      clutchRoundsLost: 0,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's10',
      name: 'Nascar777',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      code: 'PL',
      countryName: 'Poland',
      rankLevel: 10,
      rankElo: 2028,
      rating: '0.71',
      ratingScore: 0.71,
      team: 'team2',
      partyShape: 'triangle',
      hasPriority: true,
      swing: '-7.08%',
      isPositiveSwing: false,
      k: 11,
      d: 16,
      a: 1,
      adr: '51.8',
      kd: '0.69',
      kr: '0.55',
      hs: 2,
      hsRate: '18.2%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 1,
      mvps: 1,
      // Advanced
      rws: '3.46',
      crosshairCode: 'CSGO-1wZ7E-4uY8Z-7xT2W-2kL9q-5vX8u',
      kast: '60.0%',
      acc: '13.5%',
      sAcc: '24.5%',
      shots: 200,
      hits: 27,
      mk: 2,
      mkRate: '10%',
      rp: 20,
      rs: 4,
      // Entry
      entryAttempts: 3,
      entryKills: 1,
      entryDeaths: 2,
      entryDiff: -1,
      entryAttemptsRate: '15%',
      entrySuccessRate: '33%',
      // Trade
      tradeKills: 0,
      deathsTraded: 3,
      tradedEntryKills: 0,
      tradedEntryDeaths: 1,
      // Clutch
      clutchWins: 0,
      clutchRoundsLost: 5,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    }
  ];

  // Exact 1:1 FACEIT T-Side Match Stats (From User Reference Image)
  const tSideStatsRows: FaceitStatsRow[] = [
    {
      id: 's1',
      name: 'Rosen33',
      avatar: '/images/avatar_duck_exact.png',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 9,
      rankElo: 1993,
      rating: '1.33',
      ratingScore: 1.33,
      isMvp: true,
      team: 'team1',
      partyShape: 'circle',
      swing: '+12.90%',
      isPositiveSwing: true,
      k: 12,
      d: 7,
      a: 2,
      adr: '103.4',
      kd: '1.71',
      kr: '1.00',
      hs: 8,
      hsRate: '66.7%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 2,
      mvps: 2,
      rws: '12.45',
      crosshairCode: 'CSGO-3k8qX-aB27v-85Yw3-2k9F8-3kK8A',
      kast: '75.0%',
      acc: '22.0%',
      sAcc: '41.5%',
      shots: 160,
      hits: 35,
      mk: 3,
      mkRate: '25%',
      rp: 8,
      rs: 6,
      entryAttempts: 1,
      entryKills: 1,
      entryDeaths: 0,
      entryDiff: 1,
      entryAttemptsRate: '12%',
      entrySuccessRate: '100%',
      tradeKills: 4,
      deathsTraded: 1,
      tradedEntryKills: 1,
      tradedEntryDeaths: 0,
      clutchWins: 2,
      clutchRoundsLost: 1,
      clutchSuccess: '67%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 1,
      c1v1: 1
    },
    {
      id: 's3',
      name: 'mxrty666',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 9,
      rankElo: 1968,
      rating: '1.26',
      ratingScore: 1.26,
      team: 'team1',
      partyShape: 'diamond',
      hasPriority: true,
      swing: '+5.59%',
      isPositiveSwing: true,
      k: 13,
      d: 9,
      a: 4,
      adr: '98.3',
      kd: '1.44',
      kr: '1.08',
      hs: 8,
      hsRate: '61.5%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 3,
      mvps: 2,
      rws: '9.80',
      crosshairCode: 'CSGO-6vW4K-5u8zZ-x7Tq2-78uY2-2vX8C',
      kast: '75.0%',
      acc: '19.5%',
      sAcc: '40.0%',
      shots: 155,
      hits: 30,
      mk: 4,
      mkRate: '33%',
      rp: 8,
      rs: 3,
      entryAttempts: 3,
      entryKills: 1,
      entryDeaths: 2,
      entryDiff: -1,
      entryAttemptsRate: '25%',
      entrySuccessRate: '33%',
      tradeKills: 1,
      deathsTraded: 4,
      tradedEntryKills: 0,
      tradedEntryDeaths: 2,
      clutchWins: 1,
      clutchRoundsLost: 1,
      clutchSuccess: '50%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 1
    },
    {
      id: 's6',
      name: 'zimny',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      code: 'FR',
      countryName: 'France',
      rankLevel: 9,
      rankElo: 1817,
      rating: '1.07',
      ratingScore: 1.07,
      team: 'team2',
      partyShape: 'triangle',
      swing: '-2.49%',
      isPositiveSwing: false,
      k: 5,
      d: 8,
      a: 0,
      adr: '70.1',
      kd: '0.63',
      kr: '0.63',
      hs: 1,
      hsRate: '20.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 0,
      mvps: 0,
      rws: '5.10',
      crosshairCode: 'CSGO-2zX8K-6uY9W-4kL7q-3vT8u-7wZ2F',
      kast: '62.5%',
      acc: '17.0%',
      sAcc: '38.0%',
      shots: 110,
      hits: 19,
      mk: 0,
      mkRate: '0%',
      rp: 12,
      rs: 3,
      entryAttempts: 2,
      entryKills: 1,
      entryDeaths: 1,
      entryDiff: 0,
      entryAttemptsRate: '17%',
      entrySuccessRate: '50%',
      tradeKills: 1,
      deathsTraded: 1,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's2',
      name: 'zeryx666',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
      code: 'RU',
      countryName: 'Russia',
      rankLevel: 8,
      rankElo: 1599,
      rating: '1.05',
      ratingScore: 1.05,
      team: 'team1',
      partyShape: 'diamond',
      hasPriority: true,
      swing: '-1.65%',
      isPositiveSwing: false,
      k: 4,
      d: 11,
      a: 3,
      adr: '49.3',
      kd: '0.36',
      kr: '0.33',
      hs: 2,
      hsRate: '50.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 1,
      mvps: 2,
      rws: '6.45',
      crosshairCode: 'CSGO-hQ238-wL2Fq-8oY8u-7zZp2-4vN2B',
      kast: '50.0%',
      acc: '22.0%',
      sAcc: '40.0%',
      shots: 105,
      hits: 23,
      mk: 1,
      mkRate: '8%',
      rp: 8,
      rs: 3,
      entryAttempts: 2,
      entryKills: 0,
      entryDeaths: 2,
      entryDiff: -2,
      entryAttemptsRate: '17%',
      entrySuccessRate: '0%',
      tradeKills: 1,
      deathsTraded: 1,
      tradedEntryKills: 0,
      tradedEntryDeaths: 1,
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's7',
      name: 'Zalevvo',
      avatar: '/images/avatar_ghost_exact.png',
      code: 'UA',
      countryName: 'Ukraine',
      rankLevel: 6,
      rankElo: 1234,
      rating: '1.04',
      ratingScore: 1.04,
      team: 'team2',
      partyShape: 'triangle',
      swing: '-2.76%',
      isPositiveSwing: false,
      k: 6,
      d: 7,
      a: 2,
      adr: '85.0',
      kd: '0.86',
      kr: '0.75',
      hs: 4,
      hsRate: '66.7%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 2,
      mvps: 1,
      rws: '5.20',
      crosshairCode: 'CSGO-7yX9K-8uZ3W-5kL2q-6vT9u-9wZ4G',
      kast: '75.0%',
      acc: '19.0%',
      sAcc: '39.0%',
      shots: 170,
      hits: 32,
      mk: 2,
      mkRate: '17%',
      rp: 12,
      rs: 3,
      entryAttempts: 3,
      entryKills: 1,
      entryDeaths: 2,
      entryDiff: -1,
      entryAttemptsRate: '25%',
      entrySuccessRate: '33%',
      tradeKills: 2,
      deathsTraded: 1,
      tradedEntryKills: 0,
      tradedEntryDeaths: 1,
      clutchWins: 0,
      clutchRoundsLost: 3,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's10',
      name: 'Nascar777',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      code: 'PL',
      countryName: 'Poland',
      rankLevel: 10,
      rankElo: 2028,
      rating: '1.03',
      ratingScore: 1.03,
      team: 'team2',
      partyShape: 'triangle',
      hasPriority: true,
      swing: '-3.97%',
      isPositiveSwing: false,
      k: 4,
      d: 7,
      a: 0,
      adr: '62.0',
      kd: '0.57',
      kr: '0.50',
      hs: 1,
      hsRate: '25.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 1,
      mvps: 1,
      rws: '4.80',
      crosshairCode: 'CSGO-1wZ7E-4uY8Z-7xT2W-2kL9q-5vX8u',
      kast: '58.0%',
      acc: '14.0%',
      sAcc: '26.0%',
      shots: 110,
      hits: 15,
      mk: 1,
      mkRate: '8%',
      rp: 12,
      rs: 2,
      entryAttempts: 2,
      entryKills: 1,
      entryDeaths: 1,
      entryDiff: 0,
      entryAttemptsRate: '17%',
      entrySuccessRate: '50%',
      tradeKills: 0,
      deathsTraded: 2,
      tradedEntryKills: 0,
      tradedEntryDeaths: 1,
      clutchWins: 0,
      clutchRoundsLost: 0,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's4',
      name: 'stonken',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 8,
      rankElo: 1613,
      rating: '1.01',
      ratingScore: 1.01,
      team: 'team1',
      partyShape: 'circle',
      hasPriority: true,
      swing: '-0.77%',
      isPositiveSwing: false,
      k: 8,
      d: 11,
      a: 3,
      adr: '74.1',
      kd: '0.73',
      kr: '0.67',
      hs: 3,
      hsRate: '37.5%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 1,
      mvps: 0,
      rws: '7.10',
      crosshairCode: 'CSGO-8yX2K-9uZ2W-3kL8q-4vT7u-8xZ9D',
      kast: '62.5%',
      acc: '15.5%',
      sAcc: '24.0%',
      shots: 140,
      hits: 22,
      mk: 1,
      mkRate: '8%',
      rp: 8,
      rs: 2,
      entryAttempts: 1,
      entryKills: 0,
      entryDeaths: 1,
      entryDiff: -1,
      entryAttemptsRate: '8%',
      entrySuccessRate: '0%',
      tradeKills: 1,
      deathsTraded: 3,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's8',
      name: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      code: 'XK',
      countryName: 'Kosovo',
      rankLevel: 10,
      rankElo: 2156,
      rating: '0.99',
      ratingScore: 0.99,
      team: 'team2',
      partyShape: 'square',
      swing: '-4.66%',
      isPositiveSwing: false,
      k: 4,
      d: 7,
      a: 1,
      adr: '63.4',
      kd: '0.57',
      kr: '0.50',
      hs: 2,
      hsRate: '50.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 0,
      mvps: 0,
      rws: '5.20',
      crosshairCode: 'CSGO-9zX4K-2uY8W-7kL3q-4vT2u-8wZ6H',
      kast: '58.0%',
      acc: '14.0%',
      sAcc: '28.0%',
      shots: 130,
      hits: 18,
      mk: 0,
      mkRate: '0%',
      rp: 12,
      rs: 2,
      entryAttempts: 3,
      entryKills: 2,
      entryDeaths: 1,
      entryDiff: 1,
      entryAttemptsRate: '25%',
      entrySuccessRate: '67%',
      tradeKills: 2,
      deathsTraded: 1,
      tradedEntryKills: 1,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's5',
      name: 'wast3dtalen1',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      code: 'RU',
      countryName: 'Russia',
      rankLevel: 9,
      rankElo: 1833,
      rating: '0.92',
      ratingScore: 0.92,
      team: 'team1',
      partyShape: 'circle',
      swing: '-6.73%',
      isPositiveSwing: false,
      k: 4,
      d: 11,
      a: 1,
      adr: '41.8',
      kd: '0.36',
      kr: '0.33',
      hs: 2,
      hsRate: '50.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 0,
      mvps: 1,
      rws: '4.60',
      crosshairCode: 'CSGO-4uY8Z-7xT2W-2kL9q-5vX8u-3wZ7E',
      kast: '50.0%',
      acc: '18.0%',
      sAcc: '35.0%',
      shots: 95,
      hits: 17,
      mk: 0,
      mkRate: '0%',
      rp: 8,
      rs: 2,
      entryAttempts: 3,
      entryKills: 1,
      entryDeaths: 2,
      entryDiff: -1,
      entryAttemptsRate: '25%',
      entrySuccessRate: '33%',
      tradeKills: 2,
      deathsTraded: 1,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's9',
      name: currentGamerTag || 'bLocKeeRz',
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      code: 'XK',
      countryName: 'Kosovo',
      rankLevel: 7,
      rankElo: 1407,
      rating: '0.88',
      ratingScore: 0.88,
      team: 'team2',
      partyShape: 'square',
      swing: '-7.35%',
      isPositiveSwing: false,
      k: 1,
      d: 6,
      a: 1,
      adr: '34.3',
      kd: '0.17',
      kr: '0.13',
      hs: 1,
      hsRate: '100.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 0,
      mvps: 0,
      rws: '3.10',
      crosshairCode: 'CSGO-5kL9q-3vT8u-7wZ2F-6uY9W-2zX8K',
      kast: '50.0%',
      acc: '12.0%',
      sAcc: '24.0%',
      shots: 85,
      hits: 10,
      mk: 0,
      mkRate: '0%',
      rp: 12,
      rs: 1,
      entryAttempts: 1,
      entryKills: 0,
      entryDeaths: 1,
      entryDiff: -1,
      entryAttemptsRate: '8%',
      entrySuccessRate: '0%',
      tradeKills: 0,
      deathsTraded: 2,
      tradedEntryKills: 0,
      tradedEntryDeaths: 1,
      clutchWins: 0,
      clutchRoundsLost: 0,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    }
  ];

  // Exact 1:1 FACEIT CT-Side Match Stats (From User Reference Image)
  const ctSideStatsRows: FaceitStatsRow[] = [
    {
      id: 's5',
      name: 'wast3dtalen1',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      code: 'RU',
      countryName: 'Russia',
      rankLevel: 9,
      rankElo: 1833,
      rating: '1.38',
      ratingScore: 1.38,
      isMvp: true,
      team: 'team1',
      partyShape: 'circle',
      swing: '+6.57%',
      isPositiveSwing: true,
      k: 8,
      d: 3,
      a: 1,
      adr: '72.4',
      kd: '2.67',
      kr: '1.00',
      hs: 2,
      hsRate: '25.0%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 0,
      mvps: 1,
      rws: '11.74',
      crosshairCode: 'CSGO-4uY8Z-7xT2W-2kL9q-5vX8u-3wZ7E',
      kast: '75.0%',
      acc: '21.8%',
      sAcc: '39.6%',
      shots: 76,
      hits: 17,
      mk: 1,
      mkRate: '12%',
      rp: 12,
      rs: 4,
      entryAttempts: 3,
      entryKills: 3,
      entryDeaths: 0,
      entryDiff: 3,
      entryAttemptsRate: '25%',
      entrySuccessRate: '100%',
      tradeKills: 3,
      deathsTraded: 1,
      tradedEntryKills: 1,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's4',
      name: 'stonken',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 8,
      rankElo: 1613,
      rating: '1.33',
      ratingScore: 1.33,
      team: 'team1',
      partyShape: 'circle',
      hasPriority: true,
      swing: '+4.69%',
      isPositiveSwing: true,
      k: 5,
      d: 4,
      a: 1,
      adr: '57.5',
      kd: '1.25',
      kr: '0.63',
      hs: 3,
      hsRate: '60.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 1,
      mvps: 1,
      rws: '14.70',
      crosshairCode: 'CSGO-8yX2K-9uZ2W-3kL8q-4vT7u-8xZ9D',
      kast: '87.5%',
      acc: '17.3%',
      sAcc: '27.8%',
      shots: 128,
      hits: 22,
      mk: 1,
      mkRate: '12%',
      rp: 12,
      rs: 3,
      entryAttempts: 2,
      entryKills: 1,
      entryDeaths: 1,
      entryDiff: 0,
      entryAttemptsRate: '17%',
      entrySuccessRate: '50%',
      tradeKills: 1,
      deathsTraded: 2,
      tradedEntryKills: 1,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 0,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's2',
      name: 'zeryx666',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
      code: 'RU',
      countryName: 'Russia',
      rankLevel: 8,
      rankElo: 1599,
      rating: '1.32',
      ratingScore: 1.32,
      team: 'team1',
      partyShape: 'diamond',
      hasPriority: true,
      swing: '+10.77%',
      isPositiveSwing: true,
      k: 8,
      d: 3,
      a: 3,
      adr: '108.5',
      kd: '2.67',
      kr: '1.00',
      hs: 5,
      hsRate: '62.5%',
      k5: 0,
      k4: 0,
      k3: 2,
      k2: 0,
      mvps: 2,
      rws: '23.03',
      crosshairCode: 'CSGO-hQ238-wL2Fq-8oY8u-7zZp2-4vN2B',
      kast: '70.0%',
      acc: '31.0%',
      sAcc: '49.4%',
      shots: 114,
      hits: 35,
      mk: 2,
      mkRate: '25%',
      rp: 12,
      rs: 3,
      entryAttempts: 3,
      entryKills: 1,
      entryDeaths: 2,
      entryDiff: -1,
      entryAttemptsRate: '25%',
      entrySuccessRate: '33%',
      tradeKills: 1,
      deathsTraded: 1,
      tradedEntryKills: 1,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 1,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's1',
      name: 'Rosen33',
      avatar: '/images/avatar_duck_exact.png',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 9,
      rankElo: 1993,
      rating: '1.25',
      ratingScore: 1.25,
      team: 'team1',
      partyShape: 'circle',
      swing: '+3.95%',
      isPositiveSwing: true,
      k: 8,
      d: 4,
      a: 1,
      adr: '118.9',
      kd: '2.00',
      kr: '1.00',
      hs: 3,
      hsRate: '37.5%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 1,
      mvps: 2,
      rws: '23.19',
      crosshairCode: 'CSGO-3k8qX-aB27v-85Yw3-2k9F8-3kK8A',
      kast: '75.0%',
      acc: '18.0%',
      sAcc: '38.9%',
      shots: 139,
      hits: 25,
      mk: 2,
      mkRate: '25%',
      rp: 12,
      rs: 3,
      entryAttempts: 0,
      entryKills: 0,
      entryDeaths: 0,
      entryDiff: 0,
      entryAttemptsRate: '0%',
      entrySuccessRate: '0%',
      tradeKills: 4,
      deathsTraded: 1,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      clutchWins: 1,
      clutchRoundsLost: 0,
      clutchSuccess: '100%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 1
    },
    {
      id: 's7',
      name: 'Zalevvo',
      avatar: '/images/avatar_ghost_exact.png',
      code: 'UA',
      countryName: 'Ukraine',
      rankLevel: 6,
      rankElo: 1234,
      rating: '1.24',
      ratingScore: 1.24,
      team: 'team2',
      partyShape: 'triangle',
      swing: '+1.94%',
      isPositiveSwing: true,
      k: 13,
      d: 8,
      a: 5,
      adr: '137.3',
      kd: '1.63',
      kr: '1.08',
      hs: 8,
      hsRate: '61.5%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 4,
      mvps: 1,
      rws: '11.58',
      crosshairCode: 'CSGO-7yX9K-8uZ3W-5kL2q-6vT9u-9wZ4G',
      kast: '100.0%',
      acc: '21.5%',
      sAcc: '43.2%',
      shots: 200,
      hits: 43,
      mk: 5,
      mkRate: '62%',
      rp: 8,
      rs: 2,
      entryAttempts: 2,
      entryKills: 1,
      entryDeaths: 1,
      entryDiff: 0,
      entryAttemptsRate: '25%',
      entrySuccessRate: '50%',
      tradeKills: 2,
      deathsTraded: 0,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 2,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's6',
      name: 'zimny',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      code: 'FR',
      countryName: 'France',
      rankLevel: 9,
      rankElo: 1817,
      rating: '1.17',
      ratingScore: 1.17,
      team: 'team2',
      partyShape: 'triangle',
      swing: '+3.27%',
      isPositiveSwing: true,
      k: 11,
      d: 6,
      a: 0,
      adr: '87.5',
      kd: '1.83',
      kr: '0.92',
      hs: 6,
      hsRate: '54.5%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 2,
      mvps: 2,
      rws: '11.45',
      crosshairCode: 'CSGO-2zX8K-6uY9W-4kL7q-3vT8u-7wZ2F',
      kast: '100.0%',
      acc: '21.6%',
      sAcc: '47.8%',
      shots: 87,
      hits: 19,
      mk: 2,
      mkRate: '25%',
      rp: 8,
      rs: 3,
      entryAttempts: 2,
      entryKills: 2,
      entryDeaths: 0,
      entryDiff: 2,
      entryAttemptsRate: '25%',
      entrySuccessRate: '100%',
      tradeKills: 1,
      deathsTraded: 0,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      clutchWins: 1,
      clutchRoundsLost: 1,
      clutchSuccess: '50%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 1
    },
    {
      id: 's8',
      name: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      code: 'XK',
      countryName: 'Kosovo',
      rankLevel: 10,
      rankElo: 2156,
      rating: '1.03',
      ratingScore: 1.03,
      team: 'team2',
      partyShape: 'square',
      swing: '-3.82%',
      isPositiveSwing: false,
      k: 12,
      d: 10,
      a: 2,
      adr: '84.4',
      kd: '1.20',
      kr: '1.00',
      hs: 5,
      hsRate: '41.7%',
      k5: 0,
      k4: 1,
      k3: 0,
      k2: 2,
      mvps: 1,
      rws: '12.02',
      crosshairCode: 'CSGO-9zX4K-2uY8W-7kL3q-4vT2u-8wZ6H',
      kast: '62.5%',
      acc: '15.8%',
      sAcc: '30.0%',
      shots: 132,
      hits: 21,
      mk: 3,
      mkRate: '38%',
      rp: 8,
      rs: 2,
      entryAttempts: 4,
      entryKills: 3,
      entryDeaths: 1,
      entryDiff: 2,
      entryAttemptsRate: '50%',
      entrySuccessRate: '75%',
      tradeKills: 4,
      deathsTraded: 0,
      tradedEntryKills: 2,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 0,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's3',
      name: 'mxrty666',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      code: 'SE',
      countryName: 'Sweden',
      rankLevel: 9,
      rankElo: 1968,
      rating: '0.99',
      ratingScore: 0.99,
      team: 'team1',
      partyShape: 'diamond',
      hasPriority: true,
      swing: '-4.76%',
      isPositiveSwing: false,
      k: 6,
      d: 6,
      a: 1,
      adr: '80.9',
      kd: '1.00',
      kr: '0.75',
      hs: 3,
      hsRate: '50.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 2,
      mvps: 0,
      rws: '16.92',
      crosshairCode: 'CSGO-6vW4K-5u8zZ-x7Tq2-78uY2-2vX8C',
      kast: '91.7%',
      acc: '20.9%',
      sAcc: '44.0%',
      shots: 117,
      hits: 25,
      mk: 2,
      mkRate: '25%',
      rp: 12,
      rs: 2,
      entryAttempts: 2,
      entryKills: 1,
      entryDeaths: 1,
      entryDiff: 0,
      entryAttemptsRate: '17%',
      entrySuccessRate: '50%',
      tradeKills: 0,
      deathsTraded: 3,
      tradedEntryKills: 0,
      tradedEntryDeaths: 1,
      clutchWins: 0,
      clutchRoundsLost: 0,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's9',
      name: currentGamerTag || 'bLocKeeRz',
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      code: 'XK',
      countryName: 'Kosovo',
      rankLevel: 7,
      rankElo: 1407,
      rating: '0.90',
      ratingScore: 0.90,
      team: 'team2',
      partyShape: 'square',
      swing: '+0.23%',
      isPositiveSwing: true,
      k: 6,
      d: 7,
      a: 7,
      adr: '67.0',
      kd: '0.86',
      kr: '0.50',
      hs: 3,
      hsRate: '50.0%',
      k5: 0,
      k4: 0,
      k3: 0,
      k2: 2,
      mvps: 1,
      rws: '11.96',
      crosshairCode: 'CSGO-5kL9q-3vT8u-7wZ2F-6uY9W-2zX8K',
      kast: '87.5%',
      acc: '15.6%',
      sAcc: '31.8%',
      shots: 154,
      hits: 23,
      mk: 2,
      mkRate: '25%',
      rp: 6,
      rs: 4,
      entryAttempts: 0,
      entryKills: 0,
      entryDeaths: 0,
      entryDiff: 0,
      entryAttemptsRate: '0%',
      entrySuccessRate: '0%',
      tradeKills: 0,
      deathsTraded: 3,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 0,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    },
    {
      id: 's10',
      name: 'Nascar777',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      code: 'PL',
      countryName: 'Poland',
      rankLevel: 10,
      rankElo: 2028,
      rating: '0.84',
      ratingScore: 0.84,
      team: 'team2',
      partyShape: 'triangle',
      hasPriority: true,
      swing: '-9.15%',
      isPositiveSwing: false,
      k: 7,
      d: 9,
      a: 1,
      adr: '44.9',
      kd: '0.78',
      kr: '0.58',
      hs: 1,
      hsRate: '14.3%',
      k5: 0,
      k4: 0,
      k3: 1,
      k2: 0,
      mvps: 0,
      rws: '2.12',
      crosshairCode: 'CSGO-1wZ7E-4uY8Z-7xT2W-2kL9q-5vX8u',
      kast: '62.5%',
      acc: '13.0%',
      sAcc: '23.1%',
      shots: 90,
      hits: 12,
      mk: 1,
      mkRate: '12%',
      rp: 8,
      rs: 2,
      entryAttempts: 1,
      entryKills: 0,
      entryDeaths: 1,
      entryDiff: -1,
      entryAttemptsRate: '12%',
      entrySuccessRate: '0%',
      tradeKills: 0,
      deathsTraded: 1,
      tradedEntryKills: 0,
      tradedEntryDeaths: 0,
      clutchWins: 0,
      clutchRoundsLost: 0,
      clutchSuccess: '0%',
      c1v5: 0,
      c1v4: 0,
      c1v3: 0,
      c1v2: 0,
      c1v1: 0
    }
  ];

  // Dynamic active stats dataset based on sideFilter ('all' | 't' | 'ct')
  const activeAllStats: FaceitStatsRow[] = sideFilter === 't'
    ? tSideStatsRows
    : sideFilter === 'ct'
    ? ctSideStatsRows
    : [...team1StatsRows, ...team2StatsRows];

  const activePlayersSorted: FaceitStatsRow[] = [...activeAllStats].sort((a, b) => b.ratingScore - a.ratingScore);

  const activeTeam1Rows: FaceitStatsRow[] = activeAllStats.filter(p => p.team === 'team1');
  const activeTeam2Rows: FaceitStatsRow[] = activeAllStats.filter(p => p.team === 'team2');

  // Unified lookup map for player profiles (matches, winRate, recentResults, etc.)
  const allPlayersMap: Record<string, FaceitMatchPlayer> = useMemo(() => {
    const map: Record<string, FaceitMatchPlayer> = {};
    [...team1Players, ...team2Players].forEach(p => {
      map[p.name] = p;
    });
    return map;
  }, [team1Players, team2Players]);

  const handleOpenPlayerFlyout = (e: React.MouseEvent, playerName: string) => {
    e.stopPropagation();
    sound.playClick();
    if (selectedFlyoutPlayer?.name === playerName) {
      setSelectedFlyoutPlayer(null);
      setFlyoutPosition(null);
      return;
    }
    const fullPlayer = allPlayersMap[playerName] || team1Players.find(p => p.name === playerName) || team2Players.find(p => p.name === playerName);
    if (!fullPlayer) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cardHeight = 420;
    const cardWidth = 285;
    const spaceBelow = window.innerHeight - rect.bottom;

    const top = spaceBelow < cardHeight 
      ? Math.max(10, rect.top - cardHeight + 20) 
      : rect.bottom + 4;
    const left = Math.max(10, Math.min(rect.left, window.innerWidth - cardWidth - 10));

    setSelectedFlyoutPlayer(fullPlayer);
    setFlyoutPosition({ top, left });
  };

  const renderStatsTable = (
    rows: FaceitStatsRow[],
    isUnified: boolean = false,
    teamHeader?: {
      score: number;
      name: string;
      avatar: string;
      avgRank: string;
      firstHalf: number;
      secondHalf: number;
      isWinner?: boolean;
    }
  ) => {
    return (
      <div className="rounded-2xl bg-[#14151D] border border-[#232532] overflow-hidden shadow-xl">
        {/* Table Team Header (only shown when not unified) */}
        {!isUnified && teamHeader && (
          <div className="px-5 py-3 bg-[#171822] border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-lg font-display font-black ${teamHeader.isWinner ? 'text-emerald-400' : 'text-slate-400'}`}>
                {teamHeader.score}
              </span>
              <img src={teamHeader.avatar} alt={teamHeader.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="font-display font-black text-white text-sm">{teamHeader.name}</span>
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-4">
              <span>Team avg <strong className="text-white font-bold ml-1.5">{teamHeader.avgRank}</strong></span>
              <span>First half <strong className="text-white font-bold ml-1.5">{teamHeader.firstHalf}</strong></span>
              <span>Second half <strong className="text-white font-bold ml-1.5">{teamHeader.secondHalf}</strong></span>
            </div>
          </div>
        )}

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.04] text-[10px] uppercase text-slate-500 bg-[#12131A]">
                <th className="py-2.5 px-4 font-bold">Player</th>
                <th className="py-2.5 px-3 font-bold">Rank</th>

                {tableFilter === 'general' && (
                  <>
                    <th className="py-2.5 px-3 font-bold">
                      {isUnified ? (
                        <div className="inline-flex items-center gap-1.5 cursor-pointer text-white">
                          <div className="w-3.5 h-3.5 rounded-full border border-[#FF5500] flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                          </div>
                          <span className="font-bold text-white">Rating</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </div>
                      ) : (
                        <span>Rating</span>
                      )}
                    </th>
                    <th className="py-2.5 px-3 font-bold">Swing</th>
                    <th className="py-2.5 px-2 font-bold text-center">K</th>
                    <th className="py-2.5 px-2 font-bold text-center">D</th>
                    <th className="py-2.5 px-2 font-bold text-center">A</th>
                    <th className="py-2.5 px-3 font-bold text-center">ADR</th>
                    <th className="py-2.5 px-3 font-bold text-center">K/D</th>
                    <th className="py-2.5 px-3 font-bold text-center">K/R</th>
                    <th className="py-2.5 px-2 font-bold text-center">HS</th>
                    <th className="py-2.5 px-3 font-bold text-center">HS %</th>
                    <th className="py-2.5 px-2 font-bold text-center">5k</th>
                    <th className="py-2.5 px-2 font-bold text-center">4k</th>
                    <th className="py-2.5 px-2 font-bold text-center">3k</th>
                    <th className="py-2.5 px-2 font-bold text-center">2k</th>
                    <th className="py-2.5 px-3 font-bold text-center">MVPs</th>
                  </>
                )}

                {tableFilter === 'advanced' && (
                  <>
                    <th className="py-2.5 px-3 font-bold">
                      <span className="flex items-center gap-1">
                        RWS <Info className="w-3 h-3 text-slate-500" />
                      </span>
                    </th>
                    <th className="py-2.5 px-3 font-bold text-center">Crosshair Code</th>
                    <th className="py-2.5 px-3 font-bold text-center">KAST</th>
                    <th className="py-2.5 px-3 font-bold text-center">Acc</th>
                    <th className="py-2.5 px-3 font-bold text-center">S. Accuracy</th>
                    <th className="py-2.5 px-3 font-bold text-center">Shots</th>
                    <th className="py-2.5 px-3 font-bold text-center">Hits</th>
                    <th className="py-2.5 px-3 font-bold text-center">MK</th>
                    <th className="py-2.5 px-3 font-bold text-center">MK%</th>
                    <th className="py-2.5 px-3 font-bold text-center">RP</th>
                    <th className="py-2.5 px-3 font-bold text-center">RS</th>
                  </>
                )}

                {tableFilter === 'entry' && (
                  <>
                    <th className="py-2.5 px-3 font-bold">Entry Attempts</th>
                    <th className="py-2.5 px-3 font-bold">Entry Kills</th>
                    <th className="py-2.5 px-3 font-bold">Entry Deaths</th>
                    <th className="py-2.5 px-3 font-bold">Entry Difference</th>
                    <th className="py-2.5 px-3 font-bold">Entry Attempts %</th>
                    <th className="py-2.5 px-3 font-bold">Entry Success %</th>
                  </>
                )}

                {tableFilter === 'trade' && (
                  <>
                    <th className="py-2.5 px-4 font-bold">Trade Kills</th>
                    <th className="py-2.5 px-4 font-bold">Deaths Traded</th>
                    <th className="py-2.5 px-4 font-bold">Traded Entry Kills</th>
                    <th className="py-2.5 px-4 font-bold">Traded Entry Deaths</th>
                  </>
                )}

                {tableFilter === 'clutch' && (
                  <>
                    <th className="py-2.5 px-3 font-bold">Clutch Wins</th>
                    <th className="py-2.5 px-3 font-bold">Clutch Rounds Lost</th>
                    <th className="py-2.5 px-3 font-bold">Clutch Success</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v5 Wins</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v4 Wins</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v3 Wins</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v2 Wins</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v1 Wins</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map(row => {
                const rowBg = isUnified
                  ? row.team === 'team1'
                    ? 'bg-[#121426]/75 hover:bg-[#181a33]'
                    : 'bg-[#0c1714]/75 hover:bg-[#12241f]'
                  : 'hover:bg-white/[0.02]';

                return (
                  <tr key={row.id} className={`${rowBg} transition`}>
                    {/* Player Column - Clickable Profile Flyout (1:1 FACEIT) */}
                    <td className="py-3 px-4">
                      <div 
                        onClick={(e) => handleOpenPlayerFlyout(e, row.name)}
                        className="flex items-center gap-2.5 cursor-pointer group w-fit select-none"
                      >
                        {/* Party shape indicator */}
                        <div className="w-3 flex items-center justify-center shrink-0">
                          {row.partyShape === 'circle' && (
                            <span className={row.team === 'team1' ? 'text-indigo-400 text-xs' : 'text-emerald-400 text-xs'}>●</span>
                          )}
                          {row.partyShape === 'diamond' && (
                            <span className="text-indigo-400 text-xs">◆</span>
                          )}
                          {row.partyShape === 'triangle' && (
                            <span className="text-emerald-400 text-xs">▲</span>
                          )}
                          {row.partyShape === 'square' && (
                            <span className="text-emerald-400 text-xs">■</span>
                          )}
                          {!row.partyShape && (
                            <span className={row.team === 'team1' ? 'w-1.5 h-1.5 rounded-full bg-blue-400' : 'w-1.5 h-1.5 rounded-full bg-emerald-400'} />
                          )}
                        </div>

                        {/* Avatar */}
                        <div className="relative w-7 h-7 shrink-0 transition-transform group-hover:scale-105">
                          <img 
                            src={row.avatar} 
                            alt={row.name} 
                            className={`w-7 h-7 rounded-full object-cover border border-white/10 group-hover:border-white/40 ${row.name === 'M18' ? 'bg-black object-contain' : ''}`} 
                          />
                          {row.hasPriority && (
                            <div className="absolute -top-1 -right-0.5 w-3 h-3 rounded-full bg-[#FF5500] flex items-center justify-center text-[7px] text-black font-black shadow-sm" title="Priority">
                              ★
                            </div>
                          )}
                        </div>

                        <span className="font-display font-bold text-xs text-white group-hover:text-[#FF5500] group-hover:underline transition truncate max-w-[120px]">
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Rank Column */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <FaceitLevelRing level={row.rankLevel} size={22} />
                        <span className="text-white font-mono text-xs font-semibold">
                          {row.rankElo.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* GENERAL */}
                    {tableFilter === 'general' && (
                      <>
                        <td className="py-3 px-3">
                          {row.ratingScore >= 1.30 ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold font-mono text-xs">
                              <span>{row.rating}</span>
                              {row.isMvp && (
                                <Star className="w-3 h-3 text-[#EAB308] fill-current ml-0.5" />
                              )}
                            </div>
                          ) : row.ratingScore >= 0.90 ? (
                            <div className="inline-flex items-center px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold font-mono text-xs border-b-2 border-b-white/40">
                              <span>{row.rating}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold font-mono text-xs">
                              <span>{row.rating}</span>
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 font-bold font-mono text-xs ${row.isPositiveSwing ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {row.swing}
                        </td>
                        <td className="py-3 px-2 text-center text-white font-bold">{row.k}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.d}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.a}</td>
                        <td className="py-3 px-3 text-center text-white">{row.adr}</td>
                        <td className="py-3 px-3 text-center text-white">{row.kd}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.kr}</td>
                        <td className="py-3 px-2 text-center text-slate-300">{row.hs}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.hsRate}</td>
                        <td className="py-3 px-2 text-center text-slate-500">{row.k5}</td>
                        <td className="py-3 px-2 text-center text-slate-500">{row.k4}</td>
                        <td className="py-3 px-2 text-center text-slate-300">{row.k3}</td>
                        <td className="py-3 px-2 text-center text-slate-300">{row.k2}</td>
                        <td className="py-3 px-3 text-center text-[#EAB308] font-bold">{row.mvps}</td>
                      </>
                    )}

                    {/* ADVANCED */}
                    {tableFilter === 'advanced' && (
                      <>
                        <td className="py-3 px-3 text-white font-mono">{row.rws}</td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleCopyCrosshair(row.id, row.crosshairCode)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#20222F] hover:bg-[#282B3B] text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
                          >
                            {copiedCrosshairId === row.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#A3E635]" />
                                <span className="text-[#A3E635]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-400" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.kast}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.acc}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.sAcc}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.shots}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.hits}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.mk}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.mkRate}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.rp}</td>
                        <td className="py-3 px-3 text-center text-slate-300">{row.rs}</td>
                      </>
                    )}

                    {/* ENTRY */}
                    {tableFilter === 'entry' && (
                      <>
                        <td className="py-3 px-3 font-bold text-sky-400">{row.entryAttempts}</td>
                        <td className="py-3 px-3 text-slate-300">{row.entryKills}</td>
                        <td className="py-3 px-3 text-slate-300">{row.entryDeaths}</td>
                        <td className="py-3 px-3 text-slate-300">
                          {row.entryDiff > 0 ? `+${row.entryDiff}` : row.entryDiff}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{row.entryAttemptsRate}</td>
                        <td className="py-3 px-3 text-slate-300">{row.entrySuccessRate}</td>
                      </>
                    )}

                    {/* TRADE */}
                    {tableFilter === 'trade' && (
                      <>
                        <td className="py-3 px-4 font-bold text-sky-400">{row.tradeKills}</td>
                        <td className="py-3 px-4 text-slate-300">{row.deathsTraded}</td>
                        <td className="py-3 px-4 text-slate-300">{row.tradedEntryKills}</td>
                        <td className="py-3 px-4 text-slate-300">{row.tradedEntryDeaths}</td>
                      </>
                    )}

                    {/* CLUTCH */}
                    {tableFilter === 'clutch' && (
                      <>
                        <td className="py-3 px-3 font-bold text-sky-400">{row.clutchWins}</td>
                        <td className="py-3 px-3 text-slate-300">{row.clutchRoundsLost}</td>
                        <td className="py-3 px-3 text-slate-300">{row.clutchSuccess}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.c1v5}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.c1v4}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.c1v3}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.c1v2}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.c1v1}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendTeamMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!teamInput.trim()) return;

    sound.playChatMessage();
    const newMsg: MatchChatMessage = {
      id: `usr-team-${Date.now()}`,
      sender: currentGamerTag || 'bLocKeeRz',
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      team: 'team2',
      code: 'GY',
      text: teamInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    };

    setTeamMessages(prev => [...prev, newMsg]);
    setTeamInput('');

    setTimeout(() => {
      const botReplies = [
        { sender: 'M18', text: 'nice round bLocKeeRz!', avatar: '/images/faceit_m18_badge.png' },
        { sender: 'zimny', text: 'drop me awp next round', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        { sender: 'Nascar777', text: 'queue next match guys?', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' }
      ];
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      setTeamMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: reply.sender,
          avatar: reply.avatar,
          team: 'team2',
          code: 'XK',
          text: reply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
        }
      ]);
    }, 1200);
  };

  const handleSendRoomMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roomInput.trim()) return;

    sound.playChatMessage();
    const newMsg: MatchChatMessage = {
      id: `usr-room-${Date.now()}`,
      sender: currentGamerTag || 'bLocKeeRz',
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      team: 'team2',
      code: 'GY',
      text: roomInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    };

    setRoomMessages(prev => [...prev, newMsg]);
    setRoomInput('');
  };

  const handleSendPhrase = (phrase: string) => {
    setTeamInput(phrase);
    setTimeout(() => {
      handleSendTeamMessage();
    }, 50);
  };

  // 1:1 FACEIT Overview Player Card with separated columns & clickable profile flyout
  const renderOverviewPlayerCard = (player: FaceitMatchPlayer, team: 'team1' | 'team2') => {
    const isCurrentUser = player.name === currentGamerTag;
    const isSelected = selectedFlyoutPlayer?.name === player.name;

    return (
      <div 
        key={player.id}
        onClick={(e) => handleOpenPlayerFlyout(e, player.name)}
        className={`rounded-xl border transition p-3 shadow-md relative group cursor-pointer ${
          isSelected 
            ? 'border-[#FF5500]/70 bg-[#161722]' 
            : 'border-[#222432] bg-[#14151D] hover:border-white/20'
        }`}
      >
        {/* TOP ROW: AVATAR MODULE (LEFT) + PLAYER IDENTITY (RIGHT) */}
        <div className="flex items-start gap-3">
          
          {/* Left: Dedicated Avatar Container with Exact 1:1 FACEIT Anti-Cheat Placement */}
          <div className="relative w-12 h-12 shrink-0">
            {/* Captain Crown if player.isCaptain */}
            {player.isCaptain && <FaceitCaptainCrown />}

            {/* Circular Avatar Photo */}
            <img 
              src={player.avatar} 
              alt={player.name} 
              className={`w-full h-full rounded-full object-cover border border-[#262838] shadow-sm block ${player.name === 'M18' ? 'bg-black object-contain' : ''}`} 
            />

            {/* Target priority badge at top-right */}
            {player.hasPriority && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF5500] flex items-center justify-center text-[8px] text-black font-black shadow-sm" title="Priority">
                ★
              </div>
            )}

            {/* Authentic FACEIT Anti-Cheat Shield Badge (Overlapping photo at bottom-right) */}
            <FaceitAntiCheatShield 
              size={18} 
              className="absolute -bottom-1 -right-1 z-10" 
            />
          </div>

          {/* Right: Country, Name, Verified, Elo, Level Ring */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 truncate">
                <CountryFlag code={player.code} name={player.countryName} size="xs" />
                <span className={`font-display font-bold text-xs truncate ${
                  isCurrentUser ? 'text-[#FF5500]' : 'text-white'
                }`}>
                  {player.name}
                </span>
                {player.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-200 fill-white/[0.08] shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px] font-bold">
                  <Activity className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-200">{player.elo.toLocaleString()}</span>
                </div>
                <FaceitLevelRing level={player.level} size={24} />
              </div>
            </div>

            {/* Subtitle: "Last 30 matches" */}
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">
              Last 30 matches
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: SEPARATED STATS COLUMNS ("le te jen te ndara sikur ne faceit") */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-center font-mono overflow-x-auto scrollbar-none">
          {/* Matches Column (Separated by vertical line on right) */}
          <div className="pr-2.5 text-left shrink-0">
            <div className="text-xs font-bold text-white">{player.matches.toLocaleString()}</div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">Matches</div>
          </div>

          {/* Vertical divider */}
          <div className="h-6 w-px bg-white/10 shrink-0 mr-2" />

          {/* Wins */}
          <div className="px-1 flex-1 min-w-[34px]">
            <div className="text-xs font-bold text-white">{player.winRate}</div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">Wins</div>
          </div>

          {/* Rating (Clean text with subtle underline - No pill/box) */}
          <div className="px-1 flex-1 min-w-[34px]">
            <div className="text-xs font-bold text-white underline decoration-white/25 underline-offset-2">
              {player.rating}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold mt-0.5">Rating</div>
          </div>

          {/* Swing */}
          <div className="px-1 flex-1 min-w-[42px] flex flex-col items-center">
            <div className={`px-1 py-0.5 text-[11px] font-mono font-bold ${
              player.isPositiveSwing 
                ? 'text-[#00E599]' 
                : 'text-[#F87171]'
            }`}>
              {player.swing}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold mt-0.5">Swing</div>
          </div>

          {/* K/D/A */}
          <div className="px-1 flex-1 min-w-[46px]">
            <div className="text-xs font-bold text-slate-200">{player.kda}</div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">K/D/A</div>
          </div>

          {/* K/D */}
          <div className="px-1 flex-1 min-w-[32px]">
            <div className="text-xs font-bold text-slate-200">{player.kd}</div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">K/D</div>
          </div>

          {/* K/R */}
          <div className="px-1 flex-1 min-w-[32px]">
            <div className="text-xs font-bold text-slate-200">{player.kr}</div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">K/R</div>
          </div>

          {/* ADR */}
          <div className="pl-1 flex-1 min-w-[34px]">
            <div className="text-xs font-bold text-white">{player.adr}</div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">ADR</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#0E0F12] text-[#E2E8F0] flex overflow-hidden font-sans select-none animate-in fade-in duration-150">
      
      {/* ======================================================== */}
      {/* LEFT COLUMN: MAIN MATCHROOM (OVERVIEW & STATS)           */}
      {/* ======================================================== */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER: Matchroom • OVERVIEW / STATS • 💬 🔗 ...   */}
      {/* ======================================================== */}
      <div className="w-full bg-[#111217] border-b border-[#1E2029] px-6 py-2.5 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-6">
          <span className="font-display font-black text-white text-base tracking-wide">
            Matchroom
          </span>

          {/* Center Tabs: OVERVIEW & STATS (Clean - No Orange Underline Line) */}
          <div className="flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider">
            <button
              onClick={() => { sound.playClick(); setActiveTab('overview'); }}
              className={`pb-0.5 transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OVERVIEW
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('stats'); }}
              className={`pb-0.5 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'stats'
                  ? 'text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>STATS</span>
              <span className="px-1.5 py-0.2 rounded bg-[#FF5500] text-black text-[9px] font-black uppercase">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* Right Action Icons: 💬 Chat, 🔗 Share, ⋮ 3-Dots Menu, ✕ Close (Clean & Separated - 1:1 FACEIT) */}
        <div className="flex items-center gap-6 text-[#9498A9]">
          
          {/* Chat Toggle Icon */}
          <button
            onClick={() => {
              sound.playClick();
              setIsChatDrawerOpen(!isChatDrawerOpen);
            }}
            className="hover:text-white transition cursor-pointer relative"
            title="Toggle Match Chat"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
          </button>

          {/* Share Link Icon */}
          <button
            onClick={handleCopyLink}
            className="hover:text-white transition cursor-pointer relative"
            title="Share Match Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#A3E635]" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* 3-DOTS MENU (Support Only) */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:text-white transition cursor-pointer flex items-center"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-[#16171F] border border-[#262835] shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setIsMenuOpen(false);
                      setIsSupportModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] text-slate-200 hover:text-white text-xs font-mono transition text-left cursor-pointer"
                  >
                    <Headphones className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Support</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Direct Close X Button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MATCH SCORE & TEAMS BANNER (Authentic FACEIT Header)   */}
      {/* ======================================================== */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-4 pb-2">
        <div className="relative rounded-2xl overflow-hidden border border-[#232530] shadow-2xl bg-[#13141B]">
          
          {/* Authentic CS2 Anubis Panoramic Map Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/maps/de_anubis_2.png" 
              alt="Anubis" 
              className="w-full h-full object-cover opacity-60 filter blur-[0.5px]" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111218]/90 via-[#111218]/65 to-[#111218]/90" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#111218]/40 via-transparent to-[#111218]/85" />
          </div>

          <div className={`relative z-10 px-4 sm:px-5 ${
            activeTab === 'stats' ? 'py-3 sm:py-3.5' : 'py-4 sm:py-5'
          }`}>
            {/* Top Sub-Header: Mode & Match Details */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-bold">Matchmaking / EU / Standard Match</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-bold border border-[#FF5500]/30">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-slate-300 font-bold">Anubis</span>
                <span>•</span>
                <span>10 Nov</span>
                <CountryFlag code="DE" name="Germany" size="xs" />
              </div>
            </div>

            {/* Scoreboard: Team 1 (Rosen33) 13 vs 7 Team 2 (Zalevvo) */}
            <div className={`grid grid-cols-1 md:grid-cols-12 items-center gap-4 ${
              activeTab === 'stats' ? 'py-1 sm:py-2' : 'py-3'
            }`}>
              
              {/* Left Team (Rosen33 - WINNER) */}
              <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-3.5 text-left md:text-right">
                <div className="order-2 md:order-1">
                  <div className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                    WINNER
                  </div>
                  <h2 className="text-xl font-display font-black text-white tracking-wide">
                    team_Rosen33
                  </h2>
                  {activeTab === 'overview' && (
                    <>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center md:justify-end gap-2 mt-0.5">
                        <span>1,776</span>
                        <span>•</span>
                        <span>4,790 Matches</span>
                      </div>
                      {/* Detailed Team Stats Row (Only on Overview) */}
                      <div className="hidden lg:flex items-center justify-end gap-2 text-[10px] font-mono text-slate-400 mt-1">
                        <span>45% <span className="text-slate-500">Wins</span></span>
                        <span>1.10 <span className="text-slate-500">Rating</span></span>
                        <span className="text-red-400">-0.01% <span className="text-slate-500">Swing</span></span>
                        <span>1.00 <span className="text-slate-500">K/D</span></span>
                        <span>0.75 <span className="text-slate-500">K/R</span></span>
                        <span>80.6 <span className="text-slate-500">ADR</span></span>
                      </div>
                    </>
                  )}
                </div>

                <div className="order-1 md:order-2 relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-emerald-500 to-[#A3E635] shadow-[0_0_15px_rgba(52,211,153,0.4)] shrink-0">
                  <img 
                    src="/images/avatar_duck_exact.png" 
                    alt="team_Rosen33" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>
              </div>

              {/* Center Score */}
              <div className="md:col-span-2 text-center py-1">
                <div className="inline-flex items-center justify-center gap-3 px-5 py-2 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
                  <span className="text-3xl font-display font-black text-emerald-400">13</span>
                  <span className="text-xs font-mono uppercase text-slate-500 font-bold">vs</span>
                  <span className="text-3xl font-display font-black text-slate-400">7</span>
                </div>
              </div>

              {/* Right Team (Zalevvo / M18 / bLocKeeRz) */}
              <div className="md:col-span-5 flex items-center justify-start gap-3.5 text-left">
                <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-slate-600 to-slate-400 shrink-0">
                  <img 
                    src="/images/avatar_ghost_exact.png" 
                    alt="team_Zalevvo" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>

                <div>
                  <h2 className="text-xl font-display font-black text-white tracking-wide">
                    team_Zalevvo
                  </h2>
                  {activeTab === 'overview' && (
                    <>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>1,749</span>
                        <span>•</span>
                        <span>5,325 Matches</span>
                      </div>
                      {/* Detailed Team Stats Row (Only on Overview) */}
                      <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                        <span>56% <span className="text-slate-500">Wins</span></span>
                        <span>1.13 <span className="text-slate-500">Rating</span></span>
                        <span className="text-emerald-400">+0.36% <span className="text-slate-500">Swing</span></span>
                        <span>1.03 <span className="text-slate-500">K/D</span></span>
                        <span>0.75 <span className="text-slate-500">K/R</span></span>
                        <span>83.8 <span className="text-slate-500">ADR</span></span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. VIEW 1: OVERVIEW TAB (3 COLUMNS: PLAYERS • MAP • PLAYERS) */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 flex-1 relative">


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT COLUMN (TEAM 1 PLAYERS - 5 CARDS) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-400 px-1">
                Players
              </div>

              <div className="space-y-2">
                {team1Players.map(player => renderOverviewPlayerCard(player, 'team1'))}
              </div>
            </div>

            {/* CENTER COLUMN: Server • Map with ⓘ Veto Tooltip • CTA */}
            <div className="lg:col-span-4 space-y-3">
              {/* Invisible header matching "Players" height for exact horizontal alignment with player cards */}
              <div className="text-xs font-mono font-bold text-transparent select-none px-1 hidden lg:block" aria-hidden="true">
                &nbsp;
              </div>

              <div className="space-y-4">
                {/* Server Card */}
                <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#212330] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Server</div>
                  <div className="flex items-center gap-2.5">
                    <CountryFlag code="DE" name="Germany" size="md" />
                    <span className="font-display font-bold text-white text-sm">Germany</span>
                  </div>
                </div>

              {/* Map Card with ⓘ Veto Popover */}
              <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#212330] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Map</div>

                  {/* THE ⓘ VETO BUTTON */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsVetoTooltipOpen(!isVetoTooltipOpen);
                      }}
                      className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition cursor-pointer px-2 py-0.5 rounded-md hover:bg-white/[0.06]"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>Veto</span>
                    </button>

                    {/* FLOATING VETO TOOLTIP (ONLY ON CLICK) */}
                    {isVetoTooltipOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsVetoTooltipOpen(false)} 
                        />
                        <div 
                          className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-[#101117] border border-[#2B2D3C] shadow-2xl z-50 text-xs font-mono space-y-1 animate-in fade-in zoom-in-95 duration-100"
                        >
                          {vetoHistoryList.map(item => (
                            <div 
                              key={item.step} 
                              className={`py-0.5 ${item.isDecided ? 'text-emerald-400 font-bold mt-1 pt-1 border-t border-white/5' : 'text-slate-300'}`}
                            >
                              <span>{item.step}. {item.text}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Map Thumbnail & Name */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img 
                      src="/images/maps/de_anubis.png" 
                      alt="Anubis" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="font-display font-black text-white text-base leading-tight">
                      Anubis
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Active Duty Active Map
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Watch Demo & Back to Matchmaking */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    sound.playClick();
                    const demoUrl = `https://demos-europe-west.faceit.com/cs2/${matchId}.dem.gz`;
                    const link = document.createElement('a');
                    link.href = demoUrl;
                    link.setAttribute('download', `vortex-match-${matchId}.dem.gz`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full py-3 rounded-lg bg-[#18110E] hover:bg-[#201511] border border-[#FF5500]/20 text-[#FF5500] font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                >
                  <span>WATCH DEMO</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6611] text-white font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/20 flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <span>BACK TO MATCHMAKING</span>
                </button>
              </div>

              </div>

            </div>

            {/* RIGHT COLUMN (TEAM 2 PLAYERS - INCLUDING M18 & bLocKeeRz) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-400 px-1">
                Players
              </div>

              <div className="space-y-2">
                {team2Players.map(player => renderOverviewPlayerCard(player, 'team2'))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. VIEW 2: STATS TAB (EXACT 1:1 FACEIT MATCH STATS)      */}
      {/* ======================================================== */}
      {activeTab === 'stats' && (
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 flex-1 space-y-6">
          
          {/* Sub-Tabs: SUMMARY / DUELS / UTILITY / MATCH INSIGHTS (Clean - No Orange Underline) */}
          <div className="flex items-center gap-6 border-b border-[#20222D] pb-3 text-xs font-mono font-bold uppercase tracking-wider">
            <button
              onClick={() => { sound.playClick(); setStatsSubTab('summary'); }}
              className={`pb-1 transition cursor-pointer ${
                statsSubTab === 'summary' 
                  ? 'text-white font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SUMMARY
            </button>
            <button
              onClick={() => { sound.playClick(); setStatsSubTab('duels'); }}
              className={`pb-1 transition cursor-pointer ${
                statsSubTab === 'duels' 
                  ? 'text-white font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DUELS
            </button>
            <button
              onClick={() => { sound.playClick(); setStatsSubTab('utility'); }}
              className={`pb-1 transition cursor-pointer ${
                statsSubTab === 'utility' 
                  ? 'text-white font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UTILITY
            </button>
            <button
              onClick={() => { sound.playClick(); setStatsSubTab('insights'); }}
              className={`pb-1 transition flex items-center gap-1.5 cursor-pointer ${
                statsSubTab === 'insights' 
                  ? 'text-white font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>MATCH INSIGHTS</span>
              <span className="px-1.5 py-0.2 rounded bg-[#FF5500] text-black text-[9px] font-black uppercase">
                NEW
              </span>
            </button>
          </div>

          {/* MVP CARD & MATCH LEADERS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left 7 Cols: MVP Card */}
            <div className="lg:col-span-7 rounded-2xl bg-[#14151D] border border-[#232532] p-5 shadow-xl relative">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] shrink-0">
                    <img 
                      src="/images/avatar_duck_exact.png" 
                      alt="Rosen33" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-white text-lg">
                        Rosen33
                      </h3>
                      <span className="text-emerald-400 text-xs">✓</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-0.5">
                      <span className="w-4 h-4 rounded bg-[#252836] text-white text-[9px] font-bold flex items-center justify-center">9</span>
                      <span>1,993</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#EAB308] font-display font-black text-sm uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-current" />
                  <span>MVP</span>
                </div>
              </div>

              {/* Rating & 4 Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/5 items-center">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center col-span-2 sm:col-span-1">
                  <div className="text-2xl font-display font-black text-emerald-400">1.68</div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">FACEIT Rating</div>
                </div>
                
                <div className="text-center sm:text-left">
                  <div className="text-base font-mono font-bold text-emerald-400">+9.32%</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Swing</div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="text-base font-mono font-bold text-white">109.6</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">ADR</div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="text-base font-mono font-bold text-white">20/11/3</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">K/D/A</div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="text-base font-mono font-bold text-white">55.0%</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Headshot %</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-slate-500 mt-3">
                <Lock className="w-3 h-3 text-slate-600" />
                <span>Highlight locked</span>
              </div>
            </div>

            {/* Right 5 Cols: 4 Match Leaders */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#232532] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/images/avatar_duck_exact.png" alt="Rosen33" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-display font-bold text-white text-xs">Rosen33</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-white text-base">20</div>
                  <div className="text-[9px] font-mono text-slate-500">Most kills</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#232532] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/images/avatar_ghost_exact.png" alt="Zalevvo" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-display font-bold text-white text-xs">Zalevvo</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-white text-base">2328</div>
                  <div className="text-[9px] font-mono text-slate-500">Most damage</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#232532] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="mxrty666" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-display font-bold text-white text-xs">mxrty666</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-white text-base">85.0%</div>
                  <div className="text-[9px] font-mono text-slate-500">KAST</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#232532] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/images/faceit_m18_badge.png" alt="M18" className="w-8 h-8 rounded-full object-contain bg-black" />
                  <span className="font-display font-bold text-white text-xs">M18</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-white text-base">5</div>
                  <div className="text-[9px] font-mono text-slate-500">First kills</div>
                </div>
              </div>
            </div>

          </div>

          {/* TABLE FILTERS BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono pt-2">
            <div className="flex items-center gap-2">
              {(['general', 'advanced', 'entry', 'trade', 'clutch'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { sound.playClick(); setTableFilter(tab); }}
                  className={`px-3 py-1.5 rounded-md capitalize transition cursor-pointer text-xs font-sans ${
                    tableFilter === tab 
                      ? 'border border-white/30 bg-transparent text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort by team / Sort by players Pill Group */}
              <div className="flex items-center bg-[#13141B] border border-[#232532] rounded-full p-1 text-xs font-mono">
                <button
                  onClick={() => { sound.playClick(); setSortFilter('team'); }}
                  className={`px-3 py-1 rounded-full transition cursor-pointer text-xs font-sans ${
                    sortFilter === 'team' 
                      ? 'bg-[#1C1E2A] text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sort by team
                </button>
                <button
                  onClick={() => { sound.playClick(); setSortFilter('players'); }}
                  className={`px-3 py-1 rounded-full transition cursor-pointer text-xs font-sans ${
                    sortFilter === 'players' 
                      ? 'bg-[#1C1E2A] text-[#FF5500] font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sort by players
                </button>
              </div>

              {/* All / T / CT Pill Group */}
              <div className="flex items-center bg-[#13141B] border border-[#232532] rounded-full p-1 text-[10px] font-mono">
                {(['all', 't', 'ct'] as const).map(side => (
                  <button
                    key={side}
                    onClick={() => { sound.playClick(); setSideFilter(side); }}
                    className={`px-2.5 py-0.5 rounded-full uppercase font-black transition cursor-pointer ${
                      sideFilter === side 
                        ? 'bg-[#FF5500] text-black shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DETAILED STATS TABLES: SORTED BY PLAYERS (UNIFIED 10-PLAYER TABLE) OR SORTED BY TEAM */}
          {sortFilter === 'players' ? (
            renderStatsTable(activePlayersSorted, true)
          ) : (
            <div className="space-y-6">
              {renderStatsTable(activeTeam1Rows, false, {
                score: sideFilter === 't' ? 6 : sideFilter === 'ct' ? 7 : 13,
                name: 'team_Rosen33',
                avatar: '/images/avatar_duck_exact.png',
                avgRank: '(9) 1,801',
                firstHalf: sideFilter === 't' ? 0 : 7,
                secondHalf: sideFilter === 'ct' ? 0 : 6,
                isWinner: sideFilter !== 't'
              })}
              {renderStatsTable(activeTeam2Rows, false, {
                score: sideFilter === 't' ? 5 : sideFilter === 'ct' ? 2 : 7,
                name: 'team_Zalevvo',
                avatar: '/images/avatar_ghost_exact.png',
                avgRank: '(8) 1,728',
                firstHalf: sideFilter === 'ct' ? 0 : 5,
                secondHalf: sideFilter === 't' ? 0 : 2,
                isWinner: false
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. MATCH HIGHLIGHTS VIDEO SECTION (Exact 1:1 FACEIT)     */}
          {/* ======================================================== */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-display font-black text-white tracking-wide">
              Match highlights
            </h2>

            {/* Featured Highlight Video Player */}
            <div className="rounded-2xl bg-[#14151D] border border-[#232532] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
              
              {/* Video Player Display (70%) */}
              <div className="lg:col-span-8 relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" 
                  alt="Anubis Wallbang AWP 3K" 
                  className="w-full h-full object-cover opacity-60" 
                />
                
                {/* CS2 Scope Reticle Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full border border-red-500/40 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500/40" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/40" />
                  </div>
                </div>

                {/* Big Center Play Button */}
                <button
                  onClick={() => {
                    sound.playSelect();
                    setActiveHighlightVideo(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
                  }}
                  className="relative z-10 w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-black ml-1" />
                </button>
              </div>

              {/* Highlight Attribution & Share Details (30%) */}
              <div className="lg:col-span-4 p-6 flex flex-col justify-between space-y-4 bg-[#12131A] border-t lg:border-t-0 lg:border-l border-white/5">
                <div>
                  <div className="text-[10px] font-mono font-black text-[#FF5500] uppercase tracking-widest">
                    PLAY OF THE MATCH
                  </div>
                  <h3 className="text-xl font-display font-black text-white mt-1 leading-snug">
                    {activeHighlightVideo.title}
                  </h3>
                  
                  {/* Player */}
                  <div className="flex items-center gap-2.5 mt-4">
                    <img 
                      src={activeHighlightVideo.avatar} 
                      alt={activeHighlightVideo.player} 
                      className="w-8 h-8 rounded-full object-cover border border-white/10" 
                    />
                    <span className="font-display font-bold text-white text-sm">
                      {activeHighlightVideo.player}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>0 views</span>
                  </span>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Horizontal Clips Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              
              {/* Card 1: Relive the hype with Highlights (Upgrade Card) */}
              <div className="relative rounded-xl overflow-hidden border border-[#232532] p-3 flex flex-col justify-between min-h-[160px] bg-gradient-to-t from-black via-[#14151D] to-[#1E202B]">
                <div className="text-xs font-display font-black text-white leading-tight">
                  Relive the hype with Highlights
                </div>
                <button
                  onClick={() => sound.playClick()}
                  className="w-full py-1.5 rounded-lg bg-[#A3E635] hover:bg-[#bef264] text-slate-950 font-display font-black text-[10px] uppercase tracking-wider transition cursor-pointer shadow-sm mt-3"
                >
                  UPGRADE
                </button>
              </div>

              {/* Card 2: bLocKeeRz (Highlight locked) */}
              <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 p-3 flex flex-col justify-between min-h-[160px] bg-[#0E1711]/60">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Highlight locked
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <img src={currentAvatarUrl || '/images/blockeerz_avatar.png'} alt="bLocKeeRz" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[10px] font-mono font-bold text-white truncate max-w-[70px]">bLocKeeRz</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Card 3: zeryx666 (Anubis MP9 3K) */}
              <div 
                onClick={() => {
                  sound.playClick();
                  setActiveHighlightVideo({
                    title: 'Anubis MP9 3K',
                    player: 'zeryx666',
                    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
                    views: 1,
                    isPlaying: true
                  });
                }}
                className="relative rounded-xl overflow-hidden border border-[#232532] hover:border-white/20 p-3 flex flex-col justify-between min-h-[160px] bg-[#14151D] cursor-pointer group transition"
              >
                <div>
                  <div className="text-[11px] font-display font-bold text-white leading-tight">
                    Anubis MP9 3K
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">1 view</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <img src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80" alt="zeryx666" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[10px] font-mono text-slate-300 truncate max-w-[65px]">zeryx666</span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-white fill-current group-hover:scale-110 transition" />
                </div>
              </div>

              {/* Card 4: mxrty666 (Anubis AK-47 3K) */}
              <div 
                onClick={() => {
                  sound.playClick();
                  setActiveHighlightVideo({
                    title: 'Anubis AK-47 3K',
                    player: 'mxrty666',
                    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
                    views: 1,
                    isPlaying: true
                  });
                }}
                className="relative rounded-xl overflow-hidden border border-[#232532] hover:border-white/20 p-3 flex flex-col justify-between min-h-[160px] bg-[#14151D] cursor-pointer group transition"
              >
                <div>
                  <div className="text-[11px] font-display font-bold text-white leading-tight">
                    Anubis AK-47 3K
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">1 view</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="mxrty666" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[10px] font-mono text-slate-300 truncate max-w-[65px]">mxrty666</span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-white fill-current group-hover:scale-110 transition" />
                </div>
              </div>

              {/* Card 5: stonken (Anubis AK-47 2K) */}
              <div 
                onClick={() => {
                  sound.playClick();
                  setActiveHighlightVideo({
                    title: 'Anubis AK-47 2K',
                    player: 'stonken',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                    views: 1,
                    isPlaying: true
                  });
                }}
                className="relative rounded-xl overflow-hidden border border-[#232532] hover:border-white/20 p-3 flex flex-col justify-between min-h-[160px] bg-[#14151D] cursor-pointer group transition"
              >
                <div>
                  <div className="text-[11px] font-display font-bold text-white leading-tight">
                    Anubis AK-47 2K
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">1 view</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="stonken" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[10px] font-mono text-slate-300 truncate max-w-[65px]">stonken</span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-white fill-current group-hover:scale-110 transition" />
                </div>
              </div>

              {/* Card 6: Rosen33 (Highlight locked) */}
              <div className="relative rounded-xl overflow-hidden border border-[#232532] p-3 flex flex-col justify-between min-h-[160px] bg-[#12131A]">
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                  Highlight locked
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Rosen33" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[65px]">Rosen33</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      </div> {/* END OF LEFT COLUMN: MAIN MATCHROOM */}

      {/* ======================================================== */}
      {/* RIGHT COLUMN: 1:1 FACEIT MATCH CHAT DRAWER (SIDEBAR)     */}
      {/* ======================================================== */}
      {isChatDrawerOpen && (
        <div className="w-[340px] xl:w-[380px] shrink-0 h-full bg-[#07080B] border-l border-[#1F2129] flex flex-col z-30 select-text animate-in slide-in-from-right duration-150 max-md:fixed max-md:inset-y-0 max-md:right-0 max-md:w-full max-md:z-50">
          
          {/* ============================================== */}
          {/* TOP HALF: Room chat (All 10 Matchroom Players) */}
          {/* ============================================== */}
          <div className="flex flex-col flex-1 min-h-[220px] border-b border-[#1A1C24] overflow-hidden">
            
            {/* Room Chat Header */}
            <div className="h-11 px-4 bg-[#07080B] border-b border-[#1A1C24] flex items-center justify-between shrink-0">
              <span className="font-display font-bold text-white text-sm">
                Room chat
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsChatDrawerOpen(false);
                }}
                className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
                title="Collapse chat"
              >
                {/* 1:1 FACEIT Collapse Icon |→ */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4v16" />
                  <path d="M9 12h11" />
                  <path d="m15 7 5 5-5 5" />
                </svg>
              </button>
            </div>

            {/* Room Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start">
              <div className="text-center my-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
                  BEGINNING OF CONVERSATION
                </span>
              </div>

              <div className="space-y-3">
                {roomMessages.map(msg => (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <img 
                      src={msg.avatar} 
                      alt={msg.sender} 
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-white/10" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-white truncate">{msg.sender}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans mt-0.5 break-words">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={roomEndRef} />
              </div>
            </div>

            {/* Room Chat Input Form */}
            <div className="p-3 bg-[#07080B] border-t border-[#14151C] shrink-0">
              <form onSubmit={handleSendRoomMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={roomInput}
                  onChange={e => setRoomInput(e.target.value)}
                  placeholder="Message room"
                  className="w-full h-9 pl-3 pr-16 rounded-md bg-[#111218] border border-[#20222B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition"
                />
                <div className="absolute right-2 flex items-center gap-1.5 text-slate-400">
                  <span className="text-[10px] font-bold select-none cursor-pointer hover:text-white px-0.5">
                    AA
                  </span>
                  <button
                    type="button"
                    onClick={() => setRoomInput(prev => prev + ' 🎯')}
                    className="hover:text-white transition p-0.5 cursor-pointer"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ============================================== */}
          {/* BOTTOM HALF: Team chat (Team Only Chat)         */}
          {/* ============================================== */}
          <div className="flex flex-col flex-1 min-h-[260px] overflow-hidden">
            
            {/* Team Chat Header with Collapsible Toggle */}
            <div 
              onClick={() => setIsTeamChatCollapsed(!isTeamChatCollapsed)}
              className="h-11 px-4 bg-[#07080B] border-b border-[#1A1C24] flex items-center justify-between shrink-0 cursor-pointer hover:bg-white/[0.02] transition"
            >
              <span className="font-display font-bold text-white text-sm">
                Team chat
              </span>
              <button className="p-1 text-slate-400 hover:text-white transition">
                <svg 
                  width="15" 
                  height="15" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transform transition-transform ${isTeamChatCollapsed ? '-rotate-90' : 'rotate-0'}`}
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Team Chat Feed */}
            {!isTeamChatCollapsed && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                  {teamMessages.map((msg, index) => {
                    const prevMsg = teamMessages[index - 1];
                    const isConsecutive = prevMsg && prevMsg.sender === msg.sender;

                    return (
                      <div key={msg.id} className={`flex items-start gap-2.5 ${isConsecutive ? 'mt-0.5' : 'mt-2.5'}`}>
                        {!isConsecutive ? (
                          <img 
                            src={msg.avatar} 
                            alt={msg.sender} 
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-white/10" 
                          />
                        ) : (
                          <div className="w-6 shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                          {!isConsecutive && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-bold text-white truncate">{msg.sender}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                            </div>
                          )}
                          <p className="text-xs text-slate-200 font-sans break-words leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={teamEndRef} />
                </div>

                {/* Quick Tactical Phrases */}
                <div className="px-3 py-1 bg-[#07080B] border-t border-[#121319] flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {QUICK_TACTICAL_PHRASES.slice(0, 3).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendPhrase(p)}
                      className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[9px] font-mono text-slate-400 hover:text-slate-200 whitespace-nowrap cursor-pointer transition"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Team Chat Input Form */}
                <div className="p-3 bg-[#07080B] border-t border-[#14151C] shrink-0">
                  <form onSubmit={handleSendTeamMessage} className="relative flex items-center">
                    <input
                      type="text"
                      value={teamInput}
                      onChange={e => setTeamInput(e.target.value)}
                      placeholder="Message room"
                      className="w-full h-9 pl-3 pr-16 rounded-md bg-[#111218] border border-[#20222B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition"
                    />
                    <div className="absolute right-2 flex items-center gap-1.5 text-slate-400">
                      <span className="text-[10px] font-bold select-none cursor-pointer hover:text-white px-0.5">
                        AA
                      </span>
                      <button
                        type="button"
                        onClick={() => setTeamInput(prev => prev + ' 🎯')}
                        className="hover:text-white transition p-0.5 cursor-pointer"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 5. AUTHENTIC 1:1 FACEIT PLAYER PROFILE FLYOUT             */}
      {/* ======================================================== */}
      {selectedFlyoutPlayer && flyoutPosition && (
        <>
          {/* Backdrop to close on click outside */}
          <div 
            className="fixed inset-0 z-[140] bg-black/30 backdrop-blur-[0.5px]" 
            onClick={() => {
              setSelectedFlyoutPlayer(null);
              setFlyoutPosition(null);
            }} 
          />
          
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ top: `${flyoutPosition.top}px`, left: `${flyoutPosition.left}px` }}
            className="fixed z-[150] w-[285px] rounded-2xl bg-[#14151E] border border-[#262838] shadow-[0_16px_50px_rgba(0,0,0,0.9)] p-4 pt-3.5 select-text animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Top Close Button */}
            <button
              onClick={() => {
                sound.playClick();
                setSelectedFlyoutPlayer(null);
                setFlyoutPosition(null);
              }}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white transition cursor-pointer p-1 rounded-lg hover:bg-white/[0.06]"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Avatar (Clean circular photo matching 1:1 FACEIT) */}
            <div className="w-20 h-20 mx-auto mt-1 shrink-0">
              <img 
                src={selectedFlyoutPlayer.avatar} 
                alt={selectedFlyoutPlayer.name} 
                className="w-full h-full rounded-full object-cover border-2 border-white/10 shadow-xl block" 
              />
            </div>

            {/* Name + Verified Checkmark Badge + Flag */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="font-display font-black text-xl text-white tracking-wide">
                {selectedFlyoutPlayer.name}
              </span>
              {selectedFlyoutPlayer.verified && (
                <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 2.4 3.4-.4 1.4 3.1 3.1 1.4-.4 3.4L24 14.3l-2.1 2.7.4 3.4-3.4.4-1.4 3.1-3.1-1.4-.4 3.4L12 2l-2.4-2.4-3.4.4-1.4-3.1-3.1-1.4.4-3.4L0 9.7l2.1-2.7-.4-3.4 3.4-.4 1.4-3.1 3.1 1.4.4-3.4L12 2zm-1.5 13.5l6-6-1.4-1.4-4.6 4.6-2.1-2.1-1.4 1.4 3.5 3.5z" />
                </svg>
              )}
              <CountryFlag code={selectedFlyoutPlayer.code} name={selectedFlyoutPlayer.countryName} size="sm" />
            </div>

            {/* CS Soldier Silhouette + Level Ring + Elo */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <svg className="w-4 h-4 text-slate-300 fill-current shrink-0" viewBox="0 0 24 24">
                <circle cx="15.5" cy="4.5" r="2" />
                <path d="M7 8.5l3.5 1.5 3-2 1.5.5-2 3.5 2 2-1.5 1.5-3-3-1.5 1v5.5H7.5v-6l2-2.5-2.5-1.5z" />
                <path d="M12 11l6-2 3 .5v1l-3 .5-5 1.5z" />
              </svg>
              <FaceitLevelRing level={selectedFlyoutPlayer.level} size={22} />
              <span className="font-mono font-bold text-white text-sm">
                {selectedFlyoutPlayer.elo.toLocaleString()}
              </span>
            </div>

            {/* Stats Box: MATCHES • WIN RATE • RECENT RESULTS (1:1 with user reference) */}
            <div className="bg-[#0F1017] rounded-xl p-2.5 my-3.5 border border-white/[0.05]">
              <div className="grid grid-cols-3 divide-x divide-white/[0.08] text-center font-mono">
                <div>
                  <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Matches</div>
                  <div className="text-sm font-black text-white mt-0.5">{selectedFlyoutPlayer.matches.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Win Rate</div>
                  <div className="text-sm font-black text-white mt-0.5">{selectedFlyoutPlayer.winRate}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Recent Results</div>
                  <div className="flex items-center justify-center gap-1 font-black text-xs mt-1">
                    {(selectedFlyoutPlayer.recentResults || ['L', 'L', 'L', 'L', 'L']).map((r, i) => (
                      <span key={i} className={r === 'W' ? 'text-emerald-400' : 'text-rose-500'}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action List (Exact 1:1 match with uploaded_media_1794661054728.png) */}
            <div className="space-y-0.5 text-left text-xs font-mono font-semibold pt-0.5">
              <button
                onClick={() => {
                  sound.playSelect();
                  setSelectedFlyoutPlayer(null);
                  setFlyoutPosition(null);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              >
                Go to profile
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedFlyoutPlayer(null);
                  setFlyoutPosition(null);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              >
                Equipped inventory items
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  window.open('https://steamcommunity.com', '_blank');
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              >
                View Steam profile
              </button>
              <button
                onClick={() => {
                  sound.playNotification();
                  setSelectedFlyoutPlayer(null);
                  setFlyoutPosition(null);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              >
                Add friend
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedFlyoutPlayer(null);
                  setFlyoutPosition(null);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              >
                Block
              </button>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 6. LIVE MATCH SUPPORT MODAL (From 3-Dots Menu)           */}
      {/* ======================================================== */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-[#13141C] border border-[#2B2D3C] rounded-2xl p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-[#FF5500]" />
                <h3 className="font-display font-black text-white text-base uppercase">
                  Live Match Support
                </h3>
              </div>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!supportCallSubmitted ? (
              <div className="space-y-4">
                <div className="text-xs font-mono text-slate-300">
                  Select issue to dispatch a live FACEIT match admin:
                </div>
                <div className="space-y-2">
                  {[
                    'Server Unresponsive / Severe Packet Loss (EU-04)',
                    'Player Never Connected / AFK',
                    'VORTEX Anti-Cheat Integrity Issue',
                    'Report Match Problem'
                  ].map((issue, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        sound.playSelect();
                        setSelectedSupportIssue(issue);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                        selectedSupportIssue === issue 
                          ? 'bg-[#FF5500]/15 border-[#FF5500] text-white' 
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {issue}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    sound.playTournamentVictory();
                    setSupportCallSubmitted(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#FF5500] hover:bg-[#FF6611] text-black font-display font-black text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Call Live Admin
                </button>
              </div>
            ) : (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-white font-display font-bold text-sm uppercase">Admin Dispatched!</h4>
                <p className="text-xs font-mono text-slate-400">
                  Live match admin is connecting to server console EU-04.
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsSupportModalOpen(false);
                    setSupportCallSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/[0.08] text-xs font-mono text-white"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
