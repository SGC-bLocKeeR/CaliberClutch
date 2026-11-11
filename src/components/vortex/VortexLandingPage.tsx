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
  Check,
  Users,
  ArrowRight,
  Cpu,
  Zap,
  Globe2,
  Lock
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface VortexLandingPageProps {
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

// High-Definition VORTEX GAMING Brand Logo
export const VortexBrandLogo = ({ className = "h-8" }: { className?: string }) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    <div className="relative flex items-center justify-center">
      <svg className="w-7 h-7 drop-shadow-[0_0_12px_rgba(163,230,53,0.7)]" viewBox="0 0 32 32" fill="none">
        <path 
          d="M5 6L16 26L27 6H21L16 17L11 6H5Z" 
          fill="#A3E635" 
        />
        <path 
          d="M16 8L19 14L16 20L13 14L16 8Z" 
          fill="#FFFFFF" 
          opacity="0.9"
        />
      </svg>
    </div>
    <div className="flex items-baseline gap-1.5 leading-none">
      <span className="font-display font-black text-white text-lg sm:text-xl tracking-[0.16em] uppercase">
        VORTEX
      </span>
      <span className="font-mono text-[8px] sm:text-[9px] font-bold text-[#A3E635] tracking-[0.22em] uppercase">
        GAMING
      </span>
    </div>
  </div>
);

