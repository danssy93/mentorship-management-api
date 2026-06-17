import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from '../../services/session/session.service';
import {
  CancelSessionDto,
  CreateSessionDto,
  UpdateSessionDto,
} from '../../dtos/createSession.dto';
import { CurrentUser } from 'src/common/guards/current-admin.guard';
import { User, UserRole } from 'src/database/entities';
import { ResponseFormat } from 'src/common/utils/ResponseFormate';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('session')
export class SessionController {
  private readonly logger = new Logger(SessionController.name);

  constructor(private readonly sessionService: SessionService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR)
  async createSession(
    @Body() payload: CreateSessionDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    const session = await this.sessionService.createSession(payload, user);
    return ResponseFormat.success(res, 'Session successfully created', session);
  }

  @Get('schedule')
  @UseGuards(JwtAuthGuard)
  async getMySession(@Res() res: Response, @CurrentUser() user: User) {
    const session = await this.sessionService.getMySession(user);
    return ResponseFormat.success(
      res,
      'Session successfully retrieve',
      session,
    );
  }

  @Get('schedule/:sessionId')
  @UseGuards(JwtAuthGuard)
  async getSessionById(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('sessionId') sessionId: string,
  ) {
    const session = await this.sessionService.getSessionById(user, sessionId);
    return ResponseFormat.success(
      res,
      `${sessionId} Session successfully retrieve`,
      session,
    );
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR)
  async updateSession(
    @Res() res: Response,
    @Body() payload: UpdateSessionDto,
    @CurrentUser() user: User,
    @Param() sessionId: string,
  ) {
    const session = await this.sessionService.updateSession(
      payload,
      user,
      sessionId,
    );
    return ResponseFormat.success(res, 'Session successfully updated', session);
  }

  @Patch('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSession(
    @Res() res: Response,
    @Body() payload: CancelSessionDto,
    @CurrentUser() user: User,
    @Param('sessionId') sessionId: string,
  ) {
    const session = await this.sessionService.cancelSession(
      payload,
      user,
      sessionId,
    );
    return ResponseFormat.success(res, 'Session successfully cancel', session);
  }

  @Patch('complete')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR)
  async completeSession(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('sessionId') sessionId: string,
  ) {
    const session = await this.sessionService.completeSession(user, sessionId);
    return ResponseFormat.success(
      res,
      'Session completed successfully',
      session,
    );
  }
}
