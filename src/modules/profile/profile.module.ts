import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile/profile.controller';
import { ProfileService } from './services/profile/profile.service';
import { MentorRepository } from 'src/database/repositories/mentor.repository';
import { MenteeRepository } from 'src/database/repositories/mentee.repository';
import { DatabaseModule } from 'src/database/database.module';
import { SkillsModule } from '../skills/skills.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule.forFeature(), SkillsModule],
  controllers: [ProfileController],
  providers: [ProfileService, MentorRepository, MenteeRepository],
})
export class ProfileModule {}
