export interface PendingJoinRequest {
  requestId: number;
  teamId: number;
  userId: number;
  username: string;
  requestStatus: number;
  requestedAt: string; // ISO timestamp
} 