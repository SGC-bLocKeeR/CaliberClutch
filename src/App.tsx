import React, { useState, useEffect } from 'react';
import { VortexLandingPage } from './components/vortex/VortexLandingPage';
import { VortexPureHtmlLanding } from './components/vortex/VortexPureHtmlLanding';
import { VortexDashboard } from './components/vortex/VortexDashboard';
import { sound } from './utils/soundEffects';
import { redirectToSteamLogin, parseSteamLoginParams, getSteamOpenIdUrl } from './utils/steamAuth';

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
    // Direct synchronous navigation avoids popup/redirect blocker restrictions
    try {
      window.location.href = getSteamOpenIdUrl();
    } catch (_) {
      setTimeout(() => {
        redirectToSteamLogin();
      }, 300);
    }
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
        <div className="fixed inset-0 z-[9999] bg-[#0A0B0E]/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 p-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#171A21] border border-[#2A475E] flex items-center justify-center shadow-[0_0_40px_rgba(42,71,94,0.6)] animate-pulse">
            <svg className="w-9 h-9 text-white fill-current" viewBox="0 0 24 24">
              <path d="M11.979 0C5.378 0 0 5.378 0 11.979c0 5.094 3.197 9.444 7.72 11.162l3.415-4.707a3.42 3.42 0 0 1-1.028-2.457c0-.285.035-.561.1-.825l-2.457-1.78a5.53 5.53 0 0 1-.09-.997c0-3.056 2.483-5.54 5.54-5.54 3.056 0 5.54 2.484 5.54 5.54 0 3.057-2.484 5.54-5.54 5.54l-2.585 3.56c.26.04.526.064.795.064 6.6 0 11.979-5.378 11.979-11.979C23.958 5.378 18.58 0 11.979 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-display font-black text-white text-base tracking-wider uppercase">Connecting to Valve Steam...</h3>
            <p className="text-xs font-mono text-[#A0A2AD] mt-1">Directing to authentic steamcommunity.com login portal</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
            <a
              href={getSteamOpenIdUrl()}
              className="px-4 py-2 rounded-xl bg-[#2A475E] hover:bg-[#3B6484] text-white text-xs font-semibold transition flex items-center gap-2 border border-[#66C0F4]/30 shadow-lg cursor-pointer"
            >
              <span>Continue to Steam ↗</span>
            </a>

            <button
              onClick={() => {
                sound.playClick();
                setIsRedirectingToSteam(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#141721] hover:bg-[#1E2333] border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
