import { Module } from '@nestjs/common';
import { ProgressController } from './controllers/progress/progress.controller';
import { ProgressService } from './services/progress/progress.service';
import { MatchRepository, ProgressRepository } from 'src/database/repositories';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [DatabaseModule.forFeature(), NotificationModule],
  controllers: [ProgressController],
  providers: [ProgressService, ProgressRepository, MatchRepository],
})
export class ProgressModule {}
