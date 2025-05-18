import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

export const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 120000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false
});