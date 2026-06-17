import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './users.entity';

export enum NotificationType {
  MATCH_REQUEST = 'match_request',
  SESSION_SCHEDULED = 'session_scheduled',
  SESSION_CANCELLED = 'session_cancelled',
  FEEDBACK_RECEIVED = 'feedback_received',
  SESSION_COMPLETED = 'session_completed',
}

@Entity('notification')
export class Notification extends AbstractEntity {
  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true, type: 'json' })
  metadata?: Record<string, any>;

  toPayload(): Partial<Notification> {
    return {
      id: this.id,
      user: this.user,
      title: this.title,
      message: this.message,
      type: this.type,
      is_read: this.is_read,
      metadata: this.metadata,
    };
  }
}
