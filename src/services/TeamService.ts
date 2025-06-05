import { Team } from '../models/Team';

export class TeamService {
  async createTeam(/* params */): Promise<Team> {
    // TODO: Call create_team stored procedure
    throw new Error('Not implemented');
  }

  async getAllTeams(): Promise<Team[]> {
    // TODO: Query all_teams view
    throw new Error('Not implemented');
  }

  async getTeamById(teamId: number): Promise<Team | null> {
    // TODO: Query teams table
    throw new Error('Not implemented');
  }
} 