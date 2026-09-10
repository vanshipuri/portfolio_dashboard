# Architecture

## High-Level Architecture

```txt
Next.js Frontend
      |
      | GET /api/portfolio
      v
Node.js Express Backend
      |
      | Reads portfolio.json
      | Fetches Yahoo CMP
      | Loads fundamentals fallback
      | Calculates totals
      v
Portfolio JSON Response
      |
      v
Dashboard UI
```

## Frontend Responsibilities

The frontend is responsible for:

- Displaying portfolio summary cards
- Rendering the sector-wise portfolio table
- Showing gain/loss visual indicators
- Auto-refreshing dashboard data every 15 seconds
- Showing the last updated timestamp
- Providing manual refresh
- Searching/filtering stocks
- Exporting data to CSV
- Showing sector allocation chart
- Displaying data source badges

## Backend Responsibilities

The backend is responsible for:

- Reading static portfolio data
- Fetching CMP from Yahoo Finance
- Loading fundamentals fallback data
- Caching external responses
- Calculating portfolio metrics
- Handling partial failures
- Returning a clean API response to the frontend

## Backend Folder Structure

```txt
backend/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   └── stockRoutes.ts
│   ├── controllers/
│   │   └── stockController.ts
│   ├── services/
│   │   ├── yahooFinanceService.ts
│   │   ├── googleFinanceService.ts
│   │   └── portfolioService.ts
│   ├── cache/
│   │   └── cacheManager.ts
│   ├── data/
│   │   ├── portfolio.json
│   │   └── fundamentals.json
│   ├── utils/
│   │   ├── calculations.ts
│   │   └── symbolResolver.ts
│   ├── validators/
│   │   └── validatePortfolioData.ts
│   └── types/
│       └── portfolio.types.ts
```

## Frontend Folder Structure

```txt
frontend/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Charts/
│   │   └── SectorPieChart.tsx
│   ├── Header/
│   │   └── DashboardHeader.tsx
│   ├── PortfolioTable/
│   │   ├── index.tsx
│   │   ├── SectorRow.tsx
│   │   └── StockRow.tsx
│   └── UI/
│       ├── ErrorBanner.tsx
│       ├── LoadingSpinner.tsx
│       └── RefreshTimer.tsx
├── hooks/
│   └── usePortfolioData.ts
├── types/
│   └── portfolio.types.ts
└── utils/
    ├── exportCsv.ts
    └── formatters.ts
```

## Main Data Flow

1. The frontend calls `/api/portfolio`.
2. The backend reads active holdings from `portfolio.json`.
3. The backend resolves Yahoo symbols for each stock.
4. CMP values are fetched from Yahoo Finance or returned from cache.
5. Fundamentals are loaded from fallback data.
6. Portfolio calculations are performed.
7. The backend returns a structured response.
8. The frontend renders the dashboard.

## Important Backend Files

### `server.ts`

Starts the Express server, configures CORS, registers routes, and exposes the health check endpoint.

### `stockRoutes.ts`

Defines backend API routes:

- `/portfolio`
- `/prices`
- `/fundamentals`

### `stockController.ts`

Keeps route handlers thin and delegates business logic to services.

### `portfolioService.ts`

Combines:

- Static portfolio data
- CMP data
- Fundamentals data
- Calculated fields

This service builds the final dashboard API response.

### `yahooFinanceService.ts`

Fetches CMP using Yahoo Finance’s unofficial chart endpoint.

It also handles:

- Symbol fallback attempts
- Cache lookup
- Failed CMP responses

### `googleFinanceService.ts`

Handles fundamentals data.

Currently, it uses assignment-provided fallback data because Google Finance does not provide an official public API.

### `cacheManager.ts`

Provides simple in-memory caching with TTL support.

### `calculations.ts`

Contains pure calculation utilities for:

- Investment
- Portfolio percentage
- Present value
- Gain/loss
- Gain/loss percentage

### `symbolResolver.ts`

Builds Yahoo Finance symbol candidates using:

- `yahooSymbol`
- `nseSymbol`
- `bseCode`
- fallback symbols

## Important Frontend Files

### `app/page.tsx`

Main dashboard page.

It renders:

- Header cards
- Refresh timer
- Sector pie chart
- Search/filter
- CSV export
- Portfolio table
- Metadata/disclaimer section

### `usePortfolioData.ts`

Custom hook responsible for:

- Fetching portfolio data
- Loading state
- Error state
- Auto-refresh
- Manual refresh
- Countdown timer
- Avoiding overlapping requests

### `PortfolioTable`

Displays sector-grouped holdings.

Each sector has a summary row followed by stock rows.

### `SectorPieChart`

Displays investment allocation by sector.

### `exportCsv.ts`

Converts the current filtered portfolio view into a downloadable CSV file.

## Key Design Decisions

### Backend-First Data Processing

Portfolio calculations are done in the backend so the frontend stays focused on rendering.

### Separated Services

Yahoo CMP logic, fundamentals logic, and portfolio aggregation are kept in separate service files.

### Pure Calculation Utilities

Financial formulas are kept in utility functions, making them easier to test and explain.

### Transparent Data Sources

The API response includes metadata and each stock includes source information.

The frontend displays this through badges such as:

- `yahoo`
- `cache`
- `assignment`
- `unavailable`

### Graceful Failure Handling

If one price fails, the dashboard continues to work.

Unavailable values are displayed as:

```txt
N/A
```

or:

```txt
—
```

## Final Architecture Principle

The project separates concerns clearly:

- Backend handles data and calculations.
- Frontend handles presentation and interactivity.
- Documentation explains assumptions and API limitations.