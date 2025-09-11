import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from '../entities/notification.entity';
import {
  CreateNotificationDto,
  NotificationQueryDto,
  UpdateNotificationDto,
} from '../dto/notification.dto';
import {
  NotificationResponseDto,
  PaginatedNotificationResponseDto,
  UnreadCountResponseDto,
} from '../dto/response.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    const savedNotification =
      await this.notificationRepository.save(notification);
    return new NotificationResponseDto(savedNotification);
  }

  async findAll(
    queryDto: NotificationQueryDto,
  ): Promise<PaginatedNotificationResponseDto> {
    const {
      page = 1,
      limit = 10,
      userId,
      status,
      type,
      startDate,
      endDate,
    } = queryDto;

    const queryBuilder =
      this.notificationRepository.createQueryBuilder('notification');

    if (userId) {
      queryBuilder.andWhere('notification.userId = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('notification.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'notification.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      );
    }

    queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [notifications, total] = await queryBuilder.getManyAndCount();

    return new PaginatedNotificationResponseDto(
      notifications,
      total,
      page,
      limit,
    );
  }

  async findByUserId(userId: string): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return notifications.map(
      (notification) => new NotificationResponseDto(notification),
    );
  }

  async findById(id: string): Promise<NotificationResponseDto | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    return new NotificationResponseDto(notification);
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationResponseDto | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    Object.assign(notification, updateNotificationDto);
    const updatedNotification =
      await this.notificationRepository.save(notification);

    return new NotificationResponseDto(updatedNotification);
  }

  async markAsRead(id: string): Promise<NotificationResponseDto | null> {
    return this.update(id, { status: NotificationStatus.READ });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ },
    );
  }

  async getUnreadCount(userId: string): Promise<UnreadCountResponseDto> {
    const count = await this.notificationRepository.count({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
    });

    return new UnreadCountResponseDto(count);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.notificationRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async createTaskNotification(
    taskId: string,
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    metadata?: any,
  ): Promise<NotificationResponseDto[]> {
    console.log(
      `[NotificationsService] Creating notifications for task ${taskId}`,
    );
    console.log(`[NotificationsService] User IDs: ${JSON.stringify(userIds)}`);
    console.log(
      `[NotificationsService] Type: ${type}, Title: ${title}, Message: ${message}`,
    );

    const notifications = userIds.map((userId) =>
      this.notificationRepository.create({
        userId,
        taskId,
        type,
        title,
        message,
        metadata,
      }),
    );

    console.log(
      `[NotificationsService] Created ${notifications.length} notification entities`,
    );

    try {
      const savedNotifications =
        await this.notificationRepository.save(notifications);

      console.log(
        `[NotificationsService] Saved ${savedNotifications.length} notifications to database`,
      );
      console.log(
        `[NotificationsService] Saved notifications IDs: ${savedNotifications.map((n) => n.id).join(', ')}`,
      );

      return savedNotifications.map(
        (notification) => new NotificationResponseDto(notification),
      );
    } catch (error) {
      console.error(
        `[NotificationsService] Error saving notifications:`,
        error,
      );
      throw error;
    }
  }
}
