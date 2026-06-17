import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from 'src/database/entities';

export class CreateNotificationDto {
  @IsString({ message: 'UserID must be a string' })
  @IsNotEmpty({ message: 'UserID must not be empty' })
  userId: string;

  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message must not be empty' })
  message: string;

  @IsNotEmpty({ message: 'Type must not be empty' })
  @IsEnum(NotificationType, { message: 'Type must be a enum' })
  type: NotificationType;

  @IsOptional({ message: 'Metadata is optional' })
  @IsString({ message: 'Metadata must be a string' })
  metadata?: Record<string, any>;
}

export class MarkReadDto {
  @IsString({ message: 'NotificationID must be a string' })
  @IsNotEmpty({ message: 'NotificationID must not be empty' })
  notificationIds: string[];
}
