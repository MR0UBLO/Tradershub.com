import prisma from "../config/db";
import { WalletService } from "./wallet.service";
import logger from "../utils/logger";

export class TradeService {
  private walletService = new WalletService();

  async openTrade(
    userId: string,
    symbol: string,
    entryPrice: number,
    quantity: number,
    tradeType: "BUY" | "SELL",
    leverage: number = 1,
    stopLoss?: number,
    takeProfit?: number
  ) {
    try {
      const tradeValue = entryPrice * quantity;
      const commission = tradeValue * 0.001;

      await this.walletService.lockBalance(userId, tradeValue + commission);

      const trade = await prisma.trade.create({
        data: {
          userId,
          symbol,
          entryPrice,
          quantity,
          tradeType,
          leverage,
          stopLoss,
          takeProfit,
          commission,
        },
      });

      await this.walletService.recordTransaction(
        userId,
        "trade_open",
        -(tradeValue + commission),
        `Opened ${tradeType} trade on ${symbol}`,
        trade.id
      );

      logger.info("Trade opened", {
        tradeId: trade.id,
        userId,
        symbol,
        quantity,
      });

      return trade;
    } catch (error) {
      logger.error("Error opening trade", error);
      throw error;
    }
  }

  async closeTrade(tradeId: string, exitPrice: number) {
    try {
      const trade = await prisma.trade.findUnique({
        where: { id: tradeId },
      });

      if (!trade) throw new Error("Trade not found");
      if (trade.status !== "OPEN") throw new Error("Trade is not open");

      const profit = this.calculateProfit(
        trade.tradeType,
        trade.entryPrice,
        exitPrice,
        trade.quantity,
        trade.commission
      );

      const profitPercentage = (profit / (trade.entryPrice * trade.quantity)) * 100;

      const closedTrade = await prisma.trade.update({
        where: { id: tradeId },
        data: {
          exitPrice,
          status: "CLOSED",
          profit,
          profitPercentage,
          exitAt: new Date(),
        },
      });

      const tradeValue = trade.entryPrice * trade.quantity;
      await this.walletService.unlockBalance(trade.userId, tradeValue + trade.commission);
      await this.walletService.updateBalance(trade.userId, profit);

      await this.walletService.recordTransaction(
        trade.userId,
        profit > 0 ? "trade_profit" : "trade_loss",
        profit,
        `Closed ${trade.tradeType} trade on ${trade.symbol}`,
        tradeId
      );

      logger.info("Trade closed", {
        tradeId,
        profit,
        profitPercentage,
      });

      return closedTrade;
    } catch (error) {
      logger.error("Error closing trade", error);
      throw error;
    }
  }

  async getTrades(userId: string) {
    try {
      const trades = await prisma.trade.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return trades;
    } catch (error) {
      logger.error("Error getting trades", error);
      throw error;
    }
  }

  async getOpenTrades(userId: string) {
    try {
      const trades = await prisma.trade.findMany({
        where: {
          userId,
          status: "OPEN",
        },
      });
      return trades;
    } catch (error) {
      logger.error("Error getting open trades", error);
      throw error;
    }
  }

  private calculateProfit(
    tradeType: "BUY" | "SELL",
    entryPrice: number,
    exitPrice: number,
    quantity: number,
    commission: number
  ): number {
    if (tradeType === "BUY") {
      return (exitPrice - entryPrice) * quantity - commission;
    } else {
      return (entryPrice - exitPrice) * quantity - commission;
    }
  }
}
