import { Module } from '@nestjs/common';
import { SkillsController } from './controllers/skills/skills.controller';
import { SkillsService } from './services/skills/skills.service';
import { SkillsRepository } from 'src/database/repositories/skills.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule.forFeature()],
  providers: [SkillsService, SkillsRepository],
  controllers: [SkillsController],
})
export class SkillsModule {}
