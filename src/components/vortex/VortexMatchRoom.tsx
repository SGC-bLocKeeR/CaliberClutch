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
  Headphones,
  Send,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Share2,
  Info,
  Download,
  Eye,
  EyeOff,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Flame,
  Award,
  Smile,
  ImageIcon,
  Sparkles,
  Ban,
  Swords,
  Crown,
  Zap,
  TrendingUp
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { BalancedMatch, generateBalancedMatch } from '../../utils/faceitMatchmaking';
import { CountryFlag } from './CountryFlag';
import { realtimeMatchmaking, RealtimeVetoAction, RealtimeSideAction } from '../../services/realtimeMatchmakingService';

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
  hsRate?: string;
  badgeIndex?: number;
  partyShape?: 'circle' | 'diamond' | 'triangle' | 'square';
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
  matchData?: BalancedMatch;
  onMatchFinished?: (won: boolean, deltaElo: number) => void;
  onClose: () => void;
  initialVetoOpen?: boolean;
}

export interface MatchChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  team: 'team1' | 'team2' | 'system' | 'admin';
  isSystem?: boolean;
  isAdmin?: boolean;
  text: string;
  imageUrl?: string;
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

// Caliber Clutch 11 Divisions Tier Mapper (100% Original, Copyright-Free)
export const getCaliberTierByLevel = (level: number) => {
  switch (level) {
    case 11: return { tier: 'TIER 11', name: 'PRO', color: '#EF4444' };
    case 10: return { tier: 'TIER 10', name: 'ELITE', color: '#A855F7' };
    case 9: return { tier: 'TIER 9', name: 'MASTER', color: '#8B5CF6' };
    case 8: return { tier: 'TIER 8', name: 'EXPERT', color: '#F97316' };
    case 7: return { tier: 'TIER 7', name: 'HARD', color: '#FB923C' };
    case 6: return { tier: 'TIER 6', name: 'ADVANCED', color: '#EAB308' };
    case 5: return { tier: 'TIER 5', name: 'SKILLED', color: '#A3E635' };
    case 4: return { tier: 'TIER 4', name: 'MEDIUM', color: '#4ADE80' };
    case 3: return { tier: 'TIER 3', name: 'NORMAL', color: '#34D399' };
    case 2: return { tier: 'TIER 2', name: 'NOVICE', color: '#38BDF8' };
    case 1:
    default:
      return { tier: 'TIER 1', name: 'BEGINNER', color: '#94A3B8' };
  }
};

// Caliber Clutch Tactical Division Tier Badge (Tactical Rectangular/Squircle Pill - No Circular Gauge)
export const CaliberTierBadge: React.FC<{ 
  level: number; 
  size?: 'sm' | 'md' | 'lg' | number;
  showLabel?: boolean;
  className?: string;
}> = ({ level, size = 'md', showLabel = false, className = '' }) => {
  const tierInfo = getCaliberTierByLevel(level);
  const isSm = size === 'sm' || (typeof size === 'number' && size <= 24);
  const isLg = size === 'lg' || (typeof size === 'number' && size >= 32);

  return (
    <div 
      className={`inline-flex items-center gap-1.5 select-none font-mono ${className}`}
      title={`${tierInfo.tier} • ${tierInfo.name}`}
    >
      <div 
        className={`relative flex items-center justify-center font-display font-black rounded-md transition shadow-md border ${
          isSm 
            ? 'h-5 min-w-[24px] px-1.5 text-[10px]' 
            : isLg 
            ? 'h-7 min-w-[32px] px-2 text-xs' 
            : 'h-6 min-w-[28px] px-1.5 text-[11px]'
        }`}
        style={{
          backgroundColor: `${tierInfo.color}18`,
          borderColor: `${tierInfo.color}70`,
          color: tierInfo.color,
          boxShadow: `0 0 10px ${tierInfo.color}25`
        }}
      >
        {level === 11 ? (
          <div className="flex items-center gap-1 text-red-400">
            <Crown className="w-2.5 h-2.5 fill-red-400" />
            <span className="text-[9px] tracking-tight">PRO</span>
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <span className="text-[8px] font-mono opacity-60">T</span>
            <span>{level}</span>
          </div>
        )}
      </div>
      {showLabel && (
        <span 
          className="text-[10px] font-mono font-bold tracking-wider uppercase"
          style={{ color: tierInfo.color }}
        >
          {tierInfo.name}
        </span>
      )}
    </div>
  );
};

// Drop-in alias to protect all callers and ensure 0 circular trademarked SVG rings remain
const FaceitLevelRing = CaliberTierBadge;

// Caliber Clutch Kernel Anti-Cheat Shield Badge (Tactical ShieldCheck in Neon Lime)
const CaliberAnticheatBadge: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({ 
  size = 18, 
  className = '',
  style
}) => {
  return (
    <div 
      className={`group/shield inline-flex items-center justify-center shrink-0 cursor-pointer select-none ${className}`}
      style={style}
      title="Caliber Kernel Anticheat Active"
    >
      <div className="relative flex items-center justify-center p-0.5 rounded-full bg-[#0E1015] border border-[#A3E635]/60 shadow-[0_0_8px_rgba(163,230,53,0.3)]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" />
      </div>
      {/* Tooltip on Hover */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover/shield:flex items-center px-2 py-0.5 rounded bg-[#10121A] border border-[#A3E635]/40 text-[10px] font-mono text-white whitespace-nowrap shadow-2xl z-50 pointer-events-none">
        Caliber Anticheat Active
      </div>
    </div>
  );
};

const FaceitAntiCheatShield = CaliberAnticheatBadge;

// Caliber Clutch Team Captain Badge
const CaliberCaptainBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div 
    className={`absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center justify-center ${className}`}
    title="Team Captain"
  >
    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.4)] text-[9px] font-mono font-black text-amber-300">
      <Crown className="w-2.5 h-2.5 fill-amber-300" />
      <span>CAP</span>
    </div>
  </div>
);

const FaceitCaptainCrown = CaliberCaptainBadge;

// Caliber Clutch Target / Priority Badge
const CaliberPriorityBadge: React.FC<{ size?: number; className?: string }> = ({ size = 15, className = '' }) => (
  <div 
    className={`group/priority relative inline-flex items-center justify-center shrink-0 cursor-pointer ${className}`}
    title="Priority Queue Match"
  >
    <div className="w-4 h-4 rounded-full bg-[#182312] border border-[#A3E635] flex items-center justify-center text-[#A3E635] shadow-[0_0_8px_rgba(163,230,53,0.4)]">
      <Star className="w-2.5 h-2.5 fill-[#A3E635]" />
    </div>
    {/* Tooltip on Hover */}
    <div className="absolute left-full ml-1.5 top-1/2 -translate-y-1/2 hidden group-hover/priority:flex items-center px-2 py-1 rounded bg-[#10121A] border border-[#A3E635]/40 text-[10px] font-mono text-slate-200 whitespace-nowrap shadow-xl z-50 pointer-events-none">
      Priority Queue
    </div>
  </div>
);

const FaceitPriorityStar = CaliberPriorityBadge;

export const CS2_ACTIVE_DUTY_MAPS = [
  { id: 'mirage', name: 'Mirage', image: '/images/maps/cs2_mirage.png', desc: 'Tactical Middle' },
  { id: 'inferno', name: 'Inferno', image: '/images/maps/cs2_inferno.png', desc: 'Banana & Church' },
  { id: 'nuke', name: 'Nuke', image: '/images/maps/cs2_nuke.png', desc: 'Vertical Reactor' },
  { id: 'dust2', name: 'Dust II', image: '/images/maps/cs2_dust2.png', desc: 'Long A & Catwalk' },
  { id: 'ancient', name: 'Ancient', image: '/images/maps/cs2_ancient.png', desc: 'Ruins & Mid' },
  { id: 'anubis', name: 'Anubis', image: '/images/maps/cs2_anubis.png', desc: 'Canals & Temples' },
  { id: 'vertigo', name: 'Vertigo', image: '/images/maps/cs2_vertigo.png', desc: 'High-Rise Construction' },
];

export const getMapImage = (name: string): string => {
  const norm = (name || '').toLowerCase().replace(/[\s_]/g, '');
  if (norm.includes('mirage')) return '/images/maps/cs2_mirage.png';
  if (norm.includes('inferno')) return '/images/maps/cs2_inferno.png';
  if (norm.includes('nuke')) return '/images/maps/cs2_nuke.png';
  if (norm.includes('dust')) return '/images/maps/cs2_dust2.png';
  if (norm.includes('ancient')) return '/images/maps/cs2_ancient.png';
  if (norm.includes('vertigo')) return '/images/maps/cs2_vertigo.png';
  return '/images/maps/cs2_anubis.png';
};

