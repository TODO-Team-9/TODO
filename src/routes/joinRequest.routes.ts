import express from "express";
import {
  createJoinRequest,
  updateJoinRequestStatus,
  getJoinRequestsForTeam,
  getAllJoinRequests,
} from "../controllers/joinRequest.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createJoinRequest);
router.post("/:requestId/status", authenticate, updateJoinRequestStatus);
router.get("/teams/:teamId", authenticate, getJoinRequestsForTeam);
router.get("/", authenticate, getAllJoinRequests);

export default router;
