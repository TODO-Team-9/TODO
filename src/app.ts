import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";

dotenv.config({ path: path.join(__dirname, "../.env") });

import authRoutes from "./routes/auth.routes";
import apiRouter from "./routes/api.router";
import corsMiddleware from "./middleware/cors.middleware";
import cspMiddleware, { staticCspHeaders } from "./middleware/csp.middleware";
import { generalLimiter } from "./middleware/rateLimiter.middleware";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Set security headers (without CSP)
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable helmet's CSP as we use our own middleware
  })
);

// Apply CSP headers to all responses
app.use(cspMiddleware);

// CORS middleware
app.use(corsMiddleware);

app.use(generalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure static file serving with CSP headers
app.use(
  "/",
  express.static(path.join(__dirname, "../public"), {
    setHeaders: staticCspHeaders,
  })
);

app.use("/auth", authRoutes);
app.use("/api", apiRouter);

app.get("/{*any}", (_request, response) => {
  response.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
