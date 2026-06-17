import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { CreateFeedbackDto } from '../../dtos/creatFeedback.dto';
import type { Response } from 'express';
import { CurrentUser } from 'src/common/guards/current-admin.guard';
import { User } from 'src/database/entities';
import { ResponseFormat } from 'src/common/utils/ResponseFormate';

@Controller('feedback')
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);

  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('create')
  async createFeedback(
    @Res() res: Response,
    @Body() payload: CreateFeedbackDto,
    @CurrentUser() user: User,
  ) {
    const feedback = await this.feedbackService.createFeedback(payload, user);
    return ResponseFormat.success(
      res,
      'Feedback successfully created',
      feedback,
    );
  }

  @Get(':sessionId')
  async getSessionFeedback(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('sessionId') sessionId: string,
  ) {
    const feedback = await this.feedbackService.getSessionFeedback(
      user,
      sessionId,
    );
    return ResponseFormat.success(
      res,
      'Feedback successfully retrieve',
      feedback,
    );
  }

  @Get(':mentorId')
  async getMentorFeedback(
    @Res() res: Response,
    @Param('mentorId') mentorId: string,
  ) {
    const feedback = await this.feedbackService.getMentorFeedbacks(mentorId);
    return ResponseFormat.success(
      res,
      'Mentor feedback retrieve successfully',
      feedback,
    );
  }
}
