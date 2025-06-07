import { Request, Response, NextFunction } from "express";
import { HTTP_Status } from "../enums/HTTP_Status";

const corsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.header("Access-Control-Allow-Origin", "*");
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
