import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import AppError from 'src/common/errors/AppError';
import { Skill, SkillCategory, User } from 'src/database/entities';
import { SkillsRepository } from 'src/database/repositories/skills.repository';
import { In } from 'typeorm';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  constructor(private readonly skillsRepository: SkillsRepository) {}

  async create(payload: Partial<Skill>, user: User): Promise<Partial<Skill>> {
    const existingSkill = await this.skillsRepository.findOne({
      name: payload.name,
    });

    if (existingSkill) {
      throw new AppError(
        'skill with this name already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const skill = await this.skillsRepository.create({
      ...payload,
      is_active: true,
    });
    return skill.toPayload();
  }

  async find(category?: SkillCategory): Promise<Skill[]> {
    const skill = await this.skillsRepository.find({
      where: { is_active: true, ...(category && { category }) },
      order: { name: 'ASC' },
    });
    return skill;
  }

  async findOneBy(id: string[]): Promise<Skill[]> {
    const skills = await this.skillsRepository.find({
      where: { id: In(id), is_active: true },
    });
    if (skills.length !== id.length) {
      throw new AppError(
        'One or more skill IDs are invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
    return skills;
  }
}
