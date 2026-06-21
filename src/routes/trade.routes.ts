import { Router } from "express";
import { TradeController } from "../controllers/trade.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { tradeLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/open", tradeLimiter, TradeController.openTrade);
router.post("/:tradeId/close", TradeController.closeTrade);
router.get("/", TradeController.getTrades);
router.get("/open", TradeController.getOpenTrades);

export default router;
