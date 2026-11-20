export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};
  const organizerId = (query.organizerId || '4f34046b-65a6-402d-8845-56376c7e77d1').trim();
  const action = query.action || 'details'; // 'details' | 'tournaments'

  // Extract API key from Authorization header or query param
  const authHeader = req.headers['authorization'] || '';
  const apiKey = (authHeader.replace(/^Bearer\s+/i, '') || query.apiKey || '').trim();

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      live: false,
      error: 'Mungon FACEIT API Key! Shkoni te Tab 1 (developers.faceit.com) > My Apps > API Keys, gjeneroni Server API Key dhe vendoseni këtu.'
    });
  }

  try {
    const baseUrl = 'https://open.faceit.com/data/v4';
    const targetUrl = action === 'tournaments'
      ? `${baseUrl}/tournaments?organizer_id=${encodeURIComponent(organizerId)}&limit=20`
      : `${baseUrl}/organizers/${encodeURIComponent(organizerId)}`;

    const faceitRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'User-Agent': 'CaliberClutch-Platform/1.0'
      }
    });

    const data = await faceitRes.json().catch(() => ({}));

    if (!faceitRes.ok) {
      const errMsg = data?.errors?.[0]?.message || data?.message || `HTTP ${faceitRes.status}`;
      return res.status(faceitRes.status).json({
        success: false,
        live: true,
        statusCode: faceitRes.status,
        error: `FACEIT API Refuzoi Lidhjen (${faceitRes.status}): ${errMsg}. Kontrolloni nëse API Key te developers.faceit.com ka lejet e duhura.`
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
