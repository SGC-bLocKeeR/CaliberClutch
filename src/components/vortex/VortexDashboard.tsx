import React, { useState } from 'react';
import { 
  Menu,
  Bell, 
  ChevronDown, 
  Crown, 
  Trophy, 
  Server, 
  Swords, 
  Crosshair, 
  Compass, 
  Award, 
  ShieldCheck, 
  User, 
  BarChart2, 
  Star, 
  Zap, 
  Gift, 
  Users, 
  ArrowRight,
  Flame,
  LogOut,
  ExternalLink,
  Copy,
  CheckCircle2,
  Calendar,
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface VortexDashboardProps {
  userGamerTag?: string;
  avatarUrl?: string;
  onNavigateTab?: (tabName: string) => void;
  onOpenGoPremium?: () => void;
  onLogout?: () => void;
}

export type VortexTab = 
  | 'dashboard' 
  | 'servers' 
  | 'tournaments' 
  | 'scrims' 
  | 'aim' 
  | 'lineups' 
  | 'rankings' 
  | 'anticheat' 
  | 'profile';

export const VortexDashboard: React.FC<VortexDashboardProps> = ({
  userGamerTag = 'CSPlayer',
  avatarUrl = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
  onNavigateTab,
  onOpenGoPremium,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<VortexTab>('dashboard');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [copiedServer, setCopiedServer] = useState<string | null>(null);

  const handleConnectServer = (ip: string, serverName: string) => {
    sound.playTournamentVictory();
    const cmd = `connect ${ip}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).catch(() => {});
    }
    setCopiedServer(serverName);
    setTimeout(() => setCopiedServer(null), 2500);

    // Also trigger Steam protocol connect
    window.location.href = `steam://connect/${ip}`;
  };

  const navItems = [
    { id: 'dashboard' as VortexTab, label: 'Dashboard', icon: BarChart2 },
    { id: 'servers' as VortexTab, label: 'Server Browser', icon: Server },
    { id: 'tournaments' as VortexTab, label: 'Tournaments', icon: Trophy },
    { id: 'scrims' as VortexTab, label: 'Scrims', icon: Swords },
    { id: 'aim' as VortexTab, label: '1v1 Aim', icon: Crosshair },
    { id: 'lineups' as VortexTab, label: 'Lineups', icon: Compass },
    { id: 'rankings' as VortexTab, label: 'Rankings', icon: Award },
    { id: 'anticheat' as VortexTab, label: 'Anti-Cheat', icon: ShieldCheck },
    { id: 'profile' as VortexTab, label: 'Profile', icon: User },
  ];

  return (
    <div className="w-full min-h-screen bg-[#090A0E] text-[#F1F5F9] font-sans flex overflow-x-hidden selection:bg-red-500/30 selection:text-white">
      
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR (EXACT MATCH TO VORTEX REFERENCE)        */}
      {/* ======================================================== */}
      <aside className="w-56 lg:w-60 bg-[#0E1017] border-r border-[#202536] flex flex-col justify-between shrink-0 p-4 min-h-screen select-none">
        <div>
          {/* Logo: VORTEX Red V Crest */}
          <div 
            onClick={() => { sound.playClick(); setActiveTab('dashboard'); }}
            className="flex items-center gap-2.5 px-3 py-2 cursor-pointer group mb-6"
          >
            <img 
              src="/images/vortex_logo_clean.png" 
              alt="VORTEX" 
              className="h-7 object-contain drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)] group-hover:brightness-110 transition-all"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playSelect();
                    setActiveTab(item.id);
                    if (onNavigateTab) onNavigateTab(item.id);
                  }}
                  className={`w-full relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold font-sans transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#241217] text-white shadow-sm'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#151924]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#EF4444]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>

                  {/* Active Crimson Red Neon Bar on Far Right Edge */}
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.85)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card: Go Premium */}
        <div 
          onClick={() => {
            sound.playTournamentVictory();
            if (onOpenGoPremium) onOpenGoPremium();
          }}
          className="p-3.5 rounded-2xl bg-[#141722] border border-[#252C3D] hover:border-[#EF4444] transition-all cursor-pointer group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#F59E0B]">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black font-display text-white tracking-wide group-hover:text-[#EF4444] transition">
                  Go Premium
                </div>
                <div className="text-[10px] text-[#94A3B8]">
                  Unlock exclusive features
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#EF4444] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                           */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-16 border-b border-[#202536] px-6 flex items-center justify-between bg-[#0E1017]/90 backdrop-blur-md sticky top-0 z-40">
          <button 
            onClick={() => sound.playClick()}
            className="p-2 rounded-lg hover:bg-[#161A26] text-[#94A3B8] hover:text-white transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => sound.playClick()}
              className="p-2 rounded-full hover:bg-[#161A26] text-[#94A3B8] hover:text-white transition cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] absolute top-1.5 right-1.5 shadow-[0_0_6px_#EF4444]" />
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#141722] border border-[#252C3D] cursor-pointer hover:border-[#EF4444] transition relative"
            >
              <img 
                src={avatarUrl} 
                alt={userGamerTag} 
                className="w-6 h-6 rounded-full object-cover border border-[#EF4444]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg';
                }}
              />
              <span className="text-xs font-bold text-white font-mono">{userGamerTag}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-11 w-44 rounded-xl bg-[#141722] border border-[#283042] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-xs text-white font-bold border-b border-[#283042] mb-1">
                    {userGamerTag}
                  </div>
                  {onLogout && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto max-w-[1720px] mx-auto w-full">
          
          {/* TAB 1: MAIN DASHBOARD VIEW (MATCHING BOTTOM REFERENCE) */}
          {activeTab === 'dashboard' && (
            <>
              {/* ROW 1: WELCOME HERO BANNER */}
              <div className="relative w-full rounded-3xl bg-[#12141C] border border-[#23293B] p-6 sm:p-8 overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Red Tactical Diagonal Stripes in Banner Background */}
                <div className="absolute left-1/3 top-0 bottom-0 w-48 opacity-25 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 150 120" preserveAspectRatio="none">
                    <polygon points="40,0 80,0 50,120 10,120" fill="#EF4444" />
                    <polygon points="90,0 130,0 100,120 60,120" fill="#991B1B" />
                  </svg>
                </div>

                {/* Soldier Background Graphic (Center-Right in Red Lighting) */}
                <div className="absolute right-1/4 top-0 bottom-0 w-80 pointer-events-none opacity-50">
                  <img 
                    src="/images/welcome_soldier_vortex.png" 
                    alt="Vortex Operative" 
                    className="w-full h-full object-cover filter contrast-110"
                  />
                </div>
                
                {/* Left: Avatar Badge & Greeting */}
                <div className="flex items-center gap-4 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#24141A] to-[#141219] border-2 border-[#EF4444] p-1 flex items-center justify-center shadow-lg shadow-[#EF4444]/25">
                    <div className="w-full h-full rounded-xl bg-[#0E0F15] flex items-center justify-center">
                      <span className="text-xl font-black font-display text-[#EF4444]">V</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wide">
                      Welcome back, {userGamerTag}!
                    </h2>
                    <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                      Good to see you on VORTEX. Keep grinding!
                    </p>
                  </div>
                </div>

                {/* Right: Quick Player Stats */}
                <div className="flex items-center gap-6 sm:gap-8 z-10 font-mono">
                  <div className="flex items-center gap-2.5">
                    <BarChart2 className="w-5 h-5 text-[#EF4444]" />
                    <div>
                      <div className="text-lg font-black text-white leading-tight">2,480</div>
                      <div className="text-[10px] text-[#94A3B8] uppercase">Matches</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-lg font-black text-white leading-tight">68%</div>
                      <div className="text-[10px] text-[#94A3B8] uppercase">Win Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Star className="w-5 h-5 text-[#EF4444] fill-[#EF4444]" />
                    <div>
                      <div className="text-lg font-black text-white leading-tight">Level 5</div>
                      <div className="text-[10px] text-[#94A3B8] uppercase">FACEIT</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ROW 2: 3-COLUMN TACTICAL HUB */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* COLUMN 1: POPULAR SERVERS (Span 5) */}
                <div className="lg:col-span-5 rounded-3xl bg-[#12141C] border border-[#23293B] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold font-display text-white tracking-wide">
                        Popular Servers
                      </h3>
                      <button 
                        onClick={() => { sound.playClick(); setActiveTab('servers'); }}
                        className="text-xs font-bold text-[#EF4444] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Server Rows */}
                    <div className="space-y-3">
                      
                      {/* Server 1: FACEIT Premium Server */}
                      <div className="p-3 rounded-2xl bg-[#0D0F15] border border-[#1E2333] hover:border-[#EF4444] transition flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                            <Flame className="w-3.5 h-3.5 text-[#EF4444]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">FACEIT Premium Server</div>
                            <div className="text-[10px] text-[#94A3B8]">Mirage</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-mono text-slate-300">16 / 20</span>
                          <span className="text-[11px] font-mono text-[#EF4444] font-bold">12ms</span>
                          <button
                            onClick={() => handleConnectServer('194.163.159.231:27015', 'FACEIT Premium')}
                            className="px-3.5 py-1.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-black font-display text-xs transition cursor-pointer shadow-sm"
                          >
                            {copiedServer === 'FACEIT Premium' ? 'COPIED!' : 'Connect'}
                          </button>
                        </div>
                      </div>

                      {/* Server 2: Vortex 128-Tick | Competitive */}
                      <div className="p-3 rounded-2xl bg-[#0D0F15] border border-[#1E2333] hover:border-[#EF4444] transition flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                            <Zap className="w-3.5 h-3.5 text-[#EF4444]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">Vortex 128-Tick | Competitive</div>
                            <div className="text-[10px] text-[#94A3B8]">Inferno</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-mono text-slate-300">14 / 20</span>
                          <span className="text-[11px] font-mono text-[#EF4444] font-bold">18ms</span>
                          <button
                            onClick={() => handleConnectServer('194.163.159.231:27015', 'Vortex 128-Tick')}
                            className="px-3.5 py-1.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-black font-display text-xs transition cursor-pointer shadow-sm"
                          >
                            {copiedServer === 'Vortex 128-Tick' ? 'COPIED!' : 'Connect'}
                          </button>
                        </div>
                      </div>

                      {/* Server 3: Vortex Practice Server */}
                      <div className="p-3 rounded-2xl bg-[#0D0F15] border border-[#1E2333] hover:border-[#EF4444] transition flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                            <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">Vortex Practice Server</div>
                            <div className="text-[10px] text-[#94A3B8]">Dust2</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-mono text-slate-300">12 / 20</span>
                          <span className="text-[11px] font-mono text-[#EF4444] font-bold">20ms</span>
                          <button
                            onClick={() => handleConnectServer('194.163.159.231:27015', 'Vortex Practice')}
                            className="px-3.5 py-1.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-black font-display text-xs transition cursor-pointer shadow-sm"
                          >
                            {copiedServer === 'Vortex Practice' ? 'COPIED!' : 'Connect'}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* COLUMN 2: UPCOMING TOURNAMENTS (Span 4) */}
                <div className="lg:col-span-4 rounded-3xl bg-[#12141C] border border-[#23293B] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold font-display text-white tracking-wide">
                        Upcoming Tournaments
                      </h3>
                      <button 
                        onClick={() => { sound.playClick(); setActiveTab('tournaments'); }}
                        className="text-xs font-bold text-[#EF4444] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* VORTEX CS2 Tournament Trophy Card */}
                    <div 
                      onClick={() => {
                        sound.playSelect();
                        setActiveTab('tournaments');
                      }}
                      className="relative rounded-2xl bg-[#0D0F15] border border-[#1E2333] overflow-hidden p-5 h-44 flex flex-col justify-between cursor-pointer group hover:border-[#EF4444] transition-all"
                    >
                      {/* Glowing Trophy Art Background */}
                      <div className="absolute right-0 top-0 bottom-0 w-40 pointer-events-none opacity-85">
                        <img 
                          src="/images/trophy_vortex.png" 
                          alt="Major Trophy" 
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                        />
                      </div>

                      <div className="z-10">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#EF4444] font-bold tracking-widest uppercase mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                          <span>VORTEX</span>
                        </div>
                        <div className="text-xl font-black font-display text-white tracking-wide leading-tight">
                          VORTEX CS2 TOURNAMENT
                        </div>
                      </div>

                      <div className="z-10 flex items-center gap-1.5 text-xs font-mono text-[#94A3B8]">
                        <span>Starts in:</span>
                        <span className="text-white font-bold">2d 14h 32m</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: ONLINE PLAYERS GRAPH (Span 3) */}
                <div className="lg:col-span-3 rounded-3xl bg-[#12141C] border border-[#23293B] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold font-display text-white tracking-wide">
                        Online Players
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#EF4444]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-mono font-bold">242,276</span>
                      </div>
                    </div>

                    {/* Crimson Red Wave Line Graph */}
                    <div className="w-full h-24 my-2 flex items-center justify-center">
                      <svg viewBox="0 0 200 80" className="w-full h-full">
                        <defs>
                          <linearGradient id="vortexWaveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M 0 50 Q 30 55, 60 40 T 120 30 T 170 15 T 200 20 L 200 80 L 0 80 Z" 
                          fill="url(#vortexWaveGrad)" 
                        />
                        <path 
                          d="M 0 50 Q 30 55, 60 40 T 120 30 T 170 15 T 200 20" 
                          fill="none" 
                          stroke="#EF4444" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                        />
                      </svg>
                    </div>
                  </div>

                  {/* 128-Tick Experience Pill */}
                  <div className="p-2.5 rounded-xl bg-[#0D0F15] border border-[#1E2333] flex items-center gap-2 text-xs font-mono">
                    <Zap className="w-4 h-4 text-[#EF4444]" />
                    <div className="leading-tight">
                      <div className="font-bold text-white">128-Tick</div>
                      <div className="text-[10px] text-[#94A3B8]">Best Experience</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ROW 3: BOTTOM STATS PILLS & VORTEX PREMIUM BANNER */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                
                {/* Pill 1: Active Matches */}
                <div className="p-4 rounded-2xl bg-[#12141C] border border-[#23293B] flex items-center gap-3.5 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-[#1E1720] border border-[#341F2B] flex items-center justify-center text-[#EF4444]">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Active Matches</div>
                    <div className="text-xl font-black font-mono text-white">1,248</div>
                  </div>
                </div>

                {/* Pill 2: Total Prize Pool */}
                <div className="p-4 rounded-2xl bg-[#12141C] border border-[#23293B] flex items-center gap-3.5 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Total Prize Pool</div>
                    <div className="text-xl font-black font-mono text-white">€25,000+</div>
                  </div>
                </div>

                {/* Pill 3: Community */}
                <div className="p-4 rounded-2xl bg-[#12141C] border border-[#23293B] flex items-center gap-3.5 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-[#1E1720] border border-[#341F2B] flex items-center justify-center text-[#EF4444]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Community</div>
                    <div className="text-xl font-black font-mono text-white">128K+ Players</div>
                  </div>
                </div>

                {/* Banner 4: VORTEX PREMIUM */}
                <div 
                  onClick={() => {
                    sound.playTournamentVictory();
                    if (onOpenGoPremium) onOpenGoPremium();
                  }}
                  className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-[#1E141A] to-[#12141C] border border-[#EF4444]/40 hover:border-[#EF4444] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md group"
                >
                  {/* Operative Silhouette in background */}
                  <div className="absolute right-20 top-0 bottom-0 w-24 pointer-events-none opacity-40">
                    <img 
                      src="/images/premium_soldier_vortex.png" 
                      alt="Premium" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-3 z-10">
                    <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-black font-display text-white tracking-wide">
                        VORTEX PREMIUM
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        Get more. Play better.
                      </div>
                    </div>
                  </div>

                  <button className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black font-display text-xs transition cursor-pointer flex items-center gap-1 shadow-sm shrink-0 z-10">
                    <span>Go Premium</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: SERVER BROWSER VIEW */}
          {activeTab === 'servers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black font-display text-white">Dedicated CS2 Server Browser</h2>
                  <p className="text-xs text-[#94A3B8]">Direct low-latency 128-tick matchmaking nodes across Europe</p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'VORTEX 128-Tick | Competitive 5v5', map: 'de_mirage', ip: '194.163.159.231:27015', players: '16/20', ping: '12ms', loc: 'Frankfurt, DE' },
                  { name: 'VORTEX Retake Arena #1', map: 'de_inferno', ip: '194.163.159.231:27016', players: '9/10', ping: '14ms', loc: 'Vienna, AT' },
                  { name: 'VORTEX FFA Deathmatch | 128-Tick', map: 'de_dust2', ip: '194.163.159.231:27017', players: '18/20', ping: '18ms', loc: 'Frankfurt, DE' },
                  { name: 'VORTEX 1v1 Aim Ladder', map: 'aim_redline', ip: '194.163.159.231:27018', players: '12/16', ping: '15ms', loc: 'Stockholm, SE' },
                  { name: 'VORTEX Execute Practice Server', map: 'de_nuke', ip: '194.163.159.231:27019', players: '8/10', ping: '20ms', loc: 'Frankfurt, DE' },
                  { name: 'FACEIT Verified High-ELO Hub', map: 'de_anubis', ip: '194.163.159.231:27020', players: '10/10', ping: '11ms', loc: 'Frankfurt, DE' },
                ].map((s, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#12141C] border border-[#23293B] hover:border-[#EF4444] transition flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-[#EF4444] font-bold uppercase">{s.loc}</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">{s.ping}</span>
                      </div>
                      <h4 className="text-base font-bold font-display text-white">{s.name}</h4>
                      <p className="text-xs font-mono text-[#94A3B8] mt-1">Map: {s.map}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#1C2233]">
                      <span className="text-xs font-mono text-slate-300">{s.players} Players</span>
                      <button
                        onClick={() => handleConnectServer(s.ip, s.name)}
                        className="px-4 py-2 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-black font-display text-xs transition cursor-pointer shadow-sm"
                      >
                        {copiedServer === s.name ? 'COPIED!' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TOURNAMENTS VIEW */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black font-display text-white">Competitive Tournament Circuit</h2>
                  <p className="text-xs text-[#94A3B8]">Automated bracket matchmaking powered by FACEIT Open API v4</p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { title: 'VORTEX Major Championship 2026', prize: '€10,000', teams: '32 / 32', date: 'LIVE NOW', status: 'IN PROGRESS', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
                  { title: 'VORTEX CS2 Balkan Open Cup', prize: '€5,000', teams: '16 / 16', date: 'Starts in: 2d 14h', status: 'OPEN', badge: 'bg-red-500/15 text-red-400 border-red-500/30' },
                  { title: 'IEM Katowice 2026 Community Qualifier', prize: '€7,500', teams: '48 / 64', date: 'Starts in: 5d 08h', status: 'REGISTRATION', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
                  { title: 'VORTEX Weekly 128-Tick Scrimfest', prize: '€2,500', teams: '12 / 16', date: 'Starts Saturday', status: 'REGISTER', badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
                ].map((t, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-[#12141C] border border-[#23293B] hover:border-[#EF4444] transition flex flex-col justify-between gap-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${t.badge}`}>{t.status}</span>
                        <h3 className="text-xl font-black font-display text-white mt-3">{t.title}</h3>
                        <p className="text-xs font-mono text-[#94A3B8] mt-1">{t.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black font-mono text-[#EF4444]">{t.prize}</div>
                        <div className="text-[10px] text-[#94A3B8] uppercase">Prize Pool</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#1C2233]">
                      <span className="text-xs font-mono text-slate-300">Slots: {t.teams}</span>
                      <button
                        onClick={() => sound.playTournamentVictory()}
                        className="px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-display font-black text-xs uppercase transition shadow-md"
                      >
                        Register Team
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RANKINGS & LEADERBOARD VIEW */}
          {activeTab === 'rankings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black font-display text-white">Global & Regional Rankings</h2>
                  <p className="text-xs text-[#94A3B8]">Verified FACEIT ELO and official player passports</p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="rounded-3xl bg-[#12141C] border border-[#23293B] overflow-hidden shadow-xl">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="border-b border-[#1E2333] text-[11px] font-mono font-bold text-[#94A3B8] uppercase bg-[#0D0F15]">
                      <th className="py-3 px-6">Rank</th>
                      <th className="py-3 px-6">Player</th>
                      <th className="py-3 px-6">Country</th>
                      <th className="py-3 px-6">FACEIT Level</th>
                      <th className="py-3 px-6">ELO Rating</th>
                      <th className="py-3 px-6">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181D2C] text-sm">
                    {[
                      { rank: '#1', tag: 'bLocKeeRz', country: 'Kosovo', flag: '🇽🇰', level: 'Level 7', elo: 1394, winrate: '58.9%' },
                      { rank: '#2', tag: 's1mple', country: 'Ukraine', flag: '🇺🇦', level: 'Level 10', elo: 3840, winrate: '68.2%' },
                      { rank: '#3', tag: 'm0NESY', country: 'Russia', flag: '🏳️', level: 'Level 10', elo: 3620, winrate: '66.4%' },
                      { rank: '#4', tag: 'ZywOo', country: 'France', flag: '🇫🇷', level: 'Level 10', elo: 3580, winrate: '65.1%' },
                      { rank: '#5', tag: 'NiKo', country: 'Bosnia', flag: '🇧🇦', level: 'Level 10', elo: 3410, winrate: '63.8%' },
                    ].map((p, idx) => (
                      <tr key={idx} className="hover:bg-[#161A26] transition">
                        <td className="py-4 px-6 font-mono font-black text-[#EF4444]">{p.rank}</td>
                        <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>{p.tag}</span>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-300">{p.flag} {p.country}</td>
                        <td className="py-4 px-6 font-bold text-amber-400">{p.level}</td>
                        <td className="py-4 px-6 font-mono font-bold text-white">{p.elo}</td>
                        <td className="py-4 px-6 font-mono text-emerald-400">{p.winrate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ANTI-CHEAT STATUS VIEW */}
          {activeTab === 'anticheat' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black font-display text-white">VORTEX Kernel Anti-Cheat Protection</h2>
                  <p className="text-xs text-[#94A3B8]">Ring-0 hardware enforcement and driver integrity monitor</p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#12141C] border border-[#23293B]">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Kernel Driver Active</h3>
                  <p className="text-xs text-[#94A3B8] mt-1">vortex_kernel_ac.sys verified and running without anomalies.</p>
                </div>

                <div className="p-6 rounded-3xl bg-[#12141C] border border-[#23293B]">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[#EF4444] mb-4">
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

          {/* TAB 6: PROFILE VIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black font-display text-white">Gamer Passport // {userGamerTag}</h2>
                  <p className="text-xs text-[#94A3B8]">Verified Steam & FACEIT credentials</p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-[#12141C] border border-[#23293B] flex flex-col md:flex-row items-center gap-6">
                <img 
                  src={avatarUrl} 
                  alt={userGamerTag} 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#EF4444] shadow-lg shadow-[#EF4444]/25"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black font-display text-white">{userGamerTag}</h3>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">VORTEX VERIFIED</span>
                  </div>
                  <p className="text-xs font-mono text-[#94A3B8] mt-1">Country: Kosovo 🇽🇰 | Primary Game: Counter-Strike 2</p>
                  
                  <div className="mt-4 flex items-center gap-6 font-mono text-xs">
                    <div>
                      <span className="text-[#94A3B8]">FACEIT ELO: </span>
                      <span className="text-white font-bold">1,394</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Matches: </span>
                      <span className="text-white font-bold">2,480</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Win Rate: </span>
                      <span className="text-emerald-400 font-bold">68.0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
