import express from "express";
import {
  assignTask,
  changeTaskStatus,
  getTasksForTeam,
  getTasksForUser,
  createTask,
  deleteTask,
} from "../controllers/task.controller";

const router = express.Router();

router.post("/", createTask);
router.post("/:taskId/assign", assignTask);
router.post("/:taskId/status", changeTaskStatus);
router.get("/teams/:teamId", getTasksForTeam);
router.get("/users/:userId", getTasksForUser);
router.delete("/:taskId", deleteTask);

export default router;
