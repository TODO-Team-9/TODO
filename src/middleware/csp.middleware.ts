import { Request, Response, NextFunction } from 'express';

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

// Middleware to apply CSP headers
export const cspMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Security-Policy', CSP_HEADER);
  next();
};

// Function to apply CSP headers to static files
export const staticCspHeaders = (res: Response) => {
  res.setHeader('Content-Security-Policy', CSP_HEADER);
};

export default cspMiddleware; 