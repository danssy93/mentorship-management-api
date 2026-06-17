import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './users.entity';
import { Session } from './session.entity';

export enum MatchRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity()
export class MatchRequest extends AbstractEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  mentee: User;

  @ManyToOne(() => User)
  @JoinColumn()
  mentor: User;

  @OneToOne(() => Session, (session) => session.match_request)
  session: Session;

  @Column({
    type: 'enum',
    enum: MatchRequestStatus,
    default: MatchRequestStatus.PENDING,
  })
  status: MatchRequestStatus;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column({ nullable: true, type: 'text' })
  rejection_reason: string;

  toPayload(): Partial<MatchRequest> {
    return {
      id: this.id,
      status: this.status,
      message: this.message,
      rejection_reason: this.rejection_reason,
    };
  }
}
