import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from '../entities';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class FeedbackRepository extends BaseRepository<Feedback> {
  protected readonly logger = new Logger(FeedbackRepository.name);

  constructor(
    @InjectRepository(Feedback)
    readonly feedbackRepository: Repository<Feedback>,
  ) {
    super(feedbackRepository);
  }
}
