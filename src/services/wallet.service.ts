import prisma from "../config/db";
import logger from "../utils/logger";

export class WalletService {
  async getWallet(userId: string) {
    try {
      const wallet = await prisma.wallet.findUnique({
        where: { userId },
      });
      return wallet;
    } catch (error) {
      logger.error("Error getting wallet", error);
      throw error;
    }
  }

  async updateBalance(userId: string, amount: number) {
    try {
      const wallet = await prisma.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      return wallet;
    } catch (error) {
      logger.error("Error updating balance", error);
      throw error;
    }
  }

  async lockBalance(userId: string, amount: number) {
    try {
      const wallet = await prisma.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      return await prisma.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: amount },
          lockedBalance: { increment: amount },
        },
      });
    } catch (error) {
      logger.error("Error locking balance", error);
      throw error;
    }
  }

  async unlockBalance(userId: string, amount: number) {
    try {
      return await prisma.wallet.update({
        where: { userId },
        data: {
          lockedBalance: { decrement: amount },
          balance: { increment: amount },
        },
      });
    } catch (error) {
      logger.error("Error unlocking balance", error);
      throw error;
    }
  }

  async recordTransaction(
    userId: string,
    type: string,
    amount: number,
    description?: string,
    tradeId?: string
  ) {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet) throw new Error("Wallet not found");

      const transaction = await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type,
          amount,
          balance: wallet.balance,
          description,
          tradeId,
        },
      });

      return transaction;
    } catch (error) {
      logger.error("Error recording transaction", error);
      throw error;
    }
  }

  async getTransactionHistory(userId: string, limit: number = 50) {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet) throw new Error("Wallet not found");

      const transactions = await prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return transactions;
    } catch (error) {
      logger.error("Error getting transaction history", error);
      throw error;
    }
  }
}
