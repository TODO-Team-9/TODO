import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getTeamTaskActivityReport,
  getTeamDailyTaskStats,
} from "../controllers/reporting.controller";

const router = Router();

router.get(
  "/teams/:teamId/activity",
  // authenticate,
  getTeamTaskActivityReport
);
router.get(
  "/teams/:teamId/stats",
  // authenticate,
  getTeamDailyTaskStats
);

export default router;
