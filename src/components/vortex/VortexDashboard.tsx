import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Server, 
  Trophy, 
  Swords, 
  Crosshair, 
  Compass, 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  UserPlus,
  Home,
  Crown, 
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
  Play,
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
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { VortexBrandLogo } from './VortexLandingPage';
import { CountryFlag } from './CountryFlag';
import { ALL_COUNTRIES, getCountryByCode, Country } from '../../data/countries';
import { VortexPartyChat } from './VortexPartyChat';
import { VortexMatchRoom } from './VortexMatchRoom';

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
  | 'play'
  | 'servers' 
  | 'tournaments' 
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
  countryName?: string;
}

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

const FaceitVerificationBadge: React.FC<FaceitVerificationBadgeProps> = ({
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

      {/* FACEIT AUTHENTIC TOOLTIP */}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/vbadge:flex flex-col z-[100] pointer-events-none min-w-[210px] p-2.5 rounded-xl bg-[#181B22] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.9)] text-left backdrop-blur-md animate-in fade-in duration-150">
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

        <span className="my-1.5 border-t border-white/10 w-full block" />

        <span className="text-[10px] font-sans text-slate-300 leading-snug whitespace-nowrap">
          <span className="text-[#FF5500] font-bold">Learn more</span> about account verification
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
    tag: 'BNE',
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
    tag: 'BNE',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    level: 10,
    elo: 2690,
    verification: 'verified', // Standard ID Verified
    flag: '🇽🇰',
    code: 'XK',
    countryName: 'Kosovo'
  },
  {
    id: 'karrigan_fan',
    name: 'karrigan_fan',
    tag: 'FAZE',
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
    tag: 'BNE',
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
  { id: 'mirage', name: 'Mirage', code: 'de_mirage', image: '/images/maps/de_mirage.jpg' },
  { id: 'inferno', name: 'Inferno', code: 'de_inferno', image: '/images/maps/de_inferno.jpg' },
  { id: 'nuke', name: 'Nuke', code: 'de_nuke', image: '/images/maps/de_nuke.jpg' },
  { id: 'dust2', name: 'Dust II', code: 'de_dust2', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80' },
  { id: 'anubis', name: 'Anubis', code: 'de_anubis', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { id: 'ancient', name: 'Ancient', code: 'de_ancient', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
  { id: 'vertigo', name: 'Vertigo', code: 'de_vertigo', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' }
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
  { id: 'blockeerz', name: 'bLocKeeRz Official', url: '/images/blockeerz_avatar.png' },
  { id: 'cyber', name: 'Cyber Operator', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=250&q=80' },
  { id: 'stealth', name: 'Stealth Specialist', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { id: 'entry', name: 'Pro Entry Fragger', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80' },
  { id: 'sniper', name: 'Tactical Sniper', url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=250&q=80' },
  { id: 'neon', name: 'Neon Striker', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { id: 'sentinel', name: 'Vortex Sentinel', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { id: 'shadow', name: 'Shadow Infiltrator', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' }
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

export const VortexDashboard: React.FC<VortexDashboardProps> = ({
  userGamerTag = 'bLocKeeRz',
  avatarUrl = '/images/blockeerz_avatar.png',
  onNavigateTab,
  onLogout,
  initialOpenPremium = false
}) => {
  // Profile Customization State with localStorage persistence
  const [currentGamerTag, setCurrentGamerTag] = useState<string>(() => {
    return localStorage.getItem('vortex_user_gamertag') || userGamerTag;
  });
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('vortex_user_avatar') || avatarUrl;
  });
  const [currentClanTag, setCurrentClanTag] = useState<string>(() => {
    return localStorage.getItem('vortex_user_clantag') || 'VTX';
  });
  const [currentCountry, setCurrentCountry] = useState<{ code: string; name: string; flag: string }>(() => {
    const saved = localStorage.getItem('vortex_user_country');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { code: 'XK', name: 'Kosovo', flag: '🇽🇰' };
  });
  const [currentRole, setCurrentRole] = useState<string>(() => {
    return localStorage.getItem('vortex_user_role') || 'AWPer / Entry';
  });
  const [currentBio, setCurrentBio] = useState<string>(() => {
    return localStorage.getItem('vortex_user_bio') || 'Pushing ELO to Level 10. Smoke lineups on point.';
  });
  const [currentTradeUrl, setCurrentTradeUrl] = useState<string>(() => {
    return localStorage.getItem('vortex_user_tradeurl') || 'https://steamcommunity.com/tradeoffer/new/?partner=43918293';
  });
  const [currentCrosshairCode, setCurrentCrosshairCode] = useState<string>(() => {
    return localStorage.getItem('vortex_user_crosshair') || 'CSGO-4w29A-6yvKP-6k7kF-3xK2v-d9HkQ';
  });
  const [currentVerification, setCurrentVerification] = useState<VerificationType>(() => {
    const saved = localStorage.getItem('vortex_user_verification');
    return (saved === 'vip' || saved === 'verified' || saved === 'none') ? (saved as VerificationType) : 'vip';
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
    setProfileDropdownOpen(false);
    setEditProfileOpen(true);
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
    setCurrentVerification(draftVerification);

    localStorage.setItem('vortex_user_gamertag', draftGamerTag);
    localStorage.setItem('vortex_user_avatar', draftAvatarUrl);
    localStorage.setItem('vortex_user_clantag', draftClanTag);
    localStorage.setItem('vortex_user_country', JSON.stringify(draftCountry));
    localStorage.setItem('vortex_user_role', draftRole);
    localStorage.setItem('vortex_user_bio', draftBio);
    localStorage.setItem('vortex_user_tradeurl', draftTradeUrl);
    localStorage.setItem('vortex_user_crosshair', draftCrosshairCode);
    localStorage.setItem('vortex_user_verification', draftVerification);

    setPartySlots(prev => {
      const next = [...prev];
      if (next[2]) {
        next[2] = {
          ...next[2],
          name: draftGamerTag.trim() || currentGamerTag,
          avatar: draftAvatarUrl,
          tag: draftClanTag.trim(),
          verification: draftVerification,
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
  // Dashboard is #1 and Play is #2 in order
  const [activeTab, setActiveTab] = useState<VortexTab>('dashboard');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(initialOpenPremium);

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
      type: 'match',
      title: '5v5 Match Ready Check',
      subtitle: 'Ranked 5v5 on de_mirage (128-tick EU Frankfurt). 9/10 players confirmed.',
      time: 'Just now',
      read: false,
      actionStatus: 'pending',
      data: { map: 'de_mirage', server: '185.122.54.12:27015' },
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
      title: 'VORTEX CS2 Global Open ($25,000)',
      subtitle: 'Bracket check-in opens in 1h 45m. Make sure all 5 players have Anti-Cheat active.',
      time: '42m ago',
      read: false,
      data: { tournamentId: 'vortex-global-open' },
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
      subtitle: 'Congratulations bLocKeeRz! You crossed the 1,850 ELO threshold on the European ladder.',
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
    setDashboardToast('✓ Match Confirmed! IP copied: connect 185.122.54.12:27015');
    if (navigator.clipboard) {
      navigator.clipboard.writeText('connect 185.122.54.12:27015; password vortex').catch(() => {});
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
    sound.playJoinScrim();
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: 'match' as const,
      title: '5v5 Match Ready Check (New)',
      subtitle: 'Ranked 5v5 on de_inferno (128-tick EU Vienna). Accept within 20s.',
      time: 'Just now',
      read: false,
      actionStatus: 'pending' as const,
      data: { map: 'de_inferno', server: '194.156.98.5:27015' }
    };
    setNotifications(prev => [newNotif, ...prev]);
    setDashboardToast('⚡ Incoming Match Ready alert!');
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

    setDashboardToast(`✓ Ftesa iu dërgua ${player.name} — Duke shfaqur pamjen e ${player.name}`);
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
    setDashboardToast('Ftesa u anulua');
  };

  // Party Leader Index (Default to center slot 2: bLocKeeRz) & Match Room modal
  const [partyLeaderIndex, setPartyLeaderIndex] = useState<number>(2);
  const [isMatchRoomOpen, setIsMatchRoomOpen] = useState<boolean>(false);

  const handlePromoteToLeader = (slotIndex: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playCrownPromote();
    setPartyLeaderIndex(slotIndex);
    const member = partySlots[slotIndex];
    if (member) {
      setDashboardToast(`👑 ${member.name} u emërua Lider i Party-t!`);
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
      setDashboardToast(`✕ ${member.name} u largua nga party`);
    }
  };

  const handleLeaveParty = () => {
    sound.playClick();
    setPartySlots(prev => {
      const copy = [null, null, prev[2], null, null];
      return copy;
    });
    setPartyLeaderIndex(2);
    setDashboardToast('Ju dolët nga party');
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
  } | null>({
    id: 'invite-m18',
    sender: 'M18',
    avatar: '',
    level: 10,
    code: 'XK',
    countryName: 'Kosovo',
    verification: 'vip',
    targetSlotIdx: 0,
    isOutgoingSimulation: false,
  });

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

      setDashboardToast(`✓ ${joinedName} pranoi ftesën dhe u fut në party!`);
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
        ? (activePartyInvite.invitedPlayerName || 'Lojtari')
        : activePartyInvite.sender;

      setDashboardToast(`Ftesa për ${declinedName} u refuzua`);
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
    const saved = localStorage.getItem('vortex_anticheat_active');
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
    localStorage.setItem('vortex_anticheat_active', 'true');
    setDashboardToast('Launching Anti-Cheat client & activating Ring-0 driver...');
    setTimeout(() => setDashboardToast(null), 3500);
  };

  const handleToggleAntiCheat = () => {
    sound.playClick();
    setIsAntiCheatActive(prev => {
      const next = !prev;
      localStorage.setItem('vortex_anticheat_active', String(next));
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
  const [rankingRegion, setRankingRegion] = useState<'all' | 'XK' | 'AL' | 'lvl10'>('all');
  const [viewedPlayer, setViewedPlayer] = useState<PlatformRankingPlayer | null>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const platformRankingPlayers: PlatformRankingPlayer[] = [
    {
      rank: '#1',
      rankNum: 1,
      tag: 'juanflatroo',
      clanTag: 'GUILD',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80',
      country: 'Kosovo',
      flag: '🇽🇰',
      code: 'XK',
      level: 'Level 10',
      levelNum: 10,
      elo: 3890,
      matches: 428,
      winrate: '69.4%',
      kd: '1.48',
      hs: '74.2%',
      verification: 'vip',
      isUser: false,
      bio: 'Professional CS2 Player for GUILD / Bad News Eagles. Aggressive entry fragger and space creator on Mirage & Inferno.',
      role: 'Entry Fragger / Pro',
      crosshairCode: 'CSGO-fl4tr-00BNE-xK999-ENTRY',
      steamId: 'STEAM_0:1:19823411',
      sens: '800 DPI • 1.25 Sens • 1280x960 4:3',
      bestMap: 'Mirage',
      bestMapWin: 76
    },
    {
      rank: '#2',
      rankNum: 2,
      tag: 'gxx-',
      clanTag: 'BNE',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      country: 'Kosovo',
      flag: '🇽🇰',
      code: 'XK',
      level: 'Level 10',
      levelNum: 10,
      elo: 3420,
      matches: 382,
      winrate: '64.2%',
      kd: '1.35',
      hs: '51.8%',
      verification: 'verified',
      isUser: false,
      bio: 'Main AWPer for Bad News Eagles. Locking down long angles and shutting down bombsite rushes.',
      role: 'Sniper / Main AWP',
      crosshairCode: 'CSGO-gxx99-AWP01-SNIPR-BNE88',
      steamId: 'STEAM_0:0:98237412',
      sens: '400 DPI • 2.10 Sens • Zoom 1.0 • 1920x1080',
      bestMap: 'Inferno',
      bestMapWin: 71
    },
    {
      rank: '#3',
      rankNum: 3,
      tag: currentGamerTag,
      clanTag: currentClanTag,
      avatar: currentAvatarUrl,
      country: currentCountry.name,
      flag: currentCountry.flag,
      code: currentCountry.code,
      level: 'Level 7',
      levelNum: 7,
      elo: 1407,
      matches: 214,
      winrate: '58.9%',
      kd: '1.28',
      hs: '64.2%',
      verification: currentVerification,
      isUser: true,
      bio: currentBio,
      role: currentRole,
      crosshairCode: currentCrosshairCode,
      steamId: 'STEAM_0:1:43918293',
      sens: '800 DPI • 1.15 Sens • 1280x960 4:3 Stretched',
      bestMap: 'Mirage',
      bestMapWin: 64
    },
    {
      rank: '#4',
      rankNum: 4,
      tag: 'SENER1',
      clanTag: 'BNE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      country: 'Kosovo',
      flag: '🇽🇰',
      code: 'XK',
      level: 'Level 9',
      levelNum: 9,
      elo: 1980,
      matches: 310,
      winrate: '57.1%',
      kd: '1.22',
      hs: '61.0%',
      verification: 'verified',
      isUser: false,
      bio: 'Support rifler & anchor. Master of set utility smokes and clutch rounds.',
      role: 'Support / Anchor',
      crosshairCode: 'CSGO-SENER-1BNE0-SMOKE-99UTL',
      steamId: 'STEAM_0:1:55418290',
      sens: '800 DPI • 1.10 Sens • 1280x960 4:3',
      bestMap: 'Nuke',
      bestMapWin: 63
    },
    {
      rank: '#5',
      rankNum: 5,
      tag: 'shroud_al',
      clanTag: 'ALB',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      country: 'Albania',
      flag: '🇦🇱',
      code: 'AL',
      level: 'Level 8',
      levelNum: 8,
      elo: 1750,
      matches: 195,
      winrate: '55.4%',
      kd: '1.18',
      hs: '58.5%',
      verification: 'none',
      isUser: false,
      bio: 'Tirana competitive grinder. High headshot percentage and crisp pistol rounds.',
      role: 'Rifler / Lurker',
      crosshairCode: 'CSGO-SHRUD-AL001-TIRAN-CS288',
      steamId: 'STEAM_0:0:33419082',
      sens: '400 DPI • 2.00 Sens • 1920x1080',
      bestMap: 'Ancient',
      bestMapWin: 59
    },
    {
      rank: '#6',
      rankNum: 6,
      tag: 'redline_cs',
      clanTag: 'RED',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
      country: 'Kosovo',
      flag: '🇽🇰',
      code: 'XK',
      level: 'Level 8',
      levelNum: 8,
      elo: 1690,
      matches: 182,
      winrate: '54.0%',
      kd: '1.15',
      hs: '56.2%',
      verification: 'none',
      isUser: false,
      bio: 'Prishtina tactical CS2 player. AK-47 first bullet precision specialist.',
      role: 'Second Entry',
      crosshairCode: 'CSGO-REDLN-99CS2-PRISH-TINA1',
      steamId: 'STEAM_0:1:78129034',
      sens: '800 DPI • 1.05 Sens • 1280x960',
      bestMap: 'Mirage',
      bestMapWin: 57
    },
    {
      rank: '#7',
      rankNum: 7,
      tag: 'eagle_xk',
      clanTag: 'KOS',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      country: 'Kosovo',
      flag: '🇽🇰',
      code: 'XK',
      level: 'Level 7',
      levelNum: 7,
      elo: 1430,
      matches: 160,
      winrate: '52.8%',
      kd: '1.11',
      hs: '53.0%',
      verification: 'none',
      isUser: false,
      bio: 'Competitive 5v5 Faceit ladder climber.',
      role: 'Rifler',
      crosshairCode: 'CSGO-EAGLE-XK007-FACE-IT128',
      steamId: 'STEAM_0:0:67182903',
      sens: '800 DPI • 1.18 Sens • 1280x960',
      bestMap: 'Dust II',
      bestMapWin: 55
    },
    {
      rank: '#8',
      rankNum: 8,
      tag: 'tirana_beast',
      clanTag: 'ALB',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      country: 'Albania',
      flag: '🇦🇱',
      code: 'AL',
      level: 'Level 6',
      levelNum: 6,
      elo: 1290,
      matches: 142,
      winrate: '50.5%',
      kd: '1.05',
      hs: '49.8%',
      verification: 'none',
      isUser: false,
      bio: 'Albanian CS2 community warrior. Aggressive push style.',
      role: 'Entry / Rifler',
      crosshairCode: 'CSGO-BEAST-TIR99-ALB01-CSGO9',
      steamId: 'STEAM_0:1:89230129',
      sens: '1000 DPI • 1.00 Sens • 1920x1080',
      bestMap: 'Inferno',
      bestMapWin: 52
    },
    {
      rank: '#9',
      rankNum: 9,
      tag: 'vortex_striker',
      clanTag: 'GER',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80',
      country: 'Germany',
      flag: '🇩🇪',
      code: 'DE',
      level: 'Level 6',
      levelNum: 6,
      elo: 1210,
      matches: 128,
      winrate: '49.8%',
      kd: '1.02',
      hs: '48.2%',
      verification: 'none',
      isUser: false,
      bio: 'Frankfurt low-ping grinder. Dedicated team player.',
      role: 'IGL / Support',
      crosshairCode: 'CSGO-STRKR-GER09-FRNKF-128TK',
      steamId: 'STEAM_0:0:44192038',
      sens: '800 DPI • 1.20 Sens • 1920x1080',
      bestMap: 'Overpass',
      bestMapWin: 51
    },
    {
      rank: '#10',
      rankNum: 10,
      tag: 'bl1tz_kd',
      clanTag: 'BNE',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      country: 'Kosovo',
      flag: '🇽🇰',
      code: 'XK',
      level: 'Level 5',
      levelNum: 5,
      elo: 1150,
      matches: 98,
      winrate: '48.5%',
      kd: '0.98',
      hs: '47.0%',
      verification: 'none',
      isUser: false,
      bio: 'Young gun improving fast. Aim practice daily.',
      role: 'Rifler',
      crosshairCode: 'CSGO-BL1TZ-KOS05-AIM99-ROOKI',
      steamId: 'STEAM_0:1:99120348',
      sens: '400 DPI • 2.20 Sens • 1280x960',
      bestMap: 'Mirage',
      bestMapWin: 50
    }
  ];

  const handleViewPlayerProfile = (p: PlatformRankingPlayer) => {
    sound.playSelect();
    if (p.isUser) {
      setViewedPlayer(null);
    } else {
      setViewedPlayer(p);
    }
    setActiveTab('profile');
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
      level: 7,
      elo: 1407,
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
  const [matchFoundModal, setMatchFoundModal] = useState(false);
  const [acceptedPlayers, setAcceptedPlayers] = useState(3);
  const [userHasAccepted, setUserHasAccepted] = useState(false);
  const [matchReadyCountdown, setMatchReadyCountdown] = useState(10);
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
        level: 7,
        elo: 1407,
        isLeader: true,
        verification: currentVerification,
        flag: currentCountry.flag,
        code: currentCountry.code,
        countryName: currentCountry.name
      };
      return next;
    });
  }, [currentGamerTag, currentClanTag, currentAvatarUrl, currentVerification, currentCountry]);

  // Queue Interval Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isQueuing) {
      interval = setInterval(() => {
        setQueueSeconds(prev => {
          const next = prev + 1;
          if (next >= 4) {
            triggerMatchFound();
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQueuing]);

  // Match Ready Countdown Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (matchFoundModal) {
      timer = setInterval(() => {
        setMatchReadyCountdown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [matchFoundModal]);

  const triggerMatchFound = () => {
    setIsQueuing(false);
    setMatchFoundModal(true);
    setAcceptedPlayers(4);
    setUserHasAccepted(false);
    setMatchReadyCountdown(10);
    setActivePickedMap(selectedMaps.length > 0 ? selectedMaps[0].toUpperCase() : 'MIRAGE');
    sound.playNotification();

    // Increment accepted players progressively
    let accepted = 4;
    const acceptInterval = setInterval(() => {
      accepted += 2;
      if (accepted >= 9) {
        setAcceptedPlayers(9);
        clearInterval(acceptInterval);
      } else {
        setAcceptedPlayers(accepted);
      }
    }, 450);
  };

  const handleUserAcceptMatch = () => {
    sound.playClick();
    setUserHasAccepted(true);
    setAcceptedPlayers(10);
    sound.playTournamentVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
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
  };

  const underDevInfo: Record<string, { title: string; subtitle: string; desc: string; progress: number; icon: React.ComponentType<{ className?: string }> }> = {
    tournaments: {
      title: 'VORTEX CS2 Tournaments',
      subtitle: 'Official Tournament Circuit & Cash Prizes',
      desc: 'Automated bracket progression, live GOTV spectator relays, and instant prize pool distribution are undergoing final security verification.',
      progress: 82,
      icon: Trophy
    },
    scrims: {
      title: 'Scrims Hub (5v5 Practice)',
      subtitle: 'Team Scrimmage & Matchmaking Arena',
      desc: 'Instant 5v5 team practice matchmaking with automated server reservations, captain vetoes, and tactical demo recording is being optimized.',
      progress: 90,
      icon: Swords
    },
    aim: {
      title: '1v1 Aim Arena',
      subtitle: 'Duels & Primary Weapon Ladders',
      desc: 'High-tickrate 1v1 duel arenas featuring AK-47, AWP, and Desert Eagle ladders with real-time reaction telemetry and Aim Rating.',
      progress: 85,
      icon: Crosshair
    },
    lineups: {
      title: 'CS2 Grenade Lineups 2D Radar',
      subtitle: 'Interactive Utility & Trajectory Playbook',
      desc: 'Comprehensive 2D interactive radar with verified pro lineups for smokes, flashbangs, and molotovs across all official competitive maps.',
      progress: 78,
      icon: Compass
    },
    rankings: {
      title: 'Global Rankings & Hall of Fame',
      subtitle: 'Worldwide ELO Competitive Ladder',
      desc: 'Global ELO leaderboard tracking competitive rankings across Europe, Americas, and Asia-Pacific with verified pro tiers and division brackets.',
      progress: 92,
      icon: Award
    },
    anticheat: {
      title: 'VORTEX Kernel Anti-Cheat',
      subtitle: 'Ring-0 Hardware Driver Protection',
      desc: 'Kernel-level anti-cheat driver with Secure Boot and TPM 2.0 integrity verification ensuring 100% fair matchmaking for all competitive modes.',
      progress: 95,
      icon: ShieldCheck
    },
    profile: {
      title: 'Player Profile & Digital Passport',
      subtitle: 'Career Analytics & Achievements',
      desc: 'Enhanced player career passport featuring match history, weapon mastery analytics, badges, and team management is getting final touches.',
      progress: 86,
      icon: User
    }
  };

  const navItems = [
    {
      id: 'play' as VortexTab,
      label: 'Play',
      desc: 'Ranked 128-tick matchmaking',
      icon: Play,
      badge: isQueuing ? 'QUEUING' : 'ACTIVE',
      badgeColor: isQueuing
        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
        : 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30'
    },
    {
      id: 'rankings' as VortexTab,
      label: 'Rank',
      desc: 'Platform Player Leaderboard',
      icon: BarChart2,
      badge: 'TOP PLAYERS',
      badgeColor: 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 font-bold'
    },
    {
      id: 'tournaments' as VortexTab,
      label: 'Tournaments',
      desc: 'Under Development • Opening Soon',
      icon: Trophy,
      badge: 'COMING SOON',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
    },
    {
      id: 'scrims' as VortexTab,
      label: 'Scrims Hub',
      desc: 'Under Development • Opening Soon',
      icon: Swords,
      badge: 'COMING SOON',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
    },
    {
      id: 'aim' as VortexTab,
      label: '1v1 Aim Arena',
      desc: 'Under Development • Opening Soon',
      icon: Crosshair,
      badge: 'COMING SOON',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
    },
    {
      id: 'lineups' as VortexTab,
      label: 'CS2 Lineups',
      desc: 'Under Development • Opening Soon',
      icon: Compass,
      badge: 'COMING SOON',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
    },
    {
      id: 'anticheat' as VortexTab,
      label: 'Anti-Cheat',
      desc: 'Under Development • Opening Soon',
      icon: ShieldCheck,
      badge: 'COMING SOON',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
    },
    {
      id: 'profile' as VortexTab,
      label: 'Player Profile',
      desc: 'Digital Passport & Settings',
      icon: User,
      badge: 'VERIFIED',
      badgeColor: 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 font-bold'
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-[#F1F5F9] font-sans flex flex-col justify-start items-center selection:bg-lime-500/30 selection:text-white">
      
      {/* ======================================================== */}
      {/* UNIFIED PERSISTENT LAYOUT (SIDEBAR + MAIN CONTENT AREA)  */}
      {/* ======================================================== */}
      <div className="w-full max-w-[1780px] mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 min-h-[92vh]">
        
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
                  onClick={() => { sound.playClick(); setActiveTab('dashboard'); }}
                  className="flex items-center gap-3 cursor-pointer group transition hover:scale-105"
                  title="VORTEX Dashboard"
                >
                  <VortexBrandLogo />
                </div>
              ) : (
                <div 
                  onClick={() => { sound.playClick(); setActiveTab('dashboard'); }}
                  className="cursor-pointer transition hover:scale-110"
                  title="VORTEX Dashboard"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#18210C] to-[#12141C] border border-[#A3E635]/50 flex items-center justify-center text-[#A3E635] font-black font-display text-xs shadow-[0_0_15px_rgba(163,230,53,0.25)]">
                    VTX
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
                      { tag: 'bLocKeeRz', level: 'Level 7', elo: '1,407 ELO', code: 'XK', action: () => { setActiveTab('profile'); setSidebarSearchOpen(false); } },
                      { tag: 'juanflatroo', level: 'Level 10', elo: '3,890 ELO', code: 'XK', action: () => { setActiveTab('rankings'); setSidebarSearchOpen(false); } },
                      { tag: 'gxx-', level: 'Level 10', elo: '3,420 ELO', code: 'XK', action: () => { setActiveTab('rankings'); setSidebarSearchOpen(false); } },
                      { tag: 'Play 5v5 Queue', level: '128-Tick', elo: 'Matchmaking', icon: '🎮', action: () => { setActiveTab('play'); setSidebarSearchOpen(false); } },
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

          {/* Go Premium Card */}
          {!sidebarCollapsed ? (
            <button
              onClick={() => { sound.playTournamentVictory(); setShowPremiumModal(true); }}
              className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#1C160B] to-[#12141C] border border-amber-500/40 hover:border-amber-400 text-left transition cursor-pointer group shadow-lg"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-display font-black mb-1">
                <Crown className="w-4 h-4" />
                <span>{userMembershipTier === 'vip' ? 'VIP Elite Active' : userMembershipTier === 'premium' ? 'Upgrade to VIP' : 'Go Premium'}</span>
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                {userMembershipTier === 'vip' ? 'All Pro 128-tick queues unlocked' : userMembershipTier === 'premium' ? 'Unlock €25k Pro Tournaments' : 'Unlock Super Match 5v5 & VODs'}
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

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Notification Bell with Dynamic Unread Counter */}
              <button
                id="vortex-notifications-bell-btn"
                onClick={() => {
                  try { sound.playClick(); } catch {}
                  setNotificationsOpen(prev => !prev);
                }}
                className="p-1.5 text-lime-400 hover:text-lime-300 transition cursor-pointer relative"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-[#A3E635] hover:brightness-125 transition drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] pointer-events-none" />
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#A3E635] text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(163,230,53,0.95)] font-mono leading-none pointer-events-none">
                    {unreadCount}
                  </span>
                ) : (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-slate-600 pointer-events-none" />
                )}
              </button>

              {/* User Profile (Avatar + GamerTag + Chevron as in Photo 2) */}
              <div className="relative">
                <button
                  onClick={() => { sound.playClick(); setProfileDropdownOpen(!profileDropdownOpen); }}
                  className="flex items-center gap-2.5 py-1 px-1.5 rounded-xl hover:bg-white/[0.05] transition cursor-pointer group"
                >
                  <img
                    src={currentAvatarUrl}
                    alt={currentGamerTag}
                    className="w-8 h-8 rounded-full object-cover border border-[#A3E635]/60 group-hover:border-[#A3E635] transition shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/blockeerz_avatar.png';
                    }}
                  />
                  <span className="font-display font-bold text-sm text-white group-hover:text-[#A3E635] transition flex items-center gap-1.5">
                    <span>{currentGamerTag}</span>
                    <FaceitVerificationBadge type={currentVerification} size="sm" />
                    <CountryFlag code={currentCountry.code} name={currentCountry.name} size="xs" />
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-[#A3E635]' : ''}`} />
                </button>

                {/* AUTHENTIC PRO ESPORTS PROFILE CARD POPOVER */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-3 w-80 sm:w-84 max-w-[calc(100vw-2rem)] rounded-3xl bg-[#12141C] border border-[#252B3B] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 z-50 animate-in fade-in zoom-in-95 space-y-4 text-center">
                      
                      {/* Close Icon Button */}
                      <button
                        onClick={() => setProfileDropdownOpen(false)}
                        className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Large Avatar with Glowing Ring, Level 7 Badge (Click to View Profile) */}
                      <div className="relative inline-block mx-auto mt-1 group">
                        <button 
                          onClick={() => {
                            sound.playSelect();
                            setProfileDropdownOpen(false);
                            setActiveTab('profile');
                          }}
                          title="Click to view player profile"
                          className="relative cursor-pointer block rounded-full"
                        >
                          <img
                            src={currentAvatarUrl}
                            alt={currentGamerTag}
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.35)] group-hover:scale-105 group-hover:border-[#FF5500] transition duration-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/blockeerz_avatar.png';
                            }}
                          />
                          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#12141C]" />
                        </button>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-black font-black text-xs flex items-center justify-center border-2 border-[#12141C] shadow-md pointer-events-none">
                          7
                        </div>
                      </div>

                      {/* Clean GamerTag - Clickable to View Profile */}
                      <div>
                        <button
                          onClick={() => {
                            sound.playSelect();
                            setProfileDropdownOpen(false);
                            setActiveTab('profile');
                          }}
                          className="group/name inline-flex items-center justify-center gap-2 font-display font-black text-white text-base hover:text-[#A3E635] transition cursor-pointer"
                          title="Click to view player profile"
                        >
                          <span className="text-[#A3E635] text-xs font-mono font-bold group-hover/name:brightness-125">[{currentClanTag}]</span>
                          <span className="group-hover/name:underline underline-offset-4 decoration-[#A3E635]">{currentGamerTag}</span>
                          <FaceitVerificationBadge type={currentVerification} size="md" />
                          <CountryFlag code={currentCountry.code} name={currentCountry.name} size="sm" />
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover/name:text-[#A3E635] group-hover/name:translate-x-0.5 transition-all" />
                        </button>
                      </div>

                      {/* Membership Tier & Upgrade CTA */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#181D2A] to-purple-500/10 border border-amber-500/30 flex items-center justify-between text-left">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            userMembershipTier === 'vip'
                              ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
                              : userMembershipTier === 'premium'
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                              : 'bg-white/10 border border-white/20 text-slate-300'
                          }`}>
                            <Crown className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-display font-black text-white">
                              {userMembershipTier === 'vip' ? 'VIP ELITE MEMBER' : userMembershipTier === 'premium' ? 'PREMIUM MEMBER' : 'FREE MEMBER'}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {userMembershipTier === 'vip' ? 'All Pro Queues Unlocked' : userMembershipTier === 'premium' ? 'Super Match Unlocked' : 'Unlock Priority & VIP Ladders'}
                            </div>
                          </div>
                        </div>
                        {userMembershipTier !== 'vip' && (
                          <button
                            onClick={() => {
                              sound.playTournamentVictory();
                              setProfileDropdownOpen(false);
                              setShowPremiumModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-display font-black text-[10px] uppercase tracking-wider transition cursor-pointer shadow-md"
                          >
                            {userMembershipTier === 'premium' ? 'GO VIP' : 'UPGRADE'}
                          </button>
                        )}
                      </div>

                      {/* Quick Profile Actions */}
                      <div className="space-y-1.5 text-left pt-1">
                        {/* EDIT PROFILE & AVATAR ACTION BUTTON */}
                        <button
                          onClick={handleOpenEditProfile}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono font-bold text-white bg-gradient-to-r from-[#A3E635]/15 via-[#1E2C10] to-[#12141C] hover:from-[#A3E635]/25 hover:via-[#263714] border border-[#A3E635]/40 rounded-xl transition cursor-pointer shadow-sm group"
                        >
                          <div className="flex items-center gap-2 text-[#A3E635]">
                            <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span>Edit Profile & Avatar</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#A3E635] uppercase font-bold tracking-wider">EDIT →</span>
                        </button>

                        <button
                          onClick={() => {
                            sound.playSelect();
                            setProfileDropdownOpen(false);
                            setActiveTab('profile');
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-sky-400" />
                            <span>View Full Profile</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </button>

                        <button
                          onClick={() => {
                            sound.playClick();
                            navigator.clipboard.writeText('STEAM_0:1:43918293');
                            setDashboardToast('SteamID copied: STEAM_0:1:43918293');
                            setTimeout(() => setDashboardToast(null), 3000);
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Copy className="w-4 h-4 text-slate-400" />
                            <span>Copy SteamID</span>
                          </div>
                          <span className="text-[10px] text-slate-500">STEAM_0:1:4391...</span>
                        </button>

                        {onLogout && (
                          <button
                            onClick={() => {
                              sound.playClick();
                              setProfileDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition cursor-pointer border-t border-white/[0.04] mt-2 pt-2"
                          >
                            <div className="flex items-center gap-2">
                              <LogOut className="w-4 h-4 text-rose-400" />
                              <span>Log Out</span>
                            </div>
                            <span className="text-[10px] text-rose-400/70">Disconnect session</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ========================================================================= */}
          {/* TAB: "PLAY" -> THE COMPLETE MATCHMAKING HUB AS SHOWN IN THE PHOTO!       */}
          {/* ========================================================================= */}
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
                  
                  {/* User Level 7 Badge & ELO Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 w-full">
                    {/* Yellow Faceit Level 7 Circular Badge */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-[3.5px] shadow-lg shadow-amber-500/25 shrink-0">
                      <div className="w-full h-full rounded-full bg-[#12141C] flex items-center justify-center border border-amber-300/40">
                        <span className="text-2xl sm:text-3xl font-black font-display text-white tracking-tighter">7</span>
                      </div>
                    </div>

                    {/* ELO Details & Progression Line */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1A1D27] text-slate-300 text-xs font-mono border border-white/5">
                          Season 9
                        </span>
                        <span className="text-xl sm:text-2xl font-black font-display text-white tracking-tight flex items-center gap-2">
                          1,407
                          <TrendingUp className="w-4 h-4 text-slate-400 inline" />
                          <ChevronDown className="w-4 h-4 text-red-500 inline" />
                        </span>
                        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono font-bold text-slate-300">
                          <span>#91</span>
                          <CountryFlag code={currentCountry.code} name={currentCountry.name} size="xs" />
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>

                      {/* ELO Progress Bar: 1,351 to 1,530 */}
                      <div className="space-y-1">
                        <div className="w-full h-2 rounded-full bg-[#1A1D27] overflow-hidden p-[1px]">
                          <div 
                            className="h-full bg-gradient-to-r from-[#FF5500] to-amber-500 rounded-full" 
                            style={{ width: '31%' }} 
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>1,351</span>
                          <span className="text-slate-300 font-bold">+124 to Level 8</span>
                          <span>1,530</span>
                        </div>
                      </div>

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
                        sound.playSelect();
                        setIsMatchRoomOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-[#A3E635]/15 hover:bg-[#A3E635]/25 border border-[#A3E635]/40 text-[#A3E635] hover:text-white font-bold transition flex items-center gap-2 shadow-sm hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] cursor-pointer"
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
                            className={`h-56 rounded-2xl border flex flex-col items-center justify-between p-4 transition-all relative group ${
                              isLeader
                                ? 'bg-gradient-to-b from-[#181D2A] to-[#11141D] border-[#FF5500]/60 shadow-lg shadow-[#FF5500]/15'
                                : 'bg-[#12141C] border-[#252B3B] hover:border-[#A3E635]/40'
                            }`}
                          >
                            {/* Member Top Row */}
                            <div className="w-full flex items-center justify-between text-[10px] font-mono">
                              {isLeader ? (
                                <span className="px-2 py-0.5 rounded bg-[#FF5500]/15 text-[#FF5500] font-bold border border-[#FF5500]/30 flex items-center gap-1">
                                  <Crown className="w-3 h-3 fill-[#FF5500]" />
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
                                    title="Bëje Lider (Promote to Leader)"
                                  >
                                    <Crown className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {!isCurrentUser ? (
                                  <button
                                    onClick={(e) => handleKickMember(idx, e)}
                                    className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                    title="Largo nga grupi (Kick)"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  partySlots.filter(Boolean).length > 1 && (
                                    <button
                                      onClick={handleLeaveParty}
                                      className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                      title="Dil nga grupi (Leave Party)"
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
                                  <div className="w-16 h-16 rounded-full bg-black border-2 border-[#FF5500] flex flex-col items-center justify-center p-1 shadow-md">
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
                                        ? 'border-[#FF5500] shadow-[#FF5500]/25' 
                                        : 'border-[#A3E635]/60'
                                    }`}
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#12141C]" />
                              </div>

                              <div>
                                <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5 font-display">
                                  <span>{member.name}</span>
                                  <FaceitVerificationBadge 
                                    type={member.verification || (isCenterLeader ? currentVerification : 'none')} 
                                    size="sm" 
                                  />
                                  <CountryFlag 
                                    code={member.code || (isCenterLeader ? currentCountry.code : 'XK')} 
                                    name={member.countryName || (isCenterLeader ? currentCountry.name : 'Kosovo')} 
                                    size="xs" 
                                  />
                                </div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#151922] border border-white/10 shadow-inner mt-1">
                                  <div className="w-4 h-4 rounded-full relative flex items-center justify-center">
                                    <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
                                      <path className="text-white/10" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                      <path 
                                        className={member.level >= 10 ? 'text-[#FF5500]' : member.level >= 7 ? 'text-amber-500' : 'text-[#A3E635]'} 
                                        strokeDasharray="68, 100" 
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
                            title="Kliko për të hapur dritaren e testimit të ftesës FACEIT"
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
                                title="Anulo ftesën"
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
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#1A130D] border border-[#FF5500]/60 text-xs font-mono shadow-lg shadow-orange-500/10">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] animate-ping" />
                        <span className="text-white font-bold tracking-wider">SEARCHING FOR OPPONENTS...</span>
                        <span className="text-amber-400 font-bold font-mono">00:0{queueSeconds}</span>
                      </div>
                      <button
                        onClick={() => { sound.playClick(); setIsQueuing(false); }}
                        className="px-5 py-3.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-mono font-bold cursor-pointer transition shadow-md"
                      >
                        CANCEL
                      </button>
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
                          ? 'text-white border-b-2 border-[#FF5500]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Crosshair className="w-3.5 h-3.5 text-[#FF5500]" />
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
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#FF5500] text-black font-black uppercase">
                        ACTIVE DUTY
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => { sound.playClick(); setPlaySubTab('servers'); }}
                    className={`relative pb-3 font-bold transition flex items-center gap-2 cursor-pointer ${
                      playSubTab === 'servers'
                        ? 'text-white border-b-2 border-[#FF5500]'
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
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">All party sizes</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Star className="w-3.5 h-3.5 text-[#A3E635] fill-[#A3E635] shrink-0" />
                            <span className="truncate">Verified Matching</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <TrendingUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">No Elo restrictions</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Star className="w-3.5 h-3.5 text-[#A3E635] fill-[#A3E635] shrink-0" />
                            <span className="truncate">Veteran Matching</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Wifi className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">128-Tick Standard</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">Anti-Cheat Active</span>
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
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Solo, duo, trio</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                            <span className="truncate">Verified Matching</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">±250 Elo range</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                            <span className="truncate">Veteran Matching</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Captain Map Pick</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Zero Smurfs Match</span>
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
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Crosshair className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate">Solo or duo only</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate">Verified required ⭐</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <TrendingUp className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate">Strict ±150 Elo</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate">Automated GOTV VODs</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            <span className="truncate">2x Vortex Points</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-slate-300">
                            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">High stakes cash</span>
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                      {AVAILABLE_MAP_POOL.map((map) => {
                        const isSelected = selectedMaps.includes(map.id);
                        return (
                          <button
                            key={map.id}
                            onClick={() => handleToggleMap(map.id)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer text-xs font-mono font-bold ${
                              isSelected
                                ? 'bg-[#18210C] text-[#A3E635] border-[#A3E635]/60 shadow-md'
                                : 'bg-[#151924] text-slate-500 border-white/5 hover:border-white/20'
                            }`}
                          >
                            <span className="text-sm">{isSelected ? '✓' : '+'}</span>
                            <span>{map.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{map.code}</span>
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
                              <div className="text-[10px] font-mono text-emerald-400 font-semibold mt-0.5">
                                {srv.ping}
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
                      title={isAntiCheatActive ? "Anti-Cheat is ACTIVE (Click to toggle & test warning pill)" : "Anti-Cheat is STOPPED (Click to launch)"}
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

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: "DASHBOARD" -> DEDICATED TO OTHER THINGS: CAREER, DEMOS, NEWS, ETC. */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">

              {/* 1. HERO PLATFORM BANNER & ESPORTS COMMAND HUB */}
              <div className="w-full bg-[#0E1017] border border-[#202536] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Top Badge & Platform Title */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#182012] text-[#A3E635] border border-[#A3E635]/40 flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                          SEASON 9 ACTIVE • EUROPE
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/[0.04] text-slate-300 border border-white/10">
                          128-TICK DIRECT SYNC
                        </span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight">
                        VORTEX GAMING PLATFORM
                      </h1>
                      <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                        The elite competitive CS2 infrastructure. Queue for ranked 5v5 matches, join verified tournament circuits, and climb the official platform leaderboard.
                      </p>
                    </div>

                    {/* Live Players Online Widget */}
                    <div className="p-4 rounded-2xl bg-[#12141C] border border-[#232938] flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>PLAYERS ONLINE</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-white">14,820</div>
                      <div className="text-[10px] font-mono text-[#A3E635] font-bold">2,140 Matches Live</div>
                    </div>
                  </div>

                  {/* 3 Quick Jump Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <button
                      onClick={() => {
                        sound.playSelect();
                        setActiveTab('play');
                      }}
                      className="p-4 rounded-2xl bg-[#12141C] hover:bg-[#181D2A] border border-[#232938] hover:border-[#FF5500]/60 transition group cursor-pointer text-left space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-[#FF5500]">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF5500] group-hover:translate-x-1 transition-all" />
                      </div>
                      <div>
                        <div className="text-base font-bold font-display text-white group-hover:text-[#FF5500] transition">
                          Play (5v5 Queue)
                        </div>
                        <p className="text-xs font-mono text-slate-400">Ranked European competitive matchmaking</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playSelect();
                        setActiveTab('rankings');
                      }}
                      className="p-4 rounded-2xl bg-[#12141C] hover:bg-[#181D2A] border border-[#232938] hover:border-[#A3E635]/60 transition group cursor-pointer text-left space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-[#A3E635]">
                          <BarChart2 className="w-5 h-5" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#A3E635] group-hover:translate-x-1 transition-all" />
                      </div>
                      <div>
                        <div className="text-base font-bold font-display text-white group-hover:text-[#A3E635] transition">
                          Platform Leaderboard
                        </div>
                        <p className="text-xs font-mono text-slate-400">Top players, regional standings & ELO</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playSelect();
                        setActiveTab('tournaments');
                      }}
                      className="p-4 rounded-2xl bg-[#12141C] hover:bg-[#181D2A] border border-[#232938] hover:border-amber-500/60 transition group cursor-pointer text-left space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div>
                        <div className="text-base font-bold font-display text-white group-hover:text-amber-400 transition">
                          CS2 Tournaments
                        </div>
                        <p className="text-xs font-mono text-slate-400">Automated brackets & cash prize pools</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIM MINIMALIST PLATFORM STATUS STRIP */}
              <div className="w-full px-5 py-3 rounded-2xl bg-[#0E1017] border border-[#202536] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>EU Competitive: <strong className="text-white">Operational</strong></span>
                  </span>
                  <span className="hidden sm:inline-block text-white/10">|</span>
                  <span className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Kernel AC: <strong className="text-emerald-400 font-bold">100% Enforced</strong></span>
                  </span>
                  <span className="hidden md:inline-block text-white/10">|</span>
                  <span className="hidden md:flex items-center gap-2 text-slate-300">
                    <Activity className="w-4 h-4 text-[#A3E635]" />
                    <span>128-Tick: <strong className="text-[#A3E635]">0.4ms Jitter • 0% Loss</strong></span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Wifi className="w-3.5 h-3.5 text-sky-400" />
                  <span>Frankfurt & Vienna: <strong className="text-sky-400 font-bold">14ms</strong></span>
                </div>
              </div>

              {/* FEATURED PLATFORM TOURNAMENTS & COMPETITIVE CIRCUIT */}
              <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.06] gap-2">
                  <div>
                    <h3 className="text-lg font-black font-display text-white">Featured Platform Tournaments & Prize Pools</h3>
                    <p className="text-xs text-[#94A3B8]">Official European CS2 single & double elimination brackets with automated FACEIT anti-cheat</p>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('tournaments');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#141722] hover:bg-[#84CC16]/20 border border-[#A3E635]/40 text-[#A3E635] text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>View All Tournaments →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'VORTEX CS2 Global Open',
                      prize: '$25,000',
                      status: 'REGISTRATION OPEN',
                      badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
                      slots: '14 / 16 Teams',
                      start: 'Starts in 2d 14h'
                    },
                    {
                      title: 'VORTEX Major Championship 2026',
                      prize: '€10,000',
                      status: 'IN PROGRESS',
                      badgeColor: 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30',
                      slots: '32 / 32 Teams',
                      start: 'Live Matches on GOTV'
                    },
                    {
                      title: 'Balkan Open CS2 Cup',
                      prize: '€5,000',
                      status: 'REGISTRATION OPEN',
                      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
                      slots: '8 / 16 Teams',
                      start: 'Starts Saturday 20:00'
                    }
                  ].map((tourney, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#12141C] border border-[#232938] hover:border-[#A3E635]/40 transition space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${tourney.badgeColor}`}>
                          {tourney.status}
                        </span>
                        <span className="text-base font-black font-mono text-[#A3E635]">{tourney.prize}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold font-display text-white">{tourney.title}</h4>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{tourney.start} • {tourney.slots}</p>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setActiveTab('tournaments');
                        }}
                        className="w-full py-2 rounded-xl bg-[#141722] hover:bg-[#84CC16] hover:text-slate-950 border border-white/10 hover:border-[#A3E635] text-xs font-mono font-bold text-slate-300 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>View Bracket</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. COMMUNITY ANNOUNCEMENTS & GLOBAL ESPORTS NEWS */}
              <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-lg font-black font-display text-white">Community & Global Esports News</h3>
                    <p className="text-xs text-[#94A3B8]">Official updates from the VORTEX Competitive Circuit</p>
                  </div>
                  <Newspaper className="w-4 h-4 text-[#A3E635]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#12141C] border border-[#232938] space-y-2">
                    <span className="text-[10px] font-mono text-[#A3E635] font-bold">GLOBAL ANNOUNCEMENT</span>
                    <h4 className="text-sm font-bold text-white font-display">VORTEX CS2 Global Open Championship</h4>
                    <p className="text-xs text-slate-400">$25,000 international cash prize pool tournament open to verified teams worldwide.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#12141C] border border-[#232938] space-y-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">ANTI-CHEAT UPDATE</span>
                    <h4 className="text-sm font-bold text-white font-display">Kernel Anti-Cheat v2.9 Global Rollout</h4>
                    <p className="text-xs text-slate-400">Mandatory ring-0 handshake update ensures 100% fair matchmaking across all global servers.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#12141C] border border-[#232938] space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">NETWORK UPGRADE</span>
                    <h4 className="text-sm font-bold text-white font-display">Global Sub-Tick Edge Network Live</h4>
                    <p className="text-xs text-slate-400">Direct low-latency fiber routing deployed across Frankfurt, Stockholm, London, and New York.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: TOURNAMENTS                                         */}
          {/* ======================================================== */}
          {activeTab === 'tournaments' && (
            <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                <div>
                  <h2 className="text-2xl font-black font-display text-white">VORTEX CS2 TOURNAMENT CIRCUIT</h2>
                  <p className="text-xs text-[#94A3B8]">Automated bracket matchmaking and instant prize distributions</p>
                </div>
                <button
                  onClick={() => setActiveTab('play')}
                  className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
                >
                  ← Back to Play
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { title: 'VORTEX Major Championship 2026', prize: '€10,000', teams: '32 / 32', date: 'LIVE NOW', status: 'IN PROGRESS', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
                  { title: 'VORTEX CS2 Balkan Open Cup', prize: '€5,000', teams: '16 / 16', date: 'Starts in: 2d 14h', status: 'OPEN', badge: 'bg-lime-500/15 text-lime-400 border-lime-500/30' },
                  { title: 'IEM Katowice 2026 Community Qualifier', prize: '€7,500', teams: '48 / 64', date: 'Starts in: 5d 08h', status: 'REGISTRATION', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
                  { title: 'VORTEX Weekly 128-Tick Scrimfest', prize: '€2,500', teams: '12 / 16', date: 'Starts Saturday', status: 'REGISTER', badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
                ].map((t, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-[#12141C] border border-[#23293B] hover:border-[#A3E635] transition flex flex-col justify-between gap-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${t.badge}`}>{t.status}</span>
                        <h3 className="text-xl font-black font-display text-white mt-3">{t.title}</h3>
                        <p className="text-xs font-mono text-[#94A3B8] mt-1">{t.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black font-mono text-[#A3E635]">{t.prize}</div>
                        <div className="text-[10px] text-[#94A3B8] uppercase">Prize Pool</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#1C2233]">
                      <span className="text-xs font-mono text-slate-300">Slots: {t.teams}</span>
                      <button
                        onClick={() => sound.playTournamentVictory()}
                        className="px-5 py-2.5 rounded-full bg-[#84CC16] hover:bg-[#A3E635] text-white font-display font-black text-xs uppercase transition shadow-md cursor-pointer"
                      >
                        Register Team
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: RANKINGS (PLATFORM PLAYER LEADERBOARD - RANK #3)    */}
          {/* ======================================================== */}
          {activeTab === 'rankings' && (() => {
            const filteredPlayers = platformRankingPlayers.filter(p => {
              if (rankingRegion === 'XK' && p.code !== 'XK') return false;
              if (rankingRegion === 'AL' && p.code !== 'AL') return false;
              if (rankingRegion === 'lvl10' && p.levelNum !== 10) return false;
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
                        SEASON 1 LIVE
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Official competitive leaderboard of registered players on our platform • Rank #3: <strong className="text-white">{currentGamerTag}</strong> (Click any player to view full profile)
                    </p>
                  </div>
                  <button
                    onClick={() => { sound.playClick(); setActiveTab('play'); }}
                    className="px-4 py-2 rounded-xl bg-[#141722] hover:bg-[#1C2130] border border-[#252C3D] hover:border-[#A3E635]/40 text-xs font-mono text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-2"
                  >
                    <span>← Back to Play</span>
                  </button>
                </div>

                {/* TOP 3 PODIUM CARDS (CLICKABLE PROFILES) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* #1 Card - Gold (juanflatroo) */}
                  <div 
                    onClick={() => handleViewPlayerProfile(platformRankingPlayers[0])}
                    className="p-5 rounded-2xl bg-gradient-to-b from-[#1C1708] to-[#12141C] border border-amber-500/40 hover:border-amber-400 shadow-lg relative overflow-hidden cursor-pointer group transition hover:scale-[1.01]"
                    title="Click to view juanflatroo's profile"
                  >
                    <div className="absolute top-2 right-2 text-2xl">🥇</div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">RANK #1 • PLATFORM LEADER</div>
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80"
                        alt="juanflatroo"
                        className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 group-hover:border-amber-400 transition"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-black text-white text-base group-hover:text-amber-400 group-hover:underline transition">juanflatroo</span>
                          <FaceitVerificationBadge type="vip" size="sm" />
                          <CountryFlag code="XK" name="Kosovo" size="xs" />
                        </div>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                          <CountryFlag code="XK" name="Kosovo" size="xs" />
                          <span>Kosovo</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold">Level 10</span>
                      <span className="text-white font-bold">3,890 ELO</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                        View Profile →
                      </span>
                    </div>
                  </div>

                  {/* #2 Card - Silver (gxx-) */}
                  <div 
                    onClick={() => handleViewPlayerProfile(platformRankingPlayers[1])}
                    className="p-5 rounded-2xl bg-gradient-to-b from-[#171922] to-[#12141C] border border-slate-400/30 hover:border-slate-300 shadow-lg relative overflow-hidden cursor-pointer group transition hover:scale-[1.01]"
                    title="Click to view gxx-'s profile"
                  >
                    <div className="absolute top-2 right-2 text-2xl">🥈</div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">RANK #2 • PLATFORM ELITE</div>
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80"
                        alt="gxx-"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-400/30 group-hover:border-slate-300 transition"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-black text-white text-base group-hover:text-slate-200 group-hover:underline transition">gxx-</span>
                          <FaceitVerificationBadge type="verified" size="sm" />
                          <CountryFlag code="XK" name="Kosovo" size="xs" />
                        </div>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                          <CountryFlag code="XK" name="Kosovo" size="xs" />
                          <span>Kosovo</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold">Level 10</span>
                      <span className="text-white font-bold">3,420 ELO</span>
                      <span className="text-slate-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                        View Profile →
                      </span>
                    </div>
                  </div>

                  {/* #3 Card - Bronze / Current User (bLocKeeRz) */}
                  <div 
                    onClick={() => handleViewPlayerProfile(platformRankingPlayers[2])}
                    className="p-5 rounded-2xl bg-gradient-to-b from-[#18210C] via-[#141B0E] to-[#12141C] border-2 border-[#A3E635] shadow-[0_0_25px_rgba(163,230,53,0.25)] relative overflow-hidden cursor-pointer group transition hover:scale-[1.01]"
                    title="Click to view your own profile"
                  >
                    <div className="absolute top-2 right-2 text-2xl">🥉</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A3E635]">RANK #3 • YOUR STANDING</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#A3E635] text-slate-950 font-black">YOU</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={currentAvatarUrl}
                        alt={currentGamerTag}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-[#A3E635]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-black text-white text-base group-hover:text-[#A3E635] group-hover:underline transition">{currentGamerTag}</span>
                          <FaceitVerificationBadge type={currentVerification} size="sm" />
                          <CountryFlag code={currentCountry.code} name={currentCountry.name} size="xs" />
                        </div>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                          <CountryFlag code={currentCountry.code} name={currentCountry.name} size="xs" />
                          <span>{currentCountry.name}</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                      <span className="text-lime-400 font-bold">Level 7</span>
                      <span className="text-[#A3E635] font-black">1,407 ELO</span>
                      <span className="text-[#A3E635] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                        My Profile →
                      </span>
                    </div>
                  </div>
                </div>

                {/* SEARCH & REGION FILTERS */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRankingRegion('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        rankingRegion === 'all'
                          ? 'bg-[#A3E635] text-slate-950 shadow-md'
                          : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
                      }`}
                    >
                      All Platform Players
                    </button>
                    <button
                      onClick={() => setRankingRegion('XK')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        rankingRegion === 'XK'
                          ? 'bg-[#A3E635] text-slate-950 shadow-md'
                          : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
                      }`}
                    >
                      <CountryFlag code="XK" name="Kosovo" size="xs" />
                      <span>Kosovo</span>
                    </button>
                    <button
                      onClick={() => setRankingRegion('AL')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        rankingRegion === 'AL'
                          ? 'bg-[#A3E635] text-slate-950 shadow-md'
                          : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
                      }`}
                    >
                      <CountryFlag code="AL" name="Albania" size="xs" />
                      <span>Albania</span>
                    </button>
                    <button
                      onClick={() => setRankingRegion('lvl10')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        rankingRegion === 'lvl10'
                          ? 'bg-[#A3E635] text-slate-950 shadow-md'
                          : 'bg-[#141722] text-slate-400 hover:text-white border border-[#232938]'
                      }`}
                    >
                      Level 10 Masters
                    </button>
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
                  <h2 className="text-2xl font-black font-display text-white">VORTEX Kernel Anti-Cheat Protection</h2>
                  <p className="text-xs text-[#94A3B8]">Ring-0 hardware enforcement and driver integrity monitor</p>
                </div>
                <button
                  onClick={() => setActiveTab('play')}
                  className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
                >
                  ← Back to Play
                </button>
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
                        ? 'vortex_kernel_ac.sys verified and running at Ring-0.' 
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
                    {isAntiCheatActive ? 'Stop Driver (Test Inactive)' : 'Launch Anti-Cheat Now'}
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
            const displayBio = viewedPlayer ? (viewedPlayer.bio || 'Competitive CS2 player on VORTEX gaming platform.') : currentBio;
            const displayRole = viewedPlayer ? (viewedPlayer.role || 'CS2 Competitor') : currentRole;
            const displayElo = viewedPlayer ? viewedPlayer.elo : 1407;
            const displayLevelNum = viewedPlayer ? viewedPlayer.levelNum : 7;
            const displayRank = viewedPlayer ? `${viewedPlayer.rank} Global` : '#91 Global';
            const displayWinrate = viewedPlayer ? viewedPlayer.winrate : '58.9%';
            const displayKd = viewedPlayer ? viewedPlayer.kd : '1.38';
            const displayHs = viewedPlayer ? (viewedPlayer.hs || '64.2%') : '64.2%';
            const displayMatches = viewedPlayer ? viewedPlayer.matches : 2480;
            const displaySteamId = viewedPlayer ? (viewedPlayer.steamId || 'STEAM_0:1:88291039') : 'STEAM_0:1:43918293';
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
                            (e.target as HTMLImageElement).src = '/images/blockeerz_avatar.png';
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
                          <span className="text-white font-bold">{displayElo.toLocaleString()} ELO</span>
                          <span>•</span>
                          <span className="text-[#A3E635] font-bold">{displayRank}</span>
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

                  {/* ELO Progress Meter */}
                  <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                        <span className="text-slate-400">Current Standing: <strong className="text-white">{displayElo.toLocaleString()} ELO</strong> (Level {displayLevelNum})</span>
                      </div>
                      <span className="text-amber-400 font-bold">
                        {displayLevelNum === 10 ? 'MAX LEVEL 10 • PLATFORM TITAN' : `+123 ELO to Level ${displayLevelNum + 1}`}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1A1D27] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FF5500] via-amber-500 to-[#A3E635] rounded-full" 
                        style={{ width: displayLevelNum === 10 ? '100%' : '31%' }} 
                      />
                    </div>
                  </div>
                </div>

                {/* 4 VITALS METRICS CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Win Rate</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white">{displayWinrate}</div>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">+2.4% this season</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>K/D Ratio</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-[#A3E635]">{displayKd}</div>
                    <div className="text-[10px] font-mono text-slate-400">1.42 Impact Rating</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      <span>Headshot %</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-amber-400">{displayHs}</div>
                    <div className="text-[10px] font-mono text-slate-400">AK-47 Precision</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0E1017] border border-[#202536] space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-400" />
                      <span>Matches Total</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white">{displayMatches.toLocaleString()}</div>
                    <div className="text-[10px] font-mono text-[#A3E635] font-bold">Competitive 5v5</div>
                  </div>
                </div>

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
                        <p className="text-xs text-slate-400">Telemetry across official 128-tick ranked pool</p>
                      </div>
                      <span className="text-xs font-mono text-[#A3E635]">Season 9</span>
                    </div>

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
                  </div>

                </div>

                {/* WEAPON MASTERY & PERFORMANCE ACCURACY */}
                <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-lg font-black font-display text-white">Weapon Mastery & Accuracy</h3>
                      <p className="text-xs text-[#94A3B8]">Telemetry synchronized with CS2 competitive servers</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">Season 9 Data</span>
                  </div>

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
                </div>

                {/* AUTHENTIC FACEIT-STYLE RECENT MATCHES TABLE (IN PROFILE TAB) */}
                <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-xl font-bold font-sans text-white tracking-tight">Recent matches</h3>
                      <p className="text-xs text-[#94A3B8]">Verified 128-tick ranked competitive match history & GOTV replays</p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setDashboardToast('Full 5v5 competitive match history archive synced (420 matches)');
                        setTimeout(() => setDashboardToast(null), 3000);
                      }}
                      className="text-xs font-sans text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer group font-medium"
                    >
                      <span>Full match history</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

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
                </div>

              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* TAB: SCRIMS / AIM / LINEUPS ARENA                        */}
          {/* ======================================================== */}
          {(activeTab === 'scrims' || activeTab === 'aim' || activeTab === 'lineups') && (
            <div className="bg-[#0E1017] border border-[#202536] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                <div>
                  <h2 className="text-2xl font-black font-display text-white capitalize">{activeTab} Arena</h2>
                  <p className="text-xs text-[#94A3B8]">Automated 128-tick matchmaking lobby</p>
                </div>
                <button
                  onClick={() => setActiveTab('play')}
                  className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
                >
                  ← Back to Play
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-[#12141C] border border-[#23293B] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-lime-500/10 border border-[#A3E635]/30 flex items-center justify-center mx-auto text-[#A3E635]">
                  <Swords className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Live Matchmaking Queue Open</h3>
                <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                  Searching for balanced 128-tick CS2 lobbies based on your verified Level 7 ELO (1,407).
                </p>

                {!isAntiCheatActive && showAcPrompt && (
                  <div className="pt-2 flex justify-center animate-in fade-in zoom-in-95 duration-200">
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

                <div className="pt-4">
                  <button
                    onClick={() => handleConnectServer('194.163.159.231:27015', 'Quick Scrim Arena')}
                    className="px-8 py-3 rounded-full bg-[#A3E635] hover:bg-[#BEF264] text-black font-black font-display text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(163,230,53,0.4)] cursor-pointer"
                  >
                    Connect to Server Now
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MATCH READY FOUND POPUP MODAL                            */}
      {/* ======================================================== */}
      {matchFoundModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0F121A] border-2 border-[#A3E635] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18210C] border border-[#A3E635]/50 text-[#A3E635] text-xs font-mono font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                MATCH READY
              </div>
              <h3 className="text-2xl font-black font-display text-white">5v5 COMPETITIVE MATCH</h3>
              <p className="text-xs font-mono text-slate-400">
                Map: <span className="text-white font-bold">{activePickedMap}</span> • Server: <span className="text-white font-bold">Frankfurt 128-tick</span>
              </p>
            </div>

            {/* Players Acceptance Counter */}
            <div className="p-4 rounded-2xl bg-[#141722] border border-[#232938] text-center space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Players Accepted:</span>
                <span className="text-[#A3E635] font-bold text-sm">{acceptedPlayers} / 10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#84CC16] to-[#A3E635] transition-all duration-300 rounded-full"
                  style={{ width: `${(acceptedPlayers / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions: Accept or Direct Connect */}
            <div className="space-y-3">
              {!userHasAccepted ? (
                <button
                  onClick={handleUserAcceptMatch}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_25px_rgba(163,230,53,0.5)] cursor-pointer"
                >
                  ACCEPT MATCH
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-center font-mono text-xs font-bold">
                    ✓ MATCH ACCEPTED! ALL 10 PLAYERS READY
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleCopyIp(activeServerIp)}
                      className="flex-1 py-3 rounded-xl bg-[#141722] hover:bg-[#1A1F2E] border border-white/10 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedIp ? 'COPIED TO CLIPBOARD!' : 'COPY CONNECT IP'}</span>
                    </button>
                    <button
                      onClick={() => handleConnectServer(activeServerIp, `5v5 Match [${activePickedMap}]`)}
                      className="flex-1 py-3 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-white font-display font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>CONNECT VIA STEAM</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setMatchFoundModal(false);
                      setIsMatchRoomOpen(true);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#84CC16] to-[#A3E635] hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-lime-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>ENTER CS2 MATCH ROOM & MAP VETO</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setMatchFoundModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white font-mono text-xs transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Server Toast Notification */}
      {connectToast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#131620] border border-[#A3E635] px-5 py-3 rounded-2xl shadow-2xl shadow-lime-500/30">
          <div className="w-3 h-3 rounded-full bg-[#A3E635] animate-ping" />
          <div className="text-xs font-mono">
            <div className="text-white font-bold">CONNECTING TO CS2 SERVER...</div>
            <div className="text-emerald-400 text-[11px]">connect {connectToast.ip} (Copied to clipboard)</div>
          </div>
        </div>
      )}

      {/* Download Demo Toast Notification */}
      {downloadDemoToast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#131620] border border-emerald-400 px-5 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30">
          <Download className="w-4 h-4 text-emerald-400 animate-bounce" />
          <div className="text-xs font-mono">
            <div className="text-white font-bold">DOWNLOADING GOTV BROADCAST DEMO...</div>
            <div className="text-slate-300 text-[11px]">{downloadDemoToast}</div>
          </div>
        </div>
      )}

      {/* Dashboard General Action Toast Notification */}
      {dashboardToast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#131620] border border-[#A3E635] px-5 py-3 rounded-2xl shadow-2xl shadow-lime-500/30">
          <Sparkles className="w-4 h-4 text-[#A3E635] animate-pulse" />
          <div className="text-xs font-mono">
            <div className="text-white font-bold">VORTEX COMMAND TELEMETRY</div>
            <div className="text-[#A3E635] text-[11px]">{dashboardToast}</div>
          </div>
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
                  <button
                    onClick={handleTriggerTestNotif}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-[#1B2213] border border-[#A3E635]/40 text-[#A3E635] text-xs font-mono font-bold hover:bg-[#283519] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Simulate 5v5 Ready Notification
                  </button>
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
                                    navigator.clipboard.writeText('connect 185.122.54.12:27015; password vortex');
                                  }
                                  setDashboardToast('Console command copied: connect 185.122.54.12:27015');
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
                  title="Show VORTEX Party Invite dialog with Accept and Decline"
                >
                  <Users className="w-3 h-3 text-[#A3E635]" />
                  <span>Show Party Invite (Test)</span>
                </button>
                <button
                  onClick={handleTriggerTestNotif}
                  className="text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  title="Send a mock incoming 5v5 ready check"
                >
                  <Plus className="w-3 h-3 text-[#A3E635]" />
                  <span>5v5 Alert</span>
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

      {/* VORTEX Membership Upgrade Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0E1017] border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Crown className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-white">CHOOSE YOUR VORTEX TIER</h3>
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
                    <span className="text-xs font-display font-black text-amber-400 uppercase tracking-wider">VORTEX PREMIUM</span>
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
                    sound.playTournamentVictory();
                    setUserMembershipTier('premium');
                    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
                    setDashboardToast('Upgraded to VORTEX PREMIUM! Super Match queue unlocked.');
                    setTimeout(() => setDashboardToast(null), 4000);
                    setShowPremiumModal(false);
                  }}
                  className={`w-full py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md ${
                    userMembershipTier === 'premium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  {userMembershipTier === 'premium' ? 'CURRENT PLAN' : 'UPGRADE TO PREMIUM'}
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
                      <span>2x Vortex Points & €25,000 Major Cups</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playTournamentVictory();
                    setUserMembershipTier('vip');
                    confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
                    setDashboardToast('Upgraded to VIP ELITE! All pro queues & GOTV active.');
                    setTimeout(() => setDashboardToast(null), 4000);
                    setShowPremiumModal(false);
                  }}
                  className={`w-full py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md ${
                    userMembershipTier === 'vip'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 cursor-default'
                      : 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 hover:brightness-110 text-slate-950 shadow-purple-500/20'
                  }`}
                >
                  {userMembershipTier === 'vip' ? 'CURRENT PLAN' : 'UPGRADE TO VIP ELITE'}
                </button>
              </div>

            </div>

            {/* Quick Testing Simulator Bar */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Simulate Account Tier:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setUserMembershipTier('free');
                    setDashboardToast('Account switched to Free tier.');
                    setTimeout(() => setDashboardToast(null), 2500);
                  }}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    userMembershipTier === 'free'
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setUserMembershipTier('premium');
                    setDashboardToast('Account switched to Premium tier.');
                    setTimeout(() => setDashboardToast(null), 2500);
                  }}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    userMembershipTier === 'premium'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Premium
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setUserMembershipTier('vip');
                    setDashboardToast('Account switched to VIP Elite tier.');
                    setTimeout(() => setDashboardToast(null), 2500);
                  }}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    userMembershipTier === 'vip'
                      ? 'bg-purple-500 text-white font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  VIP Elite
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
                        (e.target as HTMLImageElement).src = '/images/blockeerz_avatar.png';
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center border-2 border-[#12141C] shadow-md">
                      7
                    </div>
                  </div>

                  {/* Mode 1: Presets Grid */}
                  {avatarUploadMode === 'presets' && (
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 flex-1">
                      {PRESET_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setDraftAvatarUrl(av.url);
                          }}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer group ${
                            draftAvatarUrl === av.url ? 'border-[#A3E635] ring-2 ring-[#A3E635]/40 scale-105' : 'border-white/10 hover:border-white/30'
                          }`}
                          title={av.name}
                        >
                          <img src={av.url} alt={av.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-200" />
                          {draftAvatarUrl === av.url && (
                            <div className="absolute inset-0 bg-[#A3E635]/25 flex items-center justify-center">
                              <Check className="w-4 h-4 text-[#A3E635] stroke-[3]" />
                            </div>
                          )}
                        </button>
                      ))}
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
                      placeholder="e.g. bLocKeeRz"
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
                    {/* VIP Verified (Pro Star) */}
                    <button
                      type="button"
                      onClick={() => { sound.playSelect(); setDraftVerification('vip'); }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition cursor-pointer text-left ${
                        draftVerification === 'vip'
                          ? 'bg-[#F59E0B]/10 border-[#F59E0B] shadow-md shadow-amber-500/10'
                          : 'bg-[#0A0D14] border-white/10 hover:border-white/25 text-slate-400'
                      }`}
                    >
                      <FaceitVerificationBadge type="vip" size="md" />
                      <div>
                        <div className={`text-xs font-display font-bold ${draftVerification === 'vip' ? 'text-white' : 'text-slate-300'}`}>
                          VIP Verified
                        </div>
                        <div className="text-[10px] font-mono text-amber-400">Official CS2 Pro</div>
                      </div>
                    </button>

                    {/* Community Verified (White Checkmark) */}
                    <button
                      type="button"
                      onClick={() => { sound.playSelect(); setDraftVerification('verified'); }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition cursor-pointer text-left ${
                        draftVerification === 'verified'
                          ? 'bg-white/10 border-white shadow-md shadow-white/10'
                          : 'bg-[#0A0D14] border-white/10 hover:border-white/25 text-slate-400'
                      }`}
                    >
                      <FaceitVerificationBadge type="verified" size="md" />
                      <div>
                        <div className={`text-xs font-display font-bold ${draftVerification === 'verified' ? 'text-white' : 'text-slate-300'}`}>
                          Verified
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">ID & Selfie Verified</div>
                      </div>
                    </button>

                    {/* Unverified (None) */}
                    <button
                      type="button"
                      onClick={() => { sound.playSelect(); setDraftVerification('none'); }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition cursor-pointer text-left ${
                        draftVerification === 'none'
                          ? 'bg-slate-800/40 border-slate-400 text-white'
                          : 'bg-[#0A0D14] border-white/10 hover:border-white/25 text-slate-400'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-dashed border-slate-500 flex items-center justify-center text-[9px] text-slate-500">✕</span>
                      <div>
                        <div className={`text-xs font-display font-bold ${draftVerification === 'none' ? 'text-white' : 'text-slate-300'}`}>
                          Unverified
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">No Badge (Standard)</div>
                      </div>
                    </button>
                  </div>
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
                      <p className="text-[10px] font-mono text-slate-400">Required for instant skin drops, weapon case rewards & tournament prize payouts</p>
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
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#0D0F17] border border-[#A3E635]/40 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 animate-in fade-in zoom-in-95 duration-150">
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
                Kosovo CS2 Pros (BNE)
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
      {/* VORTEX MINIMAL CLEAN "INVITE TO PARTY" MODAL DIALOG       */}
      {/* ======================================================== */}
      {activePartyInvite && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-[530px] bg-[#0E121B] border border-[#A3E635]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(163,230,53,0.18)] overflow-hidden animate-in zoom-in-95 duration-150">
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
                {/* Photo / Avatar with VORTEX Glowing Border and Status Dot */}
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

                {/* The Name Badge directly UNDER the photo (bLocKeeRz ⭐ 🇽🇰) */}
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
      {/* VORTEX PARTY CHAT DOCKED WIDGET                          */}
      {/* ======================================================== */}
      <VortexPartyChat
        currentGamerTag={currentGamerTag}
        currentAvatarUrl={currentAvatarUrl}
        partyMembers={partySlots
          .map((m, idx) => m ? {
            id: m.id,
            name: m.name,
            avatar: m.avatar,
            verification: m.verification,
            isLeader: partyLeaderIndex === idx
          } : null)
          .filter((m): m is { id: string; name: string; avatar?: string; verification?: 'vip' | 'verified' | 'none'; isLeader: boolean } => m !== null)
        }
        onOpenMatchRoom={() => setIsMatchRoomOpen(true)}
      />

      {/* ======================================================== */}
      {/* VORTEX CS2 MATCH ROOM & MAP VETO MODAL                   */}
      {/* ======================================================== */}
      {isMatchRoomOpen && (
        <VortexMatchRoom
          matchId="VTX-89421"
          currentGamerTag={currentGamerTag}
          currentAvatarUrl={currentAvatarUrl}
          partyMembers={partySlots.filter((m): m is PartySlotMember => m !== null)}
          onClose={() => setIsMatchRoomOpen(false)}
        />
      )}

    </div>
  );
};
