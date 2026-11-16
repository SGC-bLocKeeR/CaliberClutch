// VORTEX CS2 Skin2PAY Trade Status & Webhook Poller
// Returns real-time status of dispatched Steam Trade Offers

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TRADE_ORDERS = globalThis.vortexTradeOrders || new Map();

  // GET: Check Trade Status
  if (req.method === 'GET') {
    const { orderId } = req.query || {};
    if (!orderId) {
      return res.status(400).json({ error: 'orderId parameter is required' });
    }

    const order = TRADE_ORDERS.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Trade order not found or expired.' });
    }

    // Check expiration
    if (Date.now() > order.expiresAt && order.status !== 'COMPLETED') {
      order.status = 'EXPIRED';
    }

    return res.status(200).json({
      success: true,
      order
    });
  }

  // POST: Update Trade Status (from Steam Bot Webhook or User Confirmation)
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

    const { orderId, action } = body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const order = TRADE_ORDERS.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Trade order not found' });
    }

    if (action === 'confirm' || action === 'accept') {
      order.status = 'COMPLETED';
      order.completedAt = Date.now();
      TRADE_ORDERS.set(orderId, order);

      return res.status(200).json({
        success: true,
        message: 'Trade marked as completed. Funds authorized for wallet credit.',
        order
      });
    }

    if (action === 'cancel' || action === 'decline') {
      order.status = 'DECLINED';
      order.cancelledAt = Date.now();
      TRADE_ORDERS.set(orderId, order);

      return res.status(200).json({
        success: true,
        message: 'Trade marked as declined.',
        order
      });
    }

    return res.status(400).json({ error: 'Invalid action. Supported: confirm, cancel' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
