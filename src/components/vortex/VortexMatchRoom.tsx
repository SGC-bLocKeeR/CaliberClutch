import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Clock, 
  Trophy, 
  Radio, 
  RotateCcw,
  MoreVertical,
  Headphones,
  Send,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Share2,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Flame,
  Zap,
  TrendingUp,
  TrendingDown,
  Shield
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { CountryFlag } from './CountryFlag';

export interface FaceitMatchPlayer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  elo: number;
  code: string;
  countryName: string;
  isCaptain?: boolean;
  verified?: boolean;
  matches: number;
  winRate: string;
  rating: string;
  swing: string;
  isPositiveSwing?: boolean;
  kda: string;
  kd: string;
  kr: string;
  adr: string;
  badgeIndex?: number;
}

interface VortexMatchRoomProps {
  matchId?: string;
  currentGamerTag: string;
  currentAvatarUrl?: string;
  partyMembers?: Array<{
    id: string;
    name: string;
    avatar?: string;
    level?: number;
    elo?: number;
    code?: string;
    countryName?: string;
    verification?: 'vip' | 'verified' | 'none';
  }>;
  onClose: () => void;
}

export interface MatchChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  team: 'team1' | 'team2' | 'system' | 'admin';
  isSystem?: boolean;
  isAdmin?: boolean;
  text: string;
  timestamp: string;
  code?: string;
}

const QUICK_TACTICAL_PHRASES = [
  "GL HF! 👊",
  "Ban Vertigo please ❌",
  "I play AWP on Mirage 🎯",
  "Connect fast to server 🚀",
  "Nice map pick! 🔥",
  "Good comms team 🎙️"
];

