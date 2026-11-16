// ========================================================
// VORTEX GAMING - 24/7 AUTOMATED STEAM TRADE BOT DAEMON
// Handles CS2 Skin Deposits & Withdrawals via Official Steam API
// ========================================================

import SteamUser from 'steam-user';
import SteamCommunity from 'steamcommunity';
import TradeOfferManager from 'steam-tradeoffer-manager';
import SteamTotp from 'steam-totp';
import dotenv from 'dotenv';

dotenv.config();

const {
  STEAM_ACCOUNT_NAME,
  STEAM_PASSWORD,
  STEAM_SHARED_SECRET,
  STEAM_IDENTITY_SECRET,
  STEAM_API_KEY,
  VORTEX_API_URL = 'http://localhost:5175/api',
  VORTEX_BOT_SECRET_KEY = 'vortex_super_secure_bot_token_2026',
  BOT_POLL_INTERVAL_MS = '3000'
} = process.env;

console.log('========================================================');
console.log('🎮 VORTEX GAMING - STEAM FAST-TRACK BOT SERVICE');
console.log('========================================================');

if (!STEAM_ACCOUNT_NAME || !STEAM_PASSWORD) {
  console.warn('⚠️ [WARNING] STEAM_ACCOUNT_NAME or STEAM_PASSWORD not set in .env!');
  console.warn('⚠️ The bot is running in STANDBY MODE until credentials are provided in server/steam-bot/.env.');
  console.warn('⚠️ See server/steam-bot/README.md for instructions.');
}

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: 'en',
  pollInterval: parseInt(BOT_POLL_INTERVAL_MS, 10) || 5000
});

// 1. LOGIN PROCESS
function loginToSteam() {
  if (!STEAM_ACCOUNT_NAME || !STEAM_PASSWORD) return;

  const logOnOptions = {
    accountName: STEAM_ACCOUNT_NAME,
    password: STEAM_PASSWORD
  };

  if (STEAM_SHARED_SECRET) {
    logOnOptions.twoFactorCode = SteamTotp.getAuthCode(STEAM_SHARED_SECRET);
    console.log(`🔐 Generated 2FA Login Token for [${STEAM_ACCOUNT_NAME}]`);
  }

  client.logOn(logOnOptions);
}

client.on('loggedOn', () => {
  console.log(`✅ [VORTEX Bot] Successfully logged into Steam network as [${STEAM_ACCOUNT_NAME}]!`);
  client.setPersona(SteamUser.EPersonaState.Online, '[VORTEX] Fast-Track Bot #07');
  client.gamesPlayed([730]); // CS2 AppID
});

client.on('webSession', (sessionID, cookies) => {
  console.log('🌐 [VORTEX Bot] Steam Web Session established.');
  community.setCookies(cookies);

  manager.setCookies(cookies, (err) => {
    if (err) {
      console.error('❌ Error setting trade manager cookies:', err.message);
      return;
    }
    console.log('📦 [VORTEX Bot] Trade Offer Manager ready and active!');
  });
});

client.on('error', (err) => {
  console.error('❌ Steam client error:', err.message);
  if (err.eresult === SteamUser.EResult.AccountLogonDenied) {
    console.error('❌ Check your STEAM_SHARED_SECRET or twoFactorCode.');
  }
});

// 2. DISPATCHING REAL TRADE OFFER TO USER
export async function sendDepositTradeOffer({ tradeUrl, items, securityCode, orderId }) {
  return new Promise((resolve, reject) => {
    try {
      const offer = manager.createOffer(tradeUrl);

      // Add message with anti-phishing security token
      offer.setMessage(
        `VORTEX Gaming Fast-Track Deposit | Security Code: [${securityCode}] | Order: ${orderId}`
      );

      // CS2 AppID: 730, ContextID: 2
      manager.getUserInventoryContents(
        offer.partner,
        730,
        2,
        true,
        (err, userInventory) => {
          if (err) {
            console.error(`❌ Could not fetch user inventory for partner ${offer.partner}:`, err.message);
            return reject(err);
          }

          const matchedItems = [];
          for (const reqItem of items) {
            const found = userInventory.find(inv => 
              (reqItem.assetId && inv.id === reqItem.assetId) ||
              inv.market_hash_name === reqItem.fullName
            );
            if (found) {
              matchedItems.push(found);
              offer.addTheirItem(found);
            }
          }

          if (matchedItems.length === 0) {
            return reject(new Error('None of the requested items were found in user tradable inventory.'));
          }

          offer.send((sendErr, status) => {
            if (sendErr) {
              console.error('❌ Failed to send trade offer:', sendErr.message);
              return reject(sendErr);
            }

            console.log(`🚀 [VORTEX Bot] Trade Offer #${offer.id} sent to user! Status: ${status}`);

            // Automatically confirm with Steam Guard 2FA if identity_secret exists
            if (STEAM_IDENTITY_SECRET && status === 'pending') {
              community.acceptConfirmationForObject(STEAM_IDENTITY_SECRET, offer.id, (confErr) => {
                if (confErr) {
                  console.error('❌ Could not auto-confirm with 2FA:', confErr.message);
                } else {
                  console.log(`🛡️ [VORTEX Bot] Auto-confirmed offer #${offer.id} via Steam Guard 2FA!`);
                }
              });
            }

            resolve({
              success: true,
              tradeOfferId: offer.id,
              status
            });
          });
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

// 3. LISTEN FOR TRADE OFFER ACCEPTANCE (REAL-TIME CONFIRMATION)
manager.on('sentOfferChanged', async (offer, oldState) => {
  console.log(`🔄 Trade Offer #${offer.id} changed state: ${TradeOfferManager.ETradeOfferState[oldState]} -> ${TradeOfferManager.ETradeOfferState[offer.state]}`);

  // When offer is accepted by the user on Steam Mobile Authenticator
  if (offer.state === TradeOfferManager.ETradeOfferState.Accepted) {
    console.log(`🎉 [VORTEX Bot] Trade Offer #${offer.id} ACCEPTED by user! Processing wallet credit...`);

    try {
      // Notify VORTEX API that trade is completed
      const res = await fetch(`${VORTEX_API_URL}/trade-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VORTEX_BOT_SECRET_KEY}`
        },
        body: JSON.stringify({
          action: 'confirm',
          tradeOfferId: offer.id
        })
      });

      if (res.ok) {
        console.log(`💰 [VORTEX Bot] Successfully credited user wallet for trade #${offer.id}!`);
      }
    } catch (err) {
      console.error('❌ Error notifying VORTEX API of trade completion:', err.message);
    }
  }

  // When offer is declined or cancelled
  if (
    offer.state === TradeOfferManager.ETradeOfferState.Declined ||
    offer.state === TradeOfferManager.ETradeOfferState.Canceled
  ) {
    console.log(`⚠️ Trade offer #${offer.id} was declined or cancelled.`);
  }
});

// Start bot if configured
if (STEAM_ACCOUNT_NAME && STEAM_PASSWORD) {
  loginToSteam();
} else {
  console.log('ℹ️ Bot ready in standalone API mode.');
}
