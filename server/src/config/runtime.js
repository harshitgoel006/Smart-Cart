import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Load server/.env before any module reads runtime configuration.
dotenv.config({
  path: path.resolve(currentDirectory, "../../.env"),
});

const parseList = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const allowedOrigins = parseList(process.env.CORS_ORIGIN);

export const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    // Allow server-to-server/health checks that do not send an Origin header.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by SmartCart CORS policy"));
  },
};

const isProduction = process.env.NODE_ENV === "production";
const secureCookies = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === "true"
  : isProduction;

export const authCookieOptions = {
  httpOnly: true,
  secure: secureCookies,
  sameSite: process.env.COOKIE_SAME_SITE || (secureCookies ? "none" : "lax"),
  path: "/",
};
