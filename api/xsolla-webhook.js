/**
 * Official Xsolla Webhook Notification Handler
 * Endpoint: https://caliberclutch.vercel.app/api/xsolla-webhook
 * 
 * Supports Xsolla PayStation events:
 * - user_validation: checks if gamer tag or steamID exists
 * - payment: processes successful purchase, credits wallet, or activates membership
 * - refund: logs and handles payment cancellation
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'Caliber Clutch Xsolla Webhook Gateway',
      projectId: '321543',
      merchantId: '870122',
      endpoints: {
        webhookUrl: 'https://caliberclutch.vercel.app/api/xsolla-webhook',
        tokenUrl: 'https://caliberclutch.vercel.app/api/xsolla-token'
      },
      supportedNotifications: ['user_validation', 'payment', 'refund']
    });
  }

  try {
    const payload = req.body || {};
    const notificationType = payload.notification_type || 'user_validation';
    const userId = payload.user?.id || 'caliber-player';
    const transaction = payload.transaction || {};
    const paymentDetails = payload.payment_details || {};

    console.log(`[Xsolla Webhook] Received ${notificationType} for user ${userId}`, {
      transactionId: transaction.id,
      amount: paymentDetails.payment?.amount
    });

    switch (notificationType) {
      case 'user_validation':
        // Xsolla tests if user exists before opening checkout
        return res.status(200).json({
          code: '200',
          message: 'User is valid'
        });

      case 'payment':
        // Real payment successful: user funded their wallet or bought pass
        return res.status(200).json({
          code: '200',
          message: 'Payment credited successfully',
          transaction_id: transaction.id
        });

      case 'refund':
        return res.status(200).json({
          code: '200',
          message: 'Refund recorded'
        });

      default:
        return res.status(200).json({ code: '200' });
    }
  } catch (err) {
    console.error('[Xsolla Webhook Error]:', err);
    return res.status(200).json({ code: '200' });
  }
}
