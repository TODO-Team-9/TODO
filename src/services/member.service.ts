import sql from "../config/db";
import { Member } from "../models/Member";
import { Role } from "../enums/Role";

export class MemberService {
  async addMember(userId: number, teamId: number, teamRoleId: number = Role.Team.TODO_USER): Promise<Member> {
    // Input validation
    if (!userId || isNaN(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }
    if (!teamId || isNaN(teamId) || teamId <= 0) {
      throw new Error("Invalid team ID");
    }
    if (!teamRoleId || isNaN(teamRoleId) || teamRoleId <= 0) {
      throw new Error("Invalid team role ID");
    }

    // Call add_member stored procedure
    await sql`
      CALL add_member(${userId}, ${teamId}, ${teamRoleId})
    `;

    // Retrieve the newly created member
    const [member] = await sql<Member[]>`
      SELECT * FROM members 
      WHERE user_id = ${userId} AND team_id = ${teamId}
      AND removed_at IS NULL
      ORDER BY member_id DESC 
      LIMIT 1
    `;

    if (!member) {
      throw new Error("Member creation failed");
    }

    return member;
  }

  async removeMember(userId: number, teamId: number): Promise<void> {
    // Input validation
    if (!userId || isNaN(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }
    if (!teamId || isNaN(teamId) || teamId <= 0) {
      throw new Error("Invalid team ID");
    }

    // Call remove_member stored procedure
    await sql`
      CALL remove_member(${userId}, ${teamId})
    `;
  }

  async promoteMember(memberId: number, teamId: number): Promise<void> {
    // Input validation
    if (!memberId || isNaN(memberId) || memberId <= 0) {
      throw new Error("Invalid member ID");
    }
    if (!teamId || isNaN(teamId) || teamId <= 0) {
      throw new Error("Invalid team ID");
    }

    // Call promote_member stored procedure with team context
    await sql`
      CALL promote_member(${memberId}, ${teamId})
    `;
  }

  async updateMemberTeamRole(
    memberId: number,
    teamId: number,
    teamRoleId: number
  ): Promise<void> {
    // Input validation
    if (!memberId || isNaN(memberId) || memberId <= 0) {
      throw new Error("Invalid member ID");
    }
    if (!teamId || isNaN(teamId) || teamId <= 0) {
      throw new Error("Invalid team ID");
    }
    if (!teamRoleId || isNaN(teamRoleId) || teamRoleId <= 0) {
      throw new Error("Invalid team role ID");
    }

    await sql`
      CALL update_member(${memberId}, ${teamId}, ${teamRoleId})
    `;
  }

  async getTeamMembers(
    teamId: number
  ): Promise<(Member & { username: string })[]> {
    // Input validation
    if (!teamId || isNaN(teamId) || teamId <= 0) {
      throw new Error("Invalid team ID");
    }

    // Query team_members_usernames view
    const members = await sql<(Member & { username: string })[]>`
      SELECT m.*, u.username
      FROM members m
      JOIN users u ON m.user_id = u.user_id
      WHERE m.team_id = ${teamId}
      AND m.removed_at IS NULL
      ORDER BY m.member_id
    `;

    return members;
  }
}
