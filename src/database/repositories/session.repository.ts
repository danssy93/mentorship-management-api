import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../entities';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class SessionRepository extends BaseRepository<Session> {
  protected readonly logger = new Logger(SessionRepository.name);

  constructor(
    @InjectRepository(Session)
    readonly sessionRepository: Repository<Session>,
  ) {
    super(sessionRepository);
  }
}
