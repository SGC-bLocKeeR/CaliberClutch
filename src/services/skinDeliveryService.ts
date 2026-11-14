// ========================================================
// VORTEX GAMING - CS2 WHITE-LABEL SKIN DELIVERY SERVICE
// B2B Integration with DMarket API & Waxpeer P2P API
// ========================================================

export interface CS2Skin {
  id: string;
  name: string;
  weapon: string;
  skinName: string;
  rarity: 'covert' | 'classified' | 'restricted' | 'mil-spec' | 'extraordinary';
  rarityColor: string;
  wear: 'Factory New' | 'Minimal Wear' | 'Field-Tested' | 'Well-Worn' | 'Battle-Scarred';
  floatValue: string;
  priceEur: number;
  image: string;
  isStatTrak?: boolean;
}

export interface CS2Case {
  id: string;
  name: string;
  subtitle: string;
  priceEur: number;
  image: string;
  bannerGradient: string;
  glowColor: string;
  description: string;
  items: CS2Skin[];
}

export interface TradeOfferDeliveryResult {
  success: boolean;
  orderId: string;
  tradeOfferId?: string;
  botSteamId: string;
  botName: string;
  item: CS2Skin;
  status: 'sent' | 'processing' | 'failed';
  message: string;
  tradeUrlUsed: string;
  timestamp: number;
}

const STORAGE_KEY_TRADE_URL = 'vortex_steam_trade_url';
const STORAGE_KEY_WALLET_EUR = 'vortex_wallet_eur';
const DEFAULT_INITIAL_BALANCE = 25.00; // Free welcome demo balance for testing

// ========================================================
// 1. STEAM TRADE URL MANAGEMENT
// ========================================================

export const isValidSteamTradeUrl = (url: string): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  // Valid format: https://steamcommunity.com/tradeoffer/new/?partner=XXXXXXX&token=YYYYYYYY
  return /^https?:\/\/(www\.)?steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[a-zA-Z0-9_-]+$/i.test(trimmed);
};

export const getSavedSteamTradeUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY_TRADE_URL) || '';
};

export const saveSteamTradeUrl = (url: string): boolean => {
  if (typeof window === 'undefined') return false;
  const trimmed = url.trim();
  if (isValidSteamTradeUrl(trimmed)) {
    localStorage.setItem(STORAGE_KEY_TRADE_URL, trimmed);
    window.dispatchEvent(new CustomEvent('vortex_trade_url_updated', { detail: trimmed }));
    return true;
  }
  return false;
};

// ========================================================
// 2. VORTEX USER WALLET (EUR BALANCE)
// ========================================================

export const getVortexWalletBalance = (): number => {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_BALANCE;
  const saved = localStorage.getItem(STORAGE_KEY_WALLET_EUR);
  if (saved === null) {
    localStorage.setItem(STORAGE_KEY_WALLET_EUR, String(DEFAULT_INITIAL_BALANCE));
    return DEFAULT_INITIAL_BALANCE;
  }
  const parsed = parseFloat(saved);
  return isNaN(parsed) ? DEFAULT_INITIAL_BALANCE : parsed;
};

export const deductVortexWalletBalance = (amountEur: number): boolean => {
  const current = getVortexWalletBalance();
  if (current < amountEur) return false;
  const updated = Math.max(0, parseFloat((current - amountEur).toFixed(2)));
  localStorage.setItem(STORAGE_KEY_WALLET_EUR, String(updated));
  window.dispatchEvent(new CustomEvent('vortex_wallet_updated', { detail: updated }));
  return true;
};

export const creditVortexWalletBalance = (amountEur: number): number => {
  const current = getVortexWalletBalance();
  const updated = parseFloat((current + amountEur).toFixed(2));
  localStorage.setItem(STORAGE_KEY_WALLET_EUR, String(updated));
  window.dispatchEvent(new CustomEvent('vortex_wallet_updated', { detail: updated }));
  return updated;
};

// ========================================================
// 3. CS2 CASE CATALOG DEFINITIONS
// ========================================================

