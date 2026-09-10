# Technical Challenges and Solutions

## 1. Yahoo Finance Has No Official Public API

### Problem

The assignment requires fetching CMP from Yahoo Finance, but Yahoo Finance does not provide an official free public API.

### Solution

I used Yahoo Finance’s unofficial chart endpoint from the backend:

```txt
https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}
```

The backend extracts CMP from:

```txt
chart.result[0].meta.regularMarketPrice
```

### Why This Approach

- It returns structured JSON.
- It avoids fragile HTML parsing.
- It works for many NSE/BSE Indian stocks when the correct suffix is used.
- It keeps external data fetching on the backend instead of the frontend.

### Risk

The endpoint is unofficial and may change in the future.

### Mitigation

The app handles failures gracefully by returning:

```ts
cmp: null
```

The frontend then shows:

```txt
N/A
```

instead of crashing.

---

## 2. Google Finance Has No Official Public API

### Problem

Google Finance does not provide an official API for P/E Ratio and Latest Earnings.

### Solution

I created a separate fundamentals service.

The app currently uses assignment-provided fundamentals as a fallback source.

### Why This Is Reasonable

Fundamental data changes much less frequently than CMP.

For this assignment, using static fallback data is more stable than depending completely on fragile scraping.

The UI also clearly communicates the source using data source badges.

---

## 3. NSE/BSE Symbol Mapping

### Problem

Indian stocks may be listed on NSE, BSE, or both.

Yahoo Finance requires exchange-specific suffixes:

- `.NS` for NSE
- `.BO` for BSE

A simple approach like appending `.NS` to every symbol would fail for some stocks.

### Solution

I added symbol metadata to each stock:

- `nseSymbol`
- `bseCode`
- `yahooSymbol`
- `fallbackYahooSymbols`

The backend tries available symbol candidates before marking a stock as unavailable.

### Example

```txt
HDFC Bank → HDFCBANK.NS
Savani Financials → 511577.BO
```

---

## 4. Rate Limiting

### Problem

The dashboard refreshes CMP every 15 seconds. Fetching many stocks repeatedly could trigger rate limits from public/unofficial endpoints.

### Solution

I implemented an in-memory cache.

CMP is cached for 15 seconds, matching the frontend refresh interval.

This reduces repeated requests while keeping the dashboard dynamic.

---

## 5. Partial API Failures

### Problem

If one stock fails to fetch, the entire portfolio should not crash.

### Solution

I used:

```ts
Promise.allSettled()
```

instead of:

```ts
Promise.all()
```

This allows the app to display successful stock prices while marking failed stocks as `N/A`.

---

## 6. Data Consistency

### Problem

The source PDF contains 26 active sector-grouped holdings and 3 additional rows after the portfolio total.

The 3 additional rows are:

- Infy
- Happiest Mind
- EaseMyTrip

### Solution

Only the 26 sector-grouped holdings are treated as active portfolio holdings.

The 3 additional rows are stored separately as excluded/watchlist rows.

This keeps the total active investment equal to the source value:

```txt
₹15,43,060
```

---

## 7. TypeScript Null Safety

### Problem

External financial data can be missing, delayed, blocked, or invalid.

### Solution

Fields that depend on external APIs use `number | null`.

Examples:

- `cmp`
- `presentValue`
- `gainLoss`
- `gainLossPercent`
- `peRatio`
- `latestEarnings`

The frontend displays unavailable values safely as `N/A` or `—`.

---

## 8. Auto Refresh Race Conditions

### Problem

If one API request takes longer than expected, a new refresh could start before the previous one finishes.

### Solution

The frontend hook tracks whether a request is already in progress.

This prevents overlapping fetches and avoids unnecessary duplicate requests.

---

## 9. Large Table User Experience

### Problem

A portfolio table with many rows can become difficult to read.

### Solution

I improved the dashboard with:

- Sector grouping
- Sector summary rows
- Summary cards
- Search/filter
- CSV export
- Sector allocation pie chart
- Green/red gain-loss indicators
- Data source badges
- Last updated timestamp
- Refresh countdown

---

## 10. Deployment Considerations

### Problem

Frontend and backend run on different origins in production.

### Solution

The backend uses configurable CORS origins through environment variables.

The frontend API URL is also configurable using:

```txt
NEXT_PUBLIC_API_URL
```

This allows the same codebase to work locally and in production.

---

## Summary

| Challenge | Solution |
|---|---|
| No official Yahoo API | Used unofficial chart endpoint with error handling |
| No official Google Finance API | Used service layer with assignment-data fallback |
| NSE/BSE symbol differences | Added symbol resolver and fallback symbols |
| Rate limiting | Added short TTL cache |
| Partial API failures | Used `Promise.allSettled()` |
| Data consistency | Validated 26 active holdings and excluded 3 extra rows |
| Large table UX | Added search, chart, CSV export, and visual indicators |