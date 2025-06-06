import express from "express";
import {
  getSystemRoles,
  getTeamRoles,
  getStatuses,
  getPriorities,
  getRequestStatuses,
} from "../controllers/LookupController";

const router = express.Router();

router.get("/system-roles", getSystemRoles);
router.get("/team-roles", getTeamRoles);
router.get("/statuses", getStatuses);
router.get("/priorities", getPriorities);
router.get("/request-statuses", getRequestStatuses);

export default router;
