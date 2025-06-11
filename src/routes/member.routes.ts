import express from "express";
import {
  addMember,
  removeMember,
  promoteMember,
  getTeamMembers,
  updateMember,
} from "../controllers/member.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/teams/:teamId/members", authenticate, addMember);
router.delete("/teams/:teamId/members/:userId", authenticate, removeMember);
router.post(
  "/teams/:teamId/members/:memberId/promote",
  authenticate,
  promoteMember
);
router.get("/teams/:teamId/members", getTeamMembers);
router.post("/:memberId/updateRole", authenticate, updateMember);

export default router;
