export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};
  const organizerId = (query.organizerId || '4f34046b-65a6-402d-8845-56376c7e77d1').trim();
  const action = query.action || 'details'; // 'details' | 'tournaments' | 'championships'

  // Extract API key from Authorization header, query param, or fallback to real registered key
  const authHeader = req.headers['authorization'] || '';
  const apiKey = (authHeader.replace(/^Bearer\s+/i, '') || query.apiKey || '415f900d-b6bb-44d1-84a5-558df86204b9').trim();

  try {
    const baseUrl = 'https://open.faceit.com/data/v4';
    let targetUrl = `${baseUrl}/organizers/${encodeURIComponent(organizerId)}`;

    if (action === 'tournaments') {
      targetUrl = `${baseUrl}/organizers/${encodeURIComponent(organizerId)}/tournaments`;
    } else if (action === 'championships') {
      targetUrl = `${baseUrl}/organizers/${encodeURIComponent(organizerId)}/championships`;
    }

    const faceitRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CaliberClutch/1.0'
      }
    });

    const data = await faceitRes.json().catch(() => ({}));

    if (!faceitRes.ok) {
      const errMsg = data?.errors?.[0]?.message || data?.message || `HTTP ${faceitRes.status}`;
      return res.status(faceitRes.status).json({
        success: false,
        live: true,
        statusCode: faceitRes.status,
        error: `FACEIT API: ${errMsg}`
      });
    }

    return res.status(200).json({
      success: true,
      live: true,
      action,
      organizerId,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      live: false,
      error: `Gabim rrjeti gjatë thirrjes së FACEIT Open API: ${err.message}`
    });
  }
}
