import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  ShieldCheck, 
  UserPlus, 
  X, 
  Flame, 
  Crown, 
  Zap, 
  Check, 
  AlertTriangle,
  Radio,
  Search,
  Filter
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { sound } from '../../utils/soundEffects';

export interface SquadMember {
  id: string;
  name: string;
  role: string;
  level: number;
  elo: number;
  avatar: string;
  countryCode?: string;
  isCaptain?: boolean;
}

export interface SoloGrinder {
  id: string;
  name: string;
  role: 'AWPer' | 'Entry Fragger' | 'Support' | 'IGL' | 'Lurker' | 'Anchor';
  level: number;
  elo: number;
  avatar: string;
  countryCode: string;
  countryName: string;
  kd: string;
  adr: string;
  hsRate: string;
  antiCheatReady: boolean;
  ping: number;
  badge?: string;
}

export const AVAILABLE_SOLO_GRINDERS: SoloGrinder[] = [
  {
    id: 'solo-1',
    name: 's1mple_spirit',
    role: 'AWPer',
    level: 10,
    elo: 2490,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
    countryCode: 'XK',
    countryName: 'Kosovo',
    kd: '1.38',
    adr: '91.4',
    hsRate: '48%',
    antiCheatReady: true,
    ping: 18,
    badge: 'TOP AWPER'
  },
  {
    id: 'solo-2',
    name: 'zywoo_pro',
    role: 'Entry Fragger',
    level: 10,
    elo: 2420,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    countryCode: 'AL',
    countryName: 'Albania',
    kd: '1.32',
    adr: '88.6',
    hsRate: '54%',
    antiCheatReady: true,
    ping: 22,
    badge: 'AIM BEAST'
  },
  {
    id: 'solo-3',
    name: 'niko_tap',
    role: 'Entry Fragger',
    level: 9,
    elo: 1980,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    countryCode: 'DE',
    countryName: 'Germany',
    kd: '1.25',
    adr: '84.2',
    hsRate: '68%',
    antiCheatReady: true,
    ping: 15,
    badge: 'HEADSHOT MASTER'
  },
  {
    id: 'solo-4',
    name: 'b1t_laser',
    role: 'Anchor',
    level: 9,
    elo: 1910,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&auto=format&fit=crop&q=80',
    countryCode: 'SE',
    countryName: 'Sweden',
    kd: '1.19',
    adr: '82.0',
    hsRate: '66%',
    antiCheatReady: true,
    ping: 24,
    badge: 'SITE LOCKDOWN'
  },
  {
    id: 'solo-5',
    name: 'monesy_peek',
    role: 'AWPer',
    level: 10,
    elo: 2540,
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80',
    countryCode: 'PL',
    countryName: 'Poland',
    kd: '1.44',
    adr: '94.0',
    hsRate: '42%',
    antiCheatReady: true,
    ping: 20,
    badge: 'FLICK GOD'
  },
  {
    id: 'solo-6',
    name: 'clutch_master',
    role: 'Support',
    level: 8,
    elo: 1750,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    kd: '1.14',
    adr: '77.8',
    hsRate: '50%',
    antiCheatReady: true,
    ping: 26,
    badge: '1vX SPECIALIST'
  },
  {
    id: 'solo-7',
    name: 'rain_entry',
    role: 'Entry Fragger',
    level: 9,
    elo: 1860,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    countryCode: 'NO',
    countryName: 'Norway',
    kd: '1.21',
    adr: '83.5',
    hsRate: '52%',
    antiCheatReady: true,
    ping: 28,
    badge: 'FIRST BLOOD'
  },
  {
    id: 'solo-8',
    name: 'frozen_aim',
    role: 'Lurker',
    level: 9,
    elo: 1930,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    countryCode: 'SK',
    countryName: 'Slovakia',
    kd: '1.24',
    adr: '85.0',
    hsRate: '55%',
    antiCheatReady: true,
    ping: 21,
    badge: 'TIMING PRO'
  }
];

interface VortexSquadRadarProps {
  currentGamerTag: string;
  currentClanTag: string;
  members: SquadMember[];
  onRecruit: (player: SoloGrinder) => void;
  onRemove: (playerId: string) => void;
  onAutoFill5Stack?: () => void;
  compact?: boolean;
}

