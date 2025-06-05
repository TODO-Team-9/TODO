import { Request, Response } from 'express';
import { JoinRequestService } from '../services/JoinRequestService';

const joinRequestService = new JoinRequestService();

export const createJoinRequest = async (req: Request, res: Response) => {
  // TODO: Call joinRequestService.createJoinRequest
  res.status(501).send('Not implemented');
};

export const updateJoinRequestStatus = async (req: Request, res: Response) => {
  // TODO: Call joinRequestService.updateJoinRequestStatus
  res.status(501).send('Not implemented');
};

export const getJoinRequestsForTeam = async (req: Request, res: Response) => {
  // TODO: Call joinRequestService.getJoinRequestsForTeam
  res.status(501).send('Not implemented');
}; 