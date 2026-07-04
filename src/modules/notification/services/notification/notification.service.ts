import { HttpStatus, Injectable } from '@nestjs/common';
import AppError from 'src/common/errors/AppError';
import { Notification, NotificationType, User } from 'src/database/entities';
import { NotificationRepository } from 'src/database/repositories';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(
    user: User,
    title: string,
    message: string,
    type: NotificationType,
    metadata?: Record<string, any>,
  ): Promise<Partial<Notification>> {
    const notification = await this.notificationRepository.create({
      user,
      title,
      message,
      type,
      metadata,
      is_read: false,
    });
    return notification.toPayload();
  }

  async getMyNotifications(user: User) {
    const notification = await this.notificationRepository.find({
      where: { user: { id: user.id } },
      order: { created_at: 'DESC' },
    });

    if (!notification.length) {
      throw new AppError('No notification found', HttpStatus.NOT_FOUND);
    }

    return notification.map((n) => n.toPayload());
  }

  async markAsRead(user: User, notificationIds: string[]) {
    for (const id of notificationIds) {
      await this.notificationRepository.update(
        { id, user: { id: user.id } },
        { is_read: true },
      );
    }
    return { message: 'Notifications marked as read' };
  }

  async getUnreadCount(user: User) {
    const count = await this.notificationRepository.count({
      user: { id: user.id },
      is_read: false,
    });
    return { unread: count };
  }
}
