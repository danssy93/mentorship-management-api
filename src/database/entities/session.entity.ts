import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './users.entity';
import { MatchRequest } from './match-request.entity';

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('session')
export class Session extends AbstractEntity {
  @ManyToOne(() => User)
  mentor: User;

  @ManyToOne(() => User)
  mentee: User;

  @OneToOne(() => MatchRequest, (match_request) => match_request.session)
  @JoinColumn()
  match_request: MatchRequest;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  scheduled_at: Date;

  @Column()
  duration: number;

  @Column({ nullable: true, type: 'varchar' })
  meeting_link?: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.SCHEDULED,
  })
  status: SessionStatus;

  @ManyToOne(() => User, { nullable: true })
  cancelled_by: User;

  @Column({ nullable: true, type: 'text' })
  cancellation_reason?: string;

  toPayload(): Partial<Session> {
    return {
      mentor: this.mentor,
      mentee: this.mentee,
      match_request: this.match_request,
      title: this.title,
      scheduled_at: this.scheduled_at,
      duration: this.duration,
      meeting_link: this.meeting_link,
      status: this.status,
    };
  }
}
