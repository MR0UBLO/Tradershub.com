import { Request, Response } from "express";
import { MarketService } from "../services/market.service";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

const marketService = new MarketService();

export class MarketController {
  static async getMarkets(req: Request, res: Response) {
    try {
      const markets = await marketService.getMarkets();
      res.status(200).json(markets);
    } catch (error: any) {
      logger.error("Get markets error", error);
      throw error;
    }
  }

  static async getMarketBySymbol(req: Request, res: Response) {
    try {
      const { symbol } = req.params;
      const market = await marketService.getMarketBySymbol(symbol);

      if (!market) {
        throw new AppError(404, "Market not found");
      }

      res.status(200).json(market);
    } catch (error: any) {
      logger.error("Get market error", error);
      throw error;
    }
  }

  static async getCandles(req: Request, res: Response) {
    try {
      const { symbol } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;

      const candles = await marketService.getCandles(symbol, limit);

      res.status(200).json(candles);
    } catch (error: any) {
      logger.error("Get candles error", error);
      throw error;
    }
  }
}
