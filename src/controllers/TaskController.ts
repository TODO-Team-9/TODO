import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { HTTP_Status } from '../enums/HTTP_Status';

const taskService = new TaskService();

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskName, taskDescription, teamId, memberId } = req.body;
    if (!taskName || !teamId) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: 'taskName and teamId are required' });
      return;
    }
    const task = await taskService.createTask(taskName, taskDescription ?? null, teamId, memberId);
    res.status(HTTP_Status.CREATED).json(task);
  } catch (err: any) {
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const assignTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { memberId } = req.body;
    if (!memberId) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: 'memberId is required' });
      return;
    }
    await taskService.assignTask(Number(taskId), Number(memberId));
    res.status(HTTP_Status.OK).json({ message: 'Task assigned successfully' });
  } catch (err: any) {
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const changeTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { statusId } = req.body;
    if (!statusId) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: 'statusId is required' });
      return;
    }
    await taskService.changeTaskStatus(Number(taskId), Number(statusId));
    res.status(HTTP_Status.OK).json({ message: 'Task status updated successfully' });
  } catch (err: any) {
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const getTasksForTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const tasks = await taskService.getTasksForTeam(Number(teamId));
    res.status(HTTP_Status.OK).json(tasks);
  } catch (err: any) {
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const getTasksForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const tasks = await taskService.getTasksForUser(Number(userId));
    res.status(HTTP_Status.OK).json(tasks);
  } catch (err: any) {
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
}; 