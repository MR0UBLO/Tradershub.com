import prisma from "../config/db";
import logger from "../utils/logger";
import { randomBetween, randomChoice } from "../utils/random";

const MARKET_SYMBOLS = ["BTC", "ETH", "BNB", "ADA", "SOL", "XRP", "DOT"];

export class MarketService {
  async getMarkets() {
    try {
      const markets = await prisma.market.findMany();
      return markets;
    } catch (error) {
      logger.error("Error getting markets", error);
      throw error;
    }
  }

  async getMarketBySymbol(symbol: string) {
    try {
      const market = await prisma.market.findUnique({
        where: { symbol },
      });
      return market;
    } catch (error) {
      logger.error("Error getting market", error);
      throw error;
    }
  }

  async initializeMarkets() {
    try {
      for (const symbol of MARKET_SYMBOLS) {
        const existing = await this.getMarketBySymbol(symbol);
        if (!existing) {
          const basePrice = randomBetween(100, 50000);
          await prisma.market.create({
            data: {
              symbol,
              name: `${symbol}/USD`,
              currentPrice: basePrice,
              change24h: randomBetween(-5, 5),
              changePercent24h: randomBetween(-10, 10),
              high24h: basePrice * 1.05,
              low24h: basePrice * 0.95,
              volume24h: randomBetween(1000000, 10000000),
            },
          });
        }
      }
      logger.info("Markets initialized");
    } catch (error) {
      logger.error("Error initializing markets", error);
    }
  }

  async updateMarketPrice(symbol: string, newPrice: number, changePercent: number) {
    try {
      const market = await prisma.market.update({
        where: { symbol },
        data: {
          currentPrice: newPrice,
          changePercent24h: changePercent,
          change24h: changePercent * newPrice * 0.01,
          lastUpdated: new Date(),
        },
      });
      return market;
    } catch (error) {
      logger.error("Error updating market price", error);
      throw error;
    }
  }

  async createCandle(symbol: string, ohlcData: any) {
    try {
      const market = await this.getMarketBySymbol(symbol);
      if (!market) throw new Error("Market not found");

      const candle = await prisma.candle.create({
        data: {
          marketId: market.id,
          symbol,
          open: ohlcData.open,
          high: ohlcData.high,
          low: ohlcData.low,
          close: ohlcData.close,
          volume: ohlcData.volume || 0,
          timeframe: "1m",
          timestamp: new Date(),
        },
      });

      return candle;
    } catch (error) {
      logger.error("Error creating candle", error);
      throw error;
    }
  }

  async getCandles(symbol: string, limit: number = 100) {
    try {
      const candles = await prisma.candle.findMany({
        where: { symbol },
        orderBy: { timestamp: "desc" },
        take: limit,
      });
      return candles;
    } catch (error) {
      logger.error("Error getting candles", error);
      throw error;
    }
  }
}
