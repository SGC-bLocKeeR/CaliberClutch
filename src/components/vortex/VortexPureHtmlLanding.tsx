import React, { useState } from 'react';
import { 
  Play, 
  X, 
  Server, 
  Shield, 
  Trophy, 
  Gift,
  Target,
  Sparkles,
  ShieldCheck,
  Crown,
  ArrowRight,
  Zap,
  Globe2,
  Cpu,
  Copy,
  Check,
  Users,
  Radio,
  Flame,
  Award,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
  Volume2,
  Lock
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { CyberGridOverlay } from './CyberGridOverlay';
import { VortexAdBanner } from './VortexAdBanner';

interface VortexPureHtmlLandingProps {
  onLoginWithSteam: (openUpgrade?: boolean) => void;
  onNavigateToTournaments?: () => void;
  onNavigateToServers?: () => void;
  onNavigateToLeaderboard?: () => void;
  onNavigateToAbout?: () => void;
}

// Official Steam Glyphed SVG Icon
const SteamIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.979 0C5.378 0 0 5.378 0 11.979c0 5.094 3.197 9.444 7.72 11.162l3.415-4.707a3.42 3.42 0 0 1-1.028-2.457c0-.285.035-.561.1-.825l-2.457-1.78a5.53 5.53 0 0 1-.09-.997c0-3.056 2.483-5.54 5.54-5.54 3.056 0 5.54 2.484 5.54 5.54 0 3.057-2.484 5.54-5.54 5.54l-2.585 3.56c.26.04.526.064.795.064 6.6 0 11.979-5.378 11.979-11.979C23.958 5.378 18.58 0 11.979 0z"/>
  </svg>
);

// High-Definition CALIBER CLUTCH Brand Logo
export const VortexBrandLogo = ({ className = "h-8" }: { className?: string }) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    <div className="relative flex items-center justify-center">
      <svg className="w-7 h-7 drop-shadow-[0_0_14px_rgba(163,230,53,0.85)]" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="13" stroke="#A3E635" strokeWidth="2.2" strokeDasharray="18 4" opacity="0.9" />
        <path d="M21 10.5H13.5C10.5 10.5 8 13 8 16C8 19 10.5 21.5 13.5 21.5H21" stroke="#A3E635" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M16 12L19 16L16 20L13 16L16 12Z" fill="#FFFFFF" />
        <circle cx="16" cy="16" r="1.5" fill="#A3E635" />
      </svg>
    </div>
    <div className="flex items-baseline gap-1.5 leading-none">
      <span className="font-display font-black text-white text-lg sm:text-xl tracking-[0.16em] uppercase">
        CALIBER
      </span>
      <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#A3E635] tracking-[0.22em] uppercase">
        CLUTCH
      </span>
    </div>
  </div>
);

// Map definitions with authentic CS2 data
interface MapCardData {
  id: string;
  name: string;
  country: string;
  flag: string;
  image: string;
  description: string;
  activePlayers: number;
}

const CS2_MAPS: MapCardData[] = [
  {
    id: 'inferno',
    name: 'INFERNO',
    country: 'ITALY',
    flag: '🇮🇹',
    image: '/images/maps/de_inferno.jpg',
    description: 'Narrow corridors & intense banana control.',
    activePlayers: 482
  },
  {
    id: 'mirage',
    name: 'MIRAGE',
    country: 'MOROCCO',
    flag: '🇲🇦',
    image: '/images/maps/de_mirage.jpg',
    description: 'Iconic mid control & lightning-fast executes.',
    activePlayers: 1240
  },
  {
    id: 'nuke',
    name: 'NUKE',
    country: 'GERMANY',
    flag: '🇩🇪',
    image: '/images/maps/de_nuke.jpg',
    description: 'Dual-level reactor bomb sites & vertical gunplay.',
    activePlayers: 360
  }
];

