import prisma from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { validateEmail, validatePassword, validateUsername } from "../utils/validator";
import { IAuthPayload, IRegisterPayload } from "../types/user";
import logger from "../utils/logger";

export class AuthService {
  async register(payload: IRegisterPayload) {
    try {
      if (!validateEmail(payload.email)) {
        throw new Error("Invalid email format");
      }
      if (!validatePassword(payload.password)) {
        throw new Error(
          "Password must be at least 8 chars with uppercase, lowercase, number and special char"
        );
      }
      if (!validateUsername(payload.username)) {
        throw new Error("Username must be 3-30 alphanumeric characters");
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: payload.email.toLowerCase() },
            { username: payload.username.toLowerCase() },
          ],
        },
      });

      if (existingUser) {
        throw new Error("Email or username already exists");
      }

      const passwordHash = await hashPassword(payload.password);

      const user = await prisma.user.create({
        data: {
          email: payload.email.toLowerCase(),
          username: payload.username.toLowerCase(),
          passwordHash,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
        },
      });

      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 10000,
        },
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      logger.info("User registered", { userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      };
    } catch (error) {
      logger.error("Registration error", error);
      throw error;
    }
  }

  async login(payload: IAuthPayload) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: payload.email.toLowerCase() },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await comparePassword(payload.password, user.passwordHash);

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      logger.info("User logged in", { userId: user.id });

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      };
    } catch (error) {
      logger.error("Login error", error);
      throw error;
    }
  }

  async verifyToken(token: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: token },
      });
      return user;
    } catch (error) {
      logger.error("Token verification error", error);
      throw error;
    }
  }
}
