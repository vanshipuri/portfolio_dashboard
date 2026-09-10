# Data Assumptions

## Source

The portfolio data was extracted from the assignment-provided portfolio PDF.

## Active Portfolio

The active portfolio contains **26 sector-grouped holdings**.

The total active investment is:

**₹15,43,060**

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
| **Total** | **₹15,43,060** |

## Excluded Rows

The source document also shows three rows after the active portfolio total:

- Infy
- Happiest Mind
- EaseMyTrip

These rows are **not included** in the active portfolio total. Therefore, they are stored separately as `excludedRows` and are not used in active portfolio calculations.

## Symbol Assumptions

Yahoo Finance uses exchange-specific suffixes for Indian stocks:

- NSE stocks use `.NS`
- BSE stocks use `.BO`

Examples:

- HDFC Bank → `HDFCBANK.NS`
- Bajaj Finance → `BAJFINANCE.NS`
- Savani Financials → `511577.BO`

Some symbols may not be available through Yahoo Finance’s unofficial endpoint. In those cases, the dashboard displays `N/A` instead of failing.

## Fundamentals Assumption

P/E Ratio and Latest Earnings / EPS values are taken from the assignment-provided data as a fallback source.

This is because Google Finance does not provide an official public API, and fundamentals do not need to refresh every 15 seconds like CMP.