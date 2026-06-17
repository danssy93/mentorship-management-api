import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './datasources';
import {
  Feedback,
  MatchRequest,
  MenteeProfile,
  MentorProfile,
  Notification,
  Session,
  Skill,
  User,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const logger = new Logger('DatabaseModule');
        try {
          logger.log('initializing database connection...');
          return dataSourceOptions;
        } catch (error) {
          Logger.error('Database connection failed', error.stack);
          throw error;
        }
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  static forFeature() {
    return TypeOrmModule.forFeature([
      User,
      Skill,
      MentorProfile,
      MenteeProfile,
      MatchRequest,
      Session,
      Feedback,
      Notification,
    ]);
  }
}
