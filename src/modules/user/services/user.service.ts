import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/database/repositories';
import { User } from 'src/database/entities';
import { GenericObjectType } from 'src/common/interfaces';
import { FindOptionsWhere, QueryRunner } from 'typeorm';
import AppError from 'src/common/errors/AppError';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async create(user: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      email: user.email,
      phone: user.phone
    })
    if (existingUser) {
      throw new AppError('User already exists', HttpStatus.CONFLICT);
    }
    
    return await this.userRepository.create(user);
  }

  async findOneBy(query: GenericObjectType): Promise<User | null> {
    return await this.userRepository.findOne(query);
  }

  async findOne(
    query: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    throwError = true,
    options?: any,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne(query, options);

    if (!existingUser && throwError) {
      throw new AppError('User record not found', HttpStatus.NOT_FOUND);
    }
    return existingUser as User;
  }

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(
    queryObject: GenericObjectType,
    data: Partial<User>,
    queryRunner?: QueryRunner,
  ): Promise<User> {
    const updateUser = await this.userRepository.update(
      queryObject,
      data,
      queryRunner,
    );

    if (!updateUser) {
      throw new AppError(
        'User not found or update failed',
        HttpStatus.NOT_FOUND,
      );
    }
    return updateUser;
  }

  async save(data: Partial<User>): Promise<User> {
    return await this.userRepository.save(data);
  }
}
