import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, username, password, firstName, lastName, phone } = req.body;

      const result = await authService.register({
        email,
        username,
        password,
        firstName,
        lastName,
        phone,
      });

      res.status(201).json(result);
    } catch (error: any) {
      logger.error("Register controller error", error);
      throw new AppError(400, error.message || "Registration failed");
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.status(200).json(result);
    } catch (error: any) {
      logger.error("Login controller error", error);
      throw new AppError(401, error.message || "Login failed");
    }
  }

  static async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.substring(7);
      if (!token) {
        throw new AppError(400, "No token provided");
      }

      const user = await authService.verifyToken(token);
      res.status(200).json({ valid: true, user });
    } catch (error: any) {
      throw new AppError(401, error.message || "Invalid token");
    }
  }
}
