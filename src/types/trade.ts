export interface ITrade {
  id: string;
  userId: string;
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  tradeType: "BUY" | "SELL";
  status: "OPEN" | "CLOSED" | "CANCELLED";
  profit: number;
  profitPercentage: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  commission: number;
  entryAt: Date;
  exitAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITradeRequest {
  symbol: string;
  entryPrice: number;
  quantity: number;
  tradeType: "BUY" | "SELL";
  leverage?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface ICloseTradeRequest {
  exitPrice: number;
}
