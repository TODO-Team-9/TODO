import { Router, RequestHandler } from "express";
import {
  authenticate,
  isAccessAdministrator,
} from "../middleware/auth.middleware";
import {
  createUser,
  deactivateUser,
  getUserById,
  getAllUsers,
  getUserJoinRequests,
  getUserTeams,
} from "../controllers/user.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  isAccessAdministrator,
  getAllUsers as RequestHandler
);
router.post(
  "/:id/deactivate",
  authenticate,
  isAccessAdministrator,
  deactivateUser as RequestHandler
);

router.post("/", createUser as RequestHandler);
router.get("/:id", authenticate, getUserById as RequestHandler);

router.get(
  "/:userId/join-requests",
  authenticate,
  getUserJoinRequests as RequestHandler
);
router.get("/:userId/teams", authenticate, getUserTeams as RequestHandler);

export default router;
