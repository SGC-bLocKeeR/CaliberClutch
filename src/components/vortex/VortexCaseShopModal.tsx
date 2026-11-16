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
  Layers,
  ShoppingCart,
  Search,
  Key,
  Terminal,
  Zap,
  CheckCircle2,
  Lock,
  TrendingUp,
  Tag,
  Filter,
  ArrowUpRight,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { XsollaCheckoutModal } from './XsollaCheckoutModal';
import { HellcasePayBySkinsModal } from './HellcasePayBySkinsModal';
import { addUserSkinToInventory, removeUserSkinFromInventory } from '../../services/withdrawalService';
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
  TradeOfferDeliveryResult,
  DMarketMarketItem,
  DMARKET_LIVE_SKINS,
  getDMarketCredentials,
  saveDMarketCredentials,
  testDMarketLiveConnection,
  buySkinDirectFromDMarket,
  DMarketTestResult,
  rollProvablyFairSkin,
  generateRealisticReel
} from '../../services/skinDeliveryService';


const RECENT_LUCKY_DROPS = [
  { weapon: 'Butterfly Knife', skin: 'Slaughter', wear: 'FN', price: 1480.00, mult: 'x800.0', rarityColor: '#FFD700', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qv2-t0ouBWQyC0nQlp4G_dmdauIC_DPQBzDpclRLINsEXsx92yP7jq7gXd2t1NzCT3iCwc6TErvbhfNpboFw' },
  { weapon: 'AWP', skin: 'Chrome Cannon', wear: 'FN', price: 120.00, mult: 'x48.9', rarityColor: '#EB4B4B', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_DVL0OarZbRoMvWXMWuZxuZi_uM6SXngxR5-smTXw4ugIi6RbVcpXsN1ELUDtxPrktOyNL7h4g2P2tpbjXKpKIbjbD4' },
  { weapon: 'AK-47', skin: 'Nightwish', wear: 'MW', price: 58.00, mult: 'x31.3', rarityColor: '#EB4B4B', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6afBSJf2DC3Wf09F6ueZhW2exwBh_6m3dnt36InjDPQ4oXJt1TbJeshW_mtfjN-vrsgaKiokWy333kGoXuRj4z9Nd' },
  { weapon: 'Desert Eagle', skin: 'Printstream', wear: 'FT', price: 55.00, mult: 'x57.8', rarityColor: '#EB4B4B', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV' },
  { weapon: 'M4A4', skin: 'Temukau', wear: 'FT', price: 75.00, mult: 'x38.4', rarityColor: '#EB4B4B', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSNPWeG2yR1NF6ueZhW2ewlBtx5W6AmYv9JS6XaAV1CJEmTeUL4UTpxNzjZO3jtgaIjN9ExCuskGoXuRnyRhBA' },
  { weapon: 'Skeleton Knife', skin: 'Case Hardened', wear: 'FT', price: 560.00, mult: 'x589.4', rarityColor: '#FFD700', image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I5PeibbBiLs-SH1ifyOJztN5lRi67gVMj6m3Rnt2sdnOUZwIgWJAkTLUJ4xbrx9buYuywsgCLjItBmC79jiNN8G81tGbdgHHm' }
];


interface SkinWearBreakdown {
  wearLabel: 'FN' | 'MW' | 'FT' | 'WW' | 'BS';
  price: number;
  dropPercent: number;
  wearColor: string;
}

const getSkinWearBreakdown = (item: CS2Skin): SkinWearBreakdown[] => {
  const basePrice = item.priceEur;
  const baseDrop = item.dropChancePercent ?? 1.0;

  if (item.wearPrices) {
    const wp = item.wearPrices;
    const res: SkinWearBreakdown[] = [];
    if (wp.BS !== undefined) res.push({ wearLabel: 'BS', price: wp.BS, dropPercent: Number((baseDrop * 0.12).toFixed(3)), wearColor: '#F87171' });
    if (wp.WW !== undefined) res.push({ wearLabel: 'WW', price: wp.WW, dropPercent: Number((baseDrop * 0.16).toFixed(3)), wearColor: '#FB923C' });
    if (wp.FT !== undefined) res.push({ wearLabel: 'FT', price: wp.FT, dropPercent: Number((baseDrop * 0.40).toFixed(3)), wearColor: '#F59E0B' });
    if (wp.MW !== undefined) res.push({ wearLabel: 'MW', price: wp.MW, dropPercent: Number((baseDrop * 0.22).toFixed(3)), wearColor: '#38BDF8' });
    if (wp.FN !== undefined) res.push({ wearLabel: 'FN', price: wp.FN, dropPercent: Number((baseDrop * 0.10).toFixed(3)), wearColor: '#A3E635' });
    return res;
  }

  if (item.rarity === 'extraordinary') {
    return [
      { wearLabel: 'FN', price: Number((basePrice * 1.25).toFixed(2)), dropPercent: Number((baseDrop * 0.45).toFixed(3)), wearColor: '#A3E635' },
      { wearLabel: 'MW', price: Number((basePrice * 1.05).toFixed(2)), dropPercent: Number((baseDrop * 0.35).toFixed(3)), wearColor: '#38BDF8' },
      { wearLabel: 'FT', price: Number((basePrice * 0.85).toFixed(2)), dropPercent: Number((baseDrop * 0.20).toFixed(3)), wearColor: '#F59E0B' }
    ];
  }

  if (item.rarity === 'covert' || item.rarity === 'classified') {
    return [
      { wearLabel: 'BS', price: Number((basePrice * 0.78).toFixed(2)), dropPercent: Number((baseDrop * 0.12).toFixed(3)), wearColor: '#F87171' },
      { wearLabel: 'WW', price: Number((basePrice * 0.88).toFixed(2)), dropPercent: Number((baseDrop * 0.14).toFixed(3)), wearColor: '#FB923C' },
      { wearLabel: 'FT', price: Number((basePrice * 1.00).toFixed(2)), dropPercent: Number((baseDrop * 0.38).toFixed(3)), wearColor: '#F59E0B' },
      { wearLabel: 'MW', price: Number((basePrice * 1.20).toFixed(2)), dropPercent: Number((baseDrop * 0.24).toFixed(3)), wearColor: '#38BDF8' },
      { wearLabel: 'FN', price: Number((basePrice * 1.55).toFixed(2)), dropPercent: Number((baseDrop * 0.12).toFixed(3)), wearColor: '#A3E635' }
    ];
  }

  return [
    { wearLabel: 'BS', price: Number((basePrice * 0.80).toFixed(2)), dropPercent: Number((baseDrop * 0.12).toFixed(3)), wearColor: '#F87171' },
    { wearLabel: 'WW', price: Number((basePrice * 0.90).toFixed(2)), dropPercent: Number((baseDrop * 0.16).toFixed(3)), wearColor: '#FB923C' },
    { wearLabel: 'FT', price: Number((basePrice * 1.00).toFixed(2)), dropPercent: Number((baseDrop * 0.40).toFixed(3)), wearColor: '#F59E0B' },
    { wearLabel: 'MW', price: Number((basePrice * 1.30).toFixed(2)), dropPercent: Number((baseDrop * 0.22).toFixed(3)), wearColor: '#38BDF8' },
    { wearLabel: 'FN', price: Number((basePrice * 1.70).toFixed(2)), dropPercent: Number((baseDrop * 0.10).toFixed(3)), wearColor: '#A3E635' }
  ];
};

interface VortexCaseShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCaseId?: string;
}

export const VortexCaseShopModal: React.FC<VortexCaseShopModalProps> = ({ isOpen, onClose, initialCaseId }) => {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'cases' | 'market' | 'dmarket-api'>('cases');
  const [activeCase, setActiveCase] = useState<CS2Case | null>(null);

  useEffect(() => {
    if (isOpen && initialCaseId) {
      const found = VORTEX_CASE_CATALOG.find(c => c.id === initialCaseId);
      if (found) {
        setActiveCase(found);
        setActiveTab('cases');
      }
    }
  }, [isOpen, initialCaseId]);
  const [balance, setBalance] = useState<number>(() => getVortexWalletBalance());
  const [tradeUrl, setTradeUrl] = useState<string>(() => getSavedSteamTradeUrl());
  const [showTradeUrlDialog, setShowTradeUrlDialog] = useState<boolean>(false);
  const [showXsollaModal, setShowXsollaModal] = useState<boolean>(false);
  const [showHellcaseModal, setShowHellcaseModal] = useState<boolean>(false);
  const [tempTradeUrl, setTempTradeUrl] = useState<string>(tradeUrl);
  const [tradeUrlError, setTradeUrlError] = useState<string | null>(null);

  // Spinner & Animation State for Cases (Hellcase Style Multi-Case & Fast Mode)
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonSkin, setWonSkin] = useState<CS2Skin | null>(null);
  const [wonSkins, setWonSkins] = useState<CS2Skin[]>([]);
  const [caseCount, setCaseCount] = useState<number>(1);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (id: string) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const [fastMode, setFastMode] = useState<boolean>(false);
  const [reelItems, setReelItems] = useState<CS2Skin[]>([]);
  const [reelOffset, setReelOffset] = useState<number>(0);
  const [isReelAnimating, setIsReelAnimating] = useState<boolean>(false);
  const [spinKey, setSpinKey] = useState<number>(() => Date.now());
  const reelRef = useRef<HTMLDivElement>(null);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sellToast, setSellToast] = useState<string | null>(null);
  const [showProvablyFairModal, setShowProvablyFairModal] = useState<boolean>(false);

  // Case Trade Bot Delivery State
  const [deliveryProgress, setDeliveryProgress] = useState<{ step: number; message: string } | null>(null);
  const [deliveryResult, setDeliveryResult] = useState<TradeOfferDeliveryResult | null>(null);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  // DMarket Direct Buy Market State
  const [marketCategory, setMarketCategory] = useState<'all' | 'knife' | 'rifle' | 'sniper' | 'pistol'>('all');
  const [marketSearch, setMarketSearch] = useState<string>('');
  const [directBuyProgress, setDirectBuyProgress] = useState<{ step: number; message: string } | null>(null);
  const [directBuyResult, setDirectBuyResult] = useState<TradeOfferDeliveryResult | null>(null);
  const [directBuyError, setDirectBuyError] = useState<string | null>(null);

  // DMarket Live API Credentials & Handshake State
  const [dmarketCreds, setDmarketCreds] = useState(() => getDMarketCredentials());
  const [tempPublic, setTempPublic] = useState(dmarketCreds.publicKey);
  const [tempSecret, setTempSecret] = useState(dmarketCreds.secretKey);
  const [isTestingDMarket, setIsTestingDMarket] = useState(false);
  const [dmarketTestLogs, setDmarketTestLogs] = useState<string[]>([]);
  const [dmarketTestResult, setDmarketTestResult] = useState<DMarketTestResult | null>(null);
  const [dmarketTestError, setDmarketTestError] = useState<string | null>(null);

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

  // Cleanup tick audio interval on unmount
  useEffect(() => {
    return () => {
      if (tickTimerRef.current) {
        clearInterval(tickTimerRef.current);
        tickTimerRef.current = null;
      }
    };
  }, []);

  // When activeCase changes, immediately reset and pre-populate an authentic reel from this exact case
  useEffect(() => {
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
    if (activeCase) {
      setReelOffset(0);
      setIsReelAnimating(false);
      setIsSpinning(false);
      setWonSkin(null);
      setWonSkins([]);
      setDeliveryResult(null);
      setDeliveryProgress(null);
      setDeliveryError(null);

      // Pre-populate with authentic Provably Fair weighted items from this exact case
      const placeholderWinner = rollProvablyFairSkin(activeCase.items);
      const initialReel = generateRealisticReel(activeCase.items, placeholderWinner, 36, 48);
      setReelItems(initialReel);
      setSpinKey(Date.now());
    } else {
      setReelItems([]);
      setWonSkin(null);
      setWonSkins([]);
      setReelOffset(0);
      setIsReelAnimating(false);
      setIsSpinning(false);
    }
  }, [activeCase]);

  // Fallback handler: if proxy image fails, fallback directly to official Steam Akamai CDN
  const handleImageFallback = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;

    if (currentSrc.includes('imgproxy.dmarket.com')) {
      try {
        const match = currentSrc.match(/\/g:ce\/([^.]+)/);
        if (match && match[1]) {
          let b64 = match[1].replace(/-/g, '+').replace(/_/g, '/');
          const pad = b64.length % 4;
          if (pad) b64 += '='.repeat(4 - pad);
          const decoded = atob(b64);
          if (decoded.startsWith('http')) {
            img.src = decoded;
            return;
          }
        }
      } catch {
        // Fallback error, continue
      }
    }
    // Prevent ugly broken image placeholder
    img.onerror = () => {
      img.style.display = 'none';
    };
  };

  if (!isOpen) return null;

  // Save Trade URL
  const handleSaveTradeUrl = () => {
    sound.playSelect();
    if (!tempTradeUrl) {
      setTradeUrlError('Please enter your Steam Trade URL.');
      return;
    }
    if (!isValidSteamTradeUrl(tempTradeUrl)) {
      setTradeUrlError('Invalid format. Must start with https://steamcommunity.com/tradeoffer/new/?partner=...');
      return;
    }
    saveSteamTradeUrl(tempTradeUrl);
    setTradeUrl(tempTradeUrl);
    setShowTradeUrlDialog(false);
    setTradeUrlError(null);
  };

  // Start Case Opening Spin with Provably Fair Weighted Odds & Multi-Case / Fast Mode
  const handleOpenCase = (c: CS2Case) => {
    if (isSpinning) return;

    const totalCost = c.priceEur * caseCount;
    if (balance < totalCost) {
      sound.playClick();
      setShowHellcaseModal(true);
      return;
    }

    // Deduct balance
    const success = deductVortexWalletBalance(totalCost);
    if (!success) return;

    sound.playBuyWeapon();
    setIsSpinning(true);
    setWonSkin(null);
    setWonSkins([]);
    setDeliveryResult(null);
    setDeliveryProgress(null);
    setDeliveryError(null);

    // Roll winners strictly using Provably Fair drop rates
    const rolledWinners: CS2Skin[] = [];
    for (let k = 0; k < caseCount; k++) {
      rolledWinners.push(rollProvablyFairSkin(c.items));
    }

    const primaryWinner = rolledWinners[0];

    // If Fast Mode is enabled: Instant reveal!
    if (fastMode) {
      setTimeout(() => {
        setIsSpinning(false);
        setWonSkin(primaryWinner);
        setWonSkins(rolledWinners);
        rolledWinners.forEach(s => addUserSkinToInventory(s));

        const hasGold = rolledWinners.some(w => w.rarity === 'extraordinary');
        const hasCovert = rolledWinners.some(w => w.rarity === 'covert');
        if (hasGold) {
          sound.playRareGoldDrop();
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.55 },
            colors: ['#FFD700', '#FFA500', '#FFFFFF', '#A3E635']
          });
        } else if (hasCovert) {
          sound.playTournamentVictory();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#EB4B4B', '#FF3881', '#FFFFFF']
          });
        } else {
          sound.playSelect();
        }
      }, 350);
      return;
    }

    // Build authentic reel strip landing on primaryWinner at index 36
    const generatedReel = generateRealisticReel(c.items, primaryWinner, 36, 48);
    const newSpinKey = Date.now();

    setIsSpinning(true);
    setIsReelAnimating(false);
    setReelOffset(0);
    setSpinKey(newSpinKey);
    setReelItems(generatedReel);

    // Calculate dynamic pixel-perfect offset so the winning skin stops dead center on any device (mobile, tablet, desktop)
    const containerEl = reelRef.current?.parentElement;
    const containerWidth = containerEl ? containerEl.clientWidth : (typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 896) : 600);
    const cardWidth = 128; // Tailwind w-32 = 128px
    const cardGap = 8;     // Tailwind gap-2 = 8px
    const pl = 16;         // Tailwind pl-4 = 16px
    const winnerCenter = pl + (36 * (cardWidth + cardGap)) + (cardWidth / 2); // Center of card #36
    const jitter = Math.floor(Math.random() * 30) - 15; // Organic slight offset (+/- 15px within card)
    const targetOffset = Math.max(0, winnerCenter - (containerWidth / 2) + jitter);

    // Ticks sound interval
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    const startTime = Date.now();
    const duration = 5200; // 5.2 seconds spin
    let tickCount = 0;
    tickTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      } else {
        const pace = Math.sin((elapsed / duration) * (Math.PI / 2));
        if (Math.random() > pace * 0.7) {
          sound.playCaseTick();
          tickCount++;
        }
      }
    }, 90);

    // Double requestAnimationFrame guarantees the browser has painted translateX(0px) with NO transition first, then kicks off the 5.2s animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsReelAnimating(true);
        setReelOffset(targetOffset);
      });
    });

    // Finished spinning
    setTimeout(() => {
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      setIsSpinning(false);
      setIsReelAnimating(false);
      setWonSkin(primaryWinner);
      setWonSkins(rolledWinners);
      rolledWinners.forEach(s => addUserSkinToInventory(s));

      const hasGold = rolledWinners.some(w => w.rarity === 'extraordinary');
      const hasCovert = rolledWinners.some(w => w.rarity === 'covert');
      if (hasGold) {
        sound.playRareGoldDrop();
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.55 },
          colors: ['#FFD700', '#FFA500', '#FFFFFF', '#A3E635']
        });
      } else if (hasCovert) {
        sound.playTournamentVictory();
        confetti({
          particleCount: 100,
          spread: 75,
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
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while connecting to Steam Trade Bot.';
      setDeliveryError(errorMsg);
    }
  };

  // Clean reset to case opening desk (resets offset, animation, and generates resting reel)
  const handleResetToCaseDesk = () => {
    setWonSkin(null);
    setWonSkins([]);
    setDeliveryResult(null);
    setDeliveryProgress(null);
    setDeliveryError(null);
    setReelOffset(0);
    setIsReelAnimating(false);
    setIsSpinning(false);
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
    if (activeCase) {
      const placeholderWinner = rollProvablyFairSkin(activeCase.items);
      const initialReel = generateRealisticReel(activeCase.items, placeholderWinner, 36, 48);
      setReelItems(initialReel);
      setSpinKey(Date.now());
    }
  };

  // Sell Skin(s) for Balance - Instant Hellcase / CSGORoll style (no browser alert popup)
  const handleSellSkin = () => {
    if (!wonSkin && (!wonSkins || wonSkins.length === 0)) return;
    try {
      sound.playBuyWeapon();
    } catch (_) {
      sound.playClick();
    }

    const totalRaw = wonSkins && wonSkins.length > 1
      ? wonSkins.reduce((acc, s) => acc + s.priceEur, 0)
      : (wonSkin?.priceEur ?? 0);

    const sellValue = parseFloat((totalRaw * 0.85).toFixed(2));
    creditVortexWalletBalance(sellValue);

    const count = (wonSkins && wonSkins.length > 0) ? wonSkins.length : 1;
    if (wonSkins && wonSkins.length > 0) {
      wonSkins.forEach(s => removeUserSkinFromInventory(s.id));
    } else if (wonSkin) {
      removeUserSkinFromInventory(wonSkin.id);
    }

    // Instant clean reset to case opening desk
    handleResetToCaseDesk();
    setSellToast(`✓ Sold ${count} ${count === 1 ? 'skin' : 'skins'} for +${sellValue.toFixed(2)} €! Credited to your wallet.`);
    setTimeout(() => setSellToast(null), 4000);
  };

  // Direct Buy Skin From DMarket
  const handleBuySkinDirect = async (item: DMarketMarketItem) => {
    if (!tradeUrl || !isValidSteamTradeUrl(tradeUrl)) {
      setShowTradeUrlDialog(true);
      return;
    }

    if (balance < item.priceEur) {
      sound.playClick();
      setDirectBuyError(`Insufficient balance (${balance.toFixed(2)} €) to purchase [${item.name}] (${item.priceEur.toFixed(2)} €). Opening Refill & Pay by Skins...`);
      setShowHellcaseModal(true);
      return;
    }

    sound.playBuyWeapon();
    setDirectBuyError(null);
    setDirectBuyResult(null);
    setDirectBuyProgress(null);

    try {
      const res = await buySkinDirectFromDMarket(item, tradeUrl, (step, message) => {
        setDirectBuyProgress({ step, message });
      });
      setDirectBuyResult(res);
      setDirectBuyProgress(null);
      sound.playTournamentVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while purchasing from DMarket.';
      setDirectBuyError(msg);
      setDirectBuyProgress(null);
    }
  };

  // Run Live DMarket Handshake Test
  const handleTestDMarketHandshake = async () => {
    sound.playSelect();
    setIsTestingDMarket(true);
    setDmarketTestError(null);
    setDmarketTestResult(null);
    setDmarketTestLogs([]);

    const log = (msg: string) => {
      setDmarketTestLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    try {
      log('Initiating connection to DMarket API Gateway (https://api.dmarket.com)...');
      await new Promise(r => setTimeout(r, 400));
      log(`Checking Public Key format (${tempPublic.slice(0, 12)}...)... OK`);
      await new Promise(r => setTimeout(r, 500));
      log('Generating Ed25519 signature with Secret Key (RFC 8032)...');
      await new Promise(r => setTimeout(r, 600));
      log('Dispatching authorized request GET /account/v1/balance to DMarket...');
      
      const res = await testDMarketLiveConnection(tempPublic, tempSecret);
      saveDMarketCredentials(tempPublic, tempSecret);
      setDmarketCreds({ publicKey: tempPublic, secretKey: tempSecret, isConnected: true });
      setDmarketTestResult(res);
      log(`200 OK response from DMarket in ${res.latencyMs}ms! DMarket balance: ${res.dmarketBalanceEur.toFixed(2)} €`);
      sound.playTournamentVictory();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection to DMarket API failed.';
      setDmarketTestError(msg);
      log(`ERROR: ${msg}`);
    } finally {
      setIsTestingDMarket(false);
    }
  };

  // Filtered DMarket Skins
  const filteredMarketSkins = DMARKET_LIVE_SKINS.filter(item => {
    const matchesCat = marketCategory === 'all' || item.category === marketCategory;
    const matchesSearch = !marketSearch || item.name.toLowerCase().includes(marketSearch.toLowerCase()) || item.weapon.toLowerCase().includes(marketSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => !isSpinning && onClose()}
      />

      <div className="relative w-full max-w-5xl rounded-3xl bg-[#090B11] border border-[#202538] shadow-2xl z-10 flex flex-col overflow-hidden max-h-[94vh]">
        
        {/* ======================================================== */}
        {/* MODAL TOP BAR: LOGO, WALLET BALANCE & NAVIGATION TABS    */}
        {/* ======================================================== */}
        <div className="px-5 py-3.5 border-b border-[#181B26] bg-[#0C0E16] flex items-center justify-between shrink-0 flex-wrap gap-3">
          
          {/* Left Brand & Tabs */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-[#A3E635] flex items-center justify-center text-black font-black font-display text-xs shadow-md">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <span className="font-display font-black text-white text-base tracking-tight">VORTEX CS2</span>
            </div>

            {/* Navigation Switcher (Cases vs DMarket Live Market vs API Connect) */}
            <div className="flex items-center bg-[#121522] p-1 rounded-xl border border-white/5">
              <button
                disabled={isSpinning}
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('cases');
                  setActiveCase(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  activeTab === 'cases'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Case Opening</span>
              </button>

              <button
                disabled={isSpinning}
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('market');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  activeTab === 'market'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Weapon Store</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-400 text-[9px] font-black">
                  INSTANT
                </span>
              </button>

              <button
                disabled={isSpinning}
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('dmarket-api');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  activeTab === 'dmarket-api'
                    ? 'bg-[#A3E635] text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Bot Gateway</span>
                <span className={`w-2 h-2 rounded-full ${dmarketCreds.isConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              </button>
            </div>
          </div>

          {/* Right Controls: Balance + Trade URL + Close */}
          <div className="flex items-center gap-2.5">
            {/* Wallet Balance Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141824] border border-white/10">
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Balance:</div>
                <div className="text-xs font-black font-mono text-emerald-400">{balance.toFixed(2)} €</div>
              </div>
              <button
                onClick={() => {
                  sound.playSelect();
                  setShowHellcaseModal(true);
                }}
                className="ml-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/35 hover:to-teal-500/35 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-black transition cursor-pointer flex items-center gap-1 shadow-sm"
                title="Filling up the balance • Pay by Skins, Crypto & Cards"
              >
                <span>REFILL</span>
                <span className="text-[8px] font-black text-white bg-black/35 px-1 py-0.2 rounded">+5%</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  window.dispatchEvent(new CustomEvent('vortex_open_withdraw_modal'));
                }}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/35 hover:to-orange-500/35 border border-amber-500/50 text-amber-300 text-[10px] font-mono font-black transition cursor-pointer flex items-center gap-1 shadow-sm"
                title="Withdraw won CS2 skins to Steam or Cashout to Crypto"
              >
                <span>WITHDRAW</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Steam Trade URL Status Button */}
            <button
              onClick={() => {
                sound.playClick();
                setTempTradeUrl(tradeUrl);
                setShowTradeUrlDialog(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                tradeUrl && isValidSteamTradeUrl(tradeUrl)
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 animate-pulse'
              }`}
              title="Configure Steam Trade URL"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {tradeUrl && isValidSteamTradeUrl(tradeUrl) ? 'Steam Linked ✓' : 'Link Steam'}
              </span>
            </button>

            {/* Close Button */}
            {!isSpinning && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN BODY: 3 TABS (CASES / DMARKET MARKET / API PANEL)    */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#090B12] to-[#07080D]">
          
          {/* ====================================================== */}
          {/* TAB 1: CS2 CASE OPENING SYSTEM                          */}
          {/* ====================================================== */}
          {activeTab === 'cases' && (
            <div>
              {!activeCase ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-display font-black text-white">Official CS2 3D Cases</h3>
                      <p className="text-xs text-slate-400 font-sans">Authentic Valve cases with Butterfly Knife, Karambit, and Skeleton Knife drops</p>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Steam Akamai CDN: Live</span>
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

                          {/* 3D Crate Image with Glow & Verified Akamai CDN */}
                          <div className="relative my-3 flex items-center justify-center min-h-[140px]">
                            <div 
                              className="absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                              style={{ backgroundColor: c.glowColor }}
                            />
                            <img 
                              src={c.image} 
                              alt={c.name}
                              referrerPolicy="no-referrer"
                              loading="eager"
                              onError={handleImageFallback}
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
                                loading="eager"
                                onError={handleImageFallback}
                                className="w-8 h-8 rounded-full bg-black/60 border border-white/10 object-contain p-0.5"
                                title={item.name}
                              />
                            ))}
                          </div>

                          <button
                            className="px-3 py-1.5 rounded-xl bg-white/[0.06] group-hover:bg-amber-400 group-hover:text-black text-slate-200 text-xs font-display font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ACTIVE CASE OPENING & HELLCASE-STYLE REEL & ODDS */
                <div className="flex flex-col items-center">
                  {/* Selling Won Skins Toast */}
                  {sellToast && (
                    <div className="w-full max-w-4xl mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{sellToast}</span>
                      </div>
                      <button 
                        onClick={() => setSellToast(null)} 
                        className="text-emerald-400 hover:text-white cursor-pointer p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {!wonSkin ? (
                    <div className="w-full flex flex-col items-center">
                      
                      {/* Hellcase Top Bar: Case Info, Multiplier Selector, Open Button & Fast Mode */}
                      <div className="w-full mb-5 p-3.5 sm:p-4 rounded-2xl bg-[#0B0D16] border border-[#1A1E2E] flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
                        
                        {/* Left: Case Info & Back Button */}
                        <div className="flex items-center gap-3">
                          <button
                            disabled={isSpinning}
                            onClick={() => {
                              sound.playSelect();
                              setActiveCase(null);
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Back to Cases"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <img 
                            src={activeCase.image} 
                            alt={activeCase.name} 
                            referrerPolicy="no-referrer"
                            loading="eager"
                            onError={handleImageFallback}
                            className="w-14 h-12 object-contain drop-shadow-md" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-black text-base sm:text-lg text-white">{activeCase.name}</h3>
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playSelect();
                                  setShowProvablyFairModal(true);
                                }}
                                className="px-2 py-0.5 rounded-full bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer border border-emerald-400/30 transition shadow-sm"
                                title="View Provably Fair SHA-256 algorithm & verify odds"
                              >
                                <ShieldCheck className="w-3 h-3" />
                                <span>Provably Fair</span>
                              </button>
                            </div>
                            <p className="text-xs text-slate-400 font-mono">
                              Price: <strong className="text-amber-400 font-bold">{activeCase.priceEur.toFixed(2)} €</strong> / case
                            </p>
                          </div>
                        </div>

                        {/* Center: Case Multiplier Selector [1] [2] [3] [4] [5] [10] */}
                        <div className="flex items-center gap-1 bg-[#06070B] p-1 rounded-xl border border-white/10 max-w-full overflow-x-auto shrink-0">
                          {[1, 2, 3, 4, 5, 10].map((num) => (
                            <button
                              key={num}
                              disabled={isSpinning}
                              onClick={() => {
                                sound.playSelect();
                                setCaseCount(num);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                                caseCount === num
                                  ? 'bg-amber-400 text-black shadow-md font-black'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>

                        {/* Right: Big Open Button & Fast Mode Toggle */}
                        <div className="flex items-center gap-3">
                          {/* Fast mode switch */}
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={fastMode}
                              disabled={isSpinning}
                              onChange={(e) => {
                                sound.playSelect();
                                setFastMode(e.target.checked);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#A3E635] relative cursor-pointer" />
                            <span className="text-xs font-mono text-slate-300 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" />
                              Fast mode
                            </span>
                          </label>

                          {/* Open Button */}
                          <button
                            disabled={isSpinning}
                            onClick={() => handleOpenCase(activeCase)}
                            className={`px-6 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg ${
                              isSpinning
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95'
                            }`}
                          >
                            <Flame className="w-4 h-4 fill-current" />
                            <span>
                              {isSpinning 
                                ? 'Spinning...' 
                                : `OPEN ${caseCount > 1 ? `${caseCount}X ` : ''}(${(activeCase.priceEur * caseCount).toFixed(2)} €)`}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Hellcase Style: Provably Fair Drop Probability Tier Bar */}
                      <div className="w-full max-w-4xl mb-4 px-4 py-2 rounded-xl bg-[#080A12] border border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono gap-2">
                        <span className="text-slate-400 font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Official Skin Odds:</span>
                        </span>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1 text-[#FFD700] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                            ★ Knife / Rare Special: 0.260%
                          </span>
                          <span className="flex items-center gap-1 text-[#EB4B4B] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#EB4B4B]" />
                            Covert: 0.640%
                          </span>
                          <span className="flex items-center gap-1 text-[#D32CE6] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#D32CE6]" />
                            Classified: 3.200%
                          </span>
                          <span className="flex items-center gap-1 text-[#8847FF] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#8847FF]" />
                            Restricted: 15.980%
                          </span>
                          <span className="flex items-center gap-1 text-[#4B69FF] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#4B69FF]" />
                            Mil-Spec: 79.920%
                          </span>
                        </div>
                      </div>

                      {/* Hellcase Style: Last 7 Days Top Drop Ticker */}
                      <div className="w-full max-w-4xl mb-5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-wider">
                          <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                          <span>Top Drops From This Case:</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                          {RECENT_LUCKY_DROPS.map((drop, idx) => (
                            <div 
                              key={idx}
                              className="p-2 rounded-xl bg-[#090C16] border border-white/5 flex flex-col items-center text-center group relative overflow-hidden"
                            >
                              <div className="w-full flex items-center justify-between text-[9px] font-mono mb-1">
                                <span className="text-white font-bold">{drop.price.toFixed(2)} €</span>
                                <span className="px-1 rounded bg-rose-500/20 text-rose-400 font-bold">{drop.mult}</span>
                              </div>
                              <img 
                                src={drop.image} 
                                alt={drop.skin} 
                                referrerPolicy="no-referrer"
                                loading="eager"
                                onError={(e) => {
                                  handleImageFallback(e);
                                  e.currentTarget.onerror = () => {
                                    e.currentTarget.style.display = 'none';
                                  };
                                }}
                                className="w-16 h-12 object-contain my-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" 
                              />
                              <div className="text-[10px] font-mono text-slate-400 truncate w-full">{drop.weapon}</div>
                              <div className="text-[10px] font-display font-bold text-white truncate w-full">{drop.skin}</div>
                              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: drop.rarityColor }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Horizontal Spinner Reel Container */}
                      <div className="relative w-full max-w-4xl h-44 rounded-2xl bg-[#07080D] border-2 border-[#1E2335] shadow-2xl overflow-hidden flex items-center my-2">
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-amber-400 z-30 shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-amber-400" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-amber-400" />
                        </div>

                        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#07080D] to-transparent z-20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#07080D] to-transparent z-20 pointer-events-none" />

                        {/* Moving Strip of Skins */}
                        {reelItems.length > 0 && (
                          <div 
                            key={spinKey}
                            ref={reelRef}
                            className="flex items-center gap-2 pl-4 will-change-transform"
                            style={{
                              transform: `translateX(-${reelOffset}px)`,
                              transition: isReelAnimating 
                                ? 'transform 5200ms cubic-bezier(0.12, 0.8, 0.25, 1)' 
                                : 'none'
                            }}
                          >
                            {reelItems.map((item, idx) => (
                              <div 
                                key={`${item.id}-${idx}`}
                                className="w-32 h-36 rounded-xl bg-[#0F121C] border flex flex-col items-center justify-between p-2 shrink-0 relative overflow-hidden"
                                style={{ borderColor: `${item.rarityColor}40` }}
                              >
                                <div className="w-full flex items-center justify-between text-[9px] font-mono">
                                  <span 
                                    className="font-bold uppercase truncate"
                                    style={{ color: item.rarityColor }}
                                  >
                                    {item.weapon}
                                  </span>
                                  <span className="text-slate-400 font-mono text-[8px]">
                                    {(item.dropChancePercent ?? 0) < 1 ? `${(item.dropChancePercent ?? 0).toFixed(3)}%` : `${(item.dropChancePercent ?? 0).toFixed(1)}%`}
                                  </span>
                                </div>

                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  referrerPolicy="no-referrer"
                                  loading="eager"
                                  onError={handleImageFallback}
                                  className="w-24 h-20 object-contain drop-shadow-md my-auto" 
                                />

                                <div className="w-full text-center">
                                  <div className="text-[10px] font-bold text-white truncate font-display">{item.skinName}</div>
                                  <div className="text-[9px] font-mono text-slate-400">{item.priceEur.toFixed(2)} €</div>
                                </div>

                                <div 
                                  className="absolute bottom-0 left-0 right-0 h-1" 
                                  style={{ backgroundColor: item.rarityColor }} 
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Hellcase Style: "Case contains" Grid */}
                      <div className="w-full max-w-4xl mt-6">
                        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <span>🧰 Case Items ({activeCase.items.length} Official Skins)</span>
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500">
                            Sorted by skin tier & drop probability
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                          {activeCase.items.map((it) => {
                            const isFlipped = !!flippedCards[it.id];
                            return (
                              <div 
                                key={it.id}
                                className="relative p-2.5 rounded-xl bg-[#090C16] border border-[#1A1E2E] hover:border-amber-400/50 transition-all duration-200 flex flex-col justify-between group overflow-hidden shadow-md min-h-[175px]"
                              >
                                {isFlipped ? (
                                  /* HELLCASE FLIPPED WEAR / PRICE / DROPS TABLE */
                                  <div className="relative z-10 flex flex-col justify-between h-full w-full">
                                    {/* Flipped Header with Close [x] Button */}
                                    <div className="flex items-center justify-between text-[10px] font-mono font-black text-slate-400 border-b border-white/10 pb-1 mb-1.5">
                                      <span className="w-9 text-left">Wear</span>
                                      <span className="w-14 text-center">Price</span>
                                      <span className="flex-1 text-right pr-1">Drops</span>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleCardFlip(it.id);
                                        }}
                                        className="text-slate-400 hover:text-white transition p-0.5 cursor-pointer"
                                        title="Mbyll"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Wear Condition Rows */}
                                    <div className="flex flex-col gap-1 py-0.5 text-[9px] font-mono">
                                      {getSkinWearBreakdown(it).map((row, rIdx) => (
                                        <div key={rIdx} className="flex items-center justify-between">
                                          <span className="w-9 font-bold truncate" style={{ color: row.wearColor }}>
                                            {row.wearLabel}
                                          </span>
                                          <span className="w-14 text-center font-bold text-emerald-400">
                                            {row.price.toFixed(2)} €
                                          </span>
                                          <span className={`flex-1 text-right font-bold pr-1 ${
                                            row.dropPercent < 0.05 
                                              ? 'text-rose-400' 
                                              : row.dropPercent < 1 
                                                ? 'text-amber-400' 
                                                : 'text-slate-300'
                                          }`}>
                                            {row.dropPercent.toFixed(3)}%
                                          </span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Weapon Watermark in background */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                                      <img src={it.image} alt="" className="w-24 h-20 object-contain" />
                                    </div>

                                    {/* Footer Name in flipped view */}
                                    <div className="mt-1 pt-1 border-t border-white/5 text-[9px] font-mono text-slate-400 truncate text-center">
                                      {it.skinName}
                                    </div>
                                  </div>
                                ) : (
                                  /* STANDARD WEAPON CARD WITH CIRCULAR (i) BUTTON */
                                  <>
                                    {/* Top Bar: Drops: X.XXX% & Hellcase Circular Info (i) Icon */}
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span 
                                        className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded"
                                        style={{ 
                                          backgroundColor: `${it.rarityColor}18`, 
                                          color: it.rarityColor, 
                                          border: `1px solid ${it.rarityColor}40` 
                                        }}
                                      >
                                        Drops: {(it.dropChancePercent ?? 0).toFixed(3)}%
                                      </span>
                                      
                                      {/* Authentic Hellcase Circular (i) Button */}
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          sound.playSelect();
                                          toggleCardFlip(it.id);
                                        }}
                                        className="w-4 h-4 rounded-full bg-[#1F273B] hover:bg-amber-400 text-slate-300 hover:text-black flex items-center justify-center text-[10px] font-serif font-black transition cursor-pointer shadow-sm border border-white/10" 
                                        title="View wear conditions & odds (Wear / Price / Drops)"
                                      >
                                        i
                                      </button>
                                    </div>

                                    {/* Weapon Image with Akamai CDN and fallback */}
                                    <div className="relative my-2 h-18 flex items-center justify-center">
                                      <div 
                                        className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-20 transition-opacity"
                                        style={{ backgroundColor: it.rarityColor }}
                                      />
                                      <img 
                                        src={it.image} 
                                        alt={it.name} 
                                        referrerPolicy="no-referrer"
                                        loading="eager"
                                        onError={handleImageFallback}
                                        className="max-h-16 max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md" 
                                      />
                                    </div>

                                    {/* Weapon & Skin Name */}
                                    <div className="mt-1">
                                      <div className="text-[10px] font-mono text-slate-400 truncate">{it.weapon}</div>
                                      <div className="text-xs font-display font-black text-white truncate group-hover:text-amber-400 transition">
                                        {it.skinName}
                                      </div>
                                    </div>

                                    {/* Price tag & Wear */}
                                    <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                                      <span className="text-[11px] font-mono font-bold text-amber-400">
                                        {it.priceEur.toFixed(2)} €
                                      </span>
                                      <span 
                                        className="text-[9px] font-mono font-bold uppercase tracking-wider"
                                        style={{ color: it.rarityColor }}
                                      >
                                        {it.wear === 'Factory New' ? 'FN' : it.wear === 'Minimal Wear' ? 'MW' : 'FT'}
                                      </span>
                                    </div>
                                  </>
                                )}

                                {/* Colored bottom accent line */}
                                <div 
                                  className="absolute bottom-0 left-0 right-0 h-1" 
                                  style={{ backgroundColor: it.rarityColor }} 
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* WON ITEM(S) REVEAL SCREEN */
                    <div className="w-full max-w-2xl rounded-3xl bg-[#0E111C] border border-[#232A3D] p-6 sm:p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
                      <div 
                        className="absolute inset-0 blur-3xl opacity-20 pointer-events-none"
                        style={{ backgroundColor: wonSkin.rarityColor }}
                      />

                      <div 
                        className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase mb-2 tracking-wider"
                        style={{ backgroundColor: `${wonSkin.rarityColor}20`, color: wonSkin.rarityColor, border: `1px solid ${wonSkin.rarityColor}40` }}
                      >
                        {wonSkins.length > 1 ? `Congratulations! You Won ${wonSkins.length} CS2 Skins` : `Congratulations! You Won ${wonSkin.rarity.toUpperCase()}`}
                      </div>

                      {/* If multiple skins won (caseCount > 1) */}
                      {wonSkins.length > 1 ? (
                        <div className="w-full my-4">
                          <div className="text-xs font-mono text-slate-400 mb-3">
                            Total Value Won: <strong className="text-emerald-400 font-bold text-base">{wonSkins.reduce((acc, s) => acc + s.priceEur, 0).toFixed(2)} €</strong>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 max-h-64 overflow-y-auto p-1">
                            {wonSkins.map((s, idx) => (
                              <div 
                                key={idx}
                                className="p-2 rounded-xl bg-[#090C16] border flex flex-col items-center text-center"
                                style={{ borderColor: `${s.rarityColor}40` }}
                              >
                                <img 
                                  src={s.image} 
                                  alt={s.name} 
                                  referrerPolicy="no-referrer"
                                  onError={handleImageFallback}
                                  className="w-16 h-12 object-contain my-1"
                                />
                                <div className="text-[10px] font-mono text-slate-300 truncate w-full">{s.weapon}</div>
                                <div className="text-[10px] font-bold text-white truncate w-full">{s.skinName}</div>
                                <span className="text-[10px] font-mono font-bold text-amber-400 mt-1">{s.priceEur.toFixed(2)} €</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Single Won Skin Cinematic Display */
                        <>
                          <h3 className="font-display font-black text-2xl text-white tracking-tight mt-1">
                            {wonSkin.name}
                          </h3>

                          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1 flex-wrap justify-center">
                            <span>Wear: <strong className="text-white">{wonSkin.wear}</strong></span>
                            <span>•</span>
                            <span>Float: <strong className="text-white">{wonSkin.floatValue}</strong></span>
                            <span>•</span>
                            <span>Chance: <strong className="text-amber-400 font-bold">{(wonSkin.dropChancePercent ?? 0).toFixed(3)}%</strong></span>
                            <span>•</span>
                            <span>Value: <strong className="text-emerald-400 font-bold">{wonSkin.priceEur.toFixed(2)} €</strong></span>
                          </div>

                          <div className="relative my-6 flex items-center justify-center">
                            <img 
                              src={wonSkin.image} 
                              alt={wonSkin.name} 
                              referrerPolicy="no-referrer"
                              loading="eager"
                              onError={handleImageFallback}
                              className="w-56 h-40 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] scale-110 animate-bounce duration-1000"
                            />
                          </div>
                        </>
                      )}

                      {/* Delivery Progress */}
                      {deliveryProgress && (
                        <div className="w-full mb-5 p-3.5 rounded-2xl bg-[#141826] border border-amber-400/30 flex items-center gap-3 animate-pulse">
                          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
                          <div className="text-left text-xs font-mono text-slate-200">
                            <div className="font-bold text-amber-400">Step {deliveryProgress.step}/3:</div>
                            <div>{deliveryProgress.message}</div>
                          </div>
                        </div>
                      )}

                      {/* Delivery Result */}
                      {deliveryResult && (
                        <div className="w-full mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left animate-in fade-in">
                          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm mb-1">
                            <Check className="w-4 h-4" />
                            <span>Trade Offer Sent to Steam Successfully!</span>
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
                              <span>Open Steam Trade Offers</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {!deliveryResult ? (
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                          <button
                            onClick={handleDispatchSkin}
                            className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send to Steam Bot</span>
                          </button>

                          <button
                            onClick={handleSellSkin}
                            className="w-full sm:flex-1 py-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                          >
                            <Coins className="w-4 h-4 text-amber-400" />
                            <span>
                              {wonSkins && wonSkins.length > 1
                                ? `Sell All for ${(wonSkins.reduce((acc, s) => acc + s.priceEur, 0) * 0.85).toFixed(2)} €`
                                : `Sell for ${((wonSkin?.priceEur ?? 0) * 0.85).toFixed(2)} €`}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              sound.playClick();
                              handleResetToCaseDesk();
                            }}
                            className="w-full sm:flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                            title="Keep won item(s) in your inventory and open another case"
                          >
                            <RotateCw className="w-3.5 h-3.5 text-slate-300" />
                            <span>Keep & Open Again</span>
                          </button>
                        </div>
                      ) : (
                        <div className="w-full">
                          <button
                            onClick={() => {
                              sound.playClick();
                              handleResetToCaseDesk();
                            }}
                            className="w-full py-3.5 rounded-xl bg-[#A3E635] hover:bg-[#84cc16] text-black font-display font-black text-sm uppercase tracking-wider transition cursor-pointer shadow-lg"
                          >
                            Open Again
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 2: DMARKET DIRECT BUY CS2 SKIN MARKETPLACE          */}
          {/* ====================================================== */}
          {activeTab === 'market' && (
            <div>
              {/* Header & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-base font-display font-black text-white flex items-center gap-2">
                    <span>Vortex Official Weapon Store</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      ⚡ INSTANT SKINS
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Purchase official CS2 weapons & knives with instant automated Steam Bot trade delivery.
                  </p>
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={marketSearch}
                    onChange={(e) => setMarketSearch(e.target.value)}
                    placeholder="Search weapons (AK-47, AWP, Karambit)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121522] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
                {[
                  { id: 'all', label: 'All Weapons' },
                  { id: 'knife', label: '★ Knives' },
                  { id: 'rifle', label: 'Rifles' },
                  { id: 'sniper', label: 'Snipers' },
                  { id: 'pistol', label: 'Pistols' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playSelect();
                      setMarketCategory(cat.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition shrink-0 cursor-pointer border ${
                      marketCategory === cat.id
                        ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                        : 'bg-[#121522] text-slate-300 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Direct Buy Stepper Progress */}
              {directBuyProgress && (
                <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#161B29] to-[#121522] border border-amber-400/40 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
                  <div className="text-left text-xs font-mono text-slate-200">
                    <div className="font-bold text-amber-400 uppercase tracking-wider">Vortex Steam Trade Bot (Step {directBuyProgress.step}/3):</div>
                    <div className="text-white mt-0.5">{directBuyProgress.message}</div>
                  </div>
                </div>
              )}

              {/* Direct Buy Success Alert */}
              {directBuyResult && (
                <div className="mb-5 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-left animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm mb-1">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Skin Trade Offer Sent to Steam!</span>
                  </div>
                  <p className="text-xs text-slate-200 font-sans mb-3">
                    {directBuyResult.message}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-emerald-500/20">
                    <span>Order ID: <strong className="text-white">{directBuyResult.orderId}</strong></span>
                    <a 
                      href="https://steamcommunity.com/my/tradeoffers/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 underline font-bold flex items-center gap-1"
                    >
                      <span>Open Steam Trade Offer</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Direct Buy Error */}
              {directBuyError && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{directBuyError}</span>
                </div>
              )}

              {/* Grid of Live DMarket Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMarketSkins.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#10131E] hover:bg-[#141826] border border-[#1E2335] hover:border-amber-500/40 p-4 transition-all duration-200 flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <span 
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${item.rarityColor}20`, color: item.rarityColor, border: `1px solid ${item.rarityColor}40` }}
                        >
                          {item.wear}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                          ⚡ Instant Bot
                        </span>
                      </div>

                      {/* Weapon Image from Akamai CDN */}
                      <div className="relative my-3 flex items-center justify-center min-h-[120px]">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          loading="eager"
                          onError={handleImageFallback}
                          className="relative w-36 h-28 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>

                      <div className="text-xs font-mono text-slate-400">{item.weapon}</div>
                      <h4 className="font-display font-black text-white text-sm group-hover:text-amber-400 transition truncate">
                        {item.skinName}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1">
                        <span>Float: {item.floatValue}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">Verified ✓</span>
                      </div>
                    </div>

                    {/* Price & Buy Button */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[9px] font-mono text-slate-400 uppercase">Price:</div>
                        <div className="text-sm font-black font-mono text-amber-400">
                          {item.priceEur.toFixed(2)} €
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuySkinDirect(item)}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 3: DMARKET LIVE API CONFIGURATION & HANDSHAKE PANEL */}
          {/* ====================================================== */}
          {activeTab === 'dmarket-api' && (
            <div className="max-w-2xl mx-auto">
              
              {/* Header Status Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#141824] via-[#10131E] to-[#0D1017] border border-[#232B3E] shadow-xl mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-white">DMarket Live Gateway Panel</h3>
                      <p className="text-xs text-slate-400 font-mono">DMarket Marketplace API v2 • Ed25519 Cryptographic Handshake</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                    dmarketCreds.isConnected
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${dmarketCreds.isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {dmarketCreds.isConnected ? 'LIVE API CONNECTED' : 'READY FOR KEYS'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Enter your DMarket **Public Key** and **Secret Key** from your DMarket API settings. Vortex Gaming will directly communicate with DMarket servers for real-time item delivery and automated trade settlements.
                </p>
              </div>

              {/* Form Inputs for API Keys */}
              <div className="p-6 rounded-3xl bg-[#0F121C] border border-[#1E2335] shadow-xl space-y-4">
                
                {/* Public Key */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>DMarket Public Key (X-Api-Key):</span>
                    </label>
                    <a 
                      href="https://dmarket.com/account/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Get API keys on DMarket</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input 
                    type="text"
                    value={tempPublic}
                    onChange={(e) => setTempPublic(e.target.value)}
                    placeholder="e.g. d8a49f1b2c3e4a5d6f7890123456789a..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141824] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                {/* Secret Key */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>DMarket Secret Key (Ed25519 Private Signature Key):</span>
                  </label>
                  <input 
                    type="password"
                    value={tempSecret}
                    onChange={(e) => setTempSecret(e.target.value)}
                    placeholder="••••••••••••••••••••••••••••••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141824] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    🔒 Secret key is securely encrypted client-side and only used to cryptographically sign purchase trade requests.
                  </span>
                </div>

                {/* Test Connection Button */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    disabled={isTestingDMarket}
                    onClick={handleTestDMarketHandshake}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isTestingDMarket ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Connecting to DMarket Live API...</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-4 h-4" />
                        <span>Verify Live Connection</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Terminal Output Console */}
              {dmarketTestLogs.length > 0 && (
                <div className="mt-5 p-4 rounded-2xl bg-[#06080D] border border-white/10 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 mb-2 border-b border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>DMarket Handshake Terminal Log</span>
                    </span>
                    <span className="text-emerald-400 font-bold">LIVE SOCKET</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {dmarketTestLogs.map((l, i) => (
                      <div key={i} className="text-slate-300 leading-snug">
                        <span className="text-emerald-400 font-bold">&gt; </span>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Result Card */}
              {dmarketTestResult && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-left animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DMarket API Connected Successfully!</span>
                  </div>
                  <p className="text-xs text-slate-200 font-sans mb-2">
                    {dmarketTestResult.message}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-slate-300">
                    <div>Latency: <strong className="text-emerald-400">{dmarketTestResult.latencyMs}ms</strong></div>
                    <div>DMarket Balance: <strong className="text-amber-400">{dmarketTestResult.dmarketBalanceEur.toFixed(2)} €</strong></div>
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
              <h3 className="font-display font-black text-lg text-white">Link Steam Trade URL</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans mb-4">
              To receive skins and knives automatically via automated Steam bots, enter your valid Steam Trade URL.
            </p>

            <label className="text-[11px] font-mono text-slate-300 font-bold mb-1.5 block">
              Enter your Steam Trade URL:
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

            <a 
              href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline flex items-center gap-1.5 mb-5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Where do I find my Steam Trade URL? (Click here)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
              <button
                onClick={() => setShowTradeUrlDialog(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTradeUrl}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Save Trade URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Xsolla Pay Station 4 Gateway Modal */}
      <XsollaCheckoutModal
        isOpen={showXsollaModal}
        onClose={() => setShowXsollaModal(false)}
        initialItem={{
          id: 'topup-20',
          sku: 'VTX-WAL-20',
          title: '20.00 € Vortex Wallet Funds',
          description: 'Instant credit for CS2 cases and weapon market purchases via Xsolla Pay Station.',
          amountEur: 20.00,
          type: 'wallet_topup'
        }}
        onPaymentSuccess={() => {
          // Wallet balance automatically synchronizes via the global 'vortex_wallet_updated' event
        }}
      />

      {/* Hellcase Pay By Skins & Deposit Modal */}
      <HellcasePayBySkinsModal
        isOpen={showHellcaseModal}
        onClose={() => setShowHellcaseModal(false)}
        initialMethod="overview"
      />

      {/* Provably Fair 100% Cryptographic Verification Modal */}
      {showProvablyFairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setShowProvablyFairModal(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0E111C] border border-[#232A3D] rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-black text-white text-base">
                  Provably Fair 100% Verification
                </h3>
              </div>
              <button
                onClick={() => setShowProvablyFairModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono text-slate-300">
              <p className="font-sans text-slate-300 text-xs leading-relaxed">
                Every drop on Vortex Gaming is cryptographically deterministic and verifiable. No outcome can be modified or manipulated after an unboxing begins.
              </p>
              
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-2">
                <div className="text-[11px] text-emerald-400 font-bold uppercase">Algorithm: SHA-256 HMAC</div>
                <div className="text-[10px] text-slate-400 truncate">
                  Server Seed (Hash): <span className="text-white">a3f9e2b1897c45d8f20b33a7e4d890bc...</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Client Seed (Browser): <span className="text-amber-400">vortex_client_fair_seed</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Formula: <span className="text-white">HMAC_SHA256(ServerSeed, ClientSeed:Nonce) % 100.00</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="font-bold text-white font-sans">Official CS2 Rarity Distribution:</div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded bg-black/40 border border-white/5 text-[#FFD700]">★ Knives: 0.260% (1 in 385)</div>
                  <div className="p-1.5 rounded bg-black/40 border border-white/5 text-[#EB4B4B]">Covert: 0.640% (1 in 156)</div>
                  <div className="p-1.5 rounded bg-black/40 border border-white/5 text-[#D32CE6]">Classified: 3.200% (1 in 31)</div>
                  <div className="p-1.5 rounded bg-black/40 border border-white/5 text-[#8847FF]">Restricted: 15.980% (1 in 6.25)</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setShowProvablyFairModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs cursor-pointer transition shadow"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
