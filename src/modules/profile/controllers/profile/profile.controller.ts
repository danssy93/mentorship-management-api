import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service';
import {
  CreateMentorProfileDto,
  UpdateMentorProfileDto,
} from '../../dtos/mentor-profile.dto';
import { CurrentUser } from 'src/common/guards/current-user.guard';
import { User, UserRole } from 'src/database/entities';
import type { Response } from 'express';
import { ResponseFormat } from 'src/common/utils/ResponseFormate';
import {
  CreateMenteeProfileDto,
  UpdateMenteeProfileDto,
} from '../../dtos/mentee-profile.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UUID } from 'crypto';
import { ListMentorsDto } from '../../dtos/list-mentors.dto';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  @Post('mentor')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR)
  async createMentorProfile(
    @Body() payload: CreateMentorProfileDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    const { skillIds, ...rest } = payload;
    const profile = await this.profileService.createMentorProfile(
      rest,
      user,
      skillIds,
    );
    return ResponseFormat.success(
      res,
      'Mentor profile successfully created',
      profile,
    );
  }

  @Post('mentee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTEE)
  async createMenteeProfile(
    @Body() payload: CreateMenteeProfileDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    const { skillIds, ...rest } = payload;
    const profile = await this.profileService.createMenteeProfile(
      rest,
      user,
      skillIds,
    );
    return ResponseFormat.success(
      res,
      'Mentee profile successfully created',
      profile,
    );
  }

  @Get('mentors')
  async listMentors(@Query() filters: ListMentorsDto, @Res() res: Response) {
    const profile = await this.profileService.listMentors(filters);
    return ResponseFormat.success(res, 'Mentors fetched successfully', profile);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Res() res: Response, @CurrentUser() user: User) {
    const profile = await this.profileService.getMyProfile(user);
    return ResponseFormat.success(
      res,
      'Profile retrieved successfully',
      profile,
    );
  }

  @Get(':id')
  async getProfileById(@Res() res: Response, @Param('id') id: string) {
    const profile = await this.profileService.getProfileById(id);
    return ResponseFormat.success(
      res,
      'Profile retrieved successfully',
      profile,
    );
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() payload: UpdateMentorProfileDto | UpdateMenteeProfileDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    const profile = await this.profileService.updateProfile(user, payload);
    return ResponseFormat.success(res, 'Profile updated successfully', profile);
  }
}
