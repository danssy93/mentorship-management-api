import { Module } from '@nestjs/common';
import { CronJobService } from './services/cron-job.service';
import { DatabaseModule } from 'src/database/database.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [DatabaseModule.forFeature(), SessionsModule],
  providers: [CronJobService],
})
export class CronJobModule {}
