import { Request, Response } from "express";
import { TeamService } from "../services/team.service";
import { HTTP_Status } from "../enums/HTTP_Status";

const teamService = new TeamService();

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamName, teamDescription } = req.body;

    // Input validation
    if (!teamName) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: "Team name is required" });
      return;
    }

    const team = await teamService.createTeam(teamName, teamDescription);
    res.status(HTTP_Status.CREATED).json(team);
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message && (
      error.message.includes("Team name is required") ||
      error.message.includes("Team name must be less than") ||
      error.message.includes("Team description must be less than")
    )) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ 
      error: "Failed to create team"
    });
  }
};

export const getAllTeams = async (_req: Request, res: Response): Promise<void> => {
  try {
    const teams = await teamService.getAllTeams();
    res.status(HTTP_Status.OK).json(teams);
  } catch (error: any) {
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ 
      error: "Failed to retrieve teams" 
    });
  }
};

export const getTeamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Input validation
    const teamId = Number(id);
    if (isNaN(teamId) || teamId <= 0) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: "Invalid team ID" });
      return;
    }

    const team = await teamService.getTeamById(teamId);
    if (!team) {
      res.status(HTTP_Status.NOT_FOUND).json({ error: "Team not found" });
      return;
    }

    res.status(HTTP_Status.OK).json(team);
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message && error.message.includes("Invalid team ID")) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ 
      error: "Failed to retrieve team" 
    });
  }
};
