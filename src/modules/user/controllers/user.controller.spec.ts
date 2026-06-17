import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

describe('UserController', () => {
  let controller: UserController;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  const MockUserService = {
    create: jest.fn().mockResolvedValue({
      id: 1,
      first_name: 'Tobs',
      last_name: 'Dan',
      phone: '08104075057',
      email: 'dan@gmail.com',
      role: ['admin'],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: MockUserService,
          res,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await controller.createUser({
      first_name: 'Tobs',
      last_name: 'Dan',
      phone: '08104075057',
      email: 'dan@gmail.com',
      role: ['admin'],
    });

    expect(result).toEqual({
      id: expect.any,
      first_name: 'Tobs',
      last_name: 'Dan',
      phone: '08104075057',
      email: 'dan@gmail.com',
      role: ['admin'],
    });
  });
});
