import sql from "../config/db";
import { Team } from "../models/Team";

export class TeamService {
  async createTeam(teamName: string, teamDescription?: string): Promise<Team> {
    // Validate input
    if (!teamName || teamName.trim().length === 0) {
      throw new Error("Team name is required");
    }
    if (teamName.length > 32) {
      throw new Error("Team name must be less than 32 characters");
    }
    if (teamDescription && teamDescription.length > 128) {
      throw new Error("Team description must be less than 128 characters");
    }

    // Call create_team stored procedure
    await sql`
      CALL create_team(${teamName}, ${teamDescription ?? null})
    `;

    // Retrieve the newly created team
    const [team] = await sql<Team[]>`
      SELECT * FROM teams 
      WHERE team_name = ${teamName}
      ORDER BY team_id DESC 
      LIMIT 1
    `;

    if (!team) {
      throw new Error("Team creation failed");
    }

    return team;
  }

  async getAllTeams(): Promise<Team[]> {
    // Query teams table directly instead of using the view
    const teams = await sql<Team[]>`
      SELECT team_id, team_name, team_description
      FROM teams
      ORDER BY team_id
    `;
    return teams;
  }

  async getTeamById(teamId: number): Promise<Team | null> {
    // Validate input
    if (!teamId || isNaN(teamId) || teamId <= 0) {
      throw new Error("Invalid team ID");
    }

    // Query teams table with proper type casting and validation
    const [team] = await sql<Team[]>`
      SELECT * FROM teams 
      WHERE team_id = ${teamId}
    `;

    return team || null;
  }
}
