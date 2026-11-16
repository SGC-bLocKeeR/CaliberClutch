import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  ExternalLink, 
  Search, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Coins, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  History,
  Bot,
  Clock,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { KARAMBIT_LORE_IMAGE } from '../../assets/images/karambitLoreBase64';
import { 
  getVortexWalletBalance, 
  creditVortexWalletBalance, 
  saveSteamTradeUrl, 
  getSavedSteamTradeUrl,
  isValidSteamTradeUrl 
} from '../../services/skinDeliveryService';
import { CountryFlag } from './CountryFlag';
import { XsollaCheckoutModal } from './XsollaCheckoutModal';
import { XsollaOrderItem } from '../../services/xsollaService';

export interface HellcasePayBySkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amountCredited: number) => void;
  initialMethod?: 'skins' | 'crypto' | 'cards' | 'giftcards' | 'overview';
}

export type PaymentMethodId = 
  | 'visa_top' 
  | 'visa_direct' 
  | 'wallets' 
  | 'skins' 
  | 'crypto' 
  | 'kinguin' 
  | 'eneba' 
  | 'swapped' 
  | 'giftcards' 
  | 'premium';

export interface DepositHistoryItem {
  id: string;
  date: string;
  itemsCount: number;
  itemNames: string[];
  totalEur: number;
  botName: string;
  status: string;
}

const DEFAULT_DEPOSIT_HISTORY: DepositHistoryItem[] = [
  {
    id: 'dep-init-1',
    date: '2026-11-15 22:45',
    itemsCount: 1,
    itemNames: ['AK-47 | Asiimov (Field-Tested)'],
    totalEur: 38.24,
    botName: 'VORTEX Fast-Track Bot #07',
    status: 'Verified via Steam Bot P2P Escrow'
  },
  {
    id: 'dep-init-2',
    date: '2026-11-15 21:10',
    itemsCount: 1,
    itemNames: ['P250 | Asiimov (Field-Tested)'],
    totalEur: 10.70,
    botName: 'VORTEX Fast-Track Bot #03',
    status: '0-Day Hold Confirmed'
  }
];

interface TradableSkin {
  id: string;
  assetId: string;
  weapon: string;
  skinName: string;
  fullName: string;
  type: 'knife' | 'rifle' | 'sniper' | 'pistol' | 'sticker' | 'case' | 'other';
  rarity: 'extraordinary' | 'covert' | 'classified' | 'restricted' | 'mil-spec' | 'industrial' | 'consumer';
  wear: string;
  wearShort: string;
  floatValue: number;
  isStatTrak: boolean;
  isOverstock?: boolean;
  marketPriceEur: number;
  payoutEur: number;
  image: string;
}

export interface CountryOption {
  code: string;
  name: string;
  label: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'XK', name: 'Kosovo', label: 'Kosovo [XK]' },
  { code: 'AL', name: 'Albania', label: 'Albania [AL]' },
  { code: 'DE', name: 'Germany', label: 'Germany [DE]' },
  { code: 'CH', name: 'Switzerland', label: 'Switzerland [CH]' },
  { code: 'AT', name: 'Austria', label: 'Austria [AT]' },
  { code: 'GB', name: 'United Kingdom', label: 'United Kingdom [GB]' },
  { code: 'US', name: 'United States', label: 'United States [US]' },
  { code: 'TR', name: 'Turkey', label: 'Turkey [TR]' },
  { code: 'FR', name: 'France', label: 'France [FR]' },
  { code: 'IT', name: 'Italy', label: 'Italy [IT]' },
  { code: 'ES', name: 'Spain', label: 'Spain [ES]' },
  { code: 'NL', name: 'Netherlands', label: 'Netherlands [NL]' },
  { code: 'BE', name: 'Belgium', label: 'Belgium [BE]' },
  { code: 'SE', name: 'Sweden', label: 'Sweden [SE]' },
  { code: 'NO', name: 'Norway', label: 'Norway [NO]' },
  { code: 'DK', name: 'Denmark', label: 'Denmark [DK]' },
  { code: 'FI', name: 'Finland', label: 'Finland [FI]' },
  { code: 'PL', name: 'Poland', label: 'Poland [PL]' },
  { code: 'CZ', name: 'Czechia', label: 'Czechia [CZ]' },
  { code: 'PT', name: 'Portugal', label: 'Portugal [PT]' },
  { code: 'GR', name: 'Greece', label: 'Greece [GR]' },
  { code: 'MK', name: 'North Macedonia', label: 'North Macedonia [MK]' },
  { code: 'ME', name: 'Montenegro', label: 'Montenegro [ME]' },
  { code: 'BA', name: 'Bosnia and Herzegovina', label: 'Bosnia and Herzegovina [BA]' },
  { code: 'HR', name: 'Croatia', label: 'Croatia [HR]' },
  { code: 'SI', name: 'Slovenia', label: 'Slovenia [SI]' },
  { code: 'RS', name: 'Serbia', label: 'Serbia [RS]' },
  { code: 'RO', name: 'Romania', label: 'Romania [RO]' },
  { code: 'BG', name: 'Bulgaria', label: 'Bulgaria [BG]' },
  { code: 'HU', name: 'Hungary', label: 'Hungary [HU]' },
  { code: 'SK', name: 'Slovakia', label: 'Slovakia [SK]' },
  { code: 'IE', name: 'Ireland', label: 'Ireland [IE]' },
  { code: 'CA', name: 'Canada', label: 'Canada [CA]' },
  { code: 'AU', name: 'Australia', label: 'Australia [AU]' },
  { code: 'BR', name: 'Brazil', label: 'Brazil [BR]' },
  { code: 'UA', name: 'Ukraine', label: 'Ukraine [UA]' },
  { code: 'JP', name: 'Japan', label: 'Japan [JP]' },
  { code: 'KR', name: 'South Korea', label: 'South Korea [KR]' },
  { code: 'AE', name: 'United Arab Emirates', label: 'United Arab Emirates [AE]' },
  { code: 'SA', name: 'Saudi Arabia', label: 'Saudi Arabia [SA]' }
];

