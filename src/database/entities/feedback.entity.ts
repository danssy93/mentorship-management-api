import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';

import { User } from './users.entity';
import { Session } from './session.entity';

export enum FeedbackRole {
  MENTOR_TO_MENTEE = 'mentor_to_mentee',
  MENTEE_TO_MENTOR = 'mentee_to_mentor',
}

@Entity('feedback')
export class Feedback extends AbstractEntity {
  @OneToOne(() => Session)
  @JoinColumn()
  session: Session;

  @ManyToOne(() => User, { nullable: true })
  reviewer: User;

  @ManyToOne(() => User, { nullable: true })
  reviewee: User;

  @Column({ type: 'tinyint', unsigned: true })
  rating: number;

  @Column({ nullable: true })
  comment?: string;

  @Column({
    type: 'enum',
    enum: FeedbackRole,
  })
  role: FeedbackRole;

  toPayload(): Partial<Feedback> {
    return {
      id: this.id,
      session: this.session,
      reviewer: this.reviewer,
      reviewee: this.reviewee,
      rating: this.rating,
      comment: this.comment,
      role: this.role,
    };
  }
}
