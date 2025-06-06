import { Request, Response } from "express";
import { JoinRequestService } from "../services/JoinRequestService";
import { HTTP_Status } from "../enums/HTTP_Status";

const joinRequestService = new JoinRequestService();

export const createJoinRequest = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { teamId, userId } = request.body;
    if (!teamId || !userId) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "teamId and userId are required" });
      return;
    }
    const joinRequest = await joinRequestService.createJoinRequest(
      Number(teamId),
      Number(userId)
    );
    response.status(HTTP_Status.CREATED).json(joinRequest);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateJoinRequestStatus = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { requestId } = request.params;
    const { newStatus } = request.body;
    if (!newStatus) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "newStatus is required" });
      return;
    }
    await joinRequestService.updateJoinRequestStatus(
      Number(requestId),
      Number(newStatus)
    );
    response
      .status(HTTP_Status.OK)
      .json({ message: "Join request status updated successfully" });
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getJoinRequestsForTeam = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { teamId } = request.params;
    const requests = await joinRequestService.getJoinRequestsForTeam(
      Number(teamId)
    );
    response.status(HTTP_Status.OK).json(requests);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
