import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../enums/Role";
import { HTTP_Status } from "../enums/HTTP_Status";

interface JwtPayload {
  userId: number;
  username: string;
  role: number;
  twoFactorVerified?: boolean;
  isHttpOnlyCookie?: boolean; // Flag to differentiate cookie tokens
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateProvisional = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const cookieToken = request.cookies?.provisionalToken;

  if (!cookieToken) {
    // Check if they're trying to use header-based auth
    const authHeader = request.headers.authorization;

    if (authHeader) {
      response.status(HTTP_Status.UNAUTHORIZED).json({
        error:
          "Header-based authentication is deprecated. Please use cookie-based authentication.",
      });
      return;
    }

    response
      .status(HTTP_Status.UNAUTHORIZED)
      .json({ error: "No token provided" });
    return;
  }

  if (!process.env.JWT_PROVISIONAL_SECRET) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Server auth configuration error" });
    return;
  }

  try {
    const decoded = jwt.verify(
      cookieToken,
      process.env.JWT_PROVISIONAL_SECRET
    ) as JwtPayload;

    // Verify this is a cookie token
    if (!decoded.isHttpOnlyCookie) {
      response
        .status(HTTP_Status.UNAUTHORIZED)
        .json({ error: "Invalid token source" });
      return;
    }

    request.user = decoded;
    next();
    return;
  } catch (error: unknown) {
    console.error("Provisional token verification error:", error);
    response.status(HTTP_Status.UNAUTHORIZED).json({ error: "Invalid token" });
    return;
  }
};

export const authenticate = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const cookieToken = request.cookies?.authToken;

  if (!cookieToken) {
    const authHeader = request.headers.authorization;

    if (authHeader) {
      response.status(HTTP_Status.UNAUTHORIZED).json({
        error:
          "Header-based authentication is deprecated. Please use cookie-based authentication.",
      });
      return;
    }

    response
      .status(HTTP_Status.UNAUTHORIZED)
      .json({ error: "No token provided" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Server auth configuration error" });
    return;
  }

  try {
    const decoded = jwt.verify(
      cookieToken,
      process.env.JWT_SECRET
    ) as JwtPayload;

    if (!decoded.isHttpOnlyCookie) {
      response
        .status(HTTP_Status.UNAUTHORIZED)
        .json({ error: "Invalid token source" });
      return;
    }

    request.user = decoded;
    next();
    return;
  } catch (error: unknown) {
    console.error("Token verification error:", error);
    response.status(HTTP_Status.UNAUTHORIZED).json({ error: "Invalid token" });
    return;
  }
};

export const isAccessAdministrator = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (!request.user) {
    response
      .status(HTTP_Status.UNAUTHORIZED)
      .json({ error: "User not authenticated" });
    return;
  }

  if (request.user.role !== Role.System.ACCESS_ADMINISTRATOR) {
    response
      .status(HTTP_Status.FORBIDDEN)
      .json({ error: "Access denied: Admin privileges required" });
    return;
  }

  next();
};
