export interface User {
  userId: number;
  username: string;
  emailAddress: string;
  passwordHash: string;
  twoFactorSecret: string;
  systemRoleId: number;
  deactivatedAt: string | null; // ISO timestamp or null
}

export interface UserRegistration {
  username: string;
  emailAddress: string;
  password: string;
} 