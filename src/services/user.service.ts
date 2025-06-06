import { User } from '../models/User';

export class UserService {
  async createUser(/* params */): Promise<User> {
    // TODO: Call add_user stored procedure
    throw new Error('Not implemented');
  }

  async deactivateUser(userId: number): Promise<void> {
    // TODO: Call deactivate_user stored procedure
    throw new Error('Not implemented');
  }

  async getUserById(userId: number): Promise<User | null> {
    // TODO: Query users table
    throw new Error('Not implemented');
  }

  async getAllUsers(): Promise<User[]> {
    // TODO: Query users table
    throw new Error('Not implemented');
  }
} 