export interface UserJoinRequestDetails {
  request_id: number;
  team_id: number;
  team_name: string;
  team_description: string | null;
  requested_at: string;
  request_status_id: number;
  request_status_name: string;
} 