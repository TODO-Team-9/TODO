import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  // TODO: Call userService.createUser
  res.status(501).send('Not implemented');
};

export const deactivateUser = async (req: Request, res: Response) => {
  // TODO: Call userService.deactivateUser
  res.status(501).send('Not implemented');
};

export const getUserById = async (req: Request, res: Response) => {
  // TODO: Call userService.getUserById
  res.status(501).send('Not implemented');
};

export const getAllUsers = async (_req: Request, res: Response) => {
  // TODO: Call userService.getAllUsers
  res.status(501).send('Not implemented');
};
 