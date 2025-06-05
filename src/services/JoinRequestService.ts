import { JoinRequest } from '../models/JoinRequest';

export class JoinRequestService {
  async createJoinRequest(/* params */): Promise<JoinRequest> {
    // TODO: Insert into join_requests table
    throw new Error('Not implemented');
  }

  async updateJoinRequestStatus(requestId: number, newStatus: number): Promise<void> {
    // TODO: Call update_join_request stored procedure
    throw new Error('Not implemented');
  }

  async getJoinRequestsForTeam(teamId: number): Promise<JoinRequest[]> {
    // TODO: Query join_requests table
    throw new Error('Not implemented');
  }
} 