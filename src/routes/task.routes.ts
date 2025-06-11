import express from "express";
import {
  assignTask,
  changeTaskStatus,
  getTasksForTeam,
  getTasksForUser,
  createTask,
  deleteTask,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createTask);
router.post("/:taskId/assign", authenticate, assignTask);
router.post("/:taskId/status", authenticate, changeTaskStatus);
router.get("/teams/:teamId", authenticate, getTasksForTeam);
router.get("/users/:userId", authenticate, getTasksForUser);
router.delete("/:taskId", authenticate, deleteTask);

export default router;
