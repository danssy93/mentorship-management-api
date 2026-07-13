import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { UserRole } from 'src/database/entities/users.entity';
import { MenteeRepository, MentorRepository } from 'src/database/repositories';
import AppError from 'src/common/errors/AppError';
import { SkillsService } from 'src/modules/skills/services/skills/skills.service';

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

const mockMentorRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockMenteeRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockSkillsService = {
  findOneBy: jest.fn(),
};

describe('ProfileService', () => {
  let profileService: ProfileService;
  let mentorRepository: MentorRepository;
  let menteeRepository: MenteeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: MentorRepository,
          useValue: mockMentorRepository,
        },
        {
          provide: MenteeRepository,
          useValue: mockMenteeRepository,
        },
        {
          provide: SkillsService,
          useValue: mockSkillsService,
        },
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    mentorRepository = module.get<MentorRepository>(MentorRepository);
    menteeRepository = module.get<MenteeRepository>(MenteeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMentorProfile', () => {
    it('should throw AppError if user is not a mentor', async () => {
      mockMentorRepository.findOne.mockResolvedValue(mockMentorUser);

      await expect(
        profileService.createMentorProfile({} as any, mockMenteeUser as any, [
          'skill-uuid-123',
        ]),
      ).rejects.toThrow(AppError);
    });

    it('should throw AppError if profile already exists', async () => {
      mockMentorRepository.findOne.mockResolvedValue(mockMentorProfile);

      const mentorDto = {
        bio: 'Full Stack Developer with 5 years experience',
        years_of_experience: 5,
        session_rate: 100,
        hourly_rate: 40,
      };

      await expect(
        profileService.createMentorProfile(mentorDto, mockMentorUser as any, [
          'skill-uuid-123',
        ]),
      ).rejects.toThrow(AppError);
    });

    it('should create a new mentor profile successfully', async () => {
      mockMentorRepository.findOne.mockResolvedValue(null);
      mockSkillsService.findOneBy.mockResolvedValue([mockSkill]);
      mockMentorRepository.create.mockResolvedValue(mockMentorProfile);

      const mentorDto = {
        bio: 'Full Stack Developer with 5 years experience',
        years_of_experience: 5,
        session_rate: 100,
        hourly_rate: 40,
      };

      const result = await profileService.createMentorProfile(
        mentorDto,
        mockMentorUser as any,
        ['skill-uuid-123'],
      );

      expect(mockMentorRepository.findOne).toHaveBeenCalledWith({
        user: { id: mockMentorUser.id },
      });
      expect(mockSkillsService.findOneBy).toHaveBeenCalledWith([
        'skill-uuid-123',
      ]);
      expect(mockMentorRepository.create).toHaveBeenCalledWith({
        ...mentorDto,
        skills: [mockSkill],
        user: mockMentorUser,
      });
      expect(result).toEqual(mockMentorProfile.toPayload());
    });
  });

  describe('createMenteeProfile', () => {
    it('should throw AppError if user is not a mentee', async () => {
      mockMenteeRepository.findOne.mockResolvedValue(mockMenteeUser);

      await expect(
        profileService.createMenteeProfile({} as any, mockMentorUser as any, [
          'skill-uuid-123',
        ]),
      ).rejects.toThrow(AppError);
    });

    it('should throw AppError if profile already exist', async () => {
      mockMenteeRepository.findOne.mockResolvedValue(mockMenteeProfile);

      const menteeDto = {
        bio: 'Aspiring Full Stack Developer',
        learning_goals: 'Learn TypeScript and React',
        current_level: 'beginner',
        occupation: 'Student',
      };

      await expect(
        profileService.createMenteeProfile(menteeDto, mockMenteeUser as any, [
          'skill-uuid-123',
        ]),
      ).rejects.toThrow(AppError);
    });

    it('should create a new mentee profile successfully', async () => {
      mockMenteeRepository.findOne.mockResolvedValue(null);
      mockSkillsService.findOneBy.mockResolvedValue(mockSkill);
      mockMenteeRepository.create.mockResolvedValue(mockMenteeProfile);

      const menteeDto = {
        bio: 'Aspiring Full Stack Developer',
        learning_goals: 'Learn TypeScript and React',
        current_level: 'beginner',
        occupation: 'Student',
      };

      const result = await profileService.createMenteeProfile(
        menteeDto,
        mockMenteeUser as any,
        ['skill-uuid-123'],
      );

      expect(mockMenteeRepository.findOne).toHaveBeenCalledWith({
        user: { id: mockMenteeUser.id },
      });
      expect(mockSkillsService.findOneBy).toHaveBeenCalledWith([
        'skill-uuid-123',
      ]);
      expect(mockMenteeRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMenteeProfile.toPayload());
    });
  });

  describe('getMyProfile', () => {
    it('should return mentor profile', async () => {
      mockMentorRepository.findOne.mockResolvedValue(mockMentorProfile);

      const result = await profileService.getMyProfile(mockMentorUser as any);
      expect(mockMentorRepository.findOne).toHaveBeenCalledWith(
        { user: { id: mockMentorUser.id } },
        { relations: { skills: true } },
      );

      expect(result).toEqual(mockMentorProfile.toPayload());
    });

    it('should throw AppError if mentor profile does not exist', async () => {
      mockMentorRepository.findOne.mockResolvedValue(null);

      await expect(
        profileService.getMyProfile(mockMentorUser as any),
      ).rejects.toThrow(AppError);
    });

    it('should return mentee profile', async () => {
      mockMenteeRepository.findOne.mockResolvedValue(mockMenteeProfile);

      const result = await profileService.getMyProfile(mockMenteeUser as any);

      expect(mockMenteeRepository.findOne).toHaveBeenCalledWith(
        { user: { id: mockMenteeUser.id } },
        { relations: { desired_skills: true } },
      );
      expect(result).toEqual(mockMenteeProfile.toPayload());
    });

    it('should throw AppError if mentee profile does not exist', async () => {
      mockMenteeRepository.findOne.mockResolvedValue(null);

      await expect(
        profileService.getMyProfile(mockMenteeUser as any),
      ).rejects.toThrow(AppError);
    });

    it('should throw AppError if user ia an Admin', async () => {
      const adminUser = {
        id: 'admin-uuid',
        role: UserRole.ADMIN,
      };

      await expect(
        profileService.getMyProfile(adminUser as any),
      ).rejects.toThrow(AppError);
    });
  });

  describe('getProfileById', () => {
    it('should return mentor profile with selected ID', async () => {
      mockMentorRepository.findOne.mockResolvedValue(mockMentorProfile);

      const result = await profileService.getProfileById('user-uuid-123');

      expect(mockMentorRepository.findOne).toHaveBeenCalledWith(
        {
          user: { id: 'user-uuid-123' },
        },
        { relations: { skills: true } },
      );

      expect(result).toEqual(mockMentorProfile.toPayload());
    });

    it('should return mentee profile with selected ID', async () => {
      mockMentorRepository.findOne.mockResolvedValue(null);
      mockMenteeRepository.findOne.mockResolvedValue(mockMenteeProfile);

      const result = await profileService.getProfileById('user-uuid-456');

      expect(mockMenteeRepository.findOne).toHaveBeenCalledWith(
        {
          user: { id: 'user-uuid-456' },
        },
        { relations: { desired_skills: true } },
      );

      expect(result).toEqual(mockMenteeProfile.toPayload());
    });

    it('should throw AppError if profile does not exist', async () => {
      mockMentorRepository.findOne.mockResolvedValue(null);
      mockMenteeRepository.findOne.mockResolvedValue(null);

      await expect(
        profileService.getProfileById('invalid-user-id'),
      ).rejects.toThrow(AppError);
    });
  });

  describe('updateProfile', () => {
    it('should throw AppError if mentor profile not found', async () => {
      mockMentorRepository.findOne.mockResolvedValue(null);

      await expect(
        profileService.updateProfile(mockMentorUser as any, {
          bio: 'Updated bio',
        }),
      ).rejects.toThrow(AppError);
    });

    it('should update mentor scalar fields only', async () => {
      mockMentorRepository.findOne
        .mockResolvedValueOnce(mockMentorProfile)
        .mockResolvedValueOnce(mockMentorProfile);
      mockMentorRepository.update.mockResolvedValue(mockMentorProfile);

      const payload = { bio: 'Updated bio' };

      const result = await profileService.updateProfile(
        mockMentorUser as any,
        payload,
      );

      expect(mockMentorRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockMentorRepository.update).toHaveBeenCalledWith(
        { user: { id: mockMentorUser.id } },
        { bio: 'Updated bio' },
      );
      expect(mockSkillsService.findOneBy).not.toHaveBeenCalled();
      expect(result).toEqual(mockMentorProfile.toPayload());
    });

    it('should update mentor skills when skillIds provided', async () => {
      mockMentorRepository.findOne
        .mockResolvedValueOnce(mockMentorProfile)
        .mockResolvedValueOnce(mockMentorProfile);
      mockSkillsService.findOneBy.mockResolvedValue([mockSkill]);
      mockMentorRepository.save.mockResolvedValue(mockMentorProfile);

      const payload = { skillIds: ['skill-uuid-123'] };

      const result = await profileService.updateProfile(
        mockMentorUser as any,
        payload,
      );

      expect(mockSkillsService.findOneBy).toHaveBeenCalledWith([
        'skill-uuid-123',
      ]);
      expect(mockMentorRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMentorRepository.update).not.toHaveBeenCalled();
      expect(result).toEqual(mockMentorProfile.toPayload());
    });

    it('should update both scalar fields and skills', async () => {
      mockMentorRepository.findOne
        .mockResolvedValueOnce(mockMentorProfile)
        .mockResolvedValueOnce(mockMentorProfile);
      mockSkillsService.findOneBy.mockResolvedValue([mockSkill]);
      mockMentorRepository.save.mockResolvedValue(mockMentorProfile);
      mockMentorRepository.update.mockResolvedValue(mockMentorProfile);

      const payload = {
        bio: 'Updated bio',
        skillIds: ['skill-uuid-123'],
      };

      const result = await profileService.updateProfile(
        mockMentorUser as any,
        payload,
      );

      expect(mockSkillsService.findOneBy).toHaveBeenCalledWith([
        'skill-uuid-123',
      ]);
      expect(mockMentorRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMentorRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMentorProfile.toPayload());
    });

    it('should throw AppError if mentee profile not found', async () => {
      mockMenteeRepository.findOne.mockResolvedValue(null);

      await expect(
        profileService.updateProfile(mockMenteeUser as any, {
          bio: 'Updated bio',
        }),
      ).rejects.toThrow(AppError);
    });

    it('should update mentee scalar fields only', async () => {
      mockMenteeRepository.findOne
        .mockResolvedValueOnce(mockMenteeProfile)
        .mockResolvedValueOnce(mockMenteeProfile);
      mockMenteeRepository.update.mockResolvedValue(mockMenteeProfile);

      const payload = { bio: 'Updated bio' };
      const result = await profileService.updateProfile(
        mockMenteeUser as any,
        payload,
      );

      expect(mockMenteeRepository.update).toHaveBeenCalledWith(
        { user: { id: mockMenteeUser.id } },
        { bio: 'Updated bio' },
      );
      expect(mockSkillsService.findOneBy).not.toHaveBeenCalled();
      expect(result).toEqual(mockMenteeProfile.toPayload());
    });

    it('should update mentee desired skills when skillIds provided', async () => {
      mockMenteeRepository.findOne
        .mockResolvedValueOnce(mockMenteeProfile)
        .mockResolvedValueOnce(mockMenteeProfile);
      mockSkillsService.findOneBy.mockResolvedValue([mockSkill]);
      mockMenteeRepository.save.mockResolvedValue(mockMenteeProfile);

      const payload = { skillIds: ['skill-uuid-123'] };

      const result = await profileService.updateProfile(
        mockMenteeUser as any,
        payload,
      );
      expect(mockSkillsService.findOneBy).toHaveBeenCalledWith([
        'skill-uuid-123',
      ]);
      expect(mockMenteeRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMenteeRepository.update).not.toHaveBeenCalled();
      expect(result).toEqual(mockMenteeProfile.toPayload());
    });

    it('should throw AppError if user is admin', async () => {
      const mockAdminUser = {
        id: 'admin-uuid-123',
        role: UserRole.ADMIN,
      };

      await expect(
        profileService.updateProfile(mockAdminUser as any, {
          bio: 'Updated bio',
        }),
      ).rejects.toThrow(AppError);
    });
  });
});
