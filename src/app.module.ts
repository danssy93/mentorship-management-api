import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MatchModule } from './modules/match/match.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { CronJobModule } from './modules/cron-job/cron-job.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    UserModule,
    AuthModule,
    SkillsModule,
    ProfileModule,
    MatchModule,
    SessionsModule,
    CronJobModule,
    FeedbackModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
