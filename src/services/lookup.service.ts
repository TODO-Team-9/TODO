import sql from "../config/db";
import { SystemRole } from "../models/SystemRole";
import { TeamRole } from "../models/TeamRole";
import { Status } from "../models/Status";
import { Priority } from "../models/Priority";
import { RequestStatus } from "../models/RequestStatus";

export class LookupService {
  async getSystemRoles(): Promise<SystemRole[]> {
    const roles = await sql<
      SystemRole[]
    >`SELECT system_role_id, system_role_name FROM system_roles`;
    return roles;
  }

  async getTeamRoles(): Promise<TeamRole[]> {
    const roles = await sql<
      TeamRole[]
    >`SELECT team_role_id, team_role_name FROM team_roles`;
    return roles;
  }

  async getStatuses(): Promise<Status[]> {
    const statuses = await sql<
      Status[]
    >`SELECT status_id, status_name FROM statuses`;
    return statuses;
  }

  async getPriorities(): Promise<Priority[]> {
    const priorities = await sql<
      Priority[]
    >`SELECT priority_id, priority_name FROM priorities`;
    return priorities;
  }

  async getRequestStatuses(): Promise<RequestStatus[]> {
    const statuses = await sql<
      RequestStatus[]
    >`SELECT request_status_id, request_status_name FROM request_statuses`;
    return statuses;
  }
}
