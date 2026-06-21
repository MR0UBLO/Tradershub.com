import logger from "../utils/logger";
import prisma from "../config/db";
import { randomBetween } from "../utils/random";

export class CandleEngine {
  private candleData: Map<string, any> = new Map();
  private updateInterval: NodeJS.Timer | null = null;

  async start(intervalMs: number = 60000) {
    logger.info("Candle Engine started");
    this.updateInterval = setInterval(async () => {
      await this.generateCandles();
    }, intervalMs);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      logger.info("Candle Engine stopped");
    }
  }

  private async generateCandles() {
    try {
      const markets = await prisma.market.findMany();

      for (const market of markets) {
        const open = market.currentPrice;
        const close = market.currentPrice * (1 + randomBetween(-0.02, 0.02));
        const high = Math.max(open, close) * (1 + randomBetween(0, 0.01));
        const low = Math.min(open, close) * (1 - randomBetween(0, 0.01));
        const volume = randomBetween(1000000, 5000000);

        await prisma.candle.create({
          data: {
            marketId: market.id,
            symbol: market.symbol,
            open,
            high,
            low,
            close,
            volume,
            timeframe: "1m",
            timestamp: new Date(),
          },
        });
      }
    } catch (error) {
      logger.error("Candle generation error", error);
    }
  }
}
