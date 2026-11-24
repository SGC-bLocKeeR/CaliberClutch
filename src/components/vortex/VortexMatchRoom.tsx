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
  const [isStreamIpRevealed, setIsStreamIpRevealed] = useState<boolean>(false);

  // Dedicated European CS2 Sub-Tick Server Regions
  const SERVER_REGIONS = [
    { id: 'fra', name: 'Germany (Frankfurt Central)', ping: 18, ip: 'srv-fra.caliberclutch.com:27015' },
    { id: 'sto', name: 'Sweden (Stockholm)', ping: 24, ip: 'srv-sto.caliberclutch.com:27015' },
    { id: 'lon', name: 'United Kingdom (London)', ping: 28, ip: 'srv-lon.caliberclutch.com:27015' },
    { id: 'waw', name: 'Poland (Warsaw)', ping: 22, ip: 'srv-waw.caliberclutch.com:27015' }
  ];
  const [selectedServerRegion, setSelectedServerRegion] = useState(SERVER_REGIONS[0]);

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

  // Map Veto List for Tooltip (combining live history or baseline)
  const vetoHistoryList = useMemo(() => {
    if (vetoHistory.length > 0) return vetoHistory;
    return [
      { step: 1, text: `${activeMatch.team1.name} banned Cache`, isDecided: false },
      { step: 2, text: `${activeMatch.team2.name} banned Inferno`, isDecided: false },
      { step: 3, text: `${activeMatch.team1.name} banned Nuke`, isDecided: false },
      { step: 4, text: `${activeMatch.team2.name} banned Ancient`, isDecided: false },
      { step: 5, text: `${activeMatch.team1.name} banned Mirage`, isDecided: false },
      { step: 6, text: `${activeMatch.team2.name} banned Dust2`, isDecided: false },
      { step: 7, text: `${currentSelectedMap} picked by default`, isDecided: true }
    ];
  }, [vetoHistory, activeMatch, currentSelectedMap]);

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
                          <div className="w-3.5 h-3.5 rounded-full border border-[#A3E635] flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
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
                            <div className="absolute -top-1 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#182312] border border-[#A3E635] flex items-center justify-center text-[7px] text-[#A3E635] font-black shadow-sm" title="Priority">
                              ★
                            </div>
                          )}
                        </div>

                        <span className="font-display font-bold text-xs text-white group-hover:text-[#A3E635] group-hover:underline transition truncate max-w-[120px]">
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Rank Column */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <CaliberTierBadge level={row.rankLevel} size="sm" />
                        <span className="text-white font-mono text-xs font-semibold">
                          {row.rankElo.toLocaleString()} MMR
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
              <span className="px-1.5 py-0.2 rounded bg-[#A3E635] text-black text-[9px] font-black uppercase">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* Right Action Icons: 💬 Chat, 🔗 Share, ⋮ 3-Dots Menu, ✕ Close (Clean & Tactical) */}
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
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
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
                    <Headphones className="w-3.5 h-3.5 text-[#A3E635]" />
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
          
          {/* Authentic CS2 Panoramic Map Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={getMapImage(currentSelectedMap)} 
              alt={currentSelectedMap} 
              className="w-full h-full object-cover opacity-60 filter blur-[0.5px] transition-all duration-700" 
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
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#A3E635]/15 text-[#A3E635] text-[10px] font-bold border border-[#A3E635]/30">
                  <ShieldCheck className="w-3 h-3 text-[#A3E635]" />
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-400 font-black">{currentSelectedMap}</span>
                <span>•</span>
                <span>10 Nov</span>
                <CountryFlag code="DE" name="Germany" size="xs" />
              </div>
            </div>

            {/* Scoreboard & Fair 50% vs 50% Win Rate Balance */}
            <div className={`grid grid-cols-1 md:grid-cols-12 items-center gap-4 ${
              activeTab === 'stats' ? 'py-1 sm:py-2' : 'py-3'
            }`}>
              
              {/* Left Team (Team 1) */}
              <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-3.5 text-left md:text-right">
                <div className="order-2 md:order-1">
                  <div className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center md:justify-end gap-1.5">
                    <span>{activeMatch.team1.stackType}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-display font-black text-white tracking-wide">
                    {activeMatch.team1.name}
                  </h2>
                  {activeTab === 'overview' && (
                    <div className="text-[11px] font-mono text-slate-400 flex items-center md:justify-end gap-2 mt-0.5">
                      <span className="text-emerald-400 font-bold">{activeMatch.team1.avgElo.toLocaleString()} AVG MMR</span>
                      <span>•</span>
                      <span>Tier {activeMatch.team1.avgLevel}</span>
                    </div>
                  )}
                </div>

                <div className="order-1 md:order-2 relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-emerald-500 to-[#A3E635] shadow-[0_0_15px_rgba(52,211,153,0.4)] shrink-0">
                  <img 
                    src={team1Players[0]?.avatar || '/images/avatar_duck_exact.png'} 
                    alt={activeMatch.team1.name} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>
              </div>

              {/* Center Match Balance & Score */}
              <div className="md:col-span-2 text-center py-1 space-y-2">
                <div className="inline-flex items-center justify-center gap-3 px-5 py-2 rounded-2xl bg-black/70 border border-white/10 shadow-inner">
                  <span className="text-3xl font-display font-black text-emerald-400">
                    {matchSimulatedResult ? matchSimulatedResult.score1 : '13'}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-500 font-bold">vs</span>
                  <span className="text-3xl font-display font-black text-slate-400">
                    {matchSimulatedResult ? matchSimulatedResult.score2 : '11'}
                  </span>
                </div>

                {/* CALIBER SUPER MATCH 50% vs 50% FAIR WIN PROBABILITY */}
                <div className="p-2.5 rounded-xl bg-black/70 border border-white/10 space-y-1.5 shadow-lg">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="text-[#A3E635]">{activeMatch.winProbabilityTeam1}% WIN</span>
                    <span className="text-slate-400 text-[9px]">±{activeMatch.eloGainWin} MMR</span>
                    <span className="text-blue-400">{activeMatch.winProbabilityTeam2}% WIN</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${activeMatch.winProbabilityTeam1}%` }} className="bg-gradient-to-r from-emerald-500 to-[#A3E635]" />
                    <div style={{ width: `${activeMatch.winProbabilityTeam2}%` }} className="bg-gradient-to-r from-blue-500 to-indigo-500" />
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 font-bold tracking-tight">
                    ✓ Fair MMR Balanced (Δ {activeMatch.eloDiff} MMR)
                  </div>
                </div>
              </div>

              {/* Right Team (Team 2) */}
              <div className="md:col-span-5 flex items-center justify-start gap-3.5 text-left">
                <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-slate-600 to-slate-400 shrink-0">
                  <img 
                    src={team2Players[0]?.avatar || '/images/avatar_ghost_exact.png'} 
                    alt={activeMatch.team2.name} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>

                <div>
                  <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span>{activeMatch.team2.stackType}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  </div>
                  <h2 className="text-xl font-display font-black text-white tracking-wide">
                    {activeMatch.team2.name}
                  </h2>
                  {activeTab === 'overview' && (
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-blue-400 font-bold">{activeMatch.team2.avgElo.toLocaleString()} AVG MMR</span>
                      <span>•</span>
                      <span>Tier {activeMatch.team2.avgLevel}</span>
                    </div>
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

              {/* Map Card with Interactive Veto Modal Trigger & History */}
              <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#212330] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Map Selection</div>

                  {/* INTERACTIVE VETO BUTTON */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        sound.playSelect();
                        setIsInteractiveVetoOpen(true);
                      }}
                      className="flex items-center gap-1 text-xs font-mono font-bold text-[#A3E635] hover:text-white transition cursor-pointer px-2.5 py-1 rounded-lg bg-[#A3E635]/10 hover:bg-[#A3E635]/20 border border-[#A3E635]/30 shadow-sm"
                      title="Launch Captain Active Duty Map Veto"
                    >
                      <Ban className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>{isVetoCompleted ? 'View Veto Log' : 'Start Map Veto'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsVetoTooltipOpen(!isVetoTooltipOpen);
                      }}
                      className="flex items-center text-xs font-mono text-slate-400 hover:text-white transition cursor-pointer p-1 rounded-md hover:bg-white/[0.06]"
                      title="Quick summary"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {/* FLOATING VETO TOOLTIP */}
                    {isVetoTooltipOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsVetoTooltipOpen(false)} 
                        />
                        <div 
                          className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-[#101117] border border-[#2B2D3C] shadow-2xl z-50 text-xs font-mono space-y-1 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <div className="text-[10px] uppercase font-bold text-slate-400 border-b border-white/10 pb-1 mb-1.5">
                            Active Duty Veto Progression
                          </div>
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
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-sm">
                    <img 
                      src={getMapImage(currentSelectedMap)} 
                      alt={currentSelectedMap} 
                      className="w-full h-full object-cover transition-all duration-500" 
                    />
                  </div>
                  <div>
                    <div className="font-display font-black text-white text-base leading-tight flex items-center gap-1.5">
                      <span>{currentSelectedMap}</span>
                      {isVetoCompleted && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                          Decided
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Valve Active Duty Competitive Map
                    </div>
                  </div>
                </div>
              </div>

              {/* CS2 Match Connect & Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2.5 text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-[#A3E635] font-bold">
                      <Radio className="w-3 h-3 text-[#A3E635] animate-pulse" />
                      Direct Match Connect
                    </span>
                    <span className="text-emerald-400 font-bold">{selectedServerRegion.ping}ms Ping</span>
                  </div>

                  {/* Region Selector */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
                    {SERVER_REGIONS.map((reg) => (
                      <button
                        key={reg.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedServerRegion(reg);
                        }}
                        className={`px-2 py-1 rounded-lg border transition cursor-pointer shrink-0 ${
                          selectedServerRegion.id === reg.id
                            ? 'bg-[#A3E635]/20 text-[#A3E635] border-[#A3E635]/50 font-bold'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                        }`}
                      >
                        {reg.name.split(' (')[0]} ({reg.ping}ms)
                      </button>
                    ))}
                  </div>

                  {/* Connection String Box with Hide / Blur Security Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-white/5">
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">Connect:</span>
                      <div className={`text-[11px] font-mono text-[#A3E635] truncate transition-all duration-200 ${
                        isMatchIpRevealed ? 'filter-none select-all' : 'blur-sm select-none opacity-60'
                      }`}>
                        {isMatchIpRevealed
                          ? `connect ${selectedServerRegion.ip}; password cc123`
                          : `connect srv-•••••.caliberclutch.com:•••••; password •••••`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setIsMatchIpRevealed(!isMatchIpRevealed);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                      title={isMatchIpRevealed ? 'Hide connection code' : 'Reveal connection code'}
                    >
                      {isMatchIpRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        navigator.clipboard.writeText(`connect ${selectedServerRegion.ip}; password cc123`);
                        setCopiedServerIp(true);
                        setTimeout(() => setCopiedServerIp(false), 2000);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-[10px] flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      {copiedServerIp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedServerIp ? 'Copied ✓' : 'Copy IP'}</span>
                    </button>
                    <a
                      href={`steam://connect/${selectedServerRegion.ip}/cc123`}
                      onClick={() => sound.playClick()}
                      className="flex-1 py-1.5 rounded-lg bg-[#A3E635]/20 hover:bg-[#A3E635]/30 border border-[#A3E635]/40 text-[#A3E635] font-mono font-bold text-[10px] flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Launch CS2</span>
                    </a>
                  </div>

                  {/* Discreet Live Stream / Spectator Option (Blurred by default) */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                      <Radio className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                      <span className="text-slate-400 shrink-0">Live Stream Feed (120s Delay):</span>
                      <span className={`text-purple-300 transition-all duration-200 truncate ${
                        isStreamIpRevealed ? 'filter-none select-all' : 'blur-sm select-none opacity-60'
                      }`}>
                        {isStreamIpRevealed ? 'connect tv.caliberclutch.gg:27020; password cc_cast' : 'tv.caliberclutch.gg:•••••; password ••••••'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setIsStreamIpRevealed(!isStreamIpRevealed);
                        }}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white transition cursor-pointer"
                        title={isStreamIpRevealed ? 'Hide stream feed' : 'Reveal stream feed'}
                      >
                        {isStreamIpRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          navigator.clipboard.writeText('connect tv.caliberclutch.gg:27020; password cc_cast');
                          setCopiedServerIp(true);
                          setTimeout(() => setCopiedServerIp(false), 2000);
                        }}
                        className="text-purple-300 hover:text-purple-200 font-bold underline cursor-pointer px-1"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Map Veto & Side Status Button */}
                <button
                  onClick={() => {
                    sound.playSelect();
                    setIsInteractiveVetoOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] border border-[#2A344A] text-white font-mono font-bold text-xs flex items-center justify-between px-3 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Ban className="w-3.5 h-3.5 text-amber-400" />
                    <span>Map Veto ({currentSelectedMap})</span>
                  </div>
                  <span className="text-[10px] text-[#A3E635] uppercase font-bold">
                    {selectedStartingSide !== 'undecided' ? `${selectedStartingSide.toUpperCase()} Side ✓` : 'Open Veto →'}
                  </span>
                </button>

                {/* Official MatchZy Dedicated Server Status & Result Recording */}
                {!matchSimulatedResult ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1.5 text-left">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Match Server Status:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          ONLINE (128-TICK MATCHZY)
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Connect to server via console or click Launch CS2 above to enter competitive warmup.
                      </div>
                    </div>

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
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Record Match Result (+{activeMatch.eloGainWin} MMR)</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center animate-in zoom-in-95 duration-150">
                    <div className="text-xs font-black font-display text-white">
                      🎉 VICTORY! {activeMatch.team1.name} {matchSimulatedResult.score1} - {matchSimulatedResult.score2} {activeMatch.team2.name}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5">
                      ✓ +{activeMatch.eloGainWin} MMR Added • Match Record Finalized
                    </div>
                  </div>
                )}

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
                  className="w-full py-2.5 rounded-lg bg-[#12190E] hover:bg-[#182312] border border-[#A3E635]/30 text-[#A3E635] font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                >
                  <span>WATCH GOTV REPLAY (.dem)</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-display font-black text-xs uppercase tracking-wider transition flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <span>BACK TO MATCHMAKING</span>
                </button>
              </div>

              </div>

            </div>

            {/* RIGHT COLUMN (TEAM 2 PLAYERS - INCLUDING M18 & M14) */}
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
              <span className="px-1.5 py-0.2 rounded bg-[#A3E635] text-slate-950 text-[9px] font-black uppercase">
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
                  <div className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">Caliber Rating</div>
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
                  <img src="/images/avatar_ghost_exact.png" alt="M18" className="w-8 h-8 rounded-full object-contain bg-black" />
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
                      ? 'bg-[#1C1E2A] text-[#A3E635] font-bold shadow-sm' 
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
                        ? 'bg-[#A3E635] text-slate-950 shadow-sm' 
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
                avgRank: 'Tier 9 • 1,801 MMR',
                firstHalf: sideFilter === 't' ? 0 : 7,
                secondHalf: sideFilter === 'ct' ? 0 : 6,
                isWinner: sideFilter !== 't'
              })}
              {renderStatsTable(activeTeam2Rows, false, {
                score: sideFilter === 't' ? 5 : sideFilter === 'ct' ? 2 : 7,
                name: 'team_Zalevvo',
                avatar: '/images/avatar_ghost_exact.png',
                avgRank: 'Tier 8 • 1,728 MMR',
                firstHalf: sideFilter === 'ct' ? 0 : 5,
                secondHalf: sideFilter === 't' ? 0 : 2,
                isWinner: false
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. MATCH HIGHLIGHTS VIDEO SECTION                        */}
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
                  <div className="text-[10px] font-mono font-black text-[#A3E635] uppercase tracking-widest">
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

              {/* Card 2: M14 (Highlight locked) */}
              <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 p-3 flex flex-col justify-between min-h-[160px] bg-[#0E1711]/60">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Highlight locked
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <img src={currentAvatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80'} alt="M14" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[10px] font-mono font-bold text-white truncate max-w-[70px]">M14</span>
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
                  <input 
                    ref={roomFileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleRoomImageUpload} 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      roomFileInputRef.current?.click();
                    }}
                    className="hover:text-white transition p-0.5 cursor-pointer"
                    title="Send image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoomInput(prev => prev + ' 🎯')}
                    className="hover:text-white transition p-0.5 cursor-pointer"
                    title="Emoji"
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
                      <input 
                        ref={teamFileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleTeamImageUpload} 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          teamFileInputRef.current?.click();
                        }}
                        className="hover:text-white transition p-0.5 cursor-pointer"
                        title="Send image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeamInput(prev => prev + ' 🎯')}
                        className="hover:text-white transition p-0.5 cursor-pointer"
                        title="Emoji"
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

            {/* Tactical Caliber Tier Badge + MMR */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <CaliberTierBadge level={selectedFlyoutPlayer.level} size="sm" showLabel />
              <span className="font-mono font-bold text-slate-200 text-sm">
                {selectedFlyoutPlayer.elo.toLocaleString()} MMR
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
