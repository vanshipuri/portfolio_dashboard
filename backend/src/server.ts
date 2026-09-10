import express from "express";
import cors, { type CorsOptions } from "cors";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
import stockRoutes from "./routes/stockRoutes";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

/*
 * Allowed frontend origins.
 *
 * Supports:
 * - Local Next.js development
 * - FRONTEND_URL from Render
 * - Multiple origins through ALLOWED_ORIGINS
 */
const allowedOrigins = [
  "http://localhost:3000",

  process.env.FRONTEND_URL,

  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS
        .split(",")
        .map((origin) => origin.trim())
    : []),
].filter((origin): origin is string => Boolean(origin));

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    /*
     * Requests from tools such as curl/Postman may not contain
     * an Origin header.
     */
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    console.warn(`CORS blocked origin: ${origin}`);

    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: false,
};

/*
 * CORS must be registered BEFORE API routes.
 */
app.use(cors(corsOptions));

app.use(express.json());

/*
 * Health endpoint
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    service: "portfolio-dashboard-api",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/*
 * Application API
 *
 * Example:
 * GET /api/portfolio
 * GET /api/prices
 * GET /api/fundamentals
 */
app.use("/api", stockRoutes);

/*
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

/*
 * Global error handler
 */
app.use(
  (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("Unhandled error:", error.message);

    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred."
          : error.message,
    });
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio API listening on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});