import sql from "../config/db";
import { TaskActivityReport } from "../models/TaskActivityReport";
import { TaskDailyStats } from "../models/TaskDailyStats";

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
  ): Promise<TaskDailyStats[]> {
    try {
      const stats = await sql<TaskDailyStats[]>`
        SELECT * FROM get_team_daily_task_stats(${teamId}, ${startDate}, ${endDate})
      `;
      return stats;
    } catch (error) {
      console.error("Error getting team daily task stats:", error);
      throw error;
    }
  }
} 