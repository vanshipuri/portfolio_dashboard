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