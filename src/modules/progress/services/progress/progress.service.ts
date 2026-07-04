import { HttpStatus, Injectable } from '@nestjs/common';
import {
  MatchRequestStatus,
  NotificationType,
  ProgressStatus,
  User,
  UserRole,
} from 'src/database/entities';
import { MatchRepository, ProgressRepository } from 'src/database/repositories';
import { CreateGoalDto, UpdateGoalDto } from '../../dtos/createGoal.dto';
import AppError from 'src/common/errors/AppError';
import { NotificationService } from 'src/modules/notification/services/notification/notification.service';

@Injectable()
export class ProgressService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly matchRepository: MatchRepository,
    private readonly notificationRepository: NotificationService,
  ) {}

  async createGoal(payload: CreateGoalDto, user: User) {
    if (user.role !== UserRole.MENTEE) {
      throw new AppError('Only mentee can create goal', HttpStatus.FORBIDDEN);
    }

    const acceptedRequest = await this.matchRepository.findOne(
      {
        id: payload.matchRequestId,
        mentee: { id: user.id },
        status: MatchRequestStatus.ACCEPTED,
      },
      { relations: { mentor: true } },
    );

    if (!acceptedRequest) {
      throw new AppError(
        'No accepted match request found',
        HttpStatus.NOT_FOUND,
      );
    }

    const goal = await this.progressRepository.create({
      ...payload,
      mentee: user,
      mentor: acceptedRequest.mentor,
      match_request: acceptedRequest,
      status: ProgressStatus.NOT_STARTED,
    });

    return goal.toPayload();
  }

  async getMyGoals(user: User) {
    if (user.role === UserRole.MENTOR) {
      const goals = await this.progressRepository.find({
        where: {
          mentor: { id: user.id },
        },
        relations: { mentee: true, match_request: true },
        order: { created_at: 'DESC' },
      });

      if (!goals.length) {
        throw new AppError('No goals found', HttpStatus.NOT_FOUND);
      }

      return goals.map((goal) => goal.toPayload());
    }

    if (user.role === UserRole.MENTEE) {
      const goals = await this.progressRepository.find({
        where: { mentee: { id: user.id } },
        relations: { mentor: true, match_request: true },
        order: { created_at: 'DESC' },
      });

      if (!goals.length) {
        throw new AppError('No goals found', HttpStatus.NOT_FOUND);
      }

      return goals.map((goal) => goal.toPayload());
    }
    throw new AppError('Admin do not have goals', HttpStatus.FORBIDDEN);
  }

  async getGoalById(user: User, goalId: string) {
    if (user.role === UserRole.MENTOR) {
      const goal = await this.progressRepository.findOne(
        {
          id: goalId,
          mentor: { id: user.id },
        },
        { relations: { mentee: true } },
      );

      if (!goal) {
        throw new AppError('Goal not found', HttpStatus.NOT_FOUND);
      }

      return goal.toPayload();
    }

    if (user.role === UserRole.MENTEE) {
      const goal = await this.progressRepository.findOne(
        {
          id: goalId,
          mentee: { id: user.id },
        },
        { relations: { mentor: true } },
      );

      if (!goal) {
        throw new AppError('Goal not found', HttpStatus.NOT_FOUND);
      }

      return goal.toPayload();
    }
    throw new AppError('Admin do not have goals', HttpStatus.FORBIDDEN);
  }

  async updateGoalStatus(payload: UpdateGoalDto, user: User, goalId: string) {
    if (user.role !== UserRole.MENTEE) {
      throw new AppError(
        'Only mentee can update goal status',
        HttpStatus.FORBIDDEN,
      );
    }

    const goal = await this.progressRepository.findOne({
      id: goalId,
      mentee: { id: user.id },
    });

    if (!goal) {
      throw new AppError('Goal not found', HttpStatus.NOT_FOUND);
    }

    if (
      goal.status === ProgressStatus.COMPLETED ||
      goal.status === ProgressStatus.ABANDONED
    ) {
      throw new AppError(
        'Cannot update goal status as it is already completed or abandoned',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.progressRepository.update({ id: goal.id }, payload);

    const updatedGoal = await this.progressRepository.findOne(
      {
        id: goal.id,
      },
      { relations: { mentor: true } },
    );

    if (!updatedGoal) {
      throw new AppError(
        'Failed to update goal status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (payload.status === ProgressStatus.COMPLETED) {
      await this.notificationRepository.createNotification(
        updatedGoal.mentor,
        'Goal Completed',
        `${user.first_name} has completed a goal: ${updatedGoal.title}`,
        NotificationType.GOAL_COMPLETED,
        { goalId: updatedGoal.id },
      );
    }

    return updatedGoal.toPayload();
  }

  async deleteGoal(user: User, goalId: string) {
    if (user.role !== UserRole.MENTEE) {
      throw new AppError('Only mentee can delete goal', HttpStatus.FORBIDDEN);
    }

    const goal = await this.progressRepository.findOne({
      id: goalId,
      mentee: { id: user.id },
    });

    if (!goal) {
      throw new AppError('Goal not found', HttpStatus.NOT_FOUND);
    }

    await this.progressRepository.delete({ id: goal.id });

    return { message: 'Goal deleted successfully' };
  }
}
