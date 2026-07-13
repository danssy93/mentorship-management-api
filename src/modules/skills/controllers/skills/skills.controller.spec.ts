import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { UserRole } from 'src/database/entities';
import { SkillsService } from '../../services/skills/skills.service';

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

const mockSkillsService = {
  create: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
};

describe('SkillsController', () => {
  let skillsController: SkillsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: mockSkillsService,
        },
      ],
    }).compile();

    skillsController = module.get<SkillsController>(SkillsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSkills', () => {
    it('should return all skills', async () => {
      mockSkillsService.find.mockResolvedValue([mockSkill]);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await skillsController.getSkills('ENGINEERING', res as any);

      expect(mockSkillsService.find).toHaveBeenCalledWith('ENGINEERING');
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'skills retrieved successfully',
          data: [mockSkill],
        }),
      );
    });
  });

  describe('getSkillsById', () => {
    it('should return a skill when found', async () => {
      mockSkillsService.findOneBy.mockResolvedValue([mockSkill]);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await skillsController.getSkillsByIds(['skill-uuid-123'], res as any);

      expect(mockSkillsService.findOneBy).toHaveBeenCalledWith([
        'skill-uuid-123',
      ]);

      expect(res.status).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'skill retrieved successfully',
          data: [mockSkill],
        }),
      );
    });
  });

  describe('createSkill', () => {
    it('should create a new skill successfully', async () => {
      mockSkillsService.create.mockResolvedValue(mockSkill);

      const skillDto = {
        name: 'TypeScript',
        category: 'ENGINEERING',
        description: 'TypeScript programming language',
        is_active: true,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await skillsController.createSkills(
        skillDto as any,
        mockUser as any,
        res as any,
      );

      expect(mockSkillsService.create).toHaveBeenCalledWith(skillDto, mockUser);
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'skill created successfully',
          data: mockSkill,
        }),
      );
    });
  });
});
