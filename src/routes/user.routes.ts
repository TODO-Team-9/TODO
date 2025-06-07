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
} from "../controllers/user.controller";

const router = Router();

// Admin routes
router.get("/users", authenticate, isAccessAdministrator, getAllUsers as RequestHandler);
router.post("/users/:id/deactivate", authenticate, isAccessAdministrator, deactivateUser as RequestHandler);

// User routes
router.post("/users", createUser as RequestHandler);
router.get("/users/:id", authenticate, getUserById as RequestHandler);

export default router;
