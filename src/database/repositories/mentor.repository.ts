import { InjectRepository } from '@nestjs/typeorm';
import { MentorProfile } from '../entities';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class MentorRepository extends BaseRepository<MentorProfile> {
  protected readonly logger = new Logger(MentorRepository.name);

  constructor(
    @InjectRepository(MentorProfile)
    readonly mentorRepository: Repository<MentorProfile>,
  ) {
    super(mentorRepository);
  }
}
