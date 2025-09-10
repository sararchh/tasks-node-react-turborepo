export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export interface TaskAssignment {
  id: string;
  userId: string;
  userName: string;
  assignedBy: string;
  assignedAt: string;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  taskId: string;
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  action: string;
  description: string;
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
  changedBy: string;
  changedByName: string;
  changedAt: string;
  taskId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignments: TaskAssignment[];
  comments: TaskComment[];
  history: TaskHistory[];
}

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  deadline?: string;
  priority?: TaskPriority;
  assignedUserIds?: string[];
  assignedUsers?: Array<{ id: string; username: string }>;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedUserIds?: string[];
  assignedUsers?: Array<{ id: string; username: string }>;
}

export interface TaskQueryDto {
  page?: number;
  size?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToMe?: boolean;
  createdByMe?: boolean;
}

export interface CreateCommentDto {
  content: string;
}

export interface PaginatedComments {
  comments: TaskComment[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
}
