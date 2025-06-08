import { Request, Response } from "express";
import { ReportingService } from "../services/reporting.service";
import { HTTP_Status } from "../enums/HTTP_Status";

const reportingService = new ReportingService();

export async function getTeamTaskActivityReport(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { teamId } = request.params;
    const { startDate, endDate } = request.query;

    if (!teamId || !startDate || !endDate) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Team ID, start date, and end date are required",
      });
      return;
    }

    // Validate dates
    const parsedStartDate = new Date(startDate as string);
    const parsedEndDate = new Date(endDate as string);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Invalid date format. Use ISO 8601 format (e.g., 2024-01-01)",
      });
      return;
    }

    const report = await reportingService.getTeamTaskActivityReport(
      Number(teamId),
      parsedStartDate,
      parsedEndDate
    );

    response.status(HTTP_Status.OK).json(report);
  } catch (error) {
    console.error("Error in getTeamTaskActivityReport:", error);
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to generate task activity report",
    });
  }
}

export async function getTeamDailyTaskStats(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { teamId } = request.params;
    const { startDate, endDate } = request.query;

    if (!teamId || !startDate || !endDate) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Team ID, start date, and end date are required",
      });
      return;
    }

    // Validate dates
    const parsedStartDate = new Date(startDate as string);
    const parsedEndDate = new Date(endDate as string);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Invalid date format. Use ISO 8601 format (e.g., 2024-01-01)",
      });
      return;
    }

    const stats = await reportingService.getTeamDailyTaskStats(
      Number(teamId),
      parsedStartDate,
      parsedEndDate
    );

    response.status(HTTP_Status.OK).json(stats);
  } catch (error) {
    console.error("Error in getTeamDailyTaskStats:", error);
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to generate daily task statistics",
    });
  }
} 