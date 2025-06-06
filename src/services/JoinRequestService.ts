import sql from "../db";
import { JoinRequest } from "../models/JoinRequest";
import { PendingJoinRequest } from "../models/PendingJoinRequest";

export class JoinRequestService {
  async createJoinRequest(
    teamId: number,
    userId: number
  ): Promise<JoinRequest> {
    await sql`
      CALL create_join_request(${teamId}, ${userId})
    `;
    const [request] = await sql<JoinRequest[]>`
      SELECT * FROM join_requests WHERE team_id = ${teamId} AND user_id = ${userId} ORDER BY requested_at DESC LIMIT 1
    `;
    if (!request) throw new Error("Join request creation failed");
    return request;
  }

  async updateJoinRequestStatus(
    requestId: number,
    newStatus: number
  ): Promise<void> {
    await sql`
      CALL update_join_request(${requestId}, ${newStatus})
    `;
  }

  async getJoinRequestsForTeam(teamId: number): Promise<PendingJoinRequest[]> {
    const requests = await sql<PendingJoinRequest[]>`
      SELECT * FROM get_pending_join_requests_for_team(${teamId})
    `;
    return requests;
  }
}
