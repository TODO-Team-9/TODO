import sql from "../config/db";
import { TaskActivityReport } from "../models/TaskActivityReport";
import { TaskMemberStats } from "../models/TaskMemberStats";
import { TaskStatusCounts } from "../models/TaskStatusCounts";

export class ReportingService {
  async getTeamTaskActivityReport(
    teamId: number,
    startDate: Date,
    endDate: Date
  ): Promise<TaskActivityReport[]> {
    try {
      const report = await sql<TaskActivityReport[]>`
        SELECT * FROM get_team_task_activity_report(${teamId}, ${startDate}, ${endDate})
      `;
      return report;
    } catch (error) {
      console.error("Error getting team task activity report:", error);
      throw error;
    }
  }

  async getTeamDailyTaskStats(
    teamId: number,
    startDate: Date,
    endDate: Date
  ): Promise<TaskMemberStats[]> {
    try {
      const stats = await sql<TaskMemberStats[]>`
        SELECT * FROM get_team_daily_task_stats(${teamId}, ${startDate}, ${endDate})
      `;
      return stats;
    } catch (error) {
      console.error("Error getting team daily task stats:", error);
      throw error;
    }
  }

  async getTeamTaskStatusCounts(
    teamId: number
  ): Promise<TaskStatusCounts> {
    try {
      const [counts] = await sql<TaskStatusCounts[]>`
        SELECT backlog, in_progress, completed FROM get_team_task_status_counts(${teamId})
      `;
      return counts;
    } catch (error) {
      console.error("Error getting team task status counts:", error);
      throw error;
    }
  }
} 