export const VortexMatchRoom: React.FC<VortexMatchRoomProps> = ({
  matchId = 'VTX-89421',
  currentGamerTag = 'M14',
  currentAvatarUrl,
  partyMembers = [],
  matchData,
  onMatchFinished,
  onClose,
  initialVetoOpen = true
}) => {
  // Navigation Tabs: OVERVIEW vs STATS
  const [activeTab, setActiveTab] = useState<'overview' | 'stats'>('overview');

  // Stats Sub-Tabs
  const [statsSubTab, setStatsSubTab] = useState<'summary' | 'duels' | 'utility' | 'insights'>('summary');
  const [tableFilter, setTableFilter] = useState<'general' | 'advanced' | 'entry' | 'trade' | 'clutch'>('general');
  const [sortFilter, setSortFilter] = useState<'team' | 'players'>('team');
  const [sideFilter, setSideFilter] = useState<'all' | 't' | 'ct'>('all');
  const [scoreboardSortCol, setScoreboardSortCol] = useState<'rating' | 'swing' | 'k' | 'kd' | 'kr' | 'adr' | 'hs' | 'mvps'>('rating');
  const [scoreboardSortDir, setScoreboardSortDir] = useState<'desc' | 'asc'>('desc');

  // Veto & Match state
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

  // Live Support Modal
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedSupportIssue, setSelectedSupportIssue] = useState<string>('server_issue');
  const [supportCallSubmitted, setSupportCallSubmitted] = useState<boolean>(false);

  // Right Sidebar Match Chat Toggle (1:1 FACEIT)
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(true);
  const [roomInput, setRoomInput] = useState('');
  const [teamInput, setTeamInput] = useState('');
  const [isTeamChatCollapsed, setIsTeamChatCollapsed] = useState(false);

  const [unifiedChatTab, setUnifiedChatTab] = useState<'all' | 'team'>('all');

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
      avatar: '/images/avatar_ghost_exact.png',
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
      avatar: '/images/avatar_ghost_exact.png',
      team: 'team2',
      code: 'XK',
      text: 'whateveer',
      timestamp: '01:58 am'
    },
    {
      id: 'tm-4',
      sender: 'M18',
      avatar: '/images/avatar_ghost_exact.png',
      team: 'team2',
      code: 'XK',
      text: 'np',
      timestamp: '01:58 am'
    },
    {
      id: 'tm-5',
      sender: currentGamerTag || 'M14',
      avatar: currentAvatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      team: 'team2',
      code: 'GY',
      text: 'no',
      timestamp: '01:58 am'
    }
  ]);

  const teamEndRef = useRef<HTMLDivElement>(null);
  const roomEndRef = useRef<HTMLDivElement>(null);
  const roomFileInputRef = useRef<HTMLInputElement>(null);
  const teamFileInputRef = useRef<HTMLInputElement>(null);

  const handleRoomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;
      const newMsg: MatchChatMessage = {
        id: `usr-room-img-${Date.now()}`,
        sender: currentGamerTag || 'M14',
        avatar: currentAvatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
        team: 'team2',
        code: 'GY',
        text: roomInput.trim(),
        imageUrl: dataUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
      };
      setRoomMessages(prev => [...prev, newMsg]);
      setRoomInput('');
      sound.playChatMessage();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTeamImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;
      const newMsg: MatchChatMessage = {
        id: `usr-team-img-${Date.now()}`,
        sender: currentGamerTag || 'M14',
        avatar: currentAvatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
        team: 'team2',
        code: 'GY',
        text: teamInput.trim(),
        imageUrl: dataUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
      };
      setTeamMessages(prev => [...prev, newMsg]);
      setTeamInput('');
      sound.playChatMessage();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (isChatDrawerOpen) {
      teamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [teamMessages, isChatDrawerOpen]);

  // Fallback or passed balanced match (Fair 50% vs 50% Win Rate, Strict ELO Balancing)
  const activeMatch = useMemo(() => {
    if (matchData) return matchData;
    return generateBalancedMatch({
      partyMembers: (partyMembers || []).map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar || '',
        level: p.level || 1,
        elo: p.elo ?? 0,
        code: p.code || 'XK',
        countryName: p.countryName || 'Kosovo'
      })),
      userGamerTag: currentGamerTag,
      userAvatar: currentAvatarUrl,
      userElo: partyMembers?.find(p => p.name === currentGamerTag)?.elo ?? 0,
      userLevel: partyMembers?.find(p => p.name === currentGamerTag)?.level ?? 1,
      mapName: 'Anubis'
    });
  }, [matchData, partyMembers, currentGamerTag, currentAvatarUrl]);

  const team1Players = activeMatch.team1.players;
  const team2Players = activeMatch.team2.players;
  const team1StatsRows = activeMatch.team1.statsRows;
  const team2StatsRows = activeMatch.team2.statsRows;

  // Match Simulation & Server Connect state
  const [matchSimulatedResult, setMatchSimulatedResult] = useState<{
    score1: number;
    score2: number;
    won: boolean;
  } | null>(null);
  const [copiedServerIp, setCopiedServerIp] = useState<boolean>(false);
  const [isMatchIpRevealed, setIsMatchIpRevealed] = useState<boolean>(false);

  // Dedicated European CS2 Sub-Tick Server Regions
  const SERVER_REGIONS = [
    { id: 'fra', name: 'Germany (Frankfurt Central)', ping: 18, ip: 'srv-fra.caliberclutch.com:27015' },
    { id: 'sto', name: 'Sweden (Stockholm)', ping: 24, ip: 'srv-sto.caliberclutch.com:27015' },
    { id: 'lon', name: 'United Kingdom (London)', ping: 28, ip: 'srv-lon.caliberclutch.com:27015' },
    { id: 'waw', name: 'Poland (Warsaw)', ping: 22, ip: 'srv-waw.caliberclutch.com:27015' }
  ];
  const selectedServerRegion = SERVER_REGIONS[0];

  // Dynamic Interactive Map Veto State
  const [currentSelectedMap, setCurrentSelectedMap] = useState<string>(activeMatch.map || 'Anubis');
  const [selectedStartingSide, setSelectedStartingSide] = useState<'undecided' | 'knife' | 'ct' | 't'>('undecided');
  const [isInteractiveVetoOpen, setIsInteractiveVetoOpen] = useState<boolean>(initialVetoOpen);
  const [bannedMapIds, setBannedMapIds] = useState<string[]>([]);
  const [vetoHistory, setVetoHistory] = useState<Array<{ step: number; text: string; isDecided: boolean; team: string; mapName: string }>>([]);
  const [isOpponentBanning, setIsOpponentBanning] = useState<boolean>(false);

  const remainingMaps = CS2_ACTIVE_DUTY_MAPS.filter(m => !bannedMapIds.includes(m.id));
  const isVetoCompleted = remainingMaps.length === 1;
  const matchIdString = activeMatch.matchId || activeMatch.id || 'CC-89421';

  // Real-time synchronization for Map Veto and Captain Side Choice via Supabase
  useEffect(() => {
    if (!matchIdString) return;

    realtimeMatchmaking.connectToVetoRoom(
      matchIdString,
      (action: RealtimeVetoAction) => {
        setBannedMapIds(prev => {
          if (prev.includes(action.bannedMapId)) return prev;
          const updated = [...prev, action.bannedMapId];
          const remaining = CS2_ACTIVE_DUTY_MAPS.filter(m => !updated.includes(m.id));
          if (remaining.length === 1) {
            setCurrentSelectedMap(remaining[0].name);
            sound.playMapPick();
            confetti({ particleCount: 80, spread: 70 });
          }
          return updated;
        });

        setVetoHistory(prev => {
          if (prev.some(h => h.step === action.step && h.mapName === action.bannedMapName)) return prev;
          sound.playMapBan();
          return [
            ...prev,
            {
              step: action.step,
              text: `${action.team} banned ${action.bannedMapName}`,
              isDecided: false,
              team: action.team,
              mapName: action.bannedMapName
            }
          ];
        });
      },
      (sideAction: RealtimeSideAction) => {
        sound.playClick();
        setSelectedStartingSide(sideAction.side);
      }
    );

    return () => {
      realtimeMatchmaking.disconnectVetoRoom();
    };
  }, [matchIdString]);

  const handleSelectStartingSide = (side: 'ct' | 't' | 'knife') => {
    sound.playClick();
    setSelectedStartingSide(side);
    if (matchIdString) {
      realtimeMatchmaking.broadcastSideSelection({
        matchId: matchIdString,
        side,
        team: activeMatch.team1.name,
        timestamp: Date.now()
      });
    }
  };

  const handleUserBanMap = (mapId: string) => {
    if (bannedMapIds.includes(mapId) || isOpponentBanning || remainingMaps.length <= 1) return;

    sound.playMapBan();
    const bannedMap = CS2_ACTIVE_DUTY_MAPS.find(m => m.id === mapId);
    if (!bannedMap) return;

    const nextBanned = [...bannedMapIds, mapId];
    setBannedMapIds(nextBanned);

    const stepNum = vetoHistory.length + 1;
    const userBanEntry = {
      step: stepNum,
      text: `${activeMatch.team1.name} banned ${bannedMap.name}`,
      isDecided: false,
      team: activeMatch.team1.name,
      mapName: bannedMap.name
    };

    const newHistory = [...vetoHistory, userBanEntry];
    setVetoHistory(newHistory);

    // Broadcast user ban live across Supabase Realtime channel
    if (matchIdString) {
      realtimeMatchmaking.broadcastMapBan({
        matchId: matchIdString,
        step: stepNum,
        bannedMapId: mapId,
        bannedMapName: bannedMap.name,
        team: activeMatch.team1.name,
        timestamp: Date.now()
      });
    }

    const leftAfterUser = CS2_ACTIVE_DUTY_MAPS.filter(m => !nextBanned.includes(m.id));

    if (leftAfterUser.length === 1) {
      const winner = leftAfterUser[0];
      setCurrentSelectedMap(winner.name);
      sound.playMapPick();
      confetti({ particleCount: 80, spread: 70 });
      setVetoHistory([
        ...newHistory,
        {
          step: stepNum + 1,
          text: `${winner.name} picked as final competitive map`,
          isDecided: true,
          team: 'System',
          mapName: winner.name
        }
      ]);
      return;
    }

    // Opponent's turn to ban
    setIsOpponentBanning(true);
    setTimeout(() => {
      const remainingForOpponent = CS2_ACTIVE_DUTY_MAPS.filter(m => !nextBanned.includes(m.id));
      if (remainingForOpponent.length > 1) {
        const randomIndex = Math.floor(Math.random() * remainingForOpponent.length);
        const opponentBanned = remainingForOpponent[randomIndex];
        sound.playMapBan();

        const updatedBanned = [...nextBanned, opponentBanned.id];
        setBannedMapIds(updatedBanned);

        const oppStepNum = newHistory.length + 1;
        const oppEntry = {
          step: oppStepNum,
          text: `${activeMatch.team2.name} banned ${opponentBanned.name}`,
          isDecided: false,
          team: activeMatch.team2.name,
          mapName: opponentBanned.name
        };

        // Broadcast opponent ban live
        if (matchIdString) {
          realtimeMatchmaking.broadcastMapBan({
            matchId: matchIdString,
            step: oppStepNum,
            bannedMapId: opponentBanned.id,
            bannedMapName: opponentBanned.name,
            team: activeMatch.team2.name,
            timestamp: Date.now()
          });
        }

        const leftAfterOpp = CS2_ACTIVE_DUTY_MAPS.filter(m => !updatedBanned.includes(m.id));
        if (leftAfterOpp.length === 1) {
          const finalMap = leftAfterOpp[0];
          setCurrentSelectedMap(finalMap.name);
          sound.playMapPick();
          confetti({ particleCount: 80, spread: 70 });
          setVetoHistory([
            ...newHistory,
            oppEntry,
            {
              step: oppStepNum + 1,
              text: `${finalMap.name} picked as final competitive map`,
              isDecided: true,
              team: 'System',
              mapName: finalMap.name
            }
          ]);
        } else {
          setVetoHistory([...newHistory, oppEntry]);
        }
      }
      setIsOpponentBanning(false);
    }, 700);
  };

  const handleResetVeto = () => {
    sound.playClick();
    setBannedMapIds([]);
    setVetoHistory([]);
    setIsOpponentBanning(false);
  };

  // Dynamic active stats dataset based on sideFilter ('all' | 't' | 'ct')
  const activeAllStats: FaceitStatsRow[] = useMemo(() => {
    const all = [...team1StatsRows, ...team2StatsRows];
    if (sideFilter === 't') {
      return all.map(p => ({
        ...p,
        k: Math.round(p.k * 0.55),
        d: Math.round(p.d * 0.52),
        a: Math.round(p.a * 0.5),
        adr: (parseFloat(p.adr) * 1.05).toFixed(1),
        rating: (parseFloat(p.rating) * 1.02).toFixed(2),
        ratingScore: parseFloat(p.rating) * 1.02
      }));
    }
    if (sideFilter === 'ct') {
      return all.map(p => ({
        ...p,
        k: Math.round(p.k * 0.45),
        d: Math.round(p.d * 0.48),
        a: Math.round(p.a * 0.5),
        adr: (parseFloat(p.adr) * 0.95).toFixed(1),
        rating: (parseFloat(p.rating) * 0.98).toFixed(2),
        ratingScore: parseFloat(p.rating) * 0.98
      }));
    }
    return all;
  }, [team1StatsRows, team2StatsRows, sideFilter]);

  const sortRowsByColumn = (rows: FaceitStatsRow[]): FaceitStatsRow[] => {
    const mult = scoreboardSortDir === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
      let va = 0;
      let vb = 0;
      switch (scoreboardSortCol) {
        case 'rating': va = a.ratingScore; vb = b.ratingScore; break;
        case 'swing': va = parseFloat(a.swing) || 0; vb = parseFloat(b.swing) || 0; break;
        case 'k': va = a.k; vb = b.k; break;
        case 'kd': va = parseFloat(a.kd) || 0; vb = parseFloat(b.kd) || 0; break;
        case 'kr': va = parseFloat(a.kr) || 0; vb = parseFloat(b.kr) || 0; break;
        case 'adr': va = parseFloat(a.adr) || 0; vb = parseFloat(b.adr) || 0; break;
        case 'hs': va = a.hs; vb = b.hs; break;
        case 'mvps': va = a.mvps; vb = b.mvps; break;
      }
      return (va - vb) * mult;
    });
  };

  const activePlayersSorted: FaceitStatsRow[] = useMemo(
    () => sortRowsByColumn(activeAllStats),
    [activeAllStats, scoreboardSortCol, scoreboardSortDir]
  );

  const activeTeam1Rows: FaceitStatsRow[] = useMemo(
    () => sortRowsByColumn(activeAllStats.filter(p => p.team === 'team1')),
    [activeAllStats, scoreboardSortCol, scoreboardSortDir]
  );

  const activeTeam2Rows: FaceitStatsRow[] = useMemo(
    () => sortRowsByColumn(activeAllStats.filter(p => p.team === 'team2')),
    [activeAllStats, scoreboardSortCol, scoreboardSortDir]
  );

  const handleToggleScoreboardSort = (col: 'rating' | 'swing' | 'k' | 'kd' | 'kr' | 'adr' | 'hs' | 'mvps') => {
    sound.playClick();
    if (scoreboardSortCol === col) {
      setScoreboardSortDir(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setScoreboardSortCol(col);
      setScoreboardSortDir('desc');
    }
  };

  // Unified lookup map for player profiles (matches, winRate, recentResults, etc.)
  const allPlayersMap: Record<string, FaceitMatchPlayer> = useMemo(() => {
    const map: Record<string, FaceitMatchPlayer> = {};
    [...team1Players, ...team2Players].forEach(p => {
      map[p.name] = p;
    });
    return map;
  }, [team1Players, team2Players]);

  const handleOpenPlayerFlyout = (e: React.MouseEvent, playerName: string) => {
    if (window.getSelection()?.toString().trim()) return;
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
      <div className="rounded-xl bg-[#0D1017] border border-[#1E2433] overflow-hidden shadow-xl">
        {/* CaliberClutch Squad Scoreboard Header */}
        {!isUnified && teamHeader && (
          <div className={`px-4 py-2.5 bg-[#121621] border-b border-white/[0.07] border-l-4 flex flex-wrap items-center justify-between gap-3 ${
            teamHeader.isWinner ? 'border-l-[#A3E635]' : 'border-l-blue-400'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`px-2.5 py-1 rounded-lg font-display font-black text-base leading-none border ${
                teamHeader.isWinner
                  ? 'bg-[#A3E635]/15 border-[#A3E635]/40 text-[#A3E635]'
                  : 'bg-white/[0.05] border-white/15 text-slate-300'
              }`}>
                {teamHeader.score}
              </div>
              <img
                src={teamHeader.avatar}
                alt={teamHeader.name}
                className="w-7 h-7 rounded-lg object-cover border border-white/15"
              />
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-white text-sm tracking-wide">
                  {teamHeader.name}
                </span>
                <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${
                  teamHeader.isWinner
                    ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                }`}>
                  {teamHeader.isWinner ? 'Winners' : 'Challengers'}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
                Squad Avg: <strong className="text-white font-bold ml-1">{teamHeader.avgRank}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
                CT: <strong className="text-sky-300 font-bold">{teamHeader.firstHalf}</strong>
                <span className="mx-1.5 text-slate-600">•</span>
                T: <strong className="text-amber-300 font-bold">{teamHeader.secondHalf}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] uppercase text-slate-400 bg-[#0A0C12]">
                <th className="py-2.5 px-4 font-bold tracking-wider">Operative</th>
                <th className="py-2.5 px-3 font-bold tracking-wider">Division</th>

                {tableFilter === 'general' && (
                  <>
                    {(
                      [
                        { id: 'rating', label: 'Caliber Rating', align: 'text-left' },
                        { id: 'swing', label: 'Impact', align: 'text-left' },
                        { id: 'k', label: 'K / D / A', align: 'text-center' },
                        { id: 'kd', label: 'K/D', align: 'text-center' },
                        { id: 'kr', label: 'K/R', align: 'text-center' },
                        { id: 'adr', label: 'ADR', align: 'text-center' },
                        { id: 'hs', label: 'HS (HS%)', align: 'text-center' }
                      ] as const
                    ).map(col => {
                      const isActiveSort = scoreboardSortCol === col.id;
                      return (
                        <th key={col.id} className={`py-2.5 px-3 font-bold tracking-wider ${col.align}`}>
                          <button
                            type="button"
                            onClick={() => handleToggleScoreboardSort(col.id)}
                            className={`inline-flex items-center gap-1 cursor-pointer transition hover:text-[#A3E635] ${
                              isActiveSort ? 'text-[#A3E635]' : 'text-slate-400'
                            }`}
                            title={`Sort by ${col.label}`}
                          >
                            <span>{col.label}</span>
                            <ChevronDown
                              className={`w-3 h-3 transition-transform ${
                                isActiveSort
                                  ? scoreboardSortDir === 'asc'
                                    ? 'rotate-180 opacity-100'
                                    : 'opacity-100'
                                  : 'opacity-30'
                              }`}
                            />
                          </button>
                        </th>
                      );
                    })}
                    <th className="py-2.5 px-3 font-bold text-center tracking-wider">Multi-Kills</th>
                    <th className="py-2.5 px-3 font-bold text-center tracking-wider">
                      <button
                        type="button"
                        onClick={() => handleToggleScoreboardSort('mvps')}
                        className={`inline-flex items-center gap-1 cursor-pointer transition hover:text-[#A3E635] ${
                          scoreboardSortCol === 'mvps' ? 'text-[#A3E635]' : 'text-slate-400'
                        }`}
                        title="Sort by MVPs"
                      >
                        <span>MVPs</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${
                            scoreboardSortCol === 'mvps'
                              ? scoreboardSortDir === 'asc'
                                ? 'rotate-180 opacity-100'
                                : 'opacity-100'
                              : 'opacity-30'
                          }`}
                        />
                      </button>
                    </th>
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
                    <th className="py-2.5 px-3 font-bold">Entry Diff</th>
                    <th className="py-2.5 px-3 font-bold">Attempts %</th>
                    <th className="py-2.5 px-3 font-bold">Success %</th>
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
                    <th className="py-2.5 px-3 font-bold">Clutch Lost</th>
                    <th className="py-2.5 px-3 font-bold">Success %</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v5</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v4</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v3</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v2</th>
                    <th className="py-2.5 px-2 font-bold text-center">1v1</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map(row => {
                const rowBg = isUnified
                  ? row.team === 'team1'
                    ? 'border-l-2 border-l-[#A3E635] bg-[#0F1512]/80 hover:bg-[#15201A]'
                    : 'border-l-2 border-l-blue-400 bg-[#0D121D]/80 hover:bg-[#131B2B]'
                  : 'hover:bg-white/[0.025]';

                return (
                  <tr key={row.id} className={`${rowBg} transition`}>
                    {/* Operative Column - Clickable Profile Flyout */}
                    <td className="py-2.5 px-4">
                      <div 
                        onClick={(e) => handleOpenPlayerFlyout(e, row.name)}
                        className="flex items-center gap-2.5 cursor-pointer group w-fit select-text"
                      >
                        <span
                          className={`w-1.5 h-4 rounded-full shrink-0 ${
                            row.team === 'team1' ? 'bg-[#A3E635]' : 'bg-blue-400'
                          }`}
                          title={row.team === 'team1' ? activeMatch.team1.name : activeMatch.team2.name}
                        />

                        {/* Squircle Avatar */}
                        <div className="relative w-7 h-7 shrink-0 transition-transform group-hover:scale-105">
                          <img 
                            src={row.avatar} 
                            alt={row.name} 
                            className={`w-7 h-7 rounded-lg object-cover border border-white/15 group-hover:border-[#A3E635]/60 ${row.name === 'M18' ? 'bg-black object-contain' : ''}`} 
                          />
                          {row.hasPriority && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#182312] border border-[#A3E635] flex items-center justify-center text-[7px] text-[#A3E635] font-black shadow-sm" title="Priority">
                              ★
                            </div>
                          )}
                        </div>

                        <span className="font-display font-bold text-xs text-white group-hover:text-[#A3E635] transition truncate max-w-[140px]">
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Division Column */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <CaliberTierBadge level={row.rankLevel} size="sm" />
                        <span className="text-slate-200 font-mono text-[11px] font-semibold">
                          {row.rankElo.toLocaleString()} MMR
                        </span>
                      </div>
                    </td>

                    {/* GENERAL */}
                    {tableFilter === 'general' && (
                      <>
                        <td className="py-2.5 px-3">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono text-xs font-black ${
                            row.ratingScore >= 1.25
                              ? 'bg-[#A3E635]/15 border-[#A3E635]/40 text-[#A3E635]'
                              : row.ratingScore >= 0.95
                              ? 'bg-white/[0.06] border-white/15 text-white'
                              : 'bg-rose-500/15 border-rose-500/35 text-rose-400'
                          }`}>
                            <span>{row.rating}</span>
                            {row.isMvp && (
                              <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
                            )}
                          </div>
                        </td>
                        <td className={`py-2.5 px-3 font-bold font-mono text-xs ${row.isPositiveSwing ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {row.swing}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="text-white font-bold">{row.k}</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-slate-400">{row.d}</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-slate-300">{row.a}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-white font-bold">{row.kd}</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">{row.kr}</td>
                        <td className="py-2.5 px-3 text-center text-[#A3E635] font-bold">{row.adr}</td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="text-white font-semibold">{row.hs}</span>
                          <span className="text-slate-500 text-[10px] ml-1">({row.hsRate})</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            {row.k5 > 0 && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black">{row.k5}×5K</span>}
                            {row.k4 > 0 && <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-black">{row.k4}×4K</span>}
                            {row.k3 > 0 && <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[10px] font-bold">{row.k3}×3K</span>}
                            {row.k2 > 0 && <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-slate-300 text-[10px]">{row.k2}×2K</span>}
                            {row.k5 === 0 && row.k4 === 0 && row.k3 === 0 && row.k2 === 0 && (
                              <span className="text-slate-600">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded font-bold text-[11px] ${
                            row.mvps > 0 ? 'bg-amber-500/15 text-amber-300 border border-amber-400/30' : 'text-slate-600'
                          }`}>
                            {row.mvps}
                          </span>
                        </td>
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
      sender: currentGamerTag || 'M14',
      avatar: currentAvatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      team: 'team2',
      code: 'GY',
      text: teamInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    };

    setTeamMessages(prev => [...prev, newMsg]);
    setTeamInput('');

    setTimeout(() => {
      const botReplies = [
        { sender: 'M18', text: 'nice round M14!', avatar: '/images/avatar_ghost_exact.png' },
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
      sender: currentGamerTag || 'M14',
      avatar: currentAvatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
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
            ? 'border-[#A3E635]/70 bg-[#161F14]' 
            : 'border-[#222432] bg-[#14151D] hover:border-white/20'
        }`}
      >
        {/* TOP ROW: AVATAR MODULE (LEFT) + PLAYER IDENTITY (RIGHT) */}
        <div className="flex items-start gap-3">
          
          {/* Left: Dedicated Avatar Container with Caliber Anti-Cheat Placement */}
          <div className="relative w-12 h-12 shrink-0">
            {/* Captain Crown if player.isCaptain */}
            {player.isCaptain && <CaliberCaptainBadge />}

            {/* Circular Avatar Photo */}
            <img 
              src={player.avatar} 
              alt={player.name} 
              className={`w-full h-full rounded-full object-cover border border-[#262838] shadow-sm block ${player.name === 'M18' ? 'bg-black object-contain' : ''}`} 
            />

            {/* Target priority badge at top-right */}
            {player.hasPriority && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#182312] border border-[#A3E635] flex items-center justify-center text-[8px] text-[#A3E635] font-black shadow-sm" title="Priority">
                ★
              </div>
            )}

            {/* Caliber Kernel Anti-Cheat Shield Badge */}
            <CaliberAnticheatBadge 
              size={18} 
              className="absolute -bottom-1 -right-1 z-10" 
            />
          </div>

          {/* Right: Country, Name, Verified, MMR, Tactical Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 truncate">
                <CountryFlag code={player.code} name={player.countryName} size="xs" />
                <span className={`font-display font-bold text-xs truncate ${
                  isCurrentUser ? 'text-[#A3E635]' : 'text-white'
                }`}>
                  {player.name}
                </span>
                {player.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-200 fill-white/[0.08] shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px] font-bold">
                  <TrendingUp className="w-3 h-3 text-[#A3E635]" />
                  <span className="text-slate-200">{player.elo.toLocaleString()} MMR</span>
                </div>
                <CaliberTierBadge level={player.level} size="sm" />
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

  // ========================================================
  // CALIBER CLUTCH ORIGINAL TACTICAL VIEW HELPERS & COMPONENTS
  // Uniform-Height Squad / Party Cards (Side Bracket + Inline Badge so Team 1 & Team 2 stay 100% row-aligned)
  // Preserving all 8 stats: Matches, Wins, Rating, K/D/A, K/D, ADR, Tier, MMR
  // ========================================================
  interface PartyGroup {
    type: 'party' | 'solo';
    label: string;
    shortBadge: string;
    badgeColor: string;
    players: FaceitMatchPlayer[];
  }

  const groupPlayersByParty = (players: FaceitMatchPlayer[]): PartyGroup[] => {
    const groups: PartyGroup[] = [];
    const partyMap = new Map<string, FaceitMatchPlayer[]>();
    const soloPlayers: FaceitMatchPlayer[] = [];

    players.forEach((p) => {
      if (p.partyShape) {
        if (!partyMap.has(p.partyShape)) {
          partyMap.set(p.partyShape, []);
        }
        partyMap.get(p.partyShape)!.push(p);
      } else {
        soloPlayers.push(p);
      }
    });

    partyMap.forEach((partyList) => {
      if (partyList.length === 1) {
        soloPlayers.push(partyList[0]);
      } else {
        let label = `${partyList.length}-STACK SQUAD`;
        let shortBadge = `${partyList.length}-STACK`;
        let badgeColor = '#A3E635';

        if (partyList.length === 5) {
          label = '5-STACK SQUAD';
          shortBadge = '5-STACK';
          badgeColor = '#A3E635';
        } else if (partyList.length === 4) {
          label = '4-STACK SQUAD';
          shortBadge = '4-STACK';
          badgeColor = '#A3E635';
        } else if (partyList.length === 3) {
          label = '3-STACK PARTY';
          shortBadge = '3-STACK';
          badgeColor = '#38BDF8';
        } else if (partyList.length === 2) {
          label = 'DUO PARTY';
          shortBadge = 'DUO';
          badgeColor = '#818CF8';
        }

        groups.push({
          type: 'party',
          label,
          shortBadge,
          badgeColor,
          players: partyList,
        });
      }
    });

    soloPlayers.forEach((solo) => {
      groups.push({
        type: 'solo',
        label: 'SOLO QUEUE',
        shortBadge: 'SOLO',
        badgeColor: '#94A3B8',
        players: [solo],
      });
    });

    return groups;
  };

  const renderSquadPlayerItem = (
    player: FaceitMatchPlayer,
    team: 'team1' | 'team2',
    partyMeta?: { label: string; shortBadge: string; badgeColor: string; isFirst: boolean; isLast: boolean }
  ) => {
    const isCurrentUser = player.name === currentGamerTag;
    const isSelected = selectedFlyoutPlayer?.name === player.name;
    const tierInfo = getCaliberTierByLevel(player.level);
    const isStandaloneSolo = !partyMeta;
    const verticalPadClass = partyMeta
      ? `${partyMeta.isFirst ? 'pt-1.5' : 'pt-[9px]'} ${partyMeta.isLast ? 'pb-1.5' : 'pb-[10px]'}`
      : 'py-1.5';

    return (
      <div 
        key={player.id}
        onClick={(e) => handleOpenPlayerFlyout(e, player.name)}
        className={`px-2.5 ${verticalPadClass} transition group cursor-pointer relative ${
          isSelected 
            ? 'bg-[#182615] ring-1 ring-inset ring-[#A3E635]/50' 
            : isCurrentUser
            ? 'bg-[#151B24] hover:bg-[#192230]'
            : 'bg-[#10121A] hover:bg-[#141724]'
        } ${isStandaloneSolo ? 'rounded-xl' : ''}`}
      >
        {/* Top row: Avatar, Info, and Tier • MMR Pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-8 h-8 shrink-0">
              <img 
                src={player.avatar} 
                alt={player.name} 
                className={`w-full h-full rounded-full object-cover border border-[#2B2D3C] shadow-sm block ${player.name === 'M18' ? 'bg-black object-contain' : ''}`} 
              />
              {player.hasPriority && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#182312] border border-[#A3E635] flex items-center justify-center text-[7px] text-[#A3E635] font-black shadow-sm" title="Priority">
                  ★
                </div>
              )}
              <CaliberAnticheatBadge 
                size={13} 
                className="absolute -bottom-0.5 -right-0.5 z-10" 
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <CountryFlag code={player.code} name={player.countryName} size="xs" />
                <span className={`font-display font-black text-xs truncate ${
                  isCurrentUser ? 'text-[#A3E635]' : 'text-white group-hover:text-[#A3E635] transition'
                }`}>
                  {player.name}
                </span>
                {player.verified && (
                  <CheckCircle2 className="w-3 h-3 text-[#A3E635] shrink-0" />
                )}
                {player.isCaptain && (
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-400/50 text-[8px] font-mono font-black text-amber-300 shrink-0"
                    title="Team Captain"
                  >
                    <Crown className="w-2.5 h-2.5 fill-amber-300" />
                    <span>CAP</span>
                  </span>
                )}
                {isStandaloneSolo ? (
                  <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400 shrink-0">
                    SOLO
                  </span>
                ) : partyMeta && (
                  <span
                    className="text-[8px] font-mono font-black uppercase px-1.5 py-0.2 rounded border shrink-0"
                    style={{
                      backgroundColor: `${partyMeta.badgeColor}18`,
                      borderColor: `${partyMeta.badgeColor}55`,
                      color: partyMeta.badgeColor
                    }}
                    title={partyMeta.label}
                  >
                    {partyMeta.shortBadge}
                  </span>
                )}
              </div>
              <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1.5 leading-tight">
                <span className="text-slate-400">Competitive Ranked</span>
                {isCurrentUser && (
                  <span className="text-[#A3E635] font-bold">(YOU)</span>
                )}
              </div>
            </div>
          </div>

          {/* Tier & MMR Pill */}
          <div className="shrink-0 text-right">
            <div 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono font-black text-[10px] shadow-sm select-text"
              style={{
                backgroundColor: `${tierInfo.color}18`,
                borderColor: `${tierInfo.color}50`,
                color: tierInfo.color
              }}
              title={`${tierInfo.tier} • ${tierInfo.name}`}
            >
              <span>{tierInfo.tier}</span>
              <span className="opacity-40">•</span>
              <span className="text-white font-bold">{player.elo.toLocaleString()} MMR</span>
            </div>
          </div>
        </div>

        {/* 6-Column Compact Stats Bar: Matches, Wins, Rating, K/D/A, K/D, ADR (Text-Selectable for Copy/Paste) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="grid grid-cols-6 gap-1 pt-1 mt-1 border-t border-white/[0.06] text-center font-mono select-text cursor-text"
        >
          <div className="bg-black/40 px-1 py-1 rounded-md border border-white/5">
            <div className="text-[8px] uppercase text-slate-400 font-bold tracking-wider leading-none">MATCHES</div>
            <div className="text-[11px] font-bold text-white mt-0.5 leading-tight">{player.matches.toLocaleString()}</div>
          </div>
          <div className="bg-black/40 px-1 py-1 rounded-md border border-white/5">
            <div className="text-[8px] uppercase text-slate-400 font-bold tracking-wider leading-none">WINS</div>
            <div className="text-[11px] font-bold text-emerald-400 mt-0.5 leading-tight">{player.winRate}</div>
          </div>
          <div className="bg-black/40 px-1 py-1 rounded-md border border-white/5">
            <div className="text-[8px] uppercase text-slate-400 font-bold tracking-wider leading-none">RATING</div>
            <div className="text-[11px] font-bold text-white mt-0.5 leading-tight flex items-center justify-center gap-0.5">
              <span>{player.rating}</span>
              <span className={`text-[8px] ${player.isPositiveSwing ? 'text-emerald-400' : 'text-red-400'}`}>
                {player.swing}
              </span>
            </div>
          </div>
          <div className="bg-black/40 px-1 py-1 rounded-md border border-white/5">
            <div className="text-[8px] uppercase text-slate-400 font-bold tracking-wider leading-none">K/D/A</div>
            <div className="text-[11px] font-bold text-slate-200 mt-0.5 leading-tight">{player.kda}</div>
          </div>
          <div className="bg-black/40 px-1 py-1 rounded-md border border-white/5">
            <div className="text-[8px] uppercase text-slate-400 font-bold tracking-wider leading-none">K/D</div>
            <div className="text-[11px] font-bold text-white mt-0.5 leading-tight">{player.kd}</div>
          </div>
          <div className="bg-black/40 px-1 py-1 rounded-md border border-white/5">
            <div className="text-[8px] uppercase text-slate-400 font-bold tracking-wider leading-none">ADR</div>
            <div className="text-[11px] font-bold text-[#A3E635] mt-0.5 leading-tight">{player.adr}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderSquadContainer = (group: PartyGroup, team: 'team1' | 'team2') => {
    if (group.type === 'party') {
      return (
        <div
          key={`party-${group.label}-${team}`}
          className="rounded-xl border bg-[#10121A] overflow-hidden shadow-md transition-all divide-y divide-[#1E2334]"
          style={{ borderColor: `${group.badgeColor}55` }}
          title={group.label}
        >
          {group.players.map((player, idx) =>
            renderSquadPlayerItem(player, team, {
              label: group.label,
              shortBadge: group.shortBadge,
              badgeColor: group.badgeColor,
              isFirst: idx === 0,
              isLast: idx === group.players.length - 1
            })
          )}
        </div>
      );
    }

    // Standalone Solo Card (identical slot height & spacing)
    const soloPlayer = group.players[0];
    return (
      <div 
        key={`solo-${soloPlayer.id}`}
        className="rounded-xl border border-[#222432] bg-[#10121A] overflow-hidden shadow-sm transition-all hover:border-[#32364A]"
      >
        {renderSquadPlayerItem(soloPlayer, team)}
      </div>
    );
  };

  const renderTacticalBottomRail = () => (
    <div className="rounded-xl border border-[#232535] bg-[#10121A] p-2.5 shadow-xl space-y-2">
      {/* Top Row: Direct Match Connect String & Connect Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 px-3 py-2 rounded-lg bg-black/60 border border-white/10">
        <div className="flex items-center gap-2 overflow-hidden w-full md:w-auto flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#A3E635] shrink-0">
            <Radio className="w-3.5 h-3.5 text-[#A3E635] animate-pulse" />
            <span>Direct Connect:</span>
          </div>
          <div className={`text-[11px] font-mono text-[#A3E635] truncate transition-all duration-200 ${
            isMatchIpRevealed ? 'filter-none select-all' : 'blur-sm select-none opacity-60'
          }`}>
            {isMatchIpRevealed
              ? `connect ${selectedServerRegion.ip}; password cc123`
              : `connect srv-•••••.caliberclutch.com:•••••; password •••••`}
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsMatchIpRevealed(!isMatchIpRevealed);
            }}
            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
            title={isMatchIpRevealed ? 'Hide connection code' : 'Reveal connection code'}
          >
            {isMatchIpRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Buttons: Copy IP, Launch CS2, Status */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              navigator.clipboard.writeText(`connect ${selectedServerRegion.ip}; password cc123`);
              setCopiedServerIp(true);
              setTimeout(() => setCopiedServerIp(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copiedServerIp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedServerIp ? 'Copied ✓' : 'Copy IP'}</span>
          </button>

          <a
            href={`steam://connect/${selectedServerRegion.ip}/cc123`}
            onClick={() => sound.playClick()}
            className="px-3 py-1.5 rounded-lg bg-[#A3E635] hover:bg-[#bef264] text-slate-950 font-display font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Launch CS2</span>
          </a>
        </div>
      </div>

      {/* Bottom Row / Grid: Record Match Result, Map Veto Log, GOTV Replay, Back to Matchmaking */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Map Veto Log */}
        <button
          onClick={() => {
            sound.playSelect();
            setIsInteractiveVetoOpen(true);
          }}
          className="py-1.5 px-3 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#2A344A] text-white font-mono font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Ban className="w-3.5 h-3.5 text-amber-400" />
          <span>Map Veto Log ({currentSelectedMap})</span>
        </button>

        {/* Record Result (+25 MMR) */}
        {!matchSimulatedResult ? (
          <button
            onClick={() => {
              sound.playTournamentVictory();
              confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
              const s1 = 13;
              const s2 = 10;
              setMatchSimulatedResult({ score1: s1, score2: s2, won: true });
              if (onMatchFinished) {
                onMatchFinished(true, activeMatch.eloGainWin);
              }
            }}
            className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-[11px] uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Record Result (+{activeMatch.eloGainWin} MMR)</span>
          </button>
        ) : (
          <div className="py-1.5 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-center flex items-center justify-center gap-2">
            <span className="text-[11px] font-black font-display text-white">
              🎉 VICTORY! {matchSimulatedResult.score1} - {matchSimulatedResult.score2}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              (+{activeMatch.eloGainWin} MMR)
            </span>
          </div>
        )}

        {/* Watch GOTV Replay (.dem) */}
        <button
          onClick={() => {
            sound.playClick();
            const demoUrl = `https://demos.caliberclutch.gg/cs2/${matchId}.dem.gz`;
            const link = document.createElement('a');
            link.href = demoUrl;
            link.setAttribute('download', `caliber-match-${matchId}.dem.gz`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="py-1.5 px-3 rounded-lg bg-[#12190E] hover:bg-[#182312] border border-[#A3E635]/30 text-[#A3E635] font-display font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <Eye className="w-3.5 h-3.5 text-[#A3E635]" />
          <span>GOTV Replay (.dem)</span>
        </button>

        {/* Back to Matchmaking */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-display font-black text-[11px] uppercase tracking-wider transition flex items-center justify-center cursor-pointer active:scale-95"
        >
          <span>Back to Matchmaking</span>
        </button>
      </div>
    </div>
  );

  const renderChatSidebar = (side: 'left' | 'right') => (
    <div className={`w-[270px] xl:w-[300px] shrink-0 h-full bg-[#07080B] flex flex-col z-30 select-text animate-in duration-150 max-md:fixed max-md:inset-y-0 max-md:w-full max-md:z-50 ${
      side === 'left' 
        ? 'border-r border-[#1F2129] slide-in-from-left max-md:left-0' 
        : 'border-l border-[#1F2129] slide-in-from-right max-md:right-0'
    }`}>
      {/* ==================================================== */}
      {/* UNIFIED TACTICAL CHAT (MATCH CHAT & TEAM CHAT TABS) */}
      {/* ==================================================== */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Tactical Chat Header with Match Chat / Team Chat Tabs */}
        <div className="h-12 px-3 bg-[#0B0C12] border-b border-[#1E202B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-[#12141D] border border-white/5 rounded-lg">
            <button
              onClick={() => {
                sound.playClick();
                setUnifiedChatTab('all');
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                unifiedChatTab === 'all'
                  ? 'bg-[#A3E635] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Match Chat</span>
              <span className="text-[10px] opacity-75 font-mono">({roomMessages.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setUnifiedChatTab('team');
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                unifiedChatTab === 'team'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Team Chat</span>
              <span className="text-[10px] opacity-75 font-mono">({teamMessages.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsChatDrawerOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            title="Collapse chat"
          >
            {side === 'left' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Unified Full-Height Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start space-y-3">
          <div className="text-center my-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">
              {unifiedChatTab === 'all' ? 'All 10 Matchroom Players Feed' : 'Internal Squad Comms (Team 1 Only)'}
            </span>
          </div>

          {unifiedChatTab === 'all' ? (
            // Match Chat Feed (Room)
            roomMessages.map(msg => (
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
                  {msg.text && (
                    <p className="text-xs text-slate-300 font-sans mt-0.5 break-words">{msg.text}</p>
                  )}
                  {msg.imageUrl && (
                    <div className="mt-1.5 max-w-[220px] rounded-lg overflow-hidden border border-white/10 shadow-md">
                      <img 
                        src={msg.imageUrl} 
                        alt="Attachment" 
                        className="w-full h-auto max-h-[180px] object-cover cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(msg.imageUrl, '_blank')}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Team Chat Feed (Squad)
            teamMessages.map((msg, index) => {
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
                    {msg.text && (
                      <p className="text-xs text-slate-200 font-sans break-words leading-relaxed">
                        {msg.text}
                      </p>
                    )}
                    {msg.imageUrl && (
                      <div className="mt-1.5 max-w-[220px] rounded-lg overflow-hidden border border-white/10 shadow-md">
                        <img 
                          src={msg.imageUrl} 
                          alt="Attachment" 
                          className="w-full h-auto max-h-[180px] object-cover cursor-pointer hover:opacity-90 transition"
                          onClick={() => window.open(msg.imageUrl, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={unifiedChatTab === 'all' ? roomEndRef : teamEndRef} />
        </div>

        {/* Quick Tactical Phrases when in Team tab */}
        {unifiedChatTab === 'team' && (
          <div className="px-3 py-1.5 bg-[#0B0C12] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_TACTICAL_PHRASES.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendPhrase(p)}
                className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-emerald-500/20 hover:text-emerald-300 text-[10px] font-mono text-slate-400 whitespace-nowrap cursor-pointer transition border border-white/5"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Unified Input Bar */}
        <div className="p-3 bg-[#0B0C12] border-t border-[#1C1E27] shrink-0">
          <form 
            onSubmit={unifiedChatTab === 'all' ? handleSendRoomMessage : handleSendTeamMessage} 
            className="relative flex items-center"
          >
            <input
              type="text"
              value={unifiedChatTab === 'all' ? roomInput : teamInput}
              onChange={e => unifiedChatTab === 'all' ? setRoomInput(e.target.value) : setTeamInput(e.target.value)}
              placeholder={unifiedChatTab === 'all' ? "Message all 10 players..." : "Message squad only..."}
              className="w-full h-9 pl-3 pr-20 rounded-md bg-[#13141C] border border-[#222432] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#A3E635] transition"
            />
            <div className="absolute right-2 flex items-center gap-1.5 text-slate-400">
              <input 
                ref={unifiedChatTab === 'all' ? roomFileInputRef : teamFileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={unifiedChatTab === 'all' ? handleRoomImageUpload : handleTeamImageUpload} 
              />
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (unifiedChatTab === 'all') roomFileInputRef.current?.click();
                  else teamFileInputRef.current?.click();
                }}
                className="hover:text-white transition p-0.5 cursor-pointer"
                title="Send image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (unifiedChatTab === 'all') setRoomInput(prev => prev + ' 🎯');
                  else setTeamInput(prev => prev + ' 🛡️');
                }}
                className="hover:text-white transition p-0.5 cursor-pointer"
                title="Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="p-1 rounded bg-[#A3E635] text-slate-950 hover:bg-[#bef264] transition cursor-pointer"
                title="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-[#0E0F12] text-[#E2E8F0] flex overflow-hidden font-sans select-text animate-in fade-in duration-150">
      
      {/* ======================================================== */}
      {/* LEFT COLUMN: TACTICAL MATCH CHAT (CALIBER TACTICAL VIEW)  */}
      {/* ======================================================== */}
      {isChatDrawerOpen && renderChatSidebar('left')}

      {/* ======================================================== */}
      {/* MAIN MATCHROOM (OVERVIEW & STATS)                         */}
      {/* ======================================================== */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto">
      
      {/* ======================================================== */}
      {/* 1. CALIBER CLUTCH ARENA TOP BAR                          */}
      {/* ======================================================== */}
      <div className="w-full bg-[#0B0D12] border-b border-[#1E222E] px-4 py-2 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left: Caliber Lobby Identity + Pill Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center justify-center">
              <Crosshair className="w-3.5 h-3.5 text-[#A3E635]" />
            </div>
            <span className="font-display font-black text-white text-sm tracking-wider uppercase">
              Caliber Lobby
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 border border-white/10 bg-white/[0.03] px-1.5 py-0.5 rounded">
              #{matchId}
            </span>
          </div>

          {/* Segmented Pill Switcher: Squads & Scoreboard */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#131620] border border-white/10 text-[11px] font-mono font-bold shrink-0">
            <button
              onClick={() => { sound.playClick(); setActiveTab('overview'); }}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#A3E635] text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Squads
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('stats'); }}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-[#A3E635] text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Scoreboard
            </button>
          </div>
        </div>

        {/* Right Action Controls: Chat, Copy Link, Support, Exit */}
        <div className="flex items-center gap-2.5 text-[#9498A9] shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setIsChatDrawerOpen(!isChatDrawerOpen);
            }}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:text-white transition cursor-pointer relative"
            title="Toggle Lobby Chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
          </button>

          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:text-white transition cursor-pointer"
            title="Copy Lobby Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#A3E635]" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              setIsSupportModalOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#A3E635]/40 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-[11px] font-mono font-bold"
            title="Match Support"
          >
            <Headphones className="w-3.5 h-3.5 text-[#A3E635]" />
            <span className="hidden sm:inline">Support</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-300 transition cursor-pointer"
            title="Leave Lobby"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CALIBER CLUTCH TACTICAL MATCH HEADER (MAP BACKDROP)   */}
      {/* ======================================================== */}
      <div className="max-w-[1320px] w-full mx-auto px-3 sm:px-5 pt-2 pb-1">
        <div className="relative rounded-xl overflow-hidden border border-[#232736] shadow-xl bg-[#0F1219]">
          
          {/* CS2 Panoramic Map Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={getMapImage(currentSelectedMap)} 
              alt={currentSelectedMap} 
              className="w-full h-full object-cover opacity-80 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14]/70 via-[#0B0D14]/15 to-[#0B0D14]/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D14]/25 via-transparent to-[#0B0D14]/55" />
          </div>

          <div className={`relative z-10 px-3.5 sm:px-4 ${
            activeTab === 'stats' ? 'py-2' : 'py-2.5'
          }`}>
            {/* Top Meta Strip (CaliberClutch Native - Zero FACEIT Breadcrumbs) */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-200 pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#0B0D14]/55 backdrop-blur-[2px] border border-white/15 text-white font-bold uppercase tracking-wider">
                  5v5 Competitive
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0D14]/55 backdrop-blur-[2px] text-[#A3E635] font-bold border border-[#A3E635]/35 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-[#A3E635]" />
                  Caliber AC
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#0B0D14]/60 backdrop-blur-[2px] border border-white/20 text-white font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                  <span>{currentSelectedMap}</span>
                </span>
              </div>
            </div>

            {/* 3-Block Tactical Versus Layout (Compact Floating Cards leaving Map Backdrop Visible) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2">
              
              {/* Left Wing: Team 1 */}
              <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-[#0B0D14]/45 border border-emerald-500/30 backdrop-blur-[2px] md:min-w-[270px]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg p-0.5 bg-gradient-to-br from-[#A3E635] to-emerald-500 shadow-[0_0_12px_rgba(163,230,53,0.25)] shrink-0">
                    <img 
                      src={team1Players[0]?.avatar || '/images/avatar_duck_exact.png'} 
                      alt={activeMatch.team1.name} 
                      className="w-full h-full rounded-[6px] object-cover" 
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-wider">
                      5-Stack Squad
                    </div>
                    <h2 className="text-sm sm:text-base font-display font-black text-white tracking-wide leading-tight truncate">
                      {activeMatch.team1.name}
                    </h2>
                    {activeTab === 'overview' && (
                      <div className="text-[10px] font-mono text-slate-300">
                        <span className="text-emerald-400 font-bold">{activeMatch.team1.avgElo.toLocaleString()} AVG MMR</span>
                        <span className="mx-1">•</span>
                        <span>Tier {activeMatch.team1.avgLevel}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/45 text-xl sm:text-2xl font-display font-black text-emerald-400 leading-none shrink-0">
                  {matchSimulatedResult ? matchSimulatedResult.score1 : '13'}
                </div>
              </div>

              {/* Center Tactical Balance Core */}
              <div className="text-center px-3 py-1.5 rounded-xl bg-[#0B0D14]/50 border border-white/15 backdrop-blur-[2px] space-y-1 md:w-[270px] shrink-0">
                <div className="flex items-center justify-between text-[9px] font-mono font-bold leading-none">
                  <span className="text-[#A3E635]">{activeMatch.winProbabilityTeam1}% WIN</span>
                  <span className="text-slate-200 uppercase tracking-widest text-[8px]">±{activeMatch.eloGainWin} MMR</span>
                  <span className="text-blue-400">{activeMatch.winProbabilityTeam2}% WIN</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800/90 overflow-hidden flex">
                  <div style={{ width: `${activeMatch.winProbabilityTeam1}%` }} className="bg-gradient-to-r from-emerald-500 to-[#A3E635]" />
                  <div style={{ width: `${activeMatch.winProbabilityTeam2}%` }} className="bg-gradient-to-r from-blue-500 to-indigo-500" />
                </div>
                <div className="text-[9px] font-mono text-emerald-400 font-bold tracking-tight leading-none">
                  ✓ Fair MMR Balanced (Δ {activeMatch.eloDiff} MMR)
                </div>
              </div>

              {/* Right Wing: Team 2 */}
              <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-[#0B0D14]/45 border border-blue-500/25 backdrop-blur-[2px] md:min-w-[270px]">
                <div className="px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/20 text-xl sm:text-2xl font-display font-black text-slate-200 leading-none shrink-0">
                  {matchSimulatedResult ? matchSimulatedResult.score2 : '11'}
                </div>
                <div className="flex items-center gap-2.5 min-w-0 text-right">
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-wider">
                      5v5 Challengers
                    </div>
                    <h2 className="text-sm sm:text-base font-display font-black text-white tracking-wide leading-tight truncate">
                      {activeMatch.team2.name}
                    </h2>
                    {activeTab === 'overview' && (
                      <div className="text-[10px] font-mono text-slate-300">
                        <span className="text-blue-400 font-bold">{activeMatch.team2.avgElo.toLocaleString()} AVG MMR</span>
                        <span className="mx-1">•</span>
                        <span>Tier {activeMatch.team2.avgLevel}</span>
                      </div>
                    )}
                  </div>
                  <div className="w-9 h-9 rounded-lg p-0.5 bg-gradient-to-br from-slate-500 to-slate-700 shrink-0">
                    <img 
                      src={team2Players[0]?.avatar || '/images/avatar_ghost_exact.png'} 
                      alt={activeMatch.team2.name} 
                      className="w-full h-full rounded-[6px] object-cover" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. VIEW 1: OVERVIEW TAB                                  */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
          /* ======================================================== */
          /* CALIBER TACTICAL VIEW (COMPACT 100% ZOOM FIT)            */
          /* 2 SQUADS SIDE-BY-SIDE + COMPACT BOTTOM ACTION RAIL       */
          /* ======================================================== */
          <div className="max-w-[1320px] w-full mx-auto px-3 sm:px-5 py-1.5 flex-1 space-y-2">
            {/* Two Teams Side-by-Side Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Team 1 Column */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <div className="text-[11px] font-mono font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Team 1 • {activeMatch.team1.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">{activeMatch.team1.avgElo.toLocaleString()} AVG MMR</span>
                    <span>•</span>
                    <span>Tier {activeMatch.team1.avgLevel}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {groupPlayersByParty(team1Players).map(group => renderSquadContainer(group, 'team1'))}
                </div>
              </div>

              {/* Team 2 Column */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <div className="text-[11px] font-mono font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>Team 2 • {activeMatch.team2.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="text-blue-400 font-bold">{activeMatch.team2.avgElo.toLocaleString()} AVG MMR</span>
                    <span>•</span>
                    <span>Tier {activeMatch.team2.avgLevel}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {groupPlayersByParty(team2Players).map(group => renderSquadContainer(group, 'team2'))}
                </div>
              </div>
            </div>

            {/* Compact Horizontal Action Rail */}
            {renderTacticalBottomRail()}
          </div>
      )}

      {/* ======================================================== */}
      {/* 4. VIEW 2: CALIBER CLUTCH TACTICAL SCOREBOARD            */}
      {/* ======================================================== */}
      {activeTab === 'stats' && (() => {
        const mvp = activePlayersSorted[0];
        const topKills = [...activeAllStats].sort((a, b) => b.k - a.k)[0];
        const topAdr = [...activeAllStats].sort((a, b) => parseFloat(b.adr) - parseFloat(a.adr))[0];
        const topKast = [...activeAllStats].sort((a, b) => parseFloat(b.kast) - parseFloat(a.kast))[0];
        const topEntry = [...activeAllStats].sort((a, b) => b.entryKills - a.entryKills)[0];

        const t1Kills = activeTeam1Rows.reduce((s, r) => s + r.k, 0);
        const t2Kills = activeTeam2Rows.reduce((s, r) => s + r.k, 0);
        const t1Adr = activeTeam1Rows.length ? (activeTeam1Rows.reduce((s, r) => s + parseFloat(r.adr), 0) / activeTeam1Rows.length).toFixed(1) : '0.0';
        const t2Adr = activeTeam2Rows.length ? (activeTeam2Rows.reduce((s, r) => s + parseFloat(r.adr), 0) / activeTeam2Rows.length).toFixed(1) : '0.0';
        const t1Entry = activeTeam1Rows.reduce((s, r) => s + r.entryKills, 0);
        const t2Entry = activeTeam2Rows.reduce((s, r) => s + r.entryKills, 0);
        const t1Clutch = activeTeam1Rows.reduce((s, r) => s + r.clutchWins, 0);
        const t2Clutch = activeTeam2Rows.reduce((s, r) => s + r.clutchWins, 0);

        const renderTeamH2H = () => (
          <div className="rounded-xl bg-[#0D1017] border border-[#1E2433] p-4 shadow-xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-display font-black text-white uppercase tracking-wider">
                Squad Head-to-Head
              </span>
              <span className="text-[10px] font-mono text-[#A3E635] font-bold">
                {activeMatch.team1.name} vs {activeMatch.team2.name}
              </span>
            </div>
            {[
              { label: 'Total Kills', v1: t1Kills, v2: t2Kills },
              { label: 'Avg Squad ADR', v1: parseFloat(t1Adr), v2: parseFloat(t2Adr) },
              { label: 'Opening Kills', v1: t1Entry, v2: t2Entry },
              { label: 'Clutches Won', v1: t1Clutch, v2: t2Clutch }
            ].map(metric => {
              const total = metric.v1 + metric.v2 || 1;
              const pct1 = Math.round((metric.v1 / total) * 100);
              return (
                <div key={metric.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#A3E635] font-black">{metric.v1}</span>
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">{metric.label}</span>
                    <span className="text-blue-400 font-black">{metric.v2}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${pct1}%` }} className="bg-gradient-to-r from-emerald-500 to-[#A3E635]" />
                    <div style={{ width: `${100 - pct1}%` }} className="bg-gradient-to-r from-blue-500 to-indigo-500" />
                  </div>
                </div>
              );
            })}
          </div>
        );

        const renderMvpCard = () => (
          <div className="rounded-xl bg-gradient-to-br from-[#12171A] via-[#0E1218] to-[#0B0E14] border border-[#A3E635]/30 p-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.25)] shrink-0">
                  <img 
                    src={mvp?.avatar || '/images/avatar_duck_exact.png'} 
                    alt={mvp?.name || 'MVP'} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-white text-base sm:text-lg">
                      {mvp?.name || currentGamerTag}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E635]" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                    <CaliberTierBadge level={mvp?.rankLevel || 1} size="sm" />
                    <span className="text-slate-300 font-bold">{(mvp?.rankElo || 0).toLocaleString()} MMR</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono font-black text-xs uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 fill-amber-300" />
                <span>Match MVP</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 border-t border-white/[0.06] items-center">
              <div className="p-2.5 rounded-lg bg-[#A3E635]/10 border border-[#A3E635]/35 text-center col-span-2 sm:col-span-1">
                <div className="text-xl font-display font-black text-[#A3E635]">{mvp?.rating || '1.45'}</div>
                <div className="text-[9px] font-mono text-slate-300 uppercase">Caliber Rating</div>
              </div>
              
              <div className="p-2 rounded-lg bg-black/35 border border-white/5 text-center">
                <div className={`text-sm font-mono font-bold ${mvp?.isPositiveSwing ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {mvp?.swing || '+4.2%'}
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase">Impact</div>
              </div>

              <div className="p-2 rounded-lg bg-black/35 border border-white/5 text-center">
                <div className="text-sm font-mono font-bold text-white">{mvp?.adr || '95.0'}</div>
                <div className="text-[9px] font-mono text-slate-500 uppercase">ADR</div>
              </div>

              <div className="p-2 rounded-lg bg-black/35 border border-white/5 text-center">
                <div className="text-sm font-mono font-bold text-white">
                  {mvp ? `${mvp.k}/${mvp.d}/${mvp.a}` : '20/11/4'}
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase">K / D / A</div>
              </div>

              <div className="p-2 rounded-lg bg-black/35 border border-white/5 text-center">
                <div className="text-sm font-mono font-bold text-white">{mvp?.hsRate || '52.0%'}</div>
                <div className="text-[9px] font-mono text-slate-500 uppercase">HS %</div>
              </div>
            </div>
          </div>
        );

        const renderLeadersStrip = (columnsClass: string) => (
          <div className={columnsClass}>
            {[
              { player: topKills, val: topKills?.k, label: 'Top Fragger', color: 'text-[#A3E635]' },
              { player: topAdr, val: topAdr?.adr, label: 'Damage Leader', color: 'text-white' },
              { player: topKast, val: topKast?.kast, label: 'KAST %', color: 'text-emerald-400' },
              { player: topEntry, val: topEntry?.entryKills, label: 'Opening Kills', color: 'text-sky-400' }
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-[#0D1017] border border-[#1E2433] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={item.player?.avatar || '/images/avatar_duck_exact.png'} alt={item.player?.name} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10" />
                  <span className="font-display font-bold text-white text-xs truncate">{item.player?.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-mono font-black text-base leading-none ${item.color}`}>{item.val}</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        );

        const renderFiltersAndTables = () => (
          <div className="space-y-3">
            {/* TABLE FILTERS BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0D1017] border border-[#1E2433]">
                {([
                  { id: 'general', label: 'Overview' },
                  { id: 'advanced', label: 'Precision' },
                  { id: 'entry', label: 'Opening' },
                  { id: 'trade', label: 'Trades' },
                  { id: 'clutch', label: 'Clutches' }
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { sound.playClick(); setTableFilter(tab.id); }}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer text-[11px] font-mono font-bold ${
                      tableFilter === tab.id 
                        ? 'bg-[#A3E635] text-slate-950 font-black shadow-sm' 
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex items-center bg-[#0D1017] border border-[#1E2433] rounded-xl p-1 text-[11px] font-mono">
                  <button
                    onClick={() => { sound.playClick(); setSortFilter('team'); }}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                      sortFilter === 'team' 
                        ? 'bg-white/10 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    By Squad
                  </button>
                  <button
                    onClick={() => { sound.playClick(); setSortFilter('players'); }}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                      sortFilter === 'players' 
                        ? 'bg-white/10 text-[#A3E635] shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Combined Top 10
                  </button>
                </div>

                <div className="flex items-center bg-[#0D1017] border border-[#1E2433] rounded-xl p-1 text-[10px] font-mono">
                  {(['all', 't', 'ct'] as const).map(side => (
                    <button
                      key={side}
                      onClick={() => { sound.playClick(); setSideFilter(side); }}
                      className={`px-2.5 py-1 rounded-lg uppercase font-black transition cursor-pointer ${
                        sideFilter === side 
                          ? 'bg-[#A3E635] text-slate-950 shadow-sm' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {side === 'all' ? 'ALL' : `${side.toUpperCase()} SIDE`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {sortFilter === 'players' ? (
              renderStatsTable(activePlayersSorted, true)
            ) : (
              <div className="space-y-4">
                {renderStatsTable(activeTeam1Rows, false, {
                  score: sideFilter === 't' ? 6 : sideFilter === 'ct' ? 7 : (matchSimulatedResult?.score1 || 13),
                  name: activeMatch.team1.name,
                  avatar: team1Players[0]?.avatar || '/images/avatar_duck_exact.png',
                  avgRank: `Tier ${activeMatch.team1.avgLevel} • ${activeMatch.team1.avgElo.toLocaleString()} MMR`,
                  firstHalf: sideFilter === 't' ? 0 : 7,
                  secondHalf: sideFilter === 'ct' ? 0 : 6,
                  isWinner: sideFilter !== 't'
                })}
                {renderStatsTable(activeTeam2Rows, false, {
                  score: sideFilter === 't' ? 5 : sideFilter === 'ct' ? 6 : (matchSimulatedResult?.score2 || 11),
                  name: activeMatch.team2.name,
                  avatar: team2Players[0]?.avatar || '/images/avatar_ghost_exact.png',
                  avgRank: `Tier ${activeMatch.team2.avgLevel} • ${activeMatch.team2.avgElo.toLocaleString()} MMR`,
                  firstHalf: sideFilter === 'ct' ? 0 : 6,
                  secondHalf: sideFilter === 't' ? 0 : 5,
                  isWinner: false
                })}
              </div>
            )}
          </div>
        );

        const renderCaliberHighlights = () => {
          const demoUrl = `https://demos.caliberclutch.gg/cs2/${matchId}.dem.gz`;
          const clipCandidates = [
            { title: `${currentSelectedMap} AWP Wallbang 3K`, round: 'R14', player: mvp },
            { title: `${currentSelectedMap} Site Anchor 4K`, round: 'R19', player: topKills },
            { title: `${currentSelectedMap} 1v2 Post-Plant Clutch`, round: 'R22', player: topEntry },
            { title: `${currentSelectedMap} Eco Deagle 3K`, round: 'R07', player: topAdr }
          ];

          return (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#A3E635]" />
                  <h2 className="text-base sm:text-lg font-display font-black text-white tracking-wide uppercase">
                    Caliber Top Plays & Demo Clips
                  </h2>
                </div>
                <a
                  href={demoUrl}
                  download={`caliber-match-${matchId}.dem.gz`}
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A3E635]/15 hover:bg-[#A3E635]/25 border border-[#A3E635]/40 text-[#A3E635] text-[11px] font-mono font-bold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download GOTV Demo (.dem)</span>
                </a>
              </div>

              <div className="rounded-xl bg-[#0D1017] border border-[#1E2433] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl">
                <div className="lg:col-span-7 relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img 
                    src={getMapImage(currentSelectedMap)} 
                    alt={activeHighlightVideo.title} 
                    className="w-full h-full object-cover opacity-70" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setActiveHighlightVideo(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
                    }}
                    className="relative z-10 w-14 h-14 rounded-xl bg-[#A3E635] hover:bg-[#bef264] text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  </button>
                  <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-[11px] font-mono text-white font-bold">
                    {activeHighlightVideo.title} • {activeHighlightVideo.player}
                  </div>
                </div>

                <div className="lg:col-span-5 p-4 flex flex-col justify-between gap-2 bg-[#0B0E14] border-t lg:border-t-0 lg:border-l border-white/[0.06]">
                  <div className="text-[10px] font-mono font-black text-[#A3E635] uppercase tracking-widest">
                    Round Timeline Clips
                  </div>
                  <div className="space-y-2 flex-1">
                    {clipCandidates.map(clip => (
                      <button
                        key={clip.round}
                        onClick={() => {
                          sound.playClick();
                          setActiveHighlightVideo({
                            title: clip.title,
                            player: clip.player?.name || currentGamerTag,
                            avatar: clip.player?.avatar || '/images/avatar_duck_exact.png',
                            views: 1,
                            isPlaying: true
                          });
                        }}
                        className="w-full p-2.5 rounded-lg bg-[#121621] hover:bg-[#171D2B] border border-white/10 hover:border-[#A3E635]/40 flex items-center justify-between gap-2 transition cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-[#A3E635]/15 border border-[#A3E635]/35 text-[#A3E635] font-mono text-[10px] font-black shrink-0">
                            {clip.round}
                          </span>
                          <img src={clip.player?.avatar || '/images/avatar_duck_exact.png'} alt={clip.player?.name} className="w-6 h-6 rounded-md object-cover shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-display font-bold text-white truncate">{clip.title}</div>
                            <div className="text-[10px] font-mono text-slate-400 truncate">{clip.player?.name}</div>
                          </div>
                        </div>
                        <Play className="w-3.5 h-3.5 text-[#A3E635] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        };

        const renderCombatDuels = () => {
          const getDuelRecord = (p1: FaceitStatsRow, p2: FaceitStatsRow, idx1: number, idx2: number) => {
            const seed = ((idx1 * 7 + idx2 * 13 + Math.round(p1.ratingScore * 10) + Math.round(p2.ratingScore * 10)) % 5);
            const diff = p1.ratingScore - p2.ratingScore;
            const w1 = Math.max(0, Math.min(5, Math.round(2 + diff * 2.5 + (seed % 2))));
            const w2 = Math.max(0, Math.min(5, Math.round(2 - diff * 2.2 + ((seed + 1) % 2))));
            return { w1, w2 };
          };

          const t1Trades = activeTeam1Rows.reduce((s, r) => s + r.tradeKills, 0);
          const t2Trades = activeTeam2Rows.reduce((s, r) => s + r.tradeKills, 0);
          const t1Mk = activeTeam1Rows.reduce((s, r) => s + r.mk, 0);
          const t2Mk = activeTeam2Rows.reduce((s, r) => s + r.mk, 0);

          return (
            <div className="space-y-4">
              {/* Top Duel KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-2">
                  <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Opening Duels (First Bloods)</div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-lg font-black text-[#A3E635]">{t1Entry}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{activeMatch.team1.name} vs {activeMatch.team2.name}</span>
                    <span className="text-lg font-black text-blue-400">{t2Entry}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${Math.round((t1Entry / Math.max(1, t1Entry + t2Entry)) * 100)}%` }} className="bg-[#A3E635]" />
                    <div className="flex-1 bg-blue-500" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-2">
                  <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Trade Kills Secured</div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-lg font-black text-[#A3E635]">{t1Trades}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Refrag Efficiency</span>
                    <span className="text-lg font-black text-blue-400">{t2Trades}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${Math.round((t1Trades / Math.max(1, t1Trades + t2Trades)) * 100)}%` }} className="bg-[#A3E635]" />
                    <div className="flex-1 bg-blue-500" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-2">
                  <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Multi-Kill Rounds (2K–5K)</div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-lg font-black text-[#A3E635]">{t1Mk}</span>
                    <span className="text-[10px] text-slate-500 uppercase">High-Impact Rounds</span>
                    <span className="text-lg font-black text-blue-400">{t2Mk}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${Math.round((t1Mk / Math.max(1, t1Mk + t2Mk)) * 100)}%` }} className="bg-[#A3E635]" />
                    <div className="flex-1 bg-blue-500" />
                  </div>
                </div>
              </div>

              {/* 5v5 Head-to-Head Duel Matrix */}
              <div className="rounded-xl bg-[#0D1017] border border-[#1E2433] overflow-hidden shadow-xl">
                <div className="px-4 py-2.5 bg-[#121621] border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-[#A3E635]" />
                    <span className="font-display font-black text-sm text-white uppercase tracking-wide">
                      5v5 Head-to-Head Combat Matrix
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    <strong className="text-[#A3E635]">{activeMatch.team1.name}</strong> (Rows) vs <strong className="text-blue-400">{activeMatch.team2.name}</strong> (Columns)
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-[#0A0C12] text-[10px] text-slate-400 uppercase">
                        <th className="py-2.5 px-4 text-left">Operative</th>
                        {activeTeam2Rows.map(opp => (
                          <th key={opp.id} className="py-2.5 px-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <img src={opp.avatar} alt={opp.name} className="w-6 h-6 rounded-md object-cover border border-blue-400/40" />
                              <span className="text-blue-300 font-bold truncate max-w-[90px]">{opp.name}</span>
                            </div>
                          </th>
                        ))}
                        <th className="py-2.5 px-3 text-center text-[#A3E635]">Total H2H</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {activeTeam1Rows.map((p1, idx1) => {
                        let totalW = 0;
                        let totalL = 0;
                        const cells = activeTeam2Rows.map((p2, idx2) => {
                          const rec = getDuelRecord(p1, p2, idx1, idx2);
                          totalW += rec.w1;
                          totalL += rec.w2;
                          return { p2, ...rec };
                        });

                        return (
                          <tr key={p1.id} className="hover:bg-white/[0.025] transition">
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-2">
                                <img src={p1.avatar} alt={p1.name} className="w-6 h-6 rounded-md object-cover border border-[#A3E635]/40" />
                                <span className="font-display font-bold text-white truncate max-w-[120px]">{p1.name}</span>
                              </div>
                            </td>
                            {cells.map(({ p2, w1, w2 }) => {
                              const wonMatchup = w1 > w2;
                              const tiedMatchup = w1 === w2;
                              return (
                                <td key={p2.id} className="py-2.5 px-3 text-center">
                                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md border text-[11px] font-bold ${
                                    wonMatchup
                                      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                                      : tiedMatchup
                                      ? 'bg-white/[0.04] border-white/10 text-slate-300'
                                      : 'bg-rose-500/15 border-rose-500/35 text-rose-300'
                                  }`}>
                                    {w1} - {w2}
                                  </span>
                                </td>
                              );
                            })}
                            <td className="py-2.5 px-3 text-center">
                              <span className={`font-black ${totalW >= totalL ? 'text-[#A3E635]' : 'text-rose-400'}`}>
                                {totalW} - {totalL}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        };

        const renderUtilityUsage = () => {
          const getUtilStats = (r: FaceitStatsRow, idx: number) => {
            const adrVal = parseFloat(r.adr) || 75;
            const flashesThrown = Math.max(8, Math.round(r.a * 2.1 + 9 + (idx % 4)));
            const enemiesFlashed = Math.max(4, Math.round(flashesThrown * 0.62 + (r.a % 3)));
            const flashAssists = Math.max(1, Math.min(r.a, Math.round(r.a * 0.55)));
            const avgBlind = (1.6 + ((idx + r.a) % 9) * 0.14).toFixed(2);
            const heDmg = Math.round(adrVal * 2.1 + (idx % 5) * 18);
            const mollyDmg = Math.round(adrVal * 1.7 + ((idx + 2) % 4) * 22);
            const smokes = Math.max(9, Math.round(11 + (idx % 5) + r.a * 0.5));
            const udPerRound = ((heDmg + mollyDmg) / 24).toFixed(1);
            return { flashesThrown, enemiesFlashed, flashAssists, avgBlind, heDmg, mollyDmg, smokes, udPerRound };
          };

          const allWithUtil = activeAllStats.map((r, idx) => ({ row: r, util: getUtilStats(r, idx) }));
          const t1Util = allWithUtil.filter(x => x.row.team === 'team1');
          const t2Util = allWithUtil.filter(x => x.row.team === 'team2');
          const t1UtilDmg = t1Util.reduce((s, x) => s + x.util.heDmg + x.util.mollyDmg, 0);
          const t2UtilDmg = t2Util.reduce((s, x) => s + x.util.heDmg + x.util.mollyDmg, 0);
          const t1Flashed = t1Util.reduce((s, x) => s + x.util.enemiesFlashed, 0);
          const t2Flashed = t2Util.reduce((s, x) => s + x.util.enemiesFlashed, 0);
          const t1Smokes = t1Util.reduce((s, x) => s + x.util.smokes, 0);
          const t2Smokes = t2Util.reduce((s, x) => s + x.util.smokes, 0);

          return (
            <div className="space-y-4">
              {/* Squad Utility Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'Total Utility Damage (HE + Molly)', v1: t1UtilDmg, v2: t2UtilDmg, unit: 'DMG' },
                  { label: 'Enemies Blinded (Flashbangs)', v1: t1Flashed, v2: t2Flashed, unit: 'BLINDS' },
                  { label: 'Tactical Smokes Deployed', v1: t1Smokes, v2: t2Smokes, unit: 'SMOKES' }
                ].map(card => {
                  const pct = Math.round((card.v1 / Math.max(1, card.v1 + card.v2)) * 100);
                  return (
                    <div key={card.label} className="p-3.5 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-2">
                      <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">{card.label}</div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-lg font-black text-[#A3E635]">{card.v1}</span>
                        <span className="text-[10px] text-slate-500">{card.unit}</span>
                        <span className="text-lg font-black text-blue-400">{card.v2}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                        <div style={{ width: `${pct}%` }} className="bg-[#A3E635]" />
                        <div className="flex-1 bg-blue-500" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Per-Player Utility Breakdown Table */}
              <div className="rounded-xl bg-[#0D1017] border border-[#1E2433] overflow-hidden shadow-xl">
                <div className="px-4 py-2.5 bg-[#121621] border-b border-white/[0.07] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#A3E635]" />
                    <span className="font-display font-black text-sm text-white uppercase tracking-wide">
                      Grenade &amp; Flashbang Utility Breakdown
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">24 Rounds • {currentSelectedMap}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-[#0A0C12] text-[10px] text-slate-400 uppercase">
                        <th className="py-2.5 px-4 text-left">Operative</th>
                        <th className="py-2.5 px-3 text-center">Flashes</th>
                        <th className="py-2.5 px-3 text-center">Enemies Flashed</th>
                        <th className="py-2.5 px-3 text-center">Flash Assists</th>
                        <th className="py-2.5 px-3 text-center">Avg Blind</th>
                        <th className="py-2.5 px-3 text-center">HE Damage</th>
                        <th className="py-2.5 px-3 text-center">Molotov DMG</th>
                        <th className="py-2.5 px-3 text-center">Smokes</th>
                        <th className="py-2.5 px-3 text-center text-[#A3E635]">Util DMG / R</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {allWithUtil.map(({ row, util }) => (
                        <tr
                          key={row.id}
                          className={`border-l-2 transition ${
                            row.team === 'team1'
                              ? 'border-l-[#A3E635] hover:bg-[#15201A]/60'
                              : 'border-l-blue-400 hover:bg-[#131B2B]/60'
                          }`}
                        >
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <img src={row.avatar} alt={row.name} className="w-6 h-6 rounded-md object-cover border border-white/15" />
                              <span className="font-display font-bold text-white">{row.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-300">{util.flashesThrown}</td>
                          <td className="py-2.5 px-3 text-center text-white font-bold">{util.enemiesFlashed}</td>
                          <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{util.flashAssists}</td>
                          <td className="py-2.5 px-3 text-center text-slate-300">{util.avgBlind}s</td>
                          <td className="py-2.5 px-3 text-center text-amber-300 font-bold">{util.heDmg}</td>
                          <td className="py-2.5 px-3 text-center text-orange-400 font-bold">{util.mollyDmg}</td>
                          <td className="py-2.5 px-3 text-center text-sky-300">{util.smokes}</td>
                          <td className="py-2.5 px-3 text-center text-[#A3E635] font-black">{util.udPerRound}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        };

        const renderTacticalInsights = () => {
          const t1AvgRating = activeTeam1Rows.length
            ? (activeTeam1Rows.reduce((s, r) => s + r.ratingScore, 0) / activeTeam1Rows.length).toFixed(2)
            : '1.00';
          const t2AvgRating = activeTeam2Rows.length
            ? (activeTeam2Rows.reduce((s, r) => s + r.ratingScore, 0) / activeTeam2Rows.length).toFixed(2)
            : '1.00';

          const insights = [
            {
              tag: 'MATCH MVP ENGINE',
              title: `${mvp?.name || currentGamerTag} dominated impact rounds`,
              detail: `Finished with ${mvp?.rating || '1.35'} Caliber Rating, ${mvp?.adr || '92.0'} ADR, and ${mvp?.entryKills || 3} opening kills across ${currentSelectedMap}.`,
              accent: 'border-[#A3E635]/40 bg-[#A3E635]/10 text-[#A3E635]'
            },
            {
              tag: 'OPENING CONTROL',
              title: t1Entry >= t2Entry ? `${activeMatch.team1.name} controlled early map space` : `${activeMatch.team2.name} won early picks`,
              detail: `Opening duel split was ${t1Entry} vs ${t2Entry}, led by ${topEntry?.name || currentGamerTag} (${topEntry?.entrySuccessRate || '64%'} entry success).`,
              accent: 'border-sky-500/40 bg-sky-500/10 text-sky-300'
            },
            {
              tag: 'CLUTCH & LATE-ROUND',
              title: t1Clutch >= t2Clutch ? `${activeMatch.team1.name} converted key post-plants` : `${activeMatch.team2.name} held late-round retakes`,
              detail: `Total clutches won: ${t1Clutch} (${activeMatch.team1.name}) vs ${t2Clutch} (${activeMatch.team2.name}). Squad Rating avg: ${t1AvgRating} vs ${t2AvgRating}.`,
              accent: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
            },
            {
              tag: 'FIREPOWER & CONSISTENCY',
              title: `${topKast?.name || currentGamerTag} anchored round-to-round consistency`,
              detail: `Recorded ${topKast?.kast || '78%'} KAST while ${topAdr?.name || currentGamerTag} topped damage output at ${topAdr?.adr || '94.0'} ADR.`,
              accent: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
            }
          ];

          return (
            <div className="space-y-4">
              {/* Map & Economy Control Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: `${currentSelectedMap} CT Win %`, val: '54%', sub: '7 / 13 CT Rounds' },
                  { label: `${currentSelectedMap} T Win %`, val: '46%', sub: '6 / 11 T Rounds' },
                  { label: 'Pistol Conversions', val: '2 / 2', sub: 'Force-buy follow-ups won' },
                  { label: 'Avg Squad Rating', val: `${t1AvgRating} vs ${t2AvgRating}`, sub: `${activeMatch.team1.name} vs ${activeMatch.team2.name}` }
                ].map(kpi => (
                  <div key={kpi.label} className="p-3.5 rounded-xl bg-[#0D1017] border border-[#1E2433]">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</div>
                    <div className="text-lg font-display font-black text-[#A3E635] mt-1">{kpi.val}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* Tactical Key Takeaways */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.map(card => (
                  <div key={card.tag} className="p-4 rounded-xl bg-[#0D1017] border border-[#1E2433] space-y-2">
                    <span className={`inline-block px-2 py-0.5 rounded border text-[9px] font-mono font-black uppercase tracking-wider ${card.accent}`}>
                      {card.tag}
                    </span>
                    <h4 className="font-display font-black text-white text-sm">{card.title}</h4>
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">{card.detail}</p>
                  </div>
                ))}
              </div>

              {renderTeamH2H()}
            </div>
          );
        };

        return (
        <div className="max-w-[1320px] w-full mx-auto px-3 sm:px-5 py-3 flex-1 space-y-4">
          {/* Sub-Tabs: CaliberClutch Tactical Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#1E2433] pb-2.5 text-[11px] font-mono font-bold uppercase tracking-wider">
            {([
              { id: 'summary', label: 'Match Breakdown' },
              { id: 'duels', label: 'Combat Duels' },
              { id: 'utility', label: 'Utility Usage' },
              { id: 'insights', label: 'Tactical Insights' }
            ] as const).map(sub => (
              <button
                key={sub.id}
                onClick={() => { sound.playClick(); setStatsSubTab(sub.id); }}
                className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                  statsSubTab === sub.id
                    ? 'bg-[#A3E635]/15 border-[#A3E635]/40 text-[#A3E635] font-black'
                    : 'bg-white/[0.02] border-transparent text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {statsSubTab === 'summary' && (
            <>
              {/* Scoreboard-First Layout: Tables first, then Awards + Team H2H, then Leaders Strip & Highlights */}
              {renderFiltersAndTables()}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
                <div className="lg:col-span-7">{renderMvpCard()}</div>
                <div className="lg:col-span-5">{renderTeamH2H()}</div>
              </div>
              {renderLeadersStrip('grid grid-cols-2 lg:grid-cols-4 gap-2.5')}
              {renderCaliberHighlights()}
            </>
          )}

          {statsSubTab === 'duels' && renderCombatDuels()}
          {statsSubTab === 'utility' && renderUtilityUsage()}
          {statsSubTab === 'insights' && renderTacticalInsights()}

        </div>
        );
      })()}

      </div> {/* END OF LEFT COLUMN: MAIN MATCHROOM */}

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

            {/* Tactical Caliber Tier Badge + MMR */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <CaliberTierBadge level={selectedFlyoutPlayer.level} size="sm" showLabel />
              <span className="font-mono font-bold text-slate-200 text-sm">
                {selectedFlyoutPlayer.elo.toLocaleString()} MMR
              </span>
            </div>

            {/* Stats Box: MATCHES • WIN RATE • RECENT RESULTS (Text-Selectable) */}
            <div className="bg-[#0F1017] rounded-xl p-2.5 my-3.5 border border-white/[0.05] select-text">
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
                <Headphones className="w-5 h-5 text-[#A3E635]" />
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
                  Select issue to dispatch a live Caliber match admin:
                </div>
                <div className="space-y-2">
                  {[
                    'Server Unresponsive / Severe Packet Loss (EU-04)',
                    'Player Never Connected / AFK',
                    'CALIBER CLUTCH Anti-Cheat Integrity Issue',
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
                          ? 'bg-[#A3E635]/15 border-[#A3E635] text-white' 
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
                  className="w-full py-3 rounded-xl bg-[#A3E635] hover:bg-[#bef264] text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer"
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

      {/* ======================================================== */}
      {/* INTERACTIVE CS2 ACTIVE DUTY MAP VETO MODAL               */}
      {/* ======================================================== */}
      {isInteractiveVetoOpen && (
        <div 
          onClick={() => {
            sound.playClick();
            setIsInteractiveVetoOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-4xl bg-[#0E1017] border border-[#23293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto cursor-default my-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide flex items-center gap-2">
                    <Ban className="w-5 h-5 text-red-500" />
                    <span>CS2 ACTIVE DUTY MAP VETO</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                    VALVE BO1 FORMAT
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-[#A3E635] font-mono text-[10px] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-ping" />
                    REAL-TIME SUPABASE SYNC
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Both team captains take turns banning maps until 1 decisive map remains for the match.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetVeto}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                  title="Reset and start veto from scratch"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Veto</span>
                </button>
              </div>
            </div>

            {/* Turn Status Banner */}
            <div className={`p-4 rounded-2xl border text-xs font-mono font-bold flex items-center justify-between gap-3 ${
              isVetoCompleted
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : isOpponentBanning
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-[#A3E635]/15 border-[#A3E635]/40 text-[#A3E635]'
            }`}>
              <div className="flex items-center gap-2">
                {isVetoCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>VETO COMPLETED • <strong className="text-white underline">{currentSelectedMap}</strong> SELECTED AS THE COMPETITIVE MAP!</span>
                  </>
                ) : isOpponentBanning ? (
                  <>
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                    <span>OPPONENT'S TURN • {activeMatch.team2.name} is choosing a map to ban...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-[#A3E635] shrink-0" />
                    <span>YOUR TURN (CAPTAIN) • {activeMatch.team1.name} — Select a map below to BAN ({remainingMaps.length - 1} bans remaining)</span>
                  </>
                )}
              </div>

              <div className="shrink-0 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                {isVetoCompleted ? 'DECIDED' : `${remainingMaps.length} MAPS LEFT`}
              </div>
            </div>

            {/* Captain Side Selection Phase */}
            {isVetoCompleted && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#18210C] to-[#0E131C] border border-[#A3E635]/40 text-left space-y-3 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#A3E635] uppercase flex items-center gap-1.5">
                    <Crown className="w-4 h-4 fill-[#A3E635]" />
                    CAPTAIN SIDE SELECTION • {currentSelectedMap}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedStartingSide !== 'undecided' ? `Selected: ${selectedStartingSide.toUpperCase()}` : 'Select starting side'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleSelectStartingSide('ct')}
                    className={`p-3 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      selectedStartingSide === 'ct'
                        ? 'bg-blue-600/30 border-blue-400 text-blue-300 shadow-md ring-2 ring-blue-500/40'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-blue-400/50'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>START AS CT (DEFENDERS)</span>
                  </button>
                  <button
                    onClick={() => handleSelectStartingSide('t')}
                    className={`p-3 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      selectedStartingSide === 't'
                        ? 'bg-amber-600/30 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-500/40'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-400/50'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>START AS T (ATTACKERS)</span>
                  </button>
                  <button
                    onClick={() => handleSelectStartingSide('knife')}
                    className={`p-3 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      selectedStartingSide === 'knife'
                        ? 'bg-purple-600/30 border-purple-400 text-purple-300 shadow-md ring-2 ring-purple-500/40'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-purple-400/50'
                    }`}
                  >
                    <Swords className="w-4 h-4 text-purple-400" />
                    <span>KNIFE ROUND FOR SIDE</span>
                  </button>
                </div>
              </div>
            )}

            {/* 7 Maps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CS2_ACTIVE_DUTY_MAPS.map((map) => {
                const isBanned = bannedMapIds.includes(map.id);
                const isDecided = isVetoCompleted && remainingMaps[0]?.id === map.id;
                const banRecord = vetoHistory.find(h => h.mapName.toLowerCase() === map.name.toLowerCase() && !h.isDecided);

                return (
                  <div
                    key={map.id}
                    className={`rounded-2xl border overflow-hidden relative transition-all duration-200 flex flex-col justify-between ${
                      isDecided
                        ? 'bg-[#18210C] border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/50 scale-[1.02]'
                        : isBanned
                        ? 'bg-black/60 border-red-500/25 opacity-40 grayscale filter'
                        : 'bg-[#13151F] border-[#222738] hover:border-[#A3E635]/60 hover:shadow-lg'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="h-28 w-full relative overflow-hidden bg-black/40">
                      <img 
                        src={map.image} 
                        alt={map.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-transparent to-black/40" />

                      {/* Map Status Badge */}
                      <div className="absolute top-2 left-2">
                        {isDecided ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-mono font-black text-[10px] uppercase shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            SELECTED MAP
                          </span>
                        ) : isBanned ? (
                          <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white font-mono font-bold text-[10px] uppercase flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            BANNED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-slate-300 font-mono text-[10px] border border-white/10 uppercase">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Diagonal Banned Overlay */}
                      {isBanned && (
                        <div className="absolute inset-0 bg-red-950/70 backdrop-blur-[1px] flex items-center justify-center p-2 text-center">
                          <div className="text-red-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Ban className="w-4 h-4 text-red-500" />
                            <span>Banned by {banRecord?.team || 'Team'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 space-y-2.5">
                      <div>
                        <h4 className="font-display font-black text-white text-base leading-tight">
                          {map.name}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400">
                          {map.desc}
                        </p>
                      </div>

                      {/* Action Button */}
                      {!isBanned && !isDecided && (
                        <button
                          disabled={isOpponentBanning || remainingMaps.length <= 1}
                          onClick={() => handleUserBanMap(map.id)}
                          className={`w-full py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            isOpponentBanning
                              ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                              : 'bg-red-500/15 hover:bg-red-500 border border-red-500/40 text-red-400 hover:text-white shadow-sm active:scale-95'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Ban {map.name}</span>
                        </button>
                      )}

                      {isDecided && (
                        <div className="py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Competitive Match Map</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Veto Timeline History */}
            {vetoHistory.length > 0 && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Veto Step Log
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {vetoHistory.map((item, idx) => (
                    <span 
                      key={idx} 
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 border ${
                        item.isDecided
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                          : 'bg-white/5 text-slate-300 border-white/10'
                      }`}
                    >
                      <span className="text-slate-500 font-bold">{item.step}.</span>
                      <span>{item.text}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-slate-400">
                Official Caliber Clutch Esports Sub-Tick Server Architecture
              </span>
              <button
                onClick={() => {
                  sound.playSelect();
                  setIsInteractiveVetoOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#A3E635] hover:bg-[#bef264] text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                {isVetoCompleted ? 'Confirm & Return to Match' : 'Close Veto View'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
