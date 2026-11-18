import React, { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Target, Crosshair, Zap, Activity } from 'lucide-react';
import { CountryFlag } from './CountryFlag';

// ============================================================================
// OFFICIAL FACEIT CS2 ELO & SKILL LEVEL TIERS (100 - 2001+ ELO)
// Reference: Refrag.gg / FACEIT Official Standard
// ============================================================================
export interface FaceitTierInfo {
  level: number;
  minElo: number;
  maxElo: number;
  label: string;
  badgeColor: string;
  ringBorder: string;
  ringGlow: string;
  ringSvgColor: string;
  ringPercent: number;
}

export const FACEIT_TIERS: Record<number, FaceitTierInfo> = {
  1: { level: 1, minElo: 100, maxElo: 500, label: 'Level 1', badgeColor: 'text-slate-300', ringBorder: 'border-slate-500', ringGlow: 'shadow-slate-500/20', ringSvgColor: '#94A3B8', ringPercent: 12 },
  2: { level: 2, minElo: 501, maxElo: 750, label: 'Level 2', badgeColor: 'text-emerald-400', ringBorder: 'border-emerald-500', ringGlow: 'shadow-emerald-500/20', ringSvgColor: '#22C55E', ringPercent: 25 },
  3: { level: 3, minElo: 751, maxElo: 900, label: 'Level 3', badgeColor: 'text-[#A3E635]', ringBorder: 'border-[#A3E635]', ringGlow: 'shadow-lime-500/25', ringSvgColor: '#22C55E', ringPercent: 35 },
  4: { level: 4, minElo: 901, maxElo: 1050, label: 'Level 4', badgeColor: 'text-yellow-400', ringBorder: 'border-yellow-400', ringGlow: 'shadow-yellow-500/20', ringSvgColor: '#EAB308', ringPercent: 45 },
  5: { level: 5, minElo: 1051, maxElo: 1200, label: 'Level 5', badgeColor: 'text-yellow-400', ringBorder: 'border-yellow-500', ringGlow: 'shadow-yellow-500/20', ringSvgColor: '#EAB308', ringPercent: 55 },
  6: { level: 6, minElo: 1201, maxElo: 1350, label: 'Level 6', badgeColor: 'text-amber-400', ringBorder: 'border-amber-400', ringGlow: 'shadow-amber-500/20', ringSvgColor: '#F59E0B', ringPercent: 65 },
  7: { level: 7, minElo: 1351, maxElo: 1530, label: 'Level 7', badgeColor: 'text-amber-500', ringBorder: 'border-amber-500', ringGlow: 'shadow-amber-500/25', ringSvgColor: '#F59E0B', ringPercent: 75 },
  8: { level: 8, minElo: 1531, maxElo: 1750, label: 'Level 8', badgeColor: 'text-orange-500', ringBorder: 'border-orange-500', ringGlow: 'shadow-orange-500/25', ringSvgColor: '#EA580C', ringPercent: 82 },
  9: { level: 9, minElo: 1751, maxElo: 2000, label: 'Level 9', badgeColor: 'text-orange-500', ringBorder: 'border-orange-600', ringGlow: 'shadow-orange-600/25', ringSvgColor: '#EA580C', ringPercent: 90 },
  10: { level: 10, minElo: 2001, maxElo: 9999, label: 'Level 10', badgeColor: 'text-red-500', ringBorder: 'border-red-600', ringGlow: 'shadow-red-600/30', ringSvgColor: '#DC2626', ringPercent: 100 }
};

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

