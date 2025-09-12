import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import { NotificationType } from '../entities/notification.entity';

export interface TaskEvent {
  eventType:
    | 'task.created'
    | 'task.updated'
    | 'task.deleted'
    | 'task.commented';
  taskId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

@Injectable()
export class EventHandlerService {
  private readonly logger = new Logger(EventHandlerService.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @EventPattern('task.created')
  async handleTaskCreated(event: TaskEvent) {
    this.logger.log(`Handling task.created event: ${JSON.stringify(event)}`);

    try {
      const { taskId, userId, data } = event;
      const assignedUserIds = data.assignedUserIds || [];

      if (assignedUserIds.length > 0) {
        const notifications =
          await this.notificationsService.createTaskNotification(
            taskId,
            assignedUserIds,
            NotificationType.TASK_ASSIGNED,
            'Nova tarefa atribuída',
            `Você foi atribuído à tarefa: ${data.title}`,
            {
              taskId,
              createdBy: userId,
              priority: data.priority,
              deadline: data.deadline,
            },
          );

        notifications.forEach((notification) => {
          this.notificationsGateway.sendNotificationToUser(
            notification.userId,
            notification,
          );
        });

        this.notificationsGateway.sendTaskCreated(assignedUserIds, {
          taskId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          deadline: data.deadline,
          createdBy: userId,
        });
      }
    } catch (error) {
      this.logger.error('Error handling task.created event:', error);
    }
  }

  @EventPattern('task.updated')
  async handleTaskUpdated(event: TaskEvent) {
    this.logger.log(`Handling task.updated event: ${JSON.stringify(event)}`);

    try {
      const { taskId, userId, data } = event;
      const affectedUserIds = [
        ...(data.assignedUserIds || []),
        ...(data.previousAssignedUserIds || []),
      ].filter(
        (id, index, array) => array.indexOf(id) === index && id !== userId,
      );

      if (affectedUserIds.length > 0) {
        const notifications =
          await this.notificationsService.createTaskNotification(
            taskId,
            affectedUserIds,
            NotificationType.TASK_UPDATED,
            'Tarefa atualizada',
            `A tarefa "${data.title}" foi atualizada`,
            {
              taskId,
              updatedBy: userId,
              changes: data.changes,
              currentStatus: data.status,
            },
          );

        notifications.forEach((notification) => {
          this.notificationsGateway.sendNotificationToUser(
            notification.userId,
            notification,
          );
        });

        this.notificationsGateway.sendTaskUpdated(affectedUserIds, {
          taskId,
          title: data.title,
          changes: data.changes,
          status: data.status,
          updatedBy: userId,
        });
      }
    } catch (error) {
      this.logger.error('Error handling task.updated event:', error);
    }
  }

  @EventPattern('task.commented')
  async handleTaskCommented(event: TaskEvent) {
    this.logger.log(`Handling task.commented event: ${JSON.stringify(event)}`);

    try {
      const { taskId, userId, data } = event;
      const participantUserIds = (data.participantUserIds || []).filter(
        (id: string) => id !== userId,
      );

      if (participantUserIds.length > 0) {
        const notifications =
          await this.notificationsService.createTaskNotification(
            taskId,
            participantUserIds,
            NotificationType.COMMENT_NEW,
            'Novo comentário',
            `Novo comentário na tarefa "${data.taskTitle}"`,
            {
              taskId,
              commentId: data.commentId,
              commentedBy: userId,
              commentText: data.comment,
            },
          );

        notifications.forEach((notification) => {
          this.notificationsGateway.sendNotificationToUser(
            notification.userId,
            notification,
          );
        });

        this.notificationsGateway.sendCommentNew(participantUserIds, {
          taskId,
          taskTitle: data.taskTitle,
          commentId: data.commentId,
          comment: data.comment,
          commentedBy: userId,
        });
      }
    } catch (error) {
      this.logger.error('Error handling task.commented event:', error);
    }
  }
}
