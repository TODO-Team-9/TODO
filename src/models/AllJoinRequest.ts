export interface AllJoinRequest {
    requestId: number;
    teamId: number;
    teamName: string;
    userId: number;
    username: string;
    status: string;
    requestedAt: string; // ISO timestamp
} 