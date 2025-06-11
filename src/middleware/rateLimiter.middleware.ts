import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

const formatTimeRemaining = (ms: number): string => {
  const minutes = Math.ceil(ms / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    }
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
};

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10000,
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: 15 * 60 * 1000,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimitInfo` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (request: Request, response: Response) => {
    const timeRemaining = request.rateLimit?.resetTime
      ? request.rateLimit.resetTime.getTime() - Date.now()
      : 15 * 60 * 1000;

    response.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      retryAfter: formatTimeRemaining(timeRemaining),
      retryAfterMs: timeRemaining,
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    error:
      "Too many authentication attempts from this IP, please try again later.",
    retryAfter: 15 * 60 * 1000,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (request: Request, response: Response) => {
    const timeRemaining = request.rateLimit?.resetTime
      ? request.rateLimit.resetTime.getTime() - Date.now()
      : 15 * 60 * 1000;

    response.status(429).json({
      error:
        "Too many authentication attempts from this IP. Please try again later.",
      retryAfter: formatTimeRemaining(timeRemaining),
      retryAfterMs: timeRemaining,
    });
  },
});

export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: {
    error:
      "Too many registration attempts from this IP, please try again later.",
    retryAfter: 60 * 60 * 1000,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request: Request, response: Response) => {
    const timeRemaining = request.rateLimit?.resetTime
      ? request.rateLimit.resetTime.getTime() - Date.now()
      : 60 * 60 * 1000;

    response.status(429).json({
      error:
        "Too many registration attempts from this IP. Please try again later.",
      retryAfter: formatTimeRemaining(timeRemaining),
      retryAfterMs: timeRemaining,
    });
  },
});

export const twoFactorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    error: "Too many 2FA attempts from this IP, please try again later.",
    retryAfter: 15 * 60 * 1000,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request: Request, response: Response) => {
    const timeRemaining = request.rateLimit?.resetTime
      ? request.rateLimit.resetTime.getTime() - Date.now()
      : 15 * 60 * 1000;

    response.status(429).json({
      error: "Too many 2FA attempts from this IP. Please try again later.",
      retryAfter: formatTimeRemaining(timeRemaining),
      retryAfterMs: timeRemaining,
    });
  },
});
