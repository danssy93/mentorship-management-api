import { Module } from '@nestjs/common';
import { MatchController } from './controlles/match/match.controller';
import { MatchService } from './services/match/match.service';
import { DatabaseModule } from 'src/database/database.module';
import { MatchRepository } from 'src/database/repositories';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule.forFeature(), UserModule],
  controllers: [MatchController],
  providers: [MatchService, MatchRepository],
  exports: [MatchService],
})
export class MatchModule {}
