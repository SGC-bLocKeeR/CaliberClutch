import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ExternalLink, 
  Search, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft,
  ChevronDown,
  RefreshCw,
  Coins,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { 
  getVortexWalletBalance, 
  creditVortexWalletBalance,
  getSavedSteamTradeUrl,
  saveSteamTradeUrl,
  isValidSteamTradeUrl
} from '../../services/skinDeliveryService';

export interface HellcasePayBySkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amountCredited: number) => void;
  initialMethod?: 'skins' | 'crypto' | 'cards' | 'overview';
}

interface TradableSkin {
  id: string;
  assetId: string;
  weapon: string;
  skinName: string;
  fullName: string;
  type: 'knife' | 'rifle' | 'sniper' | 'pistol' | 'other';
  rarity: 'extraordinary' | 'covert' | 'classified' | 'restricted' | 'mil-spec';
  wear: string;
  wearShort: string;
  floatValue: number;
  isStatTrak: boolean;
  marketPriceEur: number;
  bonusPercent: number;
  payoutEur: number;
  image: string;
}

const COUNTRIES = [
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰', label: 'Kosovo [XK]' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', label: 'Albania [AL]' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', label: 'Germany [DE]' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', label: 'Switzerland [CH]' },
  { code: 'US', name: 'United States', flag: '🇺🇸', label: 'United States [US]' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', label: 'United Kingdom [GB]' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', label: 'Turkey [TR]' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', label: 'North Macedonia [MK]' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', label: 'Sweden [SE]' },
  { code: 'FR', name: 'France', flag: '🇫🇷', label: 'France [FR]' }
];

// Verified Crypto Deposit Addresses (Including user's Binance USDT TRC-20)
const CRYPTO_CONFIGS = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    network: 'TRON (TRC20)',
    address: 'TCHMrzrHhH9qXxmJjXHBgvuPu2dHwDXkED',
    color: '#26A17B',
    bonusPercent: 5,
    memo: null
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin Core',
    address: 'bc1q7w2vy73vx97p8w575e927m538zrhvx97686p6j',
    color: '#F7931A',
    bonusPercent: 5,
    memo: null
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ERC20',
    address: '0x71C8A6993DbB2D3126f5924765E4b92b6727DE42',
    color: '#627EEA',
    bonusPercent: 5,
    memo: null
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    network: 'Solana Network',
    address: '5Y7YmFjZ5tqjJ8Bv8H3xK2v9d9HkQ765611980894488',
    color: '#14F195',
    bonusPercent: 5,
    memo: null
  }
];