export const VortexLandingPage: React.FC<VortexLandingPageProps> = ({
  onLoginWithSteam,
  onNavigateToTournaments,
  onNavigateToServers,
  onNavigateToLeaderboard,
  onNavigateToAbout
}) => {
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [authRequiredModal, setAuthRequiredModal] = useState<{ open: boolean; tier: 'premium' | 'vip' | null }>({ open: false, tier: null });

  const handleSteamLogin = () => {
    sound.playTournamentVictory();
    onLoginWithSteam();
  };

  const handleWatchTrailer = () => {
    sound.playSelect();
    setShowTrailerModal(true);
  };

  const handleMapClick = (mapName: string) => {
    sound.playSelect();
    setSelectedMap(mapName);
    setTimeout(() => setSelectedMap(null), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-[#F1F5F9] font-sans flex flex-col justify-start items-center selection:bg-[#A3E635]/30 selection:text-white overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION: 100% IDENTICAL DESIGN TO REFERENCE      */}
      {/* VORTEX GAMING Theme, Green Accents, Interactive Zooming Maps */}
      {/* ======================================================== */}
      <section className="w-full bg-[#07080B] relative">
        <div className="w-full max-w-[1920px] mx-auto relative select-none">
          
          {/* Main Visual Canvas */}
          <div className="relative w-full aspect-[1662/489] overflow-hidden">
            <img 
              src="/images/vortex_landing_reference.jpg" 
              alt="VORTEX CS2 Platform" 
              className="w-full h-full object-cover pointer-events-none block select-none"
            />

            {/* Seamless Bottom Edge Blend into Lower Section */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#07080B] to-transparent pointer-events-none z-10" />

            {/* ==================================================== */}
            {/* TOP BRAND LOGO: VORTEX GAMING                        */}
            {/* ==================================================== */}
            <div 
              className="absolute z-20 flex items-center cursor-pointer transition hover:scale-105"
              style={{ left: '2.80%', top: '3.60%', height: '7.50%' }}
              onClick={() => sound.playClick()}
            >
              <VortexBrandLogo />
            </div>

            {/* ==================================================== */}
            {/* TOP NAVIGATION BUTTONS                               */}
            {/* ==================================================== */}

            {/* Nav: Home */}
            <button
              onClick={() => sound.playClick()}
              className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition duration-150 outline-none focus:outline-none focus:ring-0"
              style={{ left: '24.30%', top: '2.50%', width: '5.60%', height: '7.50%' }}
              aria-label="Home"
            />

            {/* Nav: Tournaments */}
            <button
              onClick={() => { sound.playSelect(); if (onNavigateToTournaments) onNavigateToTournaments(); }}
              className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition duration-150 outline-none focus:outline-none focus:ring-0"
              style={{ left: '30.50%', top: '2.50%', width: '8.00%', height: '7.50%' }}
              aria-label="Tournaments"
            />

            {/* Nav: Servers */}
            <button
              onClick={() => { sound.playSelect(); if (onNavigateToServers) onNavigateToServers(); }}
              className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition duration-150 outline-none focus:outline-none focus:ring-0"
              style={{ left: '39.00%', top: '2.50%', width: '6.50%', height: '7.50%' }}
              aria-label="Servers"
            />

            {/* Nav: Leaderboards */}
            <button
              onClick={() => { sound.playSelect(); if (onNavigateToLeaderboard) onNavigateToLeaderboard(); }}
              className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition duration-150 outline-none focus:outline-none focus:ring-0"
              style={{ left: '46.20%', top: '2.50%', width: '8.40%', height: '7.50%' }}
              aria-label="Leaderboards"
            />

            {/* Nav: About */}
            <button
              onClick={() => { sound.playClick(); if (onNavigateToAbout) onNavigateToAbout(); }}
              className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition duration-150 outline-none focus:outline-none focus:ring-0"
              style={{ left: '55.40%', top: '2.50%', width: '5.50%', height: '7.50%' }}
              aria-label="About"
            />

            {/* Top Nav: Login with Steam Button */}
            <button
              onClick={handleSteamLogin}
              className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] transition duration-200 outline-none focus:outline-none focus:ring-0"
              style={{ left: '87.20%', top: '2.50%', width: '10.40%', height: '7.50%' }}
              aria-label="Login with Steam"
            />

            {/* Hero: Solid Lime Green "Login with Steam" Button */}
            <button
              onClick={handleSteamLogin}
              className="absolute z-20 cursor-pointer rounded-full hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(163,230,53,0.7)] transition duration-200 outline-none focus:outline-none focus:ring-0"
              style={{ left: '4.15%', top: '77.30%', width: '16.36%', height: '14.52%' }}
              aria-label="Login with Steam"
            />

            {/* Hero: "Learn More" Button */}
            <button
              onClick={handleWatchTrailer}
              className="absolute z-20 cursor-pointer rounded-full hover:scale-[1.02] hover:bg-[#A3E635]/15 hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] transition duration-200 outline-none focus:outline-none focus:ring-0"
              style={{ left: '21.20%', top: '77.30%', width: '11.80%', height: '14.52%' }}
              aria-label="Learn More"
            />

            {/* Map Card 1: INFERNO */}
            <button
              onClick={() => handleMapClick('Inferno')}
              className="absolute z-20 cursor-pointer rounded-2xl hover:scale-105 transition duration-300 outline-none focus:outline-none focus:ring-0"
              style={{ left: '72.60%', top: '42.00%', width: '6.20%', height: '52.00%' }}
              aria-label="Inferno"
            />

            {/* Map Card 2: MIRAGE (Lime Green Neon Centerpiece) */}
            <button
              onClick={() => handleMapClick('Mirage')}
              className="absolute z-20 cursor-pointer rounded-2xl hover:scale-105 transition duration-300 outline-none focus:outline-none focus:ring-0"
              style={{ left: '79.30%', top: '34.35%', width: '10.89%', height: '59.50%' }}
              aria-label="Mirage"
            />

            {/* Map Card 3: NUKE */}
            <button
              onClick={() => handleMapClick('Nuke')}
              className="absolute z-20 cursor-pointer rounded-2xl hover:scale-105 transition duration-300 outline-none focus:outline-none focus:ring-0"
              style={{ left: '90.30%', top: '38.00%', width: '6.20%', height: '56.00%' }}
              aria-label="Nuke"
            />

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. RICH PLATFORM CONTENT: SEAMLESS CS2 ATMOSPHERIC BACKDROP */}
      {/* Connected seamlessly to the top hero section             */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden pt-4 pb-20">
        
        {/* Atmospheric Background Layers */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <img 
            src="/images/maps/de_mirage.jpg" 
            alt="CS2 Arena Texture" 
            className="w-full h-full object-cover object-center opacity-15 filter blur-xs scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#07080B] via-[#07080B]/90 to-[#07080B]" />
          
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(163, 230, 53, 0.16) 0%, rgba(7, 8, 11, 0.6) 50%, transparent 80%)'
            }}
          />

          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(163, 230, 53, 0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(163, 230, 53, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 85%)'
            }}
          />

          <div className="absolute -left-24 top-1/4 w-96 h-96 bg-[#A3E635]/8 rounded-full blur-3xl" />
          <div className="absolute -right-24 top-1/3 w-96 h-96 bg-[#A3E635]/8 rounded-full blur-3xl" />
        </div>

        {/* ======================================================== */}
        {/* 1. SQUAD FINDER: FIVE PLAYERS. ONE PLAN.                 */}
        {/* ======================================================== */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 mb-14">
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

        {/* Horizontal Divider Line between Squad Finder and Tactical Network */}
        <div className="w-full border-b border-white/[0.08] my-12" />

        {/* Tactical Bridge Bar */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 mb-10">
          <div className="flex flex-wrap items-center justify-between border border-[#1E2612]/90 rounded-2xl bg-[#0C1107]/80 backdrop-blur-md px-6 py-3 text-xs font-mono text-[#94A3B8] shadow-lg shadow-black/40">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A3E635]" />
              </span>
              <span className="text-[#A3E635] font-bold tracking-wider uppercase">// VORTEX COMPETITIVE NETWORK</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#A3E635]" />
                <span>FRANKFURT • STOCKHOLM • VIENNA</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#A3E635]">
                <Zap className="w-3.5 h-3.5" />
                <span>128-TICK SUB-TICK</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#A3E635]" />
                <span>KERNEL RING-0 INTEGRITY</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold font-mono">
              <span className="text-[#94A3B8]">STATUS:</span>
              <span className="px-2 py-0.5 rounded-full bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40 text-[11px]">
                ONLINE &bull; 0% PACKET LOSS
              </span>
            </div>
          </div>
        </div>

        {/* Cards Container */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: 128-Tick */}
            <div className="relative p-8 rounded-3xl bg-[#0A0E07]/80 backdrop-blur-xl border border-[#233013]/90 hover:border-[#A3E635]/70 hover:shadow-[0_0_35px_rgba(163,230,53,0.22)] transition-all duration-300 group shadow-2xl flex flex-col justify-between gap-6 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A3E635]/10 rounded-full blur-2xl group-hover:bg-[#A3E635]/25 transition-all pointer-events-none" />
              
              <div className="w-14 h-14 rounded-2xl bg-[#16210A] border border-[#2D3E14] flex items-center justify-center text-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-all">
                <Server className="w-7 h-7" />
              </div>

              <div>
                <div className="text-2xl font-black font-display text-white tracking-wide">Dedicated 128-Tick</div>
                <p className="text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                  Frankfurt, Vienna & Stockholm nodes running customized sub-tick optimizations for seamless bullet registration.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#A3E635] font-bold pt-2 border-t border-[#1C2511]/80">
                <span>AVERAGE PING &lt; 15MS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Kernel Anti-Cheat */}
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

            {/* Card 3: Skins & Prize Pools */}
            <div className="relative p-8 rounded-3xl bg-[#0A0E07]/80 backdrop-blur-xl border border-[#233013]/90 hover:border-[#A3E635]/70 hover:shadow-[0_0_35px_rgba(163,230,53,0.22)] transition-all duration-300 group shadow-2xl flex flex-col justify-between gap-6 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A3E635]/10 rounded-full blur-2xl group-hover:bg-[#A3E635]/25 transition-all pointer-events-none" />

              <div className="w-14 h-14 rounded-2xl bg-[#16210A] border border-[#2D3E14] flex items-center justify-center text-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-all">
                <Gift className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#18210C] text-[#A3E635] border border-[#A3E635]/40">
                    INSTANT STEAM P2P
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                    SKIN DROPS
                  </span>
                </div>
                <div className="text-2xl font-black font-display text-white tracking-wide uppercase">
                  SKINS & PRIZE POOLS
                </div>
                <p className="text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                  Compete for real prize pools awarded instantly to your wallet. Unlock daily free CS2 weapon cases and withdraw rare knives and skins directly to your Steam Trade URL.
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

          {/* Horizontal Divider Line between 3 Pillars and Pricing */}
          <div className="w-full border-b border-white/[0.08] my-12" />

          {/* ======================================================== */}
          {/* 5. VORTEX PREMIUM & VIP PASS TIERS + PAYMENTS SHOWCASE    */}
          {/* ======================================================== */}
          <div className="w-full flex flex-col items-center pt-8">
            
            <div className="text-center max-w-2xl mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#A3E635] uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                <span>LEVEL UP YOUR COMPETITIVE CAREER</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
                VORTEX PREMIUM & VIP PASS
              </h2>
              <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
                Choose the competitive tier that fits your ambition. From free official matchmaking to private 128-tick team scrims and monthly €5,000 cash prize cups.
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
                      <span>128-Tick Frankfurt Dedicated Nodes</span>
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

                  <h3 className="text-2xl font-black font-display text-white mb-2">VORTEX PREMIUM</h3>
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
                      <span>2x Vortex Coin Drops & Daily Free Weapon Case</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#A3E635] shrink-0" />
                      <span>0% Fee on P2P Skin Market Withdrawals</span>
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

                  <h3 className="text-2xl font-black font-display text-white mb-2">VORTEX VIP ELITE</h3>
                  <p className="text-xs text-slate-400 mb-6">On-demand 128-tick private scrim servers and instant bank/crypto cashouts.</p>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-4xl font-black font-display text-cyan-400">
                      {billingCycle === 'monthly' ? '€14.99' : '€11.99'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/ month</span>
                  </div>

                  <ul className="space-y-3.5 text-xs text-slate-200 font-sans">
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-bold">Private Dedicated 128-Tick Scrim Server</span>
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
                      <span>5x Daily Weapon Cases & 2x Knife Drop Multiplier</span>
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
          <div className="relative p-10 rounded-3xl bg-gradient-to-r from-[#12180B]/90 via-[#0F1409]/90 to-[#0A0E06]/90 backdrop-blur-xl border border-[#253314] hover:border-[#A3E635]/60 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-black/60 transition duration-300 overflow-hidden">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#A3E635]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2 text-center lg:text-left relative z-10">
              <div className="text-xs font-mono font-bold text-[#A3E635] tracking-widest uppercase flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                <span>READY TO COMPETE ON VORTEX?</span>
              </div>
              <h3 className="text-3xl font-black font-display text-white">
                Connect your Steam Account and Enter the Arena Today
              </h3>
              <p className="text-sm text-[#94A3B8]">
                No credit card required. Free tier includes daily matchmaking and scrim lobbies.
              </p>
            </div>

            <button
              onClick={handleSteamLogin}
              className="relative z-10 px-10 py-4 rounded-full bg-[#A3E635] hover:bg-[#BEF264] text-black font-display font-black text-sm tracking-wider uppercase flex items-center gap-3 shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:shadow-[0_0_40px_rgba(163,230,53,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0 outline-none focus:outline-none focus:ring-0"
            >
              <SteamIcon className="w-4 h-4 fill-black text-black" />
              <span>Login with Steam</span>
            </button>
          </div>

        </div>

      </section>

      {/* Map Selected Toast Notification */}
      {selectedMap && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#131620] border border-[#A3E635] px-5 py-3 rounded-2xl shadow-2xl shadow-lime-500/20 backdrop-blur-md">
          <div className="w-3 h-3 rounded-full bg-[#A3E635] animate-ping" />
          <div className="text-xs font-mono">
            <span className="text-[#94A3B8]">SELECTED MAP: </span>
            <span className="text-white font-bold uppercase">{selectedMap} // 128-Tick Node Ready</span>
          </div>
        </div>
      )}

      {/* CS2 Cinematic Trailer Modal */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#0D0F16] border border-[#A3E635]/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#1E2436] bg-[#121520]">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#A3E635] fill-[#A3E635]" />
                <span className="font-display font-black text-white text-sm">VORTEX // CS2 COMPETITIVE TRAILER</span>
              </div>
              <button 
                onClick={() => { sound.playClick(); setShowTrailerModal(false); }}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#94A3B8] hover:text-white transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <img 
                src="/images/maps/de_mirage.jpg" 
                alt="Trailer Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
              />
              <div className="relative z-10 space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-full bg-[#A3E635]/20 border border-[#A3E635] flex items-center justify-center mx-auto text-[#A3E635] shadow-[0_0_30px_rgba(163,230,53,0.5)]">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h3 className="text-2xl font-black font-display text-white">THE NEXT EVOLUTION OF CS2</h3>
                <p className="text-xs text-[#94A3B8] font-sans">
                  Experience true sub-tick consistency, automated prize payouts, and kernel anti-cheat security.
                </p>
                <button
                  onClick={() => {
                    setShowTrailerModal(false);
                    handleSteamLogin();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#A3E635] hover:bg-[#BEF264] text-black font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-lime-600/30 cursor-pointer"
                >
                  Join VORTEX Now
                </button>
              </div>
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
                  {authRequiredModal.tier === 'vip' ? 'VORTEX VIP ELITE PASS' : 'VORTEX PREMIUM PASS'}
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

    </div>
  );
};
