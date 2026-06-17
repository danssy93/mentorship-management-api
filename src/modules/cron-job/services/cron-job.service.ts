import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionStatus } from 'src/database/entities';
import { SessionRepository } from 'src/database/repositories';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  constructor(private readonly sessionRepository: SessionRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async markSessionsAsOngoing() {
    const now = new Date();

    const sessions = await this.sessionRepository.find({
      where: {
        status: SessionStatus.SCHEDULED,
        scheduled_at: LessThanOrEqual(now),
      },
    });

    for (const session of sessions) {
      await this.sessionRepository.update(
        { id: session.id },
        { status: SessionStatus.ONGOING },
      );
      this.logger.log(`Session ${session.id} marked as ongoing`);
    }
  }
}
