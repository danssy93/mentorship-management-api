import { HttpStatus, Injectable } from '@nestjs/common';
import AppError from 'src/common/errors/AppError';
import {
  MenteeProfile,
  MentorProfile,
  Skill,
  User,
  UserRole,
} from 'src/database/entities';

import { MenteeRepository } from 'src/database/repositories/mentee.repository';
import { MentorRepository } from 'src/database/repositories/mentor.repository';
import { SkillsService } from 'src/modules/skills/services/skills/skills.service';
import { UpdateMentorProfileDto } from '../../dtos/mentor-profile.dto';
import { UpdateMenteeProfileDto } from '../../dtos/mentee-profile.dto';
import { ListMentorsDto } from '../../dtos/list-mentors.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly mentorRepository: MentorRepository,
    private readonly menteeRepository: MenteeRepository,
    private readonly skillsRepository: SkillsService,
  ) {}

  async createMentorProfile(
    payload: Partial<MentorProfile>,
    user: User,
    skillIds: string[],
  ): Promise<Partial<MentorProfile>> {
    if (user.role !== UserRole.MENTOR) {
      throw new AppError(
        'Only mentors can create mentor profiles',
        HttpStatus.FORBIDDEN,
      );
    }

    const existingProfile = await this.mentorRepository.findOne({
      user: { id: user.id },
    });
    if (existingProfile) {
      throw new AppError('Profile already exists', HttpStatus.BAD_REQUEST);
    }

    const skills = await this.skillsRepository.findOneBy(skillIds);

    const mentorProfile = await this.mentorRepository.create({
      ...payload,
      skills,
      user,
    });
    return mentorProfile.toPayload();
  }

  async createMenteeProfile(
    payload: Partial<MenteeProfile>,
    user: User,
    skillIds: string[],
  ): Promise<Partial<MenteeProfile>> {
    if (user.role !== UserRole.MENTEE) {
      throw new AppError(
        'Only Mentee is allow to create mentee profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingProfile = await this.menteeRepository.findOne({
      user: { id: user.id },
    });

    if (existingProfile) {
      throw new AppError('Profile already existing', HttpStatus.BAD_REQUEST);
    }

    const desired_skills = await this.skillsRepository.findOneBy(skillIds);

    const menteeProfile = await this.menteeRepository.create({
      ...payload,
      desired_skills,
      user,
    });
    return menteeProfile.toPayload();
  }

  async getMyProfile(user: User) {
    if (user.role === UserRole.MENTOR) {
      const profile = await this.mentorRepository.findOne(
        { user: { id: user.id } },
        { relations: { skills: true } },
      );

      if (!profile) {
        throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
      }

      return profile.toPayload();
    }

    if (user.role === UserRole.MENTEE) {
      const profile = await this.menteeRepository.findOne(
        { user: { id: user.id } },
        { relations: { desired_skills: true } },
      );

      if (!profile) {
        throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
      }
      return profile.toPayload();
    }

    throw new AppError('Admins do not have a profile', HttpStatus.BAD_REQUEST);
  }

  async getProfileById(
    userId: string,
  ): Promise<Partial<MentorProfile | MenteeProfile>> {
    const mentorProfile = await this.mentorRepository.findOne(
      { user: { id: userId } },
      { relations: { skills: true } },
    );

    if (mentorProfile) return mentorProfile.toPayload();

    const menteeProfile = await this.menteeRepository.findOne(
      { user: { id: userId } },
      { relations: { desired_skills: true } },
    );

    if (menteeProfile) return menteeProfile.toPayload();
    throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
  }

  async updateProfile(
    user: User,
    payload: UpdateMentorProfileDto | UpdateMenteeProfileDto,
  ): Promise<Partial<MentorProfile | MenteeProfile>> {
    if (user.role === UserRole.MENTOR) {
      const profile = await this.mentorRepository.findOne({
        user: { id: user.id },
      });

      if (!profile) {
        throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
      }

      const update = await this.mentorRepository.update(
        { user: { id: user.id } },
        payload,
      );
      return update.toPayload();
    }

    if (user.role === UserRole.MENTEE) {
      const profile = await this.menteeRepository.findOne({
        user: { id: user.id },
      });

      if (!profile) {
        throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
      }

      const update = await this.menteeRepository.update(
        { user: { id: user.id } },
        payload,
      );
      return update.toPayload();
    }

    throw new AppError('Admin do no have a profile', HttpStatus.BAD_REQUEST);
  }

  async listMentors(filters: ListMentorsDto) {
    const { skillIds, minRating, page = 1, limit = 20 } = filters;

    const qb = this.mentorRepository
      .createQueryBuilder('mp')
      .leftJoinAndSelect('mp.user', 'u')
      .leftJoinAndSelect('mp.skills', 's')
      .where('mp.is_accepting_mentees = :accepting', { accepting: true });

    if (skillIds?.length) {
      qb.andWhere('s.id In (:...skillIds)', { skillIds });
    }

    if (minRating) {
      qb.andWhere('mp.rating >= :minRating', { minRating });
    }

    const [mentors, total] = await qb
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data: mentors.map((m) => m.toPayload()),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
