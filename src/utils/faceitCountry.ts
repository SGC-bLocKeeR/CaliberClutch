// Mapping of Faceit ISO country codes / country names to official Country Name & Emoji Flag
const FACEIT_COUNTRY_MAP: Record<string, { country: string; flag: string }> = {
  // Balkan & Regional
  xk: { country: 'Kosovo', flag: '🇽🇰' },
  kosovo: { country: 'Kosovo', flag: '🇽🇰' },
  al: { country: 'Albania', flag: '🇦🇱' },
  albania: { country: 'Albania', flag: '🇦🇱' },
  mk: { country: 'North Macedonia', flag: '🇲🇰' },
  macedonia: { country: 'North Macedonia', flag: '🇲🇰' },
  me: { country: 'Montenegro', flag: '🇲🇪' },
  montenegro: { country: 'Montenegro', flag: '🇲🇪' },
  ba: { country: 'Bosnia', flag: '🇧🇦' },
  bosnia: { country: 'Bosnia', flag: '🇧🇦' },
  rs: { country: 'Serbia', flag: '🇷🇸' },
  serbia: { country: 'Serbia', flag: '🇷🇸' },
  hr: { country: 'Croatia', flag: '🇭🇷' },
  croatia: { country: 'Croatia', flag: '🇭🇷' },
  si: { country: 'Slovenia', flag: '🇸🇮' },
  slovenia: { country: 'Slovenia', flag: '🇸🇮' },
  gr: { country: 'Greece', flag: '🇬🇷' },
  greece: { country: 'Greece', flag: '🇬🇷' },
  bg: { country: 'Bulgaria', flag: '🇧🇬' },
  bulgaria: { country: 'Bulgaria', flag: '🇧🇬' },
  ro: { country: 'Romania', flag: '🇷🇴' },
  romania: { country: 'Romania', flag: '🇷🇴' },
  tr: { country: 'Turkey', flag: '🇹🇷' },
  turkey: { country: 'Turkey', flag: '🇹🇷' },

  // Western & Northern Europe
  de: { country: 'Germany', flag: '🇩🇪' },
  germany: { country: 'Germany', flag: '🇩🇪' },
  ch: { country: 'Switzerland', flag: '🇨🇭' },
  switzerland: { country: 'Switzerland', flag: '🇨🇭' },
  at: { country: 'Austria', flag: '🇦🇹' },
  austria: { country: 'Austria', flag: '🇦🇹' },
  se: { country: 'Sweden', flag: '🇸🇪' },
  sweden: { country: 'Sweden', flag: '🇸🇪' },
  no: { country: 'Norway', flag: '🇳🇴' },
  norway: { country: 'Norway', flag: '🇳🇴' },
  dk: { country: 'Denmark', flag: '🇩🇰' },
  denmark: { country: 'Denmark', flag: '🇩🇰' },
  fi: { country: 'Finland', flag: '🇫🇮' },
  finland: { country: 'Finland', flag: '🇫🇮' },
  gb: { country: 'United Kingdom', flag: '🇬🇧' },
  uk: { country: 'United Kingdom', flag: '🇬🇧' },
  fr: { country: 'France', flag: '🇫🇷' },
  france: { country: 'France', flag: '🇫🇷' },
  nl: { country: 'Netherlands', flag: '🇳🇱' },
  netherlands: { country: 'Netherlands', flag: '🇳🇱' },
  be: { country: 'Belgium', flag: '🇧🇪' },
  belgium: { country: 'Belgium', flag: '🇧🇪' },
  it: { country: 'Italy', flag: '🇮🇹' },
  italy: { country: 'Italy', flag: '🇮🇹' },
  es: { country: 'Spain', flag: '🇪🇸' },
  spain: { country: 'Spain', flag: '🇪🇸' },
  pt: { country: 'Portugal', flag: '🇵🇹' },
  portugal: { country: 'Portugal', flag: '🇵🇹' },

  // Eastern Europe & CIS
  ua: { country: 'Ukraine', flag: '🇺🇦' },
  ukraine: { country: 'Ukraine', flag: '🇺🇦' },
  ru: { country: 'Russia', flag: '🇷🇺' },
  russia: { country: 'Russia', flag: '🇷🇺' },
  pl: { country: 'Poland', flag: '🇵🇱' },
  poland: { country: 'Poland', flag: '🇵🇱' },
  cz: { country: 'Czech Republic', flag: '🇨🇿' },
  'czech republic': { country: 'Czech Republic', flag: '🇨🇿' },
  sk: { country: 'Slovakia', flag: '🇸🇰' },
  slovakia: { country: 'Slovakia', flag: '🇸🇰' },
  hu: { country: 'Hungary', flag: '🇭🇺' },
  hungary: { country: 'Hungary', flag: '🇭🇺' },
  ee: { country: 'Estonia', flag: '🇪🇪' },
  estonia: { country: 'Estonia', flag: '🇪🇪' },
  lv: { country: 'Latvia', flag: '🇱🇻' },
  latvia: { country: 'Latvia', flag: '🇱🇻' },
  lt: { country: 'Lithuania', flag: '🇱🇹' },
  lithuania: { country: 'Lithuania', flag: '🇱🇹' },

  // Americas & Others
  us: { country: 'United States', flag: '🇺🇸' },
  usa: { country: 'United States', flag: '🇺🇸' },
  ca: { country: 'Canada', flag: '🇨🇦' },
  canada: { country: 'Canada', flag: '🇨🇦' },
  br: { country: 'Brazil', flag: '🇧🇷' },
  brazil: { country: 'Brazil', flag: '🇧🇷' },
  il: { country: 'Israel', flag: '🇮🇱' },
  israel: { country: 'Israel', flag: '🇮🇱' },
  gt: { country: 'Guatemala', flag: '🇬🇹' },
  guatemala: { country: 'Guatemala', flag: '🇬🇹' }
};

/**
 * Resolves country name and emoji flag from Faceit country code or name.
 * If Faceit provides 'xk' -> { country: 'Kosovo', flag: '🇽🇰' }
 * Defaults to Faceit's raw value or Kosovo.
 */
export function getFaceitCountryInfo(rawFaceitCountry?: string): { country: string; flag: string } {
  if (!rawFaceitCountry) {
    return { country: 'Kosovo', flag: '🇽🇰' };
  }

  const clean = rawFaceitCountry.trim().toLowerCase();
  if (FACEIT_COUNTRY_MAP[clean]) {
    return FACEIT_COUNTRY_MAP[clean];
  }

  // Capitalize properly if unmapped
  const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    country: formatted,
    flag: '🌐'
  };
}
