import { Request, Response } from "express";
import { MemberService } from "../services/member.service";

const memberService = new MemberService();

export const addMember = async (req: Request, res: Response) => {
  // TODO: Call memberService.addMember
  res.status(501).send("Not implemented");
};

export const removeMember = async (req: Request, res: Response) => {
  // TODO: Call memberService.removeMember
  res.status(501).send("Not implemented");
};

export const promoteMember = async (req: Request, res: Response) => {
  // TODO: Call memberService.promoteMember
  res.status(501).send("Not implemented");
};

export const getTeamMembers = async (req: Request, res: Response) => {
  // TODO: Call memberService.getTeamMembers
  res.status(501).send("Not implemented");
};
