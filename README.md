# Dynamic Portfolio Dashboard

A real-time stock portfolio dashboard built for the 8byte / Octa Byte full-stack assignment.

## Overview

This dashboard displays a sector-grouped investment portfolio with dynamic CMP updates, portfolio calculations, visual gain/loss indicators, search, export, and charting features.

The project is built with a separate frontend and backend:

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript

## Features

- Real-time CMP tracking using Yahoo Finance unofficial chart endpoint
- Sector-wise portfolio grouping
- Sector summary rows
- Total investment, present value, and gain/loss summary
- Auto-refresh every 15 seconds
- Manual refresh button
- Last updated timestamp
- Search/filter stocks
- CSV export
- Sector allocation pie chart
- Green/red gain-loss indicators
- Data source badges
- Graceful handling of unavailable API data
- Data validation script

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- Axios
- In-memory caching

## Project Structure

```txt
portfolio-dashboard/
├── backend/
├── frontend/
├── docs/
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+ recommended
- npm

## Backend Setup

```bash
cd backend
npm install
npm run validate:data
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/health
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

## Environment Variables

### Backend

Create `backend/.env`:

```env
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
PRICE_CACHE_TTL_MS=15000
FUNDAMENTALS_CACHE_TTL_MS=21600000
```

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Backend health check |
| GET | `/api/portfolio` | Returns full calculated portfolio data |
| GET | `/api/prices?symbols=HDFCBANK,BAJFINANCE` | Returns CMP for selected stocks |
| GET | `/api/fundamentals?symbol=HDFCBANK` | Returns fundamentals for one stock |

## Data Validation

Run:

```bash
cd backend
npm run validate:data
```

The validation script checks:

- Each stock investment equals purchase price × quantity
- Each sector total equals the sum of its stocks
- Total active portfolio investment equals ₹15,43,060
- Active holdings count is 26
- Excluded rows count is 3

## Main Calculations

### Investment

```txt
Investment = Purchase Price × Quantity
```

### Portfolio Percentage

```txt
Portfolio % = Stock Investment / Total Investment × 100
```

### Present Value

```txt
Present Value = CMP × Quantity
```

### Gain/Loss

```txt
Gain/Loss = Present Value - Investment
```

### Gain/Loss Percentage

```txt
Gain/Loss % = Gain/Loss / Investment × 100
```

## Data Assumptions

The active portfolio contains 26 sector-grouped holdings.

The following rows appear after the portfolio total in the source PDF and are treated as excluded/watchlist rows:

- Infy
- Happiest Mind
- EaseMyTrip

These are stored separately and are not included in active portfolio calculations.

More details are available in:

```txt
docs/DATA_ASSUMPTIONS.md
```

## API Strategy

Yahoo Finance and Google Finance do not provide official free public APIs.

This project uses:

- Yahoo Finance unofficial chart endpoint for CMP
- Assignment-provided fundamentals as fallback data
- Caching and graceful error handling

More details are available in:

```txt
docs/API_STRATEGY.md
docs/CHALLENGES.md
```

## Error Handling

If CMP is unavailable for a stock, the backend returns:

```ts
cmp: null
status: "failed"
```

The frontend then displays:

```txt
N/A
```

This prevents one failed external request from breaking the full dashboard.

## Documentation

Additional documentation:

- `docs/DATA_ASSUMPTIONS.md`
- `docs/API_STRATEGY.md`
- `docs/CHALLENGES.md`
- `docs/ARCHITECTURE.md`
- `docs/LOOM_SCRIPT.md`

## Available Scripts

### Backend

```bash
npm run dev
npm run build
npm run start
npm run validate:data
```

### Frontend

```bash
npm run dev
npm run build
npm run start
```

## Notes

Financial data may be delayed, unavailable, or blocked by the external source.

When CMP is unavailable, the dashboard displays `N/A` instead of crashing.

## Future Improvements

Possible future improvements:

- Add authenticated user portfolios
- Add persistent database storage
- Add historical performance charts
- Add WebSocket-based live updates
- Add a production-grade financial data provider
- Add automated tests for services and UI components