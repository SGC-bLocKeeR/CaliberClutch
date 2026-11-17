import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Sparkles, X } from 'lucide-react';

interface VortexAdBannerProps {
  placement?: 'top' | 'coming-soon' | 'footer' | 'sidebar';
  className?: string;
  showDisclaimer?: boolean;
}

export const VortexAdBanner: React.FC<VortexAdBannerProps> = ({
  placement = 'coming-soon',
  className = '',
  showDisclaimer = true
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (isDismissed) return null;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#22293C] bg-gradient-to-b from-[#0F131D] via-[#090C12] to-[#06080C] shadow-2xl transition-all ${className}`}
    >
      {/* Top Header Label (100% English) */}
      <div className="px-4 py-2 bg-[#121622]/90 border-b border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
          <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL NETWORK SPONSOR</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>VERIFIED AD NETWORK</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
            AADS Crypto & Gaming Ad Network
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            title="Dismiss Ad"
            className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Iframe Banner Container */}
      <div className="p-3 sm:p-5 flex flex-col items-center justify-center min-h-[90px] relative">
        <div className="w-full flex justify-center items-center overflow-hidden">
          {/* AADS AD UNIT 2462347 (Adaptive Live Banner) */}
          <iframe
            data-aa="2462347"
            src="https://acceptable.a-ads.com/2462347/?size=Adaptive"
            title="VORTEX Official Sponsored Network Advertisement"
            style={{
              border: 0,
              padding: 0,
              width: '100%',
              maxWidth: '970px',
              height: '100px',
              overflow: 'hidden',
              display: 'block',
              margin: 'auto'
            }}
          />
        </div>
      </div>

      {/* Footer Info Pill (English) */}
      {showDisclaimer && (
        <div className="px-4 py-1.5 bg-black/40 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
          <span>Targeted CS2, Esports & Tech Ads • Instant Payout Enabled</span>
          <div className="flex items-center gap-3">
            <a
              href="https://uplcm.com/4/12281615"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1 font-bold"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Claim CS2 Partner Loot</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a
              href="https://aads.com?partner=2462347"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition flex items-center gap-1"
            >
              <span>Advertise Here</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
