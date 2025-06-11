import { Router, RequestHandler } from "express";
import {
  register,
  login,
  enable2FA,
  generate2FA,
  logout,
} from "../controllers/auth.controller";
import { authenticateProvisional } from "../middleware/auth.middleware";
import {
  authLimiter,
  registrationLimiter,
  twoFactorLimiter,
} from "../middleware/rateLimiter.middleware";

const router = Router();

router.post("/register", registrationLimiter, register as RequestHandler);
router.post("/login", authLimiter, login as RequestHandler);
router.post(
  "/generate-2fa",
  twoFactorLimiter,
  authenticateProvisional,
  generate2FA as RequestHandler
);
router.post(
  "/enable-2fa",
  twoFactorLimiter,
  authenticateProvisional,
  enable2FA as RequestHandler
);
router.post("/logout", logout as RequestHandler);

export default router;
