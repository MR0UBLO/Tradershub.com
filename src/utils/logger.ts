import winston from "winston";
import { ENV } from "../config/env";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const metadata = Object.keys(args).length ? JSON.stringify(args) : "";
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${metadata}`;
  })
);

const logger = winston.createLogger({
  level: ENV.LOG_LEVEL,
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: ENV.LOG_FILE,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export default logger;
