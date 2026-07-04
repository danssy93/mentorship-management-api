import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProgressService } from '../../services/progress/progress.service';
import { CurrentUser } from 'src/common/guards/current-admin.guard';
import { User, UserRole } from 'src/database/entities';
import { CreateGoalDto, UpdateGoalDto } from '../../dtos/createGoal.dto';
import { ResponseFormat } from 'src/common/utils/ResponseFormate';
import { RoleGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import type { Response } from 'express';

@Controller('progress')
export class ProgressController {
  private readonly logger = new Logger(ProgressController.name);

  constructor(private readonly progressService: ProgressService) {}

  @Post('create-goal')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTEE)
  async createGoal(
    @Body() payload: CreateGoalDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    const goal = await this.progressService.createGoal(payload, user);
    return ResponseFormat.success(res, 'Goal successfully created', goal);
  }

  @Get('my-goals')
  @UseGuards(JwtAuthGuard)
  async getMyGoals(@Res() res: Response, @CurrentUser() user: User) {
    const goals = await this.progressService.getMyGoals(user);
    return ResponseFormat.success(res, 'Goals successfully retrieved', goals);
  }

  @Get('my-goals/:goalId')
  @UseGuards(JwtAuthGuard)
  async getGoalByid(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('goalId') goalId: string,
  ) {
    const goal = await this.progressService.getGoalById(user, goalId);
    return ResponseFormat.success(res, 'Goal successfully retrieved', goal);
  }

  @Patch('update-goal/:goalId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTEE)
  async updateGoalStatus(
    @Res() res: Response,
    @Body() payload: UpdateGoalDto,
    @Param('goalId') goalId: string,
    @CurrentUser() user: User,
  ) {
    const goal = await this.progressService.updateGoalStatus(
      payload,
      user,
      goalId,
    );
    return ResponseFormat.success(res, 'Goal successfully updated', goal);
  }

  @Delete('delete-goal/:goalId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTEE)
  async deleteGoal(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('goalId') goalId: string,
  ) {
    const goal = await this.progressService.deleteGoal(user, goalId);
    return ResponseFormat.success(res, 'Goal successfully deleted', goal);
  }
}
