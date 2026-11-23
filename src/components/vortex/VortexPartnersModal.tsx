import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Gift,
  Award,
  Zap,
  TrendingUp,
  Globe,
  Mail,
  Building,
  CheckCircle2,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

interface VortexPartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PartnerProvider {
  id: string;
  name: string;
  category: 'Marketplace' | 'Hardware' | 'P2P Liquidity' | 'Valuation';
  badge: string;
  badgeColor: string;
  logo: string;
  description: string;
  bonusText: string;
  promoCode: string;
  features: string[];
  referralUrl: string;
  status: 'Operational' | 'Active Integration';
}

export const OFFICIAL_PARTNERS: PartnerProvider[] = [
  {
    id: 'dmarket',
    name: 'DMarket B2B',
    category: 'Marketplace',
    badge: 'OFFICIAL SKIN PROVIDER',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    logo: 'https://imgproxy.dmarket.com/insecure/rs:fit:120:120:0/g:ce/aHR0cHM6Ly9jb21tdW5pdHkuYWthbWFpLnN0ZWFtc3RhdGljLmNvbS9lY29ub215L2ltYWdlL2kwQ29aODFVaTBtLTlLd2xCWTFMXzE4bXl1R3VxMXdmaFdTYVpnTXR0eVZmUGFFUlNSMFdxbXU3TEFvY0dKS3oybHVfWHNuWHd0bWtKalNVOTFkaDhiajM1VlRxVkJQNGlvX2ZybklWN0tiNU9hVS1KcWZIRHpYRmxlMHU0TFk4R3lfa2tSZ2lzR3pjbTR2NEozdkRPQVFtRE1keVJ2bEs3RWNtZUNVM3l3.webp',
    description: 'Powers all CaliberClutch Tournament prize skins, marketplace liquidity, and instant automated Steam Bot deliveries with zero escrow wait.',
    bonusText: 'Lowest trading fees + Priority Steam Bot Trade queue with code CALIBER',
    promoCode: 'CALIBER',
    features: ['1,500,000+ CS2 Skins in Stock', 'Sub-30s Automated Bot Dispatch', '100% Steam WebAPI Compliant'],
    referralUrl: 'https://dmarket.com?ref=caliberclutch',
    status: 'Operational'
  },
  {
    id: 'skinport',
    name: 'Skinport',
    category: 'Marketplace',
    badge: 'EU LICENSED VALUATION',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    logo: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xV_Pp_jez--YXygED6-kZkYj3wLITDdQc8MlCG_Fftxr3ug8C0u5vNnHJr6SQmsH6MnRDi1gYMMLIqu-Y0gQ/360fx360f',
    description: 'German-regulated CS2 item exchange providing official real-time pricing feeds and legal European bank cashout for CaliberClutch users.',
    bonusText: '0% deposit fees on bank wires & cards + Verified seller status',
    promoCode: 'CALIBER',
    features: ['BaFin Regulated EU Jurisdiction', 'Direct Bank & SEPA Cashout', 'Real-time Item Pricing Engine'],
    referralUrl: 'https://skinport.com/r/caliberclutch',
    status: 'Operational'
  },
  {
    id: 'steelseries',
    name: 'SteelSeries Esports',
    category: 'Hardware',
    badge: 'OFFICIAL AUDIO & GEAR',
    badgeColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    logo: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xV_Pp_jez--YXygED6-kZkYj3wLITDdQc8MlCG_Fftxr3ug8C0u5vNnHJr6SQmsH6MnRDi1gYMMLIqu-Y0gQ/360fx360f',
    description: 'Official esports audio partner powering tournament communications, Arctis headsets, and pro gaming mice.',
    bonusText: '15% Off all pro gaming gear with partner code CALIBER',
    promoCode: 'CALIBER',
    features: ['ClearCast AI Microphone', 'Nova Pro Wireless Audio', 'Aerox Ultra-Light Mice'],
    referralUrl: 'https://steelseries.com',
    status: 'Operational'
  },
  {
    id: 'zowie',
    name: 'ZOWIE by BenQ',
    category: 'Hardware',
    badge: 'TOURNAMENT MONITORS',
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
    logo: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fk29T-sBzpezT_I2tiVXs-RE5YTincY-WdVA4N13R81brx-e51sW9786czydiuSQn4ivcnBfmn1gSOd0N_1mS/360fx360f',
    description: 'The global esports standard for high-refresh 240Hz & 360Hz displays and tournament ergonomic mice.',
    bonusText: 'Official Tournament Display Partner for CaliberClutch Championships',
    promoCode: 'CALIBER',
    features: ['DyAc 2 Fast Clarity', '360Hz Fast TN Esports Panels', 'Symmetrical & Ergonomic Mice'],
    referralUrl: 'https://zowie.benq.com',
    status: 'Operational'
  },
  {
    id: 'csmoney',
    name: 'CS.MONEY',
    category: 'Valuation',
    badge: '3D INSPECTION ENGINE',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    logo: 'https://imgproxy.dmarket.com/insecure/rs:fit:120:120:0/g:ce/aHR0cHM6Ly9jb21tdW5pdHkuYWthbWFpLnN0ZWFtc3RhdGljLmNvbS9lY29ub215L2ltYWdlL2kwQ29aODFVaTBtLTlLd2xCWTFMXzE4bXl1R3VxMXdmaFdTYVpnTXR0eVZmUGFFUlNSMFdxbXU3TEFvY0dJR3ozVXFsWE9McnhNLXZNR21XOFZOeHU1RHg2MG5vVHlMd2xjSzN3aU5RME9LaGVxZG9MUEdhQUZpY3lPbC1wSzh4R0hfbndVdDFzR3JTejlpdmNIS1FPQWNqWE1Za1J1NVl1eGU0bFlDeVpPcTI1VlNNMm9NVDAyeWcyVXhCU0VnQQ==.webp',
    description: 'Supplies real-time CS2 weapon float inspection, high-resolution 3D renders, and automatic skin trade liquidity to CaliberClutch players.',
    bonusText: '+35% Deposit Bonus on Trade-ins with code CALIBER',
    promoCode: 'CALIBER',
    features: ['Custom 3D Weapon Renders', 'Accurate Float & Seed Matching', 'Direct Peer-to-Peer Trades'],
    referralUrl: 'https://cs.money',
    status: 'Operational'
  }
];

