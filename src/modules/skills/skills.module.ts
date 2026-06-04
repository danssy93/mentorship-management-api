import { Module } from '@nestjs/common';
import { SkillsService } from './controllers/services/skills.service';
import { SkillsService } from './services/skills/skills.service';
import { SkillsController } from './controllers/skills/skills.controller';

@Module({
  providers: [SkillsService],
  controllers: [SkillsController],
})
export class SkillsModule {}
