import React, { useState } from 'react';
import { 
  BarChart2, 
  Server, 
  Trophy, 
  Swords, 
  Crosshair, 
  Compass, 
  Award, 
  ShieldCheck, 
  User, 
  Crown, 
  ArrowRight,
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  X,
  CheckCircle2,
  Zap,
  ExternalLink,
  Flame,
  Star,
  Users,
  Gift
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
  userGamerTag = 'bLocKeeRz',
  avatarUrl = 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
  onNavigateTab,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<VortexTab>('dashboard');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [connectToast, setConnectToast] = useState<{ name: string; ip: string } | null>(null);

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
    <div className="w-full min-h-screen bg-[#07080B] text-[#F1F5F9] font-sans flex flex-col justify-start items-center selection:bg-red-500/30 selection:text-white">
      
      {/* ======================================================== */}
      {/* 1. MAIN PIXEL-PERFECT DASHBOARD VIEW (WHEN TAB = DASHBOARD) */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' ? (
        <div className="w-full max-w-[1920px] mx-auto relative select-none">
          <div className="relative w-full aspect-[1672/443] overflow-hidden shadow-2xl">
            <img 
              src="/images/vortex_dashboard_reference.jpg" 
              alt="VORTEX Gaming Dashboard" 
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* ==================================================== */}
            {/* INTERACTIVE HOTSPOTS FOR DASHBOARD                   */}
            {/* ==================================================== */}

            {/* Logo (Top Left) */}
            <button
              onClick={() => { sound.playClick(); setActiveTab('dashboard'); }}
              className="absolute z-20 cursor-pointer rounded-lg hover:ring-2 hover:ring-[#EF4444]/40 transition"
              style={{ left: '0.90%', top: '2.0%', width: '10.47%', height: '8.0%' }}
              title="VORTEX Home"
            />

            {/* Sidebar: Dashboard */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('dashboard'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:bg-white/5 transition"
              style={{ left: '0.90%', top: '15.35%', width: '10.47%', height: '8.13%' }}
              title="Dashboard"
            />

            {/* Sidebar: Server Browser */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('servers'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:ring-1 hover:ring-[#EF4444] hover:bg-[#EF4444]/10 transition"
              style={{ left: '0.90%', top: '24.83%', width: '10.47%', height: '7.22%' }}
              title="Dedicated Server Browser"
            />

            {/* Sidebar: Tournaments */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('tournaments'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:ring-1 hover:ring-[#EF4444] hover:bg-[#EF4444]/10 transition"
              style={{ left: '0.90%', top: '33.41%', width: '10.47%', height: '7.22%' }}
              title="Tournaments & Brackets"
            />

            {/* Sidebar: Scrims */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('scrims'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:ring-1 hover:ring-[#EF4444] hover:bg-[#EF4444]/10 transition"
              style={{ left: '0.90%', top: '41.99%', width: '10.47%', height: '7.22%' }}
              title="5v5 Team Scrims"
            />

            {/* Sidebar: 1v1 Aim */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('aim'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:ring-1 hover:ring-[#EF4444] hover:bg-[#EF4444]/10 transition"
              style={{ left: '0.90%', top: '50.56%', width: '10.47%', height: '7.22%' }}
              title="1v1 Aim Ladder"
            />

            {/* Sidebar: Lineups */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('lineups'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:ring-1 hover:ring-[#EF4444] hover:bg-[#EF4444]/10 transition"
              style={{ left: '0.90%', top: '59.14%', width: '10.47%', height: '7.22%' }}
              title="Grenade Lineups"
            />

            {/* Sidebar: Rankings */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('rankings'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:ring-1 hover:ring-[#EF4444] hover:bg-[#EF4444]/10 transition"
              style={{ left: '0.90%', top: '67.72%', width: '10.47%', height: '7.22%' }}
              title="FACEIT & Global Rankings"
            />

            {/* Sidebar: Anti-Cheat */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('anticheat'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:ring-1 hover:ring-[#EF4444] hover:bg-[#EF4444]/10 transition"
              style={{ left: '0.90%', top: '76.30%', width: '10.47%', height: '7.22%' }}
              title="Kernel Anti-Cheat Status"
            />

            {/* Sidebar: Profile */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('profile'); }}
              className="absolute z-20 cursor-pointer rounded-xl hover:ring-1 hover:ring-[#EF4444] hover:bg-[#EF4444]/10 transition"
              style={{ left: '0.90%', top: '84.88%', width: '10.47%', height: '7.22%' }}
              title="Gamer Profile Passport"
            />

            {/* Sidebar: Go Premium */}
            <button
              onClick={() => { sound.playTournamentVictory(); setShowPremiumModal(true); }}
              className="absolute z-20 cursor-pointer rounded-2xl hover:ring-2 hover:ring-amber-400 hover:scale-[1.02] transition"
              style={{ left: '0.90%', top: '92.10%', width: '10.47%', height: '7.22%' }}
              title="Unlock VORTEX Premium"
            />

            {/* Top Bar: Bell Notifications */}
            <button
              onClick={() => { sound.playClick(); setNotificationsOpen(!notificationsOpen); }}
              className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition"
              style={{ left: '88.5%', top: '2.0%', width: '2.5%', height: '6.5%' }}
              title="Notifications"
            />

            {/* Top Bar: Profile Pill / Dropdown */}
            <button
              onClick={() => { sound.playClick(); setProfileDropdownOpen(!profileDropdownOpen); }}
              className="absolute z-20 cursor-pointer rounded-full hover:ring-1 hover:ring-[#EF4444] transition"
              style={{ left: '91.5%', top: '1.5%', width: '7.5%', height: '7.5%' }}
              title="User Account"
            />

            {/* Connect Server 1: FACEIT Premium Server (Mirage) */}
            <button
              onClick={() => handleConnectServer('194.163.159.231:27015', 'FACEIT Premium Server (Mirage)')}
              className="absolute z-20 cursor-pointer rounded-full hover:ring-2 hover:ring-white hover:scale-105 hover:shadow-[0_0_15px_#EF4444] transition duration-150"
              style={{ left: '44.74%', top: '51.47%', width: '4.19%', height: '6.32%' }}
              title="Connect to FACEIT Premium Server [de_mirage]"
            />

            {/* Connect Server 2: Vortex 128-Tick Competitive (Inferno) */}
            <button
              onClick={() => handleConnectServer('194.163.159.231:27016', 'Vortex 128-Tick | Competitive (Inferno)')}
              className="absolute z-20 cursor-pointer rounded-full hover:ring-2 hover:ring-white hover:scale-105 hover:shadow-[0_0_15px_#EF4444] transition duration-150"
              style={{ left: '44.74%', top: '63.21%', width: '4.19%', height: '6.32%' }}
              title="Connect to Vortex 128-Tick [de_inferno]"
            />

            {/* Connect Server 3: Vortex Practice Server (Dust2) */}
            <button
              onClick={() => handleConnectServer('194.163.159.231:27017', 'Vortex Practice Server (Dust2)')}
              className="absolute z-20 cursor-pointer rounded-full hover:ring-2 hover:ring-white hover:scale-105 hover:shadow-[0_0_15px_#EF4444] transition duration-150"
              style={{ left: '44.74%', top: '74.94%', width: '4.19%', height: '6.32%' }}
              title="Connect to Vortex Practice [de_dust2]"
            />

            {/* Popular Servers "View All ->" */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('servers'); }}
              className="absolute z-20 cursor-pointer rounded hover:ring-1 hover:ring-[#EF4444] transition"
              style={{ left: '45.75%', top: '43.34%', width: '3.59%', height: '4.51%' }}
              title="View All Servers"
            />

            {/* Upcoming Tournaments "View All ->" */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('tournaments'); }}
              className="absolute z-20 cursor-pointer rounded hover:ring-1 hover:ring-[#EF4444] transition"
              style={{ left: '77.15%', top: '43.34%', width: '3.59%', height: '4.51%' }}
              title="View All Tournaments"
            />

            {/* Upcoming Tournament Card (VORTEX CS2 TOURNAMENT) */}
            <button
              onClick={() => { sound.playSelect(); setActiveTab('tournaments'); }}
              className="absolute z-20 cursor-pointer rounded-2xl hover:ring-2 hover:ring-[#EF4444]/60 transition"
              style={{ left: '51.73%', top: '49.21%', width: '29.01%', height: '33.86%' }}
              title="VORTEX CS2 TOURNAMENT - Starts in 2d 14h 32m"
            />

            {/* Bottom Right: "Go Premium ->" Button */}
            <button
              onClick={() => { sound.playTournamentVictory(); setShowPremiumModal(true); }}
              className="absolute z-20 cursor-pointer rounded-full hover:ring-2 hover:ring-white hover:scale-105 transition duration-150"
              style={{ left: '88.82%', top: '84.65%', width: '5.68%', height: '6.32%' }}
              title="Go Premium Now"
            />

          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* 2. SUB-PAGES (SERVERS, TOURNAMENTS, RANKINGS, PROFILE, ETC) */
        /* ======================================================== */
        <div className="w-full max-w-[1720px] mx-auto flex flex-col md:flex-row gap-6 p-6 min-h-[90vh]">
          
          {/* Subpage Left Sidebar */}
          <aside className="w-full md:w-64 bg-[#0E1017] border border-[#202536] rounded-3xl p-5 flex flex-col justify-between shrink-0 shadow-xl">
            <div>
              <div 
                onClick={() => { sound.playClick(); setActiveTab('dashboard'); }}
                className="flex items-center gap-3 cursor-pointer group mb-8 px-2"
              >
                <img 
                  src="/images/vortex_logo_clean.png" 
                  alt="VORTEX" 
                  className="h-8 object-contain"
                />
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sound.playSelect();
                        setActiveTab(item.id);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold font-sans transition cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#241217] text-white border-r-2 border-[#EF4444]'
                          : 'text-[#94A3B8] hover:text-white hover:bg-[#151924]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#EF4444]' : 'text-[#64748B]'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={() => { sound.playTournamentVictory(); setShowPremiumModal(true); }}
              className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#241217] to-[#12141C] border border-amber-500/40 hover:border-amber-400 text-left transition cursor-pointer group shadow-lg"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-display font-black mb-1">
                <Crown className="w-4 h-4" />
                <span>Go Premium</span>
              </div>
              <p className="text-[10px] text-[#94A3B8]">Unlock priority matchmaking & stats</p>
            </button>
          </aside>

          {/* Subpage Content Area */}
          <main className="flex-1 bg-[#0E1017] border border-[#202536] rounded-3xl p-6 md:p-8 shadow-xl">
            
            {/* SERVER BROWSER */}
            {activeTab === 'servers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white">VORTEX 128-Tick Dedicated Server Grid</h2>
                    <p className="text-xs text-[#94A3B8]">Direct low-latency CS2 nodes verified across Frankfurt, Vienna, and Stockholm</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
                  >
                    ← Back to Dashboard
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'FACEIT Premium Server', map: 'de_mirage', ip: '194.163.159.231:27015', players: '16/20', ping: '12ms', loc: 'Frankfurt, DE' },
                    { name: 'Vortex 128-Tick | Competitive', map: 'de_inferno', ip: '194.163.159.231:27016', players: '14/20', ping: '18ms', loc: 'Vienna, AT' },
                    { name: 'Vortex Practice Server', map: 'de_dust2', ip: '194.163.159.231:27017', players: '12/20', ping: '20ms', loc: 'Frankfurt, DE' },
                    { name: 'Vortex Retake Arena #1', map: 'de_nuke', ip: '194.163.159.231:27018', players: '9/10', ping: '14ms', loc: 'Stockholm, SE' },
                    { name: 'Vortex 1v1 Aim Ladder', map: 'aim_redline', ip: '194.163.159.231:27019', players: '14/16', ping: '15ms', loc: 'Frankfurt, DE' },
                    { name: 'Vortex High-ELO 5v5 Scrim', map: 'de_anubis', ip: '194.163.159.231:27020', players: '10/10', ping: '11ms', loc: 'Frankfurt, DE' },
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
                        <span className="text-xs font-mono text-slate-300">{s.players}</span>
                        <button
                          onClick={() => handleConnectServer(s.ip, s.name)}
                          className="px-4 py-2 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-black font-display text-xs transition cursor-pointer shadow-sm"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOURNAMENTS */}
            {activeTab === 'tournaments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white">VORTEX CS2 TOURNAMENT CIRCUIT</h2>
                    <p className="text-xs text-[#94A3B8]">Automated bracket matchmaking and instant prize distributions</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
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
                          className="px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-display font-black text-xs uppercase transition shadow-md cursor-pointer"
                        >
                          Register Team
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RANKINGS */}
            {activeTab === 'rankings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white">Global & Regional Rankings</h2>
                    <p className="text-xs text-[#94A3B8]">Verified FACEIT ELO and official player passports</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
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

            {/* ANTI-CHEAT */}
            {activeTab === 'anticheat' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white">VORTEX Kernel Anti-Cheat Protection</h2>
                    <p className="text-xs text-[#94A3B8]">Ring-0 hardware enforcement and driver integrity monitor</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
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

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white">Gamer Passport // {userGamerTag}</h2>
                    <p className="text-xs text-[#94A3B8]">Verified Steam & FACEIT credentials</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
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

            {/* SCRIMS / AIM / LINEUPS FALLBACK */}
            {(activeTab === 'scrims' || activeTab === 'aim' || activeTab === 'lineups') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white capitalize">{activeTab} Arena</h2>
                    <p className="text-xs text-[#94A3B8]">Automated 128-tick matchmaking lobby</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 rounded-xl bg-[#141722] border border-[#252C3D] text-xs font-mono hover:text-white cursor-pointer"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
                <div className="p-8 rounded-3xl bg-[#12141C] border border-[#23293B] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-[#EF4444]/30 flex items-center justify-center mx-auto text-[#EF4444]">
                    <Swords className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Live Matchmaking Queue Open</h3>
                  <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                    Searching for balanced 128-tick CS2 lobbies based on your verified FACEIT Level 5 rating.
                  </p>
                  <button
                    onClick={() => handleConnectServer('194.163.159.231:27015', 'Quick Scrim Arena')}
                    className="px-6 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-black font-display text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
                  >
                    Find Match Now
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      )}

      {/* Connect Server Toast Notification */}
      {connectToast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#131620] border border-[#EF4444] px-5 py-3 rounded-2xl shadow-2xl shadow-red-500/30">
          <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-ping" />
          <div className="text-xs font-mono">
            <div className="text-white font-bold">CONNECTING TO CS2 SERVER...</div>
            <div className="text-emerald-400 text-[11px]">connect {connectToast.ip} (Copied to clipboard)</div>
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {profileDropdownOpen && (
        <div className="fixed right-8 top-16 w-52 rounded-2xl bg-[#141722] border border-[#283042] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 text-xs text-white font-bold border-b border-[#283042] mb-1 flex items-center justify-between">
            <span>{userGamerTag}</span>
            <span className="text-[10px] text-amber-400 font-mono">Level 5</span>
          </div>
          <button
            onClick={() => {
              sound.playSelect();
              setProfileDropdownOpen(false);
              setActiveTab('profile');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>View Passport</span>
          </button>
          {onLogout && (
            <button
              onClick={() => {
                sound.playClick();
                setProfileDropdownOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      )}

      {/* Notifications Drawer */}
      {notificationsOpen && (
        <div className="fixed right-8 top-16 w-80 rounded-2xl bg-[#141722] border border-[#283042] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#283042]">
            <span className="text-xs font-bold text-white uppercase font-mono">Notifications (2)</span>
            <button onClick={() => setNotificationsOpen(false)} className="text-[#94A3B8] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 rounded-xl bg-[#0D0F15] border border-[#1E2333] text-xs">
            <div className="text-emerald-400 font-bold mb-1">FACEIT Match Confirmed</div>
            <div className="text-[#94A3B8] text-[11px]">Ranked match on de_mirage begins in 5 minutes.</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0D0F15] border border-[#1E2333] text-xs">
            <div className="text-[#EF4444] font-bold mb-1">Tournament Registration Open</div>
            <div className="text-[#94A3B8] text-[11px]">VORTEX CS2 TOURNAMENT starts in 2d 14h.</div>
          </div>
        </div>
      )}

      {/* VORTEX Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0E1017] border border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-display font-black text-lg">
                <Crown className="w-5 h-5" />
                <span>VORTEX PREMIUM</span>
              </div>
              <button 
                onClick={() => { sound.playClick(); setShowPremiumModal(false); }}
                className="p-1 rounded-full hover:bg-white/10 text-[#94A3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Priority 128-tick matchmaking server queue</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Exclusive participation in €25,000+ Major Cups</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Advanced FACEIT ELO analytics and heatmaps</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Golden Crown badge on your Gamer Passport</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTournamentVictory();
                setShowPremiumModal(false);
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Upgrade to Premium (€5.99 / mo)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
