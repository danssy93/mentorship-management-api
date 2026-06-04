import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './users.entity';
import { Skill } from './skill.entity';

@Entity('mentor_profiles')
export class MentorProfile extends AbstractEntity {
  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  expertise: string;

  @Column({ default: 0 })
  yearsOfExperience: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate: number;

  @Column({ type: 'boolean', default: true })
  IsAcceptingMentees: boolean;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Skill, (skill) => skill.mentees, { eager: true })
  @JoinColumn({
    // name: 'mentee_profile_skills',
    // joinColumn: { name: 'mentee_profile_id', ref },
  })
  skills: Skill[];
}
