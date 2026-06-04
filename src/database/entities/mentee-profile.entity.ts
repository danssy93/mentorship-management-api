import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './users.entity';
import { Skill } from './skill.entity';

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCE = 'advance',
}

@Entity('mentee_profiles')
export class MenteeProfile extends AbstractEntity {
  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, type: 'text' })
  learning_goals: string;

  @Column({ type: 'enum', enum: ExperienceLevel, nullable: true })
  current_level: ExperienceLevel;

  @Column({ nullable: true })
  occupation: string;

  @Column({ type: 'boolean', default: true })
  isLookingForMentor: boolean;

  // @Column({ type: 'jsonb' })
  // preferred_schedule: { days: string[]; times: string[] };

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Skill, (skill) => skill.mentees, { eager: true })
  desiredSkills: Skill[];
}
