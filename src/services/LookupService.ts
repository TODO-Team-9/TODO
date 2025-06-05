import { SystemRole } from '../models/SystemRole';
import { TeamRole } from '../models/TeamRole';
import { Status } from '../models/Status';
import { Priority } from '../models/Priority';
import { RequestStatus } from '../models/RequestStatus';

export class LookupService {
  async getSystemRoles(): Promise<SystemRole[]> {
    // TODO: Query system_roles table
    throw new Error('Not implemented');
  }

  async getTeamRoles(): Promise<TeamRole[]> {
    // TODO: Query team_roles table
    throw new Error('Not implemented');
  }

  async getStatuses(): Promise<Status[]> {
    // TODO: Query statuses table
    throw new Error('Not implemented');
  }

  async getPriorities(): Promise<Priority[]> {
    // TODO: Query priorities table
    throw new Error('Not implemented');
  }

  async getRequestStatuses(): Promise<RequestStatus[]> {
    // TODO: Query request_statuses table
    throw new Error('Not implemented');
  }
} 