export const VortexMatchRoom: React.FC<VortexMatchRoomProps> = ({
  matchId = 'VTX-89421',
  currentGamerTag = 'bLocKeeRz',
  currentAvatarUrl,
  partyMembers = [],
  onClose
}) => {
  // Navigation Tabs: OVERVIEW vs STATS
  const [activeTab, setActiveTab] = useState<'overview' | 'stats'>('overview');

  // Veto & Match state
  const [isVetoTooltipOpen, setIsVetoTooltipOpen] = useState(false);
  const [matchState, setMatchState] = useState<'completed' | 'live' | 'veto'>('completed');
  const [copiedIp, setCopiedIp] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [connectCountdown, setConnectCountdown] = useState(285);

  // 3-Dots Menu & Live Support Modal
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedSupportIssue, setSelectedSupportIssue] = useState<string>('server_issue');
  const [supportCallSubmitted, setSupportCallSubmitted] = useState<boolean>(false);

  // Chat Drawer Toggle
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [chatTab, setChatTab] = useState<'match' | 'team'>('match');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<MatchChatMessage[]>([
    {
      id: 'init-2',
      sender: 'Rosen33',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      team: 'team1',
      code: 'SE',
      text: 'gg wp everyone, good comeback on T side!',
      timestamp: '00:02'
    },
    {
      id: 'init-3',
      sender: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      team: 'team2',
      code: 'XK',
      text: 'gg wp! Rosen played crazy on A site',
      timestamp: '00:02'
    },
    {
      id: 'init-4',
      sender: currentGamerTag,
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      team: 'team2',
      code: 'XK',
      text: 'gg wp nice game guys',
      timestamp: '00:03'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatDrawerOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatDrawerOpen, chatTab]);

  const serverIp = '185.107.96.42:27015';
  const consoleCmd = `connect ${serverIp}; password vortex`;

  // Exact 1:1 FACEIT Team 1 Players (Left Column)
  const team1Players: FaceitMatchPlayer[] = [
    {
      id: 'p1',
      name: 'Rosen33',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1967,
      code: 'SE',
      countryName: 'Sweden',
      verified: true,
      isCaptain: true,
      matches: 429,
      winRate: '43%',
      rating: '1.16',
      swing: '+0.96%',
      isPositiveSwing: true,
      kda: '17/16/5',
      kd: '1.07',
      kr: '0.81',
      adr: '88.1',
      badgeIndex: 1
    },
    {
      id: 'p2',
      name: 'stonken',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      level: 8,
      elo: 1589,
      code: 'SE',
      countryName: 'Sweden',
      verified: true,
      matches: 160,
      winRate: '46%',
      rating: '1.00',
      swing: '-1.82%',
      isPositiveSwing: false,
      kda: '14/17/5',
      kd: '0.80',
      kr: '0.64',
      adr: '73.9',
      badgeIndex: 2
    },
    {
      id: 'p3',
      name: 'wast3dtalen1',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1810,
      code: 'RU',
      countryName: 'Russia',
      verified: true,
      matches: 2085,
      winRate: '40%',
      rating: '1.08',
      swing: '-0.41%',
      isPositiveSwing: false,
      kda: '18/17/5',
      kd: '1.05',
      kr: '0.78',
      adr: '83.4',
      badgeIndex: 1
    },
    {
      id: 'p4',
      name: 'mxrty666',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1943,
      code: 'SE',
      countryName: 'Sweden',
      verified: true,
      matches: 1127,
      winRate: '46%',
      rating: '1.20',
      swing: '+1.58%',
      isPositiveSwing: true,
      kda: '18/15/5',
      kd: '1.16',
      kr: '0.84',
      adr: '87.7',
      badgeIndex: 1
    },
    {
      id: 'p5',
      name: 'zeryx666',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
      level: 8,
      elo: 1573,
      code: 'RU',
      countryName: 'Russia',
      verified: true,
      matches: 989,
      winRate: '50%',
      rating: '1.08',
      swing: '-0.34%',
      isPositiveSwing: false,
      kda: '14/15/4',
      kd: '0.93',
      kr: '0.67',
      adr: '69.9',
      badgeIndex: 1
    }
  ];

  // Exact 1:1 FACEIT Team 2 Players (Right Column including M18 and bLocKeeRz)
  const team2Players: FaceitMatchPlayer[] = [
    {
      id: 'op1',
      name: 'zimny',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      level: 9,
      elo: 1840,
      code: 'FR',
      countryName: 'France',
      verified: true,
      isCaptain: true,
      matches: 1119,
      winRate: '56%',
      rating: '1.18',
      swing: '+1.19%',
      isPositiveSwing: true,
      kda: '18/17/5',
      kd: '1.04',
      kr: '0.79',
      adr: '87.4',
      badgeIndex: 1
    },
    {
      id: 'op2',
      name: 'Nascar777',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      level: 10,
      elo: 2046,
      code: 'PL',
      countryName: 'Poland',
      verified: true,
      matches: 1261,
      winRate: '68%',
      rating: '1.23',
      swing: '+2.34%',
      isPositiveSwing: true,
      kda: '19/15/5',
      kd: '1.29',
      kr: '0.86',
      adr: '90.8',
      badgeIndex: 1
    },
    {
      id: 'op3',
      name: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      level: 10,
      elo: 2175,
      code: 'XK',
      countryName: 'Kosovo',
      verified: true,
      matches: 900,
      winRate: '56%',
      rating: '1.18',
      swing: '+1.44%',
      isPositiveSwing: true,
      kda: '19/16/6',
      kd: '1.16',
      kr: '0.82',
      adr: '90.3',
      badgeIndex: 69
    },
    {
      id: 'op4',
      name: currentGamerTag || 'bLocKeeRz',
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      level: 7,
      elo: 1433,
      code: 'XK',
      countryName: 'Kosovo',
      verified: true,
      matches: 1644,
      winRate: '43%',
      rating: '0.94',
      swing: '-2.90%',
      isPositiveSwing: false,
      kda: '13/17/6',
      kd: '0.77',
      kr: '0.58',
      adr: '70.8',
      badgeIndex: 1
    },
    {
      id: 'op5',
      name: 'Zalevvo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      level: 6,
      elo: 1253,
      code: 'UA',
      countryName: 'Ukraine',
      verified: true,
      matches: 480,
      winRate: '48%',
      rating: '0.90',
      swing: '-1.10%',
      isPositiveSwing: false,
      kda: '12/16/4',
      kd: '0.75',
      kr: '0.52',
      adr: '68.4',
      badgeIndex: 3
    }
  ];

  // Map Veto Exact List (as shown in user screenshot)
  const vetoHistoryList = [
    { step: 1, text: 'team_Rosen33 banned Cache', isDecided: false },
    { step: 2, text: 'team_Zalevvo banned Inferno', isDecided: false },
    { step: 3, text: 'team_Rosen33 banned Nuke', isDecided: false },
    { step: 4, text: 'team_Zalevvo banned Ancient', isDecided: false },
    { step: 5, text: 'team_Rosen33 banned Mirage', isDecided: false },
    { step: 6, text: 'team_Zalevvo banned Dust2', isDecided: false },
    { step: 7, text: 'Anubis picked by default', isDecided: true }
  ];

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyIp = () => {
    sound.playClick();
    navigator.clipboard?.writeText?.(consoleCmd);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2500);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    sound.playChatMessage();
    const newMsg: MatchChatMessage = {
      id: `usr-${Date.now()}`,
      sender: currentGamerTag,
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      team: 'team2',
      code: 'XK',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      const botReplies = [
        { sender: 'M18', text: 'nice round bLocKeeRz!', team: 'team2' as const },
        { sender: 'Rosen33', text: 'gg wp! great flash assists', team: 'team1' as const },
        { sender: 'Nascar777', text: 'queue next match guys?', team: 'team2' as const }
      ];
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: reply.sender,
          avatar: team1Players.concat(team2Players).find(p => p.name === reply.sender)?.avatar,
          team: reply.team,
          code: 'XK',
          text: reply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleSendPhrase = (phrase: string) => {
    setChatInput(phrase);
    setTimeout(() => {
      handleSendMessage();
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#0E0F12] text-[#E2E8F0] overflow-y-auto flex flex-col font-sans select-none animate-in fade-in duration-150">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER: Matchroom • OVERVIEW / STATS • 💬 🔗 ...   */}
      {/* ======================================================== */}
      <div className="w-full bg-[#111217] border-b border-[#1E2029] px-6 py-2.5 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-6">
          <span className="font-display font-black text-white text-base tracking-wide">
            Matchroom
          </span>

          {/* Center Tabs: OVERVIEW & STATS */}
          <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-wider">
            <button
              onClick={() => { sound.playClick(); setActiveTab('overview'); }}
              className={`pb-1 border-b-2 transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[#FF5500] text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              OVERVIEW
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('stats'); }}
              className={`pb-1 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'stats'
                  ? 'border-[#FF5500] text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>STATS</span>
              <span className="px-1.5 py-0.2 rounded bg-[#FF5500] text-black text-[9px] font-black uppercase">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* Right Action Icons: 💬 Chat, 🔗 Share, ... 3-Dots Menu */}
        <div className="flex items-center gap-2">
          
          {/* Chat Toggle Icon */}
          <button
            onClick={() => {
              sound.playClick();
              setIsChatDrawerOpen(!isChatDrawerOpen);
            }}
            className={`p-2 rounded-lg transition cursor-pointer relative ${
              isChatDrawerOpen 
                ? 'bg-[#FF5500]/20 text-[#FF5500]' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
            title="Toggle Match Chat"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
          </button>

          {/* Share Link Icon */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer relative"
            title="Share Match Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#A3E635]" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* 3-DOTS MENU (Support & Leave) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-[#16171F] border border-[#262835] shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setIsMenuOpen(false);
                      setIsSupportModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] text-slate-200 hover:text-white text-xs font-mono transition text-left cursor-pointer"
                  >
                    <Headphones className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Support</span>
                  </button>

                  <div className="h-px bg-white/[0.06] my-1" />

                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsMenuOpen(false);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 text-xs font-mono transition text-left cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Leave Match Room</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Direct Close X Button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer ml-1"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MATCH SCORE & TEAMS BANNER (Authentic FACEIT Header)   */}
      {/* ======================================================== */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-4 pb-2">
        <div className="relative rounded-2xl overflow-hidden border border-[#232530] shadow-2xl bg-[#13141B]">
          
          {/* Panoramic Map Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/maps/de_mirage.jpg" 
              alt="Match Map" 
              className="w-full h-full object-cover opacity-25 filter blur-[1px]" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111218]/95 via-[#111218]/85 to-[#111218]/95" />
          </div>

          <div className="relative z-10 p-4 sm:p-5">
            {/* Top Sub-Header: Mode & Match Details */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-bold">Matchmaking / EU / Standard Match</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-bold border border-[#FF5500]/30">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <span>Anubis</span>
                </span>
                <span>•</span>
                <span>10 Nov</span>
                <span>🇩🇪</span>
              </div>
            </div>

            {/* Scoreboard: Team 1 (Rosen33) 13 vs 7 Team 2 (Zalevvo) */}
            <div className="grid grid-cols-1 md:grid-cols-12 items-center py-3 gap-4">
              
              {/* Left Team (Rosen33 - WINNER) */}
              <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-3.5 text-left md:text-right">
                <div className="order-2 md:order-1">
                  <div className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                    WINNER
                  </div>
                  <h2 className="text-xl font-display font-black text-white tracking-wide">
                    team_Rosen33
                  </h2>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center md:justify-end gap-2 mt-0.5">
                    <span>1,776</span>
                    <span>•</span>
                    <span>4,790 Matches</span>
                  </div>
                  {/* Detailed Team Stats Row */}
                  <div className="hidden lg:flex items-center justify-end gap-2 text-[10px] font-mono text-slate-400 mt-1">
                    <span>45% <span className="text-slate-500">Wins</span></span>
                    <span>1.10 <span className="text-slate-500">Rating</span></span>
                    <span className="text-red-400">-0.01% <span className="text-slate-500">Swing</span></span>
                    <span>1.00 <span className="text-slate-500">K/D</span></span>
                    <span>0.75 <span className="text-slate-500">K/R</span></span>
                    <span>80.6 <span className="text-slate-500">ADR</span></span>
                  </div>
                </div>

                <div className="order-1 md:order-2 relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-emerald-500 to-[#A3E635] shadow-[0_0_15px_rgba(52,211,153,0.4)] shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                    alt="team_Rosen33" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>
              </div>

              {/* Center Score */}
              <div className="md:col-span-2 text-center py-1">
                <div className="inline-flex items-center justify-center gap-3 px-5 py-2 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
                  <span className="text-3xl font-display font-black text-emerald-400">13</span>
                  <span className="text-xs font-mono uppercase text-slate-500 font-bold">vs</span>
                  <span className="text-3xl font-display font-black text-slate-400">7</span>
                </div>
              </div>

              {/* Right Team (Zalevvo / M18 / bLocKeeRz) */}
              <div className="md:col-span-5 flex items-center justify-start gap-3.5 text-left">
                <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-slate-600 to-slate-400 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" 
                    alt="team_Zalevvo" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>

                <div>
                  <h2 className="text-xl font-display font-black text-white tracking-wide">
                    team_Zalevvo
                  </h2>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>1,749</span>
                    <span>•</span>
                    <span>5,325 Matches</span>
                  </div>
                  {/* Detailed Team Stats Row */}
                  <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                    <span>56% <span className="text-slate-500">Wins</span></span>
                    <span>1.13 <span className="text-slate-500">Rating</span></span>
                    <span className="text-emerald-400">+0.36% <span className="text-slate-500">Swing</span></span>
                    <span>1.03 <span className="text-slate-500">K/D</span></span>
                    <span>0.75 <span className="text-slate-500">K/R</span></span>
                    <span>83.8 <span className="text-slate-500">ADR</span></span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. THREE-COLUMN BODY: Players Left • Center Info • Right */}
      {/* ======================================================== */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN (TEAM 1 PLAYERS - 5 CARDS)                  */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 px-1">
              Players
            </div>

            <div className="space-y-2">
              {team1Players.map(player => (
                <div 
                  key={player.id}
                  className="p-3 rounded-xl bg-[#14151D] border border-[#212330] hover:border-white/20 transition flex items-center gap-3 shadow-sm"
                >
                  {/* Left: Matches Count */}
                  <div className="w-12 text-center shrink-0 border-r border-white/5 pr-2">
                    <div className="text-xs font-mono font-bold text-white">{player.matches}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase">Matches</div>
                  </div>

                  {/* Center: Avatar & Names & Stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <CountryFlag code={player.code} name={player.countryName} size="xs" />
                        <span className="font-display font-bold text-white text-xs truncate">
                          {player.name}
                        </span>
                        {player.verified && (
                          <span className="text-emerald-400 text-[10px]">✓</span>
                        )}
                      </div>

                      {/* Level & Elo Badge */}
                      <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
                        <span className="text-slate-400 text-[11px]">~ {player.elo}</span>
                        <span className="w-5 h-5 rounded-md bg-[#252836] border border-white/10 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                          {player.level}
                        </span>
                      </div>
                    </div>

                    {/* Telemetry line (Last 30 matches) */}
                    <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                      <span>{player.winRate}</span>
                      <span>{player.rating}</span>
                      <span className={player.isPositiveSwing ? 'text-emerald-400' : 'text-red-400'}>
                        {player.swing}
                      </span>
                      <span>{player.kda}</span>
                      <span>{player.kd}</span>
                      <span>{player.kr}</span>
                      <span>{player.adr}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER COLUMN: Server • Map with ⓘ Veto Tooltip • CTA    */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Server Card */}
            <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#212330] space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Server</div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇩🇪</span>
                <span className="font-display font-bold text-white text-sm">Germany</span>
                <span className="text-[11px] font-mono text-slate-500">(Frankfurt 128-tick)</span>
              </div>
            </div>

            {/* Map Card with ⓘ Veto Popover */}
            <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#212330] space-y-2 relative">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Map</div>

                {/* THE ⓘ VETO BUTTON */}
                <div className="relative">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsVetoTooltipOpen(!isVetoTooltipOpen);
                    }}
                    onMouseEnter={() => setIsVetoTooltipOpen(true)}
                    className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition cursor-pointer px-2 py-0.5 rounded-md hover:bg-white/[0.06]"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Veto</span>
                  </button>

                  {/* FLOATING VETO TOOLTIP (EXACT COPY OF SCREENSHOT) */}
                  {isVetoTooltipOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsVetoTooltipOpen(false)} 
                      />
                      <div 
                        onMouseLeave={() => setIsVetoTooltipOpen(false)}
                        className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-[#101117] border border-[#2B2D3C] shadow-2xl z-50 text-xs font-mono space-y-1 animate-in fade-in zoom-in-95 duration-100"
                      >
                        {vetoHistoryList.map(item => (
                          <div 
                            key={item.step} 
                            className={`py-0.5 ${item.isDecided ? 'text-emerald-400 font-bold mt-1 pt-1 border-t border-white/5' : 'text-slate-300'}`}
                          >
                            <span>{item.step}. {item.text}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Map Thumbnail & Name */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img 
                    src="/images/maps/de_mirage.jpg" 
                    alt="Anubis" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <div className="font-display font-black text-white text-base leading-tight">
                    Anubis
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Active Duty Active Map
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Watch Demo & Back to Matchmaking */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  sound.playClick();
                  handleCopyIp();
                }}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>{copiedIp ? 'CONNECT IP COPIED!' : 'WATCH DEMO / COPY IP'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#FF6611] text-black font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>BACK TO MATCHMAKING</span>
              </button>
            </div>

            {/* Skin of the Match Sponsored Card (1:1 from screenshot) */}
            <div className="p-3.5 rounded-xl bg-[#14151D] border border-[#212330] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="font-bold uppercase tracking-wider text-slate-300">Skin Of The Match</span>
                <span className="text-[9px] text-slate-500">Powered by SKINPORT</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-black/40 border border-white/5">
                <div className="w-12 h-10 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🔪</span>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-red-400 truncate">
                    ★ Bayonet | Slaughter
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Minimal Wear • €283.69
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN (TEAM 2 PLAYERS - INCLUDING M18 & bLocKeeRz) */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 px-1">
              Players
            </div>

            <div className="space-y-2">
              {team2Players.map(player => (
                <div 
                  key={player.id}
                  className={`p-3 rounded-xl border transition flex items-center gap-3 shadow-sm ${
                    player.name === currentGamerTag 
                      ? 'bg-[#181B26] border-[#FF5500]/40 ring-1 ring-[#FF5500]/30' 
                      : 'bg-[#14151D] border-[#212330] hover:border-white/20'
                  }`}
                >
                  {/* Left: Matches Count */}
                  <div className="w-12 text-center shrink-0 border-r border-white/5 pr-2">
                    <div className="text-xs font-mono font-bold text-white">{player.matches}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase">Matches</div>
                  </div>

                  {/* Center: Avatar & Names & Stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <CountryFlag code={player.code} name={player.countryName} size="xs" />
                        <span className={`font-display font-bold text-xs truncate ${
                          player.name === currentGamerTag ? 'text-[#FF5500]' : 'text-white'
                        }`}>
                          {player.name}
                        </span>
                        {player.verified && (
                          <span className="text-emerald-400 text-[10px]">✓</span>
                        )}
                      </div>

                      {/* Level & Elo Badge */}
                      <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
                        <span className="text-slate-400 text-[11px]">~ {player.elo}</span>
                        <span className={`w-5 h-5 rounded-md border font-mono font-bold text-[10px] flex items-center justify-center ${
                          player.level === 10 
                            ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                            : 'bg-[#252836] border-white/10 text-white'
                        }`}>
                          {player.level}
                        </span>
                      </div>
                    </div>

                    {/* Telemetry line (Last 30 matches) */}
                    <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                      <span>{player.winRate}</span>
                      <span>{player.rating}</span>
                      <span className={player.isPositiveSwing ? 'text-emerald-400' : 'text-red-400'}>
                        {player.swing}
                      </span>
                      <span>{player.kda}</span>
                      <span>{player.kd}</span>
                      <span>{player.kr}</span>
                      <span>{player.adr}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. DOCKED / SLIDE-OVER MATCH CHAT (Toggled via 💬)       */}
      {/* ======================================================== */}
      {isChatDrawerOpen && (
        <div className="fixed bottom-4 right-4 z-[130] w-96 rounded-2xl bg-[#111218] border border-[#262835] shadow-2xl flex flex-col h-[520px] overflow-hidden animate-in slide-in-from-bottom-5 duration-150">
          
          {/* Chat Header */}
          <div className="p-3 bg-[#161722] border-b border-[#262835] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#FF5500]" />
              <span className="font-display font-bold text-white text-xs uppercase tracking-wide">
                Match Chat
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setChatTab(chatTab === 'match' ? 'team' : 'match')}
                className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-[10px] font-mono text-slate-300"
              >
                {chatTab === 'match' ? 'ALL (10)' : 'TEAM 2'}
              </button>
              <button
                onClick={() => setIsChatDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs font-sans">
            {chatMessages.map(msg => (
              <div key={msg.id} className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className={`font-bold ${msg.sender === currentGamerTag ? 'text-[#FF5500]' : 'text-slate-200'}`}>
                    {msg.sender}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.04] text-slate-200 text-xs">
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Phrases */}
          <div className="px-2.5 py-1.5 bg-black/40 border-t border-white/[0.04] flex items-center gap-1 overflow-x-auto no-scrollbar">
            {QUICK_TACTICAL_PHRASES.slice(0, 3).map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendPhrase(p)}
                className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-[#FF5500]/20 text-[9px] font-mono text-slate-300 whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-[#161722] border-t border-[#262835] flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white outline-none"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2 rounded-lg bg-[#FF5500] hover:bg-[#FF6611] disabled:opacity-40 text-black transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. LIVE MATCH SUPPORT MODAL (From 3-Dots Menu)           */}
      {/* ======================================================== */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-[#13141C] border border-[#2B2D3C] rounded-2xl p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-[#FF5500]" />
                <h3 className="font-display font-black text-white text-base uppercase">
                  Live Match Support
                </h3>
              </div>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!supportCallSubmitted ? (
              <div className="space-y-4">
                <div className="text-xs font-mono text-slate-300">
                  Select issue to dispatch a live FACEIT match admin:
                </div>
                <div className="space-y-2">
                  {[
                    'Server Unresponsive / Severe Packet Loss (EU-04)',
                    'Player Never Connected / AFK',
                    'VORTEX Anti-Cheat Integrity Issue',
                    'Report Match Problem'
                  ].map((issue, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        sound.playSelect();
                        setSelectedSupportIssue(issue);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                        selectedSupportIssue === issue 
                          ? 'bg-[#FF5500]/15 border-[#FF5500] text-white' 
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {issue}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    sound.playTournamentVictory();
                    setSupportCallSubmitted(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#FF5500] hover:bg-[#FF6611] text-black font-display font-black text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Call Live Admin
                </button>
              </div>
            ) : (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-white font-display font-bold text-sm uppercase">Admin Dispatched!</h4>
                <p className="text-xs font-mono text-slate-400">
                  Live match admin is connecting to server console EU-04.
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsSupportModalOpen(false);
                    setSupportCallSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/[0.08] text-xs font-mono text-white"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
