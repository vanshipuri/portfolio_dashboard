import { Router } from "express";
import {
  getFundamentals,
  getPortfolioData,
  getPrices
} from "../controllers/stockController";

const router = Router();

router.get("/portfolio", getPortfolioData);
router.get("/prices", getPrices);
router.get("/fundamentals", getFundamentals);

export default router;