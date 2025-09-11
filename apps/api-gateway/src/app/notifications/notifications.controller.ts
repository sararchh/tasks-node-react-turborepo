import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE')
    private notificationsService: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications with filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated notifications' })
  getNotifications(@Query() queryDto: any) {
    return this.notificationsService.send('notifications.findAll', queryDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications for a specific user' })
  @ApiResponse({ status: 200, description: 'Returns user notifications' })
  getUserNotifications(@Param('userId') userId: string) {
    return this.notificationsService.send('notifications.findByUserId', {
      userId,
    });
  }

  @Get('user/:userId/unread-count')
  @ApiOperation({ summary: 'Get unread notifications count for user' })
  @ApiResponse({ status: 200, description: 'Returns unread count' })
  getUnreadCount(@Param('userId') userId: string) {
    return this.notificationsService.send('notifications.getUnreadCount', {
      userId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, description: 'Returns notification details' })
  getNotificationById(@Param('id') id: string) {
    return this.notificationsService.send('notifications.findById', { id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiResponse({ status: 200, description: 'Returns updated notification' })
  updateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: any,
  ) {
    return this.notificationsService.send('notifications.update', {
      id,
      ...updateNotificationDto,
    });
  }

  @Put(':id/mark-read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Returns updated notification' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.send('notifications.markAsRead', { id });
  }

  @Put('user/:userId/mark-all-read')
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.send('notifications.markAllAsRead', {
      userId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  deleteNotification(@Param('id') id: string) {
    return this.notificationsService.send('notifications.delete', { id });
  }

  @Post()
  @ApiOperation({ summary: 'Create new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
  })
  createNotification(@Body() createNotificationDto: any) {
    return this.notificationsService.send(
      'notifications.create',
      createNotificationDto,
    );
  }
}
