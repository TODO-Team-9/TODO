export interface User {
  user_id: number;
  username: string;
  email_address: string;
  password_hash: string;
  two_factor_secret: string;
  system_role_id: number;
  deactivated_at: string | null; // ISO timestamp or null
}

export interface UserRegistration {
  username: string;
  emailAddress: string;
  password: string;
}
