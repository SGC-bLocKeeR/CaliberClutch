import React, { useState } from 'react';
import { 
  Play, 
  X, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Users, 
  ExternalLink,
  Volume2
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface VortexLandingPageProps {
  onLoginWithSteam: () => void;
  onNavigateToTournaments?: () => void;
  onNavigateToServers?: () => void;
  onNavigateToLeaderboard?: () => void;
  onNavigateToAbout?: () => void;
}

export const VortexLandingPage: React.FC<VortexLandingPageProps> = ({
  onLoginWithSteam,
  onNavigateToTournaments,
  onNavigateToServers,
  onNavigateToLeaderboard,
  onNavigateToAbout
}) => {
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  const handleSteamLogin = () => {
    sound.playTournamentVictory();
    onLoginWithSteam();
  };

  const handleWatchTrailer = () => {
    sound.playSelect();
    setShowTrailerModal(true);
  };

  const handleMapClick = (mapName: string) => {
    sound.playSelect();
    setSelectedMap(mapName);
    setTimeout(() => setSelectedMap(null), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-[#F1F5F9] font-sans flex flex-col justify-start items-center selection:bg-red-500/30 selection:text-white">
      
      {/* ======================================================== */}
      {/* 1. PIXEL-PERFECT HERO CANVAS (100% MATCHING REFERENCE)   */}
      {/* ======================================================== */}
      <div className="w-full max-w-[1920px] mx-auto relative select-none">
        
        {/* Main Canvas Image */}
        <div className="relative w-full aspect-[1672/496] overflow-hidden shadow-2xl">
          <img 
            src="/images/vortex_landing_reference.jpg" 
            alt="VORTEX Gaming Landing Page" 
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* ==================================================== */}
          {/* INTERACTIVE HOTSPOTS OVER REFERENCE VISUAL ELEMENTS   */}
          {/* ==================================================== */}

          {/* Logo (Top Left) */}
          <button
            onClick={() => { sound.playClick(); }}
            className="absolute z-20 cursor-pointer rounded-lg hover:ring-2 hover:ring-[#EF4444]/40 transition duration-150"
            style={{ left: '2.39%', top: '4.03%', width: '10.77%', height: '9.68%' }}
            title="VORTEX Esports"
          />

          {/* Nav: Home */}
          <button
            onClick={() => sound.playClick()}
            className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition"
            style={{ left: '26.32%', top: '4.03%', width: '5.68%', height: '8.47%' }}
            title="Home"
          />

          {/* Nav: Tournaments */}
          <button
            onClick={() => { sound.playSelect(); if (onNavigateToTournaments) onNavigateToTournaments(); }}
            className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition"
            style={{ left: '32.60%', top: '4.03%', width: '7.78%', height: '8.47%' }}
            title="Competitive Tournaments"
          />

          {/* Nav: Scrims */}
          <button
            onClick={() => { sound.playSelect(); if (onNavigateToServers) onNavigateToServers(); }}
            className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition"
            style={{ left: '40.97%', top: '4.03%', width: '5.68%', height: '8.47%' }}
            title="CS2 Scrims"
          />

          {/* Nav: Leaderboards */}
          <button
            onClick={() => { sound.playSelect(); if (onNavigateToLeaderboard) onNavigateToLeaderboard(); }}
            className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition"
            style={{ left: '47.25%', top: '4.03%', width: '8.07%', height: '8.47%' }}
            title="Global Leaderboards"
          />

          {/* Nav: About */}
          <button
            onClick={() => { sound.playClick(); if (onNavigateToAbout) onNavigateToAbout(); }}
            className="absolute z-20 cursor-pointer rounded-full hover:bg-white/10 transition"
            style={{ left: '55.92%', top: '4.03%', width: '5.38%', height: '8.47%' }}
            title="About VORTEX"
          />

          {/* Top Nav: Login with Steam Button */}
          <button
            onClick={handleSteamLogin}
            className="absolute z-20 cursor-pointer rounded-full hover:ring-2 hover:ring-[#EF4444] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition duration-200"
            style={{ left: '86.72%', top: '3.63%', width: '10.47%', height: '8.87%' }}
            title="Login with Steam"
          />

          {/* Hero: Solid Red "Login with Steam" Button */}
          <button
            onClick={handleSteamLogin}
            className="absolute z-20 cursor-pointer rounded-full hover:ring-2 hover:ring-white hover:shadow-[0_0_25px_rgba(239,68,68,0.85)] hover:scale-[1.02] transition duration-200"
            style={{ left: '3.59%', top: '72.58%', width: '11.66%', height: '9.68%' }}
            title="Login with Steam and Enter VORTEX"
          />

          {/* Hero: "Watch Trailer" Button */}
          <button
            onClick={handleWatchTrailer}
            className="absolute z-20 cursor-pointer rounded-full hover:ring-2 hover:ring-[#EF4444] hover:bg-[#EF4444]/15 hover:scale-[1.02] transition duration-200"
            style={{ left: '16.45%', top: '72.58%', width: '9.27%', height: '9.68%' }}
            title="Watch CS2 VORTEX Trailer"
          />

          {/* Map Card 1: INFERNO */}
          <button
            onClick={() => handleMapClick('Inferno')}
            className="absolute z-20 cursor-pointer rounded-2xl hover:ring-2 hover:ring-[#EF4444] hover:scale-105 transition duration-300"
            style={{ left: '70.87%', top: '75.60%', width: '5.68%', height: '28.23%' }}
            title="Map: de_inferno"
          />

          {/* Map Card 2: MIRAGE (Red Neon Centerpiece) */}
          <button
            onClick={() => handleMapClick('Mirage')}
            className="absolute z-20 cursor-pointer rounded-2xl hover:ring-2 hover:ring-white hover:scale-105 transition duration-300"
            style={{ left: '77.45%', top: '35.28%', width: '9.57%', height: '64.52%' }}
            title="Map: de_mirage (Featured 128-Tick)"
          />

          {/* Map Card 3: NUKE */}
          <button
            onClick={() => handleMapClick('Nuke')}
            className="absolute z-20 cursor-pointer rounded-2xl hover:ring-2 hover:ring-[#EF4444] hover:scale-105 transition duration-300"
            style={{ left: '87.92%', top: '62.50%', width: '7.18%', height: '40.32%' }}
            title="Map: de_nuke"
          />

        </div>
      </div>

      {/* Map Selected Toast Notification */}
      {selectedMap && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-3 bg-[#131620] border border-[#EF4444] px-5 py-3 rounded-2xl shadow-2xl shadow-red-500/20">
          <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-ping" />
          <div className="text-xs font-mono">
            <span className="text-[#94A3B8]">SELECTED MAP: </span>
            <span className="text-white font-bold uppercase">{selectedMap} // 128-Tick Node Ready</span>
          </div>
        </div>
      )}

      {/* CS2 Cinematic Trailer Modal */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#0D0F16] border border-[#EF4444]/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#1E2436] bg-[#121520]">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#EF4444] fill-[#EF4444]" />
                <span className="font-display font-black text-white text-sm">VORTEX // CS2 COMPETITIVE TRAILER</span>
              </div>
              <button 
                onClick={() => { sound.playClick(); setShowTrailerModal(false); }}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#94A3B8] hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <img 
                src="/images/vortex_reference.jpg" 
                alt="Trailer Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
              />
              <div className="relative z-10 space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-full bg-[#EF4444]/20 border border-[#EF4444] flex items-center justify-center mx-auto text-[#EF4444] shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h3 className="text-2xl font-black font-display text-white">THE NEXT EVOLUTION OF CS2</h3>
                <p className="text-xs text-[#94A3B8] font-sans">
                  Experience true sub-tick consistency, automated prize payouts, and kernel anti-cheat security.
                </p>
                <button
                  onClick={() => {
                    setShowTrailerModal(false);
                    handleSteamLogin();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Join VORTEX Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
