import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import AppError from 'src/common/errors/AppError';
import { ICurrentUserDetails, UserRole } from 'src/database/entities';
import { UserService } from 'src/modules/user/services/user.service';
import { LoginDto } from '../../dtos/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

  async validateUser(userId: string): Promise<ICurrentUserDetails> {
    const existingUser = await this.userService.findOne({ id: userId }, false);
    if (!existingUser) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
    return existingUser;
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;
    const existingUser = await this.userService.findOne(
      [
        {
          email: identifier,
          role: In([UserRole.ADMIN, UserRole.MENTOR, UserRole.MENTEE]),
        },
        {
          phone: identifier,
          role: In([UserRole.ADMIN, UserRole.MENTOR, UserRole.MENTEE]),
        },
      ],
      true,
    );

    if (!existingUser) {
      throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const comparePassword = await existingUser.comparePassword(password);

    if (!comparePassword) {
      throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
