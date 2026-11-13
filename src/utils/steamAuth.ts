/**
 * Official Valve Steam OpenID 2.0 Redirection Utility
 * Directs users to the authentic steamcommunity.com login portal
 * with real dynamic QR code and credentials authentication.
 */

export const getSteamOpenIdUrl = (): string => {
  const origin = window.location.origin;
  // Steam requires realm to end with '/' and be a prefix of return_to
  const realm = `${origin}/`;
  const returnTo = `${origin}/?steam_auth=approved`;

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
 * Parses query params after Steam OpenID redirect
 */
export const parseSteamLoginParams = (search: string) => {
  const params = new URLSearchParams(search);
  const claimedId = params.get('openid.claimed_id') || params.get('openid.identity') || '';
  const isApproved = 
    Boolean(claimedId) ||
    params.get('steam_auth') === 'approved' ||
    params.get('steam_auth') === 'success' ||
    params.get('openid.mode') === 'id_res';

  let steamId64 = '';
  const match = claimedId.match(/\/id\/(\d+)/);
  if (match && match[1]) {
    steamId64 = match[1];
  }

  return {
    isApproved,
    steamId64,
    steamId2: steamId64 ? convertSteam64ToSteam2(steamId64) : null,
  };
};
