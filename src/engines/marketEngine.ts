import logger from "../utils/logger";
import { randomBetween, randomPercentage } from "../utils/random";
import prisma from "../config/db";

export class MarketEngine {
  private updateInterval: NodeJS.Timer | null = null;

  async start(intervalMs: number = 5000) {
    logger.info("Market Engine started");
    this.updateInterval = setInterval(async () => {
      await this.updateAllMarkets();
    }, intervalMs);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      logger.info("Market Engine stopped");
    }
  }

  private async updateAllMarkets() {
    try {
      const markets = await prisma.market.findMany();

      for (const market of markets) {
        const changePercent = randomPercentage() * 0.5;
        const newPrice = market.currentPrice * (1 + changePercent * 0.01);

        await prisma.market.update({
          where: { id: market.id },
          data: {
            currentPrice: Math.max(newPrice, 0.01),
            changePercent24h: market.changePercent24h + changePercent,
            change24h: (market.changePercent24h + changePercent) * newPrice * 0.01,
            high24h: Math.max(market.high24h || newPrice, newPrice),
            low24h: Math.min(market.low24h || newPrice, newPrice),
            lastUpdated: new Date(),
          },
        });
      }
    } catch (error) {
      logger.error("Market update error", error);
    }
  }
}
