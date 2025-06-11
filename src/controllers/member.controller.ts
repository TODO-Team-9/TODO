import { Request, Response } from "express";
import { MemberService } from "../services/member.service";
import { HTTP_Status } from "../enums/HTTP_Status";

const memberService = new MemberService();

export const addMember = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { userId } = request.body;
    const { teamId } = request.params;

    // Input validation
    if (!userId || !teamId) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "User ID and team ID are required",
      });
      return;
    }

    const member = await memberService.addMember(
      Number(userId),
      Number(teamId)
    );
    response.status(HTTP_Status.CREATED).json(member);
  } catch (error: any) {
    // Handle specific validation errors
    if (
      error.message &&
      (error.message.includes("Invalid user ID") ||
        error.message.includes("Invalid team ID") ||
        error.message.includes("User does not exist") ||
        error.message.includes("Team does not exist") ||
        error.message.includes("User is already a member"))
    ) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to add member to team",
    });
  }
};

export const removeMember = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { userId, teamId } = request.params;

    // Input validation
    if (!userId || !teamId) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "User ID and team ID are required",
      });
      return;
    }

    await memberService.removeMember(Number(userId), Number(teamId));
    response.status(HTTP_Status.OK).json({
      message: "Member removed successfully",
    });
  } catch (error: any) {
    // Handle specific validation errors
    if (
      error.message &&
      (error.message.includes("Invalid user ID") ||
        error.message.includes("Invalid team ID") ||
        error.message.includes("User does not exist") ||
        error.message.includes("Team does not exist") ||
        error.message.includes("User does not exist in that team") ||
        error.message.includes("already been removed"))
    ) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to remove member from team",
    });
  }
};

export const promoteMember = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { memberId, teamId } = request.params;

    // Input validation
    if (!memberId || !teamId) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Member ID and team ID are required",
      });
      return;
    }

    await memberService.promoteMember(Number(memberId), Number(teamId));
    response.status(HTTP_Status.OK).json({
      message: "Member promoted successfully",
    });
  } catch (error: any) {
    // Handle specific validation errors
    if (
      error.message &&
      (error.message.includes("Invalid member ID") ||
        error.message.includes("Invalid team ID") ||
        error.message.includes("Member does not exist in the specified team") ||
        error.message.includes("already been promoted") ||
        error.message.includes("has been removed"))
    ) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to promote member",
    });
  }
};

export const updateMember = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { memberId } = request.params;
    const { teamId, teamRoleId } = request.body;

    if (!memberId || !teamId || !teamRoleId) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "memberId, teamId, and teamRoleId are required",
      });
      return;
    }

    await memberService.updateMemberTeamRole(
      Number(memberId),
      Number(teamId),
      Number(teamRoleId)
    );
    response.status(HTTP_Status.OK).json({
      message: "Member updated successfully",
    });
  } catch (error: any) {
    if (
      error.message &&
      (error.message.includes("Invalid member ID") ||
        error.message.includes("Invalid team ID") ||
        error.message.includes("Invalid team role ID") ||
        error.message.includes("Member does not exist in the specified team") ||
        error.message.includes("has been removed"))
    ) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to update member",
    });
  }
};

export const getTeamMembers = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { teamId } = request.params;

    // Input validation
    if (!teamId) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Team ID is required",
      });
      return;
    }

    const members = await memberService.getTeamMembers(Number(teamId));
    response.status(HTTP_Status.OK).json(members);
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message && error.message.includes("Invalid team ID")) {
      response.status(HTTP_Status.BAD_REQUEST).json({ error: error.message });
      return;
    }

    // Handle other errors
    response.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve team members",
    });
  }
};
