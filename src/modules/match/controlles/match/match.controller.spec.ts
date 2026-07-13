import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { UserRole, MatchRequestStatus } from 'src/database/entities';
import { MatchService } from '../../services/match/match.service';

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

const mockMatchService = {
  sendRequest: jest.fn(),
};

describe('MatchController', () => {
  let matchController: MatchController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: mockMatchService,
        },
      ],
    }).compile();

    matchController = module.get<MatchController>(MatchController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendRequest', () => {
    it('should send a match request to mentor', async () => {
      mockMatchService.sendRequest.mockResolvedValue(mockMatchRequest);

      const payload = {
        message: 'Hi, I would love to learn Nestjs etc',
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await matchController.sendRequest(
        payload as any,
        res as any,
        mockMenteeUser as any,
        'user-uuid-123',
      );
      expect(mockMatchService.sendRequest).toHaveBeenCalledWith(
        payload,
        mockMenteeUser,
        'user-uuid-123',
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Request successfully sent',
          data: mockMatchRequest,
        }),
      );
    });
  });
});
