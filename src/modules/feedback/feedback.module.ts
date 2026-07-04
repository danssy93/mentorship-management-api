import { Module } from '@nestjs/common';
import { FeedbackController } from './controllers/feedback/feedback.controller';
import { FeedbackService } from './services/feedback/feedback.service';
import { DatabaseModule } from 'src/database/database.module';
import { SessionsModule } from '../sessions/sessions.module';
import { FeedbackRepository } from 'src/database/repositories';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [DatabaseModule.forFeature(), SessionsModule, NotificationModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository],
})
export class FeedbackModule {}
