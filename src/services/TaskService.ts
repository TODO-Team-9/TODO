import { Task } from '../models/Task';

export class TaskService {
  async assignTask(taskId: number, memberId: number): Promise<void> {
    // TODO: Call assign_task stored procedure
    throw new Error('Not implemented');
  }

  async changeTaskStatus(taskId: number, statusId: number): Promise<void> {
    // TODO: Call change_task_status stored procedure
    throw new Error('Not implemented');
  }

  async getTasksForTeam(teamId: number): Promise<Task[]> {
    // TODO: Call get_tasks function
    throw new Error('Not implemented');
  }

  async getTasksForUser(userId: number): Promise<Task[]> {
    // TODO: Call get_user_tasks function
    throw new Error('Not implemented');
  }
} 