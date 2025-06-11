import sql from "../config/db";
import { JoinRequest } from "../models/JoinRequest";
import { PendingJoinRequest } from "../models/PendingJoinRequest";
import { AllJoinRequest } from "../models/AllJoinRequest";

export class JoinRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JoinRequestError";
  }
}

export class JoinRequestService {
  async createJoinRequest(
    teamId: number,
    userId: number
  ): Promise<JoinRequest> {
    try {
      await sql`
        CALL create_join_request(${teamId}, ${userId})
      `;
      const [request] = await sql<JoinRequest[]>`
        SELECT * FROM join_requests WHERE team_id = ${teamId} AND user_id = ${userId} ORDER BY requested_at DESC LIMIT 1
      `;
      if (!request) throw new JoinRequestError("Join request creation failed");
      return request;
    } catch (error: any) {
      if (error.message.includes("pending join request already exists")) {
        throw new JoinRequestError(
          "A pending request already exists for this user and team"
        );
      }
      throw error;
    }
  }

  async updateJoinRequestStatus(
    requestId: number,
    newStatus: number
  ): Promise<void> {
    try {
      await sql`CALL update_join_request(${requestId}, ${newStatus})`;
    } catch (error: any) {
      if (error.message.includes("Join request does not exist")) {
        throw new JoinRequestError("Join request not found");
      }
      if (error.message.includes("Invalid request status")) {
        throw new JoinRequestError("Invalid status provided");
      }
      if (error.message.includes("Join request has already been processed")) {
        throw new JoinRequestError("This request has already been processed");
      }
      if (error.message.includes("User is already a member of this team")) {
        throw new JoinRequestError("User is already a member of this team");
      }
      throw error;
    }
  }

  async getJoinRequestsForTeam(teamId: number): Promise<PendingJoinRequest[]> {
    try {
      const requests = await sql<PendingJoinRequest[]>`
        SELECT * FROM get_pending_join_requests_for_team(${teamId})
      `;
      return requests;
    } catch (error) {
      throw error;
    }
  }

  async getAllJoinRequests(): Promise<AllJoinRequest[]> {
    try {
      const requests = await sql<AllJoinRequest[]>`
        SELECT * FROM all_join_requests
        ORDER BY requested_at DESC
      `;
      return requests;
    } catch (error) {
      console.error("Error getting all join requests:", error);
      throw error;
    }
  }
}
