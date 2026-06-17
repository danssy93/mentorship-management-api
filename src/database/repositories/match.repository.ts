import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { MatchRequest } from '../entities';

export class MatchRepository extends BaseRepository<MatchRequest> {
  protected readonly logger = new Logger(MatchRepository.name);

  constructor(
    @InjectRepository(MatchRequest)
    readonly matchRepository: Repository<MatchRequest>,
  ) {
    super(matchRepository);
  }
}
