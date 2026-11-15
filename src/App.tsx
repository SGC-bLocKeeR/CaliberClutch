import React, { useState, useEffect } from 'react';
import { VortexLandingPage } from './components/vortex/VortexLandingPage';
import { VortexPureHtmlLanding } from './components/vortex/VortexPureHtmlLanding';
import { VortexDashboard } from './components/vortex/VortexDashboard';
import { sound } from './utils/soundEffects';
import { redirectToSteamLogin, parseSteamLoginParams, getSteamOpenIdUrl, fetchSteamProfile } from './utils/steamAuth';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('vortex_steam_auth') === 'true' || localStorage.getItem('vortex_is_logged_in') === 'true';
  });

  const [landingMode] = useState<'pure-html' | 'image-reference'>('pure-html');
  const [userGamerTag, setUserGamerTag] = useState<string>(() => {
    return localStorage.getItem('vortex_user_gamertag') || 'bLocKeeRz';
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('vortex_user_avatar') || 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg';
  });
  const [initialOpenPremium, setInitialOpenPremium] = useState<boolean>(false);

  useEffect(() => {
    // Check if returning from authentic Valve Steam OpenID 2.0
    const { isApproved, steamId64, steamId2 } = parseSteamLoginParams(window.location.search);

    if (isApproved && steamId64) {
      localStorage.setItem('vortex_steam_id', steamId2 || steamId64);
      localStorage.setItem('vortex_steam_id64', steamId64);
      localStorage.setItem('vortex_steam_auth', 'true');

      // Fetch authentic Steam persona name & avatar from Steam Community API
      fetchSteamProfile(steamId64).then((profile) => {
        if (profile?.personaName) {
          setUserGamerTag(profile.personaName);
          localStorage.setItem('vortex_user_gamertag', profile.personaName);

          // If a new player / nephew logs in with Steam, ensure they start unverified with starter level
          if (profile.personaName !== 'bLocKeeRz') {
            const hasLinkedFaceit = localStorage.getItem('vortex_faceit_connected') === 'true';
            if (!hasLinkedFaceit) {
              localStorage.setItem('vortex_user_level', '1');
              localStorage.setItem('vortex_user_elo', '800');
              localStorage.setItem('vortex_user_verification', 'none');
            }
          }
        }
        if (profile?.avatarUrl) {
          setAvatarUrl(profile.avatarUrl);
          localStorage.setItem('vortex_user_avatar', profile.avatarUrl);
        }
      }).catch(() => {});

      const shouldOpenUpgrade = sessionStorage.getItem('vortex_pending_upgrade') === 'true';
      sessionStorage.removeItem('vortex_pending_upgrade');

      // Always purge URL query params immediately so copying or sharing link gives clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsLoggedIn(true);
      setInitialOpenPremium(shouldOpenUpgrade);

      try {
        sound.playTournamentVictory();
      } catch (_) {}
    } else if (window.location.search.includes('openid.') || window.location.search.includes('steam_auth=')) {
      // Purge any stale or invalid auth params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLoginWithSteam = (openUpgrade: boolean = false) => {
    sound.playSelect();
    if (openUpgrade) {
      sessionStorage.setItem('vortex_pending_upgrade', 'true');
    }
    // Direct instant navigation straight to Valve Steam OpenID portal
    window.location.href = getSteamOpenIdUrl();
  };

  const handleLogout = () => {
    sound.playClick();
    setIsLoggedIn(false);
    setInitialOpenPremium(false);
    localStorage.removeItem('vortex_steam_auth');
    localStorage.removeItem('vortex_is_logged_in');
    localStorage.removeItem('vortex_steam_id');
    localStorage.removeItem('vortex_steam_id64');
    localStorage.removeItem('vortex_user_gamertag');
    localStorage.removeItem('vortex_user_avatar');
    localStorage.removeItem('vortex_user_level');
    localStorage.removeItem('vortex_user_elo');
    localStorage.removeItem('vortex_user_verification');
    localStorage.removeItem('vortex_faceit_nickname');
    localStorage.removeItem('vortex_faceit_connected');
    setUserGamerTag('bLocKeeRz');
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
    </div>
  );
}
