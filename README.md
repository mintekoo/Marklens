# Marklens

Modern cryptocurrency market dashboard built with Next.js, React, TypeScript, and the CoinGecko Demo REST API.

## Overview

Marklens helps you explore crypto markets with a clean dashboard experience:

- Bitcoin overview chart on the home page
- Trending coins and top market categories
- Paginated coin markets table
- Coin detail pages with price stats, OHLC candlestick charts, currency conversion, and recent market activity
- Server-side CoinGecko integration with client polling for near-live updates

The browser never talks to CoinGecko directly. Next.js server code and API routes handle authenticated requests and return only the data the UI needs.

## Features

- **Home dashboard** — Bitcoin OHLC overview, trending coins, and top categories
- **All coins** — Market list with rank, price, 24h change, market cap, and pagination
- **Coin details** — Live-polled price, 24h/30d stats, chart period controls, and market activity
- **Candlestick charts** — TradingView Lightweight Charts with selectable periods (1D–Max)
- **Currency converter** — Convert a coin amount using CoinGecko price list data
- **Graceful error states** — Useful fallbacks when API requests fail or rate limits hit

## Tech Stack

- [Next.js](https://nextjs.org) 16
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) 4
- [CoinGecko Demo API](https://www.coingecko.com/en/api)
- [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/)
- [Radix UI](https://www.radix-ui.com) primitives (via shadcn/ui-style components)
- [Lucide](https://lucide.dev) icons

## Getting Started

**Prerequisites:** Node.js and npm

```bash
npm install
```

Create a `.env` file in the project root:

```env
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=YOUR_DEMO_API_KEY
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `COINGECKO_BASE_URL` | Yes | CoinGecko REST base URL (Demo: `https://api.coingecko.com/api/v3`) |
| `COINGECKO_API_KEY` | Yes | CoinGecko Demo API key used only on the server |

Do **not** use `NEXT_PUBLIC_` for the CoinGecko API key. The key must stay server-side.

A sample file is available at `.env.example`.

## Production

```bash
npm run build
npm start
```

Also available:

```bash
npm run lint
npm run format
```

## Project Structure

```text
app/                 # App Router pages and API routes
  api/coins/[id]/    # Live price/activity + OHLC proxies
  coins/             # Markets list and coin detail pages
components/          # UI and feature components
hooks/               # Client hooks (REST polling)
lib/coingecko/       # Server-only CoinGecko client and types
public/              # Static assets (logo, converter icon)
```

## API Architecture

```text
Browser  →  Next.js API routes / Server Components  →  CoinGecko Demo REST API
```

- Server Components call `lib/coingecko/client.ts` for initial page data.
- Client components that need refresh use:
  - `GET /api/coins/[id]/live` — price + recent market activity (polled ~45s)
  - `GET /api/coins/[id]/ohlc?period=...` — candlestick data for chart period changes / live refresh

The CoinGecko API key is read from `process.env` only inside server modules.

## Notes

- This project uses the **CoinGecko Demo REST API**, not WebSockets.
- Demo OHLC requests do not accept a Pro-only `interval` parameter; granularity is chosen automatically from `days`.
- Demo API rate limits apply. Aggressive polling is avoided; live views refresh about every 45 seconds.
- Market activity on coin pages is derived from CoinGecko ticker data, not a true trade stream.