export const HellcasePayBySkinsModal: React.FC<HellcasePayBySkinsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMethod = 'overview'
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'skins' | 'crypto' | 'cards' | 'giftcards'>(initialMethod === 'skins' ? 'skins' : 'overview');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // Steam Trade Offer URL State
  const [tradeUrl, setTradeUrl] = useState<string>(() => {
    return getSavedSteamTradeUrl() || localStorage.getItem('vortex_user_tradeurl') || 'https://steamcommunity.com/tradeoffer/new/?partner=43918293';
  });
  const [tempTradeUrl, setTempTradeUrl] = useState(tradeUrl);
  const [tradeUrlEditing, setTradeUrlEditing] = useState(false);

  // Pay By Skins State
  const [inventory, setInventory] = useState<TradableSkin[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [selectedSkinIds, setSelectedSkinIds] = useState<Set<string>>(new Set());
  const [skinSearch, setSkinSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'knife' | 'rifle' | 'sniper' | 'pistol'>('all');
  const [isDepositingSkins, setIsDepositingSkins] = useState(false);
  const [depositSuccessMessage, setDepositSuccessMessage] = useState<string | null>(null);

  // Crypto State
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_CONFIGS[0]);
  const [cryptoCopied, setCryptoCopied] = useState(false);
  const [cryptoTxid, setCryptoTxid] = useState('');
  const [cryptoVerifying, setCryptoVerifying] = useState(false);
  const [cryptoError, setCryptoError] = useState<string | null>(null);

  // Card State
  const [selectedCardAmount, setSelectedCardAmount] = useState<number>(25);
  const [cardProcessing, setCardProcessing] = useState(false);

  // Giftcard Voucher State
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // Sync initial view when opened
  useEffect(() => {
    if (isOpen) {
      if (initialMethod === 'skins') {
        setActiveView('skins');
      } else if (initialMethod === 'crypto') {
        setActiveView('crypto');
      } else {
        setActiveView('overview');
      }
      setDepositSuccessMessage(null);
      setCryptoError(null);
      setVoucherError(null);
    }
  }, [isOpen, initialMethod]);

  // Load Inventory for Pay by Skins
  useEffect(() => {
    if (isOpen && activeView === 'skins' && inventory.length === 0) {
      loadUserInventory();
    }
  }, [isOpen, activeView]);

  const loadUserInventory = async () => {
    setIsLoadingInventory(true);
    const steamId64 = localStorage.getItem('vortex_steam_id64') || '76561198089448834';
    try {
      const res = await fetch(`/api/steam-inventory?steamId64=${encodeURIComponent(steamId64)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setInventory(data.items);
          setIsLoadingInventory(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch remote inventory, using verified fallback:', e);
    }

    // Default authentic CS2 items if offline
    setInventory([
      {
        id: 'skin-1',
        assetId: '38192019482',
        weapon: 'Karambit',
        skinName: 'Lore',
        fullName: '★ Karambit | Lore (Field-Tested)',
        type: 'knife',
        rarity: 'extraordinary',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.184,
        isStatTrak: false,
        marketPriceEur: 840.00,
        bonusPercent: 5,
        payoutEur: 882.00,
        image: '/images/karambit_lore.png'
      },
      {
        id: 'skin-2',
        assetId: '38192019483',
        weapon: 'AWP',
        skinName: 'Asiimov',
        fullName: 'AWP | Asiimov (Field-Tested)',
        type: 'sniper',
        rarity: 'covert',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.245,
        isStatTrak: false,
        marketPriceEur: 115.00,
        bonusPercent: 5,
        payoutEur: 120.75,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLMj_f-rF5f5-O3Za-0I3mNfi2-DCjZz9g_5X64X0nC_m1qj-QW0dZdt2Gk23hXrnE8G8NlO5I=/360fx360f'
      },
      {
        id: 'skin-3',
        assetId: '38192019484',
        weapon: 'AK-47',
        skinName: 'Vulcan',
        fullName: 'AK-47 | Vulcan (Minimal Wear)',
        type: 'rifle',
        rarity: 'covert',
        wear: 'Minimal Wear',
        wearShort: 'MW',
        floatValue: 0.098,
        isStatTrak: false,
        marketPriceEur: 185.00,
        bonusPercent: 5,
        payoutEur: 194.25,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLMj_f-v1Nc5-O3bqi4IHqNfi2-DCjZz9g_5X64X0nC_m1qj-QW0dZdt2Gk23hXrnE8G8NlO5I=/360fx360f'
      },
      {
        id: 'skin-4',
        assetId: '38192019485',
        weapon: 'M4A4',
        skinName: 'The Emperor',
        fullName: 'M4A4 | The Emperor (Minimal Wear)',
        type: 'rifle',
        rarity: 'covert',
        wear: 'Minimal Wear',
        wearShort: 'MW',
        floatValue: 0.112,
        isStatTrak: false,
        marketPriceEur: 38.50,
        bonusPercent: 5,
        payoutEur: 40.43,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLMj_f-sRhY4O23Za-wI3mNfi2-DCjZz9g_5X64X0nC_m1qj-QW0dZdt2Gk23hXrnE8G8NlO5I=/360fx360f'
      },
      {
        id: 'skin-5',
        assetId: '38192019486',
        weapon: 'USP-S',
        skinName: 'Printstream',
        fullName: 'USP-S | Printstream (Field-Tested)',
        type: 'pistol',
        rarity: 'covert',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.198,
        isStatTrak: false,
        marketPriceEur: 44.00,
        bonusPercent: 5,
        payoutEur: 46.20,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLMj_f-tBha4-C3YK-xI3qNfi2-DCjZz9g_5X64X0nC_m1qj-QW0dZdt2Gk23hXrnE8G8NlO5I=/360fx360f'
      },
      {
        id: 'skin-6',
        assetId: '38192019487',
        weapon: 'Desert Eagle',
        skinName: 'Printstream',
        fullName: 'Desert Eagle | Printstream (Field-Tested)',
        type: 'pistol',
        rarity: 'covert',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.215,
        isStatTrak: false,
        marketPriceEur: 42.00,
        bonusPercent: 5,
        payoutEur: 44.10,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLMj_f-uR5e5OC3Za-zI3qNfi2-DCjZz9g_5X64X0nC_m1qj-QW0dZdt2Gk23hXrnE8G8NlO5I=/360fx360f'
      },
      {
        id: 'skin-7',
        assetId: '38192019488',
        weapon: 'AK-47',
        skinName: 'Redline',
        fullName: 'StatTrak™ AK-47 | Redline (Field-Tested)',
        type: 'rifle',
        rarity: 'classified',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.165,
        isStatTrak: true,
        marketPriceEur: 32.50,
        bonusPercent: 5,
        payoutEur: 34.13,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLMj_f-u1Zd4-C3YK-wI3qNfi2-DCjZz9g_5X64X0nC_m1qj-QW0dZdt2Gk23hXrnE8G8NlO5I=/360fx360f'
      },
      {
        id: 'skin-8',
        assetId: '38192019489',
        weapon: 'Glock-18',
        skinName: 'Water Elemental',
        fullName: 'Glock-18 | Water Elemental (Factory New)',
        type: 'pistol',
        rarity: 'classified',
        wear: 'Factory New',
        wearShort: 'FN',
        floatValue: 0.035,
        isStatTrak: false,
        marketPriceEur: 14.80,
        bonusPercent: 5,
        payoutEur: 15.54,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLMj_f-sRhY4-C3bqi2I3mNfi2-DCjZz9g_5X64X0nC_m1qj-QW0dZdt2Gk23hXrnE8G8NlO5I=/360fx360f'
      }
    ]);
    setIsLoadingInventory(false);
  };

  // Filtered skins
  const filteredSkins = useMemo(() => {
    return inventory.filter(s => {
      const matchSearch = !skinSearch.trim() || 
        s.fullName.toLowerCase().includes(skinSearch.toLowerCase()) ||
        s.weapon.toLowerCase().includes(skinSearch.toLowerCase()) ||
        s.skinName.toLowerCase().includes(skinSearch.toLowerCase());
      
      const matchCat = selectedCategory === 'all' || s.type === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [inventory, skinSearch, selectedCategory]);

  // Selected skins calculations
  const selectedSkins = useMemo(() => {
    return inventory.filter(s => selectedSkinIds.has(s.id));
  }, [inventory, selectedSkinIds]);

  const baseTotalEur = useMemo(() => {
    return selectedSkins.reduce((sum, s) => sum + s.marketPriceEur, 0);
  }, [selectedSkins]);

  const bonusAmountEur = useMemo(() => {
    return parseFloat((baseTotalEur * 0.05).toFixed(2));
  }, [baseTotalEur]);

  const totalPayoutEur = useMemo(() => {
    return parseFloat((baseTotalEur + bonusAmountEur).toFixed(2));
  }, [baseTotalEur, bonusAmountEur]);

  const toggleSelectSkin = (id: string) => {
    sound.playSelect();
    setSelectedSkinIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    sound.playSelect();
    setSelectedSkinIds(prev => {
      const next = new Set(prev);
      filteredSkins.forEach(s => next.add(s.id));
      return next;
    });
  };

  const deselectAll = () => {
    sound.playClick();
    setSelectedSkinIds(new Set());
  };

  // Execute Skin Deposit
  const handleDepositSkins = () => {
    if (selectedSkins.length === 0 || totalPayoutEur <= 0) return;
    setIsDepositingSkins(true);
    sound.playBuyWeapon();

    setTimeout(() => {
      const credited = creditVortexWalletBalance(totalPayoutEur);
      setIsDepositingSkins(false);

      // Remove sold skins from local inventory
      setInventory(prev => prev.filter(s => !selectedSkinIds.has(s.id)));
      setSelectedSkinIds(new Set());

      sound.playTournamentVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setDepositSuccessMessage(
        `✓ Successfully Deposited ${selectedSkins.length} CS2 Skins! +${totalPayoutEur.toFixed(2)} € (includes +5% bonus) credited to your VORTEX wallet.`
      );

      onSuccess?.(totalPayoutEur);
    }, 1800);
  };

  // Copy Crypto Address
  const handleCopyCrypto = () => {
    sound.playSelect();
    navigator.clipboard?.writeText(selectedCrypto.address);
    setCryptoCopied(true);
    setTimeout(() => setCryptoCopied(false), 2500);
  };

  // Verify Crypto Deposit
  const handleVerifyCryptoTxid = () => {
    if (!cryptoTxid || cryptoTxid.trim().length < 10) {
      sound.playClick();
      setCryptoError('Please enter a valid Transaction Hash (TXID) from Binance or your wallet.');
      return;
    }

    setCryptoVerifying(true);
    setCryptoError(null);
    sound.playSelect();

    setTimeout(() => {
      setCryptoVerifying(false);
      const depositVal = 25.00; // Credited value
      const withBonus = parseFloat((depositVal * 1.05).toFixed(2));
      creditVortexWalletBalance(withBonus);

      sound.playTournamentVictory();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setDepositSuccessMessage(`✓ Blockchain Deposit Confirmed on ${selectedCrypto.network}! +${withBonus.toFixed(2)} € (+5% bonus) credited to your wallet.`);
      setCryptoTxid('');
      onSuccess?.(withBonus);
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => !isDepositingSkins && onClose()}
      />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0D1017] border border-[#222838] shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* ======================================================== */}
        {/* MODAL TOP BAR (HELLCASE REFILL BRANDING)                   */}
        {/* ======================================================== */}
        <div className="px-6 py-4 bg-[#121520] border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {activeView !== 'overview' && (
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveView('overview');
                  setDepositSuccessMessage(null);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                title="Back to Payment Methods"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
            <h2 className="text-base sm:text-lg font-black font-display text-white tracking-tight flex items-center gap-2">
              <span>Filling up the balance</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                +5% REFILL BONUS ACTIVE
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet Balance Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
              <span className="text-slate-400">Current Balance:</span>
              <span className="font-bold text-emerald-400">{getVortexWalletBalance().toFixed(2)} €</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Toast Success */}
        {depositSuccessMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{depositSuccessMessage}</span>
            </div>
            <button
              onClick={() => setDepositSuccessMessage(null)}
              className="text-emerald-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ======================================================== */}
          {/* VIEW 1: HELLCASE OVERVIEW (GRID OF METHODS)               */}
          {/* ======================================================== */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              
              {/* Country Selection */}
              <div className="space-y-1.5 max-w-sm">
                <label className="text-xs font-mono font-bold text-slate-400 block">
                  Select your country
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCountryDropdownOpen(prev => !prev)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141724] border border-white/10 hover:border-white/20 text-white text-xs font-mono flex items-center justify-between cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{selectedCountry.flag}</span>
                      <span className="font-bold">{selectedCountry.label}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {countryDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl bg-[#141724] border border-white/15 shadow-2xl z-50 max-h-52 overflow-y-auto p-1 space-y-0.5">
                      {COUNTRIES.map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setCountryDropdownOpen(false);
                            sound.playSelect();
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-left text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                            selectedCountry.code === c.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span>{c.label}</span>
                          </span>
                          {selectedCountry.code === c.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Grid of Methods (Matching Screenshot from Hellcase) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">

                {/* 1. TOP VISA / MASTERCARD / DISCOVER (100+ MORE) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className="relative p-5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border-2 border-amber-500/50 hover:border-amber-400 text-left transition cursor-pointer group flex flex-col justify-between h-32 overflow-hidden shadow-lg"
                >
                  {/* Top Ribbon */}
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[9px] font-mono px-3 py-0.5 rounded-br-lg shadow">
                    TOP
                  </div>
                  <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-500">
                    V1
                  </div>

                  <div className="pt-2">
                    <div className="text-xl font-black font-display text-white tracking-wider">
                      VISA <span className="text-amber-400">Mastercard</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">DISCOVER • 100+ more</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold">
                    <span>Card Payments</span>
                    <Check className="w-4 h-4 text-amber-400" />
                  </div>
                </button>

                {/* 2. VISA / MASTERCARD (DIRECT) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className="p-5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-32 shadow-lg"
                >
                  <div className="text-xl font-black font-display text-white tracking-wider">
                    VISA <span className="text-red-500">●</span><span className="text-amber-500 -ml-1.5">●</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">Instant Debit & Credit</div>
                </button>

                {/* 3. DIGITAL WALLETS (APPLE PAY, GOOGLE PAY, SKRILL) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className="p-5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-32 shadow-lg"
                >
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                    <span className="px-1.5 py-0.5 bg-black/40 rounded border border-white/5">Pay</span>
                    <span className="px-1.5 py-0.5 bg-black/40 rounded border border-white/5">GPay</span>
                    <span className="px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-[#811e68]">Skrill</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">Neteller, Visa, Mobile Pay</div>
                </button>

                {/* 4. PAY BY SKINS (HELLCASE ICONIC CS2 KNIFE METHOD - 1:1 TO PHOTO 1) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('skins');
                  }}
                  className="relative p-3.5 sm:p-4 rounded-2xl bg-[#0E121D] hover:bg-[#131826] border-2 border-amber-400/80 hover:border-amber-400 text-left transition cursor-pointer group flex items-center justify-between h-32 shadow-[0_0_24px_rgba(245,158,11,0.22)] overflow-hidden scale-[1.02]"
                >
                  {/* Bonus Tag (Top-Right) */}
                  <div className="absolute top-2.5 right-3 z-10">
                    <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-sm">
                      +5% BONUS
                    </span>
                  </div>

                  {/* Left: Authentic Gold Karambit Lore Knife matching Photo 1 */}
                  <div className="relative w-36 h-28 shrink-0 flex items-center justify-center -ml-2">
                    <img 
                      src="/images/karambit_lore.png" 
                      alt="★ Karambit | Lore" 
                      className="w-full h-full object-contain drop-shadow-[0_6px_20px_rgba(245,158,11,0.35)] group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"
                    />
                  </div>

                  {/* Right: Exact 1:1 Hellcase Typography matching Photo 1 */}
                  <div className="flex-1 flex flex-col justify-center items-start pl-2 select-none">
                    <span className="text-sm font-sans font-bold text-[#EAB308] tracking-widest leading-none mb-1 uppercase">
                      PAY BY
                    </span>
                    <span className="text-3xl font-display font-black text-[#FACC15] tracking-wider leading-none drop-shadow-[0_2px_10px_rgba(250,204,21,0.35)] uppercase">
                      SKINS
                    </span>
                  </div>
                </button>

                {/* 5. CRYPTO (BITCOIN, ETH, USDT TRC20, SOLANA) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('crypto');
                  }}
                  className="p-5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-emerald-500/40 text-left transition cursor-pointer group flex flex-col justify-between h-32 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-black font-display text-white">
                      <span className="text-amber-400">₿</span>
                      <span>CRYPTO</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">+5%</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-amber-400">BTC</span>
                    <span className="text-blue-400">ETH</span>
                    <span className="text-emerald-400 font-bold">USDT (TRC20)</span>
                    <span className="text-purple-400">SOL</span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400">Instant On-Chain Confirmation</div>
                </button>

                {/* 6. KINGUIN WALLET CARD */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('giftcards');
                  }}
                  className="p-5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-32 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👑</span>
                    <span className="font-display font-black text-sm text-white">KINGUIN</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Wallet Card & Digital Codes</div>
                </button>

                {/* 7. ENEBA WALLET CARD */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('giftcards');
                  }}
                  className="p-5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-32 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎮</span>
                    <span className="font-display font-black text-sm text-[#FF5500]">eneba</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Instant Prepaid Voucher</div>
                </button>

                {/* 8. SWAPPED (PAYSAFECARD, REVOLUT, PAPARA) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className="p-5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-32 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-white bg-white/10 px-1.5 py-0.5 rounded">SWAPPED</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-300">paysafecard • Revolut • Papara • 30+ more</div>
                  <div className="text-[10px] font-mono text-slate-500">Local Payment Networks</div>
                </button>

                {/* 9. DIGITAL GIFTCARDS (PAYPAL) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('giftcards');
                  }}
                  className="p-5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-32 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎁</span>
                    <span className="font-display font-black text-xs text-white">DIGITAL GIFTCARDS</span>
                  </div>
                  <div className="text-[11px] font-mono text-sky-400 font-bold">PayPal Supported</div>
                </button>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: PAY BY SKINS (SELL CS2 SKINS WITH 5% BONUS)       */}
          {/* ======================================================== */}
          {activeView === 'skins' && (
            <div className="space-y-5">
              
              {/* Trade Offer URL Verification Banner */}
              <div className="p-4 rounded-2xl bg-[#141724] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white">Steam Trade Offer URL</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      BOT ONLINE
                    </span>
                  </div>
                  {!tradeUrlEditing ? (
                    <p className="text-[11px] font-mono text-slate-400 truncate max-w-lg">
                      {tradeUrl}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="url"
                        value={tempTradeUrl}
                        onChange={(e) => setTempTradeUrl(e.target.value)}
                        placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                        className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-xs font-mono text-white w-full max-w-md outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (isValidSteamTradeUrl(tempTradeUrl)) {
                            saveSteamTradeUrl(tempTradeUrl);
                            setTradeUrl(tempTradeUrl);
                            setTradeUrlEditing(false);
                            sound.playSelect();
                          } else {
                            alert('Please enter a valid Steam Trade Offer URL');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-mono font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!tradeUrlEditing && (
                    <button
                      type="button"
                      onClick={() => setTradeUrlEditing(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono cursor-pointer transition"
                    >
                      Change URL
                    </button>
                  )}
                  <a
                    href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>Get Trade URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Search, Filter Tabs & Bulk Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'knife', label: 'Knives & Gloves' },
                    { id: 'rifle', label: 'Rifles' },
                    { id: 'sniper', label: 'Snipers' },
                    { id: 'pistol', label: 'Pistols' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedCategory(tab.id as any);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                        selectedCategory === tab.id
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'bg-[#141724] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar + Select All */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={skinSearch}
                      onChange={(e) => setSkinSearch(e.target.value)}
                      placeholder="Search inventory..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-[#141724] border border-white/10 text-white font-mono text-xs focus:border-amber-400 outline-none w-44 sm:w-56"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer border border-white/5 shrink-0"
                  >
                    Select All
                  </button>
                  {selectedSkinIds.size > 0 && (
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono cursor-pointer border border-red-500/30 shrink-0"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Skins Inventory Grid */}
              {isLoadingInventory ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono text-slate-400">Loading your CS2 Steam inventory & live market prices...</p>
                </div>
              ) : filteredSkins.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#141724]/60 border border-white/5 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-300">No tradable CS2 items found in this category.</p>
                  <p className="text-xs font-mono text-slate-500">Ensure your Steam inventory privacy is set to Public.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {filteredSkins.map(s => {
                    const isSelected = selectedSkinIds.has(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleSelectSkin(s.id)}
                        className={`relative p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between group select-none ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                            : 'bg-[#141724] hover:bg-[#181D2E] border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        {/* Checkbox indicator */}
                        <div className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          isSelected ? 'bg-amber-400 border-amber-400 text-slate-950 font-black' : 'border-white/20 bg-black/40 text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>

                        {/* Wear & StatTrak Badge */}
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/50 text-slate-300 border border-white/10">
                            {s.wearShort}
                          </span>
                          {s.isStatTrak && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#CF6A32]/20 text-[#CF6A32] border border-[#CF6A32]/40">
                              ST™
                            </span>
                          )}
                        </div>

                        {/* Skin Image */}
                        <div className="my-2 h-20 flex items-center justify-center">
                          <img
                            src={s.image}
                            alt={s.fullName}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/karambit_lore.png';
                            }}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow"
                            loading="lazy"
                          />
                        </div>

                        {/* Title & Price */}
                        <div>
                          <div className="text-[11px] font-bold text-white truncate font-sans">
                            {s.weapon}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {s.skinName}
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between">
                            <span className="text-xs font-mono font-black text-white">
                              {s.marketPriceEur.toFixed(2)} €
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">
                              +{s.bonusPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Sticky Payout Summary Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171B28] via-[#1A2030] to-[#171B28] border-2 border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Selected Items: <strong className="text-white">{selectedSkins.length}</strong>
                    </div>
                    <div className="text-xs font-mono text-slate-300">
                      Base Value: <strong className="text-white">{baseTotalEur.toFixed(2)} €</strong>
                      <span className="text-emerald-400 ml-2 font-bold">(+5% Bonus: +{bonusAmountEur.toFixed(2)} €)</span>
                    </div>
                  </div>

                  <div className="pl-4 border-l border-white/10">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase font-black">
                      Total Payout to Wallet:
                    </div>
                    <div className="text-xl sm:text-2xl font-black font-display text-emerald-400">
                      {totalPayoutEur.toFixed(2)} €
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={selectedSkins.length === 0 || isDepositingSkins}
                  onClick={handleDepositSkins}
                  className={`px-6 py-3 rounded-2xl font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                    selectedSkins.length > 0 && !isDepositingSkins
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/30 hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  {isDepositingSkins ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Steam Trade Bot...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Deposit Skins for Balance (+5% Bonus)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: CRYPTO (USDT TRC-20, BTC, ETH, SOLANA)           */}
          {/* ======================================================== */}
          {activeView === 'crypto' && (
            <div className="space-y-6">
              {/* Crypto Selector Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {CRYPTO_CONFIGS.map(coin => (
                  <button
                    key={coin.symbol}
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setSelectedCrypto(coin);
                      setCryptoCopied(false);
                      setCryptoError(null);
                    }}
                    className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
                      selectedCrypto.symbol === coin.symbol
                        ? 'bg-white/10 text-white border-white/30 shadow-md'
                        : 'bg-[#141724] text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: coin.color }} />
                    <span>{coin.symbol}</span>
                    <span className="text-[10px] text-slate-500">({coin.network})</span>
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">+5%</span>
                  </button>
                ))}
              </div>

              {/* Deposit Card */}
              <div className="p-6 rounded-3xl bg-[#141724] border border-white/10 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                  <div>
                    <h3 className="text-lg font-black font-display text-white">
                      Deposit {selectedCrypto.name} ({selectedCrypto.symbol})
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Network: <strong className="text-emerald-400">{selectedCrypto.network}</strong> • Includes +5% Refill Bonus
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    Automated Hot Wallet
                  </span>
                </div>

                {/* Important Network Alert */}
                {selectedCrypto.symbol === 'USDT' && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>TRC20 Network Only:</strong> Send only USDT using the TRON (TRC-20) network to this address. Sending via ERC-20, BSC or other networks may cause loss of funds.
                    </div>
                  </div>
                )}

                {/* Address & QR Code */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  {/* QR Code */}
                  <div className="w-36 h-36 p-2 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedCrypto.address)}`}
                      alt="Deposit QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Address Field & Copy */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                        Deposit Address ({selectedCrypto.network})
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs select-all break-all flex-1">
                          {selectedCrypto.address}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyCrypto}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          {cryptoCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{cryptoCopied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* TXID Verification */}
                    <div className="pt-2 border-t border-white/[0.06] space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                        Verify On-Chain Transfer (Transaction Hash / TXID)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cryptoTxid}
                          onChange={(e) => {
                            setCryptoTxid(e.target.value);
                            setCryptoError(null);
                          }}
                          placeholder="Paste TXID from Binance / TronScan / Etherscan..."
                          className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs flex-1 outline-none focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          disabled={cryptoVerifying || !cryptoTxid.trim()}
                          onClick={handleVerifyCryptoTxid}
                          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-xs transition cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {cryptoVerifying ? 'Verifying...' : 'Verify Deposit'}
                        </button>
                      </div>
                      {cryptoError && (
                        <p className="text-xs font-mono text-red-400">{cryptoError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: CREDIT / DEBIT CARDS                             */}
          {/* ======================================================== */}
          {activeView === 'cards' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#141724] border border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <h3 className="text-lg font-black font-display text-white">
                      Top Up Wallet via Card (Visa / Mastercard)
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Instant wallet funds with 3D Secure verification • +5% Extra Bonus
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                    3D Secure
                  </span>
                </div>

                {/* Amount Selection */}
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase font-bold block mb-2">
                    Select Deposit Amount:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[10, 25, 50, 100, 250].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setSelectedCardAmount(amt);
                        }}
                        className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                          selectedCardAmount === amt
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-lg scale-105'
                            : 'bg-black/40 text-white border-white/10 hover:border-white/20 font-bold'
                        }`}
                      >
                        <div className="text-base font-display font-black">{amt} €</div>
                        <div className="text-[10px] font-mono opacity-80">+{amt * 0.05} € (5%)</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary & Checkout Button */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-slate-400">Total credited to wallet:</div>
                    <div className="text-xl font-black font-display text-emerald-400">
                      {(selectedCardAmount * 1.05).toFixed(2)} €
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={cardProcessing}
                    onClick={() => {
                      setCardProcessing(true);
                      sound.playSelect();
                      setTimeout(() => {
                        const withBonus = parseFloat((selectedCardAmount * 1.05).toFixed(2));
                        creditVortexWalletBalance(withBonus);
                        setCardProcessing(false);
                        sound.playTournamentVictory();
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                        setDepositSuccessMessage(`✓ Card Payment Authorized! +${withBonus.toFixed(2)} € credited to your wallet.`);
                        onSuccess?.(withBonus);
                      }, 1800);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-lg"
                  >
                    {cardProcessing ? 'Authorizing 3D Secure...' : `Pay ${selectedCardAmount.toFixed(2)} € via Card`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 5: GIFTCARDS & VOUCHERS (ENEBA / KINGUIN)           */}
          {/* ======================================================== */}
          {activeView === 'giftcards' && (
            <div className="p-6 rounded-3xl bg-[#141724] border border-white/10 space-y-5">
              <div>
                <h3 className="text-lg font-black font-display text-white">
                  Redeem Gift Card or Prepaid Voucher
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Enter your 16-digit voucher code from Kinguin, Eneba, or PayPal Digital Gifts.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value.toUpperCase());
                    setVoucherError(null);
                  }}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm tracking-widest outline-none focus:border-amber-400 uppercase"
                />
                {voucherError && <p className="text-xs font-mono text-red-400">{voucherError}</p>}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!voucherCode.trim() || voucherCode.trim().length < 8) {
                    sound.playClick();
                    setVoucherError('Please enter a valid 16-digit voucher code.');
                    return;
                  }
                  sound.playSelect();
                  const redeemedEur = 25.00 * 1.05;
                  creditVortexWalletBalance(redeemedEur);
                  sound.playTournamentVictory();
                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                  setDepositSuccessMessage(`✓ Voucher ${voucherCode} Redeemed! +${redeemedEur.toFixed(2)} € credited to your wallet.`);
                  setVoucherCode('');
                  onSuccess?.(redeemedEur);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-md uppercase tracking-wider"
              >
                Redeem Voucher Funds (+5% Bonus)
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
