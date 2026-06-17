import { HttpStatus, Injectable } from '@nestjs/common';
import { MatchRepository } from 'src/database/repositories';
import {
  MatchRequest,
  MatchRequestStatus,
  User,
  UserRole,
} from 'src/database/entities';
import AppError from 'src/common/errors/AppError';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly userRepository: UserService,
  ) {}

  async sendRequest(
    payload: Partial<MatchRequest>,
    user: User,
    mentorId: string,
  ): Promise<Partial<MatchRequest>> {
    if (user.role !== UserRole.MENTEE) {
      throw new AppError(
        'Only mentee can send request',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingMentor = await this.userRepository.findOne({
      id: mentorId,
      role: UserRole.MENTOR,
    });

    if (!existingMentor) {
      throw new AppError('Mentor not found', HttpStatus.NOT_FOUND);
    }

    const existingRequest = await this.matchRepository.findOne({
      mentor: { id: mentorId },
      mentee: { id: user.id },
      status: MatchRequestStatus.PENDING,
    });

    if (existingRequest) {
      throw new AppError('Request already pending', HttpStatus.BAD_REQUEST);
    }

    const match = await this.matchRepository.create({
      ...payload,
      mentor: existingMentor,
      mentee: user,
      status: MatchRequestStatus.PENDING,
    });
    return match.toPayload();
  }

  async acceptRequest(user: User, requestId: string) {
    if (user.role !== UserRole.MENTOR) {
      throw new AppError(
        'Only mentor can accept request',
        HttpStatus.FORBIDDEN,
      );
    }

    const request = await this.matchRepository.findOne({
      id: requestId,
      mentor: { id: user.id },
      status: MatchRequestStatus.PENDING,
    });

    if (!request) {
      throw new AppError('No pending request found', HttpStatus.NOT_FOUND);
    }

    await this.matchRepository.update(
      { id: request.id },
      { status: MatchRequestStatus.ACCEPTED },
    );

    const updatedRequest = await this.matchRepository.findOne({
      id: request.id,
    });

    if (!updatedRequest) {
      throw new AppError(
        'Failed to update request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedRequest.toPayload();
  }

  async rejectRequest(
    payload: Partial<MatchRequest>,
    user: User,
    requestId: string,
  ): Promise<Partial<MatchRequest>> {
    if (user.role !== UserRole.MENTOR) {
      throw new AppError(
        'Only mentor can reject request',
        HttpStatus.FORBIDDEN,
      );
    }

    const request = await this.matchRepository.findOne({
      id: requestId,
      mentor: { id: user.id },
      status: MatchRequestStatus.PENDING,
    });

    if (!request) {
      throw new AppError('No pending request found', HttpStatus.NOT_FOUND);
    }

    await this.matchRepository.update(
      { id: request.id },
      {
        rejection_reason: payload.rejection_reason,
        status: MatchRequestStatus.REJECTED,
      },
    );

    const updateRequest = await this.matchRepository.findOne({
      id: request.id,
    });

    if (!updateRequest) {
      throw new AppError(
        'Failed to update request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updateRequest.toPayload();
  }

  async deleteRequest(user: User, requestId: string) {
    if (user.role !== UserRole.MENTEE) {
      throw new AppError(
        'Only mentee can delete request',
        HttpStatus.FORBIDDEN,
      );
    }

    const request = await this.matchRepository.findOne({
      id: requestId,
      mentee: { id: user.id },
      status: MatchRequestStatus.PENDING,
    });

    if (!request) {
      throw new AppError('No pending request found', HttpStatus.NOT_FOUND);
    }

    await this.matchRepository.update(
      { id: request.id },
      { status: MatchRequestStatus.CANCELLED },
    );

    const updateRequest = await this.matchRepository.findOne({
      id: request.id,
    });

    if (!updateRequest) {
      throw new AppError(
        'Failed to update request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updateRequest.toPayload();
  }

  async listRequests(user: User) {
    if (user.role === UserRole.MENTOR) {
      // mentor sees requests sent TO them
      const requests = await this.matchRepository.find({
        where: { mentor: { id: user.id } },
        relations: { mentee: true },
        order: { created_at: 'DESC' },
      });
      return requests.map((r) => r.toPayload());
    }

    if (user.role === UserRole.MENTEE) {
      // mentee sees requests they sent
      const requests = await this.matchRepository.find({
        where: { mentee: { id: user.id } },
        relations: { mentor: true },
        order: { created_at: 'DESC' },
      });
      return requests.map((r) => r.toPayload());
    }

    throw new AppError('Admins do not have requests', HttpStatus.BAD_REQUEST);
  }
}
