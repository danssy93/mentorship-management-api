import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification/notification.controller';
import { NotificationService } from './services/notification/notification.service';
import { NotificationRepository } from 'src/database/repositories';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule.forFeature()],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
