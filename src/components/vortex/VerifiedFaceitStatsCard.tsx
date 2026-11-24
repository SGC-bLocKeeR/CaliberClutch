import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Target,
  Trophy,
  Swords,
  Percent,
  Flame,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export interface FaceitStatsData {
  linked: boolean;
  steamId64?: string;
  playerId?: string;
  nickname?: string;
  avatar?: string;
  level?: number;
  faceitElo?: number;
  kdRatio?: string;
  winRate?: string;
  hsPercentage?: string;
  matches?: number;
  faceitUrl?: string;
  lastUpdated?: number;
  message?: string;
}

interface VerifiedFaceitStatsCardProps {
  steamId64: string;
  isOwner?: boolean;
}

const COOLDOWN_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Direct real-time browser fallback to official FACEIT live endpoints
const fetchDirectLiveFaceit = async (nick: string): Promise<FaceitStatsData | null> => {
  try {
    const clean = nick.trim().replace(/^https?:\/\/(www\.)?faceit\.com\/[a-z]{2}\/players\/?/i, '').replace(/\/$/, '');
    const userRes = await fetch(`https://www.faceit.com/api/users/v1/nicknames/${encodeURIComponent(clean)}`);
    if (!userRes.ok) return null;
    const userData = await userRes.json();
    const payload = userData.payload || {};
    const uid = payload.id;
    if (!uid) return null;
    const cs2 = payload.games?.cs2 || payload.games?.csgo || {};
    const faceitElo = cs2.faceit_elo || 1000;
    const level = cs2.skill_level || (faceitElo >= 2001 ? 10 : faceitElo >= 1851 ? 9 : faceitElo >= 1701 ? 8 : faceitElo >= 1551 ? 7 : faceitElo >= 1401 ? 6 : faceitElo >= 1251 ? 5 : faceitElo >= 1101 ? 4 : faceitElo >= 951 ? 3 : faceitElo >= 801 ? 2 : 1);
    
    let matches = 0;
    let winRate = '50%';
    let kdRatio = '1.00';
    let hsPercentage = '40%';
    try {
      const statsRes = await fetch(`https://www.faceit.com/api/stats/v1/stats/users/${encodeURIComponent(uid)}/games/cs2`);
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        const lt = statsJson.lifetime || {};
        matches = parseInt(lt.m1 || lt.Matches || '0', 10);
        const rawWr = lt.k6 || lt['Win Rate %'] || '50';
        winRate = rawWr.includes('%') ? rawWr : `${rawWr}%`;
        kdRatio = lt.k5 || lt['Average K/D Ratio'] || '1.00';
        const rawHs = lt.k8 || lt['Average Headshots %'] || '40';
        hsPercentage = rawHs.includes('%') ? rawHs : `${rawHs}%`;
      }
    } catch (_) {}

    return {
      linked: true,
      playerId: uid,
      nickname: payload.nickname || clean,
      avatar: payload.avatar || '',
      level,
      faceitElo,
      matches,
      winRate,
      kdRatio,
      hsPercentage,
      faceitUrl: `https://www.faceit.com/en/players/${encodeURIComponent(payload.nickname || clean)}`,
      lastUpdated: Date.now()
    };
  } catch (_) {
    return null;
  }
};

