import { Column, Entity, ManyToMany } from 'typeorm';
import { MentorProfile } from './mentor-profile.entity';
import { MenteeProfile } from './mentee-profile.entity';
import { AbstractEntity } from './base.entity';

export enum SkillCategory {
  ENGINEERING = 'engineering',
  DESIGN = 'design',
  PRODUCT = 'product',
  DATA = 'data',
  MARKETING = 'marketing',
  LEADERSHIP = 'leadership',
  FINANCE = 'finance',
  OTHER = 'other',
}

@Entity('skills')
export class Skill extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: SkillCategory, default: SkillCategory.OTHER })
  category: SkillCategory;

  @Column({ nullable: true, default: null })
  description?: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => MentorProfile, (mentor) => mentor.skills)
  mentors: MentorProfile[];

  @ManyToMany(() => MenteeProfile, (mentee) => mentee.desired_skills)
  mentees: MenteeProfile[];

  toPayload(): Partial<Skill> {
    return {
      id: this.id,
      category: this.category,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
