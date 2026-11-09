import React from 'react';
import { 
  Home, 
  Trophy, 
  Server, 
  BarChart2, 
  Info, 
  Sun, 
  Play, 
  Zap, 
  ShieldCheck, 
  Users, 
  Swords, 
  Shield, 
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

// Official Steam Glyphed SVG Icon
const SteamIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.979 0C5.378 0 0 5.378 0 11.979c0 5.094 3.197 9.444 7.72 11.162l3.415-4.707a3.42 3.42 0 0 1-1.028-2.457c0-.285.035-.561.1-.825l-2.457-1.78a5.53 5.53 0 0 1-.09-.997c0-3.056 2.483-5.54 5.54-5.54 3.056 0 5.54 2.484 5.54 5.54 0 3.057-2.484 5.54-5.54 5.54l-2.585 3.56c.26.04.526.064.795.064 6.6 0 11.979-5.378 11.979-11.979C23.958 5.378 18.58 0 11.979 0z"/>
  </svg>
);

// High-fidelity Country Flags for Windows OS (Prevents "IT", "EG", "DE" regional indicator fallback)
const ItalyFlag = () => (
  <svg className="w-4 h-2.5 rounded-[2px] overflow-hidden shadow-sm inline-block shrink-0" viewBox="0 0 3 2">
    <rect width="1" height="2" fill="#009246" />
    <rect width="1" height="2" x="1" fill="#FFFFFF" />
    <rect width="1" height="2" x="2" fill="#CE2B37" />
  </svg>
);

const EgyptFlag = () => (
  <svg className="w-4 h-2.5 rounded-[2px] overflow-hidden shadow-sm inline-block shrink-0" viewBox="0 0 3 2">
    <rect width="3" height="0.66" y="0" fill="#C8102E" />
    <rect width="3" height="0.67" y="0.66" fill="#FFFFFF" />
    <rect width="3" height="0.67" y="1.33" fill="#000000" />
    <circle cx="1.5" cy="1" r="0.18" fill="#C59B4B" />
  </svg>
);

const GermanyFlag = () => (
  <svg className="w-4 h-2.5 rounded-[2px] overflow-hidden shadow-sm inline-block shrink-0" viewBox="0 0 3 2">
    <rect width="3" height="0.66" y="0" fill="#000000" />
    <rect width="3" height="0.67" y="0.66" fill="#DD0000" />
    <rect width="3" height="0.67" y="1.33" fill="#FFCE00" />
  </svg>
);

interface VortexLandingPageProps {
  onLoginWithSteam: () => void;
  onNavigateToTournaments?: () => void;
  onNavigateToServers?: () => void;
  onNavigateToLeaderboard?: () => void;
  onNavigateToAbout?: () => void;
}

