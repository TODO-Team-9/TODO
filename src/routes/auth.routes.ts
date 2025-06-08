import { Router, RequestHandler } from "express";
import {
  register,
  login,
  enable2FA,
  generate2FA,
  disable2FA,
} from "../controllers/auth.controller";
import { authenticate, authenticateProvisional } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register as RequestHandler);
router.post("/login", login as RequestHandler);
router.post("/generate-2fa", authenticateProvisional, generate2FA as RequestHandler);
router.post("/enable-2fa", authenticateProvisional, enable2FA as RequestHandler);
router.post("/disable-2fa", authenticate, disable2FA as RequestHandler);

export default router;
