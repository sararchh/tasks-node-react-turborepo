export interface Notification {
  id: string;
  userId: string;
  taskId: string;
  type: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_ASSIGNED' | 'COMMENT_NEW';
  title: string;
  message: string;
  status: 'UNREAD' | 'READ';
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationDto {
  userId: string;
  taskId: string;
  type: Notification['type'];
  title: string;
  message: string;
  metadata?: any;
}

export interface NotificationQueryDto {
  userId?: string;
  status?: 'UNREAD' | 'READ';
  type?: Notification['type'];
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedNotificationResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UnreadCountResponse {
  count: number;
}
