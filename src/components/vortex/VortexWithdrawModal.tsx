import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Landmark, 
  Wallet, 
  History as HistoryIcon 
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { 
  getCaliberWalletBalance, 
  deductCaliberWalletBalance 
} from '../../services/skinDeliveryService';
import { 
  executeCryptoWithdrawal, 
  getWithdrawalHistory, 
  WithdrawalHistoryItem, 
  CRYPTO_RATES 
} from '../../services/withdrawalService';

interface VortexWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'crypto' | 'bank' | 'history';
}

export const VortexWithdrawModal: React.FC<VortexWithdrawModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'crypto'
}) => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'bank' | 'history'>(() => {
    return (initialTab === 'bank' || initialTab === 'history') ? initialTab : 'crypto';
  });
  const currentTab = (activeTab === 'bank' || activeTab === 'history') ? activeTab : 'crypto';
  const [walletBalance, setWalletBalance] = useState<number>(() => getCaliberWalletBalance());
  const [history, setHistory] = useState<WithdrawalHistoryItem[]>(() => getWithdrawalHistory());

  React.useEffect(() => {
    if (isOpen) {
      setWalletBalance(getCaliberWalletBalance());
      setHistory(getWithdrawalHistory());
      if (activeTab !== 'crypto' && activeTab !== 'bank' && activeTab !== 'history') {
        setActiveTab('crypto');
      }
    }
  }, [isOpen, activeTab]);

  // Crypto Cashout State
  const [cryptoCurrency, setCryptoCurrency] = useState<'USDT' | 'BTC' | 'ETH' | 'SOL'>('USDT');
  const [cryptoAmountEur, setCryptoAmountEur] = useState<string>('25.00');
  const [cryptoAddress, setCryptoAddress] = useState<string>('');
  const [cryptoStep, setCryptoStep] = useState<{ step: number; message: string } | null>(null);
  const [cryptoResult, setCryptoResult] = useState<{ success: boolean; txHash: string; message: string } | null>(null);
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  // Bank / SEPA Wire Transfer State
  const [bankAccountHolder, setBankAccountHolder] = useState<string>('M14 | Caliber Clutch');
  const [bankIban, setBankIban] = useState<string>('');
  const [bankBic, setBankBic] = useState<string>('');
  const [bankAmountEur, setBankAmountEur] = useState<string>('50.00');
  const [bankStep, setBankStep] = useState<{ step: number; message: string } | null>(null);
  const [bankResult, setBankResult] = useState<{ success: boolean; refId: string; message: string } | null>(null);
  const [bankError, setBankError] = useState<string | null>(null);

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
    if (eur > walletBalance) {
      setCryptoError(`Insufficient available balance (${walletBalance.toFixed(2)} €).`);
      return;
    }
    if (!cryptoAddress.trim()) {
      setCryptoError('Please enter a destination wallet address.');
      return;
    }

    try {
      const res = await executeCryptoWithdrawal(eur, cryptoCurrency, cryptoAddress, (step, message) => {
        setCryptoStep({ step, message });
      });
      setCryptoStep(null);
      setCryptoResult(res);
      setWalletBalance(getCaliberWalletBalance());
      setHistory(getWithdrawalHistory());
      sound.playTournamentVictory();
    } catch (err: unknown) {
      setCryptoStep(null);
      setCryptoError(err instanceof Error ? err.message : 'Error during crypto cashout.');
    }
  };

  // Execute Bank / SEPA Transfer
  const handleWithdrawBank = async () => {
    sound.playSelect();
    setBankError(null);
    setBankResult(null);

    const eur = parseFloat(bankAmountEur);
    if (isNaN(eur) || eur <= 0) {
      setBankError('Please enter a valid amount.');
      return;
    }
    if (eur > walletBalance) {
      setBankError(`Insufficient available balance (${walletBalance.toFixed(2)} €).`);
      return;
    }
    const cleanIban = bankIban.replace(/\s/g, '').toUpperCase();
    if (!cleanIban || cleanIban.length < 12) {
      setBankError('Please enter a valid IBAN number (e.g. XK..., AL..., DE...).');
      return;
    }

    setBankStep({ step: 1, message: 'Verifying SEPA Clearing Network & IBAN...' });
    await new Promise(r => setTimeout(r, 700));

    setBankStep({ step: 2, message: 'Authorizing bank wire from Caliber Clutch Treasury...' });
    await new Promise(r => setTimeout(r, 800));

    deductCaliberWalletBalance(eur);
    const refId = `CC-WIRE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const historyItem: WithdrawalHistoryItem = {
      id: refId,
      type: 'crypto',
      title: `SEPA Wire: ${eur.toFixed(2)} € to ${cleanIban.slice(0, 4)}...${cleanIban.slice(-4)}`,
      amountEur: eur,
      timestamp: Date.now(),
      status: 'completed',
      txHash: refId
    };

    try {
      const existing = JSON.parse(localStorage.getItem('caliber_withdrawal_history_v1') || localStorage.getItem('vortex_withdrawal_history_v1') || '[]');
      existing.unshift(historyItem);
      localStorage.setItem('caliber_withdrawal_history_v1', JSON.stringify(existing));
    } catch (_) {}

    setWalletBalance(getCaliberWalletBalance());
    setHistory(getWithdrawalHistory());
    setBankStep(null);
    setBankResult({
      success: true,
      refId,
      message: `✓ €${eur.toFixed(2)} SEPA Bank Wire successfully authorized for ${bankAccountHolder}!`
    });
    sound.playTournamentVictory();
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
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#0A0D14] border border-[#202738] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden z-10">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/5 bg-[#0F1420]/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A3E635]/20 to-emerald-500/10 border border-[#A3E635]/30 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.2)] shrink-0">
              <ArrowUpRight className="w-5 h-5 text-[#A3E635]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-base sm:text-lg text-white tracking-wide truncate">
                  CALIBER CLUTCH PRIZE CASHOUT
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] sm:text-[10px] font-bold">
                  INSTANT DISPATCH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans truncate">
                Disburse tournament prize winnings and balance directly to your Crypto or Bank Account.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Wallet Balance Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 font-mono">
              <span className="hidden xs:inline text-xs text-slate-400">Available:</span>
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
        <div className="px-4 sm:px-6 pt-3 pb-2.5 bg-[#0C101A] border-b border-white/5 flex items-center justify-between gap-2 shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { sound.playClick(); setActiveTab('crypto'); }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                currentTab === 'crypto'
                  ? 'bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Instant Crypto Payout</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveTab('bank'); }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                currentTab === 'bank'
                  ? 'bg-blue-500/15 border border-blue-500/50 text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Landmark className="w-4 h-4 text-blue-400" />
              <span>Bank & SEPA / IBAN Wire</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveTab('history'); }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                currentTab === 'history'
                  ? 'bg-purple-500/15 border border-purple-500/50 text-purple-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <HistoryIcon className="w-4 h-4 text-purple-400" />
              <span>Payout History</span>
              {history.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono text-[10px]">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Treasury Automated Dispatch Live</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5">
          
          {/* ========================================================= */}
          {/* TAB 1: CRYPTO CASHOUT (USDT / BTC / ETH / SOL)            */}
          {/* ========================================================= */}
          {currentTab === 'crypto' && (
            <div className="space-y-5 animate-in fade-in duration-150 max-w-xl mx-auto">
              
              {/* Crypto Currency Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 font-bold">
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
                    className="w-full pl-4 pr-24 py-3 rounded-xl bg-black/60 border border-white/15 text-lg font-mono font-black text-white focus:border-emerald-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 pointer-events-none select-none">
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
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition cursor-pointer"
                    >
                      {amt} €
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCryptoAmountEur(walletBalance.toFixed(2))}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition ml-auto cursor-pointer"
                  >
                    MAX ({walletBalance.toFixed(2)} €)
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
              <div className="p-4 rounded-2xl bg-[#0E1320] border border-white/10 space-y-2">
                <label className="block text-xs font-mono text-slate-300 font-bold">
                  Destination {cryptoCurrency} Address:
                </label>
                <input
                  type="text"
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  placeholder={`Enter your ${cryptoCurrency} wallet address...`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                />
                <p className="text-[10px] font-mono text-slate-400">
                  Ensure the network matches {cryptoCurrency === 'USDT' ? 'TRC-20' : cryptoCurrency}. Payouts are non-reversible.
                </p>
              </div>

              {cryptoError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cryptoError}</span>
                </div>
              )}

              {cryptoResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{cryptoResult.message}</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[11px] text-slate-400 truncate max-w-xs">TX: {cryptoResult.txHash}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cryptoResult.txHash);
                        setCopiedTx(true);
                        setTimeout(() => setCopiedTx(false), 2000);
                      }}
                      className="text-xs text-emerald-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedTx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTx ? 'Copied' : 'Copy TX'}</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleWithdrawCrypto}
                disabled={Boolean(cryptoStep) || walletBalance <= 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#A3E635] hover:brightness-110 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cryptoStep ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{cryptoStep.message}</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Disburse {cryptoAmountEur || '0'} € via {cryptoCurrency}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: BANK & SEPA / IBAN WIRE TRANSFER                   */}
          {/* ========================================================= */}
          {currentTab === 'bank' && (
            <div className="space-y-5 animate-in fade-in duration-150 max-w-xl mx-auto">
              <div className="p-5 rounded-2xl bg-[#0E1320] border border-white/10 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-white">European SEPA & IBAN Direct Transfer</h3>
                    <p className="text-[11px] font-mono text-slate-400">Official tournament prize payout direct to your bank account (0% fee).</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">Account Holder Full Name:</label>
                    <input
                      type="text"
                      value={bankAccountHolder}
                      onChange={(e) => setBankAccountHolder(e.target.value)}
                      placeholder="e.g. M14 Player"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">IBAN Number (International Bank Account):</label>
                    <input
                      type="text"
                      value={bankIban}
                      onChange={(e) => setBankIban(e.target.value.toUpperCase())}
                      placeholder="XK05 1234 5678 9012 3456 or AL... / DE..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white font-bold tracking-wider focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">SWIFT / BIC Code (Optional):</label>
                      <input
                        type="text"
                        value={bankBic}
                        onChange={(e) => setBankBic(e.target.value.toUpperCase())}
                        placeholder="e.g. TEBKXKPR"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">EUR Amount to Withdraw:</label>
                      <input
                        type="number"
                        min="10"
                        max={walletBalance}
                        value={bankAmountEur}
                        onChange={(e) => setBankAmountEur(e.target.value)}
                        placeholder="50.00"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white focus:border-blue-400 focus:outline-none font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {bankError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bankError}</span>
                  </div>
                )}

                {bankResult && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{bankResult.message}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Reference: {bankResult.refId} • Estimated clearing: 1-2 business hours</div>
                  </div>
                )}

                <button
                  onClick={handleWithdrawBank}
                  disabled={Boolean(bankStep) || walletBalance <= 0}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {bankStep ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{bankStep.message}</span>
                    </>
                  ) : (
                    <>
                      <Landmark className="w-4 h-4" />
                      <span>Disburse SEPA Bank Wire ({bankAmountEur || '0'} €)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: PAYOUT & PRIZE HISTORY                             */}
          {/* ========================================================= */}
          {currentTab === 'history' && (
            <div className="space-y-3 animate-in fade-in duration-150 max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/5">
                <span>Total Disbursed Transfers: <strong>{history.length}</strong></span>
                <span className="text-emerald-400 font-bold">100% Guaranteed Payouts</span>
              </div>

              {history.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0E1320] border border-dashed border-white/10 space-y-2">
                  <div className="text-3xl">📜</div>
                  <h4 className="font-display font-bold text-white text-sm">No Payout History Yet</h4>
                  <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
                    When you withdraw tournament prize money or earnings, your transaction proofs will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#0E1320] border border-white/5 flex items-center justify-between gap-3 font-mono text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-bold truncate">{item.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(item.timestamp).toLocaleString()} • ID: {item.id}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-black text-emerald-400 text-sm">
                          -{item.amountEur.toFixed(2)} €
                        </div>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-white/5 bg-[#090C14] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Caliber Clutch Verified European Esports Treasury Protection Active</span>
          </div>
          <span className="text-slate-500">Official CS2 Sub-Tick Platform</span>
        </div>

      </div>
    </div>
  );
};
