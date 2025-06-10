import { Request, Response, NextFunction } from "express";
import { HTTP_Status } from "../enums/HTTP_Status";

const getAllowedOrigins = (): string[] => {
  const origins = process.env.ALLOWED_ORIGINS;
  if (!origins) {
    throw new Error(
      "ALLOWED_ORIGINS environment variable is not set. Please set it to a comma-separated list of allowed origins."
    );
  }

  return origins.split(",").map((origin) => origin.trim());
};

const corsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    response.header("Access-Control-Allow-Origin", origin);
  }

  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.header("Access-Control-Allow-Credentials", "true");

  if (request.method === "OPTIONS") {
    response.sendStatus(HTTP_Status.OK);
  } else {
    next();
  }
};

export default corsMiddleware;
