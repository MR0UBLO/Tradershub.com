import { CorsOptions } from "cors";
import { ENV } from "./env";

export const corsOptions: CorsOptions = {
  origin: [ENV.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};
