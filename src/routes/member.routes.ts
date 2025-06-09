import express from "express";
import {
  addMember,
  removeMember,
  promoteMember,
  getTeamMembers,
  updateMember,
} from "../controllers/member.controller";

const router = express.Router();

router.post("/teams/:teamId/members", addMember);
router.delete("/teams/:teamId/members/:userId", removeMember);
router.post("/teams/:teamId/members/:memberId/promote", promoteMember);
router.get("/teams/:teamId/members", getTeamMembers);
router.post("/:memberId/updateRole", updateMember);

export default router;