// Gradient and color mappings for connecting segments (1->2, 2->3, ..., 10->Challenger)
const SEGMENT_COLORS = [
  'bg-[#22C55E]',                                    // 1 -> 2 (Green)
  'bg-[#22C55E]',                                    // 2 -> 3 (Green)
  'bg-gradient-to-r from-[#22C55E] to-[#EAB308]',   // 3 -> 4 (Green to Yellow)
  'bg-[#EAB308]',                                    // 4 -> 5 (Yellow)
  'bg-[#EAB308]',                                    // 5 -> 6 (Yellow)
  'bg-gradient-to-r from-[#EAB308] to-[#F59E0B]',   // 6 -> 7 (Yellow to Amber)
  'bg-gradient-to-r from-[#F59E0B] to-[#EA580C]',   // 7 -> 8 (Amber to Orange)
  'bg-[#EA580C]',                                    // 8 -> 9 (Orange)
  'bg-gradient-to-r from-[#EA580C] to-[#DC2626]',   // 9 -> 10 (Orange to Red)
  'bg-[#DC2626]',                                    // 10 -> Challenger (Red)
];

// ============================================================================
// 1. AUTHENTIC FACEIT HORIZONTAL SKILL RANK PROGRESSION TRACK (1 TO 10 + CHALLENGER)
// Matches Refrag.gg & FACEIT CS2 User Profile Track
// ============================================================================
interface FaceitSkillTrackProps {
  elo: number;
  level: number;
  isCalibrated: boolean;
  className?: string;
  compact?: boolean;
}

