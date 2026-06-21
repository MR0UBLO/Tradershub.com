import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { IUserRequest } from "../types/user";

export const generateToken = (user: IUserRequest): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRY }
  );
};

export const verifyToken = (token: string): IUserRequest => {
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as IUserRequest;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};
