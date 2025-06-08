import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../enums/Role";
import { HTTP_Status } from "../enums/HTTP_Status";

interface JwtPayload {
  userId: number;
  username: string;
  role: number;
  twoFactorVerified?: boolean;
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
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response
      .status(HTTP_Status.UNAUTHORIZED)
      .json({ error: "No token provided" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    response.status(HTTP_Status.UNAUTHORIZED).json({ error: "Token error" });
    return;
  }

  const token = parts[1];

  if (!process.env.JWT_PROVISIONAL_SECRET) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Server auth configuration error" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_PROVISIONAL_SECRET
    ) as JwtPayload;

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
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response
      .status(HTTP_Status.UNAUTHORIZED)
      .json({ error: "No token provided" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    response.status(HTTP_Status.UNAUTHORIZED).json({ error: "Token error" });
    return;
  }

  const token = parts[1];

  if (!process.env.JWT_SECRET) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Server auth configuration error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

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
