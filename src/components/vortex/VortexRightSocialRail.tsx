import React, { useState, useRef } from 'react';
import { 
  Bell, 
  Users, 
  UserPlus, 
  Search, 
  X, 
  ChevronDown, 
  ChevronRight,
  Headphones, 
  LogOut, 
  Plus, 
  PlusCircle, 
  Crown, 
  Smile, 
  ImageIcon, 
  CheckCircle2, 
  MessageSquare,
  UserCheck,
  User,
  Shield,
  Volume2
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { CountryFlag } from './CountryFlag';
import { FaceitVerificationBadge } from './VortexDashboard';

export interface SocialFriend {
  id: string;
  name: string;
  avatar: string;
  status: 'playing' | 'online' | 'offline';
  gameStatus?: string;
  hasPriority?: boolean;
  code?: string;
}

interface VortexRightSocialRailProps {
  currentGamerTag: string;
  currentAvatarUrl: string;
  currentClanTag?: string;
  currentVerification?: 'vip' | 'verified' | 'none';
  currentCountry?: { code: string; name: string };
  userMembershipTier?: 'free' | 'premium' | 'vip';
  partyMembers?: Array<{
    id: string;
    name: string;
    avatar?: string;
    tag?: string;
  } | null>;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onOpenInviteModal?: () => void;
  onOpenProfileTab?: () => void;
  onOpenEditProfile?: () => void;
  onLeaveParty?: () => void;
}

export const VortexRightSocialRail: React.FC<VortexRightSocialRailProps> = ({
  currentGamerTag,
  currentAvatarUrl,
  currentClanTag = 'VTX',
  currentVerification = 'vip',
  currentCountry = { code: 'XK', name: 'Kosovo' },
  userMembershipTier = 'vip',
  partyMembers = [],
  unreadNotificationsCount = 1,
  onOpenNotifications,
  onOpenInviteModal,
  onOpenProfileTab,
  onOpenEditProfile,
  onLeaveParty
}) => {
  // Drawer active state: 'none' | 'social' | 'party' | 'profile'
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'social' | 'party' | 'profile'>('none');
  const [socialSubTab, setSocialSubTab] = useState<'friends' | 'dms' | 'requests'>('friends');
  const [socialSearch, setSocialSearch] = useState('');
  const [partySubTab, setPartySubTab] = useState<'chat' | 'members' | 'voice'>('chat');
  
  // Party Chat Messages & Input
  const [partyChatInput, setPartyChatInput] = useState('');
  const [partyMessages, setPartyMessages] = useState<Array<{
    id: string;
    sender: string;
    avatar?: string;
    text?: string;
    imageUrl?: string;
    timestamp: string;
  }>>([]);
  const partyFileInputRef = useRef<HTMLInputElement>(null);

  // Exact 1:1 Friends List from User Reference Screenshot
  const friendsList: SocialFriend[] = [
    // Playing (1)
    {
      id: 'f-icy',
      name: 'Icykilleer',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      status: 'playing',
      gameStatus: 'Playing • CS2 MM (12m 45s)'
    },
    // Online (5)
    {
      id: 'f-ama',
      name: 'amatuero',
      avatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80',
      status: 'online'
    },
    {
      id: 'f-black',
      name: 'blackbars1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      status: 'online'
    },
    {
      id: 'f-diva',
      name: 'DIVA-',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      hasPriority: true
    },
    {
      id: 'f-feim',
      name: 'Feimmih',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      hasPriority: true
    },
    {
      id: 'f-ndyw',
      name: 'ndyw',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      hasPriority: true
    },
    // Offline (49)
    {
      id: 'f-rud',
      name: 'RudeusX',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      status: 'offline'
    },
    {
      id: 'f-dion',
      name: 'dionitt2h-',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      status: 'offline'
    },
    {
      id: 'f-zoz',
      name: 'Zozio',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      status: 'offline'
    },
    {
      id: 'f-ork',
      name: 'orkzz',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
      status: 'offline'
    },
    {
      id: 'f-shush',
      name: 'ShushALKO6',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      status: 'offline'
    },
    {
      id: 'f-qlira',
      name: 'QliraZ',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      status: 'offline'
    },
    {
      id: 'f-nissa',
      name: 'nissaS',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      status: 'offline'
    },
    {
      id: 'f-ana',
      name: 'Anastassiaa-',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      status: 'offline'
    }
  ];

  const handleSendPartyMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!partyChatInput.trim()) return;
    sound.playClick();
    const newMsg = {
      id: `party-msg-${Date.now()}`,
      sender: currentGamerTag,
      avatar: currentAvatarUrl,
      text: partyChatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    };
    setPartyMessages(prev => [...prev, newMsg]);
    setPartyChatInput('');
  };

  const handlePartyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;
      const newMsg = {
        id: `party-img-${Date.now()}`,
        sender: currentGamerTag,
        avatar: currentAvatarUrl,
        text: partyChatInput.trim() || undefined,
        imageUrl: dataUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
      };
      setPartyMessages(prev => [...prev, newMsg]);
      setPartyChatInput('');
      sound.playChatMessage();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const filteredFriends = friendsList.filter(f => 
    f.name.toLowerCase().includes(socialSearch.toLowerCase())
  );

  const playingFriends = filteredFriends.filter(f => f.status === 'playing');
  const onlineFriends = filteredFriends.filter(f => f.status === 'online');
  const offlineFriends = filteredFriends.filter(f => f.status === 'offline');

  return (
    <>
      {/* ======================================================== */}
      {/* 1. PERSISTENT RIGHT SIDEBAR (MATCHING USER SNIPPET WIDTH) */}
      {/* ======================================================== */}
      <aside className="fixed right-0 top-0 bottom-0 w-64 bg-[#08090D] border-l border-[#191C26] z-[80] flex flex-col justify-between p-3 select-none shadow-2xl">
        
        {/* TOP SECTION: User Profile Row - Exact 1:1 match to uploaded snippet */}
        <div className="w-full pb-3 border-b border-[#1A1D27]">
          <button
            onClick={() => {
              sound.playClick();
              setActiveDrawer(prev => prev === 'profile' ? 'none' : 'profile');
            }}
            className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-white/[0.05] transition cursor-pointer group"
            title="Player Profile"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-8 h-8 shrink-0">
                <img 
                  src={currentAvatarUrl} 
                  alt={currentGamerTag} 
                  className="w-full h-full rounded-full object-cover border-2 border-[#A3E635] shadow-[0_0_10px_rgba(163,230,53,0.3)] block"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/blockeerz_avatar.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#08090D]" />
              </div>
              <span className="font-display font-black text-sm text-white group-hover:text-[#A3E635] transition tracking-tight truncate">
                {currentGamerTag}
              </span>
              <FaceitVerificationBadge type={currentVerification} size="sm" />
              <CountryFlag code={currentCountry.code} name={currentCountry.name} size="xs" />
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ml-1 ${activeDrawer === 'profile' ? 'rotate-180 text-[#A3E635]' : ''}`} />
          </button>
        </div>

        {/* MIDDLE SECTION: Notifications • Social • Party Capsule */}
        <div className="flex flex-col gap-3 w-full flex-1 pt-3 overflow-y-auto">
          
          {/* Notifications Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNotifications?.();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white transition cursor-pointer group"
            title="Notifications"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#A3E635]" />
              <span className="text-xs font-bold font-sans">Notifications</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#A3E635] text-slate-950 font-mono font-black text-[10px] flex items-center justify-center shadow-md">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Social (Friends) Button */}
          <div className="relative w-full">
            {activeDrawer === 'social' && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-[#A3E635]" />
            )}
            <button
              onClick={() => {
                sound.playClick();
                setActiveDrawer(prev => prev === 'social' ? 'none' : 'social');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeDrawer === 'social' 
                  ? 'bg-white/[0.1] text-white border border-white/10' 
                  : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white'
              }`}
              title="Social"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-sans">Social</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 font-mono font-black text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                6 Online
              </span>
            </button>
          </div>

          {/* Party Capsule Card */}
          <div className="relative w-full">
            {activeDrawer === 'party' && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r bg-[#A3E635]" />
            )}
            <div className="rounded-2xl bg-[#10121A] border border-[#1E2333] p-3 flex flex-col gap-2.5 shadow-lg">
              
              {/* Party Header: team_bLocKeeRz & Chat Trigger */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveDrawer(prev => prev === 'party' ? 'none' : 'party');
                  }}
                  className="flex items-center gap-2 hover:text-[#A3E635] transition text-left cursor-pointer min-w-0"
                >
                  <span className="text-xs font-black font-display text-white truncate">
                    team_{currentGamerTag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    (1/5)
                  </span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveDrawer(prev => prev === 'party' ? 'none' : 'party');
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer relative"
                  title="Open Party Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#181922] border border-white/20 text-white font-mono font-bold text-[8px] flex items-center justify-center">
                    1
                  </span>
                </button>
              </div>

              {/* Teammates Slot Row */}
              <div className="flex items-center gap-2 pt-1">
                {/* Leader Avatar with Crown */}
                <div 
                  onClick={() => {
                    sound.playClick();
                    setActiveDrawer('party');
                  }}
                  className="relative w-8 h-8 rounded-full cursor-pointer hover:scale-105 transition"
                  title={`${currentGamerTag} (Party Leader)`}
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px]">👑</span>
                  <img 
                    src={currentAvatarUrl} 
                    alt={currentGamerTag} 
                    className="w-full h-full rounded-full object-cover border-2 border-[#A3E635]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/blockeerz_avatar.png';
                    }}
                  />
                </div>

                {/* Plus / Invite Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenInviteModal?.();
                  }}
                  className="w-8 h-8 rounded-full border border-dashed border-white/20 hover:border-[#A3E635] text-slate-400 hover:text-[#A3E635] flex items-center justify-center transition cursor-pointer"
                  title="Invite Teammate"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Voice Comms Trigger (Lime Green VORTEX theme) */}
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveDrawer('party');
                  setPartySubTab('voice');
                }}
                className="w-full mt-1 py-1.5 px-2.5 rounded-xl bg-[#A3E635]/10 hover:bg-[#A3E635]/20 border border-[#A3E635]/30 text-[#A3E635] transition flex items-center justify-between cursor-pointer text-xs font-mono font-bold"
                title="Voice Comms (Ready)"
              >
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Voice Comms</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-[#A3E635] text-black text-[9px] font-black uppercase">
                  READY
                </span>
              </button>

            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Profile Settings & Vortex Wolf Badge */}
        <div className="w-full pt-3 border-t border-[#1A1D27] flex items-center justify-between">
          <button
            onClick={() => {
              sound.playSelect();
              onOpenProfileTab?.();
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.05] text-slate-400 hover:text-white transition cursor-pointer text-xs font-mono"
            title="User Settings"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-sans font-semibold">Settings</span>
          </button>

          {/* Vortex Wolf Shield Emblem */}
          <div className="flex items-center gap-1.5 text-slate-400 opacity-60 hover:opacity-100 transition cursor-default" title="VORTEX GAMING">
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18l6 2.25v4.66c0 4.02-2.67 7.77-6 8.8-3.33-1.03-6-4.78-6-8.8V6.43l6-2.25z" />
            </svg>
            <span className="font-display font-black text-[10px] text-white">VORTEX</span>
          </div>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* 2. SLIDING DRAWER: SOCIAL (1:1 FACEIT FRIENDS DRAWER)     */}
      {/* ======================================================== */}
      {activeDrawer === 'social' && (
        <>
          {/* Backdrop for outside click */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" 
            onClick={() => setActiveDrawer('none')} 
          />

          <div className="fixed right-64 top-0 bottom-0 w-80 bg-[#0B0D13] border-l border-[#1A1D27] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none">
            
            {/* Header: Social + Search User Button + Close ✕ */}
            <div className="p-4 border-b border-[#181B26] flex items-center justify-between">
              <h2 className="font-display font-black text-white text-xl">
                Social
              </h2>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => sound.playClick()}
                  className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white transition cursor-pointer"
                  title="Search User"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveDrawer('none');
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Friends • Messages • Friend Requests */}
            <div className="p-3 border-b border-[#181B26]">
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#12141C] border border-[#202330]">
                <button
                  onClick={() => { sound.playClick(); setSocialSubTab('friends'); }}
                  className={`py-2 rounded-lg flex items-center justify-center transition cursor-pointer relative ${
                    socialSubTab === 'friends' ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Friends"
                >
                  <Users className="w-4 h-4" />
                  {socialSubTab === 'friends' && (
                    <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#A3E635]" />
                  )}
                </button>

                <button
                  onClick={() => { sound.playClick(); setSocialSubTab('dms'); }}
                  className={`py-2 rounded-lg flex items-center justify-center transition cursor-pointer relative ${
                    socialSubTab === 'dms' ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Direct Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                  {socialSubTab === 'dms' && (
                    <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#A3E635]" />
                  )}
                </button>

                <button
                  onClick={() => { sound.playClick(); setSocialSubTab('requests'); }}
                  className={`py-2 rounded-lg flex items-center justify-center transition cursor-pointer relative ${
                    socialSubTab === 'requests' ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Friend Requests"
                >
                  <UserPlus className="w-4 h-4" />
                  {socialSubTab === 'requests' && (
                    <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#A3E635]" />
                  )}
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="p-3 border-b border-[#181B26]">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  value={socialSearch}
                  onChange={(e) => setSocialSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#111218] border border-[#20222B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition font-sans"
                />
              </div>
            </div>

            {/* Friends List Feed (Grouped: Playing • Online • Offline) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              
              {/* Playing Section */}
              {playingFriends.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono font-bold text-slate-400 mb-2 px-1 flex items-center justify-between">
                    <span>Playing • {playingFriends.length}</span>
                  </div>
                  <div className="space-y-1">
                    {playingFriends.map(friend => (
                      <div 
                        key={friend.id}
                        onClick={() => sound.playClick()}
                        className="p-2 rounded-xl hover:bg-white/[0.04] transition flex items-center justify-between gap-2.5 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-8 h-8 shrink-0">
                            <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover border border-white/10" />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#A3E635] border-2 border-[#0B0D13]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-[#A3E635] transition truncate">{friend.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">{friend.gameStatus}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Online Section */}
              <div>
                <div className="text-[11px] font-mono font-bold text-slate-400 mb-2 px-1 flex items-center justify-between">
                  <span>Online • {onlineFriends.length}</span>
                </div>
                <div className="space-y-1">
                  {onlineFriends.map(friend => (
                    <div 
                      key={friend.id}
                      onClick={() => sound.playClick()}
                      className="p-2 rounded-xl hover:bg-white/[0.04] transition flex items-center justify-between gap-2.5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-8 h-8 shrink-0">
                          <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover border border-white/10" />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0D13]" />
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold text-white group-hover:text-[#A3E635] transition truncate">{friend.name}</span>
                          {friend.hasPriority && (
                            <span className="w-3.5 h-3.5 rounded bg-[#A3E635] text-black text-[8px] font-black flex items-center justify-center">★</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Section */}
              <div>
                <div className="text-[11px] font-mono font-bold text-slate-500 mb-2 px-1 flex items-center justify-between">
                  <span>Offline • {offlineFriends.length}</span>
                </div>
                <div className="space-y-1">
                  {offlineFriends.map(friend => (
                    <div 
                      key={friend.id}
                      onClick={() => sound.playClick()}
                      className="p-2 rounded-xl hover:bg-white/[0.03] transition flex items-center justify-between gap-2.5 cursor-pointer opacity-70 hover:opacity-100 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-8 h-8 shrink-0">
                          <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover border border-white/10 grayscale" />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-600 border-2 border-[#0B0D13]" />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition truncate">{friend.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 3. SLIDING DRAWER: PARTY & VOICE (1:1 FACEIT)             */}
      {/* ======================================================== */}
      {activeDrawer === 'party' && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" 
            onClick={() => setActiveDrawer('none')} 
          />

          <div className="fixed right-64 top-0 bottom-0 w-80 bg-[#0B0D13] border-l border-[#1A1D27] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none">
            
            {/* Header: team_bLocKeeRz + Close ✕ */}
            <div className="p-4 border-b border-[#181B26] flex items-center justify-between">
              <h2 className="font-display font-black text-white text-lg truncate">
                team_{currentGamerTag}...
              </h2>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveDrawer('none');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Party Members Box: User with Captain Crown + Plus invite button + Chevron */}
            <div className="p-3 border-b border-[#181B26]">
              <div className="p-2.5 rounded-xl bg-[#101117] border border-[#21232E] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-9 h-9 rounded-full">
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px]">👑</span>
                    <img 
                      src={currentAvatarUrl} 
                      alt={currentGamerTag} 
                      className="w-full h-full rounded-full object-cover border border-[#A3E635]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/blockeerz_avatar.png';
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenInviteModal?.();
                    }}
                    className="w-8 h-8 rounded-full border border-dashed border-white/20 hover:border-white/50 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                    title="Invite player"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Voice Card: Voice BETA • Ready to start • 🎧 JOIN */}
            <div className="px-3 pt-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-white text-xs">Voice</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#A3E635] text-black font-black text-[9px] uppercase">
                      BETA
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Ready to start
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playTournamentVictory();
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#A3E635] hover:brightness-125 transition cursor-pointer uppercase font-mono"
                >
                  <Headphones className="w-4 h-4" />
                  <span>JOIN</span>
                </button>
              </div>
            </div>

            {/* 4 Navigation Tabs: Chat 💬 • Members 👥 • Voice 🎧 • Leave ➔] */}
            <div className="px-3 py-3 border-b border-[#181B26]">
              <div className="flex items-center justify-between text-slate-400 pt-1">
                <button
                  onClick={() => { sound.playClick(); setPartySubTab('chat'); }}
                  className={`pb-1 transition cursor-pointer relative ${
                    partySubTab === 'chat' ? 'text-white' : 'hover:text-white'
                  }`}
                  title="Party Chat"
                >
                  <MessageSquare className="w-5 h-5" />
                  {partySubTab === 'chat' && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#A3E635]" />
                  )}
                </button>

                <button
                  onClick={() => { sound.playClick(); setPartySubTab('members'); }}
                  className={`pb-1 transition cursor-pointer relative ${
                    partySubTab === 'members' ? 'text-white' : 'hover:text-white'
                  }`}
                  title="Party Roster"
                >
                  <Users className="w-5 h-5" />
                  {partySubTab === 'members' && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#A3E635]" />
                  )}
                </button>

                <button
                  onClick={() => { sound.playClick(); setPartySubTab('voice'); }}
                  className={`pb-1 transition cursor-pointer relative ${
                    partySubTab === 'voice' ? 'text-white' : 'hover:text-white'
                  }`}
                  title="Audio Settings"
                >
                  <Headphones className="w-5 h-5" />
                  {partySubTab === 'voice' && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#A3E635]" />
                  )}
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onLeaveParty?.();
                  }}
                  className="pb-1 text-rose-500 hover:text-rose-400 transition cursor-pointer"
                  title="Leave Party"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Content Feed */}
            {partySubTab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start">
                  <div className="text-center my-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
                      BEGINNING OF CONVERSATION
                    </span>
                  </div>

                  <div className="space-y-3">
                    {partyMessages.map(msg => (
                      <div key={msg.id} className="flex items-start gap-2.5">
                        <img 
                          src={msg.avatar} 
                          alt={msg.sender} 
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-white/10" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-white truncate">{msg.sender}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                          </div>
                          {msg.text && (
                            <p className="text-xs text-slate-300 font-sans mt-0.5 break-words">{msg.text}</p>
                          )}
                          {msg.imageUrl && (
                            <div className="mt-1.5 max-w-[200px] rounded-lg overflow-hidden border border-white/10 shadow-md">
                              <img src={msg.imageUrl} alt="Shared" className="w-full h-auto max-h-[160px] object-cover cursor-pointer" onClick={() => window.open(msg.imageUrl, '_blank')} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Chat Input Form with Image Upload & Smile Emojis */}
                <div className="p-3 bg-[#07080B] border-t border-[#14151C] shrink-0">
                  <form onSubmit={handleSendPartyMessage} className="relative flex items-center">
                    <input
                      type="text"
                      value={partyChatInput}
                      onChange={e => setPartyChatInput(e.target.value)}
                      placeholder="Message room"
                      className="w-full h-10 pl-3 pr-20 rounded-md bg-[#111218] border border-[#20222B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition font-sans"
                    />

                    {/* Right Action Icons: Image Upload + Smile */}
                    <div className="absolute right-2 flex items-center gap-1.5 text-slate-400">
                      <input 
                        ref={partyFileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePartyImageUpload} 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          partyFileInputRef.current?.click();
                        }}
                        className="hover:text-white transition p-1 cursor-pointer"
                        title="Send photo"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPartyChatInput(prev => prev + ' 🎯')}
                        className="hover:text-white transition p-1 cursor-pointer"
                        title="Add emoji"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* Members Tab */}
            {partySubTab === 'members' && (
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Party Roster ({partyMembers.filter(Boolean).length}/5)
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={currentAvatarUrl} alt={currentGamerTag} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs font-bold text-white">{currentGamerTag} (Leader)</span>
                    </div>
                    <span className="text-emerald-400 text-xs">Ready</span>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Tab */}
            {partySubTab === 'voice' && (
              <div className="flex-1 p-4 space-y-4 text-center">
                <Headphones className="w-12 h-12 text-[#A3E635] mx-auto mt-4" />
                <h4 className="font-display font-bold text-white text-base">Voice Comms Ready</h4>
                <p className="text-xs font-mono text-slate-400">
                  Connect your headset for low-latency 128-tick in-game tactical comms.
                </p>
                <button
                  onClick={() => sound.playTournamentVictory()}
                  className="w-full py-2.5 rounded-xl bg-[#A3E635] text-black font-display font-black text-xs uppercase"
                >
                  Join Channel
                </button>
              </div>
            )}

          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 4. SLIDING DRAWER: PROFILE POPOVER (RICH DETAILS)        */}
      {/* ======================================================== */}
      {activeDrawer === 'profile' && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" 
            onClick={() => setActiveDrawer('none')} 
          />

          <div className="fixed right-64 top-0 bottom-0 w-84 bg-[#0D0F17] border-l border-[#1F2435] z-50 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 select-none overflow-y-auto">
            
            <div className="space-y-5 text-center">
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveDrawer('none')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Large Avatar with glowing border */}
              <div className="relative inline-block mx-auto">
                <img
                  src={currentAvatarUrl}
                  alt={currentGamerTag}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#A3E635] shadow-[0_0_25px_rgba(163,230,53,0.35)] block"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/blockeerz_avatar.png';
                  }}
                />
                <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-black font-black text-xs flex items-center justify-center border-2 border-[#12141C] shadow-md">
                  7
                </div>
              </div>

              {/* GamerTag + Verification + Flag */}
              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-display font-black text-white text-lg">{currentGamerTag}</span>
                  <CountryFlag code={currentCountry.code} name={currentCountry.name} size="xs" />
                </div>
                <div className="text-xs font-mono text-[#A3E635] mt-0.5">[{currentClanTag}] PRO MEMBER</div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 text-left text-xs font-mono pt-2">
                <button
                  onClick={() => {
                    sound.playSelect();
                    setActiveDrawer('none');
                    onOpenProfileTab?.();
                  }}
                  className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center justify-between transition cursor-pointer"
                >
                  <span>View Full Profile</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveDrawer('none');
                    onOpenEditProfile?.();
                  }}
                  className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center justify-between transition cursor-pointer"
                >
                  <span>Edit Profile & Avatar</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="p-3 rounded-2xl bg-[#141824] border border-white/5 text-center text-[11px] font-mono text-slate-400">
              VORTEX GAMING PLATFORM • LEVEL 7
            </div>

          </div>
        </>
      )}

    </>
  );
};
