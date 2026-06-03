import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import * as bcrypt from 'bcrypt';
import { MenteeProfile } from './mentee-profile.entity';

export enum UserRole {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  MENTEE = 'mentee',
}

export interface ICurrentUserDetails {
  id: string;
  phone: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}

@Entity('users')
export class User extends AbstractEntity {
  @Column({ length: 100, type: 'varchar' })
  first_name: string;

  @Column({ length: 100, type: 'varchar' })
  last_name: string;

  @Column({ length: 20, type: 'varchar' })
  phone: string;

  @Column({ unique: true, length: 255, type: 'varchar' })
  email: string;

  @Column({ length: 225, type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  refresh_token?: string | null;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;

  @OneToOne(() => MenteeProfile, (menteeProfile) => menteeProfile.user)
  menteeProfile: MenteeProfile;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.phone) {
      this.phone = this.phone.replace('+', '');
    }
  }

  toPayload(): Partial<User> {
    return {
      id: this.id,
      phone: this.phone,
      email: this.email,
      role: this.role,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
