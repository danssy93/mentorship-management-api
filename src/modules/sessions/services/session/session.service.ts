import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import AppError from 'src/common/errors/AppError';
import {
  MatchRequestStatus,
  Session,
  SessionStatus,
  User,
  UserRole,
} from 'src/database/entities';
import { MatchRepository, SessionRepository } from 'src/database/repositories';
import { MatchService } from 'src/modules/match/services/match/match.service';
import {
  CancelSessionDto,
  CreateSessionDto,
  UpdateSessionDto,
} from '../../dtos/createSession.dto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly matchRepository: MatchRepository,
  ) {}

  async createSession(
    payload: CreateSessionDto,
    user: User,
  ): Promise<Partial<Session>> {
    if (user.role !== UserRole.MENTOR) {
      throw new AppError(
        'Only mentor can create session',
        HttpStatus.FORBIDDEN,
      );
    }

    const matchRequest = await this.matchRepository.findOne(
      {
        id: payload.matchRequestId,
        mentor: { id: user.id },
        status: MatchRequestStatus.ACCEPTED,
      },
      { relations: { mentee: true } },
    );

    if (!matchRequest) {
      throw new AppError('No match request found', HttpStatus.NOT_FOUND);
    }

    const existingSchedule = await this.sessionRepository.findOne({
      mentor: { id: user.id },
      scheduled_at: payload.scheduled_at,
      status: SessionStatus.SCHEDULED,
    });

    if (existingSchedule) {
      throw new AppError('Session already scheduled', HttpStatus.BAD_REQUEST);
    }

    const session = await this.sessionRepository.create({
      ...payload,
      mentor: user,
      mentee: matchRequest.mentee,
      match_request: matchRequest,
      status: SessionStatus.SCHEDULED,
    });

    return session.toPayload();
  }

  async getMySession(user: User) {
    if (user.role === UserRole.MENTOR) {
      const session = await this.sessionRepository.find({
        where: {
          mentor: { id: user.id },
        },
        relations: { mentee: true, match_request: true },
        order: { scheduled_at: 'DESC' },
      });

      if (!session) {
        throw new AppError('Session not found', HttpStatus.NOT_FOUND);
      }
      return session.map((s) => s.toPayload());
    }

    if (user.role === UserRole.MENTEE) {
      const session = await this.sessionRepository.find({
        where: {
          mentee: { id: user.id },
        },
        relations: { mentor: true, match_request: true },
        order: { scheduled_at: 'DESC' },
      });

      if (!session) {
        throw new AppError('Session not found', HttpStatus.NOT_FOUND);
      }
      return session.map((s) => s.toPayload());
    }
    throw new AppError('Admins do not have sessions', HttpStatus.BAD_REQUEST);
  }

  async getSessionById(user: User, sessionId: string) {
    if (user.role === UserRole.MENTOR) {
      const session = await this.sessionRepository.findOne({
        id: sessionId,
        mentee: { id: user.id },
      });

      if (!session) {
        throw new AppError('Session not found', HttpStatus.NOT_FOUND);
      }

      return session.toPayload();
    }

    if (user.role === UserRole.MENTEE) {
      const session = await this.sessionRepository.findOne({
        id: sessionId,
        mentor: { id: user.id },
      });

      if (!session) {
        throw new AppError('Session not found', HttpStatus.NOT_FOUND);
      }

      return session.toPayload();
    }
    throw new AppError('Admin do not have session', HttpStatus.BAD_REQUEST);
  }

  async updateSession(
    payload: UpdateSessionDto,
    user: User,
    sessionId: string,
  ) {
    if (user.role !== UserRole.MENTOR) {
      throw new AppError(
        'Only mentor can update session',
        HttpStatus.FORBIDDEN,
      );
    }

    const existingSession = await this.sessionRepository.findOne({
      id: sessionId,
      mentor: { id: user.id },
      status: SessionStatus.SCHEDULED,
    });

    if (!existingSession) {
      throw new AppError('No session scheduled', HttpStatus.NOT_FOUND);
    }

    await this.sessionRepository.update(
      { id: existingSession.id },

      payload as any,
    );

    const updateSession = await this.sessionRepository.findOne({
      id: existingSession.id,
    });
    if (!updateSession) {
      throw new AppError(
        'Failed to update session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updateSession.toPayload();
  }

  async cancelSession(
    payload: CancelSessionDto,
    user: User,
    sessionId: string,
  ) {
    if (user.role === UserRole.MENTOR) {
      const session = await this.sessionRepository.findOne({
        id: sessionId,
        mentor: { id: user.id },
        status: SessionStatus.SCHEDULED,
      });

      if (!session) {
        throw new AppError('No active session schedule', HttpStatus.NOT_FOUND);
      }

      await this.sessionRepository.update(
        {
          id: session.id,
        },
        {
          cancellation_reason: payload.cancellation_reason,
          status: SessionStatus.CANCELLED,
        },
      );

      const cancelSession = await this.sessionRepository.findOne({
        id: session.id,
      });

      if (!cancelSession) {
        throw new AppError(
          'Failed to cancel session',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return cancelSession.toPayload();
    }

    if (user.role === UserRole.MENTEE) {
      const session = await this.sessionRepository.findOne({
        id: sessionId,
        mentee: { id: user.id },
        status: SessionStatus.SCHEDULED,
      });

      if (!session) {
        throw new AppError('No active session schedule', HttpStatus.NOT_FOUND);
      }

      await this.sessionRepository.update(
        { id: session.id },
        {
          cancellation_reason: payload.cancellation_reason,
          status: SessionStatus.CANCELLED,
        },
      );

      const cancelSession = await this.sessionRepository.findOne({
        id: session.id,
      });

      if (!cancelSession) {
        throw new AppError(
          'Failed to update request',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return cancelSession.toPayload();
    }
    throw new AppError(
      'Admin is not allowed to cancel session',
      HttpStatus.FORBIDDEN,
    );
  }

  async completeSession(user: User, sessionId: string) {
    if (user.role !== UserRole.MENTOR) {
      throw new AppError(
        'Only mentor can validate a completed session',
        HttpStatus.FORBIDDEN,
      );
    }

    const session = await this.sessionRepository.findOne({
      id: sessionId,
      mentor: { id: user.id },
      status: SessionStatus.ONGOING,
    });

    if (!session) {
      throw new AppError('No ongoing session', HttpStatus.NOT_FOUND);
    }

    await this.sessionRepository.update(
      { id: session.id },
      { status: SessionStatus.COMPLETED },
    );

    const completeSession = await this.sessionRepository.findOne({
      id: session.id,
    });

    if (!completeSession) {
      throw new AppError(
        'Failed to complete session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return completeSession.toPayload();
  }
}
