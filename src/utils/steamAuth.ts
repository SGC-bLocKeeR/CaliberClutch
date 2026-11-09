/**
 * Official Valve Steam OpenID 2.0 Redirection Utility
 * Directs users to the authentic steamcommunity.com login portal
 * with real dynamic QR code and credentials authentication.
 */
export const getSteamOpenIdUrl = (): string => {
  const origin = window.location.origin;
  const returnTo = `${origin}/?steam_auth=approved`;
  const realm = `${origin}/`;

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
