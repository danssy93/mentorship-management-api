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
import {
  RejectMatchRequestDto,
  SendMatchRequestDto,
} from '../../dtos/send-match-request.dto';
import type { Response } from 'express';
import { User, UserRole } from 'src/database/entities';
import { MatchService } from '../../services/match/match.service';
import { ResponseFormat } from 'src/common/utils/ResponseFormate';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/guards/current-user.guard';

@Controller('match')
export class MatchController {
  private readonly logger = new Logger(MatchController.name);
  constructor(private readonly matchService: MatchService) {}

  @Post('request/:mentorId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTEE)
  async sendRequest(
    @Body() payload: SendMatchRequestDto,
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('mentorId') mentorId: string,
  ) {
    const request = await this.matchService.sendRequest(
      payload,
      user,
      mentorId,
    );
    return ResponseFormat.success(res, 'Request successfully sent', request);
  }

  @Patch('accept/:requestId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR)
  async acceptRequest(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('requestId') requestId: string,
  ) {
    const request = await this.matchService.acceptRequest(user, requestId);
    return ResponseFormat.success(res, 'Request accepted', request);
  }

  @Patch('reject/:requestId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR)
  async rejectRequest(
    @Res() res: Response,
    @Body() payload: RejectMatchRequestDto,
    @CurrentUser() user: User,
    @Param('requestId') requestId: string,
  ) {
    const request = await this.matchService.rejectRequest(
      payload,
      user,
      requestId,
    );
    return ResponseFormat.success(res, 'Request Rejected', request);
  }

  @Delete('delete/:requestId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MENTEE)
  async deleteRequest(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('requestId') requestId: string,
  ) {
    const request = await this.matchService.deleteRequest(user, requestId);
    return ResponseFormat.success(res, 'Request Deleted successfully', request);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard)
  async listRequests(@Res() res: Response, @CurrentUser() user: User) {
    const request = await this.matchService.listRequests(user);
    return ResponseFormat.success(
      res,
      'Request retrieve successfully',
      request,
    );
  }
}