export const VortexPartnersModal: React.FC<VortexPartnersModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [partnerFilter, setPartnerFilter] = useState<string>('all');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryCompany, setInquiryCompany] = useState('');
  const [inquiryType, setInquiryType] = useState('tournament_sponsor');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = (code: string) => {
    sound.playSelect();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) return;
    sound.playTournamentVictory();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setInquirySubmitted(true);
  };

  const filteredPartners = OFFICIAL_PARTNERS.filter(p => {
    if (partnerFilter === 'all') return true;
    if (partnerFilter === 'marketplace') return p.category === 'Marketplace';
    if (partnerFilter === 'hardware') return p.category === 'Hardware';
    if (partnerFilter === 'valuation') return p.category === 'Valuation';
    return true;
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Main Modal Shell */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0C0F17] border border-[#232B3E] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-slate-100">
        
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#1C2333] flex items-center justify-between shrink-0 bg-[#0E121C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-display text-white tracking-wide">
                  Official Market & Skin Partners
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                  HLTV STANDARD
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Verified B2B Skin Liquidity, Steam Bot Delivery & Co-Branded Cases
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-[#161B28] hover:bg-[#1E2436] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* 1. HLTV-STYLE CREATOR CODE BANNER */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#141A28] to-amber-500/10 border border-amber-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider">
                  Universal CaliberClutch Partner Code
                </span>
              </div>
              <h3 className="text-base font-black font-display text-white">
                Official Esports Hardware & Platform Partner Benefits
              </h3>
              <p className="text-xs text-slate-400">
                Use code <strong className="text-white font-mono">CALIBER</strong> on SteelSeries, ZOWIE, Skinport or DMarket to unlock verified platform rewards.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-black/60 border border-amber-400/40 text-amber-400 font-mono font-black text-sm tracking-widest select-all">
                CALIBER
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode('CALIBER')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1.5 active:scale-95"
              >
                {copiedCode === 'CALIBER' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. CATEGORY SELECTOR TABS */}
          <div className="flex items-center justify-between gap-2 border-b border-[#1A2030] pb-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: `All Partners (${OFFICIAL_PARTNERS.length})` },
                { id: 'marketplace', label: '🛒 Marketplaces (DMarket, Skinport)' },
                { id: 'hardware', label: '🎧 Esports Hardware (SteelSeries, ZOWIE)' },
                { id: 'valuation', label: '🔍 3D & Analytics (CS.MONEY)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setPartnerFilter(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    partnerFilter === tab.id
                      ? 'bg-white text-slate-950 shadow-md'
                      : 'bg-[#121622] hover:bg-[#181D2C] text-slate-300 border border-[#202738]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 5 APIs Live</span>
            </span>
          </div>

          {/* 3. PARTNERS CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPartners.map(partner => (
              <div 
                key={partner.id}
                className="p-5 rounded-2xl bg-[#111520] border border-[#1E2536] hover:border-amber-400/40 transition flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  {/* Top: Logo & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                        <img 
                          src={partner.logo} 
                          alt={partner.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-black font-display text-white group-hover:text-amber-400 transition flex items-center gap-1.5">
                          <span>{partner.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-normal">({partner.category})</span>
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${partner.badgeColor}`}>
                          {partner.badge}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold shrink-0">
                      ● {partner.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {partner.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-1 pt-1">
                    {partner.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bonus Highlight Pill */}
                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center gap-2">
                    <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-mono font-bold text-amber-300 leading-tight">
                      {partner.bonusText}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions: Copy Code & Visit Link */}
                <div className="pt-3 border-t border-[#1C2333] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(partner.promoCode)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#161B28] hover:bg-[#1E2536] text-white border border-white/10 hover:border-amber-400/40 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode === partner.promoCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Code: {partner.promoCode}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={partner.referralUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-95"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>

          {/* 4. BECOME A CALIBERCLUTCH PARTNER OR TOURNAMENT SPONSOR */}
          <div className="p-6 rounded-2xl bg-[#0F131D] border border-[#232C3E] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2638] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#A3E635]" />
                  <h3 className="text-base font-black font-display text-white">
                    Become a CaliberClutch Partner or Tournament Sponsor
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Promote your brand to thousands of active competitive CS2 players in Europe & the Balkans.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635] font-mono text-xs font-bold">
                  B2B Applications Open
                </span>
              </div>
            </div>

            {inquirySubmitted ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Partnership Inquiry Received!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you, <strong className="text-white">{inquiryName}</strong>. Our esports partnerships director will contact you at <strong className="text-emerald-400">{inquiryEmail}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={e => setInquiryName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-3 py-2 rounded-xl bg-[#090C12] border border-[#232B3B] text-xs text-white focus:outline-none focus:border-amber-400/50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Work Email</label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={e => setInquiryEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#090C12] border border-[#232B3B] text-xs text-white focus:outline-none focus:border-amber-400/50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Company / Website</label>
                    <input
                      type="text"
                      value={inquiryCompany}
                      onChange={e => setInquiryCompany(e.target.value)}
                      placeholder="e.g. SkinTrading Brand"
                      className="w-full px-3 py-2 rounded-xl bg-[#090C12] border border-[#232B3B] text-xs text-white focus:outline-none focus:border-amber-400/50 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Partnership Tier</label>
                    <select
                      value={inquiryType}
                      onChange={e => setInquiryType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090C12] border border-[#232B3B] text-xs text-white focus:outline-none focus:border-amber-400/50 font-sans cursor-pointer"
                    >
                      <option value="tournament_sponsor">Tournament Prize Sponsor (Hardware & Gear)</option>
                      <option value="hardware_sponsor">Esports Hardware & Tournament Gear</option>
                      <option value="b2b_api">B2B Tournament Telemetry & Stats API</option>
                      <option value="affiliate">Creator & Streamer Affiliate Program</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Message / Note</label>
                    <input
                      type="text"
                      value={inquiryMessage}
                      onChange={e => setInquiryMessage(e.target.value)}
                      placeholder="Brief details about your proposal..."
                      className="w-full px-3 py-2 rounded-xl bg-[#090C12] border border-[#232B3B] text-xs text-white focus:outline-none focus:border-amber-400/50 font-sans"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Direct contact: <a href="mailto:partners@caliberclutch.gg" className="text-amber-400 underline">partners@caliberclutch.gg</a></span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.3)] flex items-center gap-1.5"
                  >
                    <span>Send Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 5. LEGAL & REGULATORY DISCLOSURE */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-left">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Esports Regulatory Compliance & Affiliate Disclosure</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              CaliberClutch operates strictly as a skill-based competitive esports infrastructure and tournament organizer. Tournament prize pools, hardware gear, and digital rewards are distributed in full compliance with EU regulations, Valve Steam Subscriber Agreements, and official esports organizer guidelines. CaliberClutch does not host or operate skin gambling, case unboxing, or wagering services.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
