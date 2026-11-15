import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Check, Copy, AlertCircle, ArrowUpRight, ShieldCheck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { 
  CS2Skin, 
  getVortexWalletBalance, 
  creditVortexWalletBalance,
  getSavedSteamTradeUrl, 
  saveSteamTradeUrl, 
  isValidSteamTradeUrl,
  VORTEX_CASE_CATALOG 
} from '../../services/skinDeliveryService';
import { 
  getUserSkinInventory, 
  executeSkinWithdrawal, 
  executeCryptoWithdrawal, 
  getWithdrawalHistory, 
  WithdrawalHistoryItem, 
  CRYPTO_RATES,
  removeUserSkinFromInventory 
} from '../../services/withdrawalService';

interface VortexWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'skins' | 'crypto' | 'history';
}

export const VortexWithdrawModal: React.FC<VortexWithdrawModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'skins'
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'crypto' | 'history'>(initialTab);
  const [walletBalance, setWalletBalance] = useState<number>(() => getVortexWalletBalance());
  const [userSkins, setUserSkins] = useState<CS2Skin[]>(() => getUserSkinInventory());
  const [history, setHistory] = useState<WithdrawalHistoryItem[]>(() => getWithdrawalHistory());

  // Trade URL State
  const [tradeUrl, setTradeUrl] = useState<string>(() => getSavedSteamTradeUrl());
  const [isEditingTradeUrl, setIsEditingTradeUrl] = useState<boolean>(!getSavedSteamTradeUrl());
  const [tradeUrlInput, setTradeUrlInput] = useState<string>(() => getSavedSteamTradeUrl());
  const [tradeUrlSavedSuccess, setTradeUrlSavedSuccess] = useState(false);

  // Skin Withdrawal State
  const [selectedSkin, setSelectedSkin] = useState<CS2Skin | null>(null);
  const [skinWithdrawStep, setSkinWithdrawStep] = useState<{ step: number; message: string } | null>(null);
  const [skinWithdrawResult, setSkinWithdrawResult] = useState<{ success: boolean; tradeOfferId: string; message: string } | null>(null);
  const [skinWithdrawError, setSkinWithdrawError] = useState<string | null>(null);

  // Crypto Withdrawal State
  const [cryptoCurrency, setCryptoCurrency] = useState<'USDT' | 'BTC' | 'ETH' | 'SOL'>('USDT');
  const [cryptoAmountEur, setCryptoAmountEur] = useState<string>('25.00');
  const [cryptoAddress, setCryptoAddress] = useState<string>('');
  const [cryptoStep, setCryptoStep] = useState<{ step: number; message: string } | null>(null);
  const [cryptoResult, setCryptoResult] = useState<{ success: boolean; txHash: string; message: string } | null>(null);
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  // Direct Exchange Bot Catalog (Browse high tier skins available for balance withdrawal)
  const [skinSourceTab, setSkinSourceTab] = useState<'vault' | 'catalog'>('vault');
  const allBotSkins = React.useMemo(() => {
    const list: CS2Skin[] = [];
    VORTEX_CASE_CATALOG.forEach(c => {
      c.items.forEach(it => {
        if (!list.some(x => x.id === it.id)) list.push(it);
      });
    });
    return list.sort((a, b) => b.priceEur - a.priceEur);
  }, []);

  // Sync wallet balance & inventory
  useEffect(() => {
    const updateBal = (e: Event) => {
      const custom = e as CustomEvent<number>;
      setWalletBalance(custom.detail);
    };
    const updateInv = () => setUserSkins(getUserSkinInventory());
    const updateHist = () => setHistory(getWithdrawalHistory());

    window.addEventListener('vortex_wallet_updated', updateBal);
    window.addEventListener('vortex_inventory_updated', updateInv);
    window.addEventListener('vortex_withdraw_history_updated', updateHist);

    return () => {
      window.removeEventListener('vortex_wallet_updated', updateBal);
      window.removeEventListener('vortex_inventory_updated', updateInv);
      window.removeEventListener('vortex_withdraw_history_updated', updateHist);
    };
  }, []);

  // Save Trade URL
  const handleSaveTradeUrl = () => {
    sound.playSelect();
    if (saveSteamTradeUrl(tradeUrlInput)) {
      setTradeUrl(tradeUrlInput.trim());
      setIsEditingTradeUrl(false);
      setTradeUrlSavedSuccess(true);
      setTimeout(() => setTradeUrlSavedSuccess(false), 3000);
    } else {
      sound.playRareGoldDrop();
    }
  };

  // Execute Skin Withdrawal
  const handleWithdrawSkin = async (skin: CS2Skin) => {
    if (!tradeUrl || !isValidSteamTradeUrl(tradeUrl)) {
      setIsEditingTradeUrl(true);
      sound.playClick();
      return;
    }

    sound.playSelect();
    setSelectedSkin(skin);
    setSkinWithdrawError(null);
    setSkinWithdrawResult(null);

    try {
      const res = await executeSkinWithdrawal(skin, tradeUrl, (step, message) => {
        setSkinWithdrawStep({ step, message });
      });
      setSkinWithdrawStep(null);
      setSkinWithdrawResult(res);
      setUserSkins(getUserSkinInventory());
      setHistory(getWithdrawalHistory());
      sound.playTournamentVictory();
    } catch (err: unknown) {
      setSkinWithdrawStep(null);
      setSkinWithdrawError(err instanceof Error ? err.message : 'Error sending trade offer.');
    }
  };

  // Sell Skin from Vault for 85% Cash
  const handleSellSkinFromVault = (skin: CS2Skin) => {
    sound.playBuyWeapon();
    const sellValue = parseFloat((skin.priceEur * 0.85).toFixed(2));
    creditVortexWalletBalance(sellValue);
    removeUserSkinFromInventory(skin.id);
    setUserSkins(getUserSkinInventory());
  };

  // Execute Crypto Cashout
  const handleWithdrawCrypto = async () => {
    sound.playSelect();
    setCryptoError(null);
    setCryptoResult(null);

    const eur = parseFloat(cryptoAmountEur);
    if (isNaN(eur) || eur <= 0) {
      setCryptoError('Please enter a valid EUR amount.');
      return;
    }

    try {
      const res = await executeCryptoWithdrawal(eur, cryptoCurrency, cryptoAddress, (step, message) => {
        setCryptoStep({ step, message });
      });
      setCryptoStep(null);
      setCryptoResult(res);
      setWalletBalance(getVortexWalletBalance());
      setHistory(getWithdrawalHistory());
      sound.playTournamentVictory();
    } catch (err: unknown) {
      setCryptoStep(null);
      setCryptoError(err instanceof Error ? err.message : 'Error during crypto cashout.');
    }
  };

  const convertedCrypto = (parseFloat(cryptoAmountEur || '0') * CRYPTO_RATES[cryptoCurrency]).toFixed(
    cryptoCurrency === 'USDT' ? 2 : 6
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0D14] border border-[#202738] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden z-10">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/5 bg-[#0F1420]/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <ArrowUpRight className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg text-white tracking-wide">
                  VORTEX WITHDRAW & CASHOUT
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Withdraw CS2 skins directly to Steam or cash out EUR balance to Crypto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet Balance Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 font-mono">
              <span className="text-xs text-slate-400">Available:</span>
              <span className="text-sm font-black text-emerald-400">{walletBalance.toFixed(2)} €</span>
            </div>

            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="px-5 pt-3 pb-2 bg-[#0C101A] border-b border-white/5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playClick(); setActiveTab('skins'); }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'skins'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>🎁</span>
              <span>CS2 Skins (Steam Trade)</span>
              {userSkins.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                  {userSkins.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveTab('crypto'); }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'crypto'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>⚡</span>
              <span>Crypto Cashout (USDT / BTC / ETH)</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveTab('history'); }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>📜</span>
              <span>Withdrawal History</span>
              {history.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono text-[10px]">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {/* Steam Bot Status Indicator */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Steam Trade Bot #04 Online • 0.8s Handshake</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          
          {/* ========================================================= */}
          {/* TAB 1: CS2 SKINS WITHDRAWAL (STEAM TRADE OFFER)           */}
          {/* ========================================================= */}
          {activeTab === 'skins' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Steam Trade URL Setup Strip */}
              <div className="p-3.5 rounded-2xl bg-[#0E1320] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <span className="text-sm">🔗</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                      <span>Steam Trade Offer URL:</span>
                      {isValidSteamTradeUrl(tradeUrl) && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Configured
                        </span>
                      )}
                    </div>
                    {isEditingTradeUrl ? (
                      <div className="flex items-center gap-2 mt-1.5">
                        <input
                          type="text"
                          value={tradeUrlInput}
                          onChange={(e) => setTradeUrlInput(e.target.value)}
                          placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
                          className="w-full sm:w-96 px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          onClick={handleSaveTradeUrl}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                        {tradeUrl || 'No trade URL configured yet.'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isEditingTradeUrl && (
                    <button
                      onClick={() => setIsEditingTradeUrl(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition cursor-pointer"
                    >
                      Change URL
                    </button>
                  )}
                  <a
                    href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 font-mono text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Find My Trade URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Filter: My Vault vs Bot Direct Vault */}
              <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { sound.playClick(); setSkinSourceTab('vault'); }}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                      skinSourceTab === 'vault'
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    My Won Skins ({userSkins.length})
                  </button>
                  <button
                    onClick={() => { sound.playClick(); setSkinSourceTab('catalog'); }}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                      skinSourceTab === 'catalog'
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Direct Bot Vault (Exchange Balance)
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  {skinSourceTab === 'vault' ? 'Items ready for instant Steam Trade' : 'Withdraw items using your EUR wallet'}
                </div>
              </div>

              {/* Active Step / Result Banner */}
              {skinWithdrawStep && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                  <div className="text-xs font-mono text-amber-300">
                    <strong className="block">Step {skinWithdrawStep.step}/3 in progress...</strong>
                    <span>{skinWithdrawStep.message}</span>
                  </div>
                </div>
              )}

              {skinWithdrawResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-mono font-bold text-white">Trade Offer Sent!</div>
                      <div className="text-xs text-emerald-300">{skinWithdrawResult.message}</div>
                    </div>
                  </div>
                  <a
                    href="https://steamcommunity.com/id/me/tradeoffers/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    <span>Open Steam Trade</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {skinWithdrawError && (
                <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-2.5 text-xs font-mono text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{skinWithdrawError}</span>
                </div>
              )}

              {/* Skin Grid (User Vault) */}
              {skinSourceTab === 'vault' && (
                <div>
                  {userSkins.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-[#0E121E]/60 border border-dashed border-white/10 space-y-3">
                      <div className="text-3xl">📦</div>
                      <h3 className="font-display font-bold text-base text-white">Your Skin Vault is Empty</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                        Unbox CS2 cases in the Case Shop or purchase skins from the Direct Bot Vault to withdraw them here to Steam!
                      </p>
                      <button
                        onClick={() => { sound.playSelect(); setSkinSourceTab('catalog'); }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono font-bold text-xs transition hover:scale-105"
                      >
                        Browse Direct Bot Vault
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {userSkins.map((skin) => (
                        <div
                          key={skin.id}
                          className="group relative p-3 rounded-2xl bg-[#0F1420] hover:bg-[#141A29] border border-white/10 hover:border-amber-500/50 transition-all flex flex-col justify-between overflow-hidden shadow-lg"
                        >
                          {/* Rarity & Wear */}
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span 
                              className="px-1.5 py-0.5 rounded font-black uppercase text-slate-950"
                              style={{ backgroundColor: skin.rarityColor || '#F59E0B' }}
                            >
                              {skin.wear || 'FT'}
                            </span>
                            <span className="font-bold text-emerald-400 text-xs">
                              {skin.priceEur.toFixed(2)} €
                            </span>
                          </div>

                          {/* Image */}
                          <div className="relative py-2 flex items-center justify-center">
                            <img
                              src={skin.image}
                              alt={skin.name}
                              className="w-28 h-20 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          {/* Info */}
                          <div className="space-y-0.5 mb-2.5">
                            <div className="text-[10px] font-mono text-slate-400 truncate">{skin.weapon}</div>
                            <div className="text-xs font-display font-bold text-white truncate" title={skin.name}>
                              {skin.skinName || skin.name}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-1.5 pt-1 border-t border-white/5">
                            <button
                              onClick={() => handleWithdrawSkin(skin)}
                              disabled={Boolean(skinWithdrawStep)}
                              className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-mono font-black text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
                            >
                              <span>Trade to Steam</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleSellSkinFromVault(skin)}
                              className="w-full py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono text-[10px] transition cursor-pointer"
                              title="Instant sell for 85% EUR cash balance"
                            >
                              Sell for {(skin.priceEur * 0.85).toFixed(2)} €
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skin Grid (Direct Bot Vault Catalog) */}
              {skinSourceTab === 'catalog' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>Select an item from the Steam Bot Vault to exchange using your available balance ({walletBalance.toFixed(2)} €):</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {allBotSkins.slice(0, 16).map((skin) => {
                      const canAfford = walletBalance >= skin.priceEur;
                      return (
                        <div
                          key={skin.id}
                          className="group relative p-3 rounded-2xl bg-[#0F1420] hover:bg-[#141A29] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span 
                              className="px-1.5 py-0.5 rounded font-black uppercase text-slate-950"
                              style={{ backgroundColor: skin.rarityColor || '#F59E0B' }}
                            >
                              {skin.wear || 'FN'}
                            </span>
                            <span className="font-bold text-emerald-400 text-xs">
                              {skin.priceEur.toFixed(2)} €
                            </span>
                          </div>

                          <div className="relative py-2 flex items-center justify-center">
                            <img
                              src={skin.image}
                              alt={skin.name}
                              className="w-28 h-20 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          <div className="space-y-0.5 mb-2.5">
                            <div className="text-[10px] font-mono text-slate-400 truncate">{skin.weapon}</div>
                            <div className="text-xs font-display font-bold text-white truncate" title={skin.name}>
                              {skin.skinName || skin.name}
                            </div>
                          </div>

                          <button
                            onClick={() => handleWithdrawSkin(skin)}
                            disabled={!canAfford || Boolean(skinWithdrawStep)}
                            className={`w-full py-1.5 px-2 rounded-xl font-mono font-black text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-sm active:scale-95 ${
                              canAfford
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950'
                                : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                            }`}
                          >
                            <span>{canAfford ? 'Withdraw to Steam' : 'Need More Balance'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CRYPTO CASHOUT (USDT / BTC / ETH / SOL)            */}
          {/* ========================================================= */}
          {activeTab === 'crypto' && (
            <div className="space-y-5 animate-in fade-in duration-150 max-w-2xl mx-auto">
              
              {/* Crypto Currency Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  Select Payout Cryptocurrency:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'USDT', name: 'USDT (TRC20)', icon: '🟢', network: 'TRON • $0 Fee' },
                    { id: 'BTC', name: 'Bitcoin', icon: '₿', network: 'Bitcoin Mainnet' },
                    { id: 'ETH', name: 'Ethereum', icon: 'Ξ', network: 'ERC20' },
                    { id: 'SOL', name: 'Solana', icon: '🟣', network: 'Solana Chain' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setCryptoCurrency(c.id as 'USDT' | 'BTC' | 'ETH' | 'SOL');
                      }}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        cryptoCurrency === c.id
                          ? 'bg-emerald-500/15 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-[#0E121E] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{c.icon}</span>
                        <span className="font-display font-black text-xs text-white">{c.name}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{c.network}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount to Withdraw in EUR */}
              <div className="p-4 rounded-2xl bg-[#0E1320] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">EUR Amount to Withdraw:</span>
                  <span className="text-slate-400">
                    Max Available: <strong className="text-emerald-400">{walletBalance.toFixed(2)} €</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="5"
                    max={walletBalance}
                    value={cryptoAmountEur}
                    onChange={(e) => setCryptoAmountEur(e.target.value)}
                    placeholder="25.00"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-lg font-mono font-black text-white focus:border-emerald-400 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                    EUR (€)
                  </span>
                </div>

                {/* Quick Amount Chips */}
                <div className="flex items-center gap-2">
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCryptoAmountEur(amt.toFixed(2))}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition"
                    >
                      {amt} €
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCryptoAmountEur(walletBalance.toFixed(2))}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition ml-auto"
                  >
                    MAX ALL ({walletBalance.toFixed(2)} €)
                  </button>
                </div>

                {/* Converted Crypto Quote */}
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">You will receive approximately:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ≈ {convertedCrypto} {cryptoCurrency}
                  </span>
                </div>
              </div>

              {/* Recipient Crypto Wallet Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  Recipient {cryptoCurrency} Wallet Address:
                </label>
                <input
                  type="text"
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  placeholder={
                    cryptoCurrency === 'USDT' 
                      ? 'T... (TRC20 Address e.g. Binance / Bybit)' 
                      : cryptoCurrency === 'BTC' 
                        ? 'bc1... or 1... (Bitcoin Address)' 
                        : cryptoCurrency === 'ETH' 
                          ? '0x... (ERC20 Address)' 
                          : 'Solana Wallet Public Key'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none placeholder:text-slate-600"
                />
                <p className="text-[10px] font-mono text-slate-500">
                  Ensure address matches network {cryptoCurrency === 'USDT' ? 'TRON (TRC20)' : cryptoCurrency}. Transactions on blockchain are irreversible.
                </p>
              </div>

              {/* Live Status / Result */}
              {cryptoStep && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                  <div className="text-xs font-mono text-emerald-300">
                    <strong className="block">Step {cryptoStep.step}/3 in progress...</strong>
                    <span>{cryptoStep.message}</span>
                  </div>
                </div>
              )}

              {cryptoResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Withdrawal Executed Successfully!</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">{cryptoResult.message}</p>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/10 text-[11px] font-mono">
                    <span className="text-slate-400 truncate max-w-xs">{cryptoResult.txHash}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cryptoResult.txHash);
                        setCopiedTx(true);
                        setTimeout(() => setCopiedTx(false), 2000);
                      }}
                      className="text-emerald-400 hover:text-white flex items-center gap-1 shrink-0 ml-2"
                    >
                      {copiedTx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTx ? 'Copied' : 'Copy TxHash'}</span>
                    </button>
                  </div>
                </div>
              )}

              {cryptoError && (
                <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-2.5 text-xs font-mono text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{cryptoError}</span>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleWithdrawCrypto}
                disabled={Boolean(cryptoStep) || walletBalance < parseFloat(cryptoAmountEur || '0')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono font-black text-sm transition cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Cashout of {cryptoAmountEur} € to {cryptoCurrency}
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: WITHDRAWAL HISTORY & VAULT LOG                     */}
          {/* ========================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {history.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-[#0E121E]/60 border border-dashed border-white/10 space-y-2">
                  <div className="text-3xl">📜</div>
                  <h3 className="font-display font-bold text-base text-white">No Withdrawals Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                    Your Steam Trade Offers and Crypto Cashouts will be logged here with live blockchain and Steam receipts.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#0E121E] border border-white/5 hover:border-white/15 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0">
                          {item.type === 'skin' ? (
                            item.skinImage ? (
                              <img src={item.skinImage} alt={item.title} className="w-8 h-8 object-contain" />
                            ) : (
                              <span>🎁</span>
                            )
                          ) : (
                            <span>⚡</span>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{item.title}</span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold">
                              {item.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{new Date(item.timestamp).toLocaleString()}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">{item.amountEur.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.tradeOfferId && (
                          <a
                            href="https://steamcommunity.com/id/me/tradeoffers/"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-xs transition flex items-center gap-1"
                          >
                            <span>Steam Offer #{item.tradeOfferId.slice(-6)}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {item.txHash && (
                          <span 
                            className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-[10px] text-slate-400 truncate max-w-xs"
                            title={item.txHash}
                          >
                            Tx: {item.txHash.slice(0, 10)}...{item.txHash.slice(-8)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Security Guarantee */}
        <div className="px-5 py-3 border-t border-white/5 bg-[#0C101A] flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>VORTEX Direct P2P & Steam Escrow Protection Active</span>
          </div>

          <div className="text-slate-400">
            24/7 Automated Bot Dispatch Node
          </div>
        </div>

      </div>
    </div>
  );
};
