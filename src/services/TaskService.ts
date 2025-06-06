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
    // Use the get_tasks function or tasks_overview view
    const tasks = await sql<Task[]>`
      SELECT * FROM get_tasks(${teamId})
    `;
    return tasks;
  }

  async getTasksForUser(userId: number): Promise<Task[]> {
    // Use the get_user_tasks function
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
    // Call the create_task stored procedure
    await sql`
      CALL create_task(
        ${taskName},
        ${taskDescription},
        ${teamId},
        ${memberId ?? null}
      )
    `;
    // Fetch the most recently created task for this team with the given name (assuming task names are unique per team)
    const [task] = await sql<Task[]>`
      SELECT * FROM tasks
      WHERE team_id = ${teamId} AND task_name = ${taskName}
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (!task) throw new Error('Task creation failed');
    return task;
  }
} 