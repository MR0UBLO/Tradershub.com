import { Request, Response } from "express";
import { TradeService } from "../services/trade.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

const tradeService = new TradeService();

export class TradeController {
  static async openTrade(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { symbol, entryPrice, quantity, tradeType, leverage, stopLoss, takeProfit } = req.body;

      if (!symbol || !entryPrice || !quantity || !tradeType) {
        throw new AppError(400, "Missing required fields");
      }

      const trade = await tradeService.openTrade(
        userId,
        symbol,
        entryPrice,
        quantity,
        tradeType,
        leverage || 1,
        stopLoss,
        takeProfit
      );

      res.status(201).json(trade);
    } catch (error: any) {
      logger.error("Open trade error", error);
      throw error;
    }
  }

  static async closeTrade(req: AuthRequest, res: Response) {
    try {
      const { tradeId } = req.params;
      const { exitPrice } = req.body;

      if (!exitPrice) {
        throw new AppError(400, "Exit price is required");
      }

      const trade = await tradeService.closeTrade(tradeId, exitPrice);

      res.status(200).json(trade);
    } catch (error: any) {
      logger.error("Close trade error", error);
      throw error;
    }
  }

  static async getTrades(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const trades = await tradeService.getTrades(userId);

      res.status(200).json(trades);
    } catch (error: any) {
      logger.error("Get trades error", error);
      throw error;
    }
  }

  static async getOpenTrades(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const trades = await tradeService.getOpenTrades(userId);

      res.status(200).json(trades);
    } catch (error: any) {
      logger.error("Get open trades error", error);
      throw error;
    }
  }
}
