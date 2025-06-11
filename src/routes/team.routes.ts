import express from "express";
import {
  createTeam,
  getAllTeams,
  getTeamById,
} from "../controllers/team.controller";

import {
  addMember,
  removeMember,
  promoteMember,
  getTeamMembers,
} from "../controllers/member.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createTeam);
router.get("/", getAllTeams);
router.get("/:id", authenticate, getTeamById);
router.post("/:teamId/members", authenticate, addMember);
router.delete("/:teamId/members/:userId", authenticate, removeMember);
router.post("/:teamId/members/:memberId/promote", authenticate, promoteMember);
router.get("/:teamId/members", getTeamMembers);

export default router;
