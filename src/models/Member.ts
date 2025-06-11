export interface Member {
  memberId: number;
  userId: number;
  teamId: number;
  teamRoleId: number;
  removedAt: string | null; // ISO timestamp or null
} 