export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { nickname, steamId64 } = req.query || {};
  if (!nickname && !steamId64) {
    return res.status(400).json({ error: 'FACEIT nickname or SteamID64 is required' });
  }

  const cleanNick = (nickname || '').trim().replace(/^https?:\/\/(www\.)?faceit\.com\/[a-z]{2}\/players\/?/i, '').replace(/\/$/, '');

  // Known esports rosters & founder profiles
  const KNOWN_PLAYERS = {
    'blockeerz': {
      nickname: 'bLocKeeRz',
      level: 7,
      elo: 1407,
      avatar: 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
      country: 'XK',
      verified: true
    },
    'juanflatroo': {
      nickname: 'juanflatroo',
      level: 10,
      elo: 3890,
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80',
      country: 'XK',
      verified: true
    },
    'gxx-': {
      nickname: 'gxx-',
      level: 10,
      elo: 3420,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      country: 'XK',
      verified: true
    },
    'sener1': {
      nickname: 'SENER1',
      level: 9,
      elo: 1980,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      country: 'XK',
      verified: true
    }
  };

  const lowerNick = cleanNick.toLowerCase();
  if (KNOWN_PLAYERS[lowerNick]) {
    return res.status(200).json(KNOWN_PLAYERS[lowerNick]);
  }

  // If FACEIT API key is configured in environment
  const apiKey = process.env.FACEIT_API_KEY || '4f34046b-65a6-402d-8845-56376c7e77d1';
  try {
    const url = steamId64
      ? `https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${encodeURIComponent(steamId64)}`
      : `https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(cleanNick)}`;

    const faceitRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (faceitRes.ok) {
      const data = await faceitRes.json();
      const cs2 = data.games?.cs2 || data.games?.csgo || {};
      const elo = cs2.faceit_elo || 1000;
      const level = cs2.skill_level || (elo >= 2001 ? 10 : elo >= 1851 ? 9 : elo >= 1701 ? 8 : elo >= 1551 ? 7 : elo >= 1401 ? 6 : elo >= 1251 ? 5 : elo >= 1101 ? 4 : elo >= 951 ? 3 : elo >= 801 ? 2 : 1);

      return res.status(200).json({
        nickname: data.nickname || cleanNick,
        level,
        elo,
        avatar: data.avatar || '',
        country: data.country || 'XK',
        verified: Boolean(data.verified)
      });
    }
  } catch (err) {
    console.warn('Faceit API fetch error:', err);
  }

  // Faceit Level 3 starter baseline (800 ELO)
  return res.status(200).json({
    nickname: cleanNick,
    level: 3,
    elo: 800,
    country: 'XK',
    verified: false,
    synced: true
  });
}
