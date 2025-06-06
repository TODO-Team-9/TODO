import { Request, Response } from "express";
import { LookupService } from "../services/LookupService";
import { HTTP_Status } from "../enums/HTTP_Status";

const lookupService = new LookupService();

export const getSystemRoles = async (
  _request: Request,
  response: Response
): Promise<void> => {
  try {
    const roles = await lookupService.getSystemRoles();
    response.status(HTTP_Status.OK).json(roles);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getTeamRoles = async (
  _request: Request,
  response: Response
): Promise<void> => {
  try {
    const roles = await lookupService.getTeamRoles();
    response.status(HTTP_Status.OK).json(roles);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getStatuses = async (
  _request: Request,
  response: Response
): Promise<void> => {
  try {
    const statuses = await lookupService.getStatuses();
    response.status(HTTP_Status.OK).json(statuses);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getPriorities = async (
  _request: Request,
  response: Response
): Promise<void> => {
  try {
    const priorities = await lookupService.getPriorities();
    response.status(HTTP_Status.OK).json(priorities);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getRequestStatuses = async (
  _req: Request,
  response: Response
): Promise<void> => {
  try {
    const statuses = await lookupService.getRequestStatuses();
    response.status(HTTP_Status.OK).json(statuses);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
