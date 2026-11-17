import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Gift, 
  Award, 
  TrendingUp,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { VortexAdBanner } from './VortexAdBanner';

interface VortexComingSoonDealsProps {
  onOpenPartnersModal?: () => void;
  className?: string;
}

export const VortexComingSoonDeals: React.FC<VortexComingSoonDealsProps> = ({
  onOpenPartnersModal,
  className = ''
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    sound.playSelect();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const DEALS = [
    {
      id: 'hellcase',
      name: 'Hellcase',
      tagline: 'CS2 Case Opening & Upgrader',
      bonus: '+10% DEPOSIT BONUS + FREE CRATE',
      promoCode: 'VORTEX',
      buttonText: 'Claim Free Crate',
      url: 'https://hellcase.com/f/vortex',
      color: '#F59E0B',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      badge: 'TOP UNBOXING PARTNER'
    },
    {
      id: 'dmarket',
      name: 'DMarket',
      tagline: 'Instant CS2 Skin Marketplace & Cashout',
      bonus: 'LOWEST TRADING FEES + INSTANT BOT',
      promoCode: 'VORTEX',
      buttonText: 'Trade Skins Now',
      url: 'https://dmarket.com?ref=vortex',
      color: '#10B981',
      accentBg: 'rgba(16, 185, 129, 0.12)',
      badge: 'OFFICIAL SKIN VAULT'
    },
    {
      id: 'farmskins',
      name: 'Farmskins',
      tagline: 'Covert Knives & Gloves Vault',
      bonus: 'FREE $1.00 BALANCE + DAILY KNIFE SPIN',
      promoCode: 'VORTEX',
      buttonText: 'Get $1.00 Free',
      url: 'https://farmskins.com/ref/vortex',
      color: '#F43F5E',
      accentBg: 'rgba(244, 63, 94, 0.12)',
      badge: 'KNIFE VAULT SPONSOR'
    },
    {
      id: 'vortex-smartlink',
      name: 'Vortex Direct Loot',
      tagline: 'Instant CS2 Skin Rewards & Partner Offers',
      bonus: 'DAILY BONUS OFFERS + INSTANT CASHOUT',
      promoCode: 'VORTEX',
      buttonText: 'Claim Free Loot',
      url: 'https://uplcm.com/4/12281615',
      color: '#A855F7',
      accentBg: 'rgba(168, 85, 247, 0.12)',
      badge: 'MONETAG SMART REWARD'
    }
  ];

  return (
    <div className={`space-y-6 pt-4 text-left ${className}`}>
      {/* Section Header (100% English) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <h4 className="text-base font-black font-display text-white tracking-wide uppercase">
              Official Partner Rewards & Live Sponsored Offers
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">
              Active Deals
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            While this tab is being recalibrated, claim exclusive CS2 skin bonuses and free crate spins with code <strong className="text-amber-400 font-mono">VORTEX</strong>.
          </p>
        </div>

        {onOpenPartnersModal && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenPartnersModal();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1D2335] text-amber-300 border border-amber-400/30 text-xs font-mono font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>All Official Partners</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 4 Partner Deal Cards (English) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEALS.map((deal) => (
          <div
            key={deal.id}
            className="relative rounded-2xl border border-white/[0.08] bg-[#0E121A] p-5 flex flex-col justify-between gap-4 hover:border-amber-400/40 transition shadow-lg group overflow-hidden"
          >
            <div
              className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20 transition group-hover:opacity-40"
              style={{ backgroundColor: deal.color }}
            />

            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-white" style={{ backgroundColor: deal.accentBg, border: `1px solid ${deal.color}40`, color: deal.color }}>
                  {deal.badge}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>

              <div>
                <h5 className="text-lg font-black font-display text-white">{deal.name}</h5>
                <p className="text-xs text-slate-400 font-sans">{deal.tagline}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Special Bonus</span>
                <span className="text-xs font-black font-mono text-amber-300 block">{deal.bonus}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 relative z-10">
              {/* Creator Code Pill */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#141926] border border-white/5 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px]">Promo Code:</span>
                  <span className="font-black text-amber-400">{deal.promoCode}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(deal.promoCode)}
                  className="px-2 py-1 rounded-lg bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode === deal.promoCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Link Button */}
              <a
                href={deal.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playSelect()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <span>{deal.buttonText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Live AADS Crypto & Gaming Ad Banner */}
      <div className="pt-2">
        <VortexAdBanner placement="coming-soon" />
      </div>
    </div>
  );
};

export const VortexTopSponsorRibbon: React.FC<{ onOpenPartnersModal: () => void }> = ({
  onOpenPartnersModal
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    sound.playSelect();
    navigator.clipboard.writeText('VORTEX');
    setCopied(true);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.1 } });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#0B0F1A] via-[#141A28] to-[#0B0F1A] border border-amber-400/25 rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>OFFICIAL CS2 SPONSOR DEALS</span>
        </span>

        <p className="text-xs text-slate-200 font-sans">
          Use creator code <strong className="text-amber-400 font-mono">VORTEX</strong> on <span className="text-white font-semibold">Hellcase & DMarket</span> for <strong className="text-emerald-400">+10% Extra Deposit Balance & Free Daily Case</strong>.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleCopyCode}
          className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Code Copied!' : 'Code: VORTEX'}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenPartnersModal();
          }}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 text-xs font-display font-black uppercase tracking-wider transition flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
        >
          <span>Claim Bonus</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
