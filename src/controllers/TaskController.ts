import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';

const taskService = new TaskService();

export const assignTask = async (req: Request, res: Response) => {
  // TODO: Call taskService.assignTask
  res.status(501).send('Not implemented');
};

export const changeTaskStatus = async (req: Request, res: Response) => {
  // TODO: Call taskService.changeTaskStatus
  res.status(501).send('Not implemented');
};

export const getTasksForTeam = async (req: Request, res: Response) => {
  // TODO: Call taskService.getTasksForTeam
  res.status(501).send('Not implemented');
};

export const getTasksForUser = async (req: Request, res: Response) => {
  // TODO: Call taskService.getTasksForUser
  res.status(501).send('Not implemented');
}; 