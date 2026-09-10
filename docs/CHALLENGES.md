# Technical Challenges and Solutions

## 1. Yahoo Finance Has No Official Public API

### Problem

The assignment requires fetching CMP from Yahoo Finance, but Yahoo Finance does not provide an official free public API.

### Solution

I used Yahoo Finance’s unofficial chart endpoint from the backend:

```txt
https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}