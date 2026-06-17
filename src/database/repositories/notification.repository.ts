import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../entities';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class NotificationRepository extends BaseRepository<Notification> {
  protected readonly logger = new Logger(NotificationRepository.name);

  constructor(
    @InjectRepository(Notification)
    readonly notificationRepository: Repository<Notification>,
  ) {
    super(notificationRepository);
  }
}
