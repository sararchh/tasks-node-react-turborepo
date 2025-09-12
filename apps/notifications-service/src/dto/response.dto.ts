import { Notification } from '../entities/notification.entity';

export class NotificationResponseDto {
  id: string;
  userId: string;
  taskId: string;
  type: string;
  title: string;
  message: string;
  status: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.userId = notification.userId;
    this.taskId = notification.taskId;
    this.type = notification.type;
    this.title = notification.title;
    this.message = notification.message;
    this.status = notification.status;
    this.metadata = notification.metadata || null;
    this.createdAt = notification.createdAt;
    this.updatedAt = notification.updatedAt;
  }
}

export class PaginatedNotificationResponseDto {
  data: NotificationResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(
    notifications: Notification[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.data = notifications.map(
      (notification) => new NotificationResponseDto(notification),
    );
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}

export class UnreadCountResponseDto {
  count: number;

  constructor(count: number) {
    this.count = count;
  }
}
