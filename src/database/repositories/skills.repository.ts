import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from '../entities';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class SkillsRepository extends BaseRepository<Skill> {
  protected readonly logger = new Logger(SkillsRepository.name);

  constructor(
    @InjectRepository(Skill)
    readonly skillsRepository: Repository<Skill>,
  ) {
    super(skillsRepository);
  }
}
