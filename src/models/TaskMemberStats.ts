// export interface TaskDailyStats {
//   activity_date: string;
//   total_tasks: number;
//   completed_tasks: number;
//   open_tasks: number;
//   assigned_tasks: number;
//   unassigned_tasks: number;
// } 

export interface TaskMemberStats {
  username: string;
  backlog: number;
  in_progress: number;
  completed: number;
  total: number;
} 