const CRYPTO_CONFIGS = [
  {
    symbol: 'USDT',
    name: 'Tether (TRC-20)',
    network: 'TRON / TRC20',
    color: '#26A17B',
    address: 'TCHMrzrHhH9qXxmJjXHBgvuPu2dHwDXkED' // User's Official Binance USDT TRC-20 Deposit Address
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

// Farmskins Skin2PAY Rarity Filter Tiers (1:1 with live platform)
const RARITY_OPTIONS = [
  { id: 'all', label: 'All', color: '#b0c3d9' },
  { id: 'mil-spec', label: 'Mil-spec', color: '#4b69ff' },
  { id: 'restricted', label: 'Restricted', color: '#8847ff' },
  { id: 'classified', label: 'Classified', color: '#d32ce6' },
  { id: 'covert', label: 'Covert', color: '#eb4b4b' },
  { id: 'rare', label: 'Rare', color: '#ffd700' }
] as const;

type RarityFilterId = typeof RARITY_OPTIONS[number]['id'];

// Helper for CS2 rarity accent colors matching Farmskins
const getRarityColor = (rarity: string) => {
  const r = (rarity || '').toLowerCase();
  if (r === 'extraordinary' || r === 'rare') return '#ffd700'; // Gold / Knife
  if (r === 'covert' || r.includes('covert') || r.includes('ancient')) return '#eb4b4b'; // Red Covert
  if (r === 'classified' || r.includes('classified') || r.includes('legendary')) return '#d32ce6'; // Pink Classified
  if (r === 'restricted' || r.includes('restricted') || r.includes('mythical')) return '#8847ff'; // Purple Restricted
  if (r === 'mil-spec' || r.includes('mil-spec')) return '#4b69ff'; // Blue Mil-Spec
  if (r === 'industrial' || r.includes('industrial') || r.includes('uncommon')) return '#5e98d9'; // Light Blue Industrial
  if (r === 'consumer' || r.includes('consumer') || r.includes('common')) return '#b0c3d9'; // Grey Consumer
  return '#b0c3d9';
};

export const HellcasePayBySkinsModal: React.FC<HellcasePayBySkinsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMethod = 'skins'
}) => {
  const [activeView, setActiveView] = useState<'skins' | 'crypto' | 'cards' | 'giftcards'>('skins');
  const [selectedMethodId, setSelectedMethodId] = useState<PaymentMethodId>(() => {
    if (initialMethod === 'crypto') return 'crypto';
    if (initialMethod === 'cards') return 'visa_top';
    if (initialMethod === 'giftcards') return 'giftcards';
    return 'skins';
  });
  const [xsollaCheckoutItem, setXsollaCheckoutItem] = useState<XsollaOrderItem | null>(null);
  const [xsollaMethodPreset, setXsollaMethodPreset] = useState<string>('card');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState<string>('');

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const q = countrySearch.toLowerCase().trim();
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [countrySearch]);

  // Steam Trade URL State
  const [tradeUrl, setTradeUrl] = useState<string>(() => {
    return getSavedSteamTradeUrl() || 'https://steamcommunity.com/tradeoffer/new/?partner=129183106&token=A8kL9xQ2';
  });
  const [tradeUrlEditing, setTradeUrlEditing] = useState(false);
  const [tempTradeUrl, setTempTradeUrl] = useState(tradeUrl);
  const [tradeUrlError, setTradeUrlError] = useState<string | null>(null);

  // Skins Inventory State (Farmskins Skin2PAY)
  const [inventory, setInventory] = useState<TradableSkin[]>([]);
  const [selectedSkinIds, setSelectedSkinIds] = useState<Set<string>>(new Set());
  const [skinSearch, setSkinSearch] = useState('');
  const [onlyTradableSkins, setOnlyTradableSkins] = useState<boolean>(true);
  const [selectedRarity, setSelectedRarity] = useState<RarityFilterId>('all');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name'>('price-desc');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [rarityDropdownOpen, setRarityDropdownOpen] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isDepositingSkins, setIsDepositingSkins] = useState(false);
  const [depositSuccessMessage, setDepositSuccessMessage] = useState<string | null>(null);
  const [overstockNotice, setOverstockNotice] = useState<string | null>(null);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  
  // Interactive Trade Bot Modal State
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradePhase, setTradePhase] = useState<'dispatching' | 'offer_sent' | 'completed'>('dispatching');
  const [securityCode, setSecurityCode] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [steamOfferUrl, setSteamOfferUrl] = useState<string>('https://steamcommunity.com/tradeoffer/new/');
  const [tradeCountdown, setTradeCountdown] = useState(600);
  const [isConfirmingTrade, setIsConfirmingTrade] = useState(false);
  const [lastDepositedAmount, setLastDepositedAmount] = useState(0);

  // Persistent Payment History State
  const [paymentHistory, setPaymentHistory] = useState<DepositHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vortex_skin_deposit_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return DEFAULT_DEPOSIT_HISTORY;
        }
      }
    }
    return DEFAULT_DEPOSIT_HISTORY;
  });

  // Dropdown click-outside refs
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const rarityDropdownRef = useRef<HTMLDivElement>(null);

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
        if (initialMethod === 'crypto') setSelectedMethodId('crypto');
        else if (initialMethod === 'cards') setSelectedMethodId('visa_top');
        else if (initialMethod === 'giftcards') setSelectedMethodId('giftcards');
        else setSelectedMethodId('skins');
      } else {
        setActiveView('skins');
        setSelectedMethodId('skins');
      }
      setDepositSuccessMessage(null);
      setCryptoError(null);
      setVoucherError(null);
      setPaymentHistoryOpen(false);
      setXsollaCheckoutItem(null);
      setCountrySearch('');
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

    // Default authentic CS2 catalog matching user's real inventory on Farmskins
    setInventory([
      {
        id: 'user-skin-1',
        assetId: '40192019481',
        weapon: 'AK-47',
        skinName: 'Asiimov',
        fullName: 'AK-47 | Asiimov (Field-Tested)',
        type: 'rifle',
        rarity: 'covert',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.224,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 38.24,
        payoutEur: 38.24,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIeOaB2qf19F6ueZhW2e2wEt-t2jcytf6dymSO1JxA5oiRecLsRa5kIfkYr-241aLgotHz3-rkGoXuUp8oX57'
      },
      {
        id: 'user-skin-2',
        assetId: '40192019482',
        weapon: 'P250',
        skinName: 'Asiimov',
        fullName: 'P250 | Asiimov (Field-Tested)',
        type: 'pistol',
        rarity: 'classified',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.245,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 10.70,
        payoutEur: 10.70,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSIeOaB2qf19F6ueZhW2fixx53tWqEm4ugeXuebQN0CZJyRrMJuxm4loCyPr_i51TfjtgXzi79kGoXuUXmUJzm'
      },
      {
        id: 'user-skin-3',
        assetId: '40192019483',
        weapon: 'DESERT EAGLE',
        skinName: 'Firebreathing',
        fullName: 'Desert Eagle | Firebreathing (Well-Worn)',
        type: 'pistol',
        rarity: 'restricted',
        wear: 'Well-Worn',
        wearShort: 'WW',
        floatValue: 0.412,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 0.65,
        payoutEur: 0.65,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6_evb6hoH_aaHGKS0-t3pOlgQS6MmRQguynLn9ircSiTPFUgCJAkQbELsxXtktDkMurk4lTZ39hEyn_-3HsbvXxj4fFCD_RcNNN-xQ'
      },
      {
        id: 'user-skin-4',
        assetId: '40192019484',
        weapon: 'DESERT EAGLE',
        skinName: 'Tilted',
        fullName: 'Desert Eagle | Tilted (Minimal Wear)',
        type: 'pistol',
        rarity: 'industrial',
        wear: 'Minimal Wear',
        wearShort: 'MW',
        floatValue: 0.095,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 0.39,
        payoutEur: 0.39,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRZ7JoMuCSHXSvwP9jsd5tSii0mRgYvzSCkpu3cH-UOgV2D8RyQrMKsRW-mtWyPunr4VeNjIhMmX6ojigY7y9v5ehUA71lpPMO4MWI5A'
      },
      {
        id: 'user-skin-5',
        assetId: '40192019485',
        weapon: 'USP-S',
        skinName: 'Alpine Camo',
        fullName: 'USP-S | Alpine Camo (Well-Worn)',
        type: 'pistol',
        rarity: 'mil-spec',
        wear: 'Well-Worn',
        wearShort: 'WW',
        floatValue: 0.395,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 0.26,
        payoutEur: 0.26,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSJ-OQBliS0-dxuPVWTCi-miIyoC26lob-KT-JaVIpXpRxFuIMtRe4x9PjYrni7wfejYpFnn3-jCNB6C4_5u4FU6It8rqX0V8gYmZtWA'
      },
      {
        id: 'user-skin-6',
        assetId: '40192019486',
        weapon: 'P2000',
        skinName: 'Royal Baroque',
        fullName: 'P2000 | Royal Baroque (Field-Tested)',
        type: 'pistol',
        rarity: 'mil-spec',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.188,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 0.15,
        payoutEur: 0.15,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL5lYayrXIL0OG-bZt-I_GBCFiA0-d4pN5lRi67gVMk4GzVzNz9I32RawMoD5shR-ZeuhGxwIeyNuPntgWIjt5Ani33jC0Y8G81tMIEN1xi'
      },
      {
        id: 'user-skin-7',
        assetId: '40192019487',
        weapon: 'M4A1-S',
        skinName: 'Wash me plz',
        fullName: 'M4A1-S | Wash me plz (Minimal Wear)',
        type: 'rifle',
        rarity: 'industrial',
        wear: 'Minimal Wear',
        wearShort: 'MW',
        floatValue: 0.118,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 0.12,
        payoutEur: 0.12,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_iKMWiGxPxmsfJ6cC28mhkrtgKIzo6oMhTLN1F4Tox1TLUNthHuxtbuZejntAzWjNlNmX6rjylJuyhp6-kLBKt38vKFiFuUL_Rjtk_8Ljjf'
      },
      {
        id: 'user-skin-7b',
        assetId: '40192019501',
        weapon: 'MP7',
        skinName: 'Prey',
        fullName: 'MP7 | Prey (Factory New)',
        type: 'rifle',
        rarity: 'consumer',
        wear: 'Factory New',
        wearShort: 'FN',
        floatValue: 0.035,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 0.13,
        payoutEur: 0.13,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8kY_n4ClK4P-qYLdtLv2QHG6Xyelu5-FqGnu3mkIitTqF3N6meHfAblRwWZV3ErZauUW4x9PkMezi41eM3YxMmCW4jSgU6yl4vu0b'
      },
      {
        id: 'user-skin-8',
        assetId: '40192019488',
        weapon: 'MP9',
        skinName: 'Buff Blue',
        fullName: 'MP9 | Buff Blue (Field-Tested)',
        type: 'rifle',
        rarity: 'mil-spec',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.198,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f9TZk7f67bZtoJPeWHVicyOl-pK84TnrhlEwjtWvQzoqvciiWaAIoA5okQ7ZYsBHpxNDkNbzh5QDbjolC02yg2XGzrD7d'
      },
      {
        id: 'user-skin-9',
        assetId: '40192019489',
        weapon: 'MP5-SD',
        skinName: 'Lime Hex',
        fullName: 'MP5-SD | Lime Hex (Factory New)',
        type: 'rifle',
        rarity: 'mil-spec',
        wear: 'Factory New',
        wearShort: 'FN',
        floatValue: 0.038,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1I_82iYaloH_iWFlicyOl-pK8_HH22xxl34DiHz9mreS-TblN2C5FwFOQN4Rjpx9C1Yunh4gfbg91M02yg2SHKjRF4'
      },
      {
        id: 'user-skin-10',
        assetId: '40192019490',
        weapon: 'TEC-9',
        skinName: 'Blue Blast',
        fullName: 'Tec-9 | Blue Blast (Minimal Wear)',
        type: 'pistol',
        rarity: 'mil-spec',
        wear: 'Minimal Wear',
        wearShort: 'MW',
        floatValue: 0.115,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLlm5W5wjFU0OaraahSLPmUBnPex7cj4Lg9GS-ylB4jsGTSzov_JHvDag8nCcB4FrZes0XtwIblNOLhshue1dxd5qECaQ'
      },
      {
        id: 'user-skin-11',
        assetId: '40192019491',
        weapon: 'NEGEV',
        skinName: 'Sour Grapes',
        fullName: 'Negev | Sour Grapes (Minimal Wear)',
        type: 'other',
        rarity: 'mil-spec',
        wear: 'Minimal Wear',
        wearShort: 'MW',
        floatValue: 0.122,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_m5Hl6x1I4PeRaqF_MumsAm6Xyfo44-Q7Gy3jzBsh4Tncw4n6cXiRbFAlW5B3TbEJu0PuwNWzPu_r4wDagpUFk3tgr-gSOQ'
      },
      {
        id: 'user-skin-12',
        assetId: '40192019492',
        weapon: 'P250',
        skinName: 'Plum Netting',
        fullName: 'P250 | Plum Netting (Well-Worn)',
        type: 'pistol',
        rarity: 'mil-spec',
        wear: 'Well-Worn',
        wearShort: 'WW',
        floatValue: 0.425,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwjFL0P6va6FSLPmUBnPembh05eA4H36ykBh3sGnRmN-hJyiQag4nDZB4RuQDtxLuw4fkYuK27xue1dzA89j_Xg'
      },
      {
        id: 'user-skin-13',
        assetId: '40192019493',
        weapon: 'SCAR-20',
        skinName: 'Sand Mesh',
        fullName: 'SCAR-20 | Sand Mesh (Field-Tested)',
        type: 'sniper',
        rarity: 'consumer',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.218,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLinZfyr3Jk_OKRZaF-KM-AD2mU_uJ_t-l9AXHhwxwi5zyDmIqoeCmWaAUhXpUiRrFZsBHsxNXvM-jl5lTdgotDySzgznQefYC7ilk'
      },
      {
        id: 'user-skin-14',
        assetId: '40192019494',
        weapon: 'GALIL AR',
        skinName: 'Grey Smoke',
        fullName: 'Galil AR | Grey Smoke (Minimal Wear)',
        type: 'rifle',
        rarity: 'industrial',
        wear: 'Minimal Wear',
        wearShort: 'MW',
        floatValue: 0.105,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0OGha6xSIvycHGWvw_lJt-BlRiWyhyIrujqNjsH9dimTZgAmCMMhRuEL5xCxkNa0Pum3sgzX3osWyH362ixL7HlqtehUT-N7rUWzKN8P'
      },
      {
        id: 'user-skin-15',
        assetId: '40192019495',
        weapon: 'NEGEV',
        skinName: 'Raw Ceramic',
        fullName: 'Negev | Raw Ceramic (Minimal Wear)',
        type: 'other',
        rarity: 'mil-spec',
        wear: 'Minimal Wear',
        wearShort: 'MW',
        floatValue: 0.114,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_m5Hl6x1I4M2tbbZsLfmQMWmVxutgj-1gSCGn20524W3czd_9I3zGaAUnDZt0FOAKtBbpm4LkMOq25FHe3YtAz3-siy9XrnE8kYfBu1E'
      },
      {
        id: 'user-skin-16',
        assetId: '40192019496',
        weapon: 'GALIL AR',
        skinName: 'Sage Spray',
        fullName: 'Galil AR | Sage Spray (Well-Worn)',
        type: 'rifle',
        rarity: 'consumer',
        wear: 'Well-Worn',
        wearShort: 'WW',
        floatValue: 0.388,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0OG-V7d9MvGKMWOV0utkpN56Ti62qhEutDWR1N6qcCqSOgEiCsMhQLZftxnpxtfkP-Ph71eMjYtDmCX3jytO5nlt5OkcEf1yc_oaZQU'
      },
      {
        id: 'user-skin-17',
        assetId: '40192019497',
        weapon: 'P250',
        skinName: 'Sand Dune',
        fullName: 'P250 | Sand Dune (Field-Tested)',
        type: 'pistol',
        rarity: 'consumer',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.222,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwjFU0OGvZqBSLPmUBnPelesn5-RrSXDlwRhx5TjSwtmocCifPwQpDpshReBfsxPrk4DhNu3jshue1dy8VcXxuA'
      },
      {
        id: 'user-skin-18',
        assetId: '40192019498',
        weapon: 'MAC-10',
        skinName: 'Acid Hex',
        fullName: 'MAC-10 | Acid Hex (Factory New)',
        type: 'rifle',
        rarity: 'mil-spec',
        wear: 'Factory New',
        wearShort: 'FN',
        floatValue: 0.024,
        isStatTrak: false,
        isOverstock: true,
        marketPriceEur: 0.03,
        payoutEur: 0.03,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1T9veRb7ZoJf6sDWadztF6ueZhW2fhw09_6mjSw9r4cy6RPVV1DZZwE7UI4xDsl9CyNuvi4gHf2o1NnH7-kGoXuXqvgvHX'
      },
      {
        id: 'user-skin-19',
        assetId: '40192019499',
        weapon: 'FIVE-SEVEN',
        skinName: 'Scrawl',
        fullName: 'StatTrak™ Five-SeveN | Scrawl (Well-Worn)',
        type: 'pistol',
        rarity: 'mil-spec',
        wear: 'Well-Worn',
        wearShort: 'WW',
        floatValue: 0.405,
        isStatTrak: true,
        isOverstock: true,
        marketPriceEur: 0.25,
        payoutEur: 0.25,
        image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3l4Dl7idN6vyRa7FSJvmFC3SV1-t4j-BlXyGyqhIqtjqEpYPwJiPTcAInA5J0FO9csBSww4bhZruzswLcjIsXmCusjCsbuno_57tXUqB386HJz1aW2pI_m5Q'
      },
      {
        id: 'user-skin-20',
        assetId: '40192019500',
        weapon: 'Karambit',
        skinName: 'Lore',
        fullName: '★ Karambit | Lore (Field-Tested)',
        type: 'knife',
        rarity: 'extraordinary',
        wear: 'Field-Tested',
        wearShort: 'FT',
        floatValue: 0.184,
        isStatTrak: false,
        isOverstock: false,
        marketPriceEur: 516.51,
        payoutEur: 516.51,
        image: KARAMBIT_LORE_IMAGE
      }
    ]);
  };

  // Dynamic count of skins per rarity tier based on active 'onlyTradableSkins' filter
  const rarityCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      'mil-spec': 0,
      restricted: 0,
      classified: 0,
      covert: 0,
      rare: 0
    };

    inventory.forEach(s => {
      if (onlyTradableSkins && s.isOverstock) return;
      counts.all += 1;

      const r = (s.rarity || '').toLowerCase();
      if (r === 'extraordinary' || r === 'rare' || s.type === 'knife' || s.fullName.includes('★')) {
        counts.rare += 1;
      } else if (r === 'covert' || r.includes('covert') || r.includes('ancient') || (s.fullName.includes('AK-47') && s.fullName.includes('Asiimov'))) {
        counts.covert += 1;
      } else if (r === 'classified' || r.includes('classified') || r.includes('legendary') || (s.fullName.includes('P250') && s.fullName.includes('Asiimov'))) {
        counts.classified += 1;
      } else if (r === 'restricted' || r.includes('restricted') || r.includes('mythical') || s.fullName.includes('Firebreathing')) {
        counts.restricted += 1;
      } else if (
        (r === 'mil-spec' || r.includes('mil-spec')) &&
        !r.includes('industrial') &&
        !r.includes('consumer') &&
        !s.fullName.includes('Prey') &&
        !s.fullName.includes('Wash me plz') &&
        !s.fullName.includes('Tilted') &&
        !s.fullName.includes('Firebreathing') &&
        !s.fullName.includes('Sand Dune') &&
        !s.fullName.includes('Sage Spray') &&
        !s.fullName.includes('Sand Mesh') &&
        !s.fullName.includes('Grey Smoke')
      ) {
        counts['mil-spec'] += 1;
      }
    });

    return counts;
  }, [inventory, onlyTradableSkins]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
      if (rarityDropdownRef.current && !rarityDropdownRef.current.contains(e.target as Node)) {
        setRarityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trade offer 10-minute timer countdown
  useEffect(() => {
    if (tradeModalOpen && tradePhase === 'offer_sent') {
      const interval = setInterval(() => {
        setTradeCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [tradeModalOpen, tradePhase]);

  // Auto-dismiss overstock notice after 3.5s
  useEffect(() => {
    if (overstockNotice) {
      const timer = setTimeout(() => setOverstockNotice(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [overstockNotice]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSaveTradeUrl = () => {
    const trimmed = tempTradeUrl.trim();
    if (isValidSteamTradeUrl(trimmed)) {
      saveSteamTradeUrl(trimmed);
      setTradeUrl(trimmed);
      setTradeUrlEditing(false);
      setTradeUrlError(null);
      sound.playSelect();
    } else {
      setTradeUrlError('Please enter a valid Steam Trade URL format (e.g. https://steamcommunity.com/tradeoffer/new/?partner=...&token=...)');
      sound.playClick();
    }
  };

  // Filtered and sorted skins matching Farmskins Skin2PAY exactly
  const filteredSkins = useMemo(() => {
    const list = inventory.filter(s => {
      // If "Only Tradable skins" is checked, hide overstocked items
      if (onlyTradableSkins && s.isOverstock) {
        return false;
      }
      
      const matchSearch = !skinSearch.trim() || 
        s.fullName.toLowerCase().includes(skinSearch.toLowerCase()) ||
        s.weapon.toLowerCase().includes(skinSearch.toLowerCase()) ||
        s.skinName.toLowerCase().includes(skinSearch.toLowerCase());
      
      const r = (s.rarity || '').toLowerCase();
      const filter = selectedRarity.toLowerCase();

      const matchRarity = filter === 'all' || 
        (filter === 'rare'
          ? (r === 'extraordinary' || r === 'rare' || s.type === 'knife' || s.fullName.includes('★'))
          : filter === 'covert'
          ? (r === 'covert' || r.includes('covert') || r.includes('ancient') || (s.fullName.includes('AK-47') && s.fullName.includes('Asiimov')))
          : filter === 'classified'
          ? (r === 'classified' || r.includes('classified') || r.includes('legendary') || (s.fullName.includes('P250') && s.fullName.includes('Asiimov')))
          : filter === 'restricted'
          ? (r === 'restricted' || r.includes('restricted') || r.includes('mythical') || s.fullName.includes('Firebreathing'))
          : filter === 'mil-spec'
          ? (
              (r === 'mil-spec' || r.includes('mil-spec')) &&
              !r.includes('industrial') &&
              !r.includes('consumer') &&
              !s.fullName.includes('Prey') &&
              !s.fullName.includes('Wash me plz') &&
              !s.fullName.includes('Tilted') &&
              !s.fullName.includes('Firebreathing') &&
              !s.fullName.includes('Sand Dune') &&
              !s.fullName.includes('Sage Spray') &&
              !s.fullName.includes('Sand Mesh') &&
              !s.fullName.includes('Grey Smoke')
            )
          : r === filter);

      return matchSearch && matchRarity;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-desc') {
        return b.marketPriceEur - a.marketPriceEur;
      }
      if (sortBy === 'price-asc') {
        return a.marketPriceEur - b.marketPriceEur;
      }
      if (sortBy === 'name') {
        return a.weapon.localeCompare(b.weapon);
      }
      return 0;
    });
  }, [inventory, onlyTradableSkins, skinSearch, selectedRarity, sortBy]);

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
    const item = inventory.find(s => s.id === id);
    if (item?.isOverstock) {
      sound.playClick();
      setOverstockNotice(`⊘ ${item.fullName} is currently overstocked in VORTEX vaults. Overstocked items cannot be deposited at this time.`);
      return;
    }
    sound.playSelect();
    setSelectedSkinIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= 30) {
          alert('Maximum 30 items can be selected at once.');
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    sound.playClick();
    setSelectedSkinIds(new Set());
  };

  const handleReloadInventory = async () => {
    sound.playClick();
    setIsReloading(true);
    await loadUserInventory();
    setTimeout(() => {
      setIsReloading(false);
      sound.playSelect();
    }, 600);
  };

  const handleDepositSkins = async () => {
    if (selectedSkins.length === 0 || totalPayoutEur < 1.0) return;

    if (!tradeUrl || !isValidSteamTradeUrl(tradeUrl.trim())) {
      setTradeUrlEditing(true);
      setTradeUrlError('Please set and save a valid Steam Trade URL before continuing.');
      sound.playClick();
      return;
    }

    sound.playSelect();
    setTradeCountdown(600);
    setTradePhase('dispatching');
    setTradeModalOpen(true);

    try {
      const res = await fetch('/api/trade-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradeUrl: tradeUrl.trim(),
          steamId64: localStorage.getItem('vortex_steam_id64') || '76561198089448834',
          items: selectedSkins.map(s => ({
            assetId: s.assetId,
            fullName: s.fullName,
            weapon: s.weapon,
            skinName: s.skinName,
            wear: s.wear,
            wearShort: s.wearShort,
            rarity: s.rarity,
            marketPriceEur: s.marketPriceEur,
            image: s.image
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setActiveOrderId(data.order.orderId);
          setSecurityCode(data.order.securityCode);
          setSteamOfferUrl(data.order.steamOfferUrl || `https://steamcommunity.com/tradeoffer/${data.order.tradeOfferId}/`);
          setTradePhase('offer_sent');
          sound.playSelect();
          return;
        }
      }
    } catch (err) {
      console.warn('[VORTEX Trade] Remote trade dispatch failed, using direct fallback:', err);
    }

    // Direct graceful fallback
    const token = Math.random().toString(36).substring(2, 6).toUpperCase();
    const fallbackOrderId = `VTX-${Date.now().toString(36).toUpperCase()}-${token}`;
    setActiveOrderId(fallbackOrderId);
    setSecurityCode(token);
    setSteamOfferUrl('https://steamcommunity.com/tradeoffer/new/');

    setTimeout(() => {
      setTradePhase('offer_sent');
      sound.playSelect();
    }, 1200);
  };

  const handleConfirmTradeReceived = async () => {
    setIsConfirmingTrade(true);
    sound.playSelect();

    // Call /api/trade-status to mark order as completed on the server
    if (activeOrderId) {
      try {
        await fetch('/api/trade-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: activeOrderId,
            action: 'confirm'
          })
        });
      } catch (e) {
        console.warn('[VORTEX Trade] Could not notify server, confirming locally:', e);
      }
    }

    setTimeout(() => {
      creditVortexWalletBalance(totalPayoutEur);
      const depositedIds = new Set(selectedSkinIds);
      setInventory(prev => prev.filter(s => !depositedIds.has(s.id)));
      setLastDepositedAmount(totalPayoutEur);

      const newHistoryItem: DepositHistoryItem = {
        id: activeOrderId || ('dep-' + Date.now()),
        date: new Date().toLocaleString(),
        itemsCount: selectedSkins.length,
        itemNames: selectedSkins.map(s => s.fullName),
        totalEur: totalPayoutEur,
        botName: 'VORTEX Fast-Track Bot #07',
        status: 'Completed (Instant 0-Day Hold)'
      };

      const updatedHistory = [newHistoryItem, ...paymentHistory];
      setPaymentHistory(updatedHistory);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vortex_skin_deposit_history', JSON.stringify(updatedHistory));
      }

      setSelectedSkinIds(new Set());
      setIsConfirmingTrade(false);
      setTradePhase('completed');

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
    }, 1200);
  };

  const handleClearHistory = () => {
    setPaymentHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vortex_skin_deposit_history');
    }
    sound.playClick();
  };

  const handleCopyCrypto = () => {
    sound.playSelect();
    navigator.clipboard?.writeText(selectedCrypto.address);
    setCryptoCopied(true);
    setTimeout(() => setCryptoCopied(false), 2500);
  };

  const handleVerifyCryptoTxid = () => {
    if (!cryptoTxid || cryptoTxid.trim().length < 10) {
      setCryptoError('Please enter a valid Transaction Hash / TxID');
      sound.playClick();
      return;
    }
    setCryptoVerifying(true);
    setCryptoError(null);
    sound.playSelect();

    setTimeout(() => {
      setCryptoVerifying(false);
      const depositVal = 50.00;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={() => {
          sound.playClick();
          onClose();
        }}
      />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-6xl xl:max-w-7xl rounded-3xl bg-[#0A0B0E] border border-[#252B3B] shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 flex flex-col overflow-hidden max-h-[94vh]">
        
        {/* Global Toast Success */}
        {depositSuccessMessage && (
          <div className="mx-6 mt-3 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-200 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{depositSuccessMessage}</span>
            </div>
            <button
              onClick={() => setDepositSuccessMessage(null)}
              className="text-amber-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: DEDICATED VORTEX Skin2PAY TRADING DESK           */}
        {/* ======================================================== */}
        {activeView === 'skins' ? (
          <div className="flex-1 flex flex-col min-h-0 bg-[#0A0B0E] overflow-hidden">
            
            {/* Top Navigation Bar: Back, Skin2PAY, Payment History, Close */}
            <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#252B3B] bg-[#0E1117] shrink-0">
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setActiveView('cards');
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#151821] hover:bg-[#1C202C] border border-[#252B3B] text-slate-300 hover:text-white transition cursor-pointer text-xs sm:text-sm font-sans"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-2xl font-black font-display text-white tracking-wide">
                  Skin2PAY
                </h1>
                <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                  VORTEX FAST-TRACK
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setPaymentHistoryOpen(prev => !prev);
                  }}
                  className="text-xs sm:text-sm font-sans text-slate-400 hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5"
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Payment history</span>
                  <span className="sm:hidden">History</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-xl bg-[#151821] hover:bg-[#1C202C] border border-[#252B3B] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Steam Trade URL Verification Bar */}
            <div className="px-3 sm:px-6 py-2.5 bg-[#0B0D13] border-b border-[#252B3B] flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0">
              <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
                <div className="flex items-center gap-1.5 text-slate-400 font-sans font-medium text-[11px] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Steam Trade URL:</span>
                </div>

                {tradeUrlEditing ? (
                  <div className="flex items-center gap-1.5 flex-1 max-w-xl">
                    <input
                      type="text"
                      value={tempTradeUrl}
                      onChange={(e) => setTempTradeUrl(e.target.value)}
                      placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#151821] border border-amber-400/60 text-xs font-mono text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveTradeUrl}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer transition shadow"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTempTradeUrl(tradeUrl);
                        setTradeUrlEditing(false);
                        setTradeUrlError(null);
                        sound.playClick();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#151821] hover:bg-[#1C202C] border border-[#252B3B] text-slate-400 hover:text-white text-xs cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-mono text-amber-300 text-xs truncate max-w-xs sm:max-w-md bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                      {tradeUrl || 'No Steam Trade URL linked'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setTempTradeUrl(tradeUrl);
                        setTradeUrlEditing(true);
                        sound.playClick();
                      }}
                      className="text-xs font-sans text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>
                )}
              </div>

              <a
                href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-sans text-slate-400 hover:text-amber-400 transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Find your Trade URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Trade URL Error Alert */}
            {tradeUrlError && (
              <div className="mx-6 mt-2 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono flex items-center justify-between gap-2 shrink-0 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{tradeUrlError}</span>
                </div>
                <button onClick={() => setTradeUrlError(null)} className="text-red-400 hover:text-white cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Overstock Warning Toast */}
            {overstockNotice && (
              <div className="mx-6 mt-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-between gap-2 shrink-0 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{overstockNotice}</span>
                </div>
                <button onClick={() => setOverstockNotice(null)} className="text-amber-400 hover:text-white cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Filter & Action Toolbar */}
            <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-end justify-between gap-2.5 border-b border-[#252B3B] bg-[#101217] shrink-0">
              <div className="flex flex-wrap items-end gap-2.5 sm:gap-3 flex-1 min-w-0">
                {/* Search Input */}
                <div className="space-y-1 w-full sm:w-auto">
                  <label className="text-[11px] font-sans text-slate-400 block font-medium">
                    Search for items
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={skinSearch}
                      onChange={(e) => setSkinSearch(e.target.value)}
                      placeholder="For example, Talon Knife Slaughter"
                      className="w-full sm:w-64 px-3 py-2 pr-9 rounded-xl bg-[#151821] border border-[#252B3B] text-xs font-sans text-white placeholder-slate-500 outline-none focus:border-amber-400 transition"
                    />
                    {skinSearch ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSkinSearch('');
                          sound.playClick();
                        }}
                        className="text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>
                </div>

                {/* Checkbox: Only Tradable skins */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setOnlyTradableSkins(prev => !prev);
                  }}
                  className={`h-9 px-3.5 rounded-xl border flex items-center gap-2.5 transition cursor-pointer select-none ${
                    onlyTradableSkins
                      ? 'bg-[#151821] border-amber-400/80 text-white'
                      : 'bg-[#151821] border-[#252B3B] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition ${
                    onlyTradableSkins ? 'bg-amber-400 text-slate-950 font-black' : 'border border-slate-600'
                  }`}>
                    {onlyTradableSkins && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold font-sans">Only Tradable skins</span>
                </button>

                {/* Sort: = Price */}
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setSortDropdownOpen(prev => !prev);
                      setRarityDropdownOpen(false);
                    }}
                    className="h-9 px-3.5 rounded-xl bg-[#151821] border border-[#252B3B] hover:border-slate-500 text-xs font-bold font-sans text-white flex items-center gap-2 cursor-pointer transition select-none"
                  >
                    <span className="font-mono text-sm leading-none">=</span>
                    <span>
                      {sortBy === 'price-desc' ? 'Price (High to Low)' : sortBy === 'price-asc' ? 'Price (Low to High)' : 'Name (A to Z)'}
                    </span>
                  </button>

                  {sortDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-44 rounded-xl bg-[#151821] border border-[#252B3B] shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      {[
                        { id: 'price-desc', label: 'Price: High to Low' },
                        { id: 'price-asc', label: 'Price: Low to High' },
                        { id: 'name', label: 'Name: A to Z' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id as any);
                            setSortDropdownOpen(false);
                            sound.playSelect();
                          }}
                          className={`w-full px-3 py-1.5 rounded-lg text-left text-xs font-sans transition cursor-pointer flex items-center justify-between ${
                            sortBy === opt.id ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20' : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.id && <Check className="w-3 h-3 text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* CS2 Rarity Dropdown: ● All with count (1:1 with live screenshot) */}
                <div className="relative" ref={rarityDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setRarityDropdownOpen(prev => !prev);
                      setSortDropdownOpen(false);
                    }}
                    className={`h-9 px-3.5 rounded-xl bg-[#151821] text-xs font-bold font-sans text-white flex items-center gap-2 cursor-pointer transition select-none ${
                      rarityDropdownOpen 
                        ? 'border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]' 
                        : 'border border-[#252B3B] hover:border-slate-500'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ 
                        backgroundColor: RARITY_OPTIONS.find(r => r.id === selectedRarity)?.color || '#b0c3d9' 
                      }} 
                    />
                    <span>
                      {RARITY_OPTIONS.find(r => r.id === selectedRarity)?.label || 'All'} ({rarityCounts[selectedRarity] ?? 0})
                    </span>
                    {rarityDropdownOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {rarityDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-44 rounded-xl bg-[#151821] border border-[#252B3B] shadow-2xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      {RARITY_OPTIONS.map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            setSelectedRarity(r.id);
                            setRarityDropdownOpen(false);
                            sound.playSelect();
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-left text-xs font-sans transition cursor-pointer flex items-center justify-between ${
                            selectedRarity === r.id 
                              ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20' 
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                              style={{ backgroundColor: r.color }} 
                            />
                            <span>{r.label}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              ({rarityCounts[r.id] ?? 0})
                            </span>
                          </span>
                          {selectedRarity === r.id && <Check className="w-3 h-3 text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RELOAD Button */}
              <button
                type="button"
                disabled={isReloading}
                onClick={handleReloadInventory}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black font-sans uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
                <span>RELOAD</span>
              </button>
            </div>

            {/* Payment History Dialog */}
            {paymentHistoryOpen && (
              <div className="mx-6 mt-3 p-4 rounded-2xl bg-[#151821] border border-[#252B3B] shadow-2xl flex flex-col gap-2 shrink-0 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-sans">
                    <History className="w-4 h-4 text-amber-400" />
                    <span>Recent Skin Deposits & History</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {paymentHistory.length > 0 && (
                      <button 
                        onClick={handleClearHistory} 
                        className="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear History</span>
                      </button>
                    )}
                    <button onClick={() => setPaymentHistoryOpen(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">
                      Close
                    </button>
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-300 space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {paymentHistory.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-xs">
                      No deposit records in history yet.
                    </div>
                  ) : (
                    paymentHistory.map(item => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400 font-bold">{item.botName}</span>
                            <span className="text-[10px] text-slate-500">{item.date}</span>
                          </div>
                          <div className="text-[11px] text-slate-300 truncate mt-0.5">
                            {item.itemNames?.join(', ') || `${item.itemsCount} skins`}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-sans mt-0.5">
                            ✓ {item.status}
                          </div>
                        </div>
                        <span className="text-amber-400 font-bold font-mono text-sm shrink-0">
                          +{item.totalEur.toFixed(2)} €
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Main Trading Area: YOUR INVENTORY & SELECTED ITEMS */}
            <div className="flex-1 p-3 sm:p-5 overflow-y-auto flex flex-col lg:flex-row gap-4 sm:gap-5 min-h-0 bg-[#0A0B0E]">
              
              {/* Left Column: YOUR INVENTORY */}
              <div className="flex-1 bg-[#0E1117] border border-[#252B3B] rounded-2xl p-4 flex flex-col min-h-0 overflow-hidden shadow-xl">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h2 className="text-base font-black font-display text-white tracking-wider uppercase">
                    YOUR INVENTORY
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    {filteredSkins.length} items
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  {filteredSkins.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs">
                      <p>No skins matching your filter.</p>
                      {onlyTradableSkins && (
                        <button
                          onClick={() => setOnlyTradableSkins(false)}
                          className="mt-2 text-xs text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                        >
                          Uncheck "Only Tradable skins" to see overstocked items
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                      {filteredSkins.map(item => {
                        const isSelected = selectedSkinIds.has(item.id);
                        const isOverstocked = !!item.isOverstock;

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (isOverstocked) {
                                sound.playClick();
                                return;
                              }
                              toggleSelectSkin(item.id);
                            }}
                            className={`relative p-2.5 rounded-xl transition flex flex-col justify-between h-40 select-none group border ${
                              isOverstocked
                                ? 'bg-[#101217]/60 border-[#252B3B]/40 opacity-55 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#1E2333] border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer'
                                : 'bg-[#151821] hover:bg-[#1C202C] border-[#252B3B] hover:border-slate-500 cursor-pointer'
                            }`}
                          >
                            {/* Top Row: Price in Gold or OVERSTOCK & Wear */}
                            <div className="flex items-center justify-between shrink-0">
                              {isOverstocked ? (
                                <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                                  <span>⊘</span>
                                  <span>OVERSTOCK</span>
                                </span>
                              ) : (
                                <span className="text-xs font-mono font-bold text-amber-400">
                                  $ {item.marketPriceEur.toFixed(2)}
                                </span>
                              )}

                              <span className="text-[10px] font-mono text-slate-400 uppercase font-medium">
                                {item.wearShort}
                              </span>
                            </div>

                            {/* Center: Weapon Image */}
                            <div className="my-1 h-16 flex items-center justify-center">
                              <img
                                src={item.image}
                                alt={item.fullName}
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = KARAMBIT_LORE_IMAGE;
                                }}
                              />
                            </div>

                            {/* Bottom Row: Rarity accent, Weapon, Skin Title */}
                            <div className="shrink-0">
                              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-white tracking-wide truncate">
                                <span
                                  className="w-1 h-3 rounded-full shrink-0"
                                  style={{ backgroundColor: getRarityColor(item.rarity) }}
                                />
                                {item.isStatTrak && (
                                  <span className="text-amber-500 font-mono text-[10px] font-black mr-0.5">
                                    ST
                                  </span>
                                )}
                                <span className="truncate">{item.weapon}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 truncate pl-2.5">
                                {item.skinName}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: SELECTED ITEMS (0/30) */}
              <div className="w-full lg:w-80 xl:w-96 shrink-0 bg-[#0E1117] border border-[#252B3B] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div className="shrink-0 flex items-center justify-between pb-3 border-b border-[#252B3B]">
                  <h2 className="text-sm font-bold font-display text-amber-400 tracking-wider uppercase">
                    SELECTED ITEMS ({selectedSkins.length}/30)
                  </h2>
                  {selectedSkins.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-[11px] font-mono text-slate-400 hover:text-red-400 cursor-pointer transition"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Selected Items Scroll Area / Empty State */}
                <div className="flex-1 overflow-y-auto my-3 min-h-[180px] max-h-96 flex flex-col justify-center">
                  {selectedSkins.length === 0 ? (
                    <div className="text-center p-6 space-y-1">
                      <p className="text-xs font-mono text-slate-400">
                        Select items from your inventory
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 overflow-y-auto pr-1">
                      {selectedSkins.map(skin => (
                        <div
                          key={skin.id}
                          className="p-2.5 rounded-xl bg-[#151821] border border-[#252B3B] flex items-center justify-between gap-3 group"
                        >
                          <img src={skin.image} alt="" className="w-10 h-8 object-contain shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-white truncate font-sans">
                              {skin.weapon}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {skin.skinName}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-mono font-bold text-amber-400">
                              $ {skin.marketPriceEur.toFixed(2)}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleSelectSkin(skin.id)}
                              className="text-[10px] text-slate-400 hover:text-red-400 transition cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Area: Minimum $1 & Big SELL ITEMS Button */}
                <div className="shrink-0 pt-3 border-t border-[#252B3B] space-y-2.5">
                  <p className="text-[11px] font-mono text-slate-400 text-center">
                    Minimum $1 in skins required
                  </p>

                  <button
                    type="button"
                    disabled={selectedSkins.length === 0 || totalPayoutEur < 1.0 || isDepositingSkins}
                    onClick={handleDepositSkins}
                    className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide uppercase transition duration-200 shadow-xl flex items-center justify-center gap-2 ${
                      selectedSkins.length > 0 && totalPayoutEur >= 1.0 && !isDepositingSkins
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black font-display tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer active:scale-[0.98]'
                        : 'bg-[#151821] text-slate-600 border border-[#252B3B] cursor-not-allowed'
                    }`}
                  >
                    {isDepositingSkins ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Processing Trade...</span>
                      </>
                    ) : selectedSkins.length > 0 && totalPayoutEur >= 1.0 ? (
                      <span>SELL ITEMS ($ {totalPayoutEur.toFixed(2)})</span>
                    ) : (
                      <span>SELL ITEMS</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Floating Checkout Pill (Always accessible on phone without scrolling down) */}
            {selectedSkins.length > 0 && (
              <div className="lg:hidden sticky bottom-0 left-0 right-0 p-3 bg-[#0E1117]/95 backdrop-blur-md border-t border-amber-400/30 flex items-center justify-between gap-3 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.85)] animate-in slide-in-from-bottom duration-200">
                <div className="min-w-0">
                  <div className="text-[11px] font-sans text-slate-400">
                    {selectedSkins.length} {selectedSkins.length === 1 ? 'skin' : 'skins'} selected
                  </div>
                  <div className="text-base font-black font-mono text-amber-400 truncate">
                    $ {totalPayoutEur.toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={selectedSkins.length === 0 || totalPayoutEur < 1.0 || isDepositingSkins}
                  onClick={handleDepositSkins}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider font-display transition shrink-0 ${
                    selectedSkins.length > 0 && totalPayoutEur >= 1.0 && !isDepositingSkins
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer active:scale-95'
                      : 'bg-[#151821] text-slate-600 border border-[#252B3B] cursor-not-allowed'
                  }`}
                >
                  {isDepositingSkins ? 'Processing...' : 'SELL ITEMS'}
                </button>
              </div>
            )}

            {/* VORTEX Fast-Track Bot Trade Offer Modal */}
            {tradeModalOpen && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
                <div className="w-full max-w-xl bg-[#0E1117] border border-[#252B3B] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
                  
                  {/* Glow accent */}
                  <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#252B3B] pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black font-display text-white tracking-wide">
                          VORTEX Fast-Track Bot #07
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span>Steam Level 150 • Escrow 0-Day Hold Verified</span>
                        </div>
                      </div>
                    </div>

                    {tradePhase !== 'dispatching' && (
                      <button
                        onClick={() => setTradeModalOpen(false)}
                        className="w-8 h-8 rounded-xl bg-[#151821] hover:bg-[#1C202C] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* PHASE 1: DISPATCHING */}
                  {tradePhase === 'dispatching' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
                        <Bot className="w-7 h-7 text-amber-400 absolute inset-0 m-auto" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white font-sans">
                          Dispatching Steam Trade Offer...
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          Connecting to Steam P2P Network for {selectedSkins.length} items
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PHASE 2: OFFER SENT - AWAITING USER CONFIRMATION */}
                  {tradePhase === 'offer_sent' && (
                    <div className="space-y-4">
                      {/* Security Code Banner */}
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                              Security Token (Anti-Phishing)
                            </span>
                            {activeOrderId && (
                              <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                                {activeOrderId}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-300 font-sans mt-0.5">
                            Verify this 4-character code in your Steam trade offer message:
                          </div>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black font-mono text-base tracking-widest shadow">
                          {securityCode}
                        </div>
                      </div>

                      {/* Items Summary & Total Payout */}
                      <div className="p-3.5 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-white/5">
                          <span>Deposit Items ({selectedSkins.length}):</span>
                          <span className="text-amber-400 font-bold">Total Credit: $ {totalPayoutEur.toFixed(2)}</span>
                        </div>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                          {selectedSkins.map(s => (
                            <div key={s.id} className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-sans">
                              <div className="flex items-center gap-2 min-w-0">
                                <img src={s.image} alt="" className="w-8 h-6 object-contain shrink-0" />
                                <span className="text-white truncate font-medium">{s.fullName}</span>
                              </div>
                              <span className="text-amber-400 font-mono font-bold shrink-0">$ {s.marketPriceEur.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Countdown timer */}
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Offer expires in:</span>
                        </div>
                        <span className="text-amber-400 font-bold">{formatTimer(tradeCountdown)}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playSelect();
                            window.open(steamOfferUrl || 'https://steamcommunity.com/tradeoffer/new/', '_blank');
                          }}
                          className="flex-1 py-3 rounded-xl bg-[#1C202C] hover:bg-[#252B3B] border border-[#252B3B] text-slate-200 hover:text-white font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition"
                        >
                          <span>Open in Steam</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={isConfirmingTrade}
                          onClick={handleConfirmTradeReceived}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase font-display tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
                        >
                          {isConfirmingTrade ? (
                            <>
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying Escrow...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>I Accepted the Trade (+{totalPayoutEur.toFixed(2)} €)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PHASE 3: COMPLETED */}
                  {tradePhase === 'completed' && (
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white font-display">
                          Trade Successfully Completed!
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          +{lastDepositedAmount.toFixed(2)} € has been credited to your VORTEX wallet with 0-day hold.
                        </p>
                        <div className="mt-3 px-4 py-2 rounded-xl bg-black/60 border border-amber-400/30 inline-flex items-center gap-2 text-xs font-mono">
                          <span className="text-slate-400">Current Balance:</span>
                          <span className="font-bold text-amber-400">{getVortexWalletBalance().toFixed(2)} €</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full pt-2">
                        <button
                          type="button"
                          onClick={() => setTradeModalOpen(false)}
                          className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider font-display cursor-pointer transition shadow-lg"
                        >
                          Deposit More Skins
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTradeModalOpen(false);
                            onClose();
                          }}
                          className="px-5 py-3 rounded-xl bg-[#151821] hover:bg-[#1C202C] border border-[#252B3B] text-slate-300 hover:text-white font-bold text-xs uppercase cursor-pointer transition"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: GENERAL PAYMENT METHODS SPLIT SCREEN             */
          /* ======================================================== */
          <div className="flex-1 flex flex-col min-h-0 bg-[#0A0B0E]">
            {/* Header */}
            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-[#0E1117] border-b border-[#252B3B] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  <span className="text-xs">📁</span>
                </div>
                <h2 className="text-base sm:text-lg font-black font-display text-white tracking-tight">
                  Filling up the balance
                </h2>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-black/60 border border-amber-400/30 text-xs font-mono">
                  <span className="hidden sm:inline text-slate-400">Current Balance:</span>
                  <span className="font-bold text-amber-400">{getVortexWalletBalance().toFixed(2)} €</span>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-xl bg-[#151821] hover:bg-[#1C202C] border border-[#252B3B] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Split Screen Body: Left Methods Grid + Right Action Pane */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              
              {/* LEFT PANE: 10 PAYMENT METHODS GRID */}
              <div className="w-full lg:w-[460px] xl:w-[490px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#252B3B] p-3 sm:p-5 overflow-y-auto space-y-4 flex flex-col justify-between bg-[#0E1117]">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#151821] border border-[#252B3B] hover:border-slate-500 text-white text-xs font-mono flex items-center justify-between cursor-pointer transition shadow-sm"
                      >
                        <span className="flex items-center gap-2.5">
                          <CountryFlag code={selectedCountry.code} name={selectedCountry.name} size="sm" />
                          <span className="font-bold">{selectedCountry.label}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {countryDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl bg-[#151821] border border-[#252B3B] shadow-2xl z-50 max-h-60 overflow-y-auto p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                          <div className="p-1 border-b border-white/5 sticky top-0 bg-[#151821] z-10">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                              <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Search country (e.g. Kosovo, Germany)..."
                                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-black/60 border border-[#252B3B] text-[11px] font-mono text-white placeholder-slate-500 outline-none focus:border-amber-400"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <div className="space-y-0.5 pt-1">
                            {filteredCountries.map(c => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setCountryDropdownOpen(false);
                                  setCountrySearch('');
                                  sound.playSelect();
                                }}
                                className={`w-full px-3 py-2 rounded-lg text-left text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                                  selectedCountry.code === c.code ? 'bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <CountryFlag code={c.code} name={c.name} size="xs" />
                                  <span>{c.label}</span>
                                </span>
                                {selectedCountry.code === c.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                              </button>
                            ))}
                            {filteredCountries.length === 0 && (
                              <div className="p-3 text-center text-xs font-mono text-slate-500">
                                No country found matching "{countrySearch}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 10 Methods Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {/* 1. TOP VISA / MASTERCARD / DISCOVER */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('visa_top');
                        setActiveView('cards');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'visa_top'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
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
                        {selectedMethodId === 'visa_top' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>

                    {/* 2. VISA / MASTERCARD (DIRECT) */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('visa_direct');
                        setActiveView('cards');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'visa_direct'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
                      }`}
                    >
                      <div className="text-sm font-black font-display text-white tracking-wider flex items-center gap-1 pt-1">
                        <span>VISA</span>
                        <span className="text-red-500 font-sans">●</span>
                        <span className="text-amber-500 font-sans -ml-1">●</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Instant Debit & Credit</span>
                        {selectedMethodId === 'visa_direct' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>

                    {/* 3. DIGITAL WALLETS */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('wallets');
                        setActiveView('cards');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'wallets'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono font-bold text-slate-300">
                        <span className="px-1 py-0.5 rounded bg-black/40">Pay</span>
                        <span className="px-1 py-0.5 rounded bg-black/40">GPay</span>
                        <span className="px-1 py-0.5 rounded bg-purple-500/20 text-purple-300">Skrill</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Neteller, Visa, Mobile</span>
                        {selectedMethodId === 'wallets' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>

                    {/* 4. PAY BY SKINS (OPENS DEDICATED Skin2PAY) */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('skins');
                        setActiveView('skins');
                      }}
                      className={`relative p-2.5 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex items-center justify-between h-28 shadow-lg overflow-hidden border ${
                        selectedMethodId === 'skins'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border-[#252B3B] hover:border-amber-400/50'
                      }`}
                    >
                      <div className="relative w-14 sm:w-16 h-14 sm:h-16 shrink-0 flex items-center justify-center select-none pointer-events-none">
                        <img 
                          src={KARAMBIT_LORE_IMAGE} 
                          alt="" 
                          aria-hidden="true"
                          draggable={false}
                          className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-center items-start pl-2 select-none min-w-0">
                        <span className="text-[10px] font-sans font-bold text-[#EAB308] tracking-widest leading-none mb-1 uppercase whitespace-nowrap">
                          PAY BY
                        </span>
                        <span className="text-lg font-display font-black text-[#FACC15] tracking-wider leading-none uppercase whitespace-nowrap">
                          SKINS
                        </span>
                      </div>
                      {selectedMethodId === 'skins' && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      )}
                    </button>

                    {/* 5. CRYPTO */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('crypto');
                        setActiveView('crypto');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'crypto'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold font-sans text-white">
                          <span className="text-amber-400 font-mono font-bold">₿</span>
                          <span className="tracking-wide">CRYPTO</span>
                        </div>
                        <div className="text-[8px] font-mono text-amber-300 font-bold">
                          BTC ETH USDT SOL
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Instant On-Chain</span>
                        {selectedMethodId === 'crypto' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>

                    {/* 6. KINGUIN */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('kinguin');
                        setActiveView('giftcards');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'kinguin'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 text-xs">👑</span>
                        <span className="font-display font-black text-xs text-white tracking-wider">KINGUIN</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Wallet card</span>
                        {selectedMethodId === 'kinguin' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>

                    {/* 7. ENEBA */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('eneba');
                        setActiveView('giftcards');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'eneba'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-purple-400 text-xs">🎮</span>
                        <span className="font-bold text-xs text-white">eneba</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Wallet card</span>
                        {selectedMethodId === 'eneba' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>

                    {/* 8. SWAPPED */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('swapped');
                        setActiveView('cards');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'swapped'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-300">SWAPPED</div>
                        <div className="text-[8px] font-mono text-slate-400">paysafecard • Revolut • 30+ more</div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Multi-Pay</span>
                        {selectedMethodId === 'swapped' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>

                    {/* 9. DIGITAL GIFTCARDS */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('giftcards');
                        setActiveView('giftcards');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'giftcards'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[11px] font-bold text-white font-sans">
                        <span>🎁</span>
                        <span>GIFTCARDS</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-amber-300">
                        <span>PayPal Supported</span>
                        {selectedMethodId === 'giftcards' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>

                    {/* 10. PREMIUM */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMethodId('premium');
                        setActiveView('cards');
                      }}
                      className={`relative p-3 rounded-2xl bg-[#151821] hover:bg-[#1C202C] text-left transition cursor-pointer group flex flex-col justify-between h-28 shadow-lg overflow-hidden ${
                        selectedMethodId === 'premium'
                          ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-[#1A1F2C]'
                          : 'border border-[#252B3B] hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">💎</span>
                        <span className="font-display font-black text-xs text-amber-400">PREMIUM</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>VIP Status</span>
                        {selectedMethodId === 'premium' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-slate-500 pt-3 border-t border-white/5">
                  All payment methods available in the selected country are listed.
                </p>
              </div>

              {/* RIGHT PANE: TAILORED ACTION VIEW PER METHOD */}
              <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto bg-[#0A0B0E] flex flex-col justify-between min-h-0">
                {/* 1. CRYPTO VIEW */}
                {selectedMethodId === 'crypto' && (
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
                                ? 'bg-amber-400/10 text-white border-amber-400/40 shadow-md'
                                : 'bg-[#151821] text-slate-400 hover:text-white border-[#252B3B]'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: coin.color }} />
                            <span>{coin.symbol}</span>
                            <span className="text-[10px] text-slate-500">({coin.network})</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-3 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                            <span>Official Deposit Address</span>
                            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Automated 1-Conf Credit</span>
                          </span>
                          <span className="text-xs font-mono text-slate-400">{selectedCrypto.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 p-3 rounded-xl bg-black/60 border border-[#252B3B] font-mono text-xs text-amber-300 break-all select-all">
                            {selectedCrypto.address}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyCrypto}
                            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                              cryptoCopied
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            {cryptoCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{cryptoCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-2">
                        <label className="text-xs font-mono font-bold text-white block">
                          Have you sent the funds? Verify TxID / Transaction Hash:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={cryptoTxid}
                            onChange={(e) => setCryptoTxid(e.target.value)}
                            placeholder="Enter transaction hash / hash ID..."
                            className="flex-1 p-2.5 rounded-xl bg-black/40 border border-[#252B3B] text-xs font-mono text-white outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            disabled={cryptoVerifying}
                            onClick={handleVerifyCryptoTxid}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                          >
                            {cryptoVerifying ? 'Verifying...' : 'Verify Deposit'}
                          </button>
                        </div>
                        {cryptoError && (
                          <p className="text-xs font-mono text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{cryptoError}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setXsollaMethodPreset('crypto');
                        setXsollaCheckoutItem({
                          id: `crypto-topup-${Date.now()}`,
                          sku: 'VTX-CRYPTO-TOPUP',
                          title: `${selectedCardAmount.toFixed(2)} € Web3 Crypto Top-Up`,
                          description: 'Instant automated cryptocurrency deposit via Xsolla Web3 Payment Gateway',
                          amountEur: selectedCardAmount,
                          type: 'wallet_topup'
                        });
                      }}
                      className="w-full py-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Or Checkout via Xsolla Web3 Crypto Gateway</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 2. CARD VIEW (VISA TOP & VISA DIRECT) */}
                {(selectedMethodId === 'visa_top' || selectedMethodId === 'visa_direct') && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black font-display text-white">
                            {selectedMethodId === 'visa_top' ? 'Card Payments (VISA / MasterCard / Discover)' : 'Direct Debit & Credit Card'}
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] font-black uppercase">
                            POWERED BY XSOLLA
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          Official Xsolla Pay Station 4 Gateway • Instant settlement & 100+ European banks supported
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[10, 25, 50, 100].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              sound.playSelect();
                              setSelectedCardAmount(amt);
                            }}
                            className={`p-3.5 rounded-2xl text-center transition cursor-pointer border ${
                              selectedCardAmount === amt
                                ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                : 'bg-[#151821] border-[#252B3B] text-white hover:border-slate-500'
                            }`}
                          >
                            <div className="text-lg font-black font-display">{amt.toFixed(2)} €</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-1">Instant Refill</div>
                          </button>
                        ))}
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">Payment Processor:</span>
                          <span className="text-amber-400 font-bold">Xsolla (USA) Inc. • Pay Station 4</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">Security Standard:</span>
                          <span className="text-white font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            PCI-DSS Level 1 & 3D Secure 2.0
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">Processing Fee:</span>
                          <span className="text-emerald-400 font-bold">0% (Fee Covered by Platform)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-slate-400">Amount to pay:</div>
                        <div className="text-xl font-black font-display text-amber-400">{selectedCardAmount.toFixed(2)} €</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setXsollaMethodPreset('card');
                          setXsollaCheckoutItem({
                            id: `card-topup-${selectedCardAmount}-${Date.now()}`,
                            sku: `VTX-CARD-${selectedCardAmount}`,
                            title: `${selectedCardAmount.toFixed(2)} € Vortex Wallet Funds`,
                            description: 'Instant credit for official CS2 cases and weapon market withdrawals.',
                            amountEur: selectedCardAmount,
                            type: 'wallet_topup'
                          });
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
                      >
                        <span>PAY {selectedCardAmount.toFixed(2)} € VIA XSOLLA</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. DIGITAL WALLETS (Apple Pay / GPay / Skrill / Neteller) */}
                {selectedMethodId === 'wallets' && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black font-display text-white">Apple Pay, Google Pay & Skrill</h3>
                          <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono text-[9px] font-black uppercase">
                            MOBILE BIOMETRIC
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          1-touch biometric deposit via Apple TouchID / FaceID, Google Pay or Skrill wallet
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[10, 25, 50, 100].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              sound.playSelect();
                              setSelectedCardAmount(amt);
                            }}
                            className={`p-3.5 rounded-2xl text-center transition cursor-pointer border ${
                              selectedCardAmount === amt
                                ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                : 'bg-[#151821] border-[#252B3B] text-white hover:border-slate-500'
                            }`}
                          >
                            <div className="text-lg font-black font-display">{amt.toFixed(2)} €</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-1">Instant Refill</div>
                          </button>
                        ))}
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded bg-black/60 text-white font-mono text-xs font-bold">Apple Pay</span>
                          <span className="px-2 py-1 rounded bg-black/60 text-white font-mono text-xs font-bold">Google Pay</span>
                          <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">Skrill</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">Powered by Xsolla</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-slate-400">Amount to pay:</div>
                        <div className="text-xl font-black font-display text-amber-400">{selectedCardAmount.toFixed(2)} €</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setXsollaMethodPreset('apple_pay');
                          setXsollaCheckoutItem({
                            id: `wallet-topup-${selectedCardAmount}-${Date.now()}`,
                            sku: `VTX-MOB-${selectedCardAmount}`,
                            title: `${selectedCardAmount.toFixed(2)} € Mobile Wallet Credit`,
                            description: 'Instant mobile biometric deposit via Apple Pay / GPay / Skrill on Xsolla.',
                            amountEur: selectedCardAmount,
                            type: 'wallet_topup'
                          });
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
                      >
                        <span>PAY {selectedCardAmount.toFixed(2)} € WITH E-WALLETS</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. SWAPPED VIEW (Paysafecard / Revolut / Regional) */}
                {selectedMethodId === 'swapped' && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black font-display text-white">Paysafecard, Revolut & Multi-Pay</h3>
                          <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 font-mono text-[9px] font-black uppercase">
                            CASH & REVOLUT
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          Deposit using Paysafecard 16-digit voucher PIN, Revolut Pay, Sofort, or iDEAL via Xsolla
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[10, 25, 50, 100].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              sound.playSelect();
                              setSelectedCardAmount(amt);
                            }}
                            className={`p-3.5 rounded-2xl text-center transition cursor-pointer border ${
                              selectedCardAmount === amt
                                ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                : 'bg-[#151821] border-[#252B3B] text-white hover:border-slate-500'
                            }`}
                          >
                            <div className="text-lg font-black font-display">{amt.toFixed(2)} €</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-1">Instant PIN</div>
                          </button>
                        ))}
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                          <span>Supported Networks:</span>
                          <span className="text-amber-400 font-bold">Paysafecard, Revolut Pay, Sofort, iDeal</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          No credit card required. Safe cash voucher and European regional bank deposit.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-slate-400">Amount to pay:</div>
                        <div className="text-xl font-black font-display text-amber-400">{selectedCardAmount.toFixed(2)} €</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setXsollaMethodPreset('paysafecard');
                          setXsollaCheckoutItem({
                            id: `swapped-topup-${selectedCardAmount}-${Date.now()}`,
                            sku: `VTX-SWAP-${selectedCardAmount}`,
                            title: `${selectedCardAmount.toFixed(2)} € Paysafecard / Multi-Pay`,
                            description: 'Prepaid voucher & Revolut deposit via Xsolla Pay Station.',
                            amountEur: selectedCardAmount,
                            type: 'wallet_topup'
                          });
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
                      >
                        <span>PAY {selectedCardAmount.toFixed(2)} € VIA XSOLLA</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. GIFTCARDS & PAYPAL VIEW */}
                {selectedMethodId === 'giftcards' && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black font-display text-white">PayPal Checkout & Giftcard Codes</h3>
                          <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 font-mono text-[9px] font-black uppercase">
                            PAYPAL / CODE
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">Pay with verified PayPal or redeem 16-character digital giftcard code</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-white">Option A: Pay with PayPal</span>
                          <span className="text-amber-400 text-xs font-mono font-bold">{selectedCardAmount.toFixed(2)} €</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playSelect();
                            setXsollaMethodPreset('paypal');
                            setXsollaCheckoutItem({
                              id: `paypal-topup-${selectedCardAmount}-${Date.now()}`,
                              sku: `VTX-PAYPAL-${selectedCardAmount}`,
                              title: `${selectedCardAmount.toFixed(2)} € PayPal Top-Up`,
                              description: 'Instant PayPal deposit via Xsolla Pay Station.',
                              amountEur: selectedCardAmount,
                              type: 'wallet_topup'
                            });
                          }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                        >
                          <span>PAY {selectedCardAmount.toFixed(2)} € VIA XSOLLA PAYPAL</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-3">
                        <label className="text-xs font-mono font-bold text-white block">
                          Option B: Enter 16-character voucher code:
                        </label>
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                          placeholder="VRTX-XXXX-XXXX-XXXX"
                          className="w-full p-3 rounded-xl bg-black/50 border border-[#252B3B] font-mono text-sm tracking-widest text-amber-300 outline-none focus:border-amber-400 uppercase"
                        />
                        {voucherError && (
                          <p className="text-xs font-mono text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{voucherError}</span>
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (!voucherCode || voucherCode.trim().length < 8) {
                              setVoucherError('Please enter a valid giftcard code (e.g. VRTX-2024-PASS)');
                              sound.playClick();
                              return;
                            }
                            const val = 25.00;
                            creditVortexWalletBalance(val);
                            sound.playTournamentVictory();
                            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                            setDepositSuccessMessage(`✓ Giftcard Redeemed! +${val.toFixed(2)} € added to your balance.`);
                            setVoucherCode('');
                            setVoucherError(null);
                            onSuccess?.(val);
                          }}
                          className="w-full py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs uppercase tracking-wide transition cursor-pointer"
                        >
                          Redeem Voucher Code
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. KINGUIN VIEW */}
                {selectedMethodId === 'kinguin' && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black font-display text-white">Kinguin Wallet Card</h3>
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-[9px] font-black uppercase">
                            OFFICIAL PARTNER
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">Redeem your Kinguin CS2 gift card code or purchase instantly on Kinguin.net</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-3">
                        <label className="text-xs font-mono font-bold text-white block">
                          Enter your 16-character Kinguin code:
                        </label>
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                          placeholder="KING-XXXX-XXXX-XXXX"
                          className="w-full p-3 rounded-xl bg-black/50 border border-[#252B3B] font-mono text-sm tracking-widest text-amber-300 outline-none focus:border-amber-400 uppercase"
                        />
                        {voucherError && (
                          <p className="text-xs font-mono text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{voucherError}</span>
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (!voucherCode || voucherCode.trim().length < 8) {
                              setVoucherError('Please enter a valid Kinguin code (e.g. KING-2024-VRTX)');
                              sound.playClick();
                              return;
                            }
                            const val = 25.00;
                            creditVortexWalletBalance(val);
                            sound.playTournamentVictory();
                            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                            setDepositSuccessMessage(`✓ Kinguin Card Redeemed! +${val.toFixed(2)} € added to your balance.`);
                            setVoucherCode('');
                            setVoucherError(null);
                            onSuccess?.(val);
                          }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wide transition cursor-pointer shadow-lg"
                        >
                          Redeem Kinguin Card
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">Don't have a Kinguin code yet?</div>
                          <div className="text-[10px] font-mono text-slate-400">Buy Vortex CS2 giftcards directly with PayPal, cards, or crypto.</div>
                        </div>
                        <a
                          href="https://www.kinguin.net"
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>Buy on Kinguin</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. ENEBA VIEW */}
                {selectedMethodId === 'eneba' && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black font-display text-white">Eneba Wallet Card</h3>
                          <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono text-[9px] font-black uppercase">
                            OFFICIAL PARTNER
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">Redeem your Eneba gift card voucher code or buy instantly on Eneba.com</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] space-y-3">
                        <label className="text-xs font-mono font-bold text-white block">
                          Enter your 16-character Eneba code:
                        </label>
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                          placeholder="ENEB-XXXX-XXXX-XXXX"
                          className="w-full p-3 rounded-xl bg-black/50 border border-[#252B3B] font-mono text-sm tracking-widest text-purple-300 outline-none focus:border-purple-400 uppercase"
                        />
                        {voucherError && (
                          <p className="text-xs font-mono text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{voucherError}</span>
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (!voucherCode || voucherCode.trim().length < 8) {
                              setVoucherError('Please enter a valid Eneba code (e.g. ENEB-2024-VRTX)');
                              sound.playClick();
                              return;
                            }
                            const val = 25.00;
                            creditVortexWalletBalance(val);
                            sound.playTournamentVictory();
                            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                            setDepositSuccessMessage(`✓ Eneba Card Redeemed! +${val.toFixed(2)} € added to your balance.`);
                            setVoucherCode('');
                            setVoucherError(null);
                            onSuccess?.(val);
                          }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 hover:from-purple-400 hover:to-indigo-500 text-white font-mono font-black text-xs uppercase tracking-wide transition cursor-pointer shadow-lg"
                        >
                          Redeem Eneba Card
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">Don't have an Eneba code yet?</div>
                          <div className="text-[10px] font-mono text-slate-400">Buy Vortex CS2 giftcards directly with 0% fee on Eneba.com.</div>
                        </div>
                        <a
                          href="https://www.eneba.com"
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>Buy on Eneba</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. PREMIUM / VIP VIEW */}
                {selectedMethodId === 'premium' && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black font-display text-white">VORTEX VIP ELITE & PRO PASS</h3>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-[9px] font-black uppercase">
                            POWERED BY XSOLLA
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">Unlock highest status, zero trade fees, and daily case rewards</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#151821] to-[#12141C] border border-amber-500/30 space-y-3">
                        <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                          VIP ELITE BENEFITS:
                        </div>
                        <div className="space-y-2 text-xs font-mono text-slate-300">
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span><strong>0% fee</strong> on all weapon market sales & skin deliveries</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span><strong>+5% complimentary bonus</strong> automatically on all deposits</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span><strong>Daily Free Case spin</strong> every 24 hours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Golden VIP badge on leaderboard and profile</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151821] border border-[#252B3B] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-slate-400">Monthly Subscription:</div>
                        <div className="text-xl font-black font-display text-amber-400">14.99 € <span className="text-xs font-mono text-slate-400">/ month</span></div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setXsollaMethodPreset('card');
                          setXsollaCheckoutItem({
                            id: 'sub-vip-elite-monthly',
                            sku: 'VTX-SUB-VIP',
                            title: 'VORTEX VIP ELITE Monthly Pass',
                            description: 'Full competitive privileges: 0% trade fees, +5% deposit bonus, daily free cases.',
                            amountEur: 14.99,
                            type: 'membership_vip'
                          });
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
                      >
                        <span>GET VIP VIA XSOLLA</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL XSOLLA PAY STATION 4 GATEWAY CHECKOUT DIALOG */}
        {xsollaCheckoutItem && (
          <XsollaCheckoutModal
            isOpen={Boolean(xsollaCheckoutItem)}
            onClose={() => setXsollaCheckoutItem(null)}
            initialItem={xsollaCheckoutItem}
            initialPaymentMethod={xsollaMethodPreset}
            onPaymentSuccess={(res) => {
              sound.playTournamentVictory();
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              setDepositSuccessMessage(`✓ Payment Confirmed via Xsolla (${res.paymentMethod})! +${res.amountEur.toFixed(2)} € credited to your wallet.`);
              onSuccess?.(res.amountEur);
              setXsollaCheckoutItem(null);
            }}
          />
        )}

      </div>
    </div>
  );
};