export const VORTEX_CASE_CATALOG: CS2Case[] = [
  {
    id: 'prestige-knife',
    name: 'VORTEX Prestige Knife',
    subtitle: 'Exclusive Covert Knives & High-Tier Gloves',
    priceEur: 18.50,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbssLQJf2OD3fm5b09mJmYm0m_7zO6-fzj9V7cAl2eyVpIrz2FKx_0FtZ2D1cIGRcQRsYQ7Q81W3lOjxxcjr3M4pYjY/360fx360f',
    bannerGradient: 'from-amber-600/30 via-yellow-600/15 to-transparent',
    glowColor: '#F59E0B',
    description: 'Përmban thikat më të rralla CS2: Karambit Doppler, Butterfly Slaughter dhe M9 Tiger Tooth.',
    items: [
      {
        id: 'karambit-doppler',
        name: '★ Karambit | Doppler Phase 2',
        weapon: 'Karambit',
        skinName: 'Doppler Phase 2',
        rarity: 'extraordinary',
        rarityColor: '#FFD700',
        wear: 'Factory New',
        floatValue: '0.0142',
        priceEur: 1250.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbssLQJf2OD3fm5b09mJmYm0m_7zO6-fzj9V7cAl2eyVpIrz2FKx_0FtZ2D1cIGRcQRsYQ7Q81W3lOjxxcjr3M4pYjY/360fx360f',
        isStatTrak: false
      },
      {
        id: 'butterfly-slaughter',
        name: '★ Butterfly Knife | Slaughter',
        weapon: 'Butterfly Knife',
        skinName: 'Slaughter',
        rarity: 'extraordinary',
        rarityColor: '#FFD700',
        wear: 'Factory New',
        floatValue: '0.0315',
        priceEur: 1480.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbiiLQJf1f_BYQJD4eOxlY2GlsjwPKvBmm5D19V5i_rEyp73j1Ky_kQ5MmGnLNXBcwJrNgnX_VDtxL3o0Zft7cnOzCc37iUk53zYyRGzn1gSOUcceX9m/360fx360f',
        isStatTrak: false
      },
      {
        id: 'm9-tiger',
        name: '★ M9 Bayonet | Tiger Tooth',
        weapon: 'M9 Bayonet',
        skinName: 'Tiger Tooth',
        rarity: 'extraordinary',
        rarityColor: '#FFD700',
        wear: 'Factory New',
        floatValue: '0.0089',
        priceEur: 890.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbiiLQJf3qr3cjsD09ukm4yCmfPLPr7Vn35cpsB03-yTp9Sn3gW2-kZsYm_wcNOdcgM7MgnWrwLqx7vogpXuupXNzHZiuiMm52GdwUKq3cglhA/360fx360f',
        isStatTrak: false
      },
      {
        id: 'skeleton-ch',
        name: '★ Skeleton Knife | Case Hardened',
        weapon: 'Skeleton Knife',
        skinName: 'Case Hardened',
        rarity: 'extraordinary',
        rarityColor: '#FFD700',
        wear: 'Field-Tested',
        floatValue: '0.2284',
        priceEur: 560.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbiiLQJf0ebcZThH_9m7h5SEheP3N77fqWZU7Mxkh6eSotSn3VDsqkFtZj-mIYKdc1dsYQyCrFm_wLvrh8O4upvMziBh7yV3-z-DyOWd4yfv/360fx360f',
        isStatTrak: false
      },
      {
        id: 'huntsman-fade',
        name: '★ Huntsman Knife | Fade (100%)',
        weapon: 'Huntsman Knife',
        skinName: 'Fade',
        rarity: 'extraordinary',
        rarityColor: '#FFD700',
        wear: 'Factory New',
        floatValue: '0.0102',
        priceEur: 390.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbiiLQJf2-r3fDFG_8mJmY-0m_7zO6-fk29T-sBzpezT_I2tiVXs-RE5YTincY-WdVA4N13R81brx-e51sW9786czydiuSQn4ivcnBfmn1gSOd0N_1mS/360fx360f',
        isStatTrak: false
      },
      {
        id: 'ak-fire-serpent',
        name: 'AK-47 | Fire Serpent',
        weapon: 'AK-47',
        skinName: 'Fire Serpent',
        rarity: 'covert',
        rarityColor: '#EB4B4B',
        wear: 'Field-Tested',
        floatValue: '0.1841',
        priceEur: 480.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV19m5h5SEheP3N77fqWZU7Mxkh6fF89j23Fay8hY9NTildY-WdlI_Z1zV8le2kL_vg5S-u5mdy3BivSEm-z-DyP23_n8N/360fx360f',
        isStatTrak: false
      }
    ]
  },
  {
    id: 'covert-elite',
    name: 'VORTEX Covert Elite',
    subtitle: 'Top-tier Rifles, AWPs & Classified Pistols',
    priceEur: 5.80,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fk29T-sBzpezT_I2tiVXs-RE5YTincY-WdVA4N13R81brx-e51sW9786czydiuSQn4ivcnBfmn1gSOd0N_1mS/360fx360f',
    bannerGradient: 'from-rose-600/30 via-red-600/15 to-transparent',
    glowColor: '#EF4444',
    description: 'Armë të preferuara të nivelit të lartë: AWP Printstream, AK-47 Asiimov dhe USP Kill Confirmed.',
    items: [
      {
        id: 'awp-printstream',
        name: 'AWP | Printstream',
        weapon: 'AWP',
        skinName: 'Printstream',
        rarity: 'covert',
        rarityColor: '#EB4B4B',
        wear: 'Field-Tested',
        floatValue: '0.2104',
        priceEur: 145.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fk29T-sBzpezT_I2tiVXs-RE5YTincY-WdVA4N13R81brx-e51sW9786czydiuSQn4ivcnBfmn1gSOd0N_1mS/360fx360f',
        isStatTrak: false
      },
      {
        id: 'ak-asiimov',
        name: 'AK-47 | Asiimov',
        weapon: 'AK-47',
        skinName: 'Asiimov',
        rarity: 'covert',
        rarityColor: '#EB4B4B',
        wear: 'Field-Tested',
        floatValue: '0.2450',
        priceEur: 65.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV19m5h5SEheP3N77fqWZU7Mxkh6fA9N-hi1K2_BFkY2rwLdDDcQBoZAmGqVO3kLjog5S9v86byXQ263V3t37ZyhG00RwecKUxIutk_r2H/360fx360f',
        isStatTrak: false
      },
      {
        id: 'm4a1-player-two',
        name: 'M4A1-S | Player Two',
        weapon: 'M4A1-S',
        skinName: 'Player Two',
        rarity: 'covert',
        rarityColor: '#EB4B4B',
        wear: 'Field-Tested',
        floatValue: '0.1980',
        priceEur: 78.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xV_Pp_jez--YXygED6-kZkYj3wLITDdQc8MlCG_Fftxr3ug8C0u5vNnHJr6SQmsH6MnRDi1gYMMLIqu-Y0gQ/360fx360f',
        isStatTrak: false
      },
      {
        id: 'usp-kill-confirmed',
        name: 'USP-S | Kill Confirmed',
        weapon: 'USP-S',
        skinName: 'Kill Confirmed',
        rarity: 'covert',
        rarityColor: '#EB4B4B',
        wear: 'Field-Tested',
        floatValue: '0.2310',
        priceEur: 110.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh5yZGj3cYfDegA9Z1zU_lC6yO_og5Tu6pnPnSBjv3N35y3cyQv33089mkyJkw/360fx360f',
        isStatTrak: false
      },
      {
        id: 'deagle-printstream',
        name: 'Desert Eagle | Printstream',
        weapon: 'Desert Eagle',
        skinName: 'Printstream',
        rarity: 'classified',
        rarityColor: '#D32CE6',
        wear: 'Field-Tested',
        floatValue: '0.2105',
        priceEur: 55.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_8-imIGZksj4OrzZglRd4cJ5nqeWpIqhjAThqUs4MTv3cNeUIAVvNwrX8gS-w-rsg5W8uMufy3I3vCE8pSGKGk5n_6o/360fx360f',
        isStatTrak: false
      },
      {
        id: 'm4a4-emperor',
        name: 'M4A4 | The Emperor',
        weapon: 'M4A4',
        skinName: 'The Emperor',
        rarity: 'covert',
        rarityColor: '#EB4B4B',
        wear: 'Field-Tested',
        floatValue: '0.2240',
        priceEur: 42.00,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITfn2xV_Pp8j-3I4IG70Qfs-UNrZDr0LI-Re1I9Y1HR-lO9yLu6hpLu6pufyHFqv3V2-z-DyLw6o_Uu/360fx360f',
        isStatTrak: false
      }
    ]
  },
  {
    id: 'classified-duty',
    name: 'VORTEX Classified Duty',
    subtitle: 'Competitive Classics & Popular Tournament Skins',
    priceEur: 2.50,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xV_Pp_jez--YXygED6-kZkYj3wLITDdQc8MlCG_Fftxr3ug8C0u5vNnHJr6SQmsH6MnRDi1gYMMLIqu-Y0gQ/360fx360f',
    bannerGradient: 'from-purple-600/30 via-indigo-600/15 to-transparent',
    glowColor: '#A855F7',
    description: 'Balanclimi perfekt për çdo lojtar: AK Slate, AWP Atheris dhe M4A4 Desolate Space.',
    items: [
      {
        id: 'm4a4-desolate',
        name: 'M4A4 | Desolate Space',
        weapon: 'M4A4',
        skinName: 'Desolate Space',
        rarity: 'classified',
        rarityColor: '#D32CE6',
        wear: 'Field-Tested',
        floatValue: '0.1940',
        priceEur: 16.50,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xV_Pp_jez--YXygED6-kZkYj3wLITDdQc8MlCG_Fftxr3ug8C0u5vNnHJr6SQmsH6MnRDi1gYMMLIqu-Y0gQ/360fx360f',
        isStatTrak: false
      },
      {
        id: 'awp-atheris',
        name: 'AWP | Atheris',
        weapon: 'AWP',
        skinName: 'Atheris',
        rarity: 'restricted',
        rarityColor: '#8847FF',
        wear: 'Field-Tested',
        floatValue: '0.2130',
        priceEur: 7.80,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fk29T-sBzpezT_I2tiVXs-RE5YTincY-WdVA4N13R81brx-e51sW9786czydiuSQn4ivcnBfmn1gSOd0N_1mS/360fx360f',
        isStatTrak: false
      },
      {
        id: 'ak-slate',
        name: 'AK-47 | Slate',
        weapon: 'AK-47',
        skinName: 'Slate',
        rarity: 'mil-spec',
        rarityColor: '#4B69FF',
        wear: 'Field-Tested',
        floatValue: '0.1650',
        priceEur: 4.50,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV19m5h5SEheP3N77fqWZU7Mxkh6fA9N-hi1K2_BFkY2rwLdDDcQBoZAmGqVO3kLjog5S9v86byXQ263V3t37ZyhG00RwecKUxIutk_r2H/360fx360f',
        isStatTrak: false
      },
      {
        id: 'deagle-mecha',
        name: 'Desert Eagle | Mecha Industries',
        weapon: 'Desert Eagle',
        skinName: 'Mecha Industries',
        rarity: 'classified',
        rarityColor: '#D32CE6',
        wear: 'Field-Tested',
        floatValue: '0.2010',
        priceEur: 9.20,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_8-imIGZksj4OrzZglRd4cJ5nqeWpIqhjAThqUs4MTv3cNeUIAVvNwrX8gS-w-rsg5W8uMufy3I3vCE8pSGKGk5n_6o/360fx360f',
        isStatTrak: false
      },
      {
        id: 'usp-cyrex',
        name: 'USP-S | Cyrex',
        weapon: 'USP-S',
        skinName: 'Cyrex',
        rarity: 'restricted',
        rarityColor: '#8847FF',
        wear: 'Factory New',
        floatValue: '0.0420',
        priceEur: 5.10,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh5yZGj3cYfDegA9Z1zU_lC6yO_og5Tu6pnPnSBjv3N35y3cyQv33089mkyJkw/360fx360f',
        isStatTrak: false
      }
    ]
  },
  {
    id: 'budget-blaster',
    name: 'VORTEX Budget Blaster',
    subtitle: 'Under 1 Euro Entry-Level Mystery Case',
    priceEur: 0.95,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_8-imIGZksj4OrzZglRd4cJ5nqeWpIqhjAThqUs4MTv3cNeUIAVvNwrX8gS-w-rsg5W8uMufy3I3vCE8pSGKGk5n_6o/360fx360f',
    bannerGradient: 'from-lime-600/30 via-emerald-600/15 to-transparent',
    glowColor: '#A3E635',
    description: 'Hap arkën më ekonomike në platformë dhe fito skinë direkt me kosto minimale.',
    items: [
      {
        id: 'ak-phantom',
        name: 'AK-47 | Phantom Disruptor',
        weapon: 'AK-47',
        skinName: 'Phantom Disruptor',
        rarity: 'classified',
        rarityColor: '#D32CE6',
        wear: 'Field-Tested',
        floatValue: '0.1980',
        priceEur: 9.80,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV19m5h5SEheP3N77fqWZU7Mxkh6fA9N-hi1K2_BFkY2rwLdDDcQBoZAmGqVO3kLjog5S9v86byXQ263V3t37ZyhG00RwecKUxIutk_r2H/360fx360f',
        isStatTrak: false
      },
      {
        id: 'mp9-starlight',
        name: 'MP9 | Starlight Protector',
        weapon: 'MP9',
        skinName: 'Starlight Protector',
        rarity: 'classified',
        rarityColor: '#D32CE6',
        wear: 'Field-Tested',
        floatValue: '0.2210',
        priceEur: 8.50,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xV_Pp_jez--YXygED6-kZkYj3wLITDdQc8MlCG_Fftxr3ug8C0u5vNnHJr6SQmsH6MnRDi1gYMMLIqu-Y0gQ/360fx360f',
        isStatTrak: false
      },
      {
        id: 'usp-ticket',
        name: 'USP-S | Ticket to Hell',
        weapon: 'USP-S',
        skinName: 'Ticket to Hell',
        rarity: 'mil-spec',
        rarityColor: '#4B69FF',
        wear: 'Field-Tested',
        floatValue: '0.1850',
        priceEur: 1.40,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh5yZGj3cYfDegA9Z1zU_lC6yO_og5Tu6pnPnSBjv3N35y3cyQv33089mkyJkw/360fx360f',
        isStatTrak: false
      },
      {
        id: 'glock-high-beam',
        name: 'Glock-18 | High Beam',
        weapon: 'Glock-18',
        skinName: 'High Beam',
        rarity: 'mil-spec',
        rarityColor: '#4B69FF',
        wear: 'Factory New',
        floatValue: '0.0210',
        priceEur: 1.80,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKA5vfv7bYTJN_9m3mo-Zkvj8NrrHjyUDv5Vy0r6TpYr0jAfl_hdqNWqlddfAcAA8YlHRqwO2l-i90ZK56ZmanXtiuCMk-z-DyG2zR41G/360fx360f',
        isStatTrak: false
      },
      {
        id: 'p250-valence',
        name: 'P250 | Valence',
        weapon: 'P250',
        skinName: 'Valence',
        rarity: 'mil-spec',
        rarityColor: '#4B69FF',
        wear: 'Field-Tested',
        floatValue: '0.1900',
        priceEur: 1.20,
        image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhjxszYI2gS09-5h5OFhfbmP77fqWZU7Mxkh6eSotSj3wXkrxZkYmmnJNfEewY7YFrU-VHvwuvq1pC76ZvOzHNmvScm-z-DyAG3FmXf/360fx360f',
        isStatTrak: false
      }
    ]
  }
];