export const VortexPureHtmlLanding: React.FC<VortexPureHtmlLandingProps> = ({
  onLoginWithSteam,
  onNavigateToTournaments,
  onNavigateToServers,
  onNavigateToLeaderboard,
  onNavigateToAbout
}) => {
  const [selectedMapId, setSelectedMapId] = useState<string>('mirage');
  const [activeTab, setActiveTab] = useState<'home' | 'tournaments' | 'servers' | 'leaderboards' | 'about'>('home');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showTrailerModal, setShowTrailerModal] = useState<boolean>(false);
  const [authRequiredModal, setAuthRequiredModal] = useState<{ open: boolean; tier: 'premium' | 'vip' | null }>({ open: false, tier: null });

  const handleMapSelect = (mapId: string) => {
    sound.playSelect();
    setSelectedMapId(mapId);
  };

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-[#F1F5F9] font-sans flex flex-col justify-start items-center selection:bg-[#A3E635]/30 selection:text-white overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. TOP NAVIGATION BAR (100% Real HTML & Responsive)      */}
      {/* ======================================================== */}
      <header className="w-full border-b border-white/[0.06] bg-[#07080B]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { sound.playClick(); setActiveTab('home'); }} 
            className="cursor-pointer transition hover:opacity-90 flex items-center"
          >
            <VortexBrandLogo />
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0E1017] p-1.5 rounded-full border border-white/[0.08]">
            <button
              onClick={() => { sound.playClick(); setActiveTab('home'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#18210C] text-[#A3E635] border border-[#A3E635]/30 shadow-[0_0_15px_rgba(163,230,53,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'home' ? 'bg-[#A3E635]' : 'bg-transparent'}`} />
              HOME
            </button>

            <button
              onClick={() => { 
                sound.playSelect(); 
                setActiveTab('tournaments');
                if (onNavigateToTournaments) onNavigateToTournaments(); 
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              TOURNAMENTS
            </button>

            <button
              onClick={() => { 
                sound.playSelect(); 
                setActiveTab('servers');
                if (onNavigateToServers) onNavigateToServers(); 
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-[#A3E635]" />
              SERVERS
            </button>

            <button
              onClick={() => { 
                sound.playSelect(); 
                setActiveTab('leaderboards');
                if (onNavigateToLeaderboard) onNavigateToLeaderboard(); 
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              LEADERBOARDS
            </button>

            <button
              onClick={() => { 
                sound.playClick(); 
                setActiveTab('about');
                if (onNavigateToAbout) onNavigateToAbout(); 
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer"
            >
              ABOUT
            </button>
          </nav>

          {/* Right Header Actions: Theme & Steam Login */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => sound.playClick()}
              className="w-9 h-9 rounded-full bg-[#11131A] hover:bg-[#1A1D26] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              title="Theme settings"
            >
              <Sun className="w-4 h-4 text-[#A3E635]" />
            </button>

            <button
              onClick={() => { sound.playTournamentVictory(); onLoginWithSteam(); }}
              className="px-4 py-2 rounded-full bg-[#0E1017] hover:bg-[#161A24] border border-white/20 hover:border-[#A3E635]/60 text-white hover:text-[#A3E635] text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <SteamIcon className="w-4 h-4 text-white" />
              <span>LOGIN WITH STEAM</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION: 100% PURE HTML, CSS & VECTOR TYPOGRAPHY */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-white/[0.08] min-h-[560px] lg:min-h-[640px] flex items-center">
        
        {/* Full-width Cinematic CS2 Squad Warfare Background (Multi-operator tactical squad) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <img 
            src="/images/cs2_hero_squad_warfare_bg.jpg" 
            alt="CS2 Tactical Squad Warfare Background"
            className="w-full h-full object-cover object-[52%_center] lg:object-[50%_center] filter brightness-[0.98] contrast-[1.05]"
          />

          {/* Deep Dark Gradient on Left Only (Hugs the text for crisp readability, leaves soldier bright) */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-[42%] bg-gradient-to-r from-[#07080B] via-[#07080B]/85 to-transparent pointer-events-none z-10" />

          {/* Bottom Seamless Gradient Fade into Page Content */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07080B] via-[#07080B]/70 to-transparent pointer-events-none z-10" />

          {/* Top Subtle Vignette */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07080B]/80 to-transparent pointer-events-none z-10" />
        </div>

        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* ---------------------------------------------------- */}
            {/* LEFT COLUMN: HERO TEXT & ACTIONS (Moved Further Left) */}
            {/* ---------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start text-left z-20">
              
              {/* Category Tracker Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#A3E635] font-mono font-bold tracking-[0.25em] text-xs uppercase flex items-center gap-2 select-text drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                  <span className="w-2 h-2 rounded-full bg-[#A3E635] shadow-[0_0_12px_#A3E635] animate-pulse" />
                  COUNTER-STRIKE 2 PLATFORM
                </span>
                <div className="h-[1px] w-14 bg-gradient-to-r from-[#A3E635]/60 to-transparent" />
              </div>

              {/* Massive Bold Headline with Heavy Layered Shadows */}
              <h1 className="font-display font-black uppercase tracking-tight leading-[0.92] select-text">
                <span className="block text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-white/80 drop-shadow-[0_4px_16px_rgba(0,0,0,1)] drop-shadow-[0_12px_32px_rgba(0,0,0,0.95)]">
                  CHALLENGE
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl xl:text-7xl mt-1.5 drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
                  <span className="text-[#A3E635] drop-shadow-[0_0_35px_rgba(163,230,53,0.65)]">
                    YOUR
                  </span>{' '}
                  <span className="text-white/80">
                    CS2 GAME
                  </span>
                </span>
              </h1>

              {/* Description Subtitle with Crisp Text Shadow */}
              <div className="mt-6 text-slate-200 text-sm sm:text-base leading-relaxed max-w-lg space-y-1 font-normal select-text drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                <p className="font-medium">Join Caliber Clutch – the ultimate platform for CS2 players.</p>
                <p className="text-slate-300">Play on premium servers, participate in tournaments and climb the ranks!</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Primary Neon CTA: Login with Steam */}
                <button
                  onClick={() => { sound.playTournamentVictory(); onLoginWithSteam(); }}
                  className="px-7 py-3.5 rounded-full bg-[#A3E635] hover:bg-[#BEF264] text-black font-extrabold uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_0_35px_rgba(163,230,53,0.5)] hover:shadow-[0_0_50px_rgba(163,230,53,0.75)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <SteamIcon className="w-5 h-5 text-black" />
                  <span>LOGIN WITH STEAM</span>
                </button>

                {/* Secondary Glassmorphism CTA: Learn More */}
                <button
                  onClick={() => { sound.playSelect(); setShowTrailerModal(true); }}
                  className="px-6 py-3.5 rounded-full bg-[#0E1017]/90 hover:bg-[#1E232E] text-white font-bold uppercase tracking-wider text-xs sm:text-sm border border-white/20 hover:border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>LEARN MORE</span>
                </button>
              </div>

              {/* Three Feature Pillars in Glassmorphic Capsules */}
              <div className="mt-10 pt-6 border-t border-white/[0.1] w-full max-w-lg grid grid-cols-3 gap-2.5">
                <div className="flex items-center gap-2 text-left bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                  <div className="w-7 h-7 rounded-lg bg-[#18210C] border border-[#A3E635]/40 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-[#A3E635]" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white leading-tight">Sub-Tick</p>
                    <p className="text-[10px] text-slate-400">Servers</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-left bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white leading-tight">Competitive</p>
                    <p className="text-[10px] text-slate-400">Tournaments</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-left bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white leading-tight">Anti-Cheat</p>
                    <p className="text-[10px] text-slate-400">Protection</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ---------------------------------------------------- */}
            {/* MIDDLE SPACER: OPEN CORRIDOR SO SOLDIER IS VISIBLE   */}
            {/* ---------------------------------------------------- */}
            <div className="hidden lg:block lg:col-span-2 xl:col-span-2 pointer-events-none" />

            {/* ---------------------------------------------------- */}
            {/* RIGHT COLUMN: 3D INTERACTIVE MAP CARDS (Bottom Right)*/}
            {/* ---------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-5 relative flex items-end justify-center lg:justify-end self-end z-20 pt-10 sm:pt-16 lg:pt-28 lg:translate-y-8">
              
              {/* 3D Interactive Map Cards Deck (Grounded in bottom right) */}
              <div className="relative z-20 flex flex-col items-center lg:items-end">
                <div className="flex items-end gap-2 sm:gap-3">
                  {CS2_MAPS.map((map) => {
                    const isActive = selectedMapId === map.id;
                    return (
                      <div
                        key={map.id}
                        onClick={() => handleMapSelect(map.id)}
                        className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 select-none ${
                          isActive 
                            ? 'w-32 sm:w-36 lg:w-40 h-52 sm:h-60 lg:h-68 -translate-y-2 border-2 border-[#A3E635] shadow-[0_0_35px_rgba(163,230,53,0.5)] z-20' 
                            : 'w-24 sm:w-28 lg:w-32 h-44 sm:h-52 lg:h-60 opacity-65 hover:opacity-100 hover:-translate-y-1 border border-white/15 z-10'
                        }`}
                      >
                        {/* Map Background Image */}
                        <img 
                          src={map.image} 
                          alt={map.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />

                        {/* Top Gradient Overlay */}
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 to-transparent" />

                        {/* Bottom Gradient Overlay for typography readability */}
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/75 to-transparent" />

                        {/* Live player indicator tag */}
                        {isActive && (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-[#A3E635]/40 text-[9px] font-mono font-bold text-[#A3E635] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-ping" />
                            {map.activePlayers} ONLINE
                          </div>
                        )}

                        {/* Bottom Card Labels: Map Name only */}
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col items-start text-left">
                          <span className={`font-display font-black tracking-wider uppercase text-sm sm:text-base ${
                            isActive ? 'text-[#A3E635]' : 'text-white'
                          }`}>
                            {map.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Carousel Indicator Dots */}
                <div className="mt-5 flex items-center gap-2">
                  {CS2_MAPS.map((map) => {
                    const isActive = selectedMapId === map.id;
                    return (
                      <button
                        key={map.id}
                        onClick={() => handleMapSelect(map.id)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          isActive 
                            ? 'w-8 h-1.5 bg-[#A3E635] shadow-[0_0_10px_#A3E635]' 
                            : 'w-4 h-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Select ${map.name}`}
                      />
                    );
                  })}
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

            {/* ======================================================== */}
      {/* 2. SQUAD FINDER: FIVE PLAYERS. ONE PLAN.                 */}
      {/* ======================================================== */}
      <section className="w-full relative py-16 lg:py-24 border-b border-white/[0.08] overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-[#A3E635]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Clean Editorial Headline & Steps (Open, no card box) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#A3E635] tracking-widest uppercase">
                  01 / PLAY WITHOUT A SQUAD
                </span>
                <h2 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white tracking-tighter uppercase leading-[0.92] mt-4 mb-6">
                  FIVE PLAYERS.<br />
                  <span>ONE PLAN.</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-12">
                  Don't have a 5-stack ready? The solo queue system matches you with serious teammates to fill missing roles, build tactical synergy, and transform five individual grinders into a cohesive championship team.
                </p>
              </div>

              {/* 3 Step Sequence Bar separated by vertical borders like photo */}
              <div className="grid grid-cols-3 border-t border-white/10 pt-6">
                <div className="pr-4 border-r border-white/10">
                  <span className="font-sans font-black text-sm text-[#A3E635] mr-2">01</span>
                  <span className="text-xs sm:text-sm font-bold text-white">Enter Solo</span>
                </div>
                <div className="px-4 border-r border-white/10">
                  <span className="font-sans font-black text-sm text-[#A3E635] mr-2">02</span>
                  <span className="text-xs sm:text-sm font-bold text-white">Find 4 Players</span>
                </div>
                <div className="pl-4">
                  <span className="font-sans font-black text-sm text-[#A3E635] mr-2">03</span>
                  <span className="text-xs sm:text-sm font-bold text-white">Play as a Team</span>
                </div>
              </div>
            </div>

            {/* Right Column: Standalone Tactical Card Exactly like in photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-[#0B0E14] border border-white/10 p-7 sm:p-9 shadow-2xl overflow-hidden group hover:border-[#A3E635]/40 transition-all duration-300">
                
                {/* Geometric Chevron lines in top-right corner like photo */}
                <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden opacity-25">
                  <div className="absolute top-3 right-3 w-24 h-24 border-r-2 border-t-2 border-white/40 transform rotate-45" />
                  <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-[#A3E635] transform rotate-45" />
                </div>

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] relative z-10">
                  <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    TEAM FINDER // SQUAD RADAR
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#A3E635]">
                    <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                    <span>5V5 SOLO</span>
                  </div>
                </div>

                {/* Card Main Copy */}
                <div className="py-7 relative z-10">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-[1.05] mb-3">
                    A SPOT RESERVED FOR YOU IN THE 5-STACK.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Queue built specifically for solo grinders. Connect with disciplined riflers, AWPers, and support players you haven't met yet.
                  </p>
                </div>

                {/* 5 Player Slot Outlined Boxes in a row */}
                <div className="grid grid-cols-5 gap-2.5 my-2 relative z-10">
                  {/* Slot 01: You */}
                  <div className="aspect-square rounded-xl bg-[#18210C] border border-[#A3E635] flex flex-col items-center justify-center p-2 text-center group-hover:scale-105 transition shadow-[0_0_15px_rgba(163,230,53,0.25)]">
                    <Target className="w-5 h-5 text-[#A3E635] mb-1.5" />
                    <span className="font-sans font-black text-[10px] text-[#A3E635]">01</span>
                  </div>
                  {/* Slot 02 */}
                  <div className="aspect-square rounded-xl bg-[#07090D] border border-white/10 hover:border-white/20 flex flex-col items-center justify-center p-2 text-center transition">
                    <Users className="w-5 h-5 text-slate-400 mb-1.5" />
                    <span className="font-sans font-black text-[10px] text-slate-400">02</span>
                  </div>
                  {/* Slot 03 */}
                  <div className="aspect-square rounded-xl bg-[#07090D] border border-white/10 hover:border-white/20 flex flex-col items-center justify-center p-2 text-center transition">
                    <Users className="w-5 h-5 text-slate-400 mb-1.5" />
                    <span className="font-sans font-black text-[10px] text-slate-400">03</span>
                  </div>
                  {/* Slot 04 */}
                  <div className="aspect-square rounded-xl bg-[#07090D] border border-white/10 hover:border-white/20 flex flex-col items-center justify-center p-2 text-center transition">
                    <Users className="w-5 h-5 text-slate-400 mb-1.5" />
                    <span className="font-sans font-black text-[10px] text-slate-400">04</span>
                  </div>
                  {/* Slot 05 */}
                  <div className="aspect-square rounded-xl bg-[#07090D] border border-white/10 hover:border-white/20 flex flex-col items-center justify-center p-2 text-center transition">
                    <Users className="w-5 h-5 text-slate-400 mb-1.5" />
                    <span className="font-sans font-black text-[10px] text-slate-400">05</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TACTICAL NETWORK STATUS & FEATURE PILLARS             */}
      {/* ======================================================== */}
      <section className="w-full relative py-16 lg:py-24 border-b border-white/[0.08] overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-[#A3E635]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">

            {/* Tactical Bridge Bar */}
            <div className="flex flex-wrap items-center justify-between border border-[#1E2612]/90 rounded-2xl bg-[#0C1107]/80 backdrop-blur-md px-6 py-3.5 text-xs font-mono text-[#94A3B8] shadow-lg shadow-black/40">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A3E635]" />
                </span>
                <span className="text-[#A3E635] font-bold tracking-wider uppercase font-display">// CALIBER CLUTCH COMPETITIVE NETWORK</span>
              </div>

              <div className="hidden md:flex items-center gap-6 text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>FRANKFURT • STOCKHOLM • VIENNA</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#A3E635] font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>CS2 DEDICATED SUB-TICK</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>KERNEL RING-0 INTEGRITY</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold font-mono">
                <span className="text-[#94A3B8]">STATUS:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/40 text-[11px]">
                  ONLINE &bull; 0% PACKET LOSS
                </span>
              </div>
            </div>

            {/* 3 Bespoke Tactical Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pillar 1: Sub-Tick */}
              <div className="relative p-8 rounded-3xl bg-[#0A0E07]/80 backdrop-blur-xl border border-[#233013]/90 hover:border-[#A3E635]/70 hover:shadow-[0_0_35px_rgba(163,230,53,0.22)] transition-all duration-300 group shadow-2xl flex flex-col justify-between gap-6 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A3E635]/10 rounded-full blur-2xl group-hover:bg-[#A3E635]/25 transition-all pointer-events-none" />
                
                <div className="w-14 h-14 rounded-2xl bg-[#16210A] border border-[#2D3E14] flex items-center justify-center text-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-all">
                  <Server className="w-7 h-7" />
                </div>

                <div>
                  <div className="text-2xl font-black font-display text-white tracking-wide">Dedicated Sub-Tick</div>
                  <p className="text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                    Frankfurt, Vienna & Stockholm nodes running customized sub-tick optimizations for seamless bullet registration.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#A3E635] font-bold pt-2 border-t border-[#1C2511]/80">
                  <span>AVERAGE PING &lt; 15MS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pillar 2: Kernel Anti-Cheat */}
              <div className="relative p-8 rounded-3xl bg-[#0A0E07]/80 backdrop-blur-xl border border-[#233013]/90 hover:border-[#A3E635]/70 hover:shadow-[0_0_35px_rgba(163,230,53,0.22)] transition-all duration-300 group shadow-2xl flex flex-col justify-between gap-6 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A3E635]/10 rounded-full blur-2xl group-hover:bg-[#A3E635]/25 transition-all pointer-events-none" />

                <div className="w-14 h-14 rounded-2xl bg-[#16210A] border border-[#2D3E14] flex items-center justify-center text-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-all">
                  <Shield className="w-7 h-7" />
                </div>

                <div>
                  <div className="text-2xl font-black font-display text-white tracking-wide">Kernel Anti-Cheat</div>
                  <p className="text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                    Ring-0 hardware UUID integrity checks and heuristic behavioral analysis to ensure completely fair competition.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#A3E635] font-bold pt-2 border-t border-[#1C2511]/80">
                  <span>ZERO TOLERANCE POLICY</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pillar 3: Skins & Prize Pools */}
              <div className="relative p-8 rounded-3xl bg-[#0A0E07]/80 backdrop-blur-xl border border-[#233013]/90 hover:border-[#A3E635]/70 hover:shadow-[0_0_35px_rgba(163,230,53,0.22)] transition-all duration-300 group shadow-2xl flex flex-col justify-between gap-6 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A3E635]/10 rounded-full blur-2xl group-hover:bg-[#A3E635]/25 transition-all pointer-events-none" />

                <div className="w-14 h-14 rounded-2xl bg-[#16210A] border border-[#2D3E14] flex items-center justify-center text-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-all">
                  <Gift className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#18210C] text-[#A3E635] border border-[#A3E635]/40">
                      VERIFIED TOURNAMENT
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      PRIZE REWARDS
                    </span>
                  </div>
                  <div className="text-2xl font-black font-display text-white tracking-wide uppercase">
                    ESPORTS & PRIZE POOLS
                  </div>
                  <p className="text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                    Compete for real tournament prize pools awarded directly to verified winners. Earn season rank points, climb competitive divisions, and qualify for official CaliberClutch championships.
                  </p>
                </div>

                <div 
                  onClick={() => {
                    sound.playSelect();
                    if (onNavigateToTournaments) onNavigateToTournaments();
                  }}
                  className="flex items-center gap-2 text-xs font-mono text-[#A3E635] font-bold pt-2 border-t border-[#1C2511]/80 cursor-pointer group-hover:text-[#bef264] transition"
                >
                  <span>Enter Weekly Tournaments</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. VORTEX PREMIUM & VIP PASS TIERS + PAYMENTS SHOWCASE    */}
      {/* ======================================================== */}
      <section className="w-full relative py-16 lg:py-24 overflow-hidden">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
          <div className="w-full flex flex-col items-center">
            
            <div className="text-center max-w-2xl mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#A3E635] uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                <span>LEVEL UP YOUR COMPETITIVE CAREER</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
                CALIBER CLUTCH PREMIUM & VIP PASS
              </h2>
              <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
                Choose the competitive tier that fits your ambition. From free official matchmaking to private CS2 Sub-Tick team scrims and monthly €5,000 cash prize cups.
              </p>

              {/* Billing Toggle (Monthly / Yearly) */}
              <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-[#0E1219] border border-white/10 shadow-lg">
                <button
                  onClick={() => {
                    sound.playSelect();
                    setBillingCycle('monthly');
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-display font-bold transition cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#18210C] text-[#A3E635] border border-[#A3E635]/40 shadow-[0_0_15px_rgba(163,230,53,0.2)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  MONTHLY BILLING
                </button>
                <button
                  onClick={() => {
                    sound.playSelect();
                    setBillingCycle('yearly');
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-display font-bold transition flex items-center gap-2 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-[#18210C] text-[#A3E635] border border-[#A3E635]/40 shadow-[0_0_15px_rgba(163,230,53,0.2)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>YEARLY BILLING</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40">
                    SAVE 20%
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Pricing Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-stretch">
              
              {/* PLAN 1: FREE COMPETITIVE */}
              <div className="rounded-3xl bg-gradient-to-b from-[#11151F] to-[#090C11] border border-white/[0.08] p-8 flex flex-col justify-between hover:border-white/20 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/5 text-slate-400 border border-white/10 uppercase">
                      STARTER
                    </span>
                    <span className="text-xs font-mono text-slate-500">Tier 0</span>
                  </div>

                  <h3 className="text-2xl font-black font-display text-white mb-2">FREE PLAYER</h3>
                  <p className="text-xs text-slate-400 mb-6">Standard ranked matchmaking and European leaderboard tracking.</p>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-4xl font-black font-display text-white">€0</span>
                    <span className="text-xs font-mono text-slate-500">/ forever</span>
                  </div>

                  <ul className="space-y-3.5 text-xs text-slate-300 font-sans">
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Official CS2 5v5 Matchmaking</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Frankfurt Sub-Tick Dedicated Nodes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Level 1-10 Competitive ELO Sync</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Weekly Open Qualifier Cups</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 line-through">
                      <X className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>Captain Priority Map Veto</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 line-through">
                      <X className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>Advanced AI Round Analytics</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 line-through">
                      <X className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>Direct Cash Prize Payouts</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onLoginWithSteam(false);
                  }}
                  className="mt-8 w-full py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-display font-bold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-slate-300" />
                  <span>PLAY FREE • SIGN IN</span>
                </button>
                <div className="text-[10px] text-slate-500 font-mono text-center mt-2">
                  Official CS2 5v5 Matchmaking Forever
                </div>
              </div>

              {/* PLAN 2: VORTEX PREMIUM (Most Popular) */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#18230D] via-[#10170A] to-[#0A0D07] border-2 border-[#A3E635] p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(163,230,53,0.3)] transform lg:-translate-y-3">
                
                {/* Most Popular Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#A3E635] to-[#BEF264] text-black text-[11px] font-mono font-black tracking-widest uppercase shadow-md shadow-lime-500/30">
                  ★ MOST POPULAR
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40 uppercase">
                      COMPETITIVE PRO
                    </span>
                    <span className="text-xs font-mono text-[#A3E635] font-bold">Tier 1</span>
                  </div>

                  <h3 className="text-2xl font-black font-display text-white mb-2">CALIBER PREMIUM</h3>
                  <p className="text-xs text-slate-300 mb-6">Captain privileges, AI heatmaps, and exclusive monthly cash cups.</p>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-4xl font-black font-display text-[#A3E635]">
                      {billingCycle === 'monthly' ? '€6.99' : '€5.49'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/ month</span>
                  </div>

                  <ul className="space-y-3.5 text-xs text-white font-sans">
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#A3E635] shrink-0" />
                      <span className="font-bold">Captain Priority in Map & Server Vetoes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#A3E635] shrink-0" />
                      <span>Advanced CS2 AI Analytics & Heatmaps</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#A3E635] shrink-0" />
                      <span>Verified Gold Pro Badge on Profile</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#A3E635] shrink-0" />
                      <span className="font-bold">Access to Monthly €5,000 Premium Cups</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#A3E635] shrink-0" />
                      <span>2x Season Point Multiplier & Verified Scrim Access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#A3E635] shrink-0" />
                      <span>Zero Platform Fees on Tournament Prize Payouts</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setAuthRequiredModal({ open: true, tier: 'premium' });
                    }}
                    className="mt-8 w-full py-4 rounded-xl bg-[#A3E635] hover:bg-[#BEF264] text-black font-display font-black text-xs tracking-wider uppercase transition shadow-lg shadow-lime-500/30 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Lock className="w-4 h-4 fill-black" />
                    <span>LOGIN TO UPGRADE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-[10px] text-slate-400 font-mono text-center mt-2 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-[#A3E635]" />
                    <span>Requires login • Upgrade in dashboard</span>
                  </div>
                </div>
              </div>

              {/* PLAN 3: VORTEX VIP ELITE */}
              <div className="rounded-3xl bg-gradient-to-b from-[#101826] via-[#0D121D] to-[#080B10] border border-cyan-500/40 hover:border-cyan-400/80 p-8 flex flex-col justify-between shadow-2xl transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 uppercase">
                      VIP & TEAM ORG
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">Tier 2</span>
                  </div>

                  <h3 className="text-2xl font-black font-display text-white mb-2">CALIBER VIP ELITE</h3>
                  <p className="text-xs text-slate-400 mb-6">On-demand CS2 Sub-Tick private scrim servers and instant bank/crypto cashouts.</p>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-4xl font-black font-display text-cyan-400">
                      {billingCycle === 'monthly' ? '€14.99' : '€11.99'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/ month</span>
                  </div>

                  <ul className="space-y-3.5 text-xs text-slate-200 font-sans">
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-bold">Private Dedicated CS2 Sub-Tick Scrim Server</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Full 5v5 Team Roster Hub & Scrim Finder</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-bold">Direct Cash Prize Payouts (PayPal, SEPA, Crypto USDT)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Priority 24/7 Warden Anti-Cheat Ticket Support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>5x Season Point Multiplier & Dedicated GOTV Demo Storage</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Custom Sponsored Tournament Host Privileges</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setAuthRequiredModal({ open: true, tier: 'vip' });
                    }}
                    className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-display font-black text-xs tracking-wider uppercase transition shadow-lg shadow-cyan-500/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>LOGIN TO GET VIP</span>
                    <Crown className="w-4 h-4" />
                  </button>
                  <div className="text-[10px] text-slate-400 font-mono text-center mt-2 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    <span>Requires login • Upgrade in dashboard</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Supported Payment Gateways Bar */}
            <div className="mt-12 w-full p-6 sm:p-8 rounded-2xl bg-[#090C11] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">SECURE 256-BIT ENCRYPTED CHECKOUT</div>
                  <div className="text-xs text-slate-400">Instant 1-second pass activation • Cancel anytime with 1 click</div>
                </div>
              </div>

              {/* Payment Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono font-bold">
                <span className="px-3.5 py-1.5 rounded-lg bg-[#FF003C]/15 border border-[#FF003C]/40 text-white flex items-center gap-1.5 shadow-sm">
                  <span className="w-4 h-4 rounded bg-[#FF003C] text-white flex items-center justify-center font-black text-[10px] font-display">X</span>
                  <span>POWERED BY XSOLLA</span>
                  <span className="text-[10px] text-[#FF003C] font-mono font-black">• 700+ METHODS</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white flex items-center gap-1.5">
                  💳 VISA / MASTERCARD
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400 flex items-center gap-1.5">
                  🅿️ PAYPAL
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#A3E635] flex items-center gap-1.5">
                  🎮 STEAM WALLET
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-emerald-400 flex items-center gap-1.5">
                  ⚡ USDT / BITCOIN
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                  🍏 APPLE / GOOGLE PAY
                </span>
              </div>
            </div>

          </div>

          {/* Call to Action Bar */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#12180B]/90 via-[#0F1409]/90 to-[#0A0E06]/90 backdrop-blur-xl border border-[#253314] hover:border-[#A3E635]/60 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-black/60 transition duration-300 overflow-hidden">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#A3E635]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2 text-center lg:text-left relative z-10">
              <div className="text-xs font-mono font-bold text-[#A3E635] tracking-widest uppercase flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                <span>READY TO COMPETE ON CALIBER CLUTCH?</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                Connect your Steam Account and Enter the Arena Today
              </h3>
              <p className="text-sm text-[#94A3B8]">
                No subscription required. Free tier includes daily matchmaking, scrim lobbies, and aim challenges.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playTournamentVictory();
                onLoginWithSteam();
              }}
              className="relative z-10 px-8 sm:px-10 py-4 rounded-full bg-[#A3E635] hover:bg-[#BEF264] text-black font-display font-black text-sm tracking-wider uppercase flex items-center gap-3 shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:shadow-[0_0_40px_rgba(163,230,53,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0 outline-none focus:outline-none focus:ring-0"
            >
              <SteamIcon className="w-4 h-4 fill-black text-black" />
              <span>Login with Steam</span>
            </button>
          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 6. TRAILER MODAL (Full Screen YouTube CS2 Video)         */}
      {/* ======================================================== */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#0E1017] border border-[#A3E635]/40 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#A3E635] fill-[#A3E635]" />
                <span className="font-display font-black text-white uppercase tracking-wider text-sm">
                  COUNTER-STRIKE 2 // CALIBER CLUTCH PLATFORM TRAILER
                </span>
              </div>
              <button 
                onClick={() => setShowTrailerModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/c80DVfOD0ew?autoplay=1"
                title="Counter-Strike 2 Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Account Required for Subscription Upgrade Modal */}
      {authRequiredModal.open && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0E1017] border border-[#23293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1812] border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-white">ACCOUNT LOGIN REQUIRED</h3>
                  <p className="text-xs font-mono text-slate-400">Sign in to activate your competitive membership</p>
                </div>
              </div>
              <button 
                onClick={() => { sound.playClick(); setAuthRequiredModal({ open: false, tier: null }); }}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-[#94A3B8] hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Plan Highlight Box */}
            <div className="p-4 rounded-2xl bg-[#141722] border border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Selected Tier</span>
                <span className="text-sm font-black font-display text-white">
                  {authRequiredModal.tier === 'vip' ? 'CALIBER VIP ELITE PASS' : 'CALIBER PREMIUM PASS'}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                authRequiredModal.tier === 'vip'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40'
              }`}>
                {authRequiredModal.tier === 'vip' ? '€14.99 / mo' : '€6.99 / mo'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans text-slate-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
              <p>
                Subscriptions cannot be purchased directly on the public landing page without a connected player identity.
              </p>
              <p className="text-slate-400">
                Please sign in with Steam to link your CS2 profile. You will be redirected immediately to the Upgrade checkout in your dashboard.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  sound.playTournamentVictory();
                  setAuthRequiredModal({ open: false, tier: null });
                  onLoginWithSteam(true);
                }}
                className="w-full py-4 rounded-xl bg-[#A3E635] hover:bg-[#BEF264] text-black font-display font-black text-xs tracking-wider uppercase transition shadow-lg shadow-lime-500/30 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <SteamIcon className="w-4 h-4 fill-black" />
                <span>SIGN IN WITH STEAM TO UPGRADE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => { sound.playClick(); setAuthRequiredModal({ open: false, tier: null }); }}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white font-mono text-xs transition cursor-pointer"
              >
                Return to Landing Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6.5 OFFICIAL ADVERTISER & SPONSOR SHOWCASE (100% ENGLISH) */}
      {/* ======================================================== */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <VortexAdBanner placement="footer" />
      </section>

      {/* ======================================================== */}
      {/* 7. FOOTER                                                */}
      {/* ======================================================== */}
      <footer className="w-full border-t border-white/[0.08] bg-[#050608] py-12 mt-auto">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <VortexBrandLogo />
            <p className="text-xs text-slate-500 font-mono mt-1">
              Next-generation CS2 competitive platform • CS2 Sub-Tick Architecture.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
            <button onClick={() => sound.playClick()} className="hover:text-[#A3E635] transition cursor-pointer">PRIVACY</button>
            <button onClick={() => sound.playClick()} className="hover:text-[#A3E635] transition cursor-pointer">TERMS</button>
            <button onClick={() => sound.playClick()} className="hover:text-[#A3E635] transition cursor-pointer">SERVERS STATUS</button>
            <button onClick={() => sound.playClick()} className="hover:text-[#A3E635] transition cursor-pointer">DISCORD</button>
          </div>

          <p className="text-[11px] font-mono text-slate-600">
            © 2026 CALIBER CLUTCH. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};
