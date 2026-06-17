import { Module } from '@nestjs/common';
import { SessionController } from './controllers/session/session.controller';
import { SessionService } from './services/session/session.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from '../user/user.module';
import { MatchModule } from '../match/match.module';
import { MatchRepository, SessionRepository } from 'src/database/repositories';

@Module({
  imports: [DatabaseModule.forFeature(), UserModule, MatchModule],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository, MatchRepository],
  exports: [SessionRepository],
})
export class SessionsModule {}
