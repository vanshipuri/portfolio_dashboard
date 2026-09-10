# Data Assumptions

## Source

The portfolio data was extracted from the assignment-provided portfolio PDF.

## Active Portfolio

The active portfolio contains **26 sector-grouped holdings**.

The total active investment is:

```txt
₹15,43,060
```

This matches the total shown in the source portfolio document.

## Sector Totals

| Sector | Investment |
|---|---:|
| Financial Sector | ₹3,28,450 |
| Tech Sector | ₹3,37,820 |
| Consumer | ₹2,63,565 |
| Power | ₹1,58,860 |
| Pipe Sector | ₹1,98,656 |
| Others | ₹2,55,709 |
| **Total Active Investment** | **₹15,43,060** |

## Excluded / Watchlist Rows

The source document also shows three additional rows after the active portfolio total:

| Stock | Purchase Price | Quantity | Investment |
|---|---:|---:|---:|
| Infy | ₹1,647 | 36 | ₹59,292 |
| Happiest Mind | ₹1,103 | 45 | ₹49,635 |
| EaseMyTrip | ₹20 | 1,332 | ₹26,640 |

These rows are **not included** in the active portfolio total of ₹15,43,060.

Therefore, they are stored separately under:

```txt
excludedRows
```

They are not used for:

- Active portfolio total investment
- Sector totals
- Portfolio allocation percentage
- Active gain/loss calculations

This decision keeps the dashboard totals consistent with the source document.

## Investment Calculation

For each holding, investment is calculated as:

```txt
Investment = Purchase Price × Quantity
```

Example:

```txt
HDFC Bank = ₹1,490 × 50 = ₹74,500
```

The backend validation script checks that each stored investment matches this formula.

## Portfolio Percentage Calculation

Portfolio percentage is calculated as:

```txt
Portfolio % = Stock Investment / Total Active Investment × 100
```

Sector portfolio percentage is calculated as:

```txt
Sector Portfolio % = Sector Investment / Total Active Investment × 100
```

## NSE/BSE Symbol Assumptions

Indian stocks may be listed on NSE, BSE, or both.

Yahoo Finance uses exchange-specific suffixes:

| Exchange | Yahoo Finance Suffix | Example |
|---|---|---|
| NSE | `.NS` | `HDFCBANK.NS` |
| BSE | `.BO` | `511577.BO` |

The dashboard stores multiple symbol fields where possible:

- `nseSymbol`
- `bseCode`
- `yahooSymbol`
- `fallbackYahooSymbols`
- `googleFinanceSymbol`

This avoids assuming that every stock is available through a single NSE symbol.

## Symbol Resolution Approach

For CMP fetching, the backend uses the following priority:

1. Use the configured `yahooSymbol`
2. Try `{nseSymbol}.NS` when an NSE symbol is available
3. Try `{bseCode}.BO` when a BSE code is available
4. If all attempts fail, return `cmp: null`

The frontend then displays:

```txt
N/A
```

instead of crashing.

## Known Symbol Notes

Some symbols required assumptions or verification:

| Stock | Note |
|---|---|
| Savani Financials | Treated as BSE-based using `511577.BO` |
| Bajaj Housing | Uses `BAJAJHFL.NS` with BSE fallback |
| LTI Mindtree | Uses `LTIM.NS`; Yahoo availability may vary |
| Tata Consumer | Uses `TATACONSUM.NS`; source extraction showed a different code |
| Happiest Mind | Stored as excluded/watchlist row; common NSE symbol used as `HAPPSTMNDS` |

If a symbol is unavailable from Yahoo Finance’s unofficial endpoint, the app safely shows `N/A`.

## CMP Data Assumption

CMP is fetched dynamically using Yahoo Finance’s unofficial chart endpoint.

Yahoo Finance does not provide an official free public API, so CMP availability can vary due to:

- Exchange symbol support
- Market hours
- Network availability
- Yahoo endpoint behavior
- Unofficial API changes

Because of this, CMP-dependent values can be `null`.

These include:

- CMP
- Present Value
- Gain/Loss
- Gain/Loss %

## Fundamentals Data Assumption

The assignment asks for P/E Ratio and Latest Earnings from Google Finance.

However, Google Finance does not provide an official public API.

For stability, the project uses assignment-provided fundamentals as fallback data.

The dashboard labels this source as:

```txt
static-assignment-data
```

This approach is reasonable because fundamentals such as P/E Ratio and earnings do not change every 15 seconds like CMP.

## Latest Earnings / EPS Label

The source document includes a column named:

```txt
Latest Earnings
```

In the dashboard, it is shown as:

```txt
Latest Earnings / EPS
```

This is done because the values appear closer to earnings-per-share style values rather than total company earnings.

## Validation Script

The backend includes a validation script:

```bash
npm run validate:data
```

It checks:

- Each stock investment equals purchase price × quantity
- Each sector total equals the sum of its stocks
- Total active portfolio investment equals ₹15,43,060
- Active holdings count equals 26
- Excluded rows count equals 3
- Portfolio percentages add up approximately to 100%

## Final Note

The purpose of these assumptions is to keep the dashboard:

- Consistent with the source document
- Transparent about unavailable public APIs
- Safe when external data fails
- Easy to explain during the technical interview