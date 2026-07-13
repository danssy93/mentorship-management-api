import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { SkillsRepository } from 'src/database/repositories';
import AppError from 'src/common/errors/AppError';
import { UserRole } from 'src/database/entities';

const mockSkill = {
  id: 'skill-uuid-123',
  name: 'TypeScript',
  category: 'ENGINEERING',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
  toPayload: jest.fn().mockReturnValue({
    id: 'skill-uuid-123',
    name: 'TypeScript',
    category: 'ENGINEERING',
  }),
};

const mockUser = {
  id: 'user-uuid-123',
  email: 'admin@gmail.com',
  role: UserRole.ADMIN,
};

const mockSkillRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
};

describe('SkillsService', () => {
  let skillsService: SkillsService;
  let skillsRepository: SkillsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: SkillsRepository,
          useValue: mockSkillRepository,
        },
      ],
    }).compile();

    skillsService = module.get<SkillsService>(SkillsService);
    skillsRepository = module.get<SkillsRepository>(SkillsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return all skills', async () => {
      mockSkillRepository.find.mockResolvedValue([mockSkill]);

      const result = await skillsService.find();

      expect(result).toHaveLength(1);
      expect(result[0].is_active).toBe(true);
      expect(mockSkillRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneBy', () => {
    it('should return a skill when found', async () => {
      mockSkillRepository.find.mockResolvedValue([mockSkill]);

      const result = await skillsService.findOneBy(['skill-uuid-123']);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('skill-uuid-123');
      expect(mockSkillRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw AppError when skill IDs are invalid', async () => {
      mockSkillRepository.find.mockResolvedValue([]);

      await expect(skillsService.findOneBy(['invalid-id'])).rejects.toThrow(
        AppError,
      );

      expect(mockSkillRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new skill successfully', async () => {
      mockSkillRepository.findOne.mockResolvedValue(null);
      mockSkillRepository.create.mockReturnValue(mockSkill);

      const skillsDto = {
        name: 'TypeScript',
        category: 'ENGINEERING',
        description: 'TypeScript programming language',
        is_active: true,
      };

      const result = await skillsService.create(skillsDto, mockUser);

      expect(result).toBeDefined();
      expect(mockSkillRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw AppError if skill already exists', async () => {
      mockSkillRepository.findOne.mockResolvedValue(mockSkill);

      const skillsDto = {
        name: 'TypeScript',
        category: 'ENGINEERING',
        description: 'TypeScript programming language',
        is_active: true,
      };

      await expect(
        skillsService.create(skillsDto, mockUser as any),
      ).rejects.toThrow(AppError);
    });
  });
});
