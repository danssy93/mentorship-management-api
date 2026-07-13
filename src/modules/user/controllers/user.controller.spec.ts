import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserRole } from 'src/database/entities/users.entity';

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

const mockUserService = {
  create: jest.fn(),
  findOneBy: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneBy', () => {
    it('should return a user when found', async () => {
      mockUserService.findOneBy.mockResolvedValue(mockUser);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getUserByRole(UserRole.MENTOR, res as any);

      expect(mockUserService.findOneBy).toHaveBeenCalledWith({
        role: UserRole.MENTOR,
      });

      expect(res.status).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User fetched successfully',
          data: mockUser,
        }),
      );
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      mockUserService.create.mockResolvedValue(mockUser);

      const createDto = {
        first_name: 'Tobs',
        last_name: 'Dan',
        email: 'tobs@gmail.com',
        phone: '2348104075057',
        password: 'password123',
        role: UserRole.MENTOR,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.createUser(createDto, res as any);

      expect(mockUserService.create).toHaveBeenCalledWith(createDto);
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User created successfully',
          data: mockUser,
        }),
      );
    });
  });
});
