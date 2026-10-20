# Location‑Based Surprise Gaming Tournament Platform  
## Comprehensive Business & Technical Specification  
*For handoff to another LLM or development team*

---

## 1. Vision Summary

A multi‑sided platform that **drives foot traffic to local businesses** by hosting **fast‑paced, surprise‑based arcade tournaments**. Users compete in short, unpredictable games when they check in at designated locations. Between rounds, they engage in prize selection (revealing consumer preferences) and watch advertisements. Businesses pay for promotion, traffic analytics, and aggregated user preference data.

**Core differentiator** – The “surprise” mechanic: players never know which game they will play each round, minimising cheating and maximising engagement. The tournament flow includes point wagers, puzzles, and intermittent prize choice exercises, turning advertising into a valued user interaction.

---

## 2. Multi‑Sided Value Proposition

| Stakeholder | Value Delivered | How Value Is Proven |
|-------------|----------------|----------------------|
| **Local businesses (cafés, bars, retail)** | Foot traffic, longer dwell time, association with gaming community, anonymised preference reports, sponsorship of prizes. | App check‑in logs, QR code / receipt validation, aggregated demographics, heat maps of movement. |
| **Gamers (users)** | Fun, unpredictable arcade rounds, real prizes (gift cards, gear), local social competition, low time commitment, “game show” experience. | Prize redemption, leaderboard ranking, in‑app rewards, community status. |
| **Advertisers / national brands** | Targeted exposure during ad breaks, sponsored prize categories, access to aggregated intent/preference data. | Real‑time analytics dashboard, post‑campaign lift reports, redemption rates of branded offers. |

---

## 3. Tournament & Gameplay Mechanics

### 3.1 Core Tournament Flow (per session)

1. **Check‑in** – User opens app at a participating location (GPS geofence + optional QR fallback).  
2. **Lobby countdown** – “Tournament starts in 90 seconds”.  
3. **Round 1** – A **surprise arcade game** (30‑60 seconds).  
4. **Intermission** –  
   - 15‑second ad (business or national brand).  
   - Prize selection interface (“Pick your dream prize from 3 categories”).  
5. **Bonus mini‑game** – Simple puzzle or point wager (using in‑game currency earned from previous round).  
6. **Round 2** – A *different* surprise game.  
7. **Repeat intermission / prize selection** (key data capture moment).  
8. **Final leaderboard** – Top X players win physical/digital prizes (e.g., business gift cards, merchandise).  

### 3.2 “Surprise Game” Implementation

Games are **not known in advance**. The app loads a small, independent game module at the start of each round.

- **Game types** – Simple arcade: avoid obstacles, timed tapping, quick reflex, maze, memory match.  
- **Attributes that create surprise** – Control scheme (tap vs tilt), scoring rules, visual theme, speed variation.  
- **Technical container** – WebView or lightweight Unity WebGL wrapper; modules are pre‑cached to avoid lag.  

### 3.3 Prize Selection & Data Engine (Strategic Asset)

During intermissions / ad breaks, user is presented with a **“Prize Chest”** interface:

> *“You earned 3 keys! Unlock one prize category: 🔧 Tech | 👕 Fashion | 🍔 Food & Drink | 🎮 Gaming Gear | 🎟️ Experiences”*

After selecting a category, show 2‑3 specific items (e.g., “Wireless Earbuds vs Smart Watch”).  
User taps a preference – this is **explicit intent data**.

**Data captured per user (anonymised after aggregation):**  
- Chosen category order (implicit preference).  
- Specific item chosen (explicit preference).  
- Game performance, location, time of day.

**Value to advertisers:**  
> *“Of users who selected ‘Food & Drink’ after playing a racing game, 68% then chose ‘Craft Beer’ over ‘Soda’.”*

This is pre‑purchase intent data that brands cannot easily obtain elsewhere.

---

## 4. Business & Revenue Model (3 Tiers)

| Tier | Name | Offer | Price model |
|------|------|-------|--------------|
| **1** | **Pulse** | Basic check‑in logs, anonymised gamer count during tournament hours. | Monthly SaaS (low) |
| **2** | **Traffic Driver** | Guaranteed X player‑sessions at location, business provides prize (e.g., free coffee), business name on tournament page. | Performance / flat monthly |
| **3** | **Insights Partner** | All of #2 + aggregated preference data for their sector (e.g., “coffee drinkers also prefer energy drink prizes”). | Premium monthly + data license |

**Additional revenue streams:**  
- **Advertising** – Branded power‑ups, sponsored prize categories, 15‑second video ads.  
- **Data licensing** – Anonymised insight reports sold to market research firms / national brands.  
- **Entry fees (optional)** – Small fee for higher prize pools (subject to sweepstakes law).

