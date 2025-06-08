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

const router = express.Router();

router.post("/", createTeam);
router.get("/", getAllTeams);
router.get("/:id", getTeamById);
router.post("/:teamId/members", addMember);
router.delete("/:teamId/members/:userId", removeMember);
router.post("/:teamId/members/:memberId/promote", promoteMember);
router.get("/:teamId/members", getTeamMembers);


export default router;
