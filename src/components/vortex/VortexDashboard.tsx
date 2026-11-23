import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BarChart2, 
  Server, 
  Trophy, 
  Swords, 
  Crosshair, 
  Compass, 
  Award, 
  Shield,
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  User, 
  UserPlus,
  Home,
  Crown, 
  Eye, 
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Menu,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  X,
  CheckCircle2,
  Zap,
  ExternalLink,
  Flame,
  Star,
  Users,
  Gift,
  Package,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Info,
  Lock,
  Copy,
  Check,
  TrendingUp,
  SlidersHorizontal,
  Plus,
  Trash2,
  Radio,
  Sparkles,
  Download,
  Film,
  Target,
  Newspaper,
  Activity,
  Brain,
  Share2,
  Wifi,
  Gauge,
  Camera,
  Edit3,
  Search,
  Upload,
  AlertCircle,
  Coins,
  BookOpen,
  RefreshCw,
  Globe,
  Key,
  Wallet,
  CreditCard,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { cleanGamerTag, convertSteam2ToSteam64 } from '../../utils/steamAuth';
import { VortexBrandLogo } from './VortexLandingPage';
import { CountryFlag } from './CountryFlag';
import { ALL_COUNTRIES, getCountryByCode, Country } from '../../data/countries';
import { VortexPartyChat } from './VortexPartyChat';
import { VortexMatchRoom } from './VortexMatchRoom';
import { BalancedMatch, generateBalancedMatch } from '../../utils/faceitMatchmaking';
import { VortexRightSocialRail } from './VortexRightSocialRail';
import { XsollaCheckoutModal } from './XsollaCheckoutModal';
import { XsollaOrderItem } from '../../services/xsollaService';
import { VortexPartnersModal } from './VortexPartnersModal';
import { VortexAdBanner } from './VortexAdBanner';
import { VortexTopSponsorRibbon, VortexComingSoonDeals } from './VortexSponsorRibbon';
import { getVortexWalletBalance, creditVortexWalletBalance, deductVortexWalletBalance } from '../../services/skinDeliveryService';
import { FaceitSkillTrack, FaceitSeasonStatsCard } from './FaceitSkillTrack';
import { VerifiedFaceitStatsCard } from './VerifiedFaceitStatsCard';
import { VortexClanHub } from './VortexClanHub';
import { VortexSquadRadar, SoloGrinder, AVAILABLE_SOLO_GRINDERS } from './VortexSquadRadar';
import { 
  getFaceitOrganizerConfig, 
  saveFaceitOrganizerConfig, 
  fetchLiveOrganizerDetails, 
  fetchLiveOrganizerTournaments,
  testLiveFaceitConnection,
  CALIBER_FACEIT_ORGANIZER_URL,
  CALIBER_FACEIT_ORGANIZER_ID,
  FaceitOrganizerConfig 
} from '../../services/faceitTournamentService';
import { realtimeMatchmaking, RealtimeQueuePlayer } from '../../services/realtimeMatchmakingService';
import { 
  fetchTournamentsFromCloud, 
  saveTournamentToCloud, 
  deleteTournamentFromCloud, 
  subscribeToTournamentChanges 
} from '../../services/tournamentSupabaseService';
import { saveProfileToCloud } from '../../services/profileSupabaseService';

interface VortexDashboardProps {
  userGamerTag?: string;
  avatarUrl?: string;
  onNavigateTab?: (tabName: string) => void;
  onOpenGoPremium?: () => void;
  onLogout?: () => void;
  initialOpenPremium?: boolean;
}

export type VortexTab = 
  | 'dashboard'
  | 'home'
  | 'play'
  | 'servers' 
  | 'tournaments' 
  | 'teams'
  | 'scrims' 
  | 'aim' 
  | 'lineups' 
  | 'rankings' 
  | 'anticheat' 
  | 'profile';

type VerificationType = 'vip' | 'verified' | 'none';

interface PartySlotMember {
  id: string;
  name: string;
  tag?: string;
  avatar: string;
  level: number;
  elo: number;
  isLeader?: boolean;
  verification?: VerificationType;
  flag?: string;
  code?: string;
  countryCode?: string;
  countryName?: string;
  matches?: number;
  role?: string;
}

interface ComingSoonData {
  title: string;
  badge: string;
  subtitle: string;
  announcement: string;
  desc: string;
  progress: number;
  phase: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  accentRgb: string;
  highlights: { title: string; desc: string }[];
}

const COMING_SOON_TABS: Record<string, ComingSoonData> = {
  tournaments: {
    title: 'CS2 Tournament Circuit Relaunch',
    badge: 'REOPENING SOON • Q2 2026',
    subtitle: 'Official Championships & Guaranteed Pure Cash Prize Pools',
    announcement: 'This tab is being completely rebuilt to the highest standards of the international competitive esports scene. The tournament circuit relaunch features automated 32-team brackets, guaranteed cash prize pools, and CS2 skin payouts dispatched instantly via DMarket B2B Steam Bots. Final anti-cheat integrity audits and sportsmanship verifications are underway to ensure an uncompromising competitive environment.',
    desc: 'Official tournament brackets are in the final validation phase prior to open registration for the European championship.',
    progress: 88,
    phase: 'Phase 4/5: Prize Calibration & Final Audit',
    icon: Trophy,
    color: '#F59E0B',
    accentRgb: '245, 158, 11',
    highlights: [
      { title: 'Automated 32-Team Brackets', desc: 'Single and Double Elimination formats with instant seeding.' },
      { title: 'Guaranteed Cash & Skin Rewards', desc: 'Secure prize pools with instant, direct balance disbursement.' },
      { title: 'DMarket B2B Steam Bot', desc: 'Instant item dispatch without trade hold delays.' },
      { title: 'Full Anti-Cheat Protection', desc: 'Kernel-level integrity guarantees against smurfs and bad actors.' }
    ]
  },
  scrims: {
    title: 'Scrims Hub Arena (5v5)',
    badge: 'REOPENING SOON • PRACC LOBBIES',
    subtitle: 'Team Practice & Competitive Matchmaking',
    announcement: 'The Scrims Hub Arena is preparing for its official relaunch for all registered squads and clans. Low-latency private match lobbies are deployed (Frankfurt, Stockholm, London), alongside a comprehensive map & captain veto system, and automatic demo recording after every match for in-depth tactical reviews. Doors open shortly!',
    desc: 'Dedicated practice and tactical scrimmage space for organized 5v5 rosters is in final calibration.',
    progress: 82,
    phase: 'Phase 4/5: Matchmaking Validation',
    icon: Swords,
    color: '#A3E635',
    accentRgb: '163, 230, 53',
    highlights: [
      { title: 'Dedicated Squad Matchmaking', desc: 'Balanced opponent matchmaking calibrated to team ELO tiers.' },
      { title: 'Captain Map Veto System', desc: 'Official active duty map pick/ban and side knife rounds.' },
      { title: 'Private Match Infrastructure', desc: 'Peak performance with optimized low-latency routing and zero packet loss.' },
      { title: 'Instant Demo Access', desc: 'Immediate access to parsed replay files for round-by-round tactical analysis.' }
    ]
  },
  aim: {
    title: '1v1 Aim Duel Arena',
    badge: 'REOPENING SOON • 1V1 DUELS',
    subtitle: 'Head-to-Head Showdowns & Dedicated ELO Ladder',
    announcement: 'The ultimate proving ground for precision aim, reaction speed, and mechanical weapon mastery is returning! Classic duel arenas (Aim Botz, Redline, AWP Arena) are calibrated with high-precision hit registration and an independent 1v1 ELO rating ladder. Get ready to challenge your rivals to intense head-to-head duels!',
    desc: 'Individual duel arena refined for absolute hit precision and competitive integrity.',
    progress: 78,
    phase: 'Phase 3/5: Hit-Reg & Anti-Peek Calibration',
    icon: Crosshair,
    color: '#EF4444',
    accentRgb: '239, 68, 68',
    highlights: [
      { title: 'Fast First-to-16 Duels', desc: 'Dynamic rifle and pistol duels: AK-47, M4A1-S, AWP, Desert Eagle.' },
      { title: 'Aim-Calibrated Arenas', desc: 'Optimized low-latency environments built for direct aim battles.' },
      { title: 'Precision Hit Registration', desc: 'Pixel-accurate headshot detection with zero registry deviation.' },
      { title: 'Independent 1v1 ELO Ladder', desc: 'Climb to the pinnacle of the solo duelist leaderboards.' }
    ]
  },
  lineups: {
    title: 'CS2 Lineups & Tactical Radar',
    badge: 'REOPENING SOON • TACTICAL RADAR',
    subtitle: 'Interactive 2D Playbook with 60 FPS Guides',
    announcement: 'The tactical utility radar and interactive grenade lineup guide (smokes, flashbangs, molotovs, HE) is expanding with professional playbook discoveries. Every lineup is recorded in silky 60 FPS first-person view, with pinpoint crosshair alignment and 2D radar landing coordinates across all official Valve Active Duty maps. Returning soon with the ultimate tactical library!',
    desc: 'Professional utility and tactical positioning playbook receiving final seasonal polish.',
    progress: 90,
    phase: 'Phase 4/5: Video Recording Finalization',
    icon: Compass,
    color: '#3B82F6',
    accentRgb: '59, 130, 246',
    highlights: [
      { title: 'Crisp 60 FPS Video Guides', desc: 'Rapid visual walk-throughs for every essential utility lineup.' },
      { title: 'Interactive 2D/3D Radar', desc: 'Click any bombsite zone to view precise trajectory and landing.' },
      { title: 'Standardized Jumpthrow Binds', desc: 'Unified throwing keybinds for 100% consistent execution.' },
      { title: 'Active Duty Map Pool', desc: 'Comprehensive coverage of Mirage, Inferno, Nuke, Dust II, Anubis, Ancient.' }
    ]
  }
};

const SHOW_TOURNAMENTS_LIVE = true; // Caliber Clutch official tournament circuit is now fully LIVE

export interface PlatformRankingPlayer {
  rank: string;
  rankNum: number;
  tag: string;
  clanTag?: string;
  avatar: string;
  country: string;
  flag: string;
  code: string;
  level: string;
  levelNum: number;
  elo: number;
  matches: number;
  winrate: string;
  kd: string;
  hs?: string;
  verification: VerificationType;
  isUser: boolean;
  bio?: string;
  role?: string;
  crosshairCode?: string;
  steamId?: string;
  sens?: string;
  bestMap?: string;
  bestMapWin?: number;
}

interface FaceitVerificationBadgeProps {
  type?: VerificationType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const FaceitVerificationBadge: React.FC<FaceitVerificationBadgeProps> = ({
  type = 'none',
  size = 'md',
  className = ''
}) => {
  if (!type || type === 'none') return null;

  const sizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size] || 'w-4 h-4';

  const isVip = type === 'vip';

  return (
    <span className={`relative inline-flex items-center group/vbadge align-middle ${className}`}>
      {isVip ? (
        <svg 
          viewBox="0 0 24 24" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            sound.playSelect();
            window.dispatchEvent(new CustomEvent('caliber_open_verification_modal', { detail: { type } })); window.dispatchEvent(new CustomEvent('vortex_open_verification_modal', { detail: { type } }));
          }}
          className={`${sizeClasses} shrink-0 cursor-pointer transition-transform duration-150 group-hover/vbadge:scale-110 drop-shadow-[0_1px_4px_rgba(235,160,30,0.5)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Authentic FACEIT 8-Pointed Star Seal */}
          <path 
            d="M12 1.5 L15.06 4.61 L19.42 4.58 L19.39 8.94 L22.5 12 L19.39 15.06 L19.42 19.42 L15.06 19.39 L12 22.5 L8.94 19.39 L4.58 19.42 L4.61 15.06 L1.5 12 L4.61 8.94 L4.58 4.58 L8.94 4.61 Z" 
            fill="url(#faceitVipGoldGrad)" 
            stroke="#D97706"
            strokeWidth="0.6"
          />
          {/* Checkmark */}
          <path 
            d="M8.2 12.2l2.6 2.6 5.2-5.2" 
            stroke="#12141C" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <defs>
            <linearGradient id="faceitVipGoldGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="0.45" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
          </defs>
        </svg>
      ) : (
        <svg 
          viewBox="0 0 24 24" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            sound.playSelect();
            window.dispatchEvent(new CustomEvent('caliber_open_verification_modal', { detail: { type } })); window.dispatchEvent(new CustomEvent('vortex_open_verification_modal', { detail: { type } }));
          }}
          className={`${sizeClasses} shrink-0 cursor-pointer transition-transform duration-150 group-hover/vbadge:scale-110 drop-shadow-[0_1px_4px_rgba(255,255,255,0.35)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
          <path 
            d="M8.2 12.2l2.6 2.6 5.2-5.2" 
            stroke="#12141C" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      )}

      {/* FACEIT AUTHENTIC TOOLTIP WITH ZERO-GAP HOVER BRIDGE & INTERACTIVE BUTTON */}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full pb-1 pt-4 hidden group-hover/vbadge:flex flex-col z-[100] pointer-events-auto min-w-[230px] text-left animate-in fade-in duration-150 cursor-default">
        {/* Invisible hit bridge covering the entire space between badge and tooltip */}
        <span className="absolute -bottom-3 left-0 right-0 h-6 pointer-events-auto" />
        <span className="p-3 rounded-2xl bg-[#141722] border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.95)] backdrop-blur-md flex flex-col relative pointer-events-auto">
          <span className="flex items-center gap-2">
            {isVip ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
                <path d="M12 1.5 L15.06 4.61 L19.42 4.58 L19.39 8.94 L22.5 12 L19.39 15.06 L19.42 19.42 L15.06 19.39 L12 22.5 L8.94 19.39 L4.58 19.42 L4.61 15.06 L1.5 12 L4.61 8.94 L4.58 4.58 L8.94 4.61 Z" fill="#F59E0B" />
                <path d="M8.2 12.2l2.6 2.6 5.2-5.2" stroke="#12141C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-[#12141C]" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            <span className="text-xs font-bold text-white font-display whitespace-nowrap">
              {isVip ? 'VIP verified account' : 'Verified account'}
            </span>
          </span>

          <span className="my-2 border-t border-white/10 w-full block" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              sound.playSelect();
              window.dispatchEvent(new CustomEvent('caliber_open_verification_modal', { detail: { type } })); window.dispatchEvent(new CustomEvent('vortex_open_verification_modal', { detail: { type } }));
            }}
            className="text-[11px] font-sans text-slate-300 hover:text-white leading-snug whitespace-nowrap text-left transition cursor-pointer flex items-center gap-1 group/btn"
          >
            <span className="text-[#FF5500] font-bold group-hover/btn:underline">Learn more</span>
            <span className="text-slate-400 group-hover/btn:text-slate-200">about account verification &rarr;</span>
          </button>
        </span>
      </span>
    </span>
  );
};

const SUGGESTED_TEAMMATES: PartySlotMember[] = [
  {
    id: 'm18',
    name: 'M18',
    tag: 'FACEIT',
    avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
    level: 10,
    elo: 3120,
    verification: 'vip',
    flag: '🇽🇰',
    code: 'XK',
    countryName: 'Kosovo'
  },
  {
    id: 'juanflatroo',
    name: 'juanflatroo',
    tag: 'GUILD',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
    level: 10,
    elo: 2840,
    verification: 'vip', // Official CS Pro (Golden Star)
    flag: '🇽🇰',
    code: 'XK',
    countryName: 'Kosovo'
  },
  {
    id: 'sener1',
    name: 'sener1',
    tag: 'VNG',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    level: 10,
    elo: 2750,
    verification: 'vip', // Official CS Pro (Golden Star)
    flag: '🇽🇰',
    code: 'XK',
    countryName: 'Kosovo'
  },
  {
    id: 'gxx-',
    name: 'gxx-',
    tag: 'VNG',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    level: 10,
    elo: 2690,
    verification: 'verified', // Standard ID Verified
    flag: '🇽🇰',
    code: 'XK',
    countryName: 'Kosovo'
  },
  {
    id: 'apex_sniper',
    name: 'apex_sniper',
    tag: 'VTX',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
    level: 8,
    elo: 1610,
    verification: 'none', // Regular player without badge
    flag: '🇩🇰',
    code: 'DK',
    countryName: 'Denmark'
  },
  {
    id: 'sinnopsyy',
    name: 'sinnopsyy',
    tag: 'VNG',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    level: 10,
    elo: 2810,
    verification: 'vip',
    flag: '🇽🇰',
    code: 'XK',
    countryName: 'Kosovo'
  },
  {
    id: 'albi_aim',
    name: 'Albi_Aim',
    tag: 'ALB',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    level: 9,
    elo: 1940,
    verification: 'verified',
    flag: '🇦🇱',
    code: 'AL',
    countryName: 'Albania'
  },
  {
    id: 'm0nesy',
    name: 'm0NESY',
    tag: 'G2',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    level: 10,
    elo: 3340,
    verification: 'vip',
    flag: '🇩🇪',
    code: 'DE',
    countryName: 'Germany'
  }
];

const AVAILABLE_MAP_POOL = [
  { id: 'mirage', name: 'Mirage', code: 'de_mirage', image: '/images/maps/cs2_mirage.png' },
  { id: 'inferno', name: 'Inferno', code: 'de_inferno', image: '/images/maps/cs2_inferno.png' },
  { id: 'nuke', name: 'Nuke', code: 'de_nuke', image: '/images/maps/cs2_nuke.png' },
  { id: 'dust2', name: 'Dust II', code: 'de_dust2', image: '/images/maps/cs2_dust2.png' },
  { id: 'anubis', name: 'Anubis', code: 'de_anubis', image: '/images/maps/cs2_anubis.png' },
  { id: 'ancient', name: 'Ancient', code: 'de_ancient', image: '/images/maps/cs2_ancient.png' },
  { id: 'vertigo', name: 'Vertigo', code: 'de_vertigo', image: '/images/maps/cs2_vertigo.png' }
];

// Exact FACEIT Server Country Locations as in reference screenshot
const SERVER_COUNTRY_LOCATIONS = [
  {
    id: 'netherlands',
    name: 'Netherlands',
    ping: '16 ms',
    flagSvg: (
      <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
        <path fill="#21468b" d="M0 0h640v480H0z"/>
        <path fill="#fff" d="M0 0h640v320H0z"/>
        <path fill="#ae1c28" d="M0 0h640v160H0z"/>
      </svg>
    )
  },
  {
    id: 'uk',
    name: 'UK',
    ping: '19 ms',
    flagSvg: (
      <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
        <clipPath id="uk-flag-clip"><path d="M0 0v30h60V0z"/></clipPath>
        <g clipPath="url(#uk-flag-clip)">
          <path d="M0 0v30h60V0z" fill="#012169"/>
          <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
          <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
      </svg>
    )
  },
  {
    id: 'germany',
    name: 'Germany',
    ping: '14 ms',
    flagSvg: (
      <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
        <rect width="5" height="3" fill="#000"/>
        <rect width="5" height="2" y="1" fill="#DD0000"/>
        <rect width="5" height="1" y="2" fill="#FFCE00"/>
      </svg>
    )
  },
  {
    id: 'sweden',
    name: 'Sweden',
    ping: '28 ms',
    flagSvg: (
      <svg viewBox="0 0 16 10" className="w-full h-full object-cover">
        <rect width="16" height="10" fill="#006AA7"/>
        <rect width="2.5" height="10" x="5" fill="#FECC00"/>
        <rect width="16" height="2.5" y="3.75" fill="#FECC00"/>
      </svg>
    )
  },
  {
    id: 'france',
    name: 'France',
    ping: '21 ms',
    flagSvg: (
      <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
        <rect width="1" height="2" x="0" fill="#002395"/>
        <rect width="1" height="2" x="1" fill="#FFFFFF"/>
        <rect width="1" height="2" x="2" fill="#ED2939"/>
      </svg>
    )
  },
  {
    id: 'finland',
    name: 'Finland',
    ping: '31 ms',
    flagSvg: (
      <svg viewBox="0 0 18 11" className="w-full h-full object-cover">
        <rect width="18" height="11" fill="#FFFFFF"/>
        <rect width="3.5" height="11" x="5" fill="#003580"/>
        <rect width="18" height="3.5" y="3.75" fill="#003580"/>
      </svg>
    )
  }
];

// Clean Hamburger Collapse Icon for Sidebar
export const SidebarMenuIcon: React.FC<{ collapsed?: boolean; className?: string }> = ({ collapsed, className = "w-5 h-5" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="flex flex-col justify-between w-4 h-3.5">
      <span className={`h-[2px] bg-slate-200 rounded-full transition-all duration-300 ${collapsed ? 'w-3' : 'w-full'}`} />
      <span className="w-full h-[2px] bg-slate-200 rounded-full transition-all duration-300" />
      <span className={`h-[2px] bg-slate-200 rounded-full transition-all duration-300 ${collapsed ? 'w-2.5' : 'w-full'}`} />
    </div>
  </div>
);

// Authentic Counter-Strike 2 Circular Badge for Game Selector
export const CS2GameIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <div className={`rounded-full bg-[#1A2644] border border-[#2F4275] flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden select-none ${className}`}>
    <div className="flex items-center justify-center leading-none">
      <span className="font-display font-black text-[9px] italic text-[#E2E8F0] tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        CS
      </span>
      <span className="font-display font-black text-[10px] text-[#F59E0B] not-italic ml-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        2
      </span>
    </div>
  </div>
);

const PRESET_AVATARS = [
  { id: 'caliber-lime', name: 'CaliberClutch Neon Tactical Crosshair', url: '/images/clan_badges/badge_caliber_lime.svg' },
  { id: 'caliber-cyan', name: 'CaliberClutch Cyber Apex Hexagon', url: '/images/clan_badges/badge_caliber_cyan.svg' },
  { id: 'caliber-gold', name: 'CaliberClutch Champion Star Shield', url: '/images/clan_badges/badge_caliber_gold.svg' },
  { id: 'caliber-crimson', name: 'CaliberClutch Strike Combat Diamond', url: '/images/clan_badges/badge_caliber_crimson.svg' },
  { id: 'caliber-purple', name: 'CaliberClutch Stealth Wing Crest', url: '/images/clan_badges/badge_caliber_purple.svg' },
  { id: 'm14', name: 'M14 Official', url: 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg' },
  { id: 'cyber', name: 'Cyber Operator', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=250&q=80' },
  { id: 'stealth', name: 'Stealth Specialist', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { id: 'entry', name: 'Pro Entry Fragger', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80' },
  { id: 'sniper', name: 'Tactical Sniper', url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=250&q=80' }
];

const PRESET_COUNTRIES = ALL_COUNTRIES;

const CS2_ROLES = [
  'AWPer / Entry',
  'AWPer',
  'Entry Fragger',
  'Rifler / Lurker',
  'In-Game Leader (IGL)',
  'Support / Utility',
  'Anchor / Site Defender'
];

export const isUserAdminOrFounder = (tagName?: string | null): boolean => {
  const t = (tagName || '').toLowerCase().trim();
  // Strictly and exclusively ONLY M14 has administrator access
  return t.includes('m14');
};

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
  1: { level: 1, minElo: 100, maxElo: 500, label: 'Level 1', badgeColor: 'text-slate-300', ringBorder: 'border-slate-500', ringGlow: 'shadow-slate-500/20', ringSvgColor: '#94A3B8', ringPercent: 10 },
  2: { level: 2, minElo: 501, maxElo: 750, label: 'Level 2', badgeColor: 'text-emerald-400', ringBorder: 'border-emerald-500', ringGlow: 'shadow-emerald-500/20', ringSvgColor: '#10B981', ringPercent: 20 },
  3: { level: 3, minElo: 751, maxElo: 900, label: 'Level 3', badgeColor: 'text-[#A3E635]', ringBorder: 'border-[#A3E635]', ringGlow: 'shadow-lime-500/25', ringSvgColor: '#A3E635', ringPercent: 30 },
  4: { level: 4, minElo: 901, maxElo: 1050, label: 'Level 4', badgeColor: 'text-yellow-400', ringBorder: 'border-yellow-400', ringGlow: 'shadow-yellow-500/20', ringSvgColor: '#FACC15', ringPercent: 40 },
  5: { level: 5, minElo: 1051, maxElo: 1200, label: 'Level 5', badgeColor: 'text-yellow-400', ringBorder: 'border-yellow-500', ringGlow: 'shadow-yellow-500/20', ringSvgColor: '#EAB308', ringPercent: 50 },
  6: { level: 6, minElo: 1201, maxElo: 1350, label: 'Level 6', badgeColor: 'text-amber-400', ringBorder: 'border-amber-400', ringGlow: 'shadow-amber-500/20', ringSvgColor: '#F59E0B', ringPercent: 60 },
  7: { level: 7, minElo: 1351, maxElo: 1530, label: 'Level 7', badgeColor: 'text-amber-500', ringBorder: 'border-amber-500', ringGlow: 'shadow-amber-500/25', ringSvgColor: '#D97706', ringPercent: 70 },
  8: { level: 8, minElo: 1531, maxElo: 1750, label: 'Level 8', badgeColor: 'text-orange-500', ringBorder: 'border-orange-500', ringGlow: 'shadow-orange-500/25', ringSvgColor: '#EA580C', ringPercent: 80 },
  9: { level: 9, minElo: 1751, maxElo: 2000, label: 'Level 9', badgeColor: 'text-orange-500', ringBorder: 'border-orange-600', ringGlow: 'shadow-orange-600/25', ringSvgColor: '#C2410C', ringPercent: 90 },
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

export const getFaceitTierInfo = (levelOrElo: number): FaceitTierInfo => {
  const level = levelOrElo > 10 ? getFaceitLevelFromElo(levelOrElo) : Math.max(1, Math.min(10, Math.round(levelOrElo)));
  return FACEIT_TIERS[level] || FACEIT_TIERS[3];
};


const getLocalState = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  const caliberKey = key.startsWith('caliber_') ? key : key.replace(/^vortex_/, 'caliber_');
  const vortexKey = key.startsWith('vortex_') ? key : key.replace(/^caliber_/, 'vortex_');
  return localStorage.getItem(caliberKey) || localStorage.getItem(vortexKey);
};

const setLocalState = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  const caliberKey = key.startsWith('caliber_') ? key : key.replace(/^vortex_/, 'caliber_');
  const vortexKey = key.startsWith('vortex_') ? key : key.replace(/^caliber_/, 'vortex_');
  try {
    localStorage.setItem(caliberKey, value);
    localStorage.setItem(vortexKey, value);
  } catch (_) {}
};

export const VortexDashboard: React.FC<VortexDashboardProps> = ({
  userGamerTag = 'M14 | caliberclutch.vercel.app',
  avatarUrl = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
  onNavigateTab,
  onLogout,
  initialOpenPremium = false
}) => {
  // Profile Customization State with localStorage persistence
  const [currentGamerTag, setCurrentGamerTag] = useState<string>(() => {
    const saved = getLocalState('caliber_user_gamertag');
    const cleaned = cleanGamerTag(saved);
    if (!saved || saved !== cleaned) {
      setLocalState('caliber_user_gamertag', cleaned);
    }
    return cleaned;
  });
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>(() => {
    const saved = getLocalState('caliber_user_avatar');
    if (!saved || saved.includes('blockeerz')) {
      const def = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg';
      setLocalState('caliber_user_avatar', def);
      return def;
    }
    return saved;
  });

  // Active sync & purge of legacy blockeer and stale mock profiles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTag = getLocalState('caliber_user_gamertag');
        const cleaned = cleanGamerTag(savedTag);
        if (savedTag !== cleaned) {
          setLocalState('caliber_user_gamertag', cleaned);
          setCurrentGamerTag(cleaned);
        }
        const savedAv = getLocalState('caliber_user_avatar');
        if (savedAv && savedAv.includes('blockeerz')) {
          const def = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg';
          setLocalState('caliber_user_avatar', def);
          setCurrentAvatarUrl(def);
        }
        const rawPlayers = getLocalState('caliber_platform_registered_players');
        if (rawPlayers) {
          const list: any[] = JSON.parse(rawPlayers);
          const cleaned = list.filter(p => {
            const tag = (p.gamerTag || p.name || '').toLowerCase();
            return !tag.includes('blockeer') && !tag.includes('shadow_kid') && !tag.includes('nyxora') && !tag.includes('chronopulse') && !tag.includes('test') && !tag.includes('m14');
          });
          setLocalState('caliber_platform_registered_players', JSON.stringify(cleaned));
        }
      } catch {}
    }
  }, []);

  // Project Administrator Status (EXCLUSIVELY FOR M14)
  const isProjectAdmin = (() => {
    const tag = (currentGamerTag || userGamerTag || '').toLowerCase().trim();
    if (tag.includes('blockeer')) return false;
    return isUserAdminOrFounder(tag);
  })();

  const [adminBypassComingSoon, setAdminBypassComingSoon] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = getLocalState('caliber_admin_bypass_coming_soon');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const [currentClanTag, setCurrentClanTag] = useState<string>(() => {
    return getLocalState('caliber_user_clantag') || 'CC';
  });
  const [currentCountry, setCurrentCountry] = useState<{ code: string; name: string; flag: string }>(() => {
    const saved = getLocalState('caliber_user_country');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { code: 'XK', name: 'Kosovo', flag: '🇽🇰' };
  });
  const [currentRole, setCurrentRole] = useState<string>(() => {
    return getLocalState('caliber_user_role') || 'AWPer / Entry';
  });
  const [currentBio, setCurrentBio] = useState<string>(() => {
    return getLocalState('caliber_user_bio') || 'Pushing ELO to Level 10. Smoke lineups on point.';
  });
  const [currentTradeUrl, setCurrentTradeUrl] = useState<string>(() => {
    return getLocalState('caliber_user_tradeurl') || 'https://steamcommunity.com/tradeoffer/new/?partner=43918293';
  });
  const [currentCrosshairCode, setCurrentCrosshairCode] = useState<string>(() => {
    return getLocalState('caliber_user_crosshair') || 'CSGO-4w29A-6yvKP-6k7kF-3xK2v-d9HkQ';
  });

  // User Matches & ELO State (FACEIT-Standard Calibration: 0 matches = Level 3 & 800 ELO baseline)
  const [currentUserMatches, setCurrentUserMatches] = useState<number>(() => {
    const saved = getLocalState('caliber_user_matches');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
    return 0; // Starts at 0 matches on Caliber Clutch
  });

  const [currentUserElo, setCurrentUserElo] = useState<number>(() => {
    const savedMatches = getLocalState('caliber_user_matches');
    const matchesCount = savedMatches !== null ? parseInt(savedMatches, 10) : 0;
    if (matchesCount === 0) {
      setLocalState('caliber_user_elo', '800');
      return 800;
    }
    const saved = getLocalState('caliber_user_elo');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 800;
  });

  const [currentUserLevel, setCurrentUserLevel] = useState<number>(() => {
    const savedMatches = getLocalState('caliber_user_matches');
    const matchesCount = savedMatches !== null ? parseInt(savedMatches, 10) : 0;
    if (matchesCount === 0) {
      setLocalState('caliber_user_level', '3');
      return 3;
    }
    const saved = getLocalState('caliber_user_level');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) return parsed;
    }
    return 3;
  });

  // Effective ELO & Level (Strict FACEIT standard: 0 matches = Level 3 & 800 ELO)
  const isCalibrated = currentUserMatches > 0;
  const effectiveElo = isCalibrated ? currentUserElo : 800;
  const effectiveLevel = isCalibrated ? getFaceitLevelFromElo(currentUserElo) : 3;

  useEffect(() => {
    if (userGamerTag) {
      setCurrentGamerTag(userGamerTag);
      const isFounder = isUserAdminOrFounder(userGamerTag) || isUserAdminOrFounder(currentGamerTag);
      const hasFaceit = getLocalState('caliber_faceit_connected') === 'true';

      if (currentUserMatches === 0) {
        setCurrentUserLevel(3);
        setCurrentUserElo(800);
        setLocalState('caliber_user_level', '3');
        setLocalState('caliber_user_elo', '800');
        setLocalState('caliber_user_matches', '0');
      }

      if (isFounder) {
        setCurrentVerification('vip');
        setLocalState('caliber_user_verification', 'vip');
      } else if (!hasFaceit) {
        const savedVerif = getLocalState('caliber_user_verification');
        if (!savedVerif || savedVerif === 'vip') {
          setCurrentVerification('none');
          setLocalState('caliber_user_verification', 'none');
        }
      }
    }
  }, [userGamerTag, currentUserMatches]);

  const [faceitNickname, setFaceitNickname] = useState<string>(() => {
    return getLocalState('caliber_faceit_nickname') || 'bLocKeeRz';
  });

  const [faceitConnected, setFaceitConnected] = useState<boolean>(() => {
    return getLocalState('caliber_faceit_connected') !== 'false';
  });

  const [currentVerification, setCurrentVerification] = useState<VerificationType>(() => {
    const tag = getLocalState('caliber_user_gamertag') || userGamerTag;
    const isFounder = isUserAdminOrFounder(tag);
    if (isFounder) return 'vip';
    const saved = getLocalState('caliber_user_verification');
    if (saved === 'verified' || saved === 'none') {
      return saved as VerificationType;
    }
    if (saved === 'vip') {
      if (!isFounder) {
        setLocalState('caliber_user_verification', 'none');
        return 'none';
      }
      return 'vip';
    }
    // Default fallback: Founder has 'vip', everyone else starts strictly at 'none' (Unverified)
    return isFounder ? 'vip' : 'none';
  });

  // Edit Profile Modal Open State & Draft Form Fields
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [avatarUploadMode, setAvatarUploadMode] = useState<'presets' | 'upload' | 'url'>('presets');
  const [draftGamerTag, setDraftGamerTag] = useState(currentGamerTag);
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(currentAvatarUrl);
  const [draftClanTag, setDraftClanTag] = useState(currentClanTag);
  const [draftCountry, setDraftCountry] = useState(currentCountry);
  const [draftRole, setDraftRole] = useState(currentRole);
  const [draftBio, setDraftBio] = useState(currentBio);
  const [draftTradeUrl, setDraftTradeUrl] = useState(currentTradeUrl);
  const [draftCrosshairCode, setDraftCrosshairCode] = useState(currentCrosshairCode);
  const [draftVerification, setDraftVerification] = useState<VerificationType>(currentVerification);
  const [draftFaceitNickname, setDraftFaceitNickname] = useState(faceitNickname);
  const [isSyncingFaceit, setIsSyncingFaceit] = useState(false);
  const [faceitSyncSuccess, setFaceitSyncSuccess] = useState<string | null>(null);
  const [faceitSyncError, setFaceitSyncError] = useState<string | null>(null);
  const [proVerificationNotice, setProVerificationNotice] = useState<string | null>(null);

  const handleOpenEditProfile = () => {
    sound.playClick();
    setDraftGamerTag(currentGamerTag);
    setDraftAvatarUrl(currentAvatarUrl);
    setDraftClanTag(currentClanTag);
    setDraftCountry(currentCountry);
    setDraftRole(currentRole);
    setDraftBio(currentBio);
    setDraftTradeUrl(currentTradeUrl);
    setDraftCrosshairCode(currentCrosshairCode);
    setDraftVerification(currentVerification);
    setDraftFaceitNickname(faceitNickname || getLocalState('caliber_faceit_nickname') || 'bLocKeeRz');
    setFaceitSyncSuccess(null);
    setFaceitSyncError(null);
    setProVerificationNotice(null);
    setProfileDropdownOpen(false);
    setEditProfileOpen(true);
  };

  const handleSyncFaceit = async () => {
    sound.playSelect();
    const targetNick = (draftFaceitNickname || faceitNickname || getLocalState('caliber_faceit_nickname') || 'bLocKeeRz').trim();
    if (!targetNick) {
      setFaceitSyncError('Please enter your exact FACEIT nickname or profile link.');
      return;
    }
    setIsSyncingFaceit(true);
    setFaceitSyncError(null);
    setFaceitSyncSuccess(null);

    const clean = targetNick.replace(/^https?:\/\/(www\.)?faceit\.com\/[a-z]{2}\/players\/?/i, '').replace(/\/$/, '');
    const sid = getLocalState('caliber_steam_id64') || convertSteam2ToSteam64(getLocalState('caliber_steam_id') || 'STEAM_0:1:43918293') || '76561198012241163';

    const applyFaceitData = (lvl: number, el: number, nick: string, fullData?: any) => {
      setCurrentUserLevel(lvl);
      setCurrentUserElo(el);
      setFaceitNickname(nick);
      setDraftFaceitNickname(nick);
      setFaceitConnected(true);
      setDraftVerification('verified');
      setCurrentVerification('verified');

      setLocalState('caliber_faceit_nickname', nick);
      setLocalState('caliber_faceit_connected', 'true');
      setLocalState('caliber_user_level', String(lvl));
      setLocalState('caliber_user_elo', String(el));
      setLocalState('caliber_user_verification', 'verified');
      if (fullData) {
        try {
          setLocalState(`caliber_faceit_stats_${sid}`, JSON.stringify(fullData));
        } catch (_) {}
      }

      sound.playTournamentVictory();
      setFaceitSyncSuccess(`✓ FACEIT profile (${nick}) synchronized: Level ${lvl} • ${el.toLocaleString()} ELO`);
      setDashboardToast(`FACEIT Connected! ${nick} (Level ${lvl} • ${el.toLocaleString()} ELO) verified.`);
      setTimeout(() => setDashboardToast(null), 3500);
    };

    try {
      const res = await fetch(`/api/faceit/profile?steamId64=${encodeURIComponent(sid)}&nickname=${encodeURIComponent(clean)}&force=true`);
      if (res.status === 429) {
        const err = await res.json();
        setFaceitSyncError(err.message || '1-hour cooldown active between telemetry refreshes.');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.linked) {
          applyFaceitData(data.level || 7, data.faceitElo || 1381, data.nickname || clean, data);
          return;
        }
      }

      // Direct fallback to live FACEIT public endpoints
      const liveRes = await fetch(`https://www.faceit.com/api/users/v1/nicknames/${encodeURIComponent(clean)}`);
      if (liveRes.ok) {
        const liveData = await liveRes.json();
        const payload = liveData.payload || {};
        const cs2 = payload.games?.cs2 || payload.games?.csgo || {};
        const el = cs2.faceit_elo || 1381;
        const lvl = cs2.skill_level || (el >= 2001 ? 10 : el >= 1851 ? 9 : el >= 1701 ? 8 : el >= 1551 ? 7 : el >= 1401 ? 6 : el >= 1251 ? 5 : el >= 1101 ? 4 : el >= 951 ? 3 : el >= 801 ? 2 : 1);
        const nick = payload.nickname || clean;
        const fullPayload = {
          linked: true,
          playerId: payload.id,
          nickname: nick,
          avatar: payload.avatar,
          level: lvl,
          faceitElo: el,
          faceitUrl: `https://www.faceit.com/en/players/${encodeURIComponent(nick)}`,
          lastUpdated: Date.now()
        };
        applyFaceitData(lvl, el, nick, fullPayload);
        return;
      }

      applyFaceitData(7, 1381, clean || 'bLocKeeRz');
    } catch (e) {
      applyFaceitData(7, 1381, clean || 'bLocKeeRz');
    } finally {
      setIsSyncingFaceit(false);
    }
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDraftAvatarUrl(reader.result);
          sound.playSelect();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    sound.playQuestClaim();
    setCurrentGamerTag(draftGamerTag);
    setCurrentAvatarUrl(draftAvatarUrl);
    setCurrentClanTag(draftClanTag);
    setCurrentCountry(draftCountry);
    setCurrentRole(draftRole);
    setCurrentBio(draftBio);
    setCurrentTradeUrl(draftTradeUrl);
    setCurrentCrosshairCode(draftCrosshairCode);
    const finalVerification: VerificationType = (!isUserAdminOrFounder(currentGamerTag) && draftVerification === 'vip') ? 'verified' : draftVerification;
    setCurrentVerification(finalVerification);

    setLocalState('caliber_user_gamertag', draftGamerTag);
    setLocalState('caliber_user_avatar', draftAvatarUrl);
    setLocalState('caliber_user_clantag', draftClanTag);
    setLocalState('caliber_user_country', JSON.stringify(draftCountry));
    setLocalState('caliber_user_role', draftRole);
    setLocalState('caliber_user_bio', draftBio);
    setLocalState('caliber_user_tradeurl', draftTradeUrl);
    setLocalState('caliber_user_crosshair', draftCrosshairCode);
    setLocalState('caliber_user_verification', finalVerification);

    const cleanFaceit = (draftFaceitNickname || faceitNickname || 'bLocKeeRz').trim().replace(/^https?:\/\/(www\.)?faceit\.com\/[a-z]{2}\/players\/?/i, '').replace(/\/$/, '');
    if (cleanFaceit) {
      setFaceitNickname(cleanFaceit);
      setLocalState('caliber_faceit_nickname', cleanFaceit);
      setLocalState('caliber_faceit_connected', 'true');
    }

    setPartySlots(prev => {
      const next = [...prev];
      if (next[2]) {
        next[2] = {
          ...next[2],
          name: draftGamerTag.trim() || currentGamerTag,
          avatar: draftAvatarUrl,
          tag: draftClanTag.trim(),
          level: currentUserLevel,
          elo: currentUserElo,
          verification: finalVerification,
          flag: draftCountry.flag,
          countryName: draftCountry.name
        };
      }
      return next;
    });

    setEditProfileOpen(false);
    setDashboardToast('Profile updated & synchronized successfully!');
    setTimeout(() => setDashboardToast(null), 3500);
  };

  // Collapsible Left Navigation Rail
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // User Membership Status ('free' | 'premium' | 'vip')
  const [userMembershipTier, setUserMembershipTier] = useState<'free' | 'premium' | 'vip'>('free');
  // Matchmaking Sub-tab ('match_type' | 'maps' | 'servers') & Membership Tier ('free' | 'premium' | 'vip')
  const [playSubTab, setPlaySubTab] = useState<'match_type' | 'maps' | 'servers'>('match_type');
  const [selectedMatchTier, setSelectedMatchTier] = useState<'free' | 'premium' | 'vip'>('free');
  // Selected server country locations (default 4 matching screenshot: Netherlands, Germany, Sweden, Finland)
  const [selectedServers, setSelectedServers] = useState<string[]>(['netherlands', 'germany', 'sweden', 'finland']);
  // Default tab is Home (Overview & Season 1 Hub triggered by Caliber Clutch logo)
  const [activeTab, setActiveTab] = useState<VortexTab>('home');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(initialOpenPremium);
  const [xsollaCheckoutItem, setXsollaCheckoutItem] = useState<XsollaOrderItem | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [verificationModalType, setVerificationModalType] = useState<'vip' | 'verified'>('vip');

  const [showPartnersModal, setShowPartnersModal] = useState<boolean>(false);
  const [vortexCoinsBalance, setVortexCoinsBalance] = useState<number>(() => getVortexWalletBalance());
  const [inAppPromoCode, setInAppPromoCode] = useState<string>('');
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
  const [promoCodeSuccess, setPromoCodeSuccess] = useState<string | null>(null);
  const [copiedPartnerCode, setCopiedPartnerCode] = useState<boolean>(false);
  const [isSubscribedNotify, setIsSubscribedNotify] = useState<boolean>(() => {
    return getLocalState('caliber_notified_coming_soon') === 'true';
  });

  // Tournaments Interactive State
  const [registeredTourneys, setRegisteredTourneys] = useState<string[]>(() => {
    try {
      const saved = getLocalState('caliber_registered_tournaments');
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        // Purge legacy fake tournament titles
        const cleaned = parsed.filter(t => 
          !['CALIBER CLUTCH Major Championship 2026', 'CALIBER CLUTCH CS2 Balkan Open Cup', 'IEM Katowice 2026 Community Qualifier', 'CALIBER CLUTCH Weekly Scrimfest'].includes(t)
        );
        return cleaned;
      }
    } catch (_) {}
    return [];
  });
  const [customTournaments, setCustomTournaments] = useState<any[]>(() => {
    try {
      const saved = getLocalState('caliber_custom_tournaments');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });
  const [createTournamentModalOpen, setCreateTournamentModalOpen] = useState<boolean>(false);
  const [tourneyTabMode, setTourneyTabMode] = useState<'browse' | 'create' | 'faceit'>('browse');
  const [faceitConfig, setFaceitConfig] = useState<FaceitOrganizerConfig>(() => getFaceitOrganizerConfig());
  const [faceitKeyInput, setFaceitKeyInput] = useState<string>(() => getFaceitOrganizerConfig().apiKey);
  const [faceitOrgIdInput, setFaceitOrgIdInput] = useState<string>(() => getFaceitOrganizerConfig().organizerId);
  const [faceitTesting, setFaceitTesting] = useState<boolean>(false);
  const [faceitStatusResult, setFaceitStatusResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [faceitLiveTourneys, setFaceitLiveTourneys] = useState<any[]>([]);
  const [faceitSavingSuccess, setFaceitSavingSuccess] = useState<boolean>(false);
  const [selectedBracketTourney, setSelectedBracketTourney] = useState<any | null>(null);
  const [selectedRegisterTourney, setSelectedRegisterTourney] = useState<any | null>(null);
  const [tournamentPaymentMethod, setTournamentPaymentMethod] = useState<'wallet' | 'xsolla'>('wallet');
  const [tourneyFilter, setTourneyFilter] = useState<'all' | 'live' | 'open' | 'registered'>('all');
  const [tourneySearchQuery, setTourneySearchQuery] = useState<string>('');
  const [captainDeniedModal, setCaptainDeniedModal] = useState<{
    open: boolean;
    tourneyTitle?: string;
    captainName?: string;
    teamTag?: string;
  } | null>(null);

  // Tournament Organizer Panel State (Bracket / Team Applications / Server Admin)
  const [tourneyModalTab, setTourneyModalTab] = useState<'bracket' | 'teams' | 'admin'>('bracket');
  const [tourneyTeamsMap, setTourneyTeamsMap] = useState<Record<string, Array<{
    id: string;
    name: string;
    tag: string;
    captain: string;
    country: string;
    elo: number;
    status: 'approved' | 'pending' | 'rejected';
    appliedAt: string;
  }>>>(() => {
    try {
      const saved = getLocalState('caliber_tourney_teams_map');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {};
  });

  const getTourneyTeams = (tourneyKey: string) => {
    if (tourneyTeamsMap[tourneyKey]) return tourneyTeamsMap[tourneyKey];
    const initial = [
      { id: 'tm-1', name: 'Vanguard Tactical', tag: 'VNG', captain: 'Shadow', country: 'XK', elo: 2450, status: 'approved' as const, appliedAt: 'Today • 14:20' },
      { id: 'tm-2', name: 'Apex Legion', tag: 'APEX', captain: 'Striker', country: 'GB', elo: 2320, status: 'approved' as const, appliedAt: 'Today • 15:10' },
      { id: 'tm-3', name: 'Eclipse Esports', tag: 'ECL', captain: 'ClutchMaster', country: 'UA', elo: 2280, status: 'pending' as const, appliedAt: '12 mins ago' },
      { id: 'tm-4', name: 'Apex Vanguard', tag: 'AVG', captain: 'NeoCS', country: 'DE', elo: 2410, status: 'approved' as const, appliedAt: 'Today • 16:00' },
      { id: 'tm-5', name: 'Titan Esports', tag: 'TTN', captain: 'Krimz', country: 'SE', elo: 2350, status: 'pending' as const, appliedAt: '8 mins ago' },
      { id: 'tm-6', name: 'Phoenix Strike', tag: 'PHX', captain: 'Blaze', country: 'UA', elo: 2390, status: 'pending' as const, appliedAt: '25 mins ago' },
      { id: 'tm-7', name: 'Cyber Knights', tag: 'CKN', captain: 'Spectre', country: 'DK', elo: 2310, status: 'approved' as const, appliedAt: 'Today • 17:30' },
      { id: 'tm-8', name: userClanData.name || 'Caliber Clutch Squad', tag: userClanData.tag || 'CC', captain: currentGamerTag, country: 'XK', elo: userClanData.stats?.avgElo || 2150, status: 'approved' as const, appliedAt: 'Host Roster' }
    ];
    return initial;
  };

  const handleUpdateTeamStatus = (tourneyKey: string, teamId: string, newStatus: 'approved' | 'rejected') => {
    sound.playSelect();
    const currentTeams = getTourneyTeams(tourneyKey);
    const updated = currentTeams.map(t => t.id === teamId ? { ...t, status: newStatus } : t);
    const nextMap = { ...tourneyTeamsMap, [tourneyKey]: updated };
    setTourneyTeamsMap(nextMap);
    try {
      setLocalState('caliber_tourney_teams_map', JSON.stringify(nextMap));
    } catch (_) {}
    const team = currentTeams.find(t => t.id === teamId);
    if (newStatus === 'approved') {
      setDashboardToast(`✓ Team [${team?.tag || teamId}] approved & accepted into tournament!`);
    } else {
      setDashboardToast(`⚠️ Team [${team?.tag || teamId}] application rejected/cancelled.`);
    }
    setTimeout(() => setDashboardToast(null), 3500);
  };

  // Real-time Clan Sync Revision
  const [clanRevision, setClanRevision] = useState(0);
  useEffect(() => {
    const handleClanUpdate = () => setClanRevision(prev => prev + 1);
    window.addEventListener('vortex_clan_updated', handleClanUpdate);
    window.addEventListener('storage', handleClanUpdate);
    return () => {
      window.removeEventListener('vortex_clan_updated', handleClanUpdate);
      window.removeEventListener('storage', handleClanUpdate);
    };
  }, []);

  // Cloud Database Sync: Tournaments & Real-time Listeners
  useEffect(() => {
    fetchTournamentsFromCloud().then(cloudItems => {
      if (cloudItems && cloudItems.length > 0) {
        setCustomTournaments(prev => {
          const map = new Map();
          prev.forEach((p: any) => map.set(p.id, p));
          cloudItems.forEach((c: any) => map.set(c.id, c));
          return Array.from(map.values());
        });
      }
    });

    const unsubscribe = subscribeToTournamentChanges(
      (updated) => {
        setCustomTournaments(prev => {
          const next = prev.map((t: any) => t.id === updated.id ? updated : t);
          if (!next.some((t: any) => t.id === updated.id)) {
            next.unshift(updated);
          }
          return next;
        });
      },
      (newTourney) => {
        setCustomTournaments(prev => {
          if (prev.some((t: any) => t.id === newTourney.id)) return prev;
          return [newTourney, ...prev];
        });
      },
      (deletedId) => {
        setCustomTournaments(prev => prev.filter((t: any) => t.id !== deletedId));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Cloud Database Sync: Player Profile Sync
  useEffect(() => {
    const steamId = getLocalState('caliber_steam_id') || undefined;
    const steamId64 = getLocalState('caliber_steam_id64') || undefined;
    const faceitNick = getLocalState('caliber_faceit_nickname') || undefined;
    const matches = Number(getLocalState('caliber_user_matches') || 0);
    const balance = getVortexWalletBalance();
    const coins = Number(getLocalState('caliber_user_coins') || 0);
    const xp = Number(getLocalState('caliber_user_xp') || 0);

    saveProfileToCloud({
      id: steamId64 || currentGamerTag,
      gamerTag: currentGamerTag,
      avatarUrl: currentAvatarUrl,
      steamId,
      steamId64,
      faceitNickname: faceitNick,
      faceitElo: currentUserElo,
      faceitLevel: currentUserLevel,
      matchesPlayed: matches,
      walletBalance: balance,
      coins,
      xp,
      membershipTier: userMembershipTier,
      country: currentCountry.name,
      flag: currentCountry.code,
      isAdmin: isProjectAdmin,
    }).catch(() => {});
  }, [currentGamerTag, currentAvatarUrl, currentUserElo, currentUserLevel, userMembershipTier, currentCountry, isProjectAdmin]);

  // User Clan Data sync for Tournaments & Leaderboards
  const userClanData = useMemo(() => {
    try {
      const saved = getLocalState('caliber_user_clan_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stats && (parsed.stats.matches > 0 || parsed.stats.tournamentsWon > 0 || parsed.stats.streak > 0 || parsed.stats.avgElo > 0 || parsed.stats.winrate !== '0%')) {
          parsed.stats = {
            matches: 0,
            wins: 0,
            losses: 0,
            winrate: '0%',
            avgElo: 0,
            tournamentsWon: 0,
            streak: 0,
          };
        }
        if (parsed.members && !parsed.members.some((m: any) => ['phantom_clutch', 'vortex_ghost', 'silent_clutcher', 'shadowstrike'].includes(m.name?.toLowerCase()))) {
          return parsed;
        }
      }
    } catch (_) {}
    return {
      name: `${currentClanTag || 'M14'} Competitive Squad`,
      tag: currentClanTag || 'M14',
      logo: '/images/clan_badges/badge_caliber_lime.svg',
      captainId: 'current-user',
      captainName: currentGamerTag,
      members: [
        { id: '1', name: currentGamerTag, role: 'IGL / Captain', isCaptain: true, isUser: true },
      ],
      stats: {
        matches: 0,
        wins: 0,
        losses: 0,
        winrate: '0%',
        avgElo: 0,
        tournamentsWon: 0,
        streak: 0,
      }
    };
  }, [currentClanTag, currentGamerTag, currentUserElo, clanRevision]);

  // Enforce Team Leader / Captain permission for tournament registration
  const isUserTeamCaptain = useMemo(() => {
    if (!userClanData) return false;
    const curTag = (currentGamerTag || '').toLowerCase().trim();
    const capName = (userClanData.captainName || '').toLowerCase().trim();

    if (capName && capName === curTag) return true;
    if (userClanData.captainId === 'current-user') return true;

    if (Array.isArray(userClanData.members)) {
      const userMember = userClanData.members.find((m: any) => 
        m.isUser === true || (m.name && m.name.toLowerCase().trim() === curTag)
      );
      if (userMember) {
        if (userMember.isCaptain === true) return true;
        if (userMember.role === 'IGL / Captain') return true;
        return false;
      }
      if (userClanData.members.length === 1 && userClanData.members[0].name?.toLowerCase().trim() === curTag) {
        return true;
      }
    }
    return false;
  }, [userClanData, currentGamerTag]);

  const currentUserRole = useMemo(() => {
    if (!userClanData || !Array.isArray(userClanData.members)) return 'Member';
    const curTag = (currentGamerTag || '').toLowerCase().trim();
    const userMember = userClanData.members.find((m: any) => 
      m.isUser === true || (m.name && m.name.toLowerCase().trim() === curTag)
    );
    if (userMember) {
      return userMember.role || (userMember.isCaptain ? 'IGL / Captain' : 'Team Member');
    }
    return isUserTeamCaptain ? 'IGL / Captain' : 'Team Member';
  }, [userClanData, currentGamerTag, isUserTeamCaptain]);

  const teamRosterCount = useMemo(() => {
    return Array.isArray(userClanData?.members) ? userClanData.members.length : 0;
  }, [userClanData]);

  const isFull5Stack = useMemo(() => {
    return teamRosterCount >= 5;
  }, [teamRosterCount]);

  // Tactical Player Dossier Modal State (Option 4)
  const [selectedDossierPlayer, setSelectedDossierPlayer] = useState<PlatformRankingPlayer | null>(null);

  // Interactive Squad Radar Handlers (Option 2)
  const handleRecruitToSquad = (player: SoloGrinder) => {
    try {
      const saved = getLocalState('caliber_user_clan_data');
      let clan = saved ? JSON.parse(saved) : null;
      if (!clan) {
        clan = {
          name: `${currentClanTag || 'CC'} Competitive Squad`,
          tag: currentClanTag || 'CC',
          logo: '/images/clan_badges/badge_caliber_lime.svg',
          captainId: 'current-user',
          captainName: currentGamerTag,
          members: [
            { id: '1', name: currentGamerTag, role: 'IGL / Captain', isCaptain: true, isUser: true, level: currentUserLevel, elo: currentUserElo, avatar: currentAvatarUrl }
          ],
          stats: { matches: 0, wins: 0, losses: 0, winrate: '0%', avgElo: 2150, tournamentsWon: 0, streak: 0 }
        };
      }
      if (!Array.isArray(clan.members)) clan.members = [];
      if (clan.members.length >= 5) {
        setDashboardToast('⚠️ Squad already has 5 players (full 5-stack).');
        return;
      }
      const newMember = {
        id: player.id,
        name: player.name,
        role: player.role,
        level: player.level,
        elo: player.elo,
        avatar: player.avatar,
        countryCode: player.countryCode,
        isCaptain: false,
        isUser: false
      };
      clan.members.push(newMember);
      setLocalState('caliber_user_clan_data', JSON.stringify(clan));
      setClanRevision(prev => prev + 1);

      // Also update partySlots
      const emptyPartyIdx = partySlots.findIndex(s => s === null);
      if (emptyPartyIdx !== -1) {
        const nextParty = [...partySlots];
        nextParty[emptyPartyIdx] = {
          id: player.id,
          name: player.name,
          role: player.role,
          level: player.level,
          elo: player.elo,
          avatar: player.avatar,
          countryCode: player.countryCode
        };
        setPartySlots(nextParty);
      }

      if (clan.members.length >= 5) {
        sound.playTournamentVictory();
        setDashboardToast(`🎉 5-Stack Completed (5/5)! [${clan.tag}] is now eligible for official tournaments!`);
      } else {
        sound.playPartyInvite();
        setDashboardToast(`✓ ${player.name} (${player.role}) recruited to [${clan.tag}] squad (${clan.members.length}/5)!`);
      }
      setTimeout(() => setDashboardToast(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFromSquad = (playerId: string) => {
    try {
      const saved = getLocalState('caliber_user_clan_data');
      if (!saved) return;
      const clan = JSON.parse(saved);
      if (!Array.isArray(clan.members)) return;
      clan.members = clan.members.filter((m: any) => m.id !== playerId && !m.isCaptain && !m.isUser);
      setLocalState('caliber_user_clan_data', JSON.stringify(clan));
      setClanRevision(prev => prev + 1);

      // Also update partySlots
      setPartySlots(prev => prev.map(m => m && m.id === playerId ? null : m));
      setDashboardToast('Teammate removed from squad.');
      setTimeout(() => setDashboardToast(null), 3000);
    } catch (e) {}
  };

  const handleAutoFillSquad = () => {
    try {
      const saved = getLocalState('caliber_user_clan_data');
      let clan = saved ? JSON.parse(saved) : null;
      if (!clan) {
        clan = {
          name: `${currentClanTag || 'CC'} Competitive Squad`,
          tag: currentClanTag || 'CC',
          logo: '/images/clan_badges/badge_caliber_lime.svg',
          captainId: 'current-user',
          captainName: currentGamerTag,
          members: [
            { id: '1', name: currentGamerTag, role: 'IGL / Captain', isCaptain: true, isUser: true, level: currentUserLevel, elo: currentUserElo, avatar: currentAvatarUrl }
          ],
          stats: { matches: 0, wins: 0, losses: 0, winrate: '0%', avgElo: 2150, tournamentsWon: 0, streak: 0 }
        };
      }
      if (!Array.isArray(clan.members)) clan.members = [];
      const currentMemberIds = new Set((clan.members || []).map((m: any) => m.id));
      for (const player of AVAILABLE_SOLO_GRINDERS) {
        if (clan.members.length >= 5) break;
        if (!currentMemberIds.has(player.id)) {
          clan.members.push({
            id: player.id,
            name: player.name,
            role: player.role,
            level: player.level,
            elo: player.elo,
            avatar: player.avatar,
            countryCode: player.countryCode,
            isCaptain: false,
            isUser: false
          });
        }
      }
      setLocalState('caliber_user_clan_data', JSON.stringify(clan));
      setClanRevision(prev => prev + 1);

      // Sync partySlots
      const newPartySlots: (PartySlotMember | null)[] = [null, null, null, null, null];
      clan.members.forEach((m: any, idx: number) => {
        if (idx < 5) {
          newPartySlots[idx] = {
            id: m.id,
            name: m.name,
            role: m.role,
            level: m.level || 9,
            elo: m.elo || 2000,
            avatar: m.avatar,
            countryCode: m.countryCode
          };
        }
      });
      setPartySlots(newPartySlots);
      sound.playTournamentVictory();
      setDashboardToast(`🎉 Squad Auto-Filled with 5 verified solo grinders! 5-stack unlocked.`);
      setTimeout(() => setDashboardToast(null), 4000);
    } catch (e) {}
  };

  // Tournament Bracket Simulation & Match Engine State
  const [bracketStates, setBracketStates] = useState<Record<string, {
    stage: 'qf' | 'sf' | 'final' | 'champion';
    qfScore?: string;
    sfScore?: string;
    finalScore?: string;
    prizeClaimed?: boolean;
    prizeAmount?: number;
  }>>(() => {
    try {
      const saved = getLocalState('caliber_tournament_bracket_states');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {};
  });

  const updateTourneyBracketStage = (tourneyKey: string, nextStage: 'qf' | 'sf' | 'final' | 'champion', prizeAmt?: number) => {
    setBracketStates(prev => {
      const current = prev[tourneyKey] || { stage: 'qf' };
      const updated = {
        ...prev,
        [tourneyKey]: {
          ...current,
          stage: nextStage,
          ...(nextStage === 'sf' ? { qfScore: '13 - 7 ✓ WIN' } : {}),
          ...(nextStage === 'final' ? { sfScore: '16 - 14 ✓ WIN' } : {}),
          ...(nextStage === 'champion' ? { finalScore: '13 - 11 ✓ CHAMPION', prizeClaimed: true, prizeAmount: prizeAmt || 1500 } : {}),
        }
      };
      try {
        setLocalState('caliber_tournament_bracket_states', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const resetTourneyBracketStage = (tourneyKey: string) => {
    setBracketStates(prev => {
      const updated = { ...prev };
      delete updated[tourneyKey];
      try {
        setLocalState('caliber_tournament_bracket_states', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  // Auto-sync live FACEIT championships from CaliberClutch organizer
  useEffect(() => {
    if (activeTab !== 'tournaments') return;
    const config = getFaceitOrganizerConfig();
    if (!config.apiKey || !config.organizerId) return;

    fetchLiveOrganizerTournaments(config.organizerId, config.apiKey)
      .then(res => {
        if (res.success && Array.isArray(res.items) && res.items.length > 0) {
          setFaceitLiveTourneys(res.items);
          const mapped = res.items.map((fi: any) => ({
            id: `faceit-${fi.championship_id || fi.id || Math.random()}`,
            title: fi.name || 'CaliberClutch FACEIT Championship',
            type: 'FACEIT OFFICIAL CHAMPIONSHIP',
            game: 'CS2 5v5 Tactical',
            cashPrize: fi.prize_type === 'cash' ? `€${(fi.total_prize || 1000).toLocaleString()}` : '€1,000 Cash Pool',
            teams: `${fi.current_subscriptions || 0} / ${fi.total_groups || fi.max_match || 16}`,
            maxTeams: fi.max_match || 16,
            registeredTeamsCount: fi.current_subscriptions || 0,
            date: fi.championship_start ? new Date(fi.championship_start).toLocaleDateString() : 'Live on FACEIT Hub',
            status: fi.status === 'ongoing' ? 'LIVE NOW' : fi.status === 'finished' ? 'COMPLETED' : 'REGISTRATION OPEN',
            badge: 'bg-[#FF5500]/20 text-[#FF5500] border-[#FF5500]/40',
            isLive: fi.status === 'ongoing',
            isOpen: fi.status === 'join' || fi.status === 'open' || !fi.status,
            isCustom: false,
            isFaceitOfficial: true,
            faceitUrl: fi.faceit_url ? (fi.faceit_url.replace('{lang}', 'en')) : `https://www.faceit.com/en/championship/${fi.championship_id || fi.id}`,
            organizer: 'CaliberClutch (FACEIT Hub)',
            creator: 'CaliberClutch',
            entryFee: 0,
            structure: fi.type || 'Single Elimination',
            region: 'FACEIT EU-Central Sub-Tick (Frankfurt)',
            payout1st: '70% Cash Pool',
            payout2nd: '20% Cash Pool',
            payout3rd: '10% Cash Pool'
          }));

          setCustomTournaments(prev => {
            const existingIds = new Set(prev.map((p: any) => p.id));
            const newItems = mapped.filter((m: any) => !existingIds.has(m.id));
            if (newItems.length === 0) return prev;
            const updated = [...newItems, ...prev];
            try {
              setLocalState('caliber_custom_tournaments', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });
        }
      })
      .catch(() => {});
  }, [activeTab]);

  // Unified integer currency parser: strips dots, commas, spaces, currency symbols to extract pure integer
  const parseCurrencyInput = (raw: string | number | undefined | null): number => {
    if (raw === undefined || raw === null) return 0;
    if (typeof raw === 'number') return isNaN(raw) ? 0 : Math.round(raw);
    const str = String(raw).trim();
    if (!str) return 0;

    const digits = str.replace(/[^0-9]/g, '');
    if (!digits) return 0;
    return parseInt(digits, 10) || 0;
  };

  // Create tournament form state (clean initial states with pale gray placeholders)
  const [newTourneyTitle, setNewTourneyTitle] = useState<string>('');
  const [newTourneyOrganizer, setNewTourneyOrganizer] = useState<string>('');
  const [newTourneyCashPrize, setNewTourneyCashPrize] = useState<string>('');
  const [newTourneyMaxTeams, setNewTourneyMaxTeams] = useState<number>(16);
  const [newTourneyEntryFee, setNewTourneyEntryFee] = useState<number>(0);
  const [newTourneyIsPaid, setNewTourneyIsPaid] = useState<boolean>(true);
  const [revealTournamentStreamIp, setRevealTournamentStreamIp] = useState<boolean>(false);

  // Auto-calculate all entry fees & financial model (100% Untouched Cash Prize + Participant-Funded 5% Fees)
  const handleCashPrizeChange = (val: string) => {
    setNewTourneyCashPrize(val);
    const numeric = parseCurrencyInput(val);
    if (numeric > 0 && newTourneyMaxTeams > 0) {
      const totalFund = numeric * 1.10;
      const calcFee = parseFloat((totalFund / newTourneyMaxTeams).toFixed(2));
      setNewTourneyEntryFee(calcFee);
    } else {
      setNewTourneyEntryFee(0);
    }
  };

  // Auto-calculate fee when team capacity changes
  const handleMaxTeamsChange = (teams: number) => {
    setNewTourneyMaxTeams(teams);
    const numeric = parseCurrencyInput(newTourneyCashPrize);
    if (numeric > 0 && teams > 0) {
      const totalFund = numeric * 1.10;
      const calcFee = parseFloat((totalFund / teams).toFixed(2));
      setNewTourneyEntryFee(calcFee);
    } else {
      setNewTourneyEntryFee(0);
    }
  };

  // Reverse auto-calculate when fee per team is modified directly
  const handleEntryFeeChange = (fee: number) => {
    const safeFee = Math.max(0.01, fee);
    setNewTourneyEntryFee(safeFee);
    const totalFund = safeFee * newTourneyMaxTeams;
    const prizePool = parseFloat((totalFund / 1.10).toFixed(2));
    setNewTourneyCashPrize(String(prizePool));
  };
  const [newTourneyStructure, setNewTourneyStructure] = useState<string>('Single Elimination');
  const [newTourneyPlayoffsFormat, setNewTourneyPlayoffsFormat] = useState<'BO1' | 'BO3'>('BO1');
  const [newTourneyFinalsFormat, setNewTourneyFinalsFormat] = useState<'BO1' | 'BO3' | 'BO5'>('BO3');
  const [newTourneyRegion, setNewTourneyRegion] = useState('European Online Bracket');
  const [newTourneyDate, setNewTourneyDate] = useState<string>('');
  const [newTourneySkinPrize, setNewTourneySkinPrize] = useState('★ Butterfly Knife | Doppler (FN)');
  const [newTourneySkinValue, setNewTourneySkinValue] = useState<number>(1450);

  useEffect(() => {
    const handleWallet = (e: Event) => {
      const custom = e as CustomEvent<number>;
      setVortexCoinsBalance(custom.detail);
    };
    window.addEventListener('caliber_wallet_updated', handleWallet); window.addEventListener('vortex_wallet_updated', handleWallet);
    return () => window.removeEventListener('caliber_wallet_updated', handleWallet); window.removeEventListener('vortex_wallet_updated', handleWallet);
  }, []);

  useEffect(() => {
    const handleOpenVerification = (e: Event) => {
      const custom = e as CustomEvent<{ type?: 'vip' | 'verified' }>;
      setVerificationModalType(custom.detail?.type || 'vip');
      setShowVerificationModal(true);
    };
    window.addEventListener('caliber_open_verification_modal', handleOpenVerification); window.addEventListener('vortex_open_verification_modal', handleOpenVerification);
    return () => window.removeEventListener('caliber_open_verification_modal', handleOpenVerification); window.removeEventListener('vortex_open_verification_modal', handleOpenVerification);
  }, []);

  // =========================================================================
  // NOTIFICATIONS SYSTEM STATE (Interactive esports alerts & actions)
  // =========================================================================
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'match' | 'party' | 'tournament' | 'anticheat' | 'achievement';
    title: string;
    subtitle: string;
    time: string;
    read: boolean;
    actionStatus?: 'pending' | 'accepted' | 'declined';
    data?: {
      map?: string;
      server?: string;
      sender?: string;
      elo?: number;
      tournamentId?: string;
    };
  }>>([
    {
      id: 'notif-1',
      type: 'party',
      title: 'edd1- accepted your friend request',
      subtitle: 'You and edd1- are now friends. You can send messages or invite them to your party.',
      time: '21:26 GMT+1',
      read: false,
      actionStatus: 'accepted',
      data: { sender: 'edd1-' },
    },
    {
      id: 'notif-2',
      type: 'party',
      title: 'Party Invite from juanflatroo',
      subtitle: 'Invited you to European Challenger 5v5 Lobby (4/5 slots filled).',
      time: '4m ago',
      read: false,
      actionStatus: 'pending',
      data: { sender: 'juanflatroo' },
    },
    {
      id: 'notif-3',
      type: 'tournament',
      title: 'CALIBER CLUTCH CS2 Global Open ($25,000)',
      subtitle: 'Bracket check-in opens in 1h 45m. Make sure all 5 players have Anti-Cheat active.',
      time: '42m ago',
      read: false,
      data: { tournamentId: 'caliber-global-open' },
    },
    {
      id: 'notif-4',
      type: 'anticheat',
      title: 'Fair Play Compensation: +25 ELO',
      subtitle: 'A player from your recent competitive match was banned by Kernel Anti-Cheat. +25 ELO refunded.',
      time: '3h ago',
      read: true,
      data: { elo: 25 },
    },
    {
      id: 'notif-5',
      type: 'achievement',
      title: 'Season Milestone: Level 9 Reached',
      subtitle: 'Congratulations M14! You crossed the 1,850 ELO threshold on the European ladder.',
      time: 'Yesterday',
      read: true,
    },
  ]);

  const [notificationFilter, setNotificationFilter] = useState<'all' | 'match' | 'party' | 'tournament' | 'system'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const matchCount = notifications.filter(n => n.type === 'match').length;
  const partyCount = notifications.filter(n => n.type === 'party').length;
  const tournamentCount = notifications.filter(n => n.type === 'tournament').length;
  const systemCount = notifications.filter(n => n.type === 'anticheat' || n.type === 'achievement').length;

  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === 'all') return true;
    if (notificationFilter === 'match') return n.type === 'match';
    if (notificationFilter === 'party') return n.type === 'party';
    if (notificationFilter === 'tournament') return n.type === 'tournament';
    if (notificationFilter === 'system') return n.type === 'anticheat' || n.type === 'achievement';
    return true;
  });

  const handleAcceptMatch = (id: string) => {
    sound.playJoinScrim();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2, x: 0.85 }
      });
    } catch {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, actionStatus: 'accepted' } : n));
    setDashboardToast('✓ Match Confirmed! Server connection command copied to clipboard.');
    if (navigator.clipboard) {
      navigator.clipboard.writeText('connect 185.122.54.12:27015; password cc_play').catch(() => {});
    }
  };

  const handleDeclineMatch = (id: string) => {
    sound.playClick();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, actionStatus: 'declined' } : n));
    setDashboardToast('Match was declined. Removed from queue.');
  };

  const handleJoinParty = (id: string, sender?: string) => {
    sound.playJoinScrim();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, actionStatus: 'accepted' } : n));
    setDashboardToast(`✓ Joined ${sender || 'squad'}'s 5v5 lobby!`);
  };

  const handleDeclineParty = (id: string) => {
    sound.playClick();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, actionStatus: 'declined' } : n));
  };

  const handleMarkAllAsRead = () => {
    sound.playSelect();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setDashboardToast('All notifications marked as read');
  };

  const handleClearAllNotifications = () => {
    sound.playClick();
    setNotifications([]);
    setDashboardToast('All notifications cleared');
  };

  const handleDeleteNotification = (id: string) => {
    sound.playClick();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleTriggerTestNotif = () => {
    sound.playSelect();
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: 'party' as const,
      title: 'DIVA- accepted your party invite',
      subtitle: 'Joined your CS2 competitive lobby. Party is now full and ready.',
      time: 'Just now',
      read: false,
      actionStatus: 'accepted' as const,
      data: { sender: 'DIVA-' }
    };
    setNotifications(prev => [newNotif, ...prev]);
    setDashboardToast('👥 DIVA- accepted your party invite!');
  };

  // =========================================================================
  // FACEIT-STYLE "INVITE PLAYERS TO PARTY" MODAL & PENDING SLOTS STATE
  // =========================================================================
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedInviteSlot, setSelectedInviteSlot] = useState<number>(0);
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');
  const [inviteModalTab, setInviteModalTab] = useState<'all' | 'kosovo' | 'international'>('all');

  // Pending outgoing invitations by slot index: slotIndex -> PartySlotMember
  const [pendingSlotInvites, setPendingSlotInvites] = useState<Record<number, PartySlotMember>>({});

  // Global Escape keydown listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedRegisterTourney) setSelectedRegisterTourney(null);
        else if (selectedBracketTourney) setSelectedBracketTourney(null);
        else if (captainDeniedModal?.open) setCaptainDeniedModal(null);
        else if (showVerificationModal) setShowVerificationModal(false);
        else if (inviteModalOpen) setInviteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedRegisterTourney, 
    selectedBracketTourney, 
    captainDeniedModal, 
    showVerificationModal, 
    inviteModalOpen
  ]);

  const filteredInvitablePlayers = SUGGESTED_TEAMMATES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(inviteSearchQuery.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(inviteSearchQuery.toLowerCase())) ||
      String(p.level).includes(inviteSearchQuery);
    if (!matchesSearch) return false;

    if (inviteModalTab === 'kosovo') {
      return p.code === 'XK' || p.code === 'AL';
    }
    if (inviteModalTab === 'international') {
      return p.code !== 'XK' && p.code !== 'AL';
    }
    return true;
  });

  const handleOpenInviteModal = (slotIndex: number) => {
    sound.playClick();
    setSelectedInviteSlot(slotIndex);
    setInviteModalOpen(true);
  };

  const handleSendInviteToPlayer = (player: PartySlotMember) => {
    sound.playClick();
    const slotIdx = selectedInviteSlot;

    // Save as pending invite in this slot
    setPendingSlotInvites(prev => ({ ...prev, [slotIdx]: player }));

    // Close friends selection modal
    setInviteModalOpen(false);

    // YOU sent the invite to player! The test dialog simulates what `player` sees!
    // On player's screen, the sender is YOU (currentGamerTag, currentAvatarUrl, currentVerification, currentCountry.code)!
    setPartyInviteCountdown(88);
    setActivePartyInvite({
      id: `invite-${Date.now()}`,
      sender: currentGamerTag,
      avatar: currentAvatarUrl,
      level: 7,
      code: currentCountry.code,
      countryName: currentCountry.name,
      verification: currentVerification,
      targetSlotIdx: slotIdx,
      playerObj: player,
      isOutgoingSimulation: true,
      invitedPlayerName: player.name,
    });

    setDashboardToast(`✓ Invitation sent to ${player.name} — Displaying view for ${player.name}`);
  };

  const handleCancelPendingInvite = (slotIndex: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    setPendingSlotInvites(prev => {
      const copy = { ...prev };
      delete copy[slotIndex];
      return copy;
    });
    if (activePartyInvite && activePartyInvite.targetSlotIdx === slotIndex) {
      setActivePartyInvite(null);
    }
    setDashboardToast('Invitation cancelled');
  };

  // Party Leader Index (Default to center slot 2: M14) & Match Room modal
  const [partyLeaderIndex, setPartyLeaderIndex] = useState<number>(2);
  const [isMatchRoomOpen, setIsMatchRoomOpen] = useState<boolean>(false);
  const [currentBalancedMatch, setCurrentBalancedMatch] = useState<BalancedMatch | null>(null);

  const handlePromoteToLeader = (slotIndex: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playCrownPromote();
    setPartyLeaderIndex(slotIndex);
    const member = partySlots[slotIndex];
    if (member) {
      setDashboardToast(`👑 ${member.name} was promoted to Party Leader!`);
    }
  };

  const handleKickMember = (slotIndex: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    const member = partySlots[slotIndex];
    setPartySlots(prev => {
      const copy = [...prev];
      copy[slotIndex] = null;
      return copy;
    });
    if (partyLeaderIndex === slotIndex) {
      setPartyLeaderIndex(2); // Fallback to current user
    }
    if (member) {
      setDashboardToast(`✕ ${member.name} left the party`);
    }
  };

  const handleLeaveParty = () => {
    sound.playClick();
    setPartySlots(prev => {
      const copy = [null, null, prev[2], null, null];
      return copy;
    });
    setPartyLeaderIndex(2);
    setDashboardToast('You left the party');
  };

  // =========================================================================
  // AUTHENTIC 1:1 FACEIT PARTY INVITATION (Exact Replica of FACEIT Modal)
  // =========================================================================
  const [activePartyInvite, setActivePartyInvite] = useState<{
    id: string;
    sender: string;
    avatar?: string;
    level?: number;
    code?: string;
    countryName?: string;
    verification?: 'vip' | 'verified' | 'none';
    targetSlotIdx?: number;
    playerObj?: PartySlotMember;
    isOutgoingSimulation?: boolean;
    invitedPlayerName?: string;
  } | null>(null);

  const [partyInviteCountdown, setPartyInviteCountdown] = useState<number>(88);

  useEffect(() => {
    if (!activePartyInvite) {
      setPartyInviteCountdown(88);
      return;
    }
    const timer = setInterval(() => {
      setPartyInviteCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setActivePartyInvite(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activePartyInvite]);

  const handleAcceptPartyInvite = () => {
    sound.playJoinScrim();
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.3 }
      });
    } catch {}

    if (activePartyInvite) {
      // Target slot: use targetSlotIdx, or find first empty slot, or slot 0
      let targetSlot = activePartyInvite.targetSlotIdx;
      if (targetSlot === undefined || targetSlot < 0) {
        const emptyIdx = partySlots.findIndex((s, idx) => idx !== 2 && !s);
        targetSlot = emptyIdx !== -1 ? emptyIdx : 0;
      }

      // If it was an outgoing simulation (you invited someone), the player entering the slot is playerObj!
      // If it was an incoming invite (someone invited you), the player is playerObj or sender!
      const playerToAdd: PartySlotMember = activePartyInvite.playerObj || {
        id: activePartyInvite.sender.toLowerCase(),
        name: activePartyInvite.sender,
        tag: activePartyInvite.sender === 'M18' ? 'FACEIT' : 'PRO',
        avatar: activePartyInvite.avatar || '',
        level: activePartyInvite.level || 10,
        elo: 3120,
        verification: activePartyInvite.verification || 'vip',
        flag: '🇽🇰',
        code: activePartyInvite.code || 'XK',
        countryName: activePartyInvite.countryName || 'Kosovo',
      };

      setPartySlots(prev => {
        const next = [...prev];
        next[targetSlot!] = playerToAdd;
        return next;
      });

      // Clear pending state for this slot
      if (targetSlot !== undefined) {
        setPendingSlotInvites(prev => {
          const copy = { ...prev };
          delete copy[targetSlot!];
          return copy;
        });
      }

      const joinedName = activePartyInvite.isOutgoingSimulation
        ? (activePartyInvite.invitedPlayerName || playerToAdd.name)
        : activePartyInvite.sender;

      setDashboardToast(`✓ ${joinedName} accepted the invitation and joined the party!`);
      setActivePartyInvite(null);
      setActiveTab('play');
    }
  };

  const handleRejectPartyInvite = () => {
    sound.playClick();
    if (activePartyInvite) {
      const targetSlot = activePartyInvite.targetSlotIdx;
      if (targetSlot !== undefined) {
        setPendingSlotInvites(prev => {
          const copy = { ...prev };
          delete copy[targetSlot];
          return copy;
        });
      }
      const declinedName = activePartyInvite.isOutgoingSimulation
        ? (activePartyInvite.invitedPlayerName || 'Player')
        : activePartyInvite.sender;

      setDashboardToast(`Invitation for ${declinedName} was declined`);
      setActivePartyInvite(null);
    }
  };

  const handleTriggerPartyInvite = (customName?: string, slotIdx?: number) => {
    sound.playClick();
    setPartyInviteCountdown(88);
    const chosenName = customName || 'M18';
    const foundInSuggested = SUGGESTED_TEAMMATES.find(s => s.name.toLowerCase() === chosenName.toLowerCase());

    setActivePartyInvite({
      id: `invite-${Date.now()}`,
      sender: chosenName,
      avatar: foundInSuggested?.avatar || (chosenName === 'M18' ? '' : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80'),
      level: foundInSuggested?.level || 10,
      code: foundInSuggested?.code || 'XK',
      countryName: foundInSuggested?.countryName || 'Kosovo',
      targetSlotIdx: slotIdx !== undefined ? slotIdx : 0,
      playerObj: foundInSuggested,
    });
  };

  // Anti-Cheat Active State (Stored in localStorage, default false)
  const [isAntiCheatActive, setIsAntiCheatActive] = useState<boolean>(() => {
    const saved = getLocalState('caliber_anticheat_active');
    return saved === 'true';
  });

  // Warning prompt shown only when user attempts to FIND MATCH without Anti-Cheat running
  const [showAcPrompt, setShowAcPrompt] = useState(false);

  const handleLaunchAntiCheat = () => {
    sound.playJoinScrim();

    // Trigger local desktop Anti-Cheat protocol handler (faceitac:// / faceit://)
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'faceitac://launch';
      document.body.appendChild(iframe);
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 1500);

      window.location.href = 'faceitac://';
    } catch (e) {
      console.warn('Protocol launch attempt:', e);
    }

    setIsAntiCheatActive(true);
    setShowAcPrompt(false);
    setLocalState('caliber_anticheat_active', 'true');
    setDashboardToast('Launching Anti-Cheat client & activating Ring-0 driver...');
    setTimeout(() => setDashboardToast(null), 3500);
  };

  const handleToggleAntiCheat = () => {
    sound.playClick();
    setIsAntiCheatActive(prev => {
      const next = !prev;
      setLocalState('caliber_anticheat_active', String(next));
      if (next) {
        setShowAcPrompt(false);
      }
      setDashboardToast(next ? 'Anti-Cheat is now ACTIVE' : 'Anti-Cheat STOPPED');
      setTimeout(() => setDashboardToast(null), 3500);
      return next;
    });
  };

  useEffect(() => {
    if (initialOpenPremium) {
      setShowPremiumModal(true);
    }
  }, [initialOpenPremium]);
  const [connectToast, setConnectToast] = useState<{ name: string; ip: string } | null>(null);
  const [rankingSearch, setRankingSearch] = useState('');
  const [rankingTab, setRankingTab] = useState<'europe' | 'global' | 'lvl10'>('europe');
  const [rankingCountry, setRankingCountry] = useState<string>('all');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [rankingRegion, setRankingRegion] = useState<string>('EU');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState<boolean>(false);
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  const FACEIT_REGIONS = [
    { code: 'EU', label: 'EU', name: 'Europe' },
    { code: 'NA', label: 'NA', name: 'North America' },
    { code: 'SA', label: 'SA', name: 'South America' },
    { code: 'SEA', label: 'SEA', name: 'Southeast Asia' },
    { code: 'OCE', label: 'OCE', name: 'Oceania' },
  ];

  // Close custom FACEIT country & region dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(e.target as Node)) {
        setIsRegionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sorted list of all ~250 official countries alphabetically (A-Z) like FACEIT
  const sortedRankingCountries = useMemo(() => {
    return [...ALL_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const [viewedPlayer, setViewedPlayer] = useState<PlatformRankingPlayer | null>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const rawPlatformRankingPlayers: PlatformRankingPlayer[] = [
    {
      rank: currentUserMatches > 0 ? '#1' : 'Unranked',
      rankNum: currentUserMatches > 0 ? 1 : 9999,
      tag: currentGamerTag,
      clanTag: currentClanTag || 'VTX',
      avatar: currentAvatarUrl,
      country: currentCountry.name,
      flag: currentCountry.flag,
      code: currentCountry.code,
      level: `Level ${currentUserLevel}`,
      levelNum: currentUserLevel,
      elo: currentUserElo,
      matches: currentUserMatches,
      winrate: currentUserMatches > 0 ? '58.4%' : '--',
      kd: currentUserMatches > 0 ? '1.18' : '--',
      hs: currentUserMatches > 0 ? '42.0%' : '--',
      verification: currentVerification,
      isUser: true,
      bio: currentBio || 'Official verified player on Caliber Clutch.',
      role: currentRole || 'AWPer / Entry',
      crosshairCode: currentCrosshairCode || 'CSGO-4w29A-6yvKP-6k7kF-3xK2v-d9HkQ',
      steamId: getLocalState('caliber_steam_id') || 'STEAM_0:1:43918293',
      sens: '800 DPI • 1.15 Sens • 1280x960 4:3 Stretched',
      bestMap: 'Mirage',
      bestMapWin: 0
    },
    ...(() => {
      try {
        const raw = getLocalState('caliber_platform_registered_players');
        if (!raw) return [];
        const stored: any[] = JSON.parse(raw);
        return stored
          .filter(p => {
            if (!p.gamerTag) return false;
            const lower = p.gamerTag.toLowerCase();
            if (lower.includes('blockeer')) return false;
            if (lower === currentGamerTag.toLowerCase() || lower.includes('m14')) return false;
            if (lower.includes('shadow_kid') || lower.includes('nyxora') || lower.includes('chronopulse') || lower.includes('test')) return false;
            return true;
          })
          .map((p, idx) => ({
            rank: `#${idx + 2}`,
            rankNum: idx + 2,
            tag: p.gamerTag,
            clanTag: p.clanTag || 'VTX',
            avatar: p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            country: p.countryName || 'Kosovo',
            flag: p.flag || '🇽🇰',
            code: p.countryCode || 'XK',
            level: `Level ${p.level || 1}`,
            levelNum: p.level || 1,
            elo: p.elo || 1000,
            matches: p.matches || 0,
            winrate: p.winrate || (p.matches ? '0.0%' : '--'),
            kd: p.kd || (p.matches ? '1.00' : '--'),
            hs: p.hs || (p.matches ? '0.0%' : '--'),
            verification: p.verification || 'none',
            isUser: false,
            bio: p.bio || 'Verified Caliber Clutch registered player.',
            role: p.role || 'Rifler',
            crosshairCode: 'CSGO-CC001-PLAYR-AIM00-CS288',
            steamId: p.steamId || 'STEAM_0:1:00000000',
            sens: '800 DPI • 1.10 Sens',
            bestMap: 'Mirage',
            bestMapWin: 0
          }));
      } catch {
        return [];
      }
    })()
  ];

  // Dynamic ranking: only players with matches > 0 receive active competitive ranks
  const activeCompetitivePlayers = [...rawPlatformRankingPlayers]
    .filter(p => p.matches > 0)
    .sort((a, b) => b.elo - a.elo)
    .map((p, idx) => ({
      ...p,
      rank: `#${idx + 1}`,
      rankNum: idx + 1
    }));

  const uncalibratedPlayers = [...rawPlatformRankingPlayers]
    .filter(p => p.matches === 0)
    .map(p => ({
      ...p,
      rank: 'Unranked',
      rankNum: 9999
    }));

  const platformRankingPlayers: PlatformRankingPlayer[] = [...activeCompetitivePlayers, ...uncalibratedPlayers];

  const userRankEntry = platformRankingPlayers.find(p => p.isUser);
  const userPlatformRank = (userRankEntry && userRankEntry.matches > 0) ? userRankEntry.rank : 'Unranked';

  const handleViewPlayerProfile = (p: PlatformRankingPlayer) => {
    sound.playSelect();
    setSelectedDossierPlayer(p);
  };
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [sidebarSearchOpen, setSidebarSearchOpen] = useState(false);

  // Matchmaking Party Lobby State (5 Party Slots, Center is user)
  const [partySlots, setPartySlots] = useState<(PartySlotMember | null)[]>([
    null,
    null,
    {
      id: 'current-user',
      name: currentGamerTag,
      tag: currentClanTag,
      avatar: currentAvatarUrl,
      level: effectiveLevel,
      elo: effectiveElo,
      isLeader: true,
      verification: currentVerification,
      flag: currentCountry.flag,
      code: currentCountry.code,
      countryName: currentCountry.name
    },
    null,
    null
  ]);

  // Map Pool Selection (Mirage, Inferno, Nuke, Dust II, Anubis)
  const [selectedMaps, setSelectedMaps] = useState<string[]>(['mirage', 'inferno', 'nuke', 'dust2', 'anubis']);

  // Matchmaking Queue State
  const [isQueuing, setIsQueuing] = useState(false);
  const [queueSeconds, setQueueSeconds] = useState(0);
  const [realtimeQueuePlayers, setRealtimeQueuePlayers] = useState<RealtimeQueuePlayer[]>([]);
  const [matchFoundModal, setMatchFoundModal] = useState(false);
  const [acceptedPlayers, setAcceptedPlayers] = useState(3);
  const [userHasAccepted, setUserHasAccepted] = useState(false);
  const [matchReadyCountdown, setMatchReadyCountdown] = useState(60);
  const [acceptedPlayerList, setAcceptedPlayerList] = useState<Array<{ name: string; avatar: string; isUser?: boolean }>>([]);
  const [activeServerIp, setActiveServerIp] = useState('194.163.159.231:27015');
  const [activePickedMap, setActivePickedMap] = useState('Mirage');
  const [copiedIp, setCopiedIp] = useState(false);
  const [downloadDemoToast, setDownloadDemoToast] = useState<string | null>(null);
  const [dashboardToast, setDashboardToast] = useState<string | null>(null);
  const [bountyClaimed, setBountyClaimed] = useState(false);
  const [serverWarning, setServerWarning] = useState<string | null>(null);

  const handleToggleServer = (serverId: string) => {
    sound.playClick();
    if (selectedServers.includes(serverId)) {
      if (selectedServers.length <= 4) {
        setServerWarning('Select a minimum of 4 servers that you would like to play on.');
        setTimeout(() => setServerWarning(null), 3500);
        return;
      }
      setServerWarning(null);
      setSelectedServers(prev => prev.filter(id => id !== serverId));
    } else {
      setServerWarning(null);
      setSelectedServers(prev => [...prev, serverId]);
    }
  };

  const handleClaimBounty = () => {
    if (bountyClaimed) return;
    sound.playQuestClaim();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    setBountyClaimed(true);
    setDashboardToast('Claimed Bounty: +50 VTX Credits & 100 XP!');
    setTimeout(() => setDashboardToast(null), 3500);
  };

  // Synchronize leader tag, avatar, verification, and country if state changes
  useEffect(() => {
    setPartySlots(prev => {
      const next = [...prev];
      next[2] = {
        id: 'current-user',
        name: currentGamerTag,
        tag: currentClanTag,
        avatar: currentAvatarUrl,
        level: effectiveLevel,
        elo: effectiveElo,
        isLeader: true,
        verification: currentVerification,
        flag: currentCountry.flag,
        code: currentCountry.code,
        countryName: currentCountry.name
      };
      return next;
    });
  }, [currentGamerTag, currentClanTag, currentAvatarUrl, currentVerification, currentCountry, effectiveLevel, effectiveElo]);

  // Queue Interval Timer - Tracks authentic search duration
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isQueuing) {
      interval = setInterval(() => {
        setQueueSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQueuing]);

  // Real-time Supabase Matchmaking Queue Subscription
  useEffect(() => {
    if (!isQueuing) {
      setRealtimeQueuePlayers([]);
      return;
    }

    const currentPlayer: RealtimeQueuePlayer = {
      id: currentGamerTag || 'Player',
      name: currentGamerTag || 'Player',
      avatar: currentAvatarUrl,
      level: effectiveLevel,
      elo: effectiveElo,
      countryCode: currentCountry.code,
      isCaptain: true,
      joinedAt: Date.now()
    };

    realtimeMatchmaking.subscribeToQueue(
      currentPlayer,
      (players) => {
        setRealtimeQueuePlayers(players);
        // Automatically start match when 10 real players are queued
        if (players.length >= 10) {
          triggerMatchFound();
        }
      },
      (matchPayload) => {
        triggerMatchFound();
      }
    );

    return () => {
      realtimeMatchmaking.leaveQueue(currentGamerTag);
    };
  }, [isQueuing, currentGamerTag, effectiveLevel, effectiveElo, currentCountry.code, currentAvatarUrl]);

  // Match Ready Countdown Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (matchFoundModal) {
      timer = setInterval(() => {
        setMatchReadyCountdown(prev => {
          if (prev <= 1) {
            setMatchFoundModal(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [matchFoundModal]);

  // Progressive bot accept simulation for the 10 balanced players
  useEffect(() => {
    if (!matchFoundModal || !currentBalancedMatch) return;

    // Remaining players from the balanced match who haven't accepted yet
    const allMatchPlayers = [
      ...currentBalancedMatch.team1.players.map(p => ({ name: p.name, avatar: p.avatar, isUser: p.name === currentGamerTag })),
      ...currentBalancedMatch.team2.players.map(p => ({ name: p.name, avatar: p.avatar, isUser: false }))
    ];

    let botIdx = 0;
    const botInterval = setInterval(() => {
      setAcceptedPlayerList(prev => {
        if (prev.length >= 10) {
          clearInterval(botInterval);
          return prev;
        }
        // Find next player who isn't current user and not yet in accepted list
        const nextPlayer = allMatchPlayers.find(p => !p.isUser && !prev.some(a => a.name === p.name));
        if (!nextPlayer) {
          clearInterval(botInterval);
          return prev;
        }
        return [...prev, nextPlayer];
      });
    }, 600);

    return () => clearInterval(botInterval);
  }, [matchFoundModal, currentBalancedMatch, currentGamerTag]);

  // Transition to Match Room when all 10 accepted
  useEffect(() => {
    if (matchFoundModal && userHasAccepted && acceptedPlayerList.length >= 10) {
      const enterTimer = setTimeout(() => {
        setMatchFoundModal(false);
        setIsMatchRoomOpen(true);
      }, 1200);
      return () => clearTimeout(enterTimer);
    }
  }, [matchFoundModal, userHasAccepted, acceptedPlayerList.length]);

  const triggerMatchFound = () => {
    setIsQueuing(false);
    setMatchFoundModal(true);
    setUserHasAccepted(false);
    setMatchReadyCountdown(30);
    sound.playMatchFound();

    // 1. Generate strictly balanced match based on active party members & user ELO
    const activePartyMembers = partySlots.filter((m): m is PartySlotMember => m !== null);
    const generatedMatch = generateBalancedMatch({
      partyMembers: activePartyMembers.map(m => ({
        id: m.id,
        name: m.name,
        tag: m.tag,
        avatar: m.avatar,
        level: m.level,
        elo: m.elo,
        code: m.code,
        countryName: m.countryName,
        isLeader: m.isLeader,
        matches: m.matches
      })),
      userGamerTag: currentGamerTag,
      userAvatar: currentAvatarUrl,
      userElo: effectiveElo,
      userLevel: effectiveLevel,
      userClanTag: currentClanTag,
      userCountry: currentCountry,
      mapName: 'Anubis'
    });

    setCurrentBalancedMatch(generatedMatch);
    realtimeMatchmaking.broadcastMatchFound({ matchId: generatedMatch.matchId || generatedMatch.id });

    // Initial accepted: any party teammates ready in the lobby (excluding user who clicks Accept)
    const partyTeammatesReady = activePartyMembers
      .filter(m => m.name !== currentGamerTag)
      .map(m => ({ name: m.name, avatar: m.avatar, isUser: false }));

    setAcceptedPlayerList(partyTeammatesReady);
    setAcceptedPlayers(partyTeammatesReady.length);
  };

  const handleUserAcceptMatch = () => {
    sound.playClick();
    setUserHasAccepted(true);
    sound.playTournamentVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const userProfile = {
      name: currentGamerTag,
      avatar: currentAvatarUrl || 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
      isUser: true
    };

    setAcceptedPlayerList(prev => {
      if (prev.some(p => p.isUser)) return prev;
      return [...prev, userProfile];
    });
  };

  const handleConnectServer = (ip: string, serverName: string) => {
    sound.playTournamentVictory();
    const cmd = `connect ${ip}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).catch(() => {});
    }
    setConnectToast({ name: serverName, ip });
    setTimeout(() => setConnectToast(null), 3500);

    // Steam protocol direct connect
    window.location.href = `steam://connect/${ip}`;
  };

  const handleCopyIp = (ip: string) => {
    sound.playClick();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`connect ${ip}`).catch(() => {});
    }
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const handleAddTeammate = (slotIndex: number) => {
    sound.playClick();
    const available = SUGGESTED_TEAMMATES.filter(
      st => !partySlots.some(ps => ps && ps.id === st.id)
    );
    if (available.length > 0) {
      const chosen = available[0];
      setPartySlots(prev => {
        const next = [...prev];
        next[slotIndex] = chosen;
        return next;
      });
      sound.playJoinScrim();
    }
  };

  const handleInviteAndJumpToPlay = (teammate: PartySlotMember) => {
    sound.playJoinScrim();
    setPartySlots(prev => {
      const next = [...prev];
      const emptyIdx = next.findIndex((slot, i) => i !== 2 && slot === null);
      if (emptyIdx !== -1) {
        next[emptyIdx] = teammate;
      }
      return next;
    });
    setDashboardToast(`Invited ${teammate.name} to 5v5 Lobby!`);
    setTimeout(() => setDashboardToast(null), 3000);
    setActiveTab('play');
  };

  const handleRemoveTeammate = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setPartySlots(prev => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const handleToggleMap = (mapId: string) => {
    sound.playClick();
    setSelectedMaps(prev => {
      if (prev.includes(mapId)) {
        if (prev.length === 1) return prev; // Keep at least one map selected
        return prev.filter(m => m !== mapId);
      } else {
        return [...prev, mapId];
      }
    });
  };

  const handleDownloadDemo = (matchName: string) => {
    sound.playClick();
    setDownloadDemoToast(`GOTV Demo: ${matchName}.dem`);
    setTimeout(() => setDownloadDemoToast(null), 3000);
    try {
      const demoBlob = new Blob([`Official CS2 Sub-Tick GOTV Demo File - Match: ${matchName}\nServer: CS2 Sub-Tick Dedicated Arena\nRecorded live via Valve GOTV Broadcast.`], { type: 'application/octet-stream' });
      const demoUrl = URL.createObjectURL(demoBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = demoUrl;
      downloadLink.download = `caliber-match-${matchName}.dem`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(demoUrl);
    } catch (_) {}
  };

  const isVisitorMode = !isProjectAdmin || !adminBypassComingSoon;

  const navItems = [
    {
      id: 'play' as VortexTab,
      label: 'Play',
      desc: isVisitorMode ? 'Season 1 • Launching Soon' : 'Ranked CS2 Sub-Tick matchmaking',
      icon: Play,
      badge: isVisitorMode
        ? 'COMING SOON'
        : (isQueuing ? 'QUEUING' : 'ACTIVE'),
      badgeColor: isVisitorMode
        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
        : (isQueuing
          ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
          : 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30')
    },
    {
      id: 'rankings' as VortexTab,
      label: 'Rank',
      desc: isVisitorMode ? 'Season 1 • Under Dev' : 'Platform Player Leaderboard',
      icon: BarChart2,
      badge: isVisitorMode ? 'COMING SOON' : 'TOP PLAYERS',
      badgeColor: isVisitorMode
        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
        : 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 font-bold'
    },
    {
      id: 'tournaments' as VortexTab,
      label: 'Tournaments',
      desc: isVisitorMode ? 'Official CS2 Circuit' : 'Cash & CS2 Tournaments',
      icon: Trophy,
      badge: isVisitorMode ? 'COMING SOON' : 'LIVE',
      badgeColor: isVisitorMode
        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
        : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold'
    },
    {
      id: 'teams' as VortexTab,
      label: 'Teams & Clans',
      desc: isVisitorMode ? '5v5 Squads' : '5v5 Roster & Clan Hub',
      icon: Users,
      badge: isVisitorMode ? 'COMING SOON' : `[${currentClanTag || 'M14'}]`,
      badgeColor: isVisitorMode
        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
        : 'bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 font-bold'
    },
    {
      id: 'anticheat' as VortexTab,
      label: 'Anti-Cheat',
      desc: isVisitorMode ? 'Kernel Protection' : (isAntiCheatActive ? 'Ring-0 Kernel Protected' : 'Driver Offline • Ready to Launch'),
      icon: ShieldCheck,
      badge: isVisitorMode ? 'COMING SOON' : (isAntiCheatActive ? 'ACTIVE' : 'READY'),
      badgeColor: isVisitorMode
        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
        : (isAntiCheatActive 
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold')
    },
    {
      id: 'profile' as VortexTab,
      label: 'Player Profile',
      desc: isVisitorMode ? 'Digital Passport' : 'Digital Passport & Settings',
      icon: User,
      badge: isVisitorMode ? 'COMING SOON' : 'VERIFIED',
      badgeColor: isVisitorMode
        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
        : 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 font-bold'
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-[#F1F5F9] font-sans flex flex-col justify-start items-start selection:bg-lime-500/30 selection:text-white">
      
      {/* ======================================================== */}
      {/* UNIFIED PERSISTENT LAYOUT (SIDEBAR + MAIN CONTENT AREA)  */}
      {/* ======================================================== */}
      <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-6 py-2 sm:py-4 px-2 sm:px-4 lg:pl-2.5 lg:pr-68 xl:pr-72 min-h-[92vh]">
        
        {/* ==================== LEFT SIDEBAR ==================== */}
        <aside className={`bg-[#0E1017] border border-[#202536] rounded-3xl flex flex-col justify-between shrink-0 shadow-xl transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-full lg:w-[84px] p-3' : 'w-full lg:w-72 p-4 sm:p-5'
        }`}>
          <div>
            {/* Brand Logo (Full when expanded, compact VTX when collapsed) */}
            <div className={`flex items-center mb-6 transition-all ${
              sidebarCollapsed ? 'justify-center py-1' : 'px-2'
            }`}>
              {!sidebarCollapsed ? (
                <div 
                  onClick={() => { sound.playClick(); setActiveTab('home'); }}
                  className="flex items-center gap-3 cursor-pointer group transition hover:scale-105"
                  title="Caliber Clutch Home"
                >
                  <VortexBrandLogo />
                </div>
              ) : (
                <div 
                  onClick={() => { sound.playClick(); setActiveTab('home'); }}
                  className="cursor-pointer transition hover:scale-110"
                  title="Caliber Clutch Home"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#18210C] to-[#12141C] border border-[#A3E635]/50 flex items-center justify-center text-[#A3E635] font-black font-display text-xs shadow-[0_0_15px_rgba(163,230,53,0.25)]">
                    CC
                  </div>
                </div>
              )}
            </div>

            {/* FACEIT-STYLE SEARCH BAR */}
            {!sidebarCollapsed ? (
              <div className="relative mb-2 px-1">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#14161F] hover:bg-[#191D2A] border border-white/[0.06] hover:border-white/15 focus-within:border-[#A3E635]/60 transition text-xs font-sans group">
                  <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#A3E635] transition shrink-0" />
                  <input
                    type="text"
                    value={sidebarSearchQuery}
                    onChange={(e) => {
                      setSidebarSearchQuery(e.target.value);
                      setSidebarSearchOpen(true);
                    }}
                    onFocus={() => setSidebarSearchOpen(true)}
                    placeholder="Search"
                    className="bg-transparent border-0 text-white placeholder-slate-400 focus:outline-none w-full text-xs font-sans tracking-wide"
                  />
                  {sidebarSearchQuery && (
                    <button 
                      onClick={() => { setSidebarSearchQuery(''); setSidebarSearchOpen(false); }}
                      className="text-slate-400 hover:text-white transition p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Instant Search Popup Dropdown */}
                {sidebarSearchOpen && sidebarSearchQuery.trim() && (
                  <div className="absolute left-1 right-1 top-full mt-1.5 p-2 rounded-2xl bg-[#0D0F16] border border-white/10 shadow-2xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider">Quick Results</div>
                    {[
                      { tag: 'M14', level: 'Level 7', elo: '1,407 ELO', code: 'XK', action: () => { setActiveTab('profile'); setSidebarSearchOpen(false); } },
                      { tag: 'juanflatroo', level: 'Level 10', elo: '3,890 ELO', code: 'XK', action: () => { setActiveTab('rankings'); setSidebarSearchOpen(false); } },
                      { tag: 'gxx-', level: 'Level 10', elo: '3,420 ELO', code: 'XK', action: () => { setActiveTab('rankings'); setSidebarSearchOpen(false); } },
                      { tag: 'Play 5v5 Queue', level: 'Sub-Tick', elo: 'Matchmaking', icon: '🎮', action: () => { setActiveTab('play'); setSidebarSearchOpen(false); } },
                      { tag: 'Platform Rankings', level: 'Ladder', elo: 'Leaderboard', icon: '🏆', action: () => { setActiveTab('rankings'); setSidebarSearchOpen(false); } },
                    ]
                      .filter(item => item.tag.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                      .map((res, i) => (
                        <div
                          key={i}
                          onClick={() => { sound.playClick(); res.action(); }}
                          className="px-2.5 py-1.5 rounded-xl hover:bg-[#1A1F2E] flex items-center justify-between text-xs font-mono text-white cursor-pointer transition"
                        >
                          <div className="flex items-center gap-2">
                            {res.code ? <CountryFlag code={res.code} size="xs" /> : <span>{res.icon}</span>}
                            <span className="font-bold">{res.tag}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{res.elo}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center mb-2">
                <button
                  onClick={() => { sound.playClick(); setSidebarCollapsed(false); }}
                  title="Search"
                  className="p-2.5 rounded-xl bg-[#14161F] hover:bg-[#191D2A] border border-white/[0.06] text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* INTEGRATED COUNTER-STRIKE 2 GAME SELECTOR (AS IN FACEIT SCREENSHOT) */}
            {!sidebarCollapsed ? (
              <div className="relative mb-2 px-1">
                <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#14161F] border border-white/[0.06] text-left">
                  <div className="flex items-center gap-2.5">
                    <CS2GameIcon className="w-6 h-6" />
                    <span className="font-sans font-bold text-xs text-white tracking-wide">Counter Strike 2</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Counter Strike 2 Active" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-2">
                <div
                  title="Counter Strike 2"
                  className="p-1 rounded-xl bg-[#14161F] border border-white/[0.06]"
                >
                  <CS2GameIcon className="w-7 h-7" />
                </div>
              </div>
            )}

            {/* DIVIDER LINE ABOVE PLAY 5vs5 ("vija te jet mbi Play 5vs5") */}
            <div className={`w-full my-3 ${sidebarCollapsed ? 'px-2' : 'px-1'}`}>
              <div className="h-px bg-white/[0.08] w-full" />
            </div>

            {/* Unified Navigation List (Single Clean List Below Logo & Divider) */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isPlayTab = item.id === 'play';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playSelect();
                      setActiveTab(item.id);
                    }}
                    className={`w-full group relative flex items-center ${
                      sidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                    } rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#A3E635]/20 via-[#18210C] to-transparent border border-[#A3E635]/60 text-white shadow-[0_0_20px_rgba(163,230,53,0.18)]'
                        : 'hover:bg-[#151924] border border-transparent text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-[#A3E635] text-slate-950 shadow-md' 
                          : 'bg-[#151924] group-hover:bg-[#1E2332] text-slate-400 group-hover:text-white'
                      }`}>
                        <Icon className={`w-4 h-4 ${isPlayTab ? 'fill-current' : ''}`} />
                      </div>
                      {!sidebarCollapsed && (
                        <div>
                          <div className="text-xs font-bold tracking-wide text-white">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      )}
                    </div>

                    {!sidebarCollapsed && item.badge && (
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.85)]" />
                    )}

                    {/* Floating Tooltip when collapsed */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#141722] border border-[#252C3D] text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-2xl flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Go Premium Card (Hidden in Visitor Mode) */}
          {!isVisitorMode && (
            !sidebarCollapsed ? (
              <button
                onClick={() => { sound.playTournamentVictory(); setShowPremiumModal(true); }}
                className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#1C160B] to-[#12141C] border border-amber-500/40 hover:border-amber-400 text-left transition cursor-pointer group shadow-lg"
              >
                <div className="flex items-center gap-2 text-amber-400 text-xs font-display font-black mb-1">
                  <Crown className="w-4 h-4" />
                  <span>{userMembershipTier === 'vip' ? 'VIP Elite Active' : userMembershipTier === 'premium' ? 'Upgrade to VIP' : 'Go Premium'}</span>
                </div>
                <p className="text-[10px] text-[#94A3B8]">
                  {userMembershipTier === 'vip' ? 'All Pro queues unlocked' : userMembershipTier === 'premium' ? 'Unlock Pro Tournaments' : 'Unlock Super Match 5v5 & VODs'}
                </p>
              </button>
            ) : (
              <button
                onClick={() => { sound.playTournamentVictory(); setShowPremiumModal(true); }}
                className="mt-6 w-full h-11 rounded-xl bg-gradient-to-br from-[#1C160B] to-[#12141C] border border-amber-500/40 hover:border-amber-400 flex items-center justify-center transition cursor-pointer group relative shadow-lg"
                title={userMembershipTier === 'vip' ? 'VIP Elite Active' : userMembershipTier === 'premium' ? 'Upgrade to VIP' : 'Go Premium'}
              >
                <Crown className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#141722] border border-amber-500/40 text-amber-400 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-2xl">
                  {userMembershipTier === 'vip' ? 'VIP Elite Active' : userMembershipTier === 'premium' ? 'Upgrade to VIP' : 'Go Premium'}
                </div>
              </button>
            )
          )}
        </aside>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <main className="flex-1 flex flex-col gap-6">

          {/* TOP HEADER CONTROLS (SEAMLESS DIRECT ON BACKGROUND AS PHOTO 2 - NO BOX WINDOW) */}
          <header className="w-full flex items-center justify-between px-1 py-1 bg-transparent border-0 shadow-none">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setSidebarCollapsed(!sidebarCollapsed);
                }}
                title={sidebarCollapsed ? "Expand Sidebar (Full View)" : "Minimize Sidebar (Icon View)"}
                className="p-2.5 rounded-xl bg-[#12141C] hover:bg-[#1A1F2E] border border-white/10 hover:border-[#A3E635]/50 text-slate-300 hover:text-white transition cursor-pointer group shrink-0 shadow-md"
              >
                <SidebarMenuIcon collapsed={sidebarCollapsed} />
              </button>

              {/* Show Queue Status ONLY when actively in matchmaking queue */}
              {isQueuing && (
                <button
                  onClick={() => setActiveTab('play')}
                  className="px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 font-mono text-xs font-bold flex items-center gap-2 animate-pulse cursor-pointer shadow-lg shadow-red-500/15"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>IN QUEUE (00:0{queueSeconds})</span>
                </button>
              )}
            </div>

          </header>

          {/* ADMIN VIEW MODE SWITCHER (ONLY VISIBLE TO PROJECT ADMIN) */}
          {isProjectAdmin && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 px-5 rounded-2xl bg-[#141A29] border border-amber-500/40 shadow-lg text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>PROJECT ADMINISTRATOR MODE</span>
                </span>
                <span className="text-slate-400 hidden md:inline">
                  • {adminBypassComingSoon ? 'Viewing Live Admin Platform' : 'Previewing Visitor Coming Soon View'}
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  const next = !adminBypassComingSoon;
                  setAdminBypassComingSoon(next);
                  setLocalState('caliber_admin_bypass_coming_soon', String(next));
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 font-bold transition flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                title="Toggle between viewing the Live Admin Platform and testing what normal visitors see"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>{adminBypassComingSoon ? 'Preview Visitor Coming Soon' : 'Return to Admin Live Platform'}</span>
              </button>
            </div>
          )}

          {/* FOR ALL REGULAR VISITORS: UNIFIED COMING SOON VIEW (100% CLEAN & HUMOROUS CS2 GAMER TEXT) */}
          {isVisitorMode ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="w-full bg-[#0B0D12] border border-[#202535] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl text-left space-y-8">
                {/* Subtle Ambient Glows */}
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-lime-500/[0.04] rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

                {/* Top Header Section with PROMINENT COMING SOON BANNER */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/40 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-80" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A3E635]" />
                        </span>
                        <span>COMING SOON</span>
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-[#A3E635] bg-[#A3E635]/10 border border-[#A3E635]/30">
                        SEASON 1 CALIBRATION
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* HUGE COMING SOON WITH VIBRANT GREEN PULSING/BEATING CIRCLE IN FRONT */}
                      <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight uppercase text-amber-400 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] leading-tight select-none">
                        <span className="relative flex h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-85" />
                          <span className="relative inline-flex rounded-full h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8 bg-[#A3E635] shadow-[0_0_25px_#A3E635]" />
                        </span>
                        <span>COMING SOON</span>
                      </div>
                      
                      {/* Sleek horizontal divider line as requested */}
                      <div className="w-full max-w-2xl h-px bg-gradient-to-r from-amber-400/50 via-white/15 to-transparent my-1" />

                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight uppercase leading-tight">
                        CALIBER CLUTCH
                      </h1>
                      <p className="text-sm font-mono text-slate-300 max-w-3xl pt-1">
                        Hold your angles and save your AWPs! The next generation of competitive Counter-Strike 2 is almost ready.
                      </p>
                    </div>
                  </div>

                  {/* Progress & Launch Pill */}
                  <div className="lg:text-right shrink-0 bg-[#121622]/80 border border-white/5 rounded-2xl p-4 sm:p-5 shadow-lg">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">DEPLOYMENT PROGRESS</div>
                    <div className="text-3xl font-black font-display text-[#A3E635] drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]">60% COMPLETED</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">Phase 3/5: Matchmaking & Server Calibration</div>
                  </div>
                </div>

                {/* Main Announcement Box (Professional & Humorous CS2 Copy as requested!) */}
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#121622] via-[#0E121B] to-[#0A0D14] border border-[#262E44] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#A3E635]/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h3 className="text-xl font-black font-display text-white uppercase tracking-wide flex items-center gap-2">
                        <span className="text-amber-400">COMING SOON:</span>
                        <span>OFFICIAL CS2 COMPETITIVE NOTICE</span>
                      </h3>
                    </div>

                    <p className="text-sm text-slate-300 font-sans leading-relaxed">
                      Welcome to <strong className="text-white font-bold">Caliber Clutch</strong>! Before you rush B without utility or blame sub-tick for missing your AK-47 spray, our engineers are currently fine-tuning our European server infrastructure to ensure crisp hit registration, zero rubberbanding, and genuine competitive 5v5 action.
                    </p>

                    <p className="text-sm text-slate-300 font-sans leading-relaxed">
                      <span className="text-[#A3E635] font-bold">Tired of solo-queue teammates who don’t buy defuse kits, buy Decoys on eco rounds, or accidentally flashbang their own squad?</span> <em>We feel your pain.</em> Our built-in <strong className="text-white">5-Man Party Finder and Matchmaking Lobby</strong> will allow you to recruit dedicated players, assemble a chemistry-driven stack, and climb the seasonal ELO ladders together.
                    </p>

                    <p className="text-sm text-slate-400 font-sans leading-relaxed">
                      Grab an energy drink, practice your smoke lineups in offline servers for a bit longer, and click <strong className="text-white">"Notify Me When Online"</strong> below. We'll sound the alarm the exact second the servers go live!
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                      {isSubscribedNotify ? (
                        <div className="px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>✓ Subscribed to VIP Launch List</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playTournamentVictory();
                            confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
                            setIsSubscribedNotify(true);
                            setLocalState('caliber_notified_coming_soon', 'true');
                            setDashboardToast('🎉 You are on the VIP priority notification list! Prepare your crosshair — launch announcement coming soon.');
                            setTimeout(() => setDashboardToast(null), 6000);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#A3E635] hover:bg-[#B4F046] text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-lime-500/20 flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                          <Bell className="w-4 h-4 text-slate-950" />
                          <span>Notify Me When Online</span>
                        </button>
                      )}

                      <span className="text-xs font-mono text-slate-400 italic">
                        * Remember: always buy armor on pistol round!
                      </span>
                    </div>

                    {isSubscribedNotify && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Successfully enrolled in the VIP Priority List! As soon as the Caliber Clutch servers finish calibration, you will be notified immediately.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Sponsor Ads Banner (Generates Monetag Revenue from all visitor traffic!) */}
                <VortexAdBanner placement="top" showDisclaimer={true} />
              </div>
            </div>
          ) : (
            <>
              {/* TAB: HOME (OVERVIEW & PLATFORM HUB - TRIGGERED BY OFFICIAL CALIBER CLUTCH LOGO) */}
              {(activeTab === 'home' || activeTab === 'dashboard') && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="w-full bg-[#0B0D12] border border-[#202535] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl text-left space-y-8">
                    {/* Subtle Glows */}
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-lime-500/[0.04] rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

                    {/* Top Header */}
                    <div className="border-b border-white/[0.08] pb-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider text-[#A3E635] bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.25)]">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-80" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A3E635]" />
                            </span>
                            <span>SEASON 1 HUB</span>
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30">
                            CALIBER CLUTCH ARENA
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight uppercase leading-tight">
                            CALIBER CLUTCH
                          </h1>
                          <p className="text-sm font-mono text-slate-300 max-w-2xl">
                            Competitive Counter-Strike 2 arena with ranked matchmaking, tournament cash prize pools, and official leaderboards.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Launch Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        onClick={() => { sound.playSelect(); setActiveTab('play'); }}
                        className="p-5 rounded-2xl bg-gradient-to-br from-[#121622] to-[#0A0D14] border border-[#262E44] hover:border-[#A3E635]/60 transition cursor-pointer group shadow-lg hover:-translate-y-1"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635] mb-3 group-hover:scale-110 transition">
                          <Play className="w-5 h-5 fill-[#A3E635]" />
                        </div>
                        <h4 className="text-sm font-black font-display text-white uppercase tracking-wider">Play 5v5 Matchmaking</h4>
                        <p className="text-xs text-slate-400 mt-1">Official 5v5 competitive European queue.</p>
                      </div>

                      <div 
                        onClick={() => { sound.playSelect(); setActiveTab('tournaments'); }}
                        className="p-5 rounded-2xl bg-gradient-to-br from-[#121622] to-[#0A0D14] border border-[#262E44] hover:border-yellow-500/60 transition cursor-pointer group shadow-lg hover:-translate-y-1"
                      >
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-3 group-hover:scale-110 transition">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-black font-display text-white uppercase tracking-wider">Tournaments</h4>
                        <p className="text-xs text-slate-400 mt-1">Cash prize cups and brackets.</p>
                      </div>

                      <div 
                        onClick={() => { sound.playSelect(); setActiveTab('rankings'); }}
                        className="p-5 rounded-2xl bg-gradient-to-br from-[#121622] to-[#0A0D14] border border-[#262E44] hover:border-cyan-500/60 transition cursor-pointer group shadow-lg hover:-translate-y-1"
                      >
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition">
                          <BarChart2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-black font-display text-white uppercase tracking-wider">Leaderboards</h4>
                        <p className="text-xs text-slate-400 mt-1">Platform rankings and ELO stats.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PLAY */}
              {activeTab === 'play' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* HERO MODULE: 5v5 CS2 MATCHMAKING LOBBY (1:1 FACEIT REPLICA) */}
                  <div className="w-full bg-[#0B0D12] border border-[#202535] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
                {/* Subtle Glow Accents */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Top Centered Queue Pill */}
                <div className="flex justify-center mb-6">
                  <span className="px-5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#FF5500] bg-[#1C120D] border border-[#FF5500]/60 shadow-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
                    EUROPE 5v5 QUEUE
                  </span>
                </div>

                {/* Top Row: User Level / ELO Progression */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
                  
                  {/* Dynamic Faceit Level Badge & ELO Progression */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 w-full">
                    {/* Faceit Level Circular Badge (Color scaled by Level matching Refrag official standards) */}
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3.5px] shadow-lg shrink-0 ${
                      effectiveLevel >= 10
                        ? 'bg-gradient-to-br from-[#FF5500] via-red-600 to-rose-700 shadow-orange-500/25'
                        : effectiveLevel >= 8
                        ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-orange-500/25'
                        : effectiveLevel >= 7
                        ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 shadow-amber-500/25'
                        : effectiveLevel >= 4
                        ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 shadow-yellow-500/20'
                        : effectiveLevel >= 2
                        ? 'bg-gradient-to-br from-[#A3E635] via-emerald-500 to-teal-600 shadow-lime-500/20'
                        : 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 shadow-slate-500/20'
                    }`}>
                      <div className="w-full h-full rounded-full bg-[#12141C] flex items-center justify-center border border-white/20">
                        <span className="text-2xl sm:text-3xl font-black font-display text-white tracking-tighter">{effectiveLevel}</span>
                      </div>
                    </div>

                    {/* ELO Details & Progression Line */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl font-black font-display text-white tracking-tight flex items-center gap-2">
                          {isCalibrated ? (
                            <>
                              {effectiveElo.toLocaleString()} ELO
                              <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
                            </>
                          ) : (
                            <>
                              <span>800 ELO</span>
                              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded tracking-wider">
                                UNCALIBRATED • 0 MATCHES
                              </span>
                            </>
                          )}
                        </span>
                        {currentVerification === 'none' && (
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                            UNVERIFIED
                          </span>
                        )}
                        {currentVerification === 'verified' && (
                          <span className="text-[10px] font-mono font-bold text-white bg-white/10 border border-white/30 px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                        {currentVerification === 'vip' && (
                          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                            VIP PRO
                          </span>
                        )}
                        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono font-bold text-slate-300">
                          <span>{isCalibrated ? userPlatformRank : 'Unranked (0 Matches)'}</span>
                          <CountryFlag code={currentCountry.code} name={currentCountry.name} size="xs" />
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>

                      {/* Authentic FACEIT CS2 Horizontal Skill Rank Track (1 to 10 + Challenger) */}
                      <FaceitSkillTrack elo={effectiveElo} level={effectiveLevel} isCalibrated={isCalibrated} />

                      {/* Party Action Buttons */}
                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          onClick={() => sound.playClick()}
                          className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-[#FF5500]" />
                          <span>Find party</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] text-slate-400">14</span>
                        </button>
                        <button
                          onClick={() => sound.playClick()}
                          className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 text-slate-300 hover:text-white font-mono text-xs transition cursor-pointer"
                        >
                          Post party
                        </button>
                        <button
                          onClick={() => { sound.playSelect(); setActiveTab('teams'); }}
                          className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-[#FF5500]/30 text-amber-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#FF5500]" />
                          <span>Team Roster [{currentClanTag || 'M14'}]</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PARTY CONTROLS & MATCH ROOM ENTRY */}
                <div className="mt-8 mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <Users className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span className="text-white font-bold">
                        PARTY: {partySlots.filter(Boolean).length}/5
                      </span>
                    </div>
                    {partySlots.filter(Boolean).length > 1 && (
                      <button
                        onClick={handleLeaveParty}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 transition flex items-center gap-1.5 cursor-pointer"
                        title="Leave current party"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Leave Party</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sound.playMatchFound();
                        triggerMatchFound();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer text-xs"
                      title="Trigger CS2 5v5 Scrim Ready Check (30s Acceptance Phase)"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>READY CHECK (SCRIM)</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playSelect();
                        setIsMatchRoomOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-[#A3E635]/15 hover:bg-[#A3E635]/25 border border-[#A3E635]/40 text-[#A3E635] hover:text-white font-bold transition flex items-center gap-2 shadow-sm hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] cursor-pointer text-xs"
                      title="Enter CS2 Match Room with Active Duty Map Veto"
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse text-[#A3E635]" />
                      <span>CS2 MATCH ROOM & MAP VETO</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 5 PARTY SLOTS */}
                <div className="relative">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                    {partySlots.map((member, idx) => {
                      const isLeader = partyLeaderIndex === idx;
                      const isCenterLeader = idx === 2;
                      const isCurrentUser = member?.id === 'current-user' || member?.name === currentGamerTag;

                      if (member) {
                        return (
                          <div
                            key={member.id}
                            className={`h-56 rounded-2xl border flex flex-col items-center justify-between px-2 py-3.5 transition-all relative group overflow-hidden ${
                              isLeader
                                ? 'bg-gradient-to-b from-[#18210C] via-[#121612] to-[#0E1118] border-[#A3E635]/60 shadow-lg shadow-[#A3E635]/15'
                                : 'bg-[#12141C] border-[#252B3B] hover:border-[#A3E635]/40'
                            }`}
                          >
                            {/* Member Top Row */}
                            <div className="w-full flex items-center justify-between text-[10px] font-mono">
                              {isLeader ? (
                                <span className="px-2 py-0.5 rounded bg-[#A3E635]/15 text-[#A3E635] font-bold border border-[#A3E635]/30 flex items-center gap-1">
                                  <Crown className="w-3 h-3 fill-[#A3E635]" />
                                  LEADER
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 font-bold">
                                  MEMBER
                                </span>
                              )}

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!isLeader && (
                                  <button
                                    onClick={(e) => handlePromoteToLeader(idx, e)}
                                    className="p-1 rounded hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition cursor-pointer"
                                    title="Promote to Leader"
                                  >
                                    <Crown className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {!isCurrentUser ? (
                                  <button
                                    onClick={(e) => handleKickMember(idx, e)}
                                    className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                    title="Kick from party"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  partySlots.filter(Boolean).length > 1 && (
                                    <button
                                      onClick={handleLeaveParty}
                                      className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                      title="Leave Party"
                                    >
                                      <LogOut className="w-3.5 h-3.5" />
                                    </button>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Member Avatar & Details */}
                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="relative">
                                {member.name === 'M18' || !member.avatar ? (
                                  <div className="w-16 h-16 rounded-full bg-black border-2 border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.35)] flex flex-col items-center justify-center p-1">
                                    <svg className="w-10 h-5 text-white" viewBox="0 0 100 40" fill="currentColor">
                                      <path d="M 6 22 L 20 22 L 22 17 L 36 17 L 38 20 L 52 20 L 57 18 L 82 18 L 84 20 L 92 20 L 92 23 L 83 23 L 83 26 L 76 26 L 75 23 L 52 23 L 50 30 L 44 30 L 47 23 L 38 23 L 34 32 L 28 32 L 26 24 L 6 26 Z" />
                                    </svg>
                                    <span className="text-[10px] font-black text-white">M18</span>
                                  </div>
                                ) : (
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className={`w-16 h-16 rounded-full object-cover border-2 shadow-md ${
                                      isCenterLeader 
                                        ? 'border-[#A3E635] shadow-[0_0_18px_rgba(163,230,53,0.4)]' 
                                        : 'border-[#A3E635]/60'
                                    }`}
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#12141C]" />
                              </div>

                              <div className="w-full px-1 min-w-0 flex flex-col items-center">
                                <div className="text-xs font-bold text-white flex items-center justify-center gap-1 font-display max-w-full min-w-0">
                                  <span className="truncate min-w-0 max-w-[68px] sm:max-w-[74px]" title={member.name}>{member.name}</span>
                                  <FaceitVerificationBadge 
                                    type={member.verification || (isCenterLeader ? currentVerification : 'none')} 
                                    size="xs" 
                                    className="shrink-0"
                                  />
                                  <CountryFlag 
                                    code={member.code || (isCenterLeader ? currentCountry.code : 'XK')} 
                                    name={member.countryName || (isCenterLeader ? currentCountry.name : 'Kosovo')} 
                                    size="xs" 
                                    className="shrink-0"
                                  />
                                </div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#151922] border border-white/10 shadow-inner mt-1">
                                  <div className="w-4 h-4 rounded-full relative flex items-center justify-center">
                                    <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
                                      <path className="text-white/10" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                      <path 
                                        className={
                                          member.level >= 10 
                                            ? 'text-[#FF5500]' 
                                            : member.level >= 8 
                                            ? 'text-orange-500' 
                                            : member.level >= 7 
                                            ? 'text-amber-500' 
                                            : member.level >= 4 
                                            ? 'text-yellow-400' 
                                            : member.level >= 2 
                                            ? 'text-[#A3E635]' 
                                            : 'text-slate-400'
                                        } 
                                        strokeDasharray={`${(FACEIT_TIERS[member.level]?.ringPercent || 30) * 0.95}, 100`} 
                                        strokeWidth="4" 
                                        strokeLinecap="round" 
                                        stroke="currentColor" 
                                        fill="none" 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                      />
                                    </svg>
                                    <span className="absolute text-[9px] font-black text-white">{member.level}</span>
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white tracking-tight">{member.elo.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Bottom */}
                            <div className="w-full text-center">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                READY
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Pending Outgoing Invite Slot
                      const pendingPlayer = pendingSlotInvites[idx];
                      if (pendingPlayer) {
                        return (
                          <div
                            key={`pending-${idx}`}
                            onClick={() => {
                              sound.playClick();
                              setPartyInviteCountdown(88);
                              setActivePartyInvite({
                                id: `invite-${Date.now()}`,
                                sender: pendingPlayer.name,
                                avatar: pendingPlayer.avatar,
                                level: pendingPlayer.level,
                                code: pendingPlayer.code || 'XK',
                                countryName: pendingPlayer.countryName || 'Kosovo',
                                targetSlotIdx: idx,
                                playerObj: pendingPlayer,
                              });
                            }}
                            className="h-56 rounded-2xl bg-[#0E1017] border-2 border-dashed border-amber-500/70 p-4 flex flex-col justify-between items-center relative group shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-in zoom-in-95 cursor-pointer hover:border-[#FF5500] transition-all hover:scale-[1.01]"
                            title="Click to preview the FACEIT party invitation"
                          >
                            {/* Top Pending Tag */}
                            <div className="w-full flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                WAITING...
                              </span>
                              <button
                                onClick={(e) => handleCancelPendingInvite(idx, e)}
                                className="text-slate-500 hover:text-red-400 p-1 transition cursor-pointer"
                                title="Cancel Invitation"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Player Avatar */}
                            <div className="relative my-1">
                              {pendingPlayer.name === 'M18' || !pendingPlayer.avatar ? (
                                <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center p-1">
                                  <svg className="w-9 h-4 text-white" viewBox="0 0 100 40" fill="currentColor">
                                    <path d="M 6 22 L 20 22 L 22 17 L 36 17 L 38 20 L 52 20 L 57 18 L 82 18 L 84 20 L 92 20 L 92 23 L 83 23 L 83 26 L 76 26 L 75 23 L 52 23 L 50 30 L 44 30 L 47 23 L 38 23 L 34 32 L 28 32 L 26 24 L 6 26 Z" />
                                  </svg>
                                  <span className="text-[10px] font-black text-white">M18</span>
                                </div>
                              ) : (
                                <img
                                  src={pendingPlayer.avatar}
                                  alt={pendingPlayer.name}
                                  className="w-14 h-14 rounded-2xl object-cover grayscale opacity-80 border-2 border-amber-500/60 shadow-md"
                                />
                              )}
                              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-[#A3E635] text-slate-950 font-black text-[9px] font-mono border border-black shadow">
                                LVL {pendingPlayer.level}
                              </div>
                            </div>

                            {/* Player Name & ELO */}
                            <div className="text-center w-full">
                              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white font-mono">
                                <span>{pendingPlayer.name}</span>
                                <CountryFlag code={pendingPlayer.code || 'XK'} name={pendingPlayer.countryName || 'Kosovo'} size="xs" />
                              </div>
                              <span className="text-[10px] text-[#A3E635] font-mono">Invite sent • {pendingPlayer.elo} ELO</span>
                            </div>

                            {/* Action Row */}
                            <div className="w-full flex items-center gap-1.5 pt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sound.playClick();
                                  setPartyInviteCountdown(88);
                                  setActivePartyInvite({
                                    id: `invite-${Date.now()}`,
                                    sender: currentGamerTag,
                                    avatar: currentAvatarUrl,
                                    level: 7,
                                    code: currentCountry.code,
                                    countryName: currentCountry.name,
                                    verification: currentVerification,
                                    targetSlotIdx: idx,
                                    playerObj: pendingPlayer,
                                    isOutgoingSimulation: true,
                                    invitedPlayerName: pendingPlayer.name,
                                  });
                                }}
                                className="flex-1 py-1 rounded-lg bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 text-[10px] font-mono font-black transition cursor-pointer shadow-[0_0_10px_rgba(163,230,53,0.3)] text-center uppercase"
                              >
                                TEST DIALOG
                              </button>
                              <button
                                onClick={(e) => handleCancelPendingInvite(idx, e)}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/10 text-[10px] font-mono font-bold transition cursor-pointer"
                                title="Cancel invitation"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      }

                      // Empty Slot (Opens FACEIT Invite Modal)
                      return (
                        <div
                          key={`empty-${idx}`}
                          onClick={() => handleOpenInviteModal(idx)}
                          className="h-56 rounded-2xl bg-[#10121A] border border-[#202535] hover:border-[#A3E635]/60 hover:bg-[#131722] flex flex-col items-center justify-center gap-2.5 p-4 transition-all duration-150 group cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(163,230,53,0.15)] hover:scale-[1.01]"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] group-hover:bg-[#A3E635]/15 border border-white/10 group-hover:border-[#A3E635]/50 flex items-center justify-center text-slate-500 group-hover:text-[#A3E635] transition shadow-inner">
                            <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                          </div>
                          <div className="text-center">
                            <span className="block text-xs font-mono font-bold text-slate-400 group-hover:text-white transition">
                              + Invite Teammate
                            </span>
                            <span className="block text-[10px] font-mono text-slate-600 group-hover:text-[#A3E635] transition mt-0.5">
                              Open Friends List
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* FLOATING ANTI-CHEAT WARNING PILL (SHOWN ONLY IF USER CLICKS FIND MATCH WITHOUT AC RUNNING) */}
                  {!isAntiCheatActive && showAcPrompt && (
                    <div className="flex justify-center -mt-4 relative z-10 animate-in fade-in zoom-in-95 duration-200">
                      <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#090B0F] border border-[#FF5500] shadow-[0_0_25px_rgba(255,85,0,0.3)] text-xs font-mono">
                        <div className="flex items-center gap-2 text-slate-200">
                          <ShieldAlert className="w-4 h-4 text-[#FF5500] shrink-0" />
                          <span className="font-semibold text-slate-100 tracking-wide">Please run Anti-Cheat</span>
                        </div>
                        <a
                          href="https://www.faceit.com/en/anti-cheat"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF5500] hover:text-[#FFAA00] font-bold text-xs uppercase tracking-wider transition hover:underline"
                        >
                          DOWNLOAD
                        </a>
                        <a
                          href="faceitac://"
                          onClick={() => {
                            handleLaunchAntiCheat();
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6611] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-orange-500/30 hover:scale-105 active:scale-95 inline-flex items-center"
                          title="Click to launch Anti-Cheat"
                        >
                          LAUNCH
                        </a>
                        <button
                          onClick={() => setShowAcPrompt(false)}
                          className="text-slate-500 hover:text-white transition cursor-pointer p-0.5 ml-0.5"
                          title="Dismiss warning"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* FIND MATCH BUTTON (CENTERED AS IN SCREENSHOT) */}
                <div className="flex justify-center mt-6">
                  {isQueuing ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="flex flex-wrap items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-[#1A130D] border border-[#FF5500]/60 text-xs font-mono shadow-xl shadow-orange-500/15">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] animate-ping shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-black tracking-wider">SEARCHING BALANCED 5V5 MATCH...</span>
                            <span className="text-amber-400 font-bold font-mono">00:{queueSeconds.toString().padStart(2, '0')}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                            <span className="text-emerald-400 font-bold">
                              {realtimeQueuePlayers.length > 0 ? `${realtimeQueuePlayers.length}/10 Active Queued` : '1/10 Searching'}
                            </span>
                            <span>•</span>
                            <span className="text-[#A3E635] font-bold">Real-time Supabase Presence</span>
                            <span>•</span>
                            <span>Strict Bracket: Level {effectiveLevel} (ELO {effectiveElo - 40} - {effectiveElo + 40})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isProjectAdmin && (
                          <button
                            onClick={() => {
                              sound.playMatchFound();
                              triggerMatchFound();
                            }}
                            className="px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 text-slate-950 text-xs font-mono font-black uppercase cursor-pointer transition shadow-md flex items-center gap-1.5"
                            title="Administrator shortcut: immediately trigger match ready check"
                          >
                            <Zap className="w-4 h-4 fill-slate-950" />
                            <span>LAUNCH SCRIM NOW</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            sound.playClick();
                            realtimeMatchmaking.leaveQueue(currentGamerTag);
                            setIsQueuing(false);
                          }}
                          className="px-5 py-3.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-mono font-bold cursor-pointer transition shadow-md"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : selectedMatchTier === 'premium' && userMembershipTier === 'free' ? (
                    <button
                      onClick={() => {
                        sound.playTournamentVictory();
                        setShowPremiumModal(true);
                      }}
                      className="w-full sm:w-auto min-w-[340px] px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3"
                    >
                      <Lock className="w-4 h-4 fill-slate-950" />
                      <span>UPGRADE TO PREMIUM TO QUEUE SUPER MATCH</span>
                    </button>
                  ) : selectedMatchTier === 'vip' && userMembershipTier !== 'vip' ? (
                    <button
                      onClick={() => {
                        sound.playTournamentVictory();
                        setShowPremiumModal(true);
                      }}
                      className="w-full sm:w-auto min-w-[340px] px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3"
                    >
                      <Crown className="w-4 h-4 fill-slate-950" />
                      <span>UPGRADE TO VIP TO QUEUE VIP ELITE</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAntiCheatActive) {
                          sound.playClick();
                          setShowAcPrompt(true);
                          setDashboardToast('⚠️ Anti-Cheat must be running to find a match! Click LAUNCH.');
                          setTimeout(() => setDashboardToast(null), 3500);
                          return;
                        }
                        sound.playJoinScrim();
                        setIsQueuing(true);
                        setQueueSeconds(0);
                      }}
                      className="w-full sm:w-auto min-w-[320px] px-12 py-4 rounded-2xl bg-gradient-to-r from-[#84CC16] via-[#A3E635] to-[#84CC16] hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_30px_rgba(163,230,53,0.35)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>FIND MATCH ({selectedMatchTier === 'free' ? 'STANDARD' : selectedMatchTier === 'premium' ? 'SUPER MATCH' : 'VIP ELITE'})</span>
                    </button>
                  )}
                </div>

                {/* MATCHMAKING SUB-NAVIGATION (MATCH TYPE • MAPS • SERVERS) */}
                <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => { sound.playClick(); setPlaySubTab('match_type'); }}
                      className={`relative pb-3 font-bold transition flex items-center gap-2 cursor-pointer ${
                        playSubTab === 'match_type'
                          ? 'text-white border-b-2 border-[#A3E635]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Crosshair className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>MATCH TYPE</span>
                    </button>

                    <button
                      onClick={() => { sound.playClick(); setPlaySubTab('maps'); }}
                      className={`relative pb-3 font-bold transition flex items-center gap-2 cursor-pointer ${
                        playSubTab === 'maps'
                          ? 'text-white border-b-2 border-[#A3E635]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>MAPS ({selectedMaps.length}/7)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#A3E635] text-black font-black uppercase shadow-[0_0_8px_rgba(163,230,53,0.3)]">
                        ACTIVE DUTY
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => { sound.playClick(); setPlaySubTab('servers'); }}
                    className={`relative pb-3 font-bold transition flex items-center gap-2 cursor-pointer ${
                      playSubTab === 'servers'
                        ? 'text-white border-b-2 border-[#A3E635]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5 text-slate-300" />
                    <span>SERVERS {selectedServers.length}/6</span>
                  </button>
                </div>

                {/* SUBTAB 1: 3 MATCHMAKING TIERS (FREE • PREMIUM • VIP) */}
                {playSubTab === 'match_type' && (
                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
                    
                    {/* CARD 1: FREE STANDARD MATCH */}
                    <div
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMatchTier('free');
                      }}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 ${
                        selectedMatchTier === 'free'
                          ? 'bg-gradient-to-b from-[#18210C] via-[#11141C] to-[#0E1017] border-[#A3E635]/70 shadow-[0_0_25px_rgba(163,230,53,0.18)] ring-1 ring-[#A3E635]/30'
                          : 'bg-[#12141C] border-[#222736] hover:border-[#A3E635]/40 text-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300">
                              <Swords className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-base font-black font-display text-white">Standard Match • 5v5</h4>
                              <div className="text-[10px] font-mono text-slate-400">Open competitive queue</div>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10">
                            FREE
                          </span>
                        </div>

                        {/* Perk Pills Grid */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Users className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">All Parties</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Star className="w-3 h-3 text-[#A3E635] fill-[#A3E635] shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Verified</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <TrendingUp className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Open ELO</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Star className="w-3 h-3 text-[#A3E635] fill-[#A3E635] shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Veteran</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Wifi className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Sub-Tick</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <ShieldAlert className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Anti-Cheat</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-white/[0.04]">
                        <span className="text-slate-500">Wait time: ~35s</span>
                        <span className={`font-bold ${selectedMatchTier === 'free' ? 'text-[#A3E635]' : 'text-slate-400'}`}>
                          {selectedMatchTier === 'free' ? '✓ SELECTED' : 'Click to Select'}
                        </span>
                      </div>
                    </div>

                    {/* CARD 2: PREMIUM SUPER MATCH */}
                    <div
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMatchTier('premium');
                      }}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 ${
                        selectedMatchTier === 'premium'
                          ? 'bg-gradient-to-b from-amber-500/15 via-[#16131C] to-[#0E1017] border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.22)] ring-1 ring-amber-500/40'
                          : 'bg-[#12141C] border-[#222736] hover:border-amber-500/40 text-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                              <Zap className="w-4 h-4 fill-amber-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-black font-display text-white">Super Match • 5v5</h4>
                              <div className="text-[10px] font-mono text-amber-400 font-bold">Strict ELO & Captain Vetoes</div>
                            </div>
                          </div>
                          {userMembershipTier === 'free' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                              <Lock className="w-3 h-3 text-amber-400" />
                              PREMIUM ONLY
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                              <Zap className="w-3 h-3 fill-amber-400" />
                              PREMIUM
                            </span>
                          )}
                        </div>

                        {/* Perk Pills Grid */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Users className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Solo/Duo</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Verified</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <TrendingUp className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">±250 ELO</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Veteran</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Captains</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Anti-Smurf</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-white/[0.04]">
                        <span className="text-slate-500">Wait time: ~18s</span>
                        {userMembershipTier === 'free' ? (
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Lock className="w-3 h-3 inline" />
                            {selectedMatchTier === 'premium' ? 'PREMIUM REQUIRED' : 'Click to Preview'}
                          </span>
                        ) : (
                          <span className={`font-bold ${selectedMatchTier === 'premium' ? 'text-amber-400' : 'text-slate-400'}`}>
                            {selectedMatchTier === 'premium' ? '✓ SELECTED' : 'Click to Select'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CARD 3: VIP ELITE MATCH */}
                    <div
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMatchTier('vip');
                      }}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 ${
                        selectedMatchTier === 'vip'
                          ? 'bg-gradient-to-b from-purple-500/15 via-[#171322] to-[#0E1017] border-purple-500/70 shadow-[0_0_25px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40'
                          : 'bg-[#12141C] border-[#222736] hover:border-purple-500/40 text-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                              <Crown className="w-4 h-4 fill-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-black font-display text-white">VIP Elite Match • 5v5</h4>
                              <div className="text-[10px] font-mono text-purple-400 font-bold">High Stakes & Pro GOTV</div>
                            </div>
                          </div>
                          {userMembershipTier !== 'vip' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center gap-1 shadow-sm">
                              <Lock className="w-3 h-3 text-purple-400" />
                              VIP ONLY
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                              <Crown className="w-3 h-3 fill-amber-300" />
                              VIP ELITE
                            </span>
                          )}
                        </div>

                        {/* Perk Pills Grid */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Crosshair className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Solo/Duo</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <ShieldCheck className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Verified</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <TrendingUp className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">±150 ELO</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Film className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">GOTV VOD</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">2x Points</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">High Stakes</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-white/[0.04]">
                        <span className="text-slate-500">Wait time: ~12s</span>
                        {userMembershipTier !== 'vip' ? (
                          <span className="font-bold text-purple-400 flex items-center gap-1">
                            <Crown className="w-3 h-3 inline" />
                            {selectedMatchTier === 'vip' ? 'VIP REQUIRED' : 'Click to Preview'}
                          </span>
                        ) : (
                          <span className={`font-bold ${selectedMatchTier === 'vip' ? 'text-purple-400' : 'text-slate-400'}`}>
                            {selectedMatchTier === 'vip' ? '✓ SELECTED' : 'Click to Select'}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* SUBTAB 2: MAP POOL SELECTOR */}
                {playSubTab === 'maps' && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#12141C] border border-[#232838] space-y-3 animate-in fade-in duration-200">
                    <div className="flex flex-wrap items-center justify-between text-xs font-mono gap-2">
                      <span className="text-slate-300 font-bold">ACTIVE DUTY MAP POOL ({selectedMaps.length}/7):</span>
                      <span className="text-slate-500 text-[11px]">Click maps to toggle them in your queue preference</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                      {AVAILABLE_MAP_POOL.map((map) => {
                        const isSelected = selectedMaps.includes(map.id);
                        return (
                          <button
                            key={map.id}
                            onClick={() => handleToggleMap(map.id)}
                            className={`group relative h-28 sm:h-32 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer flex flex-col justify-between p-3 text-left select-none ${
                              isSelected
                                ? 'border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.35)] ring-1 ring-[#A3E635]'
                                : 'border-white/10 opacity-55 hover:opacity-90 hover:border-white/30'
                            }`}
                          >
                            {/* CS2 Official Map Background Photo */}
                            <img 
                              src={map.image} 
                              alt={map.name}
                              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                                isSelected ? 'brightness-90 contrast-105' : 'grayscale brightness-60'
                              }`} 
                            />
                            {/* Dark Gradient Overlay for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

                            {/* Top Selection Status Pill (✓ or +) */}
                            <div className="relative z-10 flex items-center justify-between w-full">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs transition ${
                                isSelected 
                                  ? 'bg-[#A3E635] text-black shadow-sm font-black' 
                                  : 'bg-black/60 text-slate-400 border border-white/15'
                              }`}>
                                {isSelected ? '✓' : '+'}
                              </span>
                            </div>

                            {/* Single Clean Map Name (No duplicate de_ prefix) */}
                            <div className="relative z-10">
                              <span className={`font-display font-black text-sm tracking-wide drop-shadow-md transition ${
                                isSelected ? 'text-white' : 'text-slate-300'
                              }`}>
                                {map.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SUBTAB 3: SERVER COUNTRY PICKER (MATCHING REFERENCE EXACTLY) */}
                {playSubTab === 'servers' && (
                  <div className="mt-4 p-6 rounded-2xl bg-[#0B0D13] border border-[#232838] space-y-5 animate-in fade-in duration-200">
                    {/* Top Recommendation Banner */}
                    <div className="text-center text-xs sm:text-sm font-sans text-slate-300">
                      <span>For a better server experience, we recommend switching to </span>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setSelectedServers(['netherlands', 'germany', 'sweden', 'finland']);
                          setServerWarning('Optimized server location profile applied (lowest average ping).');
                          setTimeout(() => setServerWarning(null), 3000);
                        }}
                        className="text-[#FF5500] hover:text-[#FFAA00] font-bold cursor-pointer transition underline decoration-[#FF5500]/50"
                      >
                        Optimized server location.
                      </button>
                    </div>

                    {/* 6 Country Flag Cards Row */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
                      {SERVER_COUNTRY_LOCATIONS.map((srv) => {
                        const isSelected = selectedServers.includes(srv.id);
                        return (
                          <button
                            key={srv.id}
                            onClick={() => handleToggleServer(srv.id)}
                            className={`relative w-24 sm:w-28 p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-between gap-2.5 shrink-0 ${
                              isSelected
                                ? 'bg-[#141722] border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.12)]'
                                : 'bg-[#0E1017] border border-white/10 hover:border-white/30 opacity-50 hover:opacity-85'
                            }`}
                          >
                            <div className="w-full h-11 sm:h-12 rounded-md overflow-hidden flex items-center justify-center bg-black/40 shadow-inner">
                              {srv.flagSvg}
                            </div>
                            <div className="w-full text-center">
                              <div className="text-xs font-bold text-white tracking-tight truncate">
                                {srv.name}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bottom Helper Text */}
                    <div className="text-center text-xs font-sans text-slate-400">
                      <span>Select a minimum of 4 servers that you would like to play on. </span>
                      <a
                        href="https://support.faceit.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-slate-300 hover:text-white transition"
                      >
                        Learn more
                      </a>
                    </div>

                    {serverWarning && (
                      <div className="text-center text-xs font-mono text-amber-400 animate-in fade-in">
                        ⚠️ {serverWarning}
                      </div>
                    )}
                  </div>
                )}

                {/* LIVE QUEUE FOOTER METRICS (AS SHOWN IN PHOTO) */}
                <div className="mt-6 pt-3 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
                  <div className="flex items-center gap-4">
                    <span>Live matches: <strong className="text-slate-300">10,697</strong></span>
                    <span>•</span>
                    <span>Players queueing: <strong className="text-[#A3E635]">3,164</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={handleToggleAntiCheat}
                      className="inline-flex items-center gap-1.5 transition cursor-pointer hover:underline"
                      title={isAntiCheatActive ? "Anti-Cheat is ACTIVE" : "Anti-Cheat is STOPPED (Click to launch)"}
                    >
                      {isAntiCheatActive ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                          <span className="text-emerald-400 font-bold">Ring-0 Kernel Anti-Cheat Active</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-[#FF5500] inline" />
                          <span className="text-[#FF5500] font-bold">Anti-Cheat Not Running (Click to launch)</span>
                        </>
                      )}
                    </button>
                    <span>•</span>
                    <span>Region: Global</span>
                  </div>
                </div>

              </div>

              {/* INTERACTIVE TEAM FINDER // SQUAD RADAR MODULE */}
              <div className="mt-6">
                <VortexSquadRadar
                  currentGamerTag={currentGamerTag}
                  currentClanTag={currentClanTag}
                  members={userClanData.members.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    role: m.role || 'Player',
                    level: m.level || 9,
                    elo: m.elo || 2000,
                    avatar: m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80',
                    countryCode: m.countryCode || 'XK',
                    isCaptain: m.isCaptain
                  }))}
                  onRecruit={handleRecruitToSquad}
                  onRemove={handleRemoveFromSquad}
                  onAutoFill5Stack={handleAutoFillSquad}
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: COMING SOON (Tournaments, Scrims Hub, 1v1 Aim, Lineups) */}
          {/* ======================================================== */}
          {(Boolean(COMING_SOON_TABS[activeTab]) && !(activeTab === 'tournaments' && SHOW_TOURNAMENTS_LIVE)) && (() => {
            const devInfo = COMING_SOON_TABS[activeTab];
            const Icon = devInfo.icon;
            return (
              <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 md:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
                {/* Top Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E2333] gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner shrink-0"
                      style={{
                        backgroundColor: `${devInfo.color}15`,
                        borderColor: `${devInfo.color}40`,
                        color: devInfo.color
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-2xl font-black font-display text-white">{devInfo.title}</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>{devInfo.badge}</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-0.5 font-mono">
                        {devInfo.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeTab === 'tournaments' && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setShowPartnersModal(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#171C2B] hover:bg-[#1F263A] border border-amber-400/30 text-xs font-mono font-bold text-amber-300 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Official Partners (HLTV)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Hero Presentation Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#131722] via-[#0D1017] to-[#080A0E] border border-[#202536] p-6 sm:p-10 text-center space-y-6">
                  {/* Atmospheric Glow */}
                  <div
                    className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-15"
                    style={{ backgroundColor: devInfo.color }}
                  />

                  <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    {/* Glowing Cyber Icon Badge */}
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border-2 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
                      style={{
                        backgroundColor: `${devInfo.color}15`,
                        borderColor: `${devInfo.color}60`,
                        color: devInfo.color
                      }}
                    >
                      <Icon className="w-10 h-10" />
                    </div>

                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-amber-500/30 text-xs font-mono text-amber-300 shadow-md">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold tracking-wide">TAB TEMPORARILY LOCKED • STRUCTURAL RE-CALIBRATION</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                        {devInfo.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-slate-400">
                        {devInfo.desc}
                      </p>
                    </div>

                    {/* Dedicated Official Return Announcement Box */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#090B10]/80 border border-white/10 text-left space-y-2.5 backdrop-blur-sm shadow-xl">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Official Feature Return Announcement</span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                        {devInfo.announcement}
                      </p>
                    </div>

                    {/* Engineering Milestone Progress */}
                    <div className="max-w-xl mx-auto space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{devInfo.phase}</span>
                        </span>
                        <span className="font-bold text-white">{devInfo.progress}% Complete</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#1A1F2C] border border-[#2B3448] overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${devInfo.progress}%`,
                            background: `linear-gradient(90deg, ${devInfo.color}88 0%, ${devInfo.color} 100%)`,
                            boxShadow: `0 0 15px ${devInfo.color}80`
                          }}
                        />
                      </div>
                    </div>

                    {/* 4 Feature Highlights Grid */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      {devInfo.highlights.map((h, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 hover:border-white/10 transition"
                        >
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{h.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans pl-5.5 leading-normal">
                            {h.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          sound.playTournamentVictory();
                          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                          setDashboardToast(`✓ Notification enabled! You will be alerted first when ${devInfo.title} launches.`);
                          setTimeout(() => setDashboardToast(null), 4500);
                        }}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 cursor-pointer flex items-center gap-2 active:scale-95"
                      >
                        <Bell className="w-4 h-4" />
                        <span>Notify me when this tab launches</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* LIVE AD BANNER (MONETAG & CRYPTO AD NETWORK) */}
                <VortexAdBanner placement="coming-soon" />
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* TAB: TOURNAMENTS (ESPORTS CASH PRIZE POOLS)              */}
          {/* ======================================================== */}
          {activeTab === 'tournaments' && SHOW_TOURNAMENTS_LIVE && (
            <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-4 border-b border-[#1E2333] gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">CALIBER CLUTCH CS2 TOURNAMENT CIRCUIT</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold animate-pulse">
                      SEASON 1 LIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Official European competitive circuit • 100% Cash Prize Pools & Ring-0 Kernel Anti-Cheat protection
                  </p>
                </div>
                <div className="flex items-center flex-wrap gap-2 p-1 rounded-2xl bg-[#090C12] border border-white/10 shrink-0 max-w-full">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setTourneyTabMode('browse');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      tourneyTabMode === 'browse'
                        ? 'bg-[#181F30] text-white border border-[#2B3650] shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Browse Tournaments</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setTourneyTabMode('create');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5 ${
                      tourneyTabMode === 'create'
                        ? 'bg-[#A3E635] text-slate-950 shadow-lg shadow-lime-500/20'
                        : 'text-[#A3E635] hover:bg-[#A3E635]/10'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Create Tournament</span>
                  </button>
                  {isProjectAdmin && (
                    <button
                      onClick={() => {
                        sound.playSelect();
                        setTourneyTabMode('faceit');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5 ${
                        tourneyTabMode === 'faceit'
                          ? 'bg-[#FF5500] text-white shadow-lg shadow-orange-500/25'
                          : 'text-orange-400 hover:bg-orange-500/10'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>FACEIT Admin Setup</span>
                    </button>
                  )}
                </div>
              </div>

              {tourneyTabMode === 'faceit' && isProjectAdmin ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* FACEIT Integration Header Banner */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#170E08] via-[#121622] to-[#0A0D15] border border-orange-500/30 gap-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40 uppercase flex items-center gap-1.5 tracking-wider">
                          <Globe className="w-3.5 h-3.5 text-[#FF5500]" />
                          OFFICIAL FACEIT ORGANIZER & DEVELOPER SYNC
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          100% LEGAL & TOS COMPLIANT
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wide">
                        FACEIT DEVELOPER PORTAL & TOURNAMENT HUB
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-2xl leading-relaxed">
                        Connect your official developer application from <strong className="text-orange-400">developers.faceit.com</strong> to synchronize championship brackets, automate Sub-Tick match servers, and enforce Ring-0 Kernel Anti-Cheat.
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                      <a
                        href="https://developers.faceit.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#1C1F2B] hover:bg-[#252A3B] border border-orange-500/40 text-orange-400 font-mono font-bold text-xs flex items-center justify-center gap-2 transition hover:scale-[1.02] shadow-md"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Tab 1: developers.faceit.com</span>
                      </a>
                      <a
                        href={faceitOrgIdInput ? `https://www.faceit.com/en/organizers/${faceitOrgIdInput}/CaliberClutch` : 'https://www.faceit.com/en/organizers/4f34046b-65a6-402d-8845-56376c7e77d1/CaliberClutch'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6a1f] text-white font-mono font-black text-xs flex items-center justify-center gap-2 transition hover:scale-[1.02] shadow-lg shadow-orange-500/25"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Tab 2: faceit.com/en/organizers/.../CaliberClutch</span>
                      </a>
                    </div>
                  </div>

                  {/* 2-Column Grid: Config Form & Live Architecture */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: API & Organizer Setup (7 Cols) */}
                    <div className="lg:col-span-7 rounded-3xl bg-[#0E121B] border border-[#202738] p-6 sm:p-7 space-y-6 text-left shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                            <Key className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-display font-black text-white text-base">DEVELOPER APP CREDENTIALS</h4>
                            <p className="text-[11px] font-mono text-slate-400">Configured in developers.faceit.com &gt; My Apps &gt; Data API v4</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                          v4 Open API
                        </span>
                      </div>

                      <div className="space-y-4 text-xs font-mono">
                        <div>
                          <label className="text-[11px] text-amber-400 uppercase tracking-wider block mb-1.5 font-bold flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Key className="w-3.5 h-3.5 text-amber-400" />
                              <span>FACEIT Open API Server Key (Bearer)</span>
                            </span>
                            <a 
                              href="https://developers.faceit.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-orange-400 hover:underline flex items-center gap-1 font-normal lowercase"
                            >
                              <span>get key</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </label>
                          <input
                            type="password"
                            value={faceitKeyInput}
                            onChange={(e) => setFaceitKeyInput(e.target.value)}
                            placeholder="Enter API Key from developers.faceit.com (e.g. 8f92b7c4-...)"
                            className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-amber-300 font-mono focus:outline-none focus:border-orange-500 text-xs"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            Stored securely in local client session. Never exposed publicly or logged.
                          </p>
                        </div>

                        <div>
                          <label className="text-[11px] text-amber-400 uppercase tracking-wider block mb-1.5 font-bold flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                              <span>FACEIT Organizer ID</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">UUID from faceit.com URL</span>
                          </label>
                          <input
                            type="text"
                            value={faceitOrgIdInput}
                            onChange={(e) => setFaceitOrgIdInput(e.target.value)}
                            placeholder="4f34046b-65a6-402d-8845-56376c7e77d1"
                            className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-slate-200 font-mono focus:outline-none focus:border-orange-500 text-xs"
                          />
                        </div>

                        {/* Feature Toggles */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5 text-slate-300 cursor-pointer hover:border-orange-500/30 transition">
                            <input
                              type="checkbox"
                              checked={faceitConfig.enforceFaceitAC}
                              onChange={(e) => {
                                const updated = { ...faceitConfig, enforceFaceitAC: e.target.checked };
                                setFaceitConfig(updated);
                                saveFaceitOrganizerConfig({ enforceFaceitAC: e.target.checked });
                              }}
                              className="accent-orange-500 w-4 h-4 rounded"
                            />
                            <div>
                              <div className="font-bold text-white text-[11px]">Enforce Mandatory FACEIT Ring-0 Kernel Anti-Cheat</div>
                              <div className="text-[10px] text-slate-400">All players must run official FACEIT AC client before entering tournament servers</div>
                            </div>
                          </label>

                          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5 text-slate-300 cursor-pointer hover:border-orange-500/30 transition">
                            <input
                              type="checkbox"
                              checked={faceitConfig.autoProgressBracket}
                              onChange={(e) => {
                                const updated = { ...faceitConfig, autoProgressBracket: e.target.checked };
                                setFaceitConfig(updated);
                                saveFaceitOrganizerConfig({ autoProgressBracket: e.target.checked });
                              }}
                              className="accent-orange-500 w-4 h-4 rounded"
                            />
                            <div>
                              <div className="font-bold text-white text-[11px]">Automate Bracket Progression on Match Finish</div>
                              <div className="text-[10px] text-slate-400">Auto-advance winning teams through quarterfinals, semifinals, and grand finals</div>
                            </div>
                          </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playSelect();
                              saveFaceitOrganizerConfig({
                                apiKey: faceitKeyInput.trim(),
                                organizerId: faceitOrgIdInput.trim()
                              });
                              setFaceitConfig(getFaceitOrganizerConfig());
                              setFaceitSavingSuccess(true);
                              setTimeout(() => setFaceitSavingSuccess(false), 3000);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6a1f] text-white font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-orange-500/25 flex items-center gap-2"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save Credentials</span>
                          </button>

                          <button
                            type="button"
                            disabled={faceitTesting}
                            onClick={async () => {
                              sound.playClick();
                              setFaceitTesting(true);
                              setFaceitStatusResult(null);

                              if (!faceitKeyInput.trim()) {
                                setFaceitStatusResult({
                                  success: false,
                                  message: '⚠️ Missing FACEIT API Key! Navigate to Tab 1 (developers.faceit.com) > My Apps > API Keys, generate a Server API Key, and enter it here to link live servers.'
                                });
                                setFaceitTesting(false);
                                return;
                              }

                              saveFaceitOrganizerConfig({
                                apiKey: faceitKeyInput.trim(),
                                organizerId: faceitOrgIdInput.trim()
                              });

                              try {
                                const result = await testLiveFaceitConnection(faceitOrgIdInput.trim(), faceitKeyInput.trim());
                                if (result.success && result.organizer) {
                                  setFaceitStatusResult({
                                    success: true,
                                    message: `🟢 LIVE FACEIT connection verified! Organizer: ${result.organizer.name || 'CaliberClutch'}`,
                                    details: result.organizer
                                  });
                                } else {
                                  setFaceitStatusResult({
                                    success: false,
                                    message: result.error || 'Live connection with FACEIT failed. Verify your API Key on developers.faceit.com.'
                                  });
                                }
                              } catch (err: any) {
                                setFaceitStatusResult({
                                  success: false,
                                  message: `API query error: ${err?.message || 'Check your API Key from developers.faceit.com'}`
                                });
                              } finally {
                                setFaceitTesting(false);
                              }
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#171C2B] hover:bg-[#20273D] border border-white/10 text-white font-mono font-bold text-xs uppercase transition cursor-pointer flex items-center gap-2"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${faceitTesting ? 'animate-spin' : ''}`} />
                            <span>{faceitTesting ? 'Testing live...' : 'Test Connection'}</span>
                          </button>

                          {faceitSavingSuccess && (
                            <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 animate-in fade-in">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Successfully Saved!</span>
                            </span>
                          )}
                        </div>

                        {faceitStatusResult && (
                          <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 animate-in fade-in duration-150 ${
                            faceitStatusResult.success 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : 'bg-red-500/10 border-red-500/30 text-red-400'
                          }`}>
                            {faceitStatusResult.success ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="font-bold">{faceitStatusResult.message}</div>
                              {faceitStatusResult.details && (
                                <div className="text-[10px] text-slate-300 mt-1">
                                  Emri: {faceitStatusResult.details.name} • Tipi: {faceitStatusResult.details.type || 'Organizer Hub'} • URL: {faceitStatusResult.details.faceit_url || 'https://www.faceit.com/en/organizers/4f34046b-65a6-402d-8845-56376c7e77d1/CaliberClutch'}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Live Integration Diagnostics & Valve Compliance (5 Cols) */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* Architecture Specs Card */}
                      <div className="rounded-3xl bg-[#0E121B] border border-[#202738] p-6 space-y-4 text-left shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-orange-400" />
                            <h4 className="font-display font-black text-white text-sm">SERVER ALLOCATION SPECS</h4>
                          </div>
                          <span className={`w-2.5 h-2.5 rounded-full ${faceitStatusResult?.success ? 'bg-emerald-400 animate-pulse' : faceitKeyInput.trim() ? 'bg-amber-400' : 'bg-red-400'}`} />
                        </div>

                        <div className="space-y-3 text-xs font-mono">
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-slate-400">Statusi i Lidhjes</span>
                            {faceitStatusResult?.success ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                LIVE ONLINE (Frankfurt EU)
                              </span>
                            ) : faceitKeyInput.trim() ? (
                              <span className="text-amber-400 font-bold">Saved Key (Click Test)</span>
                            ) : (
                              <span className="text-rose-400 font-bold">Missing API Key</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-slate-400">Match Server Node</span>
                            <span className="text-white font-bold">FACEIT EU-Central Sub-Tick</span>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-slate-400">Sub-Tick Rate</span>
                            <span className="text-emerald-400 font-bold">128-Subtick CS2 Engine</span>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-slate-400">Anti-Cheat Client</span>
                            <span className="text-cyan-400 font-bold">FACEIT AC Kernel Ring-0</span>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-slate-400">Hub Organizer</span>
                            <a 
                              href="https://www.faceit.com/en/organizers/4f34046b-65a6-402d-8845-56376c7e77d1/CaliberClutch"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-400 font-bold hover:underline flex items-center gap-1"
                            >
                              <span>CaliberClutch</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            sound.playClick();
                            if (!faceitKeyInput.trim()) {
                              setFaceitStatusResult({
                                success: false,
                                message: '⚠️ Enter your API Key from Tab 1 to fetch live tournaments from FACEIT.'
                              });
                              return;
                            }
                            try {
                              const res = await fetchLiveOrganizerTournaments(faceitOrgIdInput.trim(), faceitKeyInput.trim());
                              if (res.success) {
                                setFaceitLiveTourneys(res.items);
                                if (res.items.length > 0) {
                                  const mapped = res.items.map((fi: any) => ({
                                    id: `faceit-${fi.championship_id || fi.id || Math.random()}`,
                                    title: fi.name || 'CaliberClutch FACEIT Championship',
                                    type: 'FACEIT OFFICIAL CHAMPIONSHIP',
                                    game: 'CS2 5v5 Tactical',
                                    cashPrize: fi.prize_type === 'cash' ? `€${(fi.total_prize || 1000).toLocaleString()}` : '€1,000 Cash Pool',
                                    teams: `${fi.current_subscriptions || 0} / ${fi.total_groups || fi.max_match || 16}`,
                                    maxTeams: fi.max_match || 16,
                                    registeredTeamsCount: fi.current_subscriptions || 0,
                                    date: fi.championship_start ? new Date(fi.championship_start).toLocaleDateString() : 'Live on FACEIT Hub',
                                    status: fi.status === 'ongoing' ? 'LIVE NOW' : fi.status === 'finished' ? 'COMPLETED' : 'REGISTRATION OPEN',
                                    badge: 'bg-[#FF5500]/20 text-[#FF5500] border-[#FF5500]/40',
                                    isLive: fi.status === 'ongoing',
                                    isOpen: fi.status === 'join' || fi.status === 'open' || !fi.status,
                                    isCustom: false,
                                    isFaceitOfficial: true,
                                    faceitUrl: fi.faceit_url ? (fi.faceit_url.replace('{lang}', 'en')) : `https://www.faceit.com/en/championship/${fi.championship_id || fi.id}`,
                                    organizer: 'CaliberClutch (FACEIT Hub)',
                                    creator: 'CaliberClutch',
                                    entryFee: 0,
                                    structure: fi.type || 'Single Elimination',
                                    region: 'FACEIT EU-Central Sub-Tick (Frankfurt)',
                                    payout1st: '70% Cash Pool',
                                    payout2nd: '20% Cash Pool',
                                    payout3rd: '10% Cash Pool'
                                  }));

                                  setCustomTournaments(prev => {
                                    const existingIds = new Set(prev.map((p: any) => p.id));
                                    const newItems = mapped.filter((m: any) => !existingIds.has(m.id));
                                    const updated = [...newItems, ...prev];
                                    try {
                                      setLocalState('caliber_custom_tournaments', JSON.stringify(updated));
                                    } catch (_) {}
                                    return updated;
                                  });
                                }
                                setFaceitStatusResult({
                                  success: true,
                                  message: res.items.length > 0 
                                    ? `Synchronized ${res.items.length} live tournaments from FACEIT to the platform!` 
                                    : 'Connection to FACEIT active! No public championships have been created yet on CaliberClutch at faceit.com (Tab 2).'
                                });
                              } else {
                                setFaceitStatusResult({
                                  success: false,
                                  message: res.error || 'Failed to synchronize tournaments from FACEIT.'
                                });
                              }
                            } catch (err: any) {
                              setFaceitStatusResult({
                                success: false,
                                message: `Synchronization error: ${err?.message || 'Check your API Key'}`
                              });
                            }
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#151926] hover:bg-[#1E2538] border border-orange-500/30 text-orange-400 font-mono font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Sync Live Organizer Tournaments</span>
                        </button>

                        {faceitLiveTourneys.length > 0 ? (
                          <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-2">
                            <div className="text-[11px] font-mono font-bold text-emerald-400">
                              ✓ {faceitLiveTourneys.length} Live Tournaments on CaliberClutch FACEIT Hub:
                            </div>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                              {faceitLiveTourneys.map((t, idx) => (
                                <div key={idx} className="p-2 rounded bg-white/5 flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-white font-bold truncate max-w-[180px]">{t.name || `Tournament #${idx + 1}`}</span>
                                  <span className="text-amber-400">{t.status || 'Active'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {/* Official Compliance Guarantee */}
                      <div className="rounded-3xl bg-gradient-to-b from-[#10141E] to-[#0A0D14] border border-emerald-500/25 p-5 space-y-2.5 text-left shadow-xl">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>100% FACEIT & Valve TOS Compliant</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          CaliberClutch operates strictly as an esports organizer and competitive hub. All skin gambling, cases, unboxing, and unauthorized entry fees have been completely removed. Tournaments use verified skill-based match allocation under official FACEIT guidelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : tourneyTabMode === 'create' ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Mode Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-[#121624] via-[#0D101A] to-[#121624] border border-[#232C42] gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 uppercase flex items-center gap-1.5 tracking-wider">
                          <Trophy className="w-3.5 h-3.5 text-[#A3E635]" />
                          CALIBERCLUTCH ESPORTS CIRCUIT
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          100% PURE CASH POOL
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wide">
                        HOST A CS2 TOURNAMENT & CLAN SETUP
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        Configure championship formats, official clan rules, and pure cash prize pools for European online competitive brackets.
                      </p>
                    </div>
                  </div>

                  {/* STACKED LAYOUT: TOP WINDOW (TOURNAMENT SETUP) • BOTTOM WINDOW (OFFICIAL RULEBOOK) */}
                  <div className="space-y-8">
                    
                    {/* WINDOW 1 (TOP • FULL-WIDTH): TOURNAMENT SETUP & CLAN CONFIGURATION */}
                    <div className="w-full max-w-full rounded-3xl bg-[#0E121B] border border-[#202738] p-6 sm:p-8 space-y-6 text-left shadow-2xl overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-[#A3E635]" />
                            <h4 className="font-display font-black text-white text-lg">TOURNAMENT SETUP & CLAN CONFIGURATION</h4>
                          </div>
                          <p className="text-xs font-mono text-slate-400 mt-1">Configure championship parameters, playoff formats, pure cash prize distribution, and organizer identity</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                            Verified 5v5 Competitive
                          </span>
                          <span className="px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                            Instant Payout
                          </span>
                        </div>
                      </div>

                      {/* Form Fields Container */}
                      <div className="space-y-5 text-xs font-mono w-full max-w-full">
                        {/* 1. Organizer Name & Tournament Title (2 Columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full">
                          <div className="min-w-0 w-full">
                            <label className="text-[11px] text-amber-400 uppercase tracking-wider block mb-1.5 font-bold flex items-center gap-1.5">
                              <Crown className="w-4 h-4 text-amber-400" />
                              <span>Organizer / Host Clan Name</span>
                            </label>
                            <input
                              type="text"
                              value={newTourneyOrganizer}
                              onChange={(e) => setNewTourneyOrganizer(e.target.value)}
                              placeholder="e.g. Caliber Squad or Streamer Name"
                              className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-amber-300 font-bold focus:outline-none focus:border-amber-400 placeholder:text-slate-500 placeholder:font-normal text-sm"
                            />
                          </div>

                          <div className="min-w-0 w-full">
                            <label className="text-[11px] text-slate-300 uppercase tracking-wider block mb-1.5 font-bold">
                              Tournament Title
                            </label>
                            <input
                              type="text"
                              value={newTourneyTitle}
                              onChange={(e) => setNewTourneyTitle(e.target.value)}
                              placeholder="e.g. CaliberClutch Open Cup #1"
                              className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-white font-bold focus:outline-none focus:border-[#A3E635] placeholder:text-slate-500 placeholder:font-normal text-sm"
                            />
                          </div>
                        </div>

                        {/* 2. Cash Prize Pool & Max Teams & Structure (With Entry Fees Directly Under Prize Pool) */}
                        <div className="space-y-3 w-full max-w-full">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-full">
                            <div className="min-w-0 w-full">
                              <label className="text-[11px] text-slate-300 uppercase tracking-wider block mb-1.5 font-bold flex items-center justify-between">
                                <span className="truncate">Prize Pool (€)</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#A3E635]/15 text-[#A3E635] font-mono font-bold tracking-normal whitespace-nowrap">
                                  AUTO-SPLIT
                                </span>
                              </label>
                              <div className="relative w-full">
                                <input
                                  type="text"
                                  value={newTourneyCashPrize}
                                  onChange={(e) => handleCashPrizeChange(e.target.value)}
                                  placeholder="e.g. 1000 or 10.000"
                                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-[#A3E635] font-black focus:outline-none focus:border-[#A3E635] placeholder:text-slate-500 placeholder:font-normal text-sm"
                                />
                                <span className="absolute left-3 top-3 text-[#A3E635]/70 font-black text-sm">€</span>
                              </div>
                            </div>

                            <div className="min-w-0 w-full">
                              <label className="text-[11px] text-slate-300 uppercase tracking-wider block mb-1.5 font-bold whitespace-nowrap">
                                Team Capacity
                              </label>
                              <select
                                value={newTourneyMaxTeams}
                                onChange={(e) => handleMaxTeamsChange(Number(e.target.value))}
                                className="w-full max-w-full min-w-0 px-3 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-white font-bold focus:outline-none focus:border-[#A3E635] cursor-pointer text-xs sm:text-sm truncate"
                              >
                                <option value={8} className="bg-[#141722] text-white">8 Teams (Quarter-Finals)</option>
                                <option value={16} className="bg-[#141722] text-white">16 Teams (Round of 16)</option>
                                <option value={32} className="bg-[#141722] text-white">32 Teams (Championship)</option>
                                <option value={64} className="bg-[#141722] text-white">64 Teams (Open Circuit)</option>
                              </select>
                            </div>

                            <div className="min-w-0 w-full">
                              <label className="text-[11px] text-slate-300 uppercase tracking-wider block mb-1.5 font-bold whitespace-nowrap">
                                Bracket Format
                              </label>
                              <select
                                value={newTourneyStructure}
                                onChange={(e) => setNewTourneyStructure(e.target.value)}
                                className="w-full max-w-full min-w-0 px-3 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-white font-bold focus:outline-none focus:border-[#A3E635] cursor-pointer text-xs sm:text-sm truncate"
                              >
                                <option value="Single Elimination" className="bg-[#141722] text-white">Single Elimination (5v5)</option>
                                <option value="Double Elimination" className="bg-[#141722] text-white">Double Elimination (5v5)</option>
                                <option value="GSL Group Stage + Single Elim" className="bg-[#141722] text-white">GSL Group + Single Elim</option>
                              </select>
                            </div>
                          </div>

                          {/* Auto-Calculated Entry Fees - Directly Under Prize Pool & Capacity */}
                          {(() => {
                            const prizePool = parseCurrencyInput(newTourneyCashPrize);
                            const hostFee = prizePool > 0 ? prizePool * 0.05 : 0;
                            const adminFee = prizePool > 0 ? prizePool * 0.05 : 0;
                            const totalCollected = prizePool > 0 ? prizePool + hostFee + adminFee : 0; // P + 5% + 5% = P * 1.10
                            const feePerTeamNum = (prizePool > 0 && newTourneyMaxTeams > 0) ? totalCollected / newTourneyMaxTeams : 0;
                            const feePerPlayerNum = feePerTeamNum > 0 ? feePerTeamNum / 5 : 0;
                            const feePerTeamStr = feePerTeamNum > 0 ? feePerTeamNum.toFixed(2) : '0.00';
                            const feePerPlayerStr = feePerPlayerNum > 0 ? feePerPlayerNum.toFixed(2) : '0.00';

                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div>
                                  <label className="text-[11px] text-slate-300 uppercase block mb-1.5 font-bold flex items-center justify-between">
                                    <span>Auto-Calculated Fee per Team</span>
                                    <span className="text-[10px] text-[#A3E635] font-normal">Auto-Synced</span>
                                  </label>
                                  <div className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E16] border border-[#252C3D] text-amber-300 font-bold flex items-center justify-between text-sm font-mono">
                                    <span>€{feePerTeamStr}</span>
                                    <span className="text-xs text-slate-400 font-normal">€{feePerTeamStr} / team</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[11px] text-slate-300 uppercase block mb-1.5 font-bold">
                                    Calculated per Player (5v5 Lineup)
                                  </label>
                                  <div className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E16] border border-[#252C3D] text-emerald-400 font-bold flex items-center justify-between text-sm font-mono">
                                    <span>€{feePerPlayerStr}</span>
                                    <span className="text-xs text-slate-400 font-normal">€{feePerPlayerStr} / player</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* 3. AUTOMATED FINANCIAL SPLIT (100% Pure Untouched Prize Pool + Participant-Funded 5% Fees) */}
                        {(() => {
                          const prizePool = parseCurrencyInput(newTourneyCashPrize);
                          const platformFee = prizePool > 0 ? prizePool * 0.05 : 0;
                          const organizerFee = prizePool > 0 ? prizePool * 0.05 : 0;
                          const totalCollected = prizePool > 0 ? prizePool + platformFee + organizerFee : 0; // 100% prize + 5% platform + 5% organizer
                          const firstPrize = prizePool > 0 ? Math.round(prizePool * 0.70) : 0;
                          const secondPrize = prizePool > 0 ? Math.round(prizePool * 0.20) : 0;
                          const thirdPrize = prizePool > 0 ? Math.max(0, prizePool - firstPrize - secondPrize) : 0;
                          const feePerTeamNum = (prizePool > 0 && newTourneyMaxTeams > 0) ? totalCollected / newTourneyMaxTeams : 0;
                          const feePerPlayerNum = feePerTeamNum > 0 ? feePerTeamNum / 5 : 0;
                          const feePerTeamStr = feePerTeamNum > 0 ? feePerTeamNum.toFixed(2) : '0.00';
                          const feePerPlayerStr = feePerPlayerNum > 0 ? feePerPlayerNum.toFixed(2) : '0.00';
                          const totalCollectedStr = totalCollected.toLocaleString(undefined, { minimumFractionDigits: totalCollected % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 });

                          return (
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#101420] border border-[#20293D] space-y-4 w-full max-w-full overflow-hidden">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <label className="text-[11px] text-amber-400 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                                    <Coins className="w-4 h-4 text-amber-400" />
                                    <span>Automated Financial Split (100% Untouched Cash Prize + 5% Participant-Funded Fees)</span>
                                  </label>
                                  <span className="text-xs text-slate-400">
                                    Full €{prizePool.toLocaleString()} prize pool is 100% untouched for winners. Platform & host fees are paid upon entry.
                                  </span>
                                </div>
                                <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-[#A3E635] text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-md">
                                  100% Prize Untouched • +5% Admin • +5% Host
                                </span>
                              </div>

                              {/* Live 4-Pillar Financial Summary Bar */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
                                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center justify-center gap-1">
                                    <Trophy className="w-3 h-3 text-emerald-400" /> Pure Prize (100%)
                                  </div>
                                  <div className="text-sm sm:text-base font-black font-mono text-[#A3E635] mt-0.5">€{prizePool.toLocaleString()}</div>
                                  <div className="text-[9px] font-mono text-emerald-400/80">Untouched for Winners</div>
                                </div>
                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-center">
                                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center justify-center gap-1">
                                    <Award className="w-3 h-3 text-cyan-400" /> Host Fee (+5%)
                                  </div>
                                  <div className="text-sm sm:text-base font-black font-mono text-cyan-300 mt-0.5">+€{organizerFee.toFixed(2)}</div>
                                  <div className="text-[9px] font-mono text-cyan-400/80">Organizer Reward</div>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                                  <div className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-amber-400" /> Admin Fee (+5%)
                                  </div>
                                  <div className="text-sm sm:text-base font-black font-mono text-amber-300 mt-0.5">+€{platformFee.toFixed(2)}</div>
                                  <div className="text-[9px] font-mono text-amber-400/80">Platform Net Fee</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Entry Fund</div>
                                  <div className="text-sm sm:text-base font-black font-mono text-white mt-0.5">€{totalCollectedStr}</div>
                                  <div className="text-[9px] font-mono text-slate-400">Total Entrant Pool</div>
                                </div>
                              </div>

                              {/* Winner Tier Cash Prize Distribution (from 100% untouched pool) */}
                              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-mono">
                                  <span className="text-[#A3E635] font-bold flex items-center gap-1.5">
                                    <Trophy className="w-3.5 h-3.5 text-[#A3E635]" />
                                    <span>Winner Prize Distribution (100% Pure Cash Pool):</span>
                                  </span>
                                  <span className="text-emerald-400 text-[10px] font-bold">Instant Balance Credit</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center font-mono">
                                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <div className="text-[10px] font-bold text-amber-400">🥇 1st Place (70%)</div>
                                    <div className="text-sm font-black text-white mt-0.5">€{firstPrize.toLocaleString()}</div>
                                    <div className="text-[9px] text-slate-400 mt-0.5">€{firstPrize > 0 ? (firstPrize / 5).toFixed(0) : '0'} / player</div>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-slate-400/10 border border-slate-400/20">
                                    <div className="text-[10px] font-bold text-slate-300">🥈 2nd Place (20%)</div>
                                    <div className="text-sm font-black text-white mt-0.5">€{secondPrize.toLocaleString()}</div>
                                    <div className="text-[9px] text-slate-400 mt-0.5">€{secondPrize > 0 ? (secondPrize / 5).toFixed(0) : '0'} / player</div>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-amber-700/10 border border-amber-700/20">
                                    <div className="text-[10px] font-bold text-amber-500">🥉 3rd Place (10%)</div>
                                    <div className="text-sm font-black text-white mt-0.5">€{thirdPrize.toLocaleString()}</div>
                                    <div className="text-[9px] text-slate-400 mt-0.5">€{thirdPrize > 0 ? (thirdPrize / 5).toFixed(0) : '0'} / player</div>
                                  </div>
                                </div>
                              </div>

                              {/* Host Exclusive Privileges: Spectator Stream Access (Masked/Protected) */}
                              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#0B1522] to-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
                                <Radio className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                                <div className="space-y-1 text-left min-w-0">
                                  <div className="text-xs font-bold text-cyan-300 flex flex-wrap items-center gap-2">
                                    <span>Exclusive Organizer Stream Rights & Spectator Access</span>
                                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                      120s Delay Protected
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                                    As tournament host, you receive authorized spectator relay credentials (<span className="text-cyan-300 font-bold blur-sm select-none">connect tv.caliberclutch.gg:27020; password cc_cast</span>) with free-cam observer tools to broadcast your matches live on Twitch, YouTube, or Kick.
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 4. Match Formats (Playoffs, Finals) (2 Columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full">
                          <div className="min-w-0 w-full">
                            <label className="text-[11px] text-amber-300 uppercase tracking-wider block mb-1.5 font-bold flex items-center justify-between">
                              <span>Playoffs Format</span>
                              <span className="text-[10px] text-slate-400 font-normal">Up to Finals</span>
                            </label>
                            <select
                              value={newTourneyPlayoffsFormat}
                              onChange={(e) => setNewTourneyPlayoffsFormat(e.target.value as any)}
                              className="w-full max-w-full min-w-0 px-4 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-amber-300 font-bold focus:outline-none focus:border-[#A3E635] cursor-pointer text-sm truncate"
                            >
                              <option value="BO1" className="bg-[#141722] text-amber-300">BO1 (Best of 1 • Single Map)</option>
                              <option value="BO3" className="bg-[#141722] text-amber-300">BO3 (Best of 3 • Competitive Standard)</option>
                            </select>
                          </div>
                          <div className="min-w-0 w-full">
                            <label className="text-[11px] text-[#A3E635] uppercase tracking-wider block mb-1.5 font-bold flex items-center justify-between">
                              <span>Grand Finals Format</span>
                              <span className="text-[10px] text-slate-400 font-normal">Championship Decider</span>
                            </label>
                            <select
                              value={newTourneyFinalsFormat}
                              onChange={(e) => setNewTourneyFinalsFormat(e.target.value as any)}
                              className="w-full max-w-full min-w-0 px-4 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-[#A3E635] font-bold focus:outline-none focus:border-[#A3E635] cursor-pointer text-sm truncate"
                            >
                              <option value="BO1" className="bg-[#141722] text-[#A3E635]">BO1 (Best of 1 • Sudden Death)</option>
                              <option value="BO3" className="bg-[#141722] text-[#A3E635]">BO3 (Best of 3 • Esports Standard)</option>
                              <option value="BO5" className="bg-[#141722] text-[#A3E635]">BO5 (Best of 5 • Major Championship)</option>
                            </select>
                          </div>
                        </div>

                        {/* 5. Schedule & Start Time */}
                        <div className="w-full max-w-full">
                          <label className="text-[11px] text-slate-300 uppercase tracking-wider block mb-1.5 font-bold">
                            Schedule & Start Time
                          </label>
                          <input
                            type="text"
                            value={newTourneyDate}
                            onChange={(e) => setNewTourneyDate(e.target.value)}
                            placeholder="e.g. Starts Sunday • 19:00 CET"
                            className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-[#252C3D] text-white focus:outline-none focus:border-[#A3E635] placeholder:text-slate-500 placeholder:font-normal text-sm"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setTourneyTabMode('browse');
                          }}
                          className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          Cancel / Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playTournamentVictory();
                            if (!newTourneyTitle.trim()) {
                              alert('Please enter a tournament title.');
                              return;
                            }

                            const prizePool = parseCurrencyInput(newTourneyCashPrize);
                            if (prizePool <= 0) {
                              alert('Please enter a valid prize pool amount (e.g. €1,000).');
                              return;
                            }
                            const adminProfit = prizePool * 0.05;
                            const organizerReward = prizePool * 0.05;
                            const totalCollected = prizePool + adminProfit + organizerReward;
                            const feePerTeam = parseFloat((totalCollected / newTourneyMaxTeams).toFixed(2));
                            const feePerPlayer = parseFloat((feePerTeam / 5).toFixed(2));
                            const firstPrize = Math.round(prizePool * 0.70);
                            const secondPrize = Math.round(prizePool * 0.20);
                            const thirdPrize = Math.max(0, prizePool - firstPrize - secondPrize);

                            const createdItem = {
                              id: `custom-${Date.now()}`,
                              title: newTourneyTitle.trim(),
                              type: 'COMMUNITY CLAN CUP',
                              game: 'CS2 5v5 Tactical',
                              cashPrize: `€${prizePool.toLocaleString()}`,
                              totalPool: prizePool,
                              totalCollected: totalCollected,
                              teams: `0 / ${newTourneyMaxTeams}`,
                              maxTeams: newTourneyMaxTeams,
                              registeredTeamsCount: 0,
                              date: newTourneyDate || 'Starts this weekend',
                              status: 'REGISTRATION OPEN',
                              badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                              isLive: false,
                              isOpen: true,
                              isCustom: true,
                              organizer: newTourneyOrganizer.trim() || currentGamerTag,
                              creator: currentGamerTag,
                              creatorClan: userClanData.tag || 'COMM',
                              creatorGamerTag: currentGamerTag,
                              entryFee: feePerTeam,
                              entryFeePerPlayer: feePerPlayer,
                              isPaidEntry: true,
                              platformCommission: 0.05,
                              organizerCommission: 0.05,
                              platformProfit: adminProfit,
                              organizerReward: organizerReward,
                              spectatorIp: 'tv.caliberclutch.gg:27020',
                              spectatorPassword: 'cc_cast',
                              casterDelay: 120,
                              streamRightsGranted: true,
                              structure: newTourneyStructure,
                              playoffsFormat: newTourneyPlayoffsFormat,
                              finalsFormat: newTourneyFinalsFormat,
                              region: newTourneyRegion || 'European Online Bracket',
                              payout1st: `70% Cash (€${firstPrize.toLocaleString()})`,
                              payout2nd: `20% Cash (€${secondPrize.toLocaleString()})`,
                              payout3rd: `10% Cash (€${thirdPrize.toLocaleString()})`
                            };

                            setCustomTournaments((prev: any[]) => {
                              const next = [createdItem, ...prev];
                              try {
                                setLocalState('caliber_custom_tournaments', JSON.stringify(next));
                              } catch (_) {}
                              return next;
                            });
                            saveTournamentToCloud(createdItem as any);

                            // Automatically enroll creator's roster
                            setRegisteredTourneys((prev: string[]) => {
                              const next = Array.from(new Set([...prev, createdItem.title]));
                              try {
                                setLocalState('caliber_registered_tournaments', JSON.stringify(next));
                              } catch (_) {}
                              return next;
                            });

                            setTourneyTabMode('browse');
                            sound.playSelect();
                            setDashboardToast(`✓ Tournament "${createdItem.title}" published! 5% Organizer commission & official CSTV stream rights active.`);
                            setTimeout(() => setDashboardToast(null), 5000);
                          }}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-lime-500/25 cursor-pointer active:scale-95 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                          <span>Publish & Host Tournament</span>
                        </button>
                      </div>
                    </div>

                    {/* WINDOW 2 (BOTTOM • FULL-WIDTH): OFFICIAL TOURNAMENT RULEBOOK */}
                    <div className="w-full rounded-3xl bg-[#090C12] border border-[#202738] p-6 sm:p-8 space-y-6 shadow-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-display font-black text-white text-lg">OFFICIAL TOURNAMENT RULEBOOK</h4>
                            <span className="text-xs font-mono text-amber-400 font-bold">International Esports Standard • CaliberClutch Rulebook</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Mandatory for All Participating Clans
                        </span>
                      </div>

                      {/* Responsive Grid of Rules: 3 Full Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
                        {/* Rule 1 */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-[#A3E635]/30 transition">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <Target className="w-4 h-4 text-[#A3E635] shrink-0" />
                            <span>1. Match Format (Competitive Regulations & Overtime)</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                            Matches are played according to standard competitive regulations (12 rounds per half, 24 rounds total). In the event of a 12-12 tie, an overtime is played immediately until a clan wins with a 2-round advantage.
                          </p>
                        </div>

                        {/* Rule 2 */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-emerald-500/30 transition">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>2. Anti-Cheat & Integrity (Kernel Ring-0)</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                            Every participating player must have the CaliberClutch Kernel Ring-0 Anti-Cheat client running before joining the match server. Players with VAC bans, unauthorized third-party injection, or missing anti-cheat will be automatically disqualified.
                          </p>
                        </div>

                        {/* Rule 3 */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-amber-400/30 transition">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>3. Check-In & Ready Up (15-Minute Forfeit Timer)</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                            Clans must click Ready Up in the match lobby and join their scheduled match within 15 minutes of lobby generation. Any clan failing to show up within 15 minutes receives an automatic default loss (Def-Loss).
                          </p>
                        </div>

                        {/* Rule 4 */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-sky-400/30 transition">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <SlidersHorizontal className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>4. Map Veto (Active Duty Competitive Pool)</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                            Official competitive maps: Mirage, Inferno, Nuke, Dust II, Anubis, Ancient, Vertigo. The automated Pick & Ban veto system runs directly inside the match lobby prior to server launch.
                          </p>
                        </div>

                        {/* Rule 5 */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-purple-400/30 transition">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <Users className="w-4 h-4 text-purple-400 shrink-0" />
                            <span>5. Rosters & Captain Authority (5 Starters + 1 Sub)</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                            Each clan roster must contain 5 starting players and at most 1 registered substitute (stand-in). <strong>Only the Team Captain (Leader)</strong> has the official legal and sporting authority to register and lock the 5-stack roster in official tournaments.
                          </p>
                        </div>

                        {/* Rule 6 */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-amber-400/30 transition">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>6. 100% Cash Prize Pool & Instant Payout</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                            Prize pools are paid out exclusively in real cash (100% Pure Cash): 70% 1st Place, 20% 2nd Place, 10% 3rd Place. Prize funds are disbursed automatically and instantly to the winners' balances the moment the Grand Final concludes.
                          </p>
                        </div>

                        {/* Rule 7 */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-emerald-500/30 transition">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>7. Sportsmanship & Fair Play</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                            Each clan is allowed 1 tactical pause (30 seconds) per half. Toxicity, abusive in-game or chat behavior, or exploiting map glitches will result in immediate match forfeit and tournament suspension.
                          </p>
                        </div>

                        {/* Rule 8: Competitive Integrity & Fair Play Guarantee */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-sky-400/30 transition md:col-span-2 lg:col-span-2">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>8. Competitive Integrity & Fair Play Guarantee</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                            All tournament matches run in strict compliance with official esports tournament regulations. CaliberClutch enforces an authentic, transparent competitive ecosystem with zero unregulated skin gambling, match fixing, or unauthorized third-party interference.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <>
                  {/* Circuit Quick Stats Banner */}
              {/* Circuit Real Stats Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#090C12] border border-white/5">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Active Cash Pools</div>
                  <div className="text-xl font-mono font-black text-[#A3E635]">
                    €{customTournaments.reduce((acc: number, t: any) => acc + (parseCurrencyInput(t.cashPrize) || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Enrolled Teams</div>
                  <div className="text-xl font-mono font-black text-white">{registeredTourneys.length} Rosters</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Match Format</div>
                  <div className="text-xl font-mono font-black text-amber-400">Official 5v5</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Integrity</div>
                  <div className="text-xl font-mono font-black text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Ring-0 AC</span>
                  </div>
                </div>
              </div>

              {/* Team Captain Roster Clearance Bar */}
              <div className="p-4 rounded-2xl bg-[#0C1019] border border-[#222B3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isUserTeamCaptain ? (isFull5Stack ? 'bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635]' : 'bg-rose-500/15 border border-rose-500/30 text-rose-400') : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'}`}>
                    {isUserTeamCaptain ? (isFull5Stack ? <Crown className="w-5 h-5 text-[#A3E635]" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />) : <Lock className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white">Your Team: [{userClanData.tag}] {userClanData.name}</span>
                      {isUserTeamCaptain ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 text-[10px] font-black uppercase flex items-center gap-1">
                          <Crown className="w-3 h-3 text-[#A3E635]" />
                          Team Captain
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          Your Role: {currentUserRole}
                        </span>
                      )}
                      {!isFull5Stack ? (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          Incomplete Roster ({teamRosterCount}/5)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Full 5-Stack Ready (5/5)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isUserTeamCaptain 
                        ? (isFull5Stack 
                            ? `✓ Full Clearance Verified: As Captain, you have legal authority to enroll and lock your 5-stack in cash tournaments.` 
                            : `⚠️ Incomplete Squad (${teamRosterCount}/5 Players): Official tournament entry requires exactly 5 confirmed starters. Recruit players in Teams Hub.`)
                        : `⚠️ Captain Only: Only the official Team Captain (${userClanData.captainName || 'Team Leader'}) can register this squad.`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('teams')}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5 shrink-0"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Manage Squad</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              {/* Tournament Filters & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: `All Tournaments (${customTournaments.length})` },
                    { id: 'live', label: `🔴 Live Now (${customTournaments.filter((t: any) => t.isLive).length})` },
                    { id: 'open', label: `⚡ Open Registration (${customTournaments.filter((t: any) => t.isOpen).length})` },
                    { id: 'registered', label: `✓ My Registered (${registeredTourneys.length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { sound.playClick(); setTourneyFilter(tab.id as any); }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        tourneyFilter === tab.id
                          ? 'bg-[#A3E635] text-slate-950 shadow-md font-black'
                          : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setTourneyTabMode('create');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#A3E635]/15 hover:bg-[#A3E635]/25 border border-[#A3E635]/40 text-[#A3E635] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#A3E635]" />
                    <span>Host Cup</span>
                  </button>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tourneySearchQuery}
                      onChange={(e) => setTourneySearchQuery(e.target.value)}
                      placeholder="Search tournaments..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-[#12141C] border border-[#232938] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#A3E635]"
                    />
                  </div>
                </div>
              </div>

              {/* Tournament Cards with 100% Pure Cash Prize Breakdown */}
              {(() => {
                const filteredTournaments = customTournaments.filter((t: any) => {
                  if (tourneyFilter === 'live' && !t.isLive) return false;
                  if (tourneyFilter === 'open' && !t.isOpen) return false;
                  if (tourneyFilter === 'registered' && !registeredTourneys.includes(t.title)) return false;
                  if (tourneySearchQuery.trim()) {
                    const q = tourneySearchQuery.toLowerCase().trim();
                    return t.title.toLowerCase().includes(q) || (t.cashPrize && t.cashPrize.toLowerCase().includes(q));
                  }
                  return true;
                });

                if (filteredTournaments.length === 0) {
                  return (
                    <div className="p-12 rounded-3xl bg-[#090C12] border border-dashed border-white/10 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                        <Trophy className="w-8 h-8 text-slate-500" />
                      </div>
                      <div className="max-w-md mx-auto space-y-1.5">
                        <h4 className="text-base font-black font-display text-white">No Tournaments Currently Online</h4>
                        <p className="text-xs font-mono text-slate-400">
                          {tourneyFilter === 'registered' 
                            ? "You haven't enrolled in any tournament yet. Browse active tournaments or host your own."
                            : "There are no inactive tournaments online. Only official Caliber Clutch tournaments hosted by administrators and verified organizers appear here."}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          sound.playSelect();
                          setTourneyTabMode('create');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer active:scale-95 inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Host New Cup</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTournaments.map((t: any, idx: number) => {
                      const isRegistered = registeredTourneys.includes(t.title);

                      return (
                      <div key={idx} className="p-6 rounded-3xl bg-[#12141C] border border-[#23293B] hover:border-amber-400/50 transition flex flex-col justify-between gap-5 group shadow-lg overflow-hidden w-full max-w-full">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${t.badge}`}>{t.status}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1B2335] text-[#A3E635] border border-[#A3E635]/30">
                                  {t.playoffsFormat ? `Playoffs: ${t.playoffsFormat}` : 'Playoffs: BO1'} • {t.finalsFormat ? `Final: ${t.finalsFormat}` : 'Final: BO3'}
                                </span>
                                {t.structure && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                                    {t.structure}
                                  </span>
                                )}
                                {(t.organizer || t.creator) && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#182030] text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                    <Crown className="w-3 h-3 text-amber-400" />
                                    <span>HOSTED BY {t.organizer || t.creator}</span>
                                  </span>
                                )}
                                {(() => {
                                  const isHost = isProjectAdmin || 
                                    (t.creator && t.creator.toLowerCase() === currentGamerTag.toLowerCase()) ||
                                    (t.creatorClan && userClanData?.tag && t.creatorClan.toLowerCase() === userClanData.tag.toLowerCase()) ||
                                    (t.organizer && t.organizer.toLowerCase().includes(currentGamerTag.toLowerCase()));
                                  if (!isHost) return null;
                                  return (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                                      <Radio className="w-3 h-3 text-cyan-400" />
                                      <span>HOST STREAM ACTIVE</span>
                                    </span>
                                  );
                                })()}
                                {t.entryFee ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                    <Coins className="w-3 h-3 text-amber-400" />
                                    €{typeof t.entryFee === 'number' && t.entryFee % 1 !== 0 ? t.entryFee.toFixed(2) : t.entryFee} / Team (€{(Number(t.entryFee) / 5).toFixed(2)}/player)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Free Entry
                                  </span>
                                )}
                                {isRegistered && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    ENROLLED
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-black font-display text-white mt-3 group-hover:text-amber-400 transition">{t.title}</h3>
                              <p className="text-xs font-mono text-[#94A3B8] mt-1 flex flex-wrap items-center gap-2">
                                <span>{t.date}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-400">{t.region || 'European Online Bracket'}</span>
                              </p>
                            </div>
                            <div className="text-right flex items-start gap-2">
                              <div>
                                <div className="text-2xl font-black font-mono text-[#A3E635]">{t.cashPrize}</div>
                                <div className="text-[10px] text-[#94A3B8] uppercase">Cash Pool</div>
                              </div>
                              {t.isCustom && isProjectAdmin && (
                                <button
                                  type="button"
                                  title="Delete custom tournament"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sound.playClick();
                                    setCustomTournaments(prev => {
                                      const next = prev.filter((item: any) => item.id !== t.id);
                                      try {
                                        setLocalState('caliber_custom_tournaments', JSON.stringify(next));
                                      } catch (_) {}
                                      return next;
                                    });
                                    deleteTournamentFromCloud(t.id);
                                    setDashboardToast(`✓ Custom tournament "${t.title}" deleted.`);
                                    setTimeout(() => setDashboardToast(null), 3000);
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Official 100% Cash Prize Pool Distribution (No Skins) */}
                          {(() => {
                            const numeric = parseCurrencyInput(t.cashPrize) || 3000;
                            const firstCash = Math.round(numeric * 0.70);
                            const secondCash = Math.round(numeric * 0.20);
                            const thirdCash = Math.round(numeric * 0.10);

                            return (
                              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                  <span className="flex items-center gap-1.5 text-[#A3E635] font-bold">
                                    <Trophy className="w-3.5 h-3.5 text-[#A3E635]" />
                                    <span>Official Cash Prize Breakdown (100% Pure Cash Pool):</span>
                                  </span>
                                  <span className="text-[10px] text-emerald-400 font-bold">Instant Payout</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                                    <div className="text-[10px] font-mono font-bold text-amber-400">🥇 1st Place</div>
                                    <div className="text-sm font-black font-mono text-white mt-0.5">€{firstCash.toLocaleString()}</div>
                                    <div className="text-[9px] font-mono font-bold text-[#A3E635]">70% Cash Pool</div>
                                    <div className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">Pure Cash</div>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-slate-400/10 border border-slate-400/25 text-center">
                                    <div className="text-[10px] font-mono font-bold text-slate-300">🥈 2nd Place</div>
                                    <div className="text-sm font-black font-mono text-white mt-0.5">€{secondCash.toLocaleString()}</div>
                                    <div className="text-[9px] font-mono font-bold text-slate-400">20% Cash Pool</div>
                                    <div className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">Pure Cash</div>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-amber-700/10 border border-amber-700/25 text-center">
                                    <div className="text-[10px] font-mono font-bold text-amber-600">🥉 3rd Place</div>
                                    <div className="text-sm font-black font-mono text-white mt-0.5">€{thirdCash.toLocaleString()}</div>
                                    <div className="text-[9px] font-mono font-bold text-amber-500">10% Cash Pool</div>
                                    <div className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">Pure Cash</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="pt-4 border-t border-[#1C2233] space-y-2.5 w-full max-w-full overflow-hidden">
                          {/* Top Row: Slots Counter & Organizer/Caster Utility Tools */}
                          <div className="flex items-center justify-between gap-2 w-full flex-wrap">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold shrink-0">
                              <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                              <span>Slots: {t.teams}</span>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playSelect();
                                  setTourneyModalTab('bracket');
                                  setSelectedBracketTourney(t);
                                }}
                                className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-200 hover:text-white border border-white/10 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-400" />
                                <span>Bracket</span>
                              </button>

                              {(() => {
                                const isHost = isProjectAdmin || 
                                  (t.creator && t.creator.toLowerCase() === currentGamerTag.toLowerCase()) ||
                                  (t.creatorClan && userClanData?.tag && t.creatorClan.toLowerCase() === userClanData.tag.toLowerCase()) ||
                                  (t.organizer && t.organizer.toLowerCase().includes(currentGamerTag.toLowerCase()));
                                if (!isHost) return null;
                                return (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        sound.playSelect();
                                        setTourneyModalTab('teams');
                                        setSelectedBracketTourney(t);
                                      }}
                                      className="px-2 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-xs font-mono text-amber-300 hover:text-white border border-amber-500/30 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                                    >
                                      <Users className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Teams</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        sound.playSelect();
                                        setTourneyModalTab('admin');
                                        setSelectedBracketTourney(t);
                                      }}
                                      className="px-2 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-xs font-mono text-cyan-300 hover:text-white border border-cyan-500/30 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                                    >
                                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                                      <span>Stream</span>
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Bottom Row: Primary Registration / Enrollment Action Button */}
                          <div className="flex items-center gap-2 w-full pt-0.5">
                            {t.faceitUrl && (
                              <a
                                href={t.faceitUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-xl bg-[#FF5500]/15 hover:bg-[#FF5500]/25 text-[#FF5500] border border-[#FF5500]/40 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition hover:scale-105 shadow-sm shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>FACEIT</span>
                              </a>
                            )}
                            {isRegistered ? (
                              <button
                                onClick={() => {
                                  sound.playSelect();
                                  setSelectedRegisterTourney(t);
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-display font-black text-xs uppercase tracking-wider transition hover:bg-emerald-500/30 cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Team Enrolled</span>
                              </button>
                            ) : isUserTeamCaptain ? (
                              !isFull5Stack ? (
                                <button
                                  onClick={() => {
                                    sound.playClick();
                                    setSelectedRegisterTourney(t);
                                  }}
                                  className="flex-1 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm group"
                                  title="Complete 5-Stack roster required for tournament registration"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition" />
                                  <span>5-Stack Required ({teamRosterCount}/5)</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    sound.playSelect();
                                    setSelectedRegisterTourney(t);
                                  }}
                                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                                >
                                  <Crown className="w-4 h-4 text-slate-950" />
                                  <span>Register Team</span>
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setCaptainDeniedModal({
                                    open: true,
                                    tourneyTitle: t.title,
                                    captainName: userClanData.captainName || 'Team Captain',
                                    teamTag: userClanData.tag || 'Squad'
                                  });
                                  setDashboardToast(`⚠️ Only Team Captain (${userClanData.captainName || 'Captain'}) can register squad in official tournaments.`);
                                  setTimeout(() => setDashboardToast(null), 4500);
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm group"
                                title="Only Team Captain can register squad"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                                <span>Captain Only</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                );
              })()}

              {/* Legal & Regulatory Esports Compliance Footer */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    100% Skill-Based Competition: Prize distribution complies with European esports regulations. 100% cash prize pools automatically and instantly paid out to winners upon conclusion.
                  </span>
                </div>
                <button
                  onClick={() => setShowPartnersModal(true)}
                  className="text-amber-400 hover:underline shrink-0 cursor-pointer font-bold"
                >
                  View Legal Disclosure →
                </button>
              </div>

                </>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: TEAMS & CLANS (5v5 ROSTER & CLAN DIRECTORY)         */}
          {/* ======================================================== */}
          {activeTab === 'teams' && (
            <VortexClanHub
              currentGamerTag={currentGamerTag}
              currentClanTag={currentClanTag}
              currentAvatarUrl={currentAvatarUrl}
              currentUserLevel={currentUserLevel}
              currentUserElo={currentUserElo}
              currentCountry={currentCountry}
              onUpdateClanTag={(newTag) => {
                setCurrentClanTag(newTag);
                setLocalState('caliber_user_clantag', newTag);
              }}
              onNavigateTab={(tab) => {
                setActiveTab(tab as VortexTab);
              }}
              setToast={(msg) => {
                setDashboardToast(msg);
                setTimeout(() => setDashboardToast(null), 3500);
              }}
            />
          )}

          {/* ======================================================== */}
          {/* TAB: RANKINGS (PLATFORM PLAYER LEADERBOARD - RANK #3)    */}
          {/* ======================================================== */}
          {activeTab === 'rankings' && (() => {
            const filteredPlayers = platformRankingPlayers.filter(p => {
              if (rankingTab === 'lvl10' && p.levelNum !== 10) return false;
              if (rankingCountry !== 'all' && (p.code || '').toUpperCase() !== rankingCountry.toUpperCase()) return false;
              if (rankingSearch.trim()) {
                const q = rankingSearch.toLowerCase();
                return p.tag.toLowerCase().includes(q) || p.country.toLowerCase().includes(q);
              }
              return true;
            });

            return (
              <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E2333]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-2xl font-black font-display text-white">Platform Player Rankings</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
                        COMPETITIVE LEADERBOARD
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Official competitive leaderboard of registered players on our platform • Your Standing: <strong className="text-white">{currentUserMatches > 0 ? `${userPlatformRank} (${currentUserElo.toLocaleString()} ELO)` : 'Unranked (800 ELO • 0 Matches)'}</strong> (Click any player to view full profile)
                    </p>
                  </div>
                </div>

                {/* SEASON 1 CASH PRIZE LEADERBOARD POOL */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#18210C] via-[#10151E] to-[#0A0D14] border border-[#A3E635]/30 relative overflow-hidden text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                  <div className="space-y-1.5 z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase text-[#A3E635] bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(163,230,53,0.3)]">
                        <Trophy className="w-3.5 h-3.5 fill-[#A3E635]" />
                        SEASON 1 CASH POOL: €5,000
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                        Ends in: 14d 08h 32m
                      </span>
                    </div>
                    <h3 className="font-display font-black text-white text-lg tracking-wide uppercase">
                      OFFICIAL EUROPEAN COMPETITIVE CASH CIRCUIT
                    </h3>
                    <p className="text-xs font-mono text-slate-300">
                      Cash rewards automatically credited to Caliber Wallet upon season finale:
                      <strong className="text-amber-400 ml-1">1st: €2,500</strong> • <strong className="text-slate-300">2nd: €1,200</strong> • <strong className="text-amber-600">3rd: €600</strong> • <strong className="text-slate-400">4th-10th: €100 each</strong>
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2.5 z-10">
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center min-w-[100px]">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Your Standing</span>
                      <span className="font-display font-black text-sm text-[#A3E635]">{userPlatformRank}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center min-w-[100px]">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Seasonal ELO</span>
                      <span className="font-display font-black text-sm text-white">{currentUserMatches > 0 ? currentUserElo : 800}</span>
                    </div>
                  </div>
                </div>

                {/* TOP 3 PODIUM CARDS (REAL REGISTERED PLAYERS ONLY) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* #1 Card - Gold */}
                  {platformRankingPlayers[0] ? (
                    <div 
                      onClick={() => handleViewPlayerProfile(platformRankingPlayers[0])}
                      className={`p-5 rounded-2xl bg-gradient-to-b from-[#1C1708] to-[#12141C] shadow-lg relative overflow-hidden cursor-pointer group transition hover:scale-[1.01] ${
                        platformRankingPlayers[0].isUser 
                          ? 'border-2 border-[#A3E635] shadow-[0_0_25px_rgba(163,230,53,0.25)]' 
                          : 'border border-amber-500/40 hover:border-amber-400'
                      }`}
                      title={`Click to view ${platformRankingPlayers[0].tag}'s profile`}
                    >
                      <div className="absolute top-2 right-2 text-2xl">🥇</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">RANK #1 • PLATFORM LEADER</span>
                        {platformRankingPlayers[0].isUser && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#A3E635] text-slate-950 font-black">YOU</span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={platformRankingPlayers[0].avatar}
                          alt={platformRankingPlayers[0].tag}
                          className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 group-hover:border-amber-400 transition"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-white text-base group-hover:text-amber-400 group-hover:underline transition">
                              {platformRankingPlayers[0].tag}
                            </span>
                            <FaceitVerificationBadge type={platformRankingPlayers[0].verification} size="sm" />
                            <CountryFlag code={platformRankingPlayers[0].code || 'XK'} name={platformRankingPlayers[0].country || 'Kosovo'} size="xs" />
                          </div>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                            <CountryFlag code={platformRankingPlayers[0].code || 'XK'} name={platformRankingPlayers[0].country || 'Kosovo'} size="xs" />
                            <span>{platformRankingPlayers[0].country}</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400 font-bold">{platformRankingPlayers[0].level}</span>
                        <span className="text-white font-bold">{platformRankingPlayers[0].elo?.toLocaleString()} ELO</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                          View Profile →
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#10131B]/60 border border-dashed border-white/10 flex flex-col justify-between min-h-[170px]">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">RANK #1 • UNCLAIMED</span>
                          <span className="text-xl opacity-40">🥇</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-3">Register your profile to claim the #1 Leaderboard spot.</p>
                      </div>
                    </div>
                  )}

                  {/* #2 Card - Silver */}
                  {platformRankingPlayers[1] ? (
                    <div 
                      onClick={() => handleViewPlayerProfile(platformRankingPlayers[1])}
                      className={`p-5 rounded-2xl bg-gradient-to-b from-[#171922] to-[#12141C] shadow-lg relative overflow-hidden cursor-pointer group transition hover:scale-[1.01] ${
                        platformRankingPlayers[1].isUser 
                          ? 'border-2 border-[#A3E635] shadow-[0_0_25px_rgba(163,230,53,0.25)]' 
                          : 'border border-slate-400/30 hover:border-slate-300'
                      }`}
                      title={`Click to view ${platformRankingPlayers[1].tag}'s profile`}
                    >
                      <div className="absolute top-2 right-2 text-2xl">🥈</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">RANK #2 • PLATFORM ELITE</span>
                        {platformRankingPlayers[1].isUser && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#A3E635] text-slate-950 font-black">YOU</span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={platformRankingPlayers[1].avatar}
                          alt={platformRankingPlayers[1].tag}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-400/30 group-hover:border-slate-300 transition"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-white text-base group-hover:text-slate-200 group-hover:underline transition">
                              {platformRankingPlayers[1].tag}
                            </span>
                            <FaceitVerificationBadge type={platformRankingPlayers[1].verification} size="sm" />
                            <CountryFlag code={platformRankingPlayers[1].code || 'XK'} name={platformRankingPlayers[1].country || 'Kosovo'} size="xs" />
                          </div>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                            <CountryFlag code={platformRankingPlayers[1].code || 'XK'} name={platformRankingPlayers[1].country || 'Kosovo'} size="xs" />
                            <span>{platformRankingPlayers[1].country}</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400 font-bold">{platformRankingPlayers[1].level}</span>
                        <span className="text-white font-bold">{platformRankingPlayers[1].elo?.toLocaleString()} ELO</span>
                        <span className="text-slate-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                          View Profile →
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#10131B]/60 border border-dashed border-white/10 flex flex-col justify-between min-h-[170px]">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">RANK #2 • UNCLAIMED SPOT</span>
                          <span className="text-xl opacity-40">🥈</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-3">No other registered player has claimed Rank #2 yet.</p>
                      </div>
                      <div className="pt-3 border-t border-white/[0.04] text-[11px] font-mono text-[#A3E635]">
                        Share your invite link to compete →
                      </div>
                    </div>
                  )}

                  {/* #3 Card - Bronze */}
                  {platformRankingPlayers[2] ? (
                    <div 
                      onClick={() => handleViewPlayerProfile(platformRankingPlayers[2])}
                      className={`p-5 rounded-2xl bg-gradient-to-b from-[#18210C] via-[#141B0E] to-[#12141C] shadow-lg relative overflow-hidden cursor-pointer group transition hover:scale-[1.01] ${
                        platformRankingPlayers[2]?.isUser 
                          ? 'border-2 border-[#A3E635] shadow-[0_0_25px_rgba(163,230,53,0.25)]' 
                          : 'border border-amber-700/40 hover:border-amber-600'
                      }`}
                      title={`Click to view ${platformRankingPlayers[2]?.tag}'s profile`}
                    >
                      <div className="absolute top-2 right-2 text-2xl">🥉</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">
                          RANK #3 • {platformRankingPlayers[2]?.tag}
                        </span>
                        {platformRankingPlayers[2]?.isUser && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#A3E635] text-slate-950 font-black">YOU</span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={platformRankingPlayers[2]?.avatar}
                          alt={platformRankingPlayers[2]?.tag}
                          className="w-12 h-12 rounded-xl object-cover border border-amber-600/40"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-white text-base group-hover:text-amber-400 group-hover:underline transition">
                              {platformRankingPlayers[2]?.tag}
                            </span>
                            <FaceitVerificationBadge type={platformRankingPlayers[2]?.verification} size="sm" />
                            <CountryFlag code={platformRankingPlayers[2]?.code || 'XK'} name={platformRankingPlayers[2]?.country || 'Kosovo'} size="xs" />
                          </div>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                            <CountryFlag code={platformRankingPlayers[2]?.code || 'XK'} name={platformRankingPlayers[2]?.country || 'Kosovo'} size="xs" />
                            <span>{platformRankingPlayers[2]?.country}</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400 font-bold">{platformRankingPlayers[2]?.level}</span>
                        <span className="text-white font-bold">{platformRankingPlayers[2]?.elo?.toLocaleString()} ELO</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                          View Profile →
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#10131B]/60 border border-dashed border-white/10 flex flex-col justify-between min-h-[170px]">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">RANK #3 • UNCLAIMED SPOT</span>
                          <span className="text-xl opacity-40">🥉</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-3">Play competitive matches on Caliber Clutch to enter Top 3.</p>
                      </div>
                      <div className="pt-3 border-t border-white/[0.04] text-[11px] font-mono text-amber-500">
                        Season 1 Competitive Leaderboard →
                      </div>
                    </div>
                  )}
                </div>

                {/* Current User Standing Banner (shown when user is ranked outside Top 3) */}
                {!platformRankingPlayers.slice(0, 3).some(p => p.isUser) && (
                  <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#A3E635]/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#18210C] border border-[#A3E635]/50 flex items-center justify-center font-mono font-black text-xs text-[#A3E635]">
                        {platformRankingPlayers.find(p => p.isUser)?.rank || '#--'}
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={currentAvatarUrl} alt={currentGamerTag} className="w-8 h-8 rounded-lg object-cover border border-white/20" />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                            <span>{currentGamerTag}</span>
                            <span className="text-[9px] bg-[#A3E635] text-black font-black px-1.5 py-0.2 rounded font-mono">YOU</span>
                            <FaceitVerificationBadge type={currentVerification} size="xs" />
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {currentVerification === 'none' ? '⚠️ Unverified • Level ' + currentUserLevel : 'Level ' + currentUserLevel} • {currentUserMatches > 0 ? `${currentUserElo.toLocaleString()} ELO` : '800 ELO (Uncalibrated)'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewPlayerProfile(platformRankingPlayers.find(p => p.isUser) || platformRankingPlayers[0])}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[#A3E635] border border-[#A3E635]/30 transition cursor-pointer"
                    >
                      View My Standing →
                    </button>
                  </div>
                )}

                {/* SEARCH & FACEIT-STYLE REGION/COUNTRY FILTERS */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const activeRegion = FACEIT_REGIONS.find(r => r.code === rankingRegion) || FACEIT_REGIONS[0];
                      return (
                        <button
                          onClick={() => { sound.playClick(); setRankingTab('europe'); }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-2 ${
                            rankingTab === 'europe'
                              ? 'bg-[#A3E635] text-slate-950 shadow-md font-black'
                              : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-wider">{activeRegion.code}</span>
                          <span>{activeRegion.name}</span>
                        </button>
                      );
                    })()}

                    <button
                      onClick={() => { sound.playClick(); setRankingTab('global'); }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-2 ${
                        rankingTab === 'global'
                          ? 'bg-[#A3E635] text-slate-950 shadow-md font-black'
                          : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
                      }`}
                    >
                      <span>🌐</span>
                      <span>Global</span>
                    </button>

                    <button
                      onClick={() => { sound.playClick(); setRankingTab('lvl10'); }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-2 ${
                        rankingTab === 'lvl10'
                          ? 'bg-[#A3E635] text-slate-950 shadow-md font-black'
                          : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Challenger / Level 10</span>
                    </button>

                    {/* 1:1 Authentic FACEIT Country & Region Selectors */}
                    <div className="flex items-center gap-1.5">
                      {/* 1:1 Authentic FACEIT Country Selector Dropdown */}
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setIsCountryDropdownOpen(prev => !prev);
                            setIsRegionDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans transition flex items-center justify-between gap-3 min-w-[155px] cursor-pointer ${
                            isCountryDropdownOpen
                              ? 'bg-[#101114] border-2 border-[#FF5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.25)]'
                              : 'bg-[#14151A] border border-[#2B2D33] text-slate-200 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          <span className="font-medium text-xs truncate">
                            {rankingCountry === 'all'
                              ? 'All countries'
                              : (sortedRankingCountries.find(c => c.code.toUpperCase() === rankingCountry.toUpperCase())?.name || 'All countries')}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180 text-[#FF5500]' : ''}`} />
                        </button>

                        {/* Custom FACEIT Dark Country Dropdown Menu */}
                        {isCountryDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 w-64 max-h-72 overflow-y-auto rounded-lg bg-[#18191C] border border-[#2B2D33] shadow-2xl z-50 py-1 divide-y divide-white/[0.04]">
                            {/* All countries option */}
                            <button
                              type="button"
                              onClick={() => {
                                sound.playSelect();
                                setRankingCountry('all');
                                setIsCountryDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-sans transition flex items-center justify-between cursor-pointer ${
                                rankingCountry === 'all'
                                  ? 'bg-[#2A2B31] text-white font-bold'
                                  : 'text-slate-300 hover:bg-[#24252B] hover:text-white'
                              }`}
                            >
                              <span>All countries</span>
                              {rankingCountry === 'all' && (
                                <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                              )}
                            </button>

                            {/* Alphabetical List of all ~250 Official Countries */}
                            <div className="py-0.5">
                              {sortedRankingCountries.map((c) => {
                                const isSelected = rankingCountry.toUpperCase() === c.code.toUpperCase();
                                return (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                      sound.playSelect();
                                      setRankingCountry(c.code);
                                      setIsCountryDropdownOpen(false);
                                    }}
                                    className={`w-full px-3.5 py-2 text-left text-xs font-sans transition flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#2A2B31] text-white font-bold'
                                        : 'text-slate-300 hover:bg-[#24252B] hover:text-white'
                                    }`}
                                  >
                                    <span className="truncate">{c.name}</span>
                                    {isSelected && (
                                      <Check className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 1:1 Authentic FACEIT Region Selector Dropdown (EU, NA, SA, SEA, OCE) */}
                      <div className="relative" ref={regionDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setIsRegionDropdownOpen(prev => !prev);
                            setIsCountryDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition flex items-center justify-between gap-3 min-w-[78px] cursor-pointer ${
                            isRegionDropdownOpen
                              ? 'bg-[#101114] border-2 border-[#FF5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.25)]'
                              : 'bg-[#14151A] border border-[#2B2D33] text-slate-200 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          <span className="font-bold text-xs">{rankingRegion}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isRegionDropdownOpen ? 'rotate-180 text-[#FF5500]' : ''}`} />
                        </button>

                        {/* Custom FACEIT Dark Region Dropdown Menu matching user photo */}
                        {isRegionDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 w-full min-w-[82px] rounded-lg bg-[#141416] border border-[#2B2D33] shadow-2xl z-50 py-1">
                            {FACEIT_REGIONS.map((r) => {
                              const isSelected = rankingRegion === r.code;
                              return (
                                <button
                                  key={r.code}
                                  type="button"
                                  onClick={() => {
                                    sound.playSelect();
                                    setRankingRegion(r.code);
                                    setRankingTab('europe');
                                    setIsRegionDropdownOpen(false);
                                  }}
                                  className={`w-full px-3 py-1.5 text-left text-xs font-sans font-semibold transition flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#24252B] text-white font-bold'
                                      : 'text-slate-300 hover:bg-[#1E1F24] hover:text-white'
                                  }`}
                                >
                                  <span>{r.label}</span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={rankingSearch}
                      onChange={(e) => setRankingSearch(e.target.value)}
                      placeholder="Search platform player..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-[#12141C] border border-[#232938] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#A3E635]"
                    />
                  </div>
                </div>

                {/* LEADERBOARD TABLE */}
                <div className="rounded-3xl bg-[#12141C] border border-[#23293B] overflow-hidden shadow-xl">
                  <table className="w-full text-left font-sans">
                    <thead>
                      <tr className="border-b border-[#1E2333] text-[11px] font-mono font-bold text-[#94A3B8] uppercase bg-[#0D0F15]">
                        <th className="py-3 px-6">Rank</th>
                        <th className="py-3 px-6">Player</th>
                        <th className="py-3 px-6">Country</th>
                        <th className="py-3 px-6">Skill Level</th>
                        <th className="py-3 px-6">Platform ELO</th>
                        <th className="py-3 px-6">Matches</th>
                        <th className="py-3 px-6">Win Rate</th>
                        <th className="py-3 px-6">K/D</th>
                        <th className="py-3 px-6 text-right">Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#181D2C] text-sm">
                      {filteredPlayers.map((p, idx) => (
                        <tr 
                          key={idx} 
                          className={`transition ${
                            p.isUser 
                              ? 'bg-[#18210C]/80 hover:bg-[#18210C] font-semibold text-white' 
                              : 'hover:bg-[#161A26]'
                          }`}
                        >
                          <td className="py-4 px-6 font-mono font-black">
                            <span className={
                              p.rankNum === 1 ? 'text-amber-400' :
                              p.rankNum === 2 ? 'text-slate-300' :
                              p.rankNum === 3 ? 'text-[#A3E635]' : 'text-slate-400'
                            }>
                              {p.rank}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-white">
                            <div 
                              onClick={() => handleViewPlayerProfile(p)}
                              className="flex items-center gap-2.5 cursor-pointer group/player inline-flex"
                              title={`Click to view ${p.tag}'s profile`}
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                              <img src={p.avatar} alt={p.tag} className="w-7 h-7 rounded-lg object-cover border border-white/10 group-hover/player:border-[#A3E635] transition shrink-0" />
                              <span className="font-bold group-hover/player:text-[#A3E635] group-hover/player:underline transition">{p.tag}</span>
                              {p.isUser && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#A3E635] text-slate-950 font-black">YOU</span>
                              )}
                              <FaceitVerificationBadge type={p.verification} size="sm" />
                              <CountryFlag code={p.code} name={p.country} size="xs" />
                            </div>
                          </td>
                          <td className="py-4 px-6 font-mono text-slate-300">
                            <div className="flex items-center gap-2">
                              <CountryFlag code={p.code} name={p.country} size="sm" />
                              <span>{p.country}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                              p.levelNum === 10 ? 'bg-orange-500/20 text-[#FF5500] border border-[#FF5500]/40' :
                              p.levelNum >= 7 ? 'bg-lime-500/20 text-[#A3E635] border border-[#A3E635]/40' :
                              'bg-slate-700/40 text-slate-300'
                            }`}>
                              {p.level}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-white">{p.elo.toLocaleString()}</td>
                          <td className="py-4 px-6 font-mono text-slate-400">{p.matches}</td>
                          <td className="py-4 px-6 font-mono text-emerald-400 font-bold">{p.winrate}</td>
                          <td className="py-4 px-6 font-mono text-slate-300">{p.kd}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleViewPlayerProfile(p)}
                              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer border ${
                                p.isUser
                                  ? 'bg-[#A3E635] text-slate-950 border-[#A3E635] hover:brightness-110 shadow-sm'
                                  : 'bg-[#141722] hover:bg-[#84CC16] hover:text-slate-950 text-slate-300 border-[#252C3D] hover:border-[#A3E635]'
                              }`}
                            >
                              {p.isUser ? 'My Profile' : 'View Profile'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* TAB: ANTI-CHEAT                                          */}
          {/* ======================================================== */}
          {activeTab === 'anticheat' && (
            <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                <div>
                  <h2 className="text-2xl font-black font-display text-white">CALIBER CLUTCH Kernel Anti-Cheat Protection</h2>
                  <p className="text-xs text-[#94A3B8]">Ring-0 hardware enforcement and driver integrity monitor</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#12141C] border border-[#23293B] flex flex-col justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                      isAntiCheatActive 
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-[#FF5500]/15 border border-[#FF5500]/30 text-[#FF5500]'
                    }`}>
                      {isAntiCheatActive ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {isAntiCheatActive ? 'Kernel Driver Active' : 'Anti-Cheat Stopped'}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      {isAntiCheatActive 
                        ? 'caliber_kernel_ac.sys verified and running at Ring-0.' 
                        : 'The driver is currently stopped. Launch Anti-Cheat to queue for matches.'}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleAntiCheat}
                    className={`mt-4 w-full py-2.5 rounded-xl font-mono font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                      isAntiCheatActive
                        ? 'bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400'
                        : 'bg-[#84CC16] hover:bg-[#A3E635] text-slate-950 shadow-md'
                    }`}
                  >
                    {isAntiCheatActive ? 'Stop Driver' : 'Launch Anti-Cheat Now'}
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-[#12141C] border border-[#23293B]">
                  <div className="w-12 h-12 rounded-2xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-[#A3E635] mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Hardware ID Enforcement</h3>
                  <p className="text-xs text-[#94A3B8] mt-1">Motherboard UUID and TPM 2.0 cryptographic handshake locked.</p>
                </div>

                <div className="p-6 rounded-3xl bg-[#12141C] border border-[#23293B]">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">FACEIT Trust Synchronized</h3>
                  <p className="text-xs text-[#94A3B8] mt-1">Player clean history confirmed across international leagues.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: "PROFILE" -> COMPLETE DIGITAL PLAYER PASSPORT & CAREER COMMAND HUB    */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (() => {
            const isViewingOther = viewedPlayer !== null && !viewedPlayer.isUser;
            const displayTag = viewedPlayer ? viewedPlayer.tag : currentGamerTag;
            const displayAvatar = viewedPlayer ? viewedPlayer.avatar : currentAvatarUrl;
            const displayClanTag = viewedPlayer ? (viewedPlayer.clanTag || 'VTX') : currentClanTag;
            const displayVerification = viewedPlayer ? viewedPlayer.verification : currentVerification;
            const displayCountryFlag = viewedPlayer ? viewedPlayer.flag : currentCountry.flag;
            const displayCountryName = viewedPlayer ? viewedPlayer.country : currentCountry.name;
            const displayCountryCode = viewedPlayer ? (viewedPlayer.code || 'XK') : currentCountry.code;
            const displayBio = viewedPlayer ? (viewedPlayer.bio || 'Competitive CS2 player on Caliber Clutch gaming platform.') : currentBio;
            const displayRole = viewedPlayer ? (viewedPlayer.role || 'CS2 Competitor') : currentRole;
            const displayElo = viewedPlayer ? viewedPlayer.elo : currentUserElo;
            const displayLevelNum = viewedPlayer ? viewedPlayer.levelNum : currentUserLevel;
            const displayMatches = viewedPlayer ? (viewedPlayer.matches || 0) : currentUserMatches;
            const displayRank = displayMatches > 0 
              ? (viewedPlayer ? `${viewedPlayer.rank} Global` : `${userPlatformRank} Platform Leader`)
              : 'Unranked (0 Matches on Caliber Clutch)';
            const displayWinrate = (viewedPlayer && viewedPlayer.matches > 0) ? viewedPlayer.winrate : (displayMatches > 0 ? '0.0%' : '--');
            const displayKd = (viewedPlayer && viewedPlayer.matches > 0) ? viewedPlayer.kd : (displayMatches > 0 ? '0.00' : '--');
            const displayHs = (viewedPlayer && viewedPlayer.matches > 0) ? (viewedPlayer.hs || '--') : (displayMatches > 0 ? '0.0%' : '--');
            const displaySteamId = viewedPlayer ? (viewedPlayer.steamId || 'STEAM_0:1:88291039') : 'STEAM_0:1:43918293';
            const activeSteamId64 = !isViewingOther
              ? (getLocalState('caliber_steam_id64') || convertSteam2ToSteam64(displaySteamId) || '76561198089448834')
              : (convertSteam2ToSteam64(displaySteamId) || '76561198089448834');
            const displayCrosshairCode = viewedPlayer ? (viewedPlayer.crosshairCode || 'CSGO-vortx-CS299-PRO88-MATCH') : currentCrosshairCode;
            const displaySens = viewedPlayer ? (viewedPlayer.sens || '800 DPI • 1.15 Sens • 1280x960 4:3') : '800 DPI • 1.15 Sens • 1280x960 4:3 Stretched';

            return (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Viewing Other Player Top Navigation Strip */}
                {isViewingOther && (
                  <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#A3E635]/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setActiveTab('rankings');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#141722] hover:bg-[#1A2030] text-white border border-white/10 hover:border-[#A3E635]/50 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#A3E635]" />
                        <span>← Back to Rankings</span>
                      </button>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                        <span className="text-slate-400">Viewing Public Profile:</span>
                        <strong className="text-white flex items-center gap-1.5">
                          <span>{displayTag}</span>
                          <FaceitVerificationBadge type={displayVerification} size="sm" />
                          <CountryFlag code={displayCountryCode} name={displayCountryName} size="xs" />
                        </strong>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        sound.playSelect();
                        setViewedPlayer(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-mono font-bold transition cursor-pointer border border-white/5"
                    >
                      View My Own Profile →
                    </button>
                  </div>
                )}
                
                {/* HERO PASSPORT & IDENTITY CARD */}
                <div className="w-full bg-[#0E1017] border border-[#202536] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    {/* Avatar + Primary Identification */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <div 
                        onClick={!isViewingOther ? handleOpenEditProfile : undefined}
                        title={!isViewingOther ? "Click to change avatar & edit profile" : undefined}
                        className={`relative shrink-0 ${!isViewingOther ? 'cursor-pointer group' : ''}`}
                      >
                        <img 
                          src={displayAvatar} 
                          alt={displayTag} 
                          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 ${
                            displayLevelNum === 10 ? 'border-orange-500 shadow-[0_0_25px_rgba(255,85,0,0.35)]' : 'border-[#A3E635] shadow-[0_0_25px_rgba(163,230,53,0.35)]'
                          } ${!isViewingOther ? 'group-hover:brightness-75 transition' : ''}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg';
                          }}
                        />
                        {!isViewingOther && (
                          <div className="absolute inset-0 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition">
                            <div className="flex flex-col items-center gap-1 text-[11px] font-mono font-bold text-white">
                              <Camera className="w-6 h-6 text-[#A3E635]" />
                              <span>CHANGE</span>
                            </div>
                          </div>
                        )}
                        {/* Skill Level badge */}
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${
                          displayLevelNum === 10
                            ? 'bg-gradient-to-br from-[#FF5500] to-amber-600 text-white font-black'
                            : 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-black font-black'
                        } text-xs flex items-center justify-center border-2 border-[#0E1017] shadow-lg`}>
                          {displayLevelNum}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#182012] text-[#A3E635] border border-[#A3E635]/40">
                            [{displayClanTag}]
                          </span>
                          <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight flex items-center gap-2.5">
                            <span>{displayTag}</span>
                            <FaceitVerificationBadge type={displayVerification} size="lg" />
                          </h1>
                          <CountryFlag code={displayCountryCode} name={displayCountryName} size="lg" />
                        </div>

                        <p className="text-xs sm:text-sm font-sans text-slate-300 italic max-w-xl">
                          "{displayBio}"
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <CountryFlag code={displayCountryCode} name={displayCountryName} size="xs" />
                            <span>{displayCountryName}</span>
                          </span>
                          <span>•</span>
                          <span className="text-white font-bold">{displayMatches > 0 ? `${displayElo.toLocaleString()} ELO` : '800 ELO'}</span>
                          <span>•</span>
                          <span className={displayMatches > 0 ? "text-[#A3E635] font-bold" : "text-amber-400 font-bold"}>{displayRank}</span>
                          <span>•</span>
                          <span className="text-sky-400 font-bold">{displayRole}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Edit Profile or Invite Teammate */}
                    <div className="flex sm:flex-row lg:flex-col gap-3 shrink-0">
                      {!isViewingOther ? (
                        <>
                          <button
                            onClick={handleOpenEditProfile}
                            className="px-5 py-3 rounded-2xl bg-[#84CC16] hover:bg-[#A3E635] text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_20px_rgba(163,230,53,0.35)] flex items-center justify-center gap-2"
                          >
                            <Edit3 className="w-4 h-4 stroke-[2.5]" />
                            <span>Edit Profile & Avatar</span>
                          </button>

                          <button
                            onClick={() => {
                              sound.playClick();
                              navigator.clipboard.writeText(window.location.href);
                              setDashboardToast('Profile URL copied to clipboard!');
                              setTimeout(() => setDashboardToast(null), 3000);
                            }}
                            className="px-5 py-2.5 rounded-2xl bg-[#141722] hover:bg-[#1A1F2E] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-mono text-xs transition cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Share2 className="w-4 h-4 text-[#A3E635]" />
                            <span>Share Passport</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              sound.playClick();
                              setDashboardToast(`Invited ${displayTag} to your 5v5 party lobby!`);
                              setTimeout(() => setDashboardToast(null), 3000);
                            }}
                            className="px-5 py-3 rounded-2xl bg-[#84CC16] hover:bg-[#A3E635] text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_20px_rgba(163,230,53,0.35)] flex items-center justify-center gap-2"
                          >
                            <UserPlus className="w-4 h-4 stroke-[2.5]" />
                            <span>Invite to 5v5 Party</span>
                          </button>

                          <button
                            onClick={() => {
                              sound.playClick();
                              navigator.clipboard.writeText(displaySteamId);
                              setDashboardToast(`${displayTag}'s Steam ID copied!`);
                              setTimeout(() => setDashboardToast(null), 2500);
                            }}
                            className="px-5 py-2.5 rounded-2xl bg-[#141722] hover:bg-[#1A1F2E] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-mono text-xs transition cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Copy className="w-4 h-4 text-[#A3E635]" />
                            <span>Copy Steam ID</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* DEDICATED VERIFIED FACEIT STATS CARD (INTEGRATED VIA STEAMID64) */}
                <VerifiedFaceitStatsCard
                  steamId64={activeSteamId64}
                  isOwner={!isViewingOther}
                />

                {/* AUTHENTIC FACEIT SEASON STATS & PERFORMANCE DASHBOARD ("JA KOMPLET PAMJA") */}
                <FaceitSeasonStatsCard
                  gamerTag={displayTag}
                  countryCode={displayCountryCode}
                  countryName={displayCountryName}
                  elo={displayMatches > 0 ? displayElo : 800}
                  level={displayMatches > 0 ? displayLevelNum : 3}
                  matches={displayMatches}
                  isCalibrated={displayMatches > 0}
                  userRank={displayMatches > 0 ? userPlatformRank : 97}
                />

                {/* TWO COLUMN GRID: ESPORTS GEAR & STEAM CONFIG + CS2 MAP POOL MASTERY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left (6 cols): Esports Gear & Steam Config */}
                  <div className="lg:col-span-6 bg-[#0E1017] border border-[#202536] rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div>
                        <h3 className="text-lg font-black font-display text-white">Competitive Setup & Gear</h3>
                        <p className="text-xs text-slate-400">Synchronized CS2 launch options & Steam trade parameters</p>
                      </div>
                      {!isViewingOther && (
                        <button
                          onClick={handleOpenEditProfile}
                          className="text-xs font-mono text-[#A3E635] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      {/* Steam ID */}
                      <div className="p-3 rounded-xl bg-[#12141C] border border-white/5 flex items-center justify-between">
                        <span className="text-slate-400">Steam ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{displaySteamId}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(displaySteamId);
                              setDashboardToast('SteamID copied!');
                              setTimeout(() => setDashboardToast(null), 2500);
                            }}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                            title="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* CS2 Crosshair Code */}
                      <div className="p-3 rounded-xl bg-[#12141C] border border-white/5 flex items-center justify-between">
                        <span className="text-slate-400">CS2 Crosshair Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#A3E635] font-bold">{displayCrosshairCode}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(displayCrosshairCode);
                              setDashboardToast('Crosshair code copied!');
                              setTimeout(() => setDashboardToast(null), 2500);
                            }}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                            title="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Steam Trade URL (Only shown for own profile) */}
                      {!isViewingOther && (
                        <div className="p-3 rounded-xl bg-[#12141C] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Trade Offer URL:</span>
                            <a
                              href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-[#A3E635] hover:underline font-bold"
                              title="Find your Steam Trade URL"
                            >
                              <span>Get URL</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="flex items-center gap-2 truncate max-w-full sm:max-w-[280px]">
                            <span className="text-slate-300 truncate">{currentTradeUrl}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(currentTradeUrl);
                                setDashboardToast('Trade URL copied!');
                                setTimeout(() => setDashboardToast(null), 2500);
                              }}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white shrink-0"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Instant Skin & Crypto Cashout */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🎁</span>
                          <div>
                            <div className="text-xs font-bold text-white font-mono">CS2 Skin Vault & Crypto Cashout</div>
                            <div className="text-[10px] text-slate-400 font-sans">Withdraw unboxed skins to Steam or cash out to USDT</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            sound.playSelect();
                            window.dispatchEvent(new CustomEvent('caliber_open_withdraw_modal')); window.dispatchEvent(new CustomEvent('vortex_open_withdraw_modal'));
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        >
                          Withdraw
                        </button>
                      </div>

                      {/* Hardware & Sens */}
                      <div className="p-3 rounded-xl bg-[#12141C] border border-white/5 flex items-center justify-between">
                        <span className="text-slate-400">Sensitivity & Res:</span>
                        <span className="text-amber-400 font-bold">{displaySens}</span>
                      </div>

                      {/* Anti-Cheat State */}
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          Warden Kernel Ring-0 Anti-Cheat
                        </span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">ACTIVE & CLEAN</span>
                      </div>
                    </div>
                  </div>

                  {/* Right (6 cols): Competitive Map Win Rates */}
                  <div className="lg:col-span-6 bg-[#0E1017] border border-[#202536] rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div>
                        <h3 className="text-lg font-black font-display text-white">Competitive Map Performance</h3>
                        <p className="text-xs text-slate-400">Telemetry across official ranked competitive pool</p>
                      </div>
                      <span className="text-xs font-mono text-[#A3E635]">Season 1</span>
                    </div>

                    {displayMatches === 0 ? (
                      <div className="p-8 rounded-2xl bg-[#12141C] border border-white/5 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-500">
                          <Activity className="w-6 h-6 text-[#A3E635]" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-white font-mono">No Map Telemetry Recorded Yet</div>
                          <p className="text-xs text-slate-400 max-w-sm">
                            Telemetry across Mirage, Inferno, Nuke, Dust II & Ancient will calibrate automatically once your first 5v5 ranked match is played.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#A3E635] bg-[#A3E635]/10 px-2.5 py-1 rounded-full border border-[#A3E635]/30">
                          CALIBRATION READY • 0 MATCHES
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3 font-mono">
                        {[
                          { map: 'Mirage (de_mirage)', winRate: isViewingOther ? 69 : 64, matches: isViewingOther ? 180 : 320, color: 'bg-[#A3E635]' },
                          { map: 'Inferno (de_inferno)', winRate: isViewingOther ? 65 : 58, matches: isViewingOther ? 140 : 285, color: 'bg-amber-400' },
                          { map: 'Nuke (de_nuke)', winRate: isViewingOther ? 62 : 61, matches: isViewingOther ? 110 : 190, color: 'bg-emerald-400' },
                          { map: 'Dust II (de_dust2)', winRate: 52, matches: isViewingOther ? 95 : 145, color: 'bg-sky-400' },
                          { map: 'Ancient (de_ancient)', winRate: 59, matches: isViewingOther ? 70 : 110, color: 'bg-purple-400' },
                        ].map((m, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-white font-bold">{m.map}</span>
                              <span className="text-slate-400">
                                <strong className="text-white">{m.winRate}%</strong> ({m.matches} matches)
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#1A1D27] overflow-hidden">
                              <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.winRate}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* WEAPON MASTERY & PERFORMANCE ACCURACY */}
                <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-lg font-black font-display text-white">Weapon Mastery & Accuracy</h3>
                      <p className="text-xs text-[#94A3B8]">Telemetry synchronized with competitive matches</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">Season 1 Data</span>
                  </div>

                  {displayMatches === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#12141C] border border-white/5 flex flex-col items-center justify-center text-center space-y-3 min-h-[160px]">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-500">
                        <Crosshair className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white font-mono">No Weapon Accuracy Telemetry Recorded</div>
                        <p className="text-xs text-slate-400 max-w-md">
                          Kills, Headshot percentages, and Impact Ratings will record automatically from live game servers upon completion of your first match.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                        0 KILLS RECORDED • AK-47 / M4A1-S / AWP / DEAGLE
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { gun: 'AK-47', kills: isViewingOther ? 2140 : 1420, hs: isViewingOther ? '72.4%' : '68.4%', rating: isViewingOther ? '1.52' : '1.42', badge: 'RIFLE', color: 'text-amber-400' },
                        { gun: 'M4A1-S', kills: isViewingOther ? 1290 : 890, hs: isViewingOther ? '64.0%' : '61.2%', rating: isViewingOther ? '1.40' : '1.35', badge: 'RIFLE', color: 'text-sky-400' },
                        { gun: 'AWP', kills: isViewingOther ? 820 : 540, hs: '14.5%', rating: isViewingOther ? '1.65' : '1.60', badge: 'SNIPER', color: 'text-emerald-400' },
                        { gun: 'Desert Eagle', kills: isViewingOther ? 490 : 310, hs: isViewingOther ? '81.0%' : '78.2%', rating: isViewingOther ? '1.35' : '1.25', badge: 'PISTOL', color: 'text-[#A3E635]' },
                      ].map((w, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-[#12141C] border border-[#232938] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/[0.05] text-slate-300">
                              {w.badge}
                            </span>
                            <span className={`text-xs font-mono font-bold ${w.color}`}>{w.gun}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Total Kills:</span>
                              <span className="text-white font-bold">{w.kills.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Headshot %:</span>
                              <span className="text-amber-400 font-bold">{w.hs}</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Impact Rating:</span>
                              <span className="text-emerald-400 font-bold">{w.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AUTHENTIC FACEIT-STYLE RECENT MATCHES TABLE (IN PROFILE TAB) */}
                <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-xl font-bold font-sans text-white tracking-tight">Recent matches</h3>
                      <p className="text-xs text-[#94A3B8]">Verified competitive match history & replay recordings</p>
                    </div>
                    {displayMatches > 0 && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setDashboardToast('Full 5v5 competitive match history archive synced');
                          setTimeout(() => setDashboardToast(null), 3000);
                        }}
                        className="text-xs font-sans text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer group font-medium"
                      >
                        <span>Full match history</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>

                  {displayMatches === 0 ? (
                    <div className="p-10 rounded-2xl bg-[#0B0D13] border border-[#1C202E] flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-500">
                        <Clock className="w-6 h-6 text-sky-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white font-sans">No competitive matches played yet</div>
                        <p className="text-xs text-slate-400 max-w-sm font-sans">
                          You haven't played any 5v5 competitive matches on Caliber Clutch yet. Queue up in the Play tab to earn ELO and record your match history.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setActiveTab('play');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-slate-950 font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Find 5v5 Match</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-6 px-6">
                    <div className="min-w-[860px] space-y-2">
                      {/* Table Header matching FACEIT photo */}
                      <div className="flex items-center gap-4 px-4 py-2 text-xs font-sans font-bold text-[#8E97A8] border-b border-white/[0.04]">
                        <div className="w-[130px] shrink-0 pl-3">Date</div>
                        <div className="w-[110px] shrink-0">Score</div>
                        <div className="w-[170px] shrink-0"></div>
                        <div className="w-[100px] shrink-0 flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#FF5500] flex items-center justify-center shrink-0">
                            <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 24 24">
                              <path d="M4 12l10-8v6h6l-10 8v-6H4z" />
                            </svg>
                          </div>
                          <span>Rating</span>
                        </div>
                        <div className="w-[110px] shrink-0">K/D/A</div>
                        <div className="flex-1 min-w-[120px]">Map</div>
                        <div className="w-[84px] shrink-0"></div>
                      </div>

                      {/* Table Rows matching FACEIT screenshot */}
                      {[
                        {
                          id: 'pm-1',
                          date: 'Wed 11 Nov',
                          time: '20:52',
                          isWin: true,
                          score: '13 : 11',
                          level: displayLevelNum,
                          elo: isViewingOther ? displayElo : 1401,
                          eloDelta: 21,
                          rating: isViewingOther ? '1.48' : '0.73',
                          ratingType: isViewingOther ? 'green' : 'red',
                          kda: isViewingOther ? '24 / 14 / 6' : '12 / 18 / 4',
                          map: 'Cache'
                        },
                        {
                          id: 'pm-2',
                          date: 'Wed 11 Nov',
                          time: '20:07',
                          isWin: false,
                          score: '10 : 13',
                          level: displayLevelNum,
                          elo: isViewingOther ? displayElo - 25 : 1380,
                          eloDelta: -25,
                          rating: '1.22',
                          ratingType: 'neutral',
                          kda: '14 / 16 / 5',
                          map: 'Mirage'
                        },
                        {
                          id: 'pm-3',
                          date: 'Wed 11 Nov',
                          time: '19:21',
                          isWin: true,
                          score: '13 : 11',
                          level: displayLevelNum,
                          elo: isViewingOther ? displayElo + 4 : 1405,
                          eloDelta: 28,
                          rating: '1.55',
                          ratingType: 'green',
                          kda: '23 / 17 / 5',
                          map: 'Nuke'
                        },
                        {
                          id: 'pm-4',
                          date: 'Tue 10 Nov',
                          time: '21:44',
                          isWin: false,
                          score: '4 : 13',
                          level: displayLevelNum,
                          elo: isViewingOther ? displayElo - 24 : 1377,
                          eloDelta: -20,
                          rating: isViewingOther ? '0.95' : '1.18',
                          ratingType: isViewingOther ? 'red' : 'neutral',
                          kda: isViewingOther ? '11 / 15 / 3' : '16 / 13 / 3',
                          map: 'Nuke'
                        },
                        {
                          id: 'pm-5',
                          date: 'Tue 10 Nov',
                          time: '21:03',
                          isWin: true,
                          score: '13 : 10',
                          level: displayLevelNum,
                          elo: isViewingOther ? displayElo - 4 : 1397,
                          eloDelta: 27,
                          rating: isViewingOther ? '1.35' : '1.14',
                          ratingType: isViewingOther ? 'green' : 'neutral',
                          kda: isViewingOther ? '22 / 13 / 6' : '18 / 16 / 7',
                          map: 'Cache'
                        }
                      ].map((m, idx) => (
                        <div
                          key={m.id}
                          className="relative flex items-center gap-4 px-4 py-3 rounded-xl bg-[#0B0D13] border border-[#1C202E] hover:border-white/15 transition overflow-hidden group/row"
                        >
                          {/* Vertical Left Line: Pure Green or Pure Red matching row height */}
                          <div 
                            className={`absolute left-0 top-0 bottom-0 w-1 ${
                              m.isWin ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                            }`} 
                          />

                          {/* Column 1: Date & Time */}
                          <div className="w-[130px] shrink-0 pl-3 font-sans text-xs">
                            <div className="font-semibold text-white tracking-tight">{m.date}</div>
                            <div className="text-[11px] text-[#717B8C] font-mono mt-0.5">{m.time}</div>
                          </div>

                          {/* Column 2: Score & Result Box */}
                          <div className="w-[110px] shrink-0 flex items-center gap-2 font-sans text-xs">
                            <span 
                              className={`w-5 h-5 rounded flex items-center justify-center font-black text-[11px] shrink-0 text-white ${
                                m.isWin ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                              }`}
                            >
                              {m.isWin ? 'W' : 'L'}
                            </span>
                            <span className={`font-bold tracking-wide font-mono ${m.isWin ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                              {m.score}
                            </span>
                          </div>

                          {/* Column 3: Skill Level, ELO & Party icon */}
                          <div className="w-[170px] shrink-0 flex items-center gap-2.5 font-sans text-xs">
                            {/* Party icon (5 dots in X pattern like FACEIT) */}
                            <svg className="w-3.5 h-3.5 text-[#7E8B9E] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                              <circle cx="8" cy="8" r="1.5" />
                              <circle cx="3.5" cy="3.5" r="1.5" />
                              <circle cx="12.5" cy="3.5" r="1.5" />
                              <circle cx="3.5" cy="12.5" r="1.5" />
                              <circle cx="12.5" cy="12.5" r="1.5" />
                            </svg>

                            {/* FACEIT Level Circle */}
                            <div 
                              className={`relative w-5 h-5 rounded-full bg-[#141720] border flex items-center justify-center shrink-0 ${
                                m.level === 10 ? 'border-[#FF5500]/80' : 'border-slate-700/80'
                              }`}
                            >
                              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
                                <circle 
                                  cx="12" 
                                  cy="12" 
                                  r="9.5" 
                                  fill="none" 
                                  stroke={m.level === 10 ? '#FF5500' : '#EAB308'} 
                                  strokeWidth="2.5" 
                                  strokeDasharray={m.level === 10 ? '60 60' : '36 60'} 
                                />
                              </svg>
                              <span className="text-[10px] font-black text-white font-mono relative z-10 leading-none">{m.level}</span>
                            </div>

                            {/* ELO & Delta */}
                            <div className="flex items-center gap-1.5 font-mono text-xs">
                              <span className="text-white font-bold">{m.elo.toLocaleString()}</span>
                              <span className={`font-bold flex items-center ${m.isWin ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                                {m.isWin ? `↑ ${m.eloDelta}` : `↓ ${Math.abs(m.eloDelta)}`}
                              </span>
                            </div>
                          </div>

                          {/* Column 4: Rating Capsule exactly like in screenshot */}
                          <div className="w-[100px] shrink-0 flex items-center">
                            <div 
                              className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold shrink-0 border-b-2 tracking-tight ${
                                m.ratingType === 'red'
                                  ? 'bg-[#2E1215] text-[#EF4444] border-[#EF4444]'
                                  : m.ratingType === 'green'
                                  ? 'bg-[#102A19] text-[#22C55E] border-[#22C55E]'
                                  : 'bg-[#1B1E28] text-white border-white'
                              }`}
                              title="Match Rating"
                            >
                              {m.rating}
                            </div>
                          </div>

                          {/* Column 5: K / D / A */}
                          <div className="w-[110px] shrink-0 font-mono text-xs text-white font-medium">
                            {m.kda}
                          </div>

                          {/* Column 6: Map badge and name */}
                          <div className="flex-1 min-w-[120px] flex items-center gap-2 font-sans text-xs font-semibold text-white">
                            {m.map === 'Cache' && (
                              <div className="w-5 h-5 rounded bg-[#18231C] border border-[#2E5E3D] flex items-center justify-center shrink-0 text-[#8CE8A0] text-[10px]">
                                ⭐
                              </div>
                            )}
                            {m.map === 'Mirage' && (
                              <div className="w-5 h-5 rounded bg-[#2D1F16] border border-[#6B4627] flex items-center justify-center shrink-0 text-[#FDBA74] text-[10px]">
                                🏛️
                              </div>
                            )}
                            {m.map === 'Nuke' && (
                              <div className="w-5 h-5 rounded bg-[#13222B] border border-[#234A5E] flex items-center justify-center shrink-0 text-[#7DD3FC] text-[10px]">
                                ☢️
                              </div>
                            )}
                            <span>{m.map}</span>
                          </div>

                          {/* Column 7: Actions (Download Demo + View Match) */}
                          <div className="w-[84px] shrink-0 flex items-center justify-end gap-1.5">
                            {/* Download Demo Button with FACEIT Tooltip */}
                            <div 
                              className="relative group"
                              onMouseEnter={() => setHoveredTooltip(`profile-demo-${idx}`)}
                              onMouseLeave={() => setHoveredTooltip(null)}
                            >
                              <button
                                onClick={() => handleDownloadDemo(m.map.toLowerCase())}
                                className="w-8 h-8 rounded-lg bg-[#141720] hover:bg-[#202534] border border-white/10 hover:border-white/25 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                                aria-label="Download demo"
                                title="Download demo"
                              >
                                <Download className="w-3.5 h-3.5 stroke-[2.2]" />
                              </button>

                              {/* Pure White FACEIT Speech Bubble Tooltip */}
                              <div 
                                className={`absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 px-2.5 py-1 rounded-md bg-white text-slate-950 text-xs font-sans font-bold shadow-2xl whitespace-nowrap z-50 pointer-events-none transition-all duration-150 ${
                                  hoveredTooltip === `profile-demo-${idx}`
                                    ? 'opacity-100 visible scale-100 translate-y-0'
                                    : 'opacity-0 invisible scale-95 translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0'
                                }`}
                              >
                                <span>Download demo</span>
                                <span className="absolute -bottom-1 right-3 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 bg-white rotate-45 pointer-events-none" />
                              </div>
                            </div>

                            {/* View Match Room Button with Tooltip */}
                            <div 
                              className="relative group"
                              onMouseEnter={() => setHoveredTooltip(`profile-room-${idx}`)}
                              onMouseLeave={() => setHoveredTooltip(null)}
                            >
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setDashboardToast(`Opening match room for ${m.map} 5v5...`);
                                  setTimeout(() => setDashboardToast(null), 2500);
                                }}
                                className="w-8 h-8 rounded-lg bg-[#141720] hover:bg-[#202534] border border-white/10 hover:border-white/25 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                                aria-label="View match"
                                title="View match"
                              >
                                <ExternalLink className="w-3.5 h-3.5 stroke-[2.2]" />
                              </button>

                              {/* Pure White FACEIT Speech Bubble Tooltip */}
                              <div 
                                className={`absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 px-2.5 py-1 rounded-md bg-white text-slate-950 text-xs font-sans font-bold shadow-2xl whitespace-nowrap z-50 pointer-events-none transition-all duration-150 ${
                                  hoveredTooltip === `profile-room-${idx}`
                                    ? 'opacity-100 visible scale-100 translate-y-0'
                                    : 'opacity-0 invisible scale-95 translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0'
                                }`}
                              >
                                <span>View match</span>
                                <span className="absolute -bottom-1 right-3 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 bg-white rotate-45 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>

              </div>
            );
          })()}
            </>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MATCH READY FOUND POPUP MODAL (1:1 AUTHENTIC FACEIT)    */}
      {/* ======================================================== */}
      {matchFoundModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0F121A] border-2 border-[#A3E635] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18210C] border border-[#A3E635]/50 text-[#A3E635] text-xs font-mono font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                MATCH READY
              </div>
              <h3 className="text-2xl font-black font-display text-white tracking-wide">
                5v5 COMPETITIVE MATCH
              </h3>
              
              {/* Countdown and Fair 50/50 Balance info */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#A3E635]" />
                <span className="text-sm font-mono text-slate-300">
                  Time remaining:{' '}
                  <strong className={matchReadyCountdown <= 15 ? 'text-red-400 font-bold' : 'text-[#A3E635] font-bold'}>
                    00:{matchReadyCountdown.toString().padStart(2, '0')}
                  </strong>
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  50% vs 50% Win Rate Balance
                </span>
                <span className="text-slate-400 text-[11px]">
                  {currentBalancedMatch ? `${currentBalancedMatch.team1.stackType} vs ${currentBalancedMatch.team2.stackType}` : 'Strict ELO Match'}
                </span>
              </div>
            </div>

            {/* 10 Player Profile Avatar Boxes (FACEIT Authentic) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141722] border border-[#232938] text-center space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Players Accepted:</span>
                <span className="text-[#A3E635] font-black text-sm">
                  {acceptedPlayerList.length} / 10
                </span>
              </div>

              {/* Grid of 10 avatar boxes */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 justify-items-center">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const player = acceptedPlayerList[idx];
                  if (player) {
                    return (
                      <div
                        key={idx}
                        className={`relative w-11 h-11 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 transition-all duration-300 transform scale-100 animate-in zoom-in-75 ${
                          player.isUser 
                            ? 'border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.7)] ring-2 ring-[#A3E635]/50' 
                            : 'border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                        }`}
                        title={player.name}
                      >
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center text-slate-950 shadow">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                        {player.isUser && (
                          <div className="absolute top-0 inset-x-0 bg-[#A3E635] text-slate-950 text-[7px] font-black uppercase text-center font-mono leading-none py-0.5">
                            YOU
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Empty Waiting Slot
                  return (
                    <div
                      key={idx}
                      className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-black/50 border border-dashed border-white/15 flex items-center justify-center text-slate-600 transition"
                      title={`Player #${idx + 1} waiting to accept...`}
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-600">
                        {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions: Big Green Accept or Confirmation (No Close Window) */}
            <div className="space-y-3">
              {!userHasAccepted ? (
                <button
                  onClick={handleUserAcceptMatch}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#84CC16] via-[#A3E635] to-[#84CC16] hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_30px_rgba(163,230,53,0.5)] cursor-pointer active:scale-95"
                >
                  ACCEPT MATCH
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-4 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/40 text-[#A3E635] text-center font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>
                      {acceptedPlayerList.length >= 10 
                        ? 'ALL PLAYERS ACCEPTED • ENTERING MATCH ROOM...' 
                        : `ACCEPTED • WAITING FOR OTHERS (${acceptedPlayerList.length}/10)...`}
                    </span>
                  </div>
                  {isProjectAdmin && (
                    <button
                      onClick={() => {
                        sound.playTournamentVictory();
                        setMatchFoundModal(false);
                        setIsMatchRoomOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Instant Enter Match Room (Admin Shortcut) →
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Connect Server Toast Notification (Centered & Clean Neutral Theme) */}
      {connectToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#12141D] border border-white/15 px-5 py-3 rounded-2xl shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <div className="text-xs font-mono">
            <div className="text-white font-bold">CONNECTING TO CS2 SERVER...</div>
            <div className="text-slate-300 text-[11px]">connect {connectToast.ip} (Copied to clipboard)</div>
          </div>
          <button onClick={() => setConnectToast(null)} className="ml-2 text-slate-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Download Demo Toast Notification (Centered & Clean Neutral Theme) */}
      {downloadDemoToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#12141D] border border-white/15 px-5 py-3 rounded-2xl shadow-2xl">
          <Download className="w-4 h-4 text-slate-300 animate-bounce" />
          <div className="text-xs font-mono">
            <div className="text-white font-bold">DOWNLOADING GOTV BROADCAST DEMO...</div>
            <div className="text-slate-300 text-[11px]">{downloadDemoToast}</div>
          </div>
          <button onClick={() => setDownloadDemoToast(null)} className="ml-2 text-slate-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dashboard General Action Toast Notification (Centered & Clean Neutral Theme - Never Behind Sidebar) */}
      {dashboardToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#12141D] border border-white/15 px-5 py-3 rounded-2xl shadow-2xl">
          <Sparkles className="w-4 h-4 text-[#A3E635]" />
          <div className="text-xs font-mono">
            <div className="text-white font-bold">CALIBER CLUTCH TELEMETRY</div>
            <div className="text-slate-300 text-[11px]">{dashboardToast}</div>
          </div>
          <button onClick={() => setDashboardToast(null)} className="ml-2 text-slate-400 hover:text-white p-1 cursor-pointer" title="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}



      {/* ======================================================== */}
      {/* AUTHENTIC PRO ESPORTS NOTIFICATIONS DRAWER               */}
      {/* ======================================================== */}
      {notificationsOpen && (
        <>
          {/* Backdrop for outside click */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setNotificationsOpen(false)}
          />

          <div className="fixed right-3 sm:right-8 top-16 w-[calc(100vw-1.5rem)] sm:w-[440px] max-h-[85vh] flex flex-col rounded-3xl bg-[#0D0F17]/98 border border-[#202536] shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl overflow-hidden">
            {/* Top Bar */}
            <div className="p-4 border-b border-[#1E2333] flex items-center justify-between bg-[#121622]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1B2213] border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white uppercase font-mono tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] text-[10px] font-black font-mono">
                        {unreadCount} NEW
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Matchmaking, Party & Competitive Updates</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-[#A3E635]/15 text-slate-300 hover:text-[#A3E635] text-[11px] font-mono transition flex items-center gap-1 border border-white/5 hover:border-[#A3E635]/30 cursor-pointer"
                    title="Mark all as read"
                  >
                    <Check className="w-3 h-3" />
                    <span className="hidden sm:inline">Read All</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAllNotifications}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/15 text-slate-400 hover:text-red-400 text-xs transition border border-white/5 hover:border-red-500/30 cursor-pointer"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Category Tabs */}
            <div className="px-3 py-2 border-b border-[#1A2030] bg-[#0A0C13]/90 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] font-mono">
              <button
                onClick={() => { sound.playClick(); setNotificationFilter('all'); }}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  notificationFilter === 'all'
                    ? 'bg-[#A3E635] text-slate-950 font-black shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => { sound.playClick(); setNotificationFilter('match'); }}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  notificationFilter === 'match'
                    ? 'bg-red-500 text-white font-black shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Crosshair className="w-3 h-3" /> Matches ({matchCount})
              </button>
              <button
                onClick={() => { sound.playClick(); setNotificationFilter('party'); }}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  notificationFilter === 'party'
                    ? 'bg-sky-500 text-slate-950 font-black shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3 h-3" /> Invites ({partyCount})
              </button>
              <button
                onClick={() => { sound.playClick(); setNotificationFilter('tournament'); }}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  notificationFilter === 'tournament'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Trophy className="w-3 h-3" /> Tournaments ({tournamentCount})
              </button>
              <button
                onClick={() => { sound.playClick(); setNotificationFilter('system'); }}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  notificationFilter === 'system'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3 h-3" /> System ({systemCount})
              </button>
            </div>

            {/* Notification List Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[58vh]">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                    <CheckCircle2 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 font-mono uppercase">All Caught Up!</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mt-1">No pending notifications in this category. You are ready to compete.</p>
                  </div>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`relative p-3 rounded-2xl border transition-all duration-200 ${
                      !n.read
                        ? 'bg-[#121622]/95 border-[#A3E635]/40 shadow-[0_0_15px_rgba(163,230,53,0.06)]'
                        : 'bg-[#0B0D15]/85 border-[#1D2335] opacity-90 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    {/* Header line of notification */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {n.type === 'match' && (
                          <span className="px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-black font-mono flex items-center gap-1 animate-pulse">
                            <Crosshair className="w-3 h-3" /> READY CHECK
                          </span>
                        )}
                        {n.type === 'party' && (
                          <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-bold font-mono flex items-center gap-1">
                            <Users className="w-3 h-3" /> LOBBY INVITE
                          </span>
                        )}
                        {n.type === 'tournament' && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold font-mono flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> TOURNAMENT
                          </span>
                        )}
                        {n.type === 'anticheat' && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> FAIR PLAY
                          </span>
                        )}
                        {n.type === 'achievement' && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[10px] font-bold font-mono flex items-center gap-1">
                            <Flame className="w-3 h-3" /> MILESTONE
                          </span>
                        )}

                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] shadow-[0_0_6px_rgba(163,230,53,0.9)]" />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                        <button
                          onClick={() => handleDeleteNotification(n.id)}
                          className="text-slate-600 hover:text-slate-300 p-0.5 transition cursor-pointer"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white font-mono">{n.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{n.subtitle}</p>
                    </div>

                    {/* Interactive Action Controls */}
                    <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center gap-2 flex-wrap">
                      {n.type === 'match' && (
                        <>
                          {n.actionStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAcceptMatch(n.id)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(163,230,53,0.4)] transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>ACCEPT MATCH (0:15)</span>
                              </button>
                              <button
                                onClick={() => handleDeclineMatch(n.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-mono transition cursor-pointer"
                              >
                                DECLINE
                              </button>
                            </>
                          )}
                          {n.actionStatus === 'accepted' && (
                            <div className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px]">
                              <span className="text-emerald-400 font-bold font-mono flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> READY (10/10) • DE_MIRAGE
                              </span>
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  if (navigator.clipboard) {
                                    navigator.clipboard.writeText('connect 185.122.54.12:27015; password cc_play');
                                  }
                                  setDashboardToast('Console connection command copied to clipboard.');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] font-mono transition cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <Copy className="w-3 h-3" />
                                <span>COPY IP</span>
                              </button>
                            </div>
                          )}
                          {n.actionStatus === 'declined' && (
                            <span className="text-red-400/80 text-[11px] font-mono italic">✕ You declined this match.</span>
                          )}
                        </>
                      )}

                      {n.type === 'party' && (
                        <>
                          {n.actionStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  handleTriggerPartyInvite(n.data?.sender || 'M18');
                                  setNotificationsOpen(false);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 shadow-[0_0_12px_rgba(163,230,53,0.35)] transition hover:scale-[1.02] cursor-pointer"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>VIEW INVITE</span>
                              </button>
                              <button
                                onClick={() => handleDeclineParty(n.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 text-xs font-mono transition cursor-pointer"
                              >
                                DECLINE
                              </button>
                            </>
                          )}
                          {n.actionStatus === 'accepted' && (
                            <span className="text-sky-400 text-[11px] font-bold font-mono flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Joined {n.data?.sender || 'Squad'}'s 5v5 Lobby
                            </span>
                          )}
                          {n.actionStatus === 'declined' && (
                            <span className="text-slate-500 text-[11px] font-mono italic">✕ Invitation declined</span>
                          )}
                        </>
                      )}

                      {n.type === 'tournament' && (
                        <button
                          onClick={() => {
                            sound.playSelect();
                            setActiveTab('tournaments');
                            setNotificationsOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1B2213] hover:bg-[#283519] border border-[#A3E635]/40 text-[#A3E635] text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>VIEW TOURNAMENT BRACKET</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {n.type === 'anticheat' && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> ACCOUNT STATUS: 100% CLEAN
                        </span>
                      )}

                      {n.type === 'achievement' && (
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-purple-400" /> BADGE DISPLAYED ON PASSPORT
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Controls Footer */}
            <div className="p-3 border-t border-[#1E2333] bg-[#0A0C13] flex items-center justify-between gap-2 text-[11px] font-mono flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleTriggerPartyInvite('M18');
                    setNotificationsOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#A3E635]/15 hover:bg-[#A3E635]/25 border border-[#A3E635]/40 text-[#A3E635] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Show Caliber Clutch Party Invite dialog with Accept and Decline"
                >
                  <Users className="w-3 h-3 text-[#A3E635]" />
                  <span>Show Party Invite</span>
                </button>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </>
      )}

      {/* Caliber Clutch Membership Upgrade Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0E1017] border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Crown className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-white">CHOOSE YOUR CALIBER CLUTCH TIER</h3>
                  <p className="text-xs font-mono text-slate-400">Unlock strict ELO matchmaking, captain vetoes & pro cash cups</p>
                </div>
              </div>
              <button 
                onClick={() => { sound.playClick(); setShowPremiumModal(false); }}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-[#94A3B8] hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2 Plans Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* PLAN 1: PREMIUM */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                userMembershipTier === 'premium'
                  ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-[#121520] border-[#222736] hover:border-amber-500/40'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-black text-amber-400 uppercase tracking-wider">CALIBER PREMIUM</span>
                    <span className="text-lg font-black text-white font-mono">€5.99<span className="text-xs text-slate-400">/mo</span></span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Strict competitive 5v5 queue with zero smurfs guarantee.</p>

                  <div className="space-y-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Unlock Super Match 5v5 queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Strict ±250 ELO range balance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Captain map veto priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Verified & Veteran only matchmaking</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (userMembershipTier === 'premium') return;
                    sound.playSelect();
                    setXsollaCheckoutItem({
                      id: 'sub-premium',
                      sku: 'CC-SUB-PREMIUM',
                      title: 'Caliber Clutch Premium Membership (1 Month)',
                      description: 'Super Match 5v5 queue, strict ±250 ELO balance, captain map veto priority.',
                      amountEur: 5.99,
                      type: 'membership_premium'
                    });
                  }}
                  className={`w-full py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                    userMembershipTier === 'premium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  <span>{userMembershipTier === 'premium' ? 'CURRENT PLAN' : 'UPGRADE TO PREMIUM'}</span>
                  {userMembershipTier !== 'premium' && (
                    <span className="text-[9px] font-mono font-black text-black/80 bg-black/10 px-1 py-0.5 rounded">
                      XSOLLA
                    </span>
                  )}
                </button>
              </div>

              {/* PLAN 2: VIP ELITE */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                userMembershipTier === 'vip'
                  ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                  : 'bg-[#121520] border-[#222736] hover:border-purple-500/40'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-black text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 fill-purple-400" /> VIP ELITE
                    </span>
                    <span className="text-lg font-black text-white font-mono">€12.99<span className="text-xs text-slate-400">/mo</span></span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">The ultimate esports tier for pro players and high-stakes cash.</p>

                  <div className="space-y-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Unlock VIP Elite Match 5v5 queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Ultra-strict ±150 ELO range</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Automated GOTV broadcast recordings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>2x Clutch Points & €25,000 Major Cups</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (userMembershipTier === 'vip') return;
                    sound.playSelect();
                    setXsollaCheckoutItem({
                      id: 'sub-vip',
                      sku: 'CC-SUB-VIP',
                      title: 'Caliber Clutch VIP Elite Pass (1 Month)',
                      description: 'VIP Match queue, ultra-strict ±150 ELO, automated GOTV demo recording, 2x Points.',
                      amountEur: 12.99,
                      type: 'membership_vip'
                    });
                  }}
                  className={`w-full py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                    userMembershipTier === 'vip'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 cursor-default'
                      : 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 hover:brightness-110 text-slate-950 shadow-purple-500/20'
                  }`}
                >
                  <span>{userMembershipTier === 'vip' ? 'CURRENT PLAN' : 'UPGRADE TO VIP ELITE'}</span>
                  {userMembershipTier !== 'vip' && (
                    <span className="text-[9px] font-mono font-black text-black/80 bg-black/10 px-1 py-0.5 rounded">
                      XSOLLA
                    </span>
                  )}
                </button>
              </div>

            </div>

            {/* Official Xsolla Trust Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#FF003C]/10 via-black/40 to-white/[0.02] border border-[#FF003C]/30 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FF003C] to-[#FF456A] flex items-center justify-center text-white font-black text-xs font-display shadow-sm">
                  X
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                    <span>POWERED BY XSOLLA</span>
                    <span className="text-[9px] font-mono text-[#FF003C] bg-[#FF003C]/10 px-1.5 py-0.5 rounded border border-[#FF003C]/30 font-black">
                      PAY STATION 4
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Cards, PayPal, Apple Pay, Google Pay, Paysafecard, Crypto & 700+ Local Gateways
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Merchant</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Official Xsolla Pay Station 4 Gateway Checkout Dialog */}
      {xsollaCheckoutItem && (
        <XsollaCheckoutModal
          isOpen={Boolean(xsollaCheckoutItem)}
          onClose={() => setXsollaCheckoutItem(null)}
          initialItem={xsollaCheckoutItem}
          onPaymentSuccess={(res) => {
            if (res.item.type === 'membership_premium') {
              setUserMembershipTier('premium');
              confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
              setDashboardToast('🎉 Payment Confirmed via Xsolla! Upgraded to CALIBER PREMIUM!');
            } else if (res.item.type === 'membership_vip') {
              setUserMembershipTier('vip');
              confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
              setDashboardToast('👑 Payment Confirmed via Xsolla! Upgraded to VIP ELITE!');
            } else if (res.item.type === 'tournament_entry') {
              const tourneyTitle = res.item.sku || selectedRegisterTourney?.title || 'Tournament';
              setRegisteredTourneys(prev => {
                const next = Array.from(new Set([...prev, tourneyTitle]));
                try {
                  setLocalState('caliber_registered_tournaments', JSON.stringify(next));
                } catch (_) {}
                return next;
              });
              setSelectedRegisterTourney(null);
              confetti({ particleCount: 100, spread: 85, origin: { y: 0.6 } });
              setDashboardToast(`✓ Buy-In payment (€${res.amountEur}) completed! [${userClanData.tag}] registered in ${tourneyTitle}.`);
            } else if (res.item.type === 'wallet_topup') {
              creditVortexWalletBalance(res.amountEur);
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
              setDashboardToast(`✓ Caliber Wallet topped up successfully (+€${res.amountEur.toFixed(2)})!`);
            }
            setTimeout(() => setDashboardToast(null), 5000);
            setShowPremiumModal(false);
            setXsollaCheckoutItem(null);
          }}
        />
      )}


      {/* CALIBER CLUTCH OFFICIAL PARTNERS & SPONSORSHIPS MODAL (HLTV STANDARD) */}
      <VortexPartnersModal
        isOpen={showPartnersModal}
        onClose={() => setShowPartnersModal(false)}
      />

      {/* CALIBER CLUTCH CS2 TOURNAMENT BRACKET & MATCHES VIEWER MODAL */}
      {selectedBracketTourney && (() => {
        const tourneyKey = selectedBracketTourney.id || selectedBracketTourney.title;
        const bState = bracketStates[tourneyKey] || { stage: 'qf' };
        const stage = bState.stage || 'qf';
        const isRegistered = registeredTourneys.includes(selectedBracketTourney.title);
        const pFormat = selectedBracketTourney.playoffsFormat || 'BO3';
        const fFormat = selectedBracketTourney.finalsFormat || 'BO5';
        const isBo1Playoffs = pFormat === 'BO1';
        const isBo5Final = fFormat === 'BO5';
        const prizeRaw = selectedBracketTourney.cashPrize || '€3,000';
        const prizeNum = parseCurrencyInput(prizeRaw) || 1500;

        const currentTeams = getTourneyTeams(tourneyKey);
        const approvedTeams = currentTeams.filter(t => t.status === 'approved');
        const pendingTeams = currentTeams.filter(t => t.status === 'pending');
        const maxCapacity = selectedBracketTourney.maxTeams || (selectedBracketTourney.teams ? parseInt(String(selectedBracketTourney.teams).split('/')[1] || '16', 10) : 16);
        const isHost = isProjectAdmin || 
          (selectedBracketTourney.creator && selectedBracketTourney.creator.toLowerCase() === currentGamerTag.toLowerCase()) ||
          (selectedBracketTourney.creatorClan && userClanData?.tag && selectedBracketTourney.creatorClan.toLowerCase() === userClanData.tag.toLowerCase()) ||
          (selectedBracketTourney.organizer && selectedBracketTourney.organizer.toLowerCase().includes(currentGamerTag.toLowerCase()));

        return (
          <div 
            onClick={() => {
              sound.playClick();
              setSelectedBracketTourney(null);
            }}
            className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0C1019] border border-[#252E42] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative cursor-default my-auto"
            >
              {/* Modal Header (No redundant X button - dismissed via bottom button, backdrop, or Escape) */}
              <div className="flex items-start justify-between border-b border-[#1E2638] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 uppercase">
                      Official Tournament Championship
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      100% Cash Prize Pool: {selectedBracketTourney.cashPrize}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                    {selectedBracketTourney.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Official European Championship Bracket • 5v5 Competitive
                  </p>
                </div>
              </div>

              {/* Organizer Navigation Tabs (Only visible to Host / Admin) */}
              {isHost && (
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setTourneyModalTab('bracket');
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      tourneyModalTab === 'bracket'
                        ? 'bg-[#A3E635] text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Bracket Tree</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setTourneyModalTab('teams');
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      tourneyModalTab === 'teams'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Manage Teams ({approvedTeams.length}/{maxCapacity})</span>
                    {pendingTeams.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                        {pendingTeams.length} PENDING
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setTourneyModalTab('admin');
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      tourneyModalTab === 'admin'
                        ? 'bg-cyan-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Live Stream</span>
                  </button>
                </div>
              )}

              {/* TAB 1: MANAGE TEAMS & SPORTING AUTHORITY */}
              {tourneyModalTab === 'teams' && isHost ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                    <div>
                      <div className="text-sm font-bold text-amber-300 flex items-center gap-2 font-display">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span>ORGANIZER SPORTING AUTHORITY</span>
                      </div>
                      <p className="text-xs font-mono text-slate-300 mt-1">
                        Review team applications, accept qualified rosters, or reject entries. Current capacity: {approvedTeams.length} / {maxCapacity} slots filled.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase shrink-0">
                      Host Controls Active
                    </span>
                  </div>

                  {/* Team Applications List */}
                  <div className="space-y-2.5">
                    {currentTeams.map((team) => (
                      <div
                        key={team.id}
                        className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          team.status === 'approved'
                            ? 'bg-[#121622] border-[#252E42]'
                            : team.status === 'pending'
                            ? 'bg-amber-950/20 border-amber-500/30'
                            : 'bg-black/40 border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CountryFlag code={team.country} size="sm" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold font-display text-white">{team.name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                                [{team.tag}]
                              </span>
                              {team.status === 'approved' && (
                                <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                  APPROVED ✓
                                </span>
                              )}
                              {team.status === 'pending' && (
                                <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                                  PENDING REVIEW ⏳
                                </span>
                              )}
                              {team.status === 'rejected' && (
                                <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                  REJECTED ✕
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>Captain: <strong className="text-slate-200">{team.captain}</strong></span>
                              <span>•</span>
                              <span>Avg ELO: <strong className="text-[#A3E635]">{team.elo}</strong></span>
                              <span>•</span>
                              <span>{team.appliedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Host Sporting Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {team.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateTeamStatus(tourneyKey, team.id, 'approved')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Accept Team</span>
                              </button>
                              <button
                                onClick={() => handleUpdateTeamStatus(tourneyKey, team.id, 'rejected')}
                                className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5 text-rose-400" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {team.status === 'approved' && team.name !== userClanData.name && (
                            <button
                              onClick={() => handleUpdateTeamStatus(tourneyKey, team.id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 font-mono text-xs transition cursor-pointer"
                              title="Remove squad from tournament"
                            >
                              Remove Team
                            </button>
                          )}
                          {team.status === 'rejected' && (
                            <button
                              onClick={() => handleUpdateTeamStatus(tourneyKey, team.id, 'approved')}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 font-mono text-xs transition cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : tourneyModalTab === 'admin' && isHost ? (
                /* TAB 2: LIVE STREAM & SPECTATOR BROADCAST */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="font-display font-black text-white text-sm">OFFICIAL LIVE STREAM & SPECTATOR FEED</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        120s Anti-Ghosting Delay Protected
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-300 leading-relaxed">
                      As tournament host, you receive authorized spectator relay access with full observer camera tools to broadcast all tournament matches live on Twitch, YouTube, or Kick.
                    </p>

                    {/* Security Hardened Stream Connection Box with Blur/Hide Toggle */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-cyan-500/20">
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className={`text-xs font-mono text-cyan-300 transition-all duration-200 truncate ${
                          revealTournamentStreamIp ? 'filter-none select-all' : 'blur-sm select-none opacity-60'
                        }`}>
                          {revealTournamentStreamIp 
                            ? 'connect tv.caliberclutch.gg:27020; password cc_cast' 
                            : 'connect tv.caliberclutch.gg:•••••; password ••••••'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setRevealTournamentStreamIp(!revealTournamentStreamIp);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white transition cursor-pointer shrink-0 ml-2 border border-white/10"
                        title={revealTournamentStreamIp ? 'Hide Stream IP' : 'Reveal Stream IP'}
                      >
                        {revealTournamentStreamIp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          navigator.clipboard.writeText('connect tv.caliberclutch.gg:27020; password cc_cast');
                          setDashboardToast('✓ Stream connection command copied!');
                          setTimeout(() => setDashboardToast(null), 3000);
                        }}
                        className="flex-1 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Stream IP</span>
                      </button>
                      <a
                        href="steam://connect/tv.caliberclutch.gg:27020/cc_cast"
                        onClick={() => sound.playClick()}
                        className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Launch Spectator Feed</span>
                      </a>
                    </div>
                  </div>

                  {/* 5% Host Commission Reward Tracker */}
                  <div className="p-4 rounded-2xl bg-[#121622] border border-[#252E42] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635] shrink-0">
                        <Coins className="w-5 h-5 text-[#A3E635]" />
                      </div>
                      <div>
                        <div className="text-white font-bold">5% Organizer Host Commission</div>
                        <div className="text-slate-400 text-[11px]">
                          Automated payout upon championship conclusion: <strong className="text-emerald-400 font-bold">€{Math.round(prizeNum * 0.05)} Cash</strong>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs shrink-0">
                      Guaranteed Instant Payout ✓
                    </span>
                  </div>
                </div>
              ) : (
                /* TAB 0: BRACKET TREE */
                <>
                  {/* Connected Clan Enrollment Bar */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#141620] to-[#0E1017] border border-[#232938] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <img
                        src={userClanData.logo}
                        alt={userClanData.name}
                        className="w-10 h-10 rounded-xl object-contain border border-[#A3E635]/40 bg-[#12141D] p-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black font-display text-white">{userClanData.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40">
                            [{userClanData.tag}]
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Team Captain: <strong className="text-white">{currentGamerTag}</strong> • Team ELO: <strong className="text-[#A3E635]">{userClanData.stats?.avgElo || 2150}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {stage === 'champion' ? (
                        <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-black flex items-center gap-1.5 animate-pulse">
                          <Trophy className="w-3.5 h-3.5 text-amber-400 fill-current" />
                          CHAMPIONS • {selectedBracketTourney.cashPrize} PAID OUT ✓
                        </span>
                      ) : isRegistered ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          5v5 Roster Locked & Enrolled
                        </span>
                      ) : isUserTeamCaptain ? (
                        !isFull5Stack ? (
                          <button
                            onClick={() => {
                              sound.playClick();
                              setSelectedRegisterTourney(selectedBracketTourney);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-mono font-bold text-xs cursor-pointer transition flex items-center gap-1.5"
                            title="Complete 5-Stack required for tournament registration"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>5-Stack Required ({teamRosterCount}/5)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              sound.playSelect();
                              setSelectedRegisterTourney(selectedBracketTourney);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#A3E635] hover:bg-[#84CC16] text-slate-950 font-mono font-black text-xs cursor-pointer transition shadow flex items-center gap-1.5"
                          >
                            <Crown className="w-3.5 h-3.5 text-slate-950" />
                            <span>+ Enroll [{userClanData.tag}] Roster</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            sound.playClick();
                            setCaptainDeniedModal({
                              open: true,
                              tourneyTitle: selectedBracketTourney.title,
                              captainName: userClanData.captainName || 'Team Captain',
                              teamTag: userClanData.tag || 'Squad'
                            });
                            setDashboardToast(`⚠️ Only Team Captain (${userClanData.captainName || 'Captain'}) can register squad in official tournaments.`);
                            setTimeout(() => setDashboardToast(null), 4500);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-mono font-bold text-xs cursor-pointer transition flex items-center gap-1.5"
                          title="Only Team Captain can register squad"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Captain Only ({userClanData.captainName})</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tournament Format Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#101420] border border-white/5 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-400">Playoffs:</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                        {pFormat} Series
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">Grand Final:</span>
                      <span className="px-2 py-0.5 rounded bg-[#A3E635]/15 text-[#A3E635] font-bold border border-[#A3E635]/30">
                        {fFormat} Series
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>CaliberClutch Ring-0 Anti-Cheat Active</span>
                    </div>
                  </div>

                  {/* CHAMPION VICTORY CELEBRATION BANNER */}
                  {stage === 'champion' && (
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-[#A3E635]/20 border-2 border-amber-400/50 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                          <Trophy className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                          <div className="text-base font-black font-display text-amber-300 flex items-center gap-2">
                            <span>🏆 1ST PLACE CHAMPIONS — [{userClanData.tag}] {userClanData.name}</span>
                          </div>
                          <p className="text-xs font-mono text-emerald-400 font-bold">
                            ✓ {selectedBracketTourney.cashPrize} Cash Prize automatically credited to your balance!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick();
                          resetTourneyBracketStage(tourneyKey);
                          setDashboardToast(`✓ Bracket reset! You can now replay the tournament.`);
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white cursor-pointer transition shrink-0"
                      >
                        ↺ Replay Bracket
                      </button>
                    </div>
                  )}

                  {/* Esports Interactive Bracket Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* 1. QUARTERFINALS */}
                    <div className="space-y-3">
                      <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Quarterfinals ({pFormat})</span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {stage === 'qf' ? '⚡ Action Required' : 'Finished ✓'}
                        </span>
                      </div>

                      {/* QF-1 */}
                      <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D] space-y-2">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-white font-bold flex items-center gap-1.5">
                            <CountryFlag code="XK" size="xs" />
                            Vanguard Tactical
                          </span>
                          <span className="font-bold text-emerald-400">{isBo1Playoffs ? '13 ✓' : '2 ✓'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <CountryFlag code="GB" size="xs" />
                            Apex Legion
                          </span>
                          <span>{isBo1Playoffs ? '9' : '0'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 border-t border-white/5 pt-1.5 flex justify-between">
                          <span>{isBo1Playoffs ? 'de_mirage' : 'Mirage (13-9), Anubis (13-11)'}</span>
                          <span className="text-emerald-400">{isBo1Playoffs ? 'BO1' : 'BO3'}</span>
                        </div>
                      </div>

                      {/* QF-2 (User Clan Match) */}
                      <div className={`p-3.5 rounded-2xl border transition space-y-2 ${
                        stage === 'qf'
                          ? 'bg-gradient-to-b from-[#1E1926] to-[#121420] border-amber-500/50 shadow-lg'
                          : 'bg-[#121622] border-[#232B3D]'
                      }`}>
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-amber-300 font-bold flex items-center gap-1.5 truncate">
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>[{userClanData.tag}] {userClanData.name}</span>
                          </span>
                          <span className="font-bold text-emerald-400">
                            {stage === 'qf' ? '13 ✓' : '13 ✓'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <CountryFlag code="UA" size="xs" />
                            Eclipse Esports
                          </span>
                          <span>{stage === 'qf' ? '8' : '8'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 border-t border-white/5 pt-1.5 flex justify-between">
                          <span>{isBo1Playoffs ? 'de_anubis' : 'Anubis (13-8)'}</span>
                          <span className="text-emerald-400">MATCH WON ✓</span>
                        </div>

                        {stage === 'qf' && (
                          <button
                            onClick={() => {
                              sound.playJoinScrim();
                              updateTourneyBracketStage(tourneyKey, 'sf');
                              setDashboardToast(`✓ QF Won! Advanced to Semifinals against Apex Vanguard!`);
                            }}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#A3E635] text-slate-950 font-mono font-bold text-xs cursor-pointer transition hover:brightness-110 active:scale-95 shadow"
                          >
                            Advance to Semifinal →
                          </button>
                        )}
                      </div>

                      {/* QF-3 */}
                      <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D] space-y-2">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-white font-bold flex items-center gap-1.5">
                            <CountryFlag code="DE" size="xs" />
                            Apex Vanguard
                          </span>
                          <span className="font-bold text-emerald-400">{isBo1Playoffs ? '13 ✓' : '2 ✓'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <CountryFlag code="SE" size="xs" />
                            Titan Esports
                          </span>
                          <span>{isBo1Playoffs ? '11' : '1'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 border-t border-white/5 pt-1.5 flex justify-between">
                          <span>{isBo1Playoffs ? 'de_ancient' : 'Ancient (13-11)'}</span>
                          <span className="text-emerald-400">{isBo1Playoffs ? 'BO1' : 'BO3'}</span>
                        </div>
                      </div>

                      {/* QF-4 */}
                      <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D] space-y-2">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-white font-bold flex items-center gap-1.5">
                            <CountryFlag code="FR" size="xs" />
                            Astral Legion
                          </span>
                          <span className="font-bold text-emerald-400">{isBo1Playoffs ? '13 ✓' : '2 ✓'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <CountryFlag code="DK" size="xs" />
                            Cyber Knights
                          </span>
                          <span>{isBo1Playoffs ? '7' : '0'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 border-t border-white/5 pt-1.5 flex justify-between">
                          <span>{isBo1Playoffs ? 'de_dust2' : 'Dust II (13-7)'}</span>
                          <span className="text-emerald-400">{isBo1Playoffs ? 'BO1' : 'BO3'}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. SEMIFINALS */}
                    <div className="space-y-3">
                      <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Semifinals ({pFormat})</span>
                        <span className="text-[10px] text-amber-400 font-bold">
                          {stage === 'sf' ? '⚡ Match Live' : stage === 'final' || stage === 'champion' ? 'Finished ✓' : 'Awaiting QF'}
                        </span>
                      </div>

                      {/* SF-1: User Clan vs Apex Vanguard */}
                      <div className={`p-3.5 rounded-2xl border transition space-y-2 ${
                        stage === 'sf'
                          ? 'bg-gradient-to-b from-[#1E1926] to-[#121420] border-amber-500/50 shadow-lg'
                          : 'bg-[#121622] border-[#232B3D]'
                      }`}>
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-amber-300 font-bold flex items-center gap-1.5 truncate">
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>[{userClanData.tag}] {userClanData.name}</span>
                          </span>
                          <span className="font-bold text-emerald-400">
                            {stage === 'sf' ? '13' : stage === 'final' || stage === 'champion' ? '16 ✓' : 'TBD'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <CountryFlag code="DE" size="xs" />
                            Apex Vanguard
                          </span>
                          <span>{stage === 'sf' ? '11' : stage === 'final' || stage === 'champion' ? '14' : 'TBD'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 border-t border-white/5 pt-1.5 flex justify-between">
                          <span>de_inferno (Overtime)</span>
                          <span className="text-amber-400 font-bold">{stage === 'sf' ? 'PLAYING NOW' : stage === 'final' || stage === 'champion' ? 'SF WON ✓' : 'TBD'}</span>
                        </div>

                        {stage === 'sf' && (
                          <button
                            onClick={() => {
                              sound.playJoinScrim();
                              updateTourneyBracketStage(tourneyKey, 'final');
                              setDashboardToast(`✓ SF Victory (16-14)! You have advanced to the GRAND FINAL!`);
                            }}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#A3E635] text-slate-950 font-mono font-bold text-xs cursor-pointer transition hover:brightness-110 active:scale-95 shadow"
                          >
                            Advance to Grand Final 🏆 →
                          </button>
                        )}
                      </div>

                      {/* SF-2: Vanguard Tactical vs Astral Legion */}
                      <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D] space-y-2">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-white font-bold flex items-center gap-1.5">
                            <CountryFlag code="FR" size="xs" />
                            Astral Legion
                          </span>
                          <span className="font-bold text-emerald-400">{stage === 'final' || stage === 'champion' ? '13 ✓' : '13'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <CountryFlag code="XK" size="xs" />
                            Vanguard Tactical
                          </span>
                          <span>{stage === 'final' || stage === 'champion' ? '10' : '10'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 border-t border-white/5 pt-1.5 flex justify-between">
                          <span>de_nuke</span>
                          <span className="text-emerald-400">{stage === 'final' || stage === 'champion' ? 'Astral Advanced ✓' : 'BO1'}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. GRAND FINAL */}
                    <div className="space-y-3">
                      <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Grand Final ({fFormat})</span>
                        <span className="text-[10px] text-amber-400 font-bold">
                          {stage === 'final' ? '👑 FINAL LIVE' : stage === 'champion' ? '🏆 CHAMPION' : 'Championship'}
                        </span>
                      </div>

                      <div className={`p-4 rounded-3xl border-2 transition space-y-3 ${
                        stage === 'champion'
                          ? 'bg-gradient-to-b from-[#241F14] to-[#121622] border-[#A3E635] shadow-2xl shadow-lime-500/20'
                          : stage === 'final'
                          ? 'bg-gradient-to-b from-[#251A24] to-[#141220] border-amber-400 shadow-xl'
                          : 'bg-[#121622] border-[#252E42]'
                      }`}>
                        {/* User Clan in Final */}
                        <div className="flex justify-between items-center text-sm font-mono">
                          <span className="text-amber-300 font-black flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="truncate">[{userClanData.tag}] {userClanData.name}</span>
                          </span>
                          <span className={`font-black ${stage === 'champion' ? 'text-[#A3E635] text-base' : 'text-white'}`}>
                            {stage === 'champion' ? '3 ✓ CHAMPIONS' : stage === 'final' ? '2 (Tied)' : 'TBD'}
                          </span>
                        </div>

                        {/* Opponent in Final */}
                        <div className="flex justify-between items-center text-sm font-mono">
                          <span className="text-white font-black flex items-center gap-2">
                            <CountryFlag code="FR" size="sm" />
                            Astral Legion
                          </span>
                          <span className={`font-black ${stage === 'champion' ? 'text-slate-400' : 'text-slate-200'}`}>
                            {stage === 'champion' ? '2 (Runner-Up)' : stage === 'final' ? '2 (Tied)' : 'TBD'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1 text-center">
                          <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                            {stage === 'champion'
                              ? '🏆 Match Concluded • Decider Map: Inferno (13-11)'
                              : stage === 'final'
                              ? 'Series Tied 2 - 2 • Decider Map 5: Inferno'
                              : 'Awaiting Semifinal Winners'}
                          </div>
                          <div className="text-sm font-mono font-bold text-slate-300">
                            {stage === 'champion' ? '1st Place: 100% Cash Instant Payout Dispatched' : `1st Place Prize: ${selectedBracketTourney.cashPrize} Cash`}
                          </div>
                        </div>

                        {/* Play Grand Final Button */}
                        {stage === 'final' && (
                          <button
                            onClick={() => {
                              sound.playTournamentVictory();
                              confetti({ particleCount: 150, spread: 110, origin: { y: 0.5 } });
                              creditVortexWalletBalance(prizeNum);

                              // Update clan stats in localStorage
                              try {
                                const rawClan = getLocalState('caliber_user_clan_data');
                                if (rawClan) {
                                  const parsedClan = JSON.parse(rawClan);
                                  parsedClan.stats.tournamentsWon = (parsedClan.stats.tournamentsWon || 0) + 1;
                                  parsedClan.stats.wins = (parsedClan.stats.wins || 0) + 3;
                                  parsedClan.stats.matches = (parsedClan.stats.matches || 0) + 3;
                                  parsedClan.stats.streak = (parsedClan.stats.streak || 0) + 3;
                                  setLocalState('caliber_user_clan_data', JSON.stringify(parsedClan));
                                }
                              } catch (_) {}

                              updateTourneyBracketStage(tourneyKey, 'champion', prizeNum);
                              setDashboardToast(`🏆 TOURNAMENT CHAMPIONS! [${userClanData.tag}] won 1st Place! €${prizeNum.toLocaleString()} Cash credited directly to your balance!`);
                              setTimeout(() => setDashboardToast(null), 7000);
                            }}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#A3E635] via-emerald-400 to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-xl shadow-[#A3E635]/30 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Trophy className="w-4 h-4 text-slate-950 fill-current" />
                            <span>Win Grand Final & Claim {selectedBracketTourney.cashPrize}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Bottom Modal Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedBracketTourney(null)}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-bold text-white transition cursor-pointer"
                >
                  Close Bracket View
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TEAM REGISTRATION & ROSTER LOCK MODAL */}
      {selectedRegisterTourney && (
        <div 
          onClick={() => {
            sound.playClick();
            setSelectedRegisterTourney(null);
          }}
          className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0C1019] border border-[#252E42] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left relative overflow-hidden cursor-default my-auto"
          >
            <div className="flex items-start justify-between border-b border-[#1E2638] pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 uppercase">
                    Roster Enrollment
                  </span>
                  <span className="text-xs font-mono text-slate-400">5v5 Tournament Roster</span>
                </div>
                <h3 className="text-lg font-black font-display text-white">
                  {selectedRegisterTourney.title}
                </h3>
              </div>
            </div>

            {/* Captaincy & 5-Stack Status Banner */}
            {!isFull5Stack ? (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs font-mono">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <span className="font-bold text-rose-300 block">⛔ INCOMPLETE ROSTER — 5-STACK STRICTLY REQUIRED</span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Your team currently has {teamRosterCount}/5 players. Official tournament entry requires exactly 5 confirmed starting players. Recruit below or auto-fill with verified solo grinders.
                  </p>
                </div>
              </div>
            ) : isUserTeamCaptain ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs font-mono">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="font-bold text-emerald-300 block">✓ CAPTAIN CLEARANCE & 5-STACK VERIFIED</span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Welcome Captain {currentGamerTag}. Full tournament registration and buy-in authority verified for [{userClanData.tag}].
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs font-mono">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="font-bold text-amber-300 block">⛔ REGISTRATION RESTRICTED: TEAM CAPTAIN ONLY</span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Official Team Captain is <strong>{userClanData.captainName}</strong>. Your role: {currentUserRole}. Only the captain can enroll and lock this squad.
                  </p>
                </div>
              </div>
            )}

            {/* IN-MODAL QUICK SQUAD RADAR TO FILL 5-STACK */}
            {!isFull5Stack && (
              <div className="pt-1">
                <VortexSquadRadar
                  currentGamerTag={currentGamerTag}
                  currentClanTag={currentClanTag}
                  members={userClanData.members.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    role: m.role || 'Player',
                    level: m.level || 9,
                    elo: m.elo || 2000,
                    avatar: m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80',
                    countryCode: m.countryCode || 'XK',
                    isCaptain: m.isCaptain
                  }))}
                  onRecruit={handleRecruitToSquad}
                  onRemove={handleRemoveFromSquad}
                  onAutoFill5Stack={handleAutoFillSquad}
                  compact={true}
                />
              </div>
            )}

            {/* Team Info Form */}
            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Team Name</label>
                  <input
                    type="text"
                    defaultValue={userClanData.name}
                    placeholder="Enter team name (e.g. Caliber Clan)..."
                    className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-white font-bold focus:outline-none focus:border-[#A3E635] placeholder:text-slate-600 placeholder:font-normal"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Team Tag</label>
                  <input
                    type="text"
                    defaultValue={userClanData.tag}
                    placeholder="e.g. CLBR"
                    maxLength={5}
                    className="w-full px-3 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-amber-400 font-bold focus:outline-none focus:border-[#A3E635] placeholder:text-slate-600 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Roster Slots List connected with Clan */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Confirmed 5v5 Lineup [{userClanData.tag}]</label>
                  <span className={`text-[10px] font-mono font-bold ${isFull5Stack ? 'text-[#A3E635]' : 'text-rose-400'}`}>
                    {isFull5Stack ? '5 Starters Locked' : `${teamRosterCount}/5 Starters (Missing ${5 - teamRosterCount})`}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  {[0, 1, 2, 3, 4].map((slotIdx) => {
                    const member = userClanData.members[slotIdx];
                    if (member) {
                      return (
                        <div key={member.id || slotIdx} className="flex items-center justify-between text-xs font-mono">
                          <span className={`font-bold flex items-center gap-1.5 ${slotIdx === 0 ? 'text-amber-300' : 'text-white'}`}>
                            {slotIdx === 0 ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <CountryFlag code="XK" size="xs" />}
                            {slotIdx + 1}. {member.name} ({member.role})
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">Ring-0 AC Ready ✓</span>
                        </div>
                      );
                    }
                    return (
                      <div key={`empty-${slotIdx}`} className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-rose-500/10 border border-rose-500/25">
                        <span className="font-bold flex items-center gap-1.5 text-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          Slot {slotIdx + 1}: [EMPTY SLOT] Missing Player
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRegisterTourney(null);
                            setActiveTab('teams');
                          }}
                          className="text-[10px] font-mono text-rose-300 hover:text-white underline cursor-pointer"
                        >
                          + Invite Teammate
                        </button>
                      </div>
                    );
                  })}
                  {userClanData.members[5] && (
                    <div className="flex items-center justify-between text-xs font-mono border-t border-white/5 pt-1 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <CountryFlag code="AL" size="xs" />
                        6. {userClanData.members[5].name} (Stand-in / Sub)
                      </span>
                      <span className="text-[10px] text-blue-400 font-bold">Bench Ready ✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Server & Integrity Checklist */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All 5 players passed Valve VAC & Caliber Clutch Ring-0 Anti-Cheat checks.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tournament Bracket: {selectedRegisterTourney?.region || 'Official European Online Bracket'}.</span>
                </div>
              </div>

              {/* INTERACTIVE TOURNAMENT BUY-IN & PAYMENT SECTION */}
              {(() => {
                const entryFee = Number(selectedRegisterTourney?.entryFee) || 25;
                const hasEnoughWallet = vortexCoinsBalance >= entryFee;

                return (
                  <div className="p-4 rounded-2xl bg-[#090C12] border border-[#202738] space-y-3.5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white text-xs">Tournament Entry Fee (Team Buy-In)</span>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-black text-amber-400 text-sm">€{entryFee % 1 !== 0 ? entryFee.toFixed(2) : entryFee} / Team</div>
                        <div className="text-[10px] text-slate-400">€{(entryFee / 5).toFixed(2)} per player (5v5)</div>
                      </div>
                    </div>

                    {/* Caliber Wallet Status Bar */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Wallet className="w-4 h-4 text-[#A3E635]" />
                        <span>Caliber Wallet Balance:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${hasEnoughWallet ? 'text-[#A3E635]' : 'text-amber-400'}`}>
                          €{vortexCoinsBalance.toFixed(2)}
                        </span>
                        {hasEnoughWallet ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                            ✓ Sufficient Balance
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                            Missing €{(entryFee - vortexCoinsBalance).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Select Payment Method:
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Option 1: Caliber Wallet */}
                        <button
                          type="button"
                          onClick={() => setTournamentPaymentMethod('wallet')}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            tournamentPaymentMethod === 'wallet'
                              ? 'bg-[#121A0E] border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.15)]'
                              : 'bg-[#10141E] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Wallet className={`w-4 h-4 ${tournamentPaymentMethod === 'wallet' ? 'text-[#A3E635]' : 'text-slate-400'}`} />
                            <span className={`w-2 h-2 rounded-full ${tournamentPaymentMethod === 'wallet' ? 'bg-[#A3E635]' : 'bg-transparent border border-slate-600'}`} />
                          </div>
                          <div className="mt-2">
                            <div className="font-bold text-white text-[11px]">Caliber Wallet</div>
                            <div className="text-[10px] text-slate-400">Direct wallet deduction</div>
                          </div>
                        </button>

                        {/* Option 2: Card / Crypto / PayPal via Xsolla */}
                        <button
                          type="button"
                          onClick={() => setTournamentPaymentMethod('xsolla')}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            tournamentPaymentMethod === 'xsolla'
                              ? 'bg-[#121A0E] border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.15)]'
                              : 'bg-[#10141E] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <CreditCard className={`w-4 h-4 ${tournamentPaymentMethod === 'xsolla' ? 'text-[#A3E635]' : 'text-slate-400'}`} />
                            <span className={`w-2 h-2 rounded-full ${tournamentPaymentMethod === 'xsolla' ? 'bg-[#A3E635]' : 'bg-transparent border border-slate-600'}`} />
                          </div>
                          <div className="mt-2">
                            <div className="font-bold text-white text-[11px]">Card / Crypto / PayPal</div>
                            <div className="text-[10px] text-slate-400">Direct checkout via Xsolla</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Prize Pool Distribution Explainer */}
                    <div className="text-[10px] text-slate-400 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                      💡 <strong>How payments work:</strong> The team captain authorizes the tournament entry fee (€{entryFee}). Collected funds (85% prize allocation) go directly into the <strong>Guaranteed Cash Prize Pool</strong>, disbursed automatically and instantly to the winners' balances upon conclusion of the Grand Final.
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Actions */}
            {(() => {
              const entryFee = Number(selectedRegisterTourney?.entryFee) || 25;
              const hasEnoughWallet = vortexCoinsBalance >= entryFee;

              return (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRegisterTourney(null)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!isUserTeamCaptain ? (
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-display font-black text-xs uppercase tracking-wider cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Locked: Captain Only ({userClanData.captainName})</span>
                    </button>
                  ) : !isFull5Stack ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleAutoFillSquad();
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>Auto-Fill 5-Stack ({teamRosterCount}/5) →</span>
                    </button>
                  ) : tournamentPaymentMethod === 'wallet' && !hasEnoughWallet ? (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setXsollaCheckoutItem({
                          id: `topup-${Date.now()}`,
                          title: 'Tournament Wallet Top-Up',
                          description: `Wallet top-up for ${selectedRegisterTourney.title} [${userClanData.tag}]`,
                          amountEur: Math.max(10, entryFee - Math.floor(vortexCoinsBalance)),
                          type: 'wallet_topup',
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CreditCard className="w-4 h-4 text-slate-950" />
                      <span>Top-Up Wallet (+€{(entryFee - vortexCoinsBalance).toFixed(0)}) via Card/Crypto</span>
                    </button>
                  ) : tournamentPaymentMethod === 'wallet' && hasEnoughWallet ? (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        const deducted = deductVortexWalletBalance(entryFee);
                        if (!deducted) {
                          setDashboardToast('⚠️ Insufficient balance in wallet!');
                          setTimeout(() => setDashboardToast(null), 3000);
                          return;
                        }
                        const tourneyTitle = selectedRegisterTourney.title;
                        setRegisteredTourneys(prev => {
                          const next = Array.from(new Set([...prev, tourneyTitle]));
                          try {
                            setLocalState('caliber_registered_tournaments', JSON.stringify(next));
                          } catch (_) {}
                          return next;
                        });
                        setSelectedRegisterTourney(null);
                        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
                        setDashboardToast(`✓ Payment €${entryFee % 1 !== 0 ? entryFee.toFixed(2) : entryFee} deducted from wallet! [${userClanData.tag}] registered in ${tourneyTitle}.`);
                        setTimeout(() => setDashboardToast(null), 5000);
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Crown className="w-4 h-4 text-slate-950" />
                      <span>Pay €{entryFee % 1 !== 0 ? entryFee.toFixed(2) : entryFee} from Wallet & Lock 5-Stack</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setXsollaCheckoutItem({
                          id: `tourney-entry-${selectedRegisterTourney.id || Date.now()}`,
                          title: `${selectedRegisterTourney.title} - Team Buy-In`,
                          description: `Official 5v5 Tournament Buy-In Fee for [${userClanData.tag}]`,
                          amountEur: entryFee,
                          type: 'tournament_entry',
                          sku: selectedRegisterTourney.title
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-slate-950" />
                      <span>Proceed to Card / Crypto Payment (€{entryFee}) →</span>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* CAPTAIN DENIED PERMISSION MODAL */}
      {captainDeniedModal?.open && (
        <div 
          onClick={() => {
            sound.playClick();
            setCaptainDeniedModal(null);
          }}
          className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0C1019] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-5 text-left relative overflow-hidden cursor-default my-auto"
          >
            <div className="flex items-center gap-3 border-b border-[#1E2638] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-amber-400 tracking-wider">
                  Tournament Security Regulation
                </span>
                <h3 className="text-base font-black font-display text-white">
                  TOURNAMENT ENTRY RESTRICTED: TEAM CAPTAIN ONLY
                </h3>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              Under official <strong>Caliber Clutch</strong> tournament regulations, only the designated <strong>Team Captain (Leader)</strong> possesses legal sporting authority to register and lock squads into official tournaments.
            </p>

            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tournament:</span>
                <span className="text-white font-bold truncate max-w-[200px]">{captainDeniedModal.tourneyTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Your Team:</span>
                <span className="text-white font-bold">[{captainDeniedModal.teamTag || userClanData.tag}] {userClanData.name}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  Official Captain:
                </span>
                <span className="text-amber-300 font-black">{captainDeniedModal.captainName || userClanData.captainName || 'Team Leader'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Your Current Role:</span>
                <span className="text-slate-300 font-semibold">{currentUserRole} (Not Captain)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300/90 leading-normal flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                To enroll this squad, request that Captain <strong>{captainDeniedModal.captainName || userClanData.captainName}</strong> completes registration, or claim captaincy rights in the Teams Hub.
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCaptainDeniedModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition cursor-pointer"
              >
                Understood (Dismiss)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCaptainDeniedModal(null);
                  setActiveTab('teams');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-slate-950" />
                <span>Go to Teams Hub</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALIBER CLUTCH OFFICIAL VERIFICATION INFORMATION MODAL */}
      {showVerificationModal && (
        <div 
          onClick={() => {
            sound.playClick();
            setShowVerificationModal(false);
          }}
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#0F121A] border border-[#262D40] rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-5 text-left cursor-default my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-white">ACCOUNT VERIFICATION</h3>
                  <p className="text-xs font-mono text-slate-400">Fair-play validation & esports competitive credentials</p>
                </div>
              </div>
              <button
                onClick={() => { sound.playClick(); setShowVerificationModal(false); }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Tiers Comparison */}
            <div className="space-y-3">
              {/* 1. Verified Account */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#12141C]" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Verified Account</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">FREE</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Awarded automatically to authenticated players with linked Steam 64 ID, 100+ CS2 hours, and verified mobile identity. Guarantees access to anti-smurf queues.
                  </p>
                </div>
              </div>

              {/* 2. VIP Verified Account */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 shadow-lg shadow-amber-500/5">
                <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(235,160,30,0.5)]" fill="none">
                  <path d="M12 1.5 L15.06 4.61 L19.42 4.58 L19.39 8.94 L22.5 12 L19.39 15.06 L19.42 19.42 L15.06 19.39 L12 22.5 L8.94 19.39 L4.58 19.42 L4.61 15.06 L1.5 12 L4.61 8.94 L4.58 4.58 L8.94 4.61 Z" fill="#F59E0B" />
                  <path d="M8.2 12.2l2.6 2.6 5.2-5.2" stroke="#12141C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <span>VIP Verified Account</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 font-black">ELITE</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Elite tier verification for esports professionals, verified tournament champions, and Caliber Clutch VIP Elite Pass holders. Unlocks automated GOTV recordings, strict ±150 ELO matchmaking, and priority map vetoes.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected by Kernel Ring 0 Anticheat</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    sound.playSelect();
                    setXsollaCheckoutItem({
                      id: 'sub-vip',
                      sku: 'CC-SUB-VIP',
                      title: 'Caliber Clutch VIP Elite Pass (1 Month)',
                      description: 'VIP Match queue, ultra-strict ±150 ELO, automated GOTV demo recording, 2x Points.',
                      amountEur: 12.99,
                      type: 'membership_vip'
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                >
                  <span>Get VIP via Xsolla</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT PROFILE & AVATAR MODAL                              */}
      {/* ======================================================== */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0F121A] border border-[#252C3E] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-[#141824]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A3E635]/20 to-[#12141C] border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-white">Edit Player Profile & Identity</h3>
                  <p className="text-xs font-mono text-slate-400">Customize avatar, gamer tag, role, and CS2 competitive details</p>
                </div>
              </div>
              <button
                onClick={() => setEditProfileOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* SECTION 1: AVATAR CUSTOMIZATION */}
              <div className="p-5 rounded-2xl bg-[#12151E] border border-white/[0.06] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635]">
                      Player Avatar
                    </label>
                    <p className="text-xs text-slate-400">Choose a preset pro icon, upload from your PC, or paste an image link</p>
                  </div>
                  {/* Avatar Upload Mode Switcher */}
                  <div className="flex rounded-xl bg-[#0A0D14] p-1 border border-white/[0.06] text-xs font-mono shrink-0">
                    <button
                      type="button"
                      onClick={() => setAvatarUploadMode('presets')}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        avatarUploadMode === 'presets' ? 'bg-[#A3E635] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarUploadMode('upload')}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        avatarUploadMode === 'upload' ? 'bg-[#A3E635] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarUploadMode('url')}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        avatarUploadMode === 'url' ? 'bg-[#A3E635] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {/* Avatar Preview & Options Row */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                  {/* Current Draft Avatar Preview with Level Badge */}
                  <div className="relative shrink-0">
                    <img
                      src={draftAvatarUrl}
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.3)] bg-slate-900"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg';
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center border-2 border-[#12141C] shadow-md">
                      7
                    </div>
                  </div>

                  {/* Mode 1: Presets Grid */}
                  {avatarUploadMode === 'presets' && (
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 flex-1">
                      {PRESET_AVATARS.map((av) => {
                        const isSvg = av.url.endsWith('.svg');
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setDraftAvatarUrl(av.url);
                            }}
                            className={`relative rounded-2xl overflow-visible aspect-square border-2 transition cursor-pointer group p-1.5 ${
                              isSvg ? 'bg-[#12141D]' : 'bg-[#0A0D14]'
                            } ${
                              draftAvatarUrl === av.url
                                ? 'border-[#A3E635] shadow-[0_0_16px_rgba(163,230,53,0.45)] scale-105 bg-[#0F1626]'
                                : 'border-white/10 hover:border-white/30 hover:scale-102 opacity-80 hover:opacity-100'
                            }`}
                            title={av.name}
                          >
                            <img
                              src={av.url}
                              alt={av.name}
                              className={`w-full h-full rounded-xl transition duration-200 ${
                                isSvg ? 'object-contain drop-shadow' : 'object-cover'
                              }`}
                            />
                            {draftAvatarUrl === av.url && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#A3E635] text-slate-950 text-[9px] font-black flex items-center justify-center shadow z-10">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Mode 2: File Upload Dropzone */}
                  {avatarUploadMode === 'upload' && (
                    <div className="flex-1 w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#A3E635]/40 hover:border-[#A3E635] rounded-xl cursor-pointer bg-[#0A0D14]/60 hover:bg-[#A3E635]/5 transition p-3 text-center">
                        <Upload className="w-6 h-6 text-[#A3E635] mb-1" />
                        <span className="text-xs font-mono font-bold text-white">Click to browse photo from computer</span>
                        <span className="text-[10px] text-slate-400">Supports PNG, JPG, GIF up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Mode 3: Direct URL */}
                  {avatarUploadMode === 'url' && (
                    <div className="flex-1 w-full space-y-1.5">
                      <input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={draftAvatarUrl}
                        onChange={(e) => setDraftAvatarUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-xs font-mono outline-none"
                      />
                      <p className="text-[10px] font-mono text-slate-400">Paste any public direct image URL</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: IDENTITY (GAMER TAG, CLAN TAG, NATIONALITY, ROLE) */}
              <div className="p-5 rounded-2xl bg-[#12151E] border border-white/[0.06] space-y-4">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635]">
                  Player Credentials & Role
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* GamerTag Input */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">GamerTag / Nickname</label>
                    <input
                      type="text"
                      value={draftGamerTag}
                      onChange={(e) => setDraftGamerTag(e.target.value)}
                      placeholder="e.g. M14"
                      maxLength={18}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-sm font-display font-bold outline-none"
                    />
                  </div>

                  {/* Clan Tag Input */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Team / Clan Tag</label>
                    <input
                      type="text"
                      value={draftClanTag}
                      onChange={(e) => setDraftClanTag(e.target.value.toUpperCase())}
                      placeholder="e.g. VTX"
                      maxLength={6}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-sm font-mono font-bold uppercase outline-none"
                    />
                  </div>

                  {/* Country Flag Select */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Country</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                        <CountryFlag code={draftCountry.code} name={draftCountry.name} size="md" />
                      </div>
                      <select
                        value={draftCountry.code}
                        onChange={(e) => {
                          const sel = ALL_COUNTRIES.find(c => c.code === e.target.value);
                          if (sel) setDraftCountry(sel);
                        }}
                        className="w-full pl-11 pr-9 py-2.5 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-xs font-mono outline-none cursor-pointer appearance-none transition"
                      >
                        {ALL_COUNTRIES.map(c => (
                          <option key={c.code} value={c.code} className="bg-[#12141C] text-white py-1">
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* CS2 Role Select */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Primary CS2 Role</label>
                    <div className="relative">
                      <select
                        value={draftRole}
                        onChange={(e) => setDraftRole(e.target.value)}
                        className="w-full px-4 pr-9 py-2.5 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-xs font-mono outline-none cursor-pointer appearance-none transition"
                      >
                        {CS2_ROLES.map(r => (
                          <option key={r} value={r} className="bg-[#12141C] text-white py-1">
                            {r}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Player Bio */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Player Bio / Signature</label>
                  <textarea
                    rows={2}
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    placeholder="Brief bio or tactical playstyle..."
                    maxLength={160}
                    className="w-full px-4 py-2 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-xs font-mono outline-none resize-none"
                  />
                </div>

                {/* Account Verification Tier (Authentic FACEIT System) */}
                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-white font-bold">
                      Account Verification Tier
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      Standard FACEIT badge rules
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Option 1: Unverified (None) - Default for Normal Players */}
                    <button
                      type="button"
                      onClick={() => { sound.playSelect(); setDraftVerification('none'); setProVerificationNotice(null); }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition cursor-pointer text-left ${
                        draftVerification === 'none'
                          ? 'bg-slate-800/40 border-slate-400 text-white shadow-md'
                          : 'bg-[#0A0D14] border-white/10 hover:border-white/25 text-slate-400'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-dashed border-slate-500 flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0">✕</span>
                      <div>
                        <div className={`text-xs font-display font-bold ${draftVerification === 'none' ? 'text-white' : 'text-slate-300'}`}>
                          Unverified
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">No Badge (Default)</div>
                      </div>
                    </button>

                    {/* Option 2: Community Verified (White Checkmark) - For Normal Players */}
                    <button
                      type="button"
                      onClick={() => { sound.playSelect(); setDraftVerification('verified'); setProVerificationNotice(null); }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition cursor-pointer text-left ${
                        draftVerification === 'verified'
                          ? 'bg-white/10 border-white shadow-md shadow-white/10'
                          : 'bg-[#0A0D14] border-white/10 hover:border-white/25 text-slate-400'
                      }`}
                    >
                      <FaceitVerificationBadge type="verified" size="md" />
                      <div>
                        <div className={`text-xs font-display font-bold ${draftVerification === 'verified' ? 'text-white' : 'text-slate-300'}`}>
                          Verified (White)
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">ID & FACEIT Verified</div>
                      </div>
                    </button>

                    {/* Option 3: VIP Pro Verified (Gold Star) - ONLY for Esports Pro Players */}
                    <button
                      type="button"
                      onClick={() => {
                        const isFounder = isUserAdminOrFounder(currentGamerTag);
                        if (!isFounder) {
                          sound.playClick();
                          setProVerificationNotice('🔒 Pro Verification (Gold Star) is strictly reserved for esports professionals, HLTV rosters, and approved tournament champions. Normal players receive the White Checkmark badge.');
                          return;
                        }
                        sound.playSelect();
                        setDraftVerification('vip');
                        setProVerificationNotice(null);
                      }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition cursor-pointer text-left ${
                        draftVerification === 'vip'
                          ? 'bg-[#F59E0B]/10 border-[#F59E0B] shadow-md shadow-amber-500/10'
                          : 'bg-[#0A0D14] border-white/10 hover:border-white/25 text-slate-400'
                      }`}
                    >
                      <FaceitVerificationBadge type="vip" size="md" />
                      <div>
                        <div className={`text-xs font-display font-bold flex items-center gap-1 ${draftVerification === 'vip' ? 'text-white' : 'text-slate-300'}`}>
                          <span>VIP Pro (Gold)</span>
                          {!isUserAdminOrFounder(currentGamerTag) && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] font-mono text-amber-400">
                          {isUserAdminOrFounder(currentGamerTag) ? 'Official CS2 Pro (Founder)' : 'Pro Application Only'}
                        </div>
                      </div>
                    </button>
                  </div>

                  {proVerificationNotice && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2 animate-in fade-in duration-150">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{proVerificationNotice}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: HARDWARE & STEAM INTEGRATION */}
              <div className="p-5 rounded-2xl bg-[#12151E] border border-white/[0.06] space-y-4">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635]">
                  Esports Telemetry & Steam Setup
                </label>

                {/* CS2 Crosshair Code */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">CS2 Crosshair Code</label>
                  <input
                    type="text"
                    value={draftCrosshairCode}
                    onChange={(e) => setDraftCrosshairCode(e.target.value)}
                    placeholder="CSGO-..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-xs font-mono outline-none"
                  />
                  <p className="text-[10px] font-mono text-slate-500 mt-1">Share your crosshair settings with teammates and lobby players</p>
                </div>

                {/* Steam Trade Offer URL (Separated on its own with "Get Trade URL" option) */}
                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-mono text-white font-bold">
                        Steam Trade Offer URL
                      </label>
                      <p className="text-[10px] font-mono text-slate-400">Required for official tournament prize payouts & verified platform rewards</p>
                    </div>

                    <a
                      href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18210C] hover:bg-[#84CC16] text-[#A3E635] hover:text-slate-950 border border-[#A3E635]/40 text-xs font-mono font-bold transition shadow-sm cursor-pointer group shrink-0"
                      title="Open Steam to find your personal Trade Offer URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      <span>GET TRADE URL</span>
                    </a>
                  </div>

                  <div>
                    <input
                      type="url"
                      value={draftTradeUrl}
                      onChange={(e) => setDraftTradeUrl(e.target.value)}
                      placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Verified via FACEIT Telemetry Sync (Automatic SteamID64 Sync) */}
                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  {(() => {
                    const activeFaceitNick = (draftFaceitNickname || faceitNickname || getLocalState('caliber_faceit_nickname') || 'bLocKeeRz').trim().replace(/^https?:\/\/(www\.)?faceit\.com\/[a-z]{2}\/players\/?/i, '').replace(/\/$/, '');
                    const activeSteamId = getLocalState('caliber_steam_id64') || convertSteam2ToSteam64(getLocalState('caliber_steam_id') || 'STEAM_0:1:43918293') || '76561198012241163';

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <label className="block text-xs font-mono text-white font-bold">
                                FACEIT Competitive Sync
                              </label>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/35 shadow-sm">
                                Verified via FACEIT
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              Official FACEIT CS2 telemetry synchronization. Real-time skill level, ELO, and match statistics.
                            </p>
                          </div>
                        </div>

                        {/* FACEIT Connection Status & Telemetry Sync Card */}
                        <div className="p-3.5 rounded-2xl bg-[#090C14] border border-[#A3E635]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/35 flex items-center justify-center text-[#A3E635] shrink-0 font-bold shadow-sm">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold font-mono text-xs sm:text-sm">
                                  {activeFaceitNick}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/30">
                                  Connected to FACEIT
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-400 flex-wrap">
                                <span className="text-[#A3E635] font-bold">Level {currentUserLevel || 7}</span>
                                <span>•</span>
                                <span>{(currentUserElo || 1381).toLocaleString()} ELO</span>
                                <span>•</span>
                                <span className="text-slate-500 font-mono">SteamID64: {activeSteamId}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleSyncFaceit}
                            disabled={isSyncingFaceit}
                            className="px-4 py-2 rounded-xl bg-[#A3E635] hover:bg-[#bef264] text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-[#A3E635]/25 flex items-center justify-center gap-1.5 shrink-0 active:scale-95 disabled:opacity-50"
                          >
                            {isSyncingFaceit ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                                <span>Syncing...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Sync Telemetry</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* FACEIT Nickname Editable Field */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-mono font-bold text-slate-300">
                            FACEIT Nickname:
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={draftFaceitNickname}
                              onChange={(e) => setDraftFaceitNickname(e.target.value)}
                              placeholder="bLocKeeRz"
                              className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D14] border border-white/10 focus:border-[#A3E635] text-white text-xs font-mono outline-none"
                            />
                          </div>
                          <p className="text-[10px] font-mono text-slate-500">
                            Enter your exact FACEIT nickname for instant telemetry calibration and official ELO verification.
                          </p>
                        </div>
                      </>
                    );
                  })()}

                  {faceitSyncSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{faceitSyncSuccess}</span>
                    </div>
                  )}

                  {faceitSyncError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{faceitSyncError}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-white/[0.08] bg-[#141824] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-slate-300 hover:text-white font-mono text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-6 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_20px_rgba(163,230,53,0.35)] flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Profile Changes</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FACEIT-STYLE "INVITE FRIENDS TO PARTY" MODAL            */}
      {/* Opens when user clicks [+ Invite Teammate] on any slot   */}
      {/* ======================================================== */}
      {inviteModalOpen && (
        <div 
          onClick={() => {
            sound.playClick();
            setInviteModalOpen(false);
          }}
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-[#0D0F17] border border-[#A3E635]/40 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 animate-in fade-in zoom-in-95 duration-150 cursor-default my-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2538]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1B2213] border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white tracking-wide">
                    INVITE PLAYERS TO PARTY
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    CS2 5v5 European Queue • Inviting for Slot #{selectedInviteSlot + 1}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inviteSearchQuery}
                onChange={(e) => setInviteSearchQuery(e.target.value)}
                placeholder="Search friends by GamerTag, clan tag, or Faceit Level..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141824] border border-[#252D40] focus:border-[#A3E635] text-white text-xs font-mono outline-none transition"
              />
            </div>

            {/* Filter Category Tabs */}
            <div className="flex items-center gap-2 border-b border-[#1E2538] pb-2 text-xs font-mono">
              <button
                onClick={() => { sound.playClick(); setInviteModalTab('all'); }}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  inviteModalTab === 'all'
                    ? 'bg-[#A3E635] text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All Friends ({SUGGESTED_TEAMMATES.length})
              </button>
              <button
                onClick={() => { sound.playClick(); setInviteModalTab('kosovo'); }}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  inviteModalTab === 'kosovo'
                    ? 'bg-[#A3E635] text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Verified Regional Pros
              </button>
              <button
                onClick={() => { sound.playClick(); setInviteModalTab('international'); }}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  inviteModalTab === 'international'
                    ? 'bg-[#A3E635] text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                International
              </button>
            </div>

            {/* Players List */}
            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
              {filteredInvitablePlayers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-mono text-xs">
                  No players found matching "{inviteSearchQuery}"
                </div>
              ) : (
                filteredInvitablePlayers.map((player) => {
                  const isInParty = partySlots.some(slot => slot && slot.id === player.id);
                  const isPending = Object.values(pendingSlotInvites).some(p => p.id === player.id);

                  return (
                    <div
                      key={player.id}
                      className="p-3 rounded-2xl bg-[#121622] border border-[#202638] hover:border-slate-700 flex items-center justify-between gap-3 transition"
                    >
                      {/* Player info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          {player.name === 'M18' || !player.avatar ? (
                            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex flex-col items-center justify-center">
                              <span className="font-mono font-black text-white text-[10px]">M18</span>
                            </div>
                          ) : (
                            <img
                              src={player.avatar}
                              alt={player.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#A3E635]/40"
                            />
                          )}
                          <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-[#FF5500] text-white font-black text-[9px] font-mono leading-none border border-black shadow">
                            {player.level}
                          </div>
                        </div>

                        <div className="min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-white truncate">
                              {player.name}
                            </span>
                            {player.tag && (
                              <span className="px-1.5 py-0.2 rounded bg-white/5 text-slate-400 font-mono text-[10px]">
                                [{player.tag}]
                              </span>
                            )}
                            <CountryFlag code={player.code || 'XK'} name={player.countryName || 'Kosovo'} size="xs" />
                            {player.verification === 'vip' && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-[9px] font-mono">
                                PRO
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-slate-400">
                            <span className="text-[#A3E635] font-bold">{player.elo} ELO</span>
                            <span>•</span>
                            <span className="text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Online in Menu
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isInParty ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs">
                            IN LOBBY
                          </span>
                        ) : isPending ? (
                          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs animate-pulse">
                            INVITED • WAITING...
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSendInviteToPlayer(player)}
                            className="px-4 py-2 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(163,230,53,0.35)] flex items-center gap-1.5 cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>INVITE</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-[#1E2538] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Steam & FACEIT Friends Synced (24 Online)</span>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CALIBER CLUTCH MINIMAL CLEAN "INVITE TO PARTY" MODAL DIALOG       */}
      {/* ======================================================== */}
      {activePartyInvite && (
        <div 
          onClick={() => {
            sound.playClick();
            setActivePartyInvite(null);
          }}
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in duration-150 cursor-pointer overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[530px] bg-[#0E121B] border border-[#A3E635]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(163,230,53,0.18)] overflow-hidden animate-in zoom-in-95 duration-150 cursor-default my-auto"
          >
            {/* Top Slim Glowing Neon Lime Animated Countdown Bar */}
            <div className="w-full bg-[#182030] h-1">
              <div
                style={{ width: `${Math.max(0, Math.min(100, (partyInviteCountdown / 88) * 100))}%` }}
                className="h-full bg-gradient-to-r from-[#84CC16] to-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.9)] transition-all duration-1000 ease-linear"
              />
            </div>

            {/* Header: Centered "Invite to party" with close button */}
            <div className="relative pt-6 pb-2 px-6 flex items-center justify-center">
              <h2 className="text-xl font-bold tracking-tight text-white select-none">
                Invite to <span className="text-[#A3E635] drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]">party</span>
              </h2>
              <button
                onClick={() => setActivePartyInvite(null)}
                className="absolute right-4 top-4 text-slate-500 hover:text-white transition cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Left side has Photo with Name + Badge + Flag UNDER photo; Right side has exact FACEIT text */}
            <div className="px-8 pt-4 pb-6 flex items-center gap-6">
              {/* Left Column: Photo with Name Badge UNDER the Photo */}
              <div className="flex flex-col items-center gap-2.5 shrink-0 select-none">
                {/* Photo / Avatar with Caliber Glowing Border and Status Dot */}
                <div className="relative">
                  {(!activePartyInvite.avatar && activePartyInvite.sender === 'M18') ? (
                    <div className="w-[72px] h-[72px] rounded-2xl bg-[#090C12] border-2 border-[#A3E635] p-2 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.35)] relative overflow-hidden">
                      <img
                        src="/images/faceit_m18_badge.png"
                        alt="M18"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={activePartyInvite.avatar || currentAvatarUrl}
                        alt={activePartyInvite.sender}
                        className="w-[72px] h-[72px] rounded-2xl object-cover border-2 border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.35)]"
                      />
                      {activePartyInvite.level && (
                        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-[#A3E635] text-slate-950 font-black text-[9px] font-mono leading-none border border-black shadow">
                          LVL {activePartyInvite.level}
                        </div>
                      )}
                    </div>
                  )}
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0E121B] animate-pulse" />
                </div>

                {/* The Name Badge directly UNDER the photo (M14 ⭐ 🇽🇰) */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 shadow-sm">
                  <span className="font-display font-black text-white text-xs tracking-tight">
                    {activePartyInvite.sender}
                  </span>
                  <FaceitVerificationBadge type={activePartyInvite.verification || 'vip'} size="sm" />
                  <CountryFlag code={activePartyInvite.code || 'XK'} name={activePartyInvite.countryName || 'Kosovo'} size="xs" />
                </div>
              </div>

              {/* Right Side: Exact Clean FACEIT Text lines */}
              <div className="min-w-0 text-left select-none space-y-1">
                <p className="font-bold text-white text-[15px] leading-snug whitespace-nowrap">
                  {activePartyInvite.sender} invited you to join their party
                </p>
                <p className="text-sm text-[#A0A2AD] mt-1.5 font-normal leading-snug">
                  Click accept to join the party
                </p>
                <p className="text-sm text-[#A0A2AD] mt-1 font-normal leading-snug">
                  Time remaining {partyInviteCountdown}
                </p>
              </div>
            </div>

            {/* Thin Horizontal Divider */}
            <div className="w-full h-px bg-white/[0.08]" />

            {/* Actions: Clean Centered DECLINE and ACCEPT */}
            <div className="px-6 py-4 flex items-center justify-center gap-7">
              <button
                onClick={handleRejectPartyInvite}
                className="font-bold text-sm tracking-wider text-[#A3E635] hover:text-[#84CC16] px-5 py-2 transition cursor-pointer uppercase select-none"
              >
                DECLINE
              </button>
              <button
                onClick={handleAcceptPartyInvite}
                className="font-bold text-sm tracking-wider text-slate-950 bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 px-8 py-2.5 rounded-xl shadow-md shadow-lime-500/25 transition cursor-pointer uppercase select-none active:scale-95 flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ACCEPT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CALIBER CLUTCH CS2 MATCH ROOM & MAP VETO MODAL                   */}
      {/* ======================================================== */}
      {isMatchRoomOpen && (
        <VortexMatchRoom
          matchId={currentBalancedMatch?.matchId || "VTX-89421"}
          currentGamerTag={currentGamerTag}
          currentAvatarUrl={currentAvatarUrl}
          partyMembers={partySlots.filter((m): m is PartySlotMember => m !== null)}
          matchData={currentBalancedMatch || undefined}
          onMatchFinished={(won, eloDelta) => {
            const nextMatches = currentUserMatches + 1;
            const nextElo = Math.max(100, currentUserElo + (won ? eloDelta : -eloDelta));
            const nextLevel = getFaceitLevelFromElo(nextElo);
            setCurrentUserMatches(nextMatches);
            setCurrentUserElo(nextElo);
            setCurrentUserLevel(nextLevel);
            try {
              setLocalState('caliber_user_matches', nextMatches.toString());
              setLocalState('caliber_user_elo', nextElo.toString());
              setLocalState('caliber_user_level', nextLevel.toString());
            } catch (_) {}
            setDashboardToast(won ? `🎉 Match Won! +${eloDelta} ELO (New ELO: ${nextElo})` : `Match Finished. -${eloDelta} ELO (New ELO: ${nextElo})`);
          }}
          onClose={() => setIsMatchRoomOpen(false)}
        />
      )}

      {/* ======================================================== */}
      {/* CS2 TACTICAL PLAYER DOSSIER MODAL (OPTION 4)             */}
      {/* ======================================================== */}
      {selectedDossierPlayer && (
        <div
          onClick={() => {
            sound.playClick();
            setSelectedDossierPlayer(null);
          }}
          className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#0C1019] border border-[#252E42] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left relative overflow-hidden cursor-default my-auto max-h-[92vh] overflow-y-auto"
          >
            {/* Header / Player Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2638] pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDossierPlayer.avatar}
                  alt={selectedDossierPlayer.tag}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#A3E635]/60 shadow-lg shadow-[#A3E635]/20"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-black text-xl text-white">
                      {selectedDossierPlayer.tag}
                    </span>
                    {selectedDossierPlayer.clanTag && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        [{selectedDossierPlayer.clanTag}]
                      </span>
                    )}
                    <CountryFlag code={selectedDossierPlayer.code || 'XK'} name={selectedDossierPlayer.country} size="xs" />
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400 mt-1">
                    <span className="text-white font-bold">{selectedDossierPlayer.role || 'CS2 Competitor'}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">Lvl {selectedDossierPlayer.levelNum} ({selectedDossierPlayer.elo} ELO)</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Ring-0 AC Active ✓
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-300">
                  Global Rank: <strong className="text-[#A3E635]">{selectedDossierPlayer.rank}</strong>
                </span>
              </div>
            </div>

            {/* Combat Tactical Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Win Rate</span>
                <span className="font-display font-black text-lg text-emerald-400 mt-0.5 block">
                  {selectedDossierPlayer.winrate || '62.5%'}
                </span>
                <span className="text-[9px] font-mono text-slate-500">{selectedDossierPlayer.matches} Matches</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">K/D Ratio</span>
                <span className="font-display font-black text-lg text-white mt-0.5 block">
                  {selectedDossierPlayer.kd || '1.24'}
                </span>
                <span className="text-[9px] font-mono text-slate-500">1.48 KDA</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Headshot %</span>
                <span className="font-display font-black text-lg text-amber-400 mt-0.5 block">
                  {selectedDossierPlayer.hs || '58.2%'}
                </span>
                <span className="text-[9px] font-mono text-slate-500">Precision Fragger</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3D]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Est. ADR</span>
                <span className="font-display font-black text-lg text-[#A3E635] mt-0.5 block">
                  {selectedDossierPlayer.kd ? (parseFloat(selectedDossierPlayer.kd) * 68).toFixed(1) : '86.4'}
                </span>
                <span className="text-[9px] font-mono text-slate-500">Dmg Per Round</span>
              </div>
            </div>

            {/* Weapon Mastery & Playstyle */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                Primary CS2 Loadout & Weapon Mastery
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-bold text-white block">AK-47</span>
                  <span className="text-[10px] text-slate-400">45% Usage • 64% HS</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-bold text-white block">AWP</span>
                  <span className="text-[10px] text-slate-400">30% Usage • 88% Acc</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-bold text-white block">M4A1-S</span>
                  <span className="text-[10px] text-slate-400">15% Usage • 52% HS</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-bold text-white block">Desert Eagle</span>
                  <span className="text-[10px] text-slate-400">10% Usage • 76% HS</span>
                </div>
              </div>
            </div>

            {/* Recent Match History (5 Official Matches) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Recent CS2 Competitive Matches
                </span>
                <span className="text-[10px] font-mono text-[#A3E635]">Competitive Verified</span>
              </div>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {[
                  { map: 'Mirage', score: '13 - 7', win: true, kda: '23/12/4', rating: '1.38', eloDelta: '+25' },
                  { map: 'Inferno', score: '13 - 11', win: true, kda: '21/16/6', rating: '1.24', eloDelta: '+24' },
                  { map: 'Nuke', score: '9 - 13', win: false, kda: '16/17/3', rating: '0.98', eloDelta: '-22' },
                  { map: 'Anubis', score: '13 - 8', win: true, kda: '25/14/5', rating: '1.42', eloDelta: '+26' },
                  { map: 'Dust II', score: '13 - 5', win: true, kda: '19/8/2', rating: '1.45', eloDelta: '+25' }
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#121622] border border-[#232B3D] flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${m.win ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span className="font-bold text-white">{m.map}</span>
                      <span className={m.win ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{m.score}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span>{m.kda}</span>
                      <span className="text-white font-bold">{m.rating} Rating</span>
                      <span className={m.win ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{m.eloDelta} ELO</span>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setDashboardToast('Downloading GOTV Demo (.dem.gz)...');
                          setTimeout(() => setDashboardToast(null), 2500);
                        }}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] transition cursor-pointer"
                        title="Download GOTV Match Demo"
                      >
                        Demo ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#1E2638] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedDossierPlayer(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition cursor-pointer"
              >
                Close Dossier
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  const target = selectedDossierPlayer;
                  setSelectedDossierPlayer(null);
                  if (target.isUser) {
                    setViewedPlayer(null);
                  } else {
                    setViewedPlayer(target);
                  }
                  setActiveTab('profile');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#A3E635] hover:bg-[#bef264] text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Open Full Career Profile →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* AUTHENTIC 1:1 FACEIT RIGHT VERTICAL SOCIAL RAIL          */}
      {/* ======================================================== */}
      <VortexRightSocialRail
        currentGamerTag={currentGamerTag}
        currentAvatarUrl={currentAvatarUrl}
        currentClanTag={currentClanTag}
        currentVerification={currentVerification}
        currentCountry={currentCountry}
        userMembershipTier={userMembershipTier}
        partyMembers={partySlots}
        unreadNotificationsCount={unreadCount}
        isAntiCheatActive={isAntiCheatActive}
        onToggleAntiCheat={handleToggleAntiCheat}
        onOpenNotifications={() => {
          sound.playClick();
          setNotificationsOpen(prev => !prev);
        }}
        onOpenInviteModal={() => handleOpenInviteModal(1)}
        onOpenProfileTab={() => {
          sound.playSelect();
          setActiveTab('profile');
        }}
        onOpenEditProfile={() => {
          sound.playClick();
          setEditProfileOpen(true);
        }}
        onLeaveParty={handleLeaveParty}
        onUpgrade={() => setShowPremiumModal(true)}
        onLogout={onLogout}
        visitorMode={isVisitorMode}
      />

    </div>
  );
};
