import { HttpStatus, Injectable } from '@nestjs/common';
import AppError from 'src/common/errors/AppError';
import { Notification } from 'src/database/entities';
import { NotificationRepository } from 'src/database/repositories';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(
    payload: Partial<Notification>,
  ): Promise<Partial<Notification>> {
    const notification = await this.notificationRepository.create(payload)
    return notification.toPayload(())
  }

  async getMyNotifications(user: User) {
    const notification = await this.notificationRepository.find({
        where: {user: {id: user.id}},
        order: {created_at: 'DESC'}
    })

    if(!notification.length) {
        throw new AppError("No notification found", HttpStatus.NOT_FOUND)
    }

    return notification.map((n) => n.toPayload())
  }
}
