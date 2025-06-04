import { Router, RequestHandler } from "express";
import { register, login, enable2FA } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register as RequestHandler);
router.post("/login", login as RequestHandler);
router.post("/enable-2fa", enable2FA as RequestHandler);

export default router;