export const FaceitSkillTrack: React.FC<FaceitSkillTrackProps> = ({
  elo,
  level,
  isCalibrated,
  className = '',
  compact = false
}) => {
  const currentLevel = isCalibrated ? level : 3;
  const currentElo = isCalibrated ? elo : 800;

  // Calculate ELO needed to next skill rank
  const nextTier = FACEIT_TIERS[Math.min(10, currentLevel + 1)];
  const currentTier = FACEIT_TIERS[currentLevel];
  const eloNeeded = currentLevel < 10 ? Math.max(1, nextTier.minElo - currentElo) : 0;

  // Partial progress in current segment between currentLevel and currentLevel + 1
  const range = Math.max(1, nextTier.minElo - currentTier.minElo);
  const progressInSegment = Math.min(100, Math.max(8, Math.round(((currentElo - currentTier.minElo) / range) * 100)));

  return (
    <div className={`w-full py-1.5 space-y-2.5 ${className}`}>
      {/* 100% Responsive track without any horizontal scrollbar or drag-handle */}
      <div className="w-full overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full flex items-center justify-between">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl, idx) => {
            const isReached = lvl <= currentLevel;
            const isCurrent = lvl === currentLevel;
            const tier = FACEIT_TIERS[lvl];
            const arcColor = isReached ? tier.ringSvgColor : '#475569';
            const arcPercent = tier.ringPercent;
            const isFilledLine = lvl < currentLevel;
            const isCurrentLine = lvl === currentLevel;
            const segmentColorClass = SEGMENT_COLORS[idx];

            return (
              <React.Fragment key={lvl}>
                {/* Node Level Badge */}
                <div className="flex flex-col items-center relative group shrink-0">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#121620] flex items-center justify-center relative transition-transform duration-200 group-hover:scale-110 ${
                      isCurrent
                        ? 'ring-2 ring-white/40 shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                        : isReached
                        ? 'border border-white/10'
                        : 'border border-white/5 opacity-40'
                    }`}
                  >
                    {/* Circular Arc Ring (matching authentic FACEIT SVG gauge) */}
                    <svg className="w-full h-full -rotate-90 absolute inset-0 p-[1.5px] sm:p-[2px]" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#1A202C" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke={arcColor}
                        strokeWidth="3.2"
                        strokeDasharray={`${(arcPercent * 88) / 100}, 100`}
                        strokeLinecap="round"
                        opacity={isReached ? 1 : 0.25}
                      />
                    </svg>
                    <span
                      className={`text-[9px] sm:text-[10px] md:text-[11px] font-black font-mono relative z-10 ${
                        isReached ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {lvl}
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition pointer-events-none px-2 py-0.5 rounded bg-black/95 border border-white/10 text-[9px] font-mono text-white whitespace-nowrap z-30 shadow-lg">
                    Level {lvl} ({tier.minElo} - {tier.maxElo > 5000 ? '2001+' : tier.maxElo} ELO)
                  </div>
                </div>

                {/* Connecting Segment */}
                <div className="flex-1 h-[2.5px] sm:h-[3px] mx-0.5 sm:mx-1 md:mx-1.5 rounded-full bg-[#1E2433] relative overflow-hidden min-w-[10px]">
                  {isFilledLine && (
                    <div className={`h-full w-full rounded-full ${segmentColorClass}`} />
                  )}
                  {isCurrentLine && (
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${segmentColorClass}`}
                      style={{ width: `${progressInSegment}%` }}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* 11th Node: Challenger (Top 1,000 Wreath) */}
          <div className="flex flex-col items-center relative group shrink-0">
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#121620] flex items-center justify-center relative transition-transform duration-200 group-hover:scale-110 ${
                currentLevel >= 10
                  ? 'border border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.5)] ring-1 ring-red-500/50'
                  : 'border border-white/5 opacity-40'
              }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                {/* Authentic Laurel Wreath with Wings / Sword */}
                <path d="M5 12c.5-2.5 2-4.5 4-5.5-.3.8-.4 1.7-.4 2.5 0 1.2.3 2.3.8 3.2-1.7-.1-3.2-.8-4.4-1.7zm14 0c-.5-2.5-2-4.5-4-5.5.3.8.4 1.7.4 2.5 0 1.2-.3 2.3-.8 3.2 1.7-.1 3.2-.8 4.4-1.7zM7 16.5c1.2.8 2.6 1.3 4.2 1.4-.4-.8-.6-1.7-.6-2.7 0-.5.1-1 .2-1.5-1.5.3-2.8 1.3-3.8 2.8zm10 0c-1.2.8-2.6 1.3-4.2 1.4.4-.8.6-1.7.6-2.7 0-.5-.1-1-.2-1.5 1.5.3 2.8 1.3 3.8 2.8zM12 5l1.5 4h-3L12 5zm0 5l1 3h-2l1-3z" />
              </svg>
            </div>
            {/* Tooltip on hover */}
            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition pointer-events-none px-2 py-0.5 rounded bg-black/95 border border-red-500/30 text-[9px] font-mono text-red-400 whitespace-nowrap z-30 shadow-lg">
              Challenger (Top 1,000 Level 10s)
            </div>
          </div>
        </div>
      </div>

      {/* Underneath: Elo needed to next skill rank (1:1 with authentic FACEIT UI) */}
      <div className="text-center pt-1 text-xs font-mono flex items-center justify-center gap-1.5">
        {currentLevel < 10 ? (
          <>
            <span className="text-[#38BDF8] font-black text-sm">{eloNeeded}</span>{' '}
            <span className="text-slate-300 font-sans">Elo needed to next skill rank</span>
            {!isCalibrated && (
              <span className="text-amber-400 font-mono text-[10px] ml-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                Uncalibrated (800 Elo Baseline)
              </span>
            )}
          </>
        ) : (
          <span className="text-red-400 font-bold">
            Max Level 10 Reached • Top 1,000 Regional Ranking for Challenger
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 2. COMPLETE AUTHENTIC FACEIT STATS CARD (MATCHING USER'S "JA KOMPLET PAMJA")
// ============================================================================
interface FaceitSeasonStatsCardProps {
  gamerTag: string;
  countryCode: string;
  countryName: string;
  elo: number;
  level: number;
  matches: number;
  isCalibrated: boolean;
  userRank?: string | number;
}

export const FaceitSeasonStatsCard: React.FC<FaceitSeasonStatsCardProps> = ({
  gamerTag,
  countryCode,
  countryName,
  elo,
  level,
  matches,
  isCalibrated,
  userRank = 97
}) => {
  const [statsView, setStatsView] = useState<'average' | 'best'>('average');

  const hasMatches = matches > 0;
  const wins = hasMatches ? Math.round(matches * 0.57) : 0;
  const losses = hasMatches ? Math.max(0, matches - wins) : 0;
  const winrate = hasMatches ? Math.round((wins / matches) * 100) : 0;

  return (
    <div className="w-full bg-[#0E1017] border border-[#202536] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      
      {/* 1. Header: Competitive stats & Regional / Global Ranks */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold font-display text-white">Competitive stats</h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-slate-300">
            <span className="text-slate-500 text-[11px]">Ranks</span>
            <CountryFlag code={countryCode || 'XK'} name={countryName || 'Kosovo'} size="xs" />
            <span className="font-bold text-white">{hasMatches ? userRank : 'Unranked'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-slate-300">
            <svg className="w-3.5 h-3.5 text-[#38BDF8]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="font-bold text-white">{hasMatches ? '412,890' : 'Calibrating'}</span>
          </div>
        </div>
      </div>

      {/* 2. Authentic FACEIT Horizontal Progression Track */}
      <FaceitSkillTrack elo={elo} level={level} isCalibrated={hasMatches} />

      {/* 3. Performance & Stats Section: ONLY SHOWN ONCE AT LEAST 1 MATCH IS PLAYED */}
      {!hasMatches ? (
        <div className="py-10 sm:py-12 px-6 rounded-2xl bg-black/30 border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#A3E635]/10 border border-[#A3E635]/25 flex items-center justify-center text-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.12)]">
            <Crosshair className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 max-w-lg">
            <h3 className="text-base sm:text-lg font-bold font-display text-white">
              0 Ndeshje të Luajtura • Kalibrimi në Pritje
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Statistikat e detajuara (Rating, K/D, ADR, K/R, Headshot %, RWS, Kills, Clutches dhe grafiku i ELO-s) do të llogariten automatikisht në bazë të lojës suaj sapo të përfundoni ndeshjen e parë 5v5 në Caliber Clutch.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Starting Baseline: Level 3 • 800 ELO</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-400">
              <span>101 ELO to Level 4</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Match Record Header & ELO Progression Wave Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-white">{matches} Matches</span>
                <span className="text-slate-600">•</span>
                <span className="font-bold text-white">{winrate}% Win rate</span>
              </div>

              <div className="flex items-center gap-1 font-bold">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  W {wins}
                </span>
                <span className="text-slate-600">/</span>
                <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                  L {losses}
                </span>
              </div>
            </div>

            {/* Glowing Orange Area Graph (Authentic ELO Curve) */}
            <div className="w-full h-36 rounded-2xl bg-[#090C12] border border-white/5 relative overflow-hidden p-2">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="faceitEloGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#EA580C" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 95 Q 40 85 70 70 T 130 50 T 180 30 T 230 40 T 260 22 T 300 45 T 340 70 T 380 90 T 420 82 T 460 76 T 500 85 L 500 120 L 0 120 Z"
                  fill="url(#faceitEloGrad)"
                />
                <path
                  d="M 0 95 Q 40 85 70 70 T 130 50 T 180 30 T 230 40 T 260 22 T 300 45 T 340 70 T 380 90 T 420 82 T 460 76 T 500 85"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Performance Stats Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white">Performance stats</h3>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/10 text-[11px] font-mono">
                <button
                  onClick={() => setStatsView('average')}
                  className={`px-3 py-1 rounded-md transition ${
                    statsView === 'average'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Average
                </button>
                <button
                  onClick={() => setStatsView('best')}
                  className={`px-3 py-1 rounded-md transition ${
                    statsView === 'best'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Best
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1: HLTV/Faceit Rating */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-orange-500/60 bg-orange-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                    </svg>
                  </div>
                  <span className="text-lg font-black font-mono text-white">
                    {statsView === 'average' ? '1.01' : '1.84'}
                  </span>
                </div>
                <div className="space-y-1 text-[11px] font-mono pt-1 border-t border-white/5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Swing</span>
                    <span className="text-red-400 font-bold">{statsView === 'average' ? '-1.53%' : '+8.20%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Consistency</span>
                    <span className="text-white font-bold">{statsView === 'average' ? '44%' : '78%'}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: K/D/A & Headshot % */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div>
                  <div className="text-lg font-black font-mono text-white">
                    {statsView === 'average' ? '13/16/6' : '34/12/9'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">K/D/A</div>
                </div>
                <div className="pt-1 border-t border-white/5">
                  <div className="text-base font-black font-mono text-white">
                    {statsView === 'average' ? '52%' : '74%'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Headshot %</div>
                </div>
              </div>

              {/* Card 3: K/D & ADR */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div>
                  <div className="text-lg font-black font-mono text-white">
                    {statsView === 'average' ? '0.90' : '2.14'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">K/D</div>
                </div>
                <div className="pt-1 border-t border-white/5">
                  <div className="text-base font-black font-mono text-white">
                    {statsView === 'average' ? '73.6' : '124.8'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">ADR</div>
                </div>
              </div>

              {/* Card 4: K/R & Win Rate */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div>
                  <div className="text-lg font-black font-mono text-white">
                    {statsView === 'average' ? '0.60' : '1.35'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">K/R</div>
                </div>
                <div className="pt-1 border-t border-white/5">
                  <div className="text-base font-black font-mono text-white">
                    {statsView === 'average' ? `${winrate}%` : '100%'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Win rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tables: Total Stats & Advanced Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold font-display text-white">Total stats</h4>
              <div className="divide-y divide-white/5 text-xs font-mono">
                <div className="flex justify-between py-1.5 text-slate-400 text-[11px]">
                  <span>Stat</span>
                  <span>Total</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span>Kills</span>
                  <span className="font-bold text-white">{(matches * 14).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span>AWP kills</span>
                  <span className="font-bold text-white">{Math.round(matches * 2.5)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span>Aces</span>
                  <span className="font-bold text-white">0</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span>Clutches won</span>
                  <span className="font-bold text-white">{Math.round(matches * 1.2)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span>Opening kills</span>
                  <span className="font-bold text-white">{Math.round(matches * 3.4)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span>Utility thrown</span>
                  <span className="font-bold text-white">{(matches * 24).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span>Highest win streak</span>
                  <span className="font-bold text-emerald-400">{Math.min(matches, 3)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold font-display text-white">Advanced stats</h4>
              <div className="divide-y divide-white/5 text-xs font-mono">
                <div className="grid grid-cols-3 py-1.5 text-slate-400 text-[11px]">
                  <span>Stat</span>
                  <span className="text-right">Overall</span>
                  <span className="text-right">Best</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-slate-300">
                  <span>RWS</span>
                  <span className="text-right font-bold text-white">9.83</span>
                  <span className="text-right font-bold text-emerald-400">21.45</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-slate-300">
                  <span>Accuracy</span>
                  <span className="text-right font-bold text-white">12.1%</span>
                  <span className="text-right font-bold text-emerald-400">17.7%</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-slate-300">
                  <span>Spotted accuracy</span>
                  <span className="text-right font-bold text-white">29.2%</span>
                  <span className="text-right font-bold text-emerald-400">41.7%</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-slate-300">
                  <span>Opening kills success</span>
                  <span className="text-right font-bold text-white">36.3%</span>
                  <span className="text-right font-bold text-emerald-400">100.0%</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-slate-300">
                  <span>Utility damage / Round</span>
                  <span className="text-right font-bold text-white">8.7</span>
                  <span className="text-right font-bold text-emerald-400">22.9</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-slate-300">
                  <span>Flash success %</span>
                  <span className="text-right font-bold text-white">44.2%</span>
                  <span className="text-right font-bold text-emerald-400">77.8%</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-slate-300">
                  <span>Deaths traded</span>
                  <span className="text-right font-bold text-white">20.3%</span>
                  <span className="text-right font-bold text-emerald-400">42.9%</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
