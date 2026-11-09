import React, { useState, useEffect } from 'react';
import { VortexLandingPage } from './components/vortex/VortexLandingPage';
import { VortexDashboard } from './components/vortex/VortexDashboard';
import { sound } from './utils/soundEffects';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('vortex_steam_auth') === 'true' || localStorage.getItem('vortex_is_logged_in') === 'true';
  });

  const [userGamerTag, setUserGamerTag] = useState<string>('CSPlayer');
  const [avatarUrl] = useState<string>('https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg');

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

  const handleLoginSuccess = () => {
    sound.playTournamentVictory();
    setIsLoggedIn(true);
    localStorage.setItem('vortex_steam_auth', 'true');
  };

  const handleLogout = () => {
    sound.playClick();
    setIsLoggedIn(false);
    localStorage.removeItem('vortex_steam_auth');
    localStorage.removeItem('vortex_is_logged_in');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0A0B0E] text-[#F1F5F9] font-sans selection:bg-red-500/30 selection:text-white">
      {!isLoggedIn ? (
        <VortexLandingPage
          onLoginWithSteam={handleLoginSuccess}
          onNavigateToTournaments={handleLoginSuccess}
          onNavigateToServers={handleLoginSuccess}
          onNavigateToLeaderboard={handleLoginSuccess}
          onNavigateToAbout={() => {}}
        />
      ) : (
        <VortexDashboard
          userGamerTag={userGamerTag}
          avatarUrl={avatarUrl}
          onLogout={handleLogout}
        />
      )}

      {/* Floating State Preview Switcher in Bottom-Right Corner */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#0E1017]/90 backdrop-blur-md border border-[#232738] p-1.5 rounded-full shadow-2xl">
        <button
          onClick={() => {
            sound.playClick();
            setIsLoggedIn(!isLoggedIn);
          }}
          className="px-3.5 py-1.5 rounded-full bg-[#241217] hover:bg-[#34181F] border border-[#EF4444]/40 text-xs font-mono text-[#EF4444] hover:text-white transition flex items-center gap-2 cursor-pointer shadow-sm"
          title="Toggle between Landing Page and Dashboard view"
        >
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          <span>{isLoggedIn ? '👁️ View Landing Page (Before Login)' : '👁️ View Dashboard (After Login)'}</span>
        </button>
      </div>
    </div>
  );
}