**Strategic Primacy Decision (CEO advice):**  
> **Primary business focus = Location Foot Traffic & Local Commerce Platform**  
> This is more defensible, easier to sell to small businesses, and less dependent on ad spend. The data & ad revenue become high‑margin upsells.

---

## 5. Legal Framework & Guardrails (Critical)

*Not legal advice – consult an attorney.*

### 5.1 Must‑Have Documents
- **Terms of Service & Privacy Policy** – Covers location tracking, receipt scanning, prize selection data collection, prohibition on selling PII.  
- **Contest / Sweepstakes Official Rules** – Compliant with state/country laws (prize value, eligibility, no purchase necessary if entry fee exists).  
- **Liability Waiver** – User releases platform and business for ordinary injury during in‑person events.  
- **Business Master Services Agreement (MSA)** – Defines service tiers, IP ownership of event photos, indemnification, liability caps.

### 5.2 Key Legal Risks & Mitigations

| Risk | Mitigation |
|------|-------------|
| **Game publisher IP** – Using existing games (e.g., Fortnite) without licence. | Use only original or open‑source games with commercial‑use licences (MIT, Apache, or custom). Avoid mainstream copyrighted titles entirely. |
| **Privacy / inferred intent data** | Never sell individual data. Aggregate and anonymise. Privacy policy must clearly state: “We collect your preference choices to improve prize matching and show relevant offers.” |
| **Real‑money prize laws** | If users pay to enter, follow lottery laws. **Workaround:** No entry fee; prizes funded by business sponsors. Keep it skill‑based (no random draw). |
| **Venue liability** | Require businesses to be named “additional insured” on your general liability policy for each event. |

### 5.3 Insurance Required
- General Liability ($1M/$2M typical).  
- Errors & Omissions (E&O) – covers mistakes in data reporting or tournament execution.

---

## 6. Technical Architecture (CTO Recommendations)

### 6.1 High‑Level Stack

| Layer | Technology | Reasoning |
|-------|------------|-----------|
| **Client** | Progressive Web App (PWA) | One codebase, works on iOS/Android, no app store delays, can be installed to home screen. |
| **Game delivery** | HTML5 / JavaScript modules (Phaser, PixiJS, or custom) | Lightweight (<5 MB each), pre‑cached, loaded via dynamic `import()`. |
| **Backend** | Firebase / Supabase | Real‑time leaderboards, user auth, check‑in validation, serverless functions for tournament orchestration. |
| **Orchestrator** | Node.js (Cloud Functions) | Sequences rounds, intermissions, prize selection, ads. |
| **Database** | Firestore / PostgreSQL | User profiles, tournament history, anonymised preference data. |
| **Geo‑validation** | Google Maps Geofencing API | Ensure user is within 100m of business at check‑in. Fallback: QR code scanned by business tablet. |

### 6.2 Game Sourcing Strategy – Three Paths

| Path | Description | Pros | Cons | Recommendation |
|------|-------------|------|------|----------------|
| **A: Curated open‑source** | Find ready HTML5 games (GitHub, Itch.io), re‑skin, check licences. | Fast, cheap, low dev effort. | Inconsistent quality; games may feel dated; “surprise” limited if player recognises them. | **MVP choice** – start here. |
| **B: Single template + procedural variation** | Build one high‑quality game engine that procedurally generates level design, rules, power‑ups. | Cohesive brand, true surprise, easier maintenance. | Higher initial dev cost; requires strong game designer. | Phase 2 after validation. |
| **C: AI‑assisted generation** | Use generative AI (e.g., Copilot, custom GPT) to produce game variations on‑the‑fly. | Highly scalable, truly unique each round. | Quality control nightmare; needs heavy curation; unpredictable performance. | Long‑term research only. |

**MVP path** – Start with **Path A**. Build a library of 5‑10 open‑source HTML5 games, slightly re‑skinned to feel unified. Validate the tournament flow and business model before investing in custom game engines.

### 6.3 Tournament Orchestrator Pseudocode (Backend Logic)

```javascript
// For each tournament session
function runTournament(users, locationId) {
  let rounds = [game1, game2]; // game modules fetched from CDN
  let intermissions = [ad, prizeSelection, wagerMiniGame];
  
  for (let i = 0; i < rounds.length; i++) {
    broadcastGame(rounds[i], locationId);
    collectScores();
    if (i < rounds.length - 1) {
      executeIntermission(intermissions[i % intermissions.length]);
      capturePreferenceData();
    }
  }
  finalLeaderboard = rankScores();
  awardPrizes(finalLeaderboard);
}