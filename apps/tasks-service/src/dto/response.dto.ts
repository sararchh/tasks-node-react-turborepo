import { TaskPriority, TaskStatus } from '../entities/task.entity';
import { CommentResponseDto } from './comment.dto';

export class TaskAssignmentResponseDto {
  id: string;
  userId: string;
  userName: string;
  assignedBy: string;
  assignedAt: Date;
}

export class TaskHistoryResponseDto {
  id: string;
  action: string;
  description: string;
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
  changedBy: string;
  changedByName: string;
  createdAt: Date;
}

export class TaskResponseDto {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  assignments: TaskAssignmentResponseDto[];
  comments?: CommentResponseDto[];
  history?: TaskHistoryResponseDto[];
}

export class PaginatedTaskResponseDto {
  data: TaskResponseDto[];
  meta: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}
