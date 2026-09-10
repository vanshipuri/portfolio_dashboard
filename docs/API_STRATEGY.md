# API Strategy

## Overview

The application uses a Node.js backend as the data layer between the frontend and external/public financial data sources.

The frontend does not directly call Yahoo Finance or Google Finance. Instead, it calls the backend API.

This keeps the following responsibilities on the server side:

- External API requests
- Symbol resolution
- Caching
- Error handling
- Data transformation
- Portfolio calculations

## Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Backend health check |
| GET | `/api/portfolio` | Returns the full calculated portfolio response |
| GET | `/api/prices?symbols=HDFCBANK,BAJFINANCE` | Returns CMP data for selected symbols |
| GET | `/api/fundamentals?symbol=HDFCBANK` | Returns fundamentals data for one symbol |

## Main Portfolio API

The main endpoint used by the frontend is:

```txt
GET /api/portfolio
```

It returns:

- Sector-grouped holdings
- Total investment
- Present value
- Gain/loss
- Gain/loss percentage
- P/E Ratio
- Latest Earnings / EPS
- Data source metadata
- Active/excluded row counts

## Yahoo Finance CMP Strategy

Yahoo Finance does not provide an official free public API.

For CMP, the backend uses Yahoo Finance’s unofficial chart endpoint:

```txt
https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}
```

Example:

```txt
https://query1.finance.yahoo.com/v8/finance/chart/HDFCBANK.NS
```

The backend reads the current market price from:

```txt
chart.result[0].meta.regularMarketPrice
```

## NSE/BSE Symbol Resolution

The app does not blindly append `.NS` to every stock.

Each stock can include:

- `yahooSymbol`
- `nseSymbol`
- `bseCode`
- `fallbackYahooSymbols`

Lookup priority:

1. Try the configured `yahooSymbol`
2. Try `{nseSymbol}.NS`
3. Try `{bseCode}.BO`
4. If all attempts fail, return `cmp: null`

This prevents the dashboard from crashing when a specific exchange symbol is unavailable.

## Google Finance / Fundamentals Strategy

Google Finance does not expose an official public API.

The project is structured with a separate fundamentals service so that a live scraper or alternate fundamentals provider can be added later.

Currently, the backend uses assignment-provided fundamentals as a reliable fallback.

This is acceptable for this assignment because:

- CMP changes frequently and needs periodic refresh.
- P/E Ratio and earnings data change less frequently.
- Scraping Google Finance can be unstable or blocked.
- The source of fallback data is clearly shown in the UI.

## Caching Strategy

CMP data is cached for a short duration to reduce repeated external requests.

Current strategy:

| Data Type | Cache Duration | Reason |
|---|---:|---|
| CMP | 15 seconds | Matches frontend refresh interval |
| Fundamentals | Longer duration | Fundamentals change less frequently |

This helps reduce the risk of rate limiting.

## Partial Failure Strategy

The app uses `Promise.allSettled()` when fetching multiple stock prices.

Reason:

- `Promise.all()` fails completely if one request fails.
- `Promise.allSettled()` allows successful stocks to still appear.

If a stock price fails, the API returns:

```ts
{
  cmp: null,
  status: "failed",
  error: "Reason for failure"
}
```

The frontend then displays:

```txt
N/A
```

## Why Failed CMP Is `null`, Not `-1`

A failed CMP is represented as:

```ts
cmp: null
```

Using `-1` would be dangerous because calculations like present value and gain/loss could treat it as a real price.

Example of incorrect behavior:

```txt
presentValue = -1 × quantity
```

Using `null` makes unavailable data explicit and safe.

## Frontend API Configuration

The frontend uses:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, this value should point to the deployed backend API.

Example:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## Backend CORS Configuration

The backend supports configurable allowed origins using:

```env
ALLOWED_ORIGINS=http://localhost:3000
```

For production, this can include the deployed frontend URL.

Example:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

## Final API Design Principle

The backend returns a dashboard-ready response so that the frontend remains focused on rendering the UI instead of handling complex financial calculations or external API logic.