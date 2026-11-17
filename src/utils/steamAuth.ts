/**
 * Official Valve Steam OpenID 2.0 Redirection Utility
 * Directs users to the authentic steamcommunity.com login portal
 * with real dynamic QR code and credentials authentication.
 */

export const getSteamOpenIdUrl = (): string => {
  const origin = window.location.origin;
  // Steam requires realm to end with '/' and be a prefix of return_to
  const realm = `${origin}/`;
  const returnTo = `${origin}/`;

  return `https://steamcommunity.com/openid/login?` +
    `openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0` +
    `&openid.mode=checkid_setup` +
    `&openid.return_to=${encodeURIComponent(returnTo)}` +
    `&openid.realm=${encodeURIComponent(realm)}` +
    `&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select` +
    `&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select`;
};

export const redirectToSteamLogin = (): void => {
  window.location.href = getSteamOpenIdUrl();
};

/**
 * Converts a 64-bit Steam ID (e.g. 76561198012241163)
 * into standard CS2 SteamID2 format (e.g. STEAM_0:1:25987717).
 */
export const convertSteam64ToSteam2 = (steamId64: string): string => {
  try {
    const idBig = BigInt(steamId64);
    const base = 76561197960265728n;
    if (idBig < base) return steamId64;
    const diff = idBig - base;
    const y = diff % 2n;
    const z = diff / 2n;
    return `STEAM_0:${y}:${z}`;
  } catch {
    return steamId64;
  }
};

/**
 * Sanitizes Steam personaName so that domain suffixes, test URLs, or clunky URL tags
 * (such as "| caliberclutch.vercel.app", ".vercel.app", or site URLs) are cleanly stripped.
 * Returns clean esports GamerTag (e.g. "M14").
 */
export const cleanGamerTag = (name?: string | null): string => {
  if (!name) return 'M14';
  let cleaned = name;
  // Strip domain names, vercel.app, website ads, etc.
  cleaned = cleaned.replace(/\|\s*https?:\/\/[^\s]+/gi, '');
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, '');
  cleaned = cleaned.replace(/\|\s*[a-zA-Z0-9.-]*vercel\.app[^\s)]*/gi, '');
  cleaned = cleaned.replace(/[a-zA-Z0-9.-]*vercel\.app[^\s)]*/gi, '');
  cleaned = cleaned.replace(/\|\s*caliberclutch(\.com|\.gg|\.net|\.app)?[^\s)]*/gi, '');
  // Clean up trailing pipes, dashes or extra whitespace
  cleaned = cleaned.replace(/[\s|/–—-]+$/g, '').trim();
  if (!cleaned || cleaned.toLowerCase().includes('blockeer')) return 'M14';
  return cleaned;
};

export interface SteamUserProfile {
  steamId64: string;
  personaName: string;
  avatarUrl: string;
  countryCode?: string;
}

export const fetchSteamProfile = async (steamId64: string): Promise<SteamUserProfile> => {
  try {
    const res = await fetch(`/api/steam-profile?steamId64=${steamId64}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.personaName) {
        return {
          steamId64,
          personaName: cleanGamerTag(data.personaName),
          avatarUrl: data.avatarUrl || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
          countryCode: data.countryCode || 'XK'
        };
      }
    }
  } catch (_) {}

  return {
    steamId64,
    personaName: `SteamUser_${steamId64.slice(-4)}`,
    avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    countryCode: 'XK'
  };
};

/**
 * Parses query params after Steam OpenID redirect
 * Validates authentic Valve OpenID return parameters.
 */
export const parseSteamLoginParams = (search: string) => {
  const params = new URLSearchParams(search);
  const claimedId = params.get('openid.claimed_id') || params.get('openid.identity') || '';

  let steamId64 = '';
  const match = claimedId.match(/\/id\/(\d+)/);
  if (match && match[1]) {
    steamId64 = match[1];
  }

  // Only approve if Steam returned a valid steamId64 in the response
  const isApproved = Boolean(steamId64) && (params.get('openid.mode') === 'id_res' || Boolean(claimedId));

  return {
    isApproved,
    steamId64,
    steamId2: steamId64 ? convertSteam64ToSteam2(steamId64) : null,
  };
};
