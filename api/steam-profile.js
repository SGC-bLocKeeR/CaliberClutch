export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { steamId64 } = req.query || {};
  if (!steamId64 || typeof steamId64 !== 'string' || !/^\d{17}$/.test(steamId64)) {
    return res.status(400).json({ error: 'Valid 17-digit SteamID64 is required' });
  }

  try {
    const steamRes = await fetch(`https://steamcommunity.com/profiles/${steamId64}/?xml=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!steamRes.ok) {
      return res.status(200).json({
        steamId64,
        personaName: `SteamUser_${steamId64.slice(-4)}`,
        avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
      });
    }

    const xml = await steamRes.text();

    const steamIDMatch = xml.match(/<steamID><!\[CDATA\[(.*?)\]\]><\/steamID>/) || xml.match(/<steamID>(.*?)<\/steamID>/);
    const avatarFullMatch = xml.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/) || xml.match(/<avatarFull>(.*?)<\/avatarFull>/);
    const avatarMediumMatch = xml.match(/<avatarMedium><!\[CDATA\[(.*?)\]\]><\/avatarMedium>/) || xml.match(/<avatarMedium>(.*?)<\/avatarMedium>/);
    const countryMatch = xml.match(/<locCountryCode><!\[CDATA\[(.*?)\]\]><\/locCountryCode>/) || xml.match(/<locCountryCode>(.*?)<\/locCountryCode>/);

    const personaName = steamIDMatch ? steamIDMatch[1] : `SteamUser_${steamId64.slice(-4)}`;
    const avatarUrl = avatarFullMatch ? avatarFullMatch[1] : (avatarMediumMatch ? avatarMediumMatch[1] : 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg');
    const countryCode = countryMatch ? countryMatch[1] : 'XK';

    return res.status(200).json({
      steamId64,
      personaName,
      avatarUrl,
      countryCode
    });
  } catch (err) {
    return res.status(200).json({
      steamId64,
      personaName: `SteamUser_${steamId64.slice(-4)}`,
      avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
      fallback: true
    });
  }
}
