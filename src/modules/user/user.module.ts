import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserRepository } from 'src/database/repositories';

@Module({
  imports: [DatabaseModule.forFeature()],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
