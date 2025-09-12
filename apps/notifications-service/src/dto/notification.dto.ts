import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  NotificationStatus,
  NotificationType,
} from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  taskId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  metadata?: any;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;
}

export class NotificationQueryDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class MarkAsReadDto {
  @IsUUID()
  notificationId: string;
}

export class MarkAllAsReadDto {
  @IsUUID()
  userId: string;
}
