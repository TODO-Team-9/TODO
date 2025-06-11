import { Request, Response, NextFunction } from "express";

// Define CSP header value
const CSP_HEADER = [
  // Resource loading directives
  "default-src 'self'", // Default policy for loading resources (also covers prefetch/preload)
  "script-src 'self'", // JavaScript sources
  "style-src 'self'", // CSS sources
  "img-src 'self' data: blob:", // Image sources, including data URIs and blobs
  "connect-src 'self'", // API/AJAX/WebSocket connections
  "font-src 'self'", // Font file sources
  "media-src 'self'", // Audio/Video sources

  // Security restriction directives
  "object-src 'none'", // Block <object>, <embed>, and <applet> elements
  "frame-src 'none'", // Block <iframe> elements
  "frame-ancestors 'none'", // Block site from being embedded in frames
  "form-action 'self'", // Restrict form submissions to same origin
  "base-uri 'self'", // Restrict <base> tag URLs
  "manifest-src 'self'", // Web manifest files
  "worker-src 'self'", // Web workers and service workers

  // Additional security measures
  "upgrade-insecure-requests", // Upgrade HTTP to HTTPS
  "sandbox allow-forms allow-scripts allow-same-origin allow-popups", // Restrict features in sandboxed content
].join("; ");

// Middleware to apply CSP headers
export const cspMiddleware = (
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  response.setHeader("Content-Security-Policy", CSP_HEADER);
  next();
};

// Function to apply CSP headers to static files
export const staticCspHeaders = (response: Response) => {
  response.setHeader("Content-Security-Policy", CSP_HEADER);
};

export default cspMiddleware;
