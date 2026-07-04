import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './users.entity';
import { MatchRequest } from './match-request.entity';

export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

@Entity('progress')
export class Progress extends AbstractEntity {
  @ManyToOne(() => User, { nullable: false })
  mentee: User;

  @ManyToOne(() => User, { nullable: true })
  mentor: User;

  @ManyToOne(() => MatchRequest, { nullable: true })
  match_request: MatchRequest;

  @Column()
  title: string;

  @Column({ nullable: true, default: null })
  description?: string;

  @Column({ nullable: true })
  target_date?: Date;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.NOT_STARTED,
  })
  status: ProgressStatus;

  @Column({ default: 0, type: 'tinyint', unsigned: true })
  progress_percentage: number;

  toPayload(): Partial<Progress> {
    return {
      id: this.id,
      mentee: this.mentee,
      mentor: this.mentor,
      match_request: this.match_request,
      title: this.title,
      description: this.description,
      target_date: this.target_date,
      status: this.status,
      progress_percentage: this.progress_percentage,
    };
  }
}
