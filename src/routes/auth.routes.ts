import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);
router.post("/verify-token", AuthController.verifyToken);

export default router;
