import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets = new Map<string, Socket>();

  constructor(private readonly notificationsService: NotificationsService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove o socket do mapa de usuários
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket.id === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;
    this.userSockets.set(userId, client);
    await client.join(`user:${userId}`);
    this.logger.log(`User ${userId} joined notifications room`);

    return { event: 'joined', data: { userId } };
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;
    this.userSockets.delete(userId);
    await client.leave(`user:${userId}`);
    this.logger.log(`User ${userId} left notifications room`);

    return { event: 'left', data: { userId } };
  }

  @SubscribeMessage('mark_read')
  async handleMarkAsRead(@MessageBody() data: { notificationId: string }) {
    const { notificationId } = data;

    try {
      const updatedNotification =
        await this.notificationsService.markAsRead(notificationId);

      if (updatedNotification) {
        return {
          event: 'notification_read',
          data: updatedNotification,
        };
      }

      return {
        event: 'error',
        data: { message: 'Notification not found' },
      };
    } catch (error) {
      this.logger.error('Error marking notification as read:', error);
      return {
        event: 'error',
        data: { message: 'Failed to mark notification as read' },
      };
    }
  }

  @SubscribeMessage('get_unread_count')
  async handleGetUnreadCount(@MessageBody() data: { userId: string }) {
    const { userId } = data;

    try {
      const unreadCount =
        await this.notificationsService.getUnreadCount(userId);
      return {
        event: 'unread_count',
        data: unreadCount,
      };
    } catch (error) {
      this.logger.error('Error getting unread count:', error);
      return {
        event: 'error',
        data: { message: 'Failed to get unread count' },
      };
    }
  }

  // Métodos para enviar notificações aos usuários
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('task:notification', notification);
  }

  sendTaskCreated(userIds: string[], data: any) {
    userIds.forEach((userId) => {
      this.server.to(`user:${userId}`).emit('task:created', data);
    });
  }

  sendTaskUpdated(userIds: string[], data: any) {
    userIds.forEach((userId) => {
      this.server.to(`user:${userId}`).emit('task:updated', data);
    });
  }

  sendCommentNew(userIds: string[], data: any) {
    userIds.forEach((userId) => {
      this.server.to(`user:${userId}`).emit('comment:new', data);
    });
  }

  broadcastToUsers(userIds: string[], event: string, data: any) {
    userIds.forEach((userId) => {
      this.server.to(`user:${userId}`).emit(event, data);
    });
  }
}
