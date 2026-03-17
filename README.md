# x402Demo — Runna: Running Training App with x402 Payments

A **mobile running training app** (inspired by [Runna](https://runna.com)) that demonstrates the **x402 HTTP payment protocol** for pay-per-use access to premium training plans.

## What is this?

This demo shows how the [x402 protocol](https://x402.org) can power a **subscription-free** running training app where users pay micro-amounts in USDC to access individual training plans — no monthly fees, no credit cards.

```
User taps "10K Personal Best" plan
        ↓
App requests GET /api/plans/intermediate-10k
        ↓
Server returns HTTP 402 Payment Required
  { x402Version: 1, accepts: [{ price: "$0.001", network: "base-sepolia", ... }] }
        ↓
App signs USDC micropayment with user's wallet
        ↓
App re-sends request with X-PAYMENT header
        ↓
Server verifies payment → returns full plan with all workouts 🏃
```

## Project Structure

```
x402Demo/
├── server/          # Express API server with x402 payment middleware
│   └── src/
│       ├── index.ts   # Server with x402 payment-protected routes
│       └── data.ts    # Training plan data (3 plans, full workout schedules)
│
└── mobile/          # React Native (Expo) mobile app
    └── src/
        ├── api/       # x402 API client (handles 402 → payment → retry)
        ├── components/ # PlanCard, WorkoutCard, WorkoutTimer, StatCard
        ├── navigation/ # React Navigation (tabs + stack)
        ├── screens/   # Home, Plans, PlanDetail, Workout, Settings
        └── theme/     # Dark theme, colors, typography
```

## Features

### 📱 Mobile App
- **Home Dashboard** — Today's workout, weekly stats, 🔥 streak tracker, recent runs
- **Training Plans** — Browse 3 plans: Couch to 5K, 10K PB, Marathon Qualifier
- **Plan Detail** — Full weekly schedule with workout breakdown (x402 gated)
- **Active Workout** — Animated interval timer with pace/zone guidance
- **Settings** — Configure EVM wallet key for USDC payments on Base

### 🖥️ API Server
| Endpoint | Auth | Description |
|---|---|---|
| `GET /api/plans` | Free | List all plan summaries |
| `GET /api/plans/:id` | x402 ($0.001 USDC) | Full plan with all workouts |
| `GET /api/workouts/:id` | x402 ($0.001 USDC) | Individual workout session |
| `GET /health` | Free | Server health check |

## Quick Start

### 1. Server

```bash
cd server
cp ../.env.example .env
# Edit .env: set SELLER_PAYTO to your EVM address
npm install
npm run build
npm start
```

Server starts on port 4021.

### 2. Mobile App

```bash
cd mobile
npm install
npm start         # Expo dev server
npm run android   # Run on Android
npm run ios       # Run on iOS (macOS required)
npm run web       # Run in browser
```

Set `EXPO_PUBLIC_API_URL` to your server URL (default: `http://localhost:4021`).

## Environment Variables

```env
# server/.env
SELLER_PAYTO=0xYOUR_EVM_ADDRESS          # Where USDC payments are sent
PORT=4021
FACILITATOR_URL=https://x402.org/facilitator
NETWORK_CAIP2=eip155:84532               # Base Sepolia testnet

# mobile - EXPO_PUBLIC_ prefix makes vars available in the app
EXPO_PUBLIC_API_URL=http://localhost:4021
```

## x402 Payment Flow

The server emits standards-compliant HTTP 402 responses:

```json
{
  "x402Version": 1,
  "error": "Payment Required",
  "accepts": [{
    "scheme": "exact",
    "network": "eip155:84532",
    "maxAmountRequired": "0.001",
    "payTo": "0xYOUR_ADDRESS",
    "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "mimeType": "application/json"
  }]
}
```

The mobile app handles this automatically:
1. Catches the 402 response
2. Signs a USDC transfer with the configured wallet
3. Sends `X-PAYMENT` header with the signed payload
4. Receives the premium content

In production, connect a real `x402-fetch` client with an EVM wallet for on-chain USDC payments.

## Training Plans

| Plan | Level | Duration | Goal |
|---|---|---|---|
| 🏃 Couch to 5K | Beginner | 8 weeks | Complete a 5K |
| ⚡ 10K Personal Best | Intermediate | 10 weeks | Sub-55min 10K |
| 🏅 Marathon Qualifier | Advanced | 16 weeks | Boston Qualifier |

## Tech Stack

- **Mobile**: React Native + Expo SDK 55, React Navigation, TypeScript
- **Server**: Express 5, TypeScript, @x402/express middleware
- **Payments**: x402 protocol, USDC on Base (Sepolia testnet)
- **Wallet**: EVM-compatible (Base / Base Sepolia)
