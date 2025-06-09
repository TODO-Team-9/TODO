import express from "express";
import {
  createJoinRequest,
  updateJoinRequestStatus,
  getJoinRequestsForTeam,
  getAllJoinRequests,
} from "../controllers/joinRequest.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", createJoinRequest);
router.post("/:requestId/status", updateJoinRequestStatus);
router.get("/teams/:teamId", getJoinRequestsForTeam);
router.get("/", /*authenticate,*/ getAllJoinRequests);

export default router;
    