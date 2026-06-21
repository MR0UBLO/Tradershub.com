import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || "5000"),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "your_super_secret_jwt_key",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "noreply@tradershub.com",
  MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || "",
  MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || "",
  MPESA_SHORTCODE: process.env.MPESA_SHORTCODE || "",
  MPESA_PASSKEY: process.env.MPESA_PASSKEY || "",
  MPESA_CALLBACK_URL: process.env.MPESA_CALLBACK_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  MARKET_UPDATE_INTERVAL: parseInt(process.env.MARKET_UPDATE_INTERVAL || "5000"),
  AI_SIGNAL_INTERVAL: parseInt(process.env.AI_SIGNAL_INTERVAL || "30000"),
  TRADE_SETTLEMENT_INTERVAL: parseInt(process.env.TRADE_SETTLEMENT_INTERVAL || "60000"),
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_FILE: process.env.LOG_FILE || "logs/app.log",
};
