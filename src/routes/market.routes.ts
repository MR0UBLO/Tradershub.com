import { Router } from "express";
import { MarketController } from "../controllers/market.controller";
import { optionalAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(optionalAuth);

router.get("/", MarketController.getMarkets);
router.get("/:symbol", MarketController.getMarketBySymbol);
router.get("/:symbol/candles", MarketController.getCandles);

export default router;
