import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { HTTP_Status } from '../enums/HTTP_Status';

const taskService = new TaskService();

export const createTask = async (request: Request, response: Response): Promise<void> => {
  try {
    const { taskName, taskDescription, teamId, memberId } = request.body;
    if (!taskName || !teamId) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: 'taskName and teamId are required' });
      return;
    }
    const task = await taskService.createTask(taskName, taskDescription ?? null, teamId, memberId);
    response.status(HTTP_Status.CREATED).json(task);
  } catch (error: any) {
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const assignTask = async (request: Request, response: Response): Promise<void> => {
  try {
    const { taskId } = request.params;
    const { memberId } = request.body;
    if (!memberId) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: 'memberId is required' });
      return;
    }
    await taskService.assignTask(Number(taskId), Number(memberId));
    response.status(HTTP_Status.OK).json({ message: 'Task assigned successfully' });
  } catch (error: any) {
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const changeTaskStatus = async (request: Request, response: Response): Promise<void> => {
  try {
    const { taskId } = request.params;
    const { statusId } = request.body;
    if (!statusId) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: 'statusId is required' });
      return;
    }
    await taskService.changeTaskStatus(Number(taskId), Number(statusId));
    response.status(HTTP_Status.OK).json({ message: 'Task status updated successfully' });
  } catch (error: any) {
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getTasksForTeam = async (request: Request, response: Response): Promise<void> => {
  try {
    const { teamId } = request.params;
    const tasks = await taskService.getTasksForTeam(Number(teamId));
    response.status(HTTP_Status.OK).json(tasks);
  } catch (error: any) {
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getTasksForUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const { userId } = request.params;
    const tasks = await taskService.getTasksForUser(Number(userId));
    response.status(HTTP_Status.OK).json(tasks);
  } catch (error: any) {
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}; 