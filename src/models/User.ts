export interface User {
  userId: number;
  username: string;
  emailAddress: string;
  passwordHash: string;
  twoFactorSecret: string;
  systemRoleId: number;
  deactivatedAt: string | null; // ISO timestamp or null
} 