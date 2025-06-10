import { Request, Response } from "express";
import { ReportingService } from "../services/reporting.service";
import { HTTP_Status } from "../enums/HTTP_Status";

const reportingService = new ReportingService();

function isValidDateString(dateStr: unknown): dateStr is string {
  return typeof dateStr === 'string' && !isNaN(Date.parse(dateStr));
}

function parseDate(dateStr: unknown): Date | null {
  if (!isValidDateString(dateStr)) {
    return null;
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

export async function getTeamTaskActivityReport(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const teamId = Number(request.params.teamId);
    const { startDate, endDate } = request.query;

    if (!teamId || isNaN(teamId)) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Valid team ID is required"
      });
      return;
    }

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);

    if (!parsedStartDate || !parsedEndDate) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Valid startDate and endDate are required (ISO 8601 format, e.g., 2025-01-01)"
      });
      return;
    }

    if (parsedEndDate < parsedStartDate) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "endDate must be after startDate"
      });
      return;
    }

    const report = await reportingService.getTeamTaskActivityReport(
      teamId,
      parsedStartDate,
      parsedEndDate
    );

    response.status(HTTP_Status.OK).json(report);
  } catch (error) {
    console.error("Error in getTeamTaskActivityReport:", error);
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to generate task activity report"
    });
  }
}

export async function getTeamDailyTaskStats(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const teamId = Number(request.params.teamId);
    const { startDate, endDate } = request.query;

    if (!teamId || isNaN(teamId)) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Valid team ID is required"
      });
      return;
    }

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);

    if (!parsedStartDate || !parsedEndDate) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Valid startDate and endDate are required (ISO 8601 format, e.g., 2025-01-01)"
      });
      return;
    }

    if (parsedEndDate < parsedStartDate) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "endDate must be after startDate"
      });
      return;
    }

    const stats = await reportingService.getTeamDailyTaskStats(
      teamId,
      parsedStartDate,
      parsedEndDate
    );

    response.status(HTTP_Status.OK).json(stats);
  } catch (error) {
    console.error("Error in getTeamDailyTaskStats:", error);
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to generate daily task statistics"
    });
  }
}

export async function getTeamTaskStatusCounts(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const teamId = Number(request.params.teamId);
    if (!teamId || isNaN(teamId)) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Valid team ID is required"
      });
      return;
    }
    const counts = await reportingService.getTeamTaskStatusCounts(teamId);
    response.status(HTTP_Status.OK).json(counts);
  } catch (error) {
    console.error("Error in getTeamTaskStatusCounts:", error);
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to get team task status counts"
    });
  }
} 