export interface JoinRequest {
  requestId: number;
  teamId: number;
  userId: number;
  requestStatus: number;
  requestedAt: string; // ISO timestamp
} 