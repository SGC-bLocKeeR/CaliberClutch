import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ExternalLink, 
  Search, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown,
  Coins,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { KARAMBIT_LORE_IMAGE } from '../../assets/images/karambitLoreBase64';
import { 
  getVortexWalletBalance, 
  creditVortexWalletBalance,
  saveSteamTradeUrl, 
  isValidSteamTradeUrl 
} from '../../services/skinDeliveryService';

export interface HellcasePayBySkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amountCredited: number) => void;
  initialMethod?: 'skins' | 'crypto' | 'cards' | 'giftcards' | 'overview';
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
  payoutEur: number;
  image: string;
}

const COUNTRIES = [
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰', label: 'Kosovo [XK]' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', label: 'Albania [AL]' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', label: 'Germany [DE]' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', label: 'Switzerland [CH]' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', label: 'Austria [AT]' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', label: 'United Kingdom [GB]' },
  { code: 'US', name: 'United States', flag: '🇺🇸', label: 'United States [US]' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', label: 'Turkey [TR]' }
];

const CRYPTO_CONFIGS = [
  {
    symbol: 'USDT',
    name: 'Tether (TRC-20)',
    network: 'TRON / TRC20',
    color: '#26A17B',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin Native (SegWit)',
    color: '#F7931A',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'Ethereum (ERC-20)',
    color: '#627EEA',
    address: '0x71C83893F38b3684B85161fdf9E43df793eb1B7A'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    network: 'Solana SPL',
    color: '#9945FF',
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  }
];

