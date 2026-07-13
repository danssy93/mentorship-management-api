import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRole } from 'src/database/entities/users.entity';
import { UserRepository } from 'src/database/repositories';
import AppError from 'src/common/errors/AppError';

const mockUser = {
  id: 'uuid-123',
  first_name: 'Tobs',
  last_name: 'Dan',
  email: 'tobs@gmail.com',
  phone: '2348104075057',
  role: UserRole.MENTOR,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.findOne({
        email: 'tobs@example.com',
      });

      expect(result).toBeDefined();
      expect(result.email).toBe('tobs@gmail.com');
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw AppError when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        userService.findOne({ email: 'not.found@example.com' }, true),
      ).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const createDto = {
        first_name: 'Tobs',
        last_name: 'Dan',
        email: 'tobs@gmail.com',
        phone: '2348104075057',
        password: 'password123',
        role: UserRole.MENTOR,
      };

      const result = await userService.create(createDto);

      expect(result).toBeDefined();
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw AppError if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const createDto = {
        first_name: 'Tobs',
        last_name: 'Dan',
        email: 'tobs@gmail.com',
        phone: '2348104075057',
        password: 'password123',
        role: UserRole.MENTOR,
      };

      await expect(userService.create(createDto)).rejects.toThrow(AppError);
    });
  });
});
