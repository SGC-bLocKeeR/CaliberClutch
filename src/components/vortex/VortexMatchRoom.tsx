import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Server, 
  Clock, 
  Trophy, 
  Users, 
  Radio, 
  ChevronRight, 
  Flame,
  Award,
  Crown,
  Volume2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { CountryFlag } from './CountryFlag';

export interface MatchRoomPlayer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  elo: number;
  code: string;
  countryName: string;
  verification?: 'vip' | 'verified' | 'none';
  kd: string;
  hsRate: string;
  isCaptain?: boolean;
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

const MAP_POOL = [
  { id: 'mirage', name: 'Mirage', code: 'de_mirage', image: '/images/maps/de_mirage.jpg', banner: 'Active Duty' },
  { id: 'inferno', name: 'Inferno', code: 'de_inferno', image: '/images/maps/de_inferno.jpg', banner: 'Active Duty' },
  { id: 'nuke', name: 'Nuke', code: 'de_nuke', image: '/images/maps/de_nuke.jpg', banner: 'Active Duty' },
  { id: 'dust2', name: 'Dust II', code: 'de_dust2', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80', banner: 'Active Duty' },
  { id: 'anubis', name: 'Anubis', code: 'de_anubis', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', banner: 'Active Duty' },
  { id: 'ancient', name: 'Ancient', code: 'de_ancient', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', banner: 'Active Duty' },
  { id: 'vertigo', name: 'Vertigo', code: 'de_vertigo', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', banner: 'Active Duty' }
];

export const VortexMatchRoom: React.FC<VortexMatchRoomProps> = ({
  matchId = 'VTX-89421',
  currentGamerTag,
  currentAvatarUrl,
  partyMembers = [],
  onClose
}) => {
  // Turn states: 0 to 5 bans, 6 = decided
  // Turn 0: Team 1 (User) bans
  // Turn 1: Team 2 (Opponent) bans
  // Turn 2: Team 1 bans
  // Turn 3: Team 2 bans
  // Turn 4: Team 1 bans
  // Turn 5: Team 2 bans
  // Remaining = Decided map!
  const [bannedMapIds, setBannedMapIds] = useState<string[]>([]);
  const [banHistory, setBanHistory] = useState<Array<{ mapName: string; byTeam: string; time: string }>>([]);
  const [currentTurnTeam, setCurrentTurnTeam] = useState<'Team 1' | 'Team 2'>('Team 1');
  const [vetoCountdown, setVetoCountdown] = useState<number>(30);
  const [decidedMap, setDecidedMap] = useState<typeof MAP_POOL[0] | null>(null);
  const [matchStatus, setMatchStatus] = useState<'veto' | 'configuring' | 'ready'>('veto');
  const [copiedIp, setCopiedIp] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'server'>('overview');
  const [connectCountdown, setConnectCountdown] = useState<number>(300); // 5 minutes (05:00)

  useEffect(() => {
    if (matchStatus !== 'ready') {
      setConnectCountdown(300);
      return;
    }
    const timer = setInterval(() => {
      setConnectCountdown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [matchStatus]);

  const formatConnectTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const serverIp = '185.107.96.42:27015';
  const consoleCmd = `connect ${serverIp}; password vortex`;

  // Team Rosters
  const team1Players: MatchRoomPlayer[] = [
    {
      id: 'p1',
      name: currentGamerTag,
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      level: 7,
      elo: 1407,
      code: 'XK',
      countryName: 'Kosovo',
      verification: 'vip',
      kd: '1.42',
      hsRate: '58%',
      isCaptain: true
    },
    {
      id: 'p2',
      name: partyMembers[0]?.name || 'karrigan_fan',
      avatar: partyMembers[0]?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      level: 8,
      elo: 1650,
      code: 'AL',
      countryName: 'Albania',
      verification: 'vip',
      kd: '1.18',
      hsRate: '49%'
    },
    {
      id: 'p3',
      name: partyMembers[1]?.name || 'ZywOo_peek',
      avatar: partyMembers[1]?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1890,
      code: 'XK',
      countryName: 'Kosovo',
      verification: 'verified',
      kd: '1.35',
      hsRate: '54%'
    },
    {
      id: 'p4',
      name: partyMembers[2]?.name || 'flameZ_aim',
      avatar: partyMembers[2]?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      level: 7,
      elo: 1420,
      code: 'DE',
      countryName: 'Germany',
      verification: 'none',
      kd: '1.05',
      hsRate: '46%'
    },
    {
      id: 'p5',
      name: partyMembers[3]?.name || 'monesy_flick',
      avatar: partyMembers[3]?.avatar || 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
      level: 10,
      elo: 2150,
      code: 'XK',
      countryName: 'Kosovo',
      verification: 'vip',
      kd: '1.61',
      hsRate: '62%'
    }
  ];

  const team2Players: MatchRoomPlayer[] = [
    {
      id: 'op1',
      name: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      level: 10,
      elo: 3120,
      code: 'XK',
      countryName: 'Kosovo',
      verification: 'vip',
      kd: '1.74',
      hsRate: '64%',
      isCaptain: true
    },
    {
      id: 'op2',
      name: 'NiKo_banger',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1980,
      code: 'BA',
      countryName: 'Bosnia',
      verification: 'verified',
      kd: '1.30',
      hsRate: '56%'
    },
    {
      id: 'op3',
      name: 'donk_entry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      level: 10,
      elo: 2280,
      code: 'XK',
      countryName: 'Kosovo',
      verification: 'vip',
      kd: '1.55',
      hsRate: '61%'
    },
    {
      id: 'op4',
      name: 'ropz_lurk',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      level: 8,
      elo: 1720,
      code: 'EE',
      countryName: 'Estonia',
      verification: 'none',
      kd: '1.14',
      hsRate: '48%'
    },
    {
      id: 'op5',
      name: 'b1t_headshot',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1910,
      code: 'UA',
      countryName: 'Ukraine',
      verification: 'verified',
      kd: '1.27',
      hsRate: '65%'
    }
  ];

  // Turn timer countdown
  useEffect(() => {
    if (matchStatus !== 'veto') return;
    const interval = setInterval(() => {
      setVetoCountdown(prev => {
        if (prev <= 1) {
          // Auto ban first available map
          handleAutoBan();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [bannedMapIds, currentTurnTeam, matchStatus]);

  // Simulated opponent ban
  useEffect(() => {
    if (matchStatus === 'veto' && currentTurnTeam === 'Team 2') {
      const remainingMaps = MAP_POOL.filter(m => !bannedMapIds.includes(m.id));
      if (remainingMaps.length > 1) {
        const timer = setTimeout(() => {
          // Team 2 bans Vertigo or Ancient or random
          const target = remainingMaps.find(m => m.id === 'vertigo' || m.id === 'ancient') || remainingMaps[0];
          applyBan(target.id, 'Team 2 (M18)');
        }, 1600);
        return () => clearTimeout(timer);
      }
    }
  }, [currentTurnTeam, bannedMapIds, matchStatus]);

  const handleAutoBan = () => {
    const remaining = MAP_POOL.filter(m => !bannedMapIds.includes(m.id));
    if (remaining.length > 1) {
      applyBan(remaining[0].id, currentTurnTeam === 'Team 1' ? `Team 1 (${currentGamerTag})` : 'Team 2 (M18)');
    }
  };

  const applyBan = (mapId: string, teamLabel: string) => {
    const targetMap = MAP_POOL.find(m => m.id === mapId);
    if (!targetMap) return;

    sound.playMapBan();

    const newBanned = [...bannedMapIds, mapId];
    setBannedMapIds(newBanned);
    setBanHistory(prev => [
      ...prev,
      {
        mapName: targetMap.name,
        byTeam: teamLabel,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setVetoCountdown(30);

    // Check if only 1 map left
    const remaining = MAP_POOL.filter(m => !newBanned.includes(m.id));
    if (remaining.length === 1) {
      // DECIDED!
      sound.playMapPick();
      setDecidedMap(remaining[0]);
      setMatchStatus('configuring');
      setTimeout(() => {
        setMatchStatus('ready');
      }, 2500);
    } else {
      setCurrentTurnTeam(prev => prev === 'Team 1' ? 'Team 2' : 'Team 1');
    }
  };

  const handleUserBanMap = (mapId: string) => {
    if (matchStatus !== 'veto') return;
    if (currentTurnTeam !== 'Team 1') return;
    if (bannedMapIds.includes(mapId)) return;

    applyBan(mapId, `Team 1 (${currentGamerTag})`);
  };

  const handleCopyIp = () => {
    sound.playClick();
    navigator.clipboard?.writeText?.(consoleCmd);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2500);
  };

  const handleResetVeto = () => {
    sound.playSelect();
    setBannedMapIds([]);
    setBanHistory([]);
    setCurrentTurnTeam('Team 1');
    setDecidedMap(null);
    setMatchStatus('veto');
    setVetoCountdown(30);
    setConnectCountdown(300);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#090C12]/95 backdrop-blur-md overflow-y-auto flex flex-col font-sans select-none animate-in fade-in duration-200">
      
      {/* Top Navigation Bar */}
      <div className="w-full bg-[#0D1018] border-b border-white/[0.08] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/30">
            <Radio className="w-4 h-4 text-[#A3E635] animate-pulse" />
            <span className="font-display font-black text-xs text-[#A3E635] tracking-wider uppercase">
              Match Room
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-white text-base tracking-wide">
                CS2 5v5 Competitive Ranked
              </h1>
              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono font-bold text-slate-400">
                #{matchId}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              {matchStatus === 'ready'
                ? 'Europe (Frankfurt 128-tick) • Server #EU-04 • AC Enforced'
                : 'Europe Active Duty • 128-Tick Matchmaking • Map Veto Phase'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetVeto}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white font-mono text-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Restart Map Veto simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Veto</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition cursor-pointer"
            title="Leave Match Room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Match Status Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121B] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shrink-0">
              {matchStatus === 'ready' ? (
                <ShieldCheck className="w-6 h-6 text-[#A3E635]" />
              ) : (
                <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Phase:</span>
                <span className={`text-xs font-mono font-black uppercase tracking-wider ${
                  matchStatus === 'ready' ? 'text-[#A3E635]' : 'text-amber-400'
                }`}>
                  {matchStatus === 'veto' && `MAP VETO — ${currentTurnTeam.toUpperCase()} IS BANNING`}
                  {matchStatus === 'configuring' && 'SERVER DEPLOYMENT IN PROGRESS...'}
                  {matchStatus === 'ready' && 'MATCH READY — CS2 SERVER DEPLOYED'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">
                {matchStatus === 'veto' && (
                  currentTurnTeam === 'Team 1' 
                    ? `You are Captain of Team 1! Click any active map below to ban it.`
                    : `Waiting for opponent Captain (${team2Players[0].name}) to pick/ban...`
                )}
                {matchStatus === 'configuring' && `Allocating 128-tick Frankfurt server for ${decidedMap?.name}...`}
                {matchStatus === 'ready' && `Map decided: ${decidedMap?.name}! Join the match below.`}
              </p>
            </div>
          </div>

          {/* Veto Countdown (Only shown during veto) */}
          {matchStatus === 'veto' && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10">
              <Clock className="w-4 h-4 text-[#A3E635] animate-spin" style={{ animationDuration: '6s' }} />
              <div className="text-right font-mono">
                <div className="text-[10px] text-slate-400 uppercase">Turn Timer</div>
                <div className={`text-base font-black ${vetoCountdown <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  00:{vetoCountdown.toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: ACTIVE DUTY MAP VETO (ONLY SHOWN DURING VETO!)   */}
        {/* ======================================================== */}
        {matchStatus === 'veto' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] flex items-center gap-2">
                <span>Active Duty Map Veto</span>
                <span className="text-slate-400 font-normal">({7 - bannedMapIds.length} Remaining)</span>
              </h2>

              {/* Ban timeline history */}
              {banHistory.length > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 overflow-x-auto no-scrollbar">
                  <span className="text-slate-500">History:</span>
                  {banHistory.map((h, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                      {h.mapName} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {MAP_POOL.map((m) => {
                const isBanned = bannedMapIds.includes(m.id);
                const isMyTurn = currentTurnTeam === 'Team 1' && !isBanned;

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (isMyTurn) handleUserBanMap(m.id);
                    }}
                    className={`group relative h-48 rounded-2xl overflow-hidden border transition-all duration-200 select-none ${
                      isBanned
                        ? 'border-white/5 opacity-40 grayscale pointer-events-none'
                        : isMyTurn
                        ? 'border-white/20 hover:border-red-500/80 hover:scale-[1.02] cursor-pointer shadow-lg'
                        : 'border-white/10 opacity-80'
                    }`}
                  >
                    {/* Map Image Backdrop */}
                    <img
                      src={m.image}
                      alt={m.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    {/* Top Badge */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-white font-bold">
                        {m.code}
                      </span>
                    </div>

                    {/* Banned Stamp Overlay */}
                    {isBanned && (
                      <div className="absolute inset-0 bg-red-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center p-2">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 mb-1">
                          <X className="w-6 h-6 stroke-[3]" />
                        </div>
                        <span className="font-display font-black text-sm text-red-400 tracking-widest uppercase">
                          BANNED
                        </span>
                      </div>
                    )}

                    {/* Hover Ban Action Button */}
                    {isMyTurn && !isBanned && (
                      <div className="absolute inset-0 bg-red-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                        <span className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5" />
                          <span>BAN MAP</span>
                        </span>
                      </div>
                    )}

                    {/* Bottom Map Name */}
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <p className="font-display font-black text-white text-base tracking-wide leading-tight">
                        {m.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#A3E635] mt-0.5">
                        {isBanned ? 'Eliminated' : 'Active Choice'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: SERVER DEPLOYING (INTERMEDIATE PHASE)            */}
        {/* ======================================================== */}
        {matchStatus === 'configuring' && (
          <div className="p-8 rounded-3xl bg-[#0E121B] border border-[#A3E635]/40 shadow-2xl space-y-4 animate-in fade-in duration-300 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] mx-auto shadow-[0_0_20px_rgba(163,230,53,0.3)]">
              <Server className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">
                DEPLOYING CS2 DEDICATED SERVER FOR {decidedMap?.name.toUpperCase()}...
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Allocating 128-tick Frankfurt server • Synchronizing sub-tick tickrate • Loading match cfg
              </p>
            </div>
            <div className="max-w-md mx-auto w-full h-2 rounded-full bg-black/60 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#84CC16] to-[#A3E635] w-3/4 animate-pulse" />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: AUTHENTIC FACEIT SERVER CONNECT HUB (FINAL)      */}
        {/* ======================================================== */}
        {matchStatus === 'ready' && decidedMap && (
          <div className="rounded-3xl overflow-hidden border-2 border-[#A3E635] shadow-[0_0_40px_rgba(163,230,53,0.25)] bg-[#0E121B] animate-in zoom-in-95 duration-300">
            {/* Top Panoramic Hero Artwork of Decided Map */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={decidedMap.image}
                alt={decidedMap.name}
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E121B] via-[#0E121B]/60 to-black/30" />

              {/* Badges and Map Title over the image */}
              <div className="absolute top-5 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#A3E635]/60 text-[#A3E635] font-mono text-xs font-black tracking-wider uppercase">
                    ★ Active Duty Selected
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold">
                    {decidedMap.code}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>SERVER ONLINE</span>
                </div>
              </div>

              {/* Centered Map Name inside Hero */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#A3E635] font-bold">
                    Decided Competitive Arena
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black font-display text-white tracking-wide uppercase drop-shadow-lg">
                    MAP: {decidedMap.name}
                  </h2>
                  <p className="text-xs font-mono text-slate-300 mt-1">
                    Frankfurt, Germany • 128-Tick CS2 Dedicated Server • AC Enforced
                  </p>
                </div>

                {/* Veto Summary History Pill */}
                {banHistory.length > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 font-bold uppercase">Veto:</span>
                    {banHistory.map((h, i) => (
                      <span key={i} className="text-red-400">
                        {h.mapName} ✕{i < banHistory.length - 1 ? ' •' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom FACEIT-Style Server Action Bar */}
            <div className="p-5 sm:p-6 bg-[#121622] border-t border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-5">
              
              {/* Left: Time Remaining to Join (Countdown) */}
              <div className="flex items-center gap-3.5 w-full lg:w-auto">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Time to join server</div>
                  <div className="text-xl font-mono font-black text-white flex items-center gap-2">
                    <span className={connectCountdown <= 60 ? 'text-red-400 animate-pulse' : 'text-[#A3E635]'}>
                      {formatConnectTime(connectCountdown)}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-normal">(10/10 reserved)</span>
                  </div>
                </div>
              </div>

              {/* Center: Console Command Copy Box */}
              <div className="flex-1 w-full lg:max-w-md flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={consoleCmd}
                  className="flex-1 px-4 py-3 rounded-xl bg-black/80 border border-white/10 focus:border-[#A3E635] font-mono text-xs text-[#A3E635] outline-none select-all"
                />
                <button
                  onClick={handleCopyIp}
                  className="px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                  {copiedIp ? <Check className="w-3.5 h-3.5 text-[#A3E635]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIp ? 'COPIED' : 'COPY IP'}</span>
                </button>
              </div>

              {/* Right: Big Neon FACEIT CTA Button */}
              <a
                href={`steam://connect/${serverIp}`}
                className="w-full lg:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-lg shadow-lime-500/30 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 shrink-0"
              >
                <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                <span>CONNECT TO SERVER</span>
              </a>

            </div>
          </div>
        )}

        {/* SECTION 2: ROSTERS COMPARISON (TEAM 1 VS TEAM 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TEAM 1 ROSTER */}
          <div className="p-5 rounded-2xl bg-[#0E121B] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A3E635]" />
                <h3 className="font-display font-black text-white text-base tracking-wide">
                  TEAM 1 (Team {team1Players[0].name})
                </h3>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                Avg ELO: <strong className="text-[#A3E635]">1,723</strong> • Level 8
              </div>
            </div>

            <div className="space-y-2">
              {team1Players.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#131722]/60 hover:bg-[#131722] border border-white/[0.04] transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500 font-bold w-4">
                      #{idx + 1}
                    </span>

                    {/* Avatar */}
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                      {p.isCaptain && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center shadow">
                          <Crown className="w-2.5 h-2.5 text-black" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 font-display font-bold text-white text-xs">
                        <span>{p.name}</span>
                        {p.isCaptain && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                            CAPTAIN
                          </span>
                        )}
                        <CountryFlag code={p.code} name={p.countryName} size="xs" />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                        <span>KD: <strong className="text-slate-200">{p.kd}</strong></span>
                        <span>•</span>
                        <span>HS: <strong className="text-slate-200">{p.hsRate}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Level & ELO badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">{p.elo}</span>
                    <span className="w-6 h-6 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/40 text-[#A3E635] font-mono font-black text-xs flex items-center justify-center">
                      {p.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TEAM 2 ROSTER */}
          <div className="p-5 rounded-2xl bg-[#0E121B] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <h3 className="font-display font-black text-white text-base tracking-wide">
                  TEAM 2 (Team {team2Players[0].name})
                </h3>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                Avg ELO: <strong className="text-orange-400">2,202</strong> • Level 10
              </div>
            </div>

            <div className="space-y-2">
              {team2Players.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#131722]/60 hover:bg-[#131722] border border-white/[0.04] transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500 font-bold w-4">
                      #{idx + 1}
                    </span>

                    {/* Avatar */}
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                      {p.isCaptain && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center shadow">
                          <Crown className="w-2.5 h-2.5 text-black" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 font-display font-bold text-white text-xs">
                        <span>{p.name}</span>
                        {p.isCaptain && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                            CAPTAIN
                          </span>
                        )}
                        <CountryFlag code={p.code} name={p.countryName} size="xs" />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                        <span>KD: <strong className="text-slate-200">{p.kd}</strong></span>
                        <span>•</span>
                        <span>HS: <strong className="text-slate-200">{p.hsRate}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Level & ELO badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">{p.elo}</span>
                    <span className="w-6 h-6 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-400 font-mono font-black text-xs flex items-center justify-center">
                      {p.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

      </div>
    </div>
  );
};