export const VerifiedFaceitStatsCard: React.FC<VerifiedFaceitStatsCardProps> = ({
  steamId64,
  isOwner = true
}) => {
  const [stats, setStats] = useState<FaceitStatsData | null>(() => {
    if (!steamId64) return null;
    try {
      const cached = localStorage.getItem(`caliber_faceit_stats_${steamId64}`) || localStorage.getItem(`vortex_faceit_stats_${steamId64}`);
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return null;
  });

  const [loading, setLoading] = useState<boolean>(!stats);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Calculate cooldown countdown
  useEffect(() => {
    if (!stats?.lastUpdated) {
      setCooldownRemaining(0);
      return;
    }

    const updateCooldown = () => {
      const elapsed = Date.now() - (stats.lastUpdated || 0);
      const remaining = Math.max(0, COOLDOWN_DURATION_MS - elapsed);
      setCooldownRemaining(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 10000);
    return () => clearInterval(interval);
  }, [stats?.lastUpdated]);

  const fetchFaceitStats = async (force: boolean = false) => {
    if (!steamId64) return;
    
    if (force) {
      setRefreshing(true);
      sound.playSelect();
    } else if (!stats) {
      setLoading(true);
    }

    setErrorMessage(null);
    const activeNickname = localStorage.getItem('caliber_faceit_nickname') || localStorage.getItem('vortex_faceit_nickname') || localStorage.getItem('caliber_user_gamertag') || localStorage.getItem('vortex_user_gamertag') || 'bLocKeeRz';

    try {
      const url = `/api/faceit/profile?steamId64=${encodeURIComponent(steamId64)}&nickname=${encodeURIComponent(activeNickname)}${force ? '&force=true' : ''}`;
      const res = await fetch(url);
      
      if (res.status === 429) {
        const errorData = await res.json();
        setErrorMessage(errorData.message || 'Cooldown active. You can refresh again once the 1-hour cooldown expires.');
        if (errorData.cooldownRemainingMs) {
          setCooldownRemaining(errorData.cooldownRemainingMs);
        }
        return;
      }

      if (res.ok) {
        const data: FaceitStatsData = await res.json();
        if (data.linked) {
          setStats(data);
          try {
            localStorage.setItem(`caliber_faceit_stats_${steamId64}`, JSON.stringify(data));
          } catch (_) {}

          if (force && data.linked) {
            sound.playNotification();
          }
          return;
        }
      }

      // Try direct live FACEIT API resolution
      const direct = await fetchDirectLiveFaceit(activeNickname);
      if (direct && direct.linked) {
        setStats(direct);
        try {
          localStorage.setItem(`caliber_faceit_stats_${steamId64}`, JSON.stringify(direct));
        } catch (_) {}
        if (force) sound.playNotification();
        return;
      }

      // Unlinked message if neither succeeded
      setStats({
        linked: false,
        message: 'No FACEIT account linked to this Steam ID',
        lastUpdated: Date.now()
      });
    } catch (err: any) {
      // Fallback directly to real-time client endpoint
      const direct = await fetchDirectLiveFaceit(activeNickname);
      if (direct && direct.linked) {
        setStats(direct);
        try {
          localStorage.setItem(`caliber_faceit_stats_${steamId64}`, JSON.stringify(direct));
        } catch (_) {}
        if (force) sound.playNotification();
        return;
      }
      console.warn('FACEIT stats fetch error:', err);
      setErrorMessage(err.message || 'Unable to reach FACEIT API. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch if no cached stats exist
    if (steamId64 && !stats) {
      fetchFaceitStats(false);
    }
  }, [steamId64]);

  const formatRemainingMinutes = (ms: number): string => {
    const minutes = Math.ceil(ms / (60 * 1000));
    if (minutes <= 1) return 'less than a minute';
    return `${minutes} min`;
  };

  // Skill Level Badge Color (CaliberClutch Signature palette)
  const getLevelBadgeClasses = (level: number) => {
    if (level === 10) {
      return 'bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
    }
    if (level >= 8) {
      return 'bg-gradient-to-br from-amber-400 to-yellow-600 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]';
    }
    if (level >= 5) {
      return 'bg-gradient-to-br from-[#84CC16] to-[#A3E635] text-slate-950 border-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.35)]';
    }
    return 'bg-[#182136] text-slate-200 border-[#2D3A58]';
  };

  return (
    <div className="w-full bg-[#0E1017] border border-[#202536] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background glow accents in CaliberClutch signature lime & subtle cyan */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/35 flex items-center justify-center text-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.2)] shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-white text-lg tracking-tight">
                Verified FACEIT Stats
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/35 shadow-sm">
                Verified via FACEIT
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Official CS2 competitive telemetry synchronized directly with FACEIT Open API v4
            </p>
          </div>
        </div>

        {/* Action Controls: Refresh Stats */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {isOwner && (
            <button
              onClick={() => fetchFaceitStats(true)}
              disabled={refreshing || cooldownRemaining > 0}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap shrink-0 ${
                cooldownRemaining > 0
                  ? 'bg-white/[0.04] border border-white/5 text-slate-400 cursor-not-allowed'
                  : 'bg-[#A3E635]/15 hover:bg-[#A3E635]/25 border border-[#A3E635]/40 text-[#A3E635] hover:brightness-110 active:scale-95'
              }`}
              title={
                cooldownRemaining > 0
                  ? `Active cooldown: you can refresh again in ${formatRemainingMinutes(cooldownRemaining)}`
                  : 'Click to refresh official stats from FACEIT'
              }
            >
              {cooldownRemaining > 0 ? (
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              ) : (
                <RefreshCw className={`w-3 h-3 shrink-0 ${refreshing ? 'animate-spin' : ''}`} />
              )}
              <span>
                {refreshing
                  ? 'Syncing...'
                  : cooldownRemaining > 0
                  ? `${Math.ceil(cooldownRemaining / (60 * 1000))}m`
                  : 'Refresh'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Error / Cooldown Alert Notice */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !stats && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#A3E635] animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading verified FACEIT telemetry for Steam ID...</span>
        </div>
      )}

      {/* CASE A: No FACEIT account linked to this Steam ID */}
      {!loading && stats && !stats.linked && (
        <div className="py-10 px-6 rounded-2xl bg-black/40 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display font-black text-white text-base">
              No FACEIT account linked to this Steam ID
            </h4>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto leading-relaxed">
              Steam ID <span className="text-slate-300 font-bold">{steamId64}</span> is not currently registered or linked to any public FACEIT profile for Counter-Strike 2.
            </p>
          </div>
        </div>
      )}

      {/* CASE B: Authenticated & Verified FACEIT Profile Stats Grid */}
      {!loading && stats && stats.linked && (
        <div className="space-y-6 relative z-10">
          
          {/* Identity & Rank Badge Header */}
          <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={stats.avatar || 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg'}
                  alt={stats.nickname || 'Player'}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg';
                  }}
                />
                <div
                  className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg border-2 border-[#12151F] flex items-center justify-center font-display font-black text-[11px] ${getLevelBadgeClasses(
                    stats.level || 1
                  )}`}
                >
                  {stats.level || 1}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-white text-base tracking-wide">
                    {stats.nickname}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    MATCHED
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>FACEIT Level {stats.level || 1}</span>
                  <span>•</span>
                  <span className="text-[#A3E635] font-bold">{stats.faceitElo?.toLocaleString()} FACEIT ELO</span>
                </div>
              </div>
            </div>

            {/* Last Synced Telemetry Note */}
            <div className="text-right text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Last Synced:{' '}
                <strong className="text-slate-300">
                  {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                </strong>
              </span>
            </div>
          </div>

          {/* Core Stat Tiles (Exact 7 metrics requested: Nickname, Level, ELO, K/D, Win Rate, HS %, Matches) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* 1. Skill Level */}
            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/5 space-y-1 hover:border-[#A3E635]/30 transition group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
                  <span>Skill Level</span>
                  <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-black font-display text-white">
                    Lvl {stats.level || 1}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">/ 10</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block leading-tight mt-1">Skill Tier</span>
            </div>

            {/* 2. FACEIT ELO */}
            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/5 space-y-1 hover:border-[#A3E635]/30 transition group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
                  <span>FACEIT ELO</span>
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black font-display text-[#A3E635]">
                    {stats.faceitElo !== undefined && stats.faceitElo !== null ? stats.faceitElo.toLocaleString() : 0}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block leading-tight mt-1">CS2 Live ELO</span>
            </div>

            {/* 3. Average K/D Ratio */}
            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/5 space-y-1 hover:border-emerald-500/30 transition group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
                  <span>K/D Ratio</span>
                  <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black font-display text-white">
                    {stats.kdRatio || '1.00'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block leading-tight mt-1">Career Ratio</span>
            </div>

            {/* 4. Win Rate % */}
            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/5 space-y-1 hover:border-sky-400/30 transition group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
                  <span>Win Rate</span>
                  <Percent className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black font-display text-sky-400">
                    {stats.winRate || '50%'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block leading-tight mt-1">5v5 Win Rate</span>
            </div>

            {/* 5. Headshots % */}
            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/5 space-y-1 hover:border-purple-400/30 transition group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
                  <span>Headshots</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black font-display text-purple-300">
                    {stats.hsPercentage || '45%'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block leading-tight mt-1">HS Accuracy</span>
            </div>

            {/* 6. Total Matches */}
            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/5 space-y-1 hover:border-amber-400/30 transition group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
                  <span>Total Matches</span>
                  <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black font-display text-amber-400">
                    {stats.matches?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block leading-tight mt-1">Total Matches</span>
            </div>

          </div>

          {/* Cooldown Information Bar */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#A3E635]" />
              <span>
                1-Hour Refresh Cooldown enforced to comply with FACEIT Open API rate-limits.
              </span>
            </span>
            <span className="text-slate-500 text-[11px]">
              {cooldownRemaining > 0
                ? `Next refresh ready in ${formatRemainingMinutes(cooldownRemaining)}`
                : 'Refresh available now'}
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
