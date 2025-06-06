import { Member } from '../models/Member';

export class MemberService {
  async addMember(/* params */): Promise<Member> {
    // TODO: Call add_member stored procedure
    throw new Error('Not implemented');
  }

  async removeMember(userId: number, teamId: number): Promise<void> {
    // TODO: Call remove_member stored procedure
    throw new Error('Not implemented');
  }

  async promoteMember(memberId: number): Promise<void> {
    // TODO: Call promote_member stored procedure
    throw new Error('Not implemented');
  }

  async getTeamMembers(teamId: number): Promise<Member[]> {
    // TODO: Query team_members_usernames view
    throw new Error('Not implemented');
  }
} 