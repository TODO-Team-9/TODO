import express from "express";
import {
  createJoinRequest,
  updateJoinRequestStatus,
  getJoinRequestsForTeam,
} from "../controllers/joinRequest.controller";

const router = express.Router();

router.post("/", createJoinRequest);
router.post("/:requestId/status", updateJoinRequestStatus);
router.get("/teams/:teamId", getJoinRequestsForTeam);

export default router;
    