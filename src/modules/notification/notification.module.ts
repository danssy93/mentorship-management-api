import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification/notification.controller';
import { NotificationService } from './services/notification/notification.service';
import { NotificationRepository } from 'src/database/repositories';
import { DatabaseModule } from 'src/database/database.module';
import { MatchModule } from '../match/match.module';
import { SessionsModule } from '../sessions/sessions.module';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [
    DatabaseModule.forFeature(),
    MatchModule,
    SessionsModule,
    FeedbackModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
