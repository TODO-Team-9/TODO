import sql from '../db';
import { Task } from '../models/Task';

export class TaskService {
  async assignTask(taskId: number, memberId: number): Promise<void> {
    await sql`
      CALL assign_task(${taskId}, ${memberId})
    `;
  }

  async changeTaskStatus(taskId: number, statusId: number): Promise<void> {
    await sql`
      CALL change_task_status(${taskId}, ${statusId})
    `;
  }

  async getTasksForTeam(teamId: number): Promise<Task[]> {
    const tasks = await sql<Task[]>`
      SELECT * FROM get_tasks(${teamId})
    `;
    return tasks;
  }

  async getTasksForUser(userId: number): Promise<Task[]> {
    const tasks = await sql<Task[]>`
      SELECT * FROM get_user_tasks(${userId})
    `;
    return tasks;
  }

  async createTask(
    taskName: string,
    taskDescription: string | null,
    teamId: number,
    memberId?: number | null
  ): Promise<Task> {
    await sql`
      CALL create_task(
        ${taskName},
        ${teamId},
        ${taskDescription},
        ${memberId ?? null}
      )
    `;
    const [task] = await sql<Task[]>`
      SELECT * FROM tasks
      WHERE team_id = ${teamId} AND task_name = ${taskName}
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (!task) throw new Error('Task creation failed');
    return task;
  }

  async deleteTask(taskId: number): Promise<void> {
    await sql`
      CALL delete_task(${taskId})
    `;
  }
} 