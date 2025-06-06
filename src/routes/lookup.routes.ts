import express from "express";
import {
  getSystemRoles,
  getTeamRoles,
  getStatuses,
  getPriorities,
  getRequestStatuses,
} from "../controllers/lookup.controller";

const router = express.Router();

router.get("/systemRoles", getSystemRoles);
router.get("/teamRoles", getTeamRoles);
router.get("/statuses", getStatuses);
router.get("/priorities", getPriorities);
router.get("/requestStatuses", getRequestStatuses);

export default router;
