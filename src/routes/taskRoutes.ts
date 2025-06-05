import express from 'express';
import { assignTask, changeTaskStatus, getTasksForTeam, getTasksForUser } from '../controllers/TaskController';

const router = express.Router();

router.post('/tasks/:taskId/assign', assignTask);
router.post('/tasks/:taskId/status', changeTaskStatus);
router.get('/teams/:teamId/tasks', getTasksForTeam);
router.get('/users/:userId/tasks', getTasksForUser);

export default router; 