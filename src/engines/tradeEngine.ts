import logger from "../utils/logger";
import prisma from "../config/db";
import { TradeService } from "../services/trade.service";

export class TradeEngine {
  private tradeService = new TradeService();
  private updateInterval: NodeJS.Timer | null = null;

  async start(intervalMs: number = 60000) {
    logger.info("Trade Engine started");
    this.updateInterval = setInterval(async () => {
      await this.processOpenTrades();
    }, intervalMs);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      logger.info("Trade Engine stopped");
    }
  }

  private async processOpenTrades() {
    try {
      const openTrades = await prisma.trade.findMany({
        where: { status: "OPEN" },
      });

      for (const trade of openTrades) {
        const market = await prisma.market.findFirst({
          where: { symbol: trade.symbol },
        });

        if (!market) continue;

        if (trade.stopLoss) {
          if (trade.tradeType === "BUY" && market.currentPrice <= trade.stopLoss) {
            await this.tradeService.closeTrade(trade.id, trade.stopLoss);
            logger.info("Trade stopped by stop-loss", { tradeId: trade.id });
            continue;
          }
          if (trade.tradeType === "SELL" && market.currentPrice >= trade.stopLoss) {
            await this.tradeService.closeTrade(trade.id, trade.stopLoss);
            logger.info("Trade stopped by stop-loss", { tradeId: trade.id });
            continue;
          }
        }

        if (trade.takeProfit) {
          if (trade.tradeType === "BUY" && market.currentPrice >= trade.takeProfit) {
            await this.tradeService.closeTrade(trade.id, trade.takeProfit);
            logger.info("Trade closed by take-profit", { tradeId: trade.id });
            continue;
          }
          if (trade.tradeType === "SELL" && market.currentPrice <= trade.takeProfit) {
            await this.tradeService.closeTrade(trade.id, trade.takeProfit);
            logger.info("Trade closed by take-profit", { tradeId: trade.id });
          }
        }
      }
    } catch (error) {
      logger.error("Trade processing error", error);
    }
  }
}
