import { InjectRepository } from '@nestjs/typeorm';
import { MenteeProfile, User } from '../entities';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class MenteeRepository extends BaseRepository<MenteeProfile> {
  protected readonly logger = new Logger(MenteeRepository.name);

  constructor(
    @InjectRepository(MenteeProfile)
    readonly menteeRepository: Repository<MenteeProfile>,
  ) {
    super(menteeRepository);
  }
}
