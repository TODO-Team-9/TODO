import { Request, Response } from 'express';
import { LookupService } from '../services/LookupService';

const lookupService = new LookupService();

export const getSystemRoles = async (_req: Request, res: Response) => {
  // TODO: Call lookupService.getSystemRoles
  res.status(501).send('Not implemented');
};

export const getTeamRoles = async (_req: Request, res: Response) => {
  // TODO: Call lookupService.getTeamRoles
  res.status(501).send('Not implemented');
};

export const getStatuses = async (_req: Request, res: Response) => {
  // TODO: Call lookupService.getStatuses
  res.status(501).send('Not implemented');
};

export const getPriorities = async (_req: Request, res: Response) => {
  // TODO: Call lookupService.getPriorities
  res.status(501).send('Not implemented');
};

export const getRequestStatuses = async (_req: Request, res: Response) => {
  // TODO: Call lookupService.getRequestStatuses
  res.status(501).send('Not implemented');
}; 