import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './users.entity';
import { Skill } from './skill.entity';

@Entity('mentor_profiles')
export class MentorProfile extends AbstractEntity {
  @Column({ nullable: true })
  bio: string;

  @Column({ default: 0 })
  years_of_experience: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  session_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourly_rate: number;

  @Column({ type: 'boolean', default: true })
  is_accepting_mentees: boolean;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Skill, (skill) => skill.mentors, { eager: true })
  @JoinTable({ name: 'mentor_profile_skills' })
  skills: Skill[];

  toPayload(): Partial<MentorProfile> {
    return {
      id: this.id,
      bio: this.bio,
      years_of_experience: this.years_of_experience,
      session_rate: this.session_rate,
      hourly_rate: this.hourly_rate,
      is_accepting_mentees: this.is_accepting_mentees,
    };
  }
}
