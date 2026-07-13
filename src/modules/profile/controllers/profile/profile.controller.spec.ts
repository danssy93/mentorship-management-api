import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from '../../services/profile/profile.service';
import { mock } from 'node:test';
import { UserRole } from 'src/database/entities';

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

const mockProfileService = {
  createMentorProfile: jest.fn(),
  createMenteeProfile: jest.fn(),
  getMyProfile: jest.fn(),
  getProfileById: jest.fn(),
  updateProfile: jest.fn(),
};

const mockSkillsService = {
  findOneBy: jest.fn(),
};

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMentorProfile', () => {
    it('should create a mentor profile successfully', async () => {
      mockProfileService.createMentorProfile.mockResolvedValue(
        mockMentorProfile,
      );

      const payload = {
        bio: 'Full Stack Developer with 5 years experience',
        years_of_experience: 5,
        session_rate: 100,
        hourly_rate: 40,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.createMentorProfile(
        payload as any,
        mockMentorUser as any,
        res as any,
      );

      expect(mockProfileService.createMentorProfile).toHaveBeenCalledWith(
        payload,
        mockMentorUser,
        undefined,
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Mentor profile successfully created',
          data: mockMentorProfile,
        }),
      );
    });
  });

  describe('createMenteeProfile', () => {
    it('should create a new mentee profile successfully', async () => {
      mockProfileService.createMenteeProfile.mockResolvedValue(
        mockMenteeProfile,
      );

      const payload = {
        bio: 'Aspiring Full Stack Developer',
        learning_goals: 'Learn TypeScript and React',
        current_level: 'beginner',
        occupation: 'Student',
        is_looking_for_mentor: true,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.createMenteeProfile(
        payload as any,
        mockMenteeUser as any,
        res as any,
      );

      expect(mockProfileService.createMenteeProfile).toHaveBeenLastCalledWith(
        payload,
        mockMenteeUser,
        undefined,
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Mentee profile successfully created',
          data: mockMenteeProfile,
        }),
      );
    });
  });

  describe('getProfile', () => {
    it('should retrieve mentor profile when found', async () => {
      mockProfileService.getMyProfile.mockResolvedValue(mockMentorProfile);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.getProfile(res as any, mockMentorUser as any);

      expect(mockProfileService.getMyProfile).toHaveBeenCalledWith(
        mockMentorUser,
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Profile retrieved successfully',
          data: mockMentorProfile,
        }),
      );
    });

    it('should retrieve mentee profile when found', async () => {
      mockProfileService.getMyProfile.mockResolvedValue(mockMenteeProfile);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.getProfile(res as any, mockMenteeUser as any);

      expect(mockProfileService.getMyProfile).toHaveBeenCalledWith(
        mockMenteeUser,
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Profile retrieved successfully',
          data: mockMenteeProfile,
        }),
      );
    });
  });

  describe('getProfileById', () => {
    it('should retrieve profile with the specified ID', async () => {
      mockProfileService.getProfileById.mockResolvedValue(mockMentorProfile);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.getProfileById('user-uuid-123', res as any);

      expect(mockProfileService.getProfileById).toHaveBeenCalledWith(
        'user-uuid-123',
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Profile retrieved successfully',
          data: mockMentorProfile,
        }),
      );
    });

    it('should retrieve profile with the specified ID', async () => {
      mockProfileService.getProfileById.mockResolvedValue(mockMenteeProfile);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.getProfileById('user-uuid-456', res as any);

      expect(mockProfileService.getProfileById).toHaveBeenCalledWith(
        'user-uuid-456',
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Profile retrieved successfully',
          data: mockMenteeProfile,
        }),
      );
    });
  });

  describe('updateProfile', () => {
    it('should update mentor profile successfully', async () => {
      mockProfileService.updateProfile.mockResolvedValue(mockMentorProfile);

      const payload = {
        bio: 'Full Stack Developer with 5 years experience',
        years_of_experience: 5,
        session_rate: 100,
        hourly_rate: 40,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.updateProfile(
        payload as any,
        mockMentorUser as any,
        res as any,
      );

      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        mockMentorUser,
        payload,
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Profile updated successfully',
          data: mockMentorProfile,
        }),
      );
    });

    it('should update mentee profile succefully', async () => {
      mockProfileService.updateProfile.mockResolvedValue(mockMenteeProfile);

      const payload = {
        bio: 'Aspiring Full Stack Developer',
        learning_goals: 'Learn TypeScript and React',
        current_level: 'beginner',
        occupation: 'Student',
        is_looking_for_mentor: true,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.updateProfile(
        payload as any,
        mockMenteeUser as any,
        res as any,
      );

      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        mockMenteeUser,
        payload,
      );
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Profile updated successfully',
          data: mockMenteeProfile,
        }),
      );
    });
  });
});
