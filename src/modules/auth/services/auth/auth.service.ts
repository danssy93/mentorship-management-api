import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import AppError from 'src/common/errors/AppError';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ICurrentUserDetails, User, UserRole } from 'src/database/entities';
import { UserService } from 'src/modules/user/services/user.service';
import { LoginDto } from '../../dtos/login.dto';
import { In } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    console.log('ALL ENV:', process.env.ACCESS_SECRET);
  }

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

    const accessToken = await this.generateAccessToken(existingUser);
    const refreshToken = await this.generateRefreshToken(existingUser);

    if (!existingUser.id) {
      throw new AppError('User ID is missing', HttpStatus.NOT_FOUND);
    }

    const payload = {
      ...existingUser.toPayload(),
      accessToken: accessToken.access_token,
      refreshToken: refreshToken.refresh_token,
    };

    await this.userService.update(
      { id: existingUser.id },
      { refresh_token: refreshToken.refresh_token },
    );

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: payload,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userService.update({ id: userId }, { refresh_token: null });
  }

  async generateAccessToken(payload: Partial<User>) {
    const data = {
      sub: payload.id,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };

    const options: JwtSignOptions = {
      secret: process.env.ACCESS_SECRET,
      expiresIn: (process.env.ACCESS_EXPIRY_TIME || '1d') as any,
    };

    const accessToken = await this.jwtService.signAsync(data, options);

    return {
      type: 'Bearer',
      access_token: accessToken,
      expiresIn: process.env.ACCESS_EXPIRY_TIME || '1d',
    };
  }

  async generateRefreshToken(payload: Partial<User>) {
    const data = {
      sub: payload.id,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };

    const options: JwtSignOptions = {
      secret: process.env.REFRESH_SECRET,
      expiresIn: (process.env.REFRESH_EXPIRY_TIME || '7d') as any,
    };

    const refreshToken = await this.jwtService.signAsync(data, options);
    return {
      type: 'Bearer',
      refresh_token: refreshToken,
      expiresIn: process.env.REFRESH_EXPIRY_TIME || '7d',
    };
  }
}
