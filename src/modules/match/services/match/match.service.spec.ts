import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { MatchRepository, UserRepository } from 'src/database/repositories';
import { NotificationService } from 'src/modules/notification/services/notification/notification.service';
import { MatchRequestStatus, UserRole } from 'src/database/entities';
import AppError from 'src/common/errors/AppError';
import { UserService } from 'src/modules/user/services/user.service';

const mockSkill = {
  id: 'skill-uuid-123',
  name: 'TypeScript',
  category: 'ENGINEERING',
  is_active: true,
};

const mockMentorProfile = {
  id: 'mentor-profile-uuid-123',
  bio: 'Full Stack Developer with 5 years experience',
  years_of_experience: 5,
  session_rate: 100,
  hourly_rate: 40,
  is_accepting_mentees: true,
  skills: [mockSkill],
  user: {
    id: 'user-uuid-123',
    first_name: 'Tobs',
    last_name: 'Dan',
    email: 'tobs@gmail.com',
    phone: '2348104075057',
    role: UserRole.MENTOR,
    is_active: true,
  },
  created_at: new Date(),
  updated_at: new Date(),
  toPayload: jest.fn().mockReturnValue({
    id: 'mentor-profile-uuid-123',
    bio: 'Full Stack Developer with 5 years experience',
    years_of_experience: 5,
    session_rate: 100,
    hourly_rate: 40,
    is_accepting_mentees: true,
  }),
};

const mockMenteeProfile = {
  id: 'mentee-profile-uuid-123',
  bio: 'Aspiring Full Stack Developer',
  learning_goals: 'Learn TypeScript and React',
  current_level: 'beginner',
  occupation: 'Student',
  is_looking_for_mentor: true,
  desired_skills: [mockSkill],
  user: {
    id: 'user-uuid-456',
    first_name: 'Mini',
    last_name: 'Doe',
    email: 'mimi@gmail.com',
    role: UserRole.MENTEE,
    is_active: true,
  },
  created_at: new Date(),
  updated_at: new Date(),
  toPayload: jest.fn().mockReturnValue({
    id: 'mentee-profile-uuid-123',
    bio: 'Aspiring Full Stack Developer',
    learning_goals: 'Learn TypeScript and React',
    current_level: 'beginner',
    occupation: 'Student',
    is_looking_for_mentor: true,
  }),
};

const mockMentorUser = {
  id: 'user-uuid-123',
  first_name: 'Mini',
  last_name: 'Dan',
  email: 'mimi@gmail.com',
  phone: '2348104075057',
  role: UserRole.MENTOR,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockMenteeUser = {
  id: 'user-uuid-456',
  first_name: 'Tee',
  last_name: 'Hadda',
  email: 'hadda@gmail.com',
  phone: '2348105679832',
  role: UserRole.MENTEE,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockMatchRequest = {
  id: 'match-uuid-123',
  mentee: mockMenteeUser,
  mentor: mockMentorUser,
  status: MatchRequestStatus.PENDING,
  message: 'Hi, I would love to learn from you',
  rejection_reason: null,
  created_at: new Date(),
  updated_at: new Date(),
  toPayload: jest.fn().mockReturnValue({
    id: 'match-request-uuid-123',
    status: MatchRequestStatus.PENDING,
    message: 'Hi, I would love to learn from you',
    rejection_reason: null,
  }),
};

const mockAcceptedMatchRequest = {
  ...mockMatchRequest,
  status: MatchRequestStatus.ACCEPTED,
  toPayload: jest.fn().mockReturnValue({
    id: 'match-request-uuid-123',
    status: MatchRequestStatus.PENDING,
    message: 'Hi, I would love to learn from you',
    rejection_reason: null,
  }),
};

const mockRejectedMatchRequest = {
  ...mockMatchRequest,
  status: MatchRequestStatus.REJECTED,
  rejection_reason: 'Not available right now',
  toPayload: jest.fn().mockReturnValue({
    id: 'match-request-uuid-123',
    status: MatchRequestStatus.REJECTED,
    message: 'Hi, I would love to learn from you',
    rejection_reason: 'Not available right now',
  }),
};

const mockCancelledMatchRequest = {
  ...mockMatchRequest,
  status: MatchRequestStatus.CANCELLED,
  toPayload: jest.fn().mockReturnValue({
    id: 'match-request-uuid-123',
    status: MatchRequestStatus.CANCELLED,
    message: 'Hi, I would love to learn from you',
    rejection_reason: null,
  }),
};

const mockMatchRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockNotificationService = {
  createNotification: jest.fn(),
};

describe('MatchService', () => {
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: MatchRepository,
          useValue: mockMatchRepository,
        },
        {
          provide: UserService,
          useValue: mockUserRepository,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendRequest', () => {
    it('should throw AppError if user is not mentee', async () => {
      mockMatchRepository.findOne.mockResolvedValue(mockMenteeUser);

      await expect(
        matchService.sendRequest(
          {} as any,
          mockMentorUser as any,
          'user-uuid-123',
        ),
      ).rejects.toThrow(AppError);

      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw AppError if mentor do not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockMentorUser);

      await expect(
        matchService.sendRequest(
          {} as any,
          mockMenteeUser as any,
          'user-uuid-456',
        ),
      ).rejects.toThrow(AppError);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        id: 'user-uuid-456',
        role: UserRole.MENTOR,
      });
    });

    it('should throw AppError if there is a pending request', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockMentorUser);
      mockMatchRepository.findOne.mockResolvedValue(mockMentorProfile);

      await expect(
        matchService.sendRequest(
          {} as any,
          mockMenteeUser as any,
          'user-uuid-123',
        ),
      ).rejects.toThrow(AppError);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        id: 'user-uuid-123',
        role: UserRole.MENTOR,
      });

      expect(mockMatchRepository.findOne).toHaveBeenCalledWith({
        mentor: { id: 'user-uuid-123' },
        mentee: { id: 'user-uuid-456' },
        status: MatchRequestStatus.PENDING,
      });
    });

    it('should create a new match request successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockMentorUser);
      mockMatchRepository.findOne.mockResolvedValue(null);
      mockMatchRepository.create.mockResolvedValue(mockMatchRequest);
      mockNotificationService.createNotification.mockResolvedValue(undefined);

      const payload = {
        message: 'Hi, I would love to learn Nestjs etc',
      };

      const result = await matchService.sendRequest(
        payload,
        mockMenteeUser as any,
        'user-uuid-123',
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        id: 'user-uuid-123',
        role: UserRole.MENTOR,
      });

      expect(mockMatchRepository.findOne).toHaveBeenCalledWith({
        mentor: { id: 'user-uuid-123' },
        mentee: { id: 'user-uuid-456' },
        status: MatchRequestStatus.PENDING,
      });

      expect(mockMatchRepository.create).toHaveBeenCalledWith({
        ...payload,
        mentor: mockMentorUser,
        mentee: mockMenteeUser,
        status: MatchRequestStatus.PENDING,
      });

      expect(mockNotificationService.createNotification).toHaveBeenCalled();

      expect(result).toEqual(mockMatchRequest.toPayload());
    });
  });
});
