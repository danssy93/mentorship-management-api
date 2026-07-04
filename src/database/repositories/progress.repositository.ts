import { InjectRepository } from '@nestjs/typeorm';
import { Progress } from '../entities';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class ProgressRepository extends BaseRepository<Progress> {
  protected readonly logger = new Logger(ProgressRepository.name);

  constructor(
    @InjectRepository(Progress)
    readonly progressRepository: Repository<Progress>,
  ) {
    super(progressRepository);
  }
}
