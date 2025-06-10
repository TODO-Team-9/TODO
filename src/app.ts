import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config({ path: path.join(__dirname, "../.env") });

import authRoutes from "./routes/auth.routes";
import apiRouter from "./routes/api.router";
import corsMiddleware from "./middleware/cors.middleware";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Define CSP header value
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "font-src 'self'",
  "object-src 'none'",
  "media-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "prefetch-src 'self'",
  "upgrade-insecure-requests",
  "sandbox allow-forms allow-scripts allow-same-origin allow-popups"
].join('; ');

// Set security headers including CSP
app.use(helmet({
  contentSecurityPolicy: false // Disable helmet's CSP as we'll set it manually
}));

// Apply CSP to all responses
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', CSP_HEADER);
  next();
});

// CORS middleware
app.use(corsMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure static file serving with custom headers
app.use("/", express.static(path.join(__dirname, "../public"), {
  setHeaders: (res) => {
    res.setHeader('Content-Security-Policy', CSP_HEADER);
  }
}));

app.use("/auth", authRoutes);
app.use("/api", apiRouter);

// Handle 404s with proper headers
app.use((req, res) => {
  res.setHeader('Content-Security-Policy', CSP_HEADER);
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