export const VortexLandingPage: React.FC<VortexLandingPageProps> = ({
  onLoginWithSteam,
  onNavigateToTournaments,
  onNavigateToServers,
  onNavigateToLeaderboard,
  onNavigateToAbout
}) => {
  return (
    <div className="w-full min-h-screen bg-[#0A0B0E] text-[#F1F5F9] font-sans flex flex-col selection:bg-red-500/30 selection:text-white">
      
      {/* ======================================================== */}
      {/* HERO SECTION: INTEGRATED PANORAMIC CS2 BATTLEFIELD       */}
      {/* 100% MATCHING VORTEX DESIGN REFERENCE                     */}
      {/* ======================================================== */}
      <section 
        className="relative w-full overflow-hidden border-b border-[#22171A]"
        style={{
          backgroundImage: "url('/images/vortex_hero_backdrop.jpg')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Soft top & bottom atmospheric vignettes */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#0A0B0E]/70 to-transparent pointer-events-none z-0" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0A0B0E] to-transparent pointer-events-none z-0" />

        {/* Ambient Crimson Red Volumetric Illumination centered on operative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] bg-[#EF4444]/12 blur-[140px] rounded-full pointer-events-none z-0" />

        {/* Content Container (max-w-[1660px] matching reference canvas) */}
        <div className="w-full max-w-[1660px] mx-auto px-6 sm:px-10 lg:px-12 pt-3 pb-10 relative z-10 flex flex-col justify-between min-h-[500px]">
          
          {/* ==================================================== */}
          {/* 1. TOP NAVBAR INSIDE THE PANORAMIC HEADER            */}
          {/* ==================================================== */}
          <header className="w-full flex items-center justify-between pb-8 pt-1 relative z-30">
            
            {/* Brand Logo: Stylized Red V Crest + VORTEX text */}
            <div 
              onClick={() => sound.playClick()}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <img 
                src="/images/vortex_logo_clean.png" 
                alt="VORTEX" 
                className="h-8 sm:h-9 object-contain drop-shadow-[0_2px_12px_rgba(239,68,68,0.5)] group-hover:brightness-110 transition-all"
              />
            </div>

            {/* Center Floating Pill Menu */}
            <nav className="hidden md:flex items-center gap-1 bg-[#13151D]/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#232738] shadow-xl">
              <button
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A1215] border border-[#EF4444]/50 text-[#EF4444] text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-[#EF4444]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (onNavigateToTournaments) onNavigateToTournaments();
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-[#201518] text-[#94A3B8] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Tournaments</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (onNavigateToServers) onNavigateToServers();
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-[#201518] text-[#94A3B8] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Scrims</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (onNavigateToLeaderboard) onNavigateToLeaderboard();
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-[#201518] text-[#94A3B8] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Leaderboards</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (onNavigateToAbout) onNavigateToAbout();
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-[#201518] text-[#94A3B8] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>About</span>
              </button>
            </nav>

            {/* Right Controls: Sun Toggle & Login with Steam */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => sound.playClick()}
                className="p-2 rounded-full hover:bg-[#181B26] text-[#94A3B8] hover:text-white transition cursor-pointer"
                title="Theme Toggle"
              >
                <Sun className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onLoginWithSteam();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#13151D]/90 hover:bg-[#20161A] border border-[#2B3042] hover:border-[#EF4444] text-white text-xs font-bold transition shadow-md cursor-pointer group"
              >
                <SteamIcon className="w-3.5 h-3.5 text-[#EF4444] group-hover:scale-110 transition-transform" />
                <span>Login with Steam</span>
              </button>
            </div>
          </header>

          {/* ==================================================== */}
          {/* 2. HERO MAIN CONTENT: HEADLINE, SOLDIER, 3D CARDS    */}
          {/* ==================================================== */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-20">
            
            {/* LEFT COLUMN: HEADLINE, DESCRIPTION, BUTTONS, FEATURES */}
            <div className="w-full lg:max-w-xl xl:max-w-2xl z-20">
              
              {/* Category Tag with Red Dot */}
              <div className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#EF4444] uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                <span className="text-[#94A3B8]">COUNTER-STRIKE 2 PLATFORM</span>
              </div>

              {/* Giant Slanted Headline: STRICTLY TWO ROWS */}
              {/* Row 1: CHALLENGE (Chrome metallic gradient) */}
              {/* Row 2: YOUR CS2 (Vibrant Crimson Red) + GAME (Chrome metallic gradient) */}
              <h1 className="font-display font-black tracking-tight leading-[0.92] text-5xl sm:text-6xl lg:text-[74px] mb-5 select-none transform -skew-x-[4deg]">
                
                {/* Row 1 */}
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#8E9CAE] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                  CHALLENGE
                </span>

                {/* Row 2 */}
                <span className="flex items-center gap-3.5 whitespace-nowrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#F87171] via-[#EF4444] to-[#B91C1C] drop-shadow-[0_0_35px_rgba(239,68,68,0.55)]">
                    YOUR CS2
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#8E9CAE] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                    GAME
                  </span>
                </span>
              </h1>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-[15px] text-[#94A3B8] leading-relaxed mb-7 max-w-lg font-sans">
                Join VORTEX – the ultimate platform for CS2 players. Play on premium servers, participate in tournaments and climb the ranks!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Primary Button: Solid Crimson Red Login with Steam */}
                <button
                  onClick={() => {
                    sound.playTournamentVictory();
                    onLoginWithSteam();
                  }}
                  className="px-7 py-3 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-display font-black text-xs tracking-wider uppercase flex items-center gap-2.5 shadow-[0_0_25px_rgba(239,68,68,0.45)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <SteamIcon className="w-4 h-4 fill-white text-white" />
                  <span>Login with Steam</span>
                </button>

                {/* Secondary Button: Dark Pill Watch Trailer */}
                <button
                  onClick={() => {
                    sound.playSelect();
                    if (onNavigateToTournaments) onNavigateToTournaments();
                  }}
                  className="px-7 py-3 rounded-full bg-[#13151D]/90 hover:bg-[#201518] border border-[#3A1E24] hover:border-[#EF4444] text-white font-display font-bold text-xs tracking-wider uppercase flex items-center gap-2.5 transition cursor-pointer backdrop-blur-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" />
                  <span>Watch Trailer</span>
                </button>
              </div>

              {/* 4 Features Row: STRICTLY ONE HORIZONTAL LINE */}
              <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#E2E8F0] font-sans whitespace-nowrap pt-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#EF4444]" />
                  <span className="font-medium">128-Tick Servers</span>
                </div>

                <div className="h-3.5 w-[1px] bg-[#2C2128]" />

                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#EF4444]" />
                  <span className="font-medium">Competitive Tournaments</span>
                </div>

                <div className="h-3.5 w-[1px] bg-[#2C2128]" />

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#EF4444]" />
                  <span className="font-medium">Anti-Cheat Protection</span>
                </div>

                <div className="h-3.5 w-[1px] bg-[#2C2128]" />

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#EF4444]" />
                  <span className="font-medium">Active Community</span>
                </div>
              </div>

            </div>

            {/* CENTER SPACER: The operative soldier is integrated in the background panorama */}
            <div className="hidden lg:block flex-1 min-w-[140px] pointer-events-none" />

            {/* RIGHT COLUMN: 3D MAP CARDS (INFERNO, MIRAGE, NUKE) */}
            <div className="flex flex-col items-center gap-4 z-20 shrink-0">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                
                {/* Card 1: INFERNO */}
                <div 
                  onClick={() => {
                    sound.playSelect();
                    onLoginWithSteam();
                  }}
                  className="w-28 sm:w-32 h-60 sm:h-68 rounded-2xl bg-[#14151C]/95 border border-[#282126] p-1.5 flex flex-col justify-between overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
                >
                  <div className="relative w-full h-48 sm:h-54 rounded-xl overflow-hidden">
                    <img 
                      src="/images/maps/de_inferno.jpg" 
                      alt="Inferno" 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500 filter brightness-90"
                    />
                  </div>
                  <div className="py-1 px-1.5 flex items-center justify-between">
                    <div className="text-[11px] font-black font-display text-white tracking-wider">
                      INFERNO
                    </div>
                    <ItalyFlag />
                  </div>
                </div>

                {/* Card 2: MIRAGE (CENTER HERO CARD, GLOWING RED CRIMSON BORDER) */}
                <div 
                  onClick={() => {
                    sound.playSelect();
                    onLoginWithSteam();
                  }}
                  className="w-36 sm:w-40 h-68 sm:h-80 rounded-2xl bg-[#1A1318]/95 border-2 border-[#EF4444] p-1.5 flex flex-col justify-between overflow-hidden shadow-[0_0_35px_rgba(239,68,68,0.55)] z-20 transform -translate-y-3.5 hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
                >
                  <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden">
                    <img 
                      src="/images/maps/de_mirage.jpg" 
                      alt="Mirage" 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500 filter brightness-95"
                    />
                  </div>
                  <div className="py-1 px-1.5 flex items-center justify-between">
                    <div className="text-xs font-black font-display text-white tracking-wider flex items-center gap-1.5">
                      <span>MIRAGE</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                    </div>
                    <EgyptFlag />
                  </div>
                </div>

                {/* Card 3: NUKE */}
                <div 
                  onClick={() => {
                    sound.playSelect();
                    onLoginWithSteam();
                  }}
                  className="w-28 sm:w-32 h-60 sm:h-68 rounded-2xl bg-[#14151C]/95 border border-[#282126] p-1.5 flex flex-col justify-between overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
                >
                  <div className="relative w-full h-48 sm:h-54 rounded-xl overflow-hidden">
                    <img 
                      src="/images/maps/de_nuke.jpg" 
                      alt="Nuke" 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500 filter brightness-90"
                    />
                  </div>
                  <div className="py-1 px-1.5 flex items-center justify-between">
                    <div className="text-[11px] font-black font-display text-white tracking-wider">
                      NUKE
                    </div>
                    <GermanyFlag />
                  </div>
                </div>

              </div>

              {/* Slider Pagination Dashes */}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-4 h-1 rounded-full bg-[#272A38]" />
                <span className="w-8 h-1 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                <span className="w-4 h-1 rounded-full bg-[#272A38]" />
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* 3. ADDITIONAL RICH LANDING CONTENT (SERVERS, TOURNAMENTS)*/}
      {/* ======================================================== */}
      <div className="w-full max-w-[1660px] mx-auto px-6 sm:px-10 lg:px-12 py-12 space-y-12">
        
        {/* Live Community Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#201519] border border-[#3E1D24] flex items-center justify-center text-[#EF4444]">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black font-display text-white">Dedicated 128-Tick</div>
              <div className="text-xs text-[#94A3B8] mt-0.5">Frankfurt, Vienna & Stockholm nodes</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#201519] border border-[#3E1D24] flex items-center justify-center text-[#EF4444]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black font-display text-white">Kernel Anti-Cheat</div>
              <div className="text-xs text-[#94A3B8] mt-0.5">Hardware-enforced competitive integrity</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#201519] border border-[#3E1D24] flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black font-display text-white">€25,000+ Prize Pool</div>
              <div className="text-xs text-[#94A3B8] mt-0.5">Instant automated prize payouts to Steam</div>
            </div>
          </div>
        </div>

        {/* Call to Action Bar */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#17141D] via-[#1B141C] to-[#12131A] border border-[#341F28] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="text-xs font-mono font-bold text-[#EF4444] tracking-widest uppercase mb-1">
              READY TO COMPETE ON VORTEX?
            </div>
            <h3 className="text-2xl font-black font-display text-white">
              Connect your Steam Account and Enter the Arena Today
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playTournamentVictory();
              onLoginWithSteam();
            }}
            className="px-8 py-3.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-display font-black text-xs tracking-wider uppercase flex items-center gap-2.5 shadow-[0_0_25px_rgba(239,68,68,0.45)] transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <SteamIcon className="w-4 h-4 fill-white text-white" />
            <span>Login with Steam</span>
          </button>
        </div>

      </div>

    </div>
  );
};
