import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export interface ChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  verification?: 'vip' | 'verified' | 'none';
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

interface PartyChatProps {
  currentGamerTag: string;
  currentAvatarUrl?: string;
  partyMembers: Array<{
    id: string;
    name: string;
    avatar?: string;
    verification?: 'vip' | 'verified' | 'none';
    isLeader?: boolean;
  }>;
  onOpenMatchRoom?: () => void;
}

const QUICK_TACTICAL_PHRASES = [
  "Ready to queue! 🚀",
  "Ban Vertigo please ❌",
  "I play AWP on Mirage 🎯",
  "Let's win this match! 🔥",
  "Eco this round 💰",
  "Nice try, good comms 👍"
];

const BOT_REPLIES: Record<string, string[]> = {
  default: [
    "Roger that, let's lock in! 🎯",
    "Agreed, queue standard 5v5",
    "I got B-site smoke ready",
    "Focus on crosshair placement guys",
    "LFG! Let's get that +25 ELO"
  ],
  ban: [
    "100% ban Vertigo, Anubis is fine too",
    "Let's play Mirage or Inferno",
    "Banning Nuke first"
  ],
  ready: [
    "Ready! Start queue!",
    "Locked and loaded 🔫",
    "Waiting for captain to hit find match"
  ]
};

export const VortexPartyChat: React.FC<PartyChatProps> = ({
  currentGamerTag,
  currentAvatarUrl,
  partyMembers,
  onOpenMatchRoom
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys-1',
      sender: 'SYSTEM',
      text: 'Party formed. Voice comms connected (128-tick encrypted).',
      timestamp: 'Just now',
      isSystem: true
    },
    {
      id: 'm1',
      sender: 'M18',
      avatar: '/images/faceit_m18_badge.png',
      verification: 'vip',
      text: 'Hey team, ready for ranked 5v5! Ban Vertigo if we get captain.',
      timestamp: '1m ago'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    sound.playChatMessage();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentGamerTag,
      avatar: currentAvatarUrl,
      verification: 'vip',
      text,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputValue('');

    // Simulated reply from M18 or another teammate
    const otherMembers = partyMembers.filter(m => m.name !== currentGamerTag);
    if (otherMembers.length > 0) {
      setTimeout(() => {
        const bot = otherMembers[Math.floor(Math.random() * otherMembers.length)];
        let pool = BOT_REPLIES.default;
        const lower = text.toLowerCase();
        if (lower.includes('ban') || lower.includes('vertigo') || lower.includes('mirage')) {
          pool = BOT_REPLIES.ban;
        } else if (lower.includes('ready') || lower.includes('start') || lower.includes('go')) {
          pool = BOT_REPLIES.ready;
        }
        const replyText = pool[Math.floor(Math.random() * pool.length)];

        if (!isMuted) sound.playChatMessage();

        setMessages(prev => [
          ...prev,
          {
            id: `msg-reply-${Date.now()}`,
            sender: bot.name,
            avatar: bot.avatar,
            verification: bot.verification || 'vip',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }, 1200);
    }
  };

  return (
    <div className="fixed bottom-5 right-20 z-30 font-sans">
      {/* Expanded Chat Window */}
      {isOpen ? (
        <div className="w-[360px] sm:w-[400px] h-[480px] bg-[#0E121B]/95 backdrop-blur-xl border border-[#A3E635]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(163,230,53,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3 bg-[#131722] border-b border-white/[0.08] flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#131722] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-white text-xs tracking-wider uppercase">Party Comms</span>
                  <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-[10px] font-mono text-slate-400 font-bold">
                    {partyMembers.length}/5
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#A3E635] leading-none mt-0.5">Tactical encrypted channel</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
                title={isMuted ? "Unmute chat sound" : "Mute chat sound"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Teammates Bar */}
          <div className="px-4 py-2 bg-[#090C12] border-b border-white/[0.04] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold shrink-0">Party:</span>
            {partyMembers.map((m) => (
              <div key={m.id} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/5 shrink-0">
                <span className="text-[11px] font-mono font-bold text-white">{m.name}</span>
                {m.isLeader && <Crown className="w-3 h-3 text-[#FF5500]" />}
              </div>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-[10px] font-mono text-[#A3E635]/80">
                      ⚡ {msg.text}
                    </span>
                  </div>
                );
              }

              const isMe = msg.sender === currentGamerTag;

              return (
                <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="relative shrink-0 w-7 h-7 rounded-lg overflow-hidden border border-white/10 bg-[#161B26]">
                    {msg.avatar ? (
                      <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-white">
                        {msg.sender.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-1.5 text-[10px] font-mono ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-bold text-slate-300">{msg.sender}</span>
                      <span className="text-slate-500 text-[9px]">{msg.timestamp}</span>
                    </div>
                    <div
                      className={`p-2.5 rounded-2xl text-[12px] leading-relaxed break-words ${
                        isMe
                          ? 'bg-gradient-to-r from-[#84CC16] to-[#A3E635] text-slate-950 font-medium rounded-tr-none shadow-md shadow-lime-500/15'
                          : 'bg-[#151A25] border border-white/10 text-white rounded-tl-none shadow'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Tactical Preset Chips */}
          <div className="px-3 py-1.5 bg-[#0A0D15] border-t border-white/[0.04] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_TACTICAL_PHRASES.map((phrase, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(phrase)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#A3E635]/15 border border-white/5 hover:border-[#A3E635]/40 text-[10px] font-mono text-slate-300 hover:text-[#A3E635] transition cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#11141E] border-t border-white/[0.08] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Send message to party..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#080B10] border border-white/10 focus:border-[#A3E635] text-white text-xs outline-none placeholder:text-slate-500 transition font-sans"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] disabled:opacity-40 disabled:hover:bg-[#84CC16] text-slate-950 transition cursor-pointer shadow-md shadow-lime-500/20"
              title="Send message"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      ) : (
        /* Collapsed Floating Trigger Button */
        <button
          onClick={() => {
            sound.playSelect();
            setIsOpen(true);
            setUnreadCount(0);
          }}
          className="relative px-4 py-3 rounded-2xl bg-[#0E121B] hover:bg-[#131722] border-2 border-[#A3E635]/60 hover:border-[#A3E635] text-white shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(163,230,53,0.3)] transition hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-[#A3E635] group-hover:scale-110 transition" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0E121B] animate-pulse" />
          </div>

          <div className="text-left font-sans">
            <div className="text-xs font-display font-black text-white tracking-wider uppercase flex items-center gap-1.5">
              <span>Party Chat</span>
              <span className="px-1.5 py-0.2 rounded bg-[#A3E635]/15 text-[9px] font-mono font-bold text-[#A3E635]">
                {partyMembers.length}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">Click to open comms</p>
          </div>

          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-mono font-black text-[10px] animate-bounce shadow">
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};