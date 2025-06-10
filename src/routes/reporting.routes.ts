import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getTeamTaskActivityReport,
  getTeamDailyTaskStats,
  getTeamTaskStatusCounts,
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
router.get(
  "/teams/:teamId/statuses",
  // authenticate,
  getTeamTaskStatusCounts
);

export default router;
