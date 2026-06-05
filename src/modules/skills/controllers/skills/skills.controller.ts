import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SkillsDto } from '../../dtos/skillsDto';
import { CurrentUser } from 'src/common/guards/current-admin.guard';
import { User, SkillCategory, UserRole } from 'src/database/entities';
import { SkillsService } from '../../services/skills/skills.service';
import { ResponseFormat } from 'src/common/utils/ResponseFormate';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@ApiTags('Skill Controller')
@Controller('skills')
export class SkillsController {
  private readonly logger = new Logger(SkillsController.name);
  constructor(private readonly skillsService: SkillsService) {}

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Post('create')
  async createSkills(
    @Body() payload: SkillsDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    const skill = await this.skillsService.create(payload, user);
    return ResponseFormat.success(res, 'skills created successful', skill);
  }

  @Get()
  async getSkills(
    @Query('category') category: SkillCategory,
    @Res() res: Response,
  ) {
    const skills = await this.skillsService.find(category);
    return ResponseFormat.success(res, 'skills retrieved successfully', skills);
  }

  @Post('by-ids')
  async getSkillsByIds(@Body('ids') ids: string[], @Res() res: Response) {
    const skills = await this.skillsService.findOneBy(ids);
    return ResponseFormat.success(res, 'skills retrieved successfully', skills);
  }
}
