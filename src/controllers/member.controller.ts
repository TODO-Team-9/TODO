import { Request, Response } from "express";
import { MemberService } from "../services/member.service";
import { HTTP_Status } from "../enums/HTTP_Status";

const memberService = new MemberService();

export const addMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    const { teamId } = req.params;

    // Input validation
    if (!userId || !teamId) {
      res.status(HTTP_Status.BAD_REQUEST).json({ 
        error: "User ID and team ID are required" 
      });
      return;
    }

    const member = await memberService.addMember(Number(userId), Number(teamId));
    res.status(HTTP_Status.CREATED).json(member);
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message && (
      error.message.includes("Invalid user ID") ||
      error.message.includes("Invalid team ID") ||
      error.message.includes("User does not exist") ||
      error.message.includes("Team does not exist") ||
      error.message.includes("User is already a member")
    )) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ 
      error: "Failed to add member to team" 
    });
  }
};

export const removeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, teamId } = req.params;

    // Input validation
    if (!userId || !teamId) {
      res.status(HTTP_Status.BAD_REQUEST).json({ 
        error: "User ID and team ID are required" 
      });
      return;
    }

    await memberService.removeMember(Number(userId), Number(teamId));
    res.status(HTTP_Status.OK).json({ 
      message: "Member removed successfully" 
    });
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message && (
      error.message.includes("Invalid user ID") ||
      error.message.includes("Invalid team ID") ||
      error.message.includes("User does not exist") ||
      error.message.includes("Team does not exist") ||
      error.message.includes("User does not exist in that team") ||
      error.message.includes("already been removed")
    )) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ 
      error: "Failed to remove member from team" 
    });
  }
};

export const promoteMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { memberId, teamId } = req.params;

    // Input validation
    if (!memberId || !teamId) {
      res.status(HTTP_Status.BAD_REQUEST).json({ 
        error: "Member ID and team ID are required" 
      });
      return;
    }

    await memberService.promoteMember(Number(memberId), Number(teamId));
    res.status(HTTP_Status.OK).json({ 
      message: "Member promoted successfully" 
    });
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message && (
      error.message.includes("Invalid member ID") ||
      error.message.includes("Invalid team ID") ||
      error.message.includes("Member does not exist in the specified team") ||
      error.message.includes("already been promoted") ||
      error.message.includes("has been removed")
    )) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ 
      error: "Failed to promote member" 
    });
  }
};

export const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    // Input validation
    if (!teamId) {
      res.status(HTTP_Status.BAD_REQUEST).json({ 
        error: "Team ID is required" 
      });
      return;
    }

    const members = await memberService.getTeamMembers(Number(teamId));
    res.status(HTTP_Status.OK).json(members);
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message && error.message.includes("Invalid team ID")) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ 
      error: "Failed to retrieve team members" 
    });
  }
};
