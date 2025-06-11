export interface TaskActivityReport {
  task_name: string;
  task_description: string | null;
  assigned_username: string | null;
  created_at: string;
  completed_at: string | null;
  task_status: string;
} 