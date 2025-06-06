import express from "express";
import {
  createJoinRequest,
  updateJoinRequestStatus,
  getJoinRequestsForTeam,
} from "../controllers/joinRequest.controller";

const router = express.Router();

router.post("/joinRequests", createJoinRequest);
router.post("/joinRequests/:requestId/status", updateJoinRequestStatus);
router.get("/teams/:teamId/joinRequests", getJoinRequestsForTeam);

export default router;
