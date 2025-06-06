import { Request, Response } from "express";
import { TeamService } from "../services/team.service";

const teamService = new TeamService();

export const createTeam = async (req: Request, res: Response) => {
  // TODO: Call teamService.createTeam
  res.status(501).send("Not implemented");
};

export const getAllTeams = async (_req: Request, res: Response) => {
  // TODO: Call teamService.getAllTeams
  res.status(501).send("Not implemented");
};

export const getTeamById = async (req: Request, res: Response) => {
  // TODO: Call teamService.getTeamById
  res.status(501).send("Not implemented");
};