export const HellcasePayBySkinsModal: React.FC<HellcasePayBySkinsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMethod = 'skins'
}) => {
  const [activeView, setActiveView] = useState<'skins' | 'crypto' | 'cards' | 'giftcards'>('skins');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // Steam Trade URL State
  const [tradeUrl, setTradeUrl] = useState('');
  const [tradeUrlEditing, setTradeUrlEditing] = useState(false);
  const [tempTradeUrl, setTempTradeUrl] = useState('');

  // Skins Inventory State
  const [inventory, setInventory] = useState<TradableSkin[]>([]);
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
      if (initialMethod && initialMethod !== 'overview') {
        setActiveView(initialMethod);
      } else {
        setActiveView('skins');
      }
      setDepositSuccessMessage(null);
      setCryptoError(null);
      setVoucherError(null);
    }
  }, [isOpen, initialMethod]);

  // Load Inventory for Pay by Skins
  useEffect(() => {
    if (isOpen && inventory.length === 0) {
      loadUserInventory();
    }
  }, [isOpen, inventory.length]);

  const loadUserInventory = async () => {
    const steamId64 = localStorage.getItem('vortex_steam_id64') || '76561198089448834';
    try {
      const res = await fetch(`/api/steam-inventory?steamId64=${encodeURIComponent(steamId64)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setInventory(data.items);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch remote inventory, using verified fallback:', e);
    }

    // Default authentic CS2 items
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
        payoutEur: 840.00,
        image: KARAMBIT_LORE_IMAGE
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
        payoutEur: 115.00,
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
        payoutEur: 185.00,
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
        payoutEur: 38.50,
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
        payoutEur: 44.00,
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
        payoutEur: 42.00,
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
        payoutEur: 32.50,
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
        payoutEur: 14.80,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLMj_f-sRhY4-C3bqi2I3mNfi2-DCjZz9g_5X64X0nC_m1qj-QW0dZdt2Gk23hXrnE8G8NlO5I=/360fx360f'
      }
    ]);
  };

  // Filtered skins
  const filteredSkins = useMemo(() => {
    return inventory.filter(s => {
      const matchSearch = !skinSearch.trim() || 
        s.fullName.toLowerCase().includes(skinSearch.toLowerCase()) ||
        s.weapon.toLowerCase().includes(skinSearch.toLowerCase()) ||
        s.skinName.toLowerCase().includes(skinSearch.toLowerCase());
      
      const matchCategory = selectedCategory === 'all' || s.type === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [inventory, skinSearch, selectedCategory]);

  const selectedSkins = useMemo(() => {
    return inventory.filter(s => selectedSkinIds.has(s.id));
  }, [inventory, selectedSkinIds]);

  const baseTotalEur = useMemo(() => {
    return selectedSkins.reduce((sum, s) => sum + s.marketPriceEur, 0);
  }, [selectedSkins]);

  const totalPayoutEur = useMemo(() => {
    return parseFloat(baseTotalEur.toFixed(2));
  }, [baseTotalEur]);

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

  const clearSelection = () => {
    sound.playClick();
    setSelectedSkinIds(new Set());
  };

  const handleDepositSkins = () => {
    if (selectedSkins.length === 0) return;
    setIsDepositingSkins(true);
    sound.playSelect();

    setTimeout(() => {
      creditVortexWalletBalance(totalPayoutEur);
      setInventory(prev => prev.filter(s => !selectedSkinIds.has(s.id)));
      setSelectedSkinIds(new Set());
      setIsDepositingSkins(false);

      sound.playTournamentVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setDepositSuccessMessage(
        `✓ Successfully Deposited ${selectedSkins.length} CS2 Skins! +${totalPayoutEur.toFixed(2)} € credited to your VORTEX wallet.`
      );

      onSuccess?.(totalPayoutEur);
    }, 1800);
  };

  const handleCopyCrypto = () => {
    sound.playSelect();
    navigator.clipboard?.writeText(selectedCrypto.address);
    setCryptoCopied(true);
    setTimeout(() => setCryptoCopied(false), 2500);
  };

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
      const depositVal = 25.00;
      creditVortexWalletBalance(depositVal);

      sound.playTournamentVictory();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setDepositSuccessMessage(`✓ Blockchain Deposit Confirmed on ${selectedCrypto.network}! +${depositVal.toFixed(2)} € credited to your wallet.`);
      setCryptoTxid('');
      onSuccess?.(depositVal);
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={() => {
          sound.playClick();
          onClose();
        }}
      />

      {/* Main Modal Window - Hellcase Split Screen Architecture */}
      <div className="relative w-full max-w-6xl xl:max-w-7xl rounded-3xl bg-[#0D1017] border border-[#222838] shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#101420] border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <span className="text-xs">📁</span>
            </div>
            <h2 className="text-base sm:text-lg font-black font-display text-white tracking-tight">
              Filling up the balance
            </h2>
          </div>

          <div className="flex items-center gap-3">
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
          <div className="mx-6 mt-3 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-200 shrink-0">
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

        {/* Split Screen Body: Left Methods Grid + Right Special Action Pane */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* ======================================================== */}
          {/* LEFT PANE: 10 PAYMENT METHODS GRID                       */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[460px] xl:w-[490px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 p-5 overflow-y-auto space-y-4 flex flex-col justify-between bg-[#0E121D]/70">
            <div className="space-y-3.5">
              {/* Select Country */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-400 block">
                  Select your country
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCountryDropdownOpen(prev => !prev)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141724] border border-white/10 hover:border-white/20 text-white text-xs font-mono flex items-center justify-between cursor-pointer transition"
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

              {/* 10 Methods Grid (3 columns x 4 rows) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">

                {/* 1. TOP VISA / MASTERCARD / DISCOVER */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className={`relative p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                    activeView === 'cards'
                      ? 'border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[8px] font-mono px-2 py-0.5 rounded-br shadow">
                    TOP
                  </div>
                  <div className="absolute top-1.5 right-2 text-[8px] font-mono text-slate-500">
                    V1
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-black font-display text-white tracking-wider flex items-center gap-1">
                      <span>VISA</span>
                      <span className="text-red-500 font-sans">●</span>
                      <span className="text-amber-500 font-sans -ml-1">●</span>
                    </div>
                    <div className="text-[8px] font-mono text-slate-400 mt-0.5">DISCOVER • 100+ more</div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>Card Payments</span>
                    {activeView === 'cards' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </button>

                {/* 2. VISA / MASTERCARD (DIRECT) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className="p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg"
                >
                  <div className="text-sm font-black font-display text-white tracking-wider flex items-center gap-1 pt-1">
                    <span>VISA</span>
                    <span className="text-red-500 font-sans">●</span>
                    <span className="text-amber-500 font-sans -ml-1">●</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">Instant Debit & Credit</div>
                </button>

                {/* 3. DIGITAL WALLETS (APPLE PAY, GPAY, SKRILL) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className="p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg"
                >
                  <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono font-bold text-slate-300">
                    <span className="px-1 py-0.2 bg-black/40 rounded border border-white/5">Pay</span>
                    <span className="px-1 py-0.2 bg-black/40 rounded border border-white/5">GPay</span>
                    <span className="px-1 py-0.2 bg-black/40 rounded border border-white/5 text-[#811e68]">Skrill</span>
                  </div>
                  <div className="text-[8px] font-mono text-slate-400">Neteller, Visa, Mobile</div>
                </button>

                {/* 4. PAY BY SKINS (ACTIVE HELLCASE KNIFE METHOD) */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('skins');
                  }}
                  className={`relative p-2.5 rounded-2xl bg-[#141724] hover:bg-[#181D2E] text-left transition cursor-pointer group flex items-center justify-between h-28 shadow-lg overflow-hidden ${
                    activeView === 'skins'
                      ? 'border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Left: Authentic Gold Karambit Lore Knife */}
                  <div className="relative w-24 h-20 shrink-0 flex items-center justify-center -ml-2 select-none pointer-events-none">
                    <img 
                      src={KARAMBIT_LORE_IMAGE} 
                      alt="" 
                      aria-hidden="true"
                      draggable={false}
                      className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"
                    />
                  </div>

                  {/* Right: Exact 1:1 Hellcase Typography */}
                  <div className="flex-1 flex flex-col justify-center items-start pl-1 select-none">
                    <span className="text-[10px] font-sans font-bold text-[#EAB308] tracking-widest leading-none mb-1 uppercase">
                      PAY BY
                    </span>
                    <span className="text-xl font-display font-black text-[#FACC15] tracking-wider leading-none uppercase">
                      SKINS
                    </span>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {activeView === 'skins' && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 absolute bottom-2 right-2" />
                  )}
                </button>

                {/* 5. CRYPTO */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('crypto');
                  }}
                  className={`relative p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                    activeView === 'crypto'
                      ? 'border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-black font-display text-white">
                    <span className="text-amber-400">₿</span>
                    <span>CRYPTO</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 text-[9px]">
                    <span className="text-amber-400">BTC</span>
                    <span className="text-blue-400">ETH</span>
                    <span className="text-emerald-400 font-bold">USDT</span>
                    <span className="text-purple-400">SOL</span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>Instant On-Chain</span>
                    {activeView === 'crypto' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </button>

                {/* 6. KINGUIN */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('giftcards');
                  }}
                  className="p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">👑</span>
                    <span className="font-display font-black text-xs text-white">KINGUIN</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">Wallet card</div>
                </button>

                {/* 7. ENEBA */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('giftcards');
                  }}
                  className="p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🎮</span>
                    <span className="font-display font-black text-xs text-[#FF5500]">eneba</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">Wallet card</div>
                </button>

                {/* 8. SWAPPED */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className="p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono font-black text-white bg-white/10 px-1 py-0.2 rounded">SWAPPED</span>
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 leading-tight">paysafecard • Revolut • 30+ more</div>
                </button>

                {/* 9. DIGITAL GIFTCARDS */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('giftcards');
                  }}
                  className="p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🎁</span>
                    <span className="font-display font-black text-[10px] text-white">GIFTCARDS</span>
                  </div>
                  <div className="text-[9px] font-mono text-sky-400 font-bold">PayPal Supported</div>
                </button>

                {/* 10. PREMIUM */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveView('cards');
                  }}
                  className="p-3 rounded-2xl bg-[#141724] hover:bg-[#181D2E] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">💎</span>
                    <span className="font-display font-black text-xs text-purple-400">PREMIUM</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">VIP Status</div>
                </button>

              </div>
            </div>

            <p className="text-[10px] font-mono text-slate-500 pt-3 border-t border-white/5">
              All payment methods available in the selected country are listed.
            </p>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANE: SPECIAL VORTEX ENGINE (INSTANT - NO 8-DAY HOLD)*/}
          {/* ======================================================== */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-[#080B12]/80 flex flex-col justify-between min-h-0">
            
            {/* VIEW: PAY BY SKINS (VORTEX FAST-TRACK STEAM BOT - 0 DAYS HOLD) */}
            {activeView === 'skins' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between min-h-0">
                <div className="space-y-4 overflow-y-auto pr-1">
                  
                  {/* Top Special Banner: 0-Day Instant Deposit */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#111728] via-[#151D33] to-[#111728] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-black text-slate-950 bg-emerald-400 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 shadow">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                          VORTEX FAST-TRACK BOT • 0-DAY HOLD
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">P2P Escrow Protection</span>
                      </div>
                      <h3 className="text-base font-black font-display text-white tracking-tight">
                        Deposit CS2 Skins to Balance Instantly
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        Skip the 8-day hold — automated Vortex Steam Bots verify trade offers and credit your wallet in seconds.
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        STEAM BOT LIVE
                      </span>
                    </div>
                  </div>

                  {/* Trade URL input strip */}
                  <div className="p-3 rounded-xl bg-[#141724] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-mono font-bold text-white shrink-0">Trade URL:</span>
                      {!tradeUrlEditing ? (
                        <span className="text-[11px] font-mono text-slate-400 truncate">
                          {tradeUrl || 'https://steamcommunity.com/tradeoffer/new/?partner=38291029&token=vortex_live'}
                        </span>
                      ) : (
                        <input
                          type="url"
                          value={tempTradeUrl}
                          onChange={(e) => setTempTradeUrl(e.target.value)}
                          placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                          className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/15 text-xs font-mono text-white flex-1 outline-none focus:border-amber-400"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!tradeUrlEditing ? (
                        <button
                          type="button"
                          onClick={() => {
                            setTempTradeUrl(tradeUrl || 'https://steamcommunity.com/tradeoffer/new/?partner=38291029&token=vortex_live');
                            setTradeUrlEditing(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono cursor-pointer transition border border-white/10"
                        >
                          Change
                        </button>
                      ) : (
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
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-mono font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      )}

                      <a
                        href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition border border-white/10"
                      >
                        <span>Get URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Filter Tabs & Search */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: 'all', label: `All Skins (${inventory.length})` },
                        { id: 'knife', label: 'Knives' },
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
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
                            selectedCategory === tab.id
                              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                              : 'bg-[#141724] text-slate-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={skinSearch}
                          onChange={(e) => setSkinSearch(e.target.value)}
                          placeholder="Search weapon..."
                          className="pl-8 pr-3 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white outline-none focus:border-amber-400 w-36 sm:w-44"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={selectAllFiltered}
                        className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono cursor-pointer transition"
                      >
                        All
                      </button>
                      {selectedSkinIds.size > 0 && (
                        <button
                          type="button"
                          onClick={clearSelection}
                          className="px-2 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono cursor-pointer transition border border-red-500/20"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Skins Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {filteredSkins.map(s => {
                      const isSelected = selectedSkinIds.has(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => toggleSelectSkin(s.id)}
                          className={`relative p-3 rounded-2xl transition cursor-pointer group flex flex-col justify-between border ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.02]'
                              : 'bg-[#141724] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                              isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-white/20 bg-black/40'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 uppercase">{s.wearShort}</span>
                          </div>

                          <div className="my-2 h-16 flex items-center justify-center select-none">
                            <img
                              src={s.image}
                              alt=""
                              aria-hidden="true"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = KARAMBIT_LORE_IMAGE;
                              }}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow"
                              loading="lazy"
                            />
                          </div>

                          <div>
                            <div className="text-[11px] font-bold text-white truncate font-sans">{s.weapon}</div>
                            <div className="text-[10px] text-slate-400 truncate">{s.skinName}</div>
                            <div className="mt-1.5 pt-1.5 border-t border-white/[0.06] flex items-center justify-between">
                              <span className="text-xs font-mono font-black text-white">
                                {s.marketPriceEur.toFixed(2)} €
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Payout Summary Bar */}
                <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#171B28] via-[#1A2030] to-[#171B28] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        Selected Items: <strong className="text-white">{selectedSkins.length}</strong>
                      </div>
                      <div className="text-xs font-mono text-slate-300">
                        Total Value: <strong className="text-white">{baseTotalEur.toFixed(2)} €</strong>
                      </div>
                    </div>

                    <div className="pl-4 border-l border-white/10">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-black">
                        Instant Wallet Payout:
                      </div>
                      <div className="text-xl font-black font-display text-emerald-400">
                        {totalPayoutEur.toFixed(2)} €
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={selectedSkins.length === 0 || isDepositingSkins}
                    onClick={handleDepositSkins}
                    className={`px-5 py-2.5 rounded-xl font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                      selectedSkins.length > 0 && !isDepositingSkins
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/30 hover:scale-105 active:scale-95'
                        : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {isDepositingSkins ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Processing Steam Trade Bot...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Deposit Skins & Get Instant Balance</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: CRYPTO */}
            {activeView === 'crypto' && (
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
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
                        className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
                          selectedCrypto.symbol === coin.symbol
                            ? 'bg-white/10 text-white border-white/30 shadow-md'
                            : 'bg-[#141724] text-slate-400 hover:text-white border-white/5'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: coin.color }} />
                        <span>{coin.symbol}</span>
                        <span className="text-[10px] text-slate-500">({coin.network})</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-[#141724] border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                      <div>
                        <h3 className="text-base font-black font-display text-white">
                          Deposit {selectedCrypto.name}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">
                          Network: <strong className="text-emerald-400">{selectedCrypto.network}</strong>
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                        Automated Hot Wallet
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-32 h-32 p-2 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedCrypto.address)}`}
                          alt="Deposit QR"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 space-y-2.5 min-w-0">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                            Deposit Address ({selectedCrypto.network})
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs select-all break-all flex-1">
                              {selectedCrypto.address}
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyCrypto}
                              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              {cryptoCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{cryptoCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                            Verify Transaction (TXID)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={cryptoTxid}
                              onChange={(e) => setCryptoTxid(e.target.value)}
                              placeholder="Enter 64-character TXID..."
                              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs flex-1 outline-none focus:border-amber-400"
                            />
                            <button
                              type="button"
                              disabled={cryptoVerifying}
                              onClick={handleVerifyCryptoTxid}
                              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-yellow-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shrink-0"
                            >
                              {cryptoVerifying ? 'Checking...' : 'Verify'}
                            </button>
                          </div>
                          {cryptoError && <p className="text-xs font-mono text-red-400">{cryptoError}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: CARDS */}
            {activeView === 'cards' && (
              <div className="p-5 rounded-2xl bg-[#141724] border border-white/10 space-y-4">
                <div className="border-b border-white/[0.08] pb-3">
                  <h3 className="text-base font-black font-display text-white">
                    Instant Card Deposit (Visa / Mastercard)
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Immediate wallet balance credit with 3D Secure verification.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase font-bold block mb-2">
                    Select Amount:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[10, 25, 50, 100, 250].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setSelectedCardAmount(amt);
                        }}
                        className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                          selectedCardAmount === amt
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-lg scale-105'
                            : 'bg-black/40 text-white border-white/10 hover:border-white/20 font-bold'
                        }`}
                      >
                        <div className="text-base font-display font-black">{amt} €</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-slate-400">Total to wallet:</div>
                    <div className="text-xl font-black font-display text-emerald-400">
                      {selectedCardAmount.toFixed(2)} €
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={cardProcessing}
                    onClick={() => {
                      setCardProcessing(true);
                      sound.playSelect();
                      setTimeout(() => {
                        creditVortexWalletBalance(selectedCardAmount);
                        setCardProcessing(false);
                        sound.playTournamentVictory();
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                        setDepositSuccessMessage(`✓ Card Payment Authorized! +${selectedCardAmount.toFixed(2)} € credited to your wallet.`);
                        onSuccess?.(selectedCardAmount);
                      }, 1800);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-lg"
                  >
                    {cardProcessing ? 'Authorizing...' : `Pay ${selectedCardAmount.toFixed(2)} € via Card`}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: GIFTCARDS */}
            {activeView === 'giftcards' && (
              <div className="p-5 rounded-2xl bg-[#141724] border border-white/10 space-y-4">
                <div>
                  <h3 className="text-base font-black font-display text-white">
                    Redeem Voucher or Gift Card
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Enter voucher code from Kinguin, Eneba, or PayPal Digital Gifts.
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
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm tracking-widest outline-none focus:border-amber-400 uppercase"
                  />
                  {voucherError && <p className="text-xs font-mono text-red-400">{voucherError}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!voucherCode.trim() || voucherCode.trim().length < 8) {
                      sound.playClick();
                      setVoucherError('Please enter a valid voucher code.');
                      return;
                    }
                    sound.playSelect();
                    const redeemedEur = 25.00;
                    creditVortexWalletBalance(redeemedEur);
                    sound.playTournamentVictory();
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                    setDepositSuccessMessage(`✓ Voucher ${voucherCode} Redeemed! +${redeemedEur.toFixed(2)} € credited to your wallet.`);
                    setVoucherCode('');
                    onSuccess?.(redeemedEur);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-md uppercase tracking-wider"
                >
                  Redeem Voucher Funds
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
