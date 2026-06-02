import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { BaseRepository } from './base.repository';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class UserRepository extends BaseRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
