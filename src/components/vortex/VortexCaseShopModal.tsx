import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Send, 
  Flame, 
  ArrowRight,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { 
  CS2Case, 
  CS2Skin, 
  VORTEX_CASE_CATALOG, 
  getVortexWalletBalance, 
  deductVortexWalletBalance, 
  creditVortexWalletBalance,
  getSavedSteamTradeUrl,
  saveSteamTradeUrl,
  isValidSteamTradeUrl,
  dispatchSkinViaTradeBot,
  TradeOfferDeliveryResult
} from '../../services/skinDeliveryService';

interface VortexCaseShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VortexCaseShopModal: React.FC<VortexCaseShopModalProps> = ({ isOpen, onClose }) => {
  // Navigation & Case State
  const [activeCase, setActiveCase] = useState<CS2Case | null>(null);
  const [balance, setBalance] = useState<number>(() => getVortexWalletBalance());
  const [tradeUrl, setTradeUrl] = useState<string>(() => getSavedSteamTradeUrl());
  const [showTradeUrlDialog, setShowTradeUrlDialog] = useState<boolean>(false);
  const [tempTradeUrl, setTempTradeUrl] = useState<string>(tradeUrl);
  const [tradeUrlError, setTradeUrlError] = useState<string | null>(null);

  // Spinner & Animation State
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonSkin, setWonSkin] = useState<CS2Skin | null>(null);
  const [reelItems, setReelItems] = useState<CS2Skin[]>([]);
  const [reelOffset, setReelOffset] = useState<number>(0);
  const reelRef = useRef<HTMLDivElement>(null);

  // Trade Bot Delivery State
  const [deliveryProgress, setDeliveryProgress] = useState<{ step: number; message: string } | null>(null);
  const [deliveryResult, setDeliveryResult] = useState<TradeOfferDeliveryResult | null>(null);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  // Sync wallet balance on custom events
  useEffect(() => {
    const handleWalletUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setBalance(customEvent.detail);
    };
    const handleTradeUrlUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setTradeUrl(customEvent.detail);
    };

    window.addEventListener('vortex_wallet_updated', handleWalletUpdate);
    window.addEventListener('vortex_trade_url_updated', handleTradeUrlUpdate);

    return () => {
      window.removeEventListener('vortex_wallet_updated', handleWalletUpdate);
      window.removeEventListener('vortex_trade_url_updated', handleTradeUrlUpdate);
    };
  }, []);

  // When activeCase changes, immediately reset and initialize a fresh, authentic reel from this exact case
  useEffect(() => {
    if (activeCase) {
      setReelOffset(0);
      setWonSkin(null);
      setDeliveryResult(null);
      setDeliveryProgress(null);
      setDeliveryError(null);

      // Pre-populate with authentic items from this exact case
      const initialReel: CS2Skin[] = [];
      for (let i = 0; i < 45; i++) {
        const item = activeCase.items[i % activeCase.items.length];
        initialReel.push(item);
      }
      setReelItems(initialReel);
    } else {
      setReelItems([]);
      setWonSkin(null);
    }
  }, [activeCase]);

  if (!isOpen) return null;

  // Save Trade URL
  const handleSaveTradeUrl = () => {
    sound.playSelect();
    if (!tempTradeUrl) {
      setTradeUrlError('Ju lutem vendosni Steam Trade URL-në tuaj.');
      return;
    }
    if (!isValidSteamTradeUrl(tempTradeUrl)) {
      setTradeUrlError('Formati nuk është i saktë. Duhet të fillojë me https://steamcommunity.com/tradeoffer/new/?partner=...');
      return;
    }
    saveSteamTradeUrl(tempTradeUrl);
    setTradeUrl(tempTradeUrl);
    setShowTradeUrlDialog(false);
    setTradeUrlError(null);
  };

  // Start Case Opening Spin
  const handleOpenCase = (c: CS2Case) => {
    if (isSpinning) return;

    if (balance < c.priceEur) {
      sound.playClick();
      alert(`Bilanci juaj (${balance.toFixed(2)} €) nuk mjafton për këtë arkë (${c.priceEur.toFixed(2)} €). Mund të shtoni bilanc demo me butonin sipër!`);
      return;
    }

    // Deduct balance
    const success = deductVortexWalletBalance(c.priceEur);
    if (!success) return;

    sound.playBuyWeapon();
    setIsSpinning(true);
    setWonSkin(null);
    setDeliveryResult(null);
    setDeliveryProgress(null);
    setDeliveryError(null);

    // Pick winning item with realistic weighted odds
    // Extraordinaries have 2.5% chance, Coverts 15%, Classified 35%, others rest
    let selectedWonSkin: CS2Skin;
    const rand = Math.random() * 100;
    const extraordinaryItems = c.items.filter(i => i.rarity === 'extraordinary');
    const covertItems = c.items.filter(i => i.rarity === 'covert');
    const otherItems = c.items.filter(i => i.rarity !== 'extraordinary' && i.rarity !== 'covert');

    if (rand < 5 && extraordinaryItems.length > 0) {
      selectedWonSkin = extraordinaryItems[Math.floor(Math.random() * extraordinaryItems.length)];
    } else if (rand < 30 && covertItems.length > 0) {
      selectedWonSkin = covertItems[Math.floor(Math.random() * covertItems.length)];
    } else {
      selectedWonSkin = (otherItems.length > 0 ? otherItems : c.items)[Math.floor(Math.random() * (otherItems.length || c.items.length))];
    }

    // Build reel with 45 items, placing winning item at index 36
    const generatedReel: CS2Skin[] = [];
    for (let i = 0; i < 45; i++) {
      if (i === 36) {
        generatedReel.push(selectedWonSkin);
      } else {
        const randItem = c.items[Math.floor(Math.random() * c.items.length)];
        generatedReel.push(randItem);
      }
    }
    setReelItems(generatedReel);

    // Reset offset
    setReelOffset(0);

    // Animate spinner deceleration
    const cardWidth = 140; // width of each card + margin
    const targetOffset = 36 * cardWidth - 280 + Math.floor(Math.random() * 60) - 30; // center on item 36 with small random jitter

    // Play tick sounds as it decelerates
    const startTime = Date.now();
    const duration = 5200; // 5.2 seconds spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(tickInterval);
      } else {
        // Ticking pace slows down as elapsed approaches duration
        const pace = Math.sin((elapsed / duration) * (Math.PI / 2));
        if (Math.random() > pace * 0.7) {
          sound.playCaseTick();
          tickCount++;
        }
      }
    }, 90);

    setTimeout(() => {
      setReelOffset(targetOffset);
    }, 50);

    // Finished spinning
    setTimeout(() => {
      setIsSpinning(false);
      setWonSkin(selectedWonSkin);

      if (selectedWonSkin.rarity === 'extraordinary') {
        sound.playRareGoldDrop();
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.55 },
          colors: ['#FFD700', '#FFA500', '#FFFFFF', '#A3E635']
        });
      } else if (selectedWonSkin.rarity === 'covert') {
        sound.playTournamentVictory();
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EB4B4B', '#FF3881', '#FFFFFF']
        });
      } else {
        sound.playSelect();
      }
    }, duration + 200);
  };

  // Dispatch Won Skin to Steam via Trade Bot
  const handleDispatchSkin = async () => {
    if (!wonSkin) return;
    if (!tradeUrl || !isValidSteamTradeUrl(tradeUrl)) {
      setShowTradeUrlDialog(true);
      return;
    }

    sound.playSelect();
    setDeliveryError(null);
    setDeliveryResult(null);

    try {
      const result = await dispatchSkinViaTradeBot(wonSkin, tradeUrl, (step, message) => {
        setDeliveryProgress({ step, message });
      });
      setDeliveryResult(result);
      sound.playTournamentVictory();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Ndodhi një gabim gjatë lidhjes me Steam Trade Bot.';
      setDeliveryError(errorMsg);
    }
  };

  // Sell Skin for Balance
  const handleSellSkin = () => {
    if (!wonSkin) return;
    sound.playClick();
    const sellValue = parseFloat((wonSkin.priceEur * 0.85).toFixed(2));
    creditVortexWalletBalance(sellValue);
    alert(`Sapo shitët [${wonSkin.name}] për ${sellValue.toFixed(2)} €! Bilanci juaj u përditësua.`);
    setWonSkin(null);
    setDeliveryResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => !isSpinning && onClose()}
      />

      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0A0C13] border border-[#202538] shadow-2xl z-10 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* ======================================================== */}
        {/* MODAL TOP BAR: LOGO, WALLET BALANCE & STEAM TRADE URL     */}
        {/* ======================================================== */}
        <div className="px-5 py-4 border-b border-[#181B26] bg-[#0E1018] flex items-center justify-between shrink-0 flex-wrap gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            {activeCase ? (
              <button
                disabled={isSpinning}
                onClick={() => {
                  sound.playClick();
                  setActiveCase(null);
                  setWonSkin(null);
                  setDeliveryResult(null);
                }}
                className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                title="Kthehu te Lista e Arkave"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-[#A3E635] flex items-center justify-center text-black font-black font-display text-sm shadow-md">
                <Flame className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg text-white tracking-tight">
                  {activeCase ? activeCase.name : 'VORTEX CS2 CASES'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#A3E635]/15 text-[#A3E635] text-[10px] font-mono font-bold border border-[#A3E635]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  STEAM BOT LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                {activeCase ? activeCase.subtitle : 'Hap arkat zyrtare Vortex & dërgo skinet direkt në llogarinë tënde Steam'}
              </p>
            </div>
          </div>

          {/* Right Controls: Balance + Trade URL + Close */}
          <div className="flex items-center gap-2.5">
            {/* Wallet Balance Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141824] border border-white/10">
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Bilanci Yt:</div>
                <div className="text-xs font-black font-mono text-emerald-400">{balance.toFixed(2)} €</div>
              </div>
              <button
                onClick={() => {
                  sound.playSelect();
                  creditVortexWalletBalance(20.00);
                }}
                className="ml-1 px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold transition cursor-pointer"
                title="Shto +20.00 € për testim"
              >
                + Demo €
              </button>
            </div>

            {/* Steam Trade URL Status Button */}
            <button
              onClick={() => {
                sound.playClick();
                setTempTradeUrl(tradeUrl);
                setShowTradeUrlDialog(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                tradeUrl && isValidSteamTradeUrl(tradeUrl)
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 animate-pulse'
              }`}
              title="Konfiguro Steam Trade URL"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {tradeUrl && isValidSteamTradeUrl(tradeUrl) ? 'Steam Lidhur ✓' : 'Lidh Steam Trade URL'}
              </span>
            </button>

            {/* Close Button */}
            {!isSpinning && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN BODY: CATALOG VIEW OR CASE OPENING STAGE             */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-gradient-to-b from-[#0B0D15] to-[#08090E]">
          
          {!activeCase ? (
            /* ====================================================== */
            /* VIEW 1: CASE CATALOG (GRID OF 4 VORTEX CRATES)          */
            /* ====================================================== */
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-display font-black text-white">Arkat Zyrtare të Armëve & Thikave</h3>
                  <p className="text-xs text-slate-400 font-sans">Zgjidhni arkën e dëshiruar dhe provoni shansin për thika Covert dhe Classified</p>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DMarket B2B Pool: 100% Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {VORTEX_CASE_CATALOG.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      sound.playSelect();
                      setActiveCase(c);
                    }}
                    className="rounded-2xl bg-[#10131E] hover:bg-[#141826] border border-[#1E2335] hover:border-amber-500/40 p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between relative shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
                  >
                    {/* Top Case Header */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span 
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${c.glowColor}20`, color: c.glowColor, border: `1px solid ${c.glowColor}40` }}
                        >
                          {c.items.length} SKINS
                        </span>
                        <span className="text-xs font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/25">
                          {c.priceEur.toFixed(2)} €
                        </span>
                      </div>

                      {/* 3D Crate Image with Glow */}
                      <div className="relative my-4 flex items-center justify-center min-h-[140px]">
                        <div 
                          className="absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                          style={{ backgroundColor: c.glowColor }}
                        />
                        <img 
                          src={c.image} 
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="relative w-36 h-32 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>

                      <h4 className="font-display font-black text-white text-base group-hover:text-amber-400 transition">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {c.description}
                      </p>
                    </div>

                    {/* Bottom Preview Drops */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {c.items.slice(0, 4).map((item, idx) => (
                          <img 
                            key={idx}
                            src={item.image} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full bg-black/60 border border-white/10 object-contain p-0.5"
                            title={item.name}
                          />
                        ))}
                      </div>

                      <button
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] group-hover:bg-amber-400 group-hover:text-black text-slate-200 text-xs font-display font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Hap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informative Security Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-[#0E111B] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Dërgesë 100% e automatizuar përmes Steam Trade Offer. Skinet vijnë brenda 60 sekondave.</span>
                </div>
                <div className="text-slate-500 shrink-0">
                  Powered by Steam Web API & DMarket B2B Engine
                </div>
              </div>
            </div>
          ) : (
            /* ====================================================== */
            /* VIEW 2: ACTIVE CASE OPENING & HORIZONTAL REEL           */
            /* ====================================================== */
            <div className="flex flex-col items-center">
              
              {!wonSkin ? (
                /* ---------------------------------------------------- */
                /* STAGE A: SPINNER REEL & OPEN BUTTON                  */
                /* ---------------------------------------------------- */
                <div className="w-full flex flex-col items-center">
                  
                  {/* Case Info Capsule */}
                  <div className="flex items-center gap-3 mb-6">
                    <img src={activeCase.image} alt={activeCase.name} referrerPolicy="no-referrer" className="w-14 h-12 object-contain" />
                    <div>
                      <h3 className="font-display font-black text-xl text-white">{activeCase.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">Çmimi për hapje: <strong className="text-amber-400">{activeCase.priceEur.toFixed(2)} €</strong></p>
                    </div>
                  </div>

                  {/* Horizontal Spinner Reel Container */}
                  <div className="relative w-full max-w-3xl h-44 rounded-2xl bg-[#07080D] border-2 border-[#1E2335] shadow-2xl overflow-hidden flex items-center">
                    
                    {/* Top & Bottom Center Needles */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-amber-400 z-30 shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-amber-400" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-amber-400" />
                    </div>

                    {/* Gradient Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#07080D] to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#07080D] to-transparent z-20 pointer-events-none" />

                    {/* Moving Strip of Skins */}
                    {reelItems.length > 0 ? (
                      <div 
                        ref={reelRef}
                        className="flex items-center gap-2 pl-4 transition-transform ease-out"
                        style={{
                          transform: `translateX(-${reelOffset}px)`,
                          transitionDuration: isSpinning ? '5200ms' : '0ms',
                          transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.25, 1)'
                        }}
                      >
                        {reelItems.map((item, idx) => (
                          <div 
                            key={`${item.id}-${idx}`}
                            className="w-32 h-36 rounded-xl bg-[#0F121C] border flex flex-col items-center justify-between p-2 shrink-0 relative overflow-hidden"
                            style={{ borderColor: `${item.rarityColor}40` }}
                          >
                            <span 
                              className="w-full text-center text-[9px] font-mono font-bold uppercase truncate"
                              style={{ color: item.rarityColor }}
                            >
                              {item.weapon}
                            </span>

                            <img 
                              src={item.image} 
                              alt={item.name} 
                              referrerPolicy="no-referrer"
                              crossOrigin="anonymous"
                              loading="eager"
                              className="w-24 h-20 object-contain drop-shadow-md my-auto" 
                            />

                            <div className="w-full text-center">
                              <div className="text-[10px] font-bold text-white truncate font-display">{item.skinName}</div>
                              <div className="text-[9px] font-mono text-slate-400">{item.priceEur.toFixed(2)} €</div>
                            </div>

                            {/* Bottom Rarity Stripe */}
                            <div 
                              className="absolute bottom-0 left-0 right-0 h-1" 
                              style={{ backgroundColor: item.rarityColor }} 
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Idle Case Showcase before spin */
                      <div className="w-full flex items-center justify-center gap-4">
                        <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                        <span className="font-display font-bold text-slate-300 text-sm tracking-wider uppercase">
                          Shtyp butonin më poshtë për të rrotulluar arkën
                        </span>
                        <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Open Case Action Button */}
                  <div className="mt-8 flex flex-col items-center">
                    <button
                      disabled={isSpinning}
                      onClick={() => handleOpenCase(activeCase)}
                      className={`px-10 py-4 rounded-2xl font-display font-black text-base uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-3 shadow-2xl ${
                        isSpinning
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95'
                      }`}
                    >
                      <Flame className="w-5 h-5 fill-current" />
                      <span>{isSpinning ? 'Po Rrotullohet...' : `Hap Arkën (${activeCase.priceEur.toFixed(2)} €)`}</span>
                    </button>
                    <span className="text-[11px] font-mono text-slate-500 mt-2">
                      Rrotullim i certifikuar Provably Fair me Steam Trade Bot Delivery
                    </span>
                  </div>

                  {/* Available Items Preview in this Case */}
                  <div className="w-full mt-10">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Përmbajtja e mundshme e kësaj arke ({activeCase.items.length} Armë):
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {activeCase.items.map((it) => (
                        <div 
                          key={it.id}
                          className="p-2.5 rounded-xl bg-[#0E111A] border border-white/5 hover:border-white/20 transition flex flex-col items-center text-center group"
                        >
                          <img src={it.image} alt={it.name} referrerPolicy="no-referrer" className="w-16 h-12 object-contain group-hover:scale-110 transition" />
                          <div className="text-[10px] font-bold text-white truncate w-full mt-1">{it.name}</div>
                          <span className="text-[9px] font-mono font-bold text-amber-400">{it.priceEur.toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* ---------------------------------------------------- */
                /* STAGE B: WON ITEM REVEAL & DIRECT STEAM BOT DISPATCH */
                /* ---------------------------------------------------- */
                <div className="w-full max-w-xl rounded-3xl bg-[#0E111C] border border-[#232A3D] p-6 sm:p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
                  
                  {/* Background Aura */}
                  <div 
                    className="absolute inset-0 blur-3xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: wonSkin.rarityColor }}
                  />

                  {/* Header Title */}
                  <div 
                    className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase mb-2 tracking-wider"
                    style={{ backgroundColor: `${wonSkin.rarityColor}20`, color: wonSkin.rarityColor, border: `1px solid ${wonSkin.rarityColor}40` }}
                  >
                    Urime! Fitove {wonSkin.rarity.toUpperCase()}
                  </div>

                  <h3 className="font-display font-black text-2xl text-white tracking-tight mt-1">
                    {wonSkin.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                    <span>Gjendja: <strong className="text-white">{wonSkin.wear}</strong></span>
                    <span>•</span>
                    <span>Float: <strong className="text-white">{wonSkin.floatValue}</strong></span>
                    <span>•</span>
                    <span>Vlera në Treg: <strong className="text-emerald-400 font-bold">{wonSkin.priceEur.toFixed(2)} €</strong></span>
                  </div>

                  {/* Big Skin Artwork */}
                  <div className="relative my-6 flex items-center justify-center">
                    <img 
                      src={wonSkin.image} 
                      alt={wonSkin.name} 
                      referrerPolicy="no-referrer"
                      className="w-56 h-40 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] scale-110 animate-bounce duration-1000"
                    />
                  </div>

                  {/* Delivery Status / Stepper if dispatching */}
                  {deliveryProgress && (
                    <div className="w-full mb-5 p-3.5 rounded-2xl bg-[#141826] border border-amber-400/30 flex items-center gap-3 animate-pulse">
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
                      <div className="text-left text-xs font-mono text-slate-200">
                        <div className="font-bold text-amber-400">Hapi {deliveryProgress.step}/3:</div>
                        <div>{deliveryProgress.message}</div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Success Card */}
                  {deliveryResult && (
                    <div className="w-full mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left animate-in fade-in">
                      <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm mb-1">
                        <Check className="w-4 h-4" />
                        <span>Trade Offer u dërgua në Steam me sukses!</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans mb-2">
                        {deliveryResult.message}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-emerald-500/20">
                        <span>Bot: <strong className="text-white">{deliveryResult.botName}</strong></span>
                        <a 
                          href="https://steamcommunity.com/my/tradeoffers/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1 font-bold"
                        >
                          <span>Hap Ofertat në Steam</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Delivery Error */}
                  {deliveryError && (
                    <div className="w-full mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-left text-xs font-mono text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{deliveryError}</span>
                    </div>
                  )}

                  {/* Action Buttons: 1. Send to Steam via Bot, 2. Sell for Balance, 3. Open Another */}
                  {!deliveryResult ? (
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                      <button
                        onClick={handleDispatchSkin}
                        className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                      >
                        <Send className="w-4 h-4" />
                        <span>Dërgo në Steam me Bot</span>
                      </button>

                      <button
                        onClick={handleSellSkin}
                        className="w-full sm:flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                        title="Shit menjëherë për të hapur arka të tjera"
                      >
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>Shit për {(wonSkin.priceEur * 0.85).toFixed(2)} €</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setWonSkin(null);
                          setDeliveryResult(null);
                        }}
                        className="w-full py-3.5 rounded-xl bg-[#A3E635] hover:bg-[#84cc16] text-black font-display font-black text-sm uppercase tracking-wider transition cursor-pointer shadow-lg"
                      >
                        Hap një Arkë Tjetër
                      </button>
                    </div>
                  )}

                  {/* Bottom Steam Trade URL Info Note */}
                  <div className="mt-4 pt-3 border-t border-white/5 w-full flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="truncate">
                      Steam Trade URL: {tradeUrl ? `${tradeUrl.slice(0, 32)}...` : 'Ende pa lidhur'}
                    </span>
                    <button
                      onClick={() => setShowTradeUrlDialog(true)}
                      className="text-amber-400 hover:underline shrink-0 ml-2 cursor-pointer"
                    >
                      Ndrysho Lidhjen
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ======================================================== */}
      {/* STEAM TRADE URL CONFIGURATION DIALOG                      */}
      {/* ======================================================== */}
      {showTradeUrlDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowTradeUrlDialog(false)}
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-[#0D1017] border border-[#232B3E] p-6 shadow-2xl z-10 flex flex-col text-left animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowTradeUrlDialog(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-black text-lg text-white">Lidhja e Steam Trade URL</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans mb-4">
              Për t'ju dërguar skinet dhe thikat automatikisht përmes bot-it në llogarinë tuaj Steam, ju nevojitet Steam Trade URL.
            </p>

            <label className="text-[11px] font-mono text-slate-300 font-bold mb-1.5 block">
              Vendosni Steam Trade URL tuaj:
            </label>
            <input 
              type="text"
              value={tempTradeUrl}
              onChange={(e) => setTempTradeUrl(e.target.value)}
              placeholder="https://steamcommunity.com/tradeoffer/new/?partner=XXXXXXX&token=YYYYYYYY"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141824] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition mb-2"
            />

            {tradeUrlError && (
              <span className="text-[11px] font-mono text-red-400 mb-3 block">
                ⚠ {tradeUrlError}
              </span>
            )}

            {/* Helper link to Steam Trade URL Privacy Page */}
            <a 
              href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline flex items-center gap-1.5 mb-5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ku ta gjej Trade URL-në time në Steam? (Kliko këtu)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
              <button
                onClick={() => setShowTradeUrlDialog(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                Anulo
              </button>
              <button
                onClick={handleSaveTradeUrl}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Ruaj Lidhjen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
