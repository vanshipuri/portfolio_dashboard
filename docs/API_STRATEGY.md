# API Strategy

## Overview

The application uses a Node.js backend as the single data layer between the frontend and external/public financial data sources.

The frontend does not directly call Yahoo Finance or Google Finance. Instead, it calls the backend API.

This keeps the following logic on the server side:

- External API requests
- Symbol resolution
- Caching
- Error handling
- Data transformation
- Portfolio calculations

## Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Checks backend health |
| GET | `/api/portfolio` | Returns full calculated portfolio dashboard data |
| GET | `/api/prices?symbols=HDFCBANK,BAJFINANCE` | Returns CMP data for selected symbols |
| GET | `/api/fundamentals?symbol=HDFCBANK` | Returns fundamentals data for a symbol |

## Yahoo Finance CMP Strategy

Yahoo Finance does not provide an official free public API.

For CMP, the backend uses Yahoo Finance’s unofficial chart endpoint:

```txt
https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}