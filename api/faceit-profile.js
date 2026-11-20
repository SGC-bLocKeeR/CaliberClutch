import fs from 'node:fs';
import path from 'node:path';

// Server-side database / cache for FACEIT stats (strictly separated from CaliberClutch platform ELO)
if (!globalThis.faceitProfilesCache) {
  globalThis.faceitProfilesCache = new Map();
}

const CACHE = globalThis.faceitProfilesCache;
const COOLDOWN_MS = 60 * 60 * 1000; // 1-hour cooldown as mandated by system rules

// Try to load any previously persisted cache on server start
function getCacheFilePath() {
  const tmpDir = process.env.TMPDIR || process.env.TEMP || '/tmp';
  return path.join(tmpDir, 'caliberclutch_faceit_cache.json');
}

function loadPersistedCache() {
  try {
    const file = getCacheFilePath();
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (typeof data === 'object' && data !== null) {
        for (const [k, v] of Object.entries(data)) {
          CACHE.set(k, v);
        }
      }
    }
  } catch (err) {
    // Non-fatal fallback to in-memory map
  }
}

function savePersistedCache() {
  try {
    const file = getCacheFilePath();
    const obj = Object.fromEntries(CACHE.entries());
    fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal on read-only environments
  }
}

loadPersistedCache();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const { steamId64, force } = req.query || {};
  const cleanSteamId = (steamId64 || '').trim();

  if (!cleanSteamId) {
    return res.status(400).json({ error: 'steamId64 is required' });
  }

  const now = Date.now();
  const cached = CACHE.get(cleanSteamId);

  // Check 1-hour cooldown
  if (cached && !force) {
    const elapsed = now - cached.lastUpdated;
    if (elapsed < COOLDOWN_MS) {
      return res.status(200).json({
        ...cached,
        cached: true,
        cooldownRemainingMs: Math.max(0, COOLDOWN_MS - elapsed),
        cooldownMinutesRemaining: Math.ceil(Math.max(0, COOLDOWN_MS - elapsed) / 60000)
      });
    }
  } else if (cached && force) {
    const elapsed = now - cached.lastUpdated;
    if (elapsed < COOLDOWN_MS) {
      return res.status(429).json({
        error: 'Cooldown active',
        message: `Stats were refreshed recently. Please wait ${Math.ceil((COOLDOWN_MS - elapsed) / 60000)} minute(s) before refreshing again.`,
        cached: true,
        data: cached,
        cooldownRemainingMs: Math.max(0, COOLDOWN_MS - elapsed),
        cooldownMinutesRemaining: Math.ceil((COOLDOWN_MS - elapsed) / 60000)
      });
    }
  }

  const apiKey = process.env.FACEIT_API_KEY || '4f34046b-65a6-402d-8845-56376c7e77d1';

  try {
    // Step 1: Query FACEIT player by SteamID64 for CS2
    const playerUrl = `https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${encodeURIComponent(cleanSteamId)}`;
    const playerRes = await fetch(playerUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    // 404: No FACEIT account linked to this SteamID64
    if (playerRes.status === 404) {
      const unlinkedResult = {
        linked: false,
        steamId64: cleanSteamId,
        message: 'No FACEIT account linked to this Steam ID',
        lastUpdated: now,
        cooldownRemainingMs: COOLDOWN_MS
      };
      CACHE.set(cleanSteamId, unlinkedResult);
      savePersistedCache();
      return res.status(200).json(unlinkedResult);
    }

    if (!playerRes.ok) {
      const errText = await playerRes.text().catch(() => '');
      console.warn(`FACEIT Player API returned status ${playerRes.status}:`, errText);

      // Return cached if available
      if (cached) {
        return res.status(200).json({
          ...cached,
          cached: true,
          warning: 'Could not reach FACEIT API; returning cached stats.',
          cooldownRemainingMs: 0
        });
      }

      // Development / founder fallback when API key is not yet configured in local environment
      if (cleanSteamId === '76561198089448834' || cleanSteamId === '76561198000000000') {
        const demoData = {
          linked: true,
          steamId64: cleanSteamId,
          playerId: 'ac453a50-dbca-4d42-a740-dac12bdc74c0',
          nickname: 'bLocKeeRz',
          avatar: 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
          level: 7,
          faceitElo: 1407,
          kdRatio: '1.24',
          winRate: '58%',
          hsPercentage: '52%',
          matches: 1420,
          faceitUrl: 'https://www.faceit.com/en/players/bLocKeeRz',
          lastUpdated: now,
          cooldownRemainingMs: COOLDOWN_MS,
          cooldownMinutesRemaining: 60
        };
        CACHE.set(cleanSteamId, demoData);
        savePersistedCache();
        return res.status(200).json(demoData);
      }

      return res.status(playerRes.status).json({
        error: 'FACEIT API error',
        message: 'Unable to communicate with FACEIT servers. Please verify FACEIT_API_KEY.',
        linked: false
      });
    }

    const playerData = await playerRes.json();
    const playerId = playerData.player_id;
    const nickname = playerData.nickname || cleanSteamId;
    const avatar = playerData.avatar || '';
    const cs2Game = playerData.games?.cs2 || playerData.games?.csgo || {};
    const faceitElo = cs2Game.faceit_elo || 1000;
    
    // Skill Level (1-10)
    let level = cs2Game.skill_level;
    if (!level) {
      if (faceitElo >= 2001) level = 10;
      else if (faceitElo >= 1851) level = 9;
      else if (faceitElo >= 1701) level = 8;
      else if (faceitElo >= 1551) level = 7;
      else if (faceitElo >= 1401) level = 6;
      else if (faceitElo >= 1251) level = 5;
      else if (faceitElo >= 1101) level = 4;
      else if (faceitElo >= 951) level = 3;
      else if (faceitElo >= 801) level = 2;
      else level = 1;
    }

    // Step 2: Query CS2 Stats for player_id
    let kdRatio = '1.00';
    let winRate = '50%';
    let hsPercentage = '40%';
    let matches = 0;

    if (playerId) {
      try {
        const statsUrl = `https://open.faceit.com/data/v4/players/${encodeURIComponent(playerId)}/stats/cs2`;
        const statsRes = await fetch(statsUrl, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
          }
        });

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          const lifetime = statsData.lifetime || {};
          
          kdRatio = lifetime['Average K/D Ratio'] || lifetime['K/D Ratio'] || '1.00';
          const rawWinRate = lifetime['Win Rate %'] || lifetime['Win Rate'];
          winRate = rawWinRate ? (rawWinRate.includes('%') ? rawWinRate : `${rawWinRate}%`) : '50%';
          const rawHs = lifetime['Average Headshots %'] || lifetime['Headshots %'];
          hsPercentage = rawHs ? (rawHs.includes('%') ? rawHs : `${rawHs}%`) : '40%';
          matches = parseInt(lifetime['Matches'] || '0', 10);
        }
      } catch (statsErr) {
        console.warn('FACEIT Stats API fetch error:', statsErr);
      }
    }

    const result = {
      linked: true,
      steamId64: cleanSteamId,
      playerId,
      nickname,
      avatar,
      level,
      faceitElo,
      kdRatio,
      winRate,
      hsPercentage,
      matches,
      faceitUrl: `https://www.faceit.com/en/players/${encodeURIComponent(nickname)}`,
      lastUpdated: now,
      cooldownRemainingMs: COOLDOWN_MS,
      cooldownMinutesRemaining: 60
    };

    CACHE.set(cleanSteamId, result);
    savePersistedCache();

    return res.status(200).json(result);
  } catch (err) {
    console.error('Faceit Profile Handler Error:', err);

    if (cached) {
      return res.status(200).json({
        ...cached,
        cached: true,
        warning: 'Encountered temporary error; returning cached stats.',
        cooldownRemainingMs: 0
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: err.message || 'Unexpected server error while fetching FACEIT stats.'
    });
  }
}
