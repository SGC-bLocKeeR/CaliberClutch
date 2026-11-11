import React, { useState, useEffect } from 'react';
import { VortexLandingPage } from './components/vortex/VortexLandingPage';
import { VortexPureHtmlLanding } from './components/vortex/VortexPureHtmlLanding';
import { VortexDashboard } from './components/vortex/VortexDashboard';
import { sound } from './utils/soundEffects';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('vortex_steam_auth') === 'true' || localStorage.getItem('vortex_is_logged_in') === 'true';
  });

  const [landingMode, setLandingMode] = useState<'pure-html' | 'image-reference'>('pure-html');
  const [userGamerTag, setUserGamerTag] = useState<string>('bLocKeeRz');
  const [avatarUrl] = useState<string>('https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg');
  const [initialOpenPremium, setInitialOpenPremium] = useState<boolean>(false);

  useEffect(() => {
    // Check if returning from Steam OpenID
    const searchParams = new URLSearchParams(window.location.search);
    const isReturningFromSteam = 
      searchParams.get('openid.claimed_id') || 
      searchParams.get('openid.mode') === 'id_res' ||
      searchParams.get('openid_mode') === 'id_res' ||
      searchParams.get('openid_return') === 'true' ||
      searchParams.get('steam_auth') === 'approved' ||
      searchParams.get('steam_auth') === 'success';

    if (isReturningFromSteam) {
      window.history.replaceState({}, document.title, window.location.pathname);
      localStorage.setItem('vortex_steam_auth', 'true');
      setIsLoggedIn(true);
      setUserGamerTag('bLocKeeRz');
    }
  }, []);

  const handleLoginSuccess = (openUpgrade: boolean = false) => {
    sound.playTournamentVictory();
    setInitialOpenPremium(openUpgrade);
    setIsLoggedIn(true);
    localStorage.setItem('vortex_steam_auth', 'true');
  };

  const handleLogout = () => {
    sound.playClick();
    setIsLoggedIn(false);
    setInitialOpenPremium(false);
    localStorage.removeItem('vortex_steam_auth');
    localStorage.removeItem('vortex_is_logged_in');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0A0B0E] text-[#F1F5F9] font-sans selection:bg-[#A3E635]/30 selection:text-white">
      {!isLoggedIn ? (
        landingMode === 'pure-html' ? (
          <VortexPureHtmlLanding
            onLoginWithSteam={handleLoginSuccess}
            onNavigateToTournaments={() => handleLoginSuccess(false)}
            onNavigateToServers={() => handleLoginSuccess(false)}
            onNavigateToLeaderboard={() => handleLoginSuccess(false)}
            onNavigateToAbout={() => {}}
          />
        ) : (
          <VortexLandingPage
            onLoginWithSteam={handleLoginSuccess}
            onNavigateToTournaments={() => handleLoginSuccess(false)}
            onNavigateToServers={() => handleLoginSuccess(false)}
            onNavigateToLeaderboard={() => handleLoginSuccess(false)}
            onNavigateToAbout={() => {}}
          />
        )
      ) : (
        <VortexDashboard
          userGamerTag={userGamerTag}
          avatarUrl={avatarUrl}
          onLogout={handleLogout}
          initialOpenPremium={initialOpenPremium}
        />
      )}

      {/* Floating State Preview Switcher in Bottom-Right Corner */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#0E1017]/95 backdrop-blur-md border border-[#232738] p-1.5 rounded-full shadow-2xl">
        {!isLoggedIn && (
          <button
            onClick={() => {
              sound.playClick();
              setLandingMode(landingMode === 'pure-html' ? 'image-reference' : 'pure-html');
            }}
            className="px-3 py-1.5 rounded-full bg-[#141721] hover:bg-[#1E2333] border border-white/10 text-xs font-mono text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Toggle between Pure HTML edition and Image Reference"
          >
            <span>{landingMode === 'pure-html' ? '⚡ 100% Pure HTML' : '🖼️ Reference Image'}</span>
          </button>
        )}

        <button
          onClick={() => {
            sound.playClick();
            setIsLoggedIn(!isLoggedIn);
          }}
          className="px-3.5 py-1.5 rounded-full bg-[#18210C] hover:bg-[#253314] border border-[#A3E635]/40 text-xs font-mono text-[#A3E635] hover:text-white transition flex items-center gap-2 cursor-pointer shadow-sm outline-none focus:outline-none"
          title="Toggle between Landing Page and Dashboard view"
        >
          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
          <span>{isLoggedIn ? '👁️ View Landing' : '👁️ View Dashboard'}</span>
        </button>
      </div>
    </div>
  );
}
