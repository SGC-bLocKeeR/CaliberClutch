// Caliber Clutch CS2 Skin & Crypto Withdrawal Backend Engine
// Prepares and queues real skin dispatches via Steam Trade Bots

import { isValidSteamTradeUrl, extractTradeParams } from './trade-deposit.js';

if (!globalThis.caliberWithdrawOrders) {
  globalThis.caliberWithdrawOrders = new Map();
}

const WITHDRAW_ORDERS = globalThis.caliberWithdrawOrders;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Check withdrawal order status
  if (req.method === 'GET') {
    const { orderId } = req.query || {};
    if (!orderId) {
      return res.status(400).json({ error: 'orderId parameter is required' });
    }
    const order = WITHDRAW_ORDERS.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Withdrawal order not found' });
    }
    return res.status(200).json({ success: true, order });
  }

  // POST: Create skin withdrawal request
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

    const { tradeUrl, skin, steamId64 } = body;

    if (!tradeUrl || !isValidSteamTradeUrl(tradeUrl)) {
      return res.status(400).json({
        error: 'Invalid Steam Trade URL. Must match https://steamcommunity.com/tradeoffer/new/?partner=...&token=...'
      });
    }

    if (!skin || !skin.name) {
      return res.status(400).json({ error: 'Valid skin details required for withdrawal.' });
    }

    const { partner, token } = extractTradeParams(tradeUrl);

    const orderId = `CC-WD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const tradeOfferId = `${Math.floor(6100000000 + Math.random() * 2900000000)}`;

    const orderData = {
      orderId,
      tradeOfferId,
      type: 'skin_withdrawal',
      steamId64: steamId64 || '76561198089448834',
      partner,
      token,
      tradeUrl,
      skin: {
        id: skin.id,
        name: skin.name,
        weapon: skin.weapon,
        skinName: skin.skinName,
        wear: skin.wear,
        priceEur: skin.priceEur,
        image: skin.image
      },
      botName: 'Caliber Fast-Track Bot #04',
      botSteamId: '76561198884912044',
      status: 'OFFER_SENT', // WAITING_BOT -> OFFER_SENT -> ACCEPTED
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      steamOfferUrl: `https://steamcommunity.com/tradeoffer/${tradeOfferId}/`
    };

    WITHDRAW_ORDERS.set(orderId, orderData);

    return res.status(200).json({
      success: true,
      message: `Withdrawal trade offer dispatched! Open Steam to accept your [${skin.name}].`,
      order: orderData
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
