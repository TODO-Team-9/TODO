import express from "express";
import {
  assignTask,
  changeTaskStatus,
  getTasksForTeam,
  getTasksForUser,
  createTask,
  deleteTask,
} from "../controllers/TaskController";

const router = express.Router();

router.post("/tasks", createTask);
router.post("/tasks/:taskId/assign", assignTask);
router.post("/tasks/:taskId/status", changeTaskStatus);
router.get("/teams/:teamId/tasks", getTasksForTeam);
router.get("/users/:userId/tasks", getTasksForUser);
router.delete("/tasks/:taskId", deleteTask);

export default router;
