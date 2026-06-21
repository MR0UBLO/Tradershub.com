import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message}`, { statusCode: err.statusCode });
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error("Unhandled error", err);
  res.status(500).json({ error: "Internal server error" });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
};
