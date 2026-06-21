import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

const walletService = new WalletService();

export class WalletController {
  static async getWallet(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const wallet = await walletService.getWallet(userId);

      if (!wallet) {
        throw new AppError(404, "Wallet not found");
      }

      res.status(200).json(wallet);
    } catch (error: any) {
      logger.error("Get wallet error", error);
      throw error;
    }
  }

  static async getTransactionHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;

      const transactions = await walletService.getTransactionHistory(userId, limit);

      res.status(200).json(transactions);
    } catch (error: any) {
      logger.error("Get transaction history error", error);
      throw error;
    }
  }
}
