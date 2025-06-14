import bcrypt from "bcrypt";
import sql from "../config/db";
import { User, UserRegistration } from "../models/User";
import { EncryptionService } from "./encryption.service";
import { SALT_ROUNDS } from "../constants/bcrypt.constants";
import { UserJoinRequestDetails } from "../models/UserJoinRequestDetails";
import { UserTeamDetails } from "../models/UserTeamDetails";

export class UserService {
  private validatePepper(): void {
    if (!process.env.PEPPER) {
      throw new Error("PEPPER environment variable is not set.");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    this.validatePepper();
    return await bcrypt.hash(password + process.env.PEPPER, SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    this.validatePepper();
    return await bcrypt.compare(password + process.env.PEPPER, hash);
  }

  private processUserResult(user: User): User {
    if (user.two_factor_secret) {
      user.two_factor_secret = EncryptionService.decrypt(
        user.two_factor_secret
      );
    }
    return user;
  }

  async createUser(userData: UserRegistration): Promise<User> {
    const { username, emailAddress, password } = userData;
    const passwordHash = await this.hashPassword(password);
    const twoFactorSecret = "";

    try {
      await sql`CALL add_user(${username}, ${emailAddress}, ${passwordHash}, ${twoFactorSecret})`;
      const user = await this.findByUsername(username);
      if (!user) {
        throw new Error("Failed to retrieve created user");
      }
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await sql<User[]>`
        SELECT user_id, username, email_address, password_hash, two_factor_secret, system_role_id, deactivated_at 
        FROM users 
        WHERE LOWER(username) = LOWER(${username})
      `;
      return result.length ? this.processUserResult(result[0]) : null;
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await sql<User[]>`
        SELECT user_id, username, email_address, password_hash, two_factor_secret, system_role_id, deactivated_at 
        FROM users 
        WHERE email_address = ${email}
      `;
      return result.length ? this.processUserResult(result[0]) : null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async findById(userId: number): Promise<User | null> {
    try {
      const result = await sql<User[]>`
        SELECT user_id, username, email_address, password_hash, two_factor_secret, system_role_id, deactivated_at 
        FROM users 
        WHERE user_id = ${userId}
      `;
      return result.length ? this.processUserResult(result[0]) : null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async setTwoFactorSecret(userId: number, secret: string): Promise<void> {
    const encryptedSecret = EncryptionService.encrypt(secret);
    await sql`
      UPDATE users 
      SET two_factor_secret = ${encryptedSecret} 
      WHERE user_id = ${userId}
    `;
  }
  async deactivateUser(userId: number): Promise<void> {
    try {
      await sql`CALL deactivate_user(${userId})`;
    } catch (error: any) {
      console.error("Error deactivating user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await sql<User[]>`
        SELECT user_id, username, email_address, password_hash, two_factor_secret, system_role_id, deactivated_at 
        FROM users
      `;
      return users.map((user) => this.processUserResult(user));
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  async getUserJoinRequests(userId: number): Promise<UserJoinRequestDetails[]> {
    try {
      const requests = await sql<UserJoinRequestDetails[]>`
        SELECT * FROM get_user_join_requests(${userId})
      `;
      return requests;
    } catch (error) {
      console.error("Error getting user join requests:", error);
      throw error;
    }
  }

  async getUserTeams(userId: number): Promise<UserTeamDetails[]> {
    try {
      const teams = await sql<UserTeamDetails[]>`
        SELECT * FROM get_user_teams(${userId})
      `;
      return teams;
    } catch (error) {
      console.error("Error getting user teams:", error);
      throw error;
    }
  }
}
