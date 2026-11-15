import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Users, 
  UserPlus, 
  Search, 
  X, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
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
  ShieldCheck,
  ShieldAlert,
  Volume2,
  ArrowLeft,
  ShoppingBag,
  Trophy,
  Target,
  Gift,
  Coins,
  Eye,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { CountryFlag } from './CountryFlag';
import { FaceitVerificationBadge } from './VortexDashboard';
import { VortexCaseShopModal } from './VortexCaseShopModal';
import { getVortexWalletBalance } from '../../services/skinDeliveryService';

export interface SocialFriend {
  id: string;
  name: string;
  avatar: string;
  status: 'playing' | 'online' | 'offline';
  gameStatus?: string;
  hasPriority?: boolean;
  code?: string;
  countryName?: string;
  verification?: 'vip' | 'verified' | 'none';
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
  isAntiCheatActive?: boolean;
  onToggleAntiCheat?: () => void;
  onOpenNotifications?: () => void;
  onOpenInviteModal?: () => void;
  onOpenProfileTab?: () => void;
  onOpenEditProfile?: () => void;
  onLeaveParty?: () => void;
  onUpgrade?: () => void;
  onLogout?: () => void;
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
  onToggleAntiCheat,
  onOpenNotifications,
  onOpenInviteModal,
  onOpenProfileTab,
  onOpenEditProfile,
  onLeaveParty,
  onUpgrade,
  onLogout,
}) => {
  // Drawer active state: 'none' | 'social' | 'party' | 'profile' | 'notifications'
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'social' | 'party' | 'profile' | 'notifications'>('none');
  const [copiedSteamId, setCopiedSteamId] = useState(false);
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

  // Active DM Chat view (1:1 FACEIT Match from uploaded_media_1794675192796.png)
  const [activeDmUser, setActiveDmUser] = useState<{
    id: string;
    name: string;
    avatar: string;
    badge?: string;
    verification?: 'vip' | 'verified' | 'none';
    code?: string;
    countryName?: string;
  } | null>(null);

  // In-Platform White-Label CS2 Cases Store State
  const [showCaseShopModal, setShowCaseShopModal] = useState(false);
  const [vortexBalance, setVortexBalance] = useState<number>(() => getVortexWalletBalance());

  useEffect(() => {
    const handleBalance = (e: Event) => {
      const custom = e as CustomEvent<number>;
      setVortexBalance(custom.detail);
    };
    window.addEventListener('vortex_wallet_updated', handleBalance);
    return () => window.removeEventListener('vortex_wallet_updated', handleBalance);
  }, []);

  // CS2 Cases & Skins Affiliate / Partner State
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [spectateToast, setSpectateToast] = useState<string | null>(null);

  const handleCopyPartnerCode = () => {
    sound.playSelect();
    navigator.clipboard.writeText('VORTEX');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const CS2_PARTNERS = [
    {
      id: 'key-drop',
      name: 'Key-Drop CS2',
      tagline: 'Best Case Battles & Upgrade System',
      bonus: '+10% Deposit Bonus + Free Gold Case',
      url: 'https://key-drop.com/?code=VORTEX',
      badgeColor: '#EAB308',
      image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbssLQJf2OD3fm5b09mJmYm0m_7zO6-fzj9V7cAl2eyVpIrz2FKx_0FtZ2D1cIGRcQRsYQ7Q81W3lOjxxcjr3M4pYjY/360fx360f',
      features: ['Instant Steam Bot Trades', 'Daily Free Crates', 'Provably Fair 100%']
    },
    {
      id: 'hellcase',
      name: 'Hellcase CS2',
      tagline: 'World Leading CS2 Crate Platform',
      bonus: '+10% Bonus + Free $0.70 Starter Case',
      url: 'https://hellcase.com/f/VORTEX',
      badgeColor: '#EF4444',
      image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fk29T-sBzpezT_I2tiVXs-RE5YTincY-WdVA4N13R81brx-e51sW9786czydiuSQn4ivcnBfmn1gSOd0N_1mS/360fx360f',
      features: ['Covert Knife Crates', 'Contracts & Upgrades', '10M+ Users Worldwide']
    },
    {
      id: 'skinport',
      name: 'Skinport Market',
      tagline: 'Safest CS2 Skin Marketplace',
      bonus: '0% Buyer Commission • Direct Cashout',
      url: 'https://skinport.com/r/vortex',
      badgeColor: '#3B82F6',
      image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xV_Pp_jez--YXygED6-kZkYj3wLITDdQc8MlCG_Fftxr3ug8C0u5vNnHJr6SQmsH6MnRDi1gYMMLIqu-Y0gQ/360fx360f',
      features: ['Official Steam WebAPI', 'Real Bank & Card Cashout', 'Guaranteed Anti-Scam']
    }
  ];

  const [dmInput, setDmInput] = useState('');
  const dmFileInputRef = useRef<HTMLInputElement>(null);
  const dmEndRef = useRef<HTMLDivElement>(null);

  // Exact 1:1 Direct Messages from User Reference Screenshot (uploaded_media_1794674870290.png)
  const dmsList = [
    {
      id: 'dm-edd1',
      name: 'edd1-',
      avatar: '/avatars/edd1.png',
      lastMessage: 'let me know when to send it',
      date: '9 Nov',
      verification: 'verified' as const,
      code: 'XK',
      countryName: 'Kosovo'
    },
    {
      id: 'dm-blackbars1',
      name: 'blackbars1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      lastMessage: 'are you playing now?',
      date: '9 Nov',
      verification: 'none' as const,
      code: 'AL',
      countryName: 'Albania'
    },
    {
      id: 'dm-toxi',
      name: 'toxi---',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      lastMessage: 'ready',
      date: '31 Oct',
      verification: 'none' as const,
      code: 'XK',
      countryName: 'Kosovo'
    },
    {
      id: 'dm-n19',
      name: 'N19',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      badge: '★',
      lastMessage: 'gg',
      date: '24 Oct',
      verification: 'vip' as const,
      code: 'DE',
      countryName: 'Germany'
    },
    {
      id: 'dm-diva',
      name: 'DIVA-',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      badge: '★',
      lastMessage: "let's queue up and win some games",
      date: '18 Oct',
      verification: 'vip' as const,
      code: 'XK',
      countryName: 'Kosovo'
    },
    {
      id: 'dm-amatuero',
      name: 'amatuero',
      avatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80',
      lastMessage: 'OK',
      date: '12 Apr',
      verification: 'none' as const,
      code: 'XK',
      countryName: 'Kosovo'
    }
  ];

  // Exact 1:1 Conversation Stream from uploaded_media_1794675192796.png
  const [dmHistory, setDmHistory] = useState<Record<string, Array<{
    id: string;
    sender: string;
    avatar?: string;
    text?: string;
    imageUrl?: string;
    timestamp: string;
  }>>>({
    'edd1-': [
      {
        id: '1',
        sender: currentGamerTag,
        avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
        text: 'wait up bro\nif you start the match now I get banned',
        timestamp: '09:27 pm'
      },
      {
        id: '2',
        sender: 'edd1-',
        avatar: '/avatars/edd1.png',
        text: 'hahaha no worries we will not start without you',
        timestamp: '09:27 pm'
      },
      {
        id: '3',
        sender: currentGamerTag,
        avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
        text: 'ok\nwait',
        timestamp: '09:28 pm'
      },
      {
        id: '4',
        sender: 'edd1-',
        avatar: '/avatars/edd1.png',
        text: 'ok\nlet me know when to send it',
        timestamp: '09:28 pm'
      }
    ],
    'blackbars1': [
      { id: '1', sender: 'blackbars1', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', text: 'are you playing now?', timestamp: '09:05 pm' }
    ],
    'toxi---': [
      { id: '1', sender: 'toxi---', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', text: 'ready', timestamp: '02:12 pm' }
    ],
    'N19': [
      { id: '1', sender: 'N19', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80', text: 'gg', timestamp: '11:40 pm' }
    ],
    'DIVA-': [
      { id: '1', sender: 'DIVA-', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', text: "let's queue up and win some games", timestamp: '07:15 pm' }
    ],
    'amatuero': [
      { id: '1', sender: 'amatuero', avatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80', text: 'OK', timestamp: '04:02 pm' }
    ]
  });

  useEffect(() => {
    if (activeDmUser) {
      dmEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeDmUser, dmHistory]);

  const openChatWithUser = (user: {
    id: string;
    name: string;
    avatar: string;
    badge?: string;
    verification?: 'vip' | 'verified' | 'none';
    code?: string;
    countryName?: string;
  }) => {
    sound.playClick();
    setActiveDrawer('social');
    setSocialSubTab('dms');
    setActiveDmUser({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      badge: user.badge,
      verification: user.verification || currentVerification || 'verified',
      code: user.code || currentCountry?.code || 'XK',
      countryName: user.countryName || currentCountry?.name || 'Kosovo'
    });
  };

  const handleSendDm = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!dmInput.trim() || !activeDmUser) return;
    sound.playClick();
    const newMsg = {
      id: `dm-msg-${Date.now()}`,
      sender: currentGamerTag,
      avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
      text: dmInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    };
    setDmHistory(prev => ({
      ...prev,
      [activeDmUser.name]: [...(prev[activeDmUser.name] || []), newMsg]
    }));
    setDmInput('');
  };

  const handleDmImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDmUser) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;
      const newMsg = {
        id: `dm-img-${Date.now()}`,
        sender: currentGamerTag,
        avatar: currentAvatarUrl || '/images/blockeerz_avatar.png',
        text: dmInput.trim() || undefined,
        imageUrl: dataUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
      };
      setDmHistory(prev => ({
        ...prev,
        [activeDmUser.name]: [...(prev[activeDmUser.name] || []), newMsg]
      }));
      setDmInput('');
      sound.playChatMessage();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Exact 1:1 Friends List from User Reference Screenshot
  const friendsList: SocialFriend[] = [
    // Playing (1)
    {
      id: 'f-icy',
      name: 'Icykilleer',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      status: 'playing',
      gameStatus: 'Playing • CS2 MM (12m 45s)',
      verification: 'verified',
      code: 'XK',
      countryName: 'Kosovo'
    },
    // Online (5)
    {
      id: 'f-ama',
      name: 'amatuero',
      avatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      verification: 'none',
      code: 'XK',
      countryName: 'Kosovo'
    },
    {
      id: 'f-black',
      name: 'blackbars1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      verification: 'none',
      code: 'AL',
      countryName: 'Albania'
    },
    {
      id: 'f-diva',
      name: 'DIVA-',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      hasPriority: true,
      verification: 'vip',
      code: 'XK',
      countryName: 'Kosovo'
    },
    {
      id: 'f-feim',
      name: 'Feimmih',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      hasPriority: true,
      verification: 'vip',
      code: 'XK',
      countryName: 'Kosovo'
    },
    {
      id: 'f-ndyw',
      name: 'ndyw',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      hasPriority: true,
      verification: 'vip',
      code: 'XK',
      countryName: 'Kosovo'
    },
    // Offline (49)
    {
      id: 'f-edd1',
      name: 'edd1-',
      avatar: '/avatars/edd1.png',
      status: 'offline',
      verification: 'verified',
      code: 'XK',
      countryName: 'Kosovo'
    },
    {
      id: 'f-rud',
      name: 'RudeusX',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      status: 'offline',
      verification: 'none',
      code: 'XK',
      countryName: 'Kosovo'
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
          <div className="relative w-full">
            {activeDrawer === 'notifications' && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-[#A3E635]" />
            )}
            <button
              onClick={() => {
                sound.playClick();
                setActiveDrawer(prev => prev === 'notifications' ? 'none' : 'notifications');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer group ${
                activeDrawer === 'notifications'
                  ? 'bg-white/[0.1] text-white border border-white/10'
                  : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white'
              }`}
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
          </div>

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

          {/* ======================================================== */}
          {/* VORTEX CS2 CASES (OFFICIAL WHITE-LABEL STORE) CAPSULE     */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-[#10121A] border border-[#1E2333] p-3 flex flex-col gap-2.5 shadow-lg hover:border-amber-500/40 transition group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white font-sans">
                <Gift className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                <span>VORTEX CS2 Cases</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                STEAM BOT LIVE
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Open official crates & win CS2 knives and rare skins. Instant automated Steam Bot delivery.
            </p>

            {/* Wallet Balance & Open Store Button */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-200 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-emerald-400">{vortexBalance.toFixed(2)} €</span>
              </div>

              <button
                onClick={() => {
                  sound.playSelect();
                  setShowCaseShopModal(true);
                }}
                className="flex items-center gap-1 text-[11px] font-mono font-black text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95"
                title="Open Vortex CS2 Case Shop"
              >
                <span>Open Cases</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. LIVE MATCH ACTIVITY TICKER                            */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-[#10121A] border border-[#1E2333] p-3 flex flex-col gap-2 shadow-lg hover:border-white/10 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Matches</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                1 Active
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80"
                  alt="Icykilleer"
                  className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Icykilleer</div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span>Mirage</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-white font-bold">11 - 9</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setSpectateToast('📡 Connecting to GOTV Relay (128-tick EU Vienna)... Spectating Icykilleer on Mirage [11-9]');
                  setTimeout(() => setSpectateToast(null), 4000);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                title="Watch GOTV Spectate"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. SERVER LATENCY STATUS STRIP                           */}
          {/* ======================================================== */}
          <div className="px-1 py-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Vienna:</span>
              <span className="text-slate-300 font-bold">14ms</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Frankfurt:</span>
              <span className="text-slate-300 font-bold">18ms</span>
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
      {/* 2. SLIDING DRAWER: SOCIAL & 1:1 FACEIT DM CONVERSATION    */}
      {/* ======================================================== */}
      {activeDrawer === 'social' && (
        <>
          {/* Backdrop for outside click */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" 
            onClick={() => setActiveDrawer('none')} 
          />

          <div className="fixed right-64 top-0 bottom-0 w-80 bg-[#0B0D13] border-l border-[#1A1D27] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none">
            
            {activeDmUser ? (
              /* ==================================================== */
              /* ACTIVE DM CHAT VIEW (EXACT 1:1 MATCH TO uploaded_media_1794675192796.png) */
              /* ==================================================== */
              <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0C0D12]">
                {/* 1. Header with Back <, Centered Avatar + Name + Badges, and Close ✕ */}
                <div className="pt-3 pb-3 px-3 border-b border-[#181B26] bg-[#0A0B0F] relative shrink-0">
                  <div className="flex items-center justify-between w-full">
                    {/* Back to DM list */}
                    <button
                      onClick={() => setActiveDmUser(null)}
                      className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
                      title="Back to messages"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Close drawer */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveDrawer('none');
                      }}
                      className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Centered Large Avatar + Status Dot + GamerTag & Badges */}
                  <div className="flex flex-col items-center -mt-2">
                    <div className="relative w-14 h-14">
                      <img
                        src={activeDmUser.avatar}
                        alt={activeDmUser.name}
                        className="w-full h-full rounded-full object-cover border border-white/15 shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/avatars/edd1.png';
                        }}
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#1F222B] border-2 border-[#0A0B0F]" />
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <span className="font-display font-extrabold text-white text-sm tracking-tight">
                        {activeDmUser.name}
                      </span>
                      <FaceitVerificationBadge
                        type={activeDmUser.verification || currentVerification || 'verified'}
                        size="xs"
                      />
                      <CountryFlag
                        code={activeDmUser.code || currentCountry?.code || 'XK'}
                        name={activeDmUser.countryName || currentCountry?.name || 'Kosovo'}
                        size="xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Chat Feed: Date Separator + Discord/FACEIT stream */}
                <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-4 bg-[#090A0E]">
                  <div className="text-center my-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      9 NOV
                    </span>
                  </div>

                  {(dmHistory[activeDmUser.name] || [
                    {
                      id: 'init-1',
                      sender: activeDmUser.name,
                      avatar: activeDmUser.avatar,
                      text: 'heyy!',
                      timestamp: 'Just now'
                    }
                  ]).map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2.5">
                      <img
                        src={msg.avatar || (msg.sender === currentGamerTag ? (currentAvatarUrl || '/images/blockeerz_avatar.png') : activeDmUser.avatar)}
                        alt={msg.sender}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/avatars/edd1.png';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display font-bold text-white text-xs leading-none">
                            {msg.sender}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {msg.timestamp}
                          </span>
                        </div>
                        {msg.text && (
                          <p className="text-xs text-slate-200 mt-1 whitespace-pre-line font-sans leading-relaxed break-words">
                            {msg.text}
                          </p>
                        )}
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="attachment"
                            className="mt-1.5 rounded-lg max-h-44 object-cover cursor-pointer border border-white/10"
                            onClick={() => window.open(msg.imageUrl, '_blank')}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={dmEndRef} />
                </div>

                {/* 3. Input bar */}
                <div className="p-2.5 bg-[#07080B] border-t border-[#14151C] shrink-0">
                  <form onSubmit={handleSendDm} className="relative flex items-center">
                    <input
                      type="text"
                      value={dmInput}
                      onChange={e => setDmInput(e.target.value)}
                      placeholder={`Message ${activeDmUser.name}...`}
                      className="w-full h-9 pl-3 pr-16 rounded-md bg-[#111218] border border-[#20222B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition font-sans"
                    />
                    <div className="absolute right-2 flex items-center gap-1.5 text-slate-400">
                      <input ref={dmFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleDmImage} />
                      <button type="button" onClick={() => dmFileInputRef.current?.click()} className="hover:text-white transition p-1 cursor-pointer" title="Send image">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setDmInput(prev => prev + ' 🎯')} className="hover:text-white transition p-1 cursor-pointer" title="Add emoji">
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* ==================================================== */
              /* NORMAL SOCIAL DRAWER VIEW (Friends, DMs, Requests)  */
              /* ==================================================== */
              <>
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

                {/* 1. FRIENDS LIST SUB-TAB */}
                {socialSubTab === 'friends' && (
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
                              onClick={() => openChatWithUser(friend)}
                              className="p-2 rounded-xl hover:bg-white/[0.04] transition flex items-center justify-between gap-2.5 cursor-pointer group relative"
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

                              {/* Hover Action Buttons: Open Chat & Invite */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                                <div className="relative group/chat">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openChatWithUser(friend);
                                    }}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
                                    title="Open chat"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                  <div className="absolute right-0 bottom-full mb-1.5 px-2 py-0.5 rounded bg-[#12141C] border border-[#222533] text-white text-[10px] font-mono font-bold shadow-xl pointer-events-none opacity-0 group-hover/chat:opacity-100 transition whitespace-nowrap z-50">
                                    Open chat
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sound.playClick();
                                    onOpenInviteModal?.();
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                                  title="Invite to party"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
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
                            onClick={() => openChatWithUser(friend)}
                            className="p-2 rounded-xl hover:bg-white/[0.04] transition flex items-center justify-between gap-2.5 cursor-pointer group relative"
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

                            {/* Hover Action Buttons: Open Chat & Invite */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                              <div className="relative group/chat">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openChatWithUser(friend);
                                  }}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
                                  title="Open chat"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                                <div className="absolute right-0 bottom-full mb-1.5 px-2 py-0.5 rounded bg-[#12141C] border border-[#222533] text-white text-[10px] font-mono font-bold shadow-xl pointer-events-none opacity-0 group-hover/chat:opacity-100 transition whitespace-nowrap z-50">
                                  Open chat
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sound.playClick();
                                  onOpenInviteModal?.();
                                }}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                                title="Invite to party"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
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
                            onClick={() => openChatWithUser(friend)}
                            className="p-2 rounded-xl hover:bg-white/[0.03] transition flex items-center justify-between gap-2.5 cursor-pointer opacity-70 hover:opacity-100 group relative"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-8 h-8 shrink-0">
                                <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover border border-white/10 grayscale" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-600 border-2 border-[#0B0D13]" />
                              </div>
                              <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition truncate">{friend.name}</span>
                            </div>

                            {/* Hover Action Buttons */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                              <div className="relative group/chat">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openChatWithUser(friend);
                                  }}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
                                  title="Open chat"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                                <div className="absolute right-0 bottom-full mb-1.5 px-2 py-0.5 rounded bg-[#12141C] border border-[#222533] text-white text-[10px] font-mono font-bold shadow-xl pointer-events-none opacity-0 group-hover/chat:opacity-100 transition whitespace-nowrap z-50">
                                  Open chat
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. DIRECT MESSAGES SUB-TAB (LIST VIEW - EXACT MATCH TO uploaded_media_1794674870290.png) */}
                {socialSubTab === 'dms' && (
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {dmsList
                      .filter(dm => dm.name.toLowerCase().includes(socialSearch.toLowerCase()))
                      .map(dm => (
                        <div
                          key={dm.id}
                          onClick={() => openChatWithUser(dm)}
                          className="p-2.5 rounded-xl hover:bg-white/[0.05] transition flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-9 h-9 shrink-0">
                              <img src={dm.avatar} alt={dm.name} className="w-full h-full rounded-full object-cover border border-white/10" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white group-hover:text-[#A3E635] transition truncate">{dm.name}</span>
                                {dm.badge && (
                                  <span className="w-3.5 h-3.5 rounded bg-[#A3E635] text-black text-[8px] font-black flex items-center justify-center">
                                    {dm.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-sans truncate">{dm.lastMessage}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">{dm.date}</span>
                        </div>
                      ))}
                  </div>
                )}

                {/* 3. FRIEND REQUESTS SUB-TAB */}
                {socialSubTab === 'requests' && (
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
                    <UserPlus className="w-10 h-10 text-slate-600" />
                    <div className="text-xs font-mono font-bold text-slate-300">No Pending Requests</div>
                    <p className="text-[11px] text-slate-500 max-w-[200px]">When other players add you on Vortex, their friend requests will appear here.</p>
                  </div>
                )}
              </>
            )}

          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 2.5 SLIDING DRAWER: NOTIFICATIONS (1:1 FACEIT DRAWER)      */}
      {/* ======================================================== */}
      {activeDrawer === 'notifications' && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" 
            onClick={() => setActiveDrawer('none')} 
          />

          <div className="fixed right-64 top-0 bottom-0 w-80 bg-[#0B0D13] border-l border-[#1A1D27] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none">
            {/* Header: Notifications + Close ✕ */}
            <div className="p-4 border-b border-[#181B26] flex items-center justify-between">
              <h2 className="font-display font-extrabold text-white text-base tracking-wide">
                Notifications
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

            {/* Account Selector Dropdown */}
            <div className="p-3 border-b border-[#181B26]">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#12141C] border border-[#202330] cursor-pointer hover:border-slate-500 transition">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={currentAvatarUrl || '/images/blockeerz_avatar.png'}
                    alt={currentGamerTag}
                    className="w-5 h-5 rounded-full object-cover border border-white/10"
                  />
                  <span className="text-xs font-bold text-white truncate font-sans">
                    {currentGamerTag}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>

            {/* Notifications Feed */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Date Group 1: 12 Nov 2026 */}
              <div>
                <div className="text-[11px] font-sans font-medium text-slate-400 mb-2 px-1">
                  12 Nov 2026
                </div>
                <div className="space-y-3">
                  {/* Case 50 Points */}
                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#151722] border border-[#222533] flex items-center justify-center shrink-0">
                      <span className="text-orange-500 font-black text-xs">◀</span>
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="text-slate-200">
                        <strong className="text-white font-bold">You</strong> received 50 FACEIT Points from your FACEIT Case.
                      </p>
                      <button 
                        onClick={() => {
                          sound.playSelect();
                          setShowCaseShopModal(true);
                        }}
                        className="text-orange-500 hover:text-orange-400 font-bold mt-0.5 inline-block cursor-pointer"
                      >
                        Explore the shop.
                      </button>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                        <ShoppingBag className="w-3 h-3" />
                        <span>13:20 GMT+1</span>
                      </div>
                    </div>
                  </div>

                  {/* Access Token */}
                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#151722] border border-[#222533] flex items-center justify-center shrink-0">
                      <span className="text-orange-500 font-black text-xs">◀</span>
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="text-slate-200">
                        <strong className="text-white font-bold">You</strong> received 1 Access Token from your FACEIT Case
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                        <ShoppingBag className="w-3 h-3" />
                        <span>13:20 GMT+1</span>
                      </div>
                    </div>
                  </div>

                  {/* Case 100 Points */}
                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#151722] border border-[#222533] flex items-center justify-center shrink-0">
                      <span className="text-orange-500 font-black text-xs">◀</span>
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="text-slate-200">
                        <strong className="text-white font-bold">You</strong> received 100 FACEIT Points from your FACEIT Case.
                      </p>
                      <button 
                        onClick={() => {
                          sound.playSelect();
                          setShowCaseShopModal(true);
                        }}
                        className="text-orange-500 hover:text-orange-400 font-bold mt-0.5 inline-block cursor-pointer"
                      >
                        Explore the shop.
                      </button>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                        <ShoppingBag className="w-3 h-3" />
                        <span>13:19 GMT+1</span>
                      </div>
                    </div>
                  </div>

                  {/* Case 80 Points */}
                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#151722] border border-[#222533] flex items-center justify-center shrink-0">
                      <span className="text-orange-500 font-black text-xs">◀</span>
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="text-slate-200">
                        <strong className="text-white font-bold">You</strong> received 80 FACEIT Points from your FACEIT Case.
                      </p>
                      <button 
                        onClick={() => {
                          sound.playSelect();
                          setShowCaseShopModal(true);
                        }}
                        className="text-orange-500 hover:text-orange-400 font-bold mt-0.5 inline-block cursor-pointer"
                      >
                        Explore the shop.
                      </button>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                        <ShoppingBag className="w-3 h-3" />
                        <span>13:19 GMT+1</span>
                      </div>
                    </div>
                  </div>

                  {/* Case 500 Points */}
                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#151722] border border-[#222533] flex items-center justify-center shrink-0">
                      <span className="text-orange-500 font-black text-xs">◀</span>
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="text-slate-200">
                        <strong className="text-white font-bold">You</strong> received 500 FACEIT Points from your FACEIT Case.
                      </p>
                      <button 
                        onClick={() => {
                          sound.playSelect();
                          setShowCaseShopModal(true);
                        }}
                        className="text-orange-500 hover:text-orange-400 font-bold mt-0.5 inline-block cursor-pointer"
                      >
                        Explore the shop.
                      </button>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                        <ShoppingBag className="w-3 h-3" />
                        <span>13:14 GMT+1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Group 2: 09 Nov 2026 */}
              <div className="pt-2 border-t border-[#181B26]">
                <div className="text-[11px] font-sans font-medium text-slate-400 mb-2 px-1">
                  09 Nov 2026
                </div>
                <div className="space-y-3">
                  {/* Challenge Completed */}
                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-[#151722] border border-[#222533] flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                        CHALLENGE COMPLETED
                      </span>
                      <p className="text-slate-200 font-medium">
                        Challenge completed! Check your progress and see what's unlocked next.
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                        <span>22:21 GMT+1</span>
                      </div>
                    </div>
                  </div>

                  {/* edd1- Accepted friend request */}
                  <div 
                    onClick={() => {
                      openChatWithUser({
                        id: 'f-edd1',
                        name: 'edd1-',
                        avatar: '/avatars/edd1.png',
                        verification: 'verified',
                        code: 'XK',
                        countryName: 'Kosovo'
                      });
                    }}
                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.05] transition cursor-pointer group"
                  >
                    <img 
                      src="/avatars/edd1.png" 
                      alt="edd1-" 
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" 
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="text-slate-200">
                        <strong className="text-white font-bold group-hover:text-[#A3E635] transition">edd1-</strong> accepted your friend request
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                        <Users className="w-3 h-3" />
                        <span>21:26 GMT+1</span>
                      </div>
                    </div>
                  </div>
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

          <div className="fixed right-64 top-0 bottom-0 w-84 max-w-[calc(100vw-1rem)] bg-[#12141C] border-l border-[#252B3B] z-50 p-5 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in slide-in-from-right duration-200 select-none overflow-y-auto space-y-4 text-center">
            
            <div className="space-y-4">
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveDrawer('none')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Large Avatar with glowing border, Level 7 badge, and online dot */}
              <div className="relative inline-block mx-auto mt-1 group">
                <button
                  onClick={() => {
                    sound.playSelect();
                    setActiveDrawer('none');
                    onOpenProfileTab?.();
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
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#12141C]" />
                </button>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-black font-black text-xs flex items-center justify-center border-2 border-[#12141C] shadow-md pointer-events-none">
                  7
                </div>
              </div>

              {/* GamerTag with clan tag, verification badge, and flag */}
              <div>
                <button
                  onClick={() => {
                    sound.playSelect();
                    setActiveDrawer('none');
                    onOpenProfileTab?.();
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
                      setActiveDrawer('none');
                      onUpgrade?.();
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
                  onClick={() => {
                    sound.playClick();
                    setActiveDrawer('none');
                    onOpenEditProfile?.();
                  }}
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
                    setActiveDrawer('none');
                    onOpenProfileTab?.();
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
                    setCopiedSteamId(true);
                    setTimeout(() => setCopiedSteamId(false), 2500);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {copiedSteamId ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{copiedSteamId ? 'Copied to Clipboard!' : 'Copy SteamID'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">STEAM_0:1:4391...</span>
                </button>

                {onLogout && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveDrawer('none');
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

            {/* Bottom Status */}
            <div className="p-3 rounded-2xl bg-[#141824] border border-white/5 text-center text-[11px] font-mono text-slate-400">
              VORTEX GAMING PLATFORM • LEVEL 7
            </div>

          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 5. CS2 CASES & SKINS (OFFICIAL PARTNERS) MODAL           */}
      {/* ======================================================== */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setShowPartnerModal(false)}
          />

          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0B0D14] border border-[#232738] p-6 sm:p-7 shadow-2xl z-10 flex flex-col text-left animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold uppercase">
                <Gift className="w-3.5 h-3.5" />
                <span>Official CS2 Case Partners</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                ● LIVE BONUS
              </span>
            </div>

            <h3 className="font-display font-black text-2xl text-white tracking-tight mt-3">
              Open CS2 Cases & Win Real Knives
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1 max-w-lg">
              Use promo code <strong className="text-amber-400 font-mono">VORTEX</strong> on partner platforms to receive <strong className="text-white">+10% Extra Deposit Bonus</strong> and free starter crates. Skins withdraw directly to your Steam inventory!
            </p>

            {/* Promo Code Highlight Banner */}
            <div className="w-full my-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#161A26] to-[#12141F] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Exclusive Promo Code:</div>
                  <div className="text-lg font-black font-mono text-amber-400 tracking-wider">
                    VORTEX
                    <span className="text-xs font-normal text-slate-300 ml-2">(+10% EXTRA & FREE CRATE)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyPartnerCode}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase transition cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            {/* 3 Partner Cards List */}
            <div className="space-y-2.5">
              {CS2_PARTNERS.map((partner) => (
                <div
                  key={partner.id}
                  className="p-3.5 rounded-2xl bg-[#121520] hover:bg-[#151926] border border-[#202538] hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      <img 
                        src={partner.image} 
                        alt={partner.name} 
                        className="w-12 h-12 object-contain group-hover:scale-110 transition duration-300 drop-shadow-md" 
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-black text-white text-sm group-hover:text-amber-400 transition truncate">
                          {partner.name}
                        </h4>
                        <span 
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${partner.badgeColor}20`, color: partner.badgeColor, border: `1px solid ${partner.badgeColor}40` }}
                        >
                          {partner.bonus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {partner.tagline}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-1">
                        {partner.features.map((feat, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span className="text-emerald-400">✓</span> {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playSelect()}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-amber-400 text-slate-200 hover:text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-white/10 hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* Footnote / Trust info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-500 mt-4 pt-3 border-t border-white/5 gap-1">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">🔒</span>
                Steam Web API • Provably Fair • Instant Bot Delivery
              </span>
              <span className="text-slate-400">Zero fee & 100% verified P2P Steam API</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SPECTATE GOTV TOAST NOTIFICATION                       */}
      {/* ======================================================== */}
      {spectateToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#0D1017] border border-[#202738] shadow-2xl text-xs font-mono text-white flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{spectateToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. VORTEX WHITE-LABEL CS2 CASES & STEAM TRADE BOT MODAL   */}
      {/* ======================================================== */}
      <VortexCaseShopModal 
        isOpen={showCaseShopModal} 
        onClose={() => setShowCaseShopModal(false)} 
      />

    </>
  );
};
