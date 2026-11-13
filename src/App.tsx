import React, { useState, useEffect } from 'react';
import { VortexLandingPage } from './components/vortex/VortexLandingPage';
import { VortexPureHtmlLanding } from './components/vortex/VortexPureHtmlLanding';
import { VortexDashboard } from './components/vortex/VortexDashboard';
import { sound } from './utils/soundEffects';
import { redirectToSteamLogin, parseSteamLoginParams } from './utils/steamAuth';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('vortex_steam_auth') === 'true' || localStorage.getItem('vortex_is_logged_in') === 'true';
  });

  const [landingMode, setLandingMode] = useState<'pure-html' | 'image-reference'>('pure-html');
  const [userGamerTag, setUserGamerTag] = useState<string>('bLocKeeRz');
  const [avatarUrl] = useState<string>('https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg');
  const [initialOpenPremium, setInitialOpenPremium] = useState<boolean>(false);
  const [isRedirectingToSteam, setIsRedirectingToSteam] = useState<boolean>(false);

  useEffect(() => {
    // Check if returning from Steam OpenID 2.0
    const { isApproved, steamId64, steamId2 } = parseSteamLoginParams(window.location.search);

    if (isApproved) {
      if (steamId64) {
        localStorage.setItem('vortex_steam_id', steamId2 || steamId64);
        localStorage.setItem('vortex_steam_id64', steamId64);
      }
      const shouldOpenUpgrade = sessionStorage.getItem('vortex_pending_upgrade') === 'true';
      sessionStorage.removeItem('vortex_pending_upgrade');

      window.history.replaceState({}, document.title, window.location.pathname);
      localStorage.setItem('vortex_steam_auth', 'true');
      setIsLoggedIn(true);
      setInitialOpenPremium(shouldOpenUpgrade);
      setUserGamerTag('bLocKeeRz');

      try {
        sound.playTournamentVictory();
      } catch (_) {}
    }
  }, []);

  const handleLoginWithSteam = (openUpgrade: boolean = false) => {
    sound.playSelect();
    setIsRedirectingToSteam(true);
    if (openUpgrade) {
      sessionStorage.setItem('vortex_pending_upgrade', 'true');
    }
    setTimeout(() => {
      redirectToSteamLogin();
    }, 200);
  };

  const handleLogout = () => {
    sound.playClick();
    setIsLoggedIn(false);
    setInitialOpenPremium(false);
    localStorage.removeItem('vortex_steam_auth');
    localStorage.removeItem('vortex_is_logged_in');
    localStorage.removeItem('vortex_steam_id');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0A0B0E] text-[#F1F5F9] font-sans selection:bg-[#A3E635]/30 selection:text-white">
      {!isLoggedIn ? (
        landingMode === 'pure-html' ? (
          <VortexPureHtmlLanding
            onLoginWithSteam={handleLoginWithSteam}
            onNavigateToTournaments={() => handleLoginWithSteam(false)}
            onNavigateToServers={() => handleLoginWithSteam(false)}
            onNavigateToLeaderboard={() => handleLoginWithSteam(false)}
            onNavigateToAbout={() => {}}
          />
        ) : (
          <VortexLandingPage
            onLoginWithSteam={handleLoginWithSteam}
            onNavigateToTournaments={() => handleLoginWithSteam(false)}
            onNavigateToServers={() => handleLoginWithSteam(false)}
            onNavigateToLeaderboard={() => handleLoginWithSteam(false)}
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

      {/* Steam OpenID 2.0 Redirect Transition Screen */}
      {isRedirectingToSteam && (
        <div className="fixed inset-0 z-[9999] bg-[#0A0B0E]/95 backdrop-blur-md flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#171A21] border border-[#2A475E] flex items-center justify-center shadow-[0_0_40px_rgba(42,71,94,0.6)] animate-pulse">
            <svg className="w-9 h-9 text-white fill-current" viewBox="0 0 24 24">
              <path d="M11.979 0C5.378 0 0 5.378 0 11.979c0 5.094 3.197 9.444 7.72 11.162l3.415-4.707a3.42 3.42 0 0 1-1.028-2.457c0-.285.035-.561.1-.825l-2.457-1.78a5.53 5.53 0 0 1-.09-.997c0-3.056 2.483-5.54 5.54-5.54 3.056 0 5.54 2.484 5.54 5.54 0 3.057-2.484 5.54-5.54 5.54l-2.585 3.56c.26.04.526.064.795.064 6.6 0 11.979-5.378 11.979-11.979C23.958 5.378 18.58 0 11.979 0z"/>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-display font-black text-white text-base tracking-wider uppercase">Connecting to Valve Steam...</h3>
            <p className="text-xs font-mono text-[#A0A2AD] mt-1">Directing to authentic steamcommunity.com login portal</p>
          </div>
        </div>
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
            if (isLoggedIn) {
              handleLogout();
            } else {
              setIsLoggedIn(true);
              localStorage.setItem('vortex_steam_auth', 'true');
            }
          }}
          className="px-3.5 py-1.5 rounded-full bg-[#18210C] hover:bg-[#253314] border border-[#A3E635]/40 text-xs font-mono text-[#A3E635] hover:text-white transition flex items-center gap-2 cursor-pointer shadow-sm outline-none focus:outline-none"
          title="Toggle between Landing Page and Dashboard view"
        >
          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
          <span>{isLoggedIn ? '👁️ View Landing (Logout)' : '👁️ Quick Demo Dashboard'}</span>
        </button>
      </div>
    </div>
  );
}
