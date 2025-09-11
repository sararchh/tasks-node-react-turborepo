import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationsService } from '../services/notifications.service';
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

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll(
    @Query() queryDto: NotificationQueryDto,
  ): Promise<PaginatedNotificationResponseDto> {
    return this.notificationsService.findAll(queryDto);
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationsService.findByUserId(userId);
  }

  @Get('user/:userId/unread-count')
  async getUnreadCount(
    @Param('userId') userId: string,
  ): Promise<UnreadCountResponseDto> {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.update(
      id,
      updateNotificationDto,
    );
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  @Put(':id/mark-read')
  async markAsRead(@Param('id') id: string): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.markAsRead(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  @Put('user/:userId/mark-all-read')
  async markAllAsRead(@Param('userId') userId: string): Promise<void> {
    await this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const deleted = await this.notificationsService.delete(id);
    if (!deleted) {
      throw new NotFoundException('Notification not found');
    }
  }

  // Message Patterns para comunicação via microserviços
  @MessagePattern('notifications.findAll')
  async findAllPattern(data: any) {
    return this.notificationsService.findAll(data);
  }

  @MessagePattern('notifications.findByUserId')
  async findByUserIdPattern(data: { userId: string }) {
    return this.notificationsService.findByUserId(data.userId);
  }

  @MessagePattern('notifications.getUnreadCount')
  async getUnreadCountPattern(data: { userId: string }) {
    return this.notificationsService.getUnreadCount(data.userId);
  }

  @MessagePattern('notifications.findById')
  async findByIdPattern(data: { id: string }) {
    return this.notificationsService.findById(data.id);
  }

  @MessagePattern('notifications.update')
  async updatePattern(data: { id: string; [key: string]: any }) {
    const { id, ...updateData } = data;
    return this.notificationsService.update(id, updateData);
  }

  @MessagePattern('notifications.markAsRead')
  async markAsReadPattern(data: { id: string }) {
    return this.notificationsService.markAsRead(data.id);
  }

  @MessagePattern('notifications.markAllAsRead')
  async markAllAsReadPattern(data: { userId: string }) {
    await this.notificationsService.markAllAsRead(data.userId);
    return { success: true };
  }

  @MessagePattern('notifications.delete')
  async deletePattern(data: { id: string }) {
    const deleted = await this.notificationsService.delete(data.id);
    return { success: deleted };
  }

  @MessagePattern('notifications.create')
  async createPattern(data: any) {
    return this.notificationsService.create(data);
  }
}
