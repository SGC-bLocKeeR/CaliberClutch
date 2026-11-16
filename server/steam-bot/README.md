# VORTEX Gaming - CS2 Automated Steam Trade Bot

Ky shërbim (`server/steam-bot`) është daemon-i zyrtar në **Node.js** që automatizon **100% tregtinë e armëve në Steam (CS2 Skin2PAY & Withdrawals)**, ekzaktësisht si Farmskins dhe Hellcase.

---

## 📋 Çfarë bën ky shërbim?
1. **Kyçet automatikisht në llogarinë e Bot-it në Steam** duke përdorur Steam Guard 2FA (`steam-totp`).
2. **Dërgon oferta të vërteta shkëmbimi (Trade Offers)** drejt `tradeUrl` të lojtarit.
3. **Përfshin Kodin e Sigurisë (Anti-Phishing Token)** në mesazhin e tregtisë në Steam.
4. **Konfirmon automatikisht me 2FA** nëpërmjet `identity_secret` pa pasur nevojë të hapet telefoni me dorë.
5. **Dëgjon në kohë reale (`sentOfferChanged`)**: Sapo lojtari pranon ofertën në Steam, boti njofton menjëherë API-n e VORTEX (`/api/trade-status`) dhe kreditohen paratë në kuletë.

---

## 🛠️ Konfigurimi Hap pas Hapi

### Hapi 1: Krijo një llogari Steam për Bot-in
- Hap një llogari të re Steam (p.sh. `vortex_bot_01`).
- Shto të paktën $5 në llogari për të hequr kufizimin e Steam (Limited User restriction).
- Aktivizo **Steam Guard Mobile Authenticator** në telefon ose nëpërmjet **Steam Desktop Authenticator (SDA)**.

### Hapi 2: Merr çelësat dhe sekretet e Steam
1. **Steam Web API Key:**
   - Shko tek: [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) dhe krijo çelësin API.
2. **`shared_secret` dhe `identity_secret`:**
   - Këto merren nga skedari `.maFile` nëse përdor **Steam Desktop Authenticator (SDA)** ose nga telefoni (Android me root tek `/data/data/com.valvesoftware.android.steam.community/databases/`).

### Hapi 3: Plotëso skedarin `.env`
Kopjo `.env.example` në `.env`:
```bash
cd server/steam-bot
cp .env.example .env
```
Dhe plotëso:
```env
STEAM_ACCOUNT_NAME=emri_i_botit
STEAM_PASSWORD=fjalekalimi_i_botit
STEAM_SHARED_SECRET=kodi_shared_secret
STEAM_IDENTITY_SECRET=kodi_identity_secret
STEAM_API_KEY=qelesi_steam_api
VORTEX_API_URL=http://localhost:5175/api
```

### Hapi 4: Instalo varësitë dhe nis Bot-in
```bash
npm install
npm start
```

Kur boti të niset me sukses, do të shohësh:
```
✅ [VORTEX Bot] Successfully logged into Steam network as [vortex_bot_01]!
🌐 [VORTEX Bot] Steam Web Session established.
📦 [VORTEX Bot] Trade Offer Manager ready and active!
```

---

## ☁️ Si mund të mbahet ndezur 24/7?
Mund ta vendosësh këtë folder në:
- **VPS (Ubuntu / Debian)** me `pm2 start src/bot.js --name vortex-bot`
- **Railway.app / Render.com** si Node.js Background Worker
- **Docker Container**
