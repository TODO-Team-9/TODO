import sql from '../db';
import { SystemRole } from '../models/SystemRole';
import { TeamRole } from '../models/TeamRole';
import { Status } from '../models/Status';
import { Priority } from '../models/Priority';
import { RequestStatus } from '../models/RequestStatus';

export class LookupService {
  async getSystemRoles(): Promise<SystemRole[]> {
    const roles = await sql<SystemRole[]>`SELECT * FROM system_roles`;
    return roles;
  }

  async getTeamRoles(): Promise<TeamRole[]> {
    const roles = await sql<TeamRole[]>`SELECT * FROM team_roles`;
    return roles;
  }

  async getStatuses(): Promise<Status[]> {
    const statuses = await sql<Status[]>`SELECT * FROM statuses`;
    return statuses;
  }

  async getPriorities(): Promise<Priority[]> {
    const priorities = await sql<Priority[]>`SELECT * FROM priorities`;
    return priorities;
  }

  async getRequestStatuses(): Promise<RequestStatus[]> {
    const statuses = await sql<RequestStatus[]>`SELECT * FROM request_statuses`;
    return statuses;
  }
} 