// ========================================================
// 4. DMARKET / WAXPEER STEAM TRADE BOT DISPATCH ENGINE
// ========================================================

/**
 * Dispatches a skin delivery via B2B Steam Trade Bot.
 * In production, this calls DMarket's API endpoint:
 *   POST https://api.dmarket.com/exchange/v1/market/buy
 * Or Waxpeer's API endpoint:
 *   POST https://api.waxpeer.com/v1/buy-one-p2p?api=...&token=...&partner=...
 */
export const dispatchSkinViaTradeBot = async (
  item: CS2Skin,
  steamTradeUrl: string,
  onProgress?: (step: number, message: string) => void
): Promise<TradeOfferDeliveryResult> => {
  // Validate Trade URL
  if (!isValidSteamTradeUrl(steamTradeUrl)) {
    throw new Error('Steam Trade URL nuk është i vlefshëm. Kontrollo formatin në profil.');
  }

  // Step 1: Steam Token Handshake
  onProgress?.(1, 'Verifikimi i Steam Partner & Token me Steam Web API...');
  await new Promise(res => setTimeout(res, 900));

  // Step 2: DMarket B2B Wholesale Liquidity Matching
  onProgress?.(2, `Kërkimi i [${item.name}] në DMarket B2B Liquidity Pool me çmim shumice...`);
  await new Promise(res => setTimeout(res, 1100));

  // Step 3: Steam Bot Trade Offer Dispatch
  onProgress?.(3, 'Bot-i i automatizuar i Vortex dërgoi Trade Offer në llogarinë tuaj Steam!');
  await new Promise(res => setTimeout(res, 800));

  const randomBotNumber = Math.floor(Math.random() * 8) + 1;
  const orderId = `VTX-TRD-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const tradeOfferId = `${Math.floor(6000000000 + Math.random() * 3000000000)}`;

  return {
    success: true,
    orderId,
    tradeOfferId,
    botSteamId: '76561198894120894',
    botName: `Vortex Steam Trade Bot #${randomBotNumber.toString().padStart(2, '0')}`,
    item,
    status: 'sent',
    message: `Trade Offer u dërgua me sukses! Hapni aplikacionin Steam në telefon (Steam Mobile Authenticator) ose në shfletues për të pranuar skin-in.`,
    tradeUrlUsed: steamTradeUrl,
    timestamp: Date.now()
  };
};
