// CS2 Real-Time Live Pricing API (Skinport & Steam Market EUR)
let cachedPrices = {
  timestamp: 0,
  map: new Map(),
  fetching: null
};

const TTL_MS = 15 * 60 * 1000;

async function getPrices() {
  const now = Date.now();
  if (cachedPrices.map.size > 0 && now - cachedPrices.timestamp < TTL_MS) {
    return cachedPrices.map;
  }
  if (cachedPrices.fetching) return cachedPrices.fetching;

  cachedPrices.fetching = (async () => {
    try {
      const res = await fetch('https://api.skinport.com/v1/items?currency=EUR', {
        headers: {
          'Accept-Encoding': 'br, gzip, deflate',
          'User-Agent': 'CaliberClutch-Pricing-Engine/2.0'
        }
      });
      if (res.ok) {
        const items = await res.json();
        const map = new Map();
        for (const it of items) {
          const val = Number(it.suggested_price || it.min_price || it.median_price || 0);
          if (val > 0) {
            map.set(it.market_hash_name, {
              suggested_price: it.suggested_price ? parseFloat(Number(it.suggested_price).toFixed(2)) : null,
              min_price: it.min_price ? parseFloat(Number(it.min_price).toFixed(2)) : null,
              median_price: it.median_price ? parseFloat(Number(it.median_price).toFixed(2)) : null,
              price: parseFloat(val.toFixed(2)),
              updated_at: it.updated_at
            });
          }
        }
        cachedPrices.map = map;
        cachedPrices.timestamp = Date.now();
      }
    } catch (e) {
      console.warn('Skinport fetch failed:', e.message);
    } finally {
      cachedPrices.fetching = null;
    }
    return cachedPrices.map;
  })();

  return cachedPrices.fetching;
}

function sendResponse(res, statusCode, payload) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end ? res.end() : res.status(200).end();
  }

  let query = req.query;
  if (!query && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      query = Object.fromEntries(parsedUrl.searchParams.entries());
    } catch (e) {
      query = {};
    }
  }

  const { items: queryItems, name } = query || {};
  const priceMap = await getPrices();

  if (name) {
    const data = priceMap.get(name) || null;
    return sendResponse(res, 200, { success: true, name, data });
  }

  if (queryItems) {
    const names = queryItems.split(',').map(s => s.trim()).filter(Boolean);
    const results = {};
    for (const n of names) {
      results[n] = priceMap.get(n) || null;
    }
    return sendResponse(res, 200, { success: true, count: names.length, prices: results });
  }

  return sendResponse(res, 200, {
    success: true,
    totalTracked: priceMap.size,
    lastUpdated: new Date(cachedPrices.timestamp).toISOString(),
    currency: 'EUR'
  });
}
