# Match Servers & Anti-Cheat Architecture Rules

## 1. Match Server Infrastructure (FACEIT API)
- When starting or provisioning any competitive match (5v5 Tactical Matchmaking, Tournaments, Scrims):
  - Dedicated match servers are provisioned via the **FACEIT API** backend infrastructure.
  - Public UI branding must remain 100% **CaliberClutch** (do not display FACEIT logos or third-party server tags on the user-facing UI, as requested by the founder: only the developer and founder know it is powered by FACEIT API under the hood).
  - Server architecture is official CS2 Sub-Tick Dedicated with lowest latency European regions (Frankfurt, Stockholm, London, Paris, etc.).

## 2. Anti-Cheat Enforcement (FACEIT AC / Ring-0 Kernel)
- Every competitive match strictly mandates and enforces **FACEIT Anti-Cheat (Faceit AC)**:
  - Players must have the kernel-level (Ring-0) Anti-Cheat client running and active before connecting.
  - Matches will not allow connections without validated Anti-Cheat tokens.
  - Disqualification or default loss (Def-Loss) applies if Anti-Cheat is not verified within the 15-minute check-in window.

## 3. CaliberClutch ELO & Calibration
- New registered players start at **Level 3** with **800 ELO** (matching the official FACEIT baseline).
- If a player has **0 matches** played on Caliber Clutch:
  - Do not display an active competitive rank on the leaderboard.
  - Status is displayed as `Unranked (800 ELO • 0 Matches)` / `Calibrating`.
  - Only after completing their first match on Caliber Clutch do they receive active rank progression.
- Sole Administrator & Founder is **M14** (Level 7, 1407 ELO).
