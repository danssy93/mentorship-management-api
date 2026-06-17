import { HttpStatus, Injectable } from '@nestjs/common';
import {
  FeedbackRepository,
  SessionRepository,
} from 'src/database/repositories';
import { CreateFeedbackDto } from '../../dtos/creatFeedback.dto';
import {
  FeedbackRole,
  SessionStatus,
  User,
  UserRole,
} from 'src/database/entities';
import AppError from 'src/common/errors/AppError';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async createFeedback(payload: CreateFeedbackDto, user: User) {
    if (user.role === UserRole.MENTOR) {
      const existingSession = await this.sessionRepository.findOne(
        {
          id: payload.sessionId,
          mentor: { id: user.id },
          status: SessionStatus.COMPLETED,
        },
        { relations: { mentee: true } },
      );

      if (!existingSession) {
        throw new AppError(
          'NO existing session or session is not yet complete',
          HttpStatus.NOT_FOUND,
        );
      }

      const existingFeedback = await this.feedbackRepository.findOne({
        reviewer: { id: user.id },
        session: { id: payload.sessionId },
      });

      if (existingFeedback) {
        throw new AppError('Feedback already exist', HttpStatus.BAD_REQUEST);
      }

      const feedback = await this.feedbackRepository.create({
        ...payload,
        reviewer: user,
        reviewee: existingSession.mentee,
        session: existingSession,
        role: FeedbackRole.MENTOR_TO_MENTEE,
      });

      return feedback.toPayload();
    }

    if (user.role === UserRole.MENTEE) {
      const existingSession = await this.sessionRepository.findOne(
        {
          id: payload.sessionId,
          mentee: { id: user.id },
          status: SessionStatus.COMPLETED,
        },
        { relations: { mentor: true } },
      );

      if (!existingSession) {
        throw new AppError(
          'No existing session or session is yet to be completed',
          HttpStatus.NOT_FOUND,
        );
      }

      const existingFeedback = await this.feedbackRepository.findOne({
        reviewee: { id: user.id },
        session: { id: payload.sessionId },
      });

      if (existingFeedback) {
        throw new AppError('Feedback already exist', HttpStatus.BAD_REQUEST);
      }

      const feedback = await this.feedbackRepository.create({
        ...payload,
        reviewer: user,
        reviewee: existingSession.mentor,
        session: existingSession,
        role: FeedbackRole.MENTEE_TO_MENTOR,
      });
      return feedback.toPayload();
    }
    throw new AppError('Admin cannot leave feedback', HttpStatus.FORBIDDEN);
  }

  async getSessionFeedback(user: User, sessionId: string) {
    const session = await this.feedbackRepository.findOne({
      id: sessionId,
    });

    if (!session) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    const feedbacks = await this.feedbackRepository.find({
      where: { session: { id: sessionId } },
      relations: { reviewer: true, reviewee: true },
    });

    if (!feedbacks.length) {
      throw new AppError('No feedback for this session', HttpStatus.NOT_FOUND);
    }
    return feedbacks.map((f) => f.toPayload());
  }

  async getMentorFeedbacks(mentorId: string) {
    const feedbacks = await this.feedbackRepository.find({
      where: {
        reviewee: { id: mentorId },
        role: FeedbackRole.MENTEE_TO_MENTOR,
      },
      relations: { reviewer: true },
    });

    if (!feedbacks.length) {
      throw new AppError(
        'No feedback found for this session',
        HttpStatus.NOT_FOUND,
      );
    }

    const averageRating = feedbacks.reduce((sum, f) => +f.rating, 0);

    return {
      feedbacks: feedbacks.map((f) => f.toPayload()),
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: feedbacks.length,
    };
  }
}
