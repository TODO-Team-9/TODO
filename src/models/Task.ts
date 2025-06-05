export interface Task {
  taskId: number;
  taskName: string;
  taskDescription?: string;
  teamId: number;
  statusId: number;
  priorityId: number;
  createdAt: string; // ISO timestamp
  completedAt: string | null; // ISO timestamp or null
  memberId?: number | null;
} 