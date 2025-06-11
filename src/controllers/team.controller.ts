import { Request, Response } from "express";
import { TeamService } from "../services/team.service";
import { MemberService } from "../services/member.service";
import { HTTP_Status } from "../enums/HTTP_Status";
import { Role } from "../enums/Role";

const teamService = new TeamService();
const memberService = new MemberService();

export const createTeam = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { teamName, teamDescription } = request.body;

    // Input validation
    if (!teamName) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "Team name is required" });
      return;
    }

    // Ensure user is authenticated
    const creatorUserId = request.user?.userId;
    if (!creatorUserId) {
      response.status(HTTP_Status.UNAUTHORIZED).json({ error: "User not authenticated" });
      return;
    }

    const team = await teamService.createTeam(teamName, teamDescription);
    // Add creator as Team Lead
    const member = await memberService.addMember(creatorUserId, team.teamId, Role.Team.TEAM_LEAD);
    response.status(HTTP_Status.CREATED).json({ team, member });
  } catch (error: any) {
    // Handle specific validation errors
    if (
      error.message &&
      (error.message.includes("Team name is required") ||
        error.message.includes("Team name must be less than") ||
        error.message.includes("Team description must be less than"))
    ) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to create team",
    });
  }
};

export const getAllTeams = async (
  _request: Request,
  response: Response
): Promise<void> => {
  try {
    const teams = await teamService.getAllTeams();
    response.status(HTTP_Status.OK).json(teams);
  } catch (error: any) {
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve teams",
    });
  }
};

export const getTeamById = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { id } = request.params;

    // Input validation
    const teamId = Number(id);
    if (isNaN(teamId) || teamId <= 0) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "Invalid team ID" });
      return;
    }

    const team = await teamService.getTeamById(teamId);
    if (!team) {
      response.status(HTTP_Status.NOT_FOUND).json({ error: "Team not found" });
      return;
    }

    response.status(HTTP_Status.OK).json(team);
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message && error.message.includes("Invalid team ID")) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve team",
    });
  }
};
