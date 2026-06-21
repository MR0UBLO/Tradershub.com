import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", WalletController.getWallet);
router.get("/transactions", WalletController.getTransactionHistory);

export default router;
