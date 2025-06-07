import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SystemRoles } from "../constants/db.constants";

interface JwtPayload {
  userId: number;
  username: string;
  role: number;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ error: "Token error" });
    return;
  }

  const token = parts[1];

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ error: "Server auth configuration error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
    return;
  } catch (error: unknown) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};

export const isAccessAdministrator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  if (req.user.role !== SystemRoles.ACCESS_ADMINISTATOR) {
    res.status(403).json({ error: "Access denied: Admin privileges required" });
    return;
  }

  next();
};