export const VortexSquadRadar: React.FC<VortexSquadRadarProps> = ({
  currentGamerTag,
  currentClanTag,
  members,
  onRecruit,
  onRemove,
  onAutoFill5Stack,
  compact = false
}) => {
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentCount = members.length;
  const is5StackComplete = currentCount >= 5;
  const missingCount = Math.max(0, 5 - currentCount);

  // Recruited player IDs
  const recruitedIds = new Set(members.map(m => m.id));

  // Filter pool
  const filteredPool = AVAILABLE_SOLO_GRINDERS.filter(p => {
    if (recruitedIds.has(p.id)) return false;
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRecruitClick = (player: SoloGrinder) => {
    sound.playPartyInvite();
    onRecruit(player);
    if (members.length + 1 >= 5) {
      setIsPoolModalOpen(false);
    }
  };

  return (
    <div className={`w-full rounded-3xl bg-[#090C13] border border-[#202738] overflow-hidden text-left shadow-2xl relative ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'}`}>
      {/* Background Cyber Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-lime-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Tag */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
          <span className="font-mono text-[11px] font-black text-[#A3E635] tracking-widest uppercase">
            TEAM FINDER // SQUAD RADAR
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-[#A3E635]/10 border border-[#A3E635]/30 flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#A3E635]">
            <Radio className="w-3 h-3 text-[#A3E635] animate-pulse" />
            <span>5V5 SOLO RADAR ACTIVE</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
            is5StackComplete 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
          }`}>
            {is5StackComplete ? '5-STACK READY ✓' : `${currentCount}/5 SQUAD (${missingCount} NEEDED)`}
          </span>
        </div>
      </div>

      {/* Headline & Description */}
      <div className="mb-6 relative z-10">
        <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight uppercase leading-tight mb-2 flex items-center gap-2">
          <span>A SPOT RESERVED FOR YOU IN THE 5-STACK.</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed max-w-3xl">
          Queue built specifically for solo grinders and squad captains. Connect with disciplined riflers, AWPers, and support players verified with Ring-0 Anti-Cheat.
        </p>
      </div>

      {/* 5 Slots Outlined Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-4 relative z-10">
        {[0, 1, 2, 3, 4].map((slotIdx) => {
          const slotNum = `0${slotIdx + 1}`;
          const member = members[slotIdx];

          if (slotIdx === 0) {
            // Slot 01: Captain (You)
            return (
              <div
                key="slot-01-captain"
                className="aspect-square rounded-2xl bg-gradient-to-b from-[#18210C] to-[#0E131C] border-2 border-[#A3E635] flex flex-col items-center justify-between p-3 text-center shadow-[0_0_25px_rgba(163,230,53,0.25)] relative group"
              >
                <div className="w-full flex items-center justify-between text-[9px] font-mono font-bold text-[#A3E635]">
                  <span className="flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-[#A3E635]" />
                    CAPTAIN
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#A3E635]/20 border border-[#A3E635] flex items-center justify-center text-[#A3E635] mb-1">
                    <Target className="w-5 h-5 text-[#A3E635]" />
                  </div>
                  <span className="font-display font-black text-xs text-white truncate max-w-[90px]">
                    {member?.name || currentGamerTag}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    [{currentClanTag || 'CC'}] IGL
                  </span>
                </div>
                <span className="font-mono font-black text-xs text-[#A3E635]">01</span>
              </div>
            );
          }

          if (member) {
            // Occupied Slot
            return (
              <div
                key={`slot-${slotIdx}-${member.id}`}
                className="aspect-square rounded-2xl bg-[#0E121C] border border-[#263147] hover:border-[#A3E635]/60 flex flex-col items-center justify-between p-3 text-center transition group relative"
              >
                <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> AC OK
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onRemove(member.id);
                    }}
                    className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    title="Remove from squad"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#A3E635]/40 mb-1"
                  />
                  <span className="font-display font-black text-xs text-white truncate max-w-[90px]">
                    {member.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 truncate max-w-[90px]">
                    {member.role}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{slotNum}</span>
                  <span className="text-amber-400 font-bold">Lvl {member.level}</span>
                </div>
              </div>
            );
          }

          // Empty Slot -> Click to Recruit
          return (
            <div
              key={`empty-${slotIdx}`}
              onClick={() => {
                sound.playClick();
                setIsPoolModalOpen(true);
              }}
              className="aspect-square rounded-2xl bg-[#0B0E17]/80 border-2 border-dashed border-white/10 hover:border-[#A3E635]/60 hover:bg-[#121724] flex flex-col items-center justify-between p-3 text-center transition cursor-pointer group"
            >
              <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span>OPEN</span>
                <span className="text-slate-600">{slotNum}</span>
              </div>
              <div className="flex flex-col items-center group-hover:scale-105 transition">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] group-hover:bg-[#A3E635]/15 border border-white/10 group-hover:border-[#A3E635]/40 flex items-center justify-center text-slate-400 group-hover:text-[#A3E635] mb-1.5 transition">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="font-mono font-bold text-[11px] text-slate-300 group-hover:text-[#A3E635] transition">
                  + RECRUIT
                </span>
                <span className="text-[9px] font-mono text-slate-500">Solo Grinder</span>
              </div>
              <span className="font-mono font-bold text-[11px] text-slate-500">{slotNum}</span>
            </div>
          );
        })}
      </div>

      {/* Squad Status & Action Bar */}
      <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-10">
        <div className="flex items-center gap-2">
          {is5StackComplete ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-4 h-4 stroke-[3]" />
              <span className="font-bold">5-Stack Complete & Tournament Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Need <strong>{missingCount}</strong> more player{missingCount > 1 ? 's' : ''} to unlock official tournament buy-in</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!is5StackComplete && onAutoFill5Stack && (
            <button
              onClick={() => {
                sound.playJoinScrim();
                onAutoFill5Stack();
              }}
              className="px-4 py-2 rounded-xl bg-[#A3E635]/15 hover:bg-[#A3E635]/25 border border-[#A3E635]/40 text-[#A3E635] font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-[#A3E635]" />
              <span>Auto-Fill 5-Stack ({missingCount})</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              setIsPoolModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black tracking-wide uppercase transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#A3E635]/20 text-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Browse Solo Grinders ({AVAILABLE_SOLO_GRINDERS.length})</span>
          </button>
        </div>
      </div>

      {/* SOLO GRINDER POOL MODAL */}
      {isPoolModalOpen && (
        <div 
          onClick={() => {
            sound.playClick();
            setIsPoolModalOpen(false);
          }}
          className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-[#0D1018] border border-[#252E44] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left relative overflow-hidden cursor-default my-auto"
          >
            {/* Modal Header */}
            <div className="border-b border-white/[0.08] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 uppercase">
                      SQUAD RADAR POOL
                    </span>
                    <span className="text-xs font-mono text-slate-400">Verified Solo Grinders Active Now</span>
                  </div>
                  <h3 className="text-xl font-black font-display text-white mt-1">
                    RECRUIT TO COMPLETE YOUR 5-STACK
                  </h3>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono font-bold ${is5StackComplete ? 'text-[#A3E635]' : 'text-amber-400'}`}>
                    Current Squad: {currentCount}/5
                  </span>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search player, role, country..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141824] border border-[#242C40] text-white placeholder-slate-500 focus:outline-none focus:border-[#A3E635]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {['all', 'AWPer', 'Entry Fragger', 'Support', 'Anchor', 'Lurker'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 border ${
                        roleFilter === role
                          ? 'bg-[#A3E635] text-slate-950 font-bold border-[#A3E635]'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
                      }`}
                    >
                      {role === 'all' ? 'All Roles' : role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Players Grid */}
            <div className="max-h-[55vh] overflow-y-auto space-y-2.5 pr-1">
              {filteredPool.length > 0 ? (
                filteredPool.map((player) => (
                  <div
                    key={player.id}
                    className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D] hover:border-[#A3E635]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:border-[#A3E635] transition"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-white text-sm group-hover:text-[#A3E635] transition">
                            {player.name}
                          </span>
                          <CountryFlag code={player.countryCode} name={player.countryName} size="xs" />
                          {player.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
                              {player.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                          <span className="text-white font-bold">{player.role}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">Lvl {player.level} ({player.elo} ELO)</span>
                          <span>•</span>
                          <span>Ping: {player.ping}ms</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono">
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">K/D</span>
                          <span className="font-bold text-white">{player.kd}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">ADR</span>
                          <span className="font-bold text-emerald-400">{player.adr}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">HS%</span>
                          <span className="font-bold text-slate-300">{player.hsRate}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRecruitClick(player)}
                        disabled={is5StackComplete}
                        className={`px-4 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                          is5StackComplete
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                            : 'bg-[#A3E635] hover:bg-[#84CC16] text-slate-950 shadow-md shadow-[#A3E635]/20'
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{is5StackComplete ? 'Squad Full' : 'Recruit (+)'}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  No solo grinders match the current filter.
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsPoolModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <div className="text-xs font-mono text-slate-400">
                Clicking <strong>Recruit (+)</strong> immediately links the player to your